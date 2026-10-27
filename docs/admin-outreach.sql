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

-- ===== Admin: create business for a user (applied on DEV and PROD) =====
create or replace function public.admin_create_business(p_owner_id uuid, p_name text, p_code text)
returns table (business_id uuid, business_name text, invite_code text)
language plpgsql security definer set search_path = ''
as $$
#variable_conflict use_column
declare
  v_name text := nullif(btrim(coalesce(p_name, '')), '');
  v_code text := public.normalize_shop_code(p_code);
  v_id uuid;
begin
  if not public.is_admin() then
    raise exception 'Only admins can create businesses' using errcode = '42501';
  end if;
  if v_name is null then
    raise exception 'Business name is required' using errcode = '22023';
  end if;
  if char_length(v_name) > 80 then
    raise exception 'Business name is too long (max 80 characters)' using errcode = '22023';
  end if;
  if v_code !~ '^[A-Z0-9-]{4,20}$' then
    raise exception 'Invite code must be 4-20 characters: letters, numbers or -' using errcode = '22023';
  end if;
  if not exists (select 1 from public.profiles p where p.id = p_owner_id) then
    raise exception 'Profile not found' using errcode = '22023';
  end if;
  if exists (select 1 from public.businesses b where b.referral_code = v_code)
     or exists (select 1 from public.friend_invites f where upper(f.code) = v_code) then
    raise exception 'Invite code % is already taken', v_code using errcode = '23505';
  end if;
  insert into public.businesses (owner_id, name, referral_code)
  values (p_owner_id, v_name, v_code) returning id into v_id;
  update public.profiles set active_business_id = v_id where id = p_owner_id;
  return query select v_id, v_name, v_code;
end $$;

revoke execute on function public.admin_create_business(uuid, text, text) from public, anon;
grant execute on function public.admin_create_business(uuid, text, text) to authenticated;
