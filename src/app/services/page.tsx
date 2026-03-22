import type { Metadata } from 'next';
import { topLevelCategories, getAllSubcategories } from '@/data/serviceCategories';
import ServicesPageClient from './ServicesPageClient';

const allSubcategories = getAllSubcategories();

export const metadata: Metadata = {
  title: 'Find Local Services in Boerne, TX | Home, Auto, Outdoor, Commercial & More',
  description: `Browse ${allSubcategories.length} service types across ${topLevelCategories.length} categories. Connect with trusted local professionals in Boerne, Texas - plumbers, mechanics, landscapers, contractors, and more.`,
  keywords: [
    'Boerne services',
    'local services Boerne TX',
    'home services Boerne',
    'auto services Boerne',
    'outdoor services Boerne',
    'commercial services Boerne',
    'contractors Boerne',
    'plumbers Boerne',
    'electricians Boerne',
    'HVAC Boerne',
    'mechanics Boerne',
    'landscaping Boerne',
    'Hill Country services',
    'Kendall County services',
  ],
  openGraph: {
    title: "Find Local Services in Boerne, TX | Boerne's Handy Hub",
    description: `Browse ${allSubcategories.length} service types and connect with trusted local professionals in Boerne, Texas.`,
    type: 'website',
    locale: 'en_US',
    url: 'https://boerneshandyhub.com/services',
  },
  twitter: {
    card: 'summary_large_image',
    title: "Find Local Services in Boerne, TX | Boerne's Handy Hub",
    description: `Browse ${allSubcategories.length} service types and connect with trusted local professionals in Boerne, Texas.`,
  },
  alternates: {
    canonical: '/services',
  },
};

export default function ServicesPage() {
  // ItemList JSON-LD Schema for top-level categories
  const itemListSchema = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: 'Service Categories in Boerne, TX',
    description: 'Find local service providers in Boerne, Texas across home, auto, outdoor, commercial, and specialty service categories.',
    numberOfItems: topLevelCategories.length,
    itemListElement: topLevelCategories.map((category, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: category.name,
      url: `https://boerneshandyhub.com/services/${category.slug}`,
      description: category.description,
    })),
  };

  // Organization schema for Boerne's Handy Hub
  const organizationSchema = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: "Boerne's Handy Hub",
    url: 'https://boerneshandyhub.com',
    description: 'Local service directory connecting Boerne, Texas residents with trusted home, auto, outdoor, commercial, and specialty service providers.',
    areaServed: {
      '@type': 'City',
      name: 'Boerne',
      addressRegion: 'TX',
      addressCountry: 'US',
    },
    knowsAbout: topLevelCategories.map(c => c.name + ' Services'),
  };

  // BreadcrumbList schema
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
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <ServicesPageClient />
    </>
  );
}
