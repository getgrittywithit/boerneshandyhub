# Claude Code Handoff — Category Map Sync

This document is what you (Levi) hand to Claude Code to sync the codebase with `HandyHub_Categories.xlsx`. It describes the source-of-truth model, the one-time changes from this round, and the long-term repeatable workflow.

---

## File Location & Repo Setup (Levi — read this first)

The spreadsheet and these specs need to live **inside the BoernesHandyHub site repo** so they're version-controlled alongside the code that mirrors them. Recommended layout:

```
boernes-handy-hub/                    ← your existing site repo
├── src/
│   ├── data/
│   │   ├── serviceCategories.ts      ← Claude Code edits this
│   │   └── pricingTiers.ts           ← Claude Code creates this
│   └── components/
│       └── PricingSection.tsx        ← Claude Code edits this
├── docs/                             ← create this folder if it doesn't exist
│   ├── HandyHub_Categories.xlsx      ← drop here
│   ├── PRICING_SPEC.md               ← drop here
│   └── CLAUDE_CODE_HANDOFF.md        ← drop here (this file)
└── package.json
```

**One-time setup:**

1. In the site repo, create a `docs/` folder if there isn't one.
2. Copy these three files from `~/Documents/Claude/Projects/Boerne's Handy Hub/` into `docs/`:
   - `HandyHub_Categories.xlsx`
   - `PRICING_SPEC.md`
   - `CLAUDE_CODE_HANDOFF.md`
3. `git add docs/` → commit → push.

After that, the spreadsheet is the canonical, version-controlled source of truth. Anyone (you, Claude Code, Lola later) can `git log docs/HandyHub_Categories.xlsx` to see when categories last changed.

**Going forward** — when you want to update categories or pricing, edit the file *in the project workspace* (where it currently lives), then copy the updated version into the site repo's `docs/` folder, commit, and run Claude Code from the repo root with the standard prompt at the bottom of this file.

> **Why not edit the file directly in the site repo?** You can — but keeping the working copy in `~/Documents/Claude/Projects/Boerne's Handy Hub/` lets you edit with me (or any future Claude session) without needing the full site repo open. The site repo's `docs/` folder is the *committed* version; the project folder is the *drafting* version. When ready to ship, copy from drafting → committed.

---

## TL;DR for Claude Code

> The file `HandyHub_Categories.xlsx` in the project root is the single source of truth for category structure on BoernesHandyHub.com. Read it, then update `src/data/serviceCategories.ts` (and any related route/page/redirect logic) to match. Treat any subcategory with `Status = New` as a category to create. Treat any with `Status = Rename` as a slug change requiring a 301. Treat any with `Status = Cross-list` as one record that should appear under multiple top-level categories. Open a single PR with the changes, grouped by top-level category.

Paste the prompt block at the bottom of this file when handing the work over.

---

## Source of Truth Model

**`HandyHub_Categories.xlsx` is the truth.** Code mirrors it.

If something is in the spreadsheet but not in code, code is wrong. If something is in code but not in the spreadsheet, the spreadsheet is wrong — Levi adds the missing row and re-syncs.

### Workbook structure

| Tab | Purpose |
|---|---|
| README | Conventions, status legend, workflow rules |
| TopLevel | The 5 top-level categories (Home, Auto, Outdoor, Business, Specialty) with current vs. proposed counts |
| Home, Auto, Outdoor, Business, Specialty | One row per subcategory tile |
| CrossListings | Subcategories that should appear under more than one top-level category |
| Changelog | Running log of edits |

### Subcategory row schema (columns A–K)

| Col | Field | Notes |
|---|---|---|
| A | ID | `HH-HOM-001` style. Stable forever — never renumber. |
| B | Subcategory Name | Display name on the site. |
| C | URL Slug | lowercase-kebab-case. Once shipped, never change without `Status = Rename` + 301. |
| D | Status | `Existing` / `New` / `Rename` / `Cross-list` / `Merge` / `Decision`. Drives action. |
| E | Section / Group | Visual grouping on the category landing page. Tile groups should match. |
| F | Icon | Emoji used as the tile icon. |
| G | Short Description | One line under the tile name. |
| H | Cross-list also in | Other top-level cats this should appear under. Empty if none. |
| I | Hill Country / Boerne Note | Local angle — for landing-page copy and sales pitches. |
| J | Typical Tier Range | Advisory only — what tier most vendors here are likely to buy. |
| K | Pricing / Sales Note | Sales notes, premium-tier candidates, etc. |

---

## What Claude Code Should Do This Round

This is the first sync after switching to the spreadsheet-as-source-of-truth model.

### 1. Read the workbook

Parse all 5 subcategory tabs. Build an in-memory map of `{ topLevel → [subcategory rows] }`.

### 2. Reconcile with `src/data/serviceCategories.ts`

For each subcategory row:

| Status | Action |
|---|---|
| `Existing` | No change. Verify the existing entry matches name, slug, description, icon, section. If any field has drifted from the spreadsheet, update code to match. |
| `New` | Add a new entry. Generate the subcategory page following the existing `/services/[category]/[subcategory]` pattern. Include schema.org JSON-LD ItemList entry on the parent category page. |
| `Rename` | Update name and/or slug. Add a 301 redirect from old slug → new slug. Preserve the existing subcategory page content. |
| `Cross-list` | The same subcategory record should be queryable from multiple top-level cats. Update routing so `/services/home/locksmith` and `/services/auto/auto-locksmith` (or whatever the two are) both resolve. Cross-reference `CrossListings` tab for canonical handling. |
| `Merge` | Combine two existing subcats into one. Add 301s from each old slug. Update any business listings tagged in the old subcats. |
| `Decision` | Skip — flag in PR description as "blocked on Levi's decision." Don't ship. |

### 3. Update the visual grouping on category landing pages

Subcategories should be grouped on the category landing page using the **Section / Group** column (E). For example, on `/services/home`, tiles should be grouped under section headers like "Trades," "Interior," "Exterior," "Repair & Restoration," "Hill Country Specialty," and "Tech & Security."

If the current category landing page doesn't have section headers, add them. Order sections logically (Trades first, Specialty last). Within a section, sort tiles alphabetically by name.

### 4. Fix the structural issues already known

These are known issues that should be cleaned up in this round:

- **Footer is missing the Business category.** Footer's "Services" column lists Home, Outdoor, Auto, Specialty — add Business. (See: any page footer.)
- **The URL `/services/business-services` is awkward.** If feasible, alias to `/services/business` with a 301 from the current path. If that's a heavier lift, leave for now and flag.
- **Slug consistency.** Some current slugs use `-services` suffix (e.g., `business-services`); new ones should not. Don't rename existing ones unless they're in the spreadsheet with `Status = Rename`.

### 5. Fix the pricing code to match `PRICING_SPEC.md`

The pricing values currently drift between three places. Reconcile per the spec:

- **`PricingSection.tsx`** currently has Free / Starter / Professional / Featured at $0 / $39 / $79 / $249. Wrong. Replace with the canonical 5-tier model: Unclaimed / Claimed / Verified / Verified Plus / Partner at $0 / $0 / $29 / $79 / $249.
- **`serviceCategories.ts`** currently has Basic / Verified / Premium / Elite at $0 / $29 / $79 / $199. Wrong. Same replacement.
- **Create `src/data/pricingTiers.ts`** as the single source of truth that both files import from. Every tier name, price, feature list, and category cap should be defined here once and read everywhere else.

Use the canonical tier names from `PRICING_SPEC.md` § "Code Tasks" (`Unclaimed`, `Claimed`, `Verified`, `VerifiedPlus`, `Partner`) — not the current inconsistent names.

### 6. Build the Category Count UX (X of Y indicator)

Per `PRICING_SPEC.md` § "Category Count UX" — implement Code Tasks #9, #10, and #11 from that spec:

- `<CategoryUsageIndicator>` component on the business dashboard categories panel and inside the listing edit form's category picker. Three visual states: below cap (gray), at cap (amber), over cap (red).
- Upgrade prompt modal when "Add category" is clicked at cap. Copy and CTA routing are specified in the spec.
- Downgrade grace flow: 14-day window, no auto-removal until the grace expires, scheduled job to auto-trim by view count.

This piece is what converts the existing tier caps into actual upgrade revenue. Don't ship the category map round without it — they reinforce each other.

### 7. Enforce the category caps end-to-end

Confirm caps are enforced in three places:

1. **Database/API layer** — reject inserts that would exceed the tier's cap.
2. **Business signup/edit UI** — `<CategoryUsageIndicator>` (above) prevents the add action visually.
3. **Partner tier exclusivity** — only one Partner row can exist per category at any time (per spec Code Task #7).

If any of these aren't enforced today, surface them in the PR description as separate items so Levi knows what got hardened.

### 8. Open a single PR

Title: `Category map + pricing sync — round 1 (April 2026)`

PR description should include:

- **Categories:** summary of additions per top-level (e.g., "Home: +17 subcats; Auto: +20; Outdoor: +12; Business: +21; Specialty: +6"), list of new slugs created, list of redirects added.
- **Pricing:** old → new tier names and prices, confirmation that `pricingTiers.ts` is now the single source of truth, list of files refactored to import from it.
- **Category Count UX:** confirmation `<CategoryUsageIndicator>` is wired in both the dashboard and edit form, plus screenshot of the at-cap state and the upgrade modal.
- **Cap enforcement:** which layers got hardened (DB / API / UI / Partner exclusivity).
- **Skipped:** any rows with Status = Decision, with reasons.
- **Structural cleanup:** footer fix (Business added), `business-services` URL alias if shipped.
- **Screenshots / staging link:** one revised category page (Business is a good showcase) and the dashboard with the indicator visible.

---

## Long-Term Workflow

Once this first round is shipped, the loop is:

```
Levi (or Claude in chat) edits HandyHub_Categories.xlsx
        │
        ▼
  Update Changelog tab (date, change, status)
        │
        ▼
Hand workbook to Claude Code with the standard prompt
(see "Standard Prompt Template" below)
        │
        ▼
Claude Code:
  • reads workbook
  • reconciles src/data/serviceCategories.ts
  • creates/renames/redirects
  • opens PR
        │
        ▼
Levi reviews + merges PR
        │
        ▼
Claude Code (or Levi) updates Status of new rows
to "Existing" in the spreadsheet
        │
        ▼
Done — until the next round
```

### Cadence

- **Ad-hoc changes** (new subcat someone asked for, rename, cross-list fix) → as they come up; small PRs.
- **Quarterly review** — Levi opens the workbook, scans Section/Group balance, looks for gaps surfaced by sales conversations, adds rows, hands to Claude Code.

### Rules of the road

- **Never edit the code's category list directly.** Edit the spreadsheet, then sync. Otherwise drift is guaranteed.
- **Never reuse an ID.** Once `HH-HOM-021` is taken, it's taken forever — even if that subcat is later deleted (mark as deprecated in a later column rather than deleting the row).
- **Slugs are sacred once shipped.** Any slug change is a `Rename` row plus a 301.
- **Don't add a subcategory without a Section.** Empty Section column = the tile won't get grouped on the landing page = the design breaks.
- **Hill Country Note is a sales asset.** Fill it in for any subcat with a meaningful local angle. It's used in landing-page copy and outreach scripts.

---

## Standard Prompt Template

Copy-paste this when handing the workbook to Claude Code:

```
Sync the BoernesHandyHub codebase with the canonical specs in /docs/.

Sources of truth:
  - docs/HandyHub_Categories.xlsx — category structure
  - docs/PRICING_SPEC.md — tier definitions, category caps, Category Count UX
  - docs/CLAUDE_CODE_HANDOFF.md — this round's full scope, action rules, PR format

This round's scope (round 1, see CLAUDE_CODE_HANDOFF.md "What Claude Code Should Do This Round"):
1. Read all 5 subcategory tabs in the workbook and reconcile src/data/serviceCategories.ts.
2. Take action per the Status column (Existing/New/Rename/Cross-list/Merge/Decision).
3. Group tiles on each category landing page using the Section/Group column.
4. Cross-reference the CrossListings tab for multi-tag subcategories.
5. Fix the pricing code to match PRICING_SPEC.md — create src/data/pricingTiers.ts as single source
   of truth; refactor PricingSection.tsx and serviceCategories.ts to import from it; use canonical
   tier names (Unclaimed, Claimed, Verified, VerifiedPlus, Partner) at $0 / $0 / $29 / $79 / $249.
6. Build the Category Count UX per PRICING_SPEC.md "Category Count UX" — <CategoryUsageIndicator>,
   upgrade prompt modal, downgrade grace flow.
7. Enforce category caps at DB, API, and UI layers; Partner one-per-category enforcement.
8. Fix known structural issues: Business missing from footer; consider /services/business URL alias.
9. Skip any rows with Status = Decision and call them out in the PR description.
10. Update the Changelog tab in the workbook with what shipped, dated today.
11. Open a single PR titled "Category map + pricing sync — round 1 (April 2026)" using the PR
    description format in CLAUDE_CODE_HANDOFF.md § 8.

Do NOT modify category structure or pricing that isn't in the specs. If you find anything in the
code that isn't in the specs (or vice versa), surface it in the PR rather than reconciling silently.
```

---

## Decision Items From This Round (Levi to Resolve Before Sync)

These rows are in the spreadsheet but flagged as needing your call:

1. **Auto → Auto Dealerships (HH-AUT-025).** Standard $30/mo listing model probably doesn't match how a dealership thinks about marketing spend. Options: (a) leave as-is, see who claims it, (b) offer Partner-only at $249/mo, (c) build a bespoke "dealership package" at a higher price point. Recommend (b) for round 1 — simpler, fewer SKUs.
2. **Business → Commercial Real Estate (HH-BIZ-013).** Decide: are listings the **brokers/managers** (service-provider model, fits existing $30/mo) or the **properties themselves** (sqft, lease rate, photos — different data model)? Recommend brokers/managers in round 1; revisit property-level later.
3. **Tile & Countertops (HH-HOM-026).** Currently merged. Decide whether to split into two tiles now or wait for vendor demand. Recommend leaving merged for round 1.
4. **`/services/business-services` URL alias.** Worth the redirect to `/services/business` now, or defer? Recommend doing it now while the category is being expanded — clean slate.

Mark each with your decision (or change Status to `New`/`Existing`/etc.) before handing to Claude Code.
