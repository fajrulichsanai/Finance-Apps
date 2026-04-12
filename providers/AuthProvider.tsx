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

    // OPTIMIZATION 1: Get initial session ONCE on mount
    let isMounted = true
    
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!isMounted) return // Component unmounted, ignore
      
      setSession(session)
      setUser(session?.user ?? null)
      setLoading(false)
      
      if (process.env.NODE_ENV === 'development') {
        console.log('✅ [Auth] Session loaded:', session ? 'authenticated' : 'guest')
      }
    })

    // OPTIMIZATION 2: Listen for auth changes with proper cleanup
    // This handles token refresh automatically (no extra API calls needed)
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      if (!isMounted) return // Component unmounted, ignore
      
      if (process.env.NODE_ENV === 'development') {
        console.log('🔔 [Auth] State changed:', event)
      }
      
      setSession(session)
      setUser(session?.user ?? null)
      setLoading(false)
    })

    authListenerRef.current = subscription

    // CRITICAL: Cleanup to prevent memory leaks & duplicate listeners
    return () => {
      isMounted = false
      subscription.unsubscribe()
      if (process.env.NODE_ENV === 'development') {
        console.log('🧹 [Auth] Listener unsubscribed')
      }
    }
  }, []) // Empty dependency = runs ONCE on mount (React Strict Mode safe)

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
    window.location.href = '/'
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
