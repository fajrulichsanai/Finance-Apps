'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/client';
import { AuthLogo } from '@/components/features/auth/AuthLogo';
import { AuthInput } from '@/components/features/auth/AuthInput';
import { AuthButton } from '@/components/features/auth/AuthButton';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!email) {
      setError('Please enter your email address');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError('Please enter a valid email address');
      return;
    }

    setIsLoading(true);

    try {
      const supabase = createClient();
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/auth/reset-password`,
      });

      if (error) {
        setError(`Failed to send reset email: ${error.message}`);
      } else {
        setSuccess(true);
        setEmail('');
      }
    } catch (err) {
      console.error('Forgot password error:', err);
      setError('An unexpected error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  if (success) {
    return (
      <div
        className="min-h-screen flex items-center justify-center px-4 py-6"
        style={{
          background: 'linear-gradient(160deg, #f0f4ff 0%, #e8f5ee 60%, #dff0e8 100%)',
        }}
      >
        <div className="w-full max-w-[390px]">
          <AuthLogo />

          <div className="bg-white rounded-3xl p-8 sm:p-10 w-full shadow-[0_2px_24px_rgba(0,0,0,0.06)] text-center">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg
                className="w-8 h-8 text-blue-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                />
              </svg>
            </div>

            <h1 className="text-2xl font-extrabold text-[#0d0d2b] mb-2">
              Check Your Email
            </h1>
            <p className="text-sm text-[#6b6b80] mb-8 leading-relaxed">
              We've sent a password reset link to your email address. Please check your inbox and follow the instructions to reset your password.
            </p>

            <p className="text-xs text-[#9999aa] mb-6">
              Didn't receive the email? Check your spam folder or try again.
            </p>

            <div className="space-y-3">
              <button
                onClick={() => setSuccess(false)}
                className="w-full py-3 px-4 bg-[#1a1a6e] text-white rounded-xl font-bold text-sm hover:bg-[#131261] transition-colors"
              >
                Try Another Email
              </button>

              <Link
                href="/"
                className="w-full py-3 px-4 bg-[#f5f5f5] text-[#0d0d2b] rounded-xl font-bold text-sm hover:bg-[#e8e8e8] transition-colors block"
              >
                Back to Login
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className="min-h-screen flex items-center justify-center px-4 py-6"
      style={{
        background: 'linear-gradient(160deg, #f0f4ff 0%, #e8f5ee 60%, #dff0e8 100%)',
      }}
    >
      <div className="w-full max-w-[390px]">
        <AuthLogo />

        <div className="bg-white rounded-3xl p-8 sm:p-10 w-full shadow-[0_2px_24px_rgba(0,0,0,0.06)]">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-[32px] font-extrabold text-[#0d0d2b] mb-2.5 tracking-tight">
              Forgot Password?
            </h1>
            <p className="text-sm text-[#6b6b80] leading-relaxed">
              Enter your email address and we'll send you a link to reset your password.
            </p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-6 p-3 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm">
              {error}
            </div>
          )}

          {/* Email Form */}
          <form onSubmit={handleForgotPassword} className="space-y-6">
            <AuthInput
              id="email"
              label="Email Address"
              type="email"
              value={email}
              onChange={setEmail}
              placeholder="name@firm.com"
              required
            />

            <AuthButton 
              type="submit" 
              disabled={isLoading}
              variant="primary"
            >
              {isLoading ? 'Sending...' : 'Send Reset Link'}
            </AuthButton>
          </form>

          {/* Back to Login Link */}
          <div className="mt-6 text-center text-sm">
            <span className="text-[#6b6b80]">Remember your password? </span>
            <Link 
              href="/" 
              className="text-[#1a1a6e] font-bold hover:underline"
            >
              Back to Login
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
