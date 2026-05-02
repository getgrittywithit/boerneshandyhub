import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

// POST - Reject a website and request changes
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { website_id, reason } = body;

    if (!website_id) {
      return NextResponse.json({ error: 'Missing website_id' }, { status: 400 });
    }

    if (!reason || !reason.trim()) {
      return NextResponse.json({ error: 'Rejection reason is required' }, { status: 400 });
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

    // Update to changes_requested status
    const now = new Date().toISOString();
    const { data: updatedWebsite, error: updateError } = await supabase
      .from('websites')
      .update({
        status: 'changes_requested',
        rejection_reason: reason.trim(),
        updated_at: now,
      })
      .eq('id', website_id)
      .select()
      .single();

    if (updateError) {
      console.error('Error rejecting website:', updateError);
      return NextResponse.json({ error: 'Failed to reject website' }, { status: 500 });
    }

    // Log the rejection in website_edits
    await supabase.from('website_edits').insert({
      website_id,
      edited_by: 'admin',
      fields_changed: ['status', 'rejection_reason'],
      previous_values: { status: 'pending_review' },
      new_values: { status: 'changes_requested', rejection_reason: reason.trim() },
      triggered_review: false,
      auto_approved: false,
    });

    // TODO: Send notification email to business owner about requested changes

    return NextResponse.json({
      success: true,
      website: updatedWebsite,
      message: 'Changes requested from business owner',
    });
  } catch (error) {
    console.error('Error rejecting website:', error);
    return NextResponse.json({ error: 'Failed to reject website' }, { status: 500 });
  }
}
