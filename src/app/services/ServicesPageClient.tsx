'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { topLevelCategories, searchSubcategories, getAllSubcategories } from '@/data/serviceCategories';

export default function ServicesPageClient() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [showResults, setShowResults] = useState(false);

  const searchResults = useMemo(() => {
    if (!searchQuery.trim()) return [];
    return searchSubcategories(searchQuery).slice(0, 8);
  }, [searchQuery]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim() && searchResults.length > 0) {
      const first = searchResults[0];
      router.push(`/services/${first.topCategory}/${first.slug}`);
    }
  };

  const allSubcategories = getAllSubcategories();

  return (
    <div className="bg-white min-h-screen">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-br from-boerne-navy via-boerne-dark-gray to-boerne-navy">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center">
            <h1 className="text-4xl lg:text-5xl font-bold text-white mb-4">
              Find Local Service Providers
            </h1>
            <p className="text-xl text-white/80 mb-10 max-w-2xl mx-auto">
              Browse {allSubcategories.length} service types across {topLevelCategories.length} categories.
              Connect with trusted professionals in Boerne and the Hill Country.
            </p>

            {/* Search Bar */}
            <form onSubmit={handleSearch} className="max-w-2xl mx-auto relative">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search for a service (e.g., plumber, mechanic, landscaping...)"
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    setShowResults(true);
                  }}
                  onFocus={() => setShowResults(true)}
                  onBlur={() => setTimeout(() => setShowResults(false), 200)}
                  className="w-full px-6 py-4 pr-24 rounded-xl text-lg focus:outline-none focus:ring-2 focus:ring-boerne-gold"
                />
                <button
                  type="submit"
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 px-6 py-2.5 bg-boerne-gold text-boerne-navy font-semibold rounded-lg hover:bg-boerne-gold-alt transition-colors"
                >
                  Search
                </button>
              </div>

              {/* Search Results Dropdown */}
              {showResults && searchResults.length > 0 && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl shadow-xl border border-gray-200 overflow-hidden z-50">
                  {searchResults.map((result) => {
                    const topCat = topLevelCategories.find(c => c.slug === result.topCategory);
                    return (
                      <Link
                        key={result.id}
                        href={`/services/${result.topCategory}/${result.slug}`}
                        className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition-colors"
                      >
                        <span className="text-2xl">{result.icon}</span>
                        <div className="flex-1 text-left">
                          <div className="font-medium text-gray-900">{result.name}</div>
                          <div className="text-sm text-gray-500">{topCat?.name}</div>
                        </div>
                        <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </Link>
                    );
                  })}
                </div>
              )}
            </form>
          </div>
        </div>

        {/* Decorative wave */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 60" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M0 60V30C360 0 720 60 1080 30C1260 15 1380 22.5 1440 30V60H0Z" fill="white"/>
          </svg>
        </div>
      </div>

      {/* 5 Top-Level Category Cards */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-semibold text-gray-900">Browse by Category</h2>
            <p className="mt-3 text-lg text-gray-600">Select a category to see available services</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
            {topLevelCategories.map((category) => (
              <Link
                key={category.id}
                href={`/services/${category.slug}`}
                className="group relative bg-gray-50 hover:bg-boerne-navy p-8 rounded-2xl text-center transition-all duration-300 hover:shadow-xl hover:-translate-y-1"
              >
                <div className="text-6xl mb-4">{category.icon}</div>
                <h3 className="text-xl font-semibold text-gray-900 group-hover:text-white transition-colors">
                  {category.name}
                </h3>
                <p className="mt-2 text-sm text-gray-500 group-hover:text-white/70 transition-colors">
                  {category.subcategories.length} services
                </p>
                <p className="mt-3 text-xs text-gray-400 group-hover:text-white/50 transition-colors line-clamp-2">
                  {category.description}
                </p>
                <div className={`absolute inset-x-0 bottom-0 h-1.5 ${category.color} rounded-b-2xl opacity-0 group-hover:opacity-100 transition-opacity`} />
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* All Services Quick Links */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-2xl font-semibold text-gray-900">All Services</h2>
            <p className="mt-2 text-gray-600">Quick links to every service type</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
            {topLevelCategories.map((topCat) => (
              <div key={topCat.id}>
                <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                  <span>{topCat.icon}</span>
                  {topCat.name}
                </h3>
                <ul className="space-y-1.5">
                  {topCat.subcategories.map((sub) => (
                    <li key={sub.id}>
                      <Link
                        href={`/services/${topCat.slug}/${sub.slug}`}
                        className="text-sm text-gray-600 hover:text-boerne-navy hover:underline transition-colors"
                      >
                        {sub.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-boerne-navy">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-semibold text-white mb-4">
            Are you a service provider?
          </h2>
          <p className="text-lg text-white/80 mb-8">
            Get your business listed on Boerne&apos;s Handy Hub and connect with local customers.
          </p>
          <Link
            href="/business"
            className="inline-flex items-center px-8 py-4 bg-boerne-gold text-boerne-navy font-semibold rounded-full hover:bg-boerne-gold-alt transition-colors"
          >
            Get Listed Free
            <svg className="ml-2 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </Link>
        </div>
      </section>
    </div>
  );
}
