// Tier boost multipliers for search ranking
// Higher values = ranked higher in results

export const TIER_BOOST: Record<string, number> = {
  // Business tiers
  Partner: 1.50,
  VerifiedPlus: 1.20,
  Verified: 1.00,
  Claimed: 0.85,
  Unclaimed: 0.65,

  // Legacy/alternative tier names (map to new values)
  elite: 1.50,
  premium: 1.20,
  verified: 1.00,
  basic: 0.65,

  // Default
  default: 1.00,
};

/**
 * Get the boost multiplier for a given tier
 * @param tier - The tier name (case-insensitive)
 * @returns The boost multiplier
 */
export function getTierBoost(tier: string | null | undefined): number {
  if (!tier) return TIER_BOOST.default;

  // Try exact match first
  if (tier in TIER_BOOST) {
    return TIER_BOOST[tier];
  }

  // Try lowercase match
  const lowerTier = tier.toLowerCase();
  if (lowerTier in TIER_BOOST) {
    return TIER_BOOST[lowerTier];
  }

  return TIER_BOOST.default;
}

/**
 * Get tier display info
 */
export const TIER_DISPLAY: Record<string, { label: string; color: string; badge?: boolean }> = {
  Partner: { label: 'Partner', color: 'bg-boerne-gold text-boerne-navy', badge: true },
  VerifiedPlus: { label: 'Verified+', color: 'bg-blue-600 text-white', badge: true },
  Verified: { label: 'Verified', color: 'bg-green-600 text-white', badge: true },
  Claimed: { label: 'Claimed', color: 'bg-gray-500 text-white', badge: false },
  Unclaimed: { label: '', color: '', badge: false },
  // Legacy mappings
  elite: { label: 'Partner', color: 'bg-boerne-gold text-boerne-navy', badge: true },
  premium: { label: 'Verified+', color: 'bg-blue-600 text-white', badge: true },
  verified: { label: 'Verified', color: 'bg-green-600 text-white', badge: true },
  basic: { label: '', color: '', badge: false },
};

export function getTierDisplay(tier: string | null | undefined) {
  if (!tier) return TIER_DISPLAY.Unclaimed;
  return TIER_DISPLAY[tier] || TIER_DISPLAY[tier.toLowerCase()] || TIER_DISPLAY.Unclaimed;
}
