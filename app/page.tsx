'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/providers/AuthProvider';
import { useLogin } from '@/hooks/useLogin';
import { LoginForm } from '@/components/features/auth/LoginForm';
import { AuthLogo } from '@/components/features/auth/AuthLogo';

export default function LoginPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const {
    email,
    setEmail,
    password,
    setPassword,
    error,
    successMessage, // ✅ NEW: Get success message
    isLoading,
    handleEmailLogin,
    handleGoogleLogin,
    handleForgotPassword,
  } = useLogin();

  // ✅ BUG FIX #1: REMOVED double redirect logic
  // Middleware already handles redirects for authenticated users
  // This useEffect is NO LONGER NEEDED - it was causing race conditions
  // Just let middleware do its job silently in the background

  // Show loading state while checking auth
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f0f0f0]">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-[#1a1a6e] border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="mt-4 text-[#6b6b80] text-sm">Loading...</p>
        </div>
      </div>
    );
  }

  // ✅ BUG FIX #1: REMOVED conditional render for authenticated users
  // Middleware will silently redirect authenticated users to /dashboard
  // No need to show a "Redirecting..." screen - middleware handles it server-side
  // If middleware hasn't redirected yet, just show the login form
  // (This shouldn't happen but is a safety fallback)

  return (
    <div 
      className="min-h-screen flex items-center justify-center px-4 py-6"
      style={{ background: 'linear-gradient(160deg, #f0f4ff 0%, #e8f5ee 60%, #dff0e8 100%)' }}
    >
      <div className="w-full max-w-[390px]">
        <AuthLogo />
        <LoginForm
          email={email}
          setEmail={setEmail}
          password={password}
          setPassword={setPassword}
          error={error}
          successMessage={successMessage} // ✅ NEW: Pass success message
          isLoading={isLoading}
          onEmailLogin={handleEmailLogin}
          onGoogleLogin={handleGoogleLogin}
          onForgotPassword={handleForgotPassword}
        />
      </div>
    </div>
  );
}
