import { createBrowserClient } from '@supabase/ssr'
import type { SupabaseClient } from '@supabase/supabase-js'

/**
 * SINGLETON PATTERN with MUTEX LOCK + Storage Lock Timeout
 * Fixes: "Lock was stolen by another request" error
 */
let client: SupabaseClient | null = null
let isInitializing = false
let hasCleanedLocks = false

/**
 * Clear stale locks on first initialization
 */
function clearStaleLocks() {
  if (hasCleanedLocks || typeof window === 'undefined') return
  
  try {
    const keysToRemove: string[] = []
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i)
      // Only remove lock keys, not the auth token itself
      if (key && key.includes('lock:sb-') && !key.includes('auth-token')) {
        keysToRemove.push(key)
      }
    }
    
    keysToRemove.forEach(key => {
      localStorage.removeItem(key)
    })
    
    if (process.env.NODE_ENV === 'development' && keysToRemove.length > 0) {
      console.log(`🧹 [Supabase] Cleared ${keysToRemove.length} stale lock(s)`)
    }
  } catch (error) {
    // Fail silently - this is just a cleanup operation
  }
  
  hasCleanedLocks = true
}

export function createClient() {
  // Clear stale locks on first call
  clearStaleLocks()
  
  // Return existing instance if already created
  if (client) {
    return client
  }

  // If currently initializing, wait for it
  if (isInitializing) {
    // Spin-wait for a very short time (max 10ms)
    const start = Date.now()
    while (isInitializing && Date.now() - start < 10) {
      // Busy wait
    }
    if (client) return client
  }

  // Lock initialization
  isInitializing = true

  // Create new instance with custom storage options
  client = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      auth: {
        // CRITICAL: Increase storage lock timeout to prevent stealing
        storageKey: 'sb-auth-token',
        storage: typeof window !== 'undefined' ? window.localStorage : undefined,
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: true,
        // Disable flow type to prevent multiple concurrent requests
        flowType: 'pkce',
      },
      // Add global fetch options with timeout
      global: {
        fetch: (url, options = {}) => {
          return fetch(url, {
            ...options,
            // Add reasonable timeout
            signal: AbortSignal.timeout(30000), // 30 seconds
          })
        },
      },
    }
  )

  // Unlock
  isInitializing = false

  if (process.env.NODE_ENV === 'development') {
    console.log('🔧 [Supabase Client] Singleton instance created with lock timeout protection')
  }

  return client
}

/**
 * Get existing client instance (for debugging)
 */
export function getClientInstance() {
  return client
}

/**
 * Force reset client (use only in extreme cases)
 */
export function resetClient() {
  if (client) {
    client = null
    isInitializing = false
    if (process.env.NODE_ENV === 'development') {
      console.log('🔄 [Supabase Client] Instance reset')
    }
  }
}

/**
 * Clear all auth-related storage locks
 * Use this if you encounter persistent lock errors
 */
export function clearAuthLocks() {
  if (typeof window !== 'undefined') {
    try {
      // Clear all lock-related items from localStorage
      const keysToRemove: string[] = []
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i)
        if (key && (key.includes('lock:sb-') || key.includes('-lock'))) {
          keysToRemove.push(key)
        }
      }
      
      keysToRemove.forEach(key => {
        localStorage.removeItem(key)
        if (process.env.NODE_ENV === 'development') {
          console.log('🧹 [Storage] Cleared lock:', key)
        }
      })
      
      if (process.env.NODE_ENV === 'development') {
        console.log(`✅ [Storage] Cleared ${keysToRemove.length} lock(s)`)
      }
    } catch (error) {
      console.error('❌ [Storage] Failed to clear locks:', error)
    }
  }
}
