// =====================================================
// UTILITY: Clear Auth Locks
// =====================================================
// Use this in console if you still encounter lock errors
// Usage: clearAuthLocksNow()
// =====================================================

import { clearAuthLocks, resetClient } from '@/lib/supabase/client'

/**
 * Emergency function to clear all locks and reset client
 * Run this in browser console if lock errors persist:
 * 
 * window.clearAuthLocksNow()
 */
export function clearAuthLocksNow() {
  console.log('🚨 [Emergency] Clearing all auth locks...')
  
  // 1. Clear locks from storage
  clearAuthLocks()
  
  // 2. Reset Supabase client
  resetClient()
  
  // 3. Reload page to reinitialize
  setTimeout(() => {
    console.log('🔄 [Emergency] Reloading page...')
    window.location.reload()
  }, 500)
}

// Expose to window for easy console access
if (typeof window !== 'undefined') {
  (window as any).clearAuthLocksNow = clearAuthLocksNow
  console.log('💡 [Utility] Run window.clearAuthLocksNow() if you encounter lock errors')
}
