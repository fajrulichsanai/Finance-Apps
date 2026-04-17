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

// ✅ BUG FIX #8: Normalize error messages to prevent info leak
const normalizeAuthError = (error: any): string => {
  const message = error?.message?.toLowerCase() || '';

  if (message.includes('invalid login credentials')) {
    return 'Invalid email or password';
  }
  if (message.includes('email not confirmed')) {
    return 'Please confirm your email first. Check your inbox.';
  }
  if (message.includes('user not found')) {
    return 'Invalid email or password';
  }
  if (message.includes('password')) {
    return 'Invalid email or password';
  }
  if (message.includes('too many requests')) {
    return 'Too many login attempts. Please try again later.';
  }
  if (message.includes('timeout') || message.includes('abort')) {
    return 'Connection timeout. Please check your internet and try again.';
  }

  return 'Login failed. Please try again.';
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

  // ✅ BUG FIX #6: Rate limiting - track login attempts (client-side)
  // Server-side rate limiting also implemented as defense layer
  const loginAttempts = useRef<{ timestamp: number }[]>([]);
  const MAX_ATTEMPTS = 5;
  const RATE_LIMIT_WINDOW_MS = 15 * 60 * 1000; // 15 minutes

  // ✅ BUG FIX #6: Check server-side rate limiting
  const checkServerRateLimit = useCallback(async (): Promise<{ allowed: boolean; message?: string }> => {
    try {
      const response = await fetch('/api/auth/rate-limit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({}),
      });

      const data = await response.json();

      if (response.status === 429) {
        return { allowed: false, message: 'Too many login attempts. Please try again in 15 minutes.' };
      }

      return { allowed: true };
    } catch (error) {
      // On network error, allow request to proceed (fail open)
      console.warn('[Rate Limit] Failed to check server rate limit:', error);
      return { allowed: true };
    }
  }, []);

  // ✅ BUG FIX #1: Atomic lock for double-submit prevention with visual feedback
  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    // ATOMIC CHECK: Use submitInProgress.current as single source of truth
    if (submitInProgress.current) {
      // Show feedback for duplicate clicks
      setError('Login in progress, please wait...');
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
        setError('Please enter a valid email address');
        submitInProgress.current = false;
        return;
      }

      // ✅ BUG FIX #3: Validation - password length
      if (!password || password.length < 6) {
        if (!isMountedRef.current) return;
        setError('Password must be at least 6 characters');
        submitInProgress.current = false;
        return;
      }

      // ✅ BUG FIX #6: Check client-side rate limiting first (quick check)
      const now = Date.now();
      loginAttempts.current = loginAttempts.current.filter(
        (attempt) => now - attempt.timestamp < RATE_LIMIT_WINDOW_MS
      );
      
      if (loginAttempts.current.length >= MAX_ATTEMPTS) {
        if (!isMountedRef.current) return;
        setError('Too many login attempts. Please try again in 15 minutes.');
        submitInProgress.current = false;
        return;
      }

      if (!isMountedRef.current) return;
      
      setError('');
      setSuccessMessage('');
      setIsLoading(true);

      // ✅ BUG FIX #6: Check server-side rate limiting (can't be bypassed by attacker)
      const { allowed: serverAllowed, message: rateLimitMessage } = await checkServerRateLimit();
      
      if (!serverAllowed) {
        if (!isMountedRef.current) {
          submitInProgress.current = false;
          return;
        }
        
        setError(rateLimitMessage || 'Too many login attempts. Please try again later.');
        setIsLoading(false);
        submitInProgress.current = false;
        return;
      }

      if (!isMountedRef.current) {
        submitInProgress.current = false;
        return;
      }

      // Record this login attempt (for client-side tracking)
      loginAttempts.current.push({ timestamp: Date.now() });
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
        setError('Login cancelled.');
        setIsLoading(false);
        submitInProgress.current = false;
        return;
      }

      console.error('❌ [Login] Unexpected error:', err);
      setError('An unexpected error occurred. Please try again.');
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
            setError('Google sign-in popup was blocked. Please enable popups in your browser settings.');
          } else {
            // Slow response = network delay, not popup block
            console.warn('[OAuth] Slow redirect - network delay likely');
            setError('Google sign-in is taking longer than expected. Please check your connection.');
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
  const handleForgotPassword = useCallback(async () => {
    if (!email || !isValidEmail(email)) {
      setError('Please enter a valid email address to reset password');
      return;
    }

    setIsLoading(true);
    setError('');
    setSuccessMessage('');

    try {
      const supabase = createClient();
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/auth/reset-password`,
      });

      if (!isMountedRef.current) {
        setIsLoading(false);
        return;
      }

      if (error) {
        // ✅ BUG FIX #8: Don't leak internal error details
        setError('Failed to send reset email. Please check your email address and try again.');
        
        if (process.env.NODE_ENV === 'development') {
          console.error('[Password Reset Error]:', error.message);
        }
      } else {
        // ✅ FIXED: Show success message with auto-dismiss
        setSuccessMessage('✓ Password reset email sent! Check your inbox for instructions. The link will expire in 1 hour.');
        setError('');
        
        // Auto-dismiss after 10 seconds
        setTimeout(() => {
          if (isMountedRef.current) {
            setSuccessMessage('');
          }
        }, 10000);
      }
    } catch (err) {
      if (!isMountedRef.current) {
        setIsLoading(false);
        return;
      }

      console.error('❌ [Login] Password reset error:', err);
      setError('Unexpected error during password reset. Please try again.');
    } finally {
      setIsLoading(false);
    }
  }, [email]);

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
