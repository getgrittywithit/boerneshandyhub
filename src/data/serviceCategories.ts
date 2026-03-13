// Service Categories for Boerne Handy Hub Home Services Directory

export interface ServiceCategory {
  id: string;
  name: string;
  slug: string;
  description: string;
  icon: string;
  subcategories: string[];
  featured?: boolean;
}

export const serviceCategories: ServiceCategory[] = [
  {
    id: 'plumbing',
    name: 'Plumbing',
    slug: 'plumbing',
    description: 'Licensed plumbers for repairs, installations, and emergency services',
    icon: '🔧',
    subcategories: ['Drain Cleaning', 'Water Heaters', 'Leak Repair', 'Pipe Installation', 'Sewer Services', 'Fixture Installation'],
    featured: true,
  },
  {
    id: 'electrical',
    name: 'Electrical',
    slug: 'electrical',
    description: 'Professional electricians for residential and commercial needs',
    icon: '⚡',
    subcategories: ['Panel Upgrades', 'Lighting Installation', 'Outlet Repair', 'Ceiling Fans', 'Generator Installation', 'Electrical Inspections'],
    featured: true,
  },
  {
    id: 'hvac',
    name: 'HVAC',
    slug: 'hvac',
    description: 'Heating, cooling, and air quality experts',
    icon: '❄️',
    subcategories: ['AC Repair', 'Heating Repair', 'AC Installation', 'Duct Cleaning', 'Maintenance Plans', 'Indoor Air Quality'],
    featured: true,
  },
  {
    id: 'roofing',
    name: 'Roofing',
    slug: 'roofing',
    description: 'Roofers for repairs, replacements, and inspections',
    icon: '🏠',
    subcategories: ['Roof Repair', 'Roof Replacement', 'Gutter Installation', 'Storm Damage', 'Roof Inspections', 'Metal Roofing'],
  },
  {
    id: 'contractors',
    name: 'Contractors',
    slug: 'contractors',
    description: 'General contractors for remodeling, additions, and new construction',
    icon: '🔨',
    subcategories: ['Kitchen Remodeling', 'Bathroom Remodeling', 'Room Additions', 'Home Renovation', 'Deck Building', 'New Construction'],
    featured: true,
  },
  {
    id: 'landscaping',
    name: 'Landscaping',
    slug: 'landscaping',
    description: 'Lawn care, tree services, and outdoor design',
    icon: '🌳',
    subcategories: ['Lawn Care', 'Tree Service', 'Irrigation Systems', 'Landscape Design', 'Hardscaping', 'Seasonal Maintenance'],
  },
  {
    id: 'cleaning',
    name: 'Cleaning',
    slug: 'cleaning',
    description: 'House cleaning, pressure washing, and specialized cleaning services',
    icon: '🧹',
    subcategories: ['House Cleaning', 'Pressure Washing', 'Window Cleaning', 'Deep Cleaning', 'Move-In/Out Cleaning', 'Carpet Cleaning'],
  },
  {
    id: 'pest-control',
    name: 'Pest Control',
    slug: 'pest-control',
    description: 'Exterminators and wildlife removal services',
    icon: '🐜',
    subcategories: ['General Pest Control', 'Termite Treatment', 'Rodent Control', 'Wildlife Removal', 'Bee Removal', 'Mosquito Control'],
  },
  {
    id: 'handyman',
    name: 'Handyman',
    slug: 'handyman',
    description: 'General repairs, odd jobs, and home maintenance',
    icon: '🛠️',
    subcategories: ['General Repairs', 'Furniture Assembly', 'Drywall Repair', 'Painting', 'Door Installation', 'Minor Plumbing & Electrical'],
  },
  {
    id: 'pool-spa',
    name: 'Pool & Spa',
    slug: 'pool-spa',
    description: 'Pool cleaning, repair, and installation services',
    icon: '🏊',
    subcategories: ['Pool Cleaning', 'Pool Repair', 'Pool Installation', 'Spa Services', 'Equipment Repair', 'Pool Remodeling'],
  },
];

export const getServiceCategory = (slug: string): ServiceCategory | undefined => {
  return serviceCategories.find(cat => cat.slug === slug);
};

export const getFeaturedCategories = (): ServiceCategory[] => {
  return serviceCategories.filter(cat => cat.featured);
};

export const membershipTiers = {
  basic: {
    name: 'Basic',
    price: 'Free',
    badge: null,
    color: 'bg-gray-100 text-gray-600',
    features: ['Listed in directory', 'Basic profile'],
    priority: 0,
  },
  verified: {
    name: 'Verified',
    price: '$29/mo',
    badge: '✅',
    color: 'bg-green-100 text-green-700',
    features: ['Verified badge', 'Claim listing', 'Edit profile', 'Contact info displayed'],
    priority: 1,
  },
  premium: {
    name: 'Premium',
    price: '$79/mo',
    badge: '⭐',
    color: 'bg-boerne-gold/20 text-boerne-gold-dark',
    features: ['Featured in category', 'Bernie recommends', 'Special offers', 'Priority support'],
    priority: 2,
  },
  elite: {
    name: 'Elite',
    price: '$149/mo',
    badge: '💎',
    color: 'bg-purple-100 text-purple-700',
    features: ['Homepage featured', 'Top of listings', 'Priority support', 'Analytics dashboard'],
    priority: 3,
  },
};

export type MembershipTier = keyof typeof membershipTiers;
