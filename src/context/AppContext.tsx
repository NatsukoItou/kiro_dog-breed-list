import React, { createContext, useContext, useReducer } from 'react';
import type { ReactNode } from 'react';
import type { AppState, AppAction } from '../types';
import { appReducer, initialState } from './appReducer';

// Context の型定義
interface AppContextType {
  state: AppState;
  dispatch: React.Dispatch<AppAction>;
}

// Context の作成
const AppContext = createContext<AppContextType | undefined>(undefined);

// Provider コンポーネントの Props 型
interface AppProviderProps {
  children: ReactNode;
}

// Provider コンポーネント
export function AppProvider({ children }: AppProviderProps) {
  const [state, dispatch] = useReducer(appReducer, initialState);

  const value = {
    state,
    dispatch,
  };

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
}

// Context を使用するためのカスタムフック
export function useAppContext() {
  const context = useContext(AppContext);
  
  if (context === undefined) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  
  return context;
}

// アクションクリエーター（オプション：使いやすさのため）
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
};