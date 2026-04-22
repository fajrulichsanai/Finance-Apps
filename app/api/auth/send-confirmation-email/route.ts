/**
 * API endpoint for sending confirmation email via Resend
 * POST /api/auth/send-confirmation-email
 */

import { NextRequest, NextResponse } from 'next/server';
import { sendConfirmationEmail } from '@/lib/services/email';

export async function POST(request: NextRequest) {
  try {
    console.log('📥 [API] POST /api/auth/send-confirmation-email - Request received');
    
    const { email, confirmationLink, name } = await request.json();
    
    console.log('📊 [API] Request body:', { email, name, linkProvided: !!confirmationLink });

    // Validation
    if (!email || !confirmationLink || !name) {
      console.log('❌ [API] Validation failed - Missing fields:', { email: !!email, confirmationLink: !!confirmationLink, name: !!name });
      return NextResponse.json(
        { error: 'Missing required fields: email, confirmationLink, name' },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      console.log('❌ [API] Invalid email format:', email);
      return NextResponse.json(
        { error: 'Invalid email format' },
        { status: 400 }
      );
    }

    console.log('📧 [API] Calling sendConfirmationEmail...');
    
    // Send email via Resend
    const result = await sendConfirmationEmail(email, confirmationLink, name);

    console.log('📊 [API] sendConfirmationEmail result:', { success: result.success, error: result.error });

    if (!result.success) {
      console.error('❌ [API] Email sending failed:', result.error);
      return NextResponse.json(
        { error: result.error || 'Failed to send confirmation email' },
        { status: 500 }
      );
    }

    console.log('✅ [API] Email sent successfully to:', email);
    return NextResponse.json(
      { success: true, message: 'Confirmation email sent successfully' },
      { status: 200 }
    );
  } catch (error) {
    console.error('❌ [API] Send confirmation email error - DETAILED:', {
      message: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : 'N/A',
      type: error instanceof Error ? error.constructor.name : typeof error,
    });
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
