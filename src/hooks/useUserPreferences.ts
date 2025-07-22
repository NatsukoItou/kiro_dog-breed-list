import { useCallback } from 'react';
import { useLocalStorage } from './useLocalStorage';
import { LOCAL_STORAGE_KEYS } from '../constants/localStorage';
import type { UserPreferences, UseUserPreferencesReturn } from '../types';

/**
 * ユーザー設定を管理するカスタムフック
 * 関数型更新を使用してパフォーマンスを最適化
 */
export function useUserPreferences(): UseUserPreferencesReturn {
  const { value: preferences, setValue: setPreferences } = useLocalStorage<UserPreferences>(
    LOCAL_STORAGE_KEYS.PREFERENCES,
    {}
  );

  // 最後に選択した犬種を保存（関数型更新を使用）
  const setLastSelectedBreed = useCallback((breed: string | null) => {
    setPreferences(prev => ({
      ...prev,
      lastSelectedBreed: breed || undefined,
    }));
  }, [setPreferences]);

  // テーマを設定（関数型更新を使用）
  const setTheme = useCallback((theme: 'light' | 'dark') => {
    setPreferences(prev => ({
      ...prev,
      theme,
    }));
  }, [setPreferences]);

  // 画像サイズを設定（関数型更新を使用）
  const setImageSize = useCallback((size: 'small' | 'medium' | 'large') => {
    setPreferences(prev => ({
      ...prev,
      imageSize: size,
    }));
  }, [setPreferences]);

  // 設定をリセット
  const resetPreferences = useCallback(() => {
    setPreferences({});
  }, [setPreferences]);

  return {
    preferences,
    setLastSelectedBreed,
    setTheme,
    setImageSize,
    resetPreferences,
  };
}