// Community Contributions Types
// Per docs/COMMUNITY_SPEC.md

export type ContributionType = 'feedback' | 'photo' | 'story' | 'tip';

export type ContributionStatus =
  | 'submitted'
  | 'ai_screening'
  | 'ai_clear'
  | 'ai_flag'
  | 'hard_reject'
  | 'admin_pending'
  | 'approved'
  | 'rejected'
  | 'published';

export type DisplayPref = 'full_name' | 'first_name' | 'initials' | 'anonymous';

export type ContributorStatus = 'active' | 'banned' | 'starred';

export type TargetType = 'category' | 'subcategory' | 'business' | 'neighborhood' | 'global';

// AI verdict from screen-submission
export type AIVerdict = 'hard_reject' | 'ai_flag' | 'ai_clear';

export interface AIScreenResult {
  verdict: AIVerdict;
  reasons: string[];
  confidence: number;
}

// Canned rejection reasons per spec § 5.3
export const REJECTION_REASONS = [
  { id: 'off_topic', label: 'Off-topic', message: "This content doesn't appear to be related to Boerne or the Hill Country." },
  { id: 'cant_verify', label: "Can't verify", message: "We weren't able to verify the information in this submission." },
  { id: 'ip_concern', label: 'IP concern', message: "We have concerns about the rights to this content." },
  { id: 'low_quality', label: 'Low quality', message: "This submission doesn't meet our quality standards." },
  { id: 'duplicate', label: 'Duplicate', message: "We've already received similar content." },
  { id: 'subject_consent', label: "Couldn't verify subject consent", message: "We couldn't verify consent from the people shown in this photo." },
  { id: 'other', label: 'Other', message: '' }, // Requires custom text
] as const;

export type RejectionReasonId = typeof REJECTION_REASONS[number]['id'];

// Era options for stories
export const ERAS = [
  { value: 'today', label: 'Today' },
  { value: '2020s', label: '2020s' },
  { value: '2010s', label: '2010s' },
  { value: '2000s', label: '2000s' },
  { value: '1990s', label: '1990s' },
  { value: '1980s', label: '1980s' },
  { value: '1970s', label: '1970s' },
  { value: '1960s', label: '1960s' },
  { value: '1950s', label: '1950s' },
  { value: '1940s', label: '1940s' },
  { value: '1930s', label: '1930s' },
  { value: '1920s', label: '1920s' },
  { value: '1910s', label: '1910s' },
  { value: '1900s', label: '1900s' },
  { value: '1890s', label: '1890s' },
  { value: '1880s', label: '1880s' },
  { value: '1870s', label: '1870s' },
  { value: '1860s', label: '1860s' },
  { value: '1850s', label: '1850s' },
] as const;

// Year options for photos (current year down to 1850)
export const PHOTO_YEARS = [
  { value: null, label: 'Current' },
  ...Array.from({ length: new Date().getFullYear() - 1850 + 1 }, (_, i) => {
    const year = new Date().getFullYear() - i;
    return { value: year, label: String(year) };
  }),
];

// Boerne neighborhoods
export const NEIGHBORHOODS = [
  'Downtown Boerne',
  'Main Street',
  'Hill Country Mile',
  'Tapatio Springs',
  'Cordillera Ranch',
  'Fair Oaks Ranch',
  'Scenic Loop',
  'Cibolo Creek',
  'Upper Cibolo',
  'The Dominion',
  'Champions Ridge',
  'River Crossing',
  'Saddleridge',
  'Cascade Caverns Area',
  'Welfare',
  'Other',
] as const;

// Database row types
export interface Contributor {
  id: string;
  email: string;
  email_verified_at: string | null;
  name: string | null;
  display_pref: DisplayPref;
  status: ContributorStatus;
  approved_count: number;
  rejected_count: number;
  created_at: string;
  last_active_at: string | null;
}

export interface Contribution {
  id: string;
  contributor_id: string | null;
  type: ContributionType;
  status: ContributionStatus;
  title: string | null;
  body: string | null;
  metadata: ContributionMetadata;
  ai_verdict: AIScreenResult | null;
  ai_screened_at: string | null;
  reviewed_at: string | null;
  reviewed_by: string | null;
  reject_reason: string | null;
  published_at: string | null;
  public_slug: string | null;
  ip_attestation: boolean;
  accuracy_attestation: boolean | null;
  submission_ip: string | null;
  created_at: string;
  updated_at: string;
  // Joined fields
  contributor?: Contributor;
  assets?: ContributionAsset[];
  targets?: ContributionTarget[];
}

export interface ContributionMetadata {
  // Feedback
  subject?: string;
  // Photo
  year?: number | null;
  location?: string;
  neighborhood?: string;
  // Story
  era?: string;
  // Tip
  list_slug?: string;
  why_pick?: string;
  // Legal
  attestation_version?: string;
}

export interface ContributionAsset {
  id: string;
  contribution_id: string;
  storage_path: string;
  bucket: string;
  mime_type: string;
  file_size: number | null;
  width: number | null;
  height: number | null;
  caption: string | null;
  year: number | null;
  location: string | null;
  neighborhood: string | null;
  ordering: number;
  derivatives: {
    thumb?: string;
    medium?: string;
    full?: string;
  } | null;
  created_at: string;
}

export interface ContributionTarget {
  id: string;
  contribution_id: string;
  target_type: TargetType;
  target_slug: string;
}

export interface TipList {
  id: string;
  slug: string;
  title: string;
  description: string | null;
  is_active: boolean;
  created_at: string;
}

export interface TipListEntry {
  id: string;
  list_id: string;
  contribution_id: string;
  upvotes: number;
  position: number | null;
}

export interface ContributionEvent {
  id: string;
  contribution_id: string;
  event: string;
  actor: string | null;
  payload: Record<string, unknown> | null;
  created_at: string;
}

export interface ContributionFlag {
  id: string;
  contribution_id: string;
  flagger_email: string | null;
  flagger_ip: string | null;
  reason: string;
  created_at: string;
}

// Form submission types
export interface FeedbackSubmission {
  type: 'feedback';
  subject: string;
  message: string;
  email: string;
  name?: string;
}

export interface PhotoSubmission {
  type: 'photo';
  email: string;
  name?: string;
  display_pref: DisplayPref;
  ip_attestation: boolean;
  photos: Array<{
    file: File;
    caption?: string;
    year?: number | null;
    location?: string;
    neighborhood?: string;
    related_category?: string;
    related_business?: string;
  }>;
}

export interface StorySubmission {
  type: 'story';
  email: string;
  name?: string;
  display_pref: DisplayPref;
  ip_attestation: boolean;
  accuracy_attestation: boolean;
  title: string;
  body: string;
  era?: string;
  related_places?: string[]; // category slugs, business slugs
  photos?: Array<{
    file: File;
    caption?: string;
  }>;
}

export interface TipSubmission {
  type: 'tip';
  email: string;
  name?: string;
  display_pref: DisplayPref;
  list_slug: string;
  pick: string; // 30-500 chars
  why_pick?: string;
  suggest_new_list?: string; // goes to feedback if filled
}

export type ContributionSubmission =
  | FeedbackSubmission
  | PhotoSubmission
  | StorySubmission
  | TipSubmission;

// API response types
export interface SubmitResponse {
  success: boolean;
  contribution_id?: string;
  requires_verification?: boolean;
  message: string;
}

export interface AdminQueueItem extends Omit<Contribution, 'contributor' | 'assets'> {
  contributor: Contributor | null;
  assets: ContributionAsset[];
  ai_badge: 'clear' | 'flag' | 'reject';
}

// Rate limit constants per spec § 3.3
export const RATE_LIMITS = {
  SUBMISSIONS_PER_EMAIL_PER_DAY: 5,
  SUBMISSIONS_PER_IP_PER_MINUTE: 1,
  EDIT_WINDOW_MINUTES: 10,
} as const;

// Attestation text version (stored with each submission)
export const ATTESTATION_VERSION = '2026-05-01';

export const ATTESTATION_TEXT = `I confirm I either took this photo / wrote this content myself, or I have permission from the person who did. I grant BoernesHandyHub a non-exclusive license to display this content on the site and in promotional material for the site. I can request removal at any time by emailing hello@boerneshandyhub.com.`;

// Photo upload limits per spec § 4.3
export const PHOTO_LIMITS = {
  MAX_FILE_SIZE_MB: 25,
  MAX_PHOTOS_PER_SUBMISSION: 4,
  MAX_DIMENSION_PX: 4096,
  ALLOWED_TYPES: ['image/jpeg', 'image/png', 'image/heic', 'image/webp'],
} as const;
