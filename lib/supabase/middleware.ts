import { createServerClient } from '@supabase/ssr'
import { type NextRequest, NextResponse } from 'next/server'

// ✅ BUG FIX #5: Session validation cache to prevent excessive API calls
// Cache maps session to validation result with timestamp
const sessionCache = new Map<string, { valid: boolean; timestamp: number }>();
const CACHE_TTL = 5000; // 5 seconds

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

  // ✅ BUG FIX #5: Use getSession instead of getUser for better performance
  // getSession() reads from cookie cache (fast, no network call)
  // getUser() makes API request to Supabase (slow, network-dependent)
  const {
    data: { session },
  } = await supabase.auth.getSession()

  const user = session?.user ?? null

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
