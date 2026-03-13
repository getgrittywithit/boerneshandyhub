'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import serviceProvidersData from '@/data/serviceProviders.json';
import { getServiceCategory, membershipTiers, type MembershipTier } from '@/data/serviceCategories';

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

interface CategoryPageClientProps {
  category: string;
}

export default function CategoryPageClient({ category }: CategoryPageClientProps) {
  const [providers, setProviders] = useState<ServiceProvider[]>([]);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState('rating');
  const [filterTier, setFilterTier] = useState('all');
  const [filterSubcategory, setFilterSubcategory] = useState('all');

  const categoryData = getServiceCategory(category);

  useEffect(() => {
    // Load providers for this category
    const categoryProviders = serviceProvidersData.providers.filter(
      p => p.category === category
    ) as ServiceProvider[];
    setProviders(categoryProviders);
    setLoading(false);
  }, [category]);

  const getTierBadge = (tier: MembershipTier) => {
    switch (tier) {
      case 'basic':
        return <span className="bg-gray-100 text-gray-700 text-xs font-medium px-2 py-1 rounded-full">Basic</span>;
      case 'verified':
        return <span className="bg-green-100 text-green-700 text-xs font-medium px-2 py-1 rounded-full">Verified</span>;
      case 'premium':
        return <span className="bg-boerne-gold text-boerne-navy text-xs font-medium px-2 py-1 rounded-full">Premium</span>;
      case 'elite':
        return <span className="bg-purple-100 text-purple-700 text-xs font-medium px-2 py-1 rounded-full">Elite</span>;
      default:
        return null;
    }
  };

  // Get unique subcategories from providers
  const availableSubcategories = Array.from(
    new Set(providers.flatMap(p => p.subcategories))
  ).sort();

  const sortedAndFilteredProviders = providers
    .filter(provider => {
      if (filterTier !== 'all' && provider.membershipTier !== filterTier) return false;
      if (filterSubcategory !== 'all' && !provider.subcategories.includes(filterSubcategory)) return false;
      return true;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'rating':
          return b.rating - a.rating;
        case 'name':
          return a.name.localeCompare(b.name);
        case 'tier':
          return membershipTiers[b.membershipTier].priority - membershipTiers[a.membershipTier].priority;
        case 'reviews':
          return b.reviewCount - a.reviewCount;
        default:
          return 0;
      }
    });

  if (!categoryData) {
    return (
      <div className="bg-boerne-light-gray min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">?</div>
          <h1 className="text-2xl font-bold text-boerne-navy mb-4">Category Not Found</h1>
          <p className="text-boerne-dark-gray mb-6">We couldn't find the service category you're looking for.</p>
          <Link
            href="/services"
            className="px-6 py-3 bg-boerne-gold text-boerne-navy font-semibold rounded-lg hover:bg-boerne-gold-alt transition-colors"
          >
            Browse All Services
          </Link>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="bg-boerne-light-gray min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-boerne-gold mx-auto"></div>
          <p className="mt-4 text-boerne-dark-gray">Loading providers...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-boerne-light-gray min-h-screen">
      {/* Header */}
      <div className="bg-gradient-to-r from-boerne-navy to-boerne-dark-gray">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <div className="text-6xl mb-4">{categoryData.icon}</div>
            <h1 className="text-4xl font-bold text-white mb-4">
              {categoryData.name} in Boerne
            </h1>
            <p className="text-xl text-boerne-gold mb-6 max-w-2xl mx-auto">
              {categoryData.description}
            </p>
            <nav className="flex items-center justify-center space-x-2 text-sm text-boerne-gold">
              <Link href="/services" className="hover:text-white">Home Services</Link>
              <span>›</span>
              <span className="text-white">{categoryData.name}</span>
            </nav>
          </div>
        </div>
      </div>

      {/* Filters and Sort */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex flex-wrap items-center gap-4">
              <div>
                <label htmlFor="sortBy" className="text-sm font-medium text-boerne-dark-gray mr-2">
                  Sort by:
                </label>
                <select
                  id="sortBy"
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="px-3 py-1 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-boerne-gold focus:border-transparent"
                >
                  <option value="rating">Highest Rated</option>
                  <option value="reviews">Most Reviews</option>
                  <option value="name">Name A-Z</option>
                  <option value="tier">Membership Tier</option>
                </select>
              </div>

              <div>
                <label htmlFor="filterTier" className="text-sm font-medium text-boerne-dark-gray mr-2">
                  Tier:
                </label>
                <select
                  id="filterTier"
                  value={filterTier}
                  onChange={(e) => setFilterTier(e.target.value)}
                  className="px-3 py-1 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-boerne-gold focus:border-transparent"
                >
                  <option value="all">All Providers</option>
                  <option value="elite">Elite Only</option>
                  <option value="premium">Premium Only</option>
                  <option value="verified">Verified Only</option>
                  <option value="basic">Basic Only</option>
                </select>
              </div>

              {availableSubcategories.length > 0 && (
                <div>
                  <label htmlFor="filterSubcategory" className="text-sm font-medium text-boerne-dark-gray mr-2">
                    Service:
                  </label>
                  <select
                    id="filterSubcategory"
                    value={filterSubcategory}
                    onChange={(e) => setFilterSubcategory(e.target.value)}
                    className="px-3 py-1 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-boerne-gold focus:border-transparent"
                  >
                    <option value="all">All Services</option>
                    {availableSubcategories.map(sub => (
                      <option key={sub} value={sub}>{sub}</option>
                    ))}
                  </select>
                </div>
              )}
            </div>

            <div className="text-sm text-boerne-dark-gray">
              {sortedAndFilteredProviders.length} {sortedAndFilteredProviders.length === 1 ? 'provider' : 'providers'} found
            </div>
          </div>
        </div>
      </div>

      {/* Providers Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {sortedAndFilteredProviders.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">?</div>
            <h3 className="text-xl font-semibold text-boerne-navy mb-2">No providers found</h3>
            <p className="text-boerne-dark-gray mb-4">Try adjusting your filters to see more results.</p>
            <button
              onClick={() => {
                setSortBy('rating');
                setFilterTier('all');
                setFilterSubcategory('all');
              }}
              className="px-4 py-2 bg-boerne-gold text-boerne-navy font-semibold rounded-lg hover:bg-boerne-gold-alt transition-colors"
            >
              Clear Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {sortedAndFilteredProviders.map((provider) => (
              <div key={provider.id} className="bg-white rounded-lg shadow-lg hover:shadow-xl transition-shadow">
                <div className="p-6">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-boerne-navy mb-1">{provider.name}</h3>
                      <p className="text-sm text-boerne-dark-gray mb-2">
                        {provider.subcategories.slice(0, 2).join(' - ')}
                      </p>
                    </div>
                    {getTierBadge(provider.membershipTier)}
                  </div>

                  <div className="flex items-center gap-2 mb-3">
                    <div className="flex items-center">
                      <span className="text-yellow-400">*</span>
                      <span className="font-medium ml-1">{provider.rating}</span>
                    </div>
                    <span className="text-boerne-dark-gray text-sm">
                      ({provider.reviewCount} reviews)
                    </span>
                  </div>

                  <div className="flex flex-wrap gap-2 mb-3">
                    {provider.licensed && (
                      <span className="bg-green-50 text-green-700 text-xs px-2 py-1 rounded">
                        Licensed
                      </span>
                    )}
                    {provider.insured && (
                      <span className="bg-blue-50 text-blue-700 text-xs px-2 py-1 rounded">
                        Insured
                      </span>
                    )}
                    {provider.yearsInBusiness && (
                      <span className="bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded">
                        {provider.yearsInBusiness}+ years
                      </span>
                    )}
                  </div>

                  <p className="text-boerne-dark-gray mb-4 text-sm line-clamp-2">
                    {provider.description}
                  </p>

                  {provider.specialOffers && provider.specialOffers.length > 0 && (
                    <div className="bg-yellow-50 border border-yellow-200 p-2 rounded-lg mb-4">
                      <span className="text-yellow-700 text-xs font-medium">
                        {provider.specialOffers[0]}
                      </span>
                    </div>
                  )}

                  {provider.bernieRecommendation && (
                    <div className="bg-boerne-light-gray p-3 rounded-lg mb-4">
                      <div className="flex items-start gap-2">
                        <span className="text-lg">B</span>
                        <div>
                          <div className="text-xs font-medium text-boerne-navy mb-1">Bernie says:</div>
                          <p className="text-xs text-boerne-dark-gray italic line-clamp-2">
                            "{provider.bernieRecommendation}"
                          </p>
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="flex items-center justify-between">
                    <div className="text-sm text-boerne-dark-gray">
                      {provider.serviceArea[0] || 'Boerne'}
                    </div>
                    <Link
                      href={`/services/${category}/${provider.id}`}
                      className="px-4 py-2 bg-boerne-gold text-boerne-navy font-semibold rounded-lg hover:bg-boerne-gold-alt transition-colors text-sm"
                    >
                      Get Quote
                    </Link>
                  </div>

                  {provider.claimStatus === 'unclaimed' && (
                    <div className="mt-3 pt-3 border-t border-gray-100">
                      <Link
                        href="/business"
                        className="text-xs text-boerne-gold hover:text-boerne-gold-alt"
                      >
                        Own this business? Claim it
                      </Link>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Call to Action */}
      <div className="bg-boerne-navy py-12">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-white mb-4">
            Are you a {categoryData.name.toLowerCase()} professional?
          </h2>
          <p className="text-boerne-gold mb-6">
            Join Boerne Handy Hub and connect with homeowners looking for your services.
          </p>
          <Link
            href="/business"
            className="px-6 py-3 bg-boerne-gold text-boerne-navy font-semibold rounded-lg hover:bg-boerne-gold-alt transition-colors"
          >
            Get Listed
          </Link>
        </div>
      </div>
    </div>
  );
}
