import { createContext } from 'react';
import type { AppState, AppAction } from '../types';

// Context の型定義
export interface AppContextType {
  state: AppState;
  dispatch: React.Dispatch<AppAction>;
}

// Context の作成
export const AppContext = createContext<AppContextType | undefined>(undefined);
