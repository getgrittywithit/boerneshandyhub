// =============================================================================
// PRICING TIERS — v1 Launch
// =============================================================================
// Per docs/PRICING_SPEC.md
// Four tiers: Unclaimed, Claimed (Free), Verified ($29), Verified+ ($67)
// Founding Partner is concierge-only, held for v2

export type TierKey = 'unclaimed' | 'claimed' | 'verified' | 'verifiedPlus' | 'foundingPartner';

export interface PricingTier {
  key: TierKey;
  name: string;
  displayName: string;
  monthlyPrice: number;
  annualPrice: number; // ~17% discount
  setupFee: number; // One-time setup (Verified+ uses Founder's Bundle)
  jobToBeDone: string;
  description: string;
  features: string[];
  highlightFeature?: string;
  categoryLimit: number;
  photoLimit: number;
  badge: string | null;
  badgeColor: string;
  cardStyle: {
    background: string;
    border: string;
    text: string;
  };
  sortPriority: number;
  isHighlighted: boolean;
  isPublic: boolean;
  hasWebsite: boolean;
  hasDoFollowLink: boolean;
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
    setupFee: 0,
    jobToBeDone: 'Does this business exist?',
    description: 'Business added from public data, not yet claimed by owner',
    features: [
      'Business name',
      'Phone number',
      'Address',
      'Category placement',
    ],
    categoryLimit: 1,
    photoLimit: 0,
    badge: null,
    badgeColor: 'bg-gray-100 text-gray-500',
    cardStyle: {
      background: 'bg-gray-50',
      border: 'border-gray-200',
      text: 'text-gray-500',
    },
    sortPriority: 0,
    isHighlighted: false,
    isPublic: false,
    hasWebsite: false,
    hasDoFollowLink: false,
    cta: 'Claim This Listing',
    ctaStyle: 'muted',
  },

  claimed: {
    key: 'claimed',
    name: 'Claimed',
    displayName: 'Free',
    monthlyPrice: 0,
    annualPrice: 0,
    setupFee: 0,
    jobToBeDone: "Here's our info",
    description: 'Claim your listing and take control of your profile',
    features: [
      'Listed in directory',
      'Business profile page',
      '1 photo (logo)',
      'Business description',
      'Hours of operation',
      'Website link (no-follow)',
      'Social media links',
      'Dashboard edit access',
      'Free forever',
    ],
    categoryLimit: 1,
    photoLimit: 1,
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
    hasWebsite: false,
    hasDoFollowLink: false,
    cta: 'Claim Your Listing',
    ctaStyle: 'secondary',
  },

  verified: {
    key: 'verified',
    name: 'Verified',
    displayName: 'Verified',
    monthlyPrice: 29,
    annualPrice: 260, // Save $88/year
    setupFee: 0,
    jobToBeDone: 'I want to look professional and boost my SEO',
    description: 'Enhanced listing with SEO backlink and priority placement',
    highlightFeature: 'Do-Follow Backlink for SEO',
    features: [
      'Everything in Free',
      'Boerne Verified badge',
      'Enhanced card design',
      'Up to 5 photos',
      'Do-follow backlink (SEO boost)',
      'Social media icons',
      'Listed in up to 2 categories',
      'Priority placement above free',
      '"Request Quote" button',
    ],
    categoryLimit: 2,
    photoLimit: 5,
    badge: '✓',
    badgeColor: 'bg-green-100 text-green-700',
    cardStyle: {
      background: 'bg-white',
      border: 'border-green-500',
      text: 'text-gray-700',
    },
    sortPriority: 2,
    isHighlighted: false,
    isPublic: true,
    hasWebsite: false,
    hasDoFollowLink: true,
    cta: 'Get Verified',
    ctaStyle: 'secondary',
  },

  verifiedPlus: {
    key: 'verifiedPlus',
    name: 'VerifiedPlus',
    displayName: 'Verified+',
    monthlyPrice: 67,
    annualPrice: 620, // Save $184/year
    setupFee: 199, // Founder's Bundle: first 3 months prepaid
    jobToBeDone: 'I want a complete local web presence',
    description: 'Professional website + top placement + Boerne Verified badge',
    highlightFeature: 'Professional Website Included',
    features: [
      'Everything in Verified',
      'Professional website (we build it)',
      'Mobile-optimized design',
      'Custom QR code kit',
      'Top-of-category placement',
      'Enhanced Verified+ badge',
      'Up to 15 photos',
      'Listed in up to 4 categories',
      'Priority quote routing',
      'Future: Newsletter & social inclusion',
    ],
    categoryLimit: 4,
    photoLimit: 15,
    badge: '✓+',
    badgeColor: 'bg-green-600 text-white',
    cardStyle: {
      background: 'bg-white',
      border: 'border-green-600 border-2',
      text: 'text-gray-700',
    },
    sortPriority: 3,
    isHighlighted: true,
    isPublic: true,
    hasWebsite: true,
    hasDoFollowLink: true,
    cta: 'Get Started',
    ctaStyle: 'primary',
  },

  foundingPartner: {
    key: 'foundingPartner',
    name: 'FoundingPartner',
    displayName: 'Founding Partner',
    monthlyPrice: 249,
    annualPrice: 2490,
    setupFee: 0, // Negotiated
    jobToBeDone: 'Be the top business in my category',
    description: 'Concierge relationship — one per category (v2)',
    features: [
      'Everything in Verified+',
      'Top-of-category placement',
      'Category exclusivity (1 per category)',
      'Custom branded landing page',
      'Premium website template',
      'Quarterly strategy call',
      'Monthly newsletter feature',
      'Monthly social spotlight',
      'Direct priority support',
    ],
    categoryLimit: 5,
    photoLimit: 999,
    badge: '🏆',
    badgeColor: 'bg-amber-100 text-amber-700',
    cardStyle: {
      background: 'bg-gradient-to-br from-amber-50 to-white',
      border: 'border-amber-300',
      text: 'text-gray-700',
    },
    sortPriority: 4,
    isHighlighted: false,
    isPublic: false, // Concierge only — not on pricing page
    hasWebsite: true,
    hasDoFollowLink: true,
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
 * (v1: Claimed, Verified, Verified+)
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
 * Get photo limit for a tier
 */
export const getPhotoLimit = (key: TierKey): number => {
  return pricingTiers[key]?.photoLimit ?? 1;
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
// TIER CHECKS
// =============================================================================

/**
 * Check if tier includes website feature
 */
export const tierIncludesWebsite = (key: TierKey): boolean => {
  return pricingTiers[key]?.hasWebsite ?? false;
};

/**
 * Check if tier includes do-follow backlink
 */
export const tierIncludesDoFollowLink = (key: TierKey): boolean => {
  return pricingTiers[key]?.hasDoFollowLink ?? false;
};

/**
 * Check if tier is a paid tier
 */
export const isPaidTier = (key: TierKey): boolean => {
  return pricingTiers[key]?.monthlyPrice > 0;
};

/**
 * Founding Partner is limited to one per category
 */
export const FOUNDING_PARTNER_PER_CATEGORY_LIMIT = 1;

// =============================================================================
// FOUNDER'S BUNDLE
// =============================================================================

/**
 * Founder's Bundle pricing for Verified+ tier
 * $199 upfront covers first 3 months + onboarding
 */
export const FOUNDERS_BUNDLE = {
  price: 199,
  monthsIncluded: 3,
  tier: 'verifiedPlus' as TierKey,
  description: 'First 3 months + website setup included',
};

/**
 * Calculate Founder's Bundle savings
 * $199 vs ($67 × 3 = $201) = saves $2 + gets website built
 */
export const getFoundersBundleSavings = (): number => {
  const normalCost = pricingTiers.verifiedPlus.monthlyPrice * FOUNDERS_BUNDLE.monthsIncluded;
  return normalCost - FOUNDERS_BUNDLE.price;
};
