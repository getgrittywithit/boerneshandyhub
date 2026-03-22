import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getTopLevelCategory, getSubcategory, topLevelCategories, type MembershipTier } from '@/data/serviceCategories';
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
  params: Promise<{ category: string; slug: string; providerId: string }>;
}

export async function generateStaticParams() {
  const params: { category: string; slug: string; providerId: string }[] = [];

  for (const topCat of topLevelCategories) {
    for (const sub of topCat.subcategories) {
      // Find providers matching this subcategory slug
      const matchingProviders = serviceProvidersData.providers.filter(
        p => p.category === sub.slug
      );
      for (const provider of matchingProviders) {
        params.push({
          category: topCat.slug,
          slug: sub.slug,
          providerId: provider.id,
        });
      }
    }
  }

  return params;
}

function getProvider(subcategorySlug: string, providerId: string): ServiceProvider | undefined {
  return serviceProvidersData.providers.find(
    (p) => p.id === providerId && p.category === subcategorySlug
  ) as ServiceProvider | undefined;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { category, slug, providerId } = await params;
  const topCategory = getTopLevelCategory(category);
  const subcategory = getSubcategory(category, slug);
  const provider = getProvider(slug, providerId);

  if (!provider || !topCategory || !subcategory) {
    return {
      title: 'Provider Not Found',
    };
  }

  const title = `${provider.name} | ${subcategory.name} in Boerne, TX`;
  const description = `${provider.name} - ${provider.description.slice(0, 150)}... Rated ${provider.rating}/5 with ${provider.reviewCount} reviews. Serving ${provider.serviceArea.join(', ')}.`;

  return {
    title,
    description,
    keywords: [
      provider.name,
      `${subcategory.name} Boerne`,
      `${topCategory.name} Boerne`,
      ...provider.keywords,
      'Boerne Texas',
      'Hill Country',
    ],
    openGraph: {
      title,
      description,
      type: 'website',
      locale: 'en_US',
      url: `https://boerneshandyhub.com/services/${category}/${slug}/${providerId}`,
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
    },
    alternates: {
      canonical: `/services/${category}/${slug}/${providerId}`,
    },
  };
}

export default async function ProviderDetailPage({ params }: PageProps) {
  const { category, slug, providerId } = await params;
  const topCategory = getTopLevelCategory(category);
  const subcategory = getSubcategory(category, slug);
  const provider = getProvider(slug, providerId);

  if (!provider || !topCategory || !subcategory) {
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
      {
        '@type': 'ListItem',
        position: 5,
        name: provider.name,
        item: `https://boerneshandyhub.com/services/${category}/${slug}/${providerId}`,
      },
    ],
  };

  // Parse address for structured data
  const addressParts = provider.address.split(', ');
  const streetAddress = addressParts[0] || provider.address;
  const city = addressParts[1] || 'Boerne';
  const stateZip = addressParts[2] || 'TX 78006';
  const [state, postalCode] = stateZip.split(' ');

  // LocalBusiness JSON-LD Schema
  const localBusinessSchema: Record<string, unknown> = {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    '@id': `https://boerneshandyhub.com/services/${category}/${slug}/${providerId}#business`,
    name: provider.name,
    description: provider.description,
    url: `https://boerneshandyhub.com/services/${category}/${slug}/${providerId}`,
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
      itemListElement: provider.services.map((service) => ({
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
        topCategorySlug={category}
        subcategorySlug={slug}
        providerId={providerId}
        provider={provider}
      />
    </>
  );
}
