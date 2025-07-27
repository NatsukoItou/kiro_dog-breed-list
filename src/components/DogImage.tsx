import React from 'react';
import type { DogImageProps } from '../types';
import { Loading } from './Loading';
import styles from '../styles/responsive.module.css';

export const DogImage: React.FC<DogImageProps> = ({
  image,
  loading = false,
}) => {
  if (loading) {
    return (
      <div className="flex justify-center items-center h-96 bg-base-200 rounded-lg">
        <Loading
          message="画像を読み込み中..."
          variant="spinner"
          size="medium"
        />
      </div>
    );
  }

  if (!image) {
    return (
      <div className="flex justify-center items-center h-96 bg-base-200 rounded-lg">
        <div className="text-center">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-16 w-16 mx-auto text-base-content/30 mb-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
            />
          </svg>
          <p className="text-base-content/70">画像がありません</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <figure className={`${styles.imageContainer} mb-6`}>
        <img
          src={image.url}
          alt={image.breed ? `${image.breed}の画像` : '犬の画像'}
          className={`${styles.dogImage} rounded-xl`}
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            target.src =
              'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZjNmNGY2Ii8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCwgc2Fucy1zZXJpZiIgZm9udC1zaXplPSIxOCIgZmlsbD0iIzk5YTNhZiIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPuOCqOODqeODvOOBjOeZuueUn+OBl+OBvuOBl+OBnw==</text></svg>';
          }}
        />
      </figure>

      {/* Image info */}
      <div className="flex justify-between items-center">
        <div>
          {image.breed && (
            <h2 className="text-2xl font-bold capitalize">
              {image.breed.replace('/', ' - ')}
            </h2>
          )}
        </div>
      </div>
    </div>
  );
};
