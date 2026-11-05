-- Clear Reps: Supabase schema as it exists today (project "clear-reps", ref vjppymebgysvxnrqunua, eu-central-1)
create table public.health_daily (
  day date primary key, steps integer, resting_hr numeric, avg_hr numeric, hrv_ms numeric,
  sleep_hours numeric, active_kcal numeric, weight_kg numeric, updated_at timestamptz not null default now());
create table public.health_workouts (
  id text primary key, started_at timestamptz not null, ended_at timestamptz, kind text,
  duration_min numeric, avg_hr numeric, max_hr numeric, kcal numeric, updated_at timestamptz not null default now());
create table public.ingest_keys (key_hash text primary key, label text, created_at timestamptz not null default now());
create table public.health_raw (id bigint generated always as identity primary key, received_at timestamptz not null default now(), body text);
create table public.health_hr (ts timestamptz primary key, bpm numeric not null);
alter table public.health_daily enable row level security;
alter table public.health_workouts enable row level security;
alter table public.ingest_keys enable row level security;
alter table public.health_raw enable row level security;
alter table public.health_hr enable row level security;
revoke all on public.health_daily, public.health_workouts, public.ingest_keys, public.health_raw, public.health_hr from anon, authenticated;
-- ingest_keys holds sha256(sync key). The iPhone Shortcut sends the raw key in the x-sync-key header.
