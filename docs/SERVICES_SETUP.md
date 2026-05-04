# External Services Setup Guide

Complete guide for configuring all external services for Boerne's Handy Hub.

---

## Table of Contents

1. [Environment Variables Overview](#environment-variables-overview)
2. [Stripe Setup](#stripe-setup)
3. [Resend Setup](#resend-setup)
4. [Supabase Setup](#supabase-setup)
5. [OpenAI Setup](#openai-setup)
6. [Google Places API](#google-places-api)
7. [Vercel Deployment](#vercel-deployment)

---

## Environment Variables Overview

Create a `.env.local` file in the root directory with these variables:

```bash
# ===================
# SUPABASE
# ===================
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
SUPABASE_SERVICE_ROLE_KEY=eyJ...

# ===================
# STRIPE
# ===================
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...

# Stripe Price IDs (create these in Stripe Dashboard)
STRIPE_PRICE_VERIFIED_MONTHLY=price_...
STRIPE_PRICE_VERIFIED_ANNUAL=price_...
STRIPE_PRICE_VERIFIED_PLUS_MONTHLY=price_...
STRIPE_PRICE_VERIFIED_PLUS_ANNUAL=price_...
STRIPE_PRICE_FOUNDERS_BUNDLE=price_...

# ===================
# RESEND
# ===================
RESEND_API_KEY=re_...
RESEND_WEBHOOK_SECRET=whsec_...

# Resend Audience IDs
RESEND_AUDIENCE_ALL=aud_...
RESEND_AUDIENCE_HOMEOWNERS=aud_...
RESEND_AUDIENCE_BUSINESSES=aud_...
RESEND_AUDIENCE_REALTORS=aud_...

# ===================
# OPENAI
# ===================
OPENAI_API_KEY=sk-...

# ===================
# GOOGLE
# ===================
GOOGLE_PLACES_API_KEY=AIza...

# ===================
# SITE CONFIG
# ===================
NEXT_PUBLIC_SITE_URL=https://boerneshandyhub.com
NEXT_PUBLIC_BASE_URL=https://boerneshandyhub.com
```

---

## Stripe Setup

### Step 1: Create Stripe Account

1. Go to [stripe.com](https://stripe.com) and create an account
2. Complete business verification (can use test mode while pending)

### Step 2: Get API Keys

1. Go to **Developers > API keys**
2. Copy your keys:
   - **Test mode**: `sk_test_...` (purple test mode banner visible)
   - **Live mode**: `sk_live_...` (switch off test mode toggle)

```bash
# For development/testing
STRIPE_SECRET_KEY=sk_test_51ABC123...

# For production (Vercel)
STRIPE_SECRET_KEY=sk_live_51ABC123...
```

### Step 3: Create Products & Prices

Go to **Products** in Stripe Dashboard and create:

#### Product 1: Verified Membership ($29/month)

1. Click **Add Product**
2. Name: `Verified Membership`
3. Description: `Priority placement, verified badge, and enhanced profile`
4. Add two prices:
   - **Monthly**: $29.00/month, recurring
   - **Annual**: $290.00/year, recurring (save ~$58)
5. Copy the Price IDs (click on price, find `price_...` in URL or details)

```bash
STRIPE_PRICE_VERIFIED_MONTHLY=price_1ABC...
STRIPE_PRICE_VERIFIED_ANNUAL=price_1DEF...
```

#### Product 2: Verified+ Membership ($67/month)

1. Click **Add Product**
2. Name: `Verified+ Membership`
3. Description: `Everything in Verified plus website rental, unlimited photos`
4. Add two prices:
   - **Monthly**: $67.00/month, recurring
   - **Annual**: $670.00/year, recurring (save ~$134)
5. Copy the Price IDs

```bash
STRIPE_PRICE_VERIFIED_PLUS_MONTHLY=price_1GHI...
STRIPE_PRICE_VERIFIED_PLUS_ANNUAL=price_1JKL...
```

#### Product 3: Founder's Bundle (Optional)

1. Click **Add Product**
2. Name: `Founder's Bundle`
3. Description: `3 months of Verified+ for the price of 2`
4. Add one price:
   - **One-time**: $134.00 (2x $67)
5. Copy the Price ID

```bash
STRIPE_PRICE_FOUNDERS_BUNDLE=price_1MNO...
```

### Step 4: Configure Webhook

Webhooks notify your app when payments succeed, subscriptions change, etc.

#### For Local Development (using Stripe CLI)

1. Install Stripe CLI: https://stripe.com/docs/stripe-cli
   ```bash
   brew install stripe/stripe-cli/stripe
   ```

2. Login to Stripe:
   ```bash
   stripe login
   ```

3. Forward webhooks to localhost:
   ```bash
   stripe listen --forward-to localhost:3000/api/webhooks/stripe
   ```

4. Copy the webhook signing secret it displays:
   ```bash
   STRIPE_WEBHOOK_SECRET=whsec_abc123...
   ```

#### For Production (Vercel)

1. Go to **Developers > Webhooks**
2. Click **Add endpoint**
3. Endpoint URL: `https://boerneshandyhub.com/api/webhooks/stripe`
4. Select events to listen to:
   - `checkout.session.completed`
   - `customer.subscription.created`
   - `customer.subscription.updated`
   - `customer.subscription.deleted`
   - `invoice.paid`
   - `invoice.payment_failed`
5. Click **Add endpoint**
6. Click on the endpoint, then **Reveal** signing secret
7. Copy to Vercel environment variables

```bash
STRIPE_WEBHOOK_SECRET=whsec_live_abc123...
```

### Step 5: Configure Customer Portal

1. Go to **Settings > Billing > Customer portal**
2. Enable the portal
3. Configure allowed actions:
   - Allow customers to update payment methods: **Yes**
   - Allow customers to cancel subscriptions: **Yes**
   - Allow customers to switch plans: **Yes** (optional)
4. Save changes

### Test Mode Checklist

- [ ] Created Verified product with monthly/annual prices
- [ ] Created Verified+ product with monthly/annual prices
- [ ] Created Founder's Bundle product (optional)
- [ ] Webhook endpoint added for localhost (via Stripe CLI)
- [ ] Test keys in `.env.local`
- [ ] Customer portal configured

### Live Mode Checklist

- [ ] All products created in live mode (or copied from test)
- [ ] Webhook endpoint added for production URL
- [ ] Live keys in Vercel environment variables
- [ ] Customer portal configured in live mode

---

## Resend Setup

Resend handles transactional emails and newsletters.

### Step 1: Create Resend Account

1. Go to [resend.com](https://resend.com) and sign up
2. Verify your email

### Step 2: Add & Verify Domain

1. Go to **Domains**
2. Click **Add Domain**
3. Enter: `boerneshandyhub.com`
4. Add the DNS records shown to your domain registrar:
   - SPF record (TXT)
   - DKIM records (CNAME)
   - Optional: DMARC record
5. Click **Verify** (may take a few minutes)

### Step 3: Get API Key

1. Go to **API Keys**
2. Click **Create API Key**
3. Name: `Production` or `Development`
4. Permission: **Full access**
5. Copy the key (starts with `re_`)

```bash
RESEND_API_KEY=re_abc123...
```

### Step 4: Create Audiences

Audiences are used for newsletter subscribers.

1. Go to **Audiences**
2. Create these audiences:

| Audience Name | Purpose | Env Variable |
|---------------|---------|--------------|
| All Subscribers | Everyone | `RESEND_AUDIENCE_ALL` |
| Homeowners | Residential subscribers | `RESEND_AUDIENCE_HOMEOWNERS` |
| Businesses | Business owners | `RESEND_AUDIENCE_BUSINESSES` |
| Realtors | Real estate professionals | `RESEND_AUDIENCE_REALTORS` |

3. Copy each Audience ID (click audience, find ID in URL or details)

```bash
RESEND_AUDIENCE_ALL=aud_abc123...
RESEND_AUDIENCE_HOMEOWNERS=aud_def456...
RESEND_AUDIENCE_BUSINESSES=aud_ghi789...
RESEND_AUDIENCE_REALTORS=aud_jkl012...
```

### Step 5: Configure Webhook (Optional)

For tracking email opens, clicks, bounces:

1. Go to **Webhooks**
2. Click **Add Webhook**
3. Endpoint: `https://boerneshandyhub.com/api/webhooks/resend`
4. Select events:
   - `email.delivered`
   - `email.opened`
   - `email.clicked`
   - `email.bounced`
   - `email.complained`
5. Copy the signing secret

```bash
RESEND_WEBHOOK_SECRET=whsec_resend_abc123...
```

### Email Sending Limits

- **Free tier**: 100 emails/day, 3,000/month
- **Pro tier**: 50,000 emails/month ($20/month)

### Resend Checklist

- [ ] Domain added and verified
- [ ] API key created
- [ ] All 4 audiences created
- [ ] Audience IDs in environment variables
- [ ] Webhook configured (optional)

---

## Supabase Setup

Supabase provides the database and authentication.

### Step 1: Create Project

1. Go to [supabase.com](https://supabase.com)
2. Create new project
3. Choose region closest to users (e.g., `us-east-1`)
4. Set a strong database password (save it somewhere secure)

### Step 2: Get Connection Details

1. Go to **Settings > API**
2. Copy:
   - **Project URL**: `https://abc123.supabase.co`
   - **anon/public key**: `eyJ...` (safe for client-side)
   - **service_role key**: `eyJ...` (server-side only, keep secret!)

```bash
NEXT_PUBLIC_SUPABASE_URL=https://abc123.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### Step 3: Run Migrations

The database schema is in `/database/` folder. Run migrations via Supabase dashboard SQL editor or CLI.

### Step 4: Configure Auth

1. Go to **Authentication > Providers**
2. Enable **Email** provider
3. Configure email templates (optional)

### Step 5: Set Up Storage Buckets

1. Go to **Storage**
2. Create buckets:
   - `business-photos` - Public, for business profile photos
   - `website-photos` - Public, for rental website photos
   - `blog-images` - Public, for blog post images

### Supabase Checklist

- [ ] Project created
- [ ] API keys copied to env vars
- [ ] Database migrations run
- [ ] Email auth enabled
- [ ] Storage buckets created

---

## OpenAI Setup

Used for newsletter generation and AI content improvement.

### Step 1: Create Account

1. Go to [platform.openai.com](https://platform.openai.com)
2. Sign up or log in

### Step 2: Get API Key

1. Go to **API Keys**
2. Click **Create new secret key**
3. Name: `boerneshandyhub`
4. Copy the key (you won't see it again!)

```bash
OPENAI_API_KEY=sk-proj-abc123...
```

### Step 3: Set Usage Limits (Recommended)

1. Go to **Settings > Limits**
2. Set a monthly budget limit to avoid surprises
3. Enable email notifications for usage alerts

### Cost Estimate

- Newsletter generation uses `gpt-4o-mini`: ~$0.01-0.05 per newsletter
- Content improvement: ~$0.01 per request

### OpenAI Checklist

- [ ] Account created
- [ ] API key generated
- [ ] Usage limits configured
- [ ] Key added to environment variables

---

## Google Places API

Used for fetching business reviews and place details.

### Step 1: Create Google Cloud Project

1. Go to [console.cloud.google.com](https://console.cloud.google.com)
2. Create new project: `boerneshandyhub`

### Step 2: Enable APIs

1. Go to **APIs & Services > Library**
2. Enable these APIs:
   - Places API
   - Places API (New)

### Step 3: Create API Key

1. Go to **APIs & Services > Credentials**
2. Click **Create Credentials > API Key**
3. Click on the key to configure restrictions:
   - **Application restrictions**: HTTP referrers
   - Add: `boerneshandyhub.com/*` and `localhost:3000/*`
   - **API restrictions**: Restrict to Places API

```bash
GOOGLE_PLACES_API_KEY=AIzaSyAbc123...
```

### Cost Estimate

- Places Details: $17 per 1,000 requests
- Place Search: $32 per 1,000 requests
- Consider caching results to reduce costs

### Google Places Checklist

- [ ] Google Cloud project created
- [ ] Places API enabled
- [ ] API key created with restrictions
- [ ] Key added to environment variables

---

## Vercel Deployment

### Adding Environment Variables to Vercel

1. Go to your project in [vercel.com](https://vercel.com)
2. Click **Settings > Environment Variables**
3. Add each variable:

| Variable | Environment | Notes |
|----------|-------------|-------|
| `NEXT_PUBLIC_SUPABASE_URL` | All | Public, same for all |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | All | Public, same for all |
| `SUPABASE_SERVICE_ROLE_KEY` | All | Secret, same for all |
| `STRIPE_SECRET_KEY` | Production | Use `sk_live_...` |
| `STRIPE_SECRET_KEY` | Preview/Development | Use `sk_test_...` |
| `STRIPE_WEBHOOK_SECRET` | Production | Production webhook secret |
| `RESEND_API_KEY` | All | Same for all |
| `OPENAI_API_KEY` | All | Same for all |
| `GOOGLE_PLACES_API_KEY` | All | Same for all |
| `NEXT_PUBLIC_SITE_URL` | Production | `https://boerneshandyhub.com` |
| `NEXT_PUBLIC_SITE_URL` | Preview | `https://preview.boerneshandyhub.com` |

### Redeploy After Adding Variables

After adding/changing environment variables:

1. Go to **Deployments**
2. Click the `...` menu on latest deployment
3. Click **Redeploy**

### Environment Variable Tips

- **Production vs Preview**: Use different Stripe keys for production (live) vs preview (test)
- **Secrets**: Never commit `.env.local` to git
- **Updates**: Redeploy after changing any environment variable

---

## Quick Reference: All Environment Variables

```bash
# Supabase (Required)
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=

# Stripe (Required for payments)
STRIPE_SECRET_KEY=
STRIPE_WEBHOOK_SECRET=
STRIPE_PRICE_VERIFIED_MONTHLY=
STRIPE_PRICE_VERIFIED_ANNUAL=
STRIPE_PRICE_VERIFIED_PLUS_MONTHLY=
STRIPE_PRICE_VERIFIED_PLUS_ANNUAL=
STRIPE_PRICE_FOUNDERS_BUNDLE=

# Resend (Required for emails)
RESEND_API_KEY=
RESEND_WEBHOOK_SECRET=
RESEND_AUDIENCE_ALL=
RESEND_AUDIENCE_HOMEOWNERS=
RESEND_AUDIENCE_BUSINESSES=
RESEND_AUDIENCE_REALTORS=

# OpenAI (Required for AI features)
OPENAI_API_KEY=

# Google (Optional, for reviews)
GOOGLE_PLACES_API_KEY=

# Site Config
NEXT_PUBLIC_SITE_URL=https://boerneshandyhub.com
NEXT_PUBLIC_BASE_URL=https://boerneshandyhub.com
```

---

## Troubleshooting

### Stripe Webhook Not Receiving Events

1. Check webhook endpoint URL is correct
2. Verify webhook is in correct mode (test vs live)
3. Check Vercel function logs for errors
4. Use Stripe CLI to test locally: `stripe trigger checkout.session.completed`

### Resend Emails Not Sending

1. Verify domain is properly verified (all DNS records green)
2. Check API key has full access permissions
3. Check Resend dashboard for failed deliveries
4. Verify "from" email uses your verified domain

### Supabase Connection Issues

1. Check URL and keys are correct
2. Verify RLS policies allow the operation
3. Check Supabase dashboard for error logs

### Build Failures

1. All environment variables must be set (even if empty string for optional ones)
2. Stripe/Resend can be empty for builds, but features won't work
3. Check Vercel build logs for specific errors

---

## Security Notes

1. **Never commit secrets**: Keep `.env.local` in `.gitignore`
2. **Use test keys for development**: Prevents accidental charges
3. **Rotate keys if exposed**: Generate new keys immediately
4. **Restrict API keys**: Use domain/IP restrictions where possible
5. **Monitor usage**: Set up billing alerts for all services
