'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { AuthLogo } from '@/components/features/auth/AuthLogo';
import { AuthInput } from '@/components/features/auth/AuthInput';
import { AuthButton } from '@/components/features/auth/AuthButton';

// ✅ BUG FIX #4: Create password reset page
export default function ResetPasswordPage() {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const validatePassword = (pwd: string): boolean => {
    return pwd.length >= 8;
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Validation
    if (!password || !confirmPassword) {
      setError('Please fill in all fields');
      return;
    }

    if (password.length < 8) {
      setError('Password must be at least 8 characters');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setIsLoading(true);

    try {
      const supabase = createClient();
      const { error } = await supabase.auth.updateUser({ password });

      if (error) {
        setError(`Failed to reset password: ${error.message}`);
      } else {
        setSuccess(true);
        setPassword('');
        setConfirmPassword('');

        // Redirect to login after 2 seconds
        setTimeout(() => {
          router.push('/');
        }, 2000);
      }
    } catch (err) {
      console.error('Password reset error:', err);
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
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg
                className="w-8 h-8 text-green-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>

            <h1 className="text-2xl font-extrabold text-[#0d0d2b] mb-2">Password Reset Successful!</h1>
            <p className="text-sm text-[#6b6b80] mb-6">
              Your password has been updated successfully. Redirecting to login...
            </p>

            <Link
              href="/"
              className="inline-block px-6 py-3 bg-[#1a1a6e] text-white rounded-[50px] font-semibold hover:bg-[#14146e] transition-colors"
            >
              Back to Login
            </Link>
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
              Reset Password
            </h1>
            <p className="text-sm text-[#6b6b80] leading-relaxed">
              Enter your new password below. Make sure it's at least 8 characters long.
            </p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm">
              {error}
            </div>
          )}

          {/* Reset Form */}
          <form onSubmit={handleResetPassword} className="space-y-4 mb-6">
            <AuthInput
              id="new-password"
              label="New Password"
              type="password"
              value={password}
              onChange={setPassword}
              placeholder="••••••••"
              required
            />

            <AuthInput
              id="confirm-password"
              label="Confirm Password"
              type="password"
              value={confirmPassword}
              onChange={setConfirmPassword}
              placeholder="••••••••"
              required
            />

            {/* Password Requirements */}
            <div className="text-xs text-[#6b6b80] bg-[#f8f8fb] p-3 rounded-lg">
              <p className="font-semibold mb-1">Password requirements:</p>
              <ul className="space-y-1 list-disc list-inside">
                <li>At least 8 characters</li>
                <li>Passwords must match</li>
              </ul>
            </div>

            <AuthButton type="submit" disabled={isLoading} variant="primary">
              {isLoading ? 'Resetting...' : 'Reset Password'}
              {!isLoading && <span className="text-lg font-normal">→</span>}
            </AuthButton>
          </form>

          {/* Back to Login Link */}
          <div className="text-center text-sm text-[#6b6b80]">
            Remember your password?{' '}
            <Link href="/" className="text-[#1a1a6e] font-bold no-underline hover:underline">
              Back to Login
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
