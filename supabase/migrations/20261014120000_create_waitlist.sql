-- Early-access waitlist filled by the landing page signup form.
create table if not exists public.waitlist (
  id bigint generated always as identity primary key,
  email text not null check (char_length(email) <= 254 and email ~* '^[^@\s]+@[^@\s]+\.[^@\s]+$'),
  locale text not null default 'bs' check (locale in ('bs', 'en')),
  created_at timestamptz not null default now()
);

-- One row per address, case-insensitive. A duplicate signup fails with 23505,
-- which the site treats as success.
create unique index if not exists waitlist_email_key on public.waitlist (lower(email));

-- Visitors may only add themselves: no reads, updates or deletes from the browser.
alter table public.waitlist enable row level security;

drop policy if exists "Anyone can join the waitlist" on public.waitlist;
create policy "Anyone can join the waitlist"
  on public.waitlist
  for insert
  to anon, authenticated
  with check (true);

grant insert on public.waitlist to anon, authenticated;
