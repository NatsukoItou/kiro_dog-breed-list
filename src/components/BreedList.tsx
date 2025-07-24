import React, { useState } from 'react';
import type { DogBreed } from '../types';
import { Loading } from './Loading';

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
  const [searchTerm, setSearchTerm] = useState('');
  
  if (loading) {
    return <Loading message="犬種リストを読み込み中..." variant="spinner" size="medium" />;
  }

  if (error) {
    return <div className="alert alert-error">
      <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
      <span>エラー: {error}</span>
    </div>;
  }

  const filteredBreeds = searchTerm 
    ? breeds.filter(breed => 
        breed.name.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : breeds;

  return (
    <div className="card bg-base-100 shadow-xl">
      <div className="card-body">
        <div className="flex flex-col md:flex-row justify-between items-center mb-6">
          <h2 className="card-title text-2xl mb-4 md:mb-0">犬種一覧</h2>
          <div className="form-control w-full md:w-64">
            <div className="input-group">
              <input 
                type="text" 
                placeholder="犬種を検索..." 
                className="input input-bordered w-full"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <button className="btn btn-square">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </button>
            </div>
          </div>
        </div>

        <div className="divider"></div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
          {filteredBreeds.map((breed) => (
            <button 
              key={breed.id}
              onClick={() => onBreedSelect(breed)}
              className="btn btn-outline btn-primary h-auto py-3 justify-between"
            >
              <span className="text-left">{breed.name}</span>
              {breed.subBreeds && breed.subBreeds.length > 0 && (
                <span className="badge badge-secondary ml-2">{breed.subBreeds.length}</span>
              )}
            </button>
          ))}
        </div>
        
        <div className="mt-4 text-center text-sm text-base-content/70">
          {filteredBreeds.length} 種類の犬が表示されています
        </div>
      </div>
    </div>
  );
};