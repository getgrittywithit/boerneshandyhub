import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { render } from '@react-email/render';
import { createAndSendBroadcast, audienceIds, isResendConfigured } from '@/lib/resend';
import NewsletterEmail from '@/emails/NewsletterEmail';
import type { NewsletterDraft } from '@/types/newsletter';

// Initialize Supabase admin client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

const supabase = supabaseUrl && supabaseServiceKey
  ? createClient(supabaseUrl, supabaseServiceKey)
  : null;

// POST - Send newsletter to subscribers
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { draft_id, audience = 'all' } = body as {
      draft_id: string;
      audience?: 'all' | 'homeowners' | 'realtors' | 'businesses';
    };

    if (!draft_id) {
      return NextResponse.json(
        { error: 'Missing draft_id' },
        { status: 400 }
      );
    }

    if (!isResendConfigured()) {
      return NextResponse.json(
        { error: 'Email service not configured' },
        { status: 500 }
      );
    }

    if (!supabase) {
      return NextResponse.json(
        { error: 'Database not configured' },
        { status: 500 }
      );
    }

    // Get the draft
    const { data: draft, error: draftError } = await supabase
      .from('newsletter_drafts')
      .select('*')
      .eq('id', draft_id)
      .single();

    if (draftError || !draft) {
      return NextResponse.json(
        { error: 'Draft not found' },
        { status: 404 }
      );
    }

    // Check draft status
    if (draft.status !== 'approved') {
      return NextResponse.json(
        { error: `Cannot send newsletter with status "${draft.status}". Must be approved first.` },
        { status: 400 }
      );
    }

    // Get audience ID
    const audienceId = audienceIds[audience];
    if (!audienceId) {
      return NextResponse.json(
        { error: `Audience "${audience}" is not configured. Please set RESEND_AUDIENCE_${audience.toUpperCase()} environment variable.` },
        { status: 400 }
      );
    }

    // Get subscriber count for this audience
    const { count: subscriberCount } = await supabase
      .from('subscribers')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'active')
      .eq(audience === 'all' ? 'status' : 'subscriber_type', audience === 'all' ? 'active' : audience.replace('s', ''));

    // Render the email HTML
    const typedDraft = draft as NewsletterDraft;
    const emailHtml = await render(
      NewsletterEmail({
        previewText: typedDraft.preview_text || undefined,
        sections: typedDraft.sections || {},
        unsubscribeUrl: `${process.env.NEXT_PUBLIC_SITE_URL || 'https://boerneshandyhub.com'}/unsubscribe`,
        webViewUrl: `${process.env.NEXT_PUBLIC_SITE_URL || 'https://boerneshandyhub.com'}/newsletters/${draft_id}`,
      })
    );

    // Update draft status to 'sending'
    await supabase
      .from('newsletter_drafts')
      .update({
        status: 'sending',
        audience,
        updated_at: new Date().toISOString(),
      })
      .eq('id', draft_id);

    // Send the broadcast
    const result = await createAndSendBroadcast({
      name: typedDraft.title,
      audienceId,
      subject: typedDraft.subject_line || typedDraft.title,
      html: emailHtml,
      previewText: typedDraft.preview_text || undefined,
    });

    if (result.error) {
      // Update draft status to failed
      await supabase
        .from('newsletter_drafts')
        .update({
          status: 'failed',
          updated_at: new Date().toISOString(),
        })
        .eq('id', draft_id);

      return NextResponse.json(
        { error: result.error },
        { status: 500 }
      );
    }

    // Update draft with broadcast info
    await supabase
      .from('newsletter_drafts')
      .update({
        status: 'sent',
        sent_at: new Date().toISOString(),
        resend_broadcast_id: result.data?.broadcastId,
        send_stats: {
          audience,
          subscriber_count: subscriberCount || 0,
          sent_at: new Date().toISOString(),
        },
        updated_at: new Date().toISOString(),
      })
      .eq('id', draft_id);

    return NextResponse.json({
      success: true,
      message: `Newsletter sent to ${audience} audience`,
      broadcastId: result.data?.broadcastId,
      subscriberCount: subscriberCount || 0,
    });
  } catch (error) {
    console.error('Broadcast error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to send newsletter' },
      { status: 500 }
    );
  }
}

// GET - Get subscriber counts for each audience
export async function GET() {
  try {
    if (!supabase) {
      return NextResponse.json(
        { error: 'Database not configured' },
        { status: 500 }
      );
    }

    // Get counts by audience type
    const { count: totalCount } = await supabase
      .from('subscribers')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'active');

    const { count: homeownerCount } = await supabase
      .from('subscribers')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'active')
      .eq('subscriber_type', 'homeowner');

    const { count: realtorCount } = await supabase
      .from('subscribers')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'active')
      .eq('subscriber_type', 'realtor');

    const { count: businessCount } = await supabase
      .from('subscribers')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'active')
      .eq('subscriber_type', 'business');

    // Check which audiences are configured
    const configuredAudiences = {
      all: !!audienceIds.all,
      homeowners: !!audienceIds.homeowners,
      realtors: !!audienceIds.realtors,
      businesses: !!audienceIds.businesses,
    };

    return NextResponse.json({
      counts: {
        all: totalCount || 0,
        homeowners: homeownerCount || 0,
        realtors: realtorCount || 0,
        businesses: businessCount || 0,
      },
      configured: configuredAudiences,
    });
  } catch (error) {
    console.error('Error getting audience counts:', error);
    return NextResponse.json(
      { error: 'Failed to get audience counts' },
      { status: 500 }
    );
  }
}
