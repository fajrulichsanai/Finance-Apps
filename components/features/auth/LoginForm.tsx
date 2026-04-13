'use client';

import React from 'react';
import Link from 'next/link';
import { AuthInput } from './AuthInput';
import { AuthButton } from './AuthButton';

interface LoginFormProps {
  email: string;
  setEmail: (value: string) => void;
  password: string;
  setPassword: (value: string) => void;
  error: string;
  isLoading: boolean;
  onEmailLogin: (e: React.FormEvent) => void;
  onGoogleLogin: () => void;
}

const GoogleIcon = () => (
  <div className="w-5 h-5 bg-[#0d0d2b] rounded flex items-center justify-center flex-shrink-0">
    <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
      <rect x="1" y="1" width="4" height="4" fill="white"/>
      <rect x="7" y="1" width="4" height="4" fill="white" opacity="0.7"/>
      <rect x="1" y="7" width="4" height="4" fill="white" opacity="0.7"/>
      <rect x="7" y="7" width="4" height="4" fill="white" opacity="0.5"/>
    </svg>
  </div>
);

export const LoginForm: React.FC<LoginFormProps> = ({
  email,
  setEmail,
  password,
  setPassword,
  error,
  isLoading,
  onEmailLogin,
  onGoogleLogin,
}) => {
  const handleForgotPassword = () => {
    // TODO: Implement forgot password functionality
    console.log('Forgot password clicked');
  };

  return (
    <div className="bg-white rounded-3xl p-10 w-full max-w-[380px] shadow-[0_2px_24px_rgba(0,0,0,0.06)]">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-[32px] font-extrabold text-[#0d0d2b] mb-2.5 tracking-tight">
          Welcome back
        </h1>
        <p className="text-sm text-[#6b6b80] leading-relaxed">
          Please enter your credentials to access your dashboard.
        </p>
      </div>

      {/* Error Message */}
      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm">
          {error}
        </div>
      )}

      {/* Email/Password Form */}
      <form onSubmit={onEmailLogin} className="space-y-4 mb-6">
        <AuthInput
          id="email"
          label="Email Address"
          type="email"
          value={email}
          onChange={setEmail}
          placeholder="name@firm.com"
          required
        />

        <AuthInput
          id="password"
          label="Password"
          type="password"
          value={password}
          onChange={setPassword}
          placeholder="••••••••"
          required
          actionButton={{
            label: 'FORGOT PASSWORD?',
            onClick: handleForgotPassword,
          }}
        />

        <AuthButton 
          type="submit" 
          disabled={isLoading}
          variant="primary"
        >
          {isLoading ? 'Logging in...' : 'Login'}
          {!isLoading && <span className="text-lg font-normal">→</span>}
        </AuthButton>
      </form>

      {/* Divider */}
      <div className="flex items-center gap-3 my-6">
        <div className="flex-1 h-px bg-[#e8e8ee]" />
        <span className="text-[11px] text-[#b0b0c0] tracking-[0.8px] font-medium">
          OR CONTINUE WITH
        </span>
        <div className="flex-1 h-px bg-[#e8e8ee]" />
      </div>

      {/* Google Login */}
      <AuthButton
        onClick={onGoogleLogin}
        disabled={isLoading}
        variant="secondary"
        icon={<GoogleIcon />}
      >
        Login with Google
      </AuthButton>

      {/* Sign Up Link */}
      <div className="text-center mt-8 pt-6 border-t-[1.5px] border-[#f0f0f5] text-sm text-[#6b6b80]">
        Don&apos;t have an account?{' '}
        <Link href="/register" className="text-[#1a1a6e] font-bold no-underline hover:underline">
          Sign Up
        </Link>
      </div>
    </div>
  );
};
