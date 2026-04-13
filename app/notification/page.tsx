'use client';

import { useState } from 'react';
import { RotateCcw } from 'lucide-react';
import NotificationHeader from '@/components/features/notification/NotificationHeader';
import NotificationSection from '@/components/features/notification/NotificationSection';
import { MOCK_NOTIFICATIONS } from '@/lib/constants/notification';

export default function NotificationPage() {
  const [notifications, setNotifications] = useState(MOCK_NOTIFICATIONS);

  const handleMarkAllRead = () => {
    const updatedNotifications = notifications.map((group) => ({
      ...group,
      notifications: group.notifications.map((notif) => ({
        ...notif,
        isRead: true,
      })),
    }));
    setNotifications(updatedNotifications);
  };

  return (
    <div className="min-h-screen bg-[#f4f4f0] flex flex-col pb-20">
      <NotificationHeader onMarkAllRead={handleMarkAllRead} />

      <div className="flex-1 overflow-y-auto px-3.5 pb-3.5">
        {notifications.map((group) => (
          <NotificationSection key={group.label} group={group} />
        ))}

        <div className="text-center py-2.5">
          <button className="text-xs text-gray-400 tracking-wide hover:text-gray-600 transition-colors inline-flex items-center gap-1">
            VIEW ARCHIVE <RotateCcw size={12} />
          </button>
        </div>
      </div>
    </div>
  );
}