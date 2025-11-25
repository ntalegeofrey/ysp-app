'use client';

import { useState, useCallback } from 'react';
import { Toast, ToastTone } from '../components/Toast';

export function useToast() {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const addToast = useCallback(
    (title: string, tone: ToastTone = 'info', duration: number = 3500) => {
      const id = String(Date.now() + Math.random());
      const newToast: Toast = { id, title, tone };
      
      setToasts((prev) => [...prev, newToast]);
      
      // Auto-remove after duration
      setTimeout(() => {
        removeToast(id);
      }, duration);

      return id;
    },
    [removeToast]
  );

  return {
    toasts,
    addToast,
    removeToast,
  };
}
