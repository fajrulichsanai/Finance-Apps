'use client';

import { RotateCcw } from 'lucide-react';
import NotificationHeader from '@/components/features/notification/NotificationHeader';
import NotificationSection from '@/components/features/notification/NotificationSection';
import NotificationEmptyState from '@/components/features/notification/NotificationEmptyState';
import { useGroupedNotifications } from '@/lib/hooks/useNotifications';
import { notificationService } from '@/lib/services/notifications';

export default function NotificationPage() {
  const { groups, loading, error, refresh } = useGroupedNotifications();

  const handleMarkAllRead = async () => {
    try {
      await notificationService.markAllAsRead();
      await refresh();
    } catch (err) {
      console.error('Failed to mark all as read:', err);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#f4f4f0] flex flex-col pb-20">
        <NotificationHeader onMarkAllRead={handleMarkAllRead} />
        <div className="flex-1 px-3.5 py-4 space-y-3">
          {[1, 2, 3].map(i => (
            <div key={i} className="bg-white rounded-xl p-4 animate-pulse">
              <div className="flex gap-3">
                <div className="w-10 h-10 bg-gray-200 rounded-full flex-shrink-0"></div>
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                  <div className="h-3 bg-gray-200 rounded w-full"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#f4f4f0] flex flex-col pb-20">
        <NotificationHeader onMarkAllRead={handleMarkAllRead} />
        <div className="flex-1 flex items-center justify-center px-6">
          <div className="text-center">
            <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-700 mb-2">Gagal Memuat Notifikasi</h3>
            <p className="text-sm text-gray-400 mb-6">{error.message || 'Terjadi kesalahan'}</p>
            <button
              onClick={refresh}
              className="px-6 py-2.5 bg-indigo-900 text-white rounded-lg font-semibold text-sm hover:bg-indigo-800 active:scale-95 transition-all"
            >
              Coba Lagi
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f4f4f0] flex flex-col pb-20">
      <NotificationHeader onMarkAllRead={handleMarkAllRead} />

      <div className="flex-1 overflow-y-auto px-3.5 pb-3.5">
        {groups.length === 0 ? (
          <NotificationEmptyState />
        ) : (
          <>
            {groups.map((group) => (
              <NotificationSection key={group.label} group={group} />
            ))}

            <div className="text-center py-2.5">
              <button className="text-xs text-gray-400 tracking-wide hover:text-gray-600 transition-colors inline-flex items-center gap-1">
                VIEW ARCHIVE <RotateCcw size={12} />
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}