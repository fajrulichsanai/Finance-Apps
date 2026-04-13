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
    isLoading,
    handleEmailLogin,
    handleGoogleLogin,
  } = useLogin();

  // Client-side redirect for authenticated users (initial page load only)
  useEffect(() => {
    if (!loading && user) {
      // Use hard redirect to ensure session cookies are sent to server
      window.location.href = '/dashboard';
    }
  }, [user, loading]);

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

  // If user exists, middleware will redirect to /dashboard
  // Show loading state while middleware processes the redirect
  if (user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f0f0f0]">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-[#1a1a6e] border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="mt-4 text-[#6b6b80] text-sm">Redirecting to dashboard...</p>
        </div>
      </div>
    );
  }

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
          isLoading={isLoading}
          onEmailLogin={handleEmailLogin}
          onGoogleLogin={handleGoogleLogin}
        />
      </div>
    </div>
  );
}
