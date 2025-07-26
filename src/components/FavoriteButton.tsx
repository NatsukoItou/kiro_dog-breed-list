import React from 'react';
import styles from '../styles/responsive.module.css';

interface FavoriteButtonProps {
  isFavorite: boolean;
  onToggle: () => void;
  disabled?: boolean;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'default' | 'circle';
  className?: string;
}

export const FavoriteButton: React.FC<FavoriteButtonProps> = ({
  isFavorite,
  onToggle,
  disabled = false,
  size = 'lg',
  variant = 'default',
  className = ''
}) => {
  const baseClasses = variant === 'circle' 
    ? `btn btn-circle ${isFavorite ? 'btn-error' : 'btn-outline btn-error'}`
    : `${styles.button} ${isFavorite ? styles.buttonSecondary : styles.buttonOutline} ${styles.buttonIcon} btn btn-${size} shadow-lg hover:shadow-xl transition-all duration-300`;

  const iconSize = size === 'sm' ? 'h-4 w-4' : size === 'md' ? 'h-5 w-5' : 'h-5 w-5';

  return (
    <button
      onClick={onToggle}
      disabled={disabled}
      className={`${baseClasses} ${className}`}
      title={isFavorite ? 'お気に入りから削除' : 'お気に入りに追加'}
    >
      <svg 
        xmlns="http://www.w3.org/2000/svg" 
        className={iconSize} 
        fill={isFavorite ? 'currentColor' : 'none'} 
        viewBox="0 0 24 24" 
        stroke="currentColor" 
        strokeWidth={2.5}
      >
        <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
      </svg>
      {variant === 'default' && (
        <span className="font-semibold">
          {isFavorite ? 'お気に入りから削除' : 'お気に入りに追加'}
        </span>
      )}
    </button>
  );
};