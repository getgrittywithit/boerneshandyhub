import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

// Valid event types
const validEventTypes = [
  'profile_view',
  'search_impression',
  'search_click',
  'phone_click',
  'website_click',
  'quote_request',
] as const;

type EventType = typeof validEventTypes[number];

interface TrackEventRequest {
  business_id: string;
  event_type: EventType;
  source?: string;
  search_query?: string;
  referrer?: string;
  session_id?: string;
}

// Generate a simple session ID for anonymous tracking
function generateSessionId(): string {
  return Math.random().toString(36).substring(2, 15);
}

export async function POST(request: NextRequest) {
  try {
    const body: TrackEventRequest = await request.json();

    // Validate required fields
    if (!body.business_id) {
      return NextResponse.json({ error: 'business_id is required' }, { status: 400 });
    }

    if (!body.event_type || !validEventTypes.includes(body.event_type)) {
      return NextResponse.json(
        { error: `event_type must be one of: ${validEventTypes.join(', ')}` },
        { status: 400 }
      );
    }

    // Skip tracking if Supabase isn't configured (dev mode)
    if (!supabase) {
      return NextResponse.json({ success: true, tracked: false, reason: 'database_not_configured' });
    }

    // Get user agent from request
    const userAgent = request.headers.get('user-agent') || undefined;

    // Get or generate session ID
    const sessionId = body.session_id || generateSessionId();

    // Insert the event
    const { error } = await supabase.from('business_analytics').insert({
      business_id: body.business_id,
      event_type: body.event_type,
      source: body.source,
      search_query: body.search_query,
      referrer: body.referrer,
      session_id: sessionId,
      user_agent: userAgent,
    });

    if (error) {
      console.error('Error tracking event:', error);
      // Don't fail the request, just log
      return NextResponse.json({ success: true, tracked: false, error: error.message });
    }

    return NextResponse.json({ success: true, tracked: true, session_id: sessionId });
  } catch (error) {
    console.error('Track event error:', error);
    return NextResponse.json({ success: false, error: 'Internal error' }, { status: 500 });
  }
}

// Batch tracking for multiple impressions (e.g., search results)
export async function PUT(request: NextRequest) {
  try {
    const body: { events: TrackEventRequest[] } = await request.json();

    if (!body.events || !Array.isArray(body.events)) {
      return NextResponse.json({ error: 'events array is required' }, { status: 400 });
    }

    if (body.events.length > 50) {
      return NextResponse.json({ error: 'Maximum 50 events per batch' }, { status: 400 });
    }

    if (!supabase) {
      return NextResponse.json({ success: true, tracked: 0, reason: 'database_not_configured' });
    }

    const userAgent = request.headers.get('user-agent') || undefined;
    const sessionId = generateSessionId();

    // Validate and prepare events
    const validEvents = body.events
      .filter(e => e.business_id && validEventTypes.includes(e.event_type))
      .map(e => ({
        business_id: e.business_id,
        event_type: e.event_type,
        source: e.source,
        search_query: e.search_query,
        referrer: e.referrer,
        session_id: e.session_id || sessionId,
        user_agent: userAgent,
      }));

    if (validEvents.length === 0) {
      return NextResponse.json({ success: true, tracked: 0 });
    }

    const { error } = await supabase.from('business_analytics').insert(validEvents);

    if (error) {
      console.error('Error batch tracking:', error);
      return NextResponse.json({ success: true, tracked: 0, error: error.message });
    }

    return NextResponse.json({ success: true, tracked: validEvents.length, session_id: sessionId });
  } catch (error) {
    console.error('Batch track error:', error);
    return NextResponse.json({ success: false, error: 'Internal error' }, { status: 500 });
  }
}
