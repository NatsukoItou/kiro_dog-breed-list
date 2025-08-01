import React, { useCallback, memo } from 'react';
import { useIsMobile } from '../hooks/useResponsive';
import { LazyImage } from './LazyImage';
import styles from '../styles/responsive.module.css';
import type { FavoriteItemProps } from '../types';

export const FavoriteItem: React.FC<FavoriteItemProps> = memo(({
  image,
  onRemove,
}) => {
  const isMobile = useIsMobile();
  const handleRemove = useCallback(() => {
    onRemove(image.id);
  }, [image.id, onRemove]);

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('ja-JP', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(date);
  };

  return (
    <div
      className={`${styles.favoriteItem} ${styles.card} bg-base-100 shadow-md hover:shadow-lg transition-shadow`}
    >
      <div className={`${styles.favoriteImageContainer}`}>
        <LazyImage
          src={image.url}
          alt={image.breed ? `${image.breed}の画像` : '犬の画像'}
          className={`${styles.favoriteImage} rounded-xl object-cover`}
          rootMargin="200px"
          threshold={0.1}
        />
      </div>

      <div className={`${styles.favoriteInfo}`}>
        <div className="flex flex-col h-full">
          <div className="flex-1">
            {image.breed && (
              <div
                className={`${styles.favoriteTitle} badge badge-primary badge-sm mb-2`}
              >
                {image.breed.replace('/', ' - ')}
              </div>
            )}
            <p
              className={`${styles.favoriteDate} text-sm text-base-content/70 mb-4`}
            >
              {formatDate(image.addedAt)}
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-2 mt-auto">
            <button
              className={`${styles.button} btn btn-sm btn-outline flex-1`}
              onClick={() => window.open(image.url, '_blank')}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4 mr-1"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                />
              </svg>
              {isMobile ? '拡大' : '拡大表示'}
            </button>

            <button
              onClick={handleRemove}
              className={`${styles.button} btn btn-sm btn-error hover:btn-error text-white flex-1`}
              title="お気に入りから削除"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4 mr-1"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                />
              </svg>
              削除
            </button>
          </div>
        </div>
      </div>
    </div>
  );
});

FavoriteItem.displayName = 'FavoriteItem';
