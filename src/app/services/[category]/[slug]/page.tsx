import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getTopLevelCategory, getSubcategory, topLevelCategories } from '@/data/serviceCategories';
import serviceProvidersData from '@/data/serviceProviders.json';
import SlugPageClient from './SlugPageClient';

interface PageProps {
  params: Promise<{ category: string; slug: string }>;
}

export async function generateStaticParams() {
  const params: { category: string; slug: string }[] = [];

  // Generate params for all subcategories under each top-level category
  for (const topCat of topLevelCategories) {
    for (const sub of topCat.subcategories) {
      params.push({
        category: topCat.slug,
        slug: sub.slug,
      });
    }
  }

  return params;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { category, slug } = await params;
  const topCategory = getTopLevelCategory(category);
  const subcategory = getSubcategory(category, slug);

  if (!topCategory || !subcategory) {
    return { title: 'Not Found' };
  }

  // Count providers that match this subcategory
  // Providers have category field matching the subcategory slug (e.g., "plumbing")
  const providerCount = serviceProvidersData.providers.filter(
    p => p.category === slug
  ).length;

  const title = `${subcategory.name} in Boerne TX | Find Local ${subcategory.name} Pros`;
  const description = `Find ${providerCount > 0 ? providerCount + '+' : ''} trusted ${subcategory.name.toLowerCase()} professionals in Boerne, Texas. ${subcategory.description} Licensed, insured, and highly-rated local providers.`;

  return {
    title,
    description,
    keywords: [
      `${subcategory.name} Boerne`,
      `${subcategory.name} Boerne TX`,
      `${subcategory.name.toLowerCase()} near me`,
      `local ${subcategory.name.toLowerCase()}`,
      `${topCategory.name.toLowerCase()} services Boerne`,
      'Boerne Texas',
      'Hill Country',
      'Kendall County',
    ],
    openGraph: {
      title,
      description,
      type: 'website',
      locale: 'en_US',
      url: `https://boerneshandyhub.com/services/${category}/${slug}`,
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
    },
    alternates: {
      canonical: `/services/${category}/${slug}`,
    },
  };
}

export default async function SubcategoryPage({ params }: PageProps) {
  const { category, slug } = await params;
  const topCategory = getTopLevelCategory(category);
  const subcategory = getSubcategory(category, slug);

  if (!topCategory || !subcategory) {
    notFound();
  }

  // BreadcrumbList JSON-LD Schema
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
        name: 'Services',
        item: 'https://boerneshandyhub.com/services',
      },
      {
        '@type': 'ListItem',
        position: 3,
        name: topCategory.name,
        item: `https://boerneshandyhub.com/services/${category}`,
      },
      {
        '@type': 'ListItem',
        position: 4,
        name: subcategory.name,
        item: `https://boerneshandyhub.com/services/${category}/${slug}`,
      },
    ],
  };

  // Service schema
  const serviceSchema = {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: `${subcategory.name} Services in Boerne, TX`,
    description: subcategory.description,
    areaServed: {
      '@type': 'City',
      name: 'Boerne',
      addressRegion: 'TX',
      addressCountry: 'US',
    },
    provider: {
      '@type': 'LocalBusiness',
      name: "Boerne's Handy Hub",
      url: 'https://boerneshandyhub.com',
    },
    serviceType: subcategory.name,
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceSchema) }}
      />
      <SlugPageClient
        topCategorySlug={category}
        subcategorySlug={slug}
      />
    </>
  );
}
