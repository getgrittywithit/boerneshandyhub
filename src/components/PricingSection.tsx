'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  getDisplayTiers,
  getAnnualSavings,
  getMonthlyEquivalent,
  type PricingTier,
} from '@/data/pricingTiers';

export default function PricingSection() {
  const [isAnnual, setIsAnnual] = useState(false);
  const tiers = getDisplayTiers();

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
              Save ~17%
            </span>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {tiers.map((tier) => (
            <PricingCard
              key={tier.key}
              tier={tier}
              isAnnual={isAnnual}
            />
          ))}
        </div>

        {/* Compare all features link */}
        <div className="text-center mt-8">
          <Link
            href="/pricing"
            className="text-boerne-navy hover:text-boerne-gold font-medium text-sm"
          >
            Compare all features &rarr;
          </Link>
        </div>
      </div>
    </div>
  );
}

function PricingCard({ tier, isAnnual }: { tier: PricingTier; isAnnual: boolean }) {
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
    ? getMonthlyEquivalent(tier)
    : null;

  const savings = isAnnual ? getAnnualSavings(tier) : 0;

  // Only show first 6 features on pricing card, full list on /pricing page
  const displayFeatures = tier.features.slice(0, 6);
  const hasMoreFeatures = tier.features.length > 6;

  return (
    <div
      className={`bg-white rounded-xl p-6 shadow-sm relative ${
        tier.isHighlighted ? 'ring-2 ring-boerne-gold' : ''
      } ${tier.key === 'partner' ? 'ring-2 ring-amber-300' : ''}`}
    >
      {/* Badges */}
      {tier.isHighlighted && (
        <div className="absolute -top-3 left-1/2 -translate-x-1/2">
          <span className="px-3 py-1 bg-boerne-gold text-boerne-navy text-xs font-semibold rounded-full">
            Most Popular
          </span>
        </div>
      )}
      {tier.key === 'partner' && (
        <div className="absolute -top-3 left-1/2 -translate-x-1/2">
          <span className="px-3 py-1 bg-amber-100 text-amber-700 text-xs font-semibold rounded-full">
            Limited — 1 per category
          </span>
        </div>
      )}

      {/* Tier badge */}
      {tier.badge && (
        <div className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium mb-2 ${tier.badgeColor}`}>
          <span>{tier.badge}</span>
          <span>{tier.displayName}</span>
        </div>
      )}

      <h3 className="text-xl font-semibold text-gray-900">{tier.displayName}</h3>

      {/* Job to be done headline */}
      <p className="text-sm text-boerne-gold font-medium mt-1">
        {tier.jobToBeDone}
      </p>

      {/* Price */}
      <div className="mt-3 mb-1">
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
      {!savings && tier.monthlyPrice > 0 && <div className="mb-4" />}
      {tier.monthlyPrice === 0 && <div className="mb-4" />}

      <p className="text-sm text-gray-600 mb-4">{tier.description}</p>

      {/* Category limit callout */}
      <div className="text-xs text-gray-500 mb-4 flex items-center gap-1">
        <span>Listed in up to</span>
        <span className="font-semibold text-boerne-navy">
          {tier.categoryLimit === Infinity ? 'unlimited' : tier.categoryLimit}
        </span>
        <span>{tier.categoryLimit === 1 ? 'category' : 'categories'}</span>
      </div>

      <ul className="space-y-2 mb-6">
        {displayFeatures.map((feature, index) => (
          <li key={index} className="flex items-start gap-2 text-sm">
            <span className="text-green-500 mt-0.5">✓</span>
            <span className="text-gray-600">{feature}</span>
          </li>
        ))}
        {hasMoreFeatures && (
          <li className="text-sm text-gray-400 pl-5">
            +{tier.features.length - 6} more features
          </li>
        )}
      </ul>

      <Link
        href="/business/register"
        className={`block w-full text-center px-4 py-3 rounded-lg font-semibold transition-colors ${
          tier.ctaStyle === 'primary'
            ? 'bg-boerne-gold text-boerne-navy hover:bg-boerne-gold-alt'
            : tier.ctaStyle === 'secondary'
              ? 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              : 'bg-gray-50 text-gray-500 hover:bg-gray-100'
        }`}
      >
        {tier.cta}
      </Link>
    </div>
  );
}
