'use client';

import React, { useState } from 'react';
import { FileText, Download, Calendar, X } from 'lucide-react';
import ExportButton from './ExportButton';
import { exportToExcel, exportToPDF } from '@/lib/services/exportService';

interface DateRange {
  startMonth: string;
  endMonth: string;
}

interface ExportSectionProps {
  userId: string;
}

export default function ExportSection({ userId }: ExportSectionProps) {
  const [showModal, setShowModal] = useState(false);
  const [exportType, setExportType] = useState<'excel' | 'pdf' | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [dateRange, setDateRange] = useState<DateRange>({
    startMonth: getCurrentMonth(),
    endMonth: getCurrentMonth(),
  });

  const handleExportClick = (type: 'excel' | 'pdf') => {
    setExportType(type);
    setShowModal(true);
    setError(null);
  };

  const handleConfirmExport = async () => {
    // Validate date range (max 12 months)
    const monthsDiff = calculateMonthsDifference(dateRange.startMonth, dateRange.endMonth);
    
    if (monthsDiff > 12) {
      setError('Rentang maksimal adalah 12 bulan');
      return;
    }

    if (monthsDiff < 0) {
      setError('Bulan awal harus lebih kecil dari bulan akhir');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      if (exportType === 'excel') {
        await exportToExcel(dateRange.startMonth, dateRange.endMonth);
      } else if (exportType === 'pdf') {
        await exportToPDF(dateRange.startMonth, dateRange.endMonth);
      }
      
      setShowModal(false);
    } catch (err: any) {
      console.error('Export error:', err);
      setError(err.message || 'Gagal mengekspor data');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="bg-white dark:bg-gray-800 rounded-[18px] shadow-sm p-4 transition-colors">
        <div className="flex gap-3 mb-2">
          <ExportButton 
            label="Excel" 
            icon={<FileText className="w-5 h-5 text-green-700 dark:text-green-500" />}
            onClick={() => handleExportClick('excel')}
          />
          <ExportButton 
            label="PDF" 
            icon={<Download className="w-5 h-5 text-red-600 dark:text-red-500" />}
            onClick={() => handleExportClick('pdf')}
          />
        </div>
        <p className="text-[11.5px] text-gray-400 dark:text-gray-500 text-center py-1 transition-colors">
          Ekspor data transaksi dengan pilihan rentang bulan
        </p>
      </div>

      {/* Export Date Range Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 dark:bg-black/70 flex items-center justify-center z-50 px-4 transition-colors">
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 w-full max-w-md shadow-2xl transition-colors">
            {/* Header */}
            <div className="flex items-center justify-between mb-5">
              <div className="flex items-center gap-3">
                {exportType === 'excel' ? (
                  <FileText className="w-6 h-6 text-green-700 dark:text-green-500" />
                ) : (
                  <Download className="w-6 h-6 text-red-600 dark:text-red-500" />
                )}
                <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100">
                  Ekspor ke {exportType === 'excel' ? 'Excel' : 'PDF'}
                </h3>
              </div>
              <button
                onClick={() => setShowModal(false)}
                className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-gray-500 dark:text-gray-400" />
              </button>
            </div>

            {/* Date Range Inputs */}
            <div className="space-y-4 mb-5">
              {error && (
                <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl transition-colors">
                  <p className="text-sm text-red-700 dark:text-red-400">{error}</p>
                </div>
              )}
              
              <div>
                <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  <Calendar className="w-4 h-4" />
                  Bulan Mulai
                </label>
                <input
                  type="month"
                  value={dateRange.startMonth}
                  onChange={(e) => setDateRange({ ...dateRange, startMonth: e.target.value })}
                  max={getCurrentMonth()}
                  className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent text-sm transition-colors"
                />
              </div>

              <div>
                <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  <Calendar className="w-4 h-4" />
                  Bulan Akhir
                </label>
                <input
                  type="month"
                  value={dateRange.endMonth}
                  onChange={(e) => setDateRange({ ...dateRange, endMonth: e.target.value })}
                  max={getCurrentMonth()}
                  className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent text-sm transition-colors"
                />
              </div>

              {/* Info */}
              <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl p-3 transition-colors">
                <p className="text-xs text-blue-700 dark:text-blue-400">
                  <span className="font-semibold">Rentang maksimal:</span> 12 bulan
                </p>
                {exportType === 'excel' && (
                  <p className="text-xs text-blue-600 dark:text-blue-400 mt-1">
                    • Tab pertama: Overview<br />
                    • Tab berikutnya: Data per bulan
                  </p>
                )}
                {exportType === 'pdf' && (
                  <p className="text-xs text-blue-600 dark:text-blue-400 mt-1">
                    • Halaman pertama: Overview<br />
                    • Halaman berikutnya: Tabel per bulan
                  </p>
                )}
              </div>
            <button
                onClick={() => setShowModal(false)}
                disabled={loading}
                className="flex-1 px-4 py-3 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-sm font-semibold rounded-xl hover:bg-gray-200 dark:hover:bg-gray-600 disabled:opacity-50 transition-colors"
              >
                Batal
              </button>
              <button
                onClick={handleConfirmExport}
                disabled={loading}
                className={`flex-1 px-4 py-3 text-white text-sm font-semibold rounded-xl disabled:opacity-50 disabled:cursor-not-allowed transition-colors ${
                  exportType === 'excel'
                    ? 'bg-green-600 hover:bg-green-700 dark:bg-green-500 dark:hover:bg-green-600'
                    : 'bg-red-600 hover:bg-red-700 dark:bg-red-500 dark:hover:bg-red-600'
                }`}
              >
                {loading ? 'Mengekspor...' : 'Ekspor Sekarang'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

// ============================================================
// UTILITY FUNCTIONS
// ============================================================

function getCurrentMonth(): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  return `${year}-${month}`;
}

function calculateMonthsDifference(start: string, end: string): number {
  const [startYear, startMonth] = start.split('-').map(Number);
  const [endYear, endMonth] = end.split('-').map(Number);
  
  return (endYear - startYear) * 12 + (endMonth - startMonth);
}

