import { NextRequest, NextResponse } from 'next/server';
import { headers } from 'next/headers';
import Stripe from 'stripe';
import { createClient } from '@supabase/supabase-js';
import { stripe, getPriceToTierMap, TIER_TO_DB_MAP } from '@/lib/stripe';

// Initialize Supabase admin client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const supabase = supabaseUrl && supabaseServiceKey
  ? createClient(supabaseUrl, supabaseServiceKey)
  : null;

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

export async function POST(request: NextRequest) {
  if (!stripe || !webhookSecret) {
    console.error('Stripe not configured');
    return NextResponse.json({ error: 'Stripe not configured' }, { status: 503 });
  }

  if (!supabase) {
    console.error('Database not configured');
    return NextResponse.json({ error: 'Database not configured' }, { status: 503 });
  }

  const body = await request.text();
  const headersList = await headers();
  const signature = headersList.get('stripe-signature');

  if (!signature) {
    console.error('No Stripe signature found');
    return NextResponse.json({ error: 'No signature' }, { status: 400 });
  }

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
  } catch (err) {
    console.error('Webhook signature verification failed:', err);
    return NextResponse.json(
      { error: 'Invalid signature' },
      { status: 400 }
    );
  }

  try {
    switch (event.type) {
      case 'checkout.session.completed':
        await handleCheckoutCompleted(event.data.object as Stripe.Checkout.Session);
        break;

      case 'customer.subscription.created':
      case 'customer.subscription.updated':
        await handleSubscriptionUpdate(event.data.object as Stripe.Subscription);
        break;

      case 'customer.subscription.deleted':
        await handleSubscriptionCancelled(event.data.object as Stripe.Subscription);
        break;

      case 'invoice.paid':
        await handleInvoicePaid(event.data.object as Stripe.Invoice);
        break;

      case 'invoice.payment_failed':
        await handleInvoicePaymentFailed(event.data.object as Stripe.Invoice);
        break;

      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error(`Error handling webhook ${event.type}:`, error);
    return NextResponse.json(
      { error: 'Webhook handler failed' },
      { status: 500 }
    );
  }
}

async function handleCheckoutCompleted(session: Stripe.Checkout.Session) {
  const businessId = session.metadata?.businessId;

  if (!businessId) {
    console.error('No businessId in checkout session metadata');
    return;
  }

  // Get the subscription or payment intent
  if (session.mode === 'subscription' && session.subscription) {
    const subscription = await stripe!.subscriptions.retrieve(
      session.subscription as string
    );
    await updateBusinessSubscription(businessId, subscription, session.customer as string);
  } else if (session.mode === 'payment') {
    // One-time payment (e.g., Founder's Bundle)
    // Get line items to determine tier
    const lineItems = await stripe!.checkout.sessions.listLineItems(session.id);
    const priceId = lineItems.data[0]?.price?.id;

    if (priceId) {
      const priceToTier = getPriceToTierMap();
      const tierInfo = priceToTier[priceId];

      if (tierInfo) {
        const dbTier = TIER_TO_DB_MAP[tierInfo.tier];

        await supabase!
          .from('businesses')
          .update({
            membership_tier: dbTier,
            stripe_customer_id: session.customer as string,
          })
          .eq('id', businessId);

        // For Founder's Bundle, record the 3-month period
        if (priceId.includes('founders_bundle')) {
          const expiresAt = new Date();
          expiresAt.setMonth(expiresAt.getMonth() + 3);

          await supabase!
            .from('subscriptions')
            .upsert({
              business_id: businessId,
              stripe_subscription_id: `founders_bundle_${session.id}`,
              status: 'active',
              plan_id: priceId,
              current_period_start: new Date().toISOString(),
              current_period_end: expiresAt.toISOString(),
            });
        }
      }
    }
  }
}

async function updateBusinessSubscription(
  businessId: string,
  subscription: Stripe.Subscription,
  customerId: string
) {
  // Get the price ID from the subscription
  const priceId = subscription.items.data[0]?.price?.id;

  if (!priceId) {
    console.error('No price ID found in subscription');
    return;
  }

  const priceToTier = getPriceToTierMap();
  const tierInfo = priceToTier[priceId];

  if (!tierInfo) {
    console.error(`Unknown price ID: ${priceId}`);
    return;
  }

  const dbTier = TIER_TO_DB_MAP[tierInfo.tier];

  // Update business tier and subscription ID
  await supabase!
    .from('businesses')
    .update({
      membership_tier: dbTier,
      stripe_customer_id: customerId,
      stripe_subscription_id: subscription.id,
    })
    .eq('id', businessId);

  // Update or insert subscription record
  // Get the first subscription item to access the period
  const subscriptionItem = subscription.items.data[0];

  await supabase!
    .from('subscriptions')
    .upsert({
      business_id: businessId,
      stripe_subscription_id: subscription.id,
      status: subscription.status,
      plan_id: priceId,
      current_period_start: subscriptionItem?.current_period_start
        ? new Date(subscriptionItem.current_period_start * 1000).toISOString()
        : new Date().toISOString(),
      current_period_end: subscriptionItem?.current_period_end
        ? new Date(subscriptionItem.current_period_end * 1000).toISOString()
        : new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(), // Default 30 days
    });
}

async function handleSubscriptionUpdate(subscription: Stripe.Subscription) {
  // Get business from customer
  const customer = await stripe!.customers.retrieve(subscription.customer as string);

  if (customer.deleted) {
    console.error('Customer was deleted');
    return;
  }

  const businessId = customer.metadata?.businessId;

  if (!businessId) {
    // Try to find business by stripe_subscription_id
    const { data: business } = await supabase!
      .from('businesses')
      .select('id')
      .eq('stripe_subscription_id', subscription.id)
      .single();

    if (business) {
      await updateBusinessSubscription(business.id, subscription, subscription.customer as string);
    } else {
      console.error('Could not find business for subscription:', subscription.id);
    }
    return;
  }

  await updateBusinessSubscription(businessId, subscription, subscription.customer as string);
}

async function handleSubscriptionCancelled(subscription: Stripe.Subscription) {
  // Find business by subscription ID
  const { data: business } = await supabase!
    .from('businesses')
    .select('id')
    .eq('stripe_subscription_id', subscription.id)
    .single();

  if (!business) {
    console.error('No business found for cancelled subscription:', subscription.id);
    return;
  }

  // Downgrade to basic tier
  await supabase!
    .from('businesses')
    .update({
      membership_tier: 'basic',
      stripe_subscription_id: null,
    })
    .eq('id', business.id);

  // Update subscription record
  await supabase!
    .from('subscriptions')
    .update({
      status: 'canceled',
    })
    .eq('stripe_subscription_id', subscription.id);
}

async function handleInvoicePaid(invoice: Stripe.Invoice) {
  // Subscription renewal - just log for now
  console.log('Invoice paid:', invoice.id);

  // Get subscription ID from invoice lines
  const subscriptionId = invoice.lines?.data?.[0]?.subscription as string | null;

  // Update subscription period if available
  if (subscriptionId) {
    const subscription = await stripe!.subscriptions.retrieve(subscriptionId);

    const { data: business } = await supabase!
      .from('businesses')
      .select('id')
      .eq('stripe_subscription_id', subscription.id)
      .single();

    if (business) {
      // Get the first subscription item to access the period
      const subscriptionItem = subscription.items.data[0];

      await supabase!
        .from('subscriptions')
        .update({
          status: 'active',
          current_period_start: subscriptionItem?.current_period_start
            ? new Date(subscriptionItem.current_period_start * 1000).toISOString()
            : new Date().toISOString(),
          current_period_end: subscriptionItem?.current_period_end
            ? new Date(subscriptionItem.current_period_end * 1000).toISOString()
            : new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
        })
        .eq('stripe_subscription_id', subscription.id);
    }
  }
}

async function handleInvoicePaymentFailed(invoice: Stripe.Invoice) {
  console.error('Invoice payment failed:', invoice.id);

  // Get subscription ID from invoice lines
  const subscriptionId = invoice.lines?.data?.[0]?.subscription as string | null;

  if (subscriptionId) {
    // Update subscription status
    await supabase!
      .from('subscriptions')
      .update({
        status: 'past_due',
      })
      .eq('stripe_subscription_id', subscriptionId);
  }
}
