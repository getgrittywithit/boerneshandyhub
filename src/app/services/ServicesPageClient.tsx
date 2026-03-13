'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { serviceCategories, serviceBuckets, getFeaturedCategories } from '@/data/serviceCategories';
import serviceProvidersData from '@/data/serviceProviders.json';

const getProviderCountByCategory = (categorySlug: string) => {
  return serviceProvidersData.providers.filter(p => p.category === categorySlug).length;
};

export default function ServicesPageClient() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedBucket, setSelectedBucket] = useState<string | null>(null);

  const filteredCategories = useMemo(() => {
    let categories = serviceCategories;

    // Filter by bucket
    if (selectedBucket) {
      categories = categories.filter(cat => cat.bucket === selectedBucket);
    }

    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      categories = categories.filter(category =>
        category.name.toLowerCase().includes(query) ||
        category.description.toLowerCase().includes(query) ||
        category.subcategories.some(sub => sub.toLowerCase().includes(query))
      );
    }

    return categories;
  }, [selectedBucket, searchQuery]);

  const getBucketStats = (bucketSlug: string) => {
    const categories = serviceCategories.filter(c => c.bucket === bucketSlug);
    const providerCount = serviceProvidersData.providers.filter(p =>
      categories.some(c => c.slug === p.category)
    ).length;
    return { categoryCount: categories.length, providerCount };
  };

  return (
    <div className="bg-boerne-light-gray min-h-screen">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-r from-boerne-navy to-boerne-dark-gray">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <h1 className="text-5xl font-bold text-white mb-4">
              Find Trusted Local Services in Boerne
            </h1>
            <p className="text-xl text-boerne-gold mb-8 max-w-3xl mx-auto">
              Connect with licensed, insured, and highly-rated local professionals.
              From plumbers to pet groomers, we've got the Hill Country covered.
            </p>

            {/* Search Bar */}
            <div className="max-w-2xl mx-auto mb-8">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search for a service (e.g., plumber, mechanic, groomer...)"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full px-6 py-4 rounded-lg text-lg focus:outline-none focus:ring-2 focus:ring-boerne-gold"
                />
                <button className="absolute right-2 top-1/2 transform -translate-y-1/2 px-6 py-2 bg-boerne-gold text-boerne-navy font-semibold rounded-lg hover:bg-boerne-gold-alt transition-colors">
                  Search
                </button>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/business"
                className="px-8 py-3 bg-boerne-gold text-boerne-navy font-semibold rounded-lg hover:bg-boerne-gold-alt transition-colors"
              >
                List Your Business
              </Link>
              <Link
                href="#categories"
                className="px-8 py-3 border border-boerne-gold text-boerne-gold font-semibold rounded-lg hover:bg-boerne-gold hover:text-boerne-navy transition-colors"
              >
                Browse Categories
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Bucket Filter Tabs */}
      <div className="bg-white shadow-sm border-b sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2 py-4 overflow-x-auto">
            <button
              onClick={() => setSelectedBucket(null)}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
                selectedBucket === null
                  ? 'bg-boerne-navy text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              All Services
              <span className="text-xs opacity-75">({serviceCategories.length})</span>
            </button>
            {serviceBuckets.map((bucket) => {
              const stats = getBucketStats(bucket.slug);
              return (
                <button
                  key={bucket.id}
                  onClick={() => setSelectedBucket(bucket.slug)}
                  className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
                    selectedBucket === bucket.slug
                      ? 'bg-boerne-navy text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  <span>{bucket.icon}</span>
                  <span>{bucket.name}</span>
                  <span className="text-xs opacity-75">({stats.categoryCount})</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Featured Categories Quick Links */}
      {!selectedBucket && (
        <div className="bg-white shadow-sm border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <h2 className="text-lg font-semibold text-boerne-navy mb-4">Popular Services:</h2>
            <div className="flex flex-wrap gap-3">
              {getFeaturedCategories().map((category) => (
                <Link
                  key={category.id}
                  href={`/services/${category.slug}`}
                  className="px-4 py-2 rounded-full text-sm font-medium bg-boerne-light-gray text-boerne-dark-gray hover:bg-boerne-gold hover:text-boerne-navy transition-colors"
                >
                  {category.icon} {category.name}
                </Link>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Service Categories Grid */}
      <div id="categories" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-boerne-navy mb-4">
            {selectedBucket
              ? `${serviceBuckets.find(b => b.slug === selectedBucket)?.name} Services`
              : 'All Service Categories'
            }
          </h2>
          <p className="text-lg text-boerne-dark-gray">
            {selectedBucket
              ? serviceBuckets.find(b => b.slug === selectedBucket)?.description
              : 'Find the right professional for any job'
            }
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredCategories.map((category) => {
            const providerCount = getProviderCountByCategory(category.slug);
            const bucket = serviceBuckets.find(b => b.slug === category.bucket);
            return (
              <Link
                key={category.id}
                href={`/services/${category.slug}`}
                className={`bg-white rounded-lg shadow-lg hover:shadow-xl transition-shadow cursor-pointer block ${
                  category.featured ? 'ring-2 ring-boerne-gold ring-opacity-50' : ''
                }`}
              >
                <div className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="text-4xl">{category.icon}</div>
                    <div className="flex items-center gap-2">
                      {!selectedBucket && (
                        <span className="text-xs px-2 py-1 bg-gray-100 rounded-full text-gray-600">
                          {bucket?.icon} {bucket?.name}
                        </span>
                      )}
                      {category.featured && (
                        <span className="bg-boerne-gold text-boerne-navy text-xs font-bold px-2 py-1 rounded-full">
                          POPULAR
                        </span>
                      )}
                    </div>
                  </div>
                  <h3 className="text-xl font-bold text-boerne-navy mb-2">
                    {category.name}
                  </h3>
                  <p className="text-boerne-dark-gray mb-4">
                    {category.description}
                  </p>
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-sm font-medium text-boerne-light-blue">
                      {providerCount} providers available
                    </span>
                  </div>
                  <div className="space-y-1">
                    {category.subcategories.slice(0, 3).map((sub, index) => (
                      <div key={index} className="text-sm text-boerne-dark-gray">
                        - {sub}
                      </div>
                    ))}
                    {category.subcategories.length > 3 && (
                      <div className="text-sm text-boerne-light-blue font-medium">
                        +{category.subcategories.length - 3} more services
                      </div>
                    )}
                  </div>
                  <div className="mt-4">
                    <span className="text-boerne-gold hover:text-boerne-gold-alt font-medium transition-colors">
                      Find {category.name} Pros
                    </span>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>

        {filteredCategories.length === 0 && (
          <div className="text-center py-12">
            <p className="text-lg text-boerne-dark-gray">
              No services found matching "{searchQuery}". Try a different search term.
            </p>
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedBucket(null);
              }}
              className="mt-4 text-boerne-gold hover:text-boerne-gold-alt font-medium"
            >
              Clear filters
            </button>
          </div>
        )}
      </div>

      {/* Why Choose Local Providers */}
      <div className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-boerne-navy mb-4">
              Why Choose Boerne Handy Hub?
            </h2>
            <p className="text-lg text-boerne-dark-gray">
              We connect you with trusted local professionals who know the Hill Country
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-boerne-light-gray p-6 rounded-lg text-center">
              <div className="text-3xl mb-3">V</div>
              <h3 className="font-bold text-boerne-navy mb-2">Verified Professionals</h3>
              <p className="text-sm text-boerne-dark-gray">Licensed and insured providers you can trust</p>
            </div>
            <div className="bg-boerne-light-gray p-6 rounded-lg text-center">
              <div className="text-3xl mb-3">*</div>
              <h3 className="font-bold text-boerne-navy mb-2">Real Reviews</h3>
              <p className="text-sm text-boerne-dark-gray">Ratings from your Boerne neighbors</p>
            </div>
            <div className="bg-boerne-light-gray p-6 rounded-lg text-center">
              <div className="text-3xl mb-3">@</div>
              <h3 className="font-bold text-boerne-navy mb-2">Local Service</h3>
              <p className="text-sm text-boerne-dark-gray">Providers who know and serve our community</p>
            </div>
            <div className="bg-boerne-light-gray p-6 rounded-lg text-center">
              <div className="text-3xl mb-3">Q</div>
              <h3 className="font-bold text-boerne-navy mb-2">Easy Quotes</h3>
              <p className="text-sm text-boerne-dark-gray">Request quotes directly from providers</p>
            </div>
          </div>
        </div>
      </div>

      {/* Membership Tiers for Businesses */}
      <div className="py-16 bg-gradient-to-r from-boerne-green to-boerne-light-blue">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-white mb-4">
              Are You a Service Provider?
            </h2>
            <p className="text-xl text-white/90">
              Get listed and connect with customers in Boerne and the Hill Country
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 text-center">
            <div className="bg-white/10 backdrop-blur p-6 rounded-lg">
              <h3 className="text-lg font-bold text-white mb-2">Basic</h3>
              <p className="text-2xl font-bold text-boerne-gold mb-2">Free</p>
              <p className="text-white/80 text-sm">Listed in directory with basic profile</p>
            </div>
            <div className="bg-white/10 backdrop-blur p-6 rounded-lg">
              <h3 className="text-lg font-bold text-white mb-2">Verified</h3>
              <p className="text-2xl font-bold text-boerne-gold mb-2">$29/mo</p>
              <p className="text-white/80 text-sm">Verified badge, claim & edit profile</p>
            </div>
            <div className="bg-white/10 backdrop-blur p-6 rounded-lg ring-2 ring-boerne-gold">
              <h3 className="text-lg font-bold text-white mb-2">Premium</h3>
              <p className="text-2xl font-bold text-boerne-gold mb-2">$79/mo</p>
              <p className="text-white/80 text-sm">Featured placement, Bernie recommends</p>
            </div>
            <div className="bg-white/10 backdrop-blur p-6 rounded-lg">
              <h3 className="text-lg font-bold text-white mb-2">Elite</h3>
              <p className="text-2xl font-bold text-boerne-gold mb-2">$149/mo</p>
              <p className="text-white/80 text-sm">Homepage featured, top of listings</p>
            </div>
          </div>

          <div className="text-center mt-8">
            <Link
              href="/business"
              className="inline-block px-8 py-3 bg-boerne-gold text-boerne-navy font-semibold rounded-lg hover:bg-boerne-gold-alt transition-colors"
            >
              Get Listed Today
            </Link>
          </div>
        </div>
      </div>

      {/* Call to Action */}
      <div className="bg-boerne-navy py-16">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-white mb-4">
            Need Help Finding the Right Service?
          </h2>
          <p className="text-xl text-boerne-gold mb-8">
            Ask Bernie! Our AI assistant knows all the local providers and can help you find the perfect match.
          </p>
          <p className="text-white/80 mb-8">
            Just click the chat button in the corner to get personalized recommendations.
          </p>
        </div>
      </div>
    </div>
  );
}
