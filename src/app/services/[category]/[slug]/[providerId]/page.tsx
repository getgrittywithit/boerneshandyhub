import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getTopLevelCategory, getSubcategory, topLevelCategories, type MembershipTier } from '@/data/serviceCategories';
import { createClient } from '@supabase/supabase-js';
import ProviderPageClient from './ProviderPageClient';
import { generateLocalBusinessSchema, generateBreadcrumbSchema } from '@/utils/schema';
import { generateProviderTitle, generateProviderDescription, generateProviderKeywords } from '@/utils/metadata';

// Create a Supabase client for server-side fetching
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseAnonKey);

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

  // Fetch all businesses from Supabase
  const { data: businesses } = await supabase
    .from('businesses')
    .select('slug, category, parent_category');

  if (businesses) {
    for (const business of businesses) {
      if (business.slug && business.category && business.parent_category) {
        params.push({
          category: business.parent_category,
          slug: business.category,
          providerId: business.slug,
        });
      }
    }
  }

  return params;
}

async function getProvider(subcategorySlug: string, providerId: string): Promise<ServiceProvider | undefined> {
  const { data: business } = await supabase
    .from('businesses')
    .select('*')
    .eq('category', subcategorySlug)
    .eq('slug', providerId)
    .single();

  if (!business) return undefined;

  return {
    id: business.slug || business.id,
    name: business.name,
    category: business.category,
    subcategories: business.subcategory ? [business.subcategory] : [],
    description: business.description || '',
    address: business.address || 'Boerne, TX',
    phone: business.phone || '',
    email: business.email || '',
    website: business.website || undefined,
    rating: business.rating || 0,
    reviewCount: business.review_count || 0,
    membershipTier: (business.membership_tier || 'basic') as MembershipTier,
    claimStatus: (business.claim_status || 'unclaimed') as 'unclaimed' | 'pending' | 'verified',
    yearsInBusiness: undefined,
    licensed: business.licensed ?? true,
    insured: business.insured ?? true,
    services: business.services || [],
    serviceArea: Array.isArray(business.service_area) ? business.service_area : ['Boerne'],
    photos: business.photos || [],
    bernieRecommendation: undefined,
    specialOffers: business.special_offers || undefined,
    keywords: business.keywords || [],
    coordinates: undefined,
    createdAt: business.created_at || new Date().toISOString(),
    updatedAt: business.updated_at || new Date().toISOString(),
  };
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { category, slug, providerId } = await params;
  const topCategory = getTopLevelCategory(category);
  const subcategory = getSubcategory(category, slug);
  const provider = await getProvider(slug, providerId);

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
  const provider = await getProvider(slug, providerId);

  if (!provider || !topCategory || !subcategory) {
    notFound();
  }

  // Get related providers from Supabase
  const { data: relatedBusinesses } = await supabase
    .from('businesses')
    .select('slug, name')
    .eq('category', slug)
    .neq('slug', providerId)
    .limit(3);

  const relatedProviders = (relatedBusinesses || []).map(p => ({
    id: p.slug,
    name: p.name,
    yearsInBusiness: undefined
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
