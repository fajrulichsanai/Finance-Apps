import { NotificationGroup } from '@/lib/services/notifications';
import NotificationCard from './NotificationCard';

interface NotificationSectionProps {
  group: NotificationGroup;
}

export default function NotificationSection({ group }: NotificationSectionProps) {
  return (
    <div>
      <div className="text-[11px] font-semibold text-gray-400 tracking-wider px-1.5 py-3">
        {group.label}
      </div>
      {group.notifications.map((notification) => (
        <NotificationCard key={notification.id} notification={notification} />
      ))}
    </div>
  );
}
