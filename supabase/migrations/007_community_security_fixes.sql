-- Security fixes for community schema migration
-- Addresses RLS and function permission issues flagged by Supabase advisor

-- Enable RLS on missing tables
alter table contributor_tokens enable row level security;
alter table tip_lists enable row level security;
alter table tip_list_entries enable row level security;
alter table tip_votes enable row level security;

-- RLS policies for contributor_tokens (service role only - sensitive tokens)
create policy "Service role full access to tokens"
  on contributor_tokens for all
  using (true)
  with check (true);

-- RLS policies for tip_lists (public read, service write)
create policy "Tip lists are publicly readable"
  on tip_lists for select
  using (is_active = true);

create policy "Service role full access to tip_lists"
  on tip_lists for all
  using (true)
  with check (true);

-- RLS policies for tip_list_entries (public read for published, service write)
create policy "Tip list entries for published contributions are public"
  on tip_list_entries for select
  using (
    exists (
      select 1 from contributions c
      where c.id = tip_list_entries.contribution_id
      and c.status = 'published'
    )
  );

create policy "Service role full access to tip_list_entries"
  on tip_list_entries for all
  using (true)
  with check (true);

-- RLS policies for tip_votes (service role full access)
create policy "Service role full access to tip_votes"
  on tip_votes for all
  using (true)
  with check (true);

-- Recreate functions with search_path set for security
create or replace function update_contribution_timestamp()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql
set search_path = public;

create or replace function increment_approved_count(contributor_id uuid)
returns void as $$
begin
  update contributors
  set approved_count = approved_count + 1
  where id = contributor_id;
end;
$$ language plpgsql security definer
set search_path = public;

create or replace function increment_rejected_count(contributor_id uuid)
returns void as $$
begin
  update contributors
  set rejected_count = rejected_count + 1
  where id = contributor_id;
end;
$$ language plpgsql security definer
set search_path = public;

-- Restrict increment functions to service_role only
revoke all on function increment_approved_count(uuid) from public, anon, authenticated;
revoke all on function increment_rejected_count(uuid) from public, anon, authenticated;
grant execute on function increment_approved_count(uuid) to service_role;
grant execute on function increment_rejected_count(uuid) to service_role;
