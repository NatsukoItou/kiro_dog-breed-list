import React from 'react';

interface HeaderProps {
  title?: string;
}

export const Header: React.FC<HeaderProps> = ({ title = '犬種図鑑' }) => {
  return (
    <header className="bg-gradient-to-r from-primary to-secondary text-primary-content shadow-lg mb-8">
      <div className="container mx-auto px-4 py-6">
        <div className="text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-2 drop-shadow-lg">
            {title}
          </h1>
          <div className="text-lg opacity-90 font-light">
            Dog CEO APIを使用した犬の画像ギャラリー
          </div>
        </div>
      </div>
    </header>
  );
};