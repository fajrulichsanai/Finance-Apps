// =====================================================
// FINANCE APP - Date Range Picker
// =====================================================
// Calendar-based date range picker for filtering transactions
// =====================================================

'use client';

import { useState, useEffect } from 'react';
import { Calendar, ChevronLeft, ChevronRight, X } from 'lucide-react';

interface DateRangePickerProps {
  startDate: string | null;
  endDate: string | null;
  onApply: (startDate: string | null, endDate: string | null) => void;
  onClose: () => void;
}

export default function DateRangePicker({ 
  startDate: initialStart, 
  endDate: initialEnd, 
  onApply, 
  onClose 
}: DateRangePickerProps) {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [startDate, setStartDate] = useState<string | null>(initialStart);
  const [endDate, setEndDate] = useState<string | null>(initialEnd);
  const [hoveringDate, setHoveringDate] = useState<string | null>(null);

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();
    return { daysInMonth, startingDayOfWeek };
  };

  const handleDateClick = (day: number) => {
    const dateStr = `${currentMonth.getFullYear()}-${String(currentMonth.getMonth() + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    
    // If both dates are selected, reset and start new selection
    if (startDate && endDate) {
      setStartDate(dateStr);
      setEndDate(null);
      return;
    }

    // If only start date is set
    if (startDate && !endDate) {
      if (dateStr >= startDate) {
        setEndDate(dateStr);
      } else {
        setStartDate(dateStr);
      }
      return;
    }

    // If no dates are set
    setStartDate(dateStr);
  };

  const handlePrevMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1));
  };

  const handleNextMonth = () => {
    const newMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    // Don't allow navigation to future months
    if (newMonth.getFullYear() > today.getFullYear() || 
        (newMonth.getFullYear() === today.getFullYear() && newMonth.getMonth() > today.getMonth())) {
      return;
    }
    
    setCurrentMonth(newMonth);
  };

  const handleApply = () => {
    onApply(startDate, endDate);
  };

  const handleReset = () => {
    setStartDate(null);
    setEndDate(null);
  };

  const isDateInRange = (day: number): boolean => {
    const dateStr = `${currentMonth.getFullYear()}-${String(currentMonth.getMonth() + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    
    if (!startDate || !endDate) return false;
    return dateStr >= startDate && dateStr <= endDate;
  };

  const isDateStart = (day: number): boolean => {
    const dateStr = `${currentMonth.getFullYear()}-${String(currentMonth.getMonth() + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    return dateStr === startDate;
  };

  const isDateEnd = (day: number): boolean => {
    const dateStr = `${currentMonth.getFullYear()}-${String(currentMonth.getMonth() + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    return dateStr === endDate;
  };

  const isFutureDate = (day: number): boolean => {
    const checkDate = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return checkDate > today;
  };

  const { daysInMonth, startingDayOfWeek } = getDaysInMonth(currentMonth);
  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);
  const emptyDays = Array.from({ length: startingDayOfWeek }, (_, i) => i);

  const formatDateDisplay = (dateStr: string | null) => {
    if (!dateStr) return '—';
    const date = new Date(dateStr + 'T00:00:00');
    return date.toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40">
      <div className="bg-white rounded-2xl shadow-2xl max-w-sm w-full animate-scale-in overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-gray-200">
          <h3 className="font-bold text-lg text-gray-900">Pilih Rentang Tanggal</h3>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-gray-600" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5">
          {/* Selected Dates Display */}
          <div className="mb-4 p-3 bg-blue-50 rounded-lg">
            <p className="text-xs font-semibold text-gray-600 mb-2">Rentang yang Dipilih</p>
            <div className="flex items-center justify-between text-sm">
              <span className="font-bold text-gray-900">{formatDateDisplay(startDate)}</span>
              <span className="text-gray-400">—</span>
              <span className="font-bold text-gray-900">{formatDateDisplay(endDate)}</span>
            </div>
          </div>

          {/* Month Navigation */}
          <div className="flex items-center justify-between mb-4">
            <button
              onClick={handlePrevMonth}
              className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ChevronLeft className="w-5 h-5 text-gray-600" />
            </button>
            <span className="font-bold text-sm text-gray-900">
              {currentMonth.toLocaleDateString('id-ID', { month: 'long', year: 'numeric' })}
            </span>
            <button
              onClick={handleNextMonth}
              className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ChevronRight className="w-5 h-5 text-gray-600" />
            </button>
          </div>

          {/* Weekday Headers */}
          <div className="grid grid-cols-7 gap-1 mb-2">
            {['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab'].map(day => (
              <div key={day} className="text-center text-[10px] font-bold text-gray-400 uppercase">
                {day}
              </div>
            ))}
          </div>

          {/* Calendar Grid */}
          <div className="grid grid-cols-7 gap-1 mb-5">
            {emptyDays.map(i => (
              <div key={`empty-${i}`} className="aspect-square" />
            ))}
            {days.map(day => {
              const isStart = isDateStart(day);
              const isEnd = isDateEnd(day);
              const inRange = isDateInRange(day);
              const isFuture = isFutureDate(day);
              
              return (
                <button
                  key={day}
                  onClick={() => !isFuture && handleDateClick(day)}
                  disabled={isFuture}
                  className={`
                    aspect-square rounded-lg text-sm font-semibold transition-all
                    ${isFuture
                      ? 'text-gray-300 cursor-not-allowed bg-gray-50'
                      : isStart || isEnd
                        ? 'bg-indigo-600 text-white'
                        : inRange
                          ? 'bg-indigo-100 text-indigo-600'
                          : 'hover:bg-gray-100 text-gray-700'
                    }
                  `}
                >
                  {day}
                </button>
              );
            })}
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2">
            <button
              onClick={handleReset}
              className="flex-1 py-2.5 bg-gray-100 text-gray-700 rounded-lg font-semibold text-sm hover:bg-gray-200 transition-colors"
            >
              Reset
            </button>
            <button
              onClick={handleApply}
              className="flex-1 py-2.5 bg-indigo-600 text-white rounded-lg font-semibold text-sm hover:bg-indigo-700 transition-colors"
            >
              Terapkan
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
