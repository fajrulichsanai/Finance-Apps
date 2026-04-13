// =====================================================
// FINANCE APP - Insight Page Constants
// =====================================================

import { CategoryData, Recommendation, ChartBarData } from '@/types';

export const MOCK_CATEGORIES: CategoryData[] = [
  { name: 'Housing', amount: 1700, color: '#1a1a6e', percentage: 40 },
  { name: 'Food & Dining', amount: 1082, color: '#f0c040', percentage: 25.5 },
  { name: 'Entertainment', amount: 850, color: '#e07040', percentage: 20 },
  { name: 'Miscellaneous', amount: 638, color: '#d0d0e0', percentage: 14.5 },
];

export const MOCK_RECOMMENDATIONS: Recommendation[] = [
  {
    id: 1,
    text: 'Cancel unused Disney+ subscription to save',
    highlight: '$12.00/mo',
  },
  {
    id: 2,
    text: "Your utility costs rose by 15%. Switching to public transit 2 days/week could reduce expenses by",
    highlight: '$55.00/mo',
  },
  {
    id: 3,
    text: 'Refer a friend to unlock a',
    highlight: '$5.00 loyalty discount',
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
  label: 'EXCELLENT',
  improvement: 3,
  strokeDasharray: 339.3,
  strokeDashoffset: 61,
};

export const MONTH_LABELS = ['MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT'];
