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
  -- A name alone is not enough: at least one way to reach the shop.
  constraint outreach_has_contact check (
    coalesce(nullif(trim(email), ''), nullif(trim(instagram), ''),
             nullif(trim(phone), '')) is not null
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

-- Feedback access for admins
create policy "admins read all feedback" on public.feedback
  for select to authenticated using (public.is_admin());
create policy "feedback-screenshots: admins read all" on storage.objects
  for select to authenticated using (bucket_id = 'feedback-screenshots' and public.is_admin());
grant update (status, resolved_at) on public.feedback to authenticated;
create policy "admins update feedback status" on public.feedback
  for update to authenticated using (public.is_admin()) with check (public.is_admin());
create policy "admins read all profiles" on public.profiles
  for select to authenticated using (public.is_admin());
create policy "admins read all businesses" on public.businesses
  for select to authenticated using (public.is_admin());

-- Admin: create business
--
-- public.admin_create_business(p_owner_id uuid, p_name text, p_code text)
--   returns business_id, business_name, invite_code
--
-- Used by /admin (Users tab, "Make business") to create a business owned by
-- an existing profile (p_owner_id), named p_name, with p_code as its invite
-- (referral) code. It must refuse callers who aren't admins (public.is_admin()).
-- Its error messages are shown to the admin as-is, e.g.
-- "Invite code X is already taken". After it succeeds, the owner has to sign
-- out and sign in again in the app to become the owner.
--
-- Status: already applied on DEV (Barber). Must be applied on PROD
-- (chairo-prod) before "Make business" works there.
--
-- TODO: add the function's SQL here.
