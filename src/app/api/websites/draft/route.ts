import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

// GET - Fetch existing draft for a business
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const businessId = searchParams.get('business_id');

  if (!businessId) {
    return NextResponse.json({ error: 'Missing business_id' }, { status: 400 });
  }

  try {
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    const { data: website, error } = await supabase
      .from('websites')
      .select('*')
      .eq('business_id', businessId)
      .in('status', ['draft', 'changes_requested'])
      .single();

    if (error && error.code !== 'PGRST116') {
      console.error('Error fetching draft:', error);
      return NextResponse.json({ error: 'Failed to fetch draft' }, { status: 500 });
    }

    return NextResponse.json(website || null);
  } catch (error) {
    console.error('Error fetching draft:', error);
    return NextResponse.json({ error: 'Failed to fetch draft' }, { status: 500 });
  }
}

// POST - Save draft website
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      business_id,
      website_id,
      template,
      primary_color,
      accent_color,
      tagline,
      about_text,
      services,
      license_number,
      insurance_carrier,
      years_in_business,
      hours,
      emergency_available,
      service_area,
      testimonials,
    } = body;

    if (!business_id) {
      return NextResponse.json({ error: 'Missing business_id' }, { status: 400 });
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Get business name for slug generation
    const { data: business } = await supabase
      .from('businesses')
      .select('name')
      .eq('id', business_id)
      .single();

    if (!business) {
      return NextResponse.json({ error: 'Business not found' }, { status: 404 });
    }

    const websiteData = {
      template: template || 'handyman',
      primary_color: primary_color || '#1e3a5f',
      accent_color: accent_color || '#d4a853',
      tagline: tagline || null,
      about_text: about_text || null,
      services: services || [],
      license_number: license_number || null,
      insurance_carrier: insurance_carrier || null,
      years_in_business: years_in_business || null,
      hours: hours || {},
      emergency_available: emergency_available || false,
      service_area: service_area || {},
      testimonials: testimonials || [],
      updated_at: new Date().toISOString(),
    };

    let result;

    if (website_id) {
      // Update existing draft
      const { data, error } = await supabase
        .from('websites')
        .update(websiteData)
        .eq('id', website_id)
        .eq('business_id', business_id)
        .select()
        .single();

      if (error) {
        console.error('Error updating draft:', error);
        return NextResponse.json({ error: 'Failed to update draft' }, { status: 500 });
      }
      result = data;
    } else {
      // Check if website already exists for this business
      const { data: existing } = await supabase
        .from('websites')
        .select('id')
        .eq('business_id', business_id)
        .single();

      if (existing) {
        // Update existing
        const { data, error } = await supabase
          .from('websites')
          .update(websiteData)
          .eq('id', existing.id)
          .select()
          .single();

        if (error) {
          console.error('Error updating existing website:', error);
          return NextResponse.json({ error: 'Failed to update website' }, { status: 500 });
        }
        result = data;
      } else {
        // Generate unique slug
        const { data: slugData } = await supabase
          .rpc('generate_website_slug', { business_name: business.name });

        // Create new draft
        const { data, error } = await supabase
          .from('websites')
          .insert({
            business_id,
            slug: slugData || business.name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
            status: 'draft',
            ...websiteData,
          })
          .select()
          .single();

        if (error) {
          console.error('Error creating draft:', error);
          return NextResponse.json({ error: 'Failed to create draft' }, { status: 500 });
        }
        result = data;
      }
    }

    return NextResponse.json(result);
  } catch (error) {
    console.error('Error saving draft:', error);
    return NextResponse.json({ error: 'Failed to save draft' }, { status: 500 });
  }
}
