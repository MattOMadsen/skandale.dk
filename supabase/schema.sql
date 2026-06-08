-- Kør i Supabase Dashboard → SQL Editor
-- https://supabase.com/dashboard/project/sqojoeimtmecdnopequk/sql

create table if not exists public.scandal_comments (
  id uuid primary key default gen_random_uuid(),
  scandal_key text not null,
  body text not null check (char_length(body) between 1 and 2000),
  created_at timestamptz not null default now(),
  is_approved boolean not null default true
);

create index if not exists scandal_comments_key_idx
  on public.scandal_comments (scandal_key, created_at desc);

create table if not exists public.scandal_severity_ratings (
  id uuid primary key default gen_random_uuid(),
  scandal_key text not null,
  rating smallint not null check (rating between 1 and 5),
  voter_id text not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (scandal_key, voter_id)
);

create index if not exists scandal_severity_ratings_key_idx
  on public.scandal_severity_ratings (scandal_key);

alter table public.scandal_comments enable row level security;
alter table public.scandal_severity_ratings enable row level security;

-- Kommentarer: alle kan læse godkendte, alle kan oprette
create policy "Læs godkendte kommentarer"
  on public.scandal_comments for select
  using (is_approved = true);

create policy "Opret kommentar"
  on public.scandal_comments for insert
  with check (is_approved = true);

-- Bedømmelser: alle kan læse og upserte egen stemme (via voter_id)
create policy "Læs bedømmelser"
  on public.scandal_severity_ratings for select
  using (true);

create policy "Upsert egen bedømmelse"
  on public.scandal_severity_ratings for insert
  with check (true);

create policy "Opdater egen bedømmelse"
  on public.scandal_severity_ratings for update
  using (true)
  with check (true);