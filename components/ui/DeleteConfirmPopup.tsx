import React from 'react';

export interface DeleteConfirmPopupProps {
  title?: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  onConfirm: () => void;
  onCancel: () => void;
  isOpen: boolean;
}

export const DeleteConfirmPopup: React.FC<DeleteConfirmPopupProps> = ({
  title = "Hapus Transaksi?",
  message,
  confirmLabel = "Hapus",
  cancelLabel = "Pertahankan",
  onConfirm,
  onCancel,
  isOpen
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm" onClick={onCancel} />
      
      {/* Modal */}
      <div className="relative bg-white rounded-3xl p-8 w-full max-w-[320px] shadow-2xl animate-in zoom-in-95 duration-300">
        {/* Delete Icon */}
        <div className="w-[68px] h-[68px] rounded-full bg-purple-50 flex items-center justify-center mx-auto mb-5">
          <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none">
            <rect x="2" y="2" width="20" height="20" rx="6" fill="#7c6fcd" opacity="0.15"/>
            <rect x="2" y="2" width="20" height="20" rx="6" stroke="#7c6fcd" strokeWidth="1.5" fill="none"/>
            <path d="M9.5 9a2.5 2.5 0 0 1 5 0c0 1.5-2.5 2-2.5 4" stroke="#7c6fcd" strokeWidth="2" strokeLinecap="round"/>
            <circle cx="12" cy="17" r="0.9" fill="#7c6fcd"/>
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
            className="w-full bg-[#c62828] text-white rounded-full py-3.5 px-4 font-bold text-[15px] shadow-lg shadow-red-700/30 hover:opacity-90 active:scale-[0.98] transition-all"
          >
            {confirmLabel}
          </button>
          
          <button
            onClick={onCancel}
            className="w-full text-[#1a237e] font-bold text-sm py-2.5 hover:text-[#1a237e]/80 transition-colors"
          >
            {cancelLabel}
          </button>
        </div>
      </div>
    </div>
  );
};
