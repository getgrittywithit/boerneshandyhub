import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getServiceCategory } from '@/data/serviceCategories';
import { getLocation, locationCategoryPages } from '@/data/locations';
import { getSubcategoryPage, getAllSubcategorySlugs } from '@/data/subcategories';
import serviceProvidersData from '@/data/serviceProviders.json';
import SlugPageClient from './SlugPageClient';

interface PageProps {
  params: Promise<{ category: string; slug: string }>;
}

// Determine if slug is a location or subcategory
function getPageType(categorySlug: string, slug: string): 'location' | 'subcategory' | null {
  const location = getLocation(slug);
  if (location) {
    const hasLocationPage = locationCategoryPages.some(
      page => page.category === categorySlug && page.location === slug
    );
    if (hasLocationPage) return 'location';
  }

  const subcategoryPage = getSubcategoryPage(categorySlug, slug);
  if (subcategoryPage) return 'subcategory';

  return null;
}

export async function generateStaticParams() {
  const params: { category: string; slug: string }[] = [];

  // Add location pages
  for (const page of locationCategoryPages) {
    params.push({
      category: page.category,
      slug: page.location,
    });
  }

  // Add subcategory pages
  const subcategorySlugs = getAllSubcategorySlugs();
  for (const page of subcategorySlugs) {
    params.push({
      category: page.category,
      slug: page.slug,
    });
  }

  return params;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { category, slug } = await params;
  const categoryData = getServiceCategory(category);

  if (!categoryData) {
    return { title: 'Not Found' };
  }

  const pageType = getPageType(category, slug);

  if (pageType === 'location') {
    const location = getLocation(slug);
    if (!location) return { title: 'Not Found' };

    const providers = serviceProvidersData.providers.filter(
      p => p.category === category && p.serviceArea.some(
        area => area.toLowerCase().includes(location.name.toLowerCase())
      )
    );

    const title = `${categoryData.name} in ${location.name} TX | Boerne's Handy Hub`;
    const description = `Find ${providers.length}+ trusted ${categoryData.name.toLowerCase()} professionals in ${location.name}, Texas. Licensed, insured pros serving ${location.name} and ${location.nearbyAreas.slice(0, 2).join(', ')}.`;

    return {
      title,
      description,
      keywords: [
        `${categoryData.name.toLowerCase()} ${location.name}`,
        `${categoryData.name.toLowerCase()} ${location.name} TX`,
        `${categoryData.name.toLowerCase()} near ${location.name}`,
        location.name,
        'Texas Hill Country',
        location.county + ' County',
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

  if (pageType === 'subcategory') {
    const subcategoryPage = getSubcategoryPage(category, slug);
    if (!subcategoryPage) return { title: 'Not Found' };

    return {
      title: `${subcategoryPage.title} | Boerne's Handy Hub`,
      description: subcategoryPage.description,
      keywords: subcategoryPage.keywords,
      openGraph: {
        title: subcategoryPage.title,
        description: subcategoryPage.description,
        type: 'website',
        locale: 'en_US',
        url: `https://boerneshandyhub.com/services/${category}/${slug}`,
      },
      twitter: {
        card: 'summary_large_image',
        title: subcategoryPage.title,
        description: subcategoryPage.description,
      },
      alternates: {
        canonical: `/services/${category}/${slug}`,
      },
    };
  }

  return { title: 'Not Found' };
}

export default async function SlugPage({ params }: PageProps) {
  const { category, slug } = await params;
  const categoryData = getServiceCategory(category);

  if (!categoryData) {
    notFound();
  }

  const pageType = getPageType(category, slug);

  if (!pageType) {
    notFound();
  }

  // Build breadcrumb schema
  const location = pageType === 'location' ? getLocation(slug) : null;
  const subcategoryPage = pageType === 'subcategory' ? getSubcategoryPage(category, slug) : null;

  const breadcrumbName = location?.name || subcategoryPage?.subcategory || slug;

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
        name: categoryData.name,
        item: `https://boerneshandyhub.com/services/${category}`,
      },
      {
        '@type': 'ListItem',
        position: 4,
        name: breadcrumbName,
        item: `https://boerneshandyhub.com/services/${category}/${slug}`,
      },
    ],
  };

  // Service schema
  const serviceSchema = {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: pageType === 'location'
      ? `${categoryData.name} Services in ${location?.name}, TX`
      : `${subcategoryPage?.subcategory} Services in Boerne, TX`,
    description: pageType === 'location'
      ? `Professional ${categoryData.name.toLowerCase()} services in ${location?.name}, Texas and surrounding areas.`
      : subcategoryPage?.description,
    areaServed: {
      '@type': 'City',
      name: location?.name || 'Boerne',
      addressRegion: 'TX',
      addressCountry: 'US',
    },
    provider: {
      '@type': 'LocalBusiness',
      name: "Boerne's Handy Hub",
      url: 'https://boerneshandyhub.com',
    },
    serviceType: pageType === 'location'
      ? [categoryData.name]
      : [subcategoryPage?.subcategory],
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
        category={category}
        slug={slug}
        pageType={pageType}
      />
    </>
  );
}
