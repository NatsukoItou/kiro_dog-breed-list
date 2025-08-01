import React, { useCallback, useState } from 'react';
import { FavoritesList } from '../components/FavoritesList';
import { EmptyFavoritesUI } from '../components/FallbackUI';
import { useFavorites } from '../hooks/useFavorites';
import { useToast } from '../hooks/useToast';
import { useIsMobile } from '../hooks/useResponsive';
import styles from '../styles/responsive.module.css';

export const FavoritesPage: React.FC = () => {
  const {
    favorites,
    removeFromFavorites,
    clearAllFavorites: clearAll,
  } = useFavorites();
  const { showSuccess, showInfo } = useToast();
  const [showConfirmDialog, setShowConfirmDialog] = useState<string | null>(
    null
  );
  const isMobile = useIsMobile();

  const handleRemoveFavorite = useCallback(
    (imageId: string) => {
      removeFromFavorites(imageId);
      showSuccess('お気に入りから削除しました');
    },
    [removeFromFavorites, showSuccess]
  );

  const confirmRemove = useCallback(() => {
    if (showConfirmDialog) {
      removeFromFavorites(showConfirmDialog);
      setShowConfirmDialog(null);
    }
  }, [showConfirmDialog, removeFromFavorites]);

  const cancelRemove = useCallback(() => {
    setShowConfirmDialog(null);
  }, []);

  const clearAllFavorites = useCallback(() => {
    if (favorites.length > 0) {
      const confirmed = window.confirm(
        'すべてのお気に入りを削除しますか？この操作は取り消せません。'
      );
      if (confirmed) {
        clearAll();
        showInfo('すべてのお気に入りを削除しました');
      }
    }
  }, [favorites.length, clearAll, showInfo]);

  return (
    <div className={`${styles.container} ${styles.main}`}>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between mb-10 gap-6">
        <div className="flex-1">
          <h1 className={`text-3xl font-bold text-base-content mb-3`}>
            お気に入り
          </h1>
          <p className={`text-base-content/70 text-lg mb-0`}>
            {isMobile ? '保存した犬の画像' : '保存した犬の画像を管理できます'}
          </p>
          {favorites.length > 0 && (
            <p className="text-sm text-base-content/60 mt-2">
              {favorites.length}件のお気に入り画像
            </p>
          )}
        </div>

        {favorites.length > 0 && (
          <div className="flex gap-2 flex-shrink-0">
            <button
              onClick={clearAllFavorites}
              className="btn btn-error btn-sm text-white hover:btn-error"
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
              すべて削除
            </button>
          </div>
        )}
      </div>

      {/* Main content */}
      {favorites.length === 0 ? (
        <EmptyFavoritesUI />
      ) : (
        <FavoritesList
          favorites={favorites}
          onRemoveFavorite={handleRemoveFavorite}
        />
      )}

      {/* Confirmation Dialog */}
      {showConfirmDialog && (
        <div className="modal modal-open">
          <div className="modal-box">
            <h3 className="font-bold text-lg mb-4">確認</h3>
            <p className="py-4">この画像をお気に入りから削除しますか？</p>
            <div className="modal-action">
              <button onClick={cancelRemove} className="btn btn-outline">
                キャンセル
              </button>
              <button onClick={confirmRemove} className="btn btn-error">
                削除
              </button>
            </div>
          </div>
          <div className="modal-backdrop" onClick={cancelRemove}></div>
        </div>
      )}
    </div>
  );
};
