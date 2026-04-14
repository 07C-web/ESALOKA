import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

export async function proxy(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet: { name: string; value: string; options?: any }[]) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value),
          );
          supabaseResponse = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options),
          );
        },
      },
    },
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();
  const path = request.nextUrl.pathname;

  // ── 1. Protect dashboard routes — redirect to login if no session ──
  if (path.startsWith("/dashboard") && !user) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // ── 2. Logged-in user visits /login — redirect to their dashboard ──
  if (path === "/login" && user) {
    const { data: profile } = await supabase
      .from("user_profiles")
      .select("role")
      .eq("id", user.id)
      .single();

    // FIX: jika profile tidak ada, fallback ke 'mitra'
    const role = profile?.role ?? "mitra";
    return NextResponse.redirect(new URL(`/dashboard/${role}`, request.url));
  }

  // ── 3. Role-based access guard ────────────────────────────────────
  if (path.startsWith("/dashboard/")) {
    if (!user) {
      return NextResponse.redirect(new URL("/login", request.url));
    }

    const { data: profile } = await supabase
      .from("user_profiles")
      .select("role")
      .eq("id", user.id)
      .single();

    // FIX: jika profile null (user ada di Auth tapi belum ada di
    // user_profiles — misal trigger gagal), paksa logout ke login
    if (!profile) {
      const url = new URL("/login", request.url);
      url.searchParams.set("error", "profile_not_found");
      return NextResponse.redirect(url);
    }

    const role = profile.role;
    const isAdmin = role === "admin";
    const isMitra = role === "mitra";
    const isDLH = role === "dlh";

    // Admin mencoba akses non-admin dashboard
    if (path.startsWith("/dashboard/admin") && !isAdmin) {
      return NextResponse.redirect(new URL(`/dashboard/${role}`, request.url));
    }
    // Non-mitra (bukan admin) mencoba akses dashboard mitra
    if (path.startsWith("/dashboard/mitra") && !isMitra && !isAdmin) {
      return NextResponse.redirect(new URL(`/dashboard/${role}`, request.url));
    }
    // Non-DLH (bukan admin) mencoba akses dashboard DLH
    if (path.startsWith("/dashboard/dlh") && !isDLH && !isAdmin) {
      return NextResponse.redirect(new URL(`/dashboard/${role}`, request.url));
    }
  }

  return supabaseResponse;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
