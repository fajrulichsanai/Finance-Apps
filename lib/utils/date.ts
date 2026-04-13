/**
 * Date formatting utilities for Indonesian locale
 */

export const formatTransactionDate = (dateStr: string): string => {
  const date = new Date(dateStr);
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);

  if (date.toDateString() === today.toDateString()) {
    return 'Hari ini';
  }
  
  if (date.toDateString() === yesterday.toDateString()) {
    return 'Kemarin';
  }
  
  return date.toLocaleDateString('id-ID', { day: 'numeric', month: 'short' });
};

export const formatMonthYear = (date: Date = new Date()): string => {
  return date.toLocaleDateString('en-US', { 
    month: 'short', 
    year: 'numeric' 
  }).toUpperCase();
};
