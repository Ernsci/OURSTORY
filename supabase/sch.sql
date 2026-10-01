create extension if not exists "pgcrypto";

-- ---------------------------------------------------------------- couple settings
create table if not exists public.couple_settings (
  id          boolean primary key default true check (id),
  title       text not null default 'Chaddy & Rei',
  short_title text not null default 'C & R',
  start_date  date  not null default '2026-08-01',
  tagline     text not null default '',
  about       text not null default ''
);

insert into public.couple_settings (id) values (true) on conflict (id) do nothing;

-- ------------------------------------------------------------------------ people
create table if not exists public.people (
  id        uuid primary key default gen_random_uuid(),
  name      text not null,
  initials  text not null default '',
  birthday  date not null,
  role      text not null default '',
  traits    jsonb not null default '[]'::jsonb,
  position  int  not null default 0
);

-- ------------------------------------------------------------------- journal
create table if not exists public.journal_entries (
  id         uuid primary key default gen_random_uuid(),
  entry_date date not null,
  message    text not null default '',
  feeling    text not null default '',
  created_at timestamptz not null default now()
);

create index if not exists journal_entries_date_idx on public.journal_entries (entry_date desc);

-- ---------------------------------------------------------------- monthsaries
create table if not exists public.monthsary_entries (
  id     uuid primary key default gen_random_uuid(),
  month  int  not null unique check (month between 1 and 12),
  title  text not null,
  theme  text not null default '',
  body   text not null default '',
  ritual text not null default ''
);

-- -------------------------------------------------------------------- letters
create table if not exists public.letters (
  id           uuid primary key default gen_random_uuid(),
  author       text not null default '',
  recipient    text not null default '',
  letter_date  date not null default current_date,
  title        text not null default '',
  body         jsonb not null default '[]'::jsonb,
  signature    text not null default '',
  position     int  not null default 0
);

-- --------------------------------------------------------------------- photos
create table if not exists public.photos (
  id           uuid primary key default gen_random_uuid(),
  storage_path text not null,
  file_name    text not null,
  taken_at     timestamptz not null default now(),
  created_at   timestamptz not null default now()
);

create index if not exists photos_taken_at_idx on public.photos (taken_at desc);

-- --------------------------------------------------------------------- storage
insert into storage.buckets (id, name, public)
values ('scrapbook', 'scrapbook', true)
on conflict (id) do nothing;

-- ------------------------------------------------------------------ row level
-- Everyone can read (the scrapbook is public). Only signed-in admins can write.
do $$
declare
  t text;
begin
  foreach t in array array[
    'couple_settings', 'people', 'journal_entries', 'monthsary_entries', 'letters', 'photos'
  ]
  loop
    execute format('alter table public.%I enable row level security', t);

    execute format('drop policy if exists "%s_read" on public.%I', t, t);
    execute format(
      'create policy "%s_read" on public.%I for select using (true)', t, t);

    execute format('drop policy if exists "%s_insert" on public.%I', t, t);
    execute format(
      'create policy "%s_insert" on public.%I for insert to authenticated with check (true)', t, t);

    execute format('drop policy if exists "%s_update" on public.%I', t, t);
    execute format(
      'create policy "%s_update" on public.%I for update to authenticated using (true) with check (true)', t, t);

    execute format('drop policy if exists "%s_delete" on public.%I', t, t);
    execute format(
      'create policy "%s_delete" on public.%I for delete to authenticated using (true)', t, t);
  end loop;
end $$;

drop policy if exists "scrapbook_read" on storage.objects;
create policy "scrapbook_read" on storage.objects
  for select using (bucket_id = 'scrapbook');

drop policy if exists "scrapbook_insert" on storage.objects;
create policy "scrapbook_insert" on storage.objects
  for insert to authenticated with check (bucket_id = 'scrapbook');

drop policy if exists "scrapbook_update" on storage.objects;
create policy "scrapbook_update" on storage.objects
  for update to authenticated using (bucket_id = 'scrapbook');

drop policy if exists "scrapbook_delete" on storage.objects;
create policy "scrapbook_delete" on storage.objects
  for delete to authenticated using (bucket_id = 'scrapbook');