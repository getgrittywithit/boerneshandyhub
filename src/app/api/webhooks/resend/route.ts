import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

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

// Structured error logging for webhook debugging
function logWebhookError(
  phase: string,
  error: unknown,
  context: {
    eventType?: string;
    emailId?: string;
    rawPayload?: string;
  }
) {
  const errorDetails = {
    timestamp: new Date().toISOString(),
    phase,
    eventType: context.eventType || 'unknown',
    emailId: context.emailId || 'unknown',
    error: {
      message: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : undefined,
      cause: error instanceof Error && error.cause ? String(error.cause) : undefined,
      name: error instanceof Error ? error.name : typeof error,
    },
    // Include first 500 chars of payload for debugging (avoid logging full emails)
    payloadPreview: context.rawPayload?.substring(0, 500),
  };

  console.error('RESEND_WEBHOOK_ERROR:', JSON.stringify(errorDetails, null, 2));
}

export async function POST(request: NextRequest) {
  let rawPayload: string | undefined;
  let parsedEvent: ResendWebhookEvent | undefined;

  try {
    // Step 1: Read raw payload
    rawPayload = await request.text();

    // Step 2: Parse JSON
    try {
      parsedEvent = JSON.parse(rawPayload) as ResendWebhookEvent;
    } catch (parseError) {
      logWebhookError('json_parse', parseError, { rawPayload });
      return NextResponse.json({ received: true, error: 'Invalid JSON' });
    }

    const event = parsedEvent;
    const eventType = eventTypeMap[event.type];
    const emailId = event.data?.email_id;

    // Log incoming event for debugging
    console.log('RESEND_WEBHOOK_RECEIVED:', {
      type: event.type,
      mappedType: eventType,
      emailId,
      to: event.data?.to,
      timestamp: new Date().toISOString(),
    });

    // Step 3: Check if event type is recognized
    if (!eventType) {
      console.log('RESEND_WEBHOOK_SKIP: Unrecognized event type', event.type);
      return NextResponse.json({ received: true });
    }

    // Step 4: Check Supabase configuration
    if (!supabase) {
      logWebhookError('supabase_config', new Error('Supabase client is null'), {
        eventType: event.type,
        emailId,
      });
      return NextResponse.json({ received: true, error: 'Database not configured' });
    }

    const recipientEmail = event.data.to?.[0];

    // Step 5: Look up subscriber (optional - don't fail if not found)
    let subscriberId: string | null = null;
    if (recipientEmail) {
      try {
        const { data: subscriber, error: subscriberError } = await supabase
          .from('subscribers')
          .select('id')
          .eq('email', recipientEmail)
          .single();

        if (subscriberError && subscriberError.code !== 'PGRST116') {
          // PGRST116 = no rows returned, which is fine
          console.warn('RESEND_WEBHOOK_WARN: Subscriber lookup failed', {
            email: recipientEmail,
            error: subscriberError,
          });
        }
        subscriberId = subscriber?.id || null;
      } catch (lookupError) {
        logWebhookError('subscriber_lookup', lookupError, {
          eventType: event.type,
          emailId,
        });
        // Continue processing - subscriber lookup is optional
      }
    }

    // Step 6: Insert event into newsletter_events
    try {
      const insertData = {
        email_id: emailId,
        event_type: eventType,
        recipient_email: recipientEmail || null,
        subscriber_id: subscriberId,
        click_url: event.data.click?.link || null,
        event_timestamp: event.created_at,
      };

      console.log('RESEND_WEBHOOK_INSERT:', insertData);

      const { error: insertError } = await supabase
        .from('newsletter_events')
        .insert(insertData);

      if (insertError) {
        logWebhookError('database_insert', insertError, {
          eventType: event.type,
          emailId,
        });
        // Log the specific Supabase error details
        console.error('RESEND_WEBHOOK_SUPABASE_ERROR:', {
          code: insertError.code,
          message: insertError.message,
          details: insertError.details,
          hint: insertError.hint,
        });
      }
    } catch (insertError) {
      logWebhookError('database_insert_exception', insertError, {
        eventType: event.type,
        emailId,
      });
    }

    // Step 7: Handle bounces and complaints
    if (recipientEmail) {
      try {
        if (eventType === 'bounced') {
          const { error: bounceError } = await supabase
            .from('subscribers')
            .update({ status: 'bounced' })
            .eq('email', recipientEmail);

          if (bounceError) {
            console.warn('RESEND_WEBHOOK_WARN: Failed to update bounce status', bounceError);
          }
        }

        if (eventType === 'complained') {
          const { error: complaintError } = await supabase
            .from('subscribers')
            .update({ status: 'unsubscribed', unsubscribed_at: new Date().toISOString() })
            .eq('email', recipientEmail);

          if (complaintError) {
            console.warn('RESEND_WEBHOOK_WARN: Failed to update complaint status', complaintError);
          }
        }
      } catch (statusError) {
        logWebhookError('status_update', statusError, {
          eventType: event.type,
          emailId,
        });
      }
    }

    console.log('RESEND_WEBHOOK_SUCCESS:', { eventType, emailId });
    return NextResponse.json({ received: true });

  } catch (error) {
    // Catch-all for unexpected errors
    logWebhookError('unhandled', error, {
      eventType: parsedEvent?.type,
      emailId: parsedEvent?.data?.email_id,
      rawPayload,
    });
    // Return 200 to prevent Resend from retrying
    return NextResponse.json({ received: true, error: 'Processing error' });
  }
}

// Resend may send a GET request to verify the endpoint
export async function GET() {
  return NextResponse.json({ status: 'Resend webhook endpoint active' });
}
