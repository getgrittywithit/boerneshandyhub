import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

// Track a packet analytics event
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      packet_id,
      event_type,
      target_id,
      target_name,
      target_category,
      session_id,
    } = body;

    if (!packet_id || !event_type) {
      return NextResponse.json(
        { error: 'packet_id and event_type are required' },
        { status: 400 }
      );
    }

    const validEventTypes = [
      'view', 'provider_click', 'guide_click',
      'phone_click', 'website_click', 'email_click',
      'home_tracker_click', 'resource_click'
    ];

    if (!validEventTypes.includes(event_type)) {
      return NextResponse.json(
        { error: 'Invalid event_type' },
        { status: 400 }
      );
    }

    // Use service role for inserting analytics
    if (!supabaseServiceKey) {
      // In development, just log and return success
      console.log('Packet analytics (no Supabase):', { packet_id, event_type, target_id });
      return NextResponse.json({ success: true });
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    const userAgent = request.headers.get('user-agent') || '';
    const referrer = request.headers.get('referer') || '';

    const { error } = await supabase
      .from('packet_analytics')
      .insert({
        packet_id,
        event_type,
        target_id,
        target_name,
        target_category,
        session_id,
        user_agent: userAgent,
        referrer,
      });

    if (error) {
      console.error('Error tracking packet analytics:', error);
      return NextResponse.json({ error: 'Failed to track event' }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error in packet tracking:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
