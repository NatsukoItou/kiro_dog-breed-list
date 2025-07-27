import { useState, useEffect, useCallback } from 'react';
import type { UseLocalStorageReturn } from '../types';

/**
 * ローカルストレージとの同期を行うカスタムフック
 * @param key ローカルストレージのキー
 * @param defaultValue デフォルト値
 * @returns 値、値の設定関数、値の削除関数
 */
export function useLocalStorage<T>(
  key: string,
  defaultValue: T
): UseLocalStorageReturn<T> {
  // 初期値の取得（ローカルストレージから読み込み）
  const [value, setValue] = useState<T>(() => {
    try {
      // SSR環境では window が存在しないため、デフォルト値を返す
      if (typeof window === 'undefined') {
        return defaultValue;
      }
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : defaultValue;
    } catch (error) {
      console.warn(`Error reading localStorage key "${key}":`, error);
      return defaultValue;
    }
  });

  // 値を設定してローカルストレージに保存
  const setStoredValue = useCallback(
    (newValue: T | ((prev: T) => T)) => {
      try {
        // 関数型更新をサポート
        setValue((prevValue) => {
          const valueToStore =
            newValue instanceof Function ? newValue(prevValue) : newValue;

          // SSR環境では localStorage にアクセスしない
          if (typeof window !== 'undefined') {
            window.localStorage.setItem(key, JSON.stringify(valueToStore));
          }

          return valueToStore;
        });
      } catch (error) {
        console.error(`Error setting localStorage key "${key}":`, error);
      }
    },
    [key]
  );

  // 値を削除
  const removeValue = useCallback(() => {
    try {
      setValue(defaultValue);
      // SSR環境では localStorage にアクセスしない
      if (typeof window !== 'undefined') {
        window.localStorage.removeItem(key);
      }
    } catch (error) {
      console.error(`Error removing localStorage key "${key}":`, error);
    }
  }, [key, defaultValue]);

  // ストレージイベントのリスナー（他のタブでの変更を検知）
  useEffect(() => {
    // SSR環境では window が存在しないため、早期リターン
    if (typeof window === 'undefined') {
      return;
    }

    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === key && e.newValue !== null) {
        try {
          setValue(JSON.parse(e.newValue));
        } catch (error) {
          console.warn(
            `Error parsing localStorage value for key "${key}":`,
            error
          );
        }
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, [key]);

  return {
    value,
    setValue: setStoredValue,
    removeValue,
  };
}
