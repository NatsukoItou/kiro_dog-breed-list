import React from 'react';
import type { DogBreed } from '../types';

interface BreedListProps {
  breeds: DogBreed[];
  onBreedSelect: (breed: DogBreed) => void;
  loading: boolean;
  error: string | null;
}

export const BreedList: React.FC<BreedListProps> = ({
  breeds,
  onBreedSelect,
  loading,
  error
}) => {
  if (loading) {
    return <div>読み込み中...</div>;
  }

  if (error) {
    return <div>エラー: {error}</div>;
  }

  return (
    <div>
      <h2>犬種一覧</h2>
      <ul>
        {breeds.map((breed) => (
          <li key={breed.id}>
            <button onClick={() => onBreedSelect(breed)}>
              {breed.name}
              {breed.subBreeds && breed.subBreeds.length > 0 && (
                <span> ({breed.subBreeds.length}種類)</span>
              )}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};