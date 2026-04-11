// Home Maintenance Tracker Types

// ============================================
// SYSTEM TYPES & CATEGORIES
// ============================================

export type HomeSystemType =
  | 'hvac'
  | 'plumbing'
  | 'electrical'
  | 'roof'
  | 'waterHeater'
  | 'foundation'
  | 'gutters'
  | 'septic'
  | 'well'
  | 'pool'
  | 'sprinkler'
  | 'garage'
  | 'appliances'
  | 'exterior'
  | 'windows'
  | 'fireplace';

export type SystemCategory =
  | 'climate'
  | 'plumbing'
  | 'electrical'
  | 'structure'
  | 'outdoor'
  | 'interior';

// Parent categories for grouping systems
export const systemCategories: Record<SystemCategory, { name: string; icon: string; systems: HomeSystemType[] }> = {
  climate: {
    name: 'Climate Control',
    icon: '🌡️',
    systems: ['hvac', 'fireplace'],
  },
  plumbing: {
    name: 'Plumbing & Water',
    icon: '🔧',
    systems: ['plumbing', 'waterHeater', 'well', 'septic'],
  },
  electrical: {
    name: 'Electrical',
    icon: '⚡',
    systems: ['electrical'],
  },
  structure: {
    name: 'Structure & Exterior',
    icon: '🏠',
    systems: ['roof', 'foundation', 'gutters', 'exterior', 'windows', 'garage'],
  },
  outdoor: {
    name: 'Outdoor & Landscape',
    icon: '🌳',
    systems: ['pool', 'sprinkler'],
  },
  interior: {
    name: 'Interior & Appliances',
    icon: '🏡',
    systems: ['appliances'],
  },
};

// Get parent category for a system type
export function getSystemCategory(systemType: HomeSystemType): SystemCategory {
  for (const [category, data] of Object.entries(systemCategories)) {
    if (data.systems.includes(systemType)) {
      return category as SystemCategory;
    }
  }
  return 'interior'; // fallback
}

// System display info with service directory mapping
export const systemInfo: Record<HomeSystemType, {
  name: string;
  icon: string;
  serviceSlug: string;  // Maps to service subcategory slug
  parentCategory: string;  // Maps to top-level category
}> = {
  hvac: { name: 'HVAC / Air Conditioning', icon: '❄️', serviceSlug: 'hvac', parentCategory: 'home' },
  plumbing: { name: 'Plumbing', icon: '🔧', serviceSlug: 'plumbing', parentCategory: 'home' },
  electrical: { name: 'Electrical', icon: '⚡', serviceSlug: 'electrical', parentCategory: 'home' },
  roof: { name: 'Roof', icon: '🏠', serviceSlug: 'roofing', parentCategory: 'home' },
  waterHeater: { name: 'Water Heater', icon: '🔥', serviceSlug: 'plumbing', parentCategory: 'home' },
  foundation: { name: 'Foundation', icon: '🧱', serviceSlug: 'foundation-repair', parentCategory: 'home' },
  gutters: { name: 'Gutters', icon: '🌧️', serviceSlug: 'gutters', parentCategory: 'home' },
  septic: { name: 'Septic System', icon: '🚽', serviceSlug: 'septic', parentCategory: 'home' },
  well: { name: 'Well / Water System', icon: '💧', serviceSlug: 'well-drilling', parentCategory: 'outdoor' },
  pool: { name: 'Pool / Spa', icon: '🏊', serviceSlug: 'pool-service', parentCategory: 'home' },
  sprinkler: { name: 'Sprinkler / Irrigation', icon: '💦', serviceSlug: 'landscaping', parentCategory: 'home' },
  garage: { name: 'Garage Door', icon: '🚗', serviceSlug: 'garage-doors', parentCategory: 'home' },
  appliances: { name: 'Major Appliances', icon: '🍳', serviceSlug: 'handyman', parentCategory: 'home' },
  exterior: { name: 'Exterior / Siding', icon: '🏡', serviceSlug: 'painting', parentCategory: 'home' },
  windows: { name: 'Windows & Doors', icon: '🪟', serviceSlug: 'remodeling', parentCategory: 'home' },
  fireplace: { name: 'Fireplace / Chimney', icon: '🔥', serviceSlug: 'handyman', parentCategory: 'home' },
};

// Get the service directory URL for a system type
export function getServiceUrl(systemType: HomeSystemType): string {
  const info = systemInfo[systemType];
  return `/services/${info.parentCategory}/${info.serviceSlug}`;
}

// Get the service name for display
export function getServiceName(systemType: HomeSystemType): string {
  const info = systemInfo[systemType];
  // Format slug to display name (e.g., 'pool-service' -> 'Pool Service')
  return info.serviceSlug
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

// ============================================
// MATERIAL TYPES & CATEGORIES
// ============================================

export type MaterialType =
  | 'paint'
  | 'stain'
  | 'tile'
  | 'stone'
  | 'flooring'
  | 'countertop'
  | 'backsplash'
  | 'fixture'
  | 'lighting'
  | 'hardware'
  | 'appliance'
  | 'wallpaper'
  | 'other';

export type MaterialCategory =
  | 'paint-finishes'
  | 'tile-stone'
  | 'flooring'
  | 'fixtures-hardware'
  | 'other';

// Parent categories for materials
export const materialCategories: Record<MaterialCategory, { name: string; icon: string; types: MaterialType[] }> = {
  'paint-finishes': {
    name: 'Paint & Finishes',
    icon: '🎨',
    types: ['paint', 'stain', 'wallpaper'],
  },
  'tile-stone': {
    name: 'Tile & Stone',
    icon: '🪨',
    types: ['tile', 'stone', 'backsplash', 'countertop'],
  },
  'flooring': {
    name: 'Flooring',
    icon: '🪵',
    types: ['flooring'],
  },
  'fixtures-hardware': {
    name: 'Fixtures & Hardware',
    icon: '🚿',
    types: ['fixture', 'lighting', 'hardware', 'appliance'],
  },
  'other': {
    name: 'Other',
    icon: '📦',
    types: ['other'],
  },
};

// Material type display info
export const materialTypeInfo: Record<MaterialType, { name: string; icon: string }> = {
  paint: { name: 'Paint', icon: '🎨' },
  stain: { name: 'Stain / Sealer', icon: '🪵' },
  tile: { name: 'Tile', icon: '🔲' },
  stone: { name: 'Stone', icon: '🪨' },
  flooring: { name: 'Flooring', icon: '🪵' },
  countertop: { name: 'Countertop', icon: '🍽️' },
  backsplash: { name: 'Backsplash', icon: '🔲' },
  fixture: { name: 'Fixture', icon: '🚿' },
  lighting: { name: 'Lighting', icon: '💡' },
  hardware: { name: 'Hardware', icon: '🔩' },
  appliance: { name: 'Appliance', icon: '🍳' },
  wallpaper: { name: 'Wallpaper', icon: '🖼️' },
  other: { name: 'Other', icon: '📦' },
};

// Common rooms for location picker
export const commonRooms = [
  'Living Room',
  'Kitchen',
  'Master Bedroom',
  'Master Bath',
  'Bedroom 2',
  'Bedroom 3',
  'Bathroom 2',
  'Dining Room',
  'Office',
  'Laundry Room',
  'Garage',
  'Hallway',
  'Entryway',
  'Patio',
  'Exterior - Front',
  'Exterior - Back',
  'Exterior - Sides',
  'Whole House',
  'Other',
];

export interface Material {
  id: string;
  homeId: string;
  type: MaterialType;
  name: string;           // "Agreeable Gray SW 7029"
  brand?: string;         // "Sherwin-Williams"
  colorCode?: string;     // "SW 7029"
  finish?: string;        // "Eggshell", "Matte", "Polished"
  room: string;           // "Living Room"
  purchasedFrom?: string; // "Home Depot Boerne"
  purchaseDate?: string;
  installDate?: string;
  quantity?: string;      // "2 gallons", "45 sq ft"
  notes?: string;
  photoUrl?: string;      // Data URL or cloud URL
  createdAt: string;
  updatedAt: string;
}

// ============================================
// HOME & SYSTEM INTERFACES
// ============================================

export interface Home {
  id: string;
  name: string;
  address: string;
  city: string;
  yearBuilt: number | null;
  squareFeet: number | null;
  lotSize: number | null;
  bedrooms: number | null;
  bathrooms: number | null;
  systems: HomeSystem[];
  createdAt: string;
  updatedAt: string;
}

export interface HomeSystem {
  id: string;
  type: HomeSystemType;
  name: string;
  brand?: string;
  modelNumber?: string;
  installDate?: string;
  warrantyExpires?: string;
  lastServiced?: string;
  notes?: string;
}

// ============================================
// TASK & SERVICE RECORD INTERFACES
// ============================================

export type TaskStatus = 'upcoming' | 'due-soon' | 'due' | 'overdue' | 'completed';

export interface MaintenanceTask {
  id: string;
  homeId: string;
  systemType: HomeSystemType;
  title: string;
  description: string;
  frequencyMonths: number;
  lastCompleted?: string;
  nextDue: string;
  status: TaskStatus;
  linkedCategory?: string; // Links to Hub service category slug
  localTip?: string;
  priority: 'low' | 'medium' | 'high' | 'critical';
}

export interface ServiceRecord {
  id: string;
  homeId: string;
  taskId?: string;
  systemType: HomeSystemType;
  date: string;
  title: string;
  description: string;
  provider?: string;
  providerId?: string; // Links to Hub provider
  cost?: number;
  documents?: StoredDocument[];
  notes?: string;
}

export interface StoredDocument {
  id: string;
  name: string;
  type: 'receipt' | 'warranty' | 'manual' | 'invoice' | 'photo' | 'other';
  url: string; // For now, could be data URL or later cloud URL
  uploadedAt: string;
}
