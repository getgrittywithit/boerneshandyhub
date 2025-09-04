import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get('q');
  const category = searchParams.get('category');
  const limit = searchParams.get('limit') || '20';

  if (!query) {
    return NextResponse.json({ error: 'Search query required' }, { status: 400 });
  }

  try {
    if (!supabase) {
      return NextResponse.json({ error: 'Database not available' }, { status: 500 });
    }
    
    // Split query into keywords
    const searchKeywords = query.toLowerCase().split(' ').filter(k => k.length > 2);
    
    let supabaseQuery = supabase
      .from('businesses')
      .select('*')
      .limit(parseInt(limit));

    // Add category filter if specified
    if (category && category !== 'all') {
      supabaseQuery = supabaseQuery.eq('category', category);
    }

    // Search in keywords, name, and description
    const searchConditions = searchKeywords.map(keyword => 
      `keywords @> '["${keyword}"]' OR name ILIKE '%${keyword}%' OR description ILIKE '%${keyword}%'`
    ).join(' OR ');

    if (searchConditions) {
      supabaseQuery = supabaseQuery.or(searchConditions);
    }

    // Order by membership tier (premium listings first), then rating
    supabaseQuery = supabaseQuery.order('membership_tier', { ascending: false })
                                  .order('rating', { ascending: false });

    const { data: businesses, error } = await supabaseQuery;

    if (error) throw error;

    // Score results based on keyword matches and membership tier
    const scoredResults = businesses?.map(business => {
      let score = 0;
      const businessKeywords = business.keywords || [];

      // Score based on keyword matches
      searchKeywords.forEach(keyword => {
        if (businessKeywords.includes(keyword)) score += 3;
        if (business.name.toLowerCase().includes(keyword)) score += 2;
        if (business.description?.toLowerCase().includes(keyword)) score += 1;
      });

      // Boost score based on membership tier
      const tierBoost = {
        'elite': 20,
        'premium': 15,
        'verified': 10,
        'basic': 0
      };
      score += tierBoost[business.membership_tier as keyof typeof tierBoost] || 0;

      return { ...business, searchScore: score };
    }).sort((a, b) => b.searchScore - a.searchScore);

    return NextResponse.json({
      results: scoredResults || [],
      totalCount: scoredResults?.length || 0,
      query: query
    });
  } catch (error) {
    console.error('Search error:', error);
    return NextResponse.json({ error: 'Search failed' }, { status: 500 });
  }
}