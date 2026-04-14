"use client";

export const dynamic = "force-dynamic";

import { useState } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { Eye, EyeOff, Loader2 } from "lucide-react";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const supabase = createClient();

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const { data, error: authError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (authError || !data.user) {
      setError("Email atau password salah. Silakan coba lagi.");
      setLoading(false);
      return;
    }

    // Fetch role untuk redirect yang benar
    const { data: profile, error: profileError } = await supabase
      .from("user_profiles")
      .select("role")
      .eq("id", data.user.id)
      .single();

    if (profileError || !profile) {
      setError("Profil pengguna tidak ditemukan. Hubungi admin.");
      setLoading(false);
      return;
    }

    // FIX: pakai window.location.href (full reload) bukan router.push
    // Ini menghindari "Failed to fetch" RSC payload di Next.js 15
    window.location.href = `/dashboard/${profile.role}`;
  }

  return (
    <div className="min-h-screen bg-cream flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link
            href="/"
            className="inline-flex items-center gap-2.5 justify-center"
          >
            <div className="w-10 h-10 rounded-xl bg-gold-400 flex items-center justify-center">
              <span className="text-white font-bold text-base">E</span>
            </div>
            <span className="font-semibold text-xl text-stone-800 tracking-tight">
              ESALOKA
            </span>
          </Link>
          <p className="text-stone-400 text-sm mt-3">Masuk ke dashboard Anda</p>
        </div>

        {/* Card */}
        <div className="card">
          <form onSubmit={handleLogin} className="flex flex-col gap-4">
            <div>
              <label className="label">Email</label>
              <input
                type="email"
                className="input"
                placeholder="nama@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoComplete="email"
              />
            </div>

            <div>
              <label className="label">Password</label>
              <div className="relative">
                <input
                  type={showPass ? "text" : "password"}
                  className="input pr-10"
                  placeholder="Masukkan password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPass(!showPass)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600"
                >
                  {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {error && (
              <div className="bg-red-50 border border-red-100 rounded-xl px-4 py-3">
                <p className="text-sm text-red-600">{error}</p>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full flex items-center justify-center gap-2 mt-1"
            >
              {loading && <Loader2 size={16} className="animate-spin" />}
              {loading ? "Memproses..." : "Masuk"}
            </button>
          </form>
        </div>

        <p className="text-center text-sm text-stone-400 mt-6">
          Belum punya akun?{" "}
          <Link
            href="/get-in-touch"
            className="text-gold-600 hover:text-gold-700 font-medium"
          >
            Daftar sebagai mitra
          </Link>
        </p>
        <p className="text-center mt-4">
          <Link
            href="/"
            className="text-xs text-stone-400 hover:text-stone-600"
          >
            ← Kembali ke beranda
          </Link>
        </p>
      </div>
    </div>
  );
}
