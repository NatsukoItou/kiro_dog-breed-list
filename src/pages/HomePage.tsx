import React, { useCallback } from 'react';
import { RandomDogImage } from '../components/RandomDogImage';
import { BreedSelector } from '../components/BreedSelector';
import { BreedDetail } from '../components/BreedDetail';
import { useDogBreeds } from '../hooks/useDogBreeds';
import { useAppState } from '../hooks/useAppState';
import { useIsMobile } from '../hooks/useResponsive';
import styles from '../styles/responsive.module.css';
import type { DogImage } from '../types';

export const HomePage: React.FC = () => {
  const { breeds, loading, error } = useDogBreeds();
  const { selectedBreed, setSelectedBreed, setCurrentImage } = useAppState();
  const isMobile = useIsMobile();

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
    <div className={`${styles.container} ${styles.main}`}>
      {selectedBreedObj ? (
        <BreedDetail breed={selectedBreedObj} onBack={handleBack} />
      ) : (
        <div className="space-y-8">
          {/* ランダム犬画像セクション */}
          <section className={styles.section}>
            <div className="mb-6">
              <h1 className={styles.sectionTitle}>
                おすすめの犬画像
              </h1>
              <p className={styles.sectionDescription}>
                {isMobile ? 'ランダムな犬の画像' : 'ランダムな犬の画像をお楽しみください'}
              </p>
            </div>
            <RandomDogImage />
          </section>

          {/* 犬種選択セクション */}
          <section className={styles.section}>
            <div className="mb-6">
              <h2 className={styles.sectionTitle}>
                犬種から選ぶ
              </h2>
              <p className={styles.sectionDescription}>
                {isMobile ? 'お好みの犬種を選択' : 'お好みの犬種を選んで画像を見てみましょう'}
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