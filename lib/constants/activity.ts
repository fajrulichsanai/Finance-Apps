// =====================================================
// FINANCE APP - Activity Page Constants
// =====================================================

import { ActivityTransaction, ActivitySection } from '@/types';

export const MOCK_ACTIVITY_DATA: ActivitySection[] = [
  {
    label: 'Today',
    date: 'Oct 24, 2023',
    transactions: [
      {
        id: '1',
        name: 'Blueberry Hill Bistro',
        category: 'Food & Dining',
        description: 'Breakfast with client',
        amount: -42.50,
        time: '10:24 AM',
        type: 'expense',
        icon: 'food'
      },
      {
        id: '2',
        name: 'Stripe Dividend',
        category: 'Income',
        description: 'Investment yield',
        amount: 1240.00,
        time: '09:15 AM',
        type: 'income',
        icon: 'money'
      }
    ]
  },
  {
    label: 'Yesterday',
    date: 'Oct 23, 2023',
    transactions: [
      {
        id: '3',
        name: 'Uber Technologies',
        category: 'Transport',
        description: 'Commute to office',
        amount: -18.20,
        time: '06:45 PM',
        type: 'expense',
        icon: 'transport'
      },
      {
        id: '4',
        name: 'Apple Store Soho',
        category: 'Electronics',
        description: 'MagSafe Charger',
        amount: -53.00,
        time: '02:30 PM',
        type: 'expense',
        icon: 'shopping'
      },
      {
        id: '5',
        name: 'ConEd Utility',
        category: 'Bills',
        description: 'Monthly Electricity',
        amount: -115.40,
        time: '11:00 AM',
        type: 'expense',
        icon: 'bills'
      }
    ]
  },
  {
    label: 'October 22',
    date: 'Sun',
    transactions: [
      {
        id: '6',
        name: 'Equinox Gym',
        category: 'Health',
        description: 'Membership',
        amount: -220.00,
        time: '08:00 AM',
        type: 'expense',
        icon: 'health'
      }
    ]
  }
];
