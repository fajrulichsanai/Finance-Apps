'use client';

import React from 'react';
import { useLogin } from '@/hooks/useLogin';
import { LoginForm } from '@/components/features/auth/LoginForm';

export default function LoginPage() {
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

  return (
    <div className="min-h-screen bg-[#f0f0f0] flex items-center justify-center px-4 py-8">
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
  );
}
