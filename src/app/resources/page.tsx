'use client';

import Link from 'next/link';

const resourceSections = [
  {
    id: 'homeowners',
    title: 'For Homeowners',
    description: 'Tools and guides to maintain your Hill Country home',
    icon: '🏠',
    color: 'from-blue-500 to-blue-600',
    items: [
      {
        title: 'Home Maintenance Tracker',
        description: 'Track maintenance tasks, store paint colors & materials, never miss a filter change',
        href: '/my-home',
        badge: 'Free Tool',
        badgeColor: 'bg-green-100 text-green-700',
        live: true,
      },
      {
        title: 'Find a Pro',
        description: 'Browse trusted local contractors for any home project',
        href: '/services',
        badge: null,
        badgeColor: '',
        live: true,
      },
      {
        title: 'New Homeowner Guide',
        description: 'Moving to Boerne? Utility setup, first 30 days checklist, local tips',
        href: '/resources/new-homeowner',
        badge: 'Coming Soon',
        badgeColor: 'bg-gray-100 text-gray-500',
        live: false,
      },
    ],
  },
  {
    id: 'realtors',
    title: 'For Realtors',
    description: 'Resources to share with your clients',
    icon: '🔑',
    color: 'from-boerne-gold to-yellow-500',
    items: [
      {
        title: 'Trusted Vendor Directory',
        description: 'Recommend vetted local contractors to your clients with confidence',
        href: '/services',
        badge: null,
        badgeColor: '',
        live: true,
      },
      {
        title: 'Home Tracker for Clients',
        description: 'Share with new homeowners to help them maintain their investment',
        href: '/my-home',
        badge: 'Free Tool',
        badgeColor: 'bg-green-100 text-green-700',
        live: true,
      },
      {
        title: 'Referral Program',
        description: 'Get your own referral link and track when clients use the site',
        href: '/resources/realtor-referral',
        badge: 'Coming Soon',
        badgeColor: 'bg-gray-100 text-gray-500',
        live: false,
      },
    ],
  },
  {
    id: 'contractors',
    title: 'For Contractors & Businesses',
    description: 'Grow your business in the Boerne area',
    icon: '🔧',
    color: 'from-orange-500 to-red-500',
    items: [
      {
        title: 'Get Listed Free',
        description: 'Add your business to Boerne\'s trusted service directory',
        href: '/business/register',
        badge: 'Free',
        badgeColor: 'bg-green-100 text-green-700',
        live: true,
      },
      {
        title: 'Claim Your Listing',
        description: 'Already listed? Claim and manage your business profile',
        href: '/business',
        badge: null,
        badgeColor: '',
        live: true,
      },
      {
        title: 'Upgrade to Premium',
        description: 'Get more visibility, leads, and features with a premium listing',
        href: '/business',
        badge: null,
        badgeColor: '',
        live: true,
      },
    ],
  },
  {
    id: 'living',
    title: 'Living in Boerne',
    description: 'Discover what makes the Hill Country special',
    icon: '🌄',
    color: 'from-green-500 to-teal-500',
    items: [
      {
        title: 'Outdoor Activities',
        description: 'Trails, parks, swimming holes, and Hill Country adventures',
        href: '/outdoor',
        badge: null,
        badgeColor: '',
        live: true,
      },
      {
        title: 'Dining Guide',
        description: 'Best restaurants, cafes, and Hill Country cuisine',
        href: '/dining',
        badge: null,
        badgeColor: '',
        live: true,
      },
      {
        title: 'Events Calendar',
        description: 'Festivals, markets, concerts, and community happenings',
        href: '/events',
        badge: null,
        badgeColor: '',
        live: true,
      },
      {
        title: 'Local Marketplace',
        description: 'Farm fresh produce, local goods, and neighbor-to-neighbor commerce',
        href: '/marketplace',
        badge: null,
        badgeColor: '',
        live: true,
      },
    ],
  },
];

export default function ResourcesPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero */}
      <div className="bg-gradient-to-br from-boerne-navy via-boerne-dark-gray to-boerne-navy">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <h1 className="text-4xl lg:text-5xl font-bold text-white mb-4">
              Resources & Tools
            </h1>
            <p className="text-xl text-white/80 max-w-2xl mx-auto">
              Everything you need whether you're a homeowner, realtor, or local business
            </p>
          </div>
        </div>
      </div>

      {/* Resource Sections */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="space-y-12">
          {resourceSections.map((section) => (
            <div key={section.id} className="bg-white rounded-2xl shadow-lg overflow-hidden">
              {/* Section Header */}
              <div className={`bg-gradient-to-r ${section.color} px-6 py-4`}>
                <div className="flex items-center gap-3">
                  <span className="text-3xl">{section.icon}</span>
                  <div>
                    <h2 className="text-xl font-bold text-white">{section.title}</h2>
                    <p className="text-white/80 text-sm">{section.description}</p>
                  </div>
                </div>
              </div>

              {/* Section Items */}
              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {section.items.map((item) => (
                    <Link
                      key={item.href + item.title}
                      href={item.live ? item.href : '#'}
                      className={`group block p-4 rounded-xl border transition-all ${
                        item.live
                          ? 'border-gray-200 hover:border-boerne-gold hover:shadow-md cursor-pointer'
                          : 'border-gray-100 bg-gray-50 cursor-default'
                      }`}
                      onClick={item.live ? undefined : (e) => e.preventDefault()}
                    >
                      <div className="flex items-start justify-between mb-2">
                        <h3 className={`font-semibold ${
                          item.live ? 'text-gray-900 group-hover:text-boerne-navy' : 'text-gray-400'
                        }`}>
                          {item.title}
                        </h3>
                        {item.badge && (
                          <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${item.badgeColor}`}>
                            {item.badge}
                          </span>
                        )}
                      </div>
                      <p className={`text-sm ${item.live ? 'text-gray-600' : 'text-gray-400'}`}>
                        {item.description}
                      </p>
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Wedding Vendors CTA */}
        <div className="mt-12 bg-gradient-to-r from-pink-500 to-rose-500 rounded-2xl p-8 text-center">
          <h2 className="text-2xl font-bold text-white mb-2">Planning a Wedding?</h2>
          <p className="text-white/80 mb-6">Boerne is the wedding capital of Texas - find your perfect vendors</p>
          <Link
            href="/weddings"
            className="inline-block px-8 py-3 bg-white text-pink-600 font-semibold rounded-lg hover:bg-gray-100 transition-colors"
          >
            Browse Wedding Vendors
          </Link>
        </div>

        {/* Bottom CTA */}
        <div className="mt-8 bg-gradient-to-r from-boerne-navy to-boerne-dark-gray rounded-2xl p-8 text-center">
          <h2 className="text-2xl font-bold text-white mb-2">Need a Service Provider?</h2>
          <p className="text-white/70 mb-6">Browse our directory of trusted local professionals</p>
          <Link
            href="/services"
            className="inline-block px-8 py-3 bg-boerne-gold text-boerne-navy font-semibold rounded-lg hover:bg-boerne-gold-alt transition-colors"
          >
            Find a Pro
          </Link>
        </div>
      </div>
    </div>
  );
}
