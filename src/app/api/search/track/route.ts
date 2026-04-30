import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';
import type { SearchClick } from '@/lib/search/types';

export async function POST(request: NextRequest) {
  try {
    if (!supabaseAdmin) {
      return NextResponse.json({ error: 'Database not available' }, { status: 500 });
    }

    const body = await request.json() as SearchClick;

    // Validate required fields
    if (!body.query_id || !body.result_id || body.position === undefined || !body.source_type) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Insert click record
    const { error } = await supabaseAdmin.from('search_clicks').insert({
      query_id: body.query_id,
      result_id: body.result_id,
      position: body.position,
      source_type: body.source_type,
    });

    if (error) {
      // Don't fail the request for analytics errors, just log
      console.error('Click tracking error:', error);
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Track error:', error);
    // Return success even on error - tracking shouldn't block user flow
    return NextResponse.json({ success: true });
  }
}
