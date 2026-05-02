'use client';

import HandymanTemplate from '@/templates/handyman';
import type { Website } from '@/lib/websites/types';

// Mock data for demo - Hill Country Plumbing
const mockWebsite: Website = {
  id: 'demo-123',
  business_id: 'biz-123',
  slug: 'demo',
  template: 'handyman',
  primary_color: '#1e3a5f',
  accent_color: '#d4a853',
  tagline: 'Your Trusted Boerne Plumber Since 2008',
  about_text: `Hill Country Plumbing has been serving Boerne and the surrounding Hill Country communities for over 15 years. We're a family-owned business that takes pride in honest, reliable service at fair prices.

Whether you have a leaky faucet, need a water heater replaced, or are dealing with a plumbing emergency at 2am, we're here to help. Our licensed plumbers arrive on time, explain the problem clearly, and give you upfront pricing before any work begins.

We treat your home like our own - that means shoe covers, drop cloths, and leaving the work area cleaner than we found it. It's why over 80% of our business comes from repeat customers and referrals.`,
  services: [
    { name: 'Water Heater Repair & Replacement', description: 'Tank and tankless systems, same-day service available', priceRange: 'From $150' },
    { name: 'Drain Cleaning', description: 'Kitchen, bathroom, and main line clearing', priceRange: '$99-$250' },
    { name: 'Leak Detection & Repair', description: 'Find and fix hidden leaks before they cause damage' },
    { name: 'Fixture Installation', description: 'Faucets, toilets, garbage disposals, and more', priceRange: 'From $75' },
    { name: 'Repiping', description: 'Whole-home repiping with PEX or copper' },
    { name: 'Sewer Line Repair', description: 'Camera inspection and trenchless repair options' },
    { name: 'Gas Line Services', description: 'Installation and repair for gas appliances' },
    { name: 'Well Pump Service', description: 'Repair and replacement for Hill Country wells' },
  ],
  license_number: 'TXRMP-41258',
  license_state: 'TX',
  insurance_carrier: 'State Farm',
  years_in_business: 15,
  hours: {
    mon: { open: '07:00', close: '18:00' },
    tue: { open: '07:00', close: '18:00' },
    wed: { open: '07:00', close: '18:00' },
    thu: { open: '07:00', close: '18:00' },
    fri: { open: '07:00', close: '18:00' },
    sat: { open: '08:00', close: '14:00' },
    sun: null,
  },
  emergency_available: true,
  service_area: {
    radiusMiles: 25,
    cities: ['Boerne', 'Fair Oaks Ranch', 'Comfort', 'Welfare', 'Kendalia', 'Bergheim', 'Leon Springs'],
  },
  testimonials: [
    {
      name: 'Sarah M.',
      text: 'Called at 6am with a burst pipe and they were here within 45 minutes. Fixed the problem quickly and the price was exactly what they quoted. Will definitely use again!',
      rating: 5,
    },
    {
      name: 'Robert & Linda K.',
      text: 'We\'ve used Hill Country Plumbing for years. They installed our tankless water heater and have done all our plumbing maintenance since. Always professional, always fair.',
      rating: 5,
    },
    {
      name: 'Mike T.',
      text: 'Great experience replacing our old water heater. They showed up on time, explained all our options, and had everything done in a few hours. Very impressed.',
      rating: 5,
    },
  ],
  // Images (null for demo - no actual uploads)
  hero_photo_id: null,
  logo_photo_id: null,
  gallery_photo_ids: [],

  // Review workflow
  submitted_at: null,
  approved_at: new Date().toISOString(),
  approved_by: 'admin',
  rejection_reason: null,

  // Lifecycle
  published_at: new Date().toISOString(),
  expires_at: null,
  archived_at: null,

  status: 'live',
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),

  // Mock business data
  business: {
    id: 'biz-123',
    name: 'Hill Country Plumbing',
    phone: '(830) 555-7890',
    email: 'info@hillcountryplumbing.com',
    address: '123 Main St',
    city: 'Boerne',
    state: 'TX',
    zip: '78006',
  },
};

export default function DemoSitePage() {
  return <HandymanTemplate website={mockWebsite} preview={true} />;
}
