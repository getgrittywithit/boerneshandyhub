import type { Metadata } from 'next';
import Link from 'next/link';
import { serviceCategories } from '@/data/serviceCategories';
import { getAggregatePageLinks } from '@/data/internalLinks';
import { guides } from '@/data/guides';

export const metadata: Metadata = {
  title: "New Homeowner Services in Boerne TX | Boerne's Handy Hub",
  description: 'Just moved to Boerne? Find essential home services for new homeowners. Trusted local providers for inspections, maintenance, repairs, and more in the Hill Country.',
  keywords: ['new homeowner boerne', 'home services boerne tx', 'new house checklist', 'boerne home maintenance'],
  openGraph: {
    title: "New Homeowner Services in Boerne TX | Boerne's Handy Hub",
    description: 'Just moved to Boerne? Find essential home services for new homeowners.',
    type: 'website',
    url: 'https://boerneshandyhub.com/new-homeowner',
  },
  alternates: {
    canonical: '/new-homeowner',
  },
};

const essentialServices = [
  {
    category: 'hvac',
    title: 'HVAC Inspection & Service',
    description: 'Get your AC and heating system inspected before summer heat or winter cold arrives.',
    priority: 'High',
    icon: '❄️',
  },
  {
    category: 'plumbing',
    title: 'Plumbing Inspection',
    description: 'Check for leaks, water heater condition, and locate your main water shut-off valve.',
    priority: 'High',
    icon: '🔧',
  },
  {
    category: 'electrical',
    title: 'Electrical Safety Check',
    description: 'Verify panel condition, outlet safety, and smoke detector placement.',
    priority: 'High',
    icon: '⚡',
  },
  {
    category: 'pest-control',
    title: 'Pest Inspection',
    description: 'Check for termites, scorpions, and other Hill Country pests before they become problems.',
    priority: 'High',
    icon: '🐜',
  },
  {
    category: 'roofing',
    title: 'Roof Inspection',
    description: 'Assess roof condition and remaining lifespan. Essential for Texas weather.',
    priority: 'Medium',
    icon: '🏠',
  },
  {
    category: 'landscaping',
    title: 'Lawn & Landscaping',
    description: 'Set up irrigation, learn your yard, and establish a maintenance routine.',
    priority: 'Medium',
    icon: '🌳',
  },
  {
    category: 'pool-spa',
    title: 'Pool Service Setup',
    description: 'If you have a pool, get it inspected and set up regular maintenance.',
    priority: 'Medium',
    icon: '🏊',
  },
  {
    category: 'handyman',
    title: 'General Handyman',
    description: 'Handle those move-in fixes, TV mounting, furniture assembly, and small repairs.',
    priority: 'Low',
    icon: '🛠️',
  },
];

export default function NewHomeownerPage() {
  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://boerneshandyhub.com' },
      { '@type': 'ListItem', position: 2, name: 'New Homeowner', item: 'https://boerneshandyhub.com/new-homeowner' },
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
        <div className="bg-gradient-to-r from-boerne-navy to-boerne-dark-gray">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="text-center">
              <div className="text-6xl mb-4">🏡</div>
              <h1 className="text-4xl font-bold text-white mb-4">
                Welcome to Boerne, New Homeowner!
              </h1>
              <p className="text-xl text-boerne-gold mb-6 max-w-2xl mx-auto">
                Just moved to the Hill Country? Here are the essential services every new homeowner needs.
              </p>
              <nav className="flex items-center justify-center space-x-2 text-sm text-boerne-gold">
                <Link href="/" className="hover:text-white">Home</Link>
                <span>›</span>
                <span className="text-white">New Homeowner</span>
              </nav>
            </div>
          </div>
        </div>

        {/* Welcome Section */}
        <div className="bg-white border-b">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <h2 className="text-2xl font-bold text-boerne-navy mb-4">Welcome to the Hill Country!</h2>
            <p className="text-boerne-dark-gray mb-4">
              Congratulations on your new home in Boerne! Whether you&apos;re coming from out of state or just
              moving within Texas, there are a few things unique to Hill Country living you should know:
            </p>
            <ul className="space-y-2 text-boerne-dark-gray">
              <li className="flex items-start gap-2">
                <span className="text-boerne-gold">•</span>
                <span><strong>Hard water</strong> is common - consider a water softener to protect pipes and appliances</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-boerne-gold">•</span>
                <span><strong>Scorpions and fire ants</strong> are part of life here - prevention is key</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-boerne-gold">•</span>
                <span><strong>Summer AC</strong> will work hard - annual maintenance is essential</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-boerne-gold">•</span>
                <span><strong>Occasional freezes</strong> can damage pipes - know your shut-off valves</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Essential Services */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <h2 className="text-2xl font-bold text-boerne-navy mb-6">
            Essential Services Checklist
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {essentialServices.map((service) => (
              <div key={service.category} className="bg-white rounded-lg shadow-lg p-6">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <span className="text-3xl">{service.icon}</span>
                    <div>
                      <h3 className="text-xl font-bold text-boerne-navy">{service.title}</h3>
                      <span className={`text-xs px-2 py-1 rounded-full ${
                        service.priority === 'High'
                          ? 'bg-red-100 text-red-700'
                          : service.priority === 'Medium'
                            ? 'bg-yellow-100 text-yellow-700'
                            : 'bg-gray-100 text-gray-600'
                      }`}>
                        {service.priority} Priority
                      </span>
                    </div>
                  </div>
                </div>
                <p className="text-boerne-dark-gray mb-4">{service.description}</p>
                <Link
                  href={`/services/${service.category}`}
                  className="inline-flex items-center px-4 py-2 bg-boerne-gold text-boerne-navy font-semibold rounded-lg hover:bg-boerne-gold-alt transition-colors text-sm"
                >
                  Find {serviceCategories.find(c => c.slug === service.category)?.name} Pros →
                </Link>
              </div>
            ))}
          </div>
        </div>

        {/* Related Guides */}
        {(() => {
          const links = getAggregatePageLinks('new-homeowner');
          const relatedGuides = links.guides
            .map(slug => guides.find(g => g.slug === slug))
            .filter(Boolean);
          if (relatedGuides.length === 0) return null;
          return (
            <div className="bg-boerne-light-gray py-12">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <h2 className="text-2xl font-bold text-boerne-navy mb-6">
                  Essential Guides for New Homeowners
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
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
        <div className="bg-white py-12">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-2xl font-bold text-boerne-navy mb-6">New Homeowner Tips</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-boerne-light-gray rounded-lg p-6">
                <h3 className="font-semibold text-boerne-navy mb-2">📋 First Week</h3>
                <ul className="text-sm text-boerne-dark-gray space-y-1">
                  <li>• Locate main water shut-off valve</li>
                  <li>• Find electrical panel and label breakers</li>
                  <li>• Test smoke and CO detectors</li>
                  <li>• Change locks or rekey</li>
                </ul>
              </div>
              <div className="bg-boerne-light-gray rounded-lg p-6">
                <h3 className="font-semibold text-boerne-navy mb-2">📆 First Month</h3>
                <ul className="text-sm text-boerne-dark-gray space-y-1">
                  <li>• Schedule HVAC inspection</li>
                  <li>• Get pest control evaluation</li>
                  <li>• Check roof condition</li>
                  <li>• Set up lawn care routine</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="bg-boerne-navy py-12">
          <div className="max-w-4xl mx-auto text-center px-4">
            <h2 className="text-2xl font-bold text-white mb-4">
              Questions About Your New Home?
            </h2>
            <p className="text-boerne-gold mb-6">
              Browse our guides or connect with trusted local professionals who know Boerne.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link
                href="/services"
                className="px-6 py-3 bg-boerne-gold text-boerne-navy font-semibold rounded-lg hover:bg-boerne-gold-alt transition-colors"
              >
                Browse All Services
              </Link>
              <Link
                href="/guides/home-maintenance-schedule"
                className="px-6 py-3 bg-white text-boerne-navy font-semibold rounded-lg hover:bg-gray-100 transition-colors"
              >
                View Maintenance Guide
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
