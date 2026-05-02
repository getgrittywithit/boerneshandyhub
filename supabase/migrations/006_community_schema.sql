-- Community Contributions Schema
-- Per docs/COMMUNITY_SPEC.md § 6

-- Enable required extensions
create extension if not exists "uuid-ossp";

-- Enum types
create type contribution_type as enum ('feedback', 'photo', 'story', 'tip');
create type contribution_status as enum (
  'submitted', 'ai_screening', 'ai_clear', 'ai_flag', 'hard_reject',
  'admin_pending', 'approved', 'rejected', 'published'
);
create type display_pref as enum ('full_name', 'first_name', 'initials', 'anonymous');
create type contributor_status as enum ('active', 'banned', 'starred');

-- Contributors table (email-verified identity, not full accounts in v1)
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

-- Magic link tokens for email verification
create table contributor_tokens (
  id                  uuid primary key default uuid_generate_v4(),
  contributor_id      uuid not null references contributors(id) on delete cascade,
  token               text unique not null,
  expires_at          timestamptz not null,
  used_at             timestamptz,
  created_at          timestamptz not null default now()
);

-- Main contributions table
create table contributions (
  id                  uuid primary key default uuid_generate_v4(),
  contributor_id      uuid references contributors(id) on delete restrict,
  type                contribution_type not null,
  status              contribution_status not null default 'submitted',
  title               text,
  body                text,                              -- story body, tip text, feedback message
  metadata            jsonb not null default '{}'::jsonb, -- year, location, era, list_slug, attestation_version, etc.
  ai_verdict          jsonb,                             -- raw screen output for audit
  ai_screened_at      timestamptz,
  reviewed_at         timestamptz,
  reviewed_by         text,                              -- admin email
  reject_reason       text,
  published_at        timestamptz,
  public_slug         text,                              -- for stories and tip entries
  ip_attestation      boolean not null default false,
  accuracy_attestation boolean,
  submission_ip       inet,                              -- audit only, never displayed
  created_at          timestamptz not null default now(),
  updated_at          timestamptz not null default now()
);

-- Assets (photos) attached to contributions
create table contribution_assets (
  id                  uuid primary key default uuid_generate_v4(),
  contribution_id     uuid not null references contributions(id) on delete cascade,
  storage_path        text not null,                     -- pending or published bucket path
  bucket              text not null,                     -- 'community-uploads-pending' or 'community-uploads'
  mime_type           text not null,
  file_size           integer,                           -- in bytes
  width               integer,
  height              integer,
  caption             text,
  year                integer,                           -- null = "current"
  location            text,
  neighborhood        text,
  ordering            integer not null default 0,
  derivatives         jsonb,                             -- { thumb: path, medium: path, full: path }
  created_at          timestamptz not null default now()
);

-- Target relationships (categories, businesses, neighborhoods)
create table contribution_targets (
  id                  uuid primary key default uuid_generate_v4(),
  contribution_id     uuid not null references contributions(id) on delete cascade,
  target_type         text not null,    -- 'category' | 'subcategory' | 'business' | 'neighborhood' | 'global'
  target_slug         text not null,
  unique (contribution_id, target_type, target_slug)
);

-- Curated tip lists (admin-created containers)
create table tip_lists (
  id                  uuid primary key default uuid_generate_v4(),
  slug                text unique not null,
  title               text not null,
  description         text,
  is_active           boolean not null default true,
  created_at          timestamptz not null default now()
);

-- Entries in tip lists (one contribution = one entry)
create table tip_list_entries (
  id                  uuid primary key default uuid_generate_v4(),
  list_id             uuid not null references tip_lists(id) on delete cascade,
  contribution_id     uuid not null references contributions(id) on delete cascade,
  upvotes             integer not null default 0,
  position            integer,
  unique (list_id, contribution_id)
);

-- Votes on tip entries (from verified contributors)
create table tip_votes (
  id                  uuid primary key default uuid_generate_v4(),
  tip_list_entry_id   uuid not null references tip_list_entries(id) on delete cascade,
  contributor_id      uuid not null references contributors(id) on delete cascade,
  value               smallint not null check (value in (-1, 1)),
  created_at          timestamptz not null default now(),
  unique (tip_list_entry_id, contributor_id)
);

-- Public flags on contributions (3 flags = auto-unpublish)
create table contribution_flags (
  id                  uuid primary key default uuid_generate_v4(),
  contribution_id     uuid not null references contributions(id) on delete cascade,
  flagger_email       text,
  flagger_ip          inet,
  reason              text not null,
  created_at          timestamptz not null default now()
);

-- Audit / analytics event log
create table contribution_events (
  id                  uuid primary key default uuid_generate_v4(),
  contribution_id     uuid not null references contributions(id) on delete cascade,
  event               text not null,    -- 'submitted', 'ai_clear', 'ai_flag', 'hard_reject', 'approved', 'rejected', 'published', 'unpublished', 'edited', 'flagged'
  actor               text,             -- admin email or 'system' or 'ai'
  payload             jsonb,
  created_at          timestamptz not null default now()
);

-- Indexes for performance
create index contributions_status_idx       on contributions(status);
create index contributions_type_status_idx  on contributions(type, status);
create index contributions_published_idx    on contributions(published_at desc) where status = 'published';
create index contributions_contributor_idx  on contributions(contributor_id);
create index targets_target_idx             on contribution_targets(target_type, target_slug);
create index assets_contribution_idx        on contribution_assets(contribution_id);
create index events_contribution_idx        on contribution_events(contribution_id, created_at desc);
create index tokens_token_idx               on contributor_tokens(token) where used_at is null;
create index contributors_email_idx         on contributors(email);

-- Row-level security (RLS) policies
alter table contributors enable row level security;
alter table contributions enable row level security;
alter table contribution_assets enable row level security;
alter table contribution_targets enable row level security;
alter table contribution_events enable row level security;
alter table contribution_flags enable row level security;

-- Public can read published contributions
create policy "Published contributions are public"
  on contributions for select
  using (status = 'published');

-- Public can read assets of published contributions
create policy "Assets of published contributions are public"
  on contribution_assets for select
  using (
    exists (
      select 1 from contributions c
      where c.id = contribution_assets.contribution_id
      and c.status = 'published'
    )
  );

-- Service role can do everything (for API routes)
create policy "Service role full access to contributors"
  on contributors for all
  using (true)
  with check (true);

create policy "Service role full access to contributions"
  on contributions for all
  using (true)
  with check (true);

create policy "Service role full access to assets"
  on contribution_assets for all
  using (true)
  with check (true);

create policy "Service role full access to targets"
  on contribution_targets for all
  using (true)
  with check (true);

create policy "Service role full access to events"
  on contribution_events for all
  using (true)
  with check (true);

create policy "Service role full access to flags"
  on contribution_flags for all
  using (true)
  with check (true);

-- Seed initial tip lists per spec recommendation
insert into tip_lists (slug, title, description) values
  ('best-swimming-holes', 'Best Swimming Holes', 'Where to cool off in the Hill Country'),
  ('kid-friendly-lunch', 'Kid-Friendly Lunch Spots', 'Family-friendly restaurants in Boerne'),
  ('out-of-town-family', 'Where to Take Out-of-Town Family', 'Must-visit spots when showing off Boerne');

-- Function to update updated_at timestamp
create or replace function update_contribution_timestamp()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger contributions_updated_at
  before update on contributions
  for each row
  execute function update_contribution_timestamp();

-- RPC functions for updating contributor counts
create or replace function increment_approved_count(contributor_id uuid)
returns void as $$
begin
  update contributors
  set approved_count = approved_count + 1
  where id = contributor_id;
end;
$$ language plpgsql security definer;

create or replace function increment_rejected_count(contributor_id uuid)
returns void as $$
begin
  update contributors
  set rejected_count = rejected_count + 1
  where id = contributor_id;
end;
$$ language plpgsql security definer;
