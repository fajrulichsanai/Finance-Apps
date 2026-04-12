import React from 'react';

export interface SuccessPopupProps {
  title?: string;
  message?: string;
  status?: string;
  transactionId?: string;
  onDone: () => void;
  isOpen: boolean;
}

export const SuccessPopup: React.FC<SuccessPopupProps> = ({
  title = "Transaction Saved Successfully!",
  message = "Your balance has been updated in real-time.",
  status = "Confirmed",
  transactionId,
  onDone,
  isOpen
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={onDone} />
      
      {/* Modal */}
      <div className="relative bg-white rounded-3xl p-8 w-full max-w-[320px] shadow-2xl animate-in zoom-in-95 duration-300">
        {/* Success Icon */}
        <div className="w-[68px] h-[68px] rounded-full bg-green-500 flex items-center justify-center mx-auto mb-5 shadow-lg shadow-green-500/35">
          <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="20 6 9 17 4 12"/>
          </svg>
        </div>

        {/* Title */}
        <h3 className="font-nunito text-xl font-black text-[#1a237e] text-center mb-3 leading-tight">
          {title}
        </h3>

        {/* Message */}
        {message && (
          <p className="text-sm font-medium text-slate-600 text-center mb-4 leading-relaxed">
            {message}
          </p>
        )}

        {/* Status Row */}
        {(status || transactionId) && (
          <div className="flex gap-2.5 bg-slate-50 rounded-2xl p-3.5 mb-6">
            {status && (
              <>
                <div className="flex-1">
                  <div className="text-[9px] font-bold tracking-wider uppercase text-slate-400 mb-1.5">
                    Status
                  </div>
                  <div className="flex items-center gap-1.5 text-sm font-bold text-gray-900">
                    <span className="w-1.5 h-1.5 rounded-full bg-green-500" />
                    {status}
                  </div>
                </div>
                {transactionId && <div className="w-px bg-slate-200" />}
              </>
            )}
            
            {transactionId && (
              <div className="flex-1 pl-3">
                <div className="text-[9px] font-bold tracking-wider uppercase text-slate-400 mb-1.5">
                  Ledger ID
                </div>
                <div className="text-sm font-bold text-gray-900">
                  {transactionId}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Done Button */}
        <button
          onClick={onDone}
          className="w-full bg-[#1a237e] text-white rounded-full py-3.5 px-4 font-bold text-[15px] shadow-lg shadow-indigo-900/30 hover:opacity-90 active:scale-[0.98] transition-all"
        >
          Done
        </button>
      </div>
    </div>
  );
};
