import { Notification } from '@/lib/services/notifications';
import { NOTIFICATION_STYLES } from '@/lib/constants/notification';
import NotificationIcon from './NotificationIcon';

interface NotificationCardProps {
  notification: Notification;
}

function formatTimestamp(createdAt: string): string {
  const date = new Date(createdAt);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  return date.toLocaleDateString('id-ID', { day: 'numeric', month: 'short' });
}

export default function NotificationCard({ notification }: NotificationCardProps) {
  const { type, title, message, created_at, is_read, action_label } = notification;
  const timestamp = formatTimestamp(created_at);

  // Insight card has special styling
  if (type === 'insight') {
    return (
      <div
        className="rounded-2xl px-4 py-5 mb-2.5 relative overflow-hidden"
        style={{ background: NOTIFICATION_STYLES.insight.gradient }}
      >
        <div className="absolute -right-2.5 -bottom-5 w-[100px] h-[100px] rounded-full bg-white/5" />
        <div className="absolute right-7 -bottom-7 w-[70px] h-[70px] rounded-full bg-white/[0.04]" />
        <p className="text-[15px] font-bold text-white mb-1 relative z-10">{title}</p>
        <p className="text-xs text-white/70 mb-3.5 leading-relaxed relative z-10">{message}</p>
        {action_label && (
          <button className="bg-[#7fe87a] border-none rounded-[20px] px-5 py-2 text-xs font-bold text-[#1a4a18] cursor-pointer tracking-wide relative z-10">
            {action_label}
          </button>
        )}
      </div>
    );
  }

  // Standard notification card
  const styles = NOTIFICATION_STYLES[type];

  return (
    <div className="bg-white rounded-2xl p-4 mb-2.5 flex gap-3 items-start">
      <div className={`w-[42px] h-[42px] rounded-xl ${styles.bgColor} flex items-center justify-center flex-shrink-0`}>
        <NotificationIcon type={type} />
      </div>
      <div className="flex-1">
        <div className="flex justify-between items-start">
          <span className="text-sm font-bold text-[#2d2d4e] leading-tight max-w-[200px]">
            {title}
          </span>
          <div className="flex items-center gap-1 whitespace-nowrap ml-2 mt-0.5">
            <span className="text-[11px] text-gray-300 leading-tight">
              {timestamp}
            </span>
            {!is_read && (
              <div className="w-2 h-2 rounded-full bg-[#3a3a9c] ml-0.5 -mt-2.5" />
            )}
          </div>
        </div>
        <p className="text-xs text-gray-500 mt-1.5 leading-relaxed">{message}</p>
      </div>
    </div>
  );
}
