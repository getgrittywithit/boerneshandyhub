// Newsletter System Types

// ============================================================================
// SUBSCRIBER TYPES
// ============================================================================

export type SubscriberType = 'homeowner' | 'realtor' | 'business';

export type SubscriberSource =
  | 'homepage'
  | 'footer'
  | 'moving-guide'
  | 'home-tracker'
  | 'guide'
  | 'manual'
  | 'website';

export type SubscriberStatus = 'active' | 'unsubscribed' | 'bounced';

export interface Subscriber {
  id: string;
  email: string;
  name: string | null;
  subscriber_type: SubscriberType;
  source: SubscriberSource;
  status: SubscriberStatus;
  metadata: Record<string, unknown>;
  subscribed_at: string;
  unsubscribed_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface SubscriberInsert {
  email: string;
  name?: string;
  subscriber_type?: SubscriberType;
  source?: SubscriberSource;
  metadata?: Record<string, unknown>;
}

export interface SubscriberUpdate {
  name?: string;
  subscriber_type?: SubscriberType;
  status?: SubscriberStatus;
  metadata?: Record<string, unknown>;
  unsubscribed_at?: string;
}

// ============================================================================
// NEWSLETTER TEMPLATE TYPES
// ============================================================================

export type SectionType =
  | 'text'
  | 'text_with_image'
  | 'service_list'
  | 'provider_list'
  | 'provider_spotlight'
  | 'event_list';

export interface TemplateSection {
  id: string;
  name: string;
  type: SectionType;
  required: boolean;
  max_items?: number;
}

export interface NewsletterTemplate {
  id: string;
  name: string;
  description: string | null;
  sections: TemplateSection[];
  is_default: boolean;
  created_at: string;
  updated_at: string;
}

// ============================================================================
// NEWSLETTER DRAFT TYPES
// ============================================================================

export type NewsletterStatus =
  | 'draft'
  | 'approved'
  | 'scheduled'
  | 'sending'
  | 'sent'
  | 'failed';

export type NewsletterAudience = 'all' | 'homeowners' | 'realtors' | 'businesses';

// Section content structures
export interface IntroSectionContent {
  text: string;
}

export interface SeasonalServiceItem {
  id: string;
  name: string;
  icon: string;
  description: string;
  link: string;
}

export interface SeasonalSectionContent {
  items: SeasonalServiceItem[];
}

export interface NewProviderItem {
  id: string;
  name: string;
  category: string;
  description?: string;
}

export interface NewProvidersSectionContent {
  count: number;
  providers: NewProviderItem[];
  new_guides?: { title: string; slug: string }[];
}

export interface LocalTipSectionContent {
  headline: string;
  text: string;
  image_url?: string;
  link?: string;
  link_text?: string;
}

export interface FeaturedProviderSectionContent {
  provider_id: string;
  provider_name: string;
  category: string;
  description: string;
  image_url?: string;
  endorsement: string;
  link: string;
}

export interface EventItem {
  name: string;
  date: string;
  location?: string;
  link?: string;
}

export interface EventsSectionContent {
  events: EventItem[];
}

export interface BlogPostItem {
  id: string;
  slug: string;
  title: string;
  excerpt: string | null;
  category: string;
  categoryLabel: string;
  coverImage: string | null;
  publishedAt: string | null;
}

export interface BlogPostsSectionContent {
  posts: BlogPostItem[];
  callToAction?: string;
}

export interface NewsletterSections {
  intro?: IntroSectionContent;
  seasonal?: SeasonalSectionContent;
  new_providers?: NewProvidersSectionContent;
  local_tip?: LocalTipSectionContent;
  featured_provider?: FeaturedProviderSectionContent;
  events?: EventsSectionContent;
  blog_posts?: BlogPostsSectionContent;
}

export interface SendStats {
  total_sent?: number;
  delivered?: number;
  opened?: number;
  clicked?: number;
  bounced?: number;
  open_rate?: number;
  click_rate?: number;
}

export interface NewsletterDraft {
  id: string;
  title: string;
  subject_line: string | null;
  subject_line_alternatives: string[];
  preview_text: string | null;
  sections: NewsletterSections;
  template_id: string | null;
  status: NewsletterStatus;
  audience: NewsletterAudience;
  scheduled_for: string | null;
  sent_at: string | null;
  send_stats: SendStats;
  resend_broadcast_id: string | null;
  created_by: string | null;
  created_at: string;
  updated_at: string;
}

export interface NewsletterDraftInsert {
  title: string;
  subject_line?: string;
  subject_line_alternatives?: string[];
  preview_text?: string;
  sections: NewsletterSections;
  template_id?: string;
  audience?: NewsletterAudience;
  scheduled_for?: string;
}

export interface NewsletterDraftUpdate {
  title?: string;
  subject_line?: string;
  subject_line_alternatives?: string[];
  preview_text?: string;
  sections?: NewsletterSections;
  status?: NewsletterStatus;
  audience?: NewsletterAudience;
  scheduled_for?: string;
  sent_at?: string;
  send_stats?: SendStats;
  resend_broadcast_id?: string;
}

// ============================================================================
// SEND LOG TYPES
// ============================================================================

export type SendLogStatus =
  | 'sent'
  | 'delivered'
  | 'opened'
  | 'clicked'
  | 'bounced'
  | 'complained';

export interface NewsletterSendLog {
  id: string;
  newsletter_id: string;
  subscriber_id: string;
  status: SendLogStatus;
  resend_email_id: string | null;
  opened_at: string | null;
  clicked_at: string | null;
  created_at: string;
}

// ============================================================================
// AI GENERATION TYPES
// ============================================================================

export interface GenerationContext {
  month: string;
  year: number;
  season: string;
  seasonal_services: SeasonalServiceItem[];
  new_providers: NewProviderItem[];
  new_guides: { title: string; slug: string }[];
  events: EventItem[];
  featured_provider: {
    id: string;
    name: string;
    category: string;
    description: string;
  } | null;
  weather_context?: string;
}

export interface GeneratedContent {
  subject_line: string;
  subject_line_alternatives: string[];
  preview_text: string;
  sections: NewsletterSections;
}

// ============================================================================
// API REQUEST/RESPONSE TYPES
// ============================================================================

export interface SubscribeRequest {
  email: string;
  name?: string;
  type?: SubscriberType;
  source?: SubscriberSource;
}

export interface SubscribeResponse {
  success: boolean;
  message: string;
  subscriber_id?: string;
}

export interface UnsubscribeRequest {
  email: string;
  token?: string; // For secure unsubscribe links
}

export interface GenerateNewsletterRequest {
  template_id?: string;
  month?: string; // e.g., "May 2025" - defaults to next month
}

export interface SendTestEmailRequest {
  draft_id: string;
  test_email: string;
}

export interface SendBroadcastRequest {
  draft_id: string;
}

// ============================================================================
// DASHBOARD STATS TYPES
// ============================================================================

export interface NewsletterStats {
  total_subscribers: number;
  subscribers_this_month: number;
  total_sent: number;
  avg_open_rate: number;
  avg_click_rate: number;
  recent_newsletters: NewsletterDraft[];
}

export interface SubscriberBreakdown {
  homeowners: number;
  realtors: number;
  businesses: number;
  total: number;
}
