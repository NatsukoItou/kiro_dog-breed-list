import React, { useState, useEffect, useCallback } from 'react';
import { DogApiService } from '../services/dogApi';
import { useAppState } from '../hooks/useAppState';
import { useFavorites } from '../hooks/useFavorites';
import { useToast } from '../hooks/useToast';
import { Loading } from './Loading';
import { DogImage } from './DogImage';
import { ImageControls } from './ImageControls';
import { ImageErrorFallback } from './FallbackUI';
import styles from '../styles/responsive.module.css';
import type { DogImage as DogImageType } from '../types';

export const RandomDogImage: React.FC = () => {
  const { currentImage, setCurrentImage } = useAppState();
  const { addToFavorites, removeFromFavorites, isFavorite } = useFavorites();
  const { showError, showSuccess } = useToast();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [localImage, setLocalImage] = useState<DogImageType | null>(null);

  const fetchRandomImage = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const image = await DogApiService.getRandomImage();
      setLocalImage(image);
      setCurrentImage(image);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : 'ランダム画像の取得に失敗しました';
      setError(errorMessage);
      showError('画像取得エラー', errorMessage);
    } finally {
      setLoading(false);
    }
  }, [setCurrentImage, showError]);

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
        showSuccess('お気に入りから削除しました');
      } else {
        addToFavorites(displayImage);
        showSuccess('お気に入りに追加しました');
      }
    }
  };

  if (loading) {
    return <Loading message="新しい犬の画像を取得中..." size="large" />;
  }

  if (error) {
    return <ImageErrorFallback onRetry={handleNewImage} />;
  }

  if (!displayImage) {
    return (
      <div className="text-center p-8">
        <p className="text-base-content/70">画像が見つかりません</p>
        <button className="btn btn-primary mt-4" onClick={handleNewImage}>
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
          <DogImage image={displayImage} loading={loading} />

          <ImageControls
            onNextImage={handleNewImage}
            onAddToFavorites={handleAddToFavorites}
            loading={loading}
            canAddToFavorites={!!displayImage}
            isFavorite={isImageFavorite}
            variant="new"
          />
        </div>
      </div>
    </div>
  );
};
