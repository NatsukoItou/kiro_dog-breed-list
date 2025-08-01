import React, { memo } from 'react';
import { useLazyImage } from '../hooks/useLazyImage';
import { Loading } from './Loading';

interface LazyImageProps {
  src: string;
  alt: string;
  className?: string;
  placeholder?: string;
  onError?: () => void;
  rootMargin?: string;
  threshold?: number;
}

/**
 * 遅延読み込み対応の画像コンポーネント
 * Intersection Observer APIを使用してパフォーマンスを最適化
 */
export const LazyImage: React.FC<LazyImageProps> = memo(({
  src,
  alt,
  className = '',
  placeholder,
  onError,
  rootMargin = '50px',
  threshold = 0.1,
}) => {
  const { imageSrc, isLoading, isError, imageRef, retry } = useLazyImage({
    src,
    placeholder,
    rootMargin,
    threshold,
  });

  const handleError = () => {
    if (onError) {
      onError();
    }
  };

  const handleRetry = () => {
    retry();
    if (onError) {
      onError();
    }
  };

  return (
    <div className="relative">
      <img
        ref={imageRef}
        src={imageSrc}
        alt={alt}
        className={`${className} transition-opacity duration-300 ${
          isLoading ? 'opacity-50' : 'opacity-100'
        }`}
        onError={handleError}
      />
      
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-base-200/50 rounded-lg">
          <Loading size="small" variant="spinner" />
        </div>
      )}
      
      {isError && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-base-200/80 rounded-lg">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-8 w-8 text-error mb-2"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
            />
          </svg>
          <p className="text-sm text-error mb-2">読み込みエラー</p>
          <button
            onClick={handleRetry}
            className="btn btn-xs btn-outline btn-error"
          >
            再試行
          </button>
        </div>
      )}
    </div>
  );
});

LazyImage.displayName = 'LazyImage';