'use client';

import Link from 'next/link';
import Image from 'next/image';
import { pricingTiers, type TierKey } from '@/data/pricingTiers';

// Map legacy database tier names to new tier keys
const tierMapping: Record<string, TierKey> = {
  basic: 'claimed',
  verified: 'verified',
  premium: 'verifiedPlus',
  elite: 'partner',
};

interface ServiceProvider {
  id: string;
  name: string;
  category: string;
  subcategories: string[];
  description: string;
  address: string;
  phone: string;
  email: string;
  website?: string;
  rating: number;
  reviewCount: number;
  membershipTier: string;
  claimStatus: 'unclaimed' | 'pending' | 'verified';
  yearsInBusiness?: number;
  licensed: boolean;
  insured: boolean;
  services: string[];
  serviceArea: string[];
  photos: string[];
  bernieRecommendation?: string;
  specialOffers?: string[];
  hours?: string;
  keywords: string[];
}

interface ProviderCardProps {
  provider: ServiceProvider;
  topCategorySlug: string;
  subcategorySlug: string;
  subcategoryName?: string;
}

export default function ProviderCard({
  provider,
  topCategorySlug,
  subcategorySlug,
  subcategoryName,
}: ProviderCardProps) {
  // Map legacy tier to new tier key
  const tierKey = tierMapping[provider.membershipTier] || 'claimed';
  const tier = pricingTiers[tierKey];
  const isUnclaimed = provider.claimStatus === 'unclaimed' && tierKey === 'claimed';

  // Tier-based styles
  const tierStyles = getTierStyles(tierKey, isUnclaimed);

  // How many photos to show based on tier
  const photoLimit = getPhotoLimit(tierKey);
  const photosToShow = provider.photos?.slice(0, photoLimit) || [];

  // How many special offers to show based on tier
  const offerLimit = getOfferLimit(tierKey);
  const offersToShow = provider.specialOffers?.slice(0, offerLimit) || [];

  // Partner badge should be category-specific
  const badgeText = getBadgeText(tierKey, subcategoryName);

  return (
    <div className={`${tierStyles.container} ${tierStyles.animation}`}>
      {/* Partner/Premium Ribbon */}
      {tierStyles.ribbon && (
        <div className={tierStyles.ribbonStyle}>
          {tierStyles.ribbonText}
        </div>
      )}

      {/* Gradient Header */}
      {!isUnclaimed && (
        <div className={`${tierStyles.gradient} h-2`} />
      )}

      {/* Photo Gallery - Only for claimed+ with photos */}
      {photosToShow.length > 0 && !isUnclaimed && (
        <div className={`${tierStyles.photoContainer}`}>
          {photosToShow.length === 1 ? (
            <div className="relative h-32 w-full">
              <Image
                src={photosToShow[0]}
                alt={provider.name}
                fill
                className="object-cover"
              />
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-1 h-32">
              {photosToShow.map((photo, idx) => (
                <div key={idx} className="relative h-full">
                  <Image
                    src={photo}
                    alt={`${provider.name} ${idx + 1}`}
                    fill
                    className="object-cover"
                  />
                  {idx === photosToShow.length - 1 && provider.photos.length > photoLimit && (
                    <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                      <span className="text-white font-semibold">
                        +{provider.photos.length - photoLimit}
                      </span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      <div className={`p-5 flex flex-col flex-1 ${isUnclaimed ? 'opacity-75' : ''}`}>
        {/* Header with Badge */}
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1 min-w-0">
            <h3 className={`font-semibold text-lg truncate ${tierStyles.nameColor}`}>
              {provider.name}
            </h3>
            {provider.yearsInBusiness && provider.yearsInBusiness >= 1 && (
              <p className="text-sm text-gray-500 mt-0.5">
                {provider.yearsInBusiness}+ years in business
              </p>
            )}
          </div>
          {badgeText && (
            <span className={`${tierStyles.badge} text-xs font-medium px-2 py-1 rounded-full whitespace-nowrap ml-2`}>
              {badgeText}
            </span>
          )}
        </div>

        {/* Unclaimed notice */}
        {isUnclaimed && (
          <div className="bg-gray-100 border border-dashed border-gray-300 rounded-lg p-3 mb-4 text-center">
            <p className="text-sm text-gray-500">
              This listing hasn&apos;t been claimed yet
            </p>
          </div>
        )}

        {/* Description - Not for unclaimed */}
        {provider.description && !isUnclaimed && (
          <p className="text-gray-600 text-sm mb-4 line-clamp-2">
            {provider.description}
          </p>
        )}

        {/* Hours - If available */}
        {provider.hours && !isUnclaimed && (
          <div className="flex items-center gap-2 text-sm text-gray-600 mb-3">
            <span>🕐</span>
            <span>{provider.hours}</span>
          </div>
        )}

        {/* Services Preview - Not for unclaimed */}
        {provider.services.length > 0 && !isUnclaimed && (
          <div className="mb-4">
            <p className="text-xs text-gray-500 mb-1">Services:</p>
            <p className="text-sm text-gray-700 line-clamp-1">
              {provider.services.slice(0, 3).join(', ')}
              {provider.services.length > 3 && ` +${provider.services.length - 3} more`}
            </p>
          </div>
        )}

        {/* Verified Credentials Box - Only for verified+ */}
        {tierKey !== 'claimed' && !isUnclaimed && (provider.licensed || provider.insured) && (
          <div className={`${tierStyles.credentialsBox} rounded-lg p-3 mb-4`}>
            <p className="text-xs text-gray-500 mb-2 font-medium">Verified Credentials</p>
            <div className="flex flex-wrap gap-2">
              {provider.licensed && (
                <span className="bg-green-100 text-green-700 text-xs px-2 py-1 rounded-full font-medium">
                  ✓ Licensed
                </span>
              )}
              {provider.insured && (
                <span className="bg-blue-100 text-blue-700 text-xs px-2 py-1 rounded-full font-medium">
                  ✓ Insured
                </span>
              )}
            </div>
          </div>
        )}

        {/* Special Offers - Based on tier limit */}
        {offersToShow.length > 0 && !isUnclaimed && (
          <div className={`${tierStyles.offerBox} p-3 rounded-lg mb-4`}>
            <p className="text-xs font-medium text-yellow-800 mb-1">
              {offersToShow.length > 1 ? 'Special Offers' : 'Special Offer'}
            </p>
            {offersToShow.map((offer, idx) => (
              <p key={idx} className="text-yellow-700 text-sm">
                🎉 {offer}
              </p>
            ))}
          </div>
        )}

        {/* Bernie Recommendation - Premium feature */}
        {provider.bernieRecommendation && (tierKey === 'verifiedPlus' || tierKey === 'partner') && (
          <div className="bg-boerne-navy/5 border border-boerne-navy/10 p-3 rounded-lg mb-4">
            <p className="text-xs text-boerne-navy font-medium mb-1">⭐ Staff Pick</p>
            <p className="text-sm text-gray-600 italic line-clamp-2">
              &quot;{provider.bernieRecommendation}&quot;
            </p>
          </div>
        )}

        {/* Spacer */}
        <div className="flex-1" />

        {/* Footer */}
        <div className="pt-4 border-t border-gray-100">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm text-gray-500">
              📍 {provider.serviceArea[0] || 'Boerne'}
            </span>
            {provider.rating > 0 && (
              <span className="text-sm text-gray-600">
                ⭐ {provider.rating.toFixed(1)} ({provider.reviewCount})
              </span>
            )}
          </div>

          {/* CTAs */}
          {isUnclaimed ? (
            <Link
              href={`/business/claim/${provider.id}`}
              className="block w-full px-4 py-3 bg-boerne-gold text-boerne-navy font-semibold rounded-lg hover:bg-boerne-gold-alt transition-colors text-center"
            >
              Claim This Listing
            </Link>
          ) : (
            <div className="flex gap-2">
              <a
                href={`tel:${provider.phone}`}
                className={`flex-1 px-3 py-2 ${tierStyles.callButton} font-semibold rounded-lg transition-colors text-sm text-center`}
              >
                📞 Call
              </a>
              <Link
                href={`/services/${topCategorySlug}/${subcategorySlug}/${provider.id}`}
                className={`flex-1 px-3 py-2 ${tierStyles.viewButton} font-semibold rounded-lg transition-colors text-sm text-center`}
              >
                View Profile
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// Helper functions for tier-based styling

function getTierStyles(tierKey: TierKey, isUnclaimed: boolean) {
  if (isUnclaimed) {
    return {
      container: 'bg-gray-50 rounded-xl border-2 border-dashed border-gray-300 overflow-hidden flex flex-col',
      animation: 'hover:border-gray-400 transition-all duration-300',
      gradient: '',
      nameColor: 'text-gray-700',
      badge: 'bg-gray-200 text-gray-600',
      credentialsBox: '',
      offerBox: '',
      photoContainer: '',
      callButton: 'bg-gray-200 text-gray-600 hover:bg-gray-300',
      viewButton: 'bg-gray-300 text-gray-700 hover:bg-gray-400',
      ribbon: false,
      ribbonStyle: '',
      ribbonText: '',
    };
  }

  switch (tierKey) {
    case 'partner':
      return {
        container: 'bg-gradient-to-br from-amber-50 via-white to-amber-50 rounded-xl border-2 border-amber-400 overflow-hidden flex flex-col shadow-lg shadow-amber-100',
        animation: 'hover:shadow-xl hover:shadow-amber-200 hover:border-amber-500 transition-all duration-300 hover:-translate-y-1',
        gradient: 'bg-gradient-to-r from-amber-400 via-yellow-400 to-amber-400',
        nameColor: 'text-gray-900',
        badge: 'bg-amber-100 text-amber-800 border border-amber-300',
        credentialsBox: 'bg-amber-50 border border-amber-200',
        offerBox: 'bg-yellow-50 border border-yellow-300',
        photoContainer: 'border-b-2 border-amber-200',
        callButton: 'bg-boerne-navy text-white hover:bg-boerne-navy/90',
        viewButton: 'bg-amber-500 text-white hover:bg-amber-600',
        ribbon: true,
        ribbonStyle: 'absolute top-3 -right-8 bg-amber-500 text-white text-xs font-bold px-8 py-1 rotate-45 shadow-md z-10',
        ribbonText: 'PARTNER',
      };

    case 'verifiedPlus':
      return {
        container: 'bg-white rounded-xl border-2 border-boerne-gold overflow-hidden flex flex-col shadow-md',
        animation: 'hover:shadow-lg hover:border-boerne-gold-alt transition-all duration-300 hover:-translate-y-0.5',
        gradient: 'bg-gradient-to-r from-boerne-gold via-yellow-400 to-boerne-gold',
        nameColor: 'text-gray-900',
        badge: 'bg-boerne-gold/20 text-boerne-gold-dark border border-boerne-gold/30',
        credentialsBox: 'bg-boerne-gold/5 border border-boerne-gold/20',
        offerBox: 'bg-yellow-50 border border-yellow-200',
        photoContainer: 'border-b border-boerne-gold/30',
        callButton: 'bg-boerne-navy text-white hover:bg-boerne-navy/90',
        viewButton: 'bg-boerne-gold text-boerne-navy hover:bg-boerne-gold-alt',
        ribbon: true,
        ribbonStyle: 'absolute top-2 right-2 bg-boerne-gold text-boerne-navy text-xs font-bold px-2 py-0.5 rounded shadow-sm z-10',
        ribbonText: '★ FEATURED',
      };

    case 'verified':
      return {
        container: 'bg-white rounded-xl border border-green-300 overflow-hidden flex flex-col',
        animation: 'hover:border-green-400 hover:shadow-lg transition-all duration-300',
        gradient: 'bg-gradient-to-r from-green-500 to-emerald-600',
        nameColor: 'text-gray-900',
        badge: 'bg-green-100 text-green-700',
        credentialsBox: 'bg-gray-50 border border-gray-200',
        offerBox: 'bg-yellow-50 border border-yellow-200',
        photoContainer: 'border-b border-green-100',
        callButton: 'bg-boerne-navy text-white hover:bg-boerne-navy/90',
        viewButton: 'bg-boerne-gold text-boerne-navy hover:bg-boerne-gold-alt',
        ribbon: false,
        ribbonStyle: '',
        ribbonText: '',
      };

    case 'claimed':
    default:
      return {
        container: 'bg-white rounded-xl border border-gray-200 overflow-hidden flex flex-col',
        animation: 'hover:border-gray-300 hover:shadow-md transition-all duration-300',
        gradient: 'bg-gradient-to-r from-gray-300 to-gray-400',
        nameColor: 'text-gray-900',
        badge: 'bg-gray-100 text-gray-600',
        credentialsBox: 'bg-gray-50 border border-gray-200',
        offerBox: 'bg-yellow-50 border border-yellow-200',
        photoContainer: 'border-b border-gray-100',
        callButton: 'bg-boerne-navy text-white hover:bg-boerne-navy/90',
        viewButton: 'bg-boerne-gold text-boerne-navy hover:bg-boerne-gold-alt',
        ribbon: false,
        ribbonStyle: '',
        ribbonText: '',
      };
  }
}

function getPhotoLimit(tierKey: TierKey): number {
  switch (tierKey) {
    case 'partner':
      return 4; // Show 4 on card (unlimited in profile)
    case 'verifiedPlus':
      return 3; // Show 3 on card (up to 15 in profile)
    case 'verified':
      return 2; // Show 2 on card (up to 5 in profile)
    case 'claimed':
      return 1; // Show 1 on card
    default:
      return 0;
  }
}

function getOfferLimit(tierKey: TierKey): number {
  switch (tierKey) {
    case 'partner':
      return 3;
    case 'verifiedPlus':
      return 3;
    case 'verified':
      return 1;
    default:
      return 1;
  }
}

function getBadgeText(tierKey: TierKey, subcategoryName?: string): string | null {
  switch (tierKey) {
    case 'partner':
      return `🏆 ${subcategoryName || ''} Partner`.trim();
    case 'verifiedPlus':
      return '✓+ Verified Plus';
    case 'verified':
      return '✓ Verified';
    case 'claimed':
      return null; // No badge for basic
    default:
      return null;
  }
}
