import { Metadata } from 'next';
import Link from 'next/link';
import { createClient } from '@supabase/supabase-js';
import type { BlogPost, BlogCategory } from '@/types/blog';
import { BLOG_CATEGORIES } from '@/types/blog';
import { guides, type Guide } from '@/data/guides';
import { guideHubs, getFeaturedHubs } from '@/data/guideHubs';
import GuideSearch from '@/components/guides/GuideSearch';

export const metadata: Metadata = {
  title: "Home Guides & Tips | Boerne's Handy Hub",
  description: 'Expert guides, tips, and advice for Boerne homeowners. Learn about home maintenance, seasonal prep, and local service recommendations.',
  openGraph: {
    title: "Home Guides & Tips | Boerne's Handy Hub",
    description: 'Expert guides, tips, and advice for Boerne homeowners.',
    type: 'website',
  },
};

// Combined item type for rendering
interface ContentItem {
  type: 'blog' | 'static';
  slug: string;
  title: string;
  excerpt: string | null;
  coverImage: string | null;
  category: string;
  categoryLabel: string;
  date: string;
  tags?: string[];
  featured?: boolean;
}

async function getPosts(category?: string): Promise<BlogPost[]> {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !supabaseKey) {
    return [];
  }

  const supabase = createClient(supabaseUrl, supabaseKey);

  let query = supabase
    .from('blog_posts')
    .select('*')
    .eq('status', 'published')
    .order('published_at', { ascending: false });

  if (category && category !== 'all') {
    query = query.eq('category', category);
  }

  const { data, error } = await query;

  if (error) {
    console.error('Error fetching posts:', error);
    return [];
  }

  return data || [];
}

async function getFeaturedPost(): Promise<BlogPost | null> {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !supabaseKey) {
    return null;
  }

  const supabase = createClient(supabaseUrl, supabaseKey);

  const { data, error } = await supabase
    .from('blog_posts')
    .select('*')
    .eq('status', 'published')
    .eq('featured', true)
    .order('published_at', { ascending: false })
    .limit(1)
    .single();

  if (error) {
    return null;
  }

  return data;
}

async function getAllTags(): Promise<string[]> {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !supabaseKey) {
    return [];
  }

  const supabase = createClient(supabaseUrl, supabaseKey);

  const { data } = await supabase
    .from('blog_posts')
    .select('tags')
    .eq('status', 'published');

  if (!data) return [];

  // Flatten and count tags
  const tagCounts: Record<string, number> = {};
  data.forEach(post => {
    (post.tags || []).forEach((tag: string) => {
      tagCounts[tag] = (tagCounts[tag] || 0) + 1;
    });
  });

  // Also add tags from static guides
  guides.forEach(guide => {
    (guide.relatedCategories || []).forEach(cat => {
      tagCounts[cat] = (tagCounts[cat] || 0) + 1;
    });
  });

  // Sort by count and return top tags
  return Object.entries(tagCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 15)
    .map(([tag]) => tag);
}

function formatDate(dateString: string | null) {
  if (!dateString) return '';
  return new Date(dateString).toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });
}

// Convert blog post to content item
function blogToContentItem(post: BlogPost): ContentItem {
  return {
    type: 'blog',
    slug: post.slug,
    title: post.title,
    excerpt: post.excerpt,
    coverImage: post.cover_image,
    category: post.category,
    categoryLabel: BLOG_CATEGORIES[post.category as BlogCategory]?.label || post.category,
    date: post.published_at || post.created_at,
    tags: post.tags,
    featured: post.featured,
  };
}

// Convert static guide to content item
function guideToContentItem(guide: Guide): ContentItem {
  return {
    type: 'static',
    slug: guide.slug,
    title: guide.title,
    excerpt: guide.metaDescription,
    coverImage: null,
    category: 'guides',
    categoryLabel: 'Home Guides',
    date: guide.lastUpdated,
    tags: guide.relatedCategories,
  };
}

export default async function GuidesPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string; tag?: string; q?: string }>;
}) {
  const params = await searchParams;
  const category = params.category || 'all';
  const selectedTag = params.tag;
  const searchQuery = params.q;

  const posts = await getPosts(category);
  const featuredPost = category === 'all' && !selectedTag && !searchQuery ? await getFeaturedPost() : null;
  const popularTags = await getAllTags();
  const featuredHubs = getFeaturedHubs();

  // Filter out featured post from regular list to avoid duplication
  let blogPosts = featuredPost
    ? posts.filter(p => p.id !== featuredPost.id)
    : posts;

  // Get static guides (only show if category is 'all' or 'guides')
  let staticGuides = (category === 'all' || category === 'guides')
    ? guides
    : [];

  // Filter by tag if selected
  if (selectedTag) {
    blogPosts = blogPosts.filter(p =>
      p.tags?.some(t => t.toLowerCase() === selectedTag.toLowerCase())
    );
    staticGuides = staticGuides.filter(g =>
      g.relatedCategories?.some(c => c.toLowerCase() === selectedTag.toLowerCase())
    );
  }

  // Filter by search query
  if (searchQuery) {
    const query = searchQuery.toLowerCase();
    blogPosts = blogPosts.filter(p =>
      p.title.toLowerCase().includes(query) ||
      p.excerpt?.toLowerCase().includes(query) ||
      p.tags?.some(t => t.toLowerCase().includes(query))
    );
    staticGuides = staticGuides.filter(g =>
      g.title.toLowerCase().includes(query) ||
      g.metaDescription.toLowerCase().includes(query) ||
      g.relatedCategories?.some(c => c.toLowerCase().includes(query))
    );
  }

  // Convert to content items
  const blogItems = blogPosts.map(blogToContentItem);
  const guideItems = staticGuides.map(guideToContentItem);

  // Combine and sort by date
  const allItems = [...blogItems, ...guideItems].sort((a, b) =>
    new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  const isFiltered = selectedTag || searchQuery || category !== 'all';

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero */}
      <section className="bg-boerne-navy text-white py-16">
        <div className="max-w-6xl mx-auto px-4">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Home Guides & Tips
          </h1>
          <p className="text-xl text-gray-300 max-w-2xl mb-8">
            Expert advice for Boerne homeowners. From seasonal maintenance to finding the right service provider.
          </p>

          {/* Search */}
          <GuideSearch initialQuery={searchQuery} />
        </div>
      </section>

      {/* Topic Hubs */}
      {!isFiltered && (
        <section className="bg-white border-b border-gray-200 py-8">
          <div className="max-w-6xl mx-auto px-4">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              Browse by Topic
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {featuredHubs.map(hub => (
                <Link
                  key={hub.slug}
                  href={`/guides/hub/${hub.slug}`}
                  className={`relative overflow-hidden rounded-xl p-5 text-white bg-gradient-to-br ${hub.color} hover:shadow-lg transition-shadow group`}
                >
                  <div className="relative z-10">
                    <span className="text-3xl mb-2 block">{hub.icon}</span>
                    <h3 className="font-semibold">{hub.shortTitle}</h3>
                    <p className="text-white/80 text-xs mt-1 line-clamp-2">
                      {hub.description}
                    </p>
                  </div>
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors" />
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Category & Tag Filters */}
      <section className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-4">
          {/* Categories */}
          <div className="flex gap-2 py-4 overflow-x-auto">
            <Link
              href="/guides"
              className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
                category === 'all' && !selectedTag
                  ? 'bg-boerne-navy text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              All
            </Link>
            {Object.entries(BLOG_CATEGORIES).map(([key, { label }]) => (
              <Link
                key={key}
                href={`/guides?category=${key}`}
                className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
                  category === key
                    ? 'bg-boerne-navy text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {label}
              </Link>
            ))}
          </div>

          {/* Popular Tags */}
          {popularTags.length > 0 && !isFiltered && (
            <div className="flex gap-2 pb-4 overflow-x-auto">
              <span className="text-xs text-gray-500 py-1 px-2">Popular:</span>
              {popularTags.slice(0, 8).map(tag => (
                <Link
                  key={tag}
                  href={`/guides?tag=${encodeURIComponent(tag)}`}
                  className="px-3 py-1 bg-gray-50 border border-gray-200 rounded-full text-xs text-gray-600 hover:bg-boerne-gold/10 hover:border-boerne-gold transition-colors whitespace-nowrap"
                >
                  {tag}
                </Link>
              ))}
            </div>
          )}

          {/* Active filters */}
          {isFiltered && (
            <div className="flex items-center gap-2 pb-4">
              <span className="text-xs text-gray-500">Filtering by:</span>
              {selectedTag && (
                <span className="inline-flex items-center gap-1 px-3 py-1 bg-boerne-gold/20 text-boerne-navy rounded-full text-xs font-medium">
                  {selectedTag}
                  <Link href="/guides" className="hover:text-red-600">×</Link>
                </span>
              )}
              {searchQuery && (
                <span className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium">
                  "{searchQuery}"
                  <Link href="/guides" className="hover:text-red-600">×</Link>
                </span>
              )}
              <Link href="/guides" className="text-xs text-gray-500 hover:text-boerne-gold">
                Clear all
              </Link>
            </div>
          )}
        </div>
      </section>

      <div className="max-w-6xl mx-auto px-4 py-12">
        {/* Featured post */}
        {featuredPost && !isFiltered && (
          <section className="mb-12">
            <Link href={`/guides/${featuredPost.slug}`} className="block group">
              <div className="bg-white rounded-2xl shadow-lg overflow-hidden md:flex">
                {featuredPost.cover_image ? (
                  <div className="md:w-1/2">
                    <img
                      src={featuredPost.cover_image}
                      alt={featuredPost.title}
                      className="w-full h-64 md:h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                ) : (
                  <div className="md:w-1/2 bg-gradient-to-br from-boerne-navy to-boerne-navy/80 flex items-center justify-center">
                    <span className="text-6xl">📚</span>
                  </div>
                )}
                <div className="p-8 md:w-1/2 flex flex-col justify-center">
                  <span className="text-boerne-gold text-sm font-semibold uppercase tracking-wide">
                    Featured
                  </span>
                  <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mt-2 group-hover:text-boerne-gold transition-colors">
                    {featuredPost.title}
                  </h2>
                  {featuredPost.excerpt && (
                    <p className="text-gray-600 mt-4 line-clamp-3">
                      {featuredPost.excerpt}
                    </p>
                  )}
                  <div className="flex items-center gap-4 mt-6 text-sm text-gray-500">
                    <span>{formatDate(featuredPost.published_at)}</span>
                    <span className="px-2 py-1 bg-gray-100 rounded-full">
                      {BLOG_CATEGORIES[featuredPost.category as BlogCategory]?.label || featuredPost.category}
                    </span>
                  </div>
                </div>
              </div>
            </Link>
          </section>
        )}

        {/* Results count when filtered */}
        {isFiltered && (
          <div className="mb-6">
            <p className="text-gray-600">
              Found <span className="font-semibold text-gray-900">{allItems.length}</span> {allItems.length === 1 ? 'guide' : 'guides'}
              {selectedTag && <> tagged with "{selectedTag}"</>}
              {searchQuery && <> matching "{searchQuery}"</>}
            </p>
          </div>
        )}

        {/* Content grid */}
        {allItems.length > 0 ? (
          <section>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {allItems.map((item) => (
                <Link
                  key={`${item.type}-${item.slug}`}
                  href={`/guides/${item.slug}`}
                  className="bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-lg transition-shadow group"
                >
                  {item.coverImage ? (
                    <div className="aspect-video overflow-hidden">
                      <img
                        src={item.coverImage}
                        alt={item.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                  ) : (
                    <div className="aspect-video bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
                      <span className="text-4xl">📝</span>
                    </div>
                  )}
                  <div className="p-6">
                    <span className="text-xs font-medium text-boerne-gold uppercase tracking-wide">
                      {item.categoryLabel}
                    </span>
                    <h3 className="text-lg font-semibold text-gray-900 mt-2 group-hover:text-boerne-gold transition-colors line-clamp-2">
                      {item.title}
                    </h3>
                    {item.excerpt && (
                      <p className="text-gray-600 text-sm mt-2 line-clamp-2">
                        {item.excerpt}
                      </p>
                    )}
                    <div className="flex items-center gap-2 mt-4 text-xs text-gray-500">
                      <span>{formatDate(item.date)}</span>
                      {item.tags && item.tags.length > 0 && (
                        <>
                          <span>•</span>
                          <span>{item.tags.slice(0, 2).join(', ')}</span>
                        </>
                      )}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        ) : (
          <section className="text-center py-16">
            <div className="text-5xl mb-4">📝</div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              No guides found
            </h2>
            <p className="text-gray-600 mb-6">
              {isFiltered
                ? 'Try adjusting your filters or search terms.'
                : 'Check back soon for helpful home guides and tips.'}
            </p>
            {isFiltered && (
              <Link
                href="/guides"
                className="text-boerne-gold font-semibold hover:underline"
              >
                Clear filters →
              </Link>
            )}
          </section>
        )}

        {/* Newsletter CTA */}
        <section className="mt-16 bg-boerne-navy rounded-2xl p-8 md:p-12 text-center">
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">
            Get Tips in Your Inbox
          </h2>
          <p className="text-gray-300 mb-6 max-w-xl mx-auto">
            Subscribe to our newsletter for seasonal home maintenance reminders and exclusive tips from local pros.
          </p>
          <form className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 px-4 py-3 rounded-lg focus:ring-2 focus:ring-boerne-gold focus:outline-none"
            />
            <button
              type="submit"
              className="px-6 py-3 bg-boerne-gold text-boerne-navy font-semibold rounded-lg hover:bg-boerne-gold-alt transition-colors"
            >
              Subscribe
            </button>
          </form>
        </section>
      </div>
    </div>
  );
}
