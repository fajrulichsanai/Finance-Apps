import { createServerClient } from '@supabase/ssr'
import { type NextRequest, NextResponse } from 'next/server'

export async function updateSession(request: NextRequest) {
  const pathname = request.nextUrl.pathname
  
  // Skip auth check for API routes (they handle auth themselves)
  if (pathname.startsWith('/api/')) {
    return NextResponse.next({ request })
  }
  
  // Public routes that don't require authentication
  const publicRoutes = ['/', '/register', '/auth/callback']
  const isPublicRoute = publicRoutes.includes(pathname)

  let supabaseResponse = NextResponse.next({
    request,
  })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => {
            request.cookies.set(name, value)
            supabaseResponse.cookies.set(name, value, options)
          })
        },
      },
    }
  )

  // Get user session
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (process.env.NODE_ENV === 'development') {
    console.log(`🔒 [Middleware] ${pathname} - User: ${user ? user.email : 'none'}`)
  }

  // Auth redirect logic
  if (!user && !isPublicRoute) {
    // Not logged in, trying to access protected route → redirect to login (/)
    if (process.env.NODE_ENV === 'development') {
      console.log(`↩️ [Middleware] Redirecting ${pathname} → / (no auth)`)
    }
    const url = request.nextUrl.clone()
    url.pathname = '/'
    return NextResponse.redirect(url)
  }

  if (user && (pathname === '/' || pathname === '/register')) {
    // Already logged in, trying to access auth pages → redirect to dashboard
    if (process.env.NODE_ENV === 'development') {
      console.log(`↩️ [Middleware] Redirecting ${pathname} → /dashboard (already authed)`)
    }
    const url = request.nextUrl.clone()
    url.pathname = '/dashboard'
    return NextResponse.redirect(url)
  }

  return supabaseResponse
}
