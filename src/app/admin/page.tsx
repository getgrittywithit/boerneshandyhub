'use client';

import { useMemo } from 'react';
import Link from 'next/link';
import { serviceBuckets, serviceCategories } from '@/data/serviceCategories';
import serviceProvidersData from '@/data/serviceProviders.json';

interface DashboardStats {
  totalProviders: number;
  eliteProviders: number;
  premiumProviders: number;
  verifiedProviders: number;
  pendingClaims: number;
  totalCategories: number;
  totalBuckets: number;
}

export default function AdminDashboard() {
  const stats: DashboardStats = useMemo(() => {
    const providers = serviceProvidersData.providers;
    return {
      totalProviders: providers.length,
      eliteProviders: providers.filter(p => p.membershipTier === 'elite').length,
      premiumProviders: providers.filter(p => p.membershipTier === 'premium').length,
      verifiedProviders: providers.filter(p => p.membershipTier === 'verified').length,
      pendingClaims: providers.filter(p => p.claimStatus === 'unclaimed').length,
      totalCategories: serviceCategories.length,
      totalBuckets: serviceBuckets.length,
    };
  }, []);

  const quickActions = [
    {
      href: '/admin/providers',
      icon: '🏢',
      title: 'Providers',
      description: 'Manage service provider listings',
      color: 'bg-blue-100 text-blue-600',
      stat: stats.totalProviders,
      statLabel: 'total',
    },
    {
      href: '/admin/categories',
      icon: '📁',
      title: 'Categories',
      description: 'Manage buckets and categories',
      color: 'bg-green-100 text-green-600',
      stat: stats.totalCategories,
      statLabel: 'categories',
    },
    {
      href: '/admin/quotes',
      icon: '📩',
      title: 'Quotes',
      description: 'View incoming quote requests',
      color: 'bg-purple-100 text-purple-600',
      stat: 0,
      statLabel: 'new',
    },
    {
      href: '/admin/claims',
      icon: '✅',
      title: 'Claims',
      description: 'Review business claim requests',
      color: 'bg-orange-100 text-orange-600',
      stat: stats.pendingClaims,
      statLabel: 'unclaimed',
    },
  ];

  return (
    <div className="p-8">
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-500">Welcome to Boerne Handy Hub admin panel</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4 mb-8">
        <div className="bg-white p-4 rounded-xl shadow-sm text-center">
          <p className="text-2xl font-bold text-boerne-navy">{stats.totalProviders}</p>
          <p className="text-xs text-gray-500">Total Providers</p>
        </div>
        <div className="bg-white p-4 rounded-xl shadow-sm text-center">
          <p className="text-2xl font-bold text-purple-600">{stats.eliteProviders}</p>
          <p className="text-xs text-gray-500">Elite</p>
        </div>
        <div className="bg-white p-4 rounded-xl shadow-sm text-center">
          <p className="text-2xl font-bold text-yellow-600">{stats.premiumProviders}</p>
          <p className="text-xs text-gray-500">Premium</p>
        </div>
        <div className="bg-white p-4 rounded-xl shadow-sm text-center">
          <p className="text-2xl font-bold text-green-600">{stats.verifiedProviders}</p>
          <p className="text-xs text-gray-500">Verified</p>
        </div>
        <div className="bg-white p-4 rounded-xl shadow-sm text-center">
          <p className="text-2xl font-bold text-orange-600">{stats.pendingClaims}</p>
          <p className="text-xs text-gray-500">Unclaimed</p>
        </div>
        <div className="bg-white p-4 rounded-xl shadow-sm text-center">
          <p className="text-2xl font-bold text-blue-600">{stats.totalBuckets}</p>
          <p className="text-xs text-gray-500">Buckets</p>
        </div>
        <div className="bg-white p-4 rounded-xl shadow-sm text-center">
          <p className="text-2xl font-bold text-teal-600">{stats.totalCategories}</p>
          <p className="text-xs text-gray-500">Categories</p>
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
              {item.stat !== undefined && (
                <div className="text-right">
                  <p className="text-2xl font-bold text-gray-900">{item.stat}</p>
                  <p className="text-xs text-gray-500">{item.statLabel}</p>
                </div>
              )}
            </div>
            <h3 className="mt-4 text-lg font-semibold text-gray-900 group-hover:text-boerne-navy">
              {item.title}
            </h3>
            <p className="text-sm text-gray-500">{item.description}</p>
          </Link>
        ))}
      </div>

      {/* Providers by Bucket */}
      <div className="bg-white rounded-xl shadow-sm mb-8">
        <div className="px-6 py-4 border-b border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900">Providers by Bucket</h3>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {serviceBuckets.map((bucket) => {
              const count = serviceProvidersData.providers.filter(
                p => serviceCategories.find(c => c.slug === p.category)?.bucket === bucket.slug
              ).length;
              const categoryCount = serviceCategories.filter(c => c.bucket === bucket.slug).length;

              return (
                <div key={bucket.id} className="p-4 bg-gray-50 rounded-xl">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="text-2xl">{bucket.icon}</span>
                    <span className="font-semibold text-gray-900">{bucket.name}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">{count} providers</span>
                    <span className="text-gray-400">{categoryCount} categories</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Recent Providers */}
      <div className="bg-white rounded-xl shadow-sm">
        <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center">
          <h3 className="text-lg font-semibold text-gray-900">Recent Providers</h3>
          <Link href="/admin/providers" className="text-sm text-boerne-gold hover:text-boerne-gold-alt">
            View all →
          </Link>
        </div>
        <div className="divide-y divide-gray-100">
          {serviceProvidersData.providers.slice(0, 5).map((provider) => {
            const category = serviceCategories.find(c => c.slug === provider.category);
            return (
              <div key={provider.id} className="px-6 py-4 flex items-center justify-between hover:bg-gray-50">
                <div className="flex items-center gap-4">
                  <span className="text-xl">{category?.icon}</span>
                  <div>
                    <p className="font-medium text-gray-900">{provider.name}</p>
                    <p className="text-sm text-gray-500">{category?.name}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className={`px-2 py-1 text-xs rounded-full ${
                    provider.membershipTier === 'elite' ? 'bg-purple-100 text-purple-700' :
                    provider.membershipTier === 'premium' ? 'bg-yellow-100 text-yellow-700' :
                    provider.membershipTier === 'verified' ? 'bg-green-100 text-green-700' :
                    'bg-gray-100 text-gray-600'
                  }`}>
                    {provider.membershipTier}
                  </span>
                  <span className="text-sm text-gray-500">★ {provider.rating}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
