import React from 'react';
import { useResponsive } from '../hooks/useResponsive';
import styles from '../styles/responsive.module.css';

interface HeaderProps {
  title?: string;
}

export const Header: React.FC<HeaderProps> = ({ title = '犬種図鑑' }) => {
  const { isMobile } = useResponsive();

  return (
    <header className="bg-gradient-to-r from-primary to-secondary text-primary-content shadow-lg">
      <div className={`${styles.container} ${styles.header}`}>
        <div>
          <h1 className={`${styles.headerTitle} drop-shadow-lg`}>{title}</h1>
          <div className={`${styles.headerSubtitle} font-light`}>
            {isMobile
              ? 'Dog CEO API'
              : 'Dog CEO APIを使用した犬の画像ギャラリー'}
          </div>
        </div>
      </div>
    </header>
  );
};
