'use server'

import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

export async function refreshSession() {
  const supabase = await createClient()
  const { data: { session } } = await supabase.auth.getSession()
  
  if (session) {
    // Session exists, redirect to dashboard
    redirect('/dashboard')
  } else {
    // No session, stay on login page
    redirect('/')
  }
}
