// =====================================================
// FINANCE APP - Record Transaction Page
// =====================================================
// Clean, focused transaction recording with IDR support
// =====================================================

'use client';

import { useState } from 'react';
import { Check } from 'lucide-react';
import { useTransactionForm } from '@/hooks/useTransactionForm';
import { useCategories } from '@/lib/hooks/useCategories';
import { useTransactions } from '@/lib/hooks/useTransactions';
import AppHeader from '@/components/shared/AppHeader';
import BottomNav from '@/components/shared/BottomNav';
import TransactionTypeToggle from '@/components/features/transaction/TransactionTypeToggle';
import AmountInput from '@/components/features/transaction/AmountInput';
import DescriptionInput from '@/components/features/transaction/DescriptionInput';
import CategorySelector from '@/components/features/transaction/CategorySelector';
import CustomDatePicker from '@/components/features/transaction/CustomDatePicker';
import NoteInput from '@/components/features/transaction/NoteInput';
import { ErrorPopup, Toast } from '@/components/ui';

export default function RecordPage() {
  const { createTransaction } = useTransactions();
  const { categories, loading: categoriesLoading } = useCategories();

  const {
    formData,
    isSubmitting,
    error,
    setIsSubmitting,
    setError,
    updateType,
    updateAmount,
    updateCategory,
    updateDescription,
    updateNote,
    updateDate,
    validateForm,
    resetForm,
    prepareSubmitData,
  } = useTransactionForm();

  const [showToast, setShowToast] = useState(false);
  const [showErrorPopup, setShowErrorPopup] = useState(false);

  // Filter categories based on transaction type
  const filteredCategories = categories.filter(cat => cat.type === formData.type);

  const handleSave = async () => {
    // Inline validation (no popup for validation errors)
    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      return; // Show inline error, don't open popup
    }

    try {
      setIsSubmitting(true);
      setError(null);
      
      const submitData = prepareSubmitData();
      await createTransaction(submitData);
      
      // Show toast notification
      setShowToast(true);
      
      // Reset form after 2 seconds
      setTimeout(() => {
        resetForm();
      }, 1500);
    } catch (err) {
      // Only show popup for server/API errors
      const errorMsg = (err as Error).message || 'Gagal menyimpan transaksi';
      setError(errorMsg);
      setShowErrorPopup(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 pb-24">
      <div className="w-full max-w-[430px] mx-auto">
        <AppHeader />

        <div className="pt-2 animate-fade-in-up">
          {/* Transaction Type Toggle */}
          <TransactionTypeToggle value={formData.type} onChange={updateType} />

          {/* Amount Input with IDR Format */}
          <AmountInput 
            value={formData.amount} 
            onChange={updateAmount}
            type={formData.type}
          />

          {/* Description Input */}
          <DescriptionInput
            value={formData.description}
            onChange={updateDescription}
          />

          {/* Category Selector - Only show for expense transactions */}
          {formData.type === 'expense' && (
            <CategorySelector
              categories={filteredCategories}
              selectedId={formData.category_id}
              onSelect={updateCategory}
              loading={categoriesLoading}
            />
          )}

          {/* Custom Date Picker */}
          <CustomDatePicker 
            date={formData.transaction_date}
            onChange={updateDate}
          />

          {/* Note Input */}
          <NoteInput value={formData.note} onChange={updateNote} />

          {/* Inline Error Message (Validation Errors) */}
          {error && !showErrorPopup && (
            <div className="mx-5 mb-4 p-3.5 bg-red-50 border-l-4 border-red-500 rounded-lg">
              <div className="flex items-start gap-2">
                <svg className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <p className="text-sm text-red-700 font-medium">{error}</p>
              </div>
            </div>
          )}

          {/* Save Button */}
          <button
            onClick={handleSave}
            disabled={isSubmitting}
            className="flex items-center justify-center gap-2.5 bg-indigo-900 text-white rounded-full py-4 px-7 mx-5 mb-6 font-bold text-sm shadow-lg shadow-indigo-900/30 hover:bg-indigo-800 active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed w-[calc(100%-40px)]"
          >
            <Check className="w-5 h-5" strokeWidth={2.5} />
            {isSubmitting ? 'Menyimpan...' : 'Simpan Transaksi'}
          </button>
        </div>

        {/* SUCCESS TOAST */}
        <Toast
          isOpen={showToast}
          type="success"
          title="Transaksi Berhasil Disimpan!"
          message="Saldo Anda telah diperbarui."
          duration={3000}
          onClose={() => setShowToast(false)}
        />

        {/* ERROR POPUP */}
        <ErrorPopup
          isOpen={showErrorPopup}
          title="Gagal Menyimpan Transaksi"
          message={error || 'Terjadi kesalahan. Silakan coba lagi.'}
          onRetry={() => {
            setShowErrorPopup(false);
            handleSave();
          }}
          onCancel={() => setShowErrorPopup(false)}
        />
      </div>

      <BottomNav />
    </div>
  );
}
