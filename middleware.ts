import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() { return request.cookies.getAll() },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          )
          supabaseResponse = NextResponse.next({ request })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  const { data: { user } } = await supabase.auth.getUser()

  const path = request.nextUrl.pathname

  // Protect dashboard routes
  if (path.startsWith('/dashboard') && !user) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  // Redirect logged-in users away from login page
  if (path === '/login' && user) {
    const { data: profile } = await supabase
      .from('user_profiles')
      .select('role')
      .eq('id', user.id)
      .single()

    const role = profile?.role || 'mitra'
    return NextResponse.redirect(new URL(`/dashboard/${role}`, request.url))
  }

  // Role-based access guard
  if (path.startsWith('/dashboard/')) {
    if (!user) return NextResponse.redirect(new URL('/login', request.url))

    const { data: profile } = await supabase
      .from('user_profiles')
      .select('role')
      .eq('id', user.id)
      .single()

    const role = profile?.role
    const isAdmin = role === 'admin'
    const isMitra = role === 'mitra'
    const isDLH   = role === 'dlh'

    if (path.startsWith('/dashboard/admin') && !isAdmin) {
      return NextResponse.redirect(new URL(`/dashboard/${role}`, request.url))
    }
    if (path.startsWith('/dashboard/mitra') && !isMitra && !isAdmin) {
      return NextResponse.redirect(new URL(`/dashboard/${role}`, request.url))
    }
    if (path.startsWith('/dashboard/dlh') && !isDLH && !isAdmin) {
      return NextResponse.redirect(new URL(`/dashboard/${role}`, request.url))
    }
  }

  return supabaseResponse
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
