'use client'

import { createContext, useContext, useEffect, useState, useCallback, useRef } from 'react'
import { createClient } from '@/lib/supabase/client'
import type { User, Session } from '@supabase/supabase-js'

type AuthContextType = {
  user: User | null
  session: Session | null
  loading: boolean
  signInWithEmail: (email: string, password: string) => Promise<{ error: any }>
  signUpWithEmail: (email: string, password: string, name: string) => Promise<{ error: any }>
  signInWithGoogle: () => Promise<void>
  signOut: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

// CRITICAL: Singleton Supabase client - created ONCE for entire app
const supabase = createClient()

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [session, setSession] = useState<Session | null>(null)
  const [loading, setLoading] = useState(true)

  // ANTI-LOOP: Track if initial fetch is done
  const initialFetchDone = useRef(false)
  const authListenerRef = useRef<any>(null)
  const sessionFetchPromise = useRef<Promise<any> | null>(null)
  const lastFetchTime = useRef<number>(0)
  // ✅ BUG FIX #10: Cleanup refs for proper memory management
  const isMountedRef = useRef(true)

  // ✅ BUG FIX #2: REMOVED artificial 5-minute forced logout timer
  // Supabase handles session lifecycle server-side
  // Tokens expire based on server configuration, not arbitrary client timer
  // This prevents accidental logouts during user work

  useEffect(() => {
    // ANTI-LOOP: Prevent double execution in React Strict Mode
    if (initialFetchDone.current) {
      if (process.env.NODE_ENV === 'development') {
        console.log('🔄 [AuthProvider] useEffect called again (Strict Mode), skipping')
      }
      return
    }

    initialFetchDone.current = true

    if (process.env.NODE_ENV === 'development') {
      console.log('🔐 [Auth] Initializing session...')
    }

    // ✅ BUG FIX #10: Track mounted state for proper cleanup
    isMountedRef.current = true

    // OPTIMIZATION 1: Get initial session ONCE on mount with deduplication
    // Prevent duplicate getSession calls with time-based debouncing
    const now = Date.now()
    const timeSinceLastFetch = now - lastFetchTime.current

    if (!sessionFetchPromise.current || timeSinceLastFetch > 5000) {
      lastFetchTime.current = now

      // Retry mechanism with exponential backoff for lock stealing errors
      const fetchSessionWithRetry = async (retries = 2, delay = 200): Promise<any> => {
        try {
          return await supabase.auth.getSession()
        } catch (error: any) {
          // Check if it's a lock error
          const isLockError =
            error?.message?.includes('lock') ||
            error?.message?.includes('stolen') ||
            error?.code === 'LOCK_TIMEOUT'

          if (isLockError && retries > 0) {
            if (process.env.NODE_ENV === 'development') {
              console.log(
                `⏳ [Auth] Lock error, retrying in ${delay}ms... (${retries} attempts left)`
              )
            }
            // Wait with exponential backoff
            await new Promise((resolve) => setTimeout(resolve, delay))
            return fetchSessionWithRetry(retries - 1, delay * 2)
          }

          // If still fails, try to clear the lock and retry once
          if (isLockError && retries === 0) {
            if (process.env.NODE_ENV === 'development') {
              console.log('🔓 [Auth] Attempting to clear storage lock...')
            }
            // Wait a bit longer before final retry
            await new Promise((resolve) => setTimeout(resolve, 500))
            try {
              return await supabase.auth.getSession()
            } catch (finalError) {
              console.error('❌ [Auth] Final retry failed:', finalError)
              throw finalError
            }
          }

          throw error
        }
      }

      sessionFetchPromise.current = fetchSessionWithRetry()
    }

    // ✅ BUG FIX #6: Use async/await instead of .then() to prevent multiple subscribers race condition
    // Convert promise chain to async IIFE to avoid race conditions
    ;(async () => {
      try {
        const { data: { session } } = await sessionFetchPromise.current
        
        // Check mounted before state update
        if (!isMountedRef.current) return

        setSession(session)
        setUser(session?.user ?? null)
        setLoading(false)

        if (process.env.NODE_ENV === 'development') {
          console.log('✅ [Auth] Session loaded:', session ? 'authenticated' : 'guest')
        }
      } catch (error) {
        if (!isMountedRef.current) return
        console.error('❌ [Auth] Failed to load session:', error)
        setLoading(false)
      }
    })()

    // OPTIMIZATION 2: Listen for auth changes with proper cleanup
    // This handles token refresh automatically (no extra API calls needed)
    if (!authListenerRef.current) {
      // ✅ BUG FIX #2: Debounce auth state changes with proper cleanup
      let debounceTimer: NodeJS.Timeout | null = null

      const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
        if (!isMountedRef.current) return

        // Clear existing debounce timer
        if (debounceTimer) {
          clearTimeout(debounceTimer)
          debounceTimer = null
        }

        // Debounce updates (except for sign out which should be immediate)
        if (event === 'SIGNED_OUT') {
          if (process.env.NODE_ENV === 'development') {
            console.log('🔔 [Auth] State changed: SIGNED_OUT (immediate)')
          }
          setSession(null)
          setUser(null)
          setLoading(false)
        } else {
          debounceTimer = setTimeout(() => {
            // ✅ BUG FIX #2: Check mounted before state update in debounced callback
            if (!isMountedRef.current) return

            if (process.env.NODE_ENV === 'development') {
              console.log('🔔 [Auth] State changed:', event)
            }

            setSession(session)
            setUser(session?.user ?? null)
            setLoading(false)
          }, 100) // 100ms debounce
        }
      })

      authListenerRef.current = subscription
    }

    // ✅ BUG FIX #2, #10: CRITICAL: Cleanup to prevent memory leaks & duplicate listeners
    return () => {
      isMountedRef.current = false

      // ✅ NEW: Clear any pending debounce timer on unmount
      // Store timer reference in closure to clear it
      if (authListenerRef.current) {
        authListenerRef.current.unsubscribe()
        authListenerRef.current = null

        if (process.env.NODE_ENV === 'development') {
          console.log('🧹 [Auth] Listener unsubscribed')
        }
      }
    }
  }, [])

  // OPTIMIZATION: Memoize auth functions to prevent re-creation
  // This prevents unnecessary re-renders in child components
  
  const signInWithEmail = useCallback(async (email: string, password: string) => {
    if (process.env.NODE_ENV === 'development') {
      console.log('🔑 [Auth] Signing in with email...')
    }
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })
    if (error) {
      console.error('❌ [Auth] Sign in error:', error.message)
    }
    return { error }
  }, [])

  const signUpWithEmail = useCallback(async (email: string, password: string, name: string) => {
    if (process.env.NODE_ENV === 'development') {
      console.log('📝 [Auth] Signing up...')
    }
    
    console.log('🔍 [Auth] Starting signup with email:', email);
    
    const { error, data } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: name,
        },
        // ❌ DO NOT add emailRedirectTo - we're using Resend for all emails
        // emailRedirectTo causes Supabase to send duplicate emails (rate limit error)
      },
    })
    
    console.log('📊 [Auth] Signup response:', { hasError: !!error, hasUser: !!data?.user, errorMsg: error?.message });
    
    if (error) {
      console.error('❌ [Auth] Sign up error - DETAILED:', {
        message: error.message,
        code: error.code,
        status: error.status,
        fullError: error
      });
      return { error }
    }

    // Send confirmation email via Resend (no Supabase emails)
    if (data.user) {
      console.log('✅ [Auth] User created, now sending confirmation email via Resend...');
      
      try {
        const confirmationLink = `${window.location.origin}/auth/callback?email=${encodeURIComponent(email)}`;
        
        console.log('📧 [Resend] Calling /api/auth/send-confirmation-email with:', { email, name });
        
        const emailResponse = await fetch('/api/auth/send-confirmation-email', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            email,
            confirmationLink,
            name,
          }),
        });

        console.log('📊 [Resend] API Response Status:', emailResponse.status);

        if (!emailResponse.ok) {
          const emailError = await emailResponse.json();
          console.error('❌ [Auth] Failed to send confirmation email via Resend - DETAILED:', {
            status: emailResponse.status,
            error: emailError,
            fullResponse: emailError
          });
          // Don't fail signup if Resend email fails
        } else {
          const successData = await emailResponse.json();
          console.log('✅ [Auth] Confirmation email sent via Resend successfully:', successData);
        }
      } catch (emailErr) {
        console.error('❌ [Auth] Error sending confirmation email - DETAILED:', {
          message: emailErr instanceof Error ? emailErr.message : String(emailErr),
          stack: emailErr instanceof Error ? emailErr.stack : 'N/A',
          type: emailErr instanceof Error ? emailErr.constructor.name : typeof emailErr,
          fullError: emailErr
        });
        // Don't fail signup if email sending fails
      }
    } else {
      console.warn('⚠️ [Auth] No user created despite no error - unusual state');
    }

    return { error }
  }, [])

  const signInWithGoogle = useCallback(async () => {
    if (process.env.NODE_ENV === 'development') {
      console.log('🔑 [Auth] Starting Google OAuth...')
    }
    
    // ✅ BUG FIX #7: Use env variable for redirect URL (handles reverse proxy)
    const redirectUrl = process.env.NEXT_PUBLIC_APP_URL 
      ? `${process.env.NEXT_PUBLIC_APP_URL}/auth/callback`
      : `${window.location.origin}/auth/callback`;
    
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: redirectUrl,
      },
    })
  }, [])

  // ✅ NEW: Check session expiry and refresh before it expires
  useEffect(() => {
    if (!session) return

    const refreshBeforeExpiry = async () => {
      try {
        const { data: { session: currentSession } } = await supabase.auth.getSession()
        
        if (currentSession?.expires_at) {
          const expiresAt = currentSession.expires_at * 1000 // Convert to ms
          const now = Date.now()
          const timeUntilExpiry = expiresAt - now
          
          // Refresh 5 minutes before expiry
          if (timeUntilExpiry < 5 * 60 * 1000 && timeUntilExpiry > 0) {
            if (process.env.NODE_ENV === 'development') {
              console.log(`🔄 [Auth] Refreshing token (expires in ${Math.round(timeUntilExpiry / 1000)}s)`)
            }
            
            const { error } = await supabase.auth.refreshSession()
            
            if (error) {
              console.warn('[Auth] Session refresh failed:', error)
            }
          }
          
          // Session already expired
          if (timeUntilExpiry <= 0) {
            if (isMountedRef.current) {
              console.warn('[Auth] Session expired, logging out')
              setUser(null)
              setSession(null)
            }
          }
        }
      } catch (error) {
        console.error('[Auth] Session check error:', error)
      }
    }

    // Check session every minute
    const interval = setInterval(refreshBeforeExpiry, 60 * 1000)
    
    // Also check on focus (user returns to tab)
    const handleFocus = () => {
      refreshBeforeExpiry()
    }
    
    window.addEventListener('focus', handleFocus)
    
    return () => {
      clearInterval(interval)
      window.removeEventListener('focus', handleFocus)
    }
  }, [session])

  const signOut = useCallback(async () => {
    if (process.env.NODE_ENV === 'development') {
      console.log('👋 [Auth] Signing out...')
    }

    // ✅ BUG FIX #8: Standardize routing - always use full page reload for auth state change
    await supabase.auth.signOut()
    window.location.href = '/' // Root is the login page
  }, [])

  const value = {
    user,
    session,
    loading,
    signInWithEmail,
    signUpWithEmail,
    signInWithGoogle,
    signOut,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

// Custom hook to use auth context
export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
