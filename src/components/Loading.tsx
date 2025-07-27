import React from 'react';

interface LoadingProps {
  message?: string;
  size?: 'small' | 'medium' | 'large';
  variant?: 'spinner' | 'dots' | 'pulse';
}

export const Loading: React.FC<LoadingProps> = ({
  message = '読み込み中...',
  size = 'medium',
  variant = 'spinner',
}) => {
  const getSizeClasses = () => {
    switch (size) {
      case 'small':
        return 'loading-sm';
      case 'large':
        return 'loading-lg';
      default:
        return 'loading-md';
    }
  };

  const getVariantClasses = () => {
    switch (variant) {
      case 'dots':
        return 'loading-dots';
      case 'pulse':
        return 'loading-ring';
      default:
        return 'loading-spinner';
    }
  };

  const getMessageSize = () => {
    switch (size) {
      case 'small':
        return 'text-sm';
      case 'large':
        return 'text-lg';
      default:
        return 'text-base';
    }
  };

  return (
    <div className="flex flex-col items-center justify-center p-8 text-center">
      <span
        className={`loading ${getVariantClasses()} ${getSizeClasses()} text-primary`}
      ></span>
      {message && (
        <p
          className={`mt-4 text-base-content/70 font-medium ${getMessageSize()}`}
        >
          {message}
        </p>
      )}
    </div>
  );
};
