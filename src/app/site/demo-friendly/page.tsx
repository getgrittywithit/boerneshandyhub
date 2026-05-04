'use client';

import FriendlyTemplate from '@/templates/friendly';
import type { Website } from '@/lib/websites/types';

// Mock data for demo - Cozy Home Handyman
const mockWebsite: Website = {
  id: 'demo-friendly',
  business_id: 'biz-friendly',
  slug: 'demo-friendly',
  template: 'friendly',
  primary_color: '#7c2d12',
  accent_color: '#fbbf24',
  tagline: 'Making Your House Feel Like Home',
  about_text: `Hey there! We're Cozy Home Handyman, and we've been helping Boerne families with their home projects since 2012.

We're a father-daughter team who genuinely love what we do. From fixing that squeaky door that's been driving you crazy to building your dream deck, no job is too small for us. We treat every home like it's our own grandma's house!

What makes us different? We actually answer our phones (crazy, right?), we show up when we say we will, and we always clean up after ourselves. Our customers become friends, and honestly, that's the best part of the job.

Give us a call - we'd love to help!`,
  services: [
    { name: 'General Home Repairs', description: 'Doors, windows, cabinets, and all those little fixes', priceRange: 'From $60' },
    { name: 'Painting', description: 'Interior and exterior, we love color!', priceRange: 'Free estimates' },
    { name: 'Deck & Fence Repair', description: 'Keep your outdoor space looking great' },
    { name: 'Drywall Patching', description: 'Holes and cracks? We got you', priceRange: 'From $50' },
    { name: 'Furniture Assembly', description: 'IKEA nightmares? No problem!', priceRange: '$40/hour' },
    { name: 'Holiday Light Installation', description: 'Stay safe - let us do the climbing' },
  ],
  license_number: null,
  license_state: 'TX',
  insurance_carrier: 'USAA',
  years_in_business: 12,
  hours: {
    mon: { open: '08:00', close: '17:00' },
    tue: { open: '08:00', close: '17:00' },
    wed: { open: '08:00', close: '17:00' },
    thu: { open: '08:00', close: '17:00' },
    fri: { open: '08:00', close: '17:00' },
    sat: { open: '09:00', close: '13:00' },
    sun: null,
  },
  emergency_available: false,
  service_area: {
    radiusMiles: 15,
    cities: ['Boerne', 'Fair Oaks Ranch', 'Leon Springs'],
  },
  testimonials: [
    {
      name: 'Janet P.',
      text: 'These folks are the sweetest! They fixed my creaky stairs and even adjusted my cabinet doors while they were here. Can\'t recommend them enough!',
      rating: 5,
    },
    {
      name: 'The Rodriguez Family',
      text: 'We\'ve used Cozy Home three times now. They\'re like family at this point. Always friendly, always reliable.',
      rating: 5,
    },
    {
      name: 'Tom & Mary B.',
      text: 'Finally found a handyman who actually returns calls! Great work on our bathroom vanity installation.',
      rating: 5,
    },
  ],
  hero_photo_id: null,
  logo_photo_id: null,
  gallery_photo_ids: [],
  submitted_at: null,
  approved_at: new Date().toISOString(),
  approved_by: 'admin',
  rejection_reason: null,
  published_at: new Date().toISOString(),
  expires_at: null,
  archived_at: null,
  status: 'live',
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
  business: {
    id: 'biz-friendly',
    name: 'Cozy Home Handyman',
    phone: '(830) 555-2468',
    email: 'hello@cozyhomehandyman.com',
    address: '456 Oak Ave',
    city: 'Boerne',
    state: 'TX',
    zip: '78006',
  },
};

export default function DemoFriendlyPage() {
  return <FriendlyTemplate website={mockWebsite} preview={true} />;
}
