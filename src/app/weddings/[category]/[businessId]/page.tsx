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
  amenities?: string[];
  services?: string[];
  capacity?: {
    ceremony: number;
    reception: number;
  };
  weddingStyles: string[];
  photos: string[];
  membershipTier: 'basic' | 'verified' | 'premium' | 'elite';
  claimStatus: 'unclaimed' | 'pending' | 'verified' | 'rejected';
  keywords: string[];
  specialOffers?: string[];
  bernieRecommendation?: string;
  coordinates?: {
    lat: number;
    lng: number;
  };
}

export default function BusinessDetailPage() {
  const params = useParams();
  const { category, businessId } = params;
  const [vendor, setVendor] = useState<WeddingVendor | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Find the vendor in the appropriate category
    const categoryKey = category as keyof typeof weddingVendorsData;
    const vendors = weddingVendorsData[categoryKey] || [];
    const foundVendor = vendors.find((v: WeddingVendor) => v.id === businessId);
    
    if (foundVendor) {
      setVendor(foundVendor as WeddingVendor);
    }
    setLoading(false);
  }, [category, businessId]);

  if (loading) {
    return (
      <div className="bg-boerne-light-gray min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-boerne-gold mx-auto"></div>
          <p className="mt-4 text-boerne-dark-gray">Loading vendor details...</p>
        </div>
      </div>
    );
  }

  if (!vendor) {
    return (
      <div className="bg-boerne-light-gray min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-boerne-navy mb-4">Vendor Not Found</h1>
          <Link 
            href="/weddings"
            className="text-boerne-gold hover:text-boerne-gold-alt"
          >
            ← Return to Wedding Directory
          </Link>
        </div>
      </div>
    );
  }

  const getTierBadge = (tier: string) => {
    switch (tier) {
      case 'basic':
        return <span className="bg-gray-100 text-gray-700 text-xs font-medium px-2 py-1 rounded-full">Basic Listing</span>;
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

  const getClaimButton = () => {
    if (vendor.claimStatus === 'unclaimed') {
      return (
        <Link
          href={`/weddings/${category}/${businessId}/claim`}
          className="w-full sm:w-auto px-6 py-3 bg-boerne-gold text-boerne-navy font-semibold rounded-lg hover:bg-boerne-gold-alt transition-colors text-center"
        >
          🏢 Claim This Business
        </Link>
      );
    } else if (vendor.claimStatus === 'pending') {
      return (
        <span className="w-full sm:w-auto px-6 py-3 bg-yellow-100 text-yellow-700 font-semibold rounded-lg text-center">
          📋 Claim Pending Review
        </span>
      );
    } else if (vendor.claimStatus === 'verified') {
      return (
        <span className="w-full sm:w-auto px-6 py-3 bg-green-100 text-green-700 font-semibold rounded-lg text-center">
          ✅ Verified Business
        </span>
      );
    }
    return null;
  };

  return (
    <div className="bg-boerne-light-gray min-h-screen">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <nav className="flex items-center space-x-2 text-sm text-boerne-dark-gray">
            <Link href="/weddings" className="hover:text-boerne-gold">Weddings</Link>
            <span>›</span>
            <Link href={`/weddings/${category}`} className="hover:text-boerne-gold capitalize">
              {category}
            </Link>
            <span>›</span>
            <span className="text-boerne-navy font-medium">{vendor.name}</span>
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Info */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-lg overflow-hidden">
              {/* Hero Section */}
              <div className="p-6">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4">
                  <div>
                    <h1 className="text-3xl font-bold text-boerne-navy mb-2">{vendor.name}</h1>
                    <div className="flex items-center gap-3 mb-2">
                      {getTierBadge(vendor.membershipTier)}
                      <span className="text-boerne-dark-gray">{vendor.subcategory}</span>
                    </div>
                    <div className="flex items-center gap-1 mb-2">
                      <span className="text-yellow-400">★</span>
                      <span className="font-medium">{vendor.rating}</span>
                      <span className="text-boerne-dark-gray">• {vendor.priceLevel}</span>
                    </div>
                  </div>
                </div>

                <p className="text-lg text-boerne-dark-gray mb-6">{vendor.description}</p>

                {vendor.bernieRecommendation && (
                  <div className="bg-boerne-light-gray p-4 rounded-lg mb-6">
                    <div className="flex items-start gap-3">
                      <div className="text-2xl">🤠</div>
                      <div>
                        <h4 className="font-semibold text-boerne-navy mb-1">Bernie's Recommendation:</h4>
                        <p className="text-boerne-dark-gray italic">"{vendor.bernieRecommendation}"</p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Wedding Styles */}
                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-boerne-navy mb-3">Wedding Styles</h3>
                  <div className="flex flex-wrap gap-2">
                    {vendor.weddingStyles.map((style, index) => (
                      <span
                        key={index}
                        className="px-3 py-1 bg-boerne-gold bg-opacity-20 text-boerne-navy text-sm rounded-full"
                      >
                        {style}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Amenities/Services */}
                {(vendor.amenities || vendor.services) && (
                  <div className="mb-6">
                    <h3 className="text-lg font-semibold text-boerne-navy mb-3">
                      {vendor.amenities ? 'Amenities' : 'Services'}
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {(vendor.amenities || vendor.services)?.map((item, index) => (
                        <div key={index} className="flex items-center gap-2">
                          <span className="text-green-500">✓</span>
                          <span className="text-boerne-dark-gray">{item}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Capacity */}
                {vendor.capacity && (
                  <div className="mb-6">
                    <h3 className="text-lg font-semibold text-boerne-navy mb-3">Capacity</h3>
                    <div className="flex gap-6">
                      <div>
                        <span className="text-sm text-boerne-dark-gray">Ceremony</span>
                        <div className="text-xl font-bold text-boerne-navy">{vendor.capacity.ceremony}</div>
                      </div>
                      <div>
                        <span className="text-sm text-boerne-dark-gray">Reception</span>
                        <div className="text-xl font-bold text-boerne-navy">{vendor.capacity.reception}</div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Special Offers */}
                {vendor.specialOffers && vendor.specialOffers.length > 0 && (
                  <div className="bg-yellow-50 border border-yellow-200 p-4 rounded-lg">
                    <h4 className="font-semibold text-yellow-800 mb-2">🎉 Special Offers</h4>
                    <ul className="space-y-1">
                      {vendor.specialOffers.map((offer, index) => (
                        <li key={index} className="text-yellow-700">• {offer}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Contact Info */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h3 className="text-lg font-semibold text-boerne-navy mb-4">Contact Information</h3>
              
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <span className="text-boerne-gold text-lg">📍</span>
                  <div>
                    <div className="font-medium text-boerne-dark-gray">{vendor.address}</div>
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  <span className="text-boerne-gold text-lg">📞</span>
                  <a
                    href={`tel:${vendor.phone}`}
                    className="text-boerne-navy hover:text-boerne-gold transition-colors"
                  >
                    {vendor.phone}
                  </a>
                </div>

                {vendor.website && (
                  <div className="flex items-center gap-3">
                    <span className="text-boerne-gold text-lg">🌐</span>
                    <a
                      href={vendor.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-boerne-navy hover:text-boerne-gold transition-colors"
                    >
                      Visit Website
                    </a>
                  </div>
                )}
              </div>

              <div className="mt-6 space-y-3">
                <button className="w-full px-4 py-2 bg-boerne-navy text-white font-semibold rounded-lg hover:bg-opacity-90 transition-colors">
                  📧 Send Message
                </button>
                
                <button className="w-full px-4 py-2 border border-boerne-gold text-boerne-gold font-semibold rounded-lg hover:bg-boerne-gold hover:text-boerne-navy transition-colors">
                  📅 Request Quote
                </button>
              </div>
            </div>

            {/* Claim Business */}
            {vendor.claimStatus === 'unclaimed' && (
              <div className="bg-gradient-to-r from-boerne-gold to-boerne-gold-alt rounded-lg shadow-lg p-6 text-center">
                <h3 className="text-lg font-semibold text-boerne-navy mb-2">Own This Business?</h3>
                <p className="text-boerne-navy mb-4 text-sm">
                  Claim your listing to manage your information, respond to reviews, and unlock premium features.
                </p>
                {getClaimButton()}
              </div>
            )}

            {/* Map Placeholder */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h3 className="text-lg font-semibold text-boerne-navy mb-4">Location</h3>
              <div className="bg-boerne-light-gray h-48 rounded-lg flex items-center justify-center">
                <span className="text-boerne-dark-gray">🗺️ Map Coming Soon</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}