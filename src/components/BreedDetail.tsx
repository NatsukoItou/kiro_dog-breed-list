import React, { useState, useEffect } from 'react';
import type { DogBreed, DogImage } from '../types';
import { DogApiService } from '../services/dogApi';
import { Loading } from './Loading';
import styles from '../styles/responsive.module.css';

interface BreedDetailProps {
  breed: DogBreed;
  onBack: () => void;
}

export const BreedDetail: React.FC<BreedDetailProps> = ({ breed, onBack }) => {
  const [images, setImages] = useState<DogImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchImages = async () => {
      try {
        setLoading(true);
        setError(null);
        const dogImages = await DogApiService.getMultipleBreedImages(
          breed.id,
          6
        );
        setImages(dogImages);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : '画像の取得に失敗しました'
        );
      } finally {
        setLoading(false);
      }
    };

    fetchImages();
  }, [breed.id]);

  return (
    <div className="card bg-base-100 shadow-xl">
      <div className="card-body">
        <div className="flex items-center mb-6">
          <button onClick={onBack} className={`${styles.backButton} mr-4`}>
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
                d="M15 19l-7-7 7-7"
              />
            </svg>
            <span className="font-semibold">戻る</span>
          </button>
          <h2 className="card-title text-3xl font-bold">{breed.name}</h2>
        </div>

        {breed.subBreeds && breed.subBreeds.length > 0 && (
          <div className="mb-6">
            <h3 className="text-xl font-semibold mb-2">サブ犬種:</h3>
            <div className="flex flex-wrap gap-2">
              {breed.subBreeds.map((subBreed) => (
                <div key={subBreed} className="badge badge-primary badge-lg">
                  {subBreed}
                </div>
              ))}
            </div>
          </div>
        )}

        <h3 className="text-xl font-semibold mb-4">画像:</h3>
        {loading && (
          <Loading message="画像を読み込み中..." variant="dots" size="medium" />
        )}
        {error && (
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
        )}
        {!loading && !error && (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
            {images.map((dogImage) => (
              <div key={dogImage.id} className="card bg-base-200">
                <figure className="p-2">
                  <img
                    src={dogImage.url}
                    alt={`${breed.name}`}
                    className="w-full h-32 object-cover rounded-lg"
                  />
                </figure>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
