-- Search Analytics Tables
-- Run this in Supabase SQL Editor

-- ============================================================================
-- SEARCH QUERIES TABLE
-- ============================================================================
CREATE TABLE IF NOT EXISTS search_queries (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  query TEXT NOT NULL,
  scope JSONB,
  result_counts JSONB NOT NULL,
  took_ms INTEGER,
  user_session TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Index for time-based queries
CREATE INDEX IF NOT EXISTS search_queries_created_idx
  ON search_queries(created_at DESC);

-- Index for query text (for finding common queries)
CREATE INDEX IF NOT EXISTS search_queries_query_idx
  ON search_queries(query);

-- ============================================================================
-- SEARCH CLICKS TABLE
-- ============================================================================
CREATE TABLE IF NOT EXISTS search_clicks (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  query_id UUID REFERENCES search_queries(id) ON DELETE CASCADE,
  result_id UUID REFERENCES search_documents(id) ON DELETE SET NULL,
  position INTEGER NOT NULL,
  source_type search_source NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Index for query lookups
CREATE INDEX IF NOT EXISTS search_clicks_query_idx
  ON search_clicks(query_id);

-- Index for result lookups
CREATE INDEX IF NOT EXISTS search_clicks_result_idx
  ON search_clicks(result_id);

-- Index for time-based queries
CREATE INDEX IF NOT EXISTS search_clicks_created_idx
  ON search_clicks(created_at DESC);

-- ============================================================================
-- ANALYTICS VIEW: Top Queries
-- ============================================================================
CREATE OR REPLACE VIEW search_top_queries AS
SELECT
  query,
  COUNT(*) as search_count,
  AVG((result_counts->>'total')::INTEGER) as avg_results,
  COUNT(CASE WHEN (result_counts->>'total')::INTEGER = 0 THEN 1 END) as zero_result_count,
  MAX(created_at) as last_searched
FROM search_queries
WHERE created_at > NOW() - INTERVAL '30 days'
GROUP BY query
ORDER BY search_count DESC;

-- ============================================================================
-- ANALYTICS VIEW: Click-Through Rate by Source
-- ============================================================================
CREATE OR REPLACE VIEW search_ctr_by_source AS
WITH query_counts AS (
  SELECT
    id as query_id,
    (scope->>'source_type')::text as source_type,
    created_at
  FROM search_queries
  WHERE created_at > NOW() - INTERVAL '30 days'
),
click_counts AS (
  SELECT
    source_type,
    COUNT(*) as clicks
  FROM search_clicks
  WHERE created_at > NOW() - INTERVAL '30 days'
  GROUP BY source_type
)
SELECT
  COALESCE(cc.source_type, 'all') as source_type,
  COALESCE(cc.clicks, 0) as total_clicks,
  (SELECT COUNT(*) FROM search_queries WHERE created_at > NOW() - INTERVAL '30 days') as total_queries,
  ROUND(
    COALESCE(cc.clicks, 0)::NUMERIC /
    NULLIF((SELECT COUNT(*) FROM search_queries WHERE created_at > NOW() - INTERVAL '30 days'), 0) * 100,
    2
  ) as ctr_percent
FROM click_counts cc;

-- ============================================================================
-- ANALYTICS VIEW: Average Click Position by Tier
-- ============================================================================
CREATE OR REPLACE VIEW search_click_position_by_tier AS
SELECT
  sd.tier,
  COUNT(*) as click_count,
  ROUND(AVG(sc.position), 2) as avg_position
FROM search_clicks sc
JOIN search_documents sd ON sc.result_id = sd.id
WHERE sc.created_at > NOW() - INTERVAL '30 days'
GROUP BY sd.tier
ORDER BY avg_position;

-- ============================================================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================================================

-- Enable RLS
ALTER TABLE search_queries ENABLE ROW LEVEL SECURITY;
ALTER TABLE search_clicks ENABLE ROW LEVEL SECURITY;

-- Search queries: Service role can insert (for API), admins can read
CREATE POLICY "Service role can insert queries" ON search_queries
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Admins can view search queries" ON search_queries
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );

-- Search clicks: Service role can insert (for API), admins can read
CREATE POLICY "Service role can insert clicks" ON search_clicks
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Admins can view search clicks" ON search_clicks
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );
