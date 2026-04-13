import { User } from '@supabase/supabase-js';

/**
 * User profile utilities
 */

export const getDisplayName = (user: User | null): string => {
  if (user?.user_metadata?.full_name) {
    return user.user_metadata.full_name;
  }
  if (user?.email) {
    return user.email.split('@')[0];
  }
  return 'User';
};
