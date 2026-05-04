# Stripe Setup Checklist

This guide walks through setting up Stripe for Boerne's Handy Hub tier subscriptions.

---

## 1. Stripe Account Setup

- [ ] Create or log into [Stripe Dashboard](https://dashboard.stripe.com)
- [ ] Ensure you're in **Test Mode** (toggle in top-right)
- [ ] Note your test API keys from [Developers > API Keys](https://dashboard.stripe.com/test/apikeys)

---

## 2. Create Products & Prices

Go to [Products](https://dashboard.stripe.com/test/products) and create the following:

### Product 1: Verified Membership

- [ ] **Create Product**
  - Name: `Verified Membership`
  - Description: `Enhanced listing with SEO backlink and priority placement`

- [ ] **Add Monthly Price**
  - Price: `$29.00`
  - Billing period: `Monthly`
  - Price ID: Copy to `STRIPE_PRICE_VERIFIED_MONTHLY`

- [ ] **Add Annual Price**
  - Price: `$260.00`
  - Billing period: `Yearly`
  - Price ID: Copy to `STRIPE_PRICE_VERIFIED_ANNUAL`

---

### Product 2: Verified+ Membership

- [ ] **Create Product**
  - Name: `Verified+ Membership`
  - Description: `Professional website + top placement + all Verified features`

- [ ] **Add Monthly Price**
  - Price: `$67.00`
  - Billing period: `Monthly`
  - Price ID: Copy to `STRIPE_PRICE_VERIFIED_PLUS_MONTHLY`

- [ ] **Add Annual Price**
  - Price: `$620.00`
  - Billing period: `Yearly`
  - Price ID: Copy to `STRIPE_PRICE_VERIFIED_PLUS_ANNUAL`

---

### Product 3: Founder's Bundle

- [ ] **Create Product**
  - Name: `Founder's Bundle - Verified+`
  - Description: `First 3 months of Verified+ with professional website setup included`

- [ ] **Add One-Time Price**
  - Price: `$199.00`
  - One time (not recurring)
  - Price ID: Copy to `STRIPE_PRICE_FOUNDERS_BUNDLE`

---

## 3. Environment Variables

Add these to your `.env.local`:

```bash
# Stripe API Keys
STRIPE_SECRET_KEY=sk_test_xxxxxxxxxxxxxxxxxxxx
STRIPE_WEBHOOK_SECRET=whsec_xxxxxxxxxxxxxxxxxxxx

# Verified Tier Prices
STRIPE_PRICE_VERIFIED_MONTHLY=price_xxxxxxxxxxxxxxxxxxxx
STRIPE_PRICE_VERIFIED_ANNUAL=price_xxxxxxxxxxxxxxxxxxxx

# Verified+ Tier Prices
STRIPE_PRICE_VERIFIED_PLUS_MONTHLY=price_xxxxxxxxxxxxxxxxxxxx
STRIPE_PRICE_VERIFIED_PLUS_ANNUAL=price_xxxxxxxxxxxxxxxxxxxx

# Founder's Bundle (one-time)
STRIPE_PRICE_FOUNDERS_BUNDLE=price_xxxxxxxxxxxxxxxxxxxx
```

- [ ] Add `STRIPE_SECRET_KEY` (from API Keys page)
- [ ] Add `STRIPE_PRICE_VERIFIED_MONTHLY`
- [ ] Add `STRIPE_PRICE_VERIFIED_ANNUAL`
- [ ] Add `STRIPE_PRICE_VERIFIED_PLUS_MONTHLY`
- [ ] Add `STRIPE_PRICE_VERIFIED_PLUS_ANNUAL`
- [ ] Add `STRIPE_PRICE_FOUNDERS_BUNDLE`

---

## 4. Webhook Setup

### Required Webhook Events

The following events must be enabled:

| Event | Purpose |
|-------|---------|
| `checkout.session.completed` | User completes checkout |
| `customer.subscription.created` | New subscription started |
| `customer.subscription.updated` | Subscription changed (upgrade/downgrade) |
| `customer.subscription.deleted` | Subscription cancelled |
| `invoice.paid` | Successful recurring payment |
| `invoice.payment_failed` | Failed payment attempt |

### Local Development (Stripe CLI)

- [ ] Install [Stripe CLI](https://stripe.com/docs/stripe-cli)
  ```bash
  brew install stripe/stripe-cli/stripe
  ```

- [ ] Login to Stripe CLI
  ```bash
  stripe login
  ```

- [ ] Start webhook forwarding
  ```bash
  stripe listen --forward-to localhost:3000/api/webhooks/stripe
  ```

- [ ] Copy the webhook secret (starts with `whsec_`) to `STRIPE_WEBHOOK_SECRET`

### Production Webhook

- [ ] Go to [Developers > Webhooks](https://dashboard.stripe.com/test/webhooks)
- [ ] Click "Add endpoint"
- [ ] Endpoint URL: `https://boerneshandyhub.com/api/webhooks/stripe`
- [ ] Select events:
  - [ ] `checkout.session.completed`
  - [ ] `customer.subscription.created`
  - [ ] `customer.subscription.updated`
  - [ ] `customer.subscription.deleted`
  - [ ] `invoice.paid`
  - [ ] `invoice.payment_failed`
- [ ] Copy the signing secret to production `STRIPE_WEBHOOK_SECRET`

---

## 5. Customer Portal Setup

- [ ] Go to [Settings > Billing > Customer Portal](https://dashboard.stripe.com/test/settings/billing/portal)
- [ ] Enable the customer portal
- [ ] Configure allowed actions:
  - [ ] Update payment methods
  - [ ] View invoice history
  - [ ] Cancel subscriptions (optional)
- [ ] Save changes

---

## 6. Testing Checklist

### Test Cards

| Scenario | Card Number |
|----------|-------------|
| Successful payment | `4242 4242 4242 4242` |
| Declined card | `4000 0000 0000 0002` |
| Requires authentication | `4000 0025 0000 3155` |

Use any future expiry date and any 3-digit CVC.

### Test Flows

- [ ] **New Registration with Free tier**
  1. Register new business
  2. Select "Free" plan
  3. Complete registration
  4. Verify business created with `basic` tier

- [ ] **New Registration with Verified tier**
  1. Register new business
  2. Select "Verified" plan (monthly)
  3. Complete registration
  4. Should redirect to Stripe checkout
  5. Complete payment with test card
  6. Verify business has `verified` tier
  7. Check `subscriptions` table for record

- [ ] **New Registration with Verified+ tier**
  1. Register new business
  2. Select "Verified+" plan
  3. Complete registration
  4. Should redirect to Stripe checkout
  5. Complete payment
  6. Verify business has `premium` tier

- [ ] **New Registration with Founder's Bundle**
  1. Register new business
  2. Select "Verified+" plan
  3. Check "Founder's Bundle" option
  4. Complete registration
  5. Should redirect to Stripe checkout (one-time $199)
  6. Complete payment
  7. Verify business has `premium` tier

- [ ] **Upgrade from Settings**
  1. Log in as existing free-tier business
  2. Go to Settings
  3. Click upgrade to Verified
  4. Complete Stripe checkout
  5. Verify tier updated

- [ ] **Manage Subscription**
  1. Log in as paid-tier business
  2. Go to Settings
  3. Click "Manage subscription"
  4. Should open Stripe customer portal
  5. Verify can update payment method

- [ ] **Webhook: Subscription Cancelled**
  1. In Stripe Dashboard, cancel a test subscription
  2. Verify business tier reverts to `basic`

---

## 7. Go Live Checklist

When ready for production:

- [ ] Switch Stripe Dashboard to **Live Mode**
- [ ] Create live products with same pricing
- [ ] Update production environment variables with live keys
- [ ] Create production webhook endpoint
- [ ] Test with real card (can refund immediately)
- [ ] Monitor [Stripe Dashboard](https://dashboard.stripe.com) for transactions

---

## Price Summary

| Tier | Monthly | Annual | Savings |
|------|---------|--------|---------|
| Free (Claimed) | $0 | $0 | - |
| Verified | $29 | $260 | $88/yr (25%) |
| Verified+ | $67 | $620 | $184/yr (23%) |
| Founder's Bundle | $199 one-time | - | First 3 months of V+ |

---

## Troubleshooting

### Webhook not receiving events
1. Check Stripe CLI is running (`stripe listen`)
2. Verify webhook secret matches `.env.local`
3. Check `/api/webhooks/stripe` endpoint is accessible

### Checkout not redirecting
1. Verify all `STRIPE_PRICE_*` env vars are set
2. Check browser console for errors
3. Verify business was created successfully first

### Subscription not updating tier
1. Check webhook logs in Stripe Dashboard
2. Verify `businesses` table has `stripe_customer_id` column
3. Check server logs for webhook handler errors
