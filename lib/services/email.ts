/**
 * Email service using Resend
 * Handles all email sending operations for the application
 */

import { Resend } from 'resend';

// Lazy initialization to handle missing API key during build
const getResendClient = () => {
  if (!process.env.RESEND_API_KEY) {
    throw new Error('RESEND_API_KEY environment variable is not set');
  }
  return new Resend(process.env.RESEND_API_KEY);
};

const SENDER_EMAIL = process.env.NEXT_PUBLIC_SENDER_EMAIL || 'noreply@financeapp.com';

/**
 * Send email confirmation link for signup
 */
export async function sendConfirmationEmail(
  to: string,
  confirmationLink: string,
  name: string
): Promise<{ success: boolean; error?: string }> {
  try {
    console.log('📧 [Resend] Attempting to send confirmation email to:', to);
    console.log('🔑 [Resend] API Key configured:', !!process.env.RESEND_API_KEY);
    console.log('📤 [Resend] Sender email:', SENDER_EMAIL);
    
    const subject = 'Konfirmasi Email - Finance App';
    const html = `
<!DOCTYPE html>
<html lang="id">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${subject}</title>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { background: linear-gradient(160deg, #f0f4ff 0%, #e8f5ee 60%, #dff0e8 100%); padding: 30px; border-radius: 12px 12px 0 0; text-align: center; }
    .header h1 { color: #1a1a6e; margin: 0; font-size: 24px; }
    .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 12px 12px; }
    .greeting { color: #333; font-size: 16px; margin-bottom: 20px; }
    .button { display: inline-block; background: linear-gradient(135deg, #1a1a6e 0%, #1e3a5f 100%); color: white; padding: 12px 30px; border-radius: 8px; text-decoration: none; font-weight: bold; margin: 20px 0; }
    .button:hover { opacity: 0.9; }
    .footer { color: #999; font-size: 12px; text-align: center; margin-top: 20px; padding-top: 20px; border-top: 1px solid #eee; }
    .expiry { background: #fff3cd; border: 1px solid #ffc107; border-radius: 8px; padding: 12px; margin-top: 20px; color: #856404; font-size: 14px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>🎉 Selamat Datang!</h1>
    </div>
    <div class="content">
      <div class="greeting">
        <p>Halo ${name},</p>
        <p>Terima kasih telah mendaftar di Finance App. Silakan konfirmasi email Anda untuk menyelesaikan proses pendaftaran.</p>
      </div>
      <div style="text-align: center;">
        <a href="${confirmationLink}" class="button">Konfirmasi Email</a>
      </div>
      <div class="expiry">
        <strong>⏰ Penting:</strong> Link konfirmasi ini berlaku selama 24 jam. Jika tidak dikonfirmasi dalam waktu tersebut, Anda perlu mendaftar ulang.
      </div>
      <p style="color: #666; font-size: 14px; margin-top: 20px;">
        Jika Anda tidak membuat akun ini, abaikan email ini. Akun akan dihapus secara otomatis jika tidak dikonfirmasi dalam 24 jam.
      </p>
    </div>
    <div class="footer">
      <p>© 2026 Finance App. Semua hak dilindungi.</p>
      <p>Jangan balas email ini. Gunakan halaman kontak kami untuk bantuan.</p>
    </div>
  </div>
</body>
</html>
    `;

    console.log('📤 [Resend] Calling resend.emails.send()...');
    
    const resend = getResendClient();
    const result = await resend.emails.send({
      from: SENDER_EMAIL,
      to,
      subject,
      html,
    });

    console.log('📊 [Resend] Response received:', { hasId: !!result?.data?.id, hasError: !!result?.error });

    if (result.error) {
      console.error('❌ [Resend] Confirmation email error - DETAILED:', {
        message: result.error.message,
        fullError: result.error
      });
      return { success: false, error: result.error.message };
    }

    console.log('✅ [Resend] Confirmation email sent successfully:', { messageId: result?.data?.id, to });
    return { success: true };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    console.error('❌ [Resend] Send confirmation email failed - DETAILED:', {
      message: errorMessage,
      stack: error instanceof Error ? error.stack : 'N/A',
      type: error instanceof Error ? error.constructor.name : typeof error,
      fullError: error
    });
    return { success: false, error: errorMessage };
  }
}

/**
 * Send password reset email
 */
export async function sendPasswordResetEmail(
  to: string,
  resetLink: string,
  name: string
): Promise<{ success: boolean; error?: string }> {
  try {
    const subject = 'Reset Password - Finance App';
    const html = `
<!DOCTYPE html>
<html lang="id">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${subject}</title>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { background: #fff3cd; padding: 30px; border-radius: 12px 12px 0 0; text-align: center; }
    .header h1 { color: #856404; margin: 0; font-size: 24px; }
    .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 12px 12px; }
    .button { display: inline-block; background: #1a1a6e; color: white; padding: 12px 30px; border-radius: 8px; text-decoration: none; font-weight: bold; margin: 20px 0; }
    .button:hover { opacity: 0.9; }
    .footer { color: #999; font-size: 12px; text-align: center; margin-top: 20px; padding-top: 20px; border-top: 1px solid #eee; }
    .expiry { background: #f8d7da; border: 1px solid #f5c6cb; border-radius: 8px; padding: 12px; margin-top: 20px; color: #721c24; font-size: 14px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>🔐 Reset Password</h1>
    </div>
    <div class="content">
      <p>Halo ${name},</p>
      <p>Kami menerima permintaan untuk mereset password Anda. Klik tombol di bawah untuk membuat password baru.</p>
      <div style="text-align: center;">
        <a href="${resetLink}" class="button">Reset Password</a>
      </div>
      <div class="expiry">
        <strong>⏰ Penting:</strong> Link reset ini berlaku selama 1 jam. Jika sudah expired, silakan minta link baru.
      </div>
      <p style="color: #666; font-size: 14px; margin-top: 20px;">
        Jika Anda tidak meminta reset password, abaikan email ini. Akun Anda aman.
      </p>
    </div>
    <div class="footer">
      <p>© 2026 Finance App. Semua hak dilindungi.</p>
    </div>
  </div>
</body>
</html>
    `;

    const resend = getResendClient();
    const result = await resend.emails.send({
      from: SENDER_EMAIL,
      to,
      subject,
      html,
    });

    if (result.error) {
      console.error('❌ [Resend] Password reset email error:', result.error);
      return { success: false, error: result.error.message };
    }

    console.log('✅ [Resend] Password reset email sent to:', to);
    return { success: true };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    console.error('❌ [Resend] Send password reset email failed:', errorMessage);
    return { success: false, error: errorMessage };
  }
}

/**
 * Send generic email
 */
export async function sendEmail(
  to: string,
  subject: string,
  html: string
): Promise<{ success: boolean; error?: string }> {
  try {
    const resend = getResendClient();
    const result = await resend.emails.send({
      from: SENDER_EMAIL,
      to,
      subject,
      html,
    });

    if (result.error) {
      console.error('❌ [Resend] Email error:', result.error);
      return { success: false, error: result.error.message };
    }

    console.log('✅ [Resend] Email sent to:', to);
    return { success: true };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    console.error('❌ [Resend] Send email failed:', errorMessage);
    return { success: false, error: errorMessage };
  }
}
