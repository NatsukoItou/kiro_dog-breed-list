import React, { useCallback } from 'react';
import { RandomDogImage } from '../components/RandomDogImage';
import { BreedSelector } from '../components/BreedSelector';
import { BreedDetail } from '../components/BreedDetail';
import { useDogBreeds } from '../hooks/useDogBreeds';
import { useAppState } from '../hooks/useAppState';
import type { DogImage } from '../types';

export const HomePage: React.FC = () => {
  const { breeds, loading, error } = useDogBreeds();
  const { selectedBreed, setSelectedBreed, setCurrentImage } = useAppState();

  const handleBack = useCallback(() => {
    setSelectedBreed(null);
  }, [setSelectedBreed]);

  const handleImageLoad = useCallback((image: DogImage) => {
    setCurrentImage(image);
  }, [setCurrentImage]);



  const selectedBreedObj = selectedBreed 
    ? breeds.find(breed => breed.name === selectedBreed) || null
    : null;

  return (
    <div className="container mx-auto px-4 py-6">
      {selectedBreedObj ? (
        <BreedDetail breed={selectedBreedObj} onBack={handleBack} />
      ) : (
        <div className="space-y-8">
          {/* ランダム犬画像セクション */}
          <section>
            <div className="text-center mb-6">
              <h1 className="text-3xl font-bold text-base-content mb-2">
                今日の犬
              </h1>
              <p className="text-base-content/70">
                ランダムな犬の画像をお楽しみください
              </p>
            </div>
            <RandomDogImage />
          </section>

          {/* 犬種選択セクション */}
          <section>
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold text-base-content mb-2">
                犬種から選ぶ
              </h2>
              <p className="text-base-content/70">
                お好みの犬種を選んで画像を見てみましょう
              </p>
            </div>
            <BreedSelector
              breeds={breeds}
              loading={loading}
              error={error}
              onImageLoad={handleImageLoad}
            />
          </section>
        </div>
      )}
    </div>
  );
};