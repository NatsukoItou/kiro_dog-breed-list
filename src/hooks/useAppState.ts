import { useAppContext, actions } from '../context/AppContext';
import type { DogImage } from '../types';

/**
 * アプリケーション状態を管理するためのカスタムフック
 * Context API と useReducer を使用した状態管理の便利なインターフェースを提供
 */
export function useAppState() {
  const { state, dispatch } = useAppContext();

  // 状態更新のヘルパー関数
  const setLoading = (loading: boolean) => {
    dispatch(actions.setLoading(loading));
  };

  const setError = (error: string | null) => {
    dispatch(actions.setError(error));
  };

  const setCurrentImage = (image: DogImage | null) => {
    dispatch(actions.setCurrentImage(image));
  };

  const setBreeds = (breeds: string[]) => {
    dispatch(actions.setBreeds(breeds));
  };

  const setSelectedBreed = (breed: string | null) => {
    dispatch(actions.setSelectedBreed(breed));
  };

  const addToFavorites = (image: DogImage) => {
    dispatch(actions.addToFavorites(image));
  };

  const removeFromFavorites = (imageId: string) => {
    dispatch(actions.removeFromFavorites(imageId));
  };

  const setFavorites = (favorites: DogImage[]) => {
    dispatch(actions.setFavorites(favorites));
  };

  // お気に入りチェック用のヘルパー関数
  const isFavorite = (imageId: string): boolean => {
    return state.favorites.some(fav => fav.id === imageId);
  };

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