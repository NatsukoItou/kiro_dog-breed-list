import React, { useState } from 'react';
import { BreedList } from '../components/BreedList';
import { BreedDetail } from '../components/BreedDetail';
import { useDogBreeds } from '../hooks/useDogBreeds';
import type { DogBreed } from '../types';

export const HomePage: React.FC = () => {
  const { breeds, loading, error } = useDogBreeds();
  const [selectedBreed, setSelectedBreed] = useState<DogBreed | null>(null);

  const handleBreedSelect = (breed: DogBreed) => {
    setSelectedBreed(breed);
  };

  const handleBack = () => {
    setSelectedBreed(null);
  };

  return (
    <div style={{ padding: '20px' }}>
      <h1>犬種図鑑</h1>
      {selectedBreed ? (
        <BreedDetail breed={selectedBreed} onBack={handleBack} />
      ) : (
        <BreedList
          breeds={breeds}
          onBreedSelect={handleBreedSelect}
          loading={loading}
          error={error}
        />
      )}
    </div>
  );
};