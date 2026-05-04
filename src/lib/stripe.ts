import Stripe from 'stripe';

// Initialize Stripe with the secret key
export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2026-04-22.dahlia',
  typescript: true,
});

// Stripe Price IDs for each tier (set these in your Stripe dashboard)
// These should be configured in environment variables in production
export const STRIPE_PRICE_IDS = {
  // Monthly prices
  verified_monthly: process.env.STRIPE_PRICE_VERIFIED_MONTHLY || 'price_verified_monthly',
  verifiedPlus_monthly: process.env.STRIPE_PRICE_VERIFIED_PLUS_MONTHLY || 'price_verified_plus_monthly',

  // Annual prices (discounted)
  verified_annual: process.env.STRIPE_PRICE_VERIFIED_ANNUAL || 'price_verified_annual',
  verifiedPlus_annual: process.env.STRIPE_PRICE_VERIFIED_PLUS_ANNUAL || 'price_verified_plus_annual',

  // Founder's Bundle one-time (Verified+ first 3 months)
  founders_bundle: process.env.STRIPE_PRICE_FOUNDERS_BUNDLE || 'price_founders_bundle',
} as const;

// Map Stripe price IDs back to tier keys
export const getPriceToTierMap = (): Record<string, { tier: string; billingPeriod: 'monthly' | 'annual' }> => ({
  [STRIPE_PRICE_IDS.verified_monthly]: { tier: 'verified', billingPeriod: 'monthly' },
  [STRIPE_PRICE_IDS.verified_annual]: { tier: 'verified', billingPeriod: 'annual' },
  [STRIPE_PRICE_IDS.verifiedPlus_monthly]: { tier: 'verifiedPlus', billingPeriod: 'monthly' },
  [STRIPE_PRICE_IDS.verifiedPlus_annual]: { tier: 'verifiedPlus', billingPeriod: 'annual' },
  [STRIPE_PRICE_IDS.founders_bundle]: { tier: 'verifiedPlus', billingPeriod: 'monthly' },
});

// Map tier keys to database tier values
// Database uses: 'basic', 'verified', 'premium', 'elite'
// Pricing uses: 'claimed', 'verified', 'verifiedPlus', 'foundingPartner'
export const TIER_TO_DB_MAP: Record<string, string> = {
  claimed: 'basic',
  verified: 'verified',
  verifiedPlus: 'premium', // Verified+ maps to 'premium' in DB
  foundingPartner: 'elite',
};

export const DB_TO_TIER_MAP: Record<string, string> = {
  basic: 'claimed',
  verified: 'verified',
  premium: 'verifiedPlus',
  elite: 'foundingPartner',
};

// Helper to create a checkout session
export async function createCheckoutSession(params: {
  customerId?: string;
  customerEmail: string;
  priceId: string;
  businessId: string;
  successUrl: string;
  cancelUrl: string;
  mode?: 'subscription' | 'payment';
  trialDays?: number;
}): Promise<Stripe.Checkout.Session> {
  const sessionParams: Stripe.Checkout.SessionCreateParams = {
    mode: params.mode || 'subscription',
    success_url: params.successUrl,
    cancel_url: params.cancelUrl,
    line_items: [
      {
        price: params.priceId,
        quantity: 1,
      },
    ],
    metadata: {
      businessId: params.businessId,
    },
    allow_promotion_codes: true,
    billing_address_collection: 'auto',
    tax_id_collection: {
      enabled: true,
    },
  };

  // Use existing customer or create by email
  if (params.customerId) {
    sessionParams.customer = params.customerId;
  } else {
    sessionParams.customer_email = params.customerEmail;
  }

  // Add trial period for subscriptions
  if (params.mode === 'subscription' && params.trialDays) {
    sessionParams.subscription_data = {
      trial_period_days: params.trialDays,
    };
  }

  return stripe.checkout.sessions.create(sessionParams);
}

// Helper to create a customer portal session
export async function createPortalSession(params: {
  customerId: string;
  returnUrl: string;
}): Promise<Stripe.BillingPortal.Session> {
  return stripe.billingPortal.sessions.create({
    customer: params.customerId,
    return_url: params.returnUrl,
  });
}

// Helper to get or create a Stripe customer
export async function getOrCreateCustomer(params: {
  email: string;
  businessId: string;
  businessName: string;
  existingCustomerId?: string;
}): Promise<Stripe.Customer> {
  // If we have an existing customer ID, verify it exists
  if (params.existingCustomerId) {
    try {
      const customer = await stripe.customers.retrieve(params.existingCustomerId);
      if (!customer.deleted) {
        return customer as Stripe.Customer;
      }
    } catch {
      // Customer doesn't exist, create new one
    }
  }

  // Search for existing customer by email
  const existingCustomers = await stripe.customers.list({
    email: params.email,
    limit: 1,
  });

  if (existingCustomers.data.length > 0) {
    return existingCustomers.data[0];
  }

  // Create new customer
  return stripe.customers.create({
    email: params.email,
    name: params.businessName,
    metadata: {
      businessId: params.businessId,
    },
  });
}

// Helper to cancel a subscription
export async function cancelSubscription(subscriptionId: string): Promise<Stripe.Subscription> {
  return stripe.subscriptions.cancel(subscriptionId);
}

// Helper to get subscription details
export async function getSubscription(subscriptionId: string): Promise<Stripe.Subscription> {
  return stripe.subscriptions.retrieve(subscriptionId);
}
