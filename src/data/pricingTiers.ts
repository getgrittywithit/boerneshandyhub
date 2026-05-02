// =============================================================================
// PRICING TIERS — v1 Launch (Website-as-Anchor Strategy)
// =============================================================================
// Per docs/PRICING_SPEC_V1.md — supersedes original three-tier spec for launch
// Two public tiers: Claimed (Free) and Verified ($49/mo)
// Founding Partner is concierge-only, not shown on pricing page

export type TierKey = 'unclaimed' | 'claimed' | 'verified' | 'foundingPartner';

export interface PricingTier {
  key: TierKey;
  name: string;
  displayName: string;
  monthlyPrice: number;
  annualPrice: number; // ~17% discount (2 months free)
  jobToBeDone: string;
  description: string;
  features: string[];
  highlightFeature?: string; // Key feature to call out prominently
  categoryLimit: number;
  badge: string | null;
  badgeColor: string;
  cardStyle: {
    background: string;
    border: string;
    text: string;
  };
  sortPriority: number;
  isHighlighted: boolean;
  isPublic: boolean; // Show on public pricing page
  cta: string;
  ctaStyle: 'primary' | 'secondary' | 'muted';
}

// =============================================================================
// TIER DEFINITIONS
// =============================================================================

export const pricingTiers: Record<TierKey, PricingTier> = {
  unclaimed: {
    key: 'unclaimed',
    name: 'Unclaimed',
    displayName: 'Unclaimed',
    monthlyPrice: 0,
    annualPrice: 0,
    jobToBeDone: 'Does this business exist?',
    description: 'Business added from public data, not yet claimed by owner',
    features: [
      'Business name',
      'Phone number',
      'Address',
      'Category placement',
    ],
    categoryLimit: 1,
    badge: null,
    badgeColor: 'bg-gray-100 text-gray-500',
    cardStyle: {
      background: 'bg-gray-50',
      border: 'border-gray-200',
      text: 'text-gray-500',
    },
    sortPriority: 0,
    isHighlighted: false,
    isPublic: false, // Not shown on pricing page
    cta: 'Claim This Listing',
    ctaStyle: 'muted',
  },

  claimed: {
    key: 'claimed',
    name: 'Claimed',
    displayName: 'Free',
    monthlyPrice: 0,
    annualPrice: 0,
    jobToBeDone: "Here's our info",
    description: 'Claim your listing and take control of your profile',
    features: [
      'Listed in directory',
      'Business profile page',
      '1 photo',
      'Business description',
      'Hours of operation',
      'Website & social links',
      'Dashboard edit access',
      'Free forever',
    ],
    categoryLimit: 1,
    badge: null,
    badgeColor: 'bg-gray-100 text-gray-600',
    cardStyle: {
      background: 'bg-white',
      border: 'border-gray-200',
      text: 'text-gray-700',
    },
    sortPriority: 1,
    isHighlighted: false,
    isPublic: true,
    cta: 'Claim Your Listing',
    ctaStyle: 'secondary',
  },

  verified: {
    key: 'verified',
    name: 'Verified',
    displayName: 'Verified',
    monthlyPrice: 49,
    annualPrice: 490, // ~17% discount
    jobToBeDone: 'I have a real online presence',
    description: 'Professional website + verified listing + analytics',
    highlightFeature: 'Professional Website Included',
    features: [
      'Everything in Free',
      'Boerne Verified badge',
      'Professional website at your own URL',
      'Mobile-optimized, conversion-focused design',
      'We verify license & insurance',
      'Up to 5 photos',
      'Listed in up to 2 categories',
      'Tracked phone number with call analytics',
      'Profile views & clicks dashboard',
      'Up to 3 active special offers',
      'Review request tools',
      'Priority placement above free listings',
    ],
    categoryLimit: 2,
    badge: '✓',
    badgeColor: 'bg-green-100 text-green-700',
    cardStyle: {
      background: 'bg-white',
      border: 'border-green-500',
      text: 'text-gray-700',
    },
    sortPriority: 2,
    isHighlighted: true,
    isPublic: true,
    cta: 'Get Verified',
    ctaStyle: 'primary',
  },

  foundingPartner: {
    key: 'foundingPartner',
    name: 'FoundingPartner',
    displayName: 'Founding Partner',
    monthlyPrice: 149, // Base price, actual is negotiated
    annualPrice: 1490,
    jobToBeDone: 'Sell me more',
    description: 'Concierge relationship — one per category',
    features: [
      'Everything in Verified',
      'Top-of-category placement',
      'Category exclusivity (1 per category)',
      'Custom branded landing page',
      'Premium website template',
      'Quarterly strategy call',
      'First access to new features',
      'Direct priority support',
    ],
    categoryLimit: 5,
    badge: '🏆',
    badgeColor: 'bg-amber-100 text-amber-700',
    cardStyle: {
      background: 'bg-gradient-to-br from-amber-50 to-white',
      border: 'border-amber-300',
      text: 'text-gray-700',
    },
    sortPriority: 3,
    isHighlighted: false,
    isPublic: false, // Concierge only — not on pricing page
    cta: 'Contact Us',
    ctaStyle: 'secondary',
  },
};

// =============================================================================
// HELPER FUNCTIONS
// =============================================================================

/**
 * Get all tiers as an array, sorted by sortPriority
 */
export const getAllTiers = (): PricingTier[] => {
  return Object.values(pricingTiers).sort((a, b) => a.sortPriority - b.sortPriority);
};

/**
 * Get tiers that should be displayed on the public pricing page
 * (v1: only Claimed and Verified)
 */
export const getDisplayTiers = (): PricingTier[] => {
  return getAllTiers().filter(tier => tier.isPublic);
};

/**
 * Get a specific tier by key
 */
export const getTier = (key: TierKey): PricingTier => {
  return pricingTiers[key];
};

/**
 * Get tier by sort priority (for listing sort order)
 */
export const getTierSortPriority = (key: TierKey): number => {
  return pricingTiers[key]?.sortPriority ?? 0;
};

/**
 * Get category limit for a tier
 */
export const getCategoryLimit = (key: TierKey): number => {
  return pricingTiers[key]?.categoryLimit ?? 1;
};

/**
 * Check if a tier is at or over category limit
 */
export const isAtCategoryLimit = (tierKey: TierKey, currentCount: number): boolean => {
  const limit = getCategoryLimit(tierKey);
  return currentCount >= limit;
};

/**
 * Check if a tier is over category limit
 */
export const isOverCategoryLimit = (tierKey: TierKey, currentCount: number): boolean => {
  const limit = getCategoryLimit(tierKey);
  return currentCount > limit;
};

/**
 * Get the next tier up for upgrade prompts
 */
export const getNextTierUp = (currentTierKey: TierKey): PricingTier | null => {
  const currentPriority = pricingTiers[currentTierKey].sortPriority;
  const allTiers = getAllTiers().filter(t => t.isPublic);
  return allTiers.find(tier => tier.sortPriority === currentPriority + 1) ?? null;
};

/**
 * Calculate annual savings
 */
export const getAnnualSavings = (tier: PricingTier): number => {
  if (tier.monthlyPrice === 0) return 0;
  return (tier.monthlyPrice * 12) - tier.annualPrice;
};

/**
 * Calculate monthly equivalent when billed annually
 */
export const getMonthlyEquivalent = (tier: PricingTier): number => {
  if (tier.annualPrice === 0) return 0;
  return Math.round(tier.annualPrice / 12);
};

/**
 * Format price for display
 */
export const formatPrice = (amount: number, period: 'month' | 'year' = 'month'): string => {
  if (amount === 0) return 'Free';
  return `$${amount}/${period === 'month' ? 'mo' : 'yr'}`;
};

// =============================================================================
// FOUNDING PARTNER (concierge tier)
// =============================================================================

/**
 * Founding Partner is limited to one per category.
 */
export const FOUNDING_PARTNER_PER_CATEGORY_LIMIT = 1;

/**
 * Check if tier includes website feature
 */
export const tierIncludesWebsite = (key: TierKey): boolean => {
  return key === 'verified' || key === 'foundingPartner';
};
