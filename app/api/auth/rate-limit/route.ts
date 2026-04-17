import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

/**
 * Server-side rate limiting for login attempts using database-backed RPC
 * ✅ SECURITY FIXES:
 * - Uses database (persistent across deployments)
 * - Atomic check-increment via RPC (prevents race conditions)
 * - IP-based only (prevents email enumeration)
 * - CSRF validation (origin + referer checks)
 * 
 * Rate limit: 5 attempts per 15 minutes per IP
 */

const MAX_ATTEMPTS = 5;
const RATE_LIMIT_WINDOW_MINUTES = 15;

// List of allowed origins (exact match)
const getAllowedOrigins = (): string[] => {
  const appUrl = process.env.NEXT_PUBLIC_APP_URL;
  const isDev = process.env.NODE_ENV === 'development';
  
  const origins = [];
  if (appUrl) origins.push(appUrl);
  if (isDev) origins.push('http://localhost:3000', 'http://127.0.0.1:3000');
  
  return origins;
};

/**
 * CSRF Protection: Validate request origin
 */
function validateOrigin(request: NextRequest): boolean {
  const origin = request.headers.get('origin');
  const allowedOrigins = getAllowedOrigins();
  
  // If no origin header, we can't validate (this is OK for same-site requests)
  if (!origin) {
    return true;
  }
  
  // Origin must be in whitelist
  return allowedOrigins.includes(origin);
}

/**
 * CSRF Protection: Validate request came from login page
 */
function validateReferer(request: NextRequest): boolean {
  const referer = request.headers.get('referer');
  
  // If no referer, we can't validate (be lenient for privacy reasons)
  if (!referer) {
    return true;
  }
  
  // Referer must be EXACTLY one of these paths (strict whitelist)
  try {
    const refererUrl = new URL(referer);
    const allowedPaths = [
      '/',              // Root login page
      '/login',         // Explicit login page
      '/register',      // Registration can trigger password reset
      '/auth/callback', // OAuth callback
      '/auth/reset-password', // Password reset page
    ];
    // ✅ STRICT: Exact path match only (no .startsWith)
    return allowedPaths.includes(refererUrl.pathname);
  } catch {
    // Invalid referer URL, reject
    return false;
  }
}

export async function POST(request: NextRequest) {
  try {
    // 1. CSRF VALIDATION - Check origin
    if (!validateOrigin(request)) {
      console.warn('[Rate Limit] CSRF: Invalid origin', { origin: request.headers.get('origin') });
      return NextResponse.json(
        { error: 'Invalid request origin' },
        { status: 403 }
      );
    }
    
    // 2. CSRF VALIDATION - Check referer
    if (!validateReferer(request)) {
      console.warn('[Rate Limit] CSRF: Invalid referer', { referer: request.headers.get('referer') });
      return NextResponse.json(
        { error: 'Invalid request referer' },
        { status: 403 }
      );
    }

    // 3. Extract and validate request body
    let body;
    try {
      body = await request.json();
    } catch {
      return NextResponse.json(
        { error: 'Invalid request body' },
        { status: 400 }
      );
    }

    // 4. Get client IP (works with Vercel, AWS, etc.)
    const ip =
      request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
      request.headers.get('x-real-ip') ||
      request.headers.get('cf-connecting-ip') || // Cloudflare
      'unknown';

    if (ip === 'unknown') {
      console.warn('[Rate Limit] Could not determine client IP');
      // Allow anyway - don't block legitimate users due to missing IP header
      return NextResponse.json({ allowed: true });
    }

    // 5. Call database RPC for atomic rate limit check
    const supabase = await createClient();
    const { data, error } = await supabase.rpc('check_and_increment_rate_limit', {
      p_ip: ip,
      p_max_attempts: MAX_ATTEMPTS,
      p_window_minutes: RATE_LIMIT_WINDOW_MINUTES,
    });

    if (error) {
      console.error('[Rate Limit] RPC error:', error);
      // On database error, allow request (fail open) to avoid blocking legitimate users
      return NextResponse.json({ allowed: true }, { status: 500 });
    }

    if (!data || data.length === 0) {
      console.error('[Rate Limit] Unexpected empty response from RPC');
      return NextResponse.json({ allowed: true }, { status: 500 });
    }

    const [result] = data;
    const { allowed, attempts_count } = result;

    // 6. Return result
    if (!allowed) {
      if (process.env.NODE_ENV === 'development') {
        console.log(`⛔ [Rate Limit] IP ${ip} blocked (${attempts_count}/${MAX_ATTEMPTS} attempts)`);
      }

      return NextResponse.json(
        {
          allowed: false,
          message: 'Too many login attempts. Please try again in 15 minutes.',
          attemptsRemaining: 0,
        },
        { status: 429 } // HTTP 429 Too Many Requests
      );
    }

    // Allowed
    if (process.env.NODE_ENV === 'development') {
      console.log(
        `✅ [Rate Limit] IP ${ip} allowed - attempt ${attempts_count}/${MAX_ATTEMPTS}`
      );
    }

    return NextResponse.json({
      allowed: true,
      attemptsRemaining: MAX_ATTEMPTS - attempts_count,
    });
  } catch (error) {
    console.error('[Rate Limit] Unexpected error:', error);
    
    // On unexpected error, allow the request (fail open)
    // This prevents legitimate users from being blocked due to server issues
    return NextResponse.json(
      { allowed: true },
      { status: 500 }
    );
  }
}
