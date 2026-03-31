import type { Metadata } from 'next';
import Link from 'next/link';
import { membershipTiers } from '@/data/serviceCategories';

export const metadata: Metadata = {
  title: "List Your Business | Boerne's Handy Hub",
  description: 'Join Boerne\'s leading home services directory. Reach local homeowners, get more leads, and grow your business in the Texas Hill Country.',
  keywords: ['list business boerne', 'home services directory', 'boerne contractor listing', 'texas hill country business'],
  openGraph: {
    title: "List Your Business | Boerne's Handy Hub",
    description: 'Join Boerne\'s leading home services directory.',
    type: 'website',
    url: 'https://boerneshandyhub.com/business',
  },
  alternates: {
    canonical: '/business',
  },
};

export default function BusinessPage() {
  const tiers = [
    {
      name: 'Free',
      price: '$0',
      period: 'forever',
      description: 'Get discovered by local homeowners',
      features: [
        'Listed in directory',
        'Basic business profile',
        'Category placement',
        'Contact info displayed',
      ],
      cta: 'Get Started Free',
      highlighted: false,
    },
    {
      name: 'Starter',
      price: '$39',
      period: '/month',
      description: 'Stand out with verified credentials',
      features: [
        'Everything in Free',
        'Verified badge',
        'We verify your license & insurance',
        'Display Licensed & Insured badges',
        'Edit your profile anytime',
        'Add photos (up to 5)',
        'Special offers section',
      ],
      cta: 'Get Verified',
      highlighted: false,
    },
    {
      name: 'Professional',
      price: '$79',
      period: '/month',
      description: 'Get more leads with priority placement',
      features: [
        'Everything in Starter',
        'Featured in your category',
        'Priority listing placement',
        'Unlimited photos',
        'Staff pick eligible',
        'Lead notifications',
      ],
      cta: 'Go Professional',
      highlighted: true,
    },
    {
      name: 'Featured',
      price: '$149',
      period: '/month',
      description: 'Maximum visibility for top providers',
      features: [
        'Everything in Professional',
        'Homepage spotlight',
        'Top of all listings',
        'Analytics dashboard',
        'Priority support',
        'Dedicated account rep',
      ],
      cta: 'Get Featured',
      highlighted: false,
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-boerne-navy via-boerne-navy to-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Grow Your Business in Boerne
            </h1>
            <p className="text-xl text-boerne-gold max-w-2xl mx-auto mb-8">
              Join the trusted directory that connects Hill Country homeowners with local service professionals.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/business/register"
                className="px-8 py-4 bg-boerne-gold text-boerne-navy font-semibold rounded-lg hover:bg-boerne-gold-alt transition-colors text-lg"
              >
                Register Your Business
              </Link>
              <Link
                href="/services"
                className="px-8 py-4 bg-white/10 text-white font-semibold rounded-lg hover:bg-white/20 transition-colors text-lg border border-white/30"
              >
                Already Listed? Claim It
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-3xl md:text-4xl font-bold text-boerne-navy">96+</div>
              <div className="text-gray-600">Local Businesses</div>
            </div>
            <div>
              <div className="text-3xl md:text-4xl font-bold text-boerne-navy">40+</div>
              <div className="text-gray-600">Service Categories</div>
            </div>
            <div>
              <div className="text-3xl md:text-4xl font-bold text-boerne-navy">20k+</div>
              <div className="text-gray-600">Monthly Searches</div>
            </div>
            <div>
              <div className="text-3xl md:text-4xl font-bold text-boerne-navy">100%</div>
              <div className="text-gray-600">Free to Start</div>
            </div>
          </div>
        </div>
      </div>

      {/* Why List Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Why List on Boerne's Handy Hub?
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            We're not another national directory. We're built by and for the Boerne community.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white rounded-xl p-6 shadow-sm">
            <div className="w-12 h-12 bg-boerne-gold/10 rounded-lg flex items-center justify-center text-2xl mb-4">
              📍
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Local Focus</h3>
            <p className="text-gray-600">
              We only serve Boerne and the Hill Country. Every visitor is a potential local customer looking for services in your area.
            </p>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm">
            <div className="w-12 h-12 bg-boerne-gold/10 rounded-lg flex items-center justify-center text-2xl mb-4">
              🎯
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Qualified Leads</h3>
            <p className="text-gray-600">
              Homeowners visit when they need services. No tire-kickers - just real customers ready to hire.
            </p>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm">
            <div className="w-12 h-12 bg-boerne-gold/10 rounded-lg flex items-center justify-center text-2xl mb-4">
              💰
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Free to Start</h3>
            <p className="text-gray-600">
              List your business for free. Upgrade when you're ready for more visibility and features.
            </p>
          </div>
        </div>
      </div>

      {/* Pricing Section */}
      <div className="bg-gray-100 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Simple, Transparent Pricing
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Start free and upgrade as your business grows. Cancel anytime.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {tiers.map((tier) => (
              <div
                key={tier.name}
                className={`bg-white rounded-xl p-6 shadow-sm ${
                  tier.highlighted ? 'ring-2 ring-boerne-gold' : ''
                }`}
              >
                {tier.highlighted && (
                  <div className="text-xs font-semibold text-boerne-gold uppercase tracking-wide mb-2">
                    Most Popular
                  </div>
                )}
                <h3 className="text-xl font-semibold text-gray-900">{tier.name}</h3>
                <div className="mt-2 mb-4">
                  <span className="text-3xl font-bold text-gray-900">{tier.price}</span>
                  <span className="text-gray-500">{tier.period}</span>
                </div>
                <p className="text-sm text-gray-600 mb-6">{tier.description}</p>
                <ul className="space-y-2 mb-6">
                  {tier.features.map((feature, index) => (
                    <li key={index} className="flex items-start gap-2 text-sm">
                      <span className="text-green-500">✓</span>
                      <span className="text-gray-600">{feature}</span>
                    </li>
                  ))}
                </ul>
                <Link
                  href="/business/register"
                  className={`block w-full text-center px-4 py-3 rounded-lg font-semibold transition-colors ${
                    tier.highlighted
                      ? 'bg-boerne-gold text-boerne-navy hover:bg-boerne-gold-alt'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {tier.cta}
                </Link>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Already Listed Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="bg-gradient-to-r from-boerne-gold to-boerne-gold-alt rounded-2xl p-8 md:p-12">
          <div className="md:flex items-center justify-between">
            <div className="mb-6 md:mb-0">
              <h2 className="text-2xl md:text-3xl font-bold text-boerne-navy mb-2">
                Already See Your Business Listed?
              </h2>
              <p className="text-boerne-navy/80 max-w-xl">
                We may have already added your business from public records. Claim your listing to take control of your profile and unlock premium features.
              </p>
            </div>
            <div className="flex-shrink-0">
              <Link
                href="/services"
                className="inline-block px-8 py-4 bg-boerne-navy text-white font-semibold rounded-lg hover:bg-opacity-90 transition-colors"
              >
                Find & Claim Your Listing
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* FAQ Section */}
      <div className="bg-white py-16">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
            Frequently Asked Questions
          </h2>

          <div className="space-y-6">
            <div className="border-b border-gray-200 pb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                How long does registration take?
              </h3>
              <p className="text-gray-600">
                Registration takes about 5 minutes. Your listing will be live within 1-2 business days after our team reviews it.
              </p>
            </div>

            <div className="border-b border-gray-200 pb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                What if my business is already listed?
              </h3>
              <p className="text-gray-600">
                We've added many local businesses from public records. Search for your business in our directory and click "Claim This Business" to take control of your listing.
              </p>
            </div>

            <div className="border-b border-gray-200 pb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Can I cancel my paid subscription?
              </h3>
              <p className="text-gray-600">
                Yes, you can cancel anytime. Your listing will remain active at the free tier after cancellation.
              </p>
            </div>

            <div className="border-b border-gray-200 pb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                What areas do you serve?
              </h3>
              <p className="text-gray-600">
                We focus on Boerne and the surrounding Hill Country communities including Fair Oaks Ranch, Leon Springs, Helotes, Comfort, and Bulverde.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-boerne-navy py-16">
        <div className="max-w-4xl mx-auto text-center px-4">
          <h2 className="text-3xl font-bold text-white mb-4">
            Ready to Reach More Customers?
          </h2>
          <p className="text-boerne-gold mb-8 text-lg">
            Join the growing list of trusted Boerne service providers.
          </p>
          <Link
            href="/business/register"
            className="inline-block px-10 py-4 bg-boerne-gold text-boerne-navy font-semibold rounded-lg hover:bg-boerne-gold-alt transition-colors text-lg"
          >
            Register Your Business - It's Free
          </Link>
        </div>
      </div>
    </div>
  );
}
