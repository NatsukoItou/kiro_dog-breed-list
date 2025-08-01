import React, { useState, useEffect, useCallback } from 'react';
import {
  useParams,
  useNavigate,
  useSearchParams,
  Link,
} from 'react-router-dom';
import { DogImage } from '../components/DogImage';
import { ImageControls } from '../components/ImageControls';
import { ImageErrorFallback } from '../components/FallbackUI';
import { DogApiService } from '../services/dogApi';
import { useFavorites } from '../hooks/useFavorites';
import { useDogBreeds } from '../hooks/useDogBreeds';
import { useToast } from '../hooks/useToast';
import styles from '../styles/responsive.module.css';
import type { DogImage as DogImageType } from '../types';

interface BreedPageContentProps {
  breedId: string;
  breedName: string;
  onBack?: () => void;
}

const BreedPageContent: React.FC<BreedPageContentProps> = ({
  breedId,
  breedName,
  onBack,
}) => {
  const [currentImage, setCurrentImage] = useState<DogImageType | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [imageHistory, setImageHistory] = useState<DogImageType[]>([]);

  const { favorites, addToFavorites, removeFromFavorites, isFavorite } =
    useFavorites();
  const { showError, showSuccess } = useToast();

  // Load a new image for the selected breed
  const loadBreedImage = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const image = await DogApiService.getBreedImage(breedId);
      setCurrentImage(image);

      // Add to history (keep last 10 images)
      setImageHistory((prev) => {
        const newHistory = [
          image,
          ...prev.filter((img) => img.id !== image.id),
        ];
        return newHistory.slice(0, 10);
      });
    } catch (err) {
      const errorMessage =
        err instanceof Error
          ? err.message
          : `${breedName}の画像取得に失敗しました`;
      setError(errorMessage);
      setCurrentImage(null);
      showError('画像取得エラー', errorMessage);
    } finally {
      setLoading(false);
    }
  }, [breedId, breedName, showError]);

  // Load initial image when component mounts or breed changes
  useEffect(() => {
    loadBreedImage();
  }, [loadBreedImage]);

  // Handle next image button click
  const handleNextImage = useCallback(() => {
    loadBreedImage();
  }, [loadBreedImage]);

  // Handle add to favorites
  const handleAddToFavorites = useCallback(() => {
    if (currentImage) {
      if (isFavorite(currentImage.id)) {
        removeFromFavorites(currentImage.id);
        showSuccess('お気に入りから削除しました');
      } else {
        addToFavorites(currentImage);
        showSuccess('お気に入りに追加しました');
      }
    }
  }, [
    currentImage,
    addToFavorites,
    removeFromFavorites,
    isFavorite,
    showSuccess,
  ]);

  const isCurrentImageFavorite = currentImage
    ? isFavorite(currentImage.id)
    : false;

  return (
    <div className={`${styles.container} ${styles.main}`}>
      <div className="bg-gradient-to-r from-primary/10 to-secondary/10 rounded-2xl p-6 mb-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center">
            {onBack && (
              <button
                onClick={onBack}
                className={`${styles.backButtonCircle} mr-4`}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2.5}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M15 19l-7-7 7-7"
                  />
                </svg>
              </button>
            )}
            <div>
              <h1 className="text-3xl sm:text-4xl font-bold text-base-content capitalize mb-2">
                {breedName.replace('/', ' - ')}
              </h1>
              <p className="text-base-content/70 text-lg">
                この犬種の画像を楽しもう
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Error display */}
      {error && (
        <div className="mb-8">
          <ImageErrorFallback onRetry={loadBreedImage} breed={breedName} />
        </div>
      )}

      {/* Main content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
        {/* Left column - Main image and controls */}
        <div className="lg:col-span-2">
          <section className={`${styles.card} bg-base-100 shadow-lg`}>
            <div className={`${styles.cardBody} p-8`}>
              <DogImage image={currentImage} loading={loading} />

              {/* Image Controls */}
              {!error && (
                <ImageControls
                  onNextImage={handleNextImage}
                  onAddToFavorites={handleAddToFavorites}
                  loading={loading}
                  canAddToFavorites={!!currentImage}
                  isFavorite={isCurrentImageFavorite}
                />
              )}
            </div>
          </section>
        </div>

        {/* Right column - Statistics */}
        <div className="lg:col-span-1">
          <section className={`${styles.card} bg-base-100 shadow-lg`}>
            <div className={`${styles.cardBody} p-6`}>
              <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                <span>📊</span>
                統計情報
              </h3>
              <div className="space-y-3">
                <div className="p-3 bg-primary/10 rounded-lg">
                  <div className="text-xs text-primary/70 mb-1">
                    閲覧した画像
                  </div>
                  <div className="text-xl font-bold text-primary">
                    {imageHistory.length}
                  </div>
                </div>
                <div className="p-3 bg-secondary/10 rounded-lg">
                  <div className="text-xs text-secondary/70 mb-1">
                    お気に入り総数
                  </div>
                  <div className="text-xl font-bold text-secondary">
                    {favorites.length}
                  </div>
                </div>
                <div className="p-3 bg-accent/10 rounded-lg">
                  <div className="text-xs text-accent/70 mb-1">現在の犬種</div>
                  <div className="text-sm font-bold text-accent capitalize break-words">
                    {breedName}
                  </div>
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>

      {/* Image History */}
      {imageHistory.length > 1 && (
        <section className={`${styles.card} bg-base-100 shadow-lg`}>
          <div className={`${styles.cardBody} p-6`}>
            <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
              <span>🕒</span>
              最近見た画像
            </h3>

            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-4">
              {imageHistory.slice(1).map((image, index) => (
                <div
                  key={image.id}
                  className="relative group cursor-pointer"
                  onClick={() => setCurrentImage(image)}
                >
                  <div className="aspect-square bg-base-200 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-all duration-200 group-hover:scale-105">
                    <img
                      src={image.url}
                      alt={`${breedName}の画像 ${index + 2}`}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  {/* Overlay with number */}
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-200 rounded-lg flex items-center justify-center">
                    <span className="text-white font-bold opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                      #{index + 2}
                    </span>
                  </div>

                  {/* Favorite indicator */}
                  {isFavorite(image.id) && (
                    <div className="absolute top-1 right-1 bg-error/90 rounded-full p-1">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-3 w-3 text-white"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                      </svg>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
};

export const BreedPage: React.FC = () => {
  const { breedId } = useParams<{ breedId: string }>();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { breeds, loading: breedsLoading } = useDogBreeds();

  // Handle navigation effects
  useEffect(() => {
    // If no breedId in URL, redirect to home
    if (!breedId) {
      navigate('/');
      return;
    }

    // Validate breed ID format (basic validation)
    const isValidBreedId = /^[a-z]+([/-][a-z]+)*$/.test(breedId);

    // If breed ID format is invalid, redirect to 404
    if (!isValidBreedId) {
      navigate('/404', { replace: true });
      return;
    }
  }, [breedId, navigate]);

  // Early return if no breedId
  if (!breedId) {
    return null;
  }

  // Validate breed ID format (basic validation)
  const isValidBreedId = /^[a-z]+([/-][a-z]+)*$/.test(breedId);

  // Early return if invalid breed ID format
  if (!isValidBreedId) {
    return null;
  }

  // If breeds are loaded and breed ID is not found, show 404
  if (
    !breedsLoading &&
    breeds.length > 0 &&
    !breeds.find((b) => b.name === breedId) &&
    isValidBreedId
  ) {
    return (
      <div className={`${styles.container} ${styles.main} text-center`}>
        <div className="max-w-md mx-auto">
          <div className="text-6xl mb-4">🐕</div>
          <h1 className="text-2xl font-bold text-base-content mb-4">
            犬種が見つかりません
          </h1>
          <p className="text-base-content/70 mb-8">
            「{breedId}」という犬種は存在しないか、現在利用できません。
          </p>
          <Link
            to="/"
            className="btn btn-lg btn-primary shadow-lg hover:shadow-xl transition-all duration-300"
          >
            ホームに戻る
          </Link>
        </div>
      </div>
    );
  }

  // Find the breed information
  const breed = breeds.find((b) => b.name === breedId);
  const breedName = breed?.name || breedId.replace('-', ' ');

  // Get return path from query params, default to home
  const returnPath = searchParams.get('from') || '/';

  const handleBack = () => {
    navigate(returnPath);
  };

  return (
    <div>
      {/* Breadcrumb Navigation */}
      <BreedPageContent
        breedId={breedId}
        breedName={breedName}
        onBack={handleBack}
      />
    </div>
  );
};
