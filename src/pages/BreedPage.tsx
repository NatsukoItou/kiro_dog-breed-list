import React, { useState, useEffect, useCallback } from 'react';
import { DogImage } from '../components/DogImage';
import { ImageControls } from '../components/ImageControls';
import { DogApiService } from '../services/dogApi';
import { useFavorites } from '../hooks/useFavorites';
import type { DogImage as DogImageType } from '../types';

interface BreedPageProps {
    breedId: string;
    breedName: string;
    onBack?: () => void;
}

export const BreedPage: React.FC<BreedPageProps> = ({
    breedId,
    breedName,
    onBack
}) => {
    const [currentImage, setCurrentImage] = useState<DogImageType | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [imageHistory, setImageHistory] = useState<DogImageType[]>([]);

    const { favorites, addToFavorites, removeFromFavorites, isFavorite } = useFavorites();

    // Load a new image for the selected breed
    const loadBreedImage = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);

            const image = await DogApiService.getBreedImage(breedId);
            setCurrentImage(image);

            // Add to history (keep last 10 images)
            setImageHistory(prev => {
                const newHistory = [image, ...prev.filter(img => img.id !== image.id)];
                return newHistory.slice(0, 10);
            });
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : `${breedName}の画像取得に失敗しました`;
            setError(errorMessage);
            setCurrentImage(null);
        } finally {
            setLoading(false);
        }
    }, [breedId, breedName]);

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
            } else {
                addToFavorites(currentImage);
            }
        }
    }, [currentImage, addToFavorites, removeFromFavorites, isFavorite]);

    // Handle favorite toggle from DogImage component
    const handleFavoriteToggle = useCallback((image: DogImageType) => {
        if (isFavorite(image.id)) {
            removeFromFavorites(image.id);
        } else {
            addToFavorites(image);
        }
    }, [addToFavorites, removeFromFavorites, isFavorite]);

    const isCurrentImageFavorite = currentImage ? isFavorite(currentImage.id) : false;

    return (
        <div className="container mx-auto px-4 py-6 max-w-4xl">
            {/* Header */}
            <div className="flex items-center justify-between mb-8">
                <div className="flex items-center">
                    {onBack && (
                        <button onClick={onBack} className="btn btn-circle btn-outline mr-4">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                            </svg>
                        </button>
                    )}
                    <div>
                        <h1 className="text-3xl font-bold text-base-content capitalize">
                            {breedName.replace('/', ' - ')}
                        </h1>
                        <p className="text-base-content/70 mt-1">
                            この犬種の画像を楽しもう
                        </p>
                    </div>
                </div>

                {/* Breed info badge */}
                <div className="badge badge-primary badge-lg">
                    犬種ページ
                </div>
            </div>

            {/* Error display */}
            {error && (
                <div className="alert alert-error mb-6">
                    <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <div>
                        <div className="font-bold">エラーが発生しました</div>
                        <div className="text-xs">{error}</div>
                    </div>
                    <button onClick={loadBreedImage} className="btn btn-sm btn-outline">
                        再試行
                    </button>
                </div>
            )}

            {/* Main content */}
            <div className="space-y-8">
                {/* Dog Image Display */}
                <section>
                    <DogImage
                        image={currentImage}
                        loading={loading}
                        onFavoriteToggle={handleFavoriteToggle}
                        isFavorite={isCurrentImageFavorite}
                    />
                </section>

                {/* Image Controls */}
                {!error && (
                    <section>
                        <ImageControls
                            onNextImage={handleNextImage}
                            onAddToFavorites={handleAddToFavorites}
                            loading={loading}
                            canAddToFavorites={!!currentImage}
                        />
                    </section>
                )}

                {/* Image History */}
                {imageHistory.length > 1 && (
                    <section>
                        <div className="divider">
                            <span className="text-base-content/70">最近見た画像</span>
                        </div>

                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                            {imageHistory.slice(1).map((image, index) => (
                                <div key={image.id} className="card bg-base-200 shadow-sm hover:shadow-md transition-shadow cursor-pointer">
                                    <figure className="p-2">
                                        <img
                                            src={image.url}
                                            alt={`${breedName}の画像 ${index + 2}`}
                                            className="w-full h-24 object-cover rounded-lg"
                                            onClick={() => setCurrentImage(image)}
                                        />
                                    </figure>
                                    <div className="card-body p-2">
                                        <div className="flex justify-between items-center">
                                            <span className="text-xs text-base-content/70">
                                                #{index + 2}
                                            </span>
                                            {isFavorite(image.id) && (
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-error" fill="currentColor" viewBox="0 0 24 24">
                                                    <path d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                                                </svg>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>
                )}

                {/* Statistics */}
                <section>
                    <div className="stats shadow w-full">
                        <div className="stat">
                            <div className="stat-figure text-primary">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                </svg>
                            </div>
                            <div className="stat-title">閲覧した画像</div>
                            <div className="stat-value text-primary">{imageHistory.length}</div>
                            <div className="stat-desc">このセッション中</div>
                        </div>

                        <div className="stat">
                            <div className="stat-figure text-secondary">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                                </svg>
                            </div>
                            <div className="stat-title">お気に入り</div>
                            <div className="stat-value text-secondary">{favorites.length}</div>
                            <div className="stat-desc">保存済み</div>
                        </div>

                        <div className="stat">
                            <div className="stat-figure text-accent">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </div>
                            <div className="stat-title">犬種</div>
                            <div className="stat-value text-accent">{breedName}</div>
                            <div className="stat-desc">現在表示中</div>
                        </div>
                    </div>
                </section>
            </div>
        </div>
    );
};