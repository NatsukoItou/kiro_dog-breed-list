import { useReducer } from 'react';
import type { ReactNode } from 'react';
import { appReducer, initialState } from './appReducer';
import { AppContext } from './context';

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

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}
