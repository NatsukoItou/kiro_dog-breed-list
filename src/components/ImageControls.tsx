import React from 'react';
import type { ImageControlsProps } from '../types';

export const ImageControls: React.FC<ImageControlsProps> = ({
  onNextImage,
  onAddToFavorites,
  loading = false,
  canAddToFavorites = true
}) => {
  return (
    <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
      {/* Next Image Button */}
      <button
        onClick={onNextImage}
        disabled={loading}
        className="btn btn-primary btn-lg"
      >
        {loading ? (
          <>
            <span className="loading loading-spinner loading-sm"></span>
            読み込み中...
          </>
        ) : (
          <>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            次の画像
          </>
        )}
      </button>

      {/* Add to Favorites Button */}
      <button
        onClick={onAddToFavorites}
        disabled={loading || !canAddToFavorites}
        className="btn btn-outline btn-error btn-lg"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
        </svg>
        お気に入りに追加
      </button>

      {/* Divider for mobile */}
      <div className="divider divider-horizontal hidden sm:flex"></div>

      {/* Additional controls */}
      <div className="flex gap-2">
        <div className="tooltip" data-tip="画像をダウンロード">
          <button className="btn btn-outline btn-square">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </button>
        </div>

        <div className="tooltip" data-tip="画像を共有">
          <button className="btn btn-outline btn-square">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};