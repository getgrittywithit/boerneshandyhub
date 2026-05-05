// Guide Hub definitions for organizing guides by topic

export interface GuideHub {
  slug: string;
  title: string;
  shortTitle: string;
  description: string;
  icon: string;
  color: string; // Tailwind gradient classes
  categories: string[]; // Blog categories to include
  tags: string[]; // Tags to match
  featured: boolean;
}

export const guideHubs: GuideHub[] = [
  {
    slug: 'homeowner',
    title: 'Homeowner Essentials',
    shortTitle: 'Homeowner',
    description: 'Everything you need to maintain and care for your Hill Country home. From routine maintenance to major repairs.',
    icon: '🏠',
    color: 'from-blue-500 to-blue-700',
    categories: ['guides', 'tips'],
    tags: ['maintenance', 'repair', 'home care', 'plumbing', 'electrical', 'hvac', 'roofing'],
    featured: true,
  },
  {
    slug: 'moving',
    title: 'Moving to Boerne',
    shortTitle: 'New Residents',
    description: 'Your complete guide to relocating to Boerne. Neighborhoods, utilities, schools, and everything newcomers need to know.',
    icon: '📦',
    color: 'from-green-500 to-green-700',
    categories: ['guides', 'community'],
    tags: ['moving', 'relocation', 'newcomer', 'neighborhoods', 'utilities', 'schools'],
    featured: true,
  },
  {
    slug: 'emergency',
    title: 'Emergency Preparedness',
    shortTitle: 'Emergency',
    description: 'Be ready for anything. Emergency contacts, what to do when things go wrong, and how to find help fast.',
    icon: '🚨',
    color: 'from-red-500 to-red-700',
    categories: ['guides'],
    tags: ['emergency', '24/7', 'urgent', 'storm', 'flood', 'fire', 'safety'],
    featured: true,
  },
  {
    slug: 'seasonal',
    title: 'Seasonal Guides',
    shortTitle: 'Seasonal',
    description: 'Prepare your home for every Texas season. Spring storms, summer heat, fall maintenance, and winter prep.',
    icon: '🌡️',
    color: 'from-orange-500 to-orange-700',
    categories: ['seasonal'],
    tags: ['spring', 'summer', 'fall', 'winter', 'seasonal', 'weather'],
    featured: true,
  },
  {
    slug: 'outdoor',
    title: 'Outdoor & Landscaping',
    shortTitle: 'Outdoor',
    description: 'Make the most of Hill Country outdoor living. Landscaping, pools, patios, and native plants.',
    icon: '🌳',
    color: 'from-emerald-500 to-emerald-700',
    categories: ['guides', 'tips'],
    tags: ['landscaping', 'lawn', 'pool', 'patio', 'outdoor', 'garden', 'native plants'],
    featured: false,
  },
  {
    slug: 'saving-money',
    title: 'Save Money at Home',
    shortTitle: 'Save Money',
    description: 'Smart ways to reduce costs without sacrificing comfort. Energy efficiency, DIY tips, and when to call a pro.',
    icon: '💰',
    color: 'from-yellow-500 to-yellow-700',
    categories: ['tips', 'guides'],
    tags: ['savings', 'energy', 'efficiency', 'diy', 'budget', 'cost'],
    featured: false,
  },
];

export function getHubBySlug(slug: string): GuideHub | undefined {
  return guideHubs.find(hub => hub.slug === slug);
}

export function getFeaturedHubs(): GuideHub[] {
  return guideHubs.filter(hub => hub.featured);
}
