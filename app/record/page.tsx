// =====================================================
// FINANCE APP - Record Transaction Page
// =====================================================

'use client';

import { useRouter } from 'next/navigation';
import { Check } from 'lucide-react';
import { useTransactionForm } from '@/hooks/useTransactionForm';
import { useCategories } from '@/lib/hooks/useCategories';
import { useTransactions } from '@/lib/hooks/useTransactions';
import Header from '@/components/shared/Header';
import TransactionTypeToggle from '@/components/features/TransactionTypeToggle';
import AmountDisplay from '@/components/features/AmountDisplay';
import CategorySelector from '@/components/features/CategorySelector';
import TransactionDatePicker from '@/components/features/TransactionDatePicker';
import PaymentAccountSelector from '@/components/features/PaymentAccountSelector';
import NoteInput from '@/components/features/NoteInput';
import TagsInput from '@/components/features/TagsInput';
import BottomNav from '@/components/BottomNav';

export default function RecordPage() {
  const router = useRouter();
  const { createTransaction } = useTransactions();
  const { incomeCategories, expenseCategories, loading: categoriesLoading } = useCategories();

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

  const currentCategories = formData.type === 'income' ? incomeCategories : expenseCategories;

  const handleSave = async () => {
    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      return;
    }

    try {
      setIsSubmitting(true);
      setError(null);
      
      const submitData = prepareSubmitData();
      await createTransaction(submitData);
      
      resetForm();
      router.push('/dashboard');
    } catch (err) {
      setError((err as Error).message || 'Failed to save transaction');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 pb-24">
      <Header title="Financial Architect" />

      <div className="animate-fade-in-up">
        <TransactionTypeToggle value={formData.type} onChange={updateType} />

        <AmountDisplay amount={formData.amount} />

        <CategorySelector
          categories={currentCategories}
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

      <BottomNav />
    </div>
  );
}
