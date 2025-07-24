import { useCallback, useEffect } from 'react';
import { useLocalStorage } from './useLocalStorage';
import { useAppState } from './useAppState';
import { LOCAL_STORAGE_KEYS } from '../constants/localStorage';
import type { DogImage, UseFavoritesReturn } from '../types';

/**
 * お気に入り機能を管理するカスタムフック
 * ローカルストレージとの同期を含む
 * 状態管理の競合を避けるため、単一の信頼できる情報源を使用
 */
export function useFavorites(): UseFavoritesReturn {
  const { favorites, setFavorites, addToFavorites: addToState, removeFromFavorites: removeFromState, clearAllFavorites: clearAllFromState } = useAppState();
  
  // ローカルストレージからお気に入りを管理
  const { value: storedFavorites, setValue: setStoredFavorites } = useLocalStorage<DogImage[]>(
    LOCAL_STORAGE_KEYS.FAVORITES,
    []
  );

  // 初回ロード時にローカルストレージからお気に入りを復元
  useEffect(() => {
    if (storedFavorites.length > 0 && favorites.length === 0) {
      // Date文字列をDateオブジェクトに変換
      const favoritesWithDates = storedFavorites.map(fav => ({
        ...fav,
        addedAt: new Date(fav.addedAt)
      }));
      setFavorites(favoritesWithDates);
    }
  }, [storedFavorites, favorites.length, setFavorites]);

  // アプリケーション状態の変更をローカルストレージに同期
  useEffect(() => {
    setStoredFavorites(favorites);
  }, [favorites, setStoredFavorites]);

  // お気に入りに追加（単一の信頼できる情報源を使用）
  const addToFavorites = useCallback((image: DogImage) => {
    addToState(image);
  }, [addToState]);

  // お気に入りから削除（単一の信頼できる情報源を使用）
  const removeFromFavorites = useCallback((imageId: string) => {
    removeFromState(imageId);
    // 削除後の状態を即座にローカルストレージに反映
    const updatedFavorites = favorites.filter(fav => fav.id !== imageId);
    setStoredFavorites(updatedFavorites);
  }, [removeFromState, favorites, setStoredFavorites]);

  // すべてのお気に入りをクリア
  const clearAllFavorites = useCallback(() => {
    clearAllFromState();
    // ローカルストレージも即座にクリア
    setStoredFavorites([]);
  }, [clearAllFromState, setStoredFavorites]);

  // お気に入りかどうかをチェック
  const isFavorite = useCallback((imageId: string): boolean => {
    return favorites.some(fav => fav.id === imageId);
  }, [favorites]);

  return {
    favorites,
    addToFavorites,
    removeFromFavorites,
    clearAllFavorites,
    isFavorite,
  };
}