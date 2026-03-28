import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getServiceCategory, serviceCategories, type MembershipTier } from '@/data/serviceCategories';
import serviceProvidersData from '@/data/serviceProviders.json';
import ProviderPageClient from './ProviderPageClient';
import { generateLocalBusinessSchema, generateBreadcrumbSchema } from '@/utils/schema';
import { generateProviderTitle, generateProviderDescription, generateProviderKeywords } from '@/utils/metadata';

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

  // Generate SEO-optimized title (max 60 chars) and description (max 155 chars)
  const title = generateProviderTitle(provider.name, categoryData.name);
  const description = generateProviderDescription(
    provider.name,
    provider.description,
    provider.rating,
    provider.reviewCount
  );
  const keywords = generateProviderKeywords(
    provider.name,
    categoryData.name,
    provider.services,
    provider.serviceArea
  );
  const canonicalUrl = `https://boerneshandyhub.com/services/${category}/${providerId}`;

  return {
    title,
    description,
    keywords,
    openGraph: {
      title,
      description,
      type: 'website',
      locale: 'en_US',
      url: canonicalUrl,
      images: provider.photos?.[0] ? [{ url: provider.photos[0] }] : undefined,
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
    },
    alternates: {
      canonical: canonicalUrl,
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

  const canonicalUrl = `https://boerneshandyhub.com/services/${category}/${providerId}`;

  // Generate BreadcrumbList schema using utility
  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: 'Home', url: 'https://boerneshandyhub.com' },
    { name: 'Services', url: 'https://boerneshandyhub.com/services' },
    { name: categoryData.name, url: `https://boerneshandyhub.com/services/${category}` },
    { name: provider.name, url: canonicalUrl },
  ]);

  // Generate LocalBusiness schema using utility (includes proper @type, image, priceRange, openingHours)
  const localBusinessSchema = generateLocalBusinessSchema(
    {
      id: provider.id,
      name: provider.name,
      category: provider.category,
      description: provider.description,
      address: provider.address,
      phone: provider.phone,
      email: provider.email,
      website: provider.website,
      photos: provider.photos,
      rating: provider.rating,
      reviewCount: provider.reviewCount,
      services: provider.services,
      serviceArea: provider.serviceArea,
      yearsInBusiness: provider.yearsInBusiness,
      membershipTier: provider.membershipTier,
      licensed: provider.licensed,
      insured: provider.insured,
      coordinates: provider.coordinates,
    },
    canonicalUrl
  );

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
