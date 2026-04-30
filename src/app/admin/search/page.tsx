'use client';

import { useState, useEffect } from 'react';
import { supabaseAdmin } from '@/lib/supabase';

interface SearchQuery {
  query: string;
  search_count: number;
  avg_results: number;
  zero_result_count: number;
  last_searched: string;
}

interface VendorLead {
  id: string;
  query: string | null;
  suggested_name: string | null;
  contact_email: string | null;
  contact_phone: string | null;
  notes: string | null;
  status: string;
  created_at: string;
}

interface SearchStats {
  total_queries: number;
  total_clicks: number;
  zero_result_rate: number;
  avg_results_per_query: number;
}

export default function SearchAdminPage() {
  const [timeRange, setTimeRange] = useState<'7d' | '30d'>('7d');
  const [topQueries, setTopQueries] = useState<SearchQuery[]>([]);
  const [zeroResultQueries, setZeroResultQueries] = useState<SearchQuery[]>([]);
  const [vendorLeads, setVendorLeads] = useState<VendorLead[]>([]);
  const [stats, setStats] = useState<SearchStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [syncing, setSyncing] = useState(false);
  const [syncResult, setSyncResult] = useState<string | null>(null);

  useEffect(() => {
    loadData();
  }, [timeRange]);

  const loadData = async () => {
    setLoading(true);
    try {
      // For now, we'll simulate data since the tables might not exist yet
      // In production, this would query the actual views

      if (supabaseAdmin) {
        // Try to load real data
        const daysAgo = timeRange === '7d' ? 7 : 30;
        const startDate = new Date();
        startDate.setDate(startDate.getDate() - daysAgo);

        // Get query stats
        const { data: queries } = await supabaseAdmin
          .from('search_queries')
          .select('query, result_counts, created_at')
          .gte('created_at', startDate.toISOString())
          .order('created_at', { ascending: false })
          .limit(500);

        if (queries && queries.length > 0) {
          // Aggregate queries
          const queryMap = new Map<string, { count: number; results: number[]; zeroCount: number; lastSearched: string }>();

          for (const q of queries) {
            const existing: { count: number; results: number[]; zeroCount: number; lastSearched: string } = queryMap.get(q.query) || {
              count: 0,
              results: [] as number[],
              zeroCount: 0,
              lastSearched: q.created_at,
            };

            const totalResults = (q.result_counts as { total?: number })?.total || 0;
            existing.count++;
            existing.results.push(totalResults);
            if (totalResults === 0) existing.zeroCount++;
            if (q.created_at > existing.lastSearched) existing.lastSearched = q.created_at;

            queryMap.set(q.query, existing);
          }

          // Convert to array and sort
          const queryArray: SearchQuery[] = Array.from(queryMap.entries()).map(([query, data]) => ({
            query,
            search_count: data.count,
            avg_results: data.results.reduce((a, b) => a + b, 0) / data.results.length,
            zero_result_count: data.zeroCount,
            last_searched: data.lastSearched,
          }));

          setTopQueries(queryArray.sort((a, b) => b.search_count - a.search_count).slice(0, 20));
          setZeroResultQueries(
            queryArray
              .filter((q) => q.zero_result_count > 0)
              .sort((a, b) => b.zero_result_count - a.zero_result_count)
              .slice(0, 20)
          );

          // Calculate stats
          const totalQueries = queries.length;
          const { data: clicks } = await supabaseAdmin
            .from('search_clicks')
            .select('id')
            .gte('created_at', startDate.toISOString());

          const totalClicks = clicks?.length || 0;
          const zeroResultQueries = queries.filter(
            (q) => ((q.result_counts as { total?: number })?.total || 0) === 0
          ).length;

          setStats({
            total_queries: totalQueries,
            total_clicks: totalClicks,
            zero_result_rate: totalQueries > 0 ? (zeroResultQueries / totalQueries) * 100 : 0,
            avg_results_per_query:
              queries.reduce((sum, q) => sum + ((q.result_counts as { total?: number })?.total || 0), 0) /
                totalQueries || 0,
          });
        } else {
          // No data yet
          setTopQueries([]);
          setZeroResultQueries([]);
          setStats({
            total_queries: 0,
            total_clicks: 0,
            zero_result_rate: 0,
            avg_results_per_query: 0,
          });
        }

        // Load vendor leads
        const { data: leads } = await supabaseAdmin
          .from('vendor_leads')
          .select('*')
          .order('created_at', { ascending: false })
          .limit(50);

        setVendorLeads(leads || []);
      }
    } catch (error) {
      console.error('Failed to load search data:', error);
      // Set empty data on error
      setTopQueries([]);
      setZeroResultQueries([]);
      setVendorLeads([]);
      setStats(null);
    } finally {
      setLoading(false);
    }
  };

  const syncSearchIndex = async () => {
    setSyncing(true);
    setSyncResult(null);

    try {
      const response = await fetch('/api/search/sync', {
        method: 'POST',
        headers: {
          Authorization: 'Bearer dev-admin',
        },
      });

      const data = await response.json();

      if (response.ok) {
        setSyncResult(
          `Success! Indexed ${data.total} documents in ${data.took_ms}ms. ` +
            `(${data.stats.businesses} businesses, ${data.stats.categories} categories, ` +
            `${data.stats.realtors} realtors, ${data.stats.pages} pages)`
        );
      } else {
        setSyncResult(`Error: ${data.error || 'Sync failed'}`);
      }
    } catch (error) {
      setSyncResult(`Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setSyncing(false);
    }
  };

  const updateLeadStatus = async (leadId: string, status: string) => {
    if (!supabaseAdmin) return;

    await supabaseAdmin.from('vendor_leads').update({ status }).eq('id', leadId);

    // Refresh leads
    const { data } = await supabaseAdmin
      .from('vendor_leads')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(50);

    setVendorLeads(data || []);
  };

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Search Analytics</h1>
          <p className="text-gray-600 mt-1">Monitor search performance and user queries</p>
        </div>
        <div className="flex items-center gap-4">
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value as '7d' | '30d')}
            className="px-3 py-2 border border-gray-300 rounded-lg text-sm"
          >
            <option value="7d">Last 7 days</option>
            <option value="30d">Last 30 days</option>
          </select>
          <button
            onClick={syncSearchIndex}
            disabled={syncing}
            className="px-4 py-2 bg-boerne-gold text-boerne-navy font-medium rounded-lg hover:bg-boerne-gold-alt transition-colors disabled:opacity-50"
          >
            {syncing ? 'Syncing...' : 'Sync Index'}
          </button>
        </div>
      </div>

      {/* Sync Result */}
      {syncResult && (
        <div
          className={`mb-6 p-4 rounded-lg ${
            syncResult.startsWith('Error')
              ? 'bg-red-50 text-red-700 border border-red-200'
              : 'bg-green-50 text-green-700 border border-green-200'
          }`}
        >
          {syncResult}
        </div>
      )}

      {loading ? (
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-boerne-navy"></div>
        </div>
      ) : (
        <>
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
              <p className="text-sm text-gray-500">Total Queries</p>
              <p className="text-3xl font-bold text-gray-900">{stats?.total_queries || 0}</p>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
              <p className="text-sm text-gray-500">Total Clicks</p>
              <p className="text-3xl font-bold text-gray-900">{stats?.total_clicks || 0}</p>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
              <p className="text-sm text-gray-500">Zero Result Rate</p>
              <p className="text-3xl font-bold text-gray-900">{stats?.zero_result_rate.toFixed(1) || 0}%</p>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
              <p className="text-sm text-gray-500">Avg Results/Query</p>
              <p className="text-3xl font-bold text-gray-900">{stats?.avg_results_per_query.toFixed(1) || 0}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            {/* Top Queries */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200">
              <div className="p-4 border-b border-gray-200">
                <h2 className="text-lg font-semibold text-gray-900">Top Queries</h2>
              </div>
              <div className="max-h-96 overflow-y-auto">
                {topQueries.length === 0 ? (
                  <p className="p-4 text-gray-500 text-sm">No search queries yet</p>
                ) : (
                  <table className="w-full">
                    <thead className="bg-gray-50 sticky top-0">
                      <tr>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">Query</th>
                        <th className="px-4 py-2 text-right text-xs font-medium text-gray-500">Searches</th>
                        <th className="px-4 py-2 text-right text-xs font-medium text-gray-500">Avg Results</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {topQueries.map((q, i) => (
                        <tr key={i} className="hover:bg-gray-50">
                          <td className="px-4 py-2 text-sm text-gray-900">{q.query}</td>
                          <td className="px-4 py-2 text-sm text-gray-600 text-right">{q.search_count}</td>
                          <td className="px-4 py-2 text-sm text-gray-600 text-right">{q.avg_results.toFixed(1)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            </div>

            {/* Zero Result Queries */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200">
              <div className="p-4 border-b border-gray-200">
                <h2 className="text-lg font-semibold text-gray-900">Zero Result Queries</h2>
              </div>
              <div className="max-h-96 overflow-y-auto">
                {zeroResultQueries.length === 0 ? (
                  <p className="p-4 text-gray-500 text-sm">No zero-result queries</p>
                ) : (
                  <table className="w-full">
                    <thead className="bg-gray-50 sticky top-0">
                      <tr>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">Query</th>
                        <th className="px-4 py-2 text-right text-xs font-medium text-gray-500">Times</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {zeroResultQueries.map((q, i) => (
                        <tr key={i} className="hover:bg-gray-50">
                          <td className="px-4 py-2 text-sm text-gray-900">{q.query}</td>
                          <td className="px-4 py-2 text-sm text-gray-600 text-right">{q.zero_result_count}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            </div>
          </div>

          {/* Vendor Leads */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200">
            <div className="p-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">Business Suggestions</h2>
              <p className="text-sm text-gray-500">Submissions from users who couldn&apos;t find what they were looking for</p>
            </div>
            <div className="overflow-x-auto">
              {vendorLeads.length === 0 ? (
                <p className="p-4 text-gray-500 text-sm">No suggestions yet</p>
              ) : (
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">Date</th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">Search Query</th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">Suggested Business</th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">Contact</th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">Status</th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {vendorLeads.map((lead) => (
                      <tr key={lead.id} className="hover:bg-gray-50">
                        <td className="px-4 py-2 text-sm text-gray-500">
                          {new Date(lead.created_at).toLocaleDateString()}
                        </td>
                        <td className="px-4 py-2 text-sm text-gray-900">{lead.query || '-'}</td>
                        <td className="px-4 py-2 text-sm text-gray-900 font-medium">{lead.suggested_name || '-'}</td>
                        <td className="px-4 py-2 text-sm text-gray-600">
                          {lead.contact_email || lead.contact_phone || '-'}
                        </td>
                        <td className="px-4 py-2">
                          <span
                            className={`px-2 py-1 text-xs font-medium rounded ${
                              lead.status === 'new'
                                ? 'bg-blue-100 text-blue-700'
                                : lead.status === 'contacted'
                                ? 'bg-yellow-100 text-yellow-700'
                                : lead.status === 'added'
                                ? 'bg-green-100 text-green-700'
                                : 'bg-gray-100 text-gray-700'
                            }`}
                          >
                            {lead.status}
                          </span>
                        </td>
                        <td className="px-4 py-2">
                          <select
                            value={lead.status}
                            onChange={(e) => updateLeadStatus(lead.id, e.target.value)}
                            className="text-sm border border-gray-200 rounded px-2 py-1"
                          >
                            <option value="new">New</option>
                            <option value="contacted">Contacted</option>
                            <option value="added">Added</option>
                            <option value="dismissed">Dismissed</option>
                          </select>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
