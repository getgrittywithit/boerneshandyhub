import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

// POST - Submit website for review
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

    // Validate minimum requirements
    if (!about_text || about_text.length < 50) {
      return NextResponse.json(
        { error: 'About text must be at least 50 characters' },
        { status: 400 }
      );
    }

    if (!services || services.length === 0) {
      return NextResponse.json(
        { error: 'At least one service is required' },
        { status: 400 }
      );
    }

    // Get business info
    const { data: business } = await supabase
      .from('businesses')
      .select('name, membership_tier')
      .eq('id', business_id)
      .single();

    if (!business) {
      return NextResponse.json({ error: 'Business not found' }, { status: 404 });
    }

    // Check if business is eligible (Verified tier or higher)
    const eligibleTiers = ['verified', 'foundingpartner', 'founding_partner'];
    if (!eligibleTiers.includes(business.membership_tier?.toLowerCase() || '')) {
      return NextResponse.json(
        { error: 'Website feature requires Verified tier or higher' },
        { status: 403 }
      );
    }

    const websiteData = {
      template: template || 'handyman',
      primary_color: primary_color || '#1e3a5f',
      accent_color: accent_color || '#d4a853',
      tagline: tagline || null,
      about_text,
      services,
      license_number: license_number || null,
      insurance_carrier: insurance_carrier || null,
      years_in_business: years_in_business || null,
      hours: hours || {},
      emergency_available: emergency_available || false,
      service_area: service_area || {},
      testimonials: testimonials || [],
      status: 'pending_review',
      submitted_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    let result;

    if (website_id) {
      // Update existing website and submit for review
      const { data, error } = await supabase
        .from('websites')
        .update(websiteData)
        .eq('id', website_id)
        .eq('business_id', business_id)
        .select()
        .single();

      if (error) {
        console.error('Error submitting website:', error);
        return NextResponse.json({ error: 'Failed to submit website' }, { status: 500 });
      }
      result = data;
    } else {
      // Check for existing website
      const { data: existing } = await supabase
        .from('websites')
        .select('id')
        .eq('business_id', business_id)
        .single();

      if (existing) {
        // Update and submit existing
        const { data, error } = await supabase
          .from('websites')
          .update(websiteData)
          .eq('id', existing.id)
          .select()
          .single();

        if (error) {
          console.error('Error updating and submitting website:', error);
          return NextResponse.json({ error: 'Failed to submit website' }, { status: 500 });
        }
        result = data;
      } else {
        // Generate slug and create new
        const { data: slugData } = await supabase
          .rpc('generate_website_slug', { business_name: business.name });

        const { data, error } = await supabase
          .from('websites')
          .insert({
            business_id,
            slug: slugData || business.name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
            ...websiteData,
          })
          .select()
          .single();

        if (error) {
          console.error('Error creating and submitting website:', error);
          return NextResponse.json({ error: 'Failed to submit website' }, { status: 500 });
        }
        result = data;
      }
    }

    // Log the submission in website_edits
    await supabase.from('website_edits').insert({
      website_id: result.id,
      edited_by: 'business_owner',
      fields_changed: ['initial_submission'],
      new_values: websiteData,
      triggered_review: true,
    });

    // TODO: Send notification email to admin about new submission

    return NextResponse.json({
      success: true,
      website: result,
      message: 'Website submitted for review. You will be notified once approved.',
    });
  } catch (error) {
    console.error('Error submitting website:', error);
    return NextResponse.json({ error: 'Failed to submit website' }, { status: 500 });
  }
}
