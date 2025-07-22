import React, { useState, useEffect } from 'react';
import type { DogBreed } from '../types';
import { DogApiService } from '../services/dogApi';

interface BreedDetailProps {
  breed: DogBreed;
  onBack: () => void;
}

export const BreedDetail: React.FC<BreedDetailProps> = ({ breed, onBack }) => {
  const [images, setImages] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchImages = async () => {
      try {
        setLoading(true);
        setError(null);
        const imageUrls = await DogApiService.getMultipleBreedImages(breed.id, 3);
        setImages(imageUrls);
      } catch (err) {
        setError(err instanceof Error ? err.message : '画像の取得に失敗しました');
      } finally {
        setLoading(false);
      }
    };

    fetchImages();
  }, [breed.id]);

  return (
    <div>
      <button onClick={onBack}>← 戻る</button>
      <h2>{breed.name}</h2>
      
      {breed.subBreeds && breed.subBreeds.length > 0 && (
        <div>
          <h3>サブ犬種:</h3>
          <ul>
            {breed.subBreeds.map((subBreed) => (
              <li key={subBreed}>{subBreed}</li>
            ))}
          </ul>
        </div>
      )}

      <h3>画像:</h3>
      {loading && <div>画像を読み込み中...</div>}
      {error && <div>エラー: {error}</div>}
      {!loading && !error && (
        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
          {images.map((imageUrl, index) => (
            <img
              key={index}
              src={imageUrl}
              alt={`${breed.name} ${index + 1}`}
              style={{ width: '200px', height: '200px', objectFit: 'cover' }}
            />
          ))}
        </div>
      )}
    </div>
  );
};