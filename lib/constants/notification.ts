/**
 * Notification constants and type definitions
 */

export type NotificationType = 'warning' | 'alert' | 'info' | 'insight';

export interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  timestamp: string;
  isRead: boolean;
  actionLabel?: string;
}

export interface NotificationGroup {
  label: string;
  notifications: Notification[];
}

// Notification type configurations
export const NOTIFICATION_STYLES = {
  warning: {
    bgColor: 'bg-[#fef3cd]',
    iconColor: '#f0ad4e',
  },
  alert: {
    bgColor: 'bg-[#fde8e8]',
    iconColor: '#e74c3c',
  },
  info: {
    bgColor: 'bg-[#ede8f5]',
    iconColor: '#9b7fd4',
  },
  insight: {
    gradient: 'linear-gradient(135deg, #2e2a6e 0%, #3d3a8c 60%, #4a4a9e 100%)',
  },
} as const;

// Mock notifications data (replace with API call in production)
export const MOCK_NOTIFICATIONS: NotificationGroup[] = [
  {
    label: 'TODAY',
    notifications: [
      {
        id: '1',
        type: 'warning',
        title: 'Budget Alert: You reached 90% of your Food budget.',
        message: 'Consider adjusting your spending for the next 3 days to stay within your monthly goal.',
        timestamp: '2H AGO',
        isRead: false,
      },
      {
        id: '2',
        type: 'alert',
        title: 'Over Budget: Monthly Transport limit exceeded.',
        message: 'Your transport spending is $45.00 over the allocated $200.00 limit for this period.',
        timestamp: '5H AGO',
        isRead: false,
      },
    ],
  },
  {
    label: 'YESTERDAY',
    notifications: [
      {
        id: '3',
        type: 'info',
        title: 'Bill Reminder: Rent is due in 2 days.',
        message: 'A recurring payment of $1,850.00 is scheduled for July 1st. Ensure sufficient funds.',
        timestamp: '1D AGO',
        isRead: true,
      },
      {
        id: '4',
        type: 'insight',
        title: 'Architect Insight',
        message: 'Your savings rate increased by 12% compared to last month. Keep up the momentum!',
        timestamp: '1D AGO',
        isRead: true,
        actionLabel: 'VIEW ANALYSIS',
      },
    ],
  },
];
