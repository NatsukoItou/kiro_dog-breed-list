import React from 'react';
import { BreedList } from '../components/BreedList';
import { BreedDetail } from '../components/BreedDetail';
import { useDogBreeds } from '../hooks/useDogBreeds';
import { useAppState } from '../hooks/useAppState';
import type { DogBreed } from '../types';

export const HomePage: React.FC = () => {
  const { breeds, loading, error } = useDogBreeds();
  const { selectedBreed, setSelectedBreed } = useAppState();

  const handleBreedSelect = (breed: DogBreed) => {
    setSelectedBreed(breed.name);
  };

  const handleBack = () => {
    setSelectedBreed(null);
  };

  const selectedBreedObj = selectedBreed 
    ? breeds.find(breed => breed.name === selectedBreed) || null
    : null;

  return (
    <div className="container mx-auto px-4 py-6">
      {selectedBreedObj ? (
        <BreedDetail breed={selectedBreedObj} onBack={handleBack} />
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