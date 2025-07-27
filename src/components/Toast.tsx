import { useEffect, useState, useCallback } from 'react';
import { createPortal } from 'react-dom';

export type ToastType = 'success' | 'error' | 'warning' | 'info';

export interface ToastMessage {
  id: string;
  type: ToastType;
  title: string;
  message?: string;
  duration?: number;
  action?: {
    label: string;
    onClick: () => void;
  };
}

interface ToastProps {
  toast: ToastMessage;
  onClose: (id: string) => void;
}

/**
 * 個別のトーストコンポーネント
 */
function Toast({ toast, onClose }: ToastProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [isLeaving, setIsLeaving] = useState(false);

  useEffect(() => {
    // マウント時にアニメーション開始
    const timer = setTimeout(() => setIsVisible(true), 10);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    // 自動削除タイマー
    if (toast.duration && toast.duration > 0) {
      const timer = setTimeout(() => {
        handleClose();
      }, toast.duration);
      return () => clearTimeout(timer);
    }
  }, [toast.duration, handleClose]);

  const handleClose = useCallback(() => {
    setIsLeaving(true);
    setTimeout(() => {
      onClose(toast.id);
    }, 300); // アニメーション時間
  }, [onClose, toast.id]);

  const getToastStyles = () => {
    const baseStyles =
      'alert shadow-lg transform transition-all duration-300 ease-in-out';
    const typeStyles = {
      success: 'alert-success',
      error: 'alert-error',
      warning: 'alert-warning',
      info: 'alert-info',
    };

    const animationStyles = isLeaving
      ? 'translate-x-full opacity-0'
      : isVisible
        ? 'translate-x-0 opacity-100'
        : 'translate-x-full opacity-0';

    return `${baseStyles} ${typeStyles[toast.type]} ${animationStyles}`;
  };

  const getIcon = () => {
    switch (toast.type) {
      case 'success':
        return (
          <svg
            className="stroke-current shrink-0 h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        );
      case 'error':
        return (
          <svg
            className="stroke-current shrink-0 h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        );
      case 'warning':
        return (
          <svg
            className="stroke-current shrink-0 h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
            />
          </svg>
        );
      case 'info':
        return (
          <svg
            className="stroke-current shrink-0 h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        );
    }
  };

  return (
    <div className={getToastStyles()}>
      {getIcon()}
      <div className="flex-1">
        <div className="font-bold">{toast.title}</div>
        {toast.message && (
          <div className="text-sm opacity-90">{toast.message}</div>
        )}
      </div>
      <div className="flex gap-2">
        {toast.action && (
          <button
            className="btn btn-sm btn-ghost"
            onClick={toast.action.onClick}
          >
            {toast.action.label}
          </button>
        )}
        <button
          className="btn btn-sm btn-ghost"
          onClick={handleClose}
          aria-label="閉じる"
        >
          ✕
        </button>
      </div>
    </div>
  );
}

interface ToastContainerProps {
  toasts: ToastMessage[];
  onClose: (id: string) => void;
}

/**
 * トーストコンテナコンポーネント
 */
export function ToastContainer({ toasts, onClose }: ToastContainerProps) {
  if (toasts.length === 0) return null;

  return createPortal(
    <div className="toast toast-end z-50">
      {toasts.map((toast) => (
        <Toast key={toast.id} toast={toast} onClose={onClose} />
      ))}
    </div>,
    document.body
  );
}
