-- Clear Reps · app tables for the standalone PWA.
-- Run once in Supabase → SQL editor (project "clear-reps"). Safe to re-run.
-- The health_* tables from schema.sql already exist; this file only adds what the app needs.

-- 1) One generic table holds every synced document (workouts, check-ins, settings).
--    Each row belongs to the signed-in user; last write wins by updated_at.
create table if not exists public.documents (
  user_id    uuid        not null references auth.users(id) on delete cascade,
  coll       text        not null,            -- 'workouts' | 'checkins' | 'settings'
  id         text        not null,            -- the app's own id for the document
  data       jsonb       not null default '{}'::jsonb,
  deleted    boolean     not null default false,
  updated_at timestamptz not null default now(),
  primary key (user_id, coll, id)
);
create index if not exists documents_user_updated on public.documents (user_id, updated_at);

alter table public.documents enable row level security;
drop policy if exists "own documents" on public.documents;
create policy "own documents" on public.documents
  for all to authenticated
  using (user_id = auth.uid()) with check (user_id = auth.uid());

-- 2) Progress photos: a private Storage bucket, each user only inside their own folder.
insert into storage.buckets (id, name, public) values ('photos', 'photos', false)
  on conflict (id) do nothing;
drop policy if exists "own photos" on storage.objects;
create policy "own photos" on storage.objects
  for all to authenticated
  using (bucket_id = 'photos' and (storage.foldername(name))[1] = auth.uid()::text)
  with check (bucket_id = 'photos' and (storage.foldername(name))[1] = auth.uid()::text);

-- 3) Apple Health: the tables stay locked to the service role (the Shortcut writes through the
--    health-sync function). The app reads a compact bundle through this function instead.
--    It is a single-user project, so any signed-in user may read it.
create or replace function public.health_bundle()
returns json
language sql
security definer
set search_path = public
stable
as $$
  select json_build_object(
    'days', (select coalesce(json_agg(d order by d.day desc), '[]'::json) from (
       select day, steps, resting_hr, avg_hr, hrv_ms, sleep_hours, active_kcal, weight_kg, updated_at
       from public.health_daily where day >= current_date - 45) d),
    'workouts', (select coalesce(json_agg(w order by w.started_at desc), '[]'::json) from (
       select started_at, ended_at, kind, duration_min, avg_hr, max_hr, kcal
       from public.health_workouts where started_at >= now() - interval '45 days') w),
    'hr', (select coalesce(json_agg(json_build_array(extract(epoch from x.m)::bigint, round(x.b)) order by x.m), '[]'::json) from (
       select date_trunc('minute', ts) m, avg(bpm) b
       from public.health_hr where ts >= now() - interval '35 days' group by 1) x)
  );
$$;
revoke all on function public.health_bundle() from public, anon;
grant execute on function public.health_bundle() to authenticated;
