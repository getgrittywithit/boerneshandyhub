import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import crypto from 'crypto';

// Resend webhook event types
interface ResendWebhookEvent {
  type: 'email.sent' | 'email.delivered' | 'email.opened' | 'email.clicked' | 'email.bounced' | 'email.complained';
  created_at: string;
  data: {
    email_id: string;
    from: string;
    to: string[];
    subject: string;
    created_at: string;
    // For click events
    click?: {
      link: string;
      timestamp: string;
    };
    // For bounce events
    bounce?: {
      message: string;
    };
  };
}

// Map Resend event types to our event types
const eventTypeMap: Record<string, string> = {
  'email.sent': 'sent',
  'email.delivered': 'delivered',
  'email.opened': 'opened',
  'email.clicked': 'clicked',
  'email.bounced': 'bounced',
  'email.complained': 'complained',
};

// Verify Resend webhook signature
function verifySignature(payload: string, signature: string, secret: string): boolean {
  if (!secret) return true; // Skip verification if no secret configured

  const expectedSignature = crypto
    .createHmac('sha256', secret)
    .update(payload)
    .digest('hex');

  return crypto.timingSafeEqual(
    Buffer.from(signature),
    Buffer.from(expectedSignature)
  );
}

export async function POST(request: NextRequest) {
  try {
    const payload = await request.text();
    const signature = request.headers.get('svix-signature') || '';
    const webhookSecret = process.env.RESEND_WEBHOOK_SECRET || '';

    // Verify signature in production
    if (process.env.NODE_ENV === 'production' && webhookSecret) {
      if (!verifySignature(payload, signature, webhookSecret)) {
        console.error('Invalid webhook signature');
        return NextResponse.json({ error: 'Invalid signature' }, { status: 401 });
      }
    }

    const event: ResendWebhookEvent = JSON.parse(payload);

    if (!supabase) {
      console.error('Supabase not configured');
      return NextResponse.json({ error: 'Database not configured' }, { status: 500 });
    }

    const eventType = eventTypeMap[event.type];
    if (!eventType) {
      // Unknown event type, acknowledge but don't process
      return NextResponse.json({ received: true });
    }

    const recipientEmail = event.data.to?.[0];

    // Look up subscriber by email
    let subscriberId = null;
    if (recipientEmail) {
      const { data: subscriber } = await supabase
        .from('subscribers')
        .select('id')
        .eq('email', recipientEmail)
        .single();

      subscriberId = subscriber?.id;
    }

    // Insert the event
    const { error } = await supabase.from('newsletter_events').insert({
      email_id: event.data.email_id,
      event_type: eventType,
      recipient_email: recipientEmail,
      subscriber_id: subscriberId,
      click_url: event.data.click?.link,
      event_timestamp: event.created_at,
    });

    if (error) {
      console.error('Error inserting newsletter event:', error);
      // Still return 200 to acknowledge receipt
    }

    // Update newsletter draft stats if we can identify the broadcast
    // This would require storing the email_id -> draft_id mapping when sending
    // For now, we'll aggregate stats separately

    // Handle bounces and complaints - update subscriber status
    if (eventType === 'bounced' && recipientEmail) {
      await supabase
        .from('subscribers')
        .update({ status: 'bounced' })
        .eq('email', recipientEmail);
    }

    if (eventType === 'complained' && recipientEmail) {
      await supabase
        .from('subscribers')
        .update({ status: 'unsubscribed', unsubscribed_at: new Date().toISOString() })
        .eq('email', recipientEmail);
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error('Webhook error:', error);
    // Return 200 to prevent Resend from retrying
    return NextResponse.json({ received: true, error: 'Processing error' });
  }
}

// Resend may send a GET request to verify the endpoint
export async function GET() {
  return NextResponse.json({ status: 'Resend webhook endpoint active' });
}
