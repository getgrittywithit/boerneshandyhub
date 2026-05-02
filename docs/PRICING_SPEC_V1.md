# BoernesHandyHub Pricing Spec — v1 (Launch)

**This is the canonical pricing spec for the v1 launch.** It supersedes `PRICING_SPEC.md` for shipping. The original three-tier spec is preserved as the mature-state target — see "Roadmap to v2" at the bottom.

---

## What Changed and Why

The original spec mirrored The Boerne Life's three-paid-tier structure. Two problems with shipping that on day one:

1. **Audience-dependent features sell promises we can't yet keep.** Verified Plus and Partner lean heavily on newsletter inclusion, sponsored boost, solo social posts, and welcome packets — all of which require infrastructure (newsletter list, social following, traffic, realtor partnerships) that doesn't exist on day one. Selling those features pre-audience creates a 90-day churn cliff once customers realize the delivered value is near zero.

2. **Three tiers is too many for v1.** Without baseline customer data, three tiers means three guesses. Decision fatigue on the pricing page kills SMB conversion. Launching with one paid tier lets the market tell us what V2 should look like.

The website-as-anchor strategy substitutes for not-yet-having TBL's audience. It's a real, tangible deliverable that doesn't depend on directory traffic or social reach. See `WEBSITE_SYSTEM_SPEC.md` for the full build spec.

---

## v1 Tier Structure

| # | Tier | Price | Job to be Done | Capacity |
|---|------|-------|----------------|----------|
| 0 | Unclaimed | Free (we add) | "Does this exist?" | Unlimited |
| 1 | Claimed | Free (they claim) | "Here's our info" | Unlimited |
| 2 | Verified | **$49/mo · $490/yr** | "I have a real online presence" | Unlimited |
| — | Founding Partner | Custom ($99–249) | "Sell me more" — concierge | 1 per category, off-page |

Annual = ~17% discount (2 months free).

---

## Tier 0 — Unclaimed (unchanged from original spec)

**Cost:** Free (we add them from public data)
**Question it answers:** "Does this business exist?"

What they get: name, phone, address, category placement.

Visual treatment (intentionally incomplete):
- Grayscale or placeholder photo
- Missing fields shown as gray dashes "—"
- "Profile not verified" tag
- Banner: "Are you the owner? Claim this listing free →"
- Sorts to bottom of category by default
- Muted card styling

The empty profile next to filled-out competitors is the point. Shame factor drives claims.

---

## Tier 1 — Claimed (unchanged from original spec)

**Cost:** Free (they claim it)
**Question it answers:** "Here's our info."

What they get (Unclaimed plus): 1 photo, business description, hours, website link, social links, dashboard edit access.

Visual: full color, normal card styling, subtle "Listed" tag.

This tier exists to capture email. Once we have email, the upgrade nurture sequence begins. **Do not touch this tier — it's the moat.**

---

## Tier 2 — Verified ($49/mo) — THE ANCHOR

**Cost:** $49/month or $490/year
**Question it answers:** "I have a real online presence."

The website is the deliverable that justifies the price. Without the website, this is a directory listing competing against a free Google Business Profile. With the website, this is a $49 alternative to a $30 Wix subscription that requires zero setup work and ships pre-optimized for trade-business conversion.

### What they get (everything in Claimed, plus)
- ✓ **Boerne Verified** badge (we verify address + license/insurance)
- **Trade-vertical website at `boerneshandyhub.com/[business-slug]`** — five templates, see `WEBSITE_SYSTEM_SPEC.md`
- Tracked phone number with call analytics
- Self-serve dashboard (edit listing, manage photos, see views/clicks)
- Up to 2 categories
- Up to 5 photos
- Up to 3 active special offers/coupons
- Review request tool (sends review-ask emails to their customers)
- Priority placement above Claimed and Unclaimed listings in category

### What's NOT in this tier (deferred to v2)
- Sponsored boost above other Verified businesses
- Newsletter inclusion
- Social channel auto-share
- Solo content (social, newsletter, blog)
- Industry exclusivity / Partner designation
- Welcome packet inclusion (realtor + title company partnerships)
- Custom landing page on directory homepage (the website *is* their page in v1)

### Pricing rationale for $49 (vs. $29 in original spec)
- $49 anchors above Wix/Squarespace base hosting ($23–30) without competing on price.
- Signals legitimacy. $29 reads "hobby project, won't be around in 2 years" or "too good to be true." Both kill conversion.
- Margin to deliver a real website + ongoing customer support without cost cliffs at 100 customers.
- Allows for "Was $79, now $49 charter pricing" anchor framing if early acquisition needs a push.
- Annual at $490/yr (vs. $588 monthly) locks revenue and reduces churn.

### Visual treatment
- Green Boerne Verified checkmark badge prominent on listing card and profile
- Slight accent border on listing card
- Sorts above all free listings in category

---

## Founding Partner (Concierge — Off Public Pricing Page)

For business owners who say "I want more than $49 worth." Sold 1:1, priced bespoke, deliverables negotiated.

### Why this exists
You will get inquiries from businesses asking for top placement, exclusivity, or active marketing. We need an answer for those calls without committing to a public Partner tier whose audience-dependent deliverables we can't yet honor at scale.

### How it's sold
- **Not on the pricing page. Not in any marketing material.**
- Surfaced when a Verified prospect asks "what about more visibility / exclusivity / marketing?"
- Sales conversation is 1:1. Negotiate price ($99–249/mo range) and deliverables.
- Each Founding Partner agreement is bespoke. No two are identical.
- One Founding Partner per category cap is enforced by us internally — not advertised.

### What we can credibly offer in v1
- Top-of-category placement (real estate we control)
- Industry exclusivity in their category (we cap to 1 Founding Partner per category)
- Custom branded landing page on the directory (separate from their template website)
- Premium website template variant or custom theme treatment
- Quarterly strategy call
- "First crack at every new audience channel as we build it (newsletter, social, blog) at no extra cost as we grow"

### What we don't promise
- Specific reach or impression numbers
- Specific lead volume
- Channel-specific deliverables we can't yet meet
- Set-in-stone feature lists — these are charter relationships, not SKUs

### Why this beats launching public Partner
- Doesn't put unfulfillable claims in writing
- Locks in early high-LTV customers as charter relationships
- Generates real pricing signal for v2 Partner tier
- Each conversation teaches us what businesses actually want at the high end

---

## Pricing Page Presentation (v1)

Two visible options + a soft "more" link below:

```
┌─────────────────────┐    ┌─────────────────────────┐
│  Free               │    │  Verified — $49/mo      │
│  Claim Your Listing │    │  ★ Most Popular         │
│  ─────────────────  │    │  ─────────────────────  │
│  • Listing in directory│ │  • Verified badge        │
│  • Edit your profile│    │  • Real website          │
│  • Add photo, hours │    │  • Tracked phone         │
│  • Free forever     │    │  • Dashboard & analytics│
│  [Claim →]          │    │  [Get Verified →]       │
└─────────────────────┘    └─────────────────────────┘

      Need more than this? Talk to us about Founding Partner →
```

Don't show three full cards. Two paid options + soft contact link below = clean, decisive, no decision fatigue.

---

## Roadmap to v2 (when we earn the right)

Add Verified Plus and a public Partner tier *after* we have demonstrable evidence of:
- Category-page organic search traffic ≥500/mo (sponsored boost has measurable value)
- A newsletter with ≥1,000 subscribers (inclusion is real distribution)
- HandyHub social channels with ≥500 engaged followers
- Realtor + title company partnerships (welcome packet inclusion exists)

### Trigger metrics for adding Verified Plus ($79)
- Verified tier has ≥30 paying customers (validates entry-tier demand)
- Average organic search traffic to category pages ≥500/mo
- Newsletter has ≥1,000 subscribers
- HandyHub social has ≥500 engaged followers across IG/FB

### Trigger metrics for converting Founding Partner to public Partner ($249)
- ≥5 Founding Partner customers paying ≥$199/mo (validates high-end demand)
- We've operationally delivered solo social + newsletter for 3+ consecutive months without burnout
- Realtor welcome packet pipeline live with at least 2 partner agencies

### What grandfathering looks like
- Charter Verified customers stay at $49 forever (or whatever they signed up at)
- New customers post-v2 launch may pay $59 or $69 for Verified
- Founding Partners convert to whatever tier matches their negotiated value, with grandfathered pricing

---

## Operational Deliverability v1

| Tier | Y1 customer target | Hours per customer per month |
|------|---------------------|------------------------------|
| Unclaimed | unlimited | 0 |
| Claimed | unlimited | 0 |
| Verified | 50–100 | ~30 min avg (website maintenance, support tickets, monthly check-in) |
| Founding Partner | 5–10 | ~2 hrs (custom landing page upkeep, quarterly call, bespoke asks) |

Total operational load at Y1 mature state (75 Verified + 8 Founding): ~53 hrs/mo. Sustainable for a single founder + part-time help.

---

## Code Tasks (v1 Cleanup)

1. Update `src/data/pricingTiers.ts` (or create if missing) to reflect v1 tiers only: `Unclaimed`, `Claimed`, `Verified`, `FoundingPartner` (admin-only).
2. Remove Verified Plus and public Partner from `PricingSection.tsx` and `serviceCategories.ts`.
3. Add `is_founding_partner` boolean flag to business records (admin-only field, not user-facing).
4. Implement website rendering for Verified tier — see `WEBSITE_SYSTEM_SPEC.md`.
5. Implement category cap UX (X of 2 indicator) on Verified — same pattern as original spec, just sized for 2 categories.
6. Build "Contact us about Founding Partner" form route → admin inbox.
7. Build admin tools to set/unset Founding Partner status, with category-uniqueness enforcement.

### Canonical tier names (v1, code-level)
- `Unclaimed`
- `Claimed`
- `Verified`
- `FoundingPartner` (admin/concierge — never shown to public users)

---

## Revenue Reference v1

Realistic Y1 targets (revised down from original spec to reflect single-paid-tier launch):
- 75 Verified customers × $49 = **$3,675/mo MRR by month 12**
- 8 Founding Partners × ~$150 avg = **$1,200/mo**
- **Combined Y1 MRR target: ~$4,875/mo**

Realistic Y3 targets (with Verified Plus launched in Y2):
- 200 Verified × $49 = $9,800
- 100 V+ × $79 = $7,900
- 25 Partner × $249 = $6,225
- **Combined Y3 MRR: ~$23,925/mo**

The original spec's $36k Y5 MRR figure is still achievable but should be modeled as a bull case, not a base case. The realistic base case for Y5 with strong execution is closer to $25–30k.

---

## Why Lead Generation is NOT Included (preserved from original)

Deliberate decision. Selling leads creates a different (and worse) business: disputes, refunds, lead-quality arbitration, adversarial economics with paying customers, brand drift toward Angi/Thumbtack territory.

Instead we offer **tracked attention**: tracked phone number, click counts, profile views, contact-form-to-email. Analytics, not brokering.

Higher-tier value at v2 will come from **distribution we control**: sponsored boost, newsletter inclusion, welcome packets, social spotlights, blog features. These scale appropriately to operations and cost almost nothing per-customer once channels exist.
