'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/providers/AuthProvider';
import { useRouter } from 'next/navigation';

export default function RegisterPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  
  // ANTI-LOOP: Don't destructure unused `user` to prevent unnecessary re-renders
  const { signUpWithEmail, signInWithGoogle } = useAuth();
  const router = useRouter();
  
  // ANTI-LOOP: Prevent double submissions
  const submitInProgress = React.useRef(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // ANTI-LOOP: Prevent double submit
    if (submitInProgress.current || isLoading) {
      console.log('⚠️ Submit already in progress, ignoring');
      return;
    }
    
    setError('');
    setSuccess(false);
    
    if (password !== confirmPassword) {
      setError('Passwords do not match!');
      return;
    }

    if (password.length < 8) {
      setError('Password must be at least 8 characters long');
      return;
    }

    if (!agreedToTerms) {
      setError('Please agree to the Terms of Service and Privacy Policy');
      return;
    }

    submitInProgress.current = true;
    setIsLoading(true);

    try {
      const { error } = await signUpWithEmail(email, password, name);
      
      if (error) {
        setError(error.message);
        setIsLoading(false);
        submitInProgress.current = false;
      } else {
        setSuccess(true);
        setIsLoading(false);
        // Redirect to login after successful registration
        setTimeout(() => {
          router.push('/login');
        }, 2000);
        // Note: submitInProgress not reset because we're navigating away
      }
    } catch (err) {
      console.error('Unexpected error:', err);
      setError('An unexpected error occurred');
      setIsLoading(false);
      submitInProgress.current = false;
    }
  };

  const handleGoogleSignup = async () => {
    // ANTI-LOOP: Prevent double click
    if (submitInProgress.current || isLoading) {
      return;
    }
    
    submitInProgress.current = true;
    setError('');
    setIsLoading(true);
    
    try {
      await signInWithGoogle();
      // Google will redirect to auth/callback, no error handling needed here
    } catch (err) {
      console.error('Google sign up error:', err);
      setError('Failed to initiate Google sign up');
      setIsLoading(false);
      submitInProgress.current = false;
    }
  };

  return (
    <div 
      className="min-h-screen flex items-center justify-center px-4 py-6"
      style={{ background: 'linear-gradient(160deg, #f0f4ff 0%, #e8f5ee 60%, #dff0e8 100%)' }}
    >
      <div className="w-full max-w-[390px]">
        {/* Logo Bar */}
        <div className="flex items-center gap-2.5 mb-7">
          <div className="w-10 h-10 rounded-full bg-[#1a1a6e] flex items-center justify-center flex-shrink-0">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <rect x="2" y="18" width="20" height="3" rx="1" fill="white"/>
              <rect x="10" y="4" width="4" height="14" rx="1" fill="white" opacity="0.9"/>
              <rect x="4" y="8" width="4" height="10" rx="1" fill="white" opacity="0.75"/>
              <rect x="16" y="10" width="4" height="8" rx="1" fill="white" opacity="0.75"/>
              <path d="M4 6 L12 2 L20 6" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <span className="text-[15px] font-bold text-[#0d0d2b]">The Financial Architect</span>
        </div>

        {/* Hero Section */}
        <div className="mb-8">
          <h1 className="text-[40px] font-extrabold leading-[1.1] text-[#0d0d2b] mb-1.5 tracking-tight">
            Architect your<br />
            <span className="text-[#1a1a6e]">financial</span><br />
            <span className="text-[#1a1a6e]">future.</span>
          </h1>
          <p className="text-sm text-[#6b6b80] leading-relaxed mt-3.5 mb-8">
            Join the exclusive ecosystem for sophisticated wealth management and crystalline clarity.
          </p>
        </div>

        {/* Card */}
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

          <form onSubmit={handleSubmit} className="space-y-3.5">
            {/* Full Name */}
            <div>
              <label htmlFor="fullname" className="block text-[10px] font-bold text-[#9999aa] tracking-wider uppercase mb-2">
                Full Name
              </label>
              <input
                type="text"
                id="fullname"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-[18px] py-3.5 border-none rounded-xl bg-[#f2f2f6] text-sm text-[#0d0d2b] placeholder-[#b8b8c8] outline-none focus:bg-[#eaeaf2] transition-colors"
                placeholder="Julian Newman"
                required
              />
            </div>

            {/* Email */}
            <div>
              <label htmlFor="email" className="block text-[10px] font-bold text-[#9999aa] tracking-wider uppercase mb-2">
                Institutional Email
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-[18px] py-3.5 border-none rounded-xl bg-[#f2f2f6] text-sm text-[#0d0d2b] placeholder-[#b8b8c8] outline-none focus:bg-[#eaeaf2] transition-colors"
                placeholder="julian@architect.com"
                required
              />
            </div>

            {/* Password */}
            <div>
              <label htmlFor="password" className="block text-[10px] font-bold text-[#9999aa] tracking-wider uppercase mb-2">
                Secure Password
              </label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-[18px] py-3.5 border-none rounded-xl bg-[#f2f2f6] text-sm text-[#0d0d2b] placeholder-[#b8b8c8] outline-none focus:bg-[#eaeaf2] transition-colors"
                placeholder="••••••••••••"
                required
                minLength={8}
              />
            </div>

            {/* Confirm Password */}
            <div>
              <label htmlFor="confirmPassword" className="block text-[10px] font-bold text-[#9999aa] tracking-wider uppercase mb-2">
                Confirm Password
              </label>
              <input
                type="password"
                id="confirmPassword"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full px-[18px] py-3.5 border-none rounded-xl bg-[#f2f2f6] text-sm text-[#0d0d2b] placeholder-[#b8b8c8] outline-none focus:bg-[#eaeaf2] transition-colors"
                placeholder="••••••••••••"
                required
                minLength={8}
              />
            </div>

            {/* Terms Agreement */}
            <div className="flex items-start gap-2.5 my-[18px]">
              <input
                type="checkbox"
                id="agree"
                checked={agreedToTerms}
                onChange={(e) => setAgreedToTerms(e.target.checked)}
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
            <button
              type="submit"
              disabled={isLoading}
              className="w-full px-4 py-4 bg-[#1a1a6e] text-white border-none rounded-[50px] text-base font-bold cursor-pointer flex items-center justify-center gap-2 hover:bg-[#141460] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isLoading ? 'Creating Account...' : 'Create Account'}
              {!isLoading && <span>&nbsp;→</span>}
            </button>
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

        {/* Footer */}
        <div className="flex items-center justify-between mt-4 px-1 pt-3">
          <span className="text-[10px] font-semibold text-[#b0b0c0] tracking-[0.8px] uppercase">
            Encrypted by AES-256
          </span>
          <div className="flex gap-3.5 items-center">
            {/* Shield check */}
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" className="opacity-35">
              <path d="M12 2L4 6v6c0 5.25 3.5 10.15 8 11.35C16.5 22.15 20 17.25 20 12V6L12 2z" stroke="#6b6b80" strokeWidth="1.8" strokeLinejoin="round"/>
              <path d="M9 12l2 2 4-4" stroke="#6b6b80" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            {/* Shield */}
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" className="opacity-35">
              <path d="M12 2L4 6v6c0 5.25 3.5 10.15 8 11.35C16.5 22.15 20 17.25 20 12V6L12 2z" stroke="#6b6b80" strokeWidth="1.8" strokeLinejoin="round"/>
            </svg>
            {/* Lock */}
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" className="opacity-35">
              <rect x="5" y="11" width="14" height="10" rx="2" stroke="#6b6b80" strokeWidth="1.8"/>
              <path d="M8 11V7a4 4 0 0 1 8 0v4" stroke="#6b6b80" strokeWidth="1.8" strokeLinecap="round"/>
              <circle cx="12" cy="16" r="1.5" fill="#6b6b80"/>
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
}
