import { NotificationType } from '@/lib/constants/notification';

interface NotificationIconProps {
  type: NotificationType;
}

export default function NotificationIcon({ type }: NotificationIconProps) {
  if (type === 'warning') {
    return (
      <svg width="20" height="20" viewBox="0 0 24 24">
        <path d="M12 2L2 22h20L12 2z" fill="#f0ad4e" />
        <text x="11.5" y="18" textAnchor="middle" fontSize="11" fontWeight="700" fill="white">
          !
        </text>
      </svg>
    );
  }

  if (type === 'alert') {
    return (
      <svg width="20" height="20" viewBox="0 0 24 24">
        <circle cx="12" cy="12" r="10" fill="#e74c3c" />
        <text x="12" y="17" textAnchor="middle" fontSize="14" fontWeight="700" fill="white">
          !
        </text>
      </svg>
    );
  }

  if (type === 'info') {
    return (
      <svg width="20" height="20" viewBox="0 0 24 24">
        <rect x="3" y="4" width="18" height="16" rx="2" fill="#9b7fd4" />
        <rect x="7" y="8" width="10" height="2" rx="1" fill="white" opacity="0.8" />
        <rect x="7" y="12" width="7" height="2" rx="1" fill="white" opacity="0.6" />
        <circle cx="18" cy="18" r="4" fill="#6c5bbf" />
        <path d="M16.5 18h3M18 16.5v3" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
      </svg>
    );
  }

  return null;
}
