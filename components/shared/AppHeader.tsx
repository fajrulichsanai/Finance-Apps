// =====================================================
// FINANCE APP - Global App Header Component
// =====================================================
// Time-based greeting with user name and notification
// =====================================================

'use client';

import { Bell, User } from 'lucide-react';
import { useAuth } from '@/providers/AuthProvider';
import { useRouter } from 'next/navigation';

export default function AppHeader() {
  const { user } = useAuth();
  const router = useRouter();

  // Get time-based greeting
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Selamat pagi';
    if (hour < 15) return 'Selamat siang';
    if (hour < 18) return 'Selamat sore';
    return 'Selamat malam';
  };

  // Get user display name
  const getUserName = () => {
    if (user?.user_metadata?.full_name) {
      return user.user_metadata.full_name;
    }
    if (user?.email) {
      return user.email.split('@')[0];
    }
    return 'User';
  };

  return (
    <header className="bg-gray-50 dark:bg-gray-900 px-5 pt-5 pb-2 sticky top-0 z-10 flex items-center justify-between transition-colors">
      <div className="flex items-center gap-2.5">
        <div className="w-10 h-10 rounded-full bg-blue-900 dark:bg-blue-600 flex items-center justify-center border-2 border-blue-900 dark:border-blue-600 transition-colors">
          <User className="w-6 h-6 text-white" />
        </div>
        <div className="flex flex-col">
          <span className="text-xs font-medium text-gray-500 dark:text-gray-400">
            {getGreeting()}
          </span>
          <span className="text-base font-extrabold text-gray-900 dark:text-gray-100">
            {getUserName()}
          </span>
        </div>
      </div>
      <button 
        onClick={() => router.push('/notification')}
        className="w-10 h-10 bg-white dark:bg-gray-800 rounded-xl flex items-center justify-center shadow-sm hover:bg-gray-100 dark:hover:bg-gray-700 active:scale-95 transition-all"
      >
        <Bell className="w-5 h-5 text-gray-900 dark:text-gray-100" />
      </button>
    </header>
  );
}
