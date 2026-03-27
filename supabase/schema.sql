-- ============================================================
-- ESALOKA — Database Schema
-- Jalankan script ini di Supabase SQL Editor
-- ============================================================

-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- ─── ENUM TYPES ──────────────────────────────────────────────

create type user_role as enum ('admin', 'mitra', 'dlh');
create type subscription_tier as enum ('starter', 'growth', 'impact');
create type business_type as enum ('hotel', 'restoran', 'catering', 'lainnya');
create type collection_status as enum ('collected', 'processed', 'converted');
create type message_category as enum ('saran_fitur', 'laporan_masalah', 'pertanyaan', 'lainnya');
create type message_status as enum ('baru', 'dibaca', 'ditindaklanjuti');
create type volume_estimate as enum ('<20kg', '20-50kg', '50-100kg', '>100kg');
create type application_status as enum ('pending', 'reviewed', 'approved', 'rejected');

-- ─── USER PROFILES ───────────────────────────────────────────
-- Extends Supabase auth.users

create table public.user_profiles (
  id          uuid primary key references auth.users(id) on delete cascade,
  email       text not null,
  full_name   text not null,
  role        user_role not null default 'mitra',
  created_at  timestamptz default now()
);

alter table public.user_profiles enable row level security;

create policy "Users can read own profile"
  on public.user_profiles for select
  using (auth.uid() = id);

create policy "Admins can read all profiles"
  on public.user_profiles for select
  using (
    exists (
      select 1 from public.user_profiles
      where id = auth.uid() and role = 'admin'
    )
  );

-- ─── MITRA ───────────────────────────────────────────────────

create table public.mitra (
  id                            uuid primary key default uuid_generate_v4(),
  user_id                       uuid references public.user_profiles(id) on delete cascade,
  business_name                 text not null,
  business_type                 business_type not null,
  subscription_tier             subscription_tier not null default 'starter',
  pic_name                      text not null,
  pic_phone                     text not null,
  address                       text,
  estimated_volume_kg_per_day   numeric(8,2) default 0,
  is_active                     boolean default true,
  joined_at                     date default current_date,
  created_at                    timestamptz default now()
);

alter table public.mitra enable row level security;

create policy "Mitra can read own data"
  on public.mitra for select
  using (user_id = auth.uid());

create policy "Admin can read all mitra"
  on public.mitra for all
  using (
    exists (
      select 1 from public.user_profiles
      where id = auth.uid() and role = 'admin'
    )
  );

-- ─── WASTE COLLECTIONS ───────────────────────────────────────

create table public.waste_collections (
  id              uuid primary key default uuid_generate_v4(),
  mitra_id        uuid not null references public.mitra(id) on delete cascade,
  operator_id     uuid not null references public.user_profiles(id),
  weight_kg       numeric(8,2) not null check (weight_kg > 0),
  collection_date date not null default current_date,
  status          collection_status not null default 'collected',
  notes           text,
  created_at      timestamptz default now()
);

alter table public.waste_collections enable row level security;

create policy "Mitra can read own collections"
  on public.waste_collections for select
  using (
    mitra_id in (
      select id from public.mitra where user_id = auth.uid()
    )
  );

create policy "Admin can manage all collections"
  on public.waste_collections for all
  using (
    exists (
      select 1 from public.user_profiles
      where id = auth.uid() and role = 'admin'
    )
  );

create policy "DLH can read all collections"
  on public.waste_collections for select
  using (
    exists (
      select 1 from public.user_profiles
      where id = auth.uid() and role = 'dlh'
    )
  );

-- ─── BIOCONVERSIONS ──────────────────────────────────────────

create table public.bioconversions (
  id               uuid primary key default uuid_generate_v4(),
  collection_id    uuid not null references public.waste_collections(id) on delete cascade,
  mitra_id         uuid not null references public.mitra(id) on delete cascade,
  maggot_kg        numeric(8,2) not null default 0,
  kasgot_kg        numeric(8,2) not null default 0,
  conversion_date  date not null default current_date,
  created_at       timestamptz default now()
);

alter table public.bioconversions enable row level security;

create policy "Growth & Impact mitra can read own bioconversions"
  on public.bioconversions for select
  using (
    mitra_id in (
      select id from public.mitra
      where user_id = auth.uid()
      and subscription_tier in ('growth', 'impact')
    )
  );

create policy "Admin can manage all bioconversions"
  on public.bioconversions for all
  using (
    exists (
      select 1 from public.user_profiles
      where id = auth.uid() and role = 'admin'
    )
  );

-- ─── CONTACT MESSAGES ────────────────────────────────────────

create table public.contact_messages (
  id            uuid primary key default uuid_generate_v4(),
  sender_name   text not null,
  sender_email  text not null,
  category      message_category not null,
  message       text not null,
  status        message_status not null default 'baru',
  created_at    timestamptz default now()
);

alter table public.contact_messages enable row level security;

-- Public can insert (submit form)
create policy "Anyone can submit contact message"
  on public.contact_messages for insert
  with check (true);

-- Only admin can read
create policy "Admin can read all messages"
  on public.contact_messages for all
  using (
    exists (
      select 1 from public.user_profiles
      where id = auth.uid() and role = 'admin'
    )
  );

-- ─── PARTNER APPLICATIONS ────────────────────────────────────

create table public.partner_applications (
  id               uuid primary key default uuid_generate_v4(),
  business_name    text not null,
  business_type    business_type not null,
  desired_tier     subscription_tier not null default 'starter',
  estimated_volume volume_estimate not null,
  pic_name         text not null,
  pic_phone        text not null,
  status           application_status not null default 'pending',
  created_at       timestamptz default now()
);

alter table public.partner_applications enable row level security;

create policy "Anyone can submit application"
  on public.partner_applications for insert
  with check (true);

create policy "Admin can manage applications"
  on public.partner_applications for all
  using (
    exists (
      select 1 from public.user_profiles
      where id = auth.uid() and role = 'admin'
    )
  );

-- ─── VIEWS ───────────────────────────────────────────────────

-- Global stats view (untuk landing page & admin)
create or replace view public.global_stats as
select
  coalesce(sum(wc.weight_kg), 0)               as total_waste_managed_kg,
  coalesce(sum(bc.maggot_kg), 0)               as total_maggot_kg,
  coalesce(sum(bc.kasgot_kg), 0)               as total_kasgot_kg,
  coalesce(sum(wc.weight_kg * 0.7), 0)         as co2_avoided_kg,
  count(distinct m.id) filter (where m.is_active) as active_mitra_count
from public.mitra m
left join public.waste_collections wc on wc.mitra_id = m.id
left join public.bioconversions bc on bc.mitra_id = m.id;

-- Monthly recap view (untuk DLH)
create or replace view public.monthly_recap as
select
  date_trunc('month', collection_date)::date  as month_start,
  to_char(collection_date, 'Month YYYY')       as month_label,
  extract(year from collection_date)::int      as year,
  extract(month from collection_date)::int     as month_number,
  sum(weight_kg)                               as total_waste_kg,
  count(*)                                     as pickup_count,
  count(distinct mitra_id)                     as mitra_count
from public.waste_collections
group by 1, 2, 3, 4
order by 1 desc;

-- ─── TRIGGERS ────────────────────────────────────────────────

-- Auto-create user profile on signup
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.user_profiles (id, email, full_name, role)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data->>'full_name', 'User'),
    coalesce((new.raw_user_meta_data->>'role')::user_role, 'mitra')
  );
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- ─── SEED DATA (untuk testing) ───────────────────────────────
-- Jalankan setelah schema berhasil dibuat

-- insert into public.contact_messages (sender_name, sender_email, category, message)
-- values
--   ('Restoran Nusantara', 'resto@nusantara.com', 'pertanyaan', 'Ingin bergabung sebagai mitra Growth Partner'),
--   ('Pengunjung Web', 'visitor@email.com', 'saran_fitur', 'Tolong tambahkan notifikasi jadwal pickup otomatis'),
--   ('Hotel Pantai', 'info@hotelpantai.com', 'pertanyaan', 'Bagaimana cara upgrade ke Impact Partner?');
