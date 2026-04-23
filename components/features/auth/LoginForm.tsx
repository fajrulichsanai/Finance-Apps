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
  successMessage?: string;
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
  successMessage,
  isLoading,
  onEmailLogin,
  onGoogleLogin,
}) => {
  return (
    <div className="bg-white rounded-3xl p-8 sm:p-10 w-full shadow-[0_2px_24px_rgba(0,0,0,0.06)]">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-[32px] font-extrabold text-[#0d0d2b] mb-2.5 tracking-tight">
          Selamat Datang Kembali
        </h1>
        <p className="text-sm text-[#6b6b80] leading-relaxed">
          Silakan masukkan kredensial Anda untuk mengakses dasbor.
        </p>
      </div>

      {/* Success Message */}
      {successMessage && (
        <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-xl text-green-600 text-sm">
          ✓ {successMessage}
        </div>
      )}

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
          label="Alamat Email"
          type="email"
          value={email}
          onChange={setEmail}
          placeholder="nama@perusahaan.com"
          required
        />

        <AuthInput
          id="password"
          label="Kata Sandi"
          type="password"
          value={password}
          onChange={setPassword}
          placeholder="••••••••"
          required
          actionButton={{
            label: 'Lupa Password?',
            href: '/auth/forgot-password',
          }}
        />

        <AuthButton 
          type="submit" 
          disabled={isLoading}
          variant="primary"
        >
          {isLoading ? 'Masuk...' : 'Masuk'}
          {!isLoading && <span className="text-lg font-normal">→</span>}
        </AuthButton>
      </form>

      {/* Divider - HIDDEN */}
      {/* <div className="flex items-center gap-3 my-6">
        <div className="flex-1 h-px bg-[#e8e8ee]" />
        <span className="text-[11px] text-[#b0b0c0] tracking-[0.8px] font-medium">
          ATAU LANJUTKAN DENGAN
        </span>
        <div className="flex-1 h-px bg-[#e8e8ee]" />
      </div> */}

      {/* Google Login - HIDDEN */}
      {/* <AuthButton
        onClick={onGoogleLogin}
        disabled={isLoading}
        variant="secondary"
        icon={<GoogleIcon />}
      >
        Masuk dengan Google
      </AuthButton> */}

      {/* Sign Up Link */}
      <div className="text-center mt-8 pt-6 border-t-[1.5px] border-[#f0f0f5] text-sm text-[#6b6b80]">
        Belum memiliki akun?{' '}
        <Link href="/register" className="text-[#1a1a6e] font-bold no-underline hover:underline">
          Daftar
        </Link>
      </div>
    </div>
  );
};
