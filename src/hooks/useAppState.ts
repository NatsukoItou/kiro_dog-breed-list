import { useCallback } from 'react';
import { useAppContext } from './useAppContext';
import { actions } from '../context/actions';
import type { DogImage } from '../types';

/**
 * アプリケーション状態を管理するためのカスタムフック
 * Context API と useReducer を使用した状態管理の便利なインターフェースを提供
 */
export function useAppState() {
  const { state, dispatch } = useAppContext();

  // 状態更新のヘルパー関数（useCallbackで安定化）
  const setLoading = useCallback((loading: boolean) => {
    dispatch(actions.setLoading(loading));
  }, [dispatch]);

  const setError = useCallback((error: string | null) => {
    dispatch(actions.setError(error));
  }, [dispatch]);

  const setCurrentImage = useCallback((image: DogImage | null) => {
    dispatch(actions.setCurrentImage(image));
  }, [dispatch]);

  const setBreeds = useCallback((breeds: string[]) => {
    dispatch(actions.setBreeds(breeds));
  }, [dispatch]);

  const setSelectedBreed = useCallback((breed: string | null) => {
    dispatch(actions.setSelectedBreed(breed));
  }, [dispatch]);

  const addToFavorites = useCallback((image: DogImage) => {
    dispatch(actions.addToFavorites(image));
  }, [dispatch]);

  const removeFromFavorites = useCallback((imageId: string) => {
    dispatch(actions.removeFromFavorites(imageId));
  }, [dispatch]);

  const setFavorites = useCallback((favorites: DogImage[]) => {
    dispatch(actions.setFavorites(favorites));
  }, [dispatch]);

  // お気に入りチェック用のヘルパー関数
  const isFavorite = useCallback((imageId: string): boolean => {
    return state.favorites.some(fav => fav.id === imageId);
  }, [state.favorites]);

  return {
    // 状態
    ...state,
    
    // アクション
    setLoading,
    setError,
    setCurrentImage,
    setBreeds,
    setSelectedBreed,
    addToFavorites,
    removeFromFavorites,
    setFavorites,
    
    // ヘルパー
    isFavorite,
  };
}