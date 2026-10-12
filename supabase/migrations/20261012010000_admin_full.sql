-- BVMAC admin, part 2: every editable part of the site, site settings,
-- activity log, profiles and two-factor enforcement.

create schema if not exists private;
grant usage on schema private to authenticated, anon;

-- Does the current user have a verified second factor?
create or replace function private.has_verified_mfa()
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1 from auth.mfa_factors f
    where f.user_id = (select auth.uid()) and f.status = 'verified'
  );
$$;
revoke all on function private.has_verified_mfa() from public;
grant execute on function private.has_verified_mfa() to authenticated;

create table if not exists public.site_settings (
  key text primary key,
  value jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now(),
  updated_by uuid references auth.users (id) on delete set null
);

-- Staff role, valid only with a second factor when one is enrolled
-- or when two-factor is required for everyone (site_settings.security).
create or replace function public.staff_role()
returns text
language plpgsql
stable
set search_path = ''
as $$
declare
  claims jsonb := (select auth.jwt());
  r text := coalesce(claims -> 'app_metadata' ->> 'role', '');
  required boolean;
begin
  if r not in ('editor', 'admin') then
    return '';
  end if;
  if coalesce(claims ->> 'aal', 'aal1') = 'aal2' then
    return r;
  end if;
  select coalesce((s.value ->> 'require_2fa')::boolean, false) into required
    from public.site_settings s where s.key = 'security';
  if coalesce(required, false) or private.has_verified_mfa() then
    return '';
  end if;
  return r;
end;
$$;

-- ----------------------------------------------------------------- tables
create table if not exists public.equities (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  ticker text not null,
  name text not null,
  short_name text not null,
  isin text,
  country text check (country in ('CM','CF','CG','GA','GQ','TD')),
  sector text not null default '',
  compartment text,
  nominal numeric,
  listed_on text,
  dividend_amount numeric not null default 0,
  dividend_date date,
  reference_price numeric not null default 0,
  close_price numeric not null default 0,
  qty_demanded integer not null default 0,
  qty_offered integer not null default 0,
  qty_traded integer not null default 0,
  status text not null default 'NC',
  bio text not null default '',
  founded text,
  headquarters text not null default '',
  position integer not null default 0,
  published boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  updated_by uuid references auth.users (id) on delete set null
);

create table if not exists public.bonds (
  id uuid primary key default gen_random_uuid(),
  isin text not null unique,
  name text not null,
  issuer text not null default '',
  country text check (country in ('CM','CF','CG','GA','GQ','TD')),
  nominal numeric not null default 10000,
  reference numeric not null default 100,
  close numeric not null default 100,
  accrued numeric not null default 0,
  qty_demanded integer not null default 0,
  qty_offered integer not null default 0,
  qty_traded integer not null default 0,
  change numeric not null default 0,
  status text not null default 'NC',
  start_date date,
  maturity date,
  published boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  updated_by uuid references auth.users (id) on delete set null
);

create table if not exists public.agenda (
  id uuid primary key default gen_random_uuid(),
  event_date date not null,
  end_date date,
  type text not null default 'ag' check (type in ('dividende','ag','coupon','remboursement','introduction','souscription','resultats','suspension','autre')),
  issuer text not null,
  detail text not null default '',
  notice_slug text,
  published boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  updated_by uuid references auth.users (id) on delete set null
);

create table if not exists public.brokers (
  id uuid primary key default gen_random_uuid(),
  name text not null unique,
  country text not null check (country in ('CM','CF','CG','GA','GQ','TD')),
  city text not null,
  approval text not null default '',
  approved_on date,
  address text not null default '',
  phone text,
  email text,
  website text,
  published boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  updated_by uuid references auth.users (id) on delete set null
);

create table if not exists public.documents (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  ref text,
  body text not null default 'BVMAC' check (body in ('CEMAC','UMAC','COSUMAF','BVMAC','UEAC')),
  category text not null default 'regulation' check (category in ('regulation','report','tariff','economic')),
  year text not null,
  url text not null,
  language text not null default 'FR',
  published boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  updated_by uuid references auth.users (id) on delete set null
);

create table if not exists public.videos (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  url text,
  title text not null,
  caption text not null default '',
  playlist text not null default 'Reportages' check (playlist in ('Cérémonies','Reportages','Pédagogie')),
  poster text not null default '/photos/ceremony-trading-floor-2.webp',
  position integer not null default 0,
  published boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  updated_by uuid references auth.users (id) on delete set null
);

create table if not exists public.photos (
  id uuid primary key default gen_random_uuid(),
  album_slug text not null,
  album_title text not null,
  album_date text not null default '',
  src text not null,
  alt text not null default '',
  position integer not null default 0,
  published boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  updated_by uuid references auth.users (id) on delete set null
);

create table if not exists public.board_members (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  role text not null default 'Administrateur',
  entity text not null default '',
  body text not null default 'board' check (body in ('board','management')),
  photo text,
  position integer not null default 0,
  published boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  updated_by uuid references auth.users (id) on delete set null
);

create table if not exists public.timeline (
  id uuid primary key default gen_random_uuid(),
  date_label text not null,
  title text not null,
  body text not null default '',
  position integer not null default 0,
  published boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  updated_by uuid references auth.users (id) on delete set null
);

create table if not exists public.partners (
  id uuid primary key default gen_random_uuid(),
  name text not null unique,
  description text not null default '',
  href text not null,
  logo text,
  position integer not null default 0,
  published boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  updated_by uuid references auth.users (id) on delete set null
);

create table if not exists public.glossary (
  id uuid primary key default gen_random_uuid(),
  term text not null unique,
  definition text not null,
  term_en text,
  term_es text,
  published boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  updated_by uuid references auth.users (id) on delete set null
);

create table if not exists public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  full_name text not null default '',
  locale text not null default 'fr' check (locale in ('fr','en')),
  theme text not null default 'light' check (theme in ('light','dark')),
  updated_at timestamptz not null default now()
);

create table if not exists public.audit_log (
  id bigint generated always as identity primary key,
  at timestamptz not null default now(),
  actor uuid,
  actor_email text,
  table_name text not null,
  action text not null,
  row_id text,
  label text
);
create index if not exists audit_log_at_idx on public.audit_log (at desc);

-- ------------------------------------------------------------ audit trigger
create or replace function private.audit()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
declare
  j jsonb := to_jsonb(case when tg_op = 'DELETE' then old else new end);
begin
  insert into public.audit_log (actor, actor_email, table_name, action, row_id, label)
  values (
    (select auth.uid()),
    (select auth.jwt()) ->> 'email',
    tg_table_name,
    lower(tg_op),
    coalesce(j ->> 'id', j ->> 'key'),
    left(coalesce(j ->> 'title', j ->> 'name', j ->> 'number', j ->> 'term', j ->> 'ref', j ->> 'issuer', j ->> 'key', ''), 160)
  );
  return null;
end;
$$;
revoke all on function private.audit() from public;

-- ------------------------------------------------ policies for content tables
do $$
declare t text;
begin
  foreach t in array array['notices','news','tenders','bulletins','equities','bonds','agenda','brokers','documents','videos','photos','board_members','timeline','partners','glossary'] loop
    execute format('drop trigger if exists touch_%1$s on public.%1$s', t);
    execute format('create trigger touch_%1$s before insert or update on public.%1$s for each row execute function public.touch_updated_at()', t);
    execute format('drop trigger if exists audit_%1$s on public.%1$s', t);
    execute format('create trigger audit_%1$s after insert or update or delete on public.%1$s for each row execute function private.audit()', t);
    execute format('alter table public.%I enable row level security', t);
    execute format('drop policy if exists "public read published" on public.%I', t);
    execute format('drop policy if exists "staff read all" on public.%I', t);
    execute format('drop policy if exists "staff insert" on public.%I', t);
    execute format('drop policy if exists "staff update" on public.%I', t);
    execute format('drop policy if exists "admin delete" on public.%I', t);
    execute format('create policy "public read published" on public.%I for select to anon, authenticated using (published = true)', t);
    execute format('create policy "staff read all" on public.%I for select to authenticated using ((select public.staff_role()) in (''editor'',''admin''))', t);
    execute format('create policy "staff insert" on public.%I for insert to authenticated with check ((select public.staff_role()) in (''editor'',''admin''))', t);
    execute format('create policy "staff update" on public.%I for update to authenticated using ((select public.staff_role()) in (''editor'',''admin'')) with check ((select public.staff_role()) in (''editor'',''admin''))', t);
    execute format('create policy "admin delete" on public.%I for delete to authenticated using ((select public.staff_role()) = ''admin'')', t);
    execute format('grant select on public.%I to anon', t);
    execute format('grant select, insert, update, delete on public.%I to authenticated', t);
    execute format('create index if not exists %1$s_updated_by_idx on public.%1$s (updated_by)', t);
  end loop;
end $$;

-- site settings: everyone reads, only admins write
alter table public.site_settings enable row level security;
drop trigger if exists touch_site_settings on public.site_settings;
create trigger touch_site_settings before insert or update on public.site_settings for each row execute function public.touch_updated_at();
drop trigger if exists audit_site_settings on public.site_settings;
create trigger audit_site_settings after insert or update or delete on public.site_settings for each row execute function private.audit();
drop policy if exists "public read settings" on public.site_settings;
drop policy if exists "admin insert settings" on public.site_settings;
drop policy if exists "admin update settings" on public.site_settings;
create policy "public read settings" on public.site_settings for select to anon, authenticated using (true);
create policy "admin insert settings" on public.site_settings for insert to authenticated with check ((select public.staff_role()) = 'admin');
create policy "admin update settings" on public.site_settings for update to authenticated using ((select public.staff_role()) = 'admin') with check ((select public.staff_role()) = 'admin');
grant select on public.site_settings to anon;
grant select, insert, update on public.site_settings to authenticated;
create index if not exists site_settings_updated_by_idx on public.site_settings (updated_by);

-- profiles: each user manages their own row
alter table public.profiles enable row level security;
drop policy if exists "own profile read" on public.profiles;
drop policy if exists "own profile insert" on public.profiles;
drop policy if exists "own profile update" on public.profiles;
create policy "own profile read" on public.profiles for select to authenticated using ((select auth.uid()) = id);
create policy "own profile insert" on public.profiles for insert to authenticated with check ((select auth.uid()) = id);
create policy "own profile update" on public.profiles for update to authenticated using ((select auth.uid()) = id) with check ((select auth.uid()) = id);
grant select, insert, update on public.profiles to authenticated;

-- audit log: staff read only; rows are written by the trigger
alter table public.audit_log enable row level security;
drop policy if exists "staff read audit" on public.audit_log;
create policy "staff read audit" on public.audit_log for select to authenticated using ((select public.staff_role()) in ('editor','admin'));
grant select on public.audit_log to authenticated;

create index if not exists agenda_date_idx on public.agenda (event_date desc);
create index if not exists photos_album_idx on public.photos (album_slug, position);
