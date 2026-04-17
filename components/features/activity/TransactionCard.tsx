// =====================================================
// FINANCE APP - Transaction Card Component
// =====================================================

import React, { useState } from 'react';
import { Trash2 } from 'lucide-react';
import { ActivityTransaction } from '@/types';
import TransactionIcon from './TransactionIcon';

interface TransactionCardProps {
  transaction: ActivityTransaction;
  onDelete?: (id: string) => void;
  deleting?: boolean;
}

export default function TransactionCard({ transaction, onDelete, deleting = false }: TransactionCardProps) {
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const isIncome = transaction.type === 'income';
  
  const handleDelete = () => {
    if (onDelete) {
      onDelete(transaction.id);
      setShowDeleteConfirm(false);
    }
  };
  
  return (
    <div className="bg-white rounded-[18px] p-3.5 px-4 mb-2.5 flex items-start gap-3 group relative">
      <div className={`w-[46px] h-[46px] rounded-[14px] flex items-center justify-center flex-shrink-0 ${
        isIncome ? 'bg-[#e6f9f0]' : 'bg-[#f0f0f5]'
      }`}>
        <TransactionIcon iconType={transaction.icon} />
      </div>
      
      <div className="flex-1">
        <div className="text-sm font-bold text-[#0d0d2b] mb-0.5">
          {transaction.name}
        </div>
        <div className="text-xs text-gray-400 leading-relaxed">
          {transaction.category} • {transaction.description || 'Tidak ada catatan'}
        </div>
      </div>
      
      <div className="text-right flex-shrink-0">
        <div className={`text-[15px] font-bold mb-1 ${
          isIncome ? 'text-[#1a9e6e]' : 'text-[#0d0d2b]'
        }`}>
          {isIncome ? '+' : '-'}Rp{Math.abs(transaction.amount).toLocaleString('id-ID')}
        </div>
        <div className="text-[11px] text-[#bbb]">
          {transaction.time}
        </div>
      </div>
      
      {/* Delete Button - Show on hover */}
      {onDelete && (
        <button
          onClick={() => setShowDeleteConfirm(true)}
          disabled={deleting}
          className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity p-1.5 bg-red-50 hover:bg-red-100 rounded-lg text-red-500 disabled:opacity-50"
          title="Hapus transaksi"
        >
          <Trash2 className="w-4 h-4" strokeWidth={2} />
        </button>
      )}
      
      {/* Delete Confirmation Popup */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-5" onClick={() => setShowDeleteConfirm(false)}>
          <div className="bg-white rounded-2xl p-5 max-w-sm w-full shadow-2xl" onClick={(e) => e.stopPropagation()}>
            <h3 className="text-lg font-bold text-gray-900 mb-2">Hapus Transaksi?</h3>
            <p className="text-sm text-gray-600 mb-5">
              Transaksi <span className="font-semibold">{transaction.name}</span> akan dihapus permanen.
            </p>
            <div className="flex gap-2">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="flex-1 py-2.5 bg-gray-100 text-gray-700 rounded-xl font-semibold hover:bg-gray-200 transition-colors"
              >
                Batal
              </button>
              <button
                onClick={handleDelete}
                disabled={deleting}
                className="flex-1 py-2.5 bg-red-500 text-white rounded-xl font-semibold hover:bg-red-600 transition-colors disabled:opacity-50"
              >
                {deleting ? 'Menghapus...' : 'Hapus'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
