import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getServiceCategory, serviceCategories } from '@/data/serviceCategories';
import serviceProvidersData from '@/data/serviceProviders.json';
import CategoryPageClient from './CategoryPageClient';

interface PageProps {
  params: Promise<{ category: string }>;
}

export async function generateStaticParams() {
  return serviceCategories.map((category) => ({
    category: category.slug,
  }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { category } = await params;
  const categoryData = getServiceCategory(category);

  if (!categoryData) {
    return {
      title: 'Category Not Found',
    };
  }

  const providerCount = serviceProvidersData.providers.filter(
    (p) => p.category === category
  ).length;

  const title = `${categoryData.name} in Boerne TX | Find Local ${categoryData.name} Pros`;
  const description = `Find ${providerCount}+ trusted ${categoryData.name.toLowerCase()} professionals in Boerne, Texas. ${categoryData.description} Licensed, insured, and highly-rated local providers.`;

  return {
    title,
    description,
    keywords: [
      `${categoryData.name} Boerne`,
      `${categoryData.name} Boerne TX`,
      `${categoryData.name.toLowerCase()} near me`,
      `local ${categoryData.name.toLowerCase()}`,
      ...categoryData.subcategories.map((sub) => `${sub} Boerne`),
      'Boerne Texas',
      'Hill Country',
      'Kendall County',
    ],
    openGraph: {
      title,
      description,
      type: 'website',
      locale: 'en_US',
      url: `https://boerneshandyhub.com/services/${category}`,
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
    },
    alternates: {
      canonical: `/services/${category}`,
    },
  };
}

export default async function ServiceCategoryPage({ params }: PageProps) {
  const { category } = await params;
  const categoryData = getServiceCategory(category);

  if (!categoryData) {
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
        name: categoryData.name,
        item: `https://boerneshandyhub.com/services/${category}`,
      },
    ],
  };

  // Service category schema
  const serviceSchema = {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: `${categoryData.name} Services in Boerne, TX`,
    description: categoryData.description,
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
    serviceType: categoryData.subcategories,
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
      <CategoryPageClient category={category} />
    </>
  );
}
