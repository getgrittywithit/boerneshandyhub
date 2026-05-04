import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import {
  stripe,
  createCheckoutSession,
  getOrCreateCustomer,
  STRIPE_PRICE_IDS,
  TIER_TO_DB_MAP,
} from '@/lib/stripe';
import type { TierKey } from '@/data/pricingTiers';

// Initialize Supabase admin client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const supabase = supabaseUrl && supabaseServiceKey
  ? createClient(supabaseUrl, supabaseServiceKey)
  : null;

export async function POST(request: NextRequest) {
  try {
    if (!stripe) {
      return NextResponse.json(
        { error: 'Stripe is not configured' },
        { status: 503 }
      );
    }

    if (!supabase) {
      return NextResponse.json(
        { error: 'Database is not configured' },
        { status: 503 }
      );
    }

    const body = await request.json();
    const {
      businessId,
      tier,
      billingPeriod = 'monthly',
      isFoundersBundle = false,
    } = body as {
      businessId: string;
      tier: TierKey;
      billingPeriod?: 'monthly' | 'annual';
      isFoundersBundle?: boolean;
    };

    if (!businessId || !tier) {
      return NextResponse.json(
        { error: 'Missing required fields: businessId and tier' },
        { status: 400 }
      );
    }

    // Validate tier
    if (!['verified', 'verifiedPlus'].includes(tier)) {
      return NextResponse.json(
        { error: 'Invalid tier. Must be "verified" or "verifiedPlus"' },
        { status: 400 }
      );
    }

    // Get business details
    const { data: business, error: businessError } = await supabase
      .from('businesses')
      .select('id, name, email, stripe_customer_id, membership_tier')
      .eq('id', businessId)
      .single();

    if (businessError || !business) {
      return NextResponse.json(
        { error: 'Business not found' },
        { status: 404 }
      );
    }

    // Check if already on the same or higher tier
    const currentDbTier = business.membership_tier || 'basic';
    const targetDbTier = TIER_TO_DB_MAP[tier];
    const tierOrder = ['basic', 'verified', 'premium', 'elite'];

    if (tierOrder.indexOf(currentDbTier) >= tierOrder.indexOf(targetDbTier)) {
      return NextResponse.json(
        { error: 'Already on this tier or higher' },
        { status: 400 }
      );
    }

    // Get or create Stripe customer
    const customer = await getOrCreateCustomer({
      email: business.email,
      businessId: business.id,
      businessName: business.name,
      existingCustomerId: business.stripe_customer_id,
    });

    // Update business with customer ID if new
    if (!business.stripe_customer_id) {
      await supabase
        .from('businesses')
        .update({ stripe_customer_id: customer.id })
        .eq('id', businessId);
    }

    // Determine price ID
    let priceId: string;
    let mode: 'subscription' | 'payment' = 'subscription';

    if (isFoundersBundle && tier === 'verifiedPlus') {
      // Founder's Bundle is a one-time payment
      priceId = STRIPE_PRICE_IDS.founders_bundle;
      mode = 'payment';
    } else if (tier === 'verified') {
      priceId = billingPeriod === 'annual'
        ? STRIPE_PRICE_IDS.verified_annual
        : STRIPE_PRICE_IDS.verified_monthly;
    } else {
      // verifiedPlus
      priceId = billingPeriod === 'annual'
        ? STRIPE_PRICE_IDS.verifiedPlus_annual
        : STRIPE_PRICE_IDS.verifiedPlus_monthly;
    }

    // Build URLs
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://boerneshandyhub.com';
    const successUrl = `${baseUrl}/business/dashboard/settings?upgrade=success&tier=${tier}`;
    const cancelUrl = `${baseUrl}/business/dashboard/settings?upgrade=cancelled`;

    // Create checkout session
    const session = await createCheckoutSession({
      customerId: customer.id,
      customerEmail: business.email,
      priceId,
      businessId,
      successUrl,
      cancelUrl,
      mode,
    });

    return NextResponse.json({
      success: true,
      checkoutUrl: session.url,
      sessionId: session.id,
    });
  } catch (error) {
    console.error('Checkout session error:', error);
    return NextResponse.json(
      { error: 'Failed to create checkout session' },
      { status: 500 }
    );
  }
}
