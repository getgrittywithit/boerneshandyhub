import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import { createClient } from '@supabase/supabase-js';
import ClassicTemplate from '@/templates/classic';
import ModernTemplate from '@/templates/modern';
import FriendlyTemplate from '@/templates/friendly';
import BoldTemplate from '@/templates/bold';
import type { Website, WebsitePhoto } from '@/lib/websites/types';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

interface PageProps {
  params: Promise<{ slug: string }>;
}

async function getWebsite(slug: string): Promise<Website | null> {
  const supabase = createClient(supabaseUrl, supabaseAnonKey);

  const { data: website, error } = await supabase
    .from('websites')
    .select(`
      *,
      business:businesses(
        id,
        name,
        phone,
        email,
        address,
        city,
        state,
        zip
      )
    `)
    .eq('slug', slug)
    .eq('status', 'live')
    .single();

  if (error || !website) {
    return null;
  }

  // Fetch photos separately
  let heroPhoto: WebsitePhoto | null = null;
  let logoPhoto: WebsitePhoto | null = null;
  let galleryPhotos: WebsitePhoto[] = [];

  if (website.hero_photo_id) {
    const { data } = await supabase
      .from('website_photos')
      .select('*')
      .eq('id', website.hero_photo_id)
      .single();
    heroPhoto = data;
  }

  if (website.logo_photo_id) {
    const { data } = await supabase
      .from('website_photos')
      .select('*')
      .eq('id', website.logo_photo_id)
      .single();
    logoPhoto = data;
  }

  if (website.gallery_photo_ids && website.gallery_photo_ids.length > 0) {
    const { data } = await supabase
      .from('website_photos')
      .select('*')
      .in('id', website.gallery_photo_ids);
    galleryPhotos = data || [];
  }

  return {
    ...website,
    hero_photo: heroPhoto,
    logo_photo: logoPhoto,
    gallery_photos: galleryPhotos,
  } as Website;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const website = await getWebsite(slug);

  if (!website) {
    return {
      title: 'Site Not Found',
    };
  }

  const businessName = website.business?.name || 'Business';
  const city = website.business?.city || 'Boerne';

  return {
    title: `${businessName} | ${city}, TX | Boerne's Handy Hub`,
    description: website.tagline || website.about_text?.slice(0, 160) || `${businessName} - Verified local business in ${city}, Texas.`,
    openGraph: {
      title: businessName,
      description: website.tagline || `${businessName} - Verified local business in ${city}, Texas.`,
      type: 'website',
      locale: 'en_US',
    },
  };
}

export default async function SitePage({ params }: PageProps) {
  const { slug } = await params;
  const website = await getWebsite(slug);

  if (!website) {
    notFound();
  }

  // Render the appropriate template based on website configuration
  switch (website.template) {
    case 'modern':
      return <ModernTemplate website={website} />;
    case 'friendly':
      return <FriendlyTemplate website={website} />;
    case 'bold':
      return <BoldTemplate website={website} />;
    case 'classic':
    case 'handyman': // Legacy
    default:
      return <ClassicTemplate website={website} />;
  }
}

// Generate static params for all live websites (for static generation)
export async function generateStaticParams() {
  const supabase = createClient(supabaseUrl, supabaseAnonKey);

  const { data: websites } = await supabase
    .from('websites')
    .select('slug')
    .eq('status', 'live');

  return (websites || []).map((website) => ({
    slug: website.slug,
  }));
}
