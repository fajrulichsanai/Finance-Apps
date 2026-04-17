// =====================================================
// FINANCE APP - Custom Date Picker
// =====================================================
// Clean custom date picker without browser default UI
// =====================================================

'use client';

import { useState, useEffect } from 'react';
import { Calendar, ChevronLeft, ChevronRight } from 'lucide-react';

interface CustomDatePickerProps {
  date: string;
  onChange: (date: string) => void;
}

export default function CustomDatePicker({ date, onChange }: CustomDatePickerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date(date));

  useEffect(() => {
    setSelectedDate(new Date(date));
  }, [date]);

  const formatDisplayDate = (dateStr: string) => {
    const d = new Date(dateStr);
    const today = new Date();
    const isToday = d.toDateString() === today.toDateString();

    if (isToday) {
      return `Hari Ini, ${d.toLocaleDateString('id-ID', { 
        day: 'numeric', 
        month: 'short', 
        year: 'numeric' 
      })}`;
    }

    return d.toLocaleDateString('id-ID', { 
      weekday: 'long',
      day: 'numeric', 
      month: 'short', 
      year: 'numeric' 
    });
  };

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    return { daysInMonth, startingDayOfWeek };
  };

  const handleDateSelect = (day: number) => {
    const newDate = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    // Prevent selection of future dates
    if (newDate > today) {
      return;
    }
    
    const dateString = newDate.toISOString().split('T')[0];
    onChange(dateString);
    setIsOpen(false);
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

  const handleToday = () => {
    const today = new Date();
    const todayString = today.toISOString().split('T')[0];
    onChange(todayString);
    setCurrentMonth(today);
    setIsOpen(false);
  };

  const { daysInMonth, startingDayOfWeek } = getDaysInMonth(currentMonth);
  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);
  const emptyDays = Array.from({ length: startingDayOfWeek }, (_, i) => i);

  const isSelectedDay = (day: number) => {
    return selectedDate.getDate() === day &&
      selectedDate.getMonth() === currentMonth.getMonth() &&
      selectedDate.getFullYear() === currentMonth.getFullYear();
  };

  const isToday = (day: number) => {
    const today = new Date();
    return today.getDate() === day &&
      today.getMonth() === currentMonth.getMonth() &&
      today.getFullYear() === currentMonth.getFullYear();
  };

  const isFutureDate = (day: number) => {
    const checkDate = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return checkDate > today;
  };

  return (
    <>
      <div className="bg-white rounded-2xl mx-5 mb-4 p-4 shadow-sm">
        <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-3">
          Tanggal Transaksi
        </p>
        
        {/* Display Field */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center gap-2.5 w-full text-left group"
        >
          <Calendar className="w-5 h-5 text-indigo-600" strokeWidth={1.8} />
          <span className="text-sm font-semibold text-slate-900 flex-1">
            {formatDisplayDate(date)}
          </span>
          <ChevronRight 
            className={`w-4 h-4 text-slate-400 transition-transform ${
              isOpen ? 'rotate-90' : ''
            }`} 
          />
        </button>
      </div>

      {/* Calendar Modal - Center of screen */}
      {isOpen && (
        <>
          {/* Backdrop */}
          <div 
            className="fixed inset-0 bg-black/40 z-50 animate-fade-in"
            onClick={() => setIsOpen(false)}
          />
          
          {/* Modal */}
          <div className="fixed inset-0 z-50 flex items-center justify-center p-5 pointer-events-none">
            <div className="bg-white rounded-2xl shadow-2xl p-5 max-w-sm w-full pointer-events-auto animate-scale-in">
          {/* Month Navigation */}
          <div className="flex items-center justify-between mb-4">
            <button
              onClick={handlePrevMonth}
              className="p-1.5 hover:bg-slate-100 rounded-lg transition-colors"
            >
              <ChevronLeft className="w-5 h-5 text-slate-600" />
            </button>
            <span className="font-bold text-sm text-slate-900">
              {currentMonth.toLocaleDateString('id-ID', { month: 'long', year: 'numeric' })}
            </span>
            <button
              onClick={handleNextMonth}
              className="p-1.5 hover:bg-slate-100 rounded-lg transition-colors"
            >
              <ChevronRight className="w-5 h-5 text-slate-600" />
            </button>
          </div>

          {/* Weekday Headers */}
          <div className="grid grid-cols-7 gap-1 mb-2">
            {['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab'].map(day => (
              <div key={day} className="text-center text-[10px] font-bold text-slate-400 uppercase">
                {day}
              </div>
            ))}
          </div>

          {/* Calendar Grid */}
          <div className="grid grid-cols-7 gap-1 mb-4">
            {emptyDays.map(i => (
              <div key={`empty-${i}`} className="aspect-square" />
            ))}
            {days.map(day => {
              const selected = isSelectedDay(day);
              const today = isToday(day);
              const future = isFutureDate(day);
              
              return (
                <button
                  key={day}
                  onClick={() => handleDateSelect(day)}
                  disabled={future}
                  className={`
                    aspect-square rounded-lg text-sm font-semibold transition-all
                    ${future
                      ? 'text-slate-300 cursor-not-allowed bg-slate-50'
                      : selected 
                        ? 'bg-indigo-600 text-white' 
                        : today
                          ? 'bg-indigo-100 text-indigo-600 hover:bg-indigo-200'
                          : 'hover:bg-slate-100 text-slate-700'
                    }
                  `}
                  title={future ? 'Tanggal di masa depan tidak boleh dipilih' : ''}
                >
                  {day}
                </button>
              );
            })}
          </div>

          {/* Quick Actions */}
          <div className="flex gap-2">
            <button
              onClick={handleToday}
              className="flex-1 py-2.5 bg-indigo-100 text-indigo-600 rounded-lg font-semibold text-sm hover:bg-indigo-200 transition-colors"
            >
              Hari Ini
            </button>
            <button
              onClick={() => setIsOpen(false)}
              className="flex-1 py-2.5 bg-slate-100 text-slate-700 rounded-lg font-semibold text-sm hover:bg-slate-200 transition-colors"
            >
              Tutup
            </button>
          </div>
            </div>
          </div>
        </>
      )}
    </>
  );
}
