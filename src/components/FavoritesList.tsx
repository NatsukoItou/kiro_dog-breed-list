import React, { useMemo } from 'react';
import { FavoriteItem } from './FavoriteItem';
import styles from '../styles/responsive.module.css';
import type { FavoritesListProps } from '../types';

export const FavoritesList: React.FC<FavoritesListProps> = ({
  favorites,
  onRemoveFavorite,
}) => {
  // Sort favorites by addedAt date (newest first)
  const sortedFavorites = useMemo(() => {
    return [...favorites].sort(
      (a, b) => new Date(b.addedAt).getTime() - new Date(a.addedAt).getTime()
    );
  }, [favorites]);

  // Group favorites by breed for better organization
  const groupedFavorites = useMemo(() => {
    const groups: Record<string, typeof favorites> = {};

    sortedFavorites.forEach((favorite) => {
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
      <div className="text-center py-16">
        <div className="mb-8">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-16 w-16 mx-auto text-base-content/20"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
            />
          </svg>
        </div>
        <h3 className="text-2xl font-bold text-base-content/80 mb-4">
          お気に入りがありません
        </h3>
        <p className="text-base-content/60 mb-8 max-w-md mx-auto leading-relaxed">
          気に入った犬の画像を見つけたら、ハートボタンを押してお気に入りに追加しましょう
        </p>
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-info/10 text-info rounded-full">
          <span className="text-lg">💡</span>
          <span className="text-sm font-medium">
            画像の下にあるハートボタンでお気に入りに追加できます
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Grouped favorites display */}
      {Object.entries(groupedFavorites).map(([breed, breedFavorites]) => (
        <div key={breed} className="space-y-5">
          <div className="flex items-center gap-3">
            <h3 className="text-xl font-bold text-base-content capitalize">
              {breed === 'その他' ? breed : breed.replace('/', ' - ')}
            </h3>
            <div className="badge badge-primary badge-sm">
              {breedFavorites.length}枚
            </div>
          </div>

          <div className={`${styles.favoritesList} gap-6`}>
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
