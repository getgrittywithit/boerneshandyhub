'use client';

import { useState } from 'react';
import Link from 'next/link';
import { serviceBuckets, serviceCategories } from '@/data/serviceCategories';
import serviceProvidersData from '@/data/serviceProviders.json';

export default function CategoriesManagement() {
  const [selectedBucket, setSelectedBucket] = useState<string | null>(null);

  const getProviderCount = (categorySlug: string) => {
    return serviceProvidersData.providers.filter(p => p.category === categorySlug).length;
  };

  const getBucketStats = (bucketSlug: string) => {
    const categories = serviceCategories.filter(c => c.bucket === bucketSlug);
    const providerCount = serviceProvidersData.providers.filter(p =>
      categories.some(c => c.slug === p.category)
    ).length;
    return {
      categoryCount: categories.length,
      providerCount,
    };
  };

  return (
    <div className="p-8">
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Categories</h1>
        <p className="text-gray-500">Manage service buckets and categories</p>
      </div>

      {/* Buckets Grid */}
      <div className="mb-8">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Service Buckets</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {serviceBuckets.map((bucket) => {
            const stats = getBucketStats(bucket.slug);
            const isSelected = selectedBucket === bucket.slug;

            return (
              <button
                key={bucket.id}
                onClick={() => setSelectedBucket(isSelected ? null : bucket.slug)}
                className={`p-6 rounded-xl text-left transition-all ${
                  isSelected
                    ? 'bg-boerne-navy text-white shadow-lg ring-2 ring-boerne-gold'
                    : 'bg-white hover:shadow-md'
                }`}
              >
                <div className="flex items-center gap-3 mb-3">
                  <span className="text-3xl">{bucket.icon}</span>
                  <h3 className={`text-xl font-semibold ${isSelected ? 'text-white' : 'text-gray-900'}`}>
                    {bucket.name}
                  </h3>
                </div>
                <p className={`text-sm mb-3 ${isSelected ? 'text-white/70' : 'text-gray-500'}`}>
                  {bucket.description}
                </p>
                <div className="flex gap-4 text-sm">
                  <span className={isSelected ? 'text-boerne-gold' : 'text-gray-600'}>
                    {stats.categoryCount} categories
                  </span>
                  <span className={isSelected ? 'text-white/50' : 'text-gray-400'}>
                    {stats.providerCount} providers
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Categories List */}
      <div className="bg-white rounded-xl shadow-sm">
        <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center">
          <h2 className="text-lg font-semibold text-gray-900">
            {selectedBucket
              ? `${serviceBuckets.find(b => b.slug === selectedBucket)?.name} Categories`
              : 'All Categories'
            }
          </h2>
          <span className="text-sm text-gray-500">
            {selectedBucket
              ? serviceCategories.filter(c => c.bucket === selectedBucket).length
              : serviceCategories.length
            } categories
          </span>
        </div>

        <div className="divide-y divide-gray-100">
          {(selectedBucket
            ? serviceCategories.filter(c => c.bucket === selectedBucket)
            : serviceCategories
          ).map((category) => {
            const bucket = serviceBuckets.find(b => b.slug === category.bucket);
            const providerCount = getProviderCount(category.slug);

            return (
              <div key={category.id} className="px-6 py-4 hover:bg-gray-50">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <span className="text-2xl">{category.icon}</span>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-medium text-gray-900">{category.name}</h3>
                        {category.featured && (
                          <span className="px-2 py-0.5 text-xs bg-boerne-gold/20 text-boerne-gold-dark rounded-full">
                            Featured
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-gray-500">{category.description}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-6">
                    {!selectedBucket && (
                      <div className="text-sm text-gray-500">
                        {bucket?.icon} {bucket?.name}
                      </div>
                    )}
                    <div className="text-sm">
                      <span className="font-medium text-gray-900">{providerCount}</span>
                      <span className="text-gray-500 ml-1">providers</span>
                    </div>
                    <Link
                      href={`/services/${category.slug}`}
                      className="text-sm text-boerne-gold hover:text-boerne-gold-alt"
                      target="_blank"
                    >
                      View →
                    </Link>
                  </div>
                </div>

                {/* Subcategories */}
                {category.subcategories.length > 0 && (
                  <div className="mt-3 ml-10">
                    <div className="flex flex-wrap gap-2">
                      {category.subcategories.map((sub, idx) => (
                        <span
                          key={idx}
                          className="px-2 py-1 text-xs bg-gray-100 text-gray-600 rounded"
                        >
                          {sub}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Info Box */}
      <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-xl">
        <div className="flex gap-3">
          <span className="text-blue-500 text-xl">ℹ️</span>
          <div>
            <h3 className="font-medium text-blue-900">Category Management</h3>
            <p className="text-sm text-blue-700 mt-1">
              Categories are currently defined in the codebase. To add or modify categories,
              edit the <code className="bg-blue-100 px-1 rounded">src/data/serviceCategories.ts</code> file.
              Future updates will allow in-app category management with database storage.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
