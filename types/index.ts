// =====================================================
// FINANCE APP - Type Definitions
// =====================================================

export type TransactionType = 'expense' | 'income';

export type TransactionIconType = 'food' | 'money' | 'transport' | 'shopping' | 'bills' | 'health';

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

export interface ActivityTransaction {
  id: string;
  name: string;
  category: string;
  description: string;
  amount: number;
  time: string;
  type: TransactionType;
  icon: TransactionIconType;
}

export interface ActivitySection {
  label: string;
  date: string;
  transactions: ActivityTransaction[];
}

// Insight Page Types
export interface CategoryData {
  name: string;
  amount: number;
  color: string;
  percentage: number;
}

export interface Recommendation {
  id: number;
  text: string;
  highlight: string;
}

export interface ChartBarData {
  height: number;
  active?: boolean;
}

// =====================================================
// PUSH NOTIFICATIONS
// =====================================================

export interface PushSubscription {
  id: string;
  user_id: string;
  endpoint: string;
  p256dh: string;
  auth: string;
  user_agent: string | null;
  device_type: 'ios' | 'android' | 'desktop' | null;
  created_at: string;
  last_used_at: string;
}

export interface PushNotificationPayload {
  title: string;
  body: string;
  icon?: string;
  badge?: string;
  tag?: string;
  data?: {
    url?: string;
    [key: string]: any;
  };
  actions?: Array<{
    action: string;
    title: string;
    icon?: string;
  }>;
}

export interface SendPushRequest {
  userId: string;
  payload: PushNotificationPayload;
}

export interface SendPushResponse {
  success: boolean;
  message: string;
  stats: {
    total: number;
    successful: number;
    failed: number;
  };
  details: Array<{
    success: boolean;
    endpoint: string;
    error?: string;
    statusCode?: number;
  }>;
}
