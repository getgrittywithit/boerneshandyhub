'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  getDisplayTiers,
  getAnnualSavings,
  getMonthlyEquivalent,
  type PricingTier,
} from '@/data/pricingTiers';
import { Globe, Check, Phone, BarChart3, Shield } from 'lucide-react';

export default function PricingSection() {
  const [isAnnual, setIsAnnual] = useState(false);
  const tiers = getDisplayTiers();

  return (
    <div className="bg-gray-100 py-16">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Simple, Transparent Pricing
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Start free and upgrade when you&apos;re ready for a professional website and verified badge.
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

        {/* Two-column pricing cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl mx-auto">
          {tiers.map((tier) => (
            <PricingCard
              key={tier.key}
              tier={tier}
              isAnnual={isAnnual}
            />
          ))}
        </div>

        {/* Founding Partner CTA */}
        <div className="text-center mt-8">
          <p className="text-gray-500 text-sm">
            Need more than this?{' '}
            <Link
              href="/business/contact"
              className="text-boerne-navy hover:text-boerne-gold font-medium"
            >
              Talk to us about Founding Partner →
            </Link>
          </p>
        </div>

        {/* Website Preview Section */}
        <div className="mt-16 bg-white rounded-2xl shadow-lg overflow-hidden">
          <div className="p-8 md:p-12">
            <div className="flex items-center gap-2 text-boerne-gold mb-4">
              <Globe size={24} />
              <span className="font-semibold">Included with Verified</span>
            </div>
            <h3 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
              Your Professional Website
            </h3>
            <p className="text-gray-600 mb-6 max-w-xl">
              Skip the $30/month Wix subscription and weeks of DIY setup.
              Get a conversion-optimized, mobile-first website ready in minutes.
            </p>

            <div className="grid sm:grid-cols-2 gap-4 mb-8">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
                  <Check size={16} className="text-green-600" />
                </div>
                <div>
                  <p className="font-medium text-gray-900">Your own URL</p>
                  <p className="text-sm text-gray-500">boerneshandyhub.com/your-business</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
                  <Check size={16} className="text-green-600" />
                </div>
                <div>
                  <p className="font-medium text-gray-900">Mobile-optimized</p>
                  <p className="text-sm text-gray-500">Sticky call button, fast loading</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
                  <Check size={16} className="text-green-600" />
                </div>
                <div>
                  <p className="font-medium text-gray-900">Trade-specific templates</p>
                  <p className="text-sm text-gray-500">Plumbing, electrical, painting & more</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
                  <Check size={16} className="text-green-600" />
                </div>
                <div>
                  <p className="font-medium text-gray-900">Easy customization</p>
                  <p className="text-sm text-gray-500">Colors, photos, services, testimonials</p>
                </div>
              </div>
            </div>
          </div>

          {/* Template Preview */}
          <div className="bg-gradient-to-br from-gray-100 to-gray-200 p-6 md:p-8">
            <p className="text-center text-sm text-gray-500 mb-4">Template Preview</p>
            <div className="max-w-md mx-auto">
              <WebsitePreviewMockup />
            </div>
          </div>
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

  // Show first 7 features
  const displayFeatures = tier.features.slice(0, 7);
  const hasMoreFeatures = tier.features.length > 7;

  return (
    <div
      className={`bg-white rounded-xl p-6 shadow-sm relative ${
        tier.isHighlighted ? 'ring-2 ring-green-500' : ''
      }`}
    >
      {/* Badge */}
      {tier.isHighlighted && (
        <div className="absolute -top-3 left-1/2 -translate-x-1/2">
          <span className="px-3 py-1 bg-green-500 text-white text-xs font-semibold rounded-full">
            Most Popular
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

      {/* Job to be done */}
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

      {/* Highlight feature (website callout for Verified) */}
      {tier.highlightFeature && (
        <div className="mb-4 p-3 bg-boerne-gold/10 rounded-lg border border-boerne-gold/20">
          <div className="flex items-center gap-2 text-boerne-navy font-semibold">
            <Globe size={18} />
            {tier.highlightFeature}
          </div>
        </div>
      )}

      <p className="text-sm text-gray-600 mb-4">{tier.description}</p>

      <ul className="space-y-2 mb-6">
        {displayFeatures.map((feature, index) => (
          <li key={index} className="flex items-start gap-2 text-sm">
            <span className="text-green-500 mt-0.5">✓</span>
            <span className="text-gray-600">{feature}</span>
          </li>
        ))}
        {hasMoreFeatures && (
          <li className="text-sm text-gray-400 pl-5">
            +{tier.features.length - 7} more
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

function WebsitePreviewMockup() {
  return (
    <div className="bg-white rounded-lg shadow-xl overflow-hidden border border-gray-200">
      {/* Browser chrome */}
      <div className="bg-gray-100 px-3 py-2 flex items-center gap-2 border-b">
        <div className="flex gap-1.5">
          <div className="w-3 h-3 rounded-full bg-red-400" />
          <div className="w-3 h-3 rounded-full bg-yellow-400" />
          <div className="w-3 h-3 rounded-full bg-green-400" />
        </div>
        <div className="flex-1 mx-2">
          <div className="bg-white rounded px-3 py-1 text-xs text-gray-500 flex items-center gap-1">
            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
            boerneshandyhub.com/your-business
          </div>
        </div>
      </div>

      {/* Site preview */}
      <div className="relative">
        {/* Hero */}
        <div className="bg-[#1e3a5f] p-4">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-8 h-8 rounded bg-gray-300" />
            <div>
              <div className="h-3 w-24 bg-white/80 rounded mb-1" />
              <div className="h-2 w-16 bg-white/40 rounded" />
            </div>
          </div>
          <span className="inline-block px-2 py-0.5 bg-[#d4a853] text-[#1e3a5f] text-[8px] font-semibold rounded-full">
            Boerne Verified
          </span>
        </div>

        {/* Content preview */}
        <div className="p-4 space-y-3">
          {/* Quick info */}
          <div className="flex gap-4 text-[8px] text-gray-500">
            <span className="flex items-center gap-1">
              <Shield size={10} /> Licensed
            </span>
            <span className="flex items-center gap-1">
              <Phone size={10} /> (830) 555-1234
            </span>
          </div>

          {/* About */}
          <div>
            <div className="h-2 w-12 bg-gray-200 rounded mb-1" />
            <div className="space-y-1">
              <div className="h-1.5 w-full bg-gray-100 rounded" />
              <div className="h-1.5 w-5/6 bg-gray-100 rounded" />
              <div className="h-1.5 w-4/6 bg-gray-100 rounded" />
            </div>
          </div>

          {/* Services */}
          <div>
            <div className="h-2 w-16 bg-gray-200 rounded mb-2" />
            <div className="flex flex-wrap gap-1">
              {['Plumbing', 'Water Heater', 'Drain'].map((s) => (
                <span key={s} className="px-1.5 py-0.5 bg-gray-100 rounded text-[7px] text-gray-600">
                  {s}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Mobile CTA */}
        <div className="bg-white border-t p-2">
          <div className="bg-[#1e3a5f] text-white text-[10px] font-semibold text-center py-2 rounded flex items-center justify-center gap-1">
            <Phone size={12} />
            Call Now
          </div>
        </div>
      </div>
    </div>
  );
}
