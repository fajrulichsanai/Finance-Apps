import React from 'react';

export interface ErrorPopupProps {
  title?: string;
  message: string;
  onRetry?: () => void;
  onCancel?: () => void;
  isOpen: boolean;
}

export const ErrorPopup: React.FC<ErrorPopupProps> = ({
  title = "Action Failed",
  message,
  onRetry,
  onCancel,
  isOpen
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={onCancel} />
      
      {/* Modal */}
      <div className="relative bg-white rounded-3xl p-8 w-full max-w-[320px] shadow-2xl animate-in zoom-in-95 duration-300">
        {/* Error Icon */}
        <div className="w-[68px] h-[68px] rounded-full bg-red-50 flex items-center justify-center mx-auto mb-5">
          <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none">
            <path 
              d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" 
              fill="#e53935" 
              opacity="0.15" 
              stroke="#e53935" 
              strokeWidth="1.5"
            />
            <line x1="12" y1="9" x2="12" y2="13" stroke="#e53935" strokeWidth="2" strokeLinecap="round"/>
            <circle cx="12" cy="16.5" r="0.8" fill="#e53935"/>
          </svg>
        </div>

        {/* Title */}
        <h3 className="font-nunito text-xl font-black text-gray-900 text-center mb-3 leading-tight">
          {title}
        </h3>

        {/* Message */}
        <p className="text-sm font-medium text-slate-600 text-center mb-6 leading-relaxed">
          {message}
        </p>

        {/* Actions */}
        <div className="space-y-2.5">
          {onRetry && (
            <button
              onClick={onRetry}
              className="w-full flex items-center justify-center gap-2 bg-[#1a237e] text-white rounded-full py-3.5 px-4 font-bold text-[15px] shadow-lg shadow-indigo-900/30 hover:opacity-90 active:scale-[0.98] transition-all"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <polyline points="1 4 1 10 7 10"/>
                <path d="M3.51 15a9 9 0 1 0 .49-4.33"/>
              </svg>
              Retry
            </button>
          )}
          
          {onCancel && (
            <button
              onClick={onCancel}
              className="w-full text-slate-600 font-bold text-sm py-2.5 hover:text-slate-900 transition-colors"
            >
              Cancel
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
