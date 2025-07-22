import { useCallback } from 'react';
import { useLocalStorage } from './useLocalStorage';
import type { UserPreferences, UseUserPreferencesReturn } from '../types';

/**
 * ユーザー設定を管理するカスタムフック
 */
export function useUserPreferences(): UseUserPreferencesReturn {
  const { value: preferences, setValue: setPreferences } = useLocalStorage<UserPreferences>(
    'dogApp.preferences',
    {}
  );

  // 最後に選択した犬種を保存
  const setLastSelectedBreed = useCallback((breed: string | null) => {
    setPreferences({
      ...preferences,
      lastSelectedBreed: breed || undefined,
    });
  }, [preferences, setPreferences]);

  // テーマを設定
  const setTheme = useCallback((theme: 'light' | 'dark') => {
    setPreferences({
      ...preferences,
      theme,
    });
  }, [preferences, setPreferences]);

  // 画像サイズを設定
  const setImageSize = useCallback((size: 'small' | 'medium' | 'large') => {
    setPreferences({
      ...preferences,
      imageSize: size,
    });
  }, [preferences, setPreferences]);

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