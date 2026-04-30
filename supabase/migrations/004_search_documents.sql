-- Search Documents Table for AI-Powered Site Search
-- Run this in Supabase SQL Editor

-- ============================================================================
-- EXTENSIONS
-- ============================================================================
CREATE EXTENSION IF NOT EXISTS vector;
CREATE EXTENSION IF NOT EXISTS pg_trgm;

-- ============================================================================
-- SEARCH SOURCE ENUM
-- ============================================================================
DO $$ BEGIN
  CREATE TYPE search_source AS ENUM ('business', 'category', 'realtor', 'page');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- ============================================================================
-- SEARCH DOCUMENTS TABLE (Denormalized Search Index)
-- ============================================================================
CREATE TABLE IF NOT EXISTS search_documents (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  source_type search_source NOT NULL,
  source_id TEXT NOT NULL,
  title TEXT NOT NULL,
  subtitle TEXT,
  description TEXT,
  url TEXT NOT NULL,
  keywords TEXT[] DEFAULT '{}',
  tier TEXT,
  boost REAL NOT NULL DEFAULT 1.0,
  category_slug TEXT,
  subcategory_slug TEXT,
  embedding vector(1536),
  tsv TSVECTOR GENERATED ALWAYS AS (
    setweight(to_tsvector('english', COALESCE(title, '')), 'A') ||
    setweight(to_tsvector('english', COALESCE(subtitle, '')), 'B') ||
    setweight(to_tsvector('english', array_to_string(keywords, ' ')), 'B') ||
    setweight(to_tsvector('english', COALESCE(description, '')), 'C')
  ) STORED,
  is_active BOOLEAN NOT NULL DEFAULT true,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (source_type, source_id)
);

-- ============================================================================
-- INDEXES
-- ============================================================================

-- Full-text search index
CREATE INDEX IF NOT EXISTS search_documents_tsv_idx
  ON search_documents USING gin(tsv);

-- Vector similarity index (IVFFlat for approximate nearest neighbor)
CREATE INDEX IF NOT EXISTS search_documents_embedding_idx
  ON search_documents USING ivfflat (embedding vector_cosine_ops)
  WITH (lists = 100);

-- Scope filtering index
CREATE INDEX IF NOT EXISTS search_documents_scope_idx
  ON search_documents (source_type, category_slug);

-- Active documents index
CREATE INDEX IF NOT EXISTS search_documents_active_idx
  ON search_documents (is_active)
  WHERE is_active = true;

-- Trigram index for fuzzy matching
CREATE INDEX IF NOT EXISTS search_documents_title_trgm_idx
  ON search_documents USING gin(title gin_trgm_ops);

-- ============================================================================
-- VENDOR LEADS TABLE (Suggest-a-Business)
-- ============================================================================
CREATE TABLE IF NOT EXISTS vendor_leads (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  query TEXT,
  suggested_name TEXT,
  contact_email TEXT,
  contact_phone TEXT,
  notes TEXT,
  status TEXT NOT NULL DEFAULT 'new' CHECK (status IN ('new', 'contacted', 'added', 'dismissed')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Index for status filtering
CREATE INDEX IF NOT EXISTS idx_vendor_leads_status ON vendor_leads(status);
CREATE INDEX IF NOT EXISTS idx_vendor_leads_created ON vendor_leads(created_at DESC);

-- ============================================================================
-- RPC FUNCTION: Hybrid Search
-- ============================================================================
CREATE OR REPLACE FUNCTION search_documents_hybrid(
  query_text TEXT,
  query_embedding vector(1536),
  scope_category TEXT DEFAULT NULL,
  scope_subcategory TEXT DEFAULT NULL,
  match_limit INTEGER DEFAULT 20
)
RETURNS TABLE (
  id UUID,
  source_type search_source,
  source_id TEXT,
  title TEXT,
  subtitle TEXT,
  description TEXT,
  url TEXT,
  keywords TEXT[],
  tier TEXT,
  boost REAL,
  category_slug TEXT,
  subcategory_slug TEXT,
  text_rank REAL,
  vector_similarity REAL,
  combined_score REAL
)
LANGUAGE plpgsql
AS $$
DECLARE
  query_tsquery tsquery;
BEGIN
  -- Convert query to tsquery
  query_tsquery := plainto_tsquery('english', query_text);

  RETURN QUERY
  WITH text_results AS (
    SELECT
      sd.id,
      ts_rank(sd.tsv, query_tsquery) * sd.boost as score,
      ROW_NUMBER() OVER (ORDER BY ts_rank(sd.tsv, query_tsquery) * sd.boost DESC) as rank
    FROM search_documents sd
    WHERE sd.is_active = true
      AND sd.tsv @@ query_tsquery
      AND (scope_category IS NULL OR sd.category_slug = scope_category)
      AND (scope_subcategory IS NULL OR sd.subcategory_slug = scope_subcategory)
    ORDER BY score DESC
    LIMIT match_limit * 2
  ),
  vector_results AS (
    SELECT
      sd.id,
      (1 - (sd.embedding <=> query_embedding)) * sd.boost as score,
      ROW_NUMBER() OVER (ORDER BY (sd.embedding <=> query_embedding) ASC) as rank
    FROM search_documents sd
    WHERE sd.is_active = true
      AND sd.embedding IS NOT NULL
      AND (scope_category IS NULL OR sd.category_slug = scope_category)
      AND (scope_subcategory IS NULL OR sd.subcategory_slug = scope_subcategory)
    ORDER BY sd.embedding <=> query_embedding
    LIMIT match_limit * 2
  ),
  combined AS (
    SELECT
      COALESCE(tr.id, vr.id) as id,
      COALESCE(tr.score, 0) as text_score,
      tr.rank as text_rank,
      COALESCE(vr.score, 0) as vector_score,
      vr.rank as vector_rank,
      -- Reciprocal Rank Fusion formula: 1/(k + rank) where k = 60
      COALESCE(1.0 / (60 + tr.rank), 0) + COALESCE(1.0 / (60 + vr.rank), 0) as rrf_score
    FROM text_results tr
    FULL OUTER JOIN vector_results vr ON tr.id = vr.id
  )
  SELECT
    sd.id,
    sd.source_type,
    sd.source_id,
    sd.title,
    sd.subtitle,
    sd.description,
    sd.url,
    sd.keywords,
    sd.tier,
    sd.boost,
    sd.category_slug,
    sd.subcategory_slug,
    c.text_score::REAL as text_rank,
    c.vector_score::REAL as vector_similarity,
    (c.rrf_score * sd.boost)::REAL as combined_score
  FROM combined c
  JOIN search_documents sd ON sd.id = c.id
  ORDER BY c.rrf_score * sd.boost DESC
  LIMIT match_limit;
END;
$$;

-- ============================================================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================================================

-- Enable RLS on all tables
ALTER TABLE search_documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE vendor_leads ENABLE ROW LEVEL SECURITY;

-- Search documents: Anyone can read active documents
CREATE POLICY "Anyone can read active search documents" ON search_documents
  FOR SELECT USING (is_active = true);

-- Search documents: Admins can do everything
CREATE POLICY "Admins can manage search documents" ON search_documents
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );

-- Vendor leads: Anyone can insert (suggest a business)
CREATE POLICY "Anyone can suggest a business" ON vendor_leads
  FOR INSERT WITH CHECK (true);

-- Vendor leads: Admins can view and manage
CREATE POLICY "Admins can manage vendor leads" ON vendor_leads
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );

-- ============================================================================
-- UPDATED_AT TRIGGER
-- ============================================================================
CREATE TRIGGER update_search_documents_updated_at
  BEFORE UPDATE ON search_documents
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
