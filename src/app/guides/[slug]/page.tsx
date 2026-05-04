import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { createClient } from '@supabase/supabase-js';
import { getGuideBySlug, getAllGuideSlugs, guides, type Guide } from '@/data/guides';
import { getServiceCategory } from '@/data/serviceCategories';
import { getRelatedGuides } from '@/data/internalLinks';
import type { BlogPost, BlogCategory } from '@/types/blog';
import { BLOG_CATEGORIES } from '@/types/blog';

interface PageProps {
  params: Promise<{ slug: string }>;
}

// Get blog post from database
async function getBlogPost(slug: string): Promise<BlogPost | null> {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !supabaseKey) {
    return null;
  }

  const supabase = createClient(supabaseUrl, supabaseKey);

  const { data, error } = await supabase
    .from('blog_posts')
    .select('*')
    .eq('slug', slug)
    .eq('status', 'published')
    .single();

  if (error) {
    return null;
  }

  return data;
}

// Get related blog posts from database
async function getRelatedBlogPosts(currentId: string, category: string): Promise<BlogPost[]> {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !supabaseKey) {
    return [];
  }

  const supabase = createClient(supabaseUrl, supabaseKey);

  const { data, error } = await supabase
    .from('blog_posts')
    .select('*')
    .eq('status', 'published')
    .eq('category', category)
    .neq('id', currentId)
    .order('published_at', { ascending: false })
    .limit(3);

  if (error) {
    return [];
  }

  return data || [];
}

export async function generateStaticParams() {
  const slugs = getAllGuideSlugs();
  return slugs.map(slug => ({ slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;

  // Check database first
  const blogPost = await getBlogPost(slug);
  if (blogPost) {
    return {
      title: blogPost.seo_title || `${blogPost.title} | Boerne's Handy Hub`,
      description: blogPost.seo_description || blogPost.excerpt || `Read ${blogPost.title} on Boerne's Handy Hub`,
      openGraph: {
        title: blogPost.seo_title || blogPost.title,
        description: blogPost.seo_description || blogPost.excerpt || '',
        type: 'article',
        publishedTime: blogPost.published_at || undefined,
        authors: [blogPost.author_name],
        images: blogPost.cover_image ? [blogPost.cover_image] : undefined,
        url: `https://boerneshandyhub.com/guides/${slug}`,
      },
      twitter: {
        card: 'summary_large_image',
        title: blogPost.seo_title || blogPost.title,
        description: blogPost.seo_description || blogPost.excerpt || '',
        images: blogPost.cover_image ? [blogPost.cover_image] : undefined,
      },
      alternates: {
        canonical: `/guides/${slug}`,
      },
    };
  }

  // Fall back to static guides
  const guide = getGuideBySlug(slug);

  if (!guide) {
    return { title: 'Guide Not Found' };
  }

  return {
    title: `${guide.metaTitle} | Boerne's Handy Hub`,
    description: guide.metaDescription,
    openGraph: {
      title: guide.metaTitle,
      description: guide.metaDescription,
      type: 'article',
      locale: 'en_US',
      url: `https://boerneshandyhub.com/guides/${slug}`,
    },
    twitter: {
      card: 'summary_large_image',
      title: guide.metaTitle,
      description: guide.metaDescription,
    },
    alternates: {
      canonical: `/guides/${slug}`,
    },
  };
}

// Simple markdown to HTML renderer
function renderMarkdown(md: string): string {
  return md
    .replace(/^### (.*$)/gim, '<h3 class="text-xl font-semibold mt-8 mb-3 text-boerne-navy">$1</h3>')
    .replace(/^## (.*$)/gim, '<h2 class="text-2xl font-bold mt-10 mb-4 text-boerne-navy">$1</h2>')
    .replace(/^# (.*$)/gim, '<h1 class="text-3xl font-bold mt-10 mb-4 text-boerne-navy">$1</h1>')
    .replace(/\*\*(.*?)\*\*/g, '<strong class="font-semibold">$1</strong>')
    .replace(/\*(.*?)\*/g, '<em>$1</em>')
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" class="text-boerne-gold hover:underline">$1</a>')
    .replace(/^- (.*$)/gim, '<li class="ml-6 mb-2">$1</li>')
    .replace(/(<li.*<\/li>\n?)+/g, '<ul class="list-disc my-4">$&</ul>')
    .replace(/\n\n/g, '</p><p class="mb-4 text-boerne-dark-gray leading-relaxed">')
    .replace(/\n/g, '<br/>');
}

function formatDate(dateString: string | null) {
  if (!dateString) return '';
  return new Date(dateString).toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });
}

// Blog post view component
function BlogPostView({ post, relatedPosts }: { post: BlogPost; relatedPosts: BlogPost[] }) {
  const articleSchema = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: post.title,
    description: post.seo_description || post.excerpt,
    author: {
      '@type': 'Organization',
      name: post.author_name,
      url: 'https://boerneshandyhub.com',
    },
    publisher: {
      '@type': 'Organization',
      name: "Boerne's Handy Hub",
      url: 'https://boerneshandyhub.com',
    },
    datePublished: post.published_at,
    dateModified: post.updated_at,
    image: post.cover_image,
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `https://boerneshandyhub.com/guides/${post.slug}`,
    },
  };

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://boerneshandyhub.com' },
      { '@type': 'ListItem', position: 2, name: 'Guides', item: 'https://boerneshandyhub.com/guides' },
      { '@type': 'ListItem', position: 3, name: post.title, item: `https://boerneshandyhub.com/guides/${post.slug}` },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />

      <div className="bg-white min-h-screen">
        {/* Header/Cover */}
        <header className="relative">
          {post.cover_image ? (
            <div className="h-64 md:h-96 relative">
              <img
                src={post.cover_image}
                alt={post.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
            </div>
          ) : (
            <div className="h-48 bg-gradient-to-br from-boerne-navy to-boerne-dark-gray" />
          )}

          <div className={`absolute top-0 left-0 right-0 p-4 text-white`}>
            <div className="max-w-4xl mx-auto">
              <nav className="flex items-center gap-2 text-sm">
                <Link href="/" className="hover:underline opacity-80">Home</Link>
                <span className="opacity-60">/</span>
                <Link href="/guides" className="hover:underline opacity-80">Guides</Link>
                <span className="opacity-60">/</span>
                <span className="opacity-60 truncate max-w-[200px]">{post.title}</span>
              </nav>
            </div>
          </div>
        </header>

        {/* Article */}
        <article className="max-w-4xl mx-auto px-4 -mt-16 relative z-10">
          <div className="bg-white rounded-2xl shadow-lg p-8 md:p-12">
            <Link
              href={`/guides?category=${post.category}`}
              className="inline-block px-3 py-1 bg-boerne-gold/10 text-boerne-gold text-sm font-semibold rounded-full hover:bg-boerne-gold/20 transition-colors"
            >
              {BLOG_CATEGORIES[post.category as BlogCategory]?.label || post.category}
            </Link>

            <h1 className="text-3xl md:text-4xl font-bold text-boerne-navy mt-4 mb-6">
              {post.title}
            </h1>

            <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500 pb-8 border-b border-gray-200">
              <span>By {post.author_name}</span>
              <span>&#8226;</span>
              <span>{formatDate(post.published_at)}</span>
              {post.tags && post.tags.length > 0 && (
                <>
                  <span>&#8226;</span>
                  <div className="flex gap-2">
                    {post.tags.map((tag) => (
                      <span key={tag} className="px-2 py-1 bg-gray-100 rounded-full text-xs">
                        {tag}
                      </span>
                    ))}
                  </div>
                </>
              )}
            </div>

            {post.excerpt && (
              <p className="text-xl text-boerne-dark-gray leading-relaxed mt-8 mb-8 italic">
                {post.excerpt}
              </p>
            )}

            <div
              className="prose prose-lg max-w-none mt-8"
              dangerouslySetInnerHTML={{
                __html: `<p class="mb-4 text-boerne-dark-gray leading-relaxed">${renderMarkdown(post.content || '')}</p>`
              }}
            />

            <div className="mt-12 pt-8 border-t border-gray-200">
              <p className="text-sm font-medium text-boerne-navy mb-4">Share this guide</p>
              <div className="flex gap-3">
                <a
                  href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(post.title)}&url=${encodeURIComponent(`https://boerneshandyhub.com/guides/${post.slug}`)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2 bg-gray-100 rounded-lg text-gray-700 hover:bg-gray-200 transition-colors text-sm"
                >
                  Twitter
                </a>
                <a
                  href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(`https://boerneshandyhub.com/guides/${post.slug}`)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2 bg-gray-100 rounded-lg text-gray-700 hover:bg-gray-200 transition-colors text-sm"
                >
                  Facebook
                </a>
              </div>
            </div>
          </div>
        </article>

        {/* Related Posts */}
        {relatedPosts.length > 0 && (
          <section className="max-w-6xl mx-auto px-4 py-16">
            <h2 className="text-2xl font-bold text-boerne-navy mb-8">
              More {BLOG_CATEGORIES[post.category as BlogCategory]?.label || 'Guides'}
            </h2>
            <div className="grid md:grid-cols-3 gap-8">
              {relatedPosts.map((related) => (
                <Link
                  key={related.id}
                  href={`/guides/${related.slug}`}
                  className="bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-lg transition-shadow group"
                >
                  {related.cover_image ? (
                    <div className="aspect-video overflow-hidden">
                      <img
                        src={related.cover_image}
                        alt={related.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                  ) : (
                    <div className="aspect-video bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
                      <span className="text-4xl">&#128221;</span>
                    </div>
                  )}
                  <div className="p-6">
                    <h3 className="font-semibold text-boerne-navy group-hover:text-boerne-gold transition-colors line-clamp-2">
                      {related.title}
                    </h3>
                    <p className="text-sm text-gray-500 mt-2">
                      {formatDate(related.published_at)}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* CTA */}
        <section className="bg-boerne-light-gray py-16">
          <div className="max-w-4xl mx-auto px-4 text-center">
            <h2 className="text-2xl font-bold text-boerne-navy mb-4">
              Need Help with Home Services?
            </h2>
            <p className="text-boerne-dark-gray mb-6">
              Find trusted local professionals for all your home maintenance and repair needs.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/categories"
                className="px-6 py-3 bg-boerne-navy text-white font-semibold rounded-lg hover:bg-opacity-90 transition-colors"
              >
                Browse Services
              </Link>
              <Link
                href="/guides"
                className="px-6 py-3 bg-white border border-gray-300 text-boerne-dark-gray font-semibold rounded-lg hover:bg-gray-50 transition-colors"
              >
                More Guides
              </Link>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}

// Static guide view component (existing functionality)
function StaticGuideView({ guide, slug }: { guide: Guide; slug: string }) {
  const articleSchema = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: guide.title,
    description: guide.metaDescription,
    author: {
      '@type': 'Organization',
      name: "Boerne's Handy Hub",
      url: 'https://boerneshandyhub.com',
    },
    publisher: {
      '@type': 'Organization',
      name: "Boerne's Handy Hub",
      url: 'https://boerneshandyhub.com',
    },
    datePublished: guide.lastUpdated,
    dateModified: guide.lastUpdated,
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `https://boerneshandyhub.com/guides/${slug}`,
    },
  };

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://boerneshandyhub.com' },
      { '@type': 'ListItem', position: 2, name: 'Guides', item: 'https://boerneshandyhub.com/guides' },
      { '@type': 'ListItem', position: 3, name: guide.title, item: `https://boerneshandyhub.com/guides/${slug}` },
    ],
  };

  const relatedGuideSlugs = getRelatedGuides(slug);
  const relatedGuidesList = relatedGuideSlugs
    .map(s => guides.find(g => g.slug === s))
    .filter(Boolean);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />

      <div className="bg-boerne-light-gray min-h-screen">
        {/* Header */}
        <div className="bg-gradient-to-r from-boerne-navy to-boerne-dark-gray">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <nav className="flex items-center space-x-2 text-sm text-boerne-gold mb-6">
              <Link href="/" className="hover:text-white">Home</Link>
              <span>›</span>
              <Link href="/services" className="hover:text-white">Services</Link>
              <span>›</span>
              <span className="text-white">Guide</span>
            </nav>
            <h1 className="text-4xl font-bold text-white mb-4">
              {guide.title}
            </h1>
            <p className="text-xl text-boerne-gold">
              {guide.heroSubtitle}
            </p>
          </div>
        </div>

        {/* Article Content */}
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <article className="bg-white rounded-lg shadow-lg p-8">
            {/* Introduction */}
            <div className="prose prose-lg max-w-none mb-8">
              <p className="text-lg text-boerne-dark-gray leading-relaxed">
                {guide.introduction}
              </p>
            </div>

            {/* Table of Contents */}
            <div className="bg-boerne-light-gray p-6 rounded-lg mb-8">
              <h2 className="text-lg font-semibold text-boerne-navy mb-4">In This Guide</h2>
              <ul className="space-y-2">
                {guide.sections.map((section, index) => (
                  <li key={index}>
                    <a
                      href={`#section-${index}`}
                      className="text-boerne-gold hover:text-boerne-navy transition-colors"
                    >
                      {section.heading}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Sections */}
            {guide.sections.map((section, index) => (
              <section key={index} id={`section-${index}`} className="mb-8">
                <h2 className="text-2xl font-bold text-boerne-navy mb-4">
                  {section.heading}
                </h2>
                <div className="prose prose-lg max-w-none">
                  <p className="text-boerne-dark-gray leading-relaxed whitespace-pre-line">
                    {section.content}
                  </p>
                </div>
              </section>
            ))}

            {/* Last Updated */}
            <div className="border-t border-gray-200 pt-6 mt-8">
              <p className="text-sm text-gray-500">
                Last updated: {new Date(guide.lastUpdated).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </p>
            </div>
          </article>

          {/* Related Services */}
          <div className="mt-8 bg-white rounded-lg shadow-lg p-8">
            <h2 className="text-2xl font-bold text-boerne-navy mb-6">
              Find Related Service Providers
            </h2>
            <div className="flex flex-wrap gap-3">
              {guide.relatedCategories.map(categorySlug => {
                const category = getServiceCategory(categorySlug);
                if (!category) return null;
                return (
                  <Link
                    key={categorySlug}
                    href={`/services/${categorySlug}`}
                    className="px-4 py-2 bg-boerne-light-gray text-boerne-navy rounded-lg hover:bg-boerne-gold transition-colors flex items-center gap-2"
                  >
                    <span>{category.icon}</span>
                    <span>{category.name}</span>
                  </Link>
                );
              })}
            </div>
          </div>

          {/* CTA */}
          <div className="mt-8 bg-boerne-navy rounded-lg p-8 text-center">
            <h2 className="text-2xl font-bold text-white mb-4">
              Need Help with Your Project?
            </h2>
            <p className="text-boerne-gold mb-6">
              Connect with trusted, local professionals in Boerne and the Hill Country.
            </p>
            <Link
              href="/services"
              className="inline-block px-6 py-3 bg-boerne-gold text-boerne-navy font-semibold rounded-lg hover:bg-boerne-gold-alt transition-colors"
            >
              Find Service Providers
            </Link>
          </div>

          {/* Related Guides */}
          {relatedGuidesList.length > 0 && (
            <div className="mt-8 bg-white rounded-lg shadow-lg p-8">
              <h2 className="text-2xl font-bold text-boerne-navy mb-6">
                You Might Also Like
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {relatedGuidesList.slice(0, 3).map(relatedGuide => relatedGuide && (
                  <Link
                    key={relatedGuide.slug}
                    href={`/guides/${relatedGuide.slug}`}
                    className="p-4 bg-boerne-light-gray rounded-lg hover:bg-boerne-gold transition-colors group"
                  >
                    <h3 className="font-semibold text-boerne-navy mb-2 group-hover:text-boerne-navy">
                      {relatedGuide.title}
                    </h3>
                    <p className="text-sm text-boerne-dark-gray line-clamp-2">
                      {relatedGuide.metaDescription}
                    </p>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

export default async function GuidePage({ params }: PageProps) {
  const { slug } = await params;

  // Check database first for blog posts
  const blogPost = await getBlogPost(slug);
  if (blogPost) {
    const relatedPosts = await getRelatedBlogPosts(blogPost.id, blogPost.category);
    return <BlogPostView post={blogPost} relatedPosts={relatedPosts} />;
  }

  // Fall back to static guides
  const guide = getGuideBySlug(slug);

  if (!guide) {
    notFound();
  }

  return <StaticGuideView guide={guide} slug={slug} />;
}
