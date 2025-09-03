import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

// Get business keywords
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const businessId = searchParams.get('businessId');

  if (!businessId) {
    return NextResponse.json({ error: 'Business ID required' }, { status: 400 });
  }

  try {
    const { data: business, error } = await supabase
      .from('businesses')
      .select('keywords, membership_tier')
      .eq('id', businessId)
      .single();

    if (error) throw error;

    return NextResponse.json({
      keywords: business.keywords || [],
      membershipTier: business.membership_tier,
      maxKeywords: getKeywordLimit(business.membership_tier)
    });
  } catch {
    return NextResponse.json({ error: 'Failed to fetch keywords' }, { status: 500 });
  }
}

// Update business keywords
export async function PUT(request: NextRequest) {
  const { businessId, keywords } = await request.json();

  if (!businessId || !Array.isArray(keywords)) {
    return NextResponse.json({ error: 'Invalid data' }, { status: 400 });
  }

  try {
    // Get business membership tier to check limits
    const { data: business, error: fetchError } = await supabase
      .from('businesses')
      .select('membership_tier, owner_id')
      .eq('id', businessId)
      .single();

    if (fetchError) throw fetchError;

    // Check keyword limit based on membership tier
    const maxKeywords = getKeywordLimit(business.membership_tier);
    if (keywords.length > maxKeywords) {
      return NextResponse.json(
        { error: `${business.membership_tier} tier allows maximum ${maxKeywords} keywords` },
        { status: 400 }
      );
    }

    // Update keywords
    const { error: updateError } = await supabase
      .from('businesses')
      .update({ keywords: keywords })
      .eq('id', businessId);

    if (updateError) throw updateError;

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: 'Failed to update keywords' }, { status: 500 });
  }
}

// Keyword limits by membership tier
function getKeywordLimit(tier: string): number {
  switch (tier) {
    case 'basic': return 0;
    case 'verified': return 5;
    case 'premium': return 15;
    case 'elite': return 30;
    default: return 0;
  }
}