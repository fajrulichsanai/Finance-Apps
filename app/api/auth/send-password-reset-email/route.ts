/**
 * API endpoint for sending password reset email via Resend
 * POST /api/auth/send-password-reset-email
 */

import { NextRequest, NextResponse } from 'next/server';
import { sendPasswordResetEmail } from '@/lib/services/email';

export async function POST(request: NextRequest) {
  try {
    const { email, resetLink, name } = await request.json();

    // Validation
    if (!email || !resetLink || !name) {
      return NextResponse.json(
        { error: 'Missing required fields: email, resetLink, name' },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Invalid email format' },
        { status: 400 }
      );
    }

    // Send email via Resend
    const result = await sendPasswordResetEmail(email, resetLink, name);

    if (!result.success) {
      return NextResponse.json(
        { error: result.error || 'Failed to send password reset email' },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { success: true, message: 'Password reset email sent successfully' },
      { status: 200 }
    );
  } catch (error) {
    console.error('❌ [API] Send password reset email error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
