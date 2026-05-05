'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

interface AnalyticsData {
  businessStats: {
    total: number;
    elite: number;
    premium: number;
    verified: number;
    basic: number;
    unclaimed: number;
    pendingClaims: number;
  };
  subscriberStats: {
    total: number;
    homeowners: number;
    businesses: number;
    realtors: number;
  };
  subscriberGrowth: Record<string, number>;
  searchStats: {
    totalQueries: number;
    totalClicks: number;
    clickThroughRate: string;
    topQueries: Array<{ query: string; count: number }>;
  };
  newsletterStats: {
    sent: number;
    delivered: number;
    opened: number;
    clicked: number;
    bounced: number;
    deliveryRate: string;
    openRate: string;
  };
  lastUpdated: string;
}

export default function AdminDashboard() {
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchAnalytics() {
      try {
        const res = await fetch('/api/admin/analytics');
        if (!res.ok) throw new Error('Failed to fetch analytics');
        const data = await res.json();
        setAnalytics(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error');
      } finally {
        setLoading(false);
      }
    }
    fetchAnalytics();
  }, []);

  if (loading) {
    return (
      <div className="p-8">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-gray-200 rounded w-48"></div>
          <div className="grid grid-cols-4 gap-4">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="h-24 bg-gray-200 rounded-xl"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8">
        <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center">
          <p className="text-red-600">Failed to load analytics: {error}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  const stats = analytics?.businessStats;
  const subscribers = analytics?.subscriberStats;
  const search = analytics?.searchStats;
  const newsletter = analytics?.newsletterStats;

  const quickActions = [
    {
      href: '/admin/providers',
      icon: '🏢',
      title: 'Providers',
      description: 'Manage service provider listings',
      color: 'bg-blue-100 text-blue-600',
      stat: stats?.total || 0,
      statLabel: 'total',
    },
    {
      href: '/admin/newsletters/subscribers',
      icon: '📧',
      title: 'Subscribers',
      description: 'Newsletter subscriber management',
      color: 'bg-green-100 text-green-600',
      stat: subscribers?.total || 0,
      statLabel: 'active',
    },
    {
      href: '/admin/claims',
      icon: '✅',
      title: 'Claims',
      description: 'Review business claim requests',
      color: 'bg-orange-100 text-orange-600',
      stat: stats?.pendingClaims || 0,
      statLabel: 'pending',
    },
    {
      href: '/admin/newsletters',
      icon: '📰',
      title: 'Newsletters',
      description: 'Create and send newsletters',
      color: 'bg-purple-100 text-purple-600',
      stat: newsletter?.sent || 0,
      statLabel: 'sent (30d)',
    },
  ];

  return (
    <div className="p-8">
      {/* Page Header */}
      <div className="mb-8 flex justify-between items-start">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-500">Real-time analytics for Boerne&apos;s Handy Hub</p>
        </div>
        {analytics?.lastUpdated && (
          <p className="text-xs text-gray-400">
            Updated {new Date(analytics.lastUpdated).toLocaleTimeString()}
          </p>
        )}
      </div>

      {/* Business Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4 mb-8">
        <div className="bg-white p-4 rounded-xl shadow-sm text-center">
          <p className="text-2xl font-bold text-boerne-navy">{stats?.total || 0}</p>
          <p className="text-xs text-gray-500">Total Providers</p>
        </div>
        <div className="bg-white p-4 rounded-xl shadow-sm text-center">
          <p className="text-2xl font-bold text-purple-600">{stats?.elite || 0}</p>
          <p className="text-xs text-gray-500">Elite</p>
        </div>
        <div className="bg-white p-4 rounded-xl shadow-sm text-center">
          <p className="text-2xl font-bold text-yellow-600">{stats?.premium || 0}</p>
          <p className="text-xs text-gray-500">Premium</p>
        </div>
        <div className="bg-white p-4 rounded-xl shadow-sm text-center">
          <p className="text-2xl font-bold text-green-600">{stats?.verified || 0}</p>
          <p className="text-xs text-gray-500">Verified</p>
        </div>
        <div className="bg-white p-4 rounded-xl shadow-sm text-center">
          <p className="text-2xl font-bold text-gray-600">{stats?.basic || 0}</p>
          <p className="text-xs text-gray-500">Basic</p>
        </div>
        <div className="bg-white p-4 rounded-xl shadow-sm text-center">
          <p className="text-2xl font-bold text-orange-600">{stats?.unclaimed || 0}</p>
          <p className="text-xs text-gray-500">Unclaimed</p>
        </div>
        <div className="bg-white p-4 rounded-xl shadow-sm text-center">
          <p className="text-2xl font-bold text-red-600">{stats?.pendingClaims || 0}</p>
          <p className="text-xs text-gray-500">Pending Claims</p>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {quickActions.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow group"
          >
            <div className="flex items-start justify-between">
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-2xl ${item.color}`}>
                {item.icon}
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold text-gray-900">{item.stat}</p>
                <p className="text-xs text-gray-500">{item.statLabel}</p>
              </div>
            </div>
            <h3 className="mt-4 text-lg font-semibold text-gray-900 group-hover:text-boerne-navy">
              {item.title}
            </h3>
            <p className="text-sm text-gray-500">{item.description}</p>
          </Link>
        ))}
      </div>

      {/* Analytics Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Search Analytics */}
        <div className="bg-white rounded-xl shadow-sm">
          <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center">
            <h3 className="text-lg font-semibold text-gray-900">Search Analytics</h3>
            <span className="text-xs text-gray-400">Last 30 days</span>
          </div>
          <div className="p-6">
            {(search?.totalQueries || 0) > 0 ? (
              <>
                <div className="grid grid-cols-3 gap-4 mb-6">
                  <div className="text-center p-3 bg-gray-50 rounded-lg">
                    <p className="text-xl font-bold text-boerne-navy">{search?.totalQueries || 0}</p>
                    <p className="text-xs text-gray-500">Searches</p>
                  </div>
                  <div className="text-center p-3 bg-gray-50 rounded-lg">
                    <p className="text-xl font-bold text-green-600">{search?.totalClicks || 0}</p>
                    <p className="text-xs text-gray-500">Clicks</p>
                  </div>
                  <div className="text-center p-3 bg-gray-50 rounded-lg">
                    <p className="text-xl font-bold text-blue-600">{search?.clickThroughRate || 0}%</p>
                    <p className="text-xs text-gray-500">CTR</p>
                  </div>
                </div>

                <h4 className="text-sm font-medium text-gray-700 mb-3">Top Searches</h4>
                <div className="space-y-2">
                  {search?.topQueries && search.topQueries.length > 0 ? (
                    search.topQueries.map((q, i) => (
                      <div key={i} className="flex justify-between items-center py-2 px-3 bg-gray-50 rounded-lg">
                        <span className="text-sm text-gray-700">{q.query}</span>
                        <span className="text-xs font-medium text-gray-500">{q.count}x</span>
                      </div>
                    ))
                  ) : (
                    <p className="text-sm text-gray-400 text-center py-4">No search data yet</p>
                  )}
                </div>
              </>
            ) : (
              <div className="text-center py-8">
                <p className="text-gray-400">No search data yet</p>
                <p className="text-xs text-gray-300 mt-1">Searches will appear here as users search</p>
              </div>
            )}
          </div>
        </div>

        {/* Newsletter Stats */}
        <div className="bg-white rounded-xl shadow-sm">
          <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center">
            <h3 className="text-lg font-semibold text-gray-900">Newsletter Performance</h3>
            <span className="text-xs text-gray-400">Last 30 days</span>
          </div>
          <div className="p-6">
            {(newsletter?.sent || 0) > 0 || (newsletter?.delivered || 0) > 0 ? (
              <>
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="text-center p-3 bg-gray-50 rounded-lg">
                    <p className="text-xl font-bold text-boerne-navy">{newsletter?.delivered || 0}</p>
                    <p className="text-xs text-gray-500">Delivered</p>
                  </div>
                  <div className="text-center p-3 bg-gray-50 rounded-lg">
                    <p className="text-xl font-bold text-green-600">{newsletter?.deliveryRate || 0}%</p>
                    <p className="text-xs text-gray-500">Delivery Rate</p>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Sent</span>
                    <span className="font-medium">{newsletter?.sent || 0}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Delivered</span>
                    <span className="font-medium text-green-600">{newsletter?.delivered || 0}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Opened</span>
                    <span className="font-medium text-blue-600">
                      {newsletter?.opened || 0}
                      {(newsletter?.opened || 0) === 0 && (
                        <span className="text-xs text-gray-400 ml-1">(tracking not configured)</span>
                      )}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Clicked</span>
                    <span className="font-medium text-purple-600">{newsletter?.clicked || 0}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Bounced</span>
                    <span className="font-medium text-red-600">{newsletter?.bounced || 0}</span>
                  </div>
                </div>
              </>
            ) : (
              <div className="text-center py-8">
                <p className="text-gray-400">No newsletter data yet</p>
                <p className="text-xs text-gray-300 mt-1">Send a newsletter to see stats</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Subscriber Stats */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <div className="bg-white rounded-xl shadow-sm">
          <div className="px-6 py-4 border-b border-gray-100">
            <h3 className="text-lg font-semibold text-gray-900">Subscribers by Type</h3>
          </div>
          <div className="p-6">
            {(subscribers?.total || 0) > 0 ? (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="text-xl">🏠</span>
                    <span className="text-gray-700">Homeowners</span>
                  </div>
                  <span className="font-bold text-boerne-navy">{subscribers?.homeowners || 0}</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="text-xl">🏢</span>
                    <span className="text-gray-700">Businesses</span>
                  </div>
                  <span className="font-bold text-boerne-navy">{subscribers?.businesses || 0}</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="text-xl">🏘️</span>
                    <span className="text-gray-700">Realtors</span>
                  </div>
                  <span className="font-bold text-boerne-navy">{subscribers?.realtors || 0}</span>
                </div>
                <div className="border-t pt-4 mt-4 flex items-center justify-between">
                  <span className="font-medium text-gray-900">Total Active</span>
                  <span className="font-bold text-xl text-green-600">{subscribers?.total || 0}</span>
                </div>
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-gray-400">No subscribers yet</p>
                <p className="text-xs text-gray-300 mt-1">Subscribers will appear as users sign up</p>
              </div>
            )}
          </div>
        </div>

        {/* Business Analytics - Coming Soon */}
        <div className="bg-white rounded-xl shadow-sm">
          <div className="px-6 py-4 border-b border-gray-100">
            <h3 className="text-lg font-semibold text-gray-900">Profile Analytics</h3>
          </div>
          <div className="p-6">
            <div className="text-center py-8">
              <div className="text-4xl mb-3">📊</div>
              <p className="text-gray-400 font-medium">Coming Soon</p>
              <p className="text-xs text-gray-300 mt-1">
                Profile views, clicks, and engagement tracking
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Links */}
      <div className="bg-white rounded-xl shadow-sm">
        <div className="px-6 py-4 border-b border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900">Quick Links</h3>
        </div>
        <div className="p-6 grid grid-cols-2 md:grid-cols-4 gap-4">
          <Link
            href="/admin/blog"
            className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors"
          >
            <span className="text-2xl">📝</span>
            <span className="font-medium text-gray-700">Blog Posts</span>
          </Link>
          <Link
            href="/admin/websites"
            className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors"
          >
            <span className="text-2xl">🌐</span>
            <span className="font-medium text-gray-700">Websites</span>
          </Link>
          <Link
            href="/admin/search"
            className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors"
          >
            <span className="text-2xl">🔍</span>
            <span className="font-medium text-gray-700">Search</span>
          </Link>
          <Link
            href="/admin/settings"
            className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors"
          >
            <span className="text-2xl">⚙️</span>
            <span className="font-medium text-gray-700">Settings</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
