/**
 * ローカルストレージキーの定数定義
 * 一元管理により、タイプミスや不整合を防ぐ
 */

export const LOCAL_STORAGE_KEYS = {
  FAVORITES: 'dogApp.favorites',
  PREFERENCES: 'dogApp.preferences',
} as const;

export type LocalStorageKey =
  (typeof LOCAL_STORAGE_KEYS)[keyof typeof LOCAL_STORAGE_KEYS];
