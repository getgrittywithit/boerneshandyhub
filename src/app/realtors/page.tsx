'use client';

import Link from 'next/link';

export default function RealtorsLandingPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-boerne-navy via-boerne-dark-gray to-boerne-navy">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center">
            <span className="inline-block px-4 py-1 bg-boerne-gold/20 text-boerne-gold text-sm font-medium rounded-full mb-4">
              For Real Estate Professionals
            </span>
            <h1 className="text-4xl lg:text-5xl font-bold text-white mb-6">
              Give Your Clients the <span className="text-boerne-gold">Best Start</span> in Their New Home
            </h1>
            <p className="text-xl text-white/80 max-w-3xl mx-auto mb-8">
              Partner with Boerne's Handy Hub to provide your buyers with curated local service provider recommendations.
              Stand out with professional welcome packets that show you care beyond closing.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/realtors/register"
                className="px-8 py-4 bg-boerne-gold text-boerne-navy font-semibold rounded-lg hover:bg-boerne-gold-alt transition-colors text-lg"
              >
                Join the Partner Program
              </Link>
              <Link
                href="#how-it-works"
                className="px-8 py-4 bg-white/10 text-white font-semibold rounded-lg hover:bg-white/20 transition-colors text-lg"
              >
                See How It Works
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Value Props */}
      <div className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900">
              Why Realtors Partner With Us
            </h2>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center p-6">
              <div className="w-16 h-16 bg-boerne-gold/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl">🎁</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Welcome Packets
              </h3>
              <p className="text-gray-600">
                Create branded welcome packets with vetted local service providers.
                Your clients get trusted recommendations; you stay top of mind.
              </p>
            </div>
            <div className="text-center p-6">
              <div className="w-16 h-16 bg-boerne-gold/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl">🏠</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Home Tracker Access
              </h3>
              <p className="text-gray-600">
                Gift your clients a Home Tracker account with their new home already set up.
                They'll get maintenance reminders tailored to Boerne's climate.
              </p>
            </div>
            <div className="text-center p-6">
              <div className="w-16 h-16 bg-boerne-gold/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl">⭐</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Client Appreciation
              </h3>
              <p className="text-gray-600">
                Show clients you care about their success as homeowners, not just the sale.
                Build referral-generating relationships.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* How It Works */}
      <div id="how-it-works" className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900">
              How It Works
            </h2>
          </div>
          <div className="grid md:grid-cols-4 gap-8">
            {[
              {
                step: '1',
                title: 'Sign Up Free',
                description: 'Create your realtor account in minutes. No credit card required.'
              },
              {
                step: '2',
                title: 'Add Your Clients',
                description: 'Enter client details and their new home information after closing.'
              },
              {
                step: '3',
                title: 'Generate Welcome Packet',
                description: 'We create a customized list of trusted local service providers.'
              },
              {
                step: '4',
                title: 'Share & Impress',
                description: 'Send the branded packet to your clients. They remember you.'
              }
            ].map((item) => (
              <div key={item.step} className="text-center">
                <div className="w-12 h-12 bg-boerne-navy text-white rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">
                  {item.step}
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {item.title}
                </h3>
                <p className="text-gray-600 text-sm">
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Welcome Packet Preview */}
      <div className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">
                What's in a Welcome Packet?
              </h2>
              <ul className="space-y-4">
                {[
                  'Personalized welcome message from you',
                  'Top-rated HVAC, plumbing, and electrical pros',
                  'Trusted handyman and contractor recommendations',
                  'Lawn care and landscaping services',
                  'Pest control providers',
                  'Emergency service contacts',
                  'First 30-day homeowner checklist',
                  'Hill Country seasonal maintenance tips'
                ].map((item, idx) => (
                  <li key={idx} className="flex items-start gap-3">
                    <span className="text-boerne-gold text-lg">✓</span>
                    <span className="text-gray-700">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="bg-gray-100 rounded-2xl p-8">
              <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
                <div className="flex items-center gap-4 mb-6 pb-4 border-b">
                  <div className="w-12 h-12 bg-boerne-gold/20 rounded-full flex items-center justify-center">
                    <span className="text-2xl">🏠</span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">Welcome to Your New Home!</h3>
                    <p className="text-sm text-gray-500">From Jane Smith, Hill Country Realty</p>
                  </div>
                </div>
                <p className="text-gray-600 text-sm mb-4">
                  Congratulations on your new home at 123 Oak Valley Dr! Here are my trusted
                  recommendations for local service providers...
                </p>
                <div className="space-y-3">
                  {['HVAC Services', 'Plumbing', 'Landscaping'].map((cat, idx) => (
                    <div key={idx} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <span className="text-sm font-medium text-gray-700">{cat}</span>
                      <span className="text-xs text-boerne-gold">3 recommendations →</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Pricing */}
      <div className="py-16 bg-boerne-navy">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Free for Realtors
          </h2>
          <p className="text-xl text-white/80 max-w-2xl mx-auto mb-8">
            Our Realtor Partner Program is completely free. Create unlimited welcome packets
            and add as many clients as you need. We make money when service providers upgrade
            their listings—not from you.
          </p>
          <div className="bg-white/10 rounded-xl p-8 max-w-md mx-auto">
            <div className="text-4xl font-bold text-boerne-gold mb-2">$0</div>
            <p className="text-white/80">Forever free</p>
            <ul className="text-left mt-6 space-y-3">
              {[
                'Unlimited welcome packets',
                'Unlimited client accounts',
                'Branded packet customization',
                'Home Tracker setup for clients',
                'Priority partner support'
              ].map((feature, idx) => (
                <li key={idx} className="flex items-center gap-2 text-white/90">
                  <span className="text-boerne-gold">✓</span>
                  {feature}
                </li>
              ))}
            </ul>
            <Link
              href="/realtors/register"
              className="block mt-8 px-6 py-3 bg-boerne-gold text-boerne-navy font-semibold rounded-lg hover:bg-boerne-gold-alt transition-colors"
            >
              Get Started Free
            </Link>
          </div>
        </div>
      </div>

      {/* CTA */}
      <div className="py-16 bg-white">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Ready to Impress Your Clients?
          </h2>
          <p className="text-lg text-gray-600 mb-8">
            Join other Boerne-area realtors who are providing exceptional post-closing service.
            Your clients will thank you—and refer you.
          </p>
          <Link
            href="/realtors/register"
            className="inline-block px-8 py-4 bg-boerne-gold text-boerne-navy font-semibold rounded-lg hover:bg-boerne-gold-alt transition-colors text-lg"
          >
            Join the Partner Program
          </Link>
          <p className="mt-4 text-sm text-gray-500">
            Already a partner? <Link href="/realtors/login" className="text-boerne-gold hover:text-boerne-gold-alt">Sign in here</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
