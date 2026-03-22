import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { getGuideBySlug, getAllGuideSlugs, guides, type Guide } from '@/data/guides';
import { getServiceCategory } from '@/data/serviceCategories';
import { getRelatedGuides } from '@/data/internalLinks';

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const slugs = getAllGuideSlugs();
  return slugs.map(slug => ({ slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
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

export default async function GuidePage({ params }: PageProps) {
  const { slug } = await params;
  const guide = getGuideBySlug(slug);

  if (!guide) {
    notFound();
  }

  // Article schema for guides
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
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Home',
        item: 'https://boerneshandyhub.com',
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: 'Guides',
        item: 'https://boerneshandyhub.com/guides',
      },
      {
        '@type': 'ListItem',
        position: 3,
        name: guide.title,
        item: `https://boerneshandyhub.com/guides/${slug}`,
      },
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
          {(() => {
            const relatedGuideSlugs = getRelatedGuides(slug);
            const relatedGuidesList = relatedGuideSlugs
              .map(s => guides.find(g => g.slug === s))
              .filter(Boolean);
            if (relatedGuidesList.length === 0) return null;
            return (
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
            );
          })()}
        </div>
      </div>
    </>
  );
}
