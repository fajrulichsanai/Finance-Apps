// =====================================================
// FINANCE APP - Record Transaction Page
// =====================================================

'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Check } from 'lucide-react';
import { useTransactionForm } from '@/hooks/useTransactionForm';
import { useCategories } from '@/lib/hooks/useCategories';
import { useTransactions } from '@/lib/hooks/useTransactions';
import AppHeader from '@/components/shared/AppHeader';
import TransactionTypeToggle from '@/components/features/transaction/TransactionTypeToggle';
import AmountDisplay from '@/components/features/transaction/AmountDisplay';
import CategorySelector from '@/components/features/transaction/CategorySelector';
import TransactionDatePicker from '@/components/features/transaction/TransactionDatePicker';
import PaymentAccountSelector from '@/components/features/transaction/PaymentAccountSelector';
import NoteInput from '@/components/features/transaction/NoteInput';
import TagsInput from '@/components/features/transaction/TagsInput';
import BottomNav from '@/components/shared/BottomNav';
import { SuccessPopup, ErrorPopup } from '@/components/ui';

export default function RecordPage() {
  const router = useRouter();
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
    updateNote,
    addTag,
    removeTag,
    validateForm,
    resetForm,
    prepareSubmitData,
  } = useTransactionForm();

  const [showSuccessPopup, setShowSuccessPopup] = useState(false);
  const [showErrorPopup, setShowErrorPopup] = useState(false);

  const handleSave = async () => {
    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      setShowErrorPopup(true);
      return;
    }

    try {
      setIsSubmitting(true);
      setError(null);
      
      const submitData = prepareSubmitData();
      await createTransaction(submitData);
      
      resetForm();
      setShowSuccessPopup(true);
    } catch (err) {
      const errorMsg = (err as Error).message || 'Failed to save transaction';
      setError(errorMsg);
      setShowErrorPopup(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 pb-24">
      <AppHeader />

      <div className="animate-fade-in-up">
        <TransactionTypeToggle value={formData.type} onChange={updateType} />

        <AmountDisplay amount={formData.amount} />

        <CategorySelector
          categories={categories}
          selectedId={formData.category_id}
          onSelect={updateCategory}
          loading={categoriesLoading}
        />

        <TransactionDatePicker date={formData.transaction_date} />

        <PaymentAccountSelector accountName="Main Bank Account" />

        <NoteInput value={formData.note} onChange={updateNote} />

        <TagsInput
          tags={formData.tags || []}
          onAddTag={addTag}
          onRemoveTag={removeTag}
        />

        {error && (
          <div className="mx-5 mb-4 p-3 bg-red-50 border border-red-200 rounded-xl">
            <p className="text-sm text-red-700 font-medium">{error}</p>
          </div>
        )}

        <button
          onClick={handleSave}
          disabled={isSubmitting}
          className="flex items-center justify-center gap-2.5 bg-indigo-900 text-white rounded-full py-4 px-7 mx-5 mb-6 font-bold text-sm shadow-lg shadow-indigo-900/30 hover:bg-indigo-800 active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed w-[calc(100%-40px)]"
        >
          <Check className="w-5 h-5" strokeWidth={2.5} />
          {isSubmitting ? 'Saving...' : 'Save Transaction'}
        </button>
      </div>

      {/* SUCCESS POPUP */}
      <SuccessPopup
        isOpen={showSuccessPopup}
        title="Transaksi Berhasil Disimpan!"
        message="Saldo Anda telah diperbarui secara real-time."
        status="Tersimpan"
        onDone={() => {
          setShowSuccessPopup(false);
          router.push('/dashboard');
        }}
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

      <BottomNav />
    </div>
  );
}
