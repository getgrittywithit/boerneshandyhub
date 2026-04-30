# Site-Wide AI Search Specification

**Version:** 1.0
**Status:** Implementation

## Overview

A unified search experience for BoernesHandyHub.com that combines keyword matching with semantic AI search to help users find businesses, services, realtors, and content across the site.

## Features

### Core Search (Phase 1)
- **Hybrid Search**: Combines PostgreSQL full-text search (tsvector) with OpenAI embeddings for semantic relevance
- **Multi-source Results**: Searches across businesses, categories, realtors, and static pages
- **Tier Boost**: Premium listings rank higher for equal relevance
- **Cmd/Ctrl+K**: Global keyboard shortcut to open search
- **Zero-result CTA**: "Suggest a business" form when no results found

### Category Scoped Search (Phase 2)
- **Sticky Search Bar**: On category pages, search is scoped to that category
- **Escape Hatch**: "Search all of BoernesHandyHub" link to expand scope

### Analytics (Phase 3)
- **Query Logging**: Track search terms, result counts, timing
- **Click Tracking**: Monitor which results users select
- **Admin Dashboard**: View top queries, zero-results, CTR by group

## Architecture

### Database Schema

```sql
-- Search source types
create type search_source as enum ('business', 'category', 'realtor', 'page');

-- Denormalized search index
create table search_documents (
  id uuid primary key default gen_random_uuid(),
  source_type search_source not null,
  source_id text not null,
  title text not null,
  subtitle text,
  description text,
  url text not null,
  keywords text[] default '{}',
  tier text,
  boost real not null default 1.0,
  category_slug text,
  subcategory_slug text,
  embedding vector(1536),  -- OpenAI text-embedding-3-small
  tsv tsvector generated always as (...) stored,
  is_active boolean not null default true,
  updated_at timestamptz not null default now(),
  unique (source_type, source_id)
);

-- Vendor leads (suggest-a-business)
create table vendor_leads (
  id uuid primary key default gen_random_uuid(),
  query text,
  suggested_name text,
  contact_email text,
  contact_phone text,
  notes text,
  created_at timestamptz not null default now()
);
```

### API Endpoints

- `GET /api/search` - Main search endpoint with hybrid ranking
- `POST /api/search/sync` - Admin-only endpoint to rebuild index
- `POST /api/search/track` - Log clicks for analytics

### Embedding Provider

- **Model**: OpenAI `text-embedding-3-small` (1536 dimensions)
- **Cost**: ~$0.02/1M tokens (~$0.02 bootstrap, <$0.10/month steady state)

## Tier Boost Values

```typescript
export const TIER_BOOST = {
  Partner: 1.50,
  VerifiedPlus: 1.20,
  Verified: 1.00,
  Claimed: 0.85,
  Unclaimed: 0.65,
  default: 1.00,
};
```

## Search Algorithm

1. **Query Processing**: Sanitize and embed user query
2. **Parallel Search**:
   - Full-text search using tsvector with ts_rank
   - Vector similarity using pgvector cosine distance
3. **Fusion**: Reciprocal Rank Fusion (RRF) to combine scores
4. **Boost Application**: Multiply by tier boost
5. **Grouping**: Organize results by source_type
6. **Return**: Grouped, ranked results with metadata

## UI Components

- `SearchBar` - Header input with search icon
- `SearchOverlay` - Modal with results, keyboard navigation
- `SearchResultGroup` - Section for each source type
- `SearchResultRow` - Individual result with icon, title, subtitle
- `SuggestBusinessForm` - CTA form for zero results
- `StickyCategorySearch` - Scoped search on category pages

## Keyboard Navigation

- `Cmd/Ctrl+K` - Open search overlay
- `Escape` - Close search overlay
- `Arrow Up/Down` - Navigate results
- `Enter` - Select result
- `Tab` - Move between result groups
