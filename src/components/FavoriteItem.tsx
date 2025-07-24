import React, { useCallback } from 'react';
import type { FavoriteItemProps } from '../types';

export const FavoriteItem: React.FC<FavoriteItemProps> = ({
  image,
  onRemove
}) => {
  const handleRemove = useCallback(() => {
    onRemove(image.id);
  }, [image.id, onRemove]);

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('ja-JP', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  return (
    <div className="card bg-base-100 shadow-md hover:shadow-lg transition-shadow">
      <figure className="px-4 pt-4">
        <img
          src={image.url}
          alt={image.breed ? `${image.breed}の画像` : '犬の画像'}
          className="rounded-xl w-full h-48 object-cover"
          loading="lazy"
        />
      </figure>

      <div className="card-body p-4">
        <div className="flex justify-between items-start mb-2">
          <div className="flex-1">
            {image.breed && (
              <div className="badge badge-primary badge-sm mb-2 capitalize">
                {image.breed.replace('/', ' - ')}
              </div>
            )}
            <p className="text-xs text-base-content/60">
              追加日時: {formatDate(image.addedAt)}
            </p>
          </div>

          <button
            onClick={handleRemove}
            className="btn btn-sm btn-error hover:btn-error text-white"
            title="お気に入りから削除"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4 mr-1"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
              />
            </svg>
            削除
          </button>
        </div>

        <div className="card-actions justify-end">
          <button
            className="btn btn-sm btn-outline"
            onClick={() => window.open(image.url, '_blank')}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4 mr-1"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
              />
            </svg>
            拡大表示
          </button>
        </div>
      </div>
    </div>
  );
};