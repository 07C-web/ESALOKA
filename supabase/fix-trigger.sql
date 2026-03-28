-- ============================================================
-- FIX: handle_new_user trigger
-- Jalankan di Supabase SQL Editor
-- ============================================================

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
DECLARE
  _role user_role;
  _role_raw text;
BEGIN
  -- Safely extract role from metadata
  _role_raw := new.raw_user_meta_data->>'role';

  -- Validate against enum, fallback to 'mitra' if invalid/null
  IF _role_raw IN ('admin', 'mitra', 'dlh') THEN
    _role := _role_raw::user_role;
  ELSE
    _role := 'mitra';
  END IF;

  INSERT INTO public.user_profiles (id, email, full_name, role)
  VALUES (
    new.id,
    new.email,
    COALESCE(new.raw_user_meta_data->>'full_name', split_part(new.email, '@', 1)),
    _role
  )
  ON CONFLICT (id) DO NOTHING;

  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
