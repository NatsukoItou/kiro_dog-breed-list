import React from 'react';
import { Link, useLocation } from 'react-router-dom';

export const NotFoundPage: React.FC = () => {
  const location = useLocation();

  return (
    <div className="container mx-auto px-4 py-16 text-center">
      <div className="max-w-md mx-auto">
        <div className="text-9xl font-bold text-primary mb-4">404</div>
        <h1 className="text-3xl font-bold text-base-content mb-4">
          ページが見つかりません
        </h1>
        <p className="text-base-content/70 mb-8">
          お探しのページ「{location.pathname}
          」は存在しないか、移動された可能性があります。
        </p>

        <div className="space-y-4">
          <Link to="/" className="btn btn-primary btn-wide">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 mr-2"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
              />
            </svg>
            ホームに戻る
          </Link>

          <div className="divider">または</div>

          <div className="flex flex-col sm:flex-row gap-2 justify-center">
            <Link to="/favorites" className="btn btn-outline">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 mr-2"
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
              お気に入り
            </Link>

            <button
              onClick={() => window.history.back()}
              className="btn btn-outline"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 mr-2"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 19l-7-7 7-7"
                />
              </svg>
              前のページに戻る
            </button>
          </div>
        </div>

        <div className="mt-12 p-4 bg-base-200 rounded-lg">
          <h3 className="font-semibold mb-2">お困りですか？</h3>
          <p className="text-sm text-base-content/70">
            犬種を探している場合は、ホームページから犬種一覧をご確認ください。
          </p>
        </div>
      </div>
    </div>
  );
};
