import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getTopLevelCategory, topLevelCategories } from '@/data/serviceCategories';
import CategoryPageClient from './CategoryPageClient';

interface PageProps {
  params: Promise<{ category: string }>;
}

export async function generateStaticParams() {
  return topLevelCategories.map((category) => ({
    category: category.slug,
  }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { category } = await params;
  const categoryData = getTopLevelCategory(category);

  if (!categoryData) {
    return {
      title: 'Category Not Found',
    };
  }

  const subcategoryNames = categoryData.subcategories.map(s => s.name).slice(0, 5).join(', ');
  const title = `${categoryData.name} Services in Boerne TX | ${subcategoryNames} & More`;
  const description = `Browse ${categoryData.subcategories.length} ${categoryData.name.toLowerCase()} services in Boerne, Texas. ${categoryData.description} Find trusted local professionals.`;

  return {
    title,
    description,
    keywords: [
      `${categoryData.name} services Boerne`,
      `${categoryData.name} Boerne TX`,
      ...categoryData.subcategories.map((sub) => `${sub.name} Boerne`),
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

export default async function TopCategoryPage({ params }: PageProps) {
  const { category } = await params;
  const categoryData = getTopLevelCategory(category);

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

  // ItemList schema for subcategories
  const itemListSchema = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: `${categoryData.name} Services in Boerne, TX`,
    description: categoryData.description,
    numberOfItems: categoryData.subcategories.length,
    itemListElement: categoryData.subcategories.map((sub, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: sub.name,
      url: `https://boerneshandyhub.com/services/${category}/${sub.slug}`,
      description: sub.description,
    })),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListSchema) }}
      />
      <CategoryPageClient categorySlug={category} />
    </>
  );
}
