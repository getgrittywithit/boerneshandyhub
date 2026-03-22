import type { Metadata } from 'next';
import Link from 'next/link';
import serviceProvidersData from '@/data/serviceProviders.json';
import { getServiceCategory, serviceCategories } from '@/data/serviceCategories';
import { getAggregatePageLinks } from '@/data/internalLinks';
import { guides } from '@/data/guides';

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
}

export const metadata: Metadata = {
  title: "Licensed & Insured Contractors in Boerne TX | Boerne's Handy Hub",
  description: 'Find licensed and insured contractors in Boerne, Texas. Verified professionals for plumbing, electrical, HVAC, roofing, and more. Protect your home with trusted pros.',
  keywords: ['licensed contractor boerne', 'insured contractor boerne tx', 'verified contractors', 'licensed plumber boerne', 'licensed electrician boerne'],
  openGraph: {
    title: "Licensed & Insured Contractors in Boerne TX | Boerne's Handy Hub",
    description: 'Find licensed and insured contractors in Boerne, Texas.',
    type: 'website',
    url: 'https://boerneshandyhub.com/licensed-contractors',
  },
  alternates: {
    canonical: '/licensed-contractors',
  },
};

export default function LicensedContractorsPage() {
  // Filter providers that are both licensed and insured
  const licensedProviders = (serviceProvidersData.providers as ServiceProvider[])
    .filter(provider => provider.licensed && provider.insured)
    .sort((a, b) => b.rating - a.rating);

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://boerneshandyhub.com' },
      { '@type': 'ListItem', position: 2, name: 'Licensed Contractors', item: 'https://boerneshandyhub.com/licensed-contractors' },
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
        <div className="bg-gradient-to-r from-green-700 to-green-900">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="text-center">
              <div className="text-6xl mb-4">✅</div>
              <h1 className="text-4xl font-bold text-white mb-4">
                Licensed & Insured Contractors
              </h1>
              <p className="text-xl text-green-100 mb-6 max-w-2xl mx-auto">
                Work with confidence. All contractors listed here are licensed and carry proper insurance to protect you and your home.
              </p>
              <nav className="flex items-center justify-center space-x-2 text-sm text-green-200">
                <Link href="/" className="hover:text-white">Home</Link>
                <span>›</span>
                <span className="text-white">Licensed Contractors</span>
              </nav>
            </div>
          </div>
        </div>

        {/* Why Licensed Matters */}
        <div className="bg-white border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <h2 className="text-lg font-semibold text-boerne-navy mb-4 text-center">Why Licensing & Insurance Matter</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center p-4">
                <span className="text-3xl mb-2 block">📋</span>
                <h3 className="font-semibold text-boerne-navy">Licensed</h3>
                <p className="text-sm text-boerne-dark-gray">Verified credentials and proper training for their trade</p>
              </div>
              <div className="text-center p-4">
                <span className="text-3xl mb-2 block">🛡️</span>
                <h3 className="font-semibold text-boerne-navy">Insured</h3>
                <p className="text-sm text-boerne-dark-gray">Protected against accidents and property damage</p>
              </div>
              <div className="text-center p-4">
                <span className="text-3xl mb-2 block">⭐</span>
                <h3 className="font-semibold text-boerne-navy">Trusted</h3>
                <p className="text-sm text-boerne-dark-gray">Reviewed and rated by your Boerne neighbors</p>
              </div>
            </div>
          </div>
        </div>

        {/* Providers */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-boerne-navy">
              {licensedProviders.length} Licensed & Insured Providers
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {licensedProviders.map(provider => {
              const category = getServiceCategory(provider.category);
              return (
                <div key={provider.id} className="bg-white rounded-lg shadow-lg p-6">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <span className="text-2xl mr-2">{category?.icon}</span>
                      <h3 className="text-xl font-bold text-boerne-navy inline">{provider.name}</h3>
                    </div>
                  </div>
                  <p className="text-sm text-boerne-dark-gray mb-2">{category?.name}</p>
                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-yellow-400">★</span>
                    <span className="font-medium">{provider.rating}</span>
                    <span className="text-sm text-gray-500">({provider.reviewCount} reviews)</span>
                  </div>
                  <div className="flex flex-wrap gap-2 mb-3">
                    <span className="bg-green-100 text-green-700 text-xs px-2 py-1 rounded">✓ Licensed</span>
                    <span className="bg-blue-100 text-blue-700 text-xs px-2 py-1 rounded">✓ Insured</span>
                    {provider.yearsInBusiness && (
                      <span className="bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded">
                        {provider.yearsInBusiness}+ years
                      </span>
                    )}
                  </div>
                  <p className="text-boerne-dark-gray text-sm mb-4 line-clamp-2">
                    {provider.description}
                  </p>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-boerne-dark-gray">
                      📍 {provider.serviceArea[0]}
                    </span>
                    <Link
                      href={`/services/${provider.category}/${provider.id}`}
                      className="px-4 py-2 bg-boerne-gold text-boerne-navy font-semibold rounded-lg hover:bg-boerne-gold-alt transition-colors text-sm"
                    >
                      Get Quote
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Related Service Categories */}
        {(() => {
          const links = getAggregatePageLinks('licensed-contractors');
          const relatedCats = links.categories
            .map(slug => serviceCategories.find(c => c.slug === slug))
            .filter(Boolean);
          return (
            <div className="bg-white py-12 border-t">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <h2 className="text-2xl font-bold text-boerne-navy mb-6">
                  Browse Licensed Pros by Service
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
          const links = getAggregatePageLinks('licensed-contractors');
          const relatedGuides = links.guides
            .map(slug => guides.find(g => g.slug === slug))
            .filter(Boolean);
          if (relatedGuides.length === 0) return null;
          return (
            <div className="bg-boerne-light-gray py-12">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <h2 className="text-2xl font-bold text-boerne-navy mb-6">
                  Guides for Hiring Contractors
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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
              Are You a Licensed Contractor?
            </h2>
            <p className="text-boerne-gold mb-6">
              Showcase your credentials on Boerne&apos;s Handy Hub and connect with homeowners who value quality.
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
