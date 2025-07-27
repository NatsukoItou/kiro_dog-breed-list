import React from 'react';
import styles from '../styles/responsive.module.css';
import type { ImageControlsProps } from '../types';
import { FavoriteButton } from './FavoriteButton';
import { NextImageButton } from './NextImageButton';
import { RefreshButton } from './RefreshButton';

export const ImageControls: React.FC<ImageControlsProps> = ({
  onNextImage,
  onAddToFavorites,
  loading = false,
  canAddToFavorites = true,
  isFavorite = false
}) => {

  return (
    <div className={`${styles.modernButtonGroup} gap-3 mt-6`}>
      {/* Refresh Button */}
      <RefreshButton
        onClick={onNextImage}
        loading={loading}
      />

      {/* Next Image Button */}
      <NextImageButton
        onClick={onNextImage}
        loading={loading}
        variant="next"
      />

      {/* Add to Favorites Button */}
      <FavoriteButton
        isFavorite={isFavorite}
        onToggle={onAddToFavorites}
        disabled={loading || !canAddToFavorites}
      />
    </div>
  );
};