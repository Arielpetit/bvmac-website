-- BVMAC admin content: notices, news, tenders, bulletins + document storage.
-- Run once in the Supabase SQL editor (Dashboard > SQL Editor).
--
-- Access model:
--   * Everyone (anon) can read rows where published = true.
--   * Staff = signed-in users whose app_metadata.role is 'editor' or 'admin'.
--     Staff can read drafts, create and edit rows. Only 'admin' can delete.
--   * app_metadata can only be changed server-side (SQL editor / dashboard),
--     never by the user, so it is safe to use in policies.

-- ---------------------------------------------------------------- helpers
create or replace function public.staff_role()
returns text
language sql
stable
set search_path = ''
as $$
  select coalesce((select auth.jwt()) -> 'app_metadata' ->> 'role', '');
$$;

create or replace function public.touch_updated_at()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  new.updated_at = now();
  new.updated_by = (select auth.uid());
  return new;
end;
$$;

-- ----------------------------------------------------------------- tables
create table if not exists public.notices (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  number text,
  type text not null default 'avis' check (type in ('avis','communique','decision','convocation','ost')),
  title text not null,
  original_title text,
  notice_date date not null,
  issuer text,
  country text check (country in ('CM','CF','CG','GA','GQ','TD')),
  url text not null,
  published boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  updated_by uuid references auth.users (id) on delete set null
);

create table if not exists public.news (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  title text not null,
  news_date date not null,
  excerpt text not null default '',
  category text not null default 'Marché' check (category in ('Marché','Institutionnel','Événements','Recrutement')),
  image text not null default '/photos/bvmac-building.webp',
  url text,
  published boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  updated_by uuid references auth.users (id) on delete set null
);

create table if not exists public.tenders (
  id uuid primary key default gen_random_uuid(),
  ref text not null unique,
  title text not null,
  type text not null default 'Appel d’offres' check (type in ('Appel d’offres','Manifestation d’intérêt','Appel à candidatures','Recrutement')),
  published_on date not null,
  deadline date,
  is_open boolean not null default true,
  url text not null,
  published boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  updated_by uuid references auth.users (id) on delete set null
);

create table if not exists public.bulletins (
  id uuid primary key default gen_random_uuid(),
  number text not null unique,
  session_date date not null unique,
  url text not null,
  published boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  updated_by uuid references auth.users (id) on delete set null
);

create index if not exists notices_date_idx on public.notices (notice_date desc);
create index if not exists news_date_idx on public.news (news_date desc);
create index if not exists tenders_date_idx on public.tenders (published_on desc);
create index if not exists bulletins_date_idx on public.bulletins (session_date desc);
create index if not exists notices_updated_by_idx on public.notices (updated_by);
create index if not exists news_updated_by_idx on public.news (updated_by);
create index if not exists tenders_updated_by_idx on public.tenders (updated_by);
create index if not exists bulletins_updated_by_idx on public.bulletins (updated_by);

do $$
declare t text;
begin
  foreach t in array array['notices','news','tenders','bulletins'] loop
    execute format('drop trigger if exists touch_%1$s on public.%1$s', t);
    execute format('create trigger touch_%1$s before insert or update on public.%1$s for each row execute function public.touch_updated_at()', t);
    execute format('alter table public.%I enable row level security', t);
    execute format('drop policy if exists "public read published" on public.%I', t);
    execute format('drop policy if exists "staff read all" on public.%I', t);
    execute format('drop policy if exists "staff insert" on public.%I', t);
    execute format('drop policy if exists "staff update" on public.%I', t);
    execute format('drop policy if exists "admin delete" on public.%I', t);
    execute format('create policy "public read published" on public.%I for select to anon, authenticated using (published = true)', t);
    execute format('create policy "staff read all" on public.%I for select to authenticated using (public.staff_role() in (''editor'',''admin''))', t);
    execute format('create policy "staff insert" on public.%I for insert to authenticated with check (public.staff_role() in (''editor'',''admin''))', t);
    execute format('create policy "staff update" on public.%I for update to authenticated using (public.staff_role() in (''editor'',''admin'')) with check (public.staff_role() in (''editor'',''admin''))', t);
    execute format('create policy "admin delete" on public.%I for delete to authenticated using (public.staff_role() = ''admin'')', t);
    execute format('grant select on public.%I to anon', t);
    execute format('grant select, insert, update, delete on public.%I to authenticated', t);
  end loop;
end $$;

-- ---------------------------------------------------------------- storage
-- Public bucket: files are served by URL; only staff may upload or change them.
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('documents', 'documents', true, 26214400,
  array['application/pdf','image/jpeg','image/png','image/webp',
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet','text/csv'])
on conflict (id) do update set public = true, file_size_limit = 26214400;

drop policy if exists "staff list documents" on storage.objects;
drop policy if exists "staff upload documents" on storage.objects;
drop policy if exists "staff update documents" on storage.objects;
drop policy if exists "admin delete documents" on storage.objects;

create policy "staff list documents" on storage.objects for select to authenticated
  using (bucket_id = 'documents' and public.staff_role() in ('editor','admin'));
create policy "staff upload documents" on storage.objects for insert to authenticated
  with check (bucket_id = 'documents' and public.staff_role() in ('editor','admin'));
create policy "staff update documents" on storage.objects for update to authenticated
  using (bucket_id = 'documents' and public.staff_role() in ('editor','admin'))
  with check (bucket_id = 'documents' and public.staff_role() in ('editor','admin'));
create policy "admin delete documents" on storage.objects for delete to authenticated
  using (bucket_id = 'documents' and public.staff_role() = 'admin');

-- ---------------------------------------------------------- first admin
-- 1. Dashboard > Authentication > Users > Add user (e-mail + password).
-- 2. Replace the e-mail below and run this statement:
--
-- update auth.users
--    set raw_app_meta_data = coalesce(raw_app_meta_data, '{}'::jsonb) || '{"role":"admin"}'::jsonb
--  where email = 'PUT-THE-ADMIN-EMAIL-HERE';
