import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';

export const Navigation: React.FC = () => {
  const location = useLocation();

  return (
    <nav className="navbar bg-base-100 shadow-md sticky top-0 z-50 mb-8">
      <div className="navbar-center">
        <div className="tabs tabs-boxed">
          <NavLink
            to="/"
            className={({ isActive }) => `tab tab-lg ${isActive ? 'tab-active' : ''}`}
            end
          >
            🏠 ホーム
          </NavLink>
          {location.pathname.startsWith('/breed/') && (
            <span className="tab tab-lg tab-active">
              🐕 犬種ページ
            </span>
          )}
          <NavLink
            to="/favorites"
            className={({ isActive }) => `tab tab-lg ${isActive ? 'tab-active' : ''}`}
          >
            ❤️ お気に入り
          </NavLink>
        </div>
      </div>
    </nav>
  );
};