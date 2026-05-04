export interface BlogPost {
  id: string;
  slug: string;
  title: string;
  excerpt: string | null;
  content: string | null;
  cover_image: string | null;
  category: BlogCategory;
  tags: string[];
  author_name: string;
  status: BlogStatus;
  featured: boolean;
  seo_title: string | null;
  seo_description: string | null;
  published_at: string | null;
  created_at: string;
  updated_at: string;
}

export type BlogStatus = 'draft' | 'published' | 'archived';

export type BlogCategory =
  | 'guides'           // Home maintenance guides
  | 'tips'             // Quick tips
  | 'seasonal'         // Seasonal content
  | 'community'        // Local community spotlights
  | 'news';            // Company/local news

export const BLOG_CATEGORIES: Record<BlogCategory, { label: string; description: string }> = {
  guides: {
    label: 'Home Guides',
    description: 'In-depth guides for homeowners',
  },
  tips: {
    label: 'Quick Tips',
    description: 'Short, actionable advice',
  },
  seasonal: {
    label: 'Seasonal',
    description: 'Season-specific home care',
  },
  community: {
    label: 'Community',
    description: 'Local spotlights and stories',
  },
  news: {
    label: 'News',
    description: 'Updates and announcements',
  },
};

export interface BlogPostInput {
  title: string;
  slug?: string;
  excerpt?: string;
  content?: string;
  cover_image?: string;
  category?: BlogCategory;
  tags?: string[];
  author_name?: string;
  status?: BlogStatus;
  featured?: boolean;
  seo_title?: string;
  seo_description?: string;
}

// Helper to generate slug from title
export function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
    .substring(0, 100);
}
