'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/providers/AuthProvider';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  
  // ANTI-LOOP: Don't destructure `user` if not needed
  // This prevents unnecessary re-renders when user state changes
  const { signInWithEmail, signInWithGoogle } = useAuth();
  const router = useRouter();
  
  // ANTI-LOOP: Prevent double submissions
  const submitInProgress = React.useRef(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // ANTI-LOOP: Prevent double submit (especially in dev mode)
    if (submitInProgress.current || isLoading) {
      console.log('⚠️ Submit already in progress, ignoring');
      return;
    }
    
    submitInProgress.current = true;
    setError('');
    setIsLoading(true);

    try {
      const { error } = await signInWithEmail(email, password);
      
      if (error) {
        setError(error.message);
        setIsLoading(false);
        submitInProgress.current = false;
      } else {
        // SUCCESS: Redirect to dashboard after successful login
        window.location.href = '/dashboard';
        // Note: submitInProgress not reset because we're navigating away
      }
    } catch (err) {
      console.error('Unexpected error:', err);
      setError('An unexpected error occurred');
      setIsLoading(false);
      submitInProgress.current = false;
    }
  };

  const handleGoogleLogin = async () => {
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
      console.error('Google sign in error:', err);
      setError('Failed to initiate Google sign in');
      setIsLoading(false);
      submitInProgress.current = false;
    }
  };

  return (
    <div className="min-h-screen bg-[#f0f0f0] flex items-center justify-center px-4 py-8">
      <div className="bg-white rounded-3xl p-10 w-full max-w-[380px] shadow-[0_2px_24px_rgba(0,0,0,0.06)]">
        {/* Title */}
        <h1 className="text-[32px] font-extrabold text-[#0d0d2b] mb-2.5 tracking-tight">
          Welcome back
        </h1>
        <p className="text-sm text-[#6b6b80] leading-relaxed mb-8">
          Please enter your credentials to access your dashboard.
        </p>

        {/* Error Message */}
        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm">
            {error}
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Email Field */}
          <div>
            <label htmlFor="email" className="block text-[11px] font-semibold text-[#9999aa] tracking-[0.8px] uppercase mb-2">
              Email Address
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-[18px] py-3.5 border-none rounded-xl bg-[#f2f2f5] text-sm text-[#0d0d2b] placeholder-[#b0b0c0] outline-none focus:bg-[#eaeaf0] transition-colors"
              placeholder="name@firm.com"
              required
            />
          </div>

          {/* Password Field */}
          <div>
            <div className="flex justify-between items-center mb-2">
              <label htmlFor="password" className="text-[11px] font-semibold text-[#9999aa] tracking-[0.8px] uppercase">
                Password
              </label>
              <button type="button" className="text-[11px] font-bold text-[#1a1a6e] tracking-[0.3px]">
                FORGOT PASSWORD?
              </button>
            </div>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-[18px] py-3.5 border-none rounded-xl bg-[#f2f2f5] text-sm text-[#0d0d2b] placeholder-[#b0b0c0] outline-none focus:bg-[#eaeaf0] transition-colors"
              placeholder="••••••••"
              required
            />
          </div>

          {/* Remember Me Checkbox */}
          <div className="flex items-center gap-2.5 my-5">
            <input
              type="checkbox"
              id="remember"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
              className="w-[18px] h-[18px] rounded accent-[#1a1a6e] cursor-pointer flex-shrink-0"
            />
            <label htmlFor="remember" className="text-sm text-[#444455] cursor-pointer">
              Keep me signed in for 30 days
            </label>
          </div>

          {/* Login Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full px-4 py-4 bg-[#1a1a6e] text-white border-none rounded-[50px] text-base font-semibold cursor-pointer flex items-center justify-center gap-2 hover:bg-[#14146e] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {isLoading ? 'Logging in...' : 'Login'}
            {!isLoading && <span className="text-lg font-normal">→</span>}
          </button>
        </form>

        {/* Divider */}
        <div className="flex items-center gap-3 my-6">
          <div className="flex-1 h-px bg-[#e8e8ee]"></div>
          <span className="text-[11px] text-[#b0b0c0] tracking-[0.8px] font-medium">OR CONTINUE WITH</span>
          <div className="flex-1 h-px bg-[#e8e8ee]"></div>
        </div>

        {/* Google Login Button */}
        <button
          onClick={handleGoogleLogin}
          disabled={isLoading}
          className="w-full px-4 py-3.5 bg-white border-[1.5px] border-[#e8e8ee] rounded-[50px] text-[15px] font-semibold text-[#0d0d2b] cursor-pointer flex items-center justify-center gap-2.5 hover:bg-[#f8f8fb] hover:border-[#ccc] disabled:opacity-50 disabled:cursor-not-allowed transition-all"
        >
          <div className="w-5 h-5 bg-[#0d0d2b] rounded flex items-center justify-center flex-shrink-0">
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
              <rect x="1" y="1" width="4" height="4" fill="white"/>
              <rect x="7" y="1" width="4" height="4" fill="white" opacity="0.7"/>
              <rect x="1" y="7" width="4" height="4" fill="white" opacity="0.7"/>
              <rect x="7" y="7" width="4" height="4" fill="white" opacity="0.5"/>
            </svg>
          </div>
          Login with Google
        </button>

        {/* Sign Up Link */}
        <div className="text-center mt-8 pt-6 border-t-[1.5px] border-[#f0f0f5] text-sm text-[#6b6b80]">
          Don&apos;t have an account?{' '}
          <Link href="/register" className="text-[#1a1a6e] font-bold no-underline">
            Sign Up
          </Link>
        </div>
      </div>
    </div>
  );
}
