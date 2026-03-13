'use client';

import { useState } from 'react';
import Link from "next/link";
import { useRouter } from 'next/navigation';
import FloatingChat from "@/components/FloatingChat";
import { serviceCategories } from '@/data/serviceCategories';
import serviceProvidersData from '@/data/serviceProviders.json';

export default function Home() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');

  // Get featured (elite) providers
  const featuredProviders = serviceProvidersData.providers
    .filter(p => p.membershipTier === 'elite')
    .slice(0, 4);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/services?q=${encodeURIComponent(searchQuery.trim())}`);
    } else {
      router.push('/services');
    }
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-boerne-navy via-boerne-dark-gray to-boerne-navy">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 pt-20 pb-24 lg:pt-28 lg:pb-32">
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="text-4xl lg:text-6xl font-bold tracking-tight text-white leading-tight">
              Find Trusted Home Services
              <span className="block text-boerne-gold mt-2">in Boerne, Texas</span>
            </h1>
            <p className="mt-6 text-xl text-white/80 leading-relaxed max-w-2xl mx-auto">
              Connect with licensed, insured, and highly-rated local professionals.
              From plumbers to contractors, we've got the Hill Country covered.
            </p>

            {/* Search Bar */}
            <form onSubmit={handleSearch} className="mt-10 max-w-2xl mx-auto">
              <div className="relative flex">
                <input
                  type="text"
                  placeholder="What service do you need? (e.g., plumber, electrician, AC repair...)"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="flex-1 px-6 py-4 rounded-l-xl text-lg focus:outline-none focus:ring-2 focus:ring-boerne-gold"
                />
                <button
                  type="submit"
                  className="px-8 py-4 bg-boerne-gold text-boerne-navy font-semibold rounded-r-xl hover:bg-boerne-gold-alt transition-colors"
                >
                  Search
                </button>
              </div>
            </form>

            <div className="mt-8 flex flex-wrap justify-center gap-3">
              <span className="text-white/60 text-sm">Popular:</span>
              {['Plumbing', 'Electrical', 'HVAC', 'Handyman'].map((service) => (
                <Link
                  key={service}
                  href={`/services/${service.toLowerCase()}`}
                  className="text-sm text-boerne-gold hover:text-boerne-gold-alt transition-colors"
                >
                  {service}
                </Link>
              ))}
            </div>
          </div>
        </div>

        {/* Decorative wave */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 100" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M0 100V50C360 0 720 100 1080 50C1260 25 1380 37.5 1440 50V100H0Z" fill="white"/>
          </svg>
        </div>
      </section>

      {/* Service Categories Grid */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-14">
            <h2 className="text-3xl lg:text-4xl font-semibold text-gray-900">
              Home Service Categories
            </h2>
            <p className="mt-4 text-lg text-gray-600">
              Find the right professional for any job around your home
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {serviceCategories.map((category) => (
              <Link
                key={category.id}
                href={`/services/${category.slug}`}
                className="group relative bg-gray-50 hover:bg-boerne-navy p-6 rounded-xl text-center transition-all duration-300 hover:shadow-lg"
              >
                <div className="text-4xl mb-3">{category.icon}</div>
                <h3 className="font-semibold text-gray-900 group-hover:text-white transition-colors">
                  {category.name}
                </h3>
                <p className="mt-1 text-xs text-gray-500 group-hover:text-white/70 transition-colors">
                  {serviceProvidersData.providers.filter(p => p.category === category.slug).length} providers
                </p>
                {category.featured && (
                  <span className="absolute top-2 right-2 w-2 h-2 bg-boerne-gold rounded-full" />
                )}
              </Link>
            ))}
          </div>

          <div className="text-center mt-10">
            <Link
              href="/services"
              className="inline-flex items-center px-6 py-3 bg-boerne-navy text-white font-medium rounded-full hover:bg-boerne-navy/90 transition-colors"
            >
              View All Services
              <svg className="ml-2 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
          </div>
        </div>
      </section>

      {/* Featured Providers */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-14">
            <h2 className="text-3xl lg:text-4xl font-semibold text-gray-900">
              Featured Providers
            </h2>
            <p className="mt-4 text-lg text-gray-600">
              Top-rated professionals trusted by your Boerne neighbors
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredProviders.map((provider) => {
              const category = serviceCategories.find(c => c.slug === provider.category);
              return (
                <Link
                  key={provider.id}
                  href={`/services/${provider.category}/${provider.id}`}
                  className="group bg-white p-6 rounded-xl border border-gray-200 hover:border-boerne-gold hover:shadow-lg transition-all duration-300"
                >
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-2xl">{category?.icon}</span>
                    <span className="px-2 py-1 bg-purple-100 text-purple-700 text-xs font-medium rounded-full">
                      💎 Elite
                    </span>
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-1 group-hover:text-boerne-navy transition-colors">
                    {provider.name}
                  </h3>
                  <p className="text-sm text-gray-500 mb-3">{category?.name}</p>
                  <div className="flex items-center gap-1 mb-3">
                    <span className="text-yellow-400">★</span>
                    <span className="font-medium">{provider.rating}</span>
                    <span className="text-gray-400 text-sm">({provider.reviewCount})</span>
                  </div>
                  {provider.bernieRecommendation && (
                    <p className="text-xs text-gray-600 italic line-clamp-2">
                      "🤠 {provider.bernieRecommendation}"
                    </p>
                  )}
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* Why Choose Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-3xl lg:text-4xl font-semibold text-gray-900 leading-tight">
                Why Boerne Handy Hub?
              </h2>
              <p className="mt-6 text-lg text-gray-600 leading-relaxed">
                We connect homeowners with trusted, local service professionals who know the
                Hill Country. Every provider is vetted, and many are recommended by Bernie himself.
              </p>

              <div className="mt-10 space-y-6">
                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                    <span className="text-xl">✅</span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">Verified Professionals</h3>
                    <p className="text-gray-600">Licensed and insured providers you can trust</p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-12 h-12 bg-yellow-100 rounded-xl flex items-center justify-center">
                    <span className="text-xl">⭐</span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">Real Reviews</h3>
                    <p className="text-gray-600">Ratings from your Boerne neighbors</p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                    <span className="text-xl">📍</span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">Local Service</h3>
                    <p className="text-gray-600">Providers who know and serve our community</p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                    <span className="text-xl">🤠</span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">Ask Bernie</h3>
                    <p className="text-gray-600">Our AI assistant knows all the local pros</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-6">
              <div className="text-center p-8 bg-gray-50 rounded-2xl">
                <div className="text-4xl lg:text-5xl font-semibold text-boerne-navy">100+</div>
                <div className="mt-2 text-gray-600">Service Providers</div>
              </div>
              <div className="text-center p-8 bg-gray-50 rounded-2xl">
                <div className="text-4xl lg:text-5xl font-semibold text-boerne-navy">10</div>
                <div className="mt-2 text-gray-600">Service Categories</div>
              </div>
              <div className="text-center p-8 bg-gray-50 rounded-2xl">
                <div className="text-4xl lg:text-5xl font-semibold text-boerne-navy">4.7</div>
                <div className="mt-2 text-gray-600">Avg. Rating</div>
              </div>
              <div className="text-center p-8 bg-gray-50 rounded-2xl">
                <div className="text-4xl lg:text-5xl font-semibold text-boerne-navy">24/7</div>
                <div className="mt-2 text-gray-600">Emergency Services</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* More Boerne Section - Secondary Content */}
      <section className="py-16 bg-gray-50 border-t">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-10">
            <h2 className="text-2xl font-semibold text-gray-900">
              Explore More of Boerne
            </h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <Link
              href="/dining"
              className="flex items-center gap-3 p-4 bg-white rounded-lg hover:shadow-md transition-shadow"
            >
              <span className="text-2xl">🍽️</span>
              <div>
                <h3 className="font-medium text-gray-900">Dining</h3>
                <p className="text-sm text-gray-500">Local restaurants</p>
              </div>
            </Link>
            <Link
              href="/weddings"
              className="flex items-center gap-3 p-4 bg-white rounded-lg hover:shadow-md transition-shadow"
            >
              <span className="text-2xl">💍</span>
              <div>
                <h3 className="font-medium text-gray-900">Weddings</h3>
                <p className="text-sm text-gray-500">Event vendors</p>
              </div>
            </Link>
            <Link
              href="/events"
              className="flex items-center gap-3 p-4 bg-white rounded-lg hover:shadow-md transition-shadow"
            >
              <span className="text-2xl">📅</span>
              <div>
                <h3 className="font-medium text-gray-900">Events</h3>
                <p className="text-sm text-gray-500">Community happenings</p>
              </div>
            </Link>
            <Link
              href="/outdoor"
              className="flex items-center gap-3 p-4 bg-white rounded-lg hover:shadow-md transition-shadow"
            >
              <span className="text-2xl">🌳</span>
              <div>
                <h3 className="font-medium text-gray-900">Outdoors</h3>
                <p className="text-sm text-gray-500">Parks & trails</p>
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-boerne-navy">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 text-center">
          <h2 className="text-3xl lg:text-4xl font-semibold text-white">
            Are you a home service provider?
          </h2>
          <p className="mt-4 text-lg text-white/80 max-w-2xl mx-auto">
            Join Boerne Handy Hub and connect with homeowners looking for your services.
            Get listed today and grow your business.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <Link
              href="/business"
              className="inline-flex items-center px-8 py-4 bg-boerne-gold text-boerne-navy font-semibold rounded-full hover:bg-boerne-gold-alt transition-colors"
            >
              Get Listed
              <svg className="ml-2 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
            <Link
              href="/services"
              className="inline-flex items-center px-8 py-4 border border-white text-white font-semibold rounded-full hover:bg-white hover:text-boerne-navy transition-colors"
            >
              Learn More
            </Link>
          </div>
        </div>
      </section>

      {/* Footer spacing for floating chat */}
      <div className="h-20" />

      {/* Floating Chat */}
      <FloatingChat />
    </div>
  );
}
