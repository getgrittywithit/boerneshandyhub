// Welcome Packet utilities for Realtor Portal

import serviceProvidersData from '@/data/serviceProviders.json';

export interface WelcomePacketProvider {
  id: string;
  name: string;
  category: string;
  phone?: string;
  website?: string;
  description?: string;
  licensed: boolean;
  insured: boolean;
  rating: number;
  reviewCount: number;
}

export interface WelcomePacketCategory {
  id: string;
  name: string;
  icon: string;
  providers: WelcomePacketProvider[];
}

export interface WelcomePacketGuide {
  slug: string;
  title: string;
  description: string;
}

export interface WelcomePacketData {
  clientName: string;
  address: string;
  city: string;
  realtorName: string;
  realtorCompany: string;
  welcomeMessage: string;
  categories: WelcomePacketCategory[];
  guides: WelcomePacketGuide[];
  createdAt: string;
}

// Categories to include in welcome packets with their display info
export const packetCategories = [
  { id: 'hvac', name: 'HVAC & Air Conditioning', icon: '❄️', priority: 1 },
  { id: 'plumbing', name: 'Plumbing', icon: '🔧', priority: 2 },
  { id: 'electrical', name: 'Electrical', icon: '⚡', priority: 3 },
  { id: 'handyman', name: 'Handyman Services', icon: '🛠️', priority: 4 },
  { id: 'landscaping', name: 'Landscaping & Lawn Care', icon: '🌿', priority: 5 },
  { id: 'pest-control', name: 'Pest Control', icon: '🐜', priority: 6 },
  { id: 'cleaning', name: 'House Cleaning', icon: '🧹', priority: 7 },
  { id: 'roofing', name: 'Roofing', icon: '🏠', priority: 8 },
  { id: 'locksmith', name: 'Locksmith', icon: '🔐', priority: 9 },
  { id: 'garage-doors', name: 'Garage Doors', icon: '🚗', priority: 10 },
];

// Guides to include in welcome packets
export const packetGuides: WelcomePacketGuide[] = [
  {
    slug: 'boerne-utility-setup-guide',
    title: 'Utility Setup Guide',
    description: 'CPS Energy, GVTC, water, trash - get connected fast'
  },
  {
    slug: 'texas-homeowner-tips',
    title: 'Texas Homeowner Tips',
    description: 'Homestead exemption, property taxes, and money-saving tips'
  },
  {
    slug: 'new-homeowner-checklist',
    title: 'New Homeowner Checklist: First 30 Days',
    description: 'Essential tasks for your first month in your new home'
  },
  {
    slug: 'home-maintenance-schedule',
    title: 'Annual Home Maintenance Schedule',
    description: 'Keep your home in top shape year-round'
  },
  {
    slug: 'hvac-maintenance-checklist',
    title: 'HVAC Maintenance Checklist',
    description: 'Seasonal tips for Texas heating and cooling'
  },
  {
    slug: 'pest-prevention-tips',
    title: 'Pest Prevention Tips',
    description: 'Keep Hill Country pests outside where they belong'
  },
];

// Get top providers for a category
export function getProvidersForCategory(
  categoryId: string,
  limit: number = 3
): WelcomePacketProvider[] {
  const providers = (serviceProvidersData as { providers: Array<{
    id: string;
    name: string;
    category: string;
    phone?: string;
    website?: string;
    description?: string;
    licensed?: boolean;
    insured?: boolean;
    rating?: number;
    reviewCount?: number;
    membershipTier?: string;
  }> }).providers
    .filter(p => p.category === categoryId)
    .sort((a, b) => {
      // Sort by: membership tier first, then rating, then review count
      const tierOrder: Record<string, number> = { elite: 0, professional: 1, verified: 2, basic: 3 };
      const tierA = tierOrder[a.membershipTier || 'basic'] ?? 3;
      const tierB = tierOrder[b.membershipTier || 'basic'] ?? 3;

      if (tierA !== tierB) return tierA - tierB;
      if ((b.rating || 0) !== (a.rating || 0)) return (b.rating || 0) - (a.rating || 0);
      return (b.reviewCount || 0) - (a.reviewCount || 0);
    })
    .slice(0, limit)
    .map(p => ({
      id: p.id,
      name: p.name,
      category: p.category,
      phone: p.phone,
      website: p.website,
      description: p.description,
      licensed: p.licensed || false,
      insured: p.insured || false,
      rating: p.rating || 0,
      reviewCount: p.reviewCount || 0,
    }));

  return providers;
}

// Generate a complete welcome packet
export function generateWelcomePacket(
  clientName: string,
  address: string,
  city: string,
  realtorName: string,
  realtorCompany: string,
  customMessage?: string,
  selectedCategories?: string[]
): WelcomePacketData {
  const categoriesToInclude = selectedCategories || packetCategories.map(c => c.id);

  const categories: WelcomePacketCategory[] = packetCategories
    .filter(cat => categoriesToInclude.includes(cat.id))
    .map(cat => ({
      id: cat.id,
      name: cat.name,
      icon: cat.icon,
      providers: getProvidersForCategory(cat.id, 3),
    }))
    .filter(cat => cat.providers.length > 0); // Only include categories with providers

  const defaultMessage = `Congratulations on your new home at ${address}! As your realtor, I want to make sure you have everything you need to get settled. Here are my trusted recommendations for local service providers in the ${city} area. These are professionals I know and trust to take great care of your new home.`;

  return {
    clientName,
    address,
    city,
    realtorName,
    realtorCompany,
    welcomeMessage: customMessage || defaultMessage,
    categories,
    guides: packetGuides,
    createdAt: new Date().toISOString(),
  };
}

// Generate a unique packet ID for sharing
export function generatePacketId(): string {
  return `wp_${Date.now().toString(36)}_${Math.random().toString(36).substr(2, 9)}`;
}
