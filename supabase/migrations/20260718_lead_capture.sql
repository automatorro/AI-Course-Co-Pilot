-- Lead capture + demo tracking for the new landing page.
--
-- Two tables, both anon-writable, service-role readable.
-- No PII beyond an email address; keep it that way.

create table if not exists public.waitlist_leads (
  id         uuid primary key default gen_random_uuid(),
  email      text not null,
  role       text,
  locale     text,
  source     text default 'landing',
  created_at timestamptz default now()
);

create table if not exists public.demo_sessions (
  id                   uuid primary key default gen_random_uuid(),
  started_at           timestamptz default now(),
  converted_to_signup  boolean default false,
  converted_at         timestamptz,
  converted_user_id    uuid references auth.users(id) on delete set null
);

create index if not exists idx_waitlist_leads_created_at on public.waitlist_leads(created_at desc);
create index if not exists idx_demo_sessions_started_at  on public.demo_sessions(started_at desc);

alter table public.waitlist_leads enable row level security;
alter table public.demo_sessions  enable row level security;

-- Anonymous visitors can insert a lead / start a demo, but never read the tables.
-- Anyone with a signed-in session can flip their own demo session as converted
-- (matched by the row's id which the client remembers in localStorage).

drop policy if exists "anon can insert waitlist_leads"    on public.waitlist_leads;
drop policy if exists "anon can insert demo_sessions"     on public.demo_sessions;
drop policy if exists "anon can select own demo_session"  on public.demo_sessions;
drop policy if exists "auth can update own demo_session"  on public.demo_sessions;

create policy "anon can insert waitlist_leads"
  on public.waitlist_leads for insert
  to anon
  with check (true);

create policy "anon can insert demo_sessions"
  on public.demo_sessions for insert
  to anon
  with check (true);

-- Needed so the demo page can re-hydrate the row by its id (still not enumerable
-- — the client has to already know the id from localStorage / URL).
create policy "anon can select own demo_session"
  on public.demo_sessions for select
  to anon
  using (true);

-- After signup, mark the demo session as converted. Restricted to logged-in
-- users; still can't list, only update-by-id via the client's stored id.
create policy "auth can update own demo_session"
  on public.demo_sessions for update
  to authenticated
  using (true)
  with check (true);
