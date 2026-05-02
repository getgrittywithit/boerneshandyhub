import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const supabase = createClient(supabaseUrl, supabaseServiceKey);

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const tab = searchParams.get('tab') || 'queue';
    const filter = searchParams.get('filter') || 'all';

    let query = supabase
      .from('contributions')
      .select(`
        *,
        contributor:contributors(*),
        assets:contribution_assets(*)
      `)
      .order('created_at', { ascending: false });

    // Apply tab-specific filters
    switch (tab) {
      case 'queue':
        // Show items pending admin review
        query = query.in('status', ['admin_pending', 'ai_flag', 'ai_clear']);
        break;
      case 'decisions':
        // Show recently approved/rejected
        query = query.in('status', ['approved', 'rejected', 'published']);
        query = query.limit(50);
        break;
      case 'contributors':
        // For contributors tab, we return contributor data instead
        const { data: contributors, error: contribError } = await supabase
          .from('contributors')
          .select('*')
          .order('approved_count', { ascending: false })
          .limit(100);

        if (contribError) {
          console.error('Error fetching contributors:', contribError);
          return NextResponse.json({ items: [] });
        }

        return NextResponse.json({ items: contributors || [] });
    }

    // Apply AI verdict filter for queue tab
    if (tab === 'queue' && filter !== 'all') {
      query = query.eq('status', filter);
    }

    const { data: items, error } = await query;

    if (error) {
      console.error('Error fetching queue:', error);
      return NextResponse.json({ items: [] });
    }

    return NextResponse.json({ items: items || [] });
  } catch (error) {
    console.error('Queue error:', error);
    return NextResponse.json({ items: [] });
  }
}
