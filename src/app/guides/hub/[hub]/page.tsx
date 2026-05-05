import { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { createClient } from '@supabase/supabase-js';
import { guideHubs, getHubBySlug } from '@/data/guideHubs';
import { guides } from '@/data/guides';
import type { BlogPost, BlogCategory } from '@/types/blog';
import { BLOG_CATEGORIES } from '@/types/blog';

interface Props {
  params: Promise<{ hub: string }>;
}

export async function generateStaticParams() {
  return guideHubs.map((hub) => ({
    hub: hub.slug,
  }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { hub: hubSlug } = await params;
  const hub = getHubBySlug(hubSlug);

  if (!hub) {
    return { title: 'Guide Hub Not Found' };
  }

  return {
    title: `${hub.title} | Boerne's Handy Hub Guides`,
    description: hub.description,
    openGraph: {
      title: `${hub.title} | Boerne's Handy Hub`,
      description: hub.description,
      type: 'website',
    },
  };
}

async function getHubPosts(hub: ReturnType<typeof getHubBySlug>): Promise<BlogPost[]> {
  if (!hub) return [];

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !supabaseKey) {
    return [];
  }

  const supabase = createClient(supabaseUrl, supabaseKey);

  // Get posts that match hub categories
  const { data, error } = await supabase
    .from('blog_posts')
    .select('*')
    .eq('status', 'published')
    .in('category', hub.categories)
    .order('published_at', { ascending: false });

  if (error) {
    console.error('Error fetching hub posts:', error);
    return [];
  }

  // Filter by tags if any match
  const posts = (data || []).filter(post => {
    // Include if category matches
    if (hub.categories.includes(post.category)) {
      // If post has tags that match hub tags, prioritize it
      const postTags = post.tags || [];
      const hasMatchingTag = hub.tags.some(tag =>
        postTags.some((pt: string) => pt.toLowerCase().includes(tag.toLowerCase()))
      );
      return true; // Include all posts from matching categories for now
    }
    return false;
  });

  return posts;
}

function getHubStaticGuides(hub: ReturnType<typeof getHubBySlug>) {
  if (!hub) return [];

  return guides.filter(guide => {
    // Check if any related categories match hub tags
    const guideCategories = guide.relatedCategories || [];
    return hub.tags.some(tag =>
      guideCategories.some(cat => cat.toLowerCase().includes(tag.toLowerCase())) ||
      guide.title.toLowerCase().includes(tag.toLowerCase())
    );
  });
}

function formatDate(dateString: string | null) {
  if (!dateString) return '';
  return new Date(dateString).toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });
}

export default async function GuideHubPage({ params }: Props) {
  const { hub: hubSlug } = await params;
  const hub = getHubBySlug(hubSlug);

  if (!hub) {
    notFound();
  }

  const posts = await getHubPosts(hub);
  const staticGuides = getHubStaticGuides(hub);

  // Combine and deduplicate
  const allItems = [
    ...posts.map(post => ({
      type: 'blog' as const,
      slug: post.slug,
      title: post.title,
      excerpt: post.excerpt,
      coverImage: post.cover_image,
      date: post.published_at || post.created_at,
      tags: post.tags,
    })),
    ...staticGuides.map(guide => ({
      type: 'static' as const,
      slug: guide.slug,
      title: guide.title,
      excerpt: guide.metaDescription,
      coverImage: null,
      date: guide.lastUpdated,
      tags: guide.relatedCategories,
    })),
  ].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  // Get other hubs for navigation
  const otherHubs = guideHubs.filter(h => h.slug !== hub.slug).slice(0, 3);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero */}
      <section className={`bg-gradient-to-br ${hub.color} text-white py-16`}>
        <div className="max-w-5xl mx-auto px-4">
          <Link
            href="/guides"
            className="inline-flex items-center gap-2 text-white/80 hover:text-white mb-6 text-sm"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            All Guides
          </Link>
          <div className="flex items-center gap-4 mb-4">
            <span className="text-5xl">{hub.icon}</span>
            <h1 className="text-4xl md:text-5xl font-bold">{hub.title}</h1>
          </div>
          <p className="text-xl text-white/90 max-w-2xl">
            {hub.description}
          </p>
          <div className="flex flex-wrap gap-2 mt-6">
            {hub.tags.slice(0, 6).map(tag => (
              <span
                key={tag}
                className="px-3 py-1 bg-white/20 rounded-full text-sm"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
      </section>

      <div className="max-w-5xl mx-auto px-4 py-12">
        {/* Content Grid */}
        {allItems.length > 0 ? (
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              {allItems.length} {allItems.length === 1 ? 'Guide' : 'Guides'} Available
            </h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
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
                    <div className={`aspect-video bg-gradient-to-br ${hub.color} opacity-80 flex items-center justify-center`}>
                      <span className="text-4xl text-white/50">{hub.icon}</span>
                    </div>
                  )}
                  <div className="p-5">
                    <h3 className="text-lg font-semibold text-gray-900 group-hover:text-boerne-navy transition-colors line-clamp-2">
                      {item.title}
                    </h3>
                    {item.excerpt && (
                      <p className="text-gray-600 text-sm mt-2 line-clamp-2">
                        {item.excerpt}
                      </p>
                    )}
                    <div className="flex items-center gap-2 mt-3 text-xs text-gray-500">
                      <span>{formatDate(item.date)}</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        ) : (
          <section className="text-center py-16">
            <span className="text-6xl mb-4 block">{hub.icon}</span>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Coming Soon
            </h2>
            <p className="text-gray-600 mb-6">
              We're working on guides for this topic. Check back soon!
            </p>
            <Link
              href="/guides"
              className="text-boerne-gold font-semibold hover:underline"
            >
              Browse all guides →
            </Link>
          </section>
        )}

        {/* Other Hubs */}
        <section className="mt-16 pt-12 border-t border-gray-200">
          <h2 className="text-xl font-bold text-gray-900 mb-6">
            Explore Other Topics
          </h2>
          <div className="grid md:grid-cols-3 gap-4">
            {otherHubs.map(otherHub => (
              <Link
                key={otherHub.slug}
                href={`/guides/hub/${otherHub.slug}`}
                className="flex items-center gap-3 p-4 bg-white rounded-lg border border-gray-200 hover:border-boerne-gold hover:shadow-sm transition-all group"
              >
                <span className="text-2xl">{otherHub.icon}</span>
                <div>
                  <p className="font-semibold text-gray-900 group-hover:text-boerne-navy">
                    {otherHub.shortTitle}
                  </p>
                  <p className="text-xs text-gray-500 line-clamp-1">
                    {otherHub.description}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* CTA */}
        <section className="mt-16 bg-boerne-navy rounded-2xl p-8 text-center">
          <h2 className="text-2xl font-bold text-white mb-3">
            Have a Tip to Share?
          </h2>
          <p className="text-gray-300 mb-6">
            Help fellow Boerne residents with your knowledge and experience.
          </p>
          <Link
            href="/contribute?type=tip"
            className="inline-block px-6 py-3 bg-boerne-gold text-boerne-navy font-semibold rounded-lg hover:bg-boerne-gold-alt transition-colors"
          >
            Share a Tip
          </Link>
        </section>
      </div>
    </div>
  );
}
