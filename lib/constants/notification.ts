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
    label: 'HARI INI',
    notifications: [
      {
        id: '1',
        type: 'warning',
        title: 'Peringatan Anggaran: Anda telah mencapai 90% dari anggaran Makanan Anda.',
        message: 'Pertimbangkan untuk menyesuaikan pengeluaran Anda untuk 3 hari ke depan agar tetap dalam target bulanan Anda.',
        timestamp: '2J LALU',
        isRead: false,
      },
      {
        id: '2',
        type: 'alert',
        title: 'Melebihi Anggaran: Batas Transportasi bulanan terlampaui.',
        message: 'Pengeluaran transportasi Anda $45.00 lebih dari batas yang dialokasikan $200.00 untuk periode ini.',
        timestamp: '5J LALU',
        isRead: false,
      },
    ],
  },
  {
    label: 'KEMARIN',
    notifications: [
      {
        id: '3',
        type: 'info',
        title: 'Pengingat Tagihan: Sewa jatuh tempo dalam 2 hari.',
        message: 'Pembayaran berulang sebesar $1.850,00 dijadwalkan untuk 1 Juli. Pastikan dana yang cukup.',
        timestamp: '1H LALU',
        isRead: true,
      },
      {
        id: '4',
        type: 'insight',
        title: 'Wawasan Arsitek',
        message: 'Tingkat tabungan Anda meningkat 12% dibandingkan bulan lalu. Terus pertahankan momentum!',
        timestamp: '1H LALU',
        isRead: true,
        actionLabel: 'LIHAT ANALISIS',
      },
    ],
  },
];
