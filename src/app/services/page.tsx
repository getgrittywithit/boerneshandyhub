import type { Metadata } from 'next';
import { serviceCategories, serviceBuckets } from '@/data/serviceCategories';
import serviceProvidersData from '@/data/serviceProviders.json';
import ServicesPageClient from './ServicesPageClient';

export const metadata: Metadata = {
  title: 'Find Local Services in Boerne, TX | Home, Auto, Business & Pet Services',
  description: `Browse ${serviceCategories.length}+ service categories and connect with ${serviceProvidersData.providers.length}+ trusted local professionals in Boerne, Texas. Licensed plumbers, electricians, HVAC technicians, contractors, auto mechanics, and more.`,
  keywords: [
    'Boerne services',
    'local services Boerne TX',
    'home services Boerne',
    'auto services Boerne',
    'business services Boerne',
    'pet services Boerne',
    'contractors Boerne',
    'plumbers Boerne',
    'electricians Boerne',
    'HVAC Boerne',
    'Hill Country services',
    'Kendall County services',
  ],
  openGraph: {
    title: 'Find Local Services in Boerne, TX | Boerne Handy Hub',
    description: `Browse ${serviceCategories.length}+ service categories and connect with trusted local professionals in Boerne, Texas.`,
    type: 'website',
    locale: 'en_US',
    url: 'https://boerneshandyhub.com/services',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Find Local Services in Boerne, TX | Boerne Handy Hub',
    description: `Browse ${serviceCategories.length}+ service categories and connect with trusted local professionals in Boerne, Texas.`,
  },
  alternates: {
    canonical: '/services',
  },
};

export default function ServicesPage() {
  // ItemList JSON-LD Schema for service categories
  const itemListSchema = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: 'Service Categories in Boerne, TX',
    description: 'Find local service providers in Boerne, Texas across home, auto, business, and pet service categories.',
    numberOfItems: serviceCategories.length,
    itemListElement: serviceCategories.map((category, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: category.name,
      url: `https://boerneshandyhub.com/services/${category.slug}`,
      description: category.description,
    })),
  };

  // Organization schema for Boerne Handy Hub
  const organizationSchema = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'Boerne Handy Hub',
    url: 'https://boerneshandyhub.com',
    description: 'Local service directory connecting Boerne, Texas residents with trusted home, auto, business, and pet service providers.',
    areaServed: {
      '@type': 'City',
      name: 'Boerne',
      addressRegion: 'TX',
      addressCountry: 'US',
    },
    knowsAbout: serviceBuckets.map(b => b.name + ' Services'),
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
