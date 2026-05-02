# Website System Spec

**Canonical source of truth for the trade-vertical website system that anchors the Verified tier.**

This document covers: architecture, the 5 trade templates, the onboarding flow, moderation and bad-actor prevention, lifecycle behavior, and operational requirements.

Companion to `PRICING_SPEC_V1.md`. The website is what makes Verified worth $49/mo.

---

## 1. Goals & Non-Goals

### Goals (v1)

1. Deliver a real, mobile-first website to every Verified subscriber within 10 minutes of signup.
2. Make every site look professional regardless of the customer's design sense.
3. Concentrate SEO authority on `boerneshandyhub.com` (subpath architecture, not subdomain).
4. Keep operational load per customer under 30 minutes/month at scale.
5. Provide moderation that catches bad actors before publish without making approval feel slow.

### Non-Goals (v1 — defer or never)

- Custom domains (defer — v2 add-on at $20–30/mo)
- Subdomains (defer — v2 add-on at $10–15/mo)
- Customer-uploaded HTML/CSS or any code editing (never)
- Multi-page custom navigation beyond the template (never — keep templates rigid)
- E-commerce, booking systems, payments on customer's site (defer — separate product)
- Events / weddings / personal sites (deferred — Trade only for v1)

---

## 2. Architecture

### Subpath strategy

Every Verified business gets a site at:

```
boerneshandyhub.com/[business-slug]
```

Examples:
- `boerneshandyhub.com/lola-painting-co`
- `boerneshandyhub.com/hill-country-plumbing`
- `boerneshandyhub.com/boerne-handyman-services`

**Why subpath, not subdomain:**

- **SEO authority concentration.** Every approved site adds an indexed page to `boerneshandyhub.com`, compounding domain authority. Subdomains split that authority — Google treats them as somewhat separate properties.
- **Operational simplicity.** No DNS changes, no wildcard SSL provisioning, no per-customer subdomain edge cases. Subpaths are routes in the Next.js app.
- **Graceful degradation on cancel.** When a subscription ends, the URL falls back to a "this listing is no longer active" page that funnels visitors to the category. Subdomain cancellation is uglier (DNS removal, broken bookmarks).
- **Customer perception is fine.** A homeowner reading `boerneshandyhub.com/lola-painting-co` sees "she's listed in the official Boerne directory" — that's *more* trust-equity than an unrecognized subdomain.

Customers who specifically want `lola-painting.com` or `lola-painting.boerneshandyhub.com` get those as paid v2 add-ons.

### Tech stack

Aligned with existing project stack (Next.js + Supabase, per repo `/docs/`):

- **Framework:** Next.js (App Router, server components for site rendering)
- **Hosting:** Vercel
- **Database:** Supabase (Postgres) — extends existing schema
- **Storage:** Supabase Storage for photos, served via Next/Image with on-the-fly resize
- **Image moderation:** Google Cloud Vision API (SafeSearch) — primary
- **Profanity filter:** open-source `bad-words` for v1; can upgrade to Perspective API
- **Phone tracking:** Twilio local numbers
- **Email:** existing transactional provider (Resend / Postmark / whatever the repo currently uses)

### Data model (additive to existing schema)

```sql
-- One website per business in v1
create table websites (
  id uuid primary key default gen_random_uuid(),
  business_id uuid not null references businesses(id),
  template_key text not null,            -- 'plumbing' | 'electrical' | 'painting' | 'landscaping' | 'handyman'
  slug text not null unique,             -- url path, e.g. 'lola-painting-co'
  status text not null default 'draft',  -- 'draft' | 'pending_review' | 'approved' | 'live' | 'flagged' | 'suspended' | 'archived'
  primary_color text,                    -- hex
  accent_color text,
  hero_image_id uuid references photos(id),
  logo_image_id uuid references photos(id),
  tagline text,                          -- ≤80 chars
  about_long text,                       -- 50-500 chars
  services jsonb,                        -- [{name, description, price_range_low, price_range_high}]
  service_area jsonb,                    -- {radius_miles, zip_codes[], cities[]}
  hours jsonb,                           -- {mon: {open, close, closed}, ..., emergency_24_7: bool}
  license_number text,
  license_state text default 'TX',
  insurance_carrier text,
  testimonials jsonb,                    -- [{name, text, rating, date}]
  gallery_image_ids uuid[],
  approved_at timestamptz,
  approved_by uuid references admin_users(id),
  expires_at timestamptz,                -- null while active
  archived_at timestamptz,
  unique (business_id)
);

create table website_edit_history (
  id uuid primary key default gen_random_uuid(),
  website_id uuid not null references websites(id),
  edited_by uuid not null references users(id),
  edited_at timestamptz not null default now(),
  diff jsonb,                            -- fields that changed
  status_after text not null,            -- usually 'pending_review'
  auto_approved boolean default false    -- true if change type bypassed re-review
);

create table photos (
  id uuid primary key default gen_random_uuid(),
  business_id uuid not null references businesses(id),
  url text not null,
  alt_text text,
  uploaded_at timestamptz default now(),
  moderation_status text default 'pending', -- 'pending' | 'approved' | 'flagged' | 'rejected'
  moderation_score jsonb,                -- raw response from Vision API
  moderation_notes text,
  flag_reasons text[]                    -- ['adult', 'violence', 'stock_photo_suspected', ...]
);

create table site_reports (
  id uuid primary key default gen_random_uuid(),
  website_id uuid not null references websites(id),
  reporter_email text,
  reporter_ip text,
  reason text not null,                  -- 'inaccurate' | 'fraud' | 'inappropriate' | 'impersonation' | 'other'
  details text,
  reported_at timestamptz default now(),
  reviewed_at timestamptz,
  reviewed_by uuid references admin_users(id),
  resolution text                        -- 'no_action' | 'warned' | 'edits_required' | 'suspended' | 'removed'
);

create table trademark_watchlist (
  id uuid primary key default gen_random_uuid(),
  protected_term text not null,          -- 'Home Depot', 'Lowe's', 'ServPro', etc.
  match_type text default 'contains',    -- 'exact' | 'contains'
  notes text,
  added_at timestamptz default now()
);
```

---

## 3. Trade Vertical Templates

### Template philosophy

5 templates, each genuinely different — not five color variations of one layout. Each is a Next.js page component with the same data shape, populated from the website record. Customers pick a template at onboarding; it's switchable later from the dashboard.

**Every template is mobile-first.** A homeowner with a clogged toilet is on their phone. The dominant CTA above the fold is always click-to-call.

### The 5 templates

#### Template 1: Plumbing & HVAC (`plumbing`)

**Visual feel:** Clean, urgent, trust-forward.
**Hero block:** Phone number above the fold, prominent "Call Now" button, "Available 24/7" badge if toggled, license number visible.
**Distinctive blocks:**
- Sticky emergency CTA strip (always visible on mobile scroll)
- Service area map
- Common problems they fix (drain cleaning, water heater, leaks, repipes)
- License & insurance prominence
- "What to do while you wait" SEO content block (auto-populated from a per-template content library)

#### Template 2: Electrical (`electrical`)

**Visual feel:** Technical, precise, code-compliant.
**Hero block:** Estimate-focused CTA + emergency call. License prominence.
**Distinctive blocks:**
- Project gallery (panel upgrades, recessed lighting, EV chargers)
- Service categories with residential/commercial toggle
- License & insurance prominence
- Code-compliance language

#### Template 3: Painting & General Contracting (`painting`)

**Visual feel:** Visual-portfolio-heavy, aspirational.
**Hero block:** Portfolio carousel auto-rotating, "Free Estimate" CTA.
**Distinctive blocks:**
- Before/after gallery (paired image component)
- Project type filters (interior, exterior, commercial, cabinets)
- "Our process" 4-step timeline
- Color consultation CTA

#### Template 4: Landscaping & Lawn Care (`landscaping`)

**Visual feel:** Seasonal, recurring, transparent pricing.
**Hero block:** Seasonal photography, recurring service emphasis, "Get a Quote" CTA.
**Distinctive blocks:**
- Pricing transparency (homeowners want ranges — basic mow $X–Y, full maintenance $Y–Z)
- Service tiers (basic mow, full maintenance, design/install)
- Seasonal services calendar
- Service area zip-code list (SEO win)

#### Template 5: Handyman & Multi-Trade (`handyman`)

**Visual feel:** Approachable, broad, "no job too small."
**Hero block:** Services checklist visible, click-to-call dominant.
**Distinctive blocks:**
- Comprehensive services checklist (fence repair, drywall, painting, gutters, etc.)
- "Common jobs" gallery
- Broad service area display
- Pricing model toggle (hourly vs. project)

### Shared components across all templates

- Click-to-call sticky header on mobile
- Hours of operation block
- Address with embedded map
- Photo gallery (lightbox on tap)
- Service list
- Testimonials block
- Contact form (sends to business email + tracked phone option)
- Boerne Verified badge
- "Powered by HandyHub" footer linking to directory
- JSON-LD `LocalBusiness` structured data
- Open Graph + Twitter card meta tags

### Template implementation

Each template lives at `src/templates/[template-key]/index.tsx`. Receives a `website` prop matching the data model, renders fully. Template changes require code review (we don't let customers swap templates without re-publish).

---

## 4. Onboarding Flow

5 steps. Each ≤2 minutes. Total under 10 minutes. Goal: customer fills form → submits for review → site is live within 24 hours.

### Step 1: Pick template

Show 5 cards with previews. Pre-select based on their primary directory category (plumbing → Template 1, electrical → Template 2, etc.) but allow override. Each card shows a thumbnail of the actual rendered template populated with realistic placeholder data — not a wireframe.

### Step 2: Business basics

Pre-populate from claim data:
- Business name (editable)
- Phone (editable, validates US format)
- Address (editable, validates against USPS)
- Primary category (editable, drives template recommendation)
- Website slug (auto-generated from name, editable, validates uniqueness)

New fields:
- Tagline — ≤80 chars, with placeholder example ("Family-owned Boerne plumbers since 2008")
- About paragraph — 50–500 chars, with placeholder showing good copy structure
- License number — required field for trades that need it; field auto-shows based on template
- Insurance carrier — optional, populates a "Licensed & Insured" badge if filled

### Step 3: Services & service area

- **Services:** multi-select from category-relevant predefined list. Plumber sees "drain cleaning, water heaters, leaks, repipes, emergency, water softeners, gas line repair…" Tap to select. Each selected service has an optional 1-line description and price-range slider.
- **Service area:** zip-code multi-select OR radius-from-address slider. Default to "10 miles from your address."
- **Hours of operation:** 7-day grid with quick presets ("M–F 8–5", "M–Sat 7–7", "24/7 emergency", "Custom").
- **24/7 emergency toggle:** when on, drives template behavior (emergency badge, sticky CTA, "Available 24/7" hero text).

### Step 4: Photos & branding

- **Upload up to 5 photos** (drag-drop or tap, multiple at once).
- System auto-resizes to multiple resolutions for responsive serving (1200, 800, 400 wide).
- System auto-converts to WebP with JPEG fallback.
- System runs image moderation API on upload — flagged photos get a red border in the form, with reason ("This photo was flagged as a possible stock photo. You can submit anyway and we'll review.").
- **Brand color picker:** 3 swatches (primary, accent, text-on-brand). Provide 5 trade-appropriate presets ("Trustworthy Blue," "Bold Red," "Earthy Green," "Classic Black," "Custom").
- **Logo upload (optional):** with auto-color-extract option to populate brand color from logo.

### Step 5: Preview & submit

- Side-by-side: edit form on left, live preview on right. Toggle for mobile / desktop view.
- "Submit for Review" button.
- On submit:
  - Status → `pending_review`
  - Email triggered to admin queue with link to review panel
  - Customer sees: "Your site is in review — typically approved within 24 hours. We'll email you when it's live."
  - Customer dashboard shows status badge + estimated review time

---

## 5. Moderation & Approval

### Automated pre-checks (run on submit, before human review)

The system runs a battery of checks before the submission hits the human queue. Anything flagged gets a red flag in the admin panel; clean submissions go to "ready to review" with a green check.

| # | Check | Failure Action |
|---|-------|----------------|
| 1 | Profanity scan on tagline, about, service descriptions, testimonials | Flag (yellow), require admin clear |
| 2 | Image moderation via SafeSearch (adult, violent, racy) | High score = auto-reject; low score = flag |
| 3 | Phone validation — real US number, matches business record | Mismatch = flag, not auto-reject |
| 4 | License format — TX state license number patterns | Format fail = flag |
| 5 | External link scanning — testimonials, about scanned for URLs | Any URL found = flag |
| 6 | Trademark/impersonation — name vs. watchlist | Match = hard-flag, requires senior admin |
| 7 | Duplicate text detection — ≥80% identical text to existing site | Flag |
| 8 | Stock photo detection (Vision API reverse-search) | Flag, not reject |

### Admin review panel

Side-by-side layout:
- **Left:** rendered site preview (mobile by default, desktop toggle)
- **Right:** form data summary, photo grid, automated check results (green/yellow/red per check), notes field, action buttons

Three actions:
- **Approve** → status `approved` → deployed to URL → status `live` → email customer "Your site is live! 🎉"
- **Request Changes** → status `draft`, structured feedback ("Photo 3 flagged: appears to be stock. Please replace.") → email customer
- **Reject** → status `rejected` → email with reason → refund processed if applicable

### What admins watch for in manual review

- Photos that don't match the business (city skylines from somewhere else, stock photos of different trades)
- Contact info mismatches (different name in form vs. on logo or photo)
- Trademark violations or impersonation attempts
- Service claims that require licenses they don't have ("we do electrical" on a handyman site without electrical license)
- Discrimination or exclusionary language
- Misleading guarantees ("100% guaranteed," "best in Boerne," "lowest prices")
- Unverifiable claims ("certified by ____" without proof)

### Edit re-review policy

Customer-initiated edits route through review based on field type:

| Field changed | Re-review required? | Reason |
|---|---|---|
| Hours of operation | No | Low-risk, autopublish |
| Brand color, template choice | No | Low-risk, autopublish |
| Services list, descriptions | Yes | Text moderation re-runs; only flagged hit human |
| Tagline, about | Yes | Text moderation re-runs; only flagged hit human |
| Photos | Yes | Image moderation re-runs automatically; only flagged photos hit human review |
| Phone, address | Yes | Could be impersonation hijack — always human review |
| License number | Yes | Always human review |
| Business name | Yes | Always human review (trademark exposure) |

For trusted customers (≥6 months on platform, zero flags), graduate to "auto-publish all edits" with passive image moderation only.

---

## 6. Bad Actor Prevention

The combination of automated pre-checks + manual admin review catches the majority of bad submissions at signup. But moderation is ongoing, not one-shot.

### Post-publish monitoring

1. **Customer reports.** Every public site has a small "Report this listing" link in the footer. Reports go to admin queue, route to a flagged-listings view. Repeat reports auto-escalate.
2. **Review monitoring.** If reviews on the directory page contain language suggesting fraud, no-show, or unlicensed work, flag the listing for admin review.
3. **Quarterly verification refresh.** Every 90 days, the system asks the business via email to confirm hours, phone, services. License numbers re-validated against TX state databases where APIs exist.
4. **Anomaly detection.** Sudden 3x spike in form submissions to a listing → flag (potential scam funnel). Sudden change in business name → flag. Sudden change in primary contact email → flag.

### Kill switch

Every site has a one-click admin action: **Suspend.**

When suspended:
- Site URL serves a "This listing is temporarily unavailable" page (404-equivalent for visitors, not deleted)
- Listing on the directory shows muted styling with "Under Review" badge (or removed entirely depending on severity)
- Subscription billing pauses immediately
- Admin notes field captures the reason
- Customer receives email: "Your listing has been temporarily suspended pending review. Please contact support."

Suspended sites are NOT deleted. Restoration is one click. Deletion is a separate, irreversible action with confirm-twice UX.

### Trademark / impersonation handling

- Maintain a watchlist of national chain names ("Home Depot," "Lowe's," "ServPro," "Mr. Rooter," etc.) in the `trademark_watchlist` table
- Submission name match against watchlist → automatic hard-flag, requires elevated admin approval
- DMCA-style takedown process documented for trademark holders to report. Form lives at `boerneshandyhub.com/legal/takedown`
- Response time SLA: 48 hours for takedown review

### Photo moderation specifics

- Adult/violent/racy content via SafeSearch → auto-reject above threshold
- Stock photo detection → flag, not reject (some legitimate use exists, but raise scrutiny)
- Visible watermarks → flag (probable copyright violation)
- Logos of competitors / unrelated brands in photos → flag during human review
- Photos with people require an inferred-consent check (admin sanity check that subjects appear to be the business's own staff/customers, not random pulled images)

### Reputation flags

A business that accumulates flags (3+ verified complaints in 6 months, any fraud allegation, license expiration) gets:
- Verified badge revoked
- "Under Review" overlay on listing
- Account frozen pending resolution
- Email + phone outreach from us before any public action

---

## 7. Lifecycle: Edits, Cancellation, Sunset

### Active subscription
- Customer can edit anytime through dashboard
- Edits route through re-review per the policy above
- Quarterly verification refresh email sent

### Subscription paused (failed payment)
- Days 1–7 grace: site stays live, email reminder to update payment
- Days 7–14: site stays live, dashboard shows yellow "Payment issue — please update" banner
- Day 14: site URL redirects to "This page is temporarily unavailable" notice with claim CTA
- Day 30: status → `archived`, listing reverts to Claimed tier (free) on directory

### Customer-initiated cancellation
- Customer chooses end-of-billing-cycle (default) or immediate
- End-of-cycle: site stays live until paid period ends, then redirects gracefully
- Immediate: site URL immediately redirects, prorated refund processed
- All site data archived for 90 days for easy restoration

### Graceful sunset URL behavior

When a site is no longer live (cancelled, paused-out, archived), the URL `boerneshandyhub.com/[slug]` serves:

```
This [Business Name] listing is no longer active.

Looking for [Category] in Boerne? Browse verified providers →
[CTA: View [Category] in Boerne]
```

Preserves SEO breadcrumbs. Gives the visitor a useful next action. Doesn't 404 or hard-redirect to homepage.

### Restoration

If customer returns within 90 days, archived data restores intact — they pick up where they left off. After 90 days, archived data goes to cold storage (recoverable for 1 year via admin action), and the slug becomes available for reuse by another business.

---

## 8. SEO Considerations

The whole point of the subpath architecture is SEO compounding. Make it real:

- Every site emits JSON-LD `LocalBusiness` schema with full business details
- `sitemap.xml` automatically includes all approved sites (regenerated daily)
- Each site has a unique `<title>` and meta description (auto-generated from tagline + category + location, editable in dashboard)
- `robots.txt` allows full crawling of all approved sites
- **Site speed budget:** <2.5s LCP on 4G mobile (enforced via Vercel performance budget — sites that fail get flagged for image optimization)
- **Internal linking:** every site links to its category page; category page links back to top sites; directory homepage features rotating sites
- **Image alt text required** on all photos (form-enforced at submission)
- Each customer site adds an indexed page to `boerneshandyhub.com`, growing domain authority compounding with every customer

---

## 9. Operational Costs & Margins

### Per Verified customer per month (direct costs)

| Cost | Amount |
|------|--------|
| Hosting (Vercel) | ~$0.05 |
| Storage (Supabase, 5–15 photos × ~5MB) | ~$0.10 |
| Twilio tracked number ($1.15) + ~$0.50 minutes | ~$1.65 |
| Image moderation API (Vision) | ~$0.05 |
| Stripe fees on $49 (2.9% + $0.30) | ~$1.72 |
| **Total direct COGS** | **~$3.57** |
| **Gross margin** | **~$45.43 / $49 = 92.7%** |

### Operational time per customer per month (target)

- 0 hours for ~95% of customers (autopilot)
- Heavy support load concentrated in ~5% of customers
- Average across all: ~30 min/customer/month

### At scale projections

| Customer count | Monthly direct revenue | COGS | Ops hours/mo |
|----------------|-----------------------|------|--------------|
| 25 | $1,225 | $89 | ~12 |
| 75 | $3,675 | $268 | ~38 |
| 150 | $7,350 | $536 | ~75 |
| 300 | $14,700 | $1,071 | ~150 |

The 300-customer scenario requires real ops staffing (1 FTE equivalent for support + moderation). Plan staffing around 150-customer milestone.

---

## 10. Implementation Phases

### Phase 0: Pre-launch (weeks 0–2)
- Build 1 template (start with **Handyman** — broadest applicability, most forgiving for first version)
- Build intake form, all 5 steps
- Build admin review panel
- Implement automated pre-checks (profanity, image moderation, phone validation)
- Wire image moderation API
- Build sunset/redirect handler for cancelled sites
- Internal QA: founder + 1–2 friendly trades sign up end-to-end

### Phase 1: Soft launch (weeks 3–6)
- Open to 5–10 charter customers at $29/mo charter pricing (discount from $49 — earned by being early)
- Manually onboard each (treat as concierge to surface bugs)
- Iterate template based on real customer pain
- Launch second template (**Plumbing/HVAC** — likely highest demand)

### Phase 2: Public launch (weeks 7–12)
- Pricing page goes live at $49 (charter customers grandfathered at $29)
- Templates 3–5 (Painting, Landscaping, Electrical) ship
- Marketing kicks in (separate doc — TBD)
- Target: 25 paying customers by week 12

### Phase 3: Optimization (months 4–6)
- Monitor support load per customer; identify common pain points
- Add subdomain add-on ($10–15/mo) if demand exists
- Add custom domain add-on ($20–30/mo) if demand exists
- Begin tracking trigger metrics for v2 Verified Plus launch (see `PRICING_SPEC_V1.md`)

---

## 11. Open Questions

These should be resolved before Phase 0 code begins:

1. **Slug collision policy.** First-come-first-served, or reserve common ones? *Recommend: FCFS with a reserved-name list of major TX trade chain names + generic-trade-name reservations like "boerne-plumbing", "boerne-handyman".*
2. **Logo handling.** Accept any format, or require PNG/SVG? *Recommend: accept JPEG/PNG/SVG, server-side convert to optimized WebP.*
3. **Testimonial verification.** Require any proof, or trust submitted text? *Recommend: trust on submission for v1, allow public flagging via the report-this-listing path.*
4. **License number verification source.** TX state license database has APIs for some trades, manual lookup for others. *Recommend: API where available, manual on first-review otherwise. Build verification adapter pattern so we can add APIs over time.*
5. **Multi-language.** Spanish-language templates for primarily Hispanic customer bases? *Recommend: defer to Phase 3+. Boerne is ~13% Hispanic; demand exists but not Phase 0 critical.*
6. **Existing-website customers.** What about businesses that already have a website? Do we discount? *Recommend: same price, position as "your verified-and-trusted-here site." Many SMBs are happy with two web presences. The HandyHub site is the one their Boerne neighbors will find via the directory.*
7. **Editing freeze during review.** Can customers continue editing while in `pending_review`, or is the form locked? *Recommend: locked with read-only preview during review; "Withdraw and edit" button if they need to make changes.*
8. **Photo licensing reps & warranties.** Do we make customers explicitly attest they own / have rights to photos? *Recommend: yes, checkbox at submission with terms language. Helps on DMCA defense.*

---

## 12. Code Tasks (Phase 0)

In rough dependency order:

1. **Schema migration:** add `websites`, `website_edit_history`, `photos`, `site_reports`, `trademark_watchlist` tables to Supabase.
2. **Slug uniqueness + reserved-name list** in business setup flow.
3. **Photo upload pipeline:** Supabase Storage, Vision API moderation, auto-resize, WebP conversion.
4. **Template 1 (Handyman):** `src/templates/handyman/index.tsx` reading from `websites` row.
5. **Onboarding wizard:** 5-step form at `/dashboard/website/setup`, persisting to `websites` table.
6. **Admin review panel:** `/admin/websites/queue` with side-by-side preview + form data + check results.
7. **Approval workflow:** state machine (`draft` → `pending_review` → `approved`/`rejected`/`changes_requested`).
8. **Public site renderer:** route `/[slug]` resolves the website record and renders the appropriate template.
9. **Sunset/redirect handler:** archived/cancelled sites serve the graceful-degradation page.
10. **Edit re-review router:** field-type-aware re-review trigger.
11. **Kill switch:** admin one-click suspend with audit log.
12. **Reporting form:** public-facing `/report?site=[slug]` route → `site_reports` queue.
13. **Sitemap + JSON-LD:** auto-generated for all approved sites.
14. **Performance budget enforcement:** Vercel config + image optimization defaults.
