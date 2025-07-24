import React, { useCallback, useState } from 'react';
import { FavoritesList } from '../components/FavoritesList';
import { useFavorites } from '../hooks/useFavorites';

export const FavoritesPage: React.FC = () => {
  const { favorites, removeFromFavorites, clearAllFavorites: clearAll } = useFavorites();
  const [showConfirmDialog, setShowConfirmDialog] = useState<string | null>(null);



  const handleRemoveFavorite = useCallback((imageId: string) => {
    removeFromFavorites(imageId);
  }, [removeFromFavorites]);

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
      const confirmed = window.confirm('すべてのお気に入りを削除しますか？この操作は取り消せません。');
      if (confirmed) {
        clearAll();
      }
    }
  }, [favorites.length, clearAll]);

  return (
    <div className="container mx-auto px-4 py-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-base-content mb-2">
            お気に入り
          </h1>
          <p className="text-base-content/70">
            保存した犬の画像を管理できます
          </p>
        </div>

        {favorites.length > 0 && (
          <div className="flex gap-2">
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
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" 
                />
              </svg>
              すべて削除
            </button>
          </div>
        )}
      </div>

      {/* Main content */}
      <FavoritesList 
        favorites={favorites} 
        onRemoveFavorite={handleRemoveFavorite} 
      />

      {/* Confirmation Dialog */}
      {showConfirmDialog && (
        <div className="modal modal-open">
          <div className="modal-box">
            <h3 className="font-bold text-lg mb-4">確認</h3>
            <p className="py-4">
              この画像をお気に入りから削除しますか？
            </p>
            <div className="modal-action">
              <button 
                onClick={cancelRemove}
                className="btn btn-outline"
              >
                キャンセル
              </button>
              <button 
                onClick={confirmRemove}
                className="btn btn-error"
              >
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