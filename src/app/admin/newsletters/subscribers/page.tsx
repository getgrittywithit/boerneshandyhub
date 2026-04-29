'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import type { Subscriber, SubscriberBreakdown } from '@/types/newsletter';

interface SubscribersResponse {
  subscribers: Subscriber[];
  stats: SubscriberBreakdown & { total: number };
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export default function SubscribersPage() {
  const [data, setData] = useState<SubscribersResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [filter, setFilter] = useState<'all' | 'homeowner' | 'realtor' | 'business'>('all');
  const [search, setSearch] = useState('');
  const [exporting, setExporting] = useState(false);

  useEffect(() => {
    loadSubscribers();
  }, [page, filter]);

  const loadSubscribers = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: '25',
      });
      if (filter !== 'all') {
        params.set('type', filter);
      }
      if (search) {
        params.set('search', search);
      }

      const response = await fetch(`/api/newsletters/subscribers?${params}`);
      if (response.ok) {
        const result = await response.json();
        setData(result);
      }
    } catch (error) {
      console.error('Error loading subscribers:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1);
    loadSubscribers();
  };

  const handleExport = async () => {
    setExporting(true);
    try {
      const params = new URLSearchParams({ limit: '10000' });
      if (filter !== 'all') {
        params.set('type', filter);
      }

      const response = await fetch(`/api/newsletters/subscribers?${params}`);
      if (response.ok) {
        const result = await response.json();
        const subscribers = result.subscribers as Subscriber[];

        // Create CSV
        const headers = ['Email', 'Name', 'Type', 'Source', 'Status', 'Subscribed At'];
        const rows = subscribers.map((s) => [
          s.email,
          s.name || '',
          s.subscriber_type,
          s.source || '',
          s.status,
          new Date(s.created_at).toLocaleDateString(),
        ]);

        const csv = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
        const blob = new Blob([csv], { type: 'text/csv' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `subscribers-${filter}-${new Date().toISOString().split('T')[0]}.csv`;
        a.click();
        URL.revokeObjectURL(url);
      }
    } catch (error) {
      console.error('Error exporting:', error);
      alert('Failed to export subscribers');
    } finally {
      setExporting(false);
    }
  };

  const handleUnsubscribe = async (email: string) => {
    if (!confirm(`Are you sure you want to unsubscribe ${email}?`)) return;

    try {
      const response = await fetch('/api/newsletters/subscribers', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      if (response.ok) {
        loadSubscribers();
      } else {
        alert('Failed to unsubscribe');
      }
    } catch (error) {
      console.error('Error unsubscribing:', error);
      alert('Failed to unsubscribe');
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const getSourceLabel = (source: string | null) => {
    const sources: Record<string, string> = {
      homepage: 'Homepage',
      footer: 'Footer',
      'moving-guide': 'Moving Guide',
      'welcome-packet': 'Welcome Packet',
      'home-tracker': 'Home Tracker',
    };
    return sources[source || ''] || source || 'Unknown';
  };

  return (
    <div className="p-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <Link
              href="/admin/newsletters"
              className="text-gray-500 hover:text-gray-700"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </Link>
            <h1 className="text-2xl font-bold text-gray-900">Subscribers</h1>
          </div>
          <p className="text-gray-600">Manage your newsletter subscribers</p>
        </div>
        <button
          onClick={handleExport}
          disabled={exporting}
          className="px-4 py-2 bg-gray-100 text-gray-700 font-medium rounded-lg hover:bg-gray-200 transition-colors disabled:opacity-50 flex items-center gap-2"
        >
          {exporting ? (
            <>
              <span className="animate-spin">&#8635;</span>
              Exporting...
            </>
          ) : (
            <>
              <span>&#128229;</span>
              Export CSV
            </>
          )}
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <button
          onClick={() => { setFilter('all'); setPage(1); }}
          className={`p-4 rounded-xl text-left transition-colors ${
            filter === 'all'
              ? 'bg-boerne-navy text-white'
              : 'bg-white text-gray-900 hover:bg-gray-50'
          }`}
        >
          <p className={`text-sm ${filter === 'all' ? 'text-white/70' : 'text-gray-500'}`}>
            All Subscribers
          </p>
          <p className="text-2xl font-bold mt-1">{data?.stats?.total || 0}</p>
        </button>

        <button
          onClick={() => { setFilter('homeowner'); setPage(1); }}
          className={`p-4 rounded-xl text-left transition-colors ${
            filter === 'homeowner'
              ? 'bg-boerne-navy text-white'
              : 'bg-white text-gray-900 hover:bg-gray-50'
          }`}
        >
          <p className={`text-sm ${filter === 'homeowner' ? 'text-white/70' : 'text-gray-500'}`}>
            Homeowners
          </p>
          <p className="text-2xl font-bold mt-1">{data?.stats?.homeowners || 0}</p>
        </button>

        <button
          onClick={() => { setFilter('realtor'); setPage(1); }}
          className={`p-4 rounded-xl text-left transition-colors ${
            filter === 'realtor'
              ? 'bg-boerne-navy text-white'
              : 'bg-white text-gray-900 hover:bg-gray-50'
          }`}
        >
          <p className={`text-sm ${filter === 'realtor' ? 'text-white/70' : 'text-gray-500'}`}>
            Realtors
          </p>
          <p className="text-2xl font-bold mt-1">{data?.stats?.realtors || 0}</p>
        </button>

        <button
          onClick={() => { setFilter('business'); setPage(1); }}
          className={`p-4 rounded-xl text-left transition-colors ${
            filter === 'business'
              ? 'bg-boerne-navy text-white'
              : 'bg-white text-gray-900 hover:bg-gray-50'
          }`}
        >
          <p className={`text-sm ${filter === 'business' ? 'text-white/70' : 'text-gray-500'}`}>
            Businesses
          </p>
          <p className="text-2xl font-bold mt-1">{data?.stats?.businesses || 0}</p>
        </button>
      </div>

      {/* Search */}
      <form onSubmit={handleSearch} className="mb-6">
        <div className="flex gap-3">
          <div className="flex-1 relative">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by email or name..."
              className="w-full px-4 py-2 pl-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-boerne-gold focus:border-transparent"
            />
            <svg
              className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <button
            type="submit"
            className="px-4 py-2 bg-boerne-gold text-boerne-navy font-medium rounded-lg hover:bg-boerne-gold-alt transition-colors"
          >
            Search
          </button>
        </div>
      </form>

      {/* Table */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-8 text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-boerne-navy mx-auto"></div>
          </div>
        ) : !data?.subscribers?.length ? (
          <div className="p-8 text-center">
            <div className="text-4xl mb-3">&#128587;</div>
            <p className="text-gray-500">No subscribers found</p>
          </div>
        ) : (
          <>
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Subscriber
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Type
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Source
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Joined
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {data.subscribers.map((subscriber) => (
                  <tr key={subscriber.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div>
                        <p className="font-medium text-gray-900">{subscriber.email}</p>
                        {subscriber.name && (
                          <p className="text-sm text-gray-500">{subscriber.name}</p>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                        subscriber.subscriber_type === 'homeowner'
                          ? 'bg-blue-100 text-blue-700'
                          : subscriber.subscriber_type === 'realtor'
                          ? 'bg-purple-100 text-purple-700'
                          : 'bg-green-100 text-green-700'
                      }`}>
                        {subscriber.subscriber_type}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {getSourceLabel(subscriber.source)}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                        subscriber.status === 'active'
                          ? 'bg-green-100 text-green-700'
                          : 'bg-red-100 text-red-700'
                      }`}>
                        {subscriber.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {formatDate(subscriber.created_at)}
                    </td>
                    <td className="px-6 py-4 text-right">
                      {subscriber.status === 'active' && (
                        <button
                          onClick={() => handleUnsubscribe(subscriber.email)}
                          className="text-sm text-red-600 hover:text-red-700"
                        >
                          Unsubscribe
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Pagination */}
            {data.pagination.totalPages > 1 && (
              <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between">
                <p className="text-sm text-gray-600">
                  Showing {((data.pagination.page - 1) * data.pagination.limit) + 1} to{' '}
                  {Math.min(data.pagination.page * data.pagination.limit, data.pagination.total)} of{' '}
                  {data.pagination.total} subscribers
                </p>
                <div className="flex gap-2">
                  <button
                    onClick={() => setPage(page - 1)}
                    disabled={page === 1}
                    className="px-3 py-1 text-sm border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Previous
                  </button>
                  <button
                    onClick={() => setPage(page + 1)}
                    disabled={page >= data.pagination.totalPages}
                    className="px-3 py-1 text-sm border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Next
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
