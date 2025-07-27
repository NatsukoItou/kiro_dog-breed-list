import React from 'react';
import styles from '../styles/responsive.module.css';

interface NextImageButtonProps {
  onClick: () => void;
  loading?: boolean;
  disabled?: boolean;
  variant?: 'next' | 'new';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const NextImageButton: React.FC<NextImageButtonProps> = ({
  onClick,
  loading = false,
  disabled = false,
  variant = 'next',
  className = ''
}) => {
  const buttonText = variant === 'new' ? '新しい画像' : '次の画像';
  const loadingText = variant === 'new' ? '新しい画像を取得中...' : '読み込み中...';
  
  return (
    <button
      onClick={onClick}
      disabled={loading || disabled}
      className={`${styles.modernButton} ${styles.modernButtonNext} ${className}`}
    >
      {loading ? (
        <>
          <span className="loading loading-spinner loading-sm"></span>
          <span className="font-semibold">{loadingText}</span>
        </>
      ) : (
        <>
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          <span className="font-semibold">{buttonText}</span>
        </>
      )}
    </button>
  );
};