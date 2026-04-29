import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

interface DailyStats {
  event_date: string;
  profile_views: number;
  search_impressions: number;
  search_clicks: number;
  phone_clicks: number;
  website_clicks: number;
  quote_requests: number;
  click_through_rate: number;
}

interface AnalyticsSummary {
  period: string;
  total_views: number;
  total_impressions: number;
  total_clicks: number;
  total_phone_clicks: number;
  total_website_clicks: number;
  total_quote_requests: number;
  avg_click_through_rate: number;
  daily_stats: DailyStats[];
  views_change_percent: number;
  leads_change_percent: number;
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const businessId = searchParams.get('business_id');
    const period = searchParams.get('period') || '30'; // days

    if (!businessId) {
      return NextResponse.json({ error: 'business_id is required' }, { status: 400 });
    }

    if (!supabase) {
      // Return mock data for demo mode
      return NextResponse.json(generateMockAnalytics(period));
    }

    const days = parseInt(period, 10) || 30;
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);
    const startDateStr = startDate.toISOString().split('T')[0];

    // Previous period for comparison
    const prevStartDate = new Date();
    prevStartDate.setDate(prevStartDate.getDate() - (days * 2));
    const prevStartDateStr = prevStartDate.toISOString().split('T')[0];

    // Get current period daily stats
    const { data: dailyStats, error: dailyError } = await supabase
      .from('business_analytics_daily')
      .select('*')
      .eq('business_id', businessId)
      .gte('event_date', startDateStr)
      .order('event_date', { ascending: true });

    if (dailyError) {
      console.error('Error fetching daily stats:', dailyError);
    }

    // Get previous period totals for comparison
    const { data: prevStats } = await supabase
      .from('business_analytics_daily')
      .select('profile_views, quote_requests')
      .eq('business_id', businessId)
      .gte('event_date', prevStartDateStr)
      .lt('event_date', startDateStr);

    // Calculate totals
    const stats = dailyStats || [];
    const totals = stats.reduce(
      (acc, day) => ({
        views: acc.views + (day.profile_views || 0),
        impressions: acc.impressions + (day.search_impressions || 0),
        clicks: acc.clicks + (day.search_clicks || 0),
        phoneClicks: acc.phoneClicks + (day.phone_clicks || 0),
        websiteClicks: acc.websiteClicks + (day.website_clicks || 0),
        quoteRequests: acc.quoteRequests + (day.quote_requests || 0),
      }),
      { views: 0, impressions: 0, clicks: 0, phoneClicks: 0, websiteClicks: 0, quoteRequests: 0 }
    );

    // Calculate previous period totals
    const prevTotals = (prevStats || []).reduce(
      (acc, day) => ({
        views: acc.views + (day.profile_views || 0),
        quoteRequests: acc.quoteRequests + (day.quote_requests || 0),
      }),
      { views: 0, quoteRequests: 0 }
    );

    // Calculate percentage changes
    const viewsChange = prevTotals.views > 0
      ? ((totals.views - prevTotals.views) / prevTotals.views) * 100
      : 0;

    const leadsChange = prevTotals.quoteRequests > 0
      ? ((totals.quoteRequests - prevTotals.quoteRequests) / prevTotals.quoteRequests) * 100
      : 0;

    // Calculate average CTR
    const avgCTR = totals.impressions > 0
      ? (totals.clicks / totals.impressions) * 100
      : 0;

    const response: AnalyticsSummary = {
      period: `${days} days`,
      total_views: totals.views,
      total_impressions: totals.impressions,
      total_clicks: totals.clicks,
      total_phone_clicks: totals.phoneClicks,
      total_website_clicks: totals.websiteClicks,
      total_quote_requests: totals.quoteRequests,
      avg_click_through_rate: Math.round(avgCTR * 100) / 100,
      daily_stats: stats.map(day => ({
        event_date: day.event_date,
        profile_views: day.profile_views || 0,
        search_impressions: day.search_impressions || 0,
        search_clicks: day.search_clicks || 0,
        phone_clicks: day.phone_clicks || 0,
        website_clicks: day.website_clicks || 0,
        quote_requests: day.quote_requests || 0,
        click_through_rate: day.click_through_rate || 0,
      })),
      views_change_percent: Math.round(viewsChange * 10) / 10,
      leads_change_percent: Math.round(leadsChange * 10) / 10,
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error('Analytics fetch error:', error);
    return NextResponse.json({ error: 'Internal error' }, { status: 500 });
  }
}

// Generate mock data for demo mode
function generateMockAnalytics(period: string): AnalyticsSummary {
  const days = parseInt(period, 10) || 30;
  const dailyStats: DailyStats[] = [];

  for (let i = days - 1; i >= 0; i--) {
    const date = new Date();
    date.setDate(date.getDate() - i);

    // Generate realistic-looking random data
    const impressions = Math.floor(Math.random() * 50) + 10;
    const clicks = Math.floor(impressions * (Math.random() * 0.15 + 0.05));
    const views = clicks + Math.floor(Math.random() * 5);

    dailyStats.push({
      event_date: date.toISOString().split('T')[0],
      profile_views: views,
      search_impressions: impressions,
      search_clicks: clicks,
      phone_clicks: Math.floor(Math.random() * 3),
      website_clicks: Math.floor(Math.random() * 5),
      quote_requests: Math.floor(Math.random() * 2),
      click_through_rate: impressions > 0 ? Math.round((clicks / impressions) * 100 * 100) / 100 : 0,
    });
  }

  const totals = dailyStats.reduce(
    (acc, day) => ({
      views: acc.views + day.profile_views,
      impressions: acc.impressions + day.search_impressions,
      clicks: acc.clicks + day.search_clicks,
      phoneClicks: acc.phoneClicks + day.phone_clicks,
      websiteClicks: acc.websiteClicks + day.website_clicks,
      quoteRequests: acc.quoteRequests + day.quote_requests,
    }),
    { views: 0, impressions: 0, clicks: 0, phoneClicks: 0, websiteClicks: 0, quoteRequests: 0 }
  );

  return {
    period: `${days} days`,
    total_views: totals.views,
    total_impressions: totals.impressions,
    total_clicks: totals.clicks,
    total_phone_clicks: totals.phoneClicks,
    total_website_clicks: totals.websiteClicks,
    total_quote_requests: totals.quoteRequests,
    avg_click_through_rate: totals.impressions > 0
      ? Math.round((totals.clicks / totals.impressions) * 100 * 100) / 100
      : 0,
    daily_stats: dailyStats,
    views_change_percent: Math.round((Math.random() * 40 - 10) * 10) / 10,
    leads_change_percent: Math.round((Math.random() * 60 - 20) * 10) / 10,
  };
}
