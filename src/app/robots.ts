import type { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/admin/', '/api/', '/business/onboard', '/_next/'],
      },
    ],
    sitemap: 'https://boerneshandyhub.com/sitemap.xml',
  };
}
