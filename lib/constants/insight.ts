// =====================================================
// FINANCE APP - Insight Page Constants
// =====================================================

import { CategoryData, Recommendation, ChartBarData } from '@/types';

export const MOCK_CATEGORIES: CategoryData[] = [
  { name: 'Perumahan', amount: 1700, color: '#1a1a6e', percentage: 40 },
  { name: 'Makanan & Makan', amount: 1082, color: '#f0c040', percentage: 25.5 },
  { name: 'Hiburan', amount: 850, color: '#e07040', percentage: 20 },
  { name: 'Lain-lain', amount: 638, color: '#d0d0e0', percentage: 14.5 },
];

export const MOCK_RECOMMENDATIONS: Recommendation[] = [
  {
    id: 1,
    text: 'Batalkan langganan Disney+ yang tidak digunakan untuk hemat',
    highlight: '$12.00/bln',
  },
  {
    id: 2,
    text: "Biaya utilitas Anda naik 15%. Beralih ke transportasi umum 2 hari/minggu dapat mengurangi pengeluaran sebesar",
    highlight: '$55.00/bln',
  },
  {
    id: 3,
    text: 'Ajak teman untuk membuka',
    highlight: 'diskon loyalitas $5.00',
  },
];

export const MOCK_BAR_DATA: ChartBarData[] = [
  { height: 45 },
  { height: 38 },
  { height: 52 },
  { height: 42 },
  { height: 60 },
  { height: 55, active: true },
];

export const HEALTH_SCORE = {
  score: 82,
  label: 'LUAR BIASA',
  improvement: 3,
  strokeDasharray: 339.3,
  strokeDashoffset: 61,
};

export const MONTH_LABELS = ['MEI', 'JUN', 'JUL', 'AGS', 'SEP', 'OKT'];
