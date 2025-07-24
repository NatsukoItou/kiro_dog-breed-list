import type { AppAction, AppState } from '../types';

// アクションクリエーター
export const actions = {
  setLoading: (loading: boolean): AppAction => ({
    type: 'SET_LOADING',
    payload: loading,
  }),

  setError: (error: string | null): AppAction => ({
    type: 'SET_ERROR',
    payload: error,
  }),

  setCurrentImage: (image: AppState['currentImage']): AppAction => ({
    type: 'SET_CURRENT_IMAGE',
    payload: image,
  }),

  setBreeds: (breeds: string[]): AppAction => ({
    type: 'SET_BREEDS',
    payload: breeds,
  }),

  setSelectedBreed: (breed: string | null): AppAction => ({
    type: 'SET_SELECTED_BREED',
    payload: breed,
  }),

  addToFavorites: (image: AppState['favorites'][0]): AppAction => ({
    type: 'ADD_TO_FAVORITES',
    payload: image,
  }),

  removeFromFavorites: (imageId: string): AppAction => ({
    type: 'REMOVE_FROM_FAVORITES',
    payload: imageId,
  }),

  setFavorites: (favorites: AppState['favorites']): AppAction => ({
    type: 'SET_FAVORITES',
    payload: favorites,
  }),

  clearAllFavorites: (): AppAction => ({
    type: 'CLEAR_ALL_FAVORITES',
  }),
};