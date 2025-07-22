import { useCallback, useEffect } from 'react';
import { useLocalStorage } from './useLocalStorage';
import { useAppState } from './useAppState';
import type { DogImage, UseFavoritesReturn } from '../types';

/**
 * お気に入り機能を管理するカスタムフック
 * ローカルストレージとの同期を含む
 */
export function useFavorites(): UseFavoritesReturn {
  const { favorites, setFavorites, addToFavorites: addToState, removeFromFavorites: removeFromState } = useAppState();
  
  // ローカルストレージからお気に入りを管理
  const { value: storedFavorites, setValue: setStoredFavorites } = useLocalStorage<DogImage[]>(
    'dogApp.favorites',
    []
  );

  // 初回ロード時にローカルストレージからお気に入りを復元
  useEffect(() => {
    if (storedFavorites.length > 0 && favorites.length === 0) {
      setFavorites(storedFavorites);
    }
  }, [storedFavorites, favorites.length, setFavorites]);

  // お気に入りに追加
  const addToFavorites = useCallback((image: DogImage) => {
    // 既に存在するかチェック
    const exists = favorites.some(fav => fav.id === image.id);
    if (exists) {
      return;
    }

    const newFavorites = [...favorites, image];
    
    // 状態とローカルストレージの両方を更新
    addToState(image);
    setStoredFavorites(newFavorites);
  }, [favorites, addToState, setStoredFavorites]);

  // お気に入りから削除
  const removeFromFavorites = useCallback((imageId: string) => {
    const newFavorites = favorites.filter(fav => fav.id !== imageId);
    
    // 状態とローカルストレージの両方を更新
    removeFromState(imageId);
    setStoredFavorites(newFavorites);
  }, [favorites, removeFromState, setStoredFavorites]);

  // お気に入りかどうかをチェック
  const isFavorite = useCallback((imageId: string): boolean => {
    return favorites.some(fav => fav.id === imageId);
  }, [favorites]);

  return {
    favorites,
    addToFavorites,
    removeFromFavorites,
    isFavorite,
  };
}