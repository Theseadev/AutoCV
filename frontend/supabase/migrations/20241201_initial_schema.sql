-- AutoCV Supabase Schema
-- Jalankan di Supabase SQL Editor

-- Tabel orders
create table if not exists public.orders (
  id text primary key,
  name text not null,
  template text not null,
  template_id text,
  cv_data jsonb,
  skills_text text,
  status text default 'Menunggu WA',
  created_at timestamptz default now()
);

-- Enable RLS
alter table public.orders enable row level security;

-- Policy: Public bisa insert order (checkout)
create policy "public insert orders"
on public.orders
for insert
with check (true);

-- Policy: Admin read via service role (bypass RLS) atau via Edge Function
-- Tidak perlu policy SELECT publik karena admin pakai service role key di Edge Function

-- Tabel config (untuk WA admin, dsb.)
create table if not exists public.config (
  key text primary key,
  value text not null,
  updated_at timestamptz default now()
);

-- Enable RLS
alter table public.config enable row level security;

-- Policy: Public read config (wa_admin)
create policy "public read config"
on public.config
for select
using (true);

-- Policy: Admin write config (via service role)
-- Tidak perlu policy INSERT/UPDATE publik

-- Insert default config
insert into public.config (key, value)
values ('wa_admin', '628000000000')
on conflict (key) do nothing;

-- Index untuk performa
create index if not exists orders_created_at_idx on public.orders (created_at desc);