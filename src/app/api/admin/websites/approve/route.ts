import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

// POST - Approve a website and make it live
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { website_id } = body;

    if (!website_id) {
      return NextResponse.json({ error: 'Missing website_id' }, { status: 400 });
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Get current website state
    const { data: website, error: fetchError } = await supabase
      .from('websites')
      .select('status, business_id')
      .eq('id', website_id)
      .single();

    if (fetchError || !website) {
      return NextResponse.json({ error: 'Website not found' }, { status: 404 });
    }

    if (website.status !== 'pending_review') {
      return NextResponse.json(
        { error: 'Website is not pending review' },
        { status: 400 }
      );
    }

    // Update to live status
    const now = new Date().toISOString();
    const { data: updatedWebsite, error: updateError } = await supabase
      .from('websites')
      .update({
        status: 'live',
        approved_at: now,
        approved_by: 'admin', // TODO: Get actual admin email
        published_at: now,
        rejection_reason: null,
        updated_at: now,
      })
      .eq('id', website_id)
      .select()
      .single();

    if (updateError) {
      console.error('Error approving website:', updateError);
      return NextResponse.json({ error: 'Failed to approve website' }, { status: 500 });
    }

    // Log the approval in website_edits
    await supabase.from('website_edits').insert({
      website_id,
      edited_by: 'admin',
      fields_changed: ['status'],
      previous_values: { status: 'pending_review' },
      new_values: { status: 'live' },
      triggered_review: false,
      auto_approved: false,
    });

    // TODO: Send notification email to business owner about approval

    return NextResponse.json({
      success: true,
      website: updatedWebsite,
      message: 'Website approved and published successfully',
    });
  } catch (error) {
    console.error('Error approving website:', error);
    return NextResponse.json({ error: 'Failed to approve website' }, { status: 500 });
  }
}
