import type { Metadata } from 'next';
import Link from 'next/link';
import serviceProvidersData from '@/data/serviceProviders.json';
import { getServiceCategory, serviceCategories } from '@/data/serviceCategories';
import { getAggregatePageLinks } from '@/data/internalLinks';
import { guides } from '@/data/guides';

export const metadata: Metadata = {
  title: "Top Rated Service Providers in Boerne TX | Boerne's Handy Hub",
  description: 'Discover the highest-rated service providers in Boerne, Texas. 4.5+ star rated professionals trusted by your neighbors for quality home services.',
  keywords: ['best contractors boerne', 'top rated plumber boerne', 'best electrician boerne tx', 'highly rated home services'],
  openGraph: {
    title: "Top Rated Service Providers in Boerne TX | Boerne's Handy Hub",
    description: 'Discover the highest-rated service providers in Boerne, Texas.',
    type: 'website',
    url: 'https://boerneshandyhub.com/top-rated',
  },
  alternates: {
    canonical: '/top-rated',
  },
};

export default function TopRatedPage() {
  // Filter providers with 4.5+ rating, sorted by rating then review count
  const topRatedProviders = serviceProvidersData.providers
    .filter(provider => provider.rating >= 4.5)
    .sort((a, b) => {
      if (b.rating !== a.rating) return b.rating - a.rating;
      return b.reviewCount - a.reviewCount;
    });

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://boerneshandyhub.com' },
      { '@type': 'ListItem', position: 2, name: 'Top Rated', item: 'https://boerneshandyhub.com/top-rated' },
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
        <div className="bg-gradient-to-r from-yellow-500 to-yellow-600">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="text-center">
              <div className="text-6xl mb-4">⭐</div>
              <h1 className="text-4xl font-bold text-white mb-4">
                Top Rated in Boerne
              </h1>
              <p className="text-xl text-yellow-100 mb-6 max-w-2xl mx-auto">
                The best of the best. These service providers have earned 4.5+ star ratings from Boerne homeowners.
              </p>
              <nav className="flex items-center justify-center space-x-2 text-sm text-yellow-100">
                <Link href="/" className="hover:text-white">Home</Link>
                <span>›</span>
                <span className="text-white">Top Rated</span>
              </nav>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="bg-white border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <div className="text-3xl font-bold text-boerne-navy">{topRatedProviders.length}</div>
                <div className="text-sm text-boerne-dark-gray">Top Rated Providers</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-boerne-navy">4.5+</div>
                <div className="text-sm text-boerne-dark-gray">Minimum Rating</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-boerne-navy">
                  {topRatedProviders.reduce((sum, p) => sum + p.reviewCount, 0).toLocaleString()}+
                </div>
                <div className="text-sm text-boerne-dark-gray">Total Reviews</div>
              </div>
            </div>
          </div>
        </div>

        {/* Providers */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <h2 className="text-2xl font-bold text-boerne-navy mb-6">
            Highest Rated Service Providers
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {topRatedProviders.map((provider, index) => {
              const category = getServiceCategory(provider.category);
              return (
                <div key={provider.id} className="bg-white rounded-lg shadow-lg p-6 relative">
                  {index < 3 && (
                    <div className="absolute -top-2 -right-2 w-8 h-8 bg-yellow-400 rounded-full flex items-center justify-center text-white font-bold text-sm">
                      #{index + 1}
                    </div>
                  )}
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <span className="text-2xl mr-2">{category?.icon}</span>
                      <h3 className="text-xl font-bold text-boerne-navy inline">{provider.name}</h3>
                    </div>
                  </div>
                  <p className="text-sm text-boerne-dark-gray mb-2">{category?.name}</p>
                  <div className="flex items-center gap-2 mb-3">
                    <div className="flex">
                      {[...Array(5)].map((_, i) => (
                        <span key={i} className={i < Math.floor(provider.rating) ? 'text-yellow-400' : 'text-gray-300'}>
                          ★
                        </span>
                      ))}
                    </div>
                    <span className="font-bold text-boerne-navy">{provider.rating}</span>
                    <span className="text-sm text-gray-500">({provider.reviewCount} reviews)</span>
                  </div>
                  <div className="flex flex-wrap gap-2 mb-3">
                    {provider.licensed && (
                      <span className="bg-green-100 text-green-700 text-xs px-2 py-1 rounded">Licensed</span>
                    )}
                    {provider.insured && (
                      <span className="bg-blue-100 text-blue-700 text-xs px-2 py-1 rounded">Insured</span>
                    )}
                    {provider.membershipTier === 'elite' && (
                      <span className="bg-purple-100 text-purple-700 text-xs px-2 py-1 rounded">Elite</span>
                    )}
                  </div>
                  <p className="text-boerne-dark-gray text-sm mb-4 line-clamp-2">
                    {provider.description}
                  </p>
                  {provider.bernieRecommendation && (
                    <div className="bg-boerne-light-gray p-3 rounded-lg mb-4">
                      <p className="text-xs text-boerne-dark-gray italic">
                        &quot;{provider.bernieRecommendation}&quot;
                      </p>
                    </div>
                  )}
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

        {/* Browse by Category */}
        {(() => {
          const links = getAggregatePageLinks('top-rated');
          const relatedCats = links.categories
            .map(slug => serviceCategories.find(c => c.slug === slug))
            .filter(Boolean);
          return (
            <div className="bg-white py-12 border-t">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <h2 className="text-2xl font-bold text-boerne-navy mb-6">
                  Browse Top Rated by Category
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
          const links = getAggregatePageLinks('top-rated');
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

        {/* CTA */}
        <div className="bg-boerne-navy py-12">
          <div className="max-w-4xl mx-auto text-center px-4">
            <h2 className="text-2xl font-bold text-white mb-4">
              Want to Be Listed Among the Best?
            </h2>
            <p className="text-boerne-gold mb-6">
              Join Boerne&apos;s Handy Hub and let your quality work speak for itself.
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
