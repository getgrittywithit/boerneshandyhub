-- Fix remaining security warnings
-- Applied: 2026-05-01

-- 1. Fix function search_path for all affected functions
create or replace function handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, email, full_name)
  values (new.id, new.email, new.raw_user_meta_data->>'full_name');
  return new;
end;
$$ language plpgsql security definer
set search_path = public;

create or replace function update_updated_at_column()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql
set search_path = public;

create or replace function update_business_daily_aggregate()
returns trigger as $$
begin
  insert into business_analytics_daily (business_id, date, views, clicks, calls, emails)
  values (
    new.business_id,
    date(new.created_at),
    case when new.event_type = 'view' then 1 else 0 end,
    case when new.event_type = 'click' then 1 else 0 end,
    case when new.event_type = 'call' then 1 else 0 end,
    case when new.event_type = 'email' then 1 else 0 end
  )
  on conflict (business_id, date)
  do update set
    views = business_analytics_daily.views + excluded.views,
    clicks = business_analytics_daily.clicks + excluded.clicks,
    calls = business_analytics_daily.calls + excluded.calls,
    emails = business_analytics_daily.emails + excluded.emails;
  return new;
end;
$$ language plpgsql security definer
set search_path = public;

create or replace function update_packet_view_stats()
returns trigger as $$
begin
  update packets
  set
    view_count = view_count + 1,
    last_viewed_at = now()
  where id = new.packet_id;
  return new;
end;
$$ language plpgsql security definer
set search_path = public;

create or replace function search_documents_tsv_trigger()
returns trigger as $$
begin
  new.tsv :=
    setweight(to_tsvector('english', coalesce(new.title, '')), 'A') ||
    setweight(to_tsvector('english', coalesce(new.subtitle, '')), 'B') ||
    setweight(to_tsvector('english', array_to_string(coalesce(new.keywords, '{}'), ' ')), 'B') ||
    setweight(to_tsvector('english', coalesce(new.description, '')), 'C');
  return new;
end;
$$ language plpgsql
set search_path = public;

-- 2. Revoke execute on SECURITY DEFINER functions from anon/authenticated
revoke execute on function handle_new_user() from public, anon, authenticated;
revoke execute on function update_packet_view_stats() from public, anon, authenticated;
revoke execute on function update_business_daily_aggregate() from public, anon, authenticated;

-- 3. Tighten storage bucket policy for home-tracker-materials
drop policy if exists "Material photos publicly viewable" on storage.objects;

create policy "Material photos publicly viewable by path"
  on storage.objects for select
  using (
    bucket_id = 'home-tracker-materials'
    and auth.role() = 'authenticated'
  );

-- 4. Recreate search_documents_hybrid with search_path
drop function if exists search_documents_hybrid(text, vector(1536), int, text, text);

create function search_documents_hybrid(
  query_text text,
  query_embedding vector(1536),
  match_limit int default 20,
  scope_category text default null,
  scope_subcategory text default null
)
returns table (
  id uuid,
  source_type text,
  source_id text,
  title text,
  subtitle text,
  description text,
  url text,
  tier text,
  category_slug text,
  subcategory_slug text,
  keyword_rank real,
  semantic_rank real,
  combined_score real
) as $$
begin
  return query
  with keyword_matches as (
    select
      sd.id,
      sd.source_type::text,
      sd.source_id,
      sd.title,
      sd.subtitle,
      sd.description,
      sd.url,
      sd.tier,
      sd.category_slug,
      sd.subcategory_slug,
      sd.boost,
      ts_rank_cd(sd.tsv, websearch_to_tsquery('english', query_text)) as kw_score
    from search_documents sd
    where sd.is_active = true
      and sd.tsv @@ websearch_to_tsquery('english', query_text)
      and (scope_category is null or sd.category_slug = scope_category)
      and (scope_subcategory is null or sd.subcategory_slug = scope_subcategory)
  ),
  semantic_matches as (
    select
      sd.id,
      sd.source_type::text,
      sd.source_id,
      sd.title,
      sd.subtitle,
      sd.description,
      sd.url,
      sd.tier,
      sd.category_slug,
      sd.subcategory_slug,
      sd.boost,
      1 - (sd.embedding <=> query_embedding) as sem_score
    from search_documents sd
    where sd.is_active = true
      and sd.embedding is not null
      and (scope_category is null or sd.category_slug = scope_category)
      and (scope_subcategory is null or sd.subcategory_slug = scope_subcategory)
    order by sd.embedding <=> query_embedding
    limit match_limit * 2
  ),
  combined as (
    select
      coalesce(k.id, s.id) as id,
      coalesce(k.source_type, s.source_type) as source_type,
      coalesce(k.source_id, s.source_id) as source_id,
      coalesce(k.title, s.title) as title,
      coalesce(k.subtitle, s.subtitle) as subtitle,
      coalesce(k.description, s.description) as description,
      coalesce(k.url, s.url) as url,
      coalesce(k.tier, s.tier) as tier,
      coalesce(k.category_slug, s.category_slug) as category_slug,
      coalesce(k.subcategory_slug, s.subcategory_slug) as subcategory_slug,
      coalesce(k.boost, s.boost, 1.0) as boost,
      coalesce(k.kw_score, 0) as keyword_rank,
      coalesce(s.sem_score, 0) as semantic_rank
    from keyword_matches k
    full outer join semantic_matches s on k.id = s.id
  )
  select
    c.id,
    c.source_type,
    c.source_id,
    c.title,
    c.subtitle,
    c.description,
    c.url,
    c.tier,
    c.category_slug,
    c.subcategory_slug,
    c.keyword_rank,
    c.semantic_rank,
    ((c.keyword_rank * 0.4) + (c.semantic_rank * 0.6)) * c.boost as combined_score
  from combined c
  order by combined_score desc
  limit match_limit;
end;
$$ language plpgsql stable
set search_path = public;
