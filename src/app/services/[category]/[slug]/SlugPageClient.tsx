'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { getTopLevelCategory, getSubcategory, type MembershipTier } from '@/data/serviceCategories';
import ProviderCard from '@/components/ProviderCard';

interface ServiceProvider {
  id: string;
  name: string;
  category: string;
  subcategories: string[];
  description: string;
  address: string;
  phone: string;
  email: string;
  website?: string;
  rating: number;
  reviewCount: number;
  membershipTier: MembershipTier;
  claimStatus: 'unclaimed' | 'pending' | 'verified';
  yearsInBusiness?: number;
  licensed: boolean;
  insured: boolean;
  services: string[];
  serviceArea: string[];
  photos: string[];
  bernieRecommendation?: string;
  specialOffers?: string[];
  keywords: string[];
  coordinates?: { lat: number; lng: number };
  createdAt: string;
  updatedAt: string;
}

interface SlugPageClientProps {
  topCategorySlug: string;
  subcategorySlug: string;
  initialProviders: ServiceProvider[];
}

export default function SlugPageClient({ topCategorySlug, subcategorySlug, initialProviders }: SlugPageClientProps) {
  const [sortBy, setSortBy] = useState('rating');
  const [filterTier, setFilterTier] = useState('all');

  const topCategory = getTopLevelCategory(topCategorySlug);
  const subcategory = getSubcategory(topCategorySlug, subcategorySlug);

  // Apply sorting and filtering to server-provided providers
  const providers = useMemo(() => {
    let filtered = [...initialProviders];

    // Filter by tier
    if (filterTier !== 'all') {
      filtered = filtered.filter(p => p.membershipTier === filterTier);
    }

    // Sort
    switch (sortBy) {
      case 'rating':
        filtered.sort((a, b) => b.rating - a.rating);
        break;
      case 'reviews':
        filtered.sort((a, b) => b.reviewCount - a.reviewCount);
        break;
      case 'name':
        filtered.sort((a, b) => a.name.localeCompare(b.name));
        break;
    }

    // Always prioritize by membership tier
    filtered.sort((a, b) => {
      const tierPriority = { elite: 4, premium: 3, verified: 2, basic: 1 };
      return (tierPriority[b.membershipTier] || 0) - (tierPriority[a.membershipTier] || 0);
    });

    return filtered;
  }, [initialProviders, sortBy, filterTier]);

  if (!topCategory || !subcategory) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Service Not Found</h1>
          <Link href="/services" className="text-boerne-gold hover:underline">
            Browse all services
          </Link>
        </div>
      </div>
    );
  }

  // Get related subcategories from the same top category
  const relatedSubcategories = topCategory.subcategories
    .filter(s => s.slug !== subcategorySlug)
    .slice(0, 6);

  return (
    <div className="bg-white min-h-screen">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-br from-boerne-navy via-boerne-dark-gray to-boerne-navy">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* Breadcrumb */}
          <nav className="mb-6">
            <ol className="flex items-center gap-2 text-sm text-white/60">
              <li>
                <Link href="/" className="hover:text-white transition-colors">Home</Link>
              </li>
              <li>/</li>
              <li>
                <Link href="/services" className="hover:text-white transition-colors">Services</Link>
              </li>
              <li>/</li>
              <li>
                <Link href={`/services/${topCategorySlug}`} className="hover:text-white transition-colors">
                  {topCategory.name}
                </Link>
              </li>
              <li>/</li>
              <li className="text-white font-medium">{subcategory.name}</li>
            </ol>
          </nav>

          <div className="flex items-center gap-4 mb-4">
            <span className="text-5xl">{subcategory.icon}</span>
            <div>
              <h1 className="text-3xl lg:text-4xl font-bold text-white">
                {subcategory.name} in Boerne, TX
              </h1>
              <p className="mt-2 text-lg text-white/80">
                {subcategory.description}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4 text-white/70">
            <span className="flex items-center gap-1">
              <span className="text-boerne-gold font-semibold">{providers.length}</span> providers available
            </span>
          </div>
        </div>

        {/* Decorative wave */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 40" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M0 40V20C360 0 720 40 1080 20C1260 10 1380 15 1440 20V40H0Z" fill="#f9fafb"/>
          </svg>
        </div>
      </div>

      {/* Filters & Results */}
      <div className="bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Filter Bar */}
          <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
            <div className="flex items-center gap-3">
              <label className="text-sm text-gray-600">Sort by:</label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-boerne-gold"
              >
                <option value="rating">Highest Rated</option>
                <option value="reviews">Most Reviews</option>
                <option value="name">Name A-Z</option>
              </select>
            </div>

            <div className="flex items-center gap-3">
              <label className="text-sm text-gray-600">Filter:</label>
              <select
                value={filterTier}
                onChange={(e) => setFilterTier(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-boerne-gold"
              >
                <option value="all">All Providers</option>
                <option value="elite">Elite Only</option>
                <option value="premium">Premium & Elite</option>
                <option value="verified">Verified & Up</option>
              </select>
            </div>
          </div>

          {/* Provider Grid */}
          {providers.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {providers.map((provider) => (
                <div key={provider.id} className="relative">
                  <ProviderCard
                    provider={provider}
                    topCategorySlug={topCategorySlug}
                    subcategorySlug={subcategorySlug}
                    subcategoryName={subcategory?.name}
                  />
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <div className="text-5xl mb-4">🔍</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                No providers found yet
              </h3>
              <p className="text-gray-600 mb-6">
                We&apos;re actively adding {subcategory.name.toLowerCase()} providers in Boerne.
              </p>
              <Link
                href="/business"
                className="inline-flex items-center px-6 py-3 bg-boerne-gold text-boerne-navy font-semibold rounded-lg hover:bg-boerne-gold-alt transition-colors"
              >
                Are you a {subcategory.name} provider? Get listed free
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* Related Services */}
      {relatedSubcategories.length > 0 && (
        <section className="py-12 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-6">
              Related {topCategory.name} Services
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              {relatedSubcategories.map((sub) => (
                <Link
                  key={sub.id}
                  href={`/services/${topCategorySlug}/${sub.slug}`}
                  className="group bg-gray-50 hover:bg-boerne-navy p-4 rounded-xl text-center transition-all"
                >
                  <div className="text-2xl mb-2">{sub.icon}</div>
                  <h3 className="text-sm font-medium text-gray-900 group-hover:text-white transition-colors">
                    {sub.name}
                  </h3>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* CTA Section */}
      <section className="py-16 bg-boerne-navy">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-semibold text-white mb-4">
            Offer {subcategory.name} Services?
          </h2>
          <p className="text-lg text-white mb-8">
            Get your business listed and connect with customers in Boerne looking for {subcategory.name.toLowerCase()} services.
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
