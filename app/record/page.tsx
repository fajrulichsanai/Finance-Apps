// =====================================================
// FINANCE APP - Record Transaction Page
// =====================================================
// Clean, focused transaction recording with IDR support
// =====================================================

'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Check } from 'lucide-react';
import { useTransactionForm } from '@/hooks/useTransactionForm';
import { useCategories } from '@/lib/hooks/useCategories';
import { useTransactions } from '@/lib/hooks/useTransactions';
import { createClient } from '@/lib/supabase/client';
import { sanitizeInput } from '@/lib/utils/sanitize';
import AppHeader from '@/components/shared/AppHeader';
import BottomNav from '@/components/shared/BottomNav';
import TransactionTypeToggle from '@/components/features/transaction/TransactionTypeToggle';
import AmountInput from '@/components/features/transaction/AmountInput';
import DescriptionInput from '@/components/features/transaction/DescriptionInput';
import CategorySelector from '@/components/features/transaction/CategorySelector';
import CustomDatePicker from '@/components/features/transaction/CustomDatePicker';
import NoteInput from '@/components/features/transaction/NoteInput';
import { ErrorPopup, Toast } from '@/components/ui';

// Type definition for submission state management
type SubmissionState = {
  status: 'idle' | 'loading' | 'success' | 'error';
  error?: string;
};

export default function RecordPage() {
  const router = useRouter();
  const supabase = createClient();

  // Auth state
  const [isAuthed, setIsAuthed] = useState(false);
  const [authChecking, setAuthChecking] = useState(true);

  // Check authentication on mount
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
          router.push('/auth');
          return;
        }
        setIsAuthed(true);
      } catch (err) {
        console.error('Auth check failed:', err);
        router.push('/auth');
      } finally {
        setAuthChecking(false);
      }
    };

    checkAuth();
  }, [router, supabase]);

  const { createTransaction } = useTransactions();
  const { categories, loading: categoriesLoading } = useCategories();

  const {
    formData,
    error: formError,
    setError: setFormError,
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

  // Consolidated submission state management
  const [submission, setSubmission] = useState<SubmissionState>({
    status: 'idle',
  });

  // Refs for cleanup
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      if (abortControllerRef.current) abortControllerRef.current.abort();
    };
  }, []);

  // Filter categories based on transaction type
  const filteredCategories = categories.filter(cat => cat.type === formData.type);

  // Enhanced validation with amount limits and date checks
  const validateFormWithLimits = (): string | null => {
    if (formData.amount <= 0) return 'Jumlah harus lebih dari 0';
    if (formData.amount > 999_999_999) return 'Jumlah transaksi terlalu besar (max: Rp 999.999.999)';
    
    // Check for future dates
    const selectedDate = new Date(formData.transaction_date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    if (selectedDate > today) {
      return 'Tanggal transaksi tidak boleh di masa depan';
    }
    
    if (formData.type === 'expense' && !formData.category_id) {
      return 'Pilih kategori untuk pengeluaran';
    }
    
    return null;
  };

  const handleSave = async () => {
    // Prevent multiple submissions
    if (submission.status === 'loading') return;

    // Validate form with enhanced checks
    const validationError = validateFormWithLimits();
    if (validationError) {
      setSubmission({ status: 'error', error: validationError });
      return;
    }

    // Prevent submission if categories still loading for expense
    if (formData.type === 'expense' && categoriesLoading) {
      setSubmission({ status: 'error', error: 'Kategori masih dimuat. Silakan tunggu...' });
      return;
    }

    // Cancel any previous in-flight request
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    abortControllerRef.current = new AbortController();

    try {
      setSubmission({ status: 'loading' });
      
      let submitData = prepareSubmitData();
      
      // Sanitize text inputs
      submitData.description = sanitizeInput(submitData.description || '');
      submitData.note = sanitizeInput(submitData.note || '');
      
      const result = await createTransaction(submitData);
      
      // Verify transaction was created successfully
      if (!result?.id) {
        throw new Error('Transaksi gagal disimpan - tidak ada ID yang dikembalikan');
      }

      // Show success state
      setSubmission({ status: 'success' });
      
      // Reset form after toast duration
      timeoutRef.current = setTimeout(() => {
        resetForm();
        setFormError(null);
        setSubmission({ status: 'idle' });
      }, 2500);
    } catch (err: any) {
      // Don't show error if request was aborted (user navigated away)
      if (err?.name === 'AbortError') {
        setSubmission({ status: 'idle' });
        return;
      }
      
      const errorMsg = err?.message || 'Gagal menyimpan transaksi. Silakan coba lagi.';
      setSubmission({ status: 'error', error: errorMsg });
    }
  };

  // Show loading while checking auth
  if (authChecking) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center pb-24">
        <div className="w-full max-w-[430px] mx-auto px-5">
          <div className="animate-pulse">
            <div className="h-12 bg-slate-200 rounded-lg mb-4"></div>
            <div className="h-24 bg-slate-200 rounded-lg mb-4"></div>
            <div className="h-16 bg-slate-200 rounded-lg mb-4"></div>
            <div className="h-16 bg-slate-200 rounded-lg mb-4"></div>
          </div>
        </div>
      </div>
    );
  }

  // If not authenticated, don't render form
  if (!isAuthed) {
    return null;
  }

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

          {/* Category Selector - Only show for expense transactions with smooth transition */}
          {formData.type === 'expense' && (
            <div 
              key="expense-categories"
              className="animate-fade-in-up"
            >
              <CategorySelector
                categories={filteredCategories}
                selectedId={formData.category_id}
                onSelect={updateCategory}
                loading={categoriesLoading}
              />
            </div>
          )}

          {/* Custom Date Picker */}
          <CustomDatePicker 
            date={formData.transaction_date}
            onChange={updateDate}
          />

          {/* Note Input */}
          <NoteInput value={formData.note} onChange={updateNote} />

          {/* Inline Error Message (Validation Errors) */}
          {submission.status === 'error' && submission.error && (
            <div className="mx-5 mb-4 p-3.5 bg-red-50 border-l-4 border-red-500 rounded-lg animate-fade-in-up">
              <div className="flex items-start gap-2">
                <svg className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <p className="text-sm text-red-700 font-medium">{submission.error}</p>
              </div>
            </div>
          )}

          {/* Save Button */}
          <button
            onClick={handleSave}
            disabled={
              submission.status === 'loading' || 
              (formData.type === 'expense' && categoriesLoading) || 
              (formData.type === 'expense' && !formData.category_id)
            }
            className="flex items-center justify-center gap-2.5 bg-indigo-900 text-white rounded-full py-4 px-7 mx-5 mb-6 font-bold text-sm shadow-lg shadow-indigo-900/30 hover:bg-indigo-800 active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed w-[calc(100%-40px)]"
            title={
              categoriesLoading && formData.type === 'expense' 
                ? 'Menunggu kategori dimuat...' 
                : (!formData.category_id && formData.type === 'expense')
                ? 'Pilih kategori terlebih dahulu'
                : 'Simpan transaksi'
            }
          >
            <Check className="w-5 h-5" strokeWidth={2.5} />
            {submission.status === 'loading' 
              ? 'Menyimpan...' 
              : categoriesLoading && formData.type === 'expense'
              ? 'Menunggu Kategori...'
              : 'Simpan Transaksi'}
          </button>
        </div>

        {/* SUCCESS TOAST */}
        <Toast
          isOpen={submission.status === 'success'}
          type="success"
          title="Transaksi Berhasil Disimpan!"
          message="Saldo Anda telah diperbarui."
          duration={3000}
          onClose={() => {
            setSubmission({ status: 'idle' });
            if (timeoutRef.current) clearTimeout(timeoutRef.current);
            resetForm();
            setFormError(null);
          }}
        />

        {/* ERROR POPUP */}
        <ErrorPopup
          isOpen={submission.status === 'error'}
          title="Gagal Menyimpan Transaksi"
          message={submission.error || 'Terjadi kesalahan. Silakan coba lagi.'}
          onRetry={() => {
            handleSave();
          }}
          onCancel={() => setSubmission({ status: 'idle' })}
        />
      </div>

      <BottomNav />
    </div>
  );
}
