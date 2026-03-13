import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getServiceCategory, serviceCategories, type MembershipTier } from '@/data/serviceCategories';
import serviceProvidersData from '@/data/serviceProviders.json';
import ProviderPageClient from './ProviderPageClient';

interface ServiceProvider {
  id: string;
  name: string;
  category: string;
  subcategories: string[];
  description: string;
  address: string;
  phone: string;
  email: string;
  website?: string;
  rating: number;
  reviewCount: number;
  membershipTier: MembershipTier;
  claimStatus: 'unclaimed' | 'pending' | 'verified';
  yearsInBusiness?: number;
  licensed: boolean;
  insured: boolean;
  services: string[];
  serviceArea: string[];
  photos: string[];
  bernieRecommendation?: string;
  specialOffers?: string[];
  keywords: string[];
  coordinates?: { lat: number; lng: number };
  createdAt: string;
  updatedAt: string;
}

interface PageProps {
  params: Promise<{ category: string; providerId: string }>;
}

export async function generateStaticParams() {
  return serviceProvidersData.providers.map((provider) => ({
    category: provider.category,
    providerId: provider.id,
  }));
}

function getProvider(category: string, providerId: string): ServiceProvider | undefined {
  return serviceProvidersData.providers.find(
    (p) => p.id === providerId && p.category === category
  ) as ServiceProvider | undefined;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { category, providerId } = await params;
  const provider = getProvider(category, providerId);
  const categoryData = getServiceCategory(category);

  if (!provider || !categoryData) {
    return {
      title: 'Provider Not Found',
    };
  }

  const title = `${provider.name} | ${categoryData.name} in Boerne, TX`;
  const description = `${provider.name} - ${provider.description.slice(0, 150)}... Rated ${provider.rating}/5 with ${provider.reviewCount} reviews. Serving ${provider.serviceArea.join(', ')}.`;

  return {
    title,
    description,
    keywords: [
      provider.name,
      `${categoryData.name} Boerne`,
      ...provider.subcategories,
      ...provider.keywords,
      'Boerne Texas',
      'Hill Country',
    ],
    openGraph: {
      title,
      description,
      type: 'website',
      locale: 'en_US',
      url: `https://boerneshandyhub.com/services/${category}/${providerId}`,
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
    },
    alternates: {
      canonical: `/services/${category}/${providerId}`,
    },
  };
}

export default async function ProviderDetailPage({ params }: PageProps) {
  const { category, providerId } = await params;
  const provider = getProvider(category, providerId);
  const categoryData = getServiceCategory(category);

  if (!provider || !categoryData) {
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
      {
        '@type': 'ListItem',
        position: 4,
        name: provider.name,
        item: `https://boerneshandyhub.com/services/${category}/${providerId}`,
      },
    ],
  };

  // Parse address for structured data
  const addressParts = provider.address.split(', ');
  const streetAddress = addressParts[0] || provider.address;
  const cityStateZip = addressParts.slice(1).join(', ');
  const city = addressParts[1] || 'Boerne';
  const stateZip = addressParts[2] || 'TX 78006';
  const [state, postalCode] = stateZip.split(' ');

  // LocalBusiness JSON-LD Schema
  const localBusinessSchema: Record<string, unknown> = {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    '@id': `https://boerneshandyhub.com/services/${category}/${providerId}#business`,
    name: provider.name,
    description: provider.description,
    url: `https://boerneshandyhub.com/services/${category}/${providerId}`,
    telephone: provider.phone,
    email: provider.email,
    address: {
      '@type': 'PostalAddress',
      streetAddress: streetAddress,
      addressLocality: city,
      addressRegion: state || 'TX',
      postalCode: postalCode || '78006',
      addressCountry: 'US',
    },
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: provider.rating,
      reviewCount: provider.reviewCount,
      bestRating: 5,
      worstRating: 1,
    },
    areaServed: provider.serviceArea.map((area) => ({
      '@type': 'City',
      name: area,
      addressRegion: 'TX',
      addressCountry: 'US',
    })),
    knowsAbout: provider.services,
    hasOfferCatalog: {
      '@type': 'OfferCatalog',
      name: `${provider.name} Services`,
      itemListElement: provider.services.map((service, index) => ({
        '@type': 'Offer',
        itemOffered: {
          '@type': 'Service',
          name: service,
        },
      })),
    },
  };

  // Add geo coordinates if available
  if (provider.coordinates) {
    localBusinessSchema.geo = {
      '@type': 'GeoCoordinates',
      latitude: provider.coordinates.lat,
      longitude: provider.coordinates.lng,
    };
  }

  // Add website if available
  if (provider.website) {
    localBusinessSchema.sameAs = [provider.website];
  }

  // Add founding year if years in business is available
  if (provider.yearsInBusiness) {
    const currentYear = new Date().getFullYear();
    localBusinessSchema.foundingDate = String(currentYear - provider.yearsInBusiness);
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessSchema) }}
      />
      <ProviderPageClient
        category={category}
        providerId={providerId}
        provider={provider}
      />
    </>
  );
}
