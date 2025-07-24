import React from 'react';

interface NavigationProps {
  currentPage?: 'home' | 'favorites';
  onNavigate?: (page: 'home' | 'favorites') => void;
}

export const Navigation: React.FC<NavigationProps> = ({ 
  currentPage = 'home', 
  onNavigate 
}) => {
  const handleNavigation = (page: 'home' | 'favorites') => {
    if (onNavigate) {
      onNavigate(page);
    }
  };

  return (
    <nav className="navbar bg-base-100 shadow-md sticky top-0 z-50 mb-8">
      <div className="navbar-center">
        <div className="tabs tabs-boxed">
          <button
            className={`tab tab-lg ${currentPage === 'home' ? 'tab-active' : ''}`}
            onClick={() => handleNavigation('home')}
          >
            🏠 ホーム
          </button>
          <button
            className={`tab tab-lg ${currentPage === 'favorites' ? 'tab-active' : ''}`}
            onClick={() => handleNavigation('favorites')}
          >
            ❤️ お気に入り
          </button>
        </div>
      </div>
    </nav>
  );
};