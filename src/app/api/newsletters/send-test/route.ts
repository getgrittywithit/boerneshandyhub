import { NextRequest, NextResponse } from 'next/server';
import { render } from '@react-email/render';
import { supabase } from '@/lib/supabase';
import { sendEmail, emailConfig } from '@/lib/resend';
import NewsletterEmail from '@/emails/NewsletterEmail';
import type { NewsletterDraft } from '@/types/newsletter';

export async function POST(request: NextRequest) {
  try {
    if (!supabase) {
      return NextResponse.json(
        { error: 'Database not configured' },
        { status: 500 }
      );
    }

    const body = await request.json();
    const { draft_id, test_email } = body;

    if (!draft_id) {
      return NextResponse.json(
        { error: 'Draft ID is required' },
        { status: 400 }
      );
    }

    if (!test_email) {
      return NextResponse.json(
        { error: 'Test email is required' },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(test_email)) {
      return NextResponse.json(
        { error: 'Invalid email format' },
        { status: 400 }
      );
    }

    // Fetch the draft
    const { data: draft, error: fetchError } = await supabase
      .from('newsletter_drafts')
      .select('*')
      .eq('id', draft_id)
      .single();

    if (fetchError || !draft) {
      return NextResponse.json(
        { error: 'Draft not found' },
        { status: 404 }
      );
    }

    const newsletterDraft = draft as NewsletterDraft;

    // Render the email
    const emailHtml = await render(
      NewsletterEmail({
        previewText: newsletterDraft.preview_text || undefined,
        sections: newsletterDraft.sections,
        unsubscribeUrl: 'https://boerneshandyhub.com/unsubscribe?test=true',
        webViewUrl: `https://boerneshandyhub.com/newsletters/${draft_id}`,
      })
    );

    // Send test email
    const result = await sendEmail({
      to: test_email,
      subject: `[TEST] ${newsletterDraft.subject_line || newsletterDraft.title}`,
      react: NewsletterEmail({
        previewText: newsletterDraft.preview_text || undefined,
        sections: newsletterDraft.sections,
        unsubscribeUrl: 'https://boerneshandyhub.com/unsubscribe?test=true',
        webViewUrl: `https://boerneshandyhub.com/newsletters/${draft_id}`,
      }),
      from: emailConfig.from.newsletter,
    });

    if ('error' in result && result.error) {
      console.error('Error sending test email:', result.error);
      return NextResponse.json(
        { error: typeof result.error === 'string' ? result.error : 'Failed to send test email' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: `Test email sent to ${test_email}`,
      emailId: 'data' in result ? result.data?.id : undefined,
    });
  } catch (error) {
    console.error('Send test email error:', error);
    return NextResponse.json(
      { error: 'Failed to send test email' },
      { status: 500 }
    );
  }
}
