import React, { useState, useEffect, useCallback } from 'react';
import { DogApiService } from '../services/dogApi';
import { useAppState } from '../hooks/useAppState';
import { Loading } from './Loading';
import type { DogImage } from '../types';

export const RandomDogImage: React.FC = () => {
  const { currentImage, setCurrentImage, isFavorite, addToFavorites } = useAppState();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [localImage, setLocalImage] = useState<DogImage | null>(null);

  const fetchRandomImage = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const image = await DogApiService.getRandomImage();
      setLocalImage(image);
      setCurrentImage(image);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'ランダム画像の取得に失敗しました';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [setCurrentImage]);

  // 初回ロード時にランダム画像を取得（一度だけ実行）
  useEffect(() => {
    let mounted = true;
    
    const loadInitialImage = async () => {
      if (!localImage && mounted) {
        await fetchRandomImage();
      }
    };
    
    loadInitialImage();
    
    return () => {
      mounted = false;
    };
  }, [fetchRandomImage, localImage]); // 空の依存配列で一度だけ実行

  const handleNewImage = () => {
    fetchRandomImage();
  };

  // 表示用の画像を決定（ローカル状態を優先）
  const displayImage = localImage || currentImage;

  const handleAddToFavorites = () => {
    if (displayImage) {
      addToFavorites(displayImage);
    }
  };

  if (loading) {
    return <Loading message="新しい犬の画像を取得中..." size="large" />;
  }

  if (error) {
    return (
      <div className="text-center p-8">
        <div className="alert alert-error max-w-md mx-auto">
          <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span>{error}</span>
        </div>
        <button 
          className="btn btn-primary mt-4"
          onClick={handleNewImage}
        >
          再試行
        </button>
      </div>
    );
  }

  if (!displayImage) {
    return (
      <div className="text-center p-8">
        <p className="text-base-content/70">画像が見つかりません</p>
        <button 
          className="btn btn-primary mt-4"
          onClick={handleNewImage}
        >
          新しい画像を取得
        </button>
      </div>
    );
  }

  const isImageFavorite = isFavorite(displayImage.id);

  return (
    <div className="max-w-2xl mx-auto text-center">
      <div className="card bg-base-100 shadow-xl">
        <figure className="px-4 pt-4">
          <img 
            src={displayImage.url} 
            alt={displayImage.breed ? `${displayImage.breed}の犬` : '犬の画像'}
            className="rounded-xl max-h-96 w-auto object-contain"
            onError={() => setError('画像の読み込みに失敗しました')}
          />
        </figure>
        <div className="card-body">
          {displayImage.breed && (
            <h2 className="card-title justify-center text-2xl capitalize">
              {displayImage.breed.replace('/', ' - ')}
            </h2>
          )}
          <div className="card-actions justify-center gap-4 mt-4">
            <button 
              className="btn btn-primary btn-lg"
              onClick={handleNewImage}
              disabled={loading}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              新しい画像
            </button>
            <button 
              className={`btn btn-lg ${isImageFavorite ? 'btn-error' : 'btn-outline btn-secondary'}`}
              onClick={handleAddToFavorites}
              disabled={isImageFavorite}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill={isImageFavorite ? "currentColor" : "none"} viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
              {isImageFavorite ? 'お気に入り済み' : 'お気に入りに追加'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};