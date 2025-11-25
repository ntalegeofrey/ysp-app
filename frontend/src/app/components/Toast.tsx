'use client';

import { useEffect } from 'react';

export type ToastTone = 'success' | 'error' | 'info' | 'warning';

export interface Toast {
  id: string;
  title: string;
  tone: ToastTone;
}

interface ToastProps {
  toast: Toast;
  onRemove: (id: string) => void;
}

function SingleToast({ toast, onRemove }: ToastProps) {
  const getIcon = () => {
    switch (toast.tone) {
      case 'success':
        return 'fa-circle-check text-success';
      case 'error':
        return 'fa-circle-exclamation text-error';
      case 'warning':
        return 'fa-triangle-exclamation text-warning';
      case 'info':
      default:
        return 'fa-circle-info text-primary';
    }
  };

  const getBorderColor = () => {
    switch (toast.tone) {
      case 'success':
        return 'border-success';
      case 'error':
        return 'border-error';
      case 'warning':
        return 'border-warning';
      case 'info':
      default:
        return 'border-bd';
    }
  };

  return (
    <div
      className={`min-w-[260px] max-w-sm shadow-lg rounded-lg border p-3 flex items-start gap-3 bg-white ${getBorderColor()} animate-slide-in-right`}
    >
      <i className={`fa-solid ${getIcon()} mt-1`}></i>
      <div className="flex-1 text-sm text-font-base">{toast.title}</div>
      <button
        onClick={() => onRemove(toast.id)}
        className="text-font-detail hover:text-font-base transition-colors"
        aria-label="Close notification"
      >
        <i className="fa-solid fa-xmark"></i>
      </button>
    </div>
  );
}

interface ToastContainerProps {
  toasts: Toast[];
  onRemove: (id: string) => void;
}

export default function ToastContainer({ toasts, onRemove }: ToastContainerProps) {
  return (
    <div className="fixed top-4 right-4 z-50 space-y-2">
      {toasts.map((toast) => (
        <SingleToast key={toast.id} toast={toast} onRemove={onRemove} />
      ))}
    </div>
  );
}
