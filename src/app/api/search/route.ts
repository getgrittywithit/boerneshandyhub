import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';
import OpenAI from 'openai';
import type { SearchSource, SearchResultGroup, SearchResponse } from '@/lib/search/types';
import { SOURCE_CONFIG } from '@/lib/search/types';
import { getSearchSessionId } from '@/lib/search/client';

const QUERY_TIMEOUT = 10000; // 10 second timeout
const EMBEDDING_MODEL = 'text-embedding-3-small';

// Initialize OpenAI client
const openai = process.env.OPENAI_API_KEY
  ? new OpenAI({ apiKey: process.env.OPENAI_API_KEY })
  : null;

// Sanitize input to prevent SQL injection
function sanitizeKeyword(keyword: string): string {
  return keyword
    .replace(/['"\\%;]/g, '')
    .replace(/\s+/g, ' ')
    .trim()
    .slice(0, 50);
}

// Generate embedding for query
async function getQueryEmbedding(query: string): Promise<number[] | null> {
  if (!openai) return null;

  try {
    const response = await openai.embeddings.create({
      model: EMBEDDING_MODEL,
      input: query,
    });
    return response.data[0].embedding;
  } catch (error) {
    console.error('Failed to generate embedding:', error);
    return null;
  }
}

// Group results by source type
function groupResults(
  results: Array<{
    id: string;
    source_type: SearchSource;
    source_id: string;
    title: string;
    subtitle: string | null;
    description: string | null;
    url: string;
    keywords: string[];
    tier: string | null;
    boost: number;
    category_slug: string | null;
    subcategory_slug: string | null;
    text_rank: number;
    vector_similarity: number;
    combined_score: number;
  }>
): SearchResultGroup[] {
  const groups: Map<SearchSource, SearchResultGroup> = new Map();

  // Initialize groups in priority order
  const sourceTypes: SearchSource[] = ['business', 'category', 'realtor', 'page'];
  for (const sourceType of sourceTypes) {
    const config = SOURCE_CONFIG[sourceType];
    groups.set(sourceType, {
      source_type: sourceType,
      label: config.label,
      icon: config.icon,
      results: [],
      count: 0,
    });
  }

  // Distribute results to groups
  for (const result of results) {
    const group = groups.get(result.source_type);
    if (group) {
      group.results.push(result);
      group.count++;
    }
  }

  // Return non-empty groups sorted by priority
  return Array.from(groups.values())
    .filter((g) => g.count > 0)
    .sort((a, b) => SOURCE_CONFIG[a.source_type].priority - SOURCE_CONFIG[b.source_type].priority);
}

export async function GET(request: NextRequest) {
  const startTime = Date.now();
  const { searchParams } = new URL(request.url);

  const query = searchParams.get('q');
  const category = searchParams.get('category');
  const subcategory = searchParams.get('subcategory');
  const limit = Math.min(parseInt(searchParams.get('limit') || '20'), 50);

  if (!query) {
    return NextResponse.json({ error: 'Search query required' }, { status: 400 });
  }

  try {
    if (!supabaseAdmin) {
      return NextResponse.json({ error: 'Database not available' }, { status: 500 });
    }

    // Sanitize query
    const sanitizedQuery = sanitizeKeyword(query);
    if (sanitizedQuery.length < 2) {
      return NextResponse.json({
        groups: [],
        total: 0,
        query: query,
        took_ms: Date.now() - startTime,
      } as SearchResponse);
    }

    // Set up timeout
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), QUERY_TIMEOUT);

    // Generate embedding for semantic search (parallel with DB check)
    const [embedding, tableCheck] = await Promise.all([
      getQueryEmbedding(sanitizedQuery),
      supabaseAdmin
        .from('search_documents')
        .select('id')
        .limit(1)
        .abortSignal(controller.signal),
    ]);

    // Check if search_documents table has data
    const hasSearchDocuments = tableCheck.data && tableCheck.data.length > 0;

    let results: Array<{
      id: string;
      source_type: SearchSource;
      source_id: string;
      title: string;
      subtitle: string | null;
      description: string | null;
      url: string;
      keywords: string[];
      tier: string | null;
      boost: number;
      category_slug: string | null;
      subcategory_slug: string | null;
      text_rank: number;
      vector_similarity: number;
      combined_score: number;
    }> = [];

    if (hasSearchDocuments && embedding) {
      // Use hybrid search via RPC function
      const { data, error } = await supabaseAdmin
        .rpc('search_documents_hybrid', {
          query_text: sanitizedQuery,
          query_embedding: embedding,
          scope_category: category || null,
          scope_subcategory: subcategory || null,
          match_limit: limit,
        })
        .abortSignal(controller.signal);

      if (error) {
        console.error('Hybrid search error:', error);
        // Fall back to simple text search
      } else if (data) {
        results = data;
      }
    }

    // If no hybrid results, fall back to business table search
    if (results.length === 0) {
      // Use the original business search logic as fallback
      const searchKeywords = sanitizedQuery
        .toLowerCase()
        .split(' ')
        .filter((k) => k.length > 2)
        .slice(0, 5);

      if (searchKeywords.length > 0) {
        const orConditions = searchKeywords
          .map((keyword) => {
            const safeKeyword = keyword.replace(/%/g, '');
            return `name.ilike.%${safeKeyword}%,description.ilike.%${safeKeyword}%`;
          })
          .join(',');

        let businessQuery = supabaseAdmin
          .from('businesses')
          .select(
            'id, name, description, category, subcategory, phone, email, website, address, city, rating, review_count, membership_tier, keywords'
          )
          .abortSignal(controller.signal)
          .limit(limit);

        if (category && category !== 'all') {
          businessQuery = businessQuery.eq('category', category);
        }

        businessQuery = businessQuery.or(orConditions);
        businessQuery = businessQuery
          .order('membership_tier', { ascending: false })
          .order('rating', { ascending: false });

        const { data: businesses, error: businessError } = await businessQuery;

        if (!businessError && businesses) {
          // Convert to search document format
          results = businesses.map((b) => ({
            id: b.id,
            source_type: 'business' as SearchSource,
            source_id: b.id,
            title: b.name,
            subtitle: b.category || null,
            description: b.description || null,
            url: `/services/${b.category?.toLowerCase() || 'all'}/${b.subcategory || 'all'}/${b.id}`,
            keywords: b.keywords || [],
            tier: b.membership_tier,
            boost: 1.0,
            category_slug: b.category?.toLowerCase() || null,
            subcategory_slug: b.subcategory || null,
            text_rank: 1.0,
            vector_similarity: 0,
            combined_score: 1.0,
          }));
        }
      }
    }

    clearTimeout(timeoutId);

    // Group results
    const groups = groupResults(results);
    const total = results.length;

    // Log query for analytics (async, don't wait)
    const resultCounts: Record<string, number> = {};
    for (const group of groups) {
      resultCounts[group.source_type] = group.count;
    }
    resultCounts.total = total;

    let queryId: string | undefined;
    try {
      const { data: queryLog } = await supabaseAdmin
        .from('search_queries')
        .insert({
          query: sanitizedQuery,
          scope: category || subcategory ? { category, subcategory } : null,
          result_counts: resultCounts,
          took_ms: Date.now() - startTime,
        })
        .select('id')
        .single();
      queryId = queryLog?.id;
    } catch {
      // Silently fail analytics logging
    }

    const response: SearchResponse = {
      groups,
      total,
      query: query,
      took_ms: Date.now() - startTime,
      query_id: queryId,
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error('Search error:', error);

    if (error instanceof Error && error.name === 'AbortError') {
      return NextResponse.json({ error: 'Search request timed out' }, { status: 504 });
    }

    return NextResponse.json({ error: 'Search failed' }, { status: 500 });
  }
}
