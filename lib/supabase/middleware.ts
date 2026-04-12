import { createServerClient } from '@supabase/ssr'
import { type NextRequest, NextResponse } from 'next/server'

export async function updateSession(request: NextRequest) {
  const pathname = request.nextUrl.pathname
  
  // OPTIMIZATION 1: Skip auth check for public assets early
  const isPublicFile = pathname.includes('.') || pathname.startsWith('/_next')
  if (isPublicFile) {
    return NextResponse.next()
  }

  // OPTIMIZATION 2: Skip server-side auth check for auth pages
  // Let client handle auth state to reduce API calls
  const isAuthPage = pathname === '/' || 
                     pathname.startsWith('/register') || 
                     pathname === '/auth/callback'
  
  if (isAuthPage && pathname !== '/auth/callback') {
    // For login (/) and register, skip server check
    // Client-side AuthProvider will handle session
    return NextResponse.next()
  }

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

  // IMPORTANT: Avoid writing any logic between createServerClient and
  // supabase.auth.getUser(). A simple mistake could make it very hard to debug
  // issues with users being randomly logged out.

  // OPTIMIZATION 3: Only call getUser() for protected routes (not auth pages)
  // This route handles: /, /dashboard, etc (protected pages)
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    // Redirect to root (login page) if not authenticated
    const url = request.nextUrl.clone()
    url.pathname = '/'
    return NextResponse.redirect(url)
  }

  // IMPORTANT: You *must* return the supabaseResponse object as it is.
  return supabaseResponse
}
