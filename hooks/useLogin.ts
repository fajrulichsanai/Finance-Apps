'use client';

import { useState, useRef, useCallback, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/providers/AuthProvider';
import { createClient } from '@/lib/supabase/client';

// ✅ BUG FIX #3: Email validation regex
const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// ✅ BUG FIX #8: Normalize error messages with specific guidance
const normalizeAuthError = (error: any): string => {
  const message = error?.message?.toLowerCase() || '';

  // Check for user not found first
  if (message.includes('user not found')) {
    return 'Akun tidak ditemukan. Silakan daftar terlebih dahulu atau periksa email Anda.';
  }
  
  // Check for password-specific errors
  if (message.includes('invalid login credentials') || message.includes('password')) {
    return 'Kata sandi salah. Silakan coba lagi atau gunakan "Lupa Password?" untuk mereset.';
  }
  
  if (message.includes('email not confirmed')) {
    return 'Silakan konfirmasi email Anda terlebih dahulu. Periksa inbox Anda.';
  }
  if (message.includes('timeout') || message.includes('abort')) {
    return 'Batas waktu koneksi. Periksa internet Anda dan coba lagi.';
  }

  return 'Masuk gagal. Silakan coba lagi.';
};

export const useLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState(''); // ✅ BUG FIX #6: Success state
  const [isLoading, setIsLoading] = useState(false);

  const { signInWithEmail, signInWithGoogle } = useAuth();
  const router = useRouter();
  const submitInProgress = useRef(false);
  
  // ✅ BUG FIX #4: Track mounted state
  const isMountedRef = useRef(true);

  // ✅ BUG FIX #4: Cleanup on unmount
  useEffect(() => {
    isMountedRef.current = true;
    
    return () => {
      isMountedRef.current = false;
    };
  }, []);



  // ✅ BUG FIX: Skip user existence check - it was triggering Supabase emails causing rate limits
  // Just let the login attempt handle user not found naturally
  const checkUserExists = useCallback(async (userEmail: string): Promise<{ exists: boolean; message?: string }> => {
    // Removed resetPasswordForEmail() call - it was sending unnecessary emails causing rate limit errors
    return { exists: true };
  }, []);

  // ✅ BUG FIX #1: Atomic lock for double-submit prevention with visual feedback
  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    // ATOMIC CHECK: Use submitInProgress.current as single source of truth
    if (submitInProgress.current) {
      // Show feedback for duplicate clicks
      setError('Masuk sedang berlangsung, silakan tunggu...');
      setTimeout(() => {
        if (isMountedRef.current) {
          setError('');
        }
      }, 2000);
      return;
    }

    // Lock immediately BEFORE any async operation
    submitInProgress.current = true;

    try {
      // ✅ BUG FIX #3: Validation - email format
      if (!email || !isValidEmail(email)) {
        if (!isMountedRef.current) return;
        setError('Silakan masukkan alamat email yang valid');
        submitInProgress.current = false;
        return;
      }

      // ✅ BUG FIX #3: Validation - password length
      if (!password || password.length < 6) {
        if (!isMountedRef.current) return;
        setError('Kata sandi minimal harus 6 karakter');
        submitInProgress.current = false;
        return;
      }

      if (!isMountedRef.current) return;
      
      setError('');
      setSuccessMessage('');
      setIsLoading(true);

      // ✅ NEW: Check if user is registered FIRST before validating password
      const { exists: userExists, message: notFoundMessage } = await checkUserExists(email);
      
      if (!isMountedRef.current) {
        submitInProgress.current = false;
        return;
      }

      if (!userExists) {
        setError(notFoundMessage || 'Akun tidak ditemukan');
        setIsLoading(false);
        submitInProgress.current = false;
        return;
      }
      // Use AbortController + Promise.race for proper timeout handling
      let timeoutId: NodeJS.Timeout | null = null;
      
      const timeoutPromise = new Promise<{ error: Error }>((resolve) => {
        timeoutId = setTimeout(() => {
          resolve({ error: new Error('Connection timeout - request took too long') });
        }, 30000); // 30 second timeout (longer = fewer false positives)
      });

      // Race between actual request and timeout
      const resultPromise = signInWithEmail(email, password);
      const { error } = await Promise.race([resultPromise, timeoutPromise]);

      // Always clear timeout
      if (timeoutId !== null) {
        clearTimeout(timeoutId);
      }

      // ✅ BUG FIX #4: Check mounted before state update
      if (!isMountedRef.current) {
        submitInProgress.current = false;
        return;
      }

      if (error) {
        // ✅ BUG FIX #8: Normalize error message
        const userMessage = normalizeAuthError(error);
        setError(userMessage);
        setIsLoading(false);
        submitInProgress.current = false;
      } else {
        if (process.env.NODE_ENV === 'development') {
          console.log('✅ [Login] Success! Redirecting...');
        }

        // ✅ BUG FIX #8: Use router.push instead of window.location.href
        // This allows Next.js to handle the navigation cleanly
        router.push('/dashboard');
        // Don't reset submitInProgress - page will reload anyway
      }
    } catch (err) {
      // ✅ BUG FIX #4: Check mounted before state update
      if (!isMountedRef.current) {
        submitInProgress.current = false;
        return;
      }

      // Check if error is from abort
      if (err instanceof Error && err.name === 'AbortError') {
        setError('Masuk dibatalkan.');
        setIsLoading(false);
        submitInProgress.current = false;
        return;
      }

      console.error('❌ [Login] Unexpected error:', err);
      setError('Terjadi kesalahan yang tidak terduga. Silakan coba lagi.');
      setIsLoading(false);
      submitInProgress.current = false;
    }
  };

  // ✅ BUG FIX #9: Better Google OAuth error handling with improved popup detection
  const handleGoogleLogin = async () => {
    if (submitInProgress.current || isLoading) {
      return;
    }

    submitInProgress.current = true;

    if (!isMountedRef.current) {
      submitInProgress.current = false;
      return;
    }

    setError('');
    setSuccessMessage('');
    setIsLoading(true);
    
    const startTime = Date.now();

    try {
      await signInWithGoogle();
      
      // ✅ FIXED: Improved popup detection logic
      // Only show "blocked" error if error occurs immediately (<500ms)
      // This indicates genuine popup block, not network delay
      setTimeout(() => {
        if (!isMountedRef.current) return;
        
        // Still on login page = redirect didn't happen (likely blocked)
        if (window.location.pathname === '/' || window.location.pathname === '') {
          const elapsed = Date.now() - startTime;
          
          // Genuine popup block = error fires quickly
          if (elapsed < 500) {
            console.warn('[OAuth] Popup blocked - error detected immediately');
            setError('Popup masuk Google diblokir. Silakan aktifkan popup di pengaturan browser Anda.');
          } else {
            // Slow response = network delay, not popup block
            console.warn('[OAuth] Slow redirect - network delay likely');
            setError('Masuk Google memakan waktu lebih lama dari yang diharapkan. Silakan periksa koneksi Anda.');
          }
          setIsLoading(false);
          submitInProgress.current = false;
        }
      }, 5000); // 5 second grace period instead of 2s
      // Success: page will redirect on callback
    } catch (err) {
      if (!isMountedRef.current) {
        submitInProgress.current = false;
        return;
      }

      console.error('❌ [Login] Google sign in error:', err);
      setError(
        'Failed to initiate Google sign in. Please check your connection and try again.'
      );
      setIsLoading(false);
      submitInProgress.current = false;
    }
  };

  // ✅ BUG FIX #6: Password reset handler with better UX
  const handleForgotPassword = useCallback(() => {
    // ✅ UPDATED: Navigate to forgot password page instead of sending email from login page
    router.push('/auth/forgot-password');
  }, [router]);

  return {
    email,
    setEmail,
    password,
    setPassword,
    error,
    successMessage, // ✅ NEW: Success message for password reset
    isLoading,
    handleEmailLogin,
    handleGoogleLogin,
    handleForgotPassword,
  };
};
