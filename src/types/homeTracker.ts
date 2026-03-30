// Home Maintenance Tracker Types

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
