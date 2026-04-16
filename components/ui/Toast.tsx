'use client';

import React, { useEffect } from 'react';
import { Check, AlertCircle, XCircle } from 'lucide-react';

export interface ToastProps {
  isOpen: boolean;
  type: 'success' | 'error' | 'warning';
  title: string;
  message?: string;
  duration?: number;
  onClose: () => void;
}

export const Toast: React.FC<ToastProps> = ({
  isOpen,
  type,
  title,
  message,
  duration = 3000,
  onClose,
}) => {
  useEffect(() => {
    if (isOpen && duration > 0) {
      const timer = setTimeout(onClose, duration);
      return () => clearTimeout(timer);
    }
  }, [isOpen, duration, onClose]);

  if (!isOpen) return null;

  const bgColor = {
    success: 'bg-emerald-50',
    error: 'bg-red-50',
    warning: 'bg-amber-50',
  }[type];

  const borderColor = {
    success: 'border-emerald-200',
    error: 'border-red-200',
    warning: 'border-amber-200',
  }[type];

  const titleColor = {
    success: 'text-emerald-900',
    error: 'text-red-900',
    warning: 'text-amber-900',
  }[type];

  const messageColor = {
    success: 'text-emerald-700',
    error: 'text-red-700',
    warning: 'text-amber-700',
  }[type];

  const Icon = {
    success: Check,
    error: XCircle,
    warning: AlertCircle,
  }[type];

  const iconColor = {
    success: 'text-emerald-600',
    error: 'text-red-600',
    warning: 'text-amber-600',
  }[type];

  return (
    <div className="fixed bottom-24 left-1/2 -translate-x-1/2 z-50 w-full max-w-[430px] px-5">
      <div
        className={`${bgColor} ${borderColor} border rounded-lg p-4 shadow-lg flex items-start gap-3 animate-in slide-in-from-bottom-4 duration-300`}
      >
        <Icon className={`w-5 h-5 ${iconColor} flex-shrink-0 mt-0.5`} strokeWidth={2} />
        <div className="flex-1">
          <h3 className={`${titleColor} font-semibold text-sm`}>{title}</h3>
          {message && <p className={`${messageColor} text-xs mt-1`}>{message}</p>}
        </div>
      </div>
    </div>
  );
};
