'use client';

import React from 'react';
import Link from 'next/link';
import { AuthInput } from './AuthInput';
import { AuthButton } from './AuthButton';

interface RegisterFormProps {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  agreedToTerms: boolean;
  onNameChange: (value: string) => void;
  onEmailChange: (value: string) => void;
  onPasswordChange: (value: string) => void;
  onConfirmPasswordChange: (value: string) => void;
  onTermsChange: (value: boolean) => void;
  error: string;
  success: boolean;
  isLoading: boolean;
  onEmailRegister: (e: React.FormEvent) => void;
  onGoogleRegister: () => void;
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

export const RegisterForm: React.FC<RegisterFormProps> = ({
  name,
  email,
  password,
  confirmPassword,
  agreedToTerms,
  onNameChange,
  onEmailChange,
  onPasswordChange,
  onConfirmPasswordChange,
  onTermsChange,
  error,
  success,
  isLoading,
  onEmailRegister,
  onGoogleRegister,
}) => {
  return (
    <div className="bg-white rounded-3xl px-6 py-7 shadow-[0_2px_20px_rgba(0,0,0,0.05)]">
      {/* Error Message */}
      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm">
          {error}
        </div>
      )}

      {/* Success Message */}
      {success && (
        <div className="mb-4 p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-600 text-sm">
          Akun berhasil dibuat! Mengalihkan ke login...
        </div>
      )}

      <form onSubmit={onEmailRegister} className="space-y-3.5">
        {/* Full Name */}
        <AuthInput
          id="fullname"
          label="Nama Lengkap"
          type="text"
          value={name}
          onChange={onNameChange}
          placeholder="Julian Newman"
          required
        />

        {/* Email */}
        <AuthInput
          id="email"
          label="Email Institusional"
          type="email"
          value={email}
          onChange={onEmailChange}
          placeholder="julian@architect.com"
          required
        />

        {/* Password */}
        <AuthInput
          id="password"
          label="Kata Sandi Aman"
          type="password"
          value={password}
          onChange={onPasswordChange}
          placeholder="••••••••••••"
          required
        />

        {/* Confirm Password */}
        <AuthInput
          id="confirmPassword"
          label="Konfirmasi Kata Sandi"
          type="password"
          value={confirmPassword}
          onChange={onConfirmPasswordChange}
          placeholder="••••••••••••"
          required
        />

        {/* Terms Agreement */}
        <div className="flex items-start gap-2.5 my-[18px]">
          <input
            type="checkbox"
            id="agree"
            checked={agreedToTerms}
            onChange={(e) => onTermsChange(e.target.checked)}
            className="mt-0.5 w-4 h-4 accent-[#1a1a6e] cursor-pointer flex-shrink-0"
            required
          />
          <p className="text-[13px] text-[#6b6b80] leading-relaxed">
            <label htmlFor="agree" className="cursor-pointer">
              Saya setuju dengan{' '}
              <a href="#" className="text-[#1a1a6e] font-semibold no-underline">
                Syarat Layanan
              </a>
              {' '}dan{' '}
              <a href="#" className="text-[#1a1a6e] font-semibold no-underline">
                Kebijakan Privasi
              </a>
              .
            </label>
          </p>
        </div>

        {/* Create Account Button */}
        <AuthButton 
          type="submit" 
          disabled={isLoading}
          variant="primary"
        >
          {isLoading ? 'Membuat Akun...' : 'Buat Akun'}
          {!isLoading && <span className="text-lg font-normal">→</span>}
        </AuthButton>
      </form>

      {/* Divider - HIDDEN */}
      {/* <div className="flex items-center gap-3 my-6">
        <div className="flex-1 h-px bg-[#e8e8ee]" />
        <span className="text-[11px] text-[#b0b0c0] tracking-[0.8px] font-medium">
          ATAU DAFTAR DENGAN
        </span>
        <div className="flex-1 h-px bg-[#e8e8ee]" />
      </div> */}

      {/* Google Register - HIDDEN */}
      {/* <AuthButton
        onClick={onGoogleRegister}
        disabled={isLoading}
        variant="secondary"
        icon={<GoogleIcon />}
      >
        Daftar dengan Google
      </AuthButton> */}

      {/* Login Link */}
      <div className="text-center mt-8 pt-6 border-t-[1.5px] border-[#f0f0f5] text-sm text-[#6b6b80]">
        Sudah memiliki akun?{' '}
        <Link href="/login" className="text-[#1a1a6e] font-bold no-underline">
          Masuk
        </Link>
      </div>
    </div>
  );
};
