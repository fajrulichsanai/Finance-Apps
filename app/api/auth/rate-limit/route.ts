import { NextRequest, NextResponse } from 'next/server';

/**
 * Rate limiting endpoint - DISABLED
 * ✅ Rate limiting has been removed per user request
 */

export async function POST(request: NextRequest) {
  // Always allow - rate limiting disabled
  return NextResponse.json({
    allowed: true,
  });
}
