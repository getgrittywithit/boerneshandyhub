import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';
import OpenAI from 'openai';
import { topLevelCategories } from '@/data/serviceCategories';
import { getTierBoost } from '@/lib/search/tierBoost';
import type { SearchSource } from '@/lib/search/types';

const EMBEDDING_MODEL = 'text-embedding-3-small';
const BATCH_SIZE = 50;

// Initialize OpenAI client
const openai = process.env.OPENAI_API_KEY
  ? new OpenAI({ apiKey: process.env.OPENAI_API_KEY })
  : null;

interface SearchDocumentInsert {
  source_type: SearchSource;
  source_id: string;
  title: string;
  subtitle: string | null;
  description: string | null;
  url: string;
  keywords: string[];
  tier: string | null;
  boost: number;
  category_slug: string | null;
  subcategory_slug: string | null;
  embedding: number[] | null;
  is_active: boolean;
}

// Generate embeddings for a batch of texts
async function generateEmbeddings(texts: string[]): Promise<(number[] | null)[]> {
  if (!openai || texts.length === 0) {
    return texts.map(() => null);
  }

  try {
    const response = await openai.embeddings.create({
      model: EMBEDDING_MODEL,
      input: texts,
    });
    return response.data.map((d) => d.embedding);
  } catch (error) {
    console.error('Failed to generate embeddings:', error);
    return texts.map(() => null);
  }
}

// Create searchable text for embedding
function createSearchableText(doc: {
  title: string;
  subtitle?: string | null;
  description?: string | null;
  keywords?: string[];
}): string {
  const parts = [doc.title];
  if (doc.subtitle) parts.push(doc.subtitle);
  if (doc.description) parts.push(doc.description);
  if (doc.keywords?.length) parts.push(doc.keywords.join(' '));
  return parts.join(' ').slice(0, 8000); // OpenAI limit
}

export async function POST(request: NextRequest) {
  try {
    // Verify admin authentication
    const authHeader = request.headers.get('authorization');
    if (!authHeader?.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    if (!supabaseAdmin) {
      return NextResponse.json({ error: 'Database not available' }, { status: 500 });
    }

    const startTime = Date.now();
    const documents: SearchDocumentInsert[] = [];
    const stats = { businesses: 0, categories: 0, realtors: 0, pages: 0, errors: 0 };

    // 1. Index businesses
    console.log('Indexing businesses...');
    const { data: businesses, error: businessError } = await supabaseAdmin
      .from('businesses')
      .select('id, name, description, category, subcategory, membership_tier, keywords');

    if (businessError) {
      console.error('Business fetch error:', businessError);
      stats.errors++;
    } else if (businesses) {
      for (const business of businesses) {
        const categorySlug = business.category?.toLowerCase().replace(/\s+/g, '-') || null;
        documents.push({
          source_type: 'business',
          source_id: business.id,
          title: business.name,
          subtitle: business.category || null,
          description: business.description || null,
          url: `/services/${categorySlug || 'all'}/${business.subcategory || 'all'}/${business.id}`,
          keywords: business.keywords || [],
          tier: business.membership_tier,
          boost: getTierBoost(business.membership_tier),
          category_slug: categorySlug,
          subcategory_slug: business.subcategory || null,
          embedding: null,
          is_active: true,
        });
        stats.businesses++;
      }
    }

    // 2. Index categories from static data
    console.log('Indexing categories...');
    for (const topLevel of topLevelCategories) {
      // Index top-level category
      documents.push({
        source_type: 'category',
        source_id: `category-${topLevel.slug}`,
        title: topLevel.name,
        subtitle: `${topLevel.subcategories.length} services`,
        description: topLevel.description || null,
        url: `/services/${topLevel.slug}`,
        keywords: [],
        tier: null,
        boost: 1.2, // Boost categories slightly
        category_slug: topLevel.slug,
        subcategory_slug: null,
        embedding: null,
        is_active: true,
      });
      stats.categories++;

      // Index subcategories
      for (const sub of topLevel.subcategories) {
        documents.push({
          source_type: 'category',
          source_id: `subcategory-${topLevel.slug}-${sub.slug}`,
          title: sub.name,
          subtitle: topLevel.name,
          description: sub.description || null,
          url: `/services/${topLevel.slug}/${sub.slug}`,
          keywords: sub.keywords || [],
          tier: null,
          boost: 1.1,
          category_slug: topLevel.slug,
          subcategory_slug: sub.slug,
          embedding: null,
          is_active: true,
        });
        stats.categories++;
      }
    }

    // 3. Index realtors
    console.log('Indexing realtors...');
    const { data: realtors, error: realtorError } = await supabaseAdmin
      .from('realtor_profiles')
      .select('id, name, company, tagline, bio');

    if (realtorError) {
      console.error('Realtor fetch error:', realtorError);
      stats.errors++;
    } else if (realtors) {
      for (const realtor of realtors) {
        documents.push({
          source_type: 'realtor',
          source_id: realtor.id,
          title: realtor.name,
          subtitle: realtor.company || null,
          description: realtor.tagline || realtor.bio || null,
          url: `/realtors/directory/${realtor.id}`,
          keywords: ['realtor', 'real estate', 'agent', 'home buying', 'Boerne'],
          tier: null,
          boost: 1.0,
          category_slug: null,
          subcategory_slug: null,
          embedding: null,
          is_active: true,
        });
        stats.realtors++;
      }
    }

    // 4. Index static pages
    console.log('Indexing static pages...');
    const staticPages = [
      { id: 'home', title: 'Home', description: 'BoernesHandyHub - Your trusted resource for local services in Boerne, Texas', url: '/' },
      { id: 'about', title: 'About BoernesHandyHub', description: 'Learn about our mission to connect Boerne residents with trusted local service providers', url: '/about' },
      { id: 'moving', title: 'Moving to Boerne', description: 'Complete guide for newcomers moving to Boerne, Texas - neighborhoods, schools, and local tips', url: '/moving-to-boerne' },
      { id: 'weather', title: 'Boerne Weather', description: 'Current weather conditions and forecasts for Boerne, Texas Hill Country', url: '/weather' },
      { id: 'events', title: 'Boerne Events', description: 'Local events, festivals, and community happenings in Boerne, Texas', url: '/events' },
      { id: 'dining', title: 'Boerne Dining', description: 'Best restaurants and dining options in Boerne, Texas', url: '/dining' },
      { id: 'business', title: 'Get Listed', description: 'Add your business to BoernesHandyHub directory', url: '/business' },
      { id: 'realtors', title: 'For Realtors', description: 'Realtor partner program for Boerne real estate agents', url: '/realtors' },
    ];

    for (const page of staticPages) {
      documents.push({
        source_type: 'page',
        source_id: `page-${page.id}`,
        title: page.title,
        subtitle: null,
        description: page.description,
        url: page.url,
        keywords: [],
        tier: null,
        boost: 0.8, // Lower priority than businesses/categories
        category_slug: null,
        subcategory_slug: null,
        embedding: null,
        is_active: true,
      });
      stats.pages++;
    }

    // Generate embeddings in batches
    console.log(`Generating embeddings for ${documents.length} documents...`);
    for (let i = 0; i < documents.length; i += BATCH_SIZE) {
      const batch = documents.slice(i, i + BATCH_SIZE);
      const texts = batch.map((doc) => createSearchableText(doc));
      const embeddings = await generateEmbeddings(texts);

      for (let j = 0; j < batch.length; j++) {
        batch[j].embedding = embeddings[j];
      }

      console.log(`Processed ${Math.min(i + BATCH_SIZE, documents.length)}/${documents.length} documents`);
    }

    // Clear existing documents and insert new ones
    console.log('Upserting documents...');
    const { error: deleteError } = await supabaseAdmin
      .from('search_documents')
      .delete()
      .neq('id', '00000000-0000-0000-0000-000000000000'); // Delete all

    if (deleteError) {
      console.error('Delete error:', deleteError);
    }

    // Insert in batches
    for (let i = 0; i < documents.length; i += BATCH_SIZE) {
      const batch = documents.slice(i, i + BATCH_SIZE);
      const { error: insertError } = await supabaseAdmin
        .from('search_documents')
        .insert(batch);

      if (insertError) {
        console.error('Insert error:', insertError);
        stats.errors++;
      }
    }

    const duration = Date.now() - startTime;
    console.log(`Sync completed in ${duration}ms`, stats);

    return NextResponse.json({
      success: true,
      stats,
      total: documents.length,
      took_ms: duration,
    });
  } catch (error) {
    console.error('Sync error:', error);
    return NextResponse.json({ error: 'Sync failed' }, { status: 500 });
  }
}
