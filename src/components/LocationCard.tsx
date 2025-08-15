'use client';

import { useState } from 'react';

export type MembershipTier = 'basic' | 'verified' | 'silver' | 'gold';

export interface LocationData {
  id: string;
  name: string;
  address: string;
  category: string;
  rating: number;
  priceLevel: string; // $, $$, $$$
  hours: string;
  phone?: string;
  website?: string;
  description: string;
  membershipTier: MembershipTier;
  keywords: string[]; // SEO/search keywords
  photos: string[];
  specialOffers?: string[];
  events?: string[];
  bernieRecommendation?: string;
  verifiedDate?: Date;
  lastUpdated?: Date;
  responseTime?: string;
  features?: string[];
}

const membershipConfig: Record<MembershipTier, {
  icon: string;
  badge: { text: string; color: string; icon: string; } | null;
  color: string;
  bgColor: string;
  maxPhotos: number;
  maxKeywords: number;
  maxDescriptionChars: number;
  showAnalytics: boolean;
  priority: number;
  featured?: boolean;
  premium?: boolean;
  price: number;
}> = {
  basic: {
    icon: '📍',
    badge: null,
    color: 'border-gray-300',
    bgColor: 'bg-white',
    maxPhotos: 1,
    maxKeywords: 0,
    maxDescriptionChars: 100,
    showAnalytics: false,
    priority: 0,
    price: 0
  },
  verified: {
    icon: '📍',
    badge: { text: 'VERIFIED', color: 'bg-boerne-gold text-boerne-navy', icon: '✅' },
    color: 'border-boerne-gold',
    bgColor: 'bg-white',
    maxPhotos: 3,
    maxKeywords: 2,
    maxDescriptionChars: 300,
    showAnalytics: false,
    priority: 1,
    price: 0
  },
  silver: {
    icon: '🥈',
    badge: { text: 'SILVER', color: 'bg-gray-500 text-white', icon: '🥈' },
    color: 'border-gray-500',
    bgColor: 'bg-gradient-to-r from-gray-50 to-blue-50',
    maxPhotos: 10,
    maxKeywords: 5,
    maxDescriptionChars: 500,
    showAnalytics: true,
    priority: 2,
    featured: true,
    price: 19
  },
  gold: {
    icon: '🥇',
    badge: { text: 'GOLD', color: 'bg-yellow-500 text-yellow-900', icon: '🥇' },
    color: 'border-yellow-500',
    bgColor: 'bg-gradient-to-r from-yellow-50 to-amber-50',
    maxPhotos: 999,
    maxKeywords: 10,
    maxDescriptionChars: 999,
    showAnalytics: true,
    priority: 3,
    featured: true,
    premium: true,
    price: 39
  }
};

export default function LocationCard({ location, compact = false }: { 
  location: LocationData; 
  compact?: boolean;
}) {
  const [showFullDescription, setShowFullDescription] = useState(false);
  const config = membershipConfig[location.membershipTier];
  
  const displayPhotos = location.photos.slice(0, config.maxPhotos);
  const truncatedDescription = location.description.length > 150 
    ? location.description.substring(0, 150) + '...'
    : location.description;

  return (
    <div className={`
      rounded-lg shadow-lg p-4 border-2 transition-all duration-200 hover:shadow-xl
      ${config.color} ${config.bgColor}
      ${compact ? 'max-w-sm' : 'max-w-md'}
    `}>
      {/* Header */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-start space-x-2 flex-1">
          <span className="text-xl">{config.icon}</span>
          <div className="flex-1">
            <h3 className="font-bold text-lg text-boerne-navy leading-tight">
              {location.name}
            </h3>
            <p className="text-sm text-boerne-dark-gray">{location.address}</p>
          </div>
        </div>
        
        {/* Membership Badge */}
        {config.badge && (
          <div className={`
            px-2 py-1 rounded-full text-xs font-bold flex items-center space-x-1
            ${config.badge.color}
          `}>
            <span>{config.badge.icon}</span>
            <span>{config.badge.text}</span>
          </div>
        )}
      </div>

      {/* Featured Banner for Silver/Gold */}
      {config.featured && (
        <div className="mb-3 p-2 bg-boerne-gold bg-opacity-20 rounded border border-boerne-gold">
          <p className="text-xs font-semibold text-boerne-navy text-center">
            {config.premium ? '🏆 PREMIUM BOERNE BUSINESS 🏆' : '⭐ FEATURED IN BOERNE ⭐'}
          </p>
        </div>
      )}

      {/* Rating and Info */}
      <div className="flex items-center space-x-2 mb-3 text-sm text-boerne-dark-gray">
        <span className="flex items-center">
          ⭐ {location.rating.toFixed(1)}
        </span>
        <span>•</span>
        <span>{location.priceLevel}</span>
        <span>•</span>
        <span>{location.category}</span>
      </div>

      {/* Keywords */}
      {location.keywords && location.keywords.length > 0 && (
        <div className="mb-3">
          <div className="flex flex-wrap gap-1">
            {location.keywords.slice(0, config.maxKeywords).map((keyword, index) => (
              <span 
                key={index}
                className="px-2 py-1 bg-boerne-light-blue bg-opacity-20 text-boerne-navy text-xs rounded-full border border-boerne-light-blue"
              >
                {keyword}
              </span>
            ))}
            {config.maxKeywords > 0 && (
              <span className="text-xs text-boerne-dark-gray self-center">
                ({location.keywords.length}/{config.maxKeywords} keywords)
              </span>
            )}
          </div>
        </div>
      )}

      {/* Hours and Status */}
      <div className="flex items-center justify-between mb-3 text-sm">
        <span className="text-boerne-dark-gray">{location.hours}</span>
        {location.membershipTier !== 'basic' && (
          <span className="text-xs text-boerne-light-blue">
            {location.responseTime || 'Verified Owner'}
          </span>
        )}
      </div>

      {/* Photos */}
      {displayPhotos.length > 0 && (
        <div className="mb-3">
          <div className="bg-boerne-light-gray rounded p-2 text-center text-sm text-boerne-dark-gray">
            📸 Photo Gallery - {displayPhotos.length} photo{displayPhotos.length !== 1 ? 's' : ''}
          </div>
        </div>
      )}

      {/* Special Offers */}
      {location.specialOffers && location.specialOffers.length > 0 && (
        <div className="mb-3">
          {location.specialOffers.map((offer, index) => (
            <div key={index} className="bg-boerne-gold bg-opacity-20 border border-boerne-gold rounded p-2 mb-2">
              <p className="text-sm font-medium text-boerne-navy">
                🎪 SPECIAL: {offer}
              </p>
            </div>
          ))}
        </div>
      )}

      {/* Events */}
      {location.events && location.events.length > 0 && (
        <div className="mb-3">
          {location.events.map((event, index) => (
            <div key={index} className="bg-boerne-green bg-opacity-20 border border-boerne-green rounded p-2 mb-2">
              <p className="text-sm font-medium text-boerne-navy">
                📅 EVENT: {event}
              </p>
            </div>
          ))}
        </div>
      )}

      {/* Description */}
      <div className="mb-3">
        <p className="text-sm text-boerne-dark-gray leading-relaxed">
          {showFullDescription ? location.description : truncatedDescription}
        </p>
        {location.description.length > 150 && (
          <button
            onClick={() => setShowFullDescription(!showFullDescription)}
            className="text-xs text-boerne-light-blue hover:text-boerne-gold mt-1"
          >
            {showFullDescription ? 'Show Less' : 'Read More'}
          </button>
        )}
      </div>

      {/* Bernie's Recommendation */}
      {location.bernieRecommendation && (
        <div className="mb-3 p-3 bg-boerne-light-blue bg-opacity-10 border border-boerne-light-blue rounded">
          <p className="text-xs font-semibold text-boerne-navy mb-1">
            Bernie&apos;s Recommendation: 🤠
          </p>
          <p className="text-sm text-boerne-dark-gray italic">
            &quot;{location.bernieRecommendation}&quot;
          </p>
        </div>
      )}

      {/* Analytics for Paid Members */}
      {config.showAnalytics && (
        <div className="mb-3 p-2 bg-boerne-navy bg-opacity-5 rounded">
          <p className="text-xs text-boerne-navy">
            📊 {config.premium ? 'Full Analytics' : 'Basic Analytics'} Available
          </p>
        </div>
      )}

      {/* Features List for Public Spots */}
      {location.features && location.features.length > 0 && (
        <div className="mb-3">
          <p className="text-xs font-semibold text-boerne-navy mb-2">Park Features:</p>
          <div className="grid grid-cols-1 gap-1">
            {location.features.slice(0, 4).map((feature, index) => (
              <div key={index} className="text-xs text-boerne-dark-gray flex items-start">
                <span className="text-boerne-gold mr-1">•</span>
                <span>{feature}</span>
              </div>
            ))}
            {location.features.length > 4 && (
              <div className="text-xs text-boerne-light-blue">
                +{location.features.length - 4} more features
              </div>
            )}
          </div>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex flex-wrap gap-2 text-sm">
        {location.phone && (
          <button className="flex items-center space-x-1 px-3 py-1 bg-boerne-light-blue text-white rounded hover:bg-opacity-80 transition-colors">
            <span>📞</span>
            <span>Call</span>
          </button>
        )}
        
        {location.website && (
          <button className="flex items-center space-x-1 px-3 py-1 bg-boerne-navy text-white rounded hover:bg-opacity-80 transition-colors">
            <span>🏛️</span>
            <span>Official Info</span>
          </button>
        )}

        {location.membershipTier !== 'basic' && (
          <button className="flex items-center space-x-1 px-3 py-1 bg-boerne-gold text-boerne-navy rounded hover:bg-boerne-gold-alt transition-colors">
            <span>💬</span>
            <span>{config.premium ? 'Live Chat' : 'Message'}</span>
          </button>
        )}

        {(location.specialOffers?.length || location.events?.length) && config.showAnalytics && (
          <>
            {location.specialOffers?.length && (
              <button className="flex items-center space-x-1 px-3 py-1 bg-boerne-navy text-white rounded hover:bg-opacity-80 transition-colors">
                <span>🎟️</span>
                <span>Offers</span>
              </button>
            )}
            
            {location.events?.length && (
              <button className="flex items-center space-x-1 px-3 py-1 bg-boerne-green text-white rounded hover:bg-opacity-80 transition-colors">
                <span>📅</span>
                <span>Events</span>
              </button>
            )}
          </>
        )}
      </div>

      {/* Last Updated */}
      {location.verifiedDate && location.membershipTier !== 'basic' && (
        <div className="mt-3 pt-2 border-t border-boerne-light-gray">
          <p className="text-xs text-boerne-dark-gray">
            {location.membershipTier === 'verified' 
              ? `Verified ${Math.floor((Date.now() - location.verifiedDate.getTime()) / (1000 * 60 * 60 * 24))} days ago`
              : 'Owner Verified • Updated recently'
            }
          </p>
        </div>
      )}
    </div>
  );
}