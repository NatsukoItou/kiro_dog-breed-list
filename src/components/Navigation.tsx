import React from 'react';
import { Link, useLocation } from 'react-router-dom';

export const Navigation: React.FC = () => {
  const location = useLocation();
  
  const isActive = (path: string) => {
    if (path === '/' && location.pathname === '/') {
      return true;
    }
    if (path === '/breed' && location.pathname.startsWith('/breed/')) {
      return true;
    }
    if (path !== '/' && path !== '/breed' && location.pathname.startsWith(path)) {
      return true;
    }
    return false;
  };

  return (
    <nav className="navbar bg-base-100 shadow-md sticky top-0 z-50 mb-8">
      <div className="navbar-center">
        <div className="tabs tabs-boxed">
          <Link
            to="/"
            className={`tab tab-lg ${isActive('/') ? 'tab-active' : ''}`}
          >
            🏠 ホーム
          </Link>
          {location.pathname.startsWith('/breed/') && (
            <span className="tab tab-lg tab-active">
              🐕 犬種ページ
            </span>
          )}
          <Link
            to="/favorites"
            className={`tab tab-lg ${isActive('/favorites') ? 'tab-active' : ''}`}
          >
            ❤️ お気に入り
          </Link>
        </div>
      </div>
    </nav>
  );
};