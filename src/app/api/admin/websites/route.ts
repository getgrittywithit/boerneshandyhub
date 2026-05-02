import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

// GET - List websites for admin review
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const status = searchParams.get('status');

  try {
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    let query = supabase
      .from('websites')
      .select(`
        *,
        business:businesses(
          id,
          name,
          phone,
          email,
          membership_tier
        )
      `)
      .order('submitted_at', { ascending: false, nullsFirst: false });

    if (status && status !== 'all') {
      query = query.eq('status', status);
    }

    const { data: websites, error } = await query;

    if (error) {
      console.error('Error fetching websites:', error);
      return NextResponse.json({ error: 'Failed to fetch websites' }, { status: 500 });
    }

    return NextResponse.json(websites || []);
  } catch (error) {
    console.error('Error fetching websites:', error);
    return NextResponse.json({ error: 'Failed to fetch websites' }, { status: 500 });
  }
}
