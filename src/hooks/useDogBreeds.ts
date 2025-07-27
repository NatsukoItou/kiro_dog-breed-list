import { useState, useEffect } from 'react';
import type { DogBreed } from '../types';
import { DogApiService } from '../services/dogApi';

export const useDogBreeds = () => {
  const [breeds, setBreeds] = useState<DogBreed[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchBreeds = async () => {
      try {
        setLoading(true);
        setError(null);
        const breedsData = await DogApiService.getAllBreeds();
        setBreeds(breedsData);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : '犬種データの取得に失敗しました'
        );
      } finally {
        setLoading(false);
      }
    };

    fetchBreeds();
  }, []);

  return { breeds, loading, error };
};
