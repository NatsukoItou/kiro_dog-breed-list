import React from 'react';
import type { DogImageProps } from '../types';
import { Loading } from './Loading';

export const DogImage: React.FC<DogImageProps> = ({
  image,
  loading = false,
  onFavoriteToggle,
  isFavorite = false
}) => {
  const handleFavoriteClick = () => {
    if (image && onFavoriteToggle) {
      onFavoriteToggle(image);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-96 bg-base-200 rounded-lg">
        <Loading message="画像を読み込み中..." variant="spinner" size="medium" />
      </div>
    );
  }

  if (!image) {
    return (
      <div className="flex justify-center items-center h-96 bg-base-200 rounded-lg">
        <div className="text-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto text-base-content/30 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          <p className="text-base-content/70">画像がありません</p>
        </div>
      </div>
    );
  }

  return (
    <div className="card bg-base-100 shadow-xl max-w-2xl mx-auto">
      <figure className="relative">
        <img
          src={image.url}
          alt={image.breed ? `${image.breed}の画像` : '犬の画像'}
          className="w-full h-96 object-cover"
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZjNmNGY2Ii8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCwgc2Fucy1zZXJpZiIgZm9udC1zaXplPSIxOCIgZmlsbD0iIzk5YTNhZiIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPuOCqOODqeODvOOBjOeZuueUn+OBl+OBvuOBl+OBnw==</text></svg>';
          }}
        />
        
        {/* Favorite button overlay */}
        {onFavoriteToggle && (
          <div className="absolute top-4 right-4">
            <button
              onClick={handleFavoriteClick}
              className={`btn btn-circle ${isFavorite ? 'btn-error' : 'btn-outline btn-error'} bg-base-100/80 backdrop-blur-sm`}
              title={isFavorite ? 'お気に入りから削除' : 'お気に入りに追加'}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill={isFavorite ? 'currentColor' : 'none'} viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
            </button>
          </div>
        )}
      </figure>
      
      <div className="card-body">
        <div className="flex justify-between items-center">
          <div>
            {image.breed && (
              <h3 className="card-title text-lg capitalize">
                {image.breed.replace('/', ' - ')}
              </h3>
            )}
            <p className="text-sm text-base-content/70">
              追加日時: {new Date(image.addedAt).toLocaleDateString('ja-JP')}
            </p>
          </div>
          
          {/* Image info badge */}
          <div className="badge badge-primary badge-outline">
            犬の画像
          </div>
        </div>
      </div>
    </div>
  );
};