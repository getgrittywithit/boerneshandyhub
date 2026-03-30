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

// System display info
export const systemInfo: Record<HomeSystemType, { name: string; icon: string; category: string }> = {
  hvac: { name: 'HVAC / Air Conditioning', icon: '❄️', category: 'hvac' },
  plumbing: { name: 'Plumbing', icon: '🔧', category: 'plumbing' },
  electrical: { name: 'Electrical', icon: '⚡', category: 'electrical' },
  roof: { name: 'Roof', icon: '🏠', category: 'roofing' },
  waterHeater: { name: 'Water Heater', icon: '🔥', category: 'plumbing' },
  foundation: { name: 'Foundation', icon: '🧱', category: 'foundation' },
  gutters: { name: 'Gutters', icon: '🌧️', category: 'gutters' },
  septic: { name: 'Septic System', icon: '🚽', category: 'septic' },
  well: { name: 'Well / Water System', icon: '💧', category: 'plumbing' },
  pool: { name: 'Pool / Spa', icon: '🏊', category: 'pool' },
  sprinkler: { name: 'Sprinkler / Irrigation', icon: '💦', category: 'landscaping' },
  garage: { name: 'Garage Door', icon: '🚗', category: 'garage-doors' },
  appliances: { name: 'Major Appliances', icon: '🍳', category: 'appliances' },
  exterior: { name: 'Exterior / Siding', icon: '🏡', category: 'exterior' },
  windows: { name: 'Windows & Doors', icon: '🪟', category: 'windows' },
  fireplace: { name: 'Fireplace / Chimney', icon: '🔥', category: 'chimney' },
};

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
