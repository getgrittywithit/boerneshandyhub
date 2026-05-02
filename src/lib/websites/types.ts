// Website System Types
// Per docs/WEBSITE_SYSTEM_SPEC.md

export type WebsiteStatus =
  | 'draft'
  | 'pending_review'
  | 'changes_requested'
  | 'approved'
  | 'live'
  | 'flagged'
  | 'suspended'
  | 'archived';

export type WebsiteTemplate =
  | 'classic'
  | 'modern'
  | 'friendly'
  | 'bold'
  | 'handyman'; // Legacy, maps to classic

export type PhotoStatus = 'pending' | 'approved' | 'flagged' | 'rejected';

export interface ServiceItem {
  name: string;
  description?: string;
  priceRange?: string; // e.g., "$50-100" or "Call for quote"
}

export interface ServiceArea {
  radiusMiles?: number;
  zipCodes?: string[];
  cities?: string[];
}

export interface BusinessHours {
  mon?: { open: string; close: string } | null;
  tue?: { open: string; close: string } | null;
  wed?: { open: string; close: string } | null;
  thu?: { open: string; close: string } | null;
  fri?: { open: string; close: string } | null;
  sat?: { open: string; close: string } | null;
  sun?: { open: string; close: string } | null;
}

export interface Testimonial {
  name: string;
  text: string;
  rating?: number; // 1-5
  date?: string;
}

export interface Website {
  id: string;
  business_id: string;
  template: WebsiteTemplate;
  slug: string;
  status: WebsiteStatus;

  // Branding
  primary_color: string;
  accent_color: string;

  // Content
  tagline: string | null;
  about_text: string | null;

  // Services
  services: ServiceItem[];
  service_area: ServiceArea;

  // Hours
  hours: BusinessHours;
  emergency_available: boolean;

  // Credentials
  license_number: string | null;
  license_state: string;
  insurance_carrier: string | null;
  years_in_business: number | null;

  // Testimonials
  testimonials: Testimonial[];

  // Images
  hero_photo_id: string | null;
  logo_photo_id: string | null;
  gallery_photo_ids: string[];

  // Review workflow
  submitted_at: string | null;
  approved_at: string | null;
  approved_by: string | null;
  rejection_reason: string | null;

  // Lifecycle
  published_at: string | null;
  expires_at: string | null;
  archived_at: string | null;

  // Timestamps
  created_at: string;
  updated_at: string;

  // Joined data
  business?: {
    id: string;
    name: string;
    phone: string | null;
    email: string | null;
    address: string | null;
    city: string | null;
    state: string | null;
    zip: string | null;
  };
  hero_photo?: WebsitePhoto;
  logo_photo?: WebsitePhoto;
  gallery_photos?: WebsitePhoto[];
}

export interface WebsitePhoto {
  id: string;
  website_id: string;
  storage_path: string;
  bucket: string;
  original_filename: string | null;
  mime_type: string;
  file_size: number | null;
  width: number | null;
  height: number | null;
  alt_text: string | null;
  moderation_status: PhotoStatus;
  moderation_score: Record<string, unknown> | null;
  moderation_notes: string | null;
  flag_reasons: string[] | null;
  derivatives: {
    thumb?: string;
    medium?: string;
    large?: string;
  } | null;
  created_at: string;
}

export interface WebsiteEdit {
  id: string;
  website_id: string;
  edited_by: string | null;
  edited_at: string;
  fields_changed: string[];
  previous_values: Record<string, unknown> | null;
  new_values: Record<string, unknown> | null;
  triggered_review: boolean;
  auto_approved: boolean;
}

export interface WebsiteReport {
  id: string;
  website_id: string;
  reporter_email: string | null;
  reporter_ip: string | null;
  reason: string;
  details: string | null;
  reported_at: string;
  reviewed_at: string | null;
  reviewed_by: string | null;
  resolution: string | null;
}

// Template configuration - Design-based, not trade-based
export interface TemplateConfig {
  key: WebsiteTemplate;
  name: string;
  description: string;
  preview: string; // Preview description
  defaultColors: { primary: string; accent: string };
  features: string[];
}

export const TEMPLATES: Record<WebsiteTemplate, TemplateConfig> = {
  classic: {
    key: 'classic',
    name: 'Classic',
    description: 'Clean, professional, and trustworthy',
    preview: 'Traditional layout with navy/gold colors. Great for established businesses.',
    defaultColors: { primary: '#1e3a5f', accent: '#d4a853' },
    features: ['Professional header', 'Clean sections', 'Traditional feel'],
  },
  modern: {
    key: 'modern',
    name: 'Modern',
    description: 'Bold, minimal, and striking',
    preview: 'Dark theme with full-viewport hero. Perfect for standing out.',
    defaultColors: { primary: '#0f172a', accent: '#22d3ee' },
    features: ['Dark aesthetic', 'Bold typography', 'Full-screen hero'],
  },
  friendly: {
    key: 'friendly',
    name: 'Friendly',
    description: 'Warm, approachable, and inviting',
    preview: 'Rounded corners, warm colors. Great for family businesses.',
    defaultColors: { primary: '#7c2d12', accent: '#fbbf24' },
    features: ['Warm tones', 'Rounded elements', 'Approachable vibe'],
  },
  bold: {
    key: 'bold',
    name: 'Bold',
    description: 'High contrast and attention-grabbing',
    preview: 'Strong CTAs, high contrast. Built for conversions.',
    defaultColors: { primary: '#000000', accent: '#ef4444' },
    features: ['High contrast', 'Strong CTAs', 'Maximum impact'],
  },
  // Legacy - maps to classic
  handyman: {
    key: 'handyman',
    name: 'Classic',
    description: 'Clean, professional, and trustworthy',
    preview: 'Traditional layout with navy/gold colors.',
    defaultColors: { primary: '#1e3a5f', accent: '#d4a853' },
    features: ['Professional header', 'Clean sections', 'Traditional feel'],
  },
};

// Color presets
export const COLOR_PRESETS = [
  { name: 'Trustworthy Blue', primary: '#1e3a5f', accent: '#d4a853' },
  { name: 'Bold Red', primary: '#8b0000', accent: '#ffd700' },
  { name: 'Earthy Green', primary: '#2d5016', accent: '#c9a227' },
  { name: 'Classic Black', primary: '#1a1a1a', accent: '#b8860b' },
  { name: 'Hill Country', primary: '#4a5d23', accent: '#d4a853' },
] as const;

// Hours presets
export const HOURS_PRESETS = {
  'mon-fri-8-5': {
    name: 'Mon-Fri 8am-5pm',
    hours: {
      mon: { open: '08:00', close: '17:00' },
      tue: { open: '08:00', close: '17:00' },
      wed: { open: '08:00', close: '17:00' },
      thu: { open: '08:00', close: '17:00' },
      fri: { open: '08:00', close: '17:00' },
      sat: null,
      sun: null,
    },
  },
  'mon-sat-7-7': {
    name: 'Mon-Sat 7am-7pm',
    hours: {
      mon: { open: '07:00', close: '19:00' },
      tue: { open: '07:00', close: '19:00' },
      wed: { open: '07:00', close: '19:00' },
      thu: { open: '07:00', close: '19:00' },
      fri: { open: '07:00', close: '19:00' },
      sat: { open: '07:00', close: '19:00' },
      sun: null,
    },
  },
  'seven-days': {
    name: '7 Days a Week',
    hours: {
      mon: { open: '08:00', close: '18:00' },
      tue: { open: '08:00', close: '18:00' },
      wed: { open: '08:00', close: '18:00' },
      thu: { open: '08:00', close: '18:00' },
      fri: { open: '08:00', close: '18:00' },
      sat: { open: '08:00', close: '18:00' },
      sun: { open: '10:00', close: '16:00' },
    },
  },
} as const;

// Validation
export const VALIDATION = {
  tagline: { maxLength: 80 },
  aboutText: { minLength: 50, maxLength: 500 },
  testimonialText: { maxLength: 300 },
  maxPhotos: 5,
  maxServices: 20,
  maxTestimonials: 5,
} as const;

// Fields that require re-review when changed
export const FIELDS_REQUIRING_REVIEW = [
  'tagline',
  'about_text',
  'services',
  'testimonials',
  'license_number',
] as const;

// Common services suggestions (not template-specific)
export const COMMON_SERVICES = [
  'General Repairs',
  'Plumbing',
  'Electrical',
  'HVAC',
  'Painting',
  'Drywall',
  'Flooring',
  'Roofing',
  'Landscaping',
  'Lawn Care',
  'Fence Repair',
  'Deck Repair',
  'Pressure Washing',
  'Gutter Cleaning',
  'Window Cleaning',
  'Appliance Repair',
  'Carpentry',
  'Tile Work',
  'Cabinet Installation',
  'Door Installation',
] as const;

// Fields that auto-publish without review
export const FIELDS_AUTO_PUBLISH = [
  'hours',
  'emergency_available',
  'primary_color',
  'accent_color',
  'template',
  'service_area',
] as const;
