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
          Account created successfully! Redirecting to login...
        </div>
      )}

      <form onSubmit={onEmailRegister} className="space-y-3.5">
        {/* Full Name */}
        <AuthInput
          id="fullname"
          label="Full Name"
          type="text"
          value={name}
          onChange={onNameChange}
          placeholder="Julian Newman"
          required
        />

        {/* Email */}
        <AuthInput
          id="email"
          label="Institutional Email"
          type="email"
          value={email}
          onChange={onEmailChange}
          placeholder="julian@architect.com"
          required
        />

        {/* Password */}
        <AuthInput
          id="password"
          label="Secure Password"
          type="password"
          value={password}
          onChange={onPasswordChange}
          placeholder="••••••••••••"
          required
        />

        {/* Confirm Password */}
        <AuthInput
          id="confirmPassword"
          label="Confirm Password"
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
              I agree to the{' '}
              <a href="#" className="text-[#1a1a6e] font-semibold no-underline">
                Terms of Service
              </a>
              {' '}and{' '}
              <a href="#" className="text-[#1a1a6e] font-semibold no-underline">
                Privacy Policy
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
          {isLoading ? 'Creating Account...' : 'Create Account'}
          {!isLoading && <span className="text-lg font-normal">→</span>}
        </AuthButton>
      </form>

      {/* Divider */}
      <div className="w-10 h-[3px] bg-[#e0e0ea] rounded mx-auto my-5"></div>

      {/* Login Link */}
      <div className="text-center text-sm text-[#6b6b80] pb-1">
        Already have an account?{' '}
        <Link href="/login" className="text-[#1a1a6e] font-bold no-underline">
          Log In
        </Link>
      </div>
    </div>
  );
};
