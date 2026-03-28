-- ============================================================
-- ESALOKA — Schema Tambahan (Product System)
-- Jalankan di Supabase SQL Editor SETELAH schema.sql utama
-- ============================================================

-- ─── PRODUCT CATEGORY ENUM ───────────────────────────────────
create type product_category as enum ('protein_series', 'soil_series');
create type product_unit as enum ('kg', 'pack');
create type order_status as enum ('pending', 'confirmed', 'completed', 'cancelled');
create type order_channel as enum ('cart', 'whatsapp');

-- ─── PRODUCTS ─────────────────────────────────────────────────
create table public.products (
  id          uuid primary key default uuid_generate_v4(),
  name        text not null,
  slug        text not null unique,
  category    product_category not null,
  description text,
  price       numeric(12,2) not null default 20000,
  unit        product_unit not null default 'kg',
  weight_per_unit numeric(8,2) default 1,
  is_active   boolean default true,
  sort_order  int default 0,
  created_at  timestamptz default now()
);

alter table public.products enable row level security;

create policy "Anyone can read active products"
  on public.products for select
  using (is_active = true);

create policy "Admin can manage products"
  on public.products for all
  using (
    exists (
      select 1 from public.user_profiles
      where id = auth.uid() and role = 'admin'
    )
  );

grant select on public.products to anon;
grant select on public.products to authenticated;

-- ─── ORDERS ───────────────────────────────────────────────────
create table public.orders (
  id              uuid primary key default uuid_generate_v4(),
  order_number    text not null unique,
  user_id         uuid references public.user_profiles(id) on delete set null,
  customer_name   text not null,
  customer_phone  text not null,
  notes           text,
  channel         order_channel not null default 'whatsapp',
  status          order_status not null default 'pending',
  total_amount    numeric(14,2) not null default 0,
  created_at      timestamptz default now()
);

alter table public.orders enable row level security;

create policy "Anyone can insert order"
  on public.orders for insert
  with check (true);

create policy "Admin can manage all orders"
  on public.orders for all
  using (
    exists (
      select 1 from public.user_profiles
      where id = auth.uid() and role = 'admin'
    )
  );

grant insert on public.orders to anon;
grant insert on public.orders to authenticated;
grant select on public.orders to authenticated;

-- ─── ORDER ITEMS ──────────────────────────────────────────────
create table public.order_items (
  id          uuid primary key default uuid_generate_v4(),
  order_id    uuid not null references public.orders(id) on delete cascade,
  product_id  uuid not null references public.products(id),
  product_name text not null,
  quantity    int not null check (quantity > 0),
  unit_price  numeric(12,2) not null,
  subtotal    numeric(14,2) not null,
  created_at  timestamptz default now()
);

alter table public.order_items enable row level security;

create policy "Anyone can insert order items"
  on public.order_items for insert
  with check (true);

create policy "Admin can manage all order items"
  on public.order_items for all
  using (
    exists (
      select 1 from public.user_profiles
      where id = auth.uid() and role = 'admin'
    )
  );

grant insert on public.order_items to anon;
grant insert on public.order_items to authenticated;

-- ─── ORDER NUMBER SEQUENCE ────────────────────────────────────
create sequence if not exists order_number_seq start 1;
create sequence if not exists app_number_seq start 1;

-- Function: generate order number ESL-001
create or replace function public.generate_order_number()
returns text as $$
  select 'ESL-' || lpad(nextval('order_number_seq')::text, 3, '0')
$$ language sql;

-- Function: generate application number APP-001
create or replace function public.generate_app_number()
returns text as $$
  select 'APP-' || lpad(nextval('app_number_seq')::text, 3, '0')
$$ language sql;

-- ─── ADD app_number TO partner_applications ───────────────────
alter table public.partner_applications
  add column if not exists app_number text unique,
  add column if not exists rejection_reason text;

-- Trigger: auto-generate app_number on insert
create or replace function public.set_app_number()
returns trigger as $$
begin
  if new.app_number is null then
    new.app_number := public.generate_app_number();
  end if;
  return new;
end;
$$ language plpgsql;

create trigger trg_set_app_number
  before insert on public.partner_applications
  for each row execute procedure public.set_app_number();

-- ─── PERFORMANCE INDEXES ──────────────────────────────────────
create index idx_orders_status on public.orders(status);
create index idx_orders_created on public.orders(created_at desc);
create index idx_order_items_order_id on public.order_items(order_id);
create index idx_products_category on public.products(category);

-- ─── SEED PRODUCTS ───────────────────────────────────────────
insert into public.products (name, slug, category, description, price, unit, weight_per_unit, sort_order)
values
  -- Protein Series
  (
    'Maggot Basah',
    'maggot-basah',
    'protein_series',
    'Larva BSF segar kaya protein tinggi, ideal sebagai pakan langsung untuk unggas, ikan, dan reptil. Dipanen dari proses biokonversi limbah organik terseleksi.',
    20000, 'kg', 1, 1
  ),
  (
    'Maggot Kering',
    'maggot-kering',
    'protein_series',
    'Maggot BSF yang telah dikeringkan untuk shelf life lebih panjang. Praktis disimpan dan mudah ditakar, tetap kaya protein dan asam amino esensial.',
    20000, 'kg', 1, 2
  ),
  (
    'Tepung Maggot',
    'tepung-maggot',
    'protein_series',
    'Maggot BSF yang digiling menjadi tepung halus. Mudah dicampurkan ke formulasi pakan ternak, kandungan protein hingga 40–55% per berat kering.',
    20000, 'kg', 1, 3
  ),
  -- Soil Series
  (
    'Kasgot Basah',
    'kasgot-basah',
    'soil_series',
    'Frass (kotoran) larva BSF dalam bentuk lembab, kaya unsur hara N-P-K organik. Cocok untuk aplikasi langsung ke tanah pertanian atau media tanam.',
    20000, 'kg', 1, 4
  ),
  (
    'Kasgot Kering',
    'kasgot-kering',
    'soil_series',
    'Frass BSF yang telah dikeringkan dan digranuler. Mudah disimpan, diaplikasikan, dan didistribusikan. Ideal untuk pertanian skala luas.',
    20000, 'kg', 1, 5
  ),
  (
    'Kompos Premium',
    'kompos-premium',
    'soil_series',
    'Campuran pilihan kasgot BSF dan bahan organik berkualitas tinggi. Formula terbaik untuk memperbaiki struktur tanah dan meningkatkan produktivitas pertanian urban.',
    20000, 'kg', 1, 6
  );
