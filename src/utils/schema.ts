// Schema.org structured data utilities for SEO
// Generates valid LocalBusiness, Service, and other schema types

/**
 * Maps provider categories to schema.org business types
 * @see https://schema.org/LocalBusiness for full list
 */
export const BUSINESS_TYPE_MAP: Record<string, string> = {
  // Home services
  'plumbing': 'Plumber',
  'electrical': 'Electrician',
  'hvac': 'HVACBusiness',
  'roofing': 'RoofingContractor',
  'fencing': 'HomeAndConstructionBusiness',
  'painting': 'HousePainter',
  'flooring': 'HomeAndConstructionBusiness',
  'remodeling': 'GeneralContractor',
  'pest-control': 'PestControlCompany',
  'landscaping': 'LandscapingBusiness',
  'tree-service': 'HomeAndConstructionBusiness',
  'pool-service': 'HomeAndConstructionBusiness',
  'cleaning': 'HousekeepingService',
  'handyman': 'HomeAndConstructionBusiness',
  'garage-doors': 'HomeAndConstructionBusiness',
  'foundation-repair': 'HomeAndConstructionBusiness',
  'septic': 'HomeAndConstructionBusiness',
  'gutters': 'HomeAndConstructionBusiness',
  'pressure-washing': 'HomeAndConstructionBusiness',
  'locksmith': 'Locksmith',

  // Auto services
  'mechanic': 'AutoRepair',
  'body-shop': 'AutoBodyShop',
  'towing': 'AutoRepair',
  'detailing': 'AutoWash',
  'tire-shop': 'TireShop',
  'windshield-glass': 'AutoRepair',
  'oil-change': 'AutoRepair',
  'mobile-mechanic': 'AutoRepair',

  // Outdoor/Land
  'welding': 'HomeAndConstructionBusiness',
  'ag-fencing': 'HomeAndConstructionBusiness',
  'brush-clearing': 'HomeAndConstructionBusiness',
  'excavation': 'HomeAndConstructionBusiness',
  'concrete': 'HomeAndConstructionBusiness',
  'well-drilling': 'HomeAndConstructionBusiness',
  'wildlife-management': 'LocalBusiness',
  'barn-shop': 'HomeAndConstructionBusiness',

  // Commercial
  'commercial-hvac': 'HVACBusiness',
  'janitorial': 'ProfessionalService',
  'parking-lot': 'HomeAndConstructionBusiness',
  'signage': 'ProfessionalService',
  'commercial-construction': 'GeneralContractor',

  // Specialty/Seasonal
  'holiday-lighting': 'HomeAndConstructionBusiness',
  'moving': 'MovingCompany',
  'junk-hauling': 'ProfessionalService',
  'porta-potty': 'LocalBusiness',
  'storage': 'SelfStorage',
  'generators': 'ElectricalContractor',
};

/**
 * Get the schema.org business type for a category
 */
export function getBusinessType(category: string): string {
  return BUSINESS_TYPE_MAP[category] || 'LocalBusiness';
}

/**
 * Format years in business to ISO 8601 date string
 */
export function formatFoundingDate(yearsInBusiness: number): string {
  const year = new Date().getFullYear() - yearsInBusiness;
  return `${year}-01-01`;
}

/**
 * Generate default opening hours specification
 * Can be customized per provider if hours data is available
 */
export function generateOpeningHours(customHours?: {
  days: string[];
  opens: string;
  closes: string;
}): object {
  if (customHours) {
    return {
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: customHours.days,
      opens: customHours.opens,
      closes: customHours.closes,
    };
  }

  // Default business hours
  return {
    '@type': 'OpeningHoursSpecification',
    dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
    opens: '08:00',
    closes: '17:00',
  };
}

/**
 * Map membership tier to price range indicator
 */
export function generatePriceRange(tier?: string): string {
  switch (tier) {
    case 'elite':
      return '$$$';
    case 'premium':
      return '$$';
    case 'verified':
      return '$$';
    default:
      return '$$';
  }
}

/**
 * Default business image when provider has no photos
 */
export const DEFAULT_BUSINESS_IMAGE = 'https://boerneshandyhub.com/images/default-business.jpg';

/**
 * Generate area served schema for service areas
 */
export function generateAreaServed(serviceAreas: string[]): object[] {
  return serviceAreas.map((area) => ({
    '@type': 'City',
    name: area,
    containedInPlace: {
      '@type': 'State',
      name: 'Texas',
      '@id': 'https://en.wikipedia.org/wiki/Texas',
    },
  }));
}

/**
 * Generate aggregate rating schema
 * Only include if there are actual reviews
 */
export function generateAggregateRating(
  rating: number,
  reviewCount: number
): object | undefined {
  if (reviewCount <= 0 || rating <= 0) {
    return undefined;
  }

  return {
    '@type': 'AggregateRating',
    ratingValue: rating.toFixed(1),
    reviewCount: reviewCount,
    bestRating: 5,
    worstRating: 1,
  };
}

/**
 * Parse address string into structured components
 */
export function parseAddress(addressString: string): {
  streetAddress: string;
  city: string;
  state: string;
  postalCode: string;
} {
  // Default values for Boerne area
  const defaults = {
    streetAddress: '',
    city: 'Boerne',
    state: 'TX',
    postalCode: '78006',
  };

  if (!addressString) return defaults;

  // Try to parse "Street, City, State ZIP" format
  const parts = addressString.split(',').map(p => p.trim());

  if (parts.length >= 3) {
    const streetAddress = parts[0];
    const city = parts[1];
    // Last part might be "TX 78006" or "Texas 78006"
    const stateZip = parts[2].trim();
    const stateZipMatch = stateZip.match(/([A-Z]{2}|Texas)\s*(\d{5})?/i);

    return {
      streetAddress,
      city,
      state: stateZipMatch?.[1] === 'Texas' ? 'TX' : (stateZipMatch?.[1] || 'TX'),
      postalCode: stateZipMatch?.[2] || '78006',
    };
  } else if (parts.length === 2) {
    return {
      streetAddress: parts[0],
      city: parts[1],
      state: 'TX',
      postalCode: '78006',
    };
  }

  return {
    ...defaults,
    streetAddress: addressString,
  };
}

/**
 * Generate complete LocalBusiness schema for a provider
 */
export interface ProviderSchemaInput {
  id: string;
  name: string;
  category: string;
  description: string;
  address: string;
  phone: string;
  email?: string;
  website?: string;
  photos?: string[];
  rating: number;
  reviewCount: number;
  services: string[];
  serviceArea: string[];
  yearsInBusiness?: number;
  membershipTier?: string;
  licensed?: boolean;
  insured?: boolean;
  coordinates?: { lat: number; lng: number } | null;
}

export function generateLocalBusinessSchema(
  provider: ProviderSchemaInput,
  canonicalUrl: string
): Record<string, unknown> {
  const parsedAddress = parseAddress(provider.address);
  const businessType = getBusinessType(provider.category);

  const schema: Record<string, unknown> = {
    '@context': 'https://schema.org',
    '@type': businessType,
    '@id': `${canonicalUrl}#business`,
    name: provider.name,
    description: provider.description,
    url: canonicalUrl,
    telephone: provider.phone,
    image: provider.photos?.[0] || DEFAULT_BUSINESS_IMAGE,
    priceRange: generatePriceRange(provider.membershipTier),
    openingHoursSpecification: generateOpeningHours(),
    address: {
      '@type': 'PostalAddress',
      streetAddress: parsedAddress.streetAddress,
      addressLocality: parsedAddress.city,
      addressRegion: parsedAddress.state,
      postalCode: parsedAddress.postalCode,
      addressCountry: 'US',
    },
    areaServed: generateAreaServed(provider.serviceArea),
    hasOfferCatalog: {
      '@type': 'OfferCatalog',
      name: `${provider.name} Services`,
      itemListElement: provider.services.map((service, index) => ({
        '@type': 'Offer',
        '@id': `${canonicalUrl}#service-${index}`,
        itemOffered: {
          '@type': 'Service',
          name: service,
        },
      })),
    },
  };

  // Add optional fields only if they have values
  if (provider.email) {
    schema.email = provider.email;
  }

  if (provider.website) {
    schema.sameAs = [provider.website];
  }

  const aggregateRating = generateAggregateRating(provider.rating, provider.reviewCount);
  if (aggregateRating) {
    schema.aggregateRating = aggregateRating;
  }

  if (provider.yearsInBusiness && provider.yearsInBusiness > 0) {
    schema.foundingDate = formatFoundingDate(provider.yearsInBusiness);
  }

  if (provider.coordinates?.lat && provider.coordinates?.lng) {
    schema.geo = {
      '@type': 'GeoCoordinates',
      latitude: provider.coordinates.lat,
      longitude: provider.coordinates.lng,
    };
  }

  // Add certifications for licensed/insured status
  if (provider.licensed || provider.insured) {
    schema.hasCredential = [];
    if (provider.licensed) {
      (schema.hasCredential as object[]).push({
        '@type': 'EducationalOccupationalCredential',
        credentialCategory: 'license',
        name: 'State Licensed',
      });
    }
    if (provider.insured) {
      (schema.hasCredential as object[]).push({
        '@type': 'EducationalOccupationalCredential',
        credentialCategory: 'certificate',
        name: 'Fully Insured',
      });
    }
  }

  return schema;
}

/**
 * Generate BreadcrumbList schema
 */
export function generateBreadcrumbSchema(
  items: Array<{ name: string; url: string }>
): object {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };
}

/**
 * Generate ItemList schema for listing pages
 */
export function generateItemListSchema(
  name: string,
  description: string,
  items: Array<{ name: string; url: string }>
): object {
  return {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name,
    description,
    numberOfItems: items.length,
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      url: item.url,
    })),
  };
}
