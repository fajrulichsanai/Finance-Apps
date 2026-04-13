// =====================================================
// Reusable Card Wrapper for Insight Sections
// =====================================================

interface InsightCardProps {
  children: React.ReactNode;
  className?: string;
  variant?: 'white' | 'primary' | 'success' | 'danger' | 'gray';
}

const variantStyles = {
  white: 'bg-white',
  primary: 'bg-[#1a1a6e]',
  success: 'bg-[#e8f8f0]',
  danger: 'bg-[#fff0f0]',
  gray: 'bg-[#f2f2f5]',
};

export default function InsightCard({ children, className = '', variant = 'white' }: InsightCardProps) {
  return (
    <div className={`${variantStyles[variant]} rounded-[20px] p-[18px] mb-3.5 ${className}`}>
      {children}
    </div>
  );
}
