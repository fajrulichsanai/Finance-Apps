import React from 'react';

export interface WarningPopupProps {
  title?: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  onConfirm: () => void;
  onCancel: () => void;
  isOpen: boolean;
}

export const WarningPopup: React.FC<WarningPopupProps> = ({
  title = "Approaching Budget Limit",
  message,
  confirmLabel = "Save Anyway",
  cancelLabel = "Cancel",
  onConfirm,
  onCancel,
  isOpen
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-slate-900/55 backdrop-blur-sm" onClick={onCancel} />
      
      {/* Modal */}
      <div className="relative bg-white rounded-3xl p-8 w-full max-w-[320px] shadow-2xl animate-in zoom-in-95 duration-300">
        {/* Warning Icon */}
        <div className="w-[68px] h-[68px] rounded-full bg-orange-50 flex items-center justify-center mx-auto mb-5">
          <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none">
            <path 
              d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" 
              fill="#f59e0b" 
              opacity="0.18" 
              stroke="#f59e0b" 
              strokeWidth="1.5"
            />
            <line x1="12" y1="9" x2="12" y2="13" stroke="#f59e0b" strokeWidth="2" strokeLinecap="round"/>
            <circle cx="12" cy="16.5" r="0.8" fill="#f59e0b"/>
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
          <button
            onClick={onConfirm}
            className="w-full bg-[#1a237e] text-white rounded-full py-3.5 px-4 font-bold text-[15px] shadow-lg shadow-indigo-900/30 hover:opacity-90 active:scale-[0.98] transition-all"
          >
            {confirmLabel}
          </button>
          
          <button
            onClick={onCancel}
            className="w-full bg-slate-100 text-gray-900 rounded-full py-3.5 px-4 font-bold text-[15px] hover:bg-slate-200 active:scale-[0.98] transition-all"
          >
            {cancelLabel}
          </button>
        </div>
      </div>
    </div>
  );
};
