import React from 'react';
import styles from '../styles/responsive.module.css';

export const Footer: React.FC = () => {
  return (
    <footer
      className={`${styles.footer} footer footer-center bg-base-200 text-base-content p-10`}
    >
      <div className={styles.container}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          <div className="text-center md:text-left">
            <h3 className="text-2xl font-bold text-primary mb-4">犬種図鑑</h3>
            <p className="text-base-content/70 leading-relaxed">
              Dog CEO
              APIを使用して、様々な犬種の画像を楽しめるWebアプリケーションです。
            </p>
          </div>

          <div className="text-center md:text-right">
            <h4 className="text-lg font-semibold text-base-content mb-4">
              データ提供
            </h4>
            <a
              href="https://dog.ceo/dog-api/"
              target="_blank"
              rel="noopener noreferrer"
              className="link link-primary font-medium hover:link-hover"
            >
              Dog CEO API
            </a>
          </div>
        </div>

        <div className="divider"></div>

        <div className="text-center">
          <p className="text-base-content/60 text-sm">
            © 2024 犬種図鑑. Built with React & TypeScript.
          </p>
        </div>
      </div>
    </footer>
  );
};
