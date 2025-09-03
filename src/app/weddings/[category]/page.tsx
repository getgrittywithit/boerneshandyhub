'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import weddingVendorsData from '@/data/weddingVendors.json';

interface WeddingVendor {
  id: string;
  name: string;
  category: string;
  subcategory: string;
  address: string;
  phone: string;
  website?: string;
  rating: number;
  priceLevel: string;
  description: string;
  membershipTier: 'basic' | 'verified' | 'premium' | 'elite';
  claimStatus: 'unclaimed' | 'pending' | 'verified' | 'rejected';
  specialOffers?: string[];
  bernieRecommendation?: string;
}

const categoryInfo: { [key: string]: { name: string; icon: string; description: string } } = {
  venues: {
    name: 'Wedding Venues',
    icon: '🏰',
    description: 'Stunning Hill Country venues for your special day'
  },
  photography: {
    name: 'Photography & Video',
    icon: '📸',
    description: 'Capture your memories with local professionals'
  },
  catering: {
    name: 'Catering & Bars',
    icon: '🍽️',
    description: 'Delicious dining and beverage options'
  },
  planning: {
    name: 'Wedding Planners',
    icon: '📋',
    description: 'Professional coordinators and planners'
  },
  music: {
    name: 'Music & Entertainment',
    icon: '🎵',
    description: 'DJs, bands, and entertainment for every style'
  },
  flowers: {
    name: 'Flowers & Decor',
    icon: '💐',
    description: 'Beautiful florals and decorations'
  },
  beauty: {
    name: 'Beauty & Wellness',
    icon: '💄',
    description: 'Look and feel your best on your wedding day'
  },
  transportation: {
    name: 'Transportation',
    icon: '🚗',
    description: 'Arrive in style with local transport options'
  },
  specialty: {
    name: 'Specialty Services',
    icon: '⭐',
    description: 'Unique touches for your perfect day'
  }
};

export default function WeddingCategoryPage() {
  const params = useParams();
  const category = params.category as string;
  const [vendors, setVendors] = useState<WeddingVendor[]>([]);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState('rating');
  const [filterTier, setFilterTier] = useState('all');

  const categoryData = categoryInfo[category] || {
    name: 'Wedding Vendors',
    icon: '💍',
    description: 'Find the perfect vendors for your special day'
  };

  useEffect(() => {
    // Load vendors for this category
    const categoryKey = category as keyof typeof weddingVendorsData;
    const categoryVendors = weddingVendorsData[categoryKey] || [];
    setVendors(categoryVendors as WeddingVendor[]);
    setLoading(false);
  }, [category]);

  const getTierBadge = (tier: string) => {
    switch (tier) {
      case 'basic':
        return <span className="bg-gray-100 text-gray-700 text-xs font-medium px-2 py-1 rounded-full">Basic</span>;
      case 'verified':
        return <span className="bg-green-100 text-green-700 text-xs font-medium px-2 py-1 rounded-full">✓ Verified</span>;
      case 'premium':
        return <span className="bg-boerne-gold text-boerne-navy text-xs font-medium px-2 py-1 rounded-full">⭐ Premium</span>;
      case 'elite':
        return <span className="bg-purple-100 text-purple-700 text-xs font-medium px-2 py-1 rounded-full">👑 Elite</span>;
      default:
        return null;
    }
  };

  const sortedAndFilteredVendors = vendors
    .filter(vendor => {
      if (filterTier === 'all') return true;
      return vendor.membershipTier === filterTier;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'rating':
          return b.rating - a.rating;
        case 'name':
          return a.name.localeCompare(b.name);
        case 'tier':
          const tierOrder = { elite: 4, premium: 3, verified: 2, basic: 1 };
          return tierOrder[b.membershipTier] - tierOrder[a.membershipTier];
        default:
          return 0;
      }
    });

  if (loading) {
    return (
      <div className="bg-boerne-light-gray min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-boerne-gold mx-auto"></div>
          <p className="mt-4 text-boerne-dark-gray">Loading vendors...</p>
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
              {categoryData.name}
            </h1>
            <p className="text-xl text-boerne-gold mb-6 max-w-2xl mx-auto">
              {categoryData.description}
            </p>
            <nav className="flex items-center justify-center space-x-2 text-sm text-boerne-gold">
              <Link href="/weddings" className="hover:text-white">Weddings</Link>
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
            <div className="flex items-center gap-4">
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
                  <option value="name">Name A-Z</option>
                  <option value="tier">Membership Tier</option>
                </select>
              </div>

              <div>
                <label htmlFor="filterTier" className="text-sm font-medium text-boerne-dark-gray mr-2">
                  Filter:
                </label>
                <select
                  id="filterTier"
                  value={filterTier}
                  onChange={(e) => setFilterTier(e.target.value)}
                  className="px-3 py-1 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-boerne-gold focus:border-transparent"
                >
                  <option value="all">All Vendors</option>
                  <option value="elite">Elite Only</option>
                  <option value="premium">Premium Only</option>
                  <option value="verified">Verified Only</option>
                  <option value="basic">Basic Only</option>
                </select>
              </div>
            </div>

            <div className="text-sm text-boerne-dark-gray">
              {sortedAndFilteredVendors.length} {sortedAndFilteredVendors.length === 1 ? 'vendor' : 'vendors'} found
            </div>
          </div>
        </div>
      </div>

      {/* Vendors Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {sortedAndFilteredVendors.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">😔</div>
            <h3 className="text-xl font-semibold text-boerne-navy mb-2">No vendors found</h3>
            <p className="text-boerne-dark-gray mb-4">Try adjusting your filters to see more results.</p>
            <button
              onClick={() => {
                setSortBy('rating');
                setFilterTier('all');
              }}
              className="px-4 py-2 bg-boerne-gold text-boerne-navy font-semibold rounded-lg hover:bg-boerne-gold-alt transition-colors"
            >
              Clear Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {sortedAndFilteredVendors.map((vendor) => (
              <div key={vendor.id} className="bg-white rounded-lg shadow-lg hover:shadow-xl transition-shadow">
                <div className="p-6">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-boerne-navy mb-1">{vendor.name}</h3>
                      <p className="text-sm text-boerne-dark-gray mb-2">{vendor.subcategory}</p>
                    </div>
                    {getTierBadge(vendor.membershipTier)}
                  </div>

                  <div className="flex items-center gap-1 mb-3">
                    <span className="text-yellow-400">★</span>
                    <span className="font-medium">{vendor.rating}</span>
                    <span className="text-boerne-dark-gray text-sm">• {vendor.priceLevel}</span>
                  </div>

                  <p className="text-boerne-dark-gray mb-4 text-sm line-clamp-2">
                    {vendor.description}
                  </p>

                  {vendor.specialOffers && vendor.specialOffers.length > 0 && (
                    <div className="bg-yellow-50 border border-yellow-200 p-2 rounded-lg mb-4">
                      <span className="text-yellow-700 text-xs font-medium">
                        🎉 Special Offer: {vendor.specialOffers[0]}
                      </span>
                    </div>
                  )}

                  {vendor.bernieRecommendation && (
                    <div className="bg-boerne-light-gray p-3 rounded-lg mb-4">
                      <div className="flex items-start gap-2">
                        <span className="text-lg">🤠</span>
                        <div>
                          <div className="text-xs font-medium text-boerne-navy mb-1">Bernie says:</div>
                          <p className="text-xs text-boerne-dark-gray italic line-clamp-2">
                            "{vendor.bernieRecommendation}"
                          </p>
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="flex items-center justify-between">
                    <div className="text-sm text-boerne-dark-gray">
                      📍 {vendor.address.split(',')[1]?.trim() || 'Boerne, TX'}
                    </div>
                    <Link
                      href={`/weddings/${category}/${vendor.id}`}
                      className="px-4 py-2 bg-boerne-gold text-boerne-navy font-semibold rounded-lg hover:bg-boerne-gold-alt transition-colors text-sm"
                    >
                      View Details →
                    </Link>
                  </div>

                  {vendor.claimStatus === 'unclaimed' && (
                    <div className="mt-3 pt-3 border-t border-gray-100">
                      <Link
                        href={`/weddings/${category}/${vendor.id}/claim`}
                        className="text-xs text-boerne-gold hover:text-boerne-gold-alt"
                      >
                        🏢 Own this business? Claim it →
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
            Don't see your business listed?
          </h2>
          <p className="text-boerne-gold mb-6">
            Join Boerne's premier wedding directory and connect with couples planning their dream weddings.
          </p>
          <Link
            href="/business/onboard"
            className="px-6 py-3 bg-boerne-gold text-boerne-navy font-semibold rounded-lg hover:bg-boerne-gold-alt transition-colors"
          >
            Add Your Business
          </Link>
        </div>
      </div>
    </div>
  );
}