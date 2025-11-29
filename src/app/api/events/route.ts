import { NextRequest, NextResponse } from 'next/server';
import { 
  getCurrentEvents, 
  getUpcomingEvents, 
  getFeaturedEvents,
  getThisWeekendEvents,
  generateEventContextForAI 
} from '@/data/currentEvents';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type') || 'current';
    const daysAhead = parseInt(searchParams.get('days') || '30');

    let events;
    
    switch (type) {
      case 'upcoming':
        events = getUpcomingEvents(daysAhead);
        break;
      case 'featured':
        events = getFeaturedEvents();
        break;
      case 'weekend':
        events = getThisWeekendEvents();
        break;
      case 'ai-context':
        // Special endpoint for AI context generation
        return NextResponse.json({ 
          context: generateEventContextForAI(),
          timestamp: new Date().toISOString()
        });
      case 'current':
      default:
        events = getCurrentEvents();
        break;
    }

    return NextResponse.json({
      events,
      count: events.length,
      type,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Events API error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch events' },
      { status: 500 }
    );
  }
}