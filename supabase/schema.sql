-- Run this in Supabase SQL Editor. Enable Row Level Security before going live.
create table if not exists public.service_requests (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  customer_name text not null check (char_length(customer_name) between 2 and 100),
  phone text not null check (phone ~ '^[6-9][0-9]{9}$'),
  account_type text not null check (account_type in ('customer','dealer')),
  device_model text not null check (char_length(device_model) between 2 and 120),
  service_type text not null,
  problem text,
  pickup_type text not null check (pickup_type in ('Shop visit','Pickup & Drop','Pickup only')),
  pickup_address text,
  payment_preference text not null check (payment_preference in ('UPI','Cash')),
  status text not null default 'new' check (status in ('new','contacted','in_progress','ready','delivered','cancelled'))
);

alter table public.service_requests enable row level security;

-- Public website can submit requests. It cannot read, update, or delete requests.
drop policy if exists "Anyone can submit a repair request" on public.service_requests;
create policy "Anyone can submit a repair request"
on public.service_requests for insert
to anon, authenticated
with check (true);

-- No public SELECT/UPDATE/DELETE policy is intentionally created.
-- Review requests in Supabase dashboard or add a server-side admin workflow.
