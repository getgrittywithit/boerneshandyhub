# BoernesHandyHub Pricing Spec

**Canonical source of truth for pricing tiers, features, and visual treatment.**
Both `PricingSection.tsx` and `serviceCategories.ts` should read from a single config (`src/data/pricingTiers.ts` or `src/config/pricing.ts`). Do not let tier definitions drift between files.

---

## Tier Overview

| # | Tier Name | Price | Job to Be Done | Capacity |
|---|-----------|-------|----------------|----------|
| 0 | Unclaimed | Free (we add) | "Does this business exist?" | Unlimited |
| 1 | Claimed | Free (they claim) | "Here's our info" | Unlimited |
| 2 | Verified | $29/mo · $290/yr | "Be Listed" | Unlimited |
| 3 | Verified Plus | $79/mo · $790/yr | "Be More Visible" | Unlimited |
| 4 | Partner | $249/mo · $2,490/yr | "Be Marketed" | **One per category** |

Annual pricing = ~17% discount (2 months free). Locks revenue, reduces churn.

The two-paid-tier-with-exclusivity model (Verified Plus volume + Partner exclusivity) deliberately mirrors The Boerne Life's structure but uses the directory itself as the anchor asset rather than daily editorial.

---

## Tier 0 — Unclaimed

**Cost:** Free (we add them from public data)
**Question it answers:** "Does this business exist?"

### What they get
- Business name
- Phone number
- Address
- Category placement

### Visual treatment (intentionally incomplete)
- Grayscale or placeholder photo (silhouette icon)
- Missing fields shown as gray dashes "—" (not hidden)
- "Profile not verified" tag
- Banner: "Are you the owner? Claim this listing free →"
- Sorts to bottom of category by default
- Muted card styling (lower contrast, no border highlight)

### Strategic note
The empty profile next to filled-out competitors is the point. Shame factor drives claims. Don't be subtle.

---

## Tier 1 — Claimed (Free)

**Cost:** Free (they claim it)
**Question it answers:** "Here's our info."

### What they get (everything in Unclaimed, plus)
- 1 photo
- Business description (they write)
- Hours of operation
- Website link
- Social media links
- Edit access via business dashboard

### Visual treatment
- Full color, normal card styling
- Subtle "Listed" tag (no fancy badge)
- Standard category sort position

### Strategic note
This tier exists to capture email. Everything else is bait. Once we have email, the upgrade nurture sequence begins.

---

## Tier 2 — Verified ($29/mo)

**Cost:** $29/month or $290/year
**Question it answers:** "Be Listed properly."

### What they get (everything in Claimed, plus)
- ✓ **Boerne Verified** badge (we verify address + license/insurance)
- Up to 5 photos
- Listed in up to 2 categories
- Tracked phone number with call analytics
- Profile views/clicks dashboard
- Special offers/coupons section
- Review request tools (sends review-ask emails to their customers)
- Priority placement above unverified businesses in category

### Visual treatment
- Green "Boerne Verified" checkmark badge prominent on card and profile
- Slight accent border or highlight color
- Sorts above all free listings in category

### Strategic note
The badge is the *output* of verification, not a self-declaration. Verification is labor on our side, which is why it lives behind the paywall. Marketing line for consumer side: "Look for the green checkmark — these are verified Boerne businesses."

---

## Tier 3 — Verified Plus ($79/mo)

**Cost:** $79/month or $790/year
**Question it answers:** "Be More Visible."

### What they get (everything in Verified, plus)
- ✓✓ **Verified Plus** badge variation
- Sponsored boost — appears above other Verified businesses in category (below Partner)
- Up to 15 photos (vs 5 at Verified)
- Listed in up to 4 categories (vs 2)
- Auto-share to our social channels when they post a special offer (automated)
- Inclusion in monthly "Boerne Local Spotlight" newsletter section (group of 5-10 businesses, rotating)
- Up to 3 active special offers at once
- Monthly performance email
- Priority email support

### Visual treatment
- "Verified Plus" badge — same green as Verified but with a "+" or upgraded design
- Slightly elevated card styling (subtle shadow, larger photo)
- Sorts above Verified, below Partner in category

### What is NOT included (preserved exclusively for Partner)
- ❌ Industry exclusivity / Partner designation
- ❌ Solo social media posts
- ❌ Solo newsletter features
- ❌ Welcome packet inclusion
- ❌ Custom landing page
- ❌ Blog spotlights
- ❌ Strategy call

### Strategic note
This is the volume-and-visibility tier. Critical that it does NOT include any "active marketing" services — those stay at Partner to protect the price gap and the exclusivity moat.

---

## Tier 4 — Partner ($249/mo, ONE PER CATEGORY)

**Cost:** $249/month or $2,490/year
**Question it answers:** "Be Marketed."

### What they get (everything in Verified Plus, plus)
- 🏆 **Boerne [Category] Partner** badge — only one per category
- Top-of-category placement, guaranteed
- Unlimited photos + 1 video embed
- Up to 5 categories (one Partner slot per category)
- **Monthly solo social media post** (our accounts, dedicated to them)
- **Monthly newsletter feature** (not quarterly — monthly)
- **Quarterly blog feature / vendor spotlight**
- Homepage carousel rotation
- **Welcome packet inclusion** (realtor + title company partnerships)
- Custom branded landing page on the directory
- Quarterly performance review call with you
- Priority phone support

### Visual treatment
- Gold/amber accent and "Boerne [Category] Partner" ribbon
- Larger card layout in category lists
- Homepage carousel inclusion
- Distinct profile page design with category branding

### How exclusivity works (FAQ for sales)
- "Exclusivity" does NOT mean other businesses get removed from the site.
- It means only one business per category can hold the Partner designation, the badge, and the dedicated marketing services.
- Other businesses in the same category can still be at Verified ($29) or Verified Plus ($79). They appear in the category, just below the Partner.
- If a second business in the same category wants to become Partner, they cannot — they wait for the current Partner's contract to lapse, or they stay at a lower tier.
- Scarcity is what makes the tier valuable. It also creates urgency in sales conversations.

### Capacity ceiling
- HandyHub: ~25 sub-categories = 25 Partner slots
- FamilyHub: ~73 sub-categories = 73 Partner slots
- Combined ceiling: ~98 Partner slots
- Realistic mature-state fill: 50-60% of slots = 50-60 Partners
- Full sellout MRR from Partner alone: 98 × $249 = $24,402/mo

---

## The Three-Tier Sales Frame

The conceptual line that protects each tier from cannibalizing the next:

- **Verified ($29) = "Be Listed."** Properly listed business with the trust badge. Digital Yellow Pages ad equivalent.
- **Verified Plus ($79) = "Be More Visible."** Listed prominently, more photos, group features. Like a Yellow Pages display ad — bigger, but not yet a marketing service.
- **Partner ($249) = "Be Marketed."** We actively put them in front of people. Solo social, solo newsletter, welcome packets, exclusivity. A marketing-team-in-a-box.

Each tier answers a different question for the buyer. Three tiers feels overwhelming when each is described as a feature dump. It feels obvious when each answers a different question.

---

## Why Lead Generation is NOT Included

Deliberate decision. Selling leads creates a different (and worse) business:
- Disputes, refunds, lead-quality arbitration
- Adversarial economics with paying customers
- Pulls brand toward Angi/Thumbtack territory (the thing we're explicitly not)

Instead, we offer **tracked attention**: tracked phone number, click counts, profile views, contact form sends an email directly to the business. Analytics, not brokering.

Replacement value at higher tiers comes from **distribution we control**: sponsored boost, newsletter inclusion (group at V+, solo at Partner), welcome packets, social spotlights, blog features. These are defensible, scale appropriately to operations, and cost almost nothing per-customer to deliver once channels exist.

---

## Operational Deliverability

Each tier's deliverables must scale to its expected customer count:

| Tier | Customers (mature) | Solo content per customer | Monthly content load |
|------|-------------------|----------------------------|----------------------|
| Verified | 300+ | None — fully automated | 0 hours |
| Verified Plus | 100-200 | None — group features only | 1-2 hours/month (one group spotlight piece) |
| Partner | 25-60 (capped) | Monthly social + monthly newsletter + quarterly blog | 12-15 hours/week at full sellout |

The Partner cap by category count is what makes the model deliverable. If Partner had unlimited capacity at $249, content production would scale linearly with customers and break the operation.

---

## Pricing Page Presentation (UX Notes)

Three tiers can feel overwhelming if presented as a feature matrix. Use this approach:

1. **Three cards, not a feature dump.** Each card gets 4-5 bullets and one sentence describing who it's for. Put the full comparison table behind a "Compare all features" link.
2. **Anchor the middle.** Mark Verified Plus ($79) as "Most Popular" with a colored ribbon. Decoy effect makes Verified feel basic and Partner feel premium, while V+ reads as the smart default.
3. **Mark Partner as scarce.** "Limited — one per category" tag. Creates urgency, justifies the price, explains why it's not for everyone.
4. **Three job-to-be-done headlines.** "Be Listed" / "Be More Visible" / "Be Marketed." Tells them which fits in two seconds.

---

## Category Count UX (X of Y indicator)

The category cap exists on every paid tier (Verified = 2, Verified Plus = 4, Partner = 5). This section specifies how to make that cap visible to the buyer so it converts to upgrade revenue instead of silently capping behavior.

The principle: **a cap that no one sees is a downgrade trap, not an upgrade lever.** Surface it. Mailchimp- and HubSpot-style usage meters drive upgrades. Yelp- and Angi-style hidden caps drive static usage and silent churn.

### Where the indicator appears

1. **Business dashboard — Categories panel.** Top of the categories management screen. Shows `Categories: X of Y` with a progress bar. When `X = Y`, the "Add category" button is disabled and a tooltip reads: *"You've reached your category limit. Upgrade to Verified Plus to add 2 more."*

2. **Listing edit form — Category picker.** While the owner is selecting categories, show a running counter at the top of the picker: *"X of Y selected."* Available categories appear normally. Once at cap, remaining unselected categories appear grayed out, each with a small inline link: *"Upgrade to add."*

3. **Pricing page comparison cards.** Each tier's card surfaces *"Listed in up to N categories"* in the top three visible bullets — not buried in the comparison table.

4. **Listing public profile (admin/edit view only).** Small badge in the dashboard preview rail: *"3 of 4 categories used."*

### Visual states

| State | Treatment | Copy |
|---|---|---|
| Below cap (e.g. 2 of 4) | Neutral gray progress bar | "Categories: 2 of 4" |
| At cap (e.g. 4 of 4) | Amber progress bar | "Categories: 4 of 4 — at limit" |
| Over cap (post-downgrade) | Red progress bar | "Categories: 5 of 2 — please remove 3 to match your plan" |

### Upgrade prompt copy

When a user clicks "Add category" while at cap:

> **You're listed in 2 of 2 categories. To list in more, upgrade your plan.**
>
> [Stay on Verified $29] · **[Upgrade to Verified Plus $79 →]** · [See all plans]
>
> *Verified Plus lets you list in up to 4 categories and gets you sponsored boost in each one.*

The middle button is the primary CTA. Keep the supporting line short — one benefit, not three.

### Downgrade behavior

When a Verified Plus subscriber downgrades to Verified while listed in 3 or 4 categories:

- **Do not auto-remove categories.** Auto-removal destroys SEO and breaks the listing's discoverability before the user can react.
- **Email them.** *"You've moved to Verified, which lists in up to 2 categories. You're currently in 4. Pick the 2 to keep within 14 days, or your listing will default to your top 2 by view count."*
- **After 14 days,** auto-trim by view count (descending). Send a follow-up email naming which categories were removed and offering one-click restore via upgrade.
- **In the dashboard,** show the red over-cap progress bar with an inline "Pick which to keep" CTA the entire time they're over.

### Add-on (deferred — do not ship in v1)

For the multi-trade vendor who legitimately works 5+ categories but doesn't want Partner tier (think: handyman who does drywall, painting, pressure washing, garage doors, and gutters):

- Verified ($29) and Verified Plus ($79) can buy +1 additional category for $12/mo, capped at +3 max.
- The +3 cap prevents Verified vendors from buying their way around the V → V+ upgrade pressure.
- Hold release until cap-hit data shows real demand (probably 90 days after the indicator ships). The data also tells you whether $12 is the right price or whether $15 / $20 captures more value.

---

## Code Tasks (Source of Truth Cleanup)

1. Create `src/data/pricingTiers.ts` (or `src/config/pricing.ts`) as single source of truth.
2. Update `PricingSection.tsx` to read from it (currently has Free/Starter/Professional/Featured at $0/$39/$79/$249).
3. Update `serviceCategories.ts` to read from it (currently has Basic/Verified/Premium/Elite at $0/$29/$79/$199).
4. Add `Unclaimed` tier — currently missing entirely. Should be the default state for any business in the directory who has not claimed.
5. Implement visual differentiation in business card components (grayscale unclaimed, claim CTA banner, verified checkmark, V+ accent, Partner ribbon).
6. Add category sort logic respecting tier ordering: Partner → Verified Plus → Verified → Claimed → Unclaimed.
7. Implement Partner one-per-category enforcement at the database/admin level (only one Partner row can exist per category at any time).
8. Add "Boerne [Category] Partner" badge text generation (e.g., "Boerne's Plumber Partner").
9. **Build `<CategoryUsageIndicator>` component.** Reads current category count + tier cap from the business dashboard context. Renders the X of Y label + progress bar in the three states above (below / at / over cap). Place it on the dashboard categories panel and inside the listing edit form's category picker.
10. **Wire the upgrade prompt modal.** When the add-category button is clicked at cap, fire the modal with the copy in the spec. Stay/Upgrade/See-all CTAs route to: (Stay) close modal, (Upgrade) checkout for the next tier up, (See all) `/pricing`.
11. **Implement the downgrade grace flow.** On downgrade event: don't trim; flag listing as `over_cap` with `over_cap_until = now + 14d`; send the trigger email; show red indicator with the "Pick which to keep" CTA. Add a daily cron that auto-trims `over_cap` listings whose grace expired, sorted by view count descending, and sends the follow-up email.

### Canonical tier names (use these in code, replacing existing inconsistent names)
- `Unclaimed`
- `Claimed`
- `Verified`
- `VerifiedPlus`
- `Partner`

---

## Revenue Reference (from BoerneLocal_Revenue_Projection_v2.xlsx)

Base case 5-year mature state:
- 520 paying customers (60% Verified / 28% V+ / 12% Partner)
- $36,020/mo MRR
- $69 blended ARPU
- $986k cumulative 5-year revenue

Y5 tier contribution to MRR:
- Verified: 312 customers × $29 = $9,048 (25.1% of MRR)
- Verified Plus: 146 customers × $79 = $11,534 (32.0%)
- Partner: 62 customers × $249 = $15,438 (42.9%)

Partner is 12% of customers but ~43% of revenue. That asymmetry is the strategic reason the tier exists.
