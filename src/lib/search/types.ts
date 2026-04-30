// Search types and interfaces

export type SearchSource = 'business' | 'category' | 'realtor' | 'page';

export interface SearchDocument {
  id: string;
  source_type: SearchSource;
  source_id: string;
  title: string;
  subtitle: string | null;
  description: string | null;
  url: string;
  keywords: string[];
  tier: string | null;
  boost: number;
  category_slug: string | null;
  subcategory_slug: string | null;
  text_rank?: number;
  vector_similarity?: number;
  combined_score?: number;
}

export interface SearchScope {
  category_slug?: string;
  subcategory_slug?: string;
}

export interface SearchRequest {
  query: string;
  scope?: SearchScope;
  limit?: number;
}

export interface SearchResultGroup {
  source_type: SearchSource;
  label: string;
  icon: string;
  results: SearchDocument[];
  count: number;
}

export interface SearchResponse {
  groups: SearchResultGroup[];
  total: number;
  query: string;
  took_ms: number;
  query_id?: string;
}

export interface VendorLead {
  query?: string;
  suggested_name?: string;
  contact_email?: string;
  contact_phone?: string;
  notes?: string;
}

export interface SearchAnalytics {
  query: string;
  scope?: SearchScope;
  result_counts: Record<string, number>;
  took_ms: number;
  user_session?: string;
}

export interface SearchClick {
  query_id: string;
  result_id: string;
  position: number;
  source_type: SearchSource;
}

// Source type display configuration
export const SOURCE_CONFIG: Record<SearchSource, { label: string; icon: string; priority: number }> = {
  business: { label: 'Businesses', icon: '🏢', priority: 1 },
  category: { label: 'Services', icon: '🔧', priority: 2 },
  realtor: { label: 'Realtors', icon: '🏠', priority: 3 },
  page: { label: 'Pages', icon: '📄', priority: 4 },
};
