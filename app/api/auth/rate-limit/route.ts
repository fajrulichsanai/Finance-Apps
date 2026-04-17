import { NextRequest, NextResponse } from 'next/server';

/**
 * Server-side rate limiting for login attempts
 * ✅ SECURITY: Prevents brute force attacks
 * 
 * Rate limit: 5 attempts per 15 minutes per IP
 */

const MAX_ATTEMPTS = 5;
const RATE_LIMIT_WINDOW_MS = 15 * 60 * 1000; // 15 minutes

// In-memory store for rate limiting
const attemptStore = new Map<string, Array<{ timestamp: number }>>();

// Clean up old attempts periodically
setInterval(() => {
  const now = Date.now();
  attemptStore.forEach((attempts, key) => {
    const filtered = attempts.filter(
      (attempt) => now - attempt.timestamp < RATE_LIMIT_WINDOW_MS
    );
    
    if (filtered.length === 0) {
      attemptStore.delete(key);
    } else {
      attemptStore.set(key, filtered);
    }
  });
}, 60 * 1000); // Clean up every minute

export async function POST(request: NextRequest) {
  try {
    // Get client IP
    const ip =
      request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
      request.headers.get('x-real-ip') ||
      'unknown';

    // Rate limit key by IP only
    const rateLimitKey = ip;

    // Get current attempts
    const now = Date.now();
    let attempts = attemptStore.get(rateLimitKey) || [];

    // Filter out old attempts outside the window
    attempts = attempts.filter(
      (attempt) => now - attempt.timestamp < RATE_LIMIT_WINDOW_MS
    );

    // Check if rate limited
    if (attempts.length >= MAX_ATTEMPTS) {
      if (process.env.NODE_ENV === 'development') {
        console.log(`⛔ [Rate Limit] IP ${rateLimitKey} blocked (${attempts.length}/${MAX_ATTEMPTS})`);
      }

      return NextResponse.json(
        {
          allowed: false,
          message: 'Too many login attempts. Please try again in 15 minutes.',
        },
        { status: 429 } // HTTP 429 Too Many Requests
      );
    }

    // Record this attempt
    attempts.push({ timestamp: now });
    attemptStore.set(rateLimitKey, attempts);

    if (process.env.NODE_ENV === 'development') {
      console.log(
        `✅ [Rate Limit] IP ${rateLimitKey} - attempt ${attempts.length}/${MAX_ATTEMPTS}`
      );
    }

    // Allow the request
    return NextResponse.json({
      allowed: true,
      attemptsRemaining: MAX_ATTEMPTS - attempts.length,
    });
  } catch (error) {
    console.error('[Rate Limit] Error:', error);

    // On error, allow the request (fail open)
    return NextResponse.json(
      { allowed: true },
      { status: 500 }
    );
  }
}
