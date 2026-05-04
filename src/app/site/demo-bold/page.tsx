'use client';

import BoldTemplate from '@/templates/bold';
import type { Website } from '@/lib/websites/types';

// Mock data for demo - Elite HVAC Services
const mockWebsite: Website = {
  id: 'demo-bold',
  business_id: 'biz-bold',
  slug: 'demo-bold',
  template: 'bold',
  primary_color: '#000000',
  accent_color: '#ef4444',
  tagline: 'When Comfort Can\'t Wait, Neither Do We',
  about_text: `ELITE HVAC SERVICES doesn't just fix air conditioners. We deliver peace of mind.

Founded in 2015 by a Marine Corps veteran, our company was built on a simple principle: no excuses, just results. When your AC goes out in a Texas summer, you don't need someone who will "try to get there." You need someone who WILL get there.

Our technicians are factory-certified on all major brands. Our trucks are fully stocked. Our commitment to you is absolute.

100% satisfaction guaranteed or your money back. That's not a tagline - that's our promise.`,
  services: [
    { name: 'AC REPAIR', description: 'Same-day emergency service available', priceRange: 'CALL NOW' },
    { name: 'HEATING SYSTEMS', description: 'All types - heat pumps, furnaces, mini-splits' },
    { name: 'NEW INSTALLATION', description: 'Top brands, competitive financing', priceRange: '0% APR Available' },
    { name: 'MAINTENANCE PLANS', description: 'Prevent breakdowns before they happen', priceRange: 'From $149/yr' },
    { name: 'DUCT CLEANING', description: 'Improve air quality and efficiency' },
    { name: 'INDOOR AIR QUALITY', description: 'Purifiers, humidifiers, filtration systems' },
  ],
  license_number: 'TACLA78945E',
  license_state: 'TX',
  insurance_carrier: 'Liberty Mutual',
  years_in_business: 9,
  hours: {
    mon: { open: '06:00', close: '20:00' },
    tue: { open: '06:00', close: '20:00' },
    wed: { open: '06:00', close: '20:00' },
    thu: { open: '06:00', close: '20:00' },
    fri: { open: '06:00', close: '20:00' },
    sat: { open: '07:00', close: '18:00' },
    sun: { open: '08:00', close: '16:00' },
  },
  emergency_available: true,
  service_area: {
    radiusMiles: 40,
    cities: ['Boerne', 'San Antonio', 'Helotes', 'Fair Oaks Ranch', 'Leon Springs', 'New Braunfels'],
  },
  testimonials: [
    {
      name: 'David R.',
      text: 'AC died at 10pm on a Saturday. They were here by 11pm and had it running by midnight. These guys are the REAL DEAL.',
      rating: 5,
    },
    {
      name: 'Commercial Client - Boerne Dental',
      text: 'Our office HVAC is critical for patient comfort. Elite has maintained our system for 4 years with ZERO downtime.',
      rating: 5,
    },
    {
      name: 'James & Patricia H.',
      text: 'Got three quotes for a new system. Elite was not the cheapest, but their warranty and service made it worth every penny.',
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
    id: 'biz-bold',
    name: 'Elite HVAC Services',
    phone: '(830) 555-HVAC',
    email: 'service@elitehvac.com',
    address: '789 Industrial Blvd',
    city: 'Boerne',
    state: 'TX',
    zip: '78006',
  },
};

export default function DemoBoldPage() {
  return <BoldTemplate website={mockWebsite} preview={true} />;
}
