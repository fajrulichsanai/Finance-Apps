'use client';

import { ArrowLeft, User } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface NotificationHeaderProps {
  onMarkAllRead?: () => void;
}

export default function NotificationHeader({ onMarkAllRead }: NotificationHeaderProps) {
  const router = useRouter();

  return (
    <div className="px-5 py-4 bg-[#f4f4f0] flex items-center gap-2.5">
      <button
        onClick={() => router.back()}
        className="text-lg cursor-pointer text-[#3a3a5c] hover:text-[#2a2a4c] transition-colors"
      >
        <ArrowLeft size={20} />
      </button>
      <span className="text-[17px] font-semibold text-[#3a3a5c] flex-1">Notifications</span>
      <button
        onClick={onMarkAllRead}
        className="text-[10px] font-semibold text-gray-500 tracking-wide leading-tight text-right hover:text-gray-700 transition-colors"
      >
        MARK ALL AS
        <br />
        READ
      </button>
      <div className="w-9 h-9 rounded-full bg-[#3a3a5c] flex items-center justify-center">
        <User size={18} className="text-white" />
      </div>
    </div>
  );
}
