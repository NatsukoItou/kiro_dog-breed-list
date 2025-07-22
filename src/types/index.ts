// 犬種データの型定義
export interface DogBreed {
  id: string;
  name: string;
  imageUrl: string;
  subBreeds?: string[];
}

// APIレスポンスの型定義
export interface DogApiResponse {
  message: string | string[] | Record<string, string[]>;
  status: string;
}

// アプリケーションの状態管理用の型
export interface AppState {
  breeds: DogBreed[];
  loading: boolean;
  error: string | null;
  selectedBreed: DogBreed | null;
}