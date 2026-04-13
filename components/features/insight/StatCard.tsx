// =====================================================
// Reusable Stat Card Component
// =====================================================

import InsightCard from './InsightCard';

interface StatCardProps {
  variant: 'success' | 'danger' | 'gray';
  label: string;
  value: string;
  description?: string;
  progress?: number;
  icon?: React.ReactNode;
  changeIndicator?: string;
}

export default function StatCard({ variant, label, value, description, progress, icon, changeIndicator }: StatCardProps) {
  const labelColors = {
    success: 'text-[#1a9e6e]',
    danger: 'text-[#e74c3c]',
    gray: 'text-gray-400',
  };

  const valueColors = {
    success: 'text-[#1a9e6e]',
    danger: 'text-[#0d0d2b]',
    gray: 'text-[#1a9e6e]',
  };

  return (
    <InsightCard variant={variant}>
      <div className={`text-[9px] font-bold ${labelColors[variant]} tracking-wide uppercase mb-1 flex items-center gap-1`}>
        {icon}
        {variant === 'success' && '● '}
        {variant === 'danger' && '● '}
        {label}
      </div>
      <div className={`text-[28px] font-black ${valueColors[variant]} tracking-tight mb-1`}>{value}</div>

      {progress !== undefined && (
        <>
          <div className="h-1.5 bg-[#f0f0f5] rounded-sm my-2 mb-1 overflow-hidden">
            <div className="h-full rounded-sm bg-[#e74c3c]" style={{ width: `${progress}%` }} />
          </div>
          <div className="text-[11px] text-gray-400">{progress}% of monthly limit used</div>
        </>
      )}

      {description && (
        <div className={`text-xs ${variant === 'success' ? 'text-[#1a9e6e] font-semibold flex items-center gap-1' : 'text-gray-500'} leading-relaxed`}>
          {changeIndicator && (
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
              <polyline
                points="23,6 13.5,15.5 8.5,10.5 1,18"
                stroke="#1a9e6e"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          )}
          {description}
        </div>
      )}
    </InsightCard>
  );
}
