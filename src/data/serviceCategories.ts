// Service Categories for Boerne's Handy Hub Directory
// Taxonomy: 5 top-level categories -> subcategories -> providers

export interface ServiceCategory {
  id: string;
  name: string;
  slug: string;
  description: string;
  icon: string;
  keywords?: string[]; // For search matching
}

export interface TopLevelCategory {
  id: string;
  name: string;
  slug: string;
  description: string;
  icon: string;
  color: string;
  subcategories: ServiceCategory[];
}

// =============================================================================
// TOP-LEVEL CATEGORIES (5)
// =============================================================================

export const topLevelCategories: TopLevelCategory[] = [
  {
    id: 'home',
    name: 'Home',
    slug: 'home',
    description: 'Home repair, maintenance, and improvement services',
    icon: '🏠',
    color: 'bg-blue-500',
    subcategories: [
      { id: 'plumbing', name: 'Plumbing', slug: 'plumbing', description: 'Licensed plumbers for repairs, installations, and emergency services', icon: '🔧', keywords: ['plumber', 'pipes', 'drain', 'water heater', 'leak', 'faucet', 'toilet'] },
      { id: 'electrical', name: 'Electrical', slug: 'electrical', description: 'Professional electricians for residential needs', icon: '⚡', keywords: ['electrician', 'wiring', 'outlet', 'panel', 'lighting', 'ceiling fan'] },
      { id: 'hvac', name: 'HVAC', slug: 'hvac', description: 'Heating, cooling, and air quality experts', icon: '❄️', keywords: ['ac', 'air conditioning', 'heating', 'furnace', 'duct', 'air quality'] },
      { id: 'roofing', name: 'Roofing', slug: 'roofing', description: 'Roofers for repairs, replacements, and inspections', icon: '🏠', keywords: ['roof', 'shingles', 'leak', 'storm damage', 'metal roof'] },
      { id: 'fencing', name: 'Fencing', slug: 'fencing', description: 'Residential fence installation and repair', icon: '🚧', keywords: ['fence', 'gate', 'wood fence', 'iron fence', 'privacy fence'] },
      { id: 'painting', name: 'Painting', slug: 'painting', description: 'Interior and exterior painting services', icon: '🎨', keywords: ['painter', 'interior paint', 'exterior paint', 'stain', 'cabinet painting'] },
      { id: 'flooring', name: 'Flooring', slug: 'flooring', description: 'Flooring installation and refinishing', icon: '🪵', keywords: ['floor', 'hardwood', 'tile', 'carpet', 'laminate', 'vinyl'] },
      { id: 'remodeling', name: 'Remodeling/GC', slug: 'remodeling', description: 'General contractors for remodeling and renovations', icon: '🔨', keywords: ['contractor', 'remodel', 'renovation', 'kitchen', 'bathroom', 'addition'] },
      { id: 'pest-control', name: 'Pest Control', slug: 'pest-control', description: 'Exterminators and pest management', icon: '🐜', keywords: ['pest', 'exterminator', 'termite', 'rodent', 'ant', 'roach', 'bee'] },
      { id: 'landscaping', name: 'Landscaping/Lawn', slug: 'landscaping', description: 'Lawn care and landscape design', icon: '🌿', keywords: ['lawn', 'mowing', 'landscape', 'yard', 'garden', 'irrigation', 'sprinkler'] },
      { id: 'tree-service', name: 'Tree Service', slug: 'tree-service', description: 'Tree trimming, removal, and stump grinding', icon: '🌳', keywords: ['tree', 'trimming', 'removal', 'stump', 'arborist'] },
      { id: 'pool-service', name: 'Pool Service', slug: 'pool-service', description: 'Pool cleaning, repair, and maintenance', icon: '🏊', keywords: ['pool', 'spa', 'hot tub', 'pool cleaning', 'pool repair'] },
      { id: 'cleaning', name: 'Cleaning/Maid', slug: 'cleaning', description: 'House cleaning and maid services', icon: '🧹', keywords: ['cleaning', 'maid', 'housekeeping', 'deep clean', 'move out'] },
      { id: 'handyman', name: 'Handyman', slug: 'handyman', description: 'General repairs and odd jobs', icon: '🛠️', keywords: ['handyman', 'repair', 'fix', 'odd jobs', 'maintenance'] },
      { id: 'garage-doors', name: 'Garage Doors', slug: 'garage-doors', description: 'Garage door installation and repair', icon: '🚗', keywords: ['garage door', 'opener', 'spring', 'garage repair'] },
      { id: 'foundation', name: 'Foundation Repair', slug: 'foundation', description: 'Foundation inspection and repair', icon: '🏗️', keywords: ['foundation', 'leveling', 'pier', 'crack', 'settling'] },
      { id: 'septic', name: 'Septic', slug: 'septic', description: 'Septic system installation and pumping', icon: '🚽', keywords: ['septic', 'pumping', 'tank', 'drain field'] },
      { id: 'gutters', name: 'Gutters', slug: 'gutters', description: 'Gutter installation, cleaning, and repair', icon: '🌧️', keywords: ['gutter', 'downspout', 'gutter guard', 'gutter cleaning'] },
      { id: 'pressure-washing', name: 'Pressure Washing', slug: 'pressure-washing', description: 'Power washing for homes and driveways', icon: '💦', keywords: ['pressure wash', 'power wash', 'driveway', 'deck cleaning'] },
      { id: 'locksmith', name: 'Locksmith', slug: 'locksmith', description: 'Residential locksmith services', icon: '🔐', keywords: ['locksmith', 'lock', 'key', 'lockout', 'rekey'] },
    ],
  },
  {
    id: 'auto',
    name: 'Auto',
    slug: 'auto',
    description: 'Automotive repair, maintenance, and services',
    icon: '🚗',
    color: 'bg-red-500',
    subcategories: [
      { id: 'mechanic', name: 'Mechanic/Repair', slug: 'mechanic', description: 'General auto mechanics and repair shops', icon: '🔧', keywords: ['mechanic', 'auto repair', 'car repair', 'engine', 'brake', 'transmission'] },
      { id: 'body-shop', name: 'Body Shop', slug: 'body-shop', description: 'Collision repair and auto body work', icon: '🚗', keywords: ['body shop', 'collision', 'dent', 'paint', 'auto body'] },
      { id: 'towing', name: 'Towing', slug: 'towing', description: 'Towing and roadside assistance', icon: '🚚', keywords: ['towing', 'tow truck', 'roadside', 'jump start', 'flatbed'] },
      { id: 'detailing', name: 'Detailing', slug: 'detailing', description: 'Professional car detailing services', icon: '✨', keywords: ['detailing', 'car wash', 'wax', 'interior', 'ceramic coating'] },
      { id: 'tire-shop', name: 'Tire Shop', slug: 'tire-shop', description: 'Tire sales, installation, and repair', icon: '⭕', keywords: ['tire', 'wheel', 'alignment', 'flat', 'rotation'] },
      { id: 'windshield', name: 'Windshield/Glass', slug: 'windshield', description: 'Auto glass repair and replacement', icon: '🪟', keywords: ['windshield', 'auto glass', 'chip', 'crack', 'window'] },
      { id: 'oil-change', name: 'Oil Change', slug: 'oil-change', description: 'Quick oil changes and fluid services', icon: '🛢️', keywords: ['oil change', 'lube', 'fluid', 'filter'] },
      { id: 'mobile-mechanic', name: 'Mobile Mechanic', slug: 'mobile-mechanic', description: 'Mobile auto repair services', icon: '🔧', keywords: ['mobile mechanic', 'on-site', 'house call'] },
    ],
  },
  {
    id: 'outdoor',
    name: 'Outdoor/Land',
    slug: 'outdoor',
    description: 'Land services, outdoor construction, and rural property work',
    icon: '🌳',
    color: 'bg-green-600',
    subcategories: [
      { id: 'welding', name: 'Welding/Fabrication', slug: 'welding', description: 'Custom welding and metal fabrication', icon: '🔥', keywords: ['welding', 'fabrication', 'metal', 'steel', 'custom'] },
      { id: 'ag-fencing', name: 'Ag Fencing', slug: 'ag-fencing', description: 'Agricultural and ranch fencing', icon: '🚜', keywords: ['ag fence', 'ranch fence', 'cattle fence', 'farm fence', 'barbed wire'] },
      { id: 'brush-clearing', name: 'Brush Clearing/Cedar', slug: 'brush-clearing', description: 'Land clearing and cedar removal', icon: '🪓', keywords: ['brush', 'cedar', 'land clearing', 'mulching', 'forestry'] },
      { id: 'excavation', name: 'Excavation/Grading', slug: 'excavation', description: 'Excavation, grading, and dirt work', icon: '🚜', keywords: ['excavation', 'grading', 'dirt work', 'dozer', 'backhoe'] },
      { id: 'concrete', name: 'Concrete/Driveways', slug: 'concrete', description: 'Concrete work and driveway installation', icon: '🧱', keywords: ['concrete', 'driveway', 'slab', 'patio', 'sidewalk'] },
      { id: 'well-drilling', name: 'Well Drilling/Pump', slug: 'well-drilling', description: 'Water well drilling and pump services', icon: '💧', keywords: ['well', 'drilling', 'pump', 'water well', 'well repair'] },
      { id: 'wildlife', name: 'Wildlife Management', slug: 'wildlife', description: 'Wildlife management and trapping', icon: '🦌', keywords: ['wildlife', 'trapping', 'deer', 'hog', 'varmint'] },
      { id: 'barn-building', name: 'Barn/Shop Build', slug: 'barn-building', description: 'Barn and shop construction', icon: '🏚️', keywords: ['barn', 'shop', 'metal building', 'pole barn', 'outbuilding'] },
    ],
  },
  {
    id: 'commercial',
    name: 'Commercial',
    slug: 'commercial',
    description: 'Commercial and business services',
    icon: '🏢',
    color: 'bg-gray-600',
    subcategories: [
      { id: 'commercial-hvac', name: 'Commercial HVAC', slug: 'commercial-hvac', description: 'Commercial heating and cooling services', icon: '❄️', keywords: ['commercial hvac', 'commercial ac', 'rooftop unit', 'commercial heating'] },
      { id: 'janitorial', name: 'Janitorial', slug: 'janitorial', description: 'Commercial cleaning and janitorial services', icon: '🧹', keywords: ['janitorial', 'office cleaning', 'commercial cleaning', 'floor care'] },
      { id: 'parking-lot', name: 'Parking Lot Maintenance', slug: 'parking-lot', description: 'Parking lot striping, repair, and maintenance', icon: '🅿️', keywords: ['parking lot', 'striping', 'asphalt', 'sealcoating'] },
      { id: 'signage', name: 'Signage', slug: 'signage', description: 'Business signs and graphics', icon: '🪧', keywords: ['sign', 'signage', 'banner', 'vehicle wrap', 'graphics'] },
      { id: 'commercial-construction', name: 'Commercial Construction', slug: 'commercial-construction', description: 'Commercial building and tenant improvements', icon: '🏗️', keywords: ['commercial construction', 'tenant improvement', 'buildout', 'commercial contractor'] },
    ],
  },
  {
    id: 'specialty',
    name: 'Specialty/Seasonal',
    slug: 'specialty',
    description: 'Seasonal services and specialty contractors',
    icon: '🎄',
    color: 'bg-purple-500',
    subcategories: [
      { id: 'holiday-lighting', name: 'Holiday Lighting', slug: 'holiday-lighting', description: 'Christmas light installation and removal', icon: '🎄', keywords: ['christmas lights', 'holiday lights', 'light installation', 'decorations'] },
      { id: 'moving', name: 'Moving Companies', slug: 'moving', description: 'Local and long-distance moving services', icon: '📦', keywords: ['moving', 'movers', 'relocation', 'packing'] },
      { id: 'junk-hauling', name: 'Junk Hauling/Dumpster', slug: 'junk-hauling', description: 'Junk removal and dumpster rental', icon: '🗑️', keywords: ['junk', 'hauling', 'dumpster', 'trash', 'debris'] },
      { id: 'porta-potty', name: 'Porta Potty Rental', slug: 'porta-potty', description: 'Portable restroom rentals', icon: '🚽', keywords: ['porta potty', 'portable restroom', 'sanitation', 'event rental'] },
      { id: 'storage', name: 'Storage', slug: 'storage', description: 'Self storage and portable storage units', icon: '📦', keywords: ['storage', 'self storage', 'storage unit', 'portable storage'] },
      { id: 'generators', name: 'Generators', slug: 'generators', description: 'Generator sales, installation, and service', icon: '⚡', keywords: ['generator', 'backup power', 'standby generator', 'portable generator'] },
    ],
  },
];

// =============================================================================
// SEASONAL HIGHLIGHTS - "What Boerne Needs Right Now"
// =============================================================================

export interface SeasonalHighlight {
  subcategoryId: string;
  topCategorySlug: string;
  headline: string;
  reason: string;
}

export interface SeasonConfig {
  months: number[]; // 1-12
  highlights: SeasonalHighlight[];
}

export const seasonalConfig: SeasonConfig[] = [
  {
    // Spring: March, April, May
    months: [3, 4, 5],
    highlights: [
      { subcategoryId: 'hvac', topCategorySlug: 'home', headline: 'AC Tune-Up Season', reason: 'Get your AC ready before the Texas heat hits' },
      { subcategoryId: 'landscaping', topCategorySlug: 'home', headline: 'Spring Lawn Revival', reason: 'Prime time for fertilizing, aerating, and new plantings' },
      { subcategoryId: 'pressure-washing', topCategorySlug: 'home', headline: 'Spring Cleaning Outside', reason: 'Wash away winter grime from driveways and decks' },
      { subcategoryId: 'pest-control', topCategorySlug: 'home', headline: 'Pest Prevention', reason: 'Stop bugs before they invade this summer' },
    ],
  },
  {
    // Summer: June, July, August
    months: [6, 7, 8],
    highlights: [
      { subcategoryId: 'hvac', topCategorySlug: 'home', headline: 'AC Repair & Emergency', reason: 'Don\'t sweat it - get fast AC help' },
      { subcategoryId: 'pool-service', topCategorySlug: 'home', headline: 'Pool Season', reason: 'Keep your pool crystal clear all summer' },
      { subcategoryId: 'tree-service', topCategorySlug: 'home', headline: 'Storm Prep', reason: 'Trim branches before summer storms hit' },
      { subcategoryId: 'brush-clearing', topCategorySlug: 'outdoor', headline: 'Fire Prevention', reason: 'Clear brush to reduce wildfire risk' },
    ],
  },
  {
    // Fall: September, October, November
    months: [9, 10, 11],
    highlights: [
      { subcategoryId: 'hvac', topCategorySlug: 'home', headline: 'Heating Tune-Up', reason: 'Prep your furnace before the first cold snap' },
      { subcategoryId: 'gutters', topCategorySlug: 'home', headline: 'Gutter Cleaning', reason: 'Clear leaves before winter rains' },
      { subcategoryId: 'roofing', topCategorySlug: 'home', headline: 'Roof Inspection', reason: 'Fix issues before winter weather' },
      { subcategoryId: 'holiday-lighting', topCategorySlug: 'specialty', headline: 'Holiday Lights', reason: 'Book early for Christmas light installation' },
    ],
  },
  {
    // Winter: December, January, February
    months: [12, 1, 2],
    highlights: [
      { subcategoryId: 'generators', topCategorySlug: 'specialty', headline: 'Backup Power', reason: 'Be ready for winter storm outages' },
      { subcategoryId: 'plumbing', topCategorySlug: 'home', headline: 'Freeze Protection', reason: 'Prevent frozen pipes and water damage' },
      { subcategoryId: 'hvac', topCategorySlug: 'home', headline: 'Heating Repair', reason: 'Stay warm when temperatures drop' },
      { subcategoryId: 'remodeling', topCategorySlug: 'home', headline: 'Indoor Projects', reason: 'Perfect time for kitchen and bath remodels' },
    ],
  },
];

// =============================================================================
// HELPER FUNCTIONS
// =============================================================================

export const getTopLevelCategory = (slug: string): TopLevelCategory | undefined => {
  return topLevelCategories.find(cat => cat.slug === slug);
};

export const getSubcategory = (topSlug: string, subSlug: string): ServiceCategory | undefined => {
  const topCat = getTopLevelCategory(topSlug);
  return topCat?.subcategories.find(sub => sub.slug === subSlug);
};

export const getAllSubcategories = (): Array<ServiceCategory & { topCategory: string }> => {
  return topLevelCategories.flatMap(top =>
    top.subcategories.map(sub => ({ ...sub, topCategory: top.slug }))
  );
};

export const searchSubcategories = (query: string): Array<ServiceCategory & { topCategory: string }> => {
  const lowerQuery = query.toLowerCase();
  return getAllSubcategories().filter(sub => {
    const nameMatch = sub.name.toLowerCase().includes(lowerQuery);
    const descMatch = sub.description.toLowerCase().includes(lowerQuery);
    const keywordMatch = sub.keywords?.some(kw => kw.toLowerCase().includes(lowerQuery));
    return nameMatch || descMatch || keywordMatch;
  });
};

export const getCurrentSeasonHighlights = (): SeasonalHighlight[] => {
  const currentMonth = new Date().getMonth() + 1; // getMonth() is 0-indexed
  const season = seasonalConfig.find(s => s.months.includes(currentMonth));
  return season?.highlights || [];
};

export const getSeasonalSubcategories = (): Array<ServiceCategory & { topCategory: string; headline: string; reason: string }> => {
  const highlights = getCurrentSeasonHighlights();
  return highlights.map(h => {
    const sub = getSubcategory(h.topCategorySlug, h.subcategoryId) ||
                getAllSubcategories().find(s => s.id === h.subcategoryId);
    if (!sub) return null;
    return {
      ...sub,
      topCategory: h.topCategorySlug,
      headline: h.headline,
      reason: h.reason,
    };
  }).filter(Boolean) as Array<ServiceCategory & { topCategory: string; headline: string; reason: string }>;
};

// =============================================================================
// MEMBERSHIP TIERS (unchanged)
// =============================================================================

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
    features: ['Featured in category', 'Staff pick eligible', 'Special offers', 'Priority support'],
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

// =============================================================================
// LEGACY COMPATIBILITY (to avoid breaking existing code during migration)
// =============================================================================

// Maps old flat structure to new nested structure
export const serviceCategories = getAllSubcategories().map(sub => ({
  id: sub.id,
  name: sub.name,
  slug: sub.slug,
  bucket: sub.topCategory,
  description: sub.description,
  icon: sub.icon,
  subcategories: [], // Legacy field
  featured: ['plumbing', 'electrical', 'hvac', 'mechanic', 'remodeling'].includes(sub.id),
}));

export const serviceBuckets = topLevelCategories.map(cat => ({
  id: cat.id,
  name: cat.name,
  slug: cat.slug,
  description: cat.description,
  icon: cat.icon,
  color: cat.color,
}));

export const getServiceCategory = (slug: string) => {
  return serviceCategories.find(cat => cat.slug === slug);
};

export const getCategoriesByBucket = (bucketSlug: string) => {
  return serviceCategories.filter(cat => cat.bucket === bucketSlug);
};

export const getBucket = (slug: string) => {
  return serviceBuckets.find(b => b.slug === slug);
};

export const getFeaturedCategories = () => {
  return serviceCategories.filter(cat => cat.featured);
};
