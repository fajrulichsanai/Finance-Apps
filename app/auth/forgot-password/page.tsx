'use client';

import React, { useState, useCallback, useRef, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { AuthLogo } from '@/components/features/auth/AuthLogo';
import { AuthInput } from '@/components/features/auth/AuthInput';
import { AuthButton } from '@/components/features/auth/AuthButton';
import { SuccessPopup } from '@/components/ui/SuccessPopup';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);
  const router = useRouter();
  const isMountedRef = useRef(true);

  useEffect(() => {
    return () => {
      isMountedRef.current = false;
    };
  }, []);

  const isValidEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccessMessage('');

    if (!email || !isValidEmail(email)) {
      setError('Please enter a valid email address');
      return;
    }

    setIsLoading(true);

    try {
      const supabase = createClient();
      const { error: resetError } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/auth/reset-password`,
      });

      if (!isMountedRef.current) {
        setIsLoading(false);
        return;
      }

      if (resetError) {
        setError('Gagal mengirim email pengaturan ulang. Silakan periksa alamat email Anda dan coba lagi.');
        if (process.env.NODE_ENV === 'development') {
          console.error('[Password Reset Error]:', resetError.message);
        }
      } else {
        setShowSuccessPopup(true);
        setEmail('');
      }
    } catch (err) {
      if (!isMountedRef.current) return;
      setError('An unexpected error occurred. Please try again later.');
      console.error('[Forgot Password Error]:', err);
    } finally {
      if (isMountedRef.current) {
        setIsLoading(false);
      }
    }
  }, [email]);

  return (
    <div 
      className="min-h-screen flex items-center justify-center px-4 py-6"
      style={{ background: 'linear-gradient(160deg, #f0f4ff 0%, #e8f5ee 60%, #dff0e8 100%)' }}
    >
      <div className="w-full max-w-[390px]">
        <AuthLogo />
        
        <div className="bg-white rounded-3xl p-8 sm:p-10 w-full shadow-[0_2px_24px_rgba(0,0,0,0.06)]">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-[32px] font-extrabold text-[#0d0d2b] mb-2.5 tracking-tight">
              Reset Password
            </h1>
            <p className="text-sm text-[#6b6b80] leading-relaxed">
              Enter your email address and we'll send you instructions to reset your password.
            </p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm leading-relaxed">
              {error}
            </div>
          )}

          {/* Email Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <AuthInput
              id="email"
              label="Email Address"
              type="email"
              value={email}
              onChange={setEmail}
              placeholder="nama@perusahaan.com"
              required
              disabled={isLoading}
            />

            <AuthButton 
              type="submit" 
              disabled={isLoading}
              variant="primary"
            >
              {isLoading ? 'Sending...' : 'Send Reset Link'}
              {!isLoading && <span className="text-lg font-normal">→</span>}
            </AuthButton>
          </form>

          {/* Back to Login Link */}
          <div className="text-center mt-8 pt-6 border-t-[1.5px] border-[#f0f0f5] text-sm text-[#6b6b80]">
            Remember your password?{' '}
            <Link href="/" className="text-[#1a1a6e] font-bold no-underline hover:underline">
              Back to Login
            </Link>
          </div>
        </div>

        {/* Security Footer */}
        <div className="mt-6 text-center text-xs text-[#9999aa]">
          <p>We'll never ask for your password via email.</p>
        </div>
      </div>

      {/* Success Popup */}
      <SuccessPopup
        isOpen={showSuccessPopup}
        title="Email Terkirim!"
        message="Kami telah mengirim link pengaturan ulang kata sandi ke email Anda. Silakan periksa inbox Anda dalam beberapa menit."
        onDone={() => {
          setShowSuccessPopup(false);
          router.push('/');
        }}
      />
    </div>
  );
}
