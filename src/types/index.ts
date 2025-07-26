// Dog CEO API レスポンス型
export interface DogApiResponse {
  message: string | string[];
  status: string;
}

export interface BreedListResponse {
  message: Record<string, string[]>;
  status: string;
}

// アプリケーション型
export interface DogImage {
  id: string;
  url: string;
  breed?: string;
  addedAt: Date;
}

export interface DogBreed {
  id: string;
  name: string;
  subBreeds: string[];
}

// アプリケーション状態型
export interface AppState {
  currentImage: DogImage | null;
  breeds: string[];
  selectedBreed: string | null;
  favorites: DogImage[];
  loading: boolean;
  error: string | null;
}

// アクション型
export type AppAction =
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'SET_CURRENT_IMAGE'; payload: DogImage | null }
  | { type: 'SET_BREEDS'; payload: string[] }
  | { type: 'SET_SELECTED_BREED'; payload: string | null }
  | { type: 'ADD_TO_FAVORITES'; payload: DogImage }
  | { type: 'REMOVE_FROM_FAVORITES'; payload: string }
  | { type: 'SET_FAVORITES'; payload: DogImage[] }
  | { type: 'CLEAR_ALL_FAVORITES' };

// コンポーネント Props 型
export interface RandomDogImageProps {
  onImageLoad?: (image: DogImage) => void;
  onError?: (error: string) => void;
}

export interface BreedSelectorProps {
  breeds: string[];
  selectedBreed: string | null;
  onBreedSelect: (breed: string) => void;
  loading?: boolean;
}

export interface DogImageProps {
  image: DogImage | null;
  loading?: boolean;
  onFavoriteToggle?: (image: DogImage) => void;
  isFavorite?: boolean;
}

export interface ImageControlsProps {
  onNextImage: () => void;
  onAddToFavorites: () => void;
  loading?: boolean;
  canAddToFavorites?: boolean;
  isFavorite?: boolean;
}

export interface FavoritesListProps {
  favorites: DogImage[];
  onRemoveFavorite: (imageId: string) => void;
}

export interface FavoriteItemProps {
  image: DogImage;
  onRemove: (imageId: string) => void;
}

export interface HeaderProps {
  title?: string;
}

export interface NavigationProps {
  currentPath?: string;
}

export interface LoadingProps {
  message?: string;
  size?: 'small' | 'medium' | 'large';
}

// カスタムフック型
export interface UseDogApiReturn {
  getRandomImage: () => Promise<DogImage>;
  getBreedImage: (breed: string) => Promise<DogImage>;
  getBreedsList: () => Promise<string[]>;
  loading: boolean;
  error: string | null;
}

export interface UseFavoritesReturn {
  favorites: DogImage[];
  addToFavorites: (image: DogImage) => void;
  removeFromFavorites: (imageId: string) => void;
  clearAllFavorites: () => void;
  isFavorite: (imageId: string) => boolean;
}

export interface UseLocalStorageReturn<T> {
  value: T;
  setValue: (value: T | ((prev: T) => T)) => void;
  removeValue: () => void;
}

export interface UseUserPreferencesReturn {
  preferences: UserPreferences;
  setLastSelectedBreed: (breed: string | null) => void;
  setTheme: (theme: 'light' | 'dark') => void;
  setImageSize: (size: 'small' | 'medium' | 'large') => void;
  resetPreferences: () => void;
}

// ローカルストレージ型
export interface LocalStorageData {
  favorites: DogImage[];
  preferences: UserPreferences;
}

// ユーザー設定型
export interface UserPreferences {
  lastSelectedBreed?: string;
  theme?: 'light' | 'dark';
  imageSize?: 'small' | 'medium' | 'large';
}

// エラー型
export interface ApiError {
  message: string;
  status?: number;
  code?: string;
}