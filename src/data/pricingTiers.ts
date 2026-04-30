// =============================================================================
// PRICING TIERS - Single Source of Truth
// =============================================================================
// Canonical tier definitions for BoernesHandyHub.com
// Both PricingSection.tsx and serviceCategories.ts import from here.
// DO NOT define tier names, prices, or features elsewhere.

export type TierKey = 'unclaimed' | 'claimed' | 'verified' | 'verifiedPlus' | 'partner';

export interface PricingTier {
  key: TierKey;
  name: string;
  displayName: string; // For UI display (e.g., "Verified Plus")
  monthlyPrice: number;
  annualPrice: number; // ~17% discount (2 months free)
  jobToBeDone: string; // The question this tier answers
  description: string;
  features: string[];
  categoryLimit: number;
  badge: string | null;
  badgeColor: string;
  cardStyle: {
    background: string;
    border: string;
    text: string;
  };
  sortPriority: number; // Higher = appears first in listings
  isHighlighted: boolean; // "Most Popular" treatment on pricing page
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
    description: 'Claim your listing and add your details',
    features: [
      'Listed in directory',
      'Basic business profile',
      '1 photo',
      'Business description',
      'Hours of operation',
      'Website & social links',
      'Edit access via dashboard',
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
    cta: 'Get Started Free',
    ctaStyle: 'secondary',
  },

  verified: {
    key: 'verified',
    name: 'Verified',
    displayName: 'Verified',
    monthlyPrice: 29,
    annualPrice: 290, // ~17% discount
    jobToBeDone: 'Be Listed',
    description: 'Stand out with verified credentials',
    features: [
      'Everything in Free',
      'Boerne Verified badge',
      'We verify license & insurance',
      'Up to 5 photos',
      'Listed in up to 2 categories',
      'Tracked phone number with analytics',
      'Profile views/clicks dashboard',
      'Special offers section',
      'Review request tools',
      'Priority placement above free listings',
    ],
    categoryLimit: 2,
    badge: '✓',
    badgeColor: 'bg-green-100 text-green-700',
    cardStyle: {
      background: 'bg-white',
      border: 'border-green-200',
      text: 'text-gray-700',
    },
    sortPriority: 2,
    isHighlighted: false,
    cta: 'Get Verified',
    ctaStyle: 'secondary',
  },

  verifiedPlus: {
    key: 'verifiedPlus',
    name: 'VerifiedPlus',
    displayName: 'Verified Plus',
    monthlyPrice: 79,
    annualPrice: 790, // ~17% discount
    jobToBeDone: 'Be More Visible',
    description: 'Get more leads with priority placement',
    features: [
      'Everything in Verified',
      'Verified Plus badge',
      'Sponsored boost above Verified listings',
      'Up to 15 photos',
      'Listed in up to 4 categories',
      'Auto-share offers to our social channels',
      'Monthly newsletter inclusion (group)',
      'Up to 3 active special offers',
      'Monthly performance email',
      'Priority email support',
    ],
    categoryLimit: 4,
    badge: '✓+',
    badgeColor: 'bg-boerne-gold/20 text-boerne-gold-dark',
    cardStyle: {
      background: 'bg-white',
      border: 'border-boerne-gold',
      text: 'text-gray-700',
    },
    sortPriority: 3,
    isHighlighted: true,
    cta: 'Go Verified Plus',
    ctaStyle: 'primary',
  },

  partner: {
    key: 'partner',
    name: 'Partner',
    displayName: 'Partner',
    monthlyPrice: 249,
    annualPrice: 2490, // ~17% discount
    jobToBeDone: 'Be Marketed',
    description: 'Maximum visibility — one per category',
    features: [
      'Everything in Verified Plus',
      'Boerne [Category] Partner badge',
      'One per category — exclusive',
      'Top of category placement, guaranteed',
      'Unlimited photos + 1 video',
      'Listed in up to 5 categories',
      'Monthly solo social media post',
      'Monthly solo newsletter feature',
      'Quarterly blog feature',
      'Homepage carousel rotation',
      'Welcome packet inclusion',
      'Custom branded landing page',
      'Quarterly performance review call',
      'Priority phone support',
    ],
    categoryLimit: 5,
    badge: '🏆',
    badgeColor: 'bg-amber-100 text-amber-700',
    cardStyle: {
      background: 'bg-gradient-to-br from-amber-50 to-white',
      border: 'border-amber-300',
      text: 'text-gray-700',
    },
    sortPriority: 4,
    isHighlighted: false,
    cta: 'Become a Partner',
    ctaStyle: 'secondary',
  },
};

// =============================================================================
// HELPER FUNCTIONS
// =============================================================================

/**
 * Get all tiers as an array, sorted by sortPriority (lowest first for pricing page display)
 */
export const getAllTiers = (): PricingTier[] => {
  return Object.values(pricingTiers).sort((a, b) => a.sortPriority - b.sortPriority);
};

/**
 * Get tiers that should be displayed on the public pricing page
 * (excludes Unclaimed since that's not a purchasable option)
 */
export const getDisplayTiers = (): PricingTier[] => {
  return getAllTiers().filter(tier => tier.key !== 'unclaimed');
};

/**
 * Get a specific tier by key
 */
export const getTier = (key: TierKey): PricingTier => {
  return pricingTiers[key];
};

/**
 * Get tier by sort priority (for listing sort order)
 * Higher priority = appears first
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
 * Check if a tier is over category limit (post-downgrade state)
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
  const allTiers = getAllTiers();
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
// PARTNER EXCLUSIVITY
// =============================================================================

/**
 * Partner tier is limited to one per category.
 * This constant is used for enforcement logic.
 */
export const PARTNER_PER_CATEGORY_LIMIT = 1;

/**
 * Grace period (in days) after downgrade before categories are auto-removed
 */
export const DOWNGRADE_GRACE_PERIOD_DAYS = 14;
