# ESALOKA — Platform Pengelolaan Limbah Organik

Platform dashboard web untuk pengelolaan limbah organik berbasis data bagi mitra HoReCa.

---

## Tech Stack

- **Frontend**: Next.js 15 + TypeScript + Tailwind CSS
- **Backend & Database**: Supabase (PostgreSQL + Auth + RLS)
- **Deployment**: Vercel (connect ke GitHub repo)

---

## Cara Setup Lokal

### 1. Clone & install dependencies

```bash
git clone https://github.com/USERNAME/esaloka.git
cd esaloka
npm install
```

### 2. Setup Supabase

1. Buat project baru di [supabase.com](https://supabase.com)
2. Buka **SQL Editor** di dashboard Supabase
3. Copy-paste isi file `supabase/schema.sql` dan jalankan
4. Tunggu hingga semua tabel & view berhasil dibuat

### 3. Konfigurasi environment variables

```bash
cp .env.local.example .env.local
```

Isi `.env.local` dengan credentials dari Supabase:
- Buka **Project Settings → API**
- Copy `Project URL` → `NEXT_PUBLIC_SUPABASE_URL`
- Copy `anon public` key → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- Copy `service_role` key → `SUPABASE_SERVICE_ROLE_KEY`

### 4. Buat akun user pertama (admin)

Di Supabase dashboard → **Authentication → Users → Add user**:
- Email: `admin@esaloka.com`
- Password: (bebas)

Lalu di **SQL Editor**, jalankan:
```sql
-- Update role menjadi admin
UPDATE public.user_profiles
SET role = 'admin', full_name = 'Admin ESALOKA'
WHERE email = 'admin@esaloka.com';
```

### 5. Jalankan development server

```bash
npm run dev
```

Buka [http://localhost:3000](http://localhost:3000)

---

## Struktur Halaman MVP

```
/ (landing page)
/login
/get-in-touch

/dashboard/mitra          ← Overview mitra
/dashboard/mitra/riwayat  ← Riwayat pengumpulan
/dashboard/mitra/langganan ← Profil & subscription

/dashboard/admin          ← Overview global admin
/dashboard/admin/input    ← Form input operator
/dashboard/admin/inbox    ← Inbox kritik/saran & pendaftaran

/dashboard/dlh            ← Rekapitulasi bulanan DLH
```

---

## Cara Tambah Mitra Baru

1. Mitra submit form di `/get-in-touch#daftar`
2. Admin lihat di dashboard → Inbox → Pendaftaran mitra
3. Admin approve → buat akun user di Supabase Auth
4. Di SQL Editor, buat data mitra:

```sql
-- Ganti nilai sesuai data mitra
INSERT INTO public.mitra (user_id, business_name, business_type, subscription_tier, pic_name, pic_phone)
VALUES (
  'UUID_USER_ID_DARI_AUTH',
  'Nama Hotel/Restoran',
  'hotel',        -- hotel | restoran | catering | lainnya
  'starter',      -- starter | growth | impact
  'Nama PIC',
  '08xxxxxxxxxx'
);
```

---

## Deploy ke Vercel

1. Push code ke GitHub repository
2. Buka [vercel.com](https://vercel.com) → Import repository
3. Tambahkan environment variables (sama seperti `.env.local`)
4. Deploy — otomatis setiap push ke `main`

---

## Roadmap Fase 2

- [ ] Blog page & blog manager admin
- [ ] ESG PDF report generator
- [ ] Sertifikat digital otomatis (PDF)
- [ ] Approval workflow untuk input data
- [ ] Bioconversion input form
- [ ] Email notifikasi otomatis

## Roadmap Fase 3

- [ ] IoT integration (timbang otomatis)
- [ ] Predictive analytics
- [ ] Mobile app (React Native)
- [ ] Public API untuk DLH

---

## Struktur Folder

```
esaloka/
├── app/
│   ├── page.tsx                    # Landing page
│   ├── login/page.tsx              # Login
│   ├── get-in-touch/page.tsx       # Get in touch
│   └── dashboard/
│       ├── layout.tsx              # Dashboard wrapper
│       ├── mitra/page.tsx          # Mitra overview
│       ├── mitra/riwayat/page.tsx
│       ├── mitra/langganan/page.tsx
│       ├── admin/page.tsx          # Admin overview
│       ├── admin/input/page.tsx
│       ├── admin/inbox/page.tsx
│       └── dlh/page.tsx            # DLH dashboard
├── components/
│   ├── layout/
│   │   ├── Navbar.tsx
│   │   └── DashboardSidebar.tsx
│   └── ui/
│       ├── StatCard.tsx
│       ├── TierBadge.tsx
│       ├── StatusBadge.tsx
│       └── LockedSection.tsx
├── lib/
│   ├── supabase/client.ts
│   ├── supabase/server.ts
│   └── utils.ts
├── types/index.ts
├── supabase/schema.sql             # ← Jalankan ini di Supabase!
└── middleware.ts                   # Auth + role guard
```
