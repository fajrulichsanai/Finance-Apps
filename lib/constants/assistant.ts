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
  'Mengapa pengeluaran saya tinggi?',
  'Bagaimana cara saya menghemat lebih banyak?',
  'Tetapkan anggaran',
] as const;

export const INITIAL_MESSAGES: ChatMessage[] = [
  {
    id: '1',
    type: 'ai',
    content: "Halo! Saya Stitch, Arsitek Keuangan pribadi Anda. Saya telah menganalisis akun Anda. Kekayaan bersih Anda tumbuh sebesar <span class='text-emerald-500 font-bold'>4.2%</span> bulan ini. Bagaimana cara saya membantu Anda mengoptimalkan kekayaan Anda hari ini?",
    timestamp: new Date(),
  },
  {
    id: '2',
    type: 'user',
    content: 'Mengapa pengeluaran saya lebih tinggi dari bulan lalu?',
    timestamp: new Date(),
  },
  {
    id: '3',
    type: 'ai',
    content: 'Pengeluaran Anda meningkat terutama karena pembelian "Gaya Hidup Tanpa Kategori". Berikut adalah rincian driver utama:',
    timestamp: new Date(),
  },
];

export const MOCK_SPENDING_ANOMALY: SpendingAnomaly = {
  category: 'Makan &\nHiburan',
  amount: 450.00,
  vsAverage: 'vs rata-rata',
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
  'Apakah Anda ingin saya menetapkan anggaran makan yang ketat untuk bulan depan atau mencari langganan yang dapat Anda batalkan untuk mengimbangi ini?';
