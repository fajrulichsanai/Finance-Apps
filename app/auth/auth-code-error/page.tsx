'use client';

import React from 'react';
import Link from 'next/link';
import { AuthLogo } from '@/components/features/auth/AuthLogo';

// ✅ BUG FIX #9: Create error page for OAuth callback failure
export default function AuthCodeErrorPage() {
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
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg
                className="w-8 h-8 text-red-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </div>

            <h1 className="text-[32px] font-extrabold text-[#0d0d2b] mb-2.5 tracking-tight text-center">
              Authentication Failed
            </h1>
            <p className="text-sm text-[#6b6b80] leading-relaxed text-center">
              The authentication code has expired or is invalid. Please try logging in again.
            </p>
          </div>

          {/* Error Details */}
          <div className="mb-6 p-4 bg-amber-50 border border-amber-200 rounded-xl">
            <p className="text-sm text-amber-800">
              <strong>What happened?</strong>
              <br />
              The authentication code from your provider has expired or couldn&apos;t be verified. This
              can happen if you took too long to complete the sign-in process.
            </p>
          </div>

          {/* Action Buttons */}
          <div className="space-y-3">
            <Link
              href="/"
              className="block w-full px-4 py-4 bg-[#1a1a6e] text-white rounded-[50px] font-semibold text-center hover:bg-[#14146e] transition-colors"
            >
              Back to Login
            </Link>

            <Link
              href="/"
              className="block w-full px-4 py-4 bg-white text-[#0d0d2b] border-[1.5px] border-[#e8e8ee] rounded-[50px] font-semibold text-center hover:bg-[#f8f8fb] transition-colors"
            >
              Try Again
            </Link>
          </div>

          {/* Help Text */}
          <div className="mt-8 pt-6 border-t-[1.5px] border-[#f0f0f5] text-center text-xs text-[#b0b0c0]">
            <p>
              If you continue to have issues, please contact{' '}
              <a href="mailto:support@financeapp.com" className="text-[#1a1a6e] hover:underline">
                support
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
