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
  const sessionExpiryTimer = useRef<NodeJS.Timeout | null>(null)

  // Session expiry: 5 minutes (in milliseconds)
  const SESSION_EXPIRY_MS = 5 * 60 * 1000

  // Function to start session expiry timer
  const startSessionExpiryTimer = useCallback(() => {
    // Clear existing timer
    if (sessionExpiryTimer.current) {
      clearTimeout(sessionExpiryTimer.current)
    }

    if (process.env.NODE_ENV === 'development') {
      console.log('⏱️ [Auth] Starting 5-minute session expiry timer')
    }

    // Set new timer for 5 minutes
    sessionExpiryTimer.current = setTimeout(async () => {
      if (process.env.NODE_ENV === 'development') {
        console.log('⏰ [Auth] Session expired after 5 minutes, logging out...')
      }
      
      // Force logout
      await supabase.auth.signOut()
      window.location.href = '/'
    }, SESSION_EXPIRY_MS)
  }, [SESSION_EXPIRY_MS])

  // Function to clear session expiry timer
  const clearSessionExpiryTimer = useCallback(() => {
    if (sessionExpiryTimer.current) {
      clearTimeout(sessionExpiryTimer.current)
      sessionExpiryTimer.current = null
      
      if (process.env.NODE_ENV === 'development') {
        console.log('🛑 [Auth] Session expiry timer cleared')
      }
    }
  }, [])

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

    // OPTIMIZATION 1: Get initial session ONCE on mount with deduplication
    let isMounted = true
    
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
          const isLockError = error?.message?.includes('lock') || 
                             error?.message?.includes('stolen') ||
                             error?.code === 'LOCK_TIMEOUT'
          
          if (isLockError && retries > 0) {
            if (process.env.NODE_ENV === 'development') {
              console.log(`⏳ [Auth] Lock error, retrying in ${delay}ms... (${retries} attempts left)`)
            }
            // Wait with exponential backoff
            await new Promise(resolve => setTimeout(resolve, delay))
            return fetchSessionWithRetry(retries - 1, delay * 2)
          }
          
          // If still fails, try to clear the lock and retry once
          if (isLockError && retries === 0) {
            if (process.env.NODE_ENV === 'development') {
              console.log('🔓 [Auth] Attempting to clear storage lock...')
            }
            // Wait a bit longer before final retry
            await new Promise(resolve => setTimeout(resolve, 500))
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
    
    sessionFetchPromise.current.then(({ data: { session } }) => {
      if (!isMounted) return // Component unmounted, ignore
      
      setSession(session)
      setUser(session?.user ?? null)
      setLoading(false)
      
      if (process.env.NODE_ENV === 'development') {
        console.log('✅ [Auth] Session loaded:', session ? 'authenticated' : 'guest')
      }

      // Start session expiry timer if authenticated
      if (session) {
        startSessionExpiryTimer()
      }
    }).catch((error) => {
      console.error('❌ [Auth] Failed to load session:', error)
      setLoading(false)
    })

    // OPTIMIZATION 2: Listen for auth changes with proper cleanup
    // This handles token refresh automatically (no extra API calls needed)
    // Only subscribe if not already subscribed
    if (!authListenerRef.current) {
      // Debounce auth state changes to prevent rapid updates
      let debounceTimer: NodeJS.Timeout | null = null
      
      const {
        data: { subscription },
      } = supabase.auth.onAuthStateChange((event, session) => {
        if (!isMounted) return // Component unmounted, ignore
        
        // Clear existing debounce timer
        if (debounceTimer) {
          clearTimeout(debounceTimer)
        }
        
        // Debounce updates (except for sign out which should be immediate)
        if (event === 'SIGNED_OUT') {
          if (process.env.NODE_ENV === 'development') {
            console.log('🔔 [Auth] State changed: SIGNED_OUT (immediate)')
          }
          setSession(null)
          setUser(null)
          setLoading(false)
          clearSessionExpiryTimer()
        } else {
          debounceTimer = setTimeout(() => {
            if (!isMounted) return
            
            if (process.env.NODE_ENV === 'development') {
              console.log('🔔 [Auth] State changed:', event)
            }
            
            setSession(session)
            setUser(session?.user ?? null)
            setLoading(false)

            // Manage session expiry timer
            if (session && (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED')) {
              startSessionExpiryTimer()
            } else if (!session) {
              clearSessionExpiryTimer()
            }
          }, 100) // 100ms debounce
        }
      })

      authListenerRef.current = subscription
    }

    // CRITICAL: Cleanup to prevent memory leaks & duplicate listeners
    return () => {
      isMounted = false
      if (authListenerRef.current) {
        authListenerRef.current.unsubscribe()
        authListenerRef.current = null
        if (process.env.NODE_ENV === 'development') {
          console.log('🧹 [Auth] Listener unsubscribed')
        }
      }
      // Clear session expiry timer on cleanup
      clearSessionExpiryTimer()
    }
  }, [startSessionExpiryTimer, clearSessionExpiryTimer]) // Add dependencies

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
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: name,
        },
      },
    })
    if (error) {
      console.error('❌ [Auth] Sign up error:', error.message)
    }
    return { error }
  }, [])

  const signInWithGoogle = useCallback(async () => {
    if (process.env.NODE_ENV === 'development') {
      console.log('🔑 [Auth] Starting Google OAuth...')
    }
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    })
  }, [])

  const signOut = useCallback(async () => {
    if (process.env.NODE_ENV === 'development') {
      console.log('👋 [Auth] Signing out...')
    }
    await supabase.auth.signOut()
    // Use window.location for full page reload to clear all state
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
