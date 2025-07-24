import React from 'react';

export const Footer: React.FC = () => {
  return (
    <footer className="footer footer-center bg-base-200 text-base-content p-10 mt-16">
      <div className="container mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          <div className="text-center md:text-left">
            <h3 className="text-2xl font-bold text-primary mb-4">犬種図鑑</h3>
            <p className="text-base-content/70 leading-relaxed">
              Dog CEO APIを使用して、様々な犬種の画像を楽しめるWebアプリケーションです。
            </p>
          </div>
          
          <div className="text-center">
            <h4 className="text-lg font-semibold text-base-content mb-4">機能</h4>
            <ul className="space-y-2 text-base-content/70">
              <li className="flex items-center justify-center">
                <span className="text-primary mr-2">•</span>
                ランダム犬画像表示
              </li>
              <li className="flex items-center justify-center">
                <span className="text-primary mr-2">•</span>
                犬種別画像閲覧
              </li>
              <li className="flex items-center justify-center">
                <span className="text-primary mr-2">•</span>
                お気に入り機能
              </li>
              <li className="flex items-center justify-center">
                <span className="text-primary mr-2">•</span>
                レスポンシブデザイン
              </li>
            </ul>
          </div>
          
          <div className="text-center md:text-right">
            <h4 className="text-lg font-semibold text-base-content mb-4">データ提供</h4>
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