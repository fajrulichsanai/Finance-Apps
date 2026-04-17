import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

/**
 * Server-side rate limiting for login attempts
 * ✅ SECURITY FIX: Prevents brute force attacks
 * 
 * Rate limit: 5 attempts per 15 minutes per IP+email combination
 */

const MAX_ATTEMPTS = 5;
const RATE_LIMIT_WINDOW_MS = 15 * 60 * 1000; // 15 minutes

// In-memory store for rate limiting (for single-server deployments)
// For multi-server deployments, use Redis or database
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
    const { email } = await request.json();

    if (!email) {
      return NextResponse.json(
        { error: 'Email is required' },
        { status: 400 }
      );
    }

    // Get client IP
    const ip =
      request.headers.get('x-forwarded-for')?.split(',')[0].trim() ||
      request.headers.get('x-real-ip') ||
      'unknown';

    // Create rate limit key combining IP and email
    const rateLimitKey = `${ip}:${email}`;

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
        console.log(`⛔ [Rate Limit] ${rateLimitKey} blocked (${attempts.length} attempts)`);
      }

      // Calculate time until reset
      const oldestAttempt = attempts[0].timestamp;
      const timeUntilReset = RATE_LIMIT_WINDOW_MS - (now - oldestAttempt);

      return NextResponse.json(
        {
          allowed: false,
          message: 'Too many login attempts. Please try again later.',
          resetTime: Math.ceil(timeUntilReset / 1000),
        },
        { status: 429 } // HTTP 429 Too Many Requests
      );
    }

    // Record this attempt
    attempts.push({ timestamp: now });
    attemptStore.set(rateLimitKey, attempts);

    if (process.env.NODE_ENV === 'development') {
      console.log(
        `📝 [Rate Limit] ${rateLimitKey} - attempt ${attempts.length}/${MAX_ATTEMPTS}`
      );
    }

    // Allow the request
    return NextResponse.json({
      allowed: true,
      attemptsRemaining: MAX_ATTEMPTS - attempts.length,
    });
  } catch (error) {
    console.error('[Rate Limit] Error:', error);

    // On error, allow the request (fail open) to avoid blocking legitimate users
    return NextResponse.json(
      { allowed: true },
      { status: 500 }
    );
  }
}
