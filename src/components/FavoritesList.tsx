import React, { useMemo } from 'react';
import { FavoriteItem } from './FavoriteItem';
import type { FavoritesListProps } from '../types';

export const FavoritesList: React.FC<FavoritesListProps> = ({ 
  favorites, 
  onRemoveFavorite 
}) => {
  // Sort favorites by addedAt date (newest first)
  const sortedFavorites = useMemo(() => {
    return [...favorites].sort((a, b) => 
      new Date(b.addedAt).getTime() - new Date(a.addedAt).getTime()
    );
  }, [favorites]);

  // Group favorites by breed for better organization
  const groupedFavorites = useMemo(() => {
    const groups: Record<string, typeof favorites> = {};
    
    sortedFavorites.forEach(favorite => {
      const breed = favorite.breed || 'その他';
      if (!groups[breed]) {
        groups[breed] = [];
      }
      groups[breed].push(favorite);
    });
    
    return groups;
  }, [sortedFavorites]);

  if (favorites.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="mb-6">
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            className="h-24 w-24 mx-auto text-base-content/30" 
            fill="none" 
            viewBox="0 0 24 24" 
            stroke="currentColor"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={1} 
              d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" 
            />
          </svg>
        </div>
        <h3 className="text-xl font-semibold text-base-content/70 mb-2">
          お気に入りがありません
        </h3>
        <p className="text-base-content/50 mb-6">
          気に入った犬の画像を見つけたら、ハートボタンを押してお気に入りに追加しましょう
        </p>
        <div className="badge badge-info badge-lg">
          💡 ヒント: 画像の下にあるハートボタンでお気に入りに追加できます
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Summary stats */}
      <div className="stats shadow w-full">
        <div className="stat">
          <div className="stat-figure text-primary">
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              className="h-8 w-8" 
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" 
              />
            </svg>
          </div>
          <div className="stat-title">お気に入り総数</div>
          <div className="stat-value text-primary">{favorites.length}</div>
          <div className="stat-desc">保存済みの画像</div>
        </div>

        <div className="stat">
          <div className="stat-figure text-secondary">
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              className="h-8 w-8" 
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" 
              />
            </svg>
          </div>
          <div className="stat-title">犬種の種類</div>
          <div className="stat-value text-secondary">{Object.keys(groupedFavorites).length}</div>
          <div className="stat-desc">異なる犬種</div>
        </div>
      </div>

      {/* Grouped favorites display */}
      {Object.entries(groupedFavorites).map(([breed, breedFavorites]) => (
        <div key={breed} className="space-y-4">
          <div className="flex items-center gap-3">
            <h3 className="text-lg font-semibold text-base-content capitalize">
              {breed === 'その他' ? breed : breed.replace('/', ' - ')}
            </h3>
            <div className="badge badge-neutral">
              {breedFavorites.length}枚
            </div>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {breedFavorites.map((favorite) => (
              <FavoriteItem
                key={favorite.id}
                image={favorite}
                onRemove={onRemoveFavorite}
              />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};