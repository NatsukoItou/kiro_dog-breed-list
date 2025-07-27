import { useState, useCallback } from 'react';
import type { ReactNode } from 'react';
import { ToastContainer } from '../components/Toast';
import type { ToastMessage } from '../components/Toast';
import { ToastContext } from './ToastContextDefinition';
import type { ToastContextType } from './ToastContextDefinition';

interface ToastProviderProps {
  children: ReactNode;
}

/**
 * トースト通知のプロバイダーコンポーネント
 */
export function ToastProvider({ children }: ToastProviderProps) {
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const generateId = useCallback(() => {
    return `toast-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }, []);

  const showToast = useCallback(
    (
      type: ToastType,
      title: string,
      message?: string,
      options?: {
        duration?: number;
        action?: {
          label: string;
          onClick: () => void;
        };
      }
    ) => {
      const id = generateId();
      const newToast: ToastMessage = {
        id,
        type,
        title,
        message,
        duration: options?.duration ?? (type === 'error' ? 0 : 5000), // エラーは手動で閉じる
        action: options?.action,
      };

      setToasts((prev) => [...prev, newToast]);
    },
    [generateId]
  );

  const showSuccess = useCallback(
    (title: string, message?: string) => {
      showToast('success', title, message);
    },
    [showToast]
  );

  const showError = useCallback(
    (title: string, message?: string) => {
      showToast('error', title, message);
    },
    [showToast]
  );

  const showWarning = useCallback(
    (title: string, message?: string) => {
      showToast('warning', title, message);
    },
    [showToast]
  );

  const showInfo = useCallback(
    (title: string, message?: string) => {
      showToast('info', title, message);
    },
    [showToast]
  );

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  }, []);

  const clearAllToasts = useCallback(() => {
    setToasts([]);
  }, []);

  const value: ToastContextType = {
    showToast,
    showSuccess,
    showError,
    showWarning,
    showInfo,
    removeToast,
    clearAllToasts,
  };

  return (
    <ToastContext.Provider value={value}>
      {children}
      <ToastContainer toasts={toasts} onClose={removeToast} />
    </ToastContext.Provider>
  );
}
