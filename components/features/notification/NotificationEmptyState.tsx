import React from 'react';
import { Bell } from 'lucide-react';

export default function NotificationEmptyState() {
  return (
    <div className="flex flex-col items-center justify-center py-20 px-6">
      <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mb-4">
        <Bell size={32} className="text-gray-300" />
      </div>
      <h3 className="text-lg font-semibold text-gray-700 mb-2">
        No Notifications
      </h3>
      <p className="text-sm text-gray-400 text-center max-w-xs">
        You&apos;re all caught up! We&apos;ll notify you when there&apos;s something new.
      </p>
    </div>
  );
}
