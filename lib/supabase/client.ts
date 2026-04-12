import { createBrowserClient } from '@supabase/ssr'
import type { SupabaseClient } from '@supabase/supabase-js'

/**
 * SINGLETON PATTERN: Ensures only ONE Supabase client instance
 * exists throughout the app lifecycle.
 * 
 * WHY: Multiple instances = multiple auth listeners = request loops
 * BENEFIT: Hemat API calls, prevent memory leaks
 */
let client: SupabaseClient | null = null

export function createClient() {
  // Return existing instance if already created
  if (client) {
    return client
  }

  // Create new instance only once
  client = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )

  if (process.env.NODE_ENV === 'development') {
    console.log('🔧 [Supabase Client] Singleton instance created')
  }

  return client
}

/**
 * Get existing client instance (for debugging)
 */
export function getClientInstance() {
  return client
}
