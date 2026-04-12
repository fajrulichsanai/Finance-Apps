// =====================================================
// FINANCE APP - Type Definitions
// =====================================================

export type TransactionType = 'expense' | 'income';

export interface TransactionFormData {
  type: TransactionType;
  amount: number;
  category_id: string | null;
  description: string;
  note: string;
  transaction_date: string;
  tags?: string[];
}

export interface CategoryIcon {
  name: string;
  icon: React.ReactElement;
}
