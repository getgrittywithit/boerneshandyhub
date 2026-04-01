import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

const QUERY_TIMEOUT = 10000; // 10 second timeout

// Sanitize input to prevent SQL injection
function sanitizeKeyword(keyword: string): string {
  // Remove SQL special characters and escape single quotes
  return keyword
    .replace(/['"\\%;]/g, '') // Remove dangerous characters
    .replace(/\s+/g, ' ')     // Normalize whitespace
    .trim()
    .slice(0, 50);            // Limit length
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get('q');
  const category = searchParams.get('category');
  const limit = Math.min(parseInt(searchParams.get('limit') || '20'), 50); // Cap at 50

  if (!query) {
    return NextResponse.json({ error: 'Search query required' }, { status: 400 });
  }

  try {
    if (!supabase) {
      return NextResponse.json({ error: 'Database not available' }, { status: 500 });
    }

    // Split query into keywords and sanitize
    const searchKeywords = query
      .toLowerCase()
      .split(' ')
      .filter(k => k.length > 2)
      .map(sanitizeKeyword)
      .filter(k => k.length > 0)
      .slice(0, 5); // Limit to 5 keywords max

    if (searchKeywords.length === 0) {
      return NextResponse.json({
        results: [],
        totalCount: 0,
        query: query
      });
    }

    // Set up timeout with AbortController
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), QUERY_TIMEOUT);

    // Build safe OR conditions using Supabase's filter syntax
    // Format: "column.ilike.%value%,column2.ilike.%value%"
    const orConditions = searchKeywords.map(keyword => {
      const safeKeyword = keyword.replace(/%/g, ''); // Extra safety for LIKE patterns
      return `name.ilike.%${safeKeyword}%,description.ilike.%${safeKeyword}%`;
    }).join(',');

    let supabaseQuery = supabase
      .from('businesses')
      .select('id, name, description, category, subcategories, phone, email, website, address, city, rating, review_count, membership_tier, keywords, photos, services, service_area, insured, bonded, years_in_business')
      .abortSignal(controller.signal)
      .limit(limit);

    // Add category filter if specified
    if (category && category !== 'all') {
      supabaseQuery = supabaseQuery.eq('category', category);
    }

    // Apply search filter
    supabaseQuery = supabaseQuery.or(orConditions);

    // Order by membership tier (premium listings first), then rating
    supabaseQuery = supabaseQuery
      .order('membership_tier', { ascending: false })
      .order('rating', { ascending: false });

    const { data: businesses, error } = await supabaseQuery;
    clearTimeout(timeoutId);

    if (error) {
      if (error.message?.includes('aborted')) {
        return NextResponse.json(
          { error: 'Search request timed out' },
          { status: 504 }
        );
      }
      throw error;
    }

    // Score results based on keyword matches and membership tier
    const scoredResults = businesses?.map(business => {
      let score = 0;
      const businessKeywords: string[] = business.keywords || [];
      const nameLower = business.name?.toLowerCase() || '';
      const descLower = business.description?.toLowerCase() || '';

      // Score based on keyword matches
      for (const keyword of searchKeywords) {
        if (businessKeywords.some(bk => bk.toLowerCase() === keyword)) score += 3;
        if (nameLower.includes(keyword)) score += 2;
        if (descLower.includes(keyword)) score += 1;
      }

      // Boost score based on membership tier
      const tierBoost: Record<string, number> = {
        'elite': 20,
        'premium': 15,
        'verified': 10,
        'basic': 0
      };
      score += tierBoost[business.membership_tier] || 0;

      return { ...business, searchScore: score };
    }).sort((a, b) => b.searchScore - a.searchScore) || [];

    return NextResponse.json({
      results: scoredResults,
      totalCount: scoredResults.length,
      query: query
    });
  } catch (error) {
    console.error('Search error:', error);

    // Check for abort/timeout
    if (error instanceof Error && error.name === 'AbortError') {
      return NextResponse.json(
        { error: 'Search request timed out' },
        { status: 504 }
      );
    }

    return NextResponse.json({ error: 'Search failed' }, { status: 500 });
  }
}
