// =====================================================
// AI ASSISTANT - Constants & Mock Data
// =====================================================

export interface ChatMessage {
  id: string;
  type: 'ai' | 'user';
  content: string;
  timestamp: Date;
}

export interface SpendingAnomaly {
  category: string;
  amount: number;
  vsAverage: string;
  chartData: { height: number; level: 'low' | 'mid' | 'high' }[];
}

export const QUICK_REPLY_SUGGESTIONS = [
  'Why is my spending high?',
  'How can I save more?',
  'Set a budget',
] as const;

export const INITIAL_MESSAGES: ChatMessage[] = [
  {
    id: '1',
    type: 'ai',
    content: "Hello! I'm Stitch, your personal Financial Architect. I've analyzed your accounts. Your net worth grew by <span class='text-emerald-500 font-bold'>4.2%</span> this month. How can I help you optimize your wealth today?",
    timestamp: new Date(),
  },
  {
    id: '2',
    type: 'user',
    content: 'Why is my spending higher than last month?',
    timestamp: new Date(),
  },
  {
    id: '3',
    type: 'ai',
    content: 'Your spending increased primarily due to "Uncategorized Lifestyle" purchases. Here is a breakdown of the key drivers:',
    timestamp: new Date(),
  },
];

export const MOCK_SPENDING_ANOMALY: SpendingAnomaly = {
  category: 'Dining &\nEntertainment',
  amount: 450.00,
  vsAverage: 'vs average',
  chartData: [
    { height: 30, level: 'low' },
    { height: 38, level: 'low' },
    { height: 45, level: 'mid' },
    { height: 35, level: 'low' },
    { height: 55, level: 'mid' },
    { height: 40, level: 'low' },
    { height: 100, level: 'high' },
  ],
};

export const AI_FOLLOW_UP_MESSAGE = 
  'Would you like me to set a strict dining budget for next month or find subscriptions you can cancel to offset this?';
