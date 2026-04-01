import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getTopLevelCategory, getSubcategory, topLevelCategories, type MembershipTier } from '@/data/serviceCategories';
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

  // Generate SEO-optimized title (max 60 chars) and description (max 155 chars)
  const title = generateProviderTitle(provider.name, subcategory.name);
  const description = generateProviderDescription(
    provider.name,
    provider.description,
    provider.rating,
    provider.reviewCount
  );
  const keywords = generateProviderKeywords(
    provider.name,
    subcategory.name,
    provider.services,
    provider.serviceArea
  );
  const canonicalUrl = `https://boerneshandyhub.com/services/${category}/${slug}/${providerId}`;

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
  const { category, slug, providerId } = await params;
  const topCategory = getTopLevelCategory(category);
  const subcategory = getSubcategory(category, slug);
  const provider = getProvider(slug, providerId);

  if (!provider || !topCategory || !subcategory) {
    notFound();
  }

  // Get related providers server-side to avoid shipping full JSON to client
  const relatedProviders = serviceProvidersData.providers
    .filter(p => p.category === slug && p.id !== providerId)
    .slice(0, 3)
    .map(p => ({
      id: p.id,
      name: p.name,
      yearsInBusiness: (p as unknown as ServiceProvider).yearsInBusiness
    }));

  const canonicalUrl = `https://boerneshandyhub.com/services/${category}/${slug}/${providerId}`;

  // Generate BreadcrumbList schema using utility
  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: 'Home', url: 'https://boerneshandyhub.com' },
    { name: 'Services', url: 'https://boerneshandyhub.com/services' },
    { name: topCategory.name, url: `https://boerneshandyhub.com/services/${category}` },
    { name: subcategory.name, url: `https://boerneshandyhub.com/services/${category}/${slug}` },
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
        topCategorySlug={category}
        subcategorySlug={slug}
        providerId={providerId}
        provider={provider}
        relatedProviders={relatedProviders}
      />
    </>
  );
}
