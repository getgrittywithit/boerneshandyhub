import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

// Fields that require re-review
const FIELDS_REQUIRING_REVIEW = [
  'tagline',
  'about_text',
  'services',
  'testimonials',
  'license_number',
];

// Fields that auto-publish
const FIELDS_AUTO_PUBLISH = [
  'hours',
  'emergency_available',
  'primary_color',
  'accent_color',
  'template',
  'service_area',
  'insurance_carrier',
  'years_in_business',
];

// POST - Update website
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      website_id,
      changed_fields,
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

    if (!website_id) {
      return NextResponse.json({ error: 'Missing website_id' }, { status: 400 });
    }

    if (!changed_fields || changed_fields.length === 0) {
      return NextResponse.json({ error: 'No changes to save' }, { status: 400 });
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Get current website
    const { data: website, error: fetchError } = await supabase
      .from('websites')
      .select('*')
      .eq('id', website_id)
      .single();

    if (fetchError || !website) {
      return NextResponse.json({ error: 'Website not found' }, { status: 404 });
    }

    // Check if any changed fields require review
    const requiresReview = changed_fields.some((field: string) =>
      FIELDS_REQUIRING_REVIEW.includes(field)
    );

    // Build update object
    const updateData: Record<string, unknown> = {
      updated_at: new Date().toISOString(),
    };

    // Add all fields
    if (changed_fields.includes('template')) updateData.template = template;
    if (changed_fields.includes('primary_color')) updateData.primary_color = primary_color;
    if (changed_fields.includes('accent_color')) updateData.accent_color = accent_color;
    if (changed_fields.includes('tagline')) updateData.tagline = tagline || null;
    if (changed_fields.includes('about_text')) updateData.about_text = about_text || null;
    if (changed_fields.includes('services')) updateData.services = services || [];
    if (changed_fields.includes('license_number')) updateData.license_number = license_number || null;
    if (changed_fields.includes('insurance_carrier')) updateData.insurance_carrier = insurance_carrier || null;
    if (changed_fields.includes('years_in_business')) updateData.years_in_business = years_in_business;
    if (changed_fields.includes('hours')) updateData.hours = hours || {};
    if (changed_fields.includes('emergency_available')) updateData.emergency_available = emergency_available || false;
    if (changed_fields.includes('service_area')) updateData.service_area = service_area || {};
    if (changed_fields.includes('testimonials')) updateData.testimonials = testimonials || [];

    // If requires review, change status
    if (requiresReview) {
      updateData.status = 'pending_review';
      updateData.submitted_at = new Date().toISOString();
      updateData.rejection_reason = null;
    }

    // Save previous values for audit
    const previousValues: Record<string, unknown> = {};
    changed_fields.forEach((field: string) => {
      previousValues[field] = website[field];
    });

    // Update website
    const { data: updatedWebsite, error: updateError } = await supabase
      .from('websites')
      .update(updateData)
      .eq('id', website_id)
      .select()
      .single();

    if (updateError) {
      console.error('Error updating website:', updateError);
      return NextResponse.json({ error: 'Failed to update website' }, { status: 500 });
    }

    // Log edit
    await supabase.from('website_edits').insert({
      website_id,
      edited_by: 'business_owner',
      fields_changed: changed_fields,
      previous_values: previousValues,
      new_values: updateData,
      triggered_review: requiresReview,
      auto_approved: !requiresReview,
    });

    return NextResponse.json({
      success: true,
      website: updatedWebsite,
      requires_review: requiresReview,
      message: requiresReview
        ? 'Changes submitted for review'
        : 'Changes saved and published',
    });
  } catch (error) {
    console.error('Error updating website:', error);
    return NextResponse.json({ error: 'Failed to update website' }, { status: 500 });
  }
}
