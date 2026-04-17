import React from 'react';
import { LogOut } from 'lucide-react';

interface ProfileFooterProps {
  onSignOut: () => void;
  isSigningOut: boolean;
}

const APP_VERSION = 'v 1.0.0';

export default function ProfileFooter({ onSignOut, isSigningOut }: ProfileFooterProps) {
  return (
    <div className="py-6 flex flex-col items-center gap-2.5">
      <span className="text-[11.5px] text-gray-400">
        {APP_VERSION}
      </span>
      
      <button
        onClick={onSignOut}
        disabled={isSigningOut}
        className="flex items-center gap-1.5 bg-transparent border-none text-red-600 text-[13.5px] font-bold hover:opacity-80 transition-opacity disabled:opacity-50"
      >
        <LogOut className="w-4 h-4" />
        {isSigningOut ? 'Signing Out...' : 'Sign Out'}
      </button>
    </div>
  );
}
