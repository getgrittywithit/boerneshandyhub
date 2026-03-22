'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import serviceProvidersData from '@/data/serviceProviders.json';
import { getServiceCategory, serviceCategories, membershipTiers, type MembershipTier } from '@/data/serviceCategories';
import { getLocation, locationCategoryPages, locations } from '@/data/locations';
import { getSubcategoryPage, getSubcategoriesForCategory } from '@/data/subcategories';
import { getGuidesForCategory, getRelatedSubcategories, getRelatedCategories } from '@/data/internalLinks';
import { guides } from '@/data/guides';

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
  category: string;
  slug: string;
  pageType: 'location' | 'subcategory';
}

export default function SlugPageClient({ category, slug, pageType }: SlugPageClientProps) {
  const [providers, setProviders] = useState<ServiceProvider[]>([]);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState('rating');
  const [filterTier, setFilterTier] = useState('all');

  const categoryData = getServiceCategory(category);
  const location = pageType === 'location' ? getLocation(slug) : null;
  const subcategoryPage = pageType === 'subcategory' ? getSubcategoryPage(category, slug) : null;

  useEffect(() => {
    let filteredProviders = serviceProvidersData.providers.filter(
      p => p.category === category
    ) as ServiceProvider[];

    if (pageType === 'location' && location) {
      // Filter by service area
      filteredProviders = filteredProviders.filter(p =>
        p.serviceArea.some(area =>
          area.toLowerCase().includes(location.name.toLowerCase())
        )
      );
    } else if (pageType === 'subcategory' && subcategoryPage) {
      // Filter by subcategory
      filteredProviders = filteredProviders.filter(p =>
        p.subcategories.some(sub =>
          sub.toLowerCase().includes(subcategoryPage.subcategory.toLowerCase())
        )
      );
    }

    setProviders(filteredProviders);
    setLoading(false);
  }, [category, slug, pageType, location, subcategoryPage]);

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

  const sortedAndFilteredProviders = providers
    .filter(provider => {
      if (filterTier !== 'all' && provider.membershipTier !== filterTier) return false;
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
          <h1 className="text-2xl font-bold text-boerne-navy mb-4">Page Not Found</h1>
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

  // Page title and description based on type
  const pageTitle = pageType === 'location'
    ? `${categoryData.name} in ${location?.name}`
    : subcategoryPage?.h1 || `${subcategoryPage?.subcategory} Services`;

  const pageDescription = pageType === 'location'
    ? `Find trusted ${categoryData.name.toLowerCase()} professionals serving ${location?.name}, Texas and the surrounding Hill Country area.`
    : subcategoryPage?.intro || categoryData.description;

  return (
    <div className="bg-boerne-light-gray min-h-screen">
      {/* Header */}
      <div className="bg-gradient-to-r from-boerne-navy to-boerne-dark-gray">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <div className="text-6xl mb-4">{categoryData.icon}</div>
            <h1 className="text-4xl font-bold text-white mb-4">
              {pageTitle}
            </h1>
            <p className="text-xl text-boerne-gold mb-6 max-w-2xl mx-auto">
              {pageDescription}
            </p>
            <nav className="flex items-center justify-center space-x-2 text-sm text-boerne-gold">
              <Link href="/" className="hover:text-white">Home</Link>
              <span>›</span>
              <Link href="/services" className="hover:text-white">Services</Link>
              <span>›</span>
              <Link href={`/services/${category}`} className="hover:text-white">{categoryData.name}</Link>
              <span>›</span>
              <span className="text-white">
                {pageType === 'location' ? location?.name : subcategoryPage?.subcategory}
              </span>
            </nav>
          </div>
        </div>
      </div>

      {/* Location Info (for location pages) */}
      {pageType === 'location' && location && (
        <div className="bg-white border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <h2 className="text-lg font-semibold text-boerne-navy">
                  Serving {location.name}, {location.county} County
                </h2>
                <p className="text-sm text-boerne-dark-gray">
                  Also serving: {location.nearbyAreas.join(', ')}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <span className="bg-boerne-light-gray text-boerne-dark-gray text-xs px-3 py-1 rounded-full">
                  ZIP: {location.zipCodes.join(', ')}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

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
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-xl font-semibold text-boerne-navy mb-2">No providers found</h3>
            <p className="text-boerne-dark-gray mb-4">
              {pageType === 'location'
                ? `We're still adding ${categoryData.name.toLowerCase()} providers in ${location?.name}. Check back soon!`
                : `We're still adding providers for this service. Check back soon!`}
            </p>
            <Link
              href={`/services/${category}`}
              className="px-4 py-2 bg-boerne-gold text-boerne-navy font-semibold rounded-lg hover:bg-boerne-gold-alt transition-colors"
            >
              View All {categoryData.name} Providers
            </Link>
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
                        {provider.subcategories.slice(0, 2).join(' • ')}
                      </p>
                    </div>
                    {getTierBadge(provider.membershipTier)}
                  </div>

                  <div className="flex items-center gap-2 mb-3">
                    <div className="flex items-center">
                      <span className="text-yellow-400">★</span>
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
                        🎉 {provider.specialOffers[0]}
                      </span>
                    </div>
                  )}

                  {provider.bernieRecommendation && (
                    <div className="bg-boerne-light-gray p-3 rounded-lg mb-4">
                      <div className="flex items-start gap-2">
                        <span className="text-lg">🤠</span>
                        <div>
                          <div className="text-xs font-medium text-boerne-navy mb-1">Bernie says:</div>
                          <p className="text-xs text-boerne-dark-gray italic line-clamp-2">
                            &quot;{provider.bernieRecommendation}&quot;
                          </p>
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="flex items-center justify-between">
                    <div className="text-sm text-boerne-dark-gray">
                      📍 {provider.serviceArea[0]}
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
                        href="/business/onboard"
                        className="text-xs text-boerne-gold hover:text-boerne-gold-alt"
                      >
                        Own this business? Claim it →
                      </Link>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Related Locations (for location pages) */}
      {pageType === 'location' && location && (
        <div className="bg-white py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-2xl font-bold text-boerne-navy mb-6">
              {categoryData.name} in Nearby Areas
            </h2>
            <div className="flex flex-wrap gap-3">
              {location.nearbyAreas.map(area => {
                const areaSlug = area.toLowerCase().replace(/\s+/g, '-');
                const hasPage = locationCategoryPages.some(
                  p => p.category === category && p.location === areaSlug
                );
                return hasPage ? (
                  <Link
                    key={area}
                    href={`/services/${category}/${areaSlug}`}
                    className="px-4 py-2 bg-boerne-light-gray text-boerne-navy rounded-lg hover:bg-boerne-gold hover:text-boerne-navy transition-colors"
                  >
                    {categoryData.name} in {area}
                  </Link>
                ) : (
                  <Link
                    key={area}
                    href={`/services/${category}`}
                    className="px-4 py-2 bg-boerne-light-gray text-boerne-navy rounded-lg hover:bg-boerne-gold hover:text-boerne-navy transition-colors"
                  >
                    {categoryData.name} in {area}
                  </Link>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Other Services in This Location (for location pages) */}
      {pageType === 'location' && location && (() => {
        const otherCategoriesInLocation = locationCategoryPages
          .filter(p => p.location === slug && p.category !== category)
          .map(p => serviceCategories.find(c => c.slug === p.category))
          .filter(Boolean);
        if (otherCategoriesInLocation.length === 0) return null;
        return (
          <div className="bg-boerne-light-gray py-12">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <h2 className="text-2xl font-bold text-boerne-navy mb-6">
                Other Services in {location.name}
              </h2>
              <div className="flex flex-wrap gap-4">
                {otherCategoriesInLocation.slice(0, 6).map(cat => cat && (
                  <Link
                    key={cat.slug}
                    href={`/services/${cat.slug}/${slug}`}
                    className="flex items-center gap-3 px-5 py-3 bg-white rounded-lg hover:bg-boerne-gold transition-colors shadow-sm"
                  >
                    <span className="text-2xl">{cat.icon}</span>
                    <span className="font-medium text-boerne-navy">{cat.name}</span>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        );
      })()}

      {/* Related Services (for subcategory pages) */}
      {pageType === 'subcategory' && (() => {
        const relatedSubSlugs = getRelatedSubcategories(slug);
        const allSubcategories = getSubcategoriesForCategory(category);
        const relatedSubs = relatedSubSlugs
          .map(s => allSubcategories.find(sub => sub.slug === s))
          .filter(Boolean);
        const otherSubs = allSubcategories
          .filter(sub => sub.slug !== slug && !relatedSubSlugs.includes(sub.slug))
          .slice(0, 3);
        const displaySubs = [...relatedSubs, ...otherSubs].slice(0, 4);

        if (displaySubs.length === 0) return null;
        return (
          <div className="bg-white py-12">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <h2 className="text-2xl font-bold text-boerne-navy mb-6">
                Related {categoryData.name} Services
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {displaySubs.map(sub => sub && (
                  <Link
                    key={sub.slug}
                    href={`/services/${category}/${sub.slug}`}
                    className="p-4 bg-boerne-light-gray rounded-lg hover:bg-boerne-gold transition-colors group"
                  >
                    <h3 className="font-semibold text-boerne-navy group-hover:text-boerne-navy">
                      {sub.subcategory}
                    </h3>
                    <p className="text-sm text-boerne-dark-gray mt-1 line-clamp-2">
                      {sub.description.slice(0, 80)}...
                    </p>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        );
      })()}

      {/* Related Guides */}
      {(() => {
        const guideSlugs = getGuidesForCategory(category);
        const relatedGuides = guideSlugs.map(s => guides.find(g => g.slug === s)).filter(Boolean);
        if (relatedGuides.length === 0) return null;
        return (
          <div className={`${pageType === 'location' ? 'bg-white' : 'bg-boerne-light-gray'} py-12`}>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <h2 className="text-2xl font-bold text-boerne-navy mb-6">
                Helpful {categoryData.name} Guides
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {relatedGuides.slice(0, 3).map(guide => guide && (
                  <Link
                    key={guide.slug}
                    href={`/guides/${guide.slug}`}
                    className={`p-6 ${pageType === 'location' ? 'bg-boerne-light-gray' : 'bg-white'} rounded-lg hover:shadow-lg transition-shadow group`}
                  >
                    <h3 className="font-semibold text-boerne-navy mb-2 group-hover:text-boerne-gold">
                      {guide.title}
                    </h3>
                    <p className="text-sm text-boerne-dark-gray line-clamp-2">
                      {guide.metaDescription}
                    </p>
                    <span className="inline-block mt-3 text-boerne-gold text-sm font-medium">
                      Read Guide →
                    </span>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        );
      })()}

      {/* Related Categories */}
      {(() => {
        const relatedCategorySlugs = getRelatedCategories(category);
        const relatedCats = relatedCategorySlugs
          .map(s => serviceCategories.find(c => c.slug === s))
          .filter(Boolean);
        if (relatedCats.length === 0) return null;
        return (
          <div className={`${pageType === 'subcategory' ? 'bg-white' : 'bg-boerne-light-gray'} py-12`}>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <h2 className="text-2xl font-bold text-boerne-navy mb-6">
                You Might Also Need
              </h2>
              <div className="flex flex-wrap gap-4">
                {relatedCats.slice(0, 4).map(cat => cat && (
                  <Link
                    key={cat.slug}
                    href={`/services/${cat.slug}`}
                    className={`flex items-center gap-3 px-5 py-3 ${pageType === 'subcategory' ? 'bg-boerne-light-gray' : 'bg-white'} rounded-lg hover:bg-boerne-gold transition-colors shadow-sm`}
                  >
                    <span className="text-2xl">{cat.icon}</span>
                    <span className="font-medium text-boerne-navy">{cat.name}</span>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        );
      })()}

      {/* Call to Action */}
      <div className="bg-boerne-navy py-12">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-white mb-4">
            Are you a {categoryData.name.toLowerCase()} professional?
          </h2>
          <p className="text-boerne-gold mb-6">
            Join Boerne&apos;s Handy Hub and connect with customers in {location?.name || 'Boerne'} and beyond.
          </p>
          <Link
            href="/business/onboard"
            className="px-6 py-3 bg-boerne-gold text-boerne-navy font-semibold rounded-lg hover:bg-boerne-gold-alt transition-colors"
          >
            Get Listed Today
          </Link>
        </div>
      </div>
    </div>
  );
}
