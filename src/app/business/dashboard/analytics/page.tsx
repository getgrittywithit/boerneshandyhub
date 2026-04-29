'use client';

import { useState, useEffect } from 'react';
import { useBusinessDashboard } from '../layout';

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

interface AnalyticsData {
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

export default function AnalyticsPage() {
  const { business } = useBusinessDashboard();
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [period, setPeriod] = useState('30');

  useEffect(() => {
    if (business) {
      fetchAnalytics();
    }
  }, [business, period]);

  const fetchAnalytics = async () => {
    if (!business) return;

    setLoading(true);
    try {
      const response = await fetch(
        `/api/analytics/business?business_id=${business.id}&period=${period}`
      );
      if (response.ok) {
        const data = await response.json();
        setAnalytics(data);
      }
    } catch (error) {
      console.error('Error fetching analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  const getChangeColor = (change: number) => {
    if (change > 0) return 'text-green-600';
    if (change < 0) return 'text-red-600';
    return 'text-gray-500';
  };

  const getChangeIcon = (change: number) => {
    if (change > 0) return '↑';
    if (change < 0) return '↓';
    return '→';
  };

  // Find max value for chart scaling
  const maxViews = analytics
    ? Math.max(...analytics.daily_stats.map((d) => d.profile_views), 1)
    : 1;

  if (!business) {
    return <div className="p-8">Loading...</div>;
  }

  return (
    <div className="p-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Analytics</h1>
          <p className="text-gray-500">Track your listing performance</p>
        </div>
        <select
          value={period}
          onChange={(e) => setPeriod(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-boerne-gold focus:border-transparent"
        >
          <option value="7">Last 7 days</option>
          <option value="30">Last 30 days</option>
          <option value="90">Last 90 days</option>
        </select>
      </div>

      {loading ? (
        <div className="animate-pulse space-y-6">
          <div className="grid grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-32 bg-gray-200 rounded-xl"></div>
            ))}
          </div>
          <div className="h-64 bg-gray-200 rounded-xl"></div>
        </div>
      ) : analytics ? (
        <>
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-white p-6 rounded-xl shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">Profile Views</p>
                  <p className="text-3xl font-bold text-gray-900 mt-1">
                    {analytics.total_views.toLocaleString()}
                  </p>
                </div>
                <div className="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center text-2xl">
                  👁️
                </div>
              </div>
              <p className={`text-sm mt-2 ${getChangeColor(analytics.views_change_percent)}`}>
                {getChangeIcon(analytics.views_change_percent)} {Math.abs(analytics.views_change_percent)}% vs previous period
              </p>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">Search Impressions</p>
                  <p className="text-3xl font-bold text-gray-900 mt-1">
                    {analytics.total_impressions.toLocaleString()}
                  </p>
                </div>
                <div className="w-12 h-12 rounded-xl bg-purple-100 flex items-center justify-center text-2xl">
                  🔍
                </div>
              </div>
              <p className="text-sm text-gray-500 mt-2">
                Times shown in search results
              </p>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">Click-through Rate</p>
                  <p className="text-3xl font-bold text-gray-900 mt-1">
                    {analytics.avg_click_through_rate}%
                  </p>
                </div>
                <div className="w-12 h-12 rounded-xl bg-green-100 flex items-center justify-center text-2xl">
                  📈
                </div>
              </div>
              <p className="text-sm text-gray-500 mt-2">
                {analytics.total_clicks} clicks from {analytics.total_impressions} impressions
              </p>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">Quote Requests</p>
                  <p className="text-3xl font-bold text-gray-900 mt-1">
                    {analytics.total_quote_requests}
                  </p>
                </div>
                <div className="w-12 h-12 rounded-xl bg-orange-100 flex items-center justify-center text-2xl">
                  📩
                </div>
              </div>
              <p className={`text-sm mt-2 ${getChangeColor(analytics.leads_change_percent)}`}>
                {getChangeIcon(analytics.leads_change_percent)} {Math.abs(analytics.leads_change_percent)}% vs previous period
              </p>
            </div>
          </div>

          {/* Views Chart */}
          <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
            <h2 className="text-lg font-semibold text-gray-900 mb-6">Profile Views Over Time</h2>
            <div className="h-64 flex items-end gap-1">
              {analytics.daily_stats.map((day, index) => (
                <div
                  key={day.event_date}
                  className="flex-1 flex flex-col items-center group"
                >
                  <div className="relative w-full">
                    {/* Tooltip */}
                    <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10">
                      {formatDate(day.event_date)}: {day.profile_views} views
                    </div>
                    {/* Bar */}
                    <div
                      className="w-full bg-boerne-gold/80 hover:bg-boerne-gold rounded-t transition-colors"
                      style={{
                        height: `${(day.profile_views / maxViews) * 200}px`,
                        minHeight: day.profile_views > 0 ? '4px' : '0px',
                      }}
                    ></div>
                  </div>
                  {/* Show date label for some bars */}
                  {(index === 0 || index === analytics.daily_stats.length - 1 || index % 7 === 0) && (
                    <span className="text-xs text-gray-400 mt-2 -rotate-45 origin-top-left">
                      {formatDate(day.event_date)}
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Engagement Breakdown */}
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Engagement Actions</h2>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="text-xl">📞</span>
                    <span className="text-gray-700">Phone Clicks</span>
                  </div>
                  <span className="font-semibold text-gray-900">{analytics.total_phone_clicks}</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="text-xl">🌐</span>
                    <span className="text-gray-700">Website Clicks</span>
                  </div>
                  <span className="font-semibold text-gray-900">{analytics.total_website_clicks}</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="text-xl">📩</span>
                    <span className="text-gray-700">Quote Requests</span>
                  </div>
                  <span className="font-semibold text-gray-900">{analytics.total_quote_requests}</span>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Performance Tips</h2>
              <div className="space-y-3">
                {analytics.avg_click_through_rate < 5 && (
                  <div className="p-3 bg-yellow-50 rounded-lg">
                    <p className="text-sm text-yellow-800">
                      <strong>Improve your CTR:</strong> Add more photos and a detailed description to stand out in search results.
                    </p>
                  </div>
                )}
                {analytics.total_phone_clicks === 0 && (
                  <div className="p-3 bg-blue-50 rounded-lg">
                    <p className="text-sm text-blue-800">
                      <strong>Add your phone number:</strong> Make it easy for customers to call you directly.
                    </p>
                  </div>
                )}
                {analytics.total_views > 50 && analytics.total_quote_requests < 2 && (
                  <div className="p-3 bg-purple-50 rounded-lg">
                    <p className="text-sm text-purple-800">
                      <strong>Convert more views:</strong> Consider adding special offers or highlighting your unique value.
                    </p>
                  </div>
                )}
                {analytics.views_change_percent > 10 && (
                  <div className="p-3 bg-green-50 rounded-lg">
                    <p className="text-sm text-green-800">
                      <strong>Great momentum!</strong> Your views are up {analytics.views_change_percent}%. Keep your profile updated!
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </>
      ) : (
        <div className="text-center py-12">
          <div className="text-4xl mb-3">📊</div>
          <p className="text-gray-500">No analytics data available yet</p>
        </div>
      )}
    </div>
  );
}
