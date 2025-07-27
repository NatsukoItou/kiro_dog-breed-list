import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { useIsMobile } from '../hooks/useResponsive';
import styles from '../styles/responsive.module.css';

export const Navigation: React.FC = () => {
  const location = useLocation();
  const isMobile = useIsMobile();

  return (
    <nav className={`${styles.navigation} navbar bg-base-100 shadow-md`}>
      <div className="navbar-center">
        <div className={`${styles.navTabs} tabs tabs-boxed`}>
          <NavLink
            to="/"
            className={({ isActive }) =>
              `${styles.navTab} tab ${isActive ? 'tab-active' : ''}`
            }
            end
          >
            {isMobile ? '🏠' : '🏠 ホーム'}
          </NavLink>
          {location.pathname.startsWith('/breed/') && (
            <span className={`${styles.navTab} tab tab-active`}>
              {isMobile ? '🐕' : '🐕 犬種ページ'}
            </span>
          )}
          <NavLink
            to="/favorites"
            className={({ isActive }) =>
              `${styles.navTab} tab ${isActive ? 'tab-active' : ''}`
            }
          >
            {isMobile ? '❤️' : '❤️ お気に入り'}
          </NavLink>
        </div>
      </div>
    </nav>
  );
};
