'use client';

import { useState } from 'react';
import Link from 'next/link';
import { getServiceCategory, membershipTiers, type MembershipTier } from '@/data/serviceCategories';
import QuoteRequestForm from '@/components/QuoteRequestForm';
import ProviderSEOContent from '@/components/ProviderSEOContent';
import serviceProvidersData from '@/data/serviceProviders.json';

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

interface ProviderPageClientProps {
  category: string;
  providerId: string;
  provider: ServiceProvider;
}

export default function ProviderPageClient({ category, providerId, provider }: ProviderPageClientProps) {
  const [showQuoteForm, setShowQuoteForm] = useState(false);

  const categoryData = getServiceCategory(category);

  const getTierBadge = (tier: MembershipTier) => {
    switch (tier) {
      case 'basic':
        return <span className="bg-gray-100 text-gray-700 text-xs font-medium px-2 py-1 rounded-full">Basic Listing</span>;
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

  return (
    <div className="bg-boerne-light-gray min-h-screen">
      {/* Header Breadcrumb */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <nav className="flex items-center space-x-2 text-sm text-boerne-dark-gray">
            <Link href="/services" className="hover:text-boerne-gold">Home Services</Link>
            <span>›</span>
            <Link href={`/services/${category}`} className="hover:text-boerne-gold">
              {categoryData?.name || 'Services'}
            </Link>
            <span>›</span>
            <span className="text-boerne-navy font-medium">{provider.name}</span>
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
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between mb-4">
                  <div>
                    <h1 className="text-3xl font-bold text-boerne-navy mb-2">{provider.name}</h1>
                    <div className="flex flex-wrap items-center gap-3 mb-2">
                      {getTierBadge(provider.membershipTier)}
                      <span className="text-boerne-dark-gray">
                        {provider.subcategories.slice(0, 2).join(' - ')}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 mb-2">
                      <div className="flex items-center">
                        <span className="text-yellow-400">*</span>
                        <span className="font-medium ml-1">{provider.rating}</span>
                      </div>
                      <span className="text-boerne-dark-gray">
                        ({provider.reviewCount} reviews)
                      </span>
                      {provider.yearsInBusiness && (
                        <span className="text-boerne-dark-gray">
                          - {provider.yearsInBusiness}+ years in business
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Credentials */}
                <div className="flex flex-wrap gap-3 mb-6">
                  {provider.licensed && (
                    <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-medium">
                      Licensed
                    </span>
                  )}
                  {provider.insured && (
                    <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm font-medium">
                      Insured
                    </span>
                  )}
                  {provider.claimStatus === 'verified' && (
                    <span className="bg-purple-100 text-purple-700 px-3 py-1 rounded-full text-sm font-medium">
                      Verified Business
                    </span>
                  )}
                </div>

                <p className="text-lg text-boerne-dark-gray mb-6">{provider.description}</p>

                {/* Staff Pick */}
                {provider.bernieRecommendation && (
                  <div className="bg-boerne-light-gray p-4 rounded-lg mb-6">
                    <div className="flex items-start gap-3">
                      <div className="text-2xl">⭐</div>
                      <div>
                        <h4 className="font-semibold text-boerne-navy mb-1">Why We Recommend:</h4>
                        <p className="text-boerne-dark-gray italic">"{provider.bernieRecommendation}"</p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Services Offered */}
                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-boerne-navy mb-3">Services Offered</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {provider.services.map((service, index) => (
                      <div key={index} className="flex items-center gap-2">
                        <span className="text-green-500">*</span>
                        <span className="text-boerne-dark-gray">{service}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Service Area */}
                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-boerne-navy mb-3">Service Area</h3>
                  <div className="flex flex-wrap gap-2">
                    {provider.serviceArea.map((area, index) => (
                      <span
                        key={index}
                        className="px-3 py-1 bg-boerne-light-gray text-boerne-dark-gray text-sm rounded-full"
                      >
                        {area}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Special Offers */}
                {provider.specialOffers && provider.specialOffers.length > 0 && (
                  <div className="bg-yellow-50 border border-yellow-200 p-4 rounded-lg">
                    <h4 className="font-semibold text-yellow-800 mb-2">Special Offers</h4>
                    <ul className="space-y-1">
                      {provider.specialOffers.map((offer, index) => (
                        <li key={index} className="text-yellow-700">- {offer}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>

            {/* Quote Request Form (Mobile) */}
            <div className="lg:hidden mt-6">
              <div className="bg-white rounded-lg shadow-lg p-6">
                <h3 className="text-lg font-semibold text-boerne-navy mb-4">Request a Quote</h3>
                <QuoteRequestForm
                  providerName={provider.name}
                  providerEmail={provider.email}
                  categoryName={categoryData?.name || 'Service'}
                />
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
                  <span className="text-boerne-gold text-lg">Location:</span>
                  <div>
                    <div className="font-medium text-boerne-dark-gray">{provider.address}</div>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <span className="text-boerne-gold text-lg">Phone:</span>
                  <a
                    href={`tel:${provider.phone}`}
                    className="text-boerne-navy hover:text-boerne-gold transition-colors font-medium"
                  >
                    {provider.phone}
                  </a>
                </div>

                <div className="flex items-center gap-3">
                  <span className="text-boerne-gold text-lg">Email:</span>
                  <a
                    href={`mailto:${provider.email}`}
                    className="text-boerne-navy hover:text-boerne-gold transition-colors"
                  >
                    {provider.email}
                  </a>
                </div>

                {provider.website && (
                  <div className="flex items-center gap-3">
                    <span className="text-boerne-gold text-lg">Web:</span>
                    <a
                      href={provider.website}
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
                <a
                  href={`tel:${provider.phone}`}
                  className="block w-full px-4 py-3 bg-boerne-navy text-white font-semibold rounded-lg hover:bg-opacity-90 transition-colors text-center"
                >
                  Call Now
                </a>

                <button
                  onClick={() => setShowQuoteForm(!showQuoteForm)}
                  className="w-full px-4 py-3 bg-boerne-gold text-boerne-navy font-semibold rounded-lg hover:bg-boerne-gold-alt transition-colors"
                >
                  Request Quote
                </button>
              </div>
            </div>

            {/* Quote Form (Desktop - Expandable) */}
            {showQuoteForm && (
              <div className="hidden lg:block bg-white rounded-lg shadow-lg p-6">
                <h3 className="text-lg font-semibold text-boerne-navy mb-4">Request a Quote</h3>
                <QuoteRequestForm
                  providerName={provider.name}
                  providerEmail={provider.email}
                  categoryName={categoryData?.name || 'Service'}
                />
              </div>
            )}

            {/* Claim Business */}
            {provider.claimStatus === 'unclaimed' && (
              <div className="bg-gradient-to-r from-boerne-gold to-boerne-gold-alt rounded-lg shadow-lg p-6 text-center">
                <h3 className="text-lg font-semibold text-boerne-navy mb-2">Own This Business?</h3>
                <p className="text-boerne-navy mb-4 text-sm">
                  Claim your listing to manage your information and unlock premium features.
                </p>
                <Link
                  href="/business"
                  className="inline-block w-full px-6 py-3 bg-boerne-navy text-white font-semibold rounded-lg hover:bg-opacity-90 transition-colors text-center"
                >
                  Claim This Business
                </Link>
              </div>
            )}

            {/* Map Placeholder */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h3 className="text-lg font-semibold text-boerne-navy mb-4">Location</h3>
              <div className="bg-boerne-light-gray h-48 rounded-lg flex items-center justify-center">
                <span className="text-boerne-dark-gray">Map Coming Soon</span>
              </div>
            </div>
          </div>
        </div>

        {/* SEO Content Section */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <ProviderSEOContent
            providerName={provider.name}
            categoryName={categoryData?.name || 'Service'}
            description={provider.description}
            services={provider.services}
            serviceArea={provider.serviceArea}
            yearsInBusiness={provider.yearsInBusiness}
            licensed={provider.licensed}
            insured={provider.insured}
            rating={provider.rating}
            reviewCount={provider.reviewCount}
          />
        </div>
      </div>

      {/* Related Providers */}
      <div className="bg-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-boerne-navy mb-6">
            Other {categoryData?.name} Providers in Boerne
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {serviceProvidersData.providers
              .filter(p => p.category === category && p.id !== providerId)
              .slice(0, 3)
              .map((otherProvider) => (
                <Link
                  key={otherProvider.id}
                  href={`/services/${category}/${otherProvider.id}`}
                  className="bg-boerne-light-gray rounded-lg p-4 hover:shadow-md transition-shadow"
                >
                  <h3 className="font-semibold text-boerne-navy mb-1">{otherProvider.name}</h3>
                  <div className="flex items-center gap-1 text-sm text-boerne-dark-gray">
                    <span className="text-yellow-400">*</span>
                    <span>{otherProvider.rating}</span>
                    <span>- {otherProvider.reviewCount} reviews</span>
                  </div>
                </Link>
              ))}
          </div>
          <div className="text-center mt-6">
            <Link
              href={`/services/${category}`}
              className="text-boerne-gold hover:text-boerne-gold-alt font-medium"
            >
              View all {categoryData?.name} providers
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
