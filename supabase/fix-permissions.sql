-- ============================================================
-- FIX: Grant INSERT permission ke anon & authenticated role
-- untuk tabel yang bisa disubmit tanpa login
-- Jalankan di Supabase SQL Editor
-- ============================================================

-- Izinkan anon (pengunjung tanpa login) submit contact_messages
GRANT INSERT ON public.contact_messages TO anon;
GRANT INSERT ON public.contact_messages TO authenticated;

-- Izinkan anon submit partner_applications
GRANT INSERT ON public.partner_applications TO anon;
GRANT INSERT ON public.partner_applications TO authenticated;

-- Izinkan SELECT untuk view global_stats (landing page)
GRANT SELECT ON public.global_stats TO anon;
GRANT SELECT ON public.global_stats TO authenticated;

-- Izinkan SELECT monthly_recap untuk DLH
GRANT SELECT ON public.monthly_recap TO authenticated;

-- Pastikan sequence UUID bisa diakses
GRANT USAGE ON SCHEMA public TO anon;
GRANT USAGE ON SCHEMA public TO authenticated;

-- ── Verifikasi (opsional) ─────────────────────────────────
-- Jalankan query ini untuk cek hasilnya:
-- SELECT grantee, table_name, privilege_type
-- FROM information_schema.role_table_grants
-- WHERE table_name IN ('contact_messages', 'partner_applications')
-- ORDER BY table_name, grantee;
