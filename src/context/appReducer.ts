import type { AppState, AppAction } from '../types';

// 初期状態
export const initialState: AppState = {
  currentImage: null,
  breeds: [],
  selectedBreed: null,
  favorites: [],
  loading: false,
  error: null,
};

// リデューサー関数
export function appReducer(state: AppState, action: AppAction): AppState {
  switch (action.type) {
    case 'SET_LOADING':
      return {
        ...state,
        loading: action.payload,
        error: action.payload ? null : state.error, // ローディング開始時はエラーをクリア
      };

    case 'SET_ERROR':
      return {
        ...state,
        error: action.payload,
        loading: false, // エラー発生時はローディングを停止
      };

    case 'SET_CURRENT_IMAGE':
      return {
        ...state,
        currentImage: action.payload,
        loading: false,
        error: null,
      };

    case 'SET_BREEDS':
      return {
        ...state,
        breeds: action.payload,
        loading: false,
        error: null,
      };

    case 'SET_SELECTED_BREED':
      return {
        ...state,
        selectedBreed: action.payload,
      };

    case 'ADD_TO_FAVORITES': {
      // 重複チェック
      const existingFavorite = state.favorites.find(
        (fav) => fav.id === action.payload.id
      );
      if (existingFavorite) {
        return state; // 既に存在する場合は何もしない
      }

      return {
        ...state,
        favorites: [...state.favorites, action.payload],
      };
    }

    case 'REMOVE_FROM_FAVORITES':
      return {
        ...state,
        favorites: state.favorites.filter((fav) => fav.id !== action.payload),
      };

    case 'SET_FAVORITES':
      return {
        ...state,
        favorites: action.payload,
      };

    case 'CLEAR_ALL_FAVORITES':
      return {
        ...state,
        favorites: [],
      };

    default:
      return state;
  }
}
