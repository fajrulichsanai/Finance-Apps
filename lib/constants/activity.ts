// =====================================================
// FINANCE APP - Activity Page Constants
// =====================================================

import { ActivityTransaction, ActivitySection } from '@/types';

export const MOCK_ACTIVITY_DATA: ActivitySection[] = [
  {
    label: 'Hari Ini',
    date: '24 Okt, 2023',
    transactions: [
      {
        id: '1',
        name: 'Blueberry Hill Bistro',
        category: 'Makanan & Makan',
        description: 'Sarapan dengan klien',
        amount: -42.50,
        time: '10:24 AM',
        type: 'expense',
        icon: 'food'
      },
      {
        id: '2',
        name: 'Stripe Dividend',
        category: 'Pendapatan',
        description: 'Hasil investasi',
        amount: 1240.00,
        time: '09:15 AM',
        type: 'income',
        icon: 'money'
      }
    ]
  },
  {
    label: 'Kemarin',
    date: '23 Okt, 2023',
    transactions: [
      {
        id: '3',
        name: 'Uber Technologies',
        category: 'Transportasi',
        description: 'Perjalanan ke kantor',
        amount: -18.20,
        time: '06:45 PM',
        type: 'expense',
        icon: 'transport'
      },
      {
        id: '4',
        name: 'Apple Store Soho',
        category: 'Elektronik',
        description: 'Charger MagSafe',
        amount: -53.00,
        time: '02:30 PM',
        type: 'expense',
        icon: 'shopping'
      },
      {
        id: '5',
        name: 'ConEd Utility',
        category: 'Tagihan',
        description: 'Listrik Bulanan',
        amount: -115.40,
        time: '11:00 AM',
        type: 'expense',
        icon: 'bills'
      }
    ]
  },
  {
    label: '22 Oktober',
    date: 'Min',
    transactions: [
      {
        id: '6',
        name: 'Equinox Gym',
        category: 'Kesehatan',
        description: 'Keanggotaan',
        amount: -220.00,
        time: '08:00 AM',
        type: 'expense',
        icon: 'health'
      }
    ]
  }
];
