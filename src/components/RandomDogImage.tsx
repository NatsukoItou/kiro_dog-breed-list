import React, { useState, useEffect, useCallback } from 'react';
import { DogApiService } from '../services/dogApi';
import { useAppState } from '../hooks/useAppState';
import { useFavorites } from '../hooks/useFavorites';
import { Loading } from './Loading';
import { FavoriteButton } from './FavoriteButton';
import { NextImageButton } from './NextImageButton';
import styles from '../styles/responsive.module.css';
import type { DogImage } from '../types';

export const RandomDogImage: React.FC = () => {
  const { currentImage, setCurrentImage } = useAppState();
  const { addToFavorites, removeFromFavorites, isFavorite } = useFavorites();
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
      if (isImageFavorite) {
        removeFromFavorites(displayImage.id);
      } else {
        addToFavorites(displayImage);
      }
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
    <div className="max-w-2xl mx-auto">
      <div className={`${styles.card} bg-base-100 shadow-xl`}>
        <div className={`${styles.cardBody}`}>
          <figure className={`${styles.imageContainer} mb-6`}>
            <img
              src={displayImage.url}
              alt={displayImage.breed ? `${displayImage.breed}の犬` : '犬の画像'}
              className={`${styles.dogImage} rounded-xl`}
              onError={() => setError('画像の読み込みに失敗しました')}
            />
          </figure>
          {displayImage.breed && (
            <h2 className={`${styles.cardTitle} text-2xl capitalize mb-4`}>
              {displayImage.breed.replace('/', ' - ')}
            </h2>
          )}
          <div className={`${styles.buttonGroup} gap-6`}>
            <NextImageButton
              onClick={handleNewImage}
              loading={loading}
              variant="new"
            />
            <FavoriteButton
              isFavorite={isImageFavorite}
              onToggle={handleAddToFavorites}
              disabled={loading}
            />
          </div>
        </div>
      </div>
    </div>
  );
};