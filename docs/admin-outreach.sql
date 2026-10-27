-- Admin outreach: DB setup. Already applied to DEV (Barber project).
-- Must be run on PROD (chairo-prod) before /admin works there.
-- Admin accounts must already exist in auth.users of that project.

create table public.admins (
  user_id uuid primary key references auth.users(id) on delete cascade,
  created_at timestamptz not null default now()
);

create or replace function public.is_admin()
returns boolean language sql security definer stable set search_path = public
as $$ select exists (select 1 from public.admins where user_id = auth.uid()); $$;

create table public.outreach_contacts (
  id uuid primary key default gen_random_uuid(),
  name text, email text, instagram text, phone text, notes text,
  created_by uuid references auth.users(id) on delete set null default auth.uid(),
  created_at timestamptz not null default now(),
  email_norm text generated always as (nullif(lower(trim(email)), '')) stored,
  instagram_norm text generated always as (
    nullif(lower(regexp_replace(regexp_replace(trim(instagram),
      '^(@|https?://(www\.)?instagram\.com/)', '', 'i'), '[/?].*$', '')), '')
  ) stored,
  phone_norm text generated always as (nullif(regexp_replace(phone, '\D', '', 'g'), '')) stored,
  constraint outreach_has_contact check (
    coalesce(nullif(trim(name), ''), nullif(trim(email), ''),
             nullif(trim(instagram), ''), nullif(trim(phone), '')) is not null
  )
);

create unique index outreach_email_uq on public.outreach_contacts (email_norm);
create unique index outreach_instagram_uq on public.outreach_contacts (instagram_norm);
create unique index outreach_phone_uq on public.outreach_contacts (phone_norm);
create index outreach_created_at_idx on public.outreach_contacts (created_at desc);

-- created_by is always the current user and cannot be changed
create or replace function public.set_outreach_created_by()
returns trigger language plpgsql set search_path = public as $$
begin
  if tg_op = 'INSERT' then new.created_by := auth.uid();
  else new.created_by := old.created_by; end if;
  return new;
end $$;
create trigger outreach_created_by before insert or update on public.outreach_contacts
for each row execute function public.set_outreach_created_by();

-- Security: only admins can access contacts
alter table public.admins enable row level security;
alter table public.outreach_contacts enable row level security;
create policy "admins only" on public.outreach_contacts
  for all using (public.is_admin()) with check (public.is_admin());

revoke all on public.admins from anon, authenticated;
revoke all on public.outreach_contacts from anon;
revoke truncate, trigger, references on public.outreach_contacts from authenticated;
grant select, insert, update, delete on public.outreach_contacts to authenticated;
revoke execute on function public.is_admin() from public, anon;
grant execute on function public.is_admin() to authenticated;

-- Admins (add more by email; account must exist)
insert into public.admins (user_id)
select id from auth.users
where email in ('rahmanovicbenjamin07@gmail.com', 'aamer.talo@gmail.com');
