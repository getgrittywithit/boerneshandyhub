-- Website System Schema
-- Per docs/WEBSITE_SYSTEM_SPEC.md
-- Enables trade-vertical websites for Verified tier businesses

-- Website status enum
create type website_status as enum (
  'draft',           -- Initial state, not submitted
  'pending_review',  -- Submitted, awaiting admin approval
  'changes_requested', -- Admin requested changes
  'approved',        -- Approved but not yet live
  'live',            -- Published and visible
  'flagged',         -- Flagged for review (post-publish)
  'suspended',       -- Admin suspended
  'archived'         -- Cancelled/expired
);

-- Template options
create type website_template as enum (
  'handyman',     -- Broad multi-trade
  'plumbing',     -- Plumbing & HVAC
  'electrical',   -- Electrical
  'painting',     -- Painting & General Contracting
  'landscaping'   -- Landscaping & Lawn Care
);

-- Photo moderation status
create type photo_status as enum (
  'pending',
  'approved',
  'flagged',
  'rejected'
);

-- Main websites table (one per business)
create table websites (
  id uuid primary key default gen_random_uuid(),
  business_id uuid not null references businesses(id) on delete cascade,
  template website_template not null default 'handyman',
  slug text not null unique,
  status website_status not null default 'draft',

  -- Branding
  primary_color text default '#1e3a5f',  -- Default to boerne-navy
  accent_color text default '#d4a853',   -- Default to boerne-gold

  -- Content
  tagline text,                          -- ≤80 chars
  about_text text,                       -- 50-500 chars

  -- Services (flexible structure)
  services jsonb default '[]'::jsonb,    -- [{name, description, price_range}]

  -- Service area
  service_area jsonb default '{}'::jsonb, -- {radius_miles, zip_codes[], cities[]}

  -- Hours
  hours jsonb default '{}'::jsonb,       -- {mon: {open, close}, ..., emergency_available: bool}
  emergency_available boolean default false,

  -- Credentials
  license_number text,
  license_state text default 'TX',
  insurance_carrier text,
  years_in_business integer,

  -- Testimonials (manual entry for v1)
  testimonials jsonb default '[]'::jsonb, -- [{name, text, rating, date}]

  -- Images (references to website_photos)
  hero_photo_id uuid,
  logo_photo_id uuid,
  gallery_photo_ids uuid[] default '{}',

  -- Review workflow
  submitted_at timestamptz,
  approved_at timestamptz,
  approved_by text,                      -- Admin email
  rejection_reason text,

  -- Lifecycle
  published_at timestamptz,
  expires_at timestamptz,
  archived_at timestamptz,

  -- Timestamps
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),

  unique (business_id)
);

-- Photos for websites
create table website_photos (
  id uuid primary key default gen_random_uuid(),
  website_id uuid not null references websites(id) on delete cascade,
  storage_path text not null,
  bucket text not null default 'website-photos',
  original_filename text,
  mime_type text not null,
  file_size integer,
  width integer,
  height integer,
  alt_text text,

  -- Moderation
  moderation_status photo_status not null default 'pending',
  moderation_score jsonb,                -- Raw response from Vision API
  moderation_notes text,
  flag_reasons text[],

  -- Derivatives (resized versions)
  derivatives jsonb,                     -- {thumb: path, medium: path, large: path}

  created_at timestamptz not null default now()
);

-- Edit history for audit trail
create table website_edits (
  id uuid primary key default gen_random_uuid(),
  website_id uuid not null references websites(id) on delete cascade,
  edited_by text,                        -- User email or 'system'
  edited_at timestamptz not null default now(),
  fields_changed text[],                 -- ['tagline', 'services', ...]
  previous_values jsonb,                 -- Snapshot of changed fields before edit
  new_values jsonb,                      -- Snapshot of changed fields after edit
  triggered_review boolean default false, -- Did this edit require re-review?
  auto_approved boolean default false    -- Was this auto-approved (low-risk change)?
);

-- Public reports on websites
create table website_reports (
  id uuid primary key default gen_random_uuid(),
  website_id uuid not null references websites(id) on delete cascade,
  reporter_email text,
  reporter_ip inet,
  reason text not null,                  -- 'inaccurate', 'fraud', 'inappropriate', 'impersonation', 'other'
  details text,
  reported_at timestamptz not null default now(),
  reviewed_at timestamptz,
  reviewed_by text,
  resolution text                        -- 'no_action', 'warned', 'edits_required', 'suspended', 'removed'
);

-- Trademark watchlist for moderation
create table trademark_watchlist (
  id uuid primary key default gen_random_uuid(),
  protected_term text not null,          -- 'Home Depot', 'Lowe's', 'ServPro', etc.
  match_type text not null default 'contains', -- 'exact' or 'contains'
  notes text,
  created_at timestamptz not null default now()
);

-- Reserved slugs (prevent squatting on common terms)
create table reserved_slugs (
  slug text primary key,
  reason text,
  created_at timestamptz not null default now()
);

-- Indexes
create index websites_business_idx on websites(business_id);
create index websites_status_idx on websites(status);
create index websites_slug_idx on websites(slug);
create index website_photos_website_idx on website_photos(website_id);
create index website_photos_status_idx on website_photos(moderation_status);
create index website_edits_website_idx on website_edits(website_id);
create index website_reports_website_idx on website_reports(website_id);
create index trademark_watchlist_term_idx on trademark_watchlist(protected_term);

-- RLS
alter table websites enable row level security;
alter table website_photos enable row level security;
alter table website_edits enable row level security;
alter table website_reports enable row level security;
alter table trademark_watchlist enable row level security;
alter table reserved_slugs enable row level security;

-- Public can view live websites
create policy "Live websites are public"
  on websites for select
  using (status = 'live');

-- Public can view photos of live websites
create policy "Photos of live websites are public"
  on website_photos for select
  using (
    exists (
      select 1 from websites w
      where w.id = website_photos.website_id
      and w.status = 'live'
    )
  );

-- Service role full access (for API routes)
create policy "Service role full access to websites"
  on websites for all using (true) with check (true);

create policy "Service role full access to website_photos"
  on website_photos for all using (true) with check (true);

create policy "Service role full access to website_edits"
  on website_edits for all using (true) with check (true);

create policy "Service role full access to website_reports"
  on website_reports for all using (true) with check (true);

create policy "Service role full access to trademark_watchlist"
  on trademark_watchlist for all using (true) with check (true);

create policy "Service role full access to reserved_slugs"
  on reserved_slugs for all using (true) with check (true);

-- Updated_at trigger
create trigger websites_updated_at
  before update on websites
  for each row
  execute function update_updated_at_column();

-- Seed reserved slugs
insert into reserved_slugs (slug, reason) values
  ('admin', 'System reserved'),
  ('dashboard', 'System reserved'),
  ('api', 'System reserved'),
  ('login', 'System reserved'),
  ('signup', 'System reserved'),
  ('register', 'System reserved'),
  ('settings', 'System reserved'),
  ('profile', 'System reserved'),
  ('boerne-plumber', 'Generic term reserved'),
  ('boerne-plumbing', 'Generic term reserved'),
  ('boerne-electrician', 'Generic term reserved'),
  ('boerne-electrical', 'Generic term reserved'),
  ('boerne-handyman', 'Generic term reserved'),
  ('boerne-painter', 'Generic term reserved'),
  ('boerne-painting', 'Generic term reserved'),
  ('boerne-landscaping', 'Generic term reserved'),
  ('boerne-lawn-care', 'Generic term reserved'),
  ('best-plumber', 'Generic term reserved'),
  ('best-electrician', 'Generic term reserved'),
  ('best-handyman', 'Generic term reserved');

-- Seed trademark watchlist
insert into trademark_watchlist (protected_term, match_type, notes) values
  ('home depot', 'contains', 'National chain'),
  ('lowes', 'contains', 'National chain'),
  ('lowe''s', 'contains', 'National chain'),
  ('servpro', 'contains', 'National franchise'),
  ('mr. rooter', 'contains', 'National franchise'),
  ('mr rooter', 'contains', 'National franchise'),
  ('roto-rooter', 'contains', 'National franchise'),
  ('roto rooter', 'contains', 'National franchise'),
  ('benjamin moore', 'contains', 'Paint brand'),
  ('sherwin williams', 'contains', 'Paint brand'),
  ('ace hardware', 'contains', 'National chain'),
  ('trugreen', 'contains', 'National franchise'),
  ('scotts', 'contains', 'National brand'),
  ('servicemaster', 'contains', 'National franchise'),
  ('stanley steemer', 'contains', 'National franchise');

-- Function to generate slug from business name
create or replace function generate_website_slug(business_name text)
returns text as $$
declare
  base_slug text;
  final_slug text;
  counter integer := 0;
begin
  -- Convert to lowercase, replace spaces with hyphens, remove special chars
  base_slug := lower(regexp_replace(business_name, '[^a-zA-Z0-9\s-]', '', 'g'));
  base_slug := regexp_replace(base_slug, '\s+', '-', 'g');
  base_slug := regexp_replace(base_slug, '-+', '-', 'g');
  base_slug := trim(both '-' from base_slug);

  -- Limit length
  base_slug := left(base_slug, 50);

  final_slug := base_slug;

  -- Check for uniqueness
  while exists (select 1 from websites where slug = final_slug)
        or exists (select 1 from reserved_slugs where slug = final_slug) loop
    counter := counter + 1;
    final_slug := base_slug || '-' || counter;
  end loop;

  return final_slug;
end;
$$ language plpgsql
set search_path = public;
