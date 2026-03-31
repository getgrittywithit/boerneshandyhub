'use client';

import { useState } from 'react';
import Link from 'next/link';

const tiers = [
  {
    name: 'Free',
    monthlyPrice: 0,
    annualPrice: 0,
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
    monthlyPrice: 39,
    annualPrice: 350, // 3 months free ($39 × 9 = $351, rounded to $350)
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
    monthlyPrice: 79,
    annualPrice: 699, // 3 months free ($79 × 9 = $711, rounded to $699)
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
    monthlyPrice: 249,
    annualPrice: 2199, // 3 months free ($249 × 9 = $2241, rounded to $2199)
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

export default function PricingSection() {
  const [isAnnual, setIsAnnual] = useState(false);

  return (
    <div className="bg-gray-100 py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Simple, Transparent Pricing
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Start free and upgrade as your business grows. Cancel anytime.
          </p>
        </div>

        {/* Billing Toggle */}
        <div className="flex items-center justify-center gap-4 mb-10">
          <span className={`text-sm font-medium ${!isAnnual ? 'text-gray-900' : 'text-gray-500'}`}>
            Monthly
          </span>
          <button
            onClick={() => setIsAnnual(!isAnnual)}
            className={`relative w-14 h-7 rounded-full transition-colors ${
              isAnnual ? 'bg-boerne-gold' : 'bg-gray-300'
            }`}
          >
            <span
              className={`absolute top-0.5 left-0.5 w-6 h-6 bg-white rounded-full shadow transition-transform ${
                isAnnual ? 'translate-x-7' : 'translate-x-0'
              }`}
            />
          </button>
          <span className={`text-sm font-medium ${isAnnual ? 'text-gray-900' : 'text-gray-500'}`}>
            Annual
          </span>
          {isAnnual && (
            <span className="ml-2 px-2 py-1 bg-green-100 text-green-700 text-xs font-semibold rounded-full">
              3 months free
            </span>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {tiers.map((tier) => {
            const price = tier.monthlyPrice === 0
              ? '$0'
              : isAnnual
                ? `$${tier.annualPrice}`
                : `$${tier.monthlyPrice}`;

            const period = tier.monthlyPrice === 0
              ? 'forever'
              : isAnnual
                ? '/year'
                : '/month';

            const monthlyEquivalent = isAnnual && tier.annualPrice > 0
              ? Math.round(tier.annualPrice / 12)
              : null;

            const savings = isAnnual && tier.monthlyPrice > 0
              ? (tier.monthlyPrice * 12) - tier.annualPrice
              : 0;

            return (
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
                <div className="mt-2 mb-1">
                  <span className="text-3xl font-bold text-gray-900">{price}</span>
                  <span className="text-gray-500">{period}</span>
                </div>
                {monthlyEquivalent && (
                  <div className="text-sm text-gray-500 mb-1">
                    ${monthlyEquivalent}/mo billed annually
                  </div>
                )}
                {savings > 0 && (
                  <div className="text-sm text-green-600 font-medium mb-3">
                    Save ${savings}/year
                  </div>
                )}
                {!savings && <div className="mb-4" />}
                <p className="text-sm text-gray-600 mb-6">{tier.description}</p>
                <ul className="space-y-2 mb-6">
                  {tier.features.map((feature, index) => (
                    <li key={index} className="flex items-start gap-2 text-sm">
                      <span className="text-green-500 mt-0.5">✓</span>
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
            );
          })}
        </div>
      </div>
    </div>
  );
}
