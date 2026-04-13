import { HEALTH_SCORE } from '@/lib/constants/dashboard';

/**
 * Financial calculation utilities
 */

export const calculateHealthScore = (income: number, expense: number): number => {
  if (income === 0) return 0;
  const ratio = ((income - expense) / income) * 100;
  return Math.min(Math.max(Math.round(ratio), 0), 100);
};

export const getHealthStanding = (score: number): string => {
  if (score >= HEALTH_SCORE.EXCELLENT) return 'Excellent standing';
  if (score >= HEALTH_SCORE.GOOD) return 'Good standing';
  return 'Needs improvement';
};

export const getBudgetColor = (percentage: number): string => {
  if (percentage > 90) return '#e74c3c';
  if (percentage > 70) return '#f0c040';
  return '#1a9e6e';
};
