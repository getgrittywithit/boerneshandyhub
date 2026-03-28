import type { Metadata } from 'next';
import Link from 'next/link';
import serviceProvidersData from '@/data/serviceProviders.json';
import { getServiceCategory, serviceCategories } from '@/data/serviceCategories';
import { getAggregatePageLinks } from '@/data/internalLinks';
import { guides } from '@/data/guides';
import { generateItemListSchema, generateBreadcrumbSchema } from '@/utils/schema';

interface ServiceProvider {
  id: string;
  name: string;
  category: string;
  description: string;
  address: string;
  phone: string;
  email: string;
  website?: string;
  licensed: boolean;
  insured: boolean;
  services: string[];
  serviceArea: string[];
  rating: number;
  reviewCount: number;
  membershipTier: string;
  claimStatus: string;
  yearsInBusiness?: number;
  keywords: string[];
  specialOffers?: string[];
}

export const metadata: Metadata = {
  title: "Senior-Friendly Home Services in Boerne TX | Boerne's Handy Hub",
  description: 'Find trusted, patient, and reliable home service providers in Boerne who specialize in helping seniors. From home repairs to lawn care, get the help you need.',
  keywords: ['senior home services boerne', 'elderly home help boerne tx', 'home repair seniors', 'senior discount contractors'],
  openGraph: {
    title: "Senior-Friendly Home Services in Boerne TX | Boerne's Handy Hub",
    description: 'Find trusted, patient, and reliable home service providers for seniors in Boerne.',
    type: 'website',
    url: 'https://boerneshandyhub.com/senior-services',
  },
  alternates: {
    canonical: '/senior-services',
  },
};

const seniorFriendlyCategories = [
  { slug: 'handyman', reason: 'Help with everyday repairs and home modifications' },
  { slug: 'landscaping', reason: 'Keep your yard beautiful without the strain' },
  { slug: 'cleaning', reason: 'Regular cleaning to maintain a healthy home' },
  { slug: 'plumbing', reason: 'Fix leaks and update fixtures for safety' },
  { slug: 'electrical', reason: 'Better lighting and safety improvements' },
  { slug: 'hvac', reason: 'Stay comfortable in all seasons' },
];

export default function SeniorServicesPage() {
  // Get providers who offer senior discounts or have relevant keywords
  const seniorFriendlyProviders = (serviceProvidersData.providers as ServiceProvider[])
    .filter(provider => {
      const allText = [
        ...provider.keywords,
        provider.description,
        ...(provider.specialOffers || [])
      ].join(' ').toLowerCase();

      return allText.includes('senior') ||
             allText.includes('elder') ||
             allText.includes('discount') ||
             provider.yearsInBusiness && provider.yearsInBusiness >= 10;
    })
    .sort((a, b) => b.rating - a.rating)
    .slice(0, 6);

  // Generate structured data schemas
  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: 'Home', url: 'https://boerneshandyhub.com' },
    { name: 'Senior Services', url: 'https://boerneshandyhub.com/senior-services' },
  ]);

  const itemListSchema = generateItemListSchema(
    'Senior-Friendly Service Providers in Boerne, TX',
    'Trusted, patient home service providers in Boerne who specialize in helping seniors.',
    seniorFriendlyProviders.map(provider => ({
      name: provider.name,
      url: `https://boerneshandyhub.com/services/${provider.category}/${provider.id}`,
    }))
  );

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListSchema) }}
      />

      <div className="bg-boerne-light-gray min-h-screen">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-700 to-blue-900">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="text-center">
              <div className="text-6xl mb-4">🏠</div>
              <h1 className="text-4xl font-bold text-white mb-4">
                Senior-Friendly Home Services
              </h1>
              <p className="text-xl text-blue-100 mb-6 max-w-2xl mx-auto">
                Trusted, patient, and experienced service providers who understand the needs of senior homeowners in Boerne.
              </p>
              <nav className="flex items-center justify-center space-x-2 text-sm text-blue-200">
                <Link href="/" className="hover:text-white">Home</Link>
                <span>›</span>
                <span className="text-white">Senior Services</span>
              </nav>
            </div>
          </div>
        </div>

        {/* What to Look For */}
        <div className="bg-white border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <h2 className="text-xl font-bold text-boerne-navy mb-4 text-center">What We Look For in Senior-Friendly Providers</h2>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="text-center p-4">
                <span className="text-3xl mb-2 block">⭐</span>
                <h3 className="font-semibold text-boerne-navy">Highly Rated</h3>
                <p className="text-sm text-boerne-dark-gray">Trusted by your neighbors</p>
              </div>
              <div className="text-center p-4">
                <span className="text-3xl mb-2 block">🕐</span>
                <h3 className="font-semibold text-boerne-navy">Experienced</h3>
                <p className="text-sm text-boerne-dark-gray">Years of reliable service</p>
              </div>
              <div className="text-center p-4">
                <span className="text-3xl mb-2 block">💬</span>
                <h3 className="font-semibold text-boerne-navy">Clear Communication</h3>
                <p className="text-sm text-boerne-dark-gray">Explains work thoroughly</p>
              </div>
              <div className="text-center p-4">
                <span className="text-3xl mb-2 block">💲</span>
                <h3 className="font-semibold text-boerne-navy">Fair Pricing</h3>
                <p className="text-sm text-boerne-dark-gray">Many offer senior discounts</p>
              </div>
            </div>
          </div>
        </div>

        {/* Service Categories */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <h2 className="text-2xl font-bold text-boerne-navy mb-6">
            Common Services for Seniors
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {seniorFriendlyCategories.map(item => {
              const category = serviceCategories.find(c => c.slug === item.slug);
              if (!category) return null;
              return (
                <div key={item.slug} className="bg-white rounded-lg shadow-lg p-6">
                  <div className="flex items-center gap-3 mb-3">
                    <span className="text-3xl">{category.icon}</span>
                    <h3 className="text-xl font-bold text-boerne-navy">{category.name}</h3>
                  </div>
                  <p className="text-boerne-dark-gray mb-4">{item.reason}</p>
                  <Link
                    href={`/services/${item.slug}`}
                    className="inline-flex items-center text-boerne-gold font-semibold hover:text-boerne-gold-alt"
                  >
                    Find {category.name} Providers →
                  </Link>
                </div>
              );
            })}
          </div>
        </div>

        {/* Featured Providers */}
        {seniorFriendlyProviders.length > 0 && (
          <div className="bg-white py-12">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <h2 className="text-2xl font-bold text-boerne-navy mb-6">
                Experienced & Trusted Providers
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {seniorFriendlyProviders.map(provider => {
                  const category = getServiceCategory(provider.category);
                  return (
                    <div key={provider.id} className="bg-boerne-light-gray rounded-lg p-6">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <span className="text-2xl mr-2">{category?.icon}</span>
                          <h3 className="text-lg font-bold text-boerne-navy inline">{provider.name}</h3>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-yellow-400">★</span>
                        <span className="font-medium">{provider.rating}</span>
                        {provider.yearsInBusiness && (
                          <span className="text-sm text-gray-500">• {provider.yearsInBusiness}+ years</span>
                        )}
                      </div>
                      <p className="text-sm text-boerne-dark-gray mb-3 line-clamp-2">{provider.description}</p>
                      {provider.specialOffers && provider.specialOffers.some(offer =>
                        offer.toLowerCase().includes('senior') || offer.toLowerCase().includes('discount')
                      ) && (
                        <div className="bg-green-100 text-green-700 text-xs px-2 py-1 rounded mb-3 inline-block">
                          Senior Discount Available
                        </div>
                      )}
                      <div className="flex justify-between items-center">
                        <a href={`tel:${provider.phone}`} className="text-sm text-boerne-gold">
                          {provider.phone}
                        </a>
                        <Link
                          href={`/services/${provider.category}/${provider.id}`}
                          className="text-sm text-boerne-gold font-semibold hover:text-boerne-gold-alt"
                        >
                          View Details →
                        </Link>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* Related Guides */}
        {(() => {
          const links = getAggregatePageLinks('senior-services');
          const relatedGuides = links.guides
            .map(slug => guides.find(g => g.slug === slug))
            .filter(Boolean);
          if (relatedGuides.length === 0) return null;
          return (
            <div className="bg-boerne-light-gray py-12">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <h2 className="text-2xl font-bold text-boerne-navy mb-6">
                  Helpful Guides
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

        {/* Tips */}
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-xl font-bold text-boerne-navy mb-4">Tips for Seniors Hiring Home Services</h2>
            <ul className="space-y-3 text-boerne-dark-gray">
              <li className="flex items-start gap-2">
                <span className="text-boerne-gold font-bold">1.</span>
                <span>Always get written estimates before work begins</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-boerne-gold font-bold">2.</span>
                <span>Ask about senior discounts - many providers offer 10-15% off</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-boerne-gold font-bold">3.</span>
                <span>Have a trusted family member or friend review large quotes</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-boerne-gold font-bold">4.</span>
                <span>Never pay the full amount upfront - standard is 10-15% deposit</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-boerne-gold font-bold">5.</span>
                <span>Verify the provider is licensed and insured for your protection</span>
              </li>
            </ul>
          </div>
        </div>

        {/* CTA */}
        <div className="bg-boerne-navy py-12">
          <div className="max-w-4xl mx-auto text-center px-4">
            <h2 className="text-2xl font-bold text-white mb-4">
              Need Help Finding the Right Provider?
            </h2>
            <p className="text-boerne-gold mb-6">
              Browse our directory of trusted Boerne service providers, all reviewed by your neighbors.
            </p>
            <Link
              href="/services"
              className="px-6 py-3 bg-boerne-gold text-boerne-navy font-semibold rounded-lg hover:bg-boerne-gold-alt transition-colors"
            >
              Browse All Services
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
