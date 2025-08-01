import React, { useState, memo, useMemo, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import type { DogBreed, DogImage } from '../types';
import { DogApiService } from '../services/dogApi';
import { Loading } from './Loading';
import { NextImageButton } from './NextImageButton';
import { LazyImage } from './LazyImage';
import styles from '../styles/responsive.module.css';

interface BreedSelectorProps {
  breeds: DogBreed[];
  loading: boolean;
  error: string | null;
  onImageLoad?: (image: DogImage) => void;
}

export const BreedSelector: React.FC<BreedSelectorProps> = memo(({
  breeds,
  loading,
  error,
  onImageLoad,
}) => {
  const navigate = useNavigate();
  const [selectedBreed, setSelectedBreed] = useState<DogBreed | null>(null);
  const [currentImage, setCurrentImage] = useState<DogImage | null>(null);
  const [imageLoading, setImageLoading] = useState(false);
  const [imageError, setImageError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  // Filter breeds based on search term (memoized for performance)
  const filteredBreeds = useMemo(() => {
    if (!searchTerm) return breeds;
    return breeds.filter((breed) =>
      breed.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [breeds, searchTerm]);

  // Load image when breed is selected (memoized callback)
  const loadBreedImage = useCallback(async (breed: DogBreed) => {
    try {
      setImageLoading(true);
      setImageError(null);
      const image = await DogApiService.getBreedImage(breed.id);
      setCurrentImage(image);
      onImageLoad?.(image);
    } catch (err) {
      const errorMessage =
        err instanceof Error
          ? err.message
          : `${breed.name}の画像が見つかりませんでした`;
      setImageError(errorMessage);
      setCurrentImage(null);
    } finally {
      setImageLoading(false);
    }
  }, [onImageLoad]);

  // Handle breed selection (memoized callback)
  const handleBreedSelect = useCallback((breed: DogBreed) => {
    setSelectedBreed(breed);
    loadBreedImage(breed);
  }, [loadBreedImage]);

  // Handle next image button (memoized callback)
  const handleNextImage = useCallback(() => {
    if (selectedBreed) {
      loadBreedImage(selectedBreed);
    }
  }, [selectedBreed, loadBreedImage]);

  // Reset selection (memoized callback)
  const handleReset = useCallback(() => {
    setSelectedBreed(null);
    setCurrentImage(null);
    setImageError(null);
    setSearchTerm('');
  }, []);

  if (loading) {
    return (
      <Loading
        message="犬種リストを読み込み中..."
        variant="spinner"
        size="medium"
      />
    );
  }

  if (error) {
    return (
      <div className="alert alert-error">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="stroke-current shrink-0 h-6 w-6"
          fill="none"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
        <span>エラー: {error}</span>
      </div>
    );
  }

  return (
    <div className="card bg-base-100 shadow-xl">
      <div className="card-body">
        {!selectedBreed ? (
          // Breed selection view
          <>
            <div className="flex flex-col md:flex-row justify-between items-center mb-6">
              <h2 className="card-title text-2xl mb-4 md:mb-0">犬種を選択</h2>
              <div className="form-control w-full md:w-64">
                <div className="input-group">
                  <input
                    type="text"
                    placeholder="犬種を検索..."
                    className="input input-bordered w-full"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </div>
            </div>

            <div className="divider"></div>

            <div className={`${styles.breedGrid} ${styles.grid} gap-3`}>
              {filteredBreeds.map((breed) => (
                <button
                  key={breed.id}
                  onClick={() => handleBreedSelect(breed)}
                  className={`${styles.breedButton} btn btn-lg btn-outline btn-primary shadow-lg hover:shadow-xl transition-all duration-300 h-auto py-3`}
                >
                  <span>{breed.name}</span>
                  {breed.subBreeds && breed.subBreeds.length > 0 && (
                    <span className="badge badge-secondary badge-xs ml-1">
                      {breed.subBreeds.length}
                    </span>
                  )}
                </button>
              ))}
            </div>

            <div className="mt-4 text-sm text-base-content/70 text-center">
              {filteredBreeds.length} 種類の犬が表示されています
            </div>
          </>
        ) : (
          // Selected breed view with image
          <>
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center">
                <button
                  onClick={handleReset}
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
                <div>
                  <h2 className="card-title text-2xl">{selectedBreed.name}</h2>
                  {selectedBreed.subBreeds &&
                    selectedBreed.subBreeds.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-2">
                        {selectedBreed.subBreeds.map((subBreed) => (
                          <div
                            key={subBreed}
                            className="badge badge-primary badge-sm"
                          >
                            {subBreed}
                          </div>
                        ))}
                      </div>
                    )}
                </div>
              </div>
              <div className="flex flex-col sm:flex-row gap-4 sm:gap-6">
                <NextImageButton
                  onClick={handleNextImage}
                  loading={imageLoading}
                  variant="next"
                  className="flex-1 sm:flex-none"
                />
                <button
                  onClick={() => navigate(`/breed/${selectedBreed.id}?from=/`)}
                  className={`${styles.button} ${styles.buttonPrimary} ${styles.buttonIcon} btn btn-lg shadow-lg hover:shadow-xl transition-all duration-300 flex-1 sm:flex-none`}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2.5}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M13 7l5 5m0 0l-5 5m5-5H6"
                    />
                  </svg>
                  <span className="font-semibold">詳細ページへ</span>
                </button>
              </div>
            </div>

            <div className="divider"></div>

            {/* Image display area */}
            <div className="flex justify-center">
              {imageLoading && (
                <div className="flex flex-col items-center justify-center h-64">
                  <Loading
                    message="画像を読み込み中..."
                    variant="dots"
                    size="medium"
                  />
                </div>
              )}

              {imageError && (
                <div className="alert alert-warning max-w-md">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="stroke-current shrink-0 h-6 w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16c-.77.833.192 2.5 1.732 2.5z"
                    />
                  </svg>
                  <div>
                    <div className="font-bold">画像が見つかりません</div>
                    <div className="text-xs">{imageError}</div>
                  </div>
                </div>
              )}

              {currentImage && !imageLoading && !imageError && (
                <div className="card bg-base-200 shadow-lg max-w-md">
                  <figure className="p-4">
                    <LazyImage
                      src={currentImage.url}
                      alt={`${selectedBreed.name}の画像`}
                      className="w-full h-64 object-cover rounded-lg"
                      onError={() =>
                        setImageError('画像の読み込みに失敗しました')
                      }
                      rootMargin="50px"
                      threshold={0.1}
                    />
                  </figure>
                  <div className="card-body pt-2">
                    <p className="text-sm text-base-content/70 text-center">
                      {selectedBreed.name}の画像
                    </p>
                  </div>
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
});

BreedSelector.displayName = 'BreedSelector';
