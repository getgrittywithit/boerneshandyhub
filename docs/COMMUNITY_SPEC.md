# COMMUNITY_SPEC.md — Resident Contributions on BoernesHandyHub

**Status:** Draft v1 — April 30, 2026
**Owner:** Levi & Lola
**Implementer:** Claude Code (against the BoernesHandyHub site repo)

This spec defines a community-contribution system for BoernesHandyHub.com — site feedback, photo submissions, stories & history, and crowd-sourced local tips. Like the other specs in `/docs`, this document is the source of truth; code mirrors it; if they drift, the doc is right.

This feature is the long-term moat. National platforms can list every business in Boerne, but they cannot become the place where a third-generation Boerne resident uploads a 1972 photo of Main Street or writes about the flood of '02. Treat the design accordingly: optimize for resident pride and editorial quality, not engagement-bait or volume.

---

## 1. Goals & Non-Goals

### Goals

- Make it dead-simple for Boerne residents to contribute photos, stories, history, and tips, and to send private feedback to Levi & Lola.
- Maintain editorial quality: every public submission is approved by a human before going live, with AI doing the first-pass triage.
- Give contributors visible credit (bylines, contributor pages) so contributing feels like part of the local fabric, not yelling into a form.
- Surface approved content twice — on its own at `/community`, and contextually on the existing category, subcategory, and listing pages so the moat compounds across the site.
- Capture every submission's IP attestation and reviewer decision so the legal posture is defensible.

### Non-Goals (v1)

- No business reviews. Star ratings, written reviews of vendors, and review responses are deferred to a separate `REVIEWS_SPEC.md`. They have legal exposure (defamation), incentive complications (vendors gaming the system), and a moderation surface area large enough to warrant their own design pass.
- No event submissions. Events have date/time/recurrence/RSVP requirements that justify a separate spec when the calendar feature is prioritized.
- No comment threads on stories or photos. Contributions are one-direction in v1 — you can submit, but you can't reply on someone else's submission.
- No public-facing edit history or versioning. Approved content is canonical until updated by an admin.
- No real-time notifications, no DMs between contributors. Email-only touchpoints.

---

## 2. Content Types

| Type | Public? | Form fields | Display |
|---|---|---|---|
| **Feedback** | No | Subject, message, optional category. Contributor name + email. | Admin queue + email digest only. Never public. |
| **Photo** | Yes (after approval) | Image file(s), caption, year (or "current"), location/neighborhood, related category or business (optional), IP attestation. | Photo gallery at `/community/photos`, embedded on relevant category/neighborhood/business pages. |
| **Story** | Yes (after approval) | Title, body (rich text, ~200–3000 words), optional photos, related places (tags). | Story index at `/community/stories`, individual page at `/community/stories/[slug]`. Excerpts embed on related pages. |
| **Tip / List entry** | Yes (after approval) | Which list (existing or proposed), entry text (1–2 sentences), why it's a pick. | Curated list pages at `/community/tips/[list-slug]`. Voteable by other verified contributors. |

Tip lists are admin-curated containers (e.g., "Best swimming holes," "Kid-friendly lunch spots"); contributors submit *entries* to a list, not new lists themselves. New lists are added by Levi/Lola when zero-result patterns or repeated suggestions justify one — same pattern as the category-additions loop.

---

## 3. Identity & Access

### 3.1 Contributor accounts

- A "contributor" is an email-verified person, not a full Supabase Auth account in v1. Lower friction; sufficient identity for our threat model.
- First submission triggers a magic-link email; clicking confirms ownership and stores `email_verified_at`. Subsequent submissions from the same browser skip the link if a session cookie is present (30-day rolling).
- Display name preference is set once: `Full name`, `First name only`, or `Initials`. Stored on the contributor row, used as the default byline. Contributors can override per-submission ("submit anonymously" toggle — still tracked internally, just no public byline).
- Email addresses are never displayed publicly under any circumstance.

### 3.2 Why not full accounts in v1

A full account with password, profile, settings, and avatar adds material friction to the first contribution. We accept the cost: contributors can't edit their own submissions after publish (must email Lola), and "my contributions" history requires the email session cookie. Both costs are tolerable until we hit ~50 active contributors, at which point upgrade to Supabase Auth via a documented migration path (see § 11 future-work).

### 3.3 Rate limits

- 5 submissions per email address per 24 hours, hard cap.
- 1 submission per IP per 60 seconds, soft cap (returns 429 with a "slow down" message).
- A submitted contribution can be edited within 10 minutes of submission; after that it's frozen pending review.

---

## 4. Submission UX

### 4.1 Entry points

- Header: a small "Contribute" link in the top nav, right of "Pricing." Mobile: in the hamburger menu.
- Footer: a `Have something to share with us? Contribute →` link, every page.
- Contextual CTA on category landing pages: a small "Have a photo or story about [Category Name]? Add it →" card at the bottom of each `/services/[category]` page, deep-linking to `/contribute?target=outdoor` (pre-filling the related category).
- Direct URL: `/contribute`.

### 4.2 The Contribute flow

`/contribute` is a single page with a type-picker at the top:

```
What would you like to share?
  [📨 Feedback for the team]   [📷 A photo]   [📖 A story]   [💡 A local tip]
```

Picking a type swaps in that type's form below. State is preserved in the URL (`/contribute?type=photo`) for sharability and analytics.

### 4.3 Per-type forms

**Feedback.** Subject (required), message (required, 10–2000 chars), email (required), name (optional). One-step.

**Photo.** Two-step.
1. Upload photo(s) — single or up to 4 in one submission. Drag-drop, with a paste-from-clipboard fallback. Client-side check: max 25 MB per file, JPEG/PNG/HEIC/WebP only. Resize on upload to a max 4096px long edge before sending.
2. Per-photo: caption (optional, recommended), year (dropdown: "Current," then 2025 → 1850), location (free text + Boerne neighborhood dropdown), related category (optional dropdown), related business (optional typeahead).
3. Submission-level: contributor name, email, display preference, IP attestation checkbox (see § 8.1).

**Story.** Single page.
1. Title (required, 10–120 chars), body (required, rich text — bold/italic/lists/links only, no inline images in body; photos attach separately at the bottom).
2. Optional photo attachments (same upload widget as Photo type).
3. Related places (multi-tag: categories, neighborhoods, business names).
4. Time period (era dropdown: Today, 2010s, 2000s, 1990s, … 1850s).
5. Contributor name, email, display preference, IP attestation, accuracy attestation.

**Tip.** Single page.
1. Which list — dropdown of admin-curated lists, plus a "Suggest a new list" textarea at the bottom for proposing one (these go to Levi as a feedback row; do not create a list).
2. Your pick (1–2 sentences, required, 30–500 chars).
3. Why it's a pick (1–2 sentences, optional but recommended).
4. Contributor name, email, display preference.

### 4.4 Post-submission

- Confirmation page: "Thanks, [name]. We'll review this within 48 hours and email you when it's live (or if we have a question)."
- Confirmation email immediately after: includes a "your submission" view link (token-signed URL, 30-day expiry) so contributors can check status without an account.
- If the AI pre-screen rejects (§ 5.2 hard-reject categories), the email instead says: "We received your submission but won't be able to publish it because [reason]. If you think this is a mistake, reply to this email."
- After admin approval: a publish notification email with the live URL.
- After admin rejection: a rejection email with the reviewer's reason (one of a fixed set of canned reasons, plus optional free text).

---

## 5. AI Pre-Screen + Admin Review Pipeline

### 5.1 Lifecycle

```
submitted ──► ai_screening ──► ai_clear      ──► admin_pending ──► approved ──► published
                          ├─► ai_flag        ──► admin_pending ──► rejected
                          └─► hard_reject    ──► rejected (no admin step)
```

- `submitted` — row inserted, file(s) uploaded to Supabase Storage in the `community-uploads-pending` bucket.
- `ai_screening` — Edge Function `screen-submission` running.
- `ai_clear` / `ai_flag` / `hard_reject` — set by the screen function based on its scoring (§ 5.2).
- `admin_pending` — visible in the admin queue.
- `approved` — Levi or Lola pressed approve. A second function `publish-submission` moves files to the public `community-uploads` bucket, generates derivative sizes, writes the public row(s), and triggers re-indexing for search.
- `published` — live on the site.
- `rejected` — final state. Files purged after 30 days.

### 5.2 What the AI pre-screen looks for

Edge Function `screen-submission` (see § 7) calls Claude (Anthropic API) with a structured prompt for each submission and parses a JSON verdict.

| Verdict | Triggers | Action |
|---|---|---|
| `hard_reject` | CSAM signals, doxxing, explicit threats of violence, obvious link-spam, content in a non-Latin script that translates to advertising. | Submission terminated; contributor emailed; no admin step. Logged with full reason. |
| `ai_flag` | Profanity beyond mild, defamatory tone toward a named person/business, content that may not be about Boerne, image contains identifiable minors without obvious parental context, factual claims that look fabricated. | Goes to admin queue with a red badge and the AI's flag reason inline. |
| `ai_clear` | Everything else. | Goes to admin queue with a green badge. Still requires human approve. |

The AI **never** auto-publishes. The split between `ai_clear` and `ai_flag` exists only to let Levi & Lola sort the queue by signal, not as a publishing gate.

For photos: the same Edge Function calls Claude with the image (vision-enabled model) and the caption together — a clean photo with a defamatory caption should still flag.

### 5.3 Admin queue (extends existing admin panel)

A new section `/admin/community` in the existing admin panel. Three tabs:

- **Queue** — `admin_pending` rows. Default sort: `ai_flag` first (newest), then `ai_clear` (newest). Filters: type, contributor, AI verdict.
- **Recent decisions** — last 30 days of approved/rejected, with revert buttons (re-approves a rejection or unpublishes an approval).
- **Contributors** — alphabetical list with submission count, approval rate, last-active date. Per-row actions: ban (auto-rejects all future), star (auto-approve future from this email).

Queue row UI per submission:

```
[type icon]  [name or anon]  [submitted timestamp]   [AI badge]
"Title or caption excerpt"
[expand →] preview content (image, story body, tip text)
[Approve]  [Reject ▾]  [Reply]  [Skip]
```

Keyboard shortcuts in queue:
- `J` / `K` — next / prev row.
- `A` — approve focused row.
- `R` — open reject dropdown (canned reasons + free text).
- `Space` — toggle expand.
- `E` — open contributor profile in a side panel.

Reject dropdown uses fixed canned reasons (off-topic, can't verify, IP concern, low quality, duplicate, other). The reason is included in the rejection email to the contributor verbatim, so the canned set is reviewed for tone quarterly.

### 5.4 Auto-approve trust tier

After a contributor has had 5 submissions approved with zero rejections, an "auto-approve" star can be applied (manual, by Levi or Lola). Future submissions from that email skip the admin step *but still go through AI pre-screen*. A `hard_reject` or `ai_flag` strips the star automatically and re-routes to the admin queue.

This is the long-tail moderation strategy — it lets the trusted core (likely the Boerne Historical Society types who'll be your most prolific contributors) move at their own pace, while protecting against compromise.

---

## 6. Data Model

```sql
create extension if not exists "uuid-ossp";

create type contribution_type   as enum ('feedback', 'photo', 'story', 'tip');
create type contribution_status as enum (
  'submitted', 'ai_screening', 'ai_clear', 'ai_flag', 'hard_reject',
  'admin_pending', 'approved', 'rejected', 'published'
);
create type display_pref        as enum ('full_name', 'first_name', 'initials', 'anonymous');
create type contributor_status  as enum ('active', 'banned', 'starred');

create table contributors (
  id                  uuid primary key default uuid_generate_v4(),
  email               text unique not null,
  email_verified_at   timestamptz,
  name                text,
  display_pref        display_pref not null default 'first_name',
  status              contributor_status not null default 'active',
  approved_count      integer not null default 0,
  rejected_count      integer not null default 0,
  created_at          timestamptz not null default now(),
  last_active_at      timestamptz
);

create table contributions (
  id                  uuid primary key default uuid_generate_v4(),
  contributor_id      uuid references contributors(id) on delete restrict,
  type                contribution_type not null,
  status              contribution_status not null default 'submitted',
  title               text,
  body                text,                              -- story body, tip text, feedback message
  metadata            jsonb not null default '{}'::jsonb, -- year, location, era, list_slug, etc.
  ai_verdict          jsonb,                             -- raw screen output for audit
  ai_screened_at      timestamptz,
  reviewed_at         timestamptz,
  reviewed_by         text,                              -- admin email
  reject_reason       text,
  published_at        timestamptz,
  public_slug         text,                              -- for stories and tip entries
  ip_attestation      boolean,
  accuracy_attestation boolean,
  submission_ip       inet,                              -- audit only, never displayed
  created_at          timestamptz not null default now()
);

create table contribution_assets (
  id                  uuid primary key default uuid_generate_v4(),
  contribution_id     uuid not null references contributions(id) on delete cascade,
  storage_path        text not null,                     -- pending or published bucket
  bucket              text not null,
  mime_type           text not null,
  width               integer,
  height              integer,
  caption             text,
  year                integer,                           -- null = "current"
  location            text,
  ordering            integer not null default 0,
  derivatives         jsonb,                             -- { thumb: path, medium: path, full: path }
  created_at          timestamptz not null default now()
);

create table contribution_targets (
  id                  uuid primary key default uuid_generate_v4(),
  contribution_id     uuid not null references contributions(id) on delete cascade,
  target_type         text not null,    -- 'category' | 'subcategory' | 'business' | 'neighborhood' | 'global'
  target_slug         text not null,
  unique (contribution_id, target_type, target_slug)
);

create table tip_lists (
  id                  uuid primary key default uuid_generate_v4(),
  slug                text unique not null,
  title               text not null,
  description         text,
  is_active           boolean not null default true,
  created_at          timestamptz not null default now()
);

create table tip_list_entries (
  id                  uuid primary key default uuid_generate_v4(),
  list_id             uuid not null references tip_lists(id) on delete cascade,
  contribution_id     uuid not null references contributions(id) on delete cascade,
  upvotes             integer not null default 0,
  position            integer,
  unique (list_id, contribution_id)
);

create table tip_votes (
  id                  uuid primary key default uuid_generate_v4(),
  tip_list_entry_id   uuid not null references tip_list_entries(id) on delete cascade,
  contributor_id      uuid not null references contributors(id) on delete cascade,
  value               smallint not null check (value in (-1, 1)),
  created_at          timestamptz not null default now(),
  unique (tip_list_entry_id, contributor_id)
);

create table contribution_flags (
  id                  uuid primary key default uuid_generate_v4(),
  contribution_id     uuid not null references contributions(id) on delete cascade,
  flagger_email       text,
  reason              text not null,
  created_at          timestamptz not null default now()
);

-- audit / analytics
create table contribution_events (
  id                  uuid primary key default uuid_generate_v4(),
  contribution_id     uuid not null references contributions(id) on delete cascade,
  event               text not null,    -- 'submitted', 'ai_clear', 'ai_flag', 'hard_reject', 'approved', 'rejected', 'published', 'unpublished', 'edited'
  actor               text,             -- admin email or 'system' or 'ai'
  payload             jsonb,
  created_at          timestamptz not null default now()
);

create index contributions_status_idx       on contributions(status);
create index contributions_type_status_idx  on contributions(type, status);
create index contributions_published_idx    on contributions(published_at desc) where status = 'published';
create index targets_target_idx             on contribution_targets(target_type, target_slug);
create index assets_contribution_idx        on contribution_assets(contribution_id);
create index events_contribution_idx        on contribution_events(contribution_id, created_at desc);
```

### 6.1 Storage buckets

- `community-uploads-pending` — private, 30-day TTL on rejected, indefinite on pending. Files written here on submission.
- `community-uploads` — public, served via CDN. Files moved here on publish, with derivative sizes (thumb 320, medium 1024, full original-or-4096) generated by `publish-submission`.

### 6.2 Search index integration

Approved photos, stories, and tip entries are indexed into `search_documents` (per `SEARCH_SPEC.md`) with `source_type` extended to include `'photo' | 'story' | 'tip'`. The search Edge Function gets new result groups; the admin search analytics dashboard surfaces them. This means once published, community content is discoverable via the same site-wide search bar.

This requires a small migration to `SEARCH_SPEC.md`'s schema — adding the three new enum values and updating the result-group caps. Spec'd here, not yet in `SEARCH_SPEC.md`; whichever ships second does the migration.

---

## 7. Edge Functions

```
supabase/functions/
├── submit-contribution/index.ts      ← validates form, writes pending row, fires email
├── verify-contributor-email/index.ts ← magic-link handler
├── screen-submission/index.ts        ← AI pre-screen (Claude vision-enabled)
├── publish-submission/index.ts       ← promotes pending → published, generates derivatives, indexes search
├── unpublish-submission/index.ts     ← reverts a publish
└── community-digest/index.ts         ← daily email to Levi & Lola summarizing queue depth
```

### 7.1 `screen-submission` prompt sketch

The function calls Anthropic's API with a system prompt like:

```
You are reviewing a community submission for a hyperlocal directory site for
Boerne, Texas. Decide whether the submission should be:

1. hard_reject — CSAM signals, doxxing, explicit threats, illegal content,
   obvious commercial spam, or content that has nothing to do with Boerne or
   the Texas Hill Country.
2. ai_flag — content that needs human attention: profanity beyond mild, possible
   defamation, factual claims that may be fabricated, photos with identifiable
   minors without parental context, content where Boerne relevance is unclear.
3. ai_clear — content that looks like a sincere, on-topic contribution with no
   obvious issues. Human will still review.

Default to ai_flag when uncertain. Never default to ai_clear under uncertainty.

Return JSON: { "verdict": "hard_reject" | "ai_flag" | "ai_clear",
               "reasons": ["...", "..."],
               "confidence": 0.0–1.0 }
```

Followed by the submission's text fields and (for photos) the image(s). The function records the full verdict in `contributions.ai_verdict` for audit.

### 7.2 Costs

Per submission: ~1 Claude call. At Sonnet pricing and ~1K input tokens / 200 output tokens, ≈$0.005 per text submission, ≈$0.015 per photo submission (vision). At a steady state of 30 submissions/day, well under $10/month — far below the labor cost of triaging unscreened submissions.

Email send (Resend or Postmark): ~$0.0005 each. Negligible.

Storage: ~5 MB per photo submission post-resize × ~10 photos/day × 30 days = ~1.5 GB/month accruing. Supabase storage at $0.021/GB ≈ $0.03/month. Trivial. Long-term archive policy: photos older than 5 years move to a cold bucket (manual, quarterly).

---

## 8. Legal & Safety

### 8.1 IP attestation

Photo and story submissions require a checked attestation:

> I confirm I either took this photo / wrote this content myself, or I have permission from the person who did. I grant BoernesHandyHub a non-exclusive license to display this content on the site and in promotional material for the site. I can request removal at any time by emailing hello@boerneshandyhub.com.

The exact wording lives in `src/content/legal/contribution-attestation.mdx` so it can be updated without a code change. The attestation text version is stamped onto the submission row at submit time (`metadata.attestation_version`) so we know what each contributor agreed to.

### 8.2 Takedown

- A "Request removal" link on every public contribution opens a form prefilled with the contribution ID. Submitting unpublishes immediately and routes to admin for permanent decision within 7 days.
- Anyone can flag a public contribution (`contribution_flags` table). Three flags from distinct emails auto-unpublish and route to admin.
- A public DMCA / takedown contact at `/community/takedown` with email and form, per standard hosting hygiene.

### 8.3 Identifiable people

Photos featuring identifiable people (faces clearly visible) require a default flag from the AI pre-screen. The admin reviewer is responsible for confirming (a) the photo is clearly historical or (b) the people are public figures in obvious public-event context or (c) explicit consent is on file. When in doubt, reject with the canned reason "Couldn't verify subject consent."

Minors: faces of identifiable minors are an automatic hard-reject unless the submission is clearly historical (>20 years old) and clearly contextual (school photo, group event, parade). The AI prompt is tuned to flag these; the admin reviewer is the final gate.

### 8.4 Public figures and businesses

Stories about Boerne businesses or named local figures are allowed as long as factual claims are factual or clearly framed as personal memory ("I remember when..."). The AI prompt flags content that asserts disputable facts about named entities; the admin reviewer applies the standard.

The Terms of Use page (`/legal/terms`) needs a contribution section added: "When you submit content to BoernesHandyHub, you grant us..." Spec'd here, drafted in `docs/legal/contribution-terms-draft.md` for legal review before launch.

---

## 9. Public Surfaces

### 9.1 `/community` — the hub

A landing page with:

- A 1-line manifesto: "Boerne by the people who live here."
- Three featured cards: latest approved photo, latest published story, current most-voted tip list.
- Three section anchors: Photos, Stories, Tips (Lists).
- A persistent "Contribute →" CTA in the right rail.
- A "Top contributors this month" small module at the bottom.

### 9.2 `/community/photos`

Masonry gallery, lazy-loaded. Filter chips: "Historic" (year < 2000), "Current," neighborhood, category. Click any photo to open `/community/photos/[id]` with the full caption, contributor byline, year, location, and a "View more from [contributor]" link.

### 9.3 `/community/stories`

Magazine-style index page. Each card: cover image (first attached photo or a placeholder), title, contributor byline, era badge, 2-line excerpt. Sort: newest first; filter by era and tag.

`/community/stories/[slug]` — full story page. Title, byline + date, era, related-places chips at the top. Body text with embedded photos at the points specified by the contributor. "More by this contributor" rail at the bottom. Open Graph and Twitter Card meta tags so stories share well — the SEO upside on local-history searches is significant.

### 9.4 `/community/tips/[list-slug]`

A curated list page (e.g., `/community/tips/best-swimming-holes`). Each entry shows the pick, the why, the contributor byline, and the upvote count. Voting is restricted to verified contributors. New entries to a list are added via the standard contribution flow.

### 9.5 `/community/contributors/[slug]`

Per-contributor page showing their approved contributions in reverse chronological order, with their display name and the date they joined. No emails, no real-time activity, nothing trackable beyond what they chose to put on the site themselves.

### 9.6 Embedded community content

- **Category landing pages** (`/services/[category]`) get a "From the community" rail at the bottom: up to 4 photos and 2 story excerpts tagged with that category.
- **Subcategory pages** get a smaller version (2 photos, 1 story).
- **Business listing pages** get a "Stories featuring this place" module if any approved stories tag the business.
- **Neighborhood pages** (when they exist; deferred) get the same treatment with neighborhood-tagged content.

The embed component is `<CommunityRail target={{type, slug}} />`. It server-renders, queries `contribution_targets`, and shows the most recently published items. Empty state: hide the rail entirely.

---

## 10. Implementation Phases

| Phase | Scope | Ship gate |
|---|---|---|
| **P1 — Submission core** | Contributor table, contribution table, magic-link verify, `/contribute` page with all four type forms, `submit-contribution` and `screen-submission` Edge Functions, `/admin/community` queue tab, approve/reject + canned-reason rejection emails, hard-reject pipeline, IP attestation enforcement. | Levi can submit a feedback row, a photo, a story, and a tip from `/contribute`. AI pre-screen runs on each. Admin queue shows them with badges. Approve/reject flow works end-to-end including email. |
| **P2 — Public hub** | `/community` landing, `/community/photos`, `/community/stories` index and `/community/stories/[slug]` detail, `/community/tips/[list-slug]`, `publish-submission` function, derivative generation, contributor pages. | Approved content appears on the public hub. Stories have proper Open Graph metadata. Contributor pages list their work. |
| **P3 — Embedded surfaces + voting** | `<CommunityRail/>` component, integration on category/subcategory/listing pages, tip voting (with verified-contributor gate), search index integration. | A photo tagged with `outdoor` shows on `/services/outdoor`. Tip lists are voteable. Community content surfaces in site-wide search. |
| **P4 — Trust & long tail (future)** | Auto-approve trust tier, daily admin digest email, `community-digest` function, contributor profile customization, Supabase Auth migration path, takedown workflow refinement. | Levi's trusted contributors can post without manual approval (still AI-screened). Daily 8am digest hits Levi's inbox. |

P1 + P2 + P3 ship in one round behind a feature flag, gated commit-by-commit. P4 is a separate round when contribution volume justifies the polish.

---

## 11. The Governing Rule

Every public submission must be *approved by a human* and *carry an attested grant of license* before it goes live. The AI pre-screen reduces queue load — it does not replace approval. The IP attestation language is non-negotiable and is the legal foundation of the whole feature. If a future change would let content go live without one or both, that change is rejected on review.

This is the analog of `SEARCH_SPEC.md` § 9's no-pay-to-win rule: a single sentence the spec defends against drift over time.

---

## 12. Open Decisions for Levi

These are flagged so Claude Code does not silently choose:

1. **Email service.** Resend (cheapest, modern API, $0 up to 3K/mo) vs. Postmark (more transactional reliability, $15/mo) vs. Supabase's built-in (free, less control). Recommend Resend for v1.
2. **Display-name default.** Spec defaults to "First name only." Confirm or switch to "Full name."
3. **Initial tip lists at launch.** Recommend launching `/community/tips` with three seeded lists so it feels alive on day one: "Best swimming holes," "Kid-friendly lunch spots," "Where to take out-of-town family." Confirm or supply your own three.
4. **Search-index migration timing.** This spec assumes search ships first and gets migrated to add the new content types. If COMMUNITY ships before SEARCH, the search integration is pulled forward into P2 here. Confirm shipping order.
5. **Admin reviewers.** Levi only, or Levi + Lola from day one? If both, the admin panel needs a per-action audit trail (already in `contribution_events`) and a way to assign queue rows.
6. **Auto-approve threshold.** Spec says 5 approved + 0 rejected. Tunable. Confirm or change.
7. **Photo upload size cap.** Spec says 25 MB pre-resize, max 4 photos per submission. A community photo album from a parade might want more — should we allow up to 10 in a single submission?
8. **Comments / replies on stories.** Spec explicitly defers this to v2. Confirm or revisit.

---

## 13. Files to Create / Edit

```
src/
├── app/
│   ├── community/
│   │   ├── page.tsx                          ← hub landing
│   │   ├── photos/page.tsx
│   │   ├── photos/[id]/page.tsx
│   │   ├── stories/page.tsx
│   │   ├── stories/[slug]/page.tsx
│   │   ├── tips/page.tsx
│   │   ├── tips/[slug]/page.tsx
│   │   ├── contributors/[slug]/page.tsx
│   │   └── takedown/page.tsx
│   ├── contribute/
│   │   ├── page.tsx
│   │   └── verify/page.tsx                   ← magic-link landing
│   └── admin/
│       └── community/
│           ├── page.tsx                       ← queue
│           ├── contributors/page.tsx
│           └── decisions/page.tsx
├── components/
│   └── community/
│       ├── ContributeRouter.tsx               ← type picker + form swap
│       ├── FeedbackForm.tsx
│       ├── PhotoForm.tsx
│       ├── StoryForm.tsx
│       ├── TipForm.tsx
│       ├── PhotoGallery.tsx
│       ├── StoryCard.tsx
│       ├── TipListView.tsx
│       ├── ContributorByline.tsx
│       ├── CommunityRail.tsx                  ← embedded on category/listing pages
│       └── admin/
│           ├── QueueRow.tsx
│           ├── QueueFilters.tsx
│           └── DecisionDialog.tsx
├── content/legal/
│   ├── contribution-attestation.mdx
│   └── contribution-terms.mdx                 ← sourced into /legal/terms
└── lib/community/
    ├── client.ts
    ├── attestations.ts
    └── types.ts

supabase/
├── migrations/
│   ├── {ts}_community_schema.sql
│   ├── {ts}_community_storage_buckets.sql
│   └── {ts}_community_search_index_extension.sql
└── functions/
    ├── submit-contribution/index.ts
    ├── verify-contributor-email/index.ts
    ├── screen-submission/index.ts
    ├── publish-submission/index.ts
    ├── unpublish-submission/index.ts
    └── community-digest/index.ts

docs/
├── COMMUNITY_SPEC.md                           ← this file (committed copy)
└── legal/
    └── contribution-terms-draft.md             ← for review before launch
```

---

## 14. Handoff Prompt for Claude Code

Copy-paste the block below into Claude Code at the repo root. The spec doc should already be at `docs/COMMUNITY_SPEC.md` (commit it with the same `docs/` workflow as the other specs).

```
Implement the resident-contributions feature per docs/COMMUNITY_SPEC.md.

Sources of truth:
  - docs/COMMUNITY_SPEC.md         ← this feature's spec
  - docs/SEARCH_SPEC.md            ← search integration (P3)
  - docs/PRICING_SPEC.md           ← only relevant for the auto-approve trust tier UX copy
  - docs/HandyHub_Categories.xlsx  ← target_slug values for contribution_targets

Scope (single PR, three commits gated in this order):

  Commit 1 — P1 Submission core:
    a. Supabase migrations: full community schema per § 6 + storage buckets per § 6.1.
    b. Edge Functions: submit-contribution, verify-contributor-email, screen-submission.
    c. /contribute page with type picker and all four type forms per § 4.3.
    d. Magic-link email verification flow.
    e. /admin/community queue per § 5.3, including keyboard shortcuts.
    f. Approve / reject flows including templated rejection emails with canned reasons.
    g. IP attestation enforcement: submission server-side rejects without it; contributor
       row stamps the attestation_version from § 8.1.
    h. Hard-reject auto-email path.
    i. Audit logging into contribution_events at every state transition.

  Commit 2 — P2 Public hub:
    a. publish-submission Edge Function: bucket move, derivative generation, public_slug,
       published_at stamp, contribution_events log.
    b. /community landing per § 9.1.
    c. /community/photos masonry per § 9.2.
    d. /community/stories index + /community/stories/[slug] detail per § 9.3, including
       Open Graph and Twitter Card meta.
    e. /community/tips/[list-slug] per § 9.4.
    f. /community/contributors/[slug] per § 9.5.
    g. /community/takedown form per § 8.2.

  Commit 3 — P3 Embedded surfaces + voting + search:
    a. <CommunityRail target={...}/> component per § 9.6.
    b. Integration on /services/[category], /services/[category]/[subcategory], and
       business listing pages.
    c. Tip voting with verified-contributor gate per § 6 tip_votes table.
    d. Search index integration: extend search_documents source_type enum to include
       'photo' | 'story' | 'tip'; extend the search Edge Function's group caps;
       backfill index on publish via publish-submission.

Open decisions (§ 12) — DO NOT silently resolve. Surface in the PR description and
ask Levi to confirm before merge:
  - Email service (Resend / Postmark / Supabase built-in; default Resend).
  - Display-name default (default 'first_name').
  - Three seeded tip lists at launch.
  - Search-index migration timing (if SEARCH hasn't shipped, pull integration into P2).
  - Admin reviewer accounts (Levi only or Levi + Lola).
  - Auto-approve threshold (default 5 approved / 0 rejected — but only if Levi opts in to P4).
  - Per-submission photo cap (default 4).
  - Comments-on-stories (default deferred to v2).

The Governing Rule from § 11 must be enforced in code. CI test: a contribution row
in any state other than 'approved' MUST NOT appear in any public query. A contribution
row missing ip_attestation = true MUST NOT be approvable.

PR title: "Community contributions v1 (P1 + P2 + P3)"
PR description format: section per phase, with screenshots of (a) /contribute type picker,
(b) /contribute photo form filled out, (c) admin queue with one ai_flag and one ai_clear
visible, (d) rejection email preview, (e) /community hub, (f) a published story page,
(g) a category page with the CommunityRail visible.

Do NOT modify search, pricing, category, or unrelated code beyond the search-index
schema extension explicitly scoped above. Anything ambiguous between this spec and
existing code: surface in the PR description, do not reconcile silently.
```

---

## 15. Changelog

| Date | Change | By |
|---|---|---|
| 2026-04-30 | v1 draft. | Levi + Claude (chat) |
