import type { Metadata } from 'next';
import Link from 'next/link';
import serviceProvidersData from '@/data/serviceProviders.json';
import { getServiceCategory, serviceCategories } from '@/data/serviceCategories';
import { getAggregatePageLinks } from '@/data/internalLinks';
import { guides } from '@/data/guides';

export const metadata: Metadata = {
  title: "24/7 Emergency Services in Boerne TX | Boerne's Handy Hub",
  description: 'Find 24/7 emergency service providers in Boerne, Texas. Plumbers, electricians, HVAC technicians, and more available around the clock for urgent home repairs.',
  keywords: ['emergency plumber boerne', 'emergency electrician boerne', '24 hour hvac boerne', 'emergency home repair boerne tx'],
  openGraph: {
    title: "24/7 Emergency Services in Boerne TX | Boerne's Handy Hub",
    description: 'Find 24/7 emergency service providers in Boerne, Texas.',
    type: 'website',
    url: 'https://boerneshandyhub.com/emergency-services',
  },
  alternates: {
    canonical: '/emergency-services',
  },
};

export default function EmergencyServicesPage() {
  // Filter providers that offer emergency/24-hour services
  const emergencyProviders = serviceProvidersData.providers.filter(provider => {
    const keywords = provider.keywords.join(' ').toLowerCase();
    const services = provider.services.join(' ').toLowerCase();
    const description = provider.description.toLowerCase();

    return keywords.includes('emergency') ||
           keywords.includes('24 hour') ||
           keywords.includes('24/7') ||
           services.includes('emergency') ||
           description.includes('emergency') ||
           description.includes('24/7') ||
           description.includes('24 hour');
  });

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://boerneshandyhub.com' },
      { '@type': 'ListItem', position: 2, name: 'Emergency Services', item: 'https://boerneshandyhub.com/emergency-services' },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />

      <div className="bg-boerne-light-gray min-h-screen">
        {/* Header */}
        <div className="bg-gradient-to-r from-red-700 to-red-900">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="text-center">
              <div className="text-6xl mb-4">🚨</div>
              <h1 className="text-4xl font-bold text-white mb-4">
                24/7 Emergency Services in Boerne
              </h1>
              <p className="text-xl text-red-100 mb-6 max-w-2xl mx-auto">
                When emergencies happen, these trusted local providers are ready to help around the clock.
              </p>
              <nav className="flex items-center justify-center space-x-2 text-sm text-red-200">
                <Link href="/" className="hover:text-white">Home</Link>
                <span>›</span>
                <span className="text-white">Emergency Services</span>
              </nav>
            </div>
          </div>
        </div>

        {/* Emergency Tips */}
        <div className="bg-white border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="flex items-start gap-3">
                <span className="text-2xl">💧</span>
                <div>
                  <h3 className="font-semibold text-boerne-navy">Water Emergency?</h3>
                  <p className="text-sm text-boerne-dark-gray">Turn off main water valve, then call a plumber</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-2xl">⚡</span>
                <div>
                  <h3 className="font-semibold text-boerne-navy">Electrical Emergency?</h3>
                  <p className="text-sm text-boerne-dark-gray">Turn off power at breaker, evacuate if needed</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-2xl">🔥</span>
                <div>
                  <h3 className="font-semibold text-boerne-navy">Gas Smell?</h3>
                  <p className="text-sm text-boerne-dark-gray">Leave immediately, call 911 from outside</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Providers */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <h2 className="text-2xl font-bold text-boerne-navy mb-6">
            Emergency-Ready Service Providers
          </h2>

          {emergencyProviders.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-lg">
              <p className="text-boerne-dark-gray mb-4">
                We are adding emergency service providers. Check back soon!
              </p>
              <Link
                href="/services"
                className="px-4 py-2 bg-boerne-gold text-boerne-navy font-semibold rounded-lg"
              >
                Browse All Services
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {emergencyProviders.map(provider => {
                const category = getServiceCategory(provider.category);
                return (
                  <div key={provider.id} className="bg-white rounded-lg shadow-lg p-6">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <span className="text-2xl mr-2">{category?.icon}</span>
                        <h3 className="text-xl font-bold text-boerne-navy inline">{provider.name}</h3>
                      </div>
                      <span className="bg-red-100 text-red-700 text-xs font-medium px-2 py-1 rounded-full">
                        24/7
                      </span>
                    </div>
                    <p className="text-sm text-boerne-dark-gray mb-3">{category?.name}</p>
                    <div className="flex items-center gap-2 mb-3">
                      <span className="text-yellow-400">★</span>
                      <span className="font-medium">{provider.rating}</span>
                      <span className="text-sm text-gray-500">({provider.reviewCount} reviews)</span>
                    </div>
                    <p className="text-boerne-dark-gray text-sm mb-4 line-clamp-2">
                      {provider.description}
                    </p>
                    <div className="flex items-center justify-between">
                      <a
                        href={`tel:${provider.phone}`}
                        className="text-boerne-gold font-semibold hover:text-boerne-gold-alt"
                      >
                        {provider.phone}
                      </a>
                      <Link
                        href={`/services/${provider.category}/${provider.id}`}
                        className="px-4 py-2 bg-boerne-gold text-boerne-navy font-semibold rounded-lg hover:bg-boerne-gold-alt transition-colors text-sm"
                      >
                        View Details
                      </Link>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Related Service Categories */}
        {(() => {
          const links = getAggregatePageLinks('emergency-services');
          const relatedCats = links.categories
            .map(slug => serviceCategories.find(c => c.slug === slug))
            .filter(Boolean);
          return (
            <div className="bg-white py-12 border-t">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <h2 className="text-2xl font-bold text-boerne-navy mb-6">
                  Browse by Service Type
                </h2>
                <div className="flex flex-wrap gap-4">
                  {relatedCats.map(cat => cat && (
                    <Link
                      key={cat.slug}
                      href={`/services/${cat.slug}`}
                      className="flex items-center gap-3 px-5 py-3 bg-boerne-light-gray rounded-lg hover:bg-boerne-gold transition-colors"
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

        {/* Related Guides */}
        {(() => {
          const links = getAggregatePageLinks('emergency-services');
          const relatedGuides = links.guides
            .map(slug => guides.find(g => g.slug === slug))
            .filter(Boolean);
          if (relatedGuides.length === 0) return null;
          return (
            <div className="bg-boerne-light-gray py-12">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <h2 className="text-2xl font-bold text-boerne-navy mb-6">
                  Helpful Emergency Guides
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {relatedGuides.map(guide => guide && (
                    <Link
                      key={guide.slug}
                      href={`/guides/${guide.slug}`}
                      className="p-6 bg-white rounded-lg hover:shadow-lg transition-shadow group"
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

        {/* CTA */}
        <div className="bg-boerne-navy py-12">
          <div className="max-w-4xl mx-auto text-center px-4">
            <h2 className="text-2xl font-bold text-white mb-4">
              Do You Offer Emergency Services?
            </h2>
            <p className="text-boerne-gold mb-6">
              List your business on Boerne&apos;s Handy Hub and connect with customers who need you most.
            </p>
            <Link
              href="/business/onboard"
              className="px-6 py-3 bg-boerne-gold text-boerne-navy font-semibold rounded-lg hover:bg-boerne-gold-alt transition-colors"
            >
              Get Listed
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
