import { updateSession } from '@/lib/supabase/middleware'
import { type NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  return await updateSession(request)
}

export const config = {
  matcher: [
    /*
     * OPTIMIZED: Only match actual page routes, not static assets
     * This prevents unnecessary auth checks on every CSS/JS/image file
     */
    '/',
    '/((?!_next|api|favicon.ico|.*\\.|public).*)',
  ],
}
