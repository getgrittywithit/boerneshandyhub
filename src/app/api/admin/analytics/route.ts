import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';

export async function GET() {
  if (!supabaseAdmin) {
    return NextResponse.json({ error: 'Database not configured' }, { status: 500 });
  }

  try {
    // Get date ranges
    const now = new Date();
    const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

    // Fetch all data in parallel
    const [
      businessesResult,
      subscribersResult,
      subscriberGrowthResult,
      searchQueriesResult,
      searchClicksResult,
      newsletterEventsResult,
      claimsResult,
    ] = await Promise.all([
      // Business counts by tier
      supabaseAdmin
        .from('businesses')
        .select('membership_tier, claim_status'),

      // Total subscribers
      supabaseAdmin
        .from('subscribers')
        .select('id, status, subscriber_type, subscribed_at')
        .eq('status', 'active'),

      // Subscriber growth (last 30 days)
      supabaseAdmin
        .from('subscribers')
        .select('subscribed_at')
        .gte('subscribed_at', thirtyDaysAgo.toISOString())
        .order('subscribed_at', { ascending: true }),

      // Top search queries (last 30 days)
      supabaseAdmin
        .from('search_queries')
        .select('query, result_counts, created_at')
        .gte('created_at', thirtyDaysAgo.toISOString())
        .order('created_at', { ascending: false })
        .limit(100),

      // Search clicks (last 30 days)
      supabaseAdmin
        .from('search_clicks')
        .select('id, created_at')
        .gte('created_at', thirtyDaysAgo.toISOString()),

      // Newsletter events
      supabaseAdmin
        .from('newsletter_events')
        .select('event_type, created_at')
        .gte('created_at', thirtyDaysAgo.toISOString()),

      // Pending claims
      supabaseAdmin
        .from('business_claims')
        .select('id, status')
        .eq('status', 'pending'),
    ]);

    // Process business stats
    const businesses = businessesResult.data || [];
    const businessStats = {
      total: businesses.length,
      elite: businesses.filter(b => b.membership_tier === 'elite').length,
      premium: businesses.filter(b => b.membership_tier === 'premium').length,
      verified: businesses.filter(b => b.membership_tier === 'verified').length,
      basic: businesses.filter(b => b.membership_tier === 'basic').length,
      unclaimed: businesses.filter(b => b.claim_status === 'unclaimed').length,
      pendingClaims: claimsResult.data?.length || 0,
    };

    // Process subscriber stats
    const subscribers = subscribersResult.data || [];
    const subscriberStats = {
      total: subscribers.length,
      homeowners: subscribers.filter(s => s.subscriber_type === 'homeowner').length,
      businesses: subscribers.filter(s => s.subscriber_type === 'business').length,
      realtors: subscribers.filter(s => s.subscriber_type === 'realtor').length,
    };

    // Process subscriber growth (group by day)
    const subscriberGrowth = (subscriberGrowthResult.data || []).reduce((acc: Record<string, number>, sub) => {
      const date = new Date(sub.subscribed_at).toISOString().split('T')[0];
      acc[date] = (acc[date] || 0) + 1;
      return acc;
    }, {});

    // Process search analytics
    const searchQueries = searchQueriesResult.data || [];
    const queryFrequency: Record<string, number> = {};
    searchQueries.forEach(sq => {
      const q = sq.query.toLowerCase().trim();
      queryFrequency[q] = (queryFrequency[q] || 0) + 1;
    });

    const topQueries = Object.entries(queryFrequency)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10)
      .map(([query, count]) => ({ query, count }));

    const searchStats = {
      totalQueries: searchQueries.length,
      totalClicks: searchClicksResult.data?.length || 0,
      clickThroughRate: searchQueries.length > 0
        ? ((searchClicksResult.data?.length || 0) / searchQueries.length * 100).toFixed(1)
        : '0',
      topQueries,
    };

    // Process newsletter stats
    const newsletterEvents = newsletterEventsResult.data || [];
    const newsletterStats = {
      sent: newsletterEvents.filter(e => e.event_type === 'sent').length,
      delivered: newsletterEvents.filter(e => e.event_type === 'delivered').length,
      opened: newsletterEvents.filter(e => e.event_type === 'opened').length,
      clicked: newsletterEvents.filter(e => e.event_type === 'clicked').length,
      bounced: newsletterEvents.filter(e => e.event_type === 'bounced').length,
      deliveryRate: newsletterEvents.filter(e => e.event_type === 'sent').length > 0
        ? (newsletterEvents.filter(e => e.event_type === 'delivered').length /
           newsletterEvents.filter(e => e.event_type === 'sent').length * 100).toFixed(1)
        : '0',
      openRate: newsletterEvents.filter(e => e.event_type === 'delivered').length > 0
        ? (newsletterEvents.filter(e => e.event_type === 'opened').length /
           newsletterEvents.filter(e => e.event_type === 'delivered').length * 100).toFixed(1)
        : '0',
    };

    return NextResponse.json({
      businessStats,
      subscriberStats,
      subscriberGrowth,
      searchStats,
      newsletterStats,
      lastUpdated: now.toISOString(),
    });
  } catch (error) {
    console.error('Analytics error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch analytics' },
      { status: 500 }
    );
  }
}
