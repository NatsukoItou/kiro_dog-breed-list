/**
 * ローカルストレージ機能の手動テスト用ユーティリティ
 * 開発時にブラウザのコンソールで実行して動作確認可能
 */

import type { DogImage, UserPreferences } from '../types';

// テスト用のサンプルデータ
const sampleDogImage: DogImage = {
  id: 'test-image-1',
  url: 'https://images.dog.ceo/breeds/hound-afghan/n02088094_1003.jpg',
  breed: 'hound-afghan',
  addedAt: new Date(),
};

const samplePreferences: UserPreferences = {
  lastSelectedBreed: 'golden-retriever',
  theme: 'light',
  imageSize: 'medium',
};

/**
 * ローカルストレージの基本機能をテスト
 */
export function testBasicLocalStorage() {
  console.log('=== ローカルストレージ基本機能テスト ===');
  
  try {
    // データの保存
    localStorage.setItem('test-key', JSON.stringify({ message: 'Hello, LocalStorage!' }));
    console.log('✓ データの保存: 成功');
    
    // データの読み込み
    const retrieved = localStorage.getItem('test-key');
    const parsed = retrieved ? JSON.parse(retrieved) : null;
    console.log('✓ データの読み込み:', parsed);
    
    // データの削除
    localStorage.removeItem('test-key');
    const afterRemoval = localStorage.getItem('test-key');
    console.log('✓ データの削除:', afterRemoval === null ? '成功' : '失敗');
    
  } catch (error) {
    console.error('✗ ローカルストレージテストでエラー:', error);
  }
}

/**
 * お気に入り機能のローカルストレージをテスト
 */
export function testFavoritesStorage() {
  console.log('=== お気に入り機能テスト ===');
  
  try {
    const key = 'dogApp.favorites';
    
    // 初期状態の確認
    const initial = localStorage.getItem(key);
    console.log('初期状態:', initial);
    
    // お気に入りの追加
    const favorites: DogImage[] = [sampleDogImage];
    localStorage.setItem(key, JSON.stringify(favorites));
    console.log('✓ お気に入り追加: 成功');
    
    // お気に入りの読み込み
    const stored = localStorage.getItem(key);
    const parsedFavorites: DogImage[] = stored ? JSON.parse(stored) : [];
    console.log('✓ お気に入り読み込み:', parsedFavorites);
    
    // 複数のお気に入り追加
    const moreFavorites: DogImage[] = [
      ...parsedFavorites,
      {
        ...sampleDogImage,
        id: 'test-image-2',
        url: 'https://images.dog.ceo/breeds/retriever-golden/n02099601_100.jpg',
        breed: 'retriever-golden',
      }
    ];
    localStorage.setItem(key, JSON.stringify(moreFavorites));
    console.log('✓ 複数お気に入り:', moreFavorites.length, '件');
    
    // クリーンアップ
    localStorage.removeItem(key);
    console.log('✓ クリーンアップ: 完了');
    
  } catch (error) {
    console.error('✗ お気に入りテストでエラー:', error);
  }
}

/**
 * ユーザー設定のローカルストレージをテスト
 */
export function testPreferencesStorage() {
  console.log('=== ユーザー設定テスト ===');
  
  try {
    const key = 'dogApp.preferences';
    
    // 設定の保存
    localStorage.setItem(key, JSON.stringify(samplePreferences));
    console.log('✓ 設定保存: 成功');
    
    // 設定の読み込み
    const stored = localStorage.getItem(key);
    const parsedPreferences: UserPreferences = stored ? JSON.parse(stored) : {};
    console.log('✓ 設定読み込み:', parsedPreferences);
    
    // 部分的な設定更新
    const updatedPreferences = {
      ...parsedPreferences,
      theme: 'dark' as const,
    };
    localStorage.setItem(key, JSON.stringify(updatedPreferences));
    console.log('✓ 設定更新:', updatedPreferences);
    
    // クリーンアップ
    localStorage.removeItem(key);
    console.log('✓ クリーンアップ: 完了');
    
  } catch (error) {
    console.error('✗ 設定テストでエラー:', error);
  }
}

/**
 * 全てのテストを実行
 */
export function runAllLocalStorageTests() {
  console.log('🧪 ローカルストレージ機能テスト開始');
  console.log('');
  
  testBasicLocalStorage();
  console.log('');
  
  testFavoritesStorage();
  console.log('');
  
  testPreferencesStorage();
  console.log('');
  
  console.log('🎉 全てのテスト完了');
}

// ブラウザのコンソールで使用するためにグローバルに公開
if (typeof window !== 'undefined') {
  (window as any).testLocalStorage = {
    runAll: runAllLocalStorageTests,
    basic: testBasicLocalStorage,
    favorites: testFavoritesStorage,
    preferences: testPreferencesStorage,
  };
}