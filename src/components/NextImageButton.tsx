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
  className = '',
}) => {
  const buttonText = variant === 'new' ? '新しい画像' : '次の画像';
  const loadingText =
    variant === 'new' ? '新しい画像を取得中...' : '読み込み中...';

  return (
    <button
      onClick={onClick}
      disabled={loading || disabled}
      className={`${styles.modernButtonUnified} ${styles.modernButtonNext} ${className}`}
    >
      {loading ? (
        <>
          <span className="loading loading-spinner loading-sm"></span>
          <span className="font-semibold">{loadingText}</span>
        </>
      ) : (
        <>
          {variant === 'next' ? (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-2 w-2"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={3}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          ) : (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-2 w-2"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={3}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M9 5l7 7-7 7"
              />
            </svg>
          )}
          <span className="font-semibold">{buttonText}</span>
        </>
      )}
    </button>
  );
};
