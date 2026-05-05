# Boerne's Handy Hub - Project Context

## Supabase Configuration

**Project Name:** Boerneshandyhub.com
**Project ID:** `vaoeflfloctjoqnmtsuw`
**Region:** us-east-1
**Database Host:** db.vaoeflfloctjoqnmtsuw.supabase.co
**Postgres Version:** 17.4

Use the Supabase MCP tools with this project ID for database operations:
```
mcp__claude_ai_Supabase__list_tables
mcp__claude_ai_Supabase__execute_sql
mcp__claude_ai_Supabase__list_migrations
```

## Important Notes

### Supabase Client Usage
- **Browser/Client code:** Use `supabase` from `@/lib/supabase` (anon key, respects RLS)
- **API routes/webhooks:** Use `supabaseAdmin` from `@/lib/supabase` (service role key, bypasses RLS)

### Domain Configuration
- **Canonical domain:** `boerneshandyhub.com` (apex, no www)
- All webhook URLs should use the apex domain
- Environment variables `NEXT_PUBLIC_SITE_URL` and `NEXT_PUBLIC_BASE_URL` should be `https://boerneshandyhub.com`

### External Services

| Service | Dashboard | Notes |
|---------|-----------|-------|
| Stripe | stripe.com/dashboard | Payments, subscriptions |
| Resend | resend.com/emails | Transactional email, newsletters |
| Supabase | supabase.com/dashboard | Database, auth, storage |
| OpenAI | platform.openai.com | Newsletter generation, AI features |
| Vercel | vercel.com | Hosting, deployments |

### Key Environment Variables

See `docs/SERVICES_SETUP.md` for full setup guide.

```bash
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://vaoeflfloctjoqnmtsuw.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
SUPABASE_SERVICE_ROLE_KEY=...

# Stripe
STRIPE_SECRET_KEY=sk_...
STRIPE_WEBHOOK_SECRET=whsec_...

# Resend
RESEND_API_KEY=re_...
RESEND_AUDIENCE_ALL=... (currently using single audience for all segments)

# OpenAI
OPENAI_API_KEY=sk-...
```

## Database Schema

46 tables in the public schema. Key tables:
- `businesses` - Service provider listings (165 rows)
- `subscribers` - Newsletter subscribers (4 rows)
- `newsletter_events` - Email tracking from Resend webhooks
- `profiles` - User profiles with roles (user, business_owner, admin)
- `websites` - Rental websites for Verified+ tier
- `blog_posts` - SEO content and guides

## Pricing Tiers

| Tier | DB Value | Monthly | Features |
|------|----------|---------|----------|
| Free/Claimed | basic | $0 | Basic listing |
| Verified | verified | $29 | Priority placement, badge |
| Verified+ | premium | $67 | + Website rental, unlimited photos |
| Founding Partner | elite | - | Legacy tier |

## Admin Access

Admin authentication uses Supabase Auth with role check against `profiles.role = 'admin'`.
Current admin: mosestx2008@gmail.com
