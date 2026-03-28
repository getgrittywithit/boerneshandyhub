import type { MetadataRoute } from 'next';
import { topLevelCategories } from '@/data/serviceCategories';
import serviceProvidersData from '@/data/serviceProviders.json';
import { getAllGuideSlugs } from '@/data/guides';

const BASE_URL = 'https://boerneshandyhub.com';

export default function sitemap(): MetadataRoute.Sitemap {
  const currentDate = new Date().toISOString();

  // Static pages
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: BASE_URL,
      lastModified: currentDate,
      changeFrequency: 'weekly',
      priority: 1.0,
    },
    {
      url: `${BASE_URL}/about`,
      lastModified: currentDate,
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${BASE_URL}/services`,
      lastModified: currentDate,
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: `${BASE_URL}/business/onboard`,
      lastModified: currentDate,
      changeFrequency: 'monthly',
      priority: 0.7,
    },
  ];

  // Aggregate pages (5 new SEO pages)
  const aggregatePages: MetadataRoute.Sitemap = [
    {
      url: `${BASE_URL}/emergency-services`,
      lastModified: currentDate,
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${BASE_URL}/licensed-contractors`,
      lastModified: currentDate,
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${BASE_URL}/top-rated`,
      lastModified: currentDate,
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${BASE_URL}/new-homeowner`,
      lastModified: currentDate,
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${BASE_URL}/senior-services`,
      lastModified: currentDate,
      changeFrequency: 'monthly',
      priority: 0.7,
    },
  ];

  // Top-level category pages (home, auto, outdoor, commercial, specialty)
  const categoryPages: MetadataRoute.Sitemap = topLevelCategories.map((category) => ({
    url: `${BASE_URL}/services/${category.slug}`,
    lastModified: currentDate,
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  }));

  // Subcategory listing pages (e.g., /services/home/plumbing)
  const subcategoryListingPages: MetadataRoute.Sitemap = topLevelCategories.flatMap((topCat) =>
    topCat.subcategories.map((sub) => ({
      url: `${BASE_URL}/services/${topCat.slug}/${sub.slug}`,
      lastModified: currentDate,
      changeFrequency: 'weekly' as const,
      priority: 0.75,
    }))
  );


  // Guide pages (8 new SEO pages)
  const guidePages: MetadataRoute.Sitemap = getAllGuideSlugs().map((slug) => ({
    url: `${BASE_URL}/guides/${slug}`,
    lastModified: currentDate,
    changeFrequency: 'monthly' as const,
    priority: 0.6,
  }));

  // Provider pages
  const providerPages: MetadataRoute.Sitemap = serviceProvidersData.providers.map((provider) => ({
    url: `${BASE_URL}/services/${provider.category}/${provider.id}`,
    lastModified: provider.updatedAt || currentDate,
    changeFrequency: 'weekly' as const,
    priority: 0.7,
  }));

  return [
    ...staticPages,
    ...aggregatePages,
    ...categoryPages,
    ...subcategoryListingPages,
    ...guidePages,
    ...providerPages,
  ];
}
