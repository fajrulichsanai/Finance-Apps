# Notifications System - Quick Reference Guide

## Database Schema

### Table: `notifications`

```sql
CREATE TABLE notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  type TEXT NOT NULL CHECK (type IN ('warning', 'alert', 'info', 'insight')),
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  action_label TEXT,
  is_read BOOLEAN DEFAULT FALSE,
  archived_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

### Notification Types

| Type | Use Case | Example |
|------|----------|---------|
| `warning` | Budget warnings (80-90% spent) | "You've reached 90% of your Food budget" |
| `alert` | Critical alerts (>100% budget) | "Budget exceeded for Entertainment" |
| `info` | General information | "Monthly budget reset" |
| `insight` | AI-driven insights | "You spent 20% less on dining this month" |

---

## Service API

### Import

```typescript
import { notificationService } from '@/lib/services/notifications';
```

### Create Notification

```typescript
const notification = await notificationService.createNotification({
  type: 'warning',
  title: 'Budget Alert: You reached 90% of your Food budget.',
  message: 'Consider adjusting your spending for the next 3 days.',
  action_label: 'VIEW BUDGET' // Optional
});
```

### Get Notifications

```typescript
// Get all notifications
const all = await notificationService.getNotifications();

// Get unread only
const unread = await notificationService.getNotifications({ is_read: false });

// Get by type
const warnings = await notificationService.getNotifications({ type: 'warning' });

// Get with pagination
const paginated = await notificationService.getNotifications({ limit: 20, offset: 0 });
```

### Get Grouped Notifications

```typescript
const groups = await notificationService.getGroupedNotifications();
// Returns:
// [
//   { label: 'TODAY', notifications: [...] },
//   { label: 'YESTERDAY', notifications: [...] },
//   { label: 'THIS WEEK', notifications: [...] },
//   { label: 'OLDER', notifications: [...] }
// ]
```

### Mark as Read

```typescript
// Mark single notification
await notificationService.markAsRead(notificationId);

// Mark all as read
await notificationService.markAllAsRead();
```

### Archive & Delete

```typescript
// Soft delete (archive)
await notificationService.archiveNotification(notificationId);

// Hard delete (permanent)
await notificationService.deleteNotification(notificationId);

// Get archived notifications
const archived = await notificationService.getArchivedNotifications(50);
```

### Unread Count

```typescript
const count = await notificationService.getUnreadCount();
// Use for badge display
```

---

## React Hooks

### Import

```typescript
import { 
  useGroupedNotifications,
  useUnreadCount,
  useManageNotifications 
} from '@/lib/hooks/useNotifications';
```

### useGroupedNotifications

```typescript
function NotificationPage() {
  const { groups, loading, error, refresh } = useGroupedNotifications();

  return (
    <div>
      {loading && <p>Loading...</p>}
      {groups.map(group => (
        <div key={group.label}>
          <h2>{group.label}</h2>
          {group.notifications.map(notif => (
            <div key={notif.id}>{notif.title}</div>
          ))}
        </div>
      ))}
    </div>
  );
}
```

### useUnreadCount

```typescript
function NotificationBadge() {
  const { count, loading } = useUnreadCount();

  if (loading || count === 0) return null;

  return <span className="badge">{count}</span>;
}
```

### useManageNotifications

```typescript
function NotificationActions({ notificationId }) {
  const { markAsRead, archiveNotification, loading } = useManageNotifications();

  return (
    <div>
      <button onClick={() => markAsRead(notificationId)} disabled={loading}>
        Mark as Read
      </button>
      <button onClick={() => archiveNotification(notificationId)} disabled={loading}>
        Archive
      </button>
    </div>
  );
}
```

---

## Frontend Integration Examples

### Notification Page (Full Integration)

```typescript
'use client';

import { useGroupedNotifications, useManageNotifications } from '@/lib/hooks/useNotifications';
import NotificationCard from '@/components/features/notification/NotificationCard';

export default function NotificationPage() {
  const { groups, loading, refresh } = useGroupedNotifications();
  const { markAllAsRead } = useManageNotifications();

  const handleMarkAllRead = async () => {
    await markAllAsRead();
    refresh();
  };

  if (loading) {
    return <div>Loading notifications...</div>;
  }

  return (
    <div>
      <header>
        <h1>Notifications</h1>
        <button onClick={handleMarkAllRead}>Mark All as Read</button>
      </header>

      {groups.length === 0 ? (
        <div className="empty-state">
          <p>No notifications</p>
        </div>
      ) : (
        groups.map(group => (
          <section key={group.label}>
            <h2>{group.label}</h2>
            {group.notifications.map(notif => (
              <NotificationCard key={notif.id} notification={notif} />
            ))}
          </section>
        ))
      )}
    </div>
  );
}
```

### Header Badge (Unread Count)

```typescript
import { useUnreadCount } from '@/lib/hooks/useNotifications';
import { Bell } from 'lucide-react';

export function NotificationBell() {
  const { count } = useUnreadCount();

  return (
    <button className="relative">
      <Bell size={24} />
      {count > 0 && (
        <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
          {count > 9 ? '9+' : count}
        </span>
      )}
    </button>
  );
}
```

---

## Notification Card Component Example

```typescript
import { Notification } from '@/lib/services/notifications';
import { useManageNotifications } from '@/lib/hooks/useNotifications';
import { AlertCircle, Info, Lightbulb, AlertTriangle } from 'lucide-react';

interface Props {
  notification: Notification;
}

const ICONS = {
  warning: AlertTriangle,
  alert: AlertCircle,
  info: Info,
  insight: Lightbulb
};

const STYLES = {
  warning: 'bg-yellow-50 border-yellow-200',
  alert: 'bg-red-50 border-red-200',
  info: 'bg-blue-50 border-blue-200',
  insight: 'bg-purple-50 border-purple-200'
};

export default function NotificationCard({ notification }: Props) {
  const { markAsRead, archiveNotification } = useManageNotifications();
  const Icon = ICONS[notification.type];

  return (
    <div className={`p-4 border rounded-lg ${STYLES[notification.type]}`}>
      <div className="flex items-start gap-3">
        <Icon className="w-5 h-5 mt-0.5" />
        <div className="flex-1">
          <h3 className={notification.is_read ? 'font-normal' : 'font-semibold'}>
            {notification.title}
          </h3>
          <p className="text-sm text-gray-600 mt-1">{notification.message}</p>
          
          {notification.action_label && (
            <button className="text-sm text-blue-600 mt-2">
              {notification.action_label}
            </button>
          )}
        </div>
      </div>

      <div className="mt-3 flex gap-2 text-xs text-gray-500">
        {!notification.is_read && (
          <button onClick={() => markAsRead(notification.id)}>
            Mark as Read
          </button>
        )}
        <button onClick={() => archiveNotification(notification.id)}>
          Archive
        </button>
      </div>
    </div>
  );
}
```

---

## Budget Alert Trigger Example

This is how you can automatically create budget alerts when transactions are added:

```typescript
// In transaction creation flow
async function createTransaction(data: CreateTransactionInput) {
  // Create transaction
  const transaction = await transactionService.createTransaction(data);

  // Check budget status
  if (data.type === 'expense' && data.category_id) {
    const category = await categoryService.getCategoryById(data.category_id);
    const spent = Number(category.total_spent) + Number(data.amount);
    const budget = Number(category.budget);
    const percentage = (spent / budget) * 100;

    // Create warning at 90%
    if (percentage >= 90 && percentage < 100) {
      await notificationService.createNotification({
        type: 'warning',
        title: `Budget Alert: You reached ${percentage.toFixed(0)}% of your ${category.name} budget.`,
        message: 'Consider adjusting your spending for the rest of the month.',
        action_label: 'VIEW BUDGET'
      });
    }

    // Create alert at 100%
    if (percentage >= 100) {
      await notificationService.createNotification({
        type: 'alert',
        title: `Budget exceeded for ${category.name}`,
        message: `You've spent ${formatCurrency(spent)} of ${formatCurrency(budget)} budget.`,
        action_label: 'ADJUST BUDGET'
      });
    }
  }

  return transaction;
}
```

---

## Best Practices

### Cost Efficiency
- ✅ Use pagination for large notification lists
- ✅ Archive old notifications instead of deleting
- ✅ Batch operations (mark all as read) instead of individual calls
- ✅ Use indexes efficiently (queries on `is_read`, `archived_at`)

### User Experience
- Show unread count badge on notification icon
- Auto-mark as read when user views notification
- Group by time for better organization
- Provide archive functionality (don't force delete)
- Show empty state when no notifications

### Security
- ✅ RLS enabled on all queries
- ✅ User can only access their own notifications
- ✅ SECURITY DEFINER functions for helper operations
- ✅ No direct SQL exposure to frontend

---

## Migration File

Location: `supabase/migrations/20260413_add_notifications.sql`

Apply migration:
```bash
supabase db reset
# or
supabase migration up
```

---

## Testing

```typescript
// Test notification creation
const notif = await notificationService.createNotification({
  type: 'info',
  title: 'Test Notification',
  message: 'This is a test message'
});
console.log('Created:', notif);

// Test fetching
const all = await notificationService.getNotifications();
console.log('All notifications:', all);

// Test marking as read
await notificationService.markAsRead(notif.id);

// Test archiving
await notificationService.archiveNotification(notif.id);
```

---

## Summary

The notifications system is **production-ready** and includes:
- ✅ Complete database schema with RLS
- ✅ Full CRUD service layer
- ✅ React hooks for easy integration
- ✅ Optimized for Supabase Free Tier
- ✅ Type-safe TypeScript interfaces
- ✅ Helper functions for common operations
- ✅ Archive support (soft deletes)
- ✅ Time-based grouping

**Ready for frontend integration in Milestone 3.**
