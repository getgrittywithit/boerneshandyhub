'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase';
import { User } from '@supabase/supabase-js';

interface DashboardStats {
  totalBusinesses: number;
  pendingClaims: number;
  verifiedBusinesses: number;
  premiumBusinesses: number;
}

export default function AdminDashboard() {
  const [user, setUser] = useState<User | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<DashboardStats>({
    totalBusinesses: 0,
    pendingClaims: 0,
    verifiedBusinesses: 0,
    premiumBusinesses: 0
  });

  const supabase = createClient();

  useEffect(() => {
    checkAuth();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (isAdmin) {
      loadStats();
    }
  }, [isAdmin]); // eslint-disable-line react-hooks/exhaustive-deps

  const checkAuth = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);

      if (user) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('role')
          .eq('id', user.id)
          .single();

        setIsAdmin(profile?.role === 'admin');
      }
    } catch (error) {
      console.error('Auth check failed:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadStats = async () => {
    try {
      const [businessesRes, claimsRes] = await Promise.all([
        supabase.from('businesses').select('membership_tier, claim_status'),
        supabase.from('business_claims').select('status')
      ]);

      const businesses = businessesRes.data || [];
      const claims = claimsRes.data || [];

      setStats({
        totalBusinesses: businesses.length,
        pendingClaims: claims.filter(c => c.status === 'pending').length,
        verifiedBusinesses: businesses.filter(b => b.claim_status === 'verified').length,
        premiumBusinesses: businesses.filter(b => ['premium', 'elite'].includes(b.membership_tier)).length
      });
    } catch (error) {
      console.error('Failed to load stats:', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!user || !isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Access Denied</h1>
          <p className="text-gray-600">You need admin privileges to access this area.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-3xl font-bold tracking-tight text-gray-900">Admin Dashboard</h1>
              <p className="mt-2 text-gray-600">Manage your wedding business platform</p>
            </div>
            <div className="text-sm text-gray-500">
              Welcome, {user.email}
            </div>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-sm font-medium text-gray-500">Total Businesses</h3>
            <p className="text-3xl font-bold text-blue-600">{stats.totalBusinesses}</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-sm font-medium text-gray-500">Pending Claims</h3>
            <p className="text-3xl font-bold text-orange-600">{stats.pendingClaims}</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-sm font-medium text-gray-500">Verified Businesses</h3>
            <p className="text-3xl font-bold text-green-600">{stats.verifiedBusinesses}</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-sm font-medium text-gray-500">Premium Businesses</h3>
            <p className="text-3xl font-bold text-purple-600">{stats.premiumBusinesses}</p>
          </div>
        </div>

        {/* Navigation Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Business Claims */}
          <div className="bg-white p-6 rounded-lg shadow hover:shadow-md transition-shadow">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center">
                  <svg className="w-5 h-5 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
              </div>
              <div className="ml-4">
                <h3 className="text-lg font-medium text-gray-900">Business Claims</h3>
                <p className="text-sm text-gray-500">Review and approve business verification requests</p>
              </div>
            </div>
            <div className="mt-4">
              <a href="/admin/claims" className="text-blue-600 hover:text-blue-500 text-sm font-medium">
                Manage Claims →
              </a>
            </div>
          </div>

          {/* Business Listings */}
          <div className="bg-white p-6 rounded-lg shadow hover:shadow-md transition-shadow">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                  <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                </div>
              </div>
              <div className="ml-4">
                <h3 className="text-lg font-medium text-gray-900">Business Listings</h3>
                <p className="text-sm text-gray-500">Manage all wedding vendor listings</p>
              </div>
            </div>
            <div className="mt-4">
              <a href="/admin/businesses" className="text-blue-600 hover:text-blue-500 text-sm font-medium">
                View Businesses →
              </a>
            </div>
          </div>

          {/* Import Businesses */}
          <div className="bg-white p-6 rounded-lg shadow hover:shadow-md transition-shadow">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                  <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 19l3 3m0 0l3-3m-3 3V10" />
                  </svg>
                </div>
              </div>
              <div className="ml-4">
                <h3 className="text-lg font-medium text-gray-900">Import Businesses</h3>
                <p className="text-sm text-gray-500">Import businesses from Google Places API</p>
              </div>
            </div>
            <div className="mt-4">
              <a href="/admin/import" className="text-blue-600 hover:text-blue-500 text-sm font-medium">
                Import Data →
              </a>
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="mt-8">
          <div className="bg-white shadow rounded-lg">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-medium text-gray-900">Recent Activity</h3>
            </div>
            <div className="p-6">
              <p className="text-gray-500">Activity feed coming soon...</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}