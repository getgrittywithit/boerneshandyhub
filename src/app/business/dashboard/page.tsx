'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useBusinessDashboard } from './layout';
import { supabase } from '@/lib/supabase';

interface DashboardStats {
  totalViews: number;
  totalLeads: number;
  newLeadsThisMonth: number;
  profileCompletion: number;
}

interface QuoteRequest {
  id: string;
  name: string;
  email: string;
  phone: string;
  service: string;
  message: string;
  created_at: string;
  status: 'new' | 'contacted' | 'completed';
}

export default function BusinessDashboardPage() {
  const { business, user } = useBusinessDashboard();
  const [stats, setStats] = useState<DashboardStats>({
    totalViews: 0,
    totalLeads: 0,
    newLeadsThisMonth: 0,
    profileCompletion: 0,
  });
  const [recentLeads, setRecentLeads] = useState<QuoteRequest[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (business) {
      fetchStats();
      fetchRecentLeads();
    }
  }, [business]);

  const fetchStats = async () => {
    if (!business) return;

    // Calculate profile completion
    const fields = [
      business.name,
      business.description,
      business.phone,
      business.email,
      business.address,
      business.website,
      business.photos && business.photos.length > 0,
    ];
    const completedFields = fields.filter(Boolean).length;
    const profileCompletion = Math.round((completedFields / fields.length) * 100);

    // Get leads count
    let totalLeads = 0;
    let newLeadsThisMonth = 0;

    if (supabase) {
      const { count: leadsCount } = await supabase
        .from('quote_requests')
        .select('*', { count: 'exact', head: true })
        .eq('business_id', business.id);

      totalLeads = leadsCount || 0;

      // Leads this month
      const firstOfMonth = new Date();
      firstOfMonth.setDate(1);
      firstOfMonth.setHours(0, 0, 0, 0);

      const { count: monthlyCount } = await supabase
        .from('quote_requests')
        .select('*', { count: 'exact', head: true })
        .eq('business_id', business.id)
        .gte('created_at', firstOfMonth.toISOString());

      newLeadsThisMonth = monthlyCount || 0;
    }

    setStats({
      totalViews: 0, // Would need analytics tracking
      totalLeads,
      newLeadsThisMonth,
      profileCompletion,
    });
  };

  const fetchRecentLeads = async () => {
    if (!supabase || !business) {
      setLoading(false);
      return;
    }

    const { data, error } = await supabase
      .from('quote_requests')
      .select('*')
      .eq('business_id', business.id)
      .order('created_at', { ascending: false })
      .limit(5);

    if (!error && data) {
      setRecentLeads(data as QuoteRequest[]);
    }

    setLoading(false);
  };

  if (!business) {
    return (
      <div className="p-8">
        <p>Loading...</p>
      </div>
    );
  }

  const tierColors = {
    basic: 'bg-gray-100 text-gray-700',
    verified: 'bg-green-100 text-green-700',
    premium: 'bg-yellow-100 text-yellow-700',
    elite: 'bg-purple-100 text-purple-700',
  };

  return (
    <div className="p-8">
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-500">Welcome back! Here's what's happening with your business.</p>
      </div>

      {/* Business Status Card */}
      <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
        <div className="flex items-start justify-between">
          <div>
            <h2 className="text-xl font-bold text-gray-900">{business.name}</h2>
            <p className="text-gray-500 text-sm mt-1">{business.category}</p>
          </div>
          <div className="flex items-center gap-3">
            <span className={`px-3 py-1 text-sm font-medium rounded-full ${tierColors[business.membership_tier]}`}>
              {business.membership_tier.charAt(0).toUpperCase() + business.membership_tier.slice(1)}
            </span>
            {business.claim_status === 'verified' && (
              <span className="px-3 py-1 text-sm font-medium rounded-full bg-blue-100 text-blue-700">
                Verified
              </span>
            )}
          </div>
        </div>
        {(() => {
          const allSubcategories = (business as any).subcategories || [];
          const activeSubcategories = (business as any).active_subcategories || allSubcategories.slice(0, 1);
          const inactiveCount = allSubcategories.length - activeSubcategories.length;

          if (inactiveCount > 0 && business.membership_tier !== 'elite') {
            return (
              <div className="mt-4 p-4 bg-boerne-gold/10 rounded-lg border border-boerne-gold/20">
                <p className="text-sm text-boerne-navy">
                  <strong>You have {inactiveCount} inactive {inactiveCount === 1 ? 'category' : 'categories'}!</strong>{' '}
                  Upgrade to appear in all {allSubcategories.length} categories you selected.{' '}
                  <Link href="/business/dashboard/settings" className="text-boerne-gold hover:underline">
                    View plans
                  </Link>
                </p>
              </div>
            );
          } else if (business.membership_tier === 'basic') {
            return (
              <div className="mt-4 p-4 bg-boerne-gold/10 rounded-lg border border-boerne-gold/20">
                <p className="text-sm text-boerne-navy">
                  <strong>Upgrade your listing</strong> to get more visibility and leads.{' '}
                  <Link href="/business/dashboard/settings" className="text-boerne-gold hover:underline">
                    View plans
                  </Link>
                </p>
              </div>
            );
          }
          return null;
        })()}
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-6 rounded-xl shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Total Leads</p>
              <p className="text-3xl font-bold text-gray-900 mt-1">{stats.totalLeads}</p>
            </div>
            <div className="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center text-2xl">
              📩
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">New This Month</p>
              <p className="text-3xl font-bold text-gray-900 mt-1">{stats.newLeadsThisMonth}</p>
            </div>
            <div className="w-12 h-12 rounded-xl bg-green-100 flex items-center justify-center text-2xl">
              📈
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Profile Views</p>
              <p className="text-3xl font-bold text-gray-900 mt-1">{stats.totalViews}</p>
            </div>
            <div className="w-12 h-12 rounded-xl bg-purple-100 flex items-center justify-center text-2xl">
              👁️
            </div>
          </div>
          <p className="text-xs text-gray-400 mt-2">Coming soon</p>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Profile Completion</p>
              <p className="text-3xl font-bold text-gray-900 mt-1">{stats.profileCompletion}%</p>
            </div>
            <div className="w-12 h-12 rounded-xl bg-orange-100 flex items-center justify-center text-2xl">
              ✨
            </div>
          </div>
          {stats.profileCompletion < 100 && (
            <Link
              href="/business/dashboard/profile"
              className="text-xs text-boerne-gold hover:underline mt-2 block"
            >
              Complete your profile
            </Link>
          )}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Link
          href="/business/dashboard/profile"
          className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow group"
        >
          <div className="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center text-2xl mb-4">
            🏢
          </div>
          <h3 className="font-semibold text-gray-900 group-hover:text-boerne-navy">Edit My Listing</h3>
          <p className="text-sm text-gray-500 mt-1">Update your business information and photos</p>
        </Link>

        <Link
          href="/business/dashboard/leads"
          className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow group"
        >
          <div className="w-12 h-12 rounded-xl bg-green-100 flex items-center justify-center text-2xl mb-4">
            📩
          </div>
          <h3 className="font-semibold text-gray-900 group-hover:text-boerne-navy">View All Leads</h3>
          <p className="text-sm text-gray-500 mt-1">Manage and respond to customer inquiries</p>
        </Link>

        <a
          href={`/services/${business.category}/${business.id}`}
          target="_blank"
          rel="noopener noreferrer"
          className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow group"
        >
          <div className="w-12 h-12 rounded-xl bg-purple-100 flex items-center justify-center text-2xl mb-4">
            🔗
          </div>
          <h3 className="font-semibold text-gray-900 group-hover:text-boerne-navy">View Public Listing</h3>
          <p className="text-sm text-gray-500 mt-1">See how customers view your profile</p>
        </a>
      </div>

      {/* Recent Leads */}
      <div className="bg-white rounded-xl shadow-sm">
        <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center">
          <h3 className="text-lg font-semibold text-gray-900">Recent Leads</h3>
          <Link href="/business/dashboard/leads" className="text-sm text-boerne-gold hover:text-boerne-gold-alt">
            View all
          </Link>
        </div>

        {loading ? (
          <div className="p-6 text-center text-gray-500">Loading...</div>
        ) : recentLeads.length === 0 ? (
          <div className="p-6 text-center">
            <div className="text-4xl mb-2">📭</div>
            <p className="text-gray-500">No leads yet</p>
            <p className="text-sm text-gray-400 mt-1">
              When customers request quotes, they'll appear here
            </p>
          </div>
        ) : (
          <div className="divide-y divide-gray-100">
            {recentLeads.map((lead) => (
              <div key={lead.id} className="px-6 py-4 flex items-center justify-between hover:bg-gray-50">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-600 font-semibold">
                    {lead.name.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{lead.name}</p>
                    <p className="text-sm text-gray-500">{lead.service}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className={`px-2 py-1 text-xs rounded-full ${
                    lead.status === 'new' ? 'bg-blue-100 text-blue-700' :
                    lead.status === 'contacted' ? 'bg-yellow-100 text-yellow-700' :
                    'bg-green-100 text-green-700'
                  }`}>
                    {lead.status}
                  </span>
                  <span className="text-sm text-gray-400">
                    {new Date(lead.created_at).toLocaleDateString()}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
