create table if not exists public.rsvps (
  id uuid primary key default gen_random_uuid(),
  guest_name text not null check (
    char_length(btrim(guest_name)) between 1 and 120
  ),
  attending boolean not null,
  message text check (
    message is null or char_length(message) <= 1000
  ),
  created_at timestamptz not null default now()
);

alter table public.rsvps enable row level security;

revoke all on table public.rsvps from anon, authenticated;
grant insert on table public.rsvps to anon, authenticated;

drop policy if exists "Guests can submit an RSVP" on public.rsvps;
create policy "Guests can submit an RSVP"
on public.rsvps
for insert
to anon, authenticated
with check (
  char_length(btrim(guest_name)) between 1 and 120
  and (message is null or char_length(message) <= 1000)
);
