import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

// GET - Fetch website for a business
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const businessId = searchParams.get('business_id');

  if (!businessId) {
    return NextResponse.json({ error: 'Missing business_id' }, { status: 400 });
  }

  try {
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    const { data: website, error } = await supabase
      .from('websites')
      .select(`
        *,
        business:businesses(
          id,
          name,
          phone,
          email,
          address,
          city,
          state,
          zip
        )
      `)
      .eq('business_id', businessId)
      .single();

    if (error && error.code !== 'PGRST116') {
      console.error('Error fetching website:', error);
      return NextResponse.json({ error: 'Failed to fetch website' }, { status: 500 });
    }

    return NextResponse.json(website || null);
  } catch (error) {
    console.error('Error fetching website:', error);
    return NextResponse.json({ error: 'Failed to fetch website' }, { status: 500 });
  }
}
