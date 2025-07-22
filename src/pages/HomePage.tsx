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
    // DogBreed型からstring型に変換してグローバル状態に保存
    setSelectedBreed(breed.name);
  };

  const handleBack = () => {
    setSelectedBreed(null);
  };

  // selectedBreedがstring型なので、DogBreed型に変換
  const selectedBreedObj = selectedBreed 
    ? breeds.find(breed => breed.name === selectedBreed) || null
    : null;

  return (
    <div style={{ padding: '20px' }}>
      <h1>犬種図鑑</h1>
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