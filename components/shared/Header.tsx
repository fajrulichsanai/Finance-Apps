// =====================================================
// FINANCE APP - Header Component
// =====================================================

'use client';

import { useRouter } from 'next/navigation';
import { ChevronLeft, User } from 'lucide-react';

interface HeaderProps {
  title: string;
  showAvatar?: boolean;
}

export default function Header({ title, showAvatar = true }: HeaderProps) {
  const router = useRouter();

  return (
    <header className="sticky top-0 z-10 bg-slate-50 px-5 py-4 flex items-center justify-between">
      <button
        onClick={() => router.back()}
        className="flex items-center gap-2 group"
        aria-label="Kembali"
      >
        <div className="w-9 h-9 flex items-center justify-center rounded-full hover:bg-slate-200 transition-colors">
          <ChevronLeft className="w-5 h-5 text-slate-900" strokeWidth={2.5} />
        </div>
        <h1 className="font-nunito text-lg font-extrabold text-slate-900">{title}</h1>
      </button>

      {showAvatar && (
        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-orange-300 to-orange-700 flex items-center justify-center border-2 border-white shadow-md">
          <User className="w-6 h-6 text-white" fill="white" />
        </div>
      )}
    </header>
  );
}
