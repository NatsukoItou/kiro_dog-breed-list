import { useState, useCallback } from 'react';
import { AppProvider } from './context/AppContext';
import { HomePage } from './pages/HomePage';
import { FavoritesPage } from './pages/FavoritesPage';
import { Header } from './components/Header';
import { Navigation } from './components/Navigation';
import { Footer } from './components/Footer';
import './App.css';

type CurrentPage = 'home' | 'favorites';

function App() {
  const [currentPage, setCurrentPage] = useState<CurrentPage>('home');

  const handleNavigation = useCallback((page: CurrentPage) => {
    setCurrentPage(page);
  }, []);

  const renderCurrentPage = () => {
    switch (currentPage) {
      case 'favorites':
        return <FavoritesPage />;
      case 'home':
      default:
        return <HomePage />;
    }
  };

  return (
    <AppProvider>
      <div className="min-h-screen bg-base-100 flex flex-col">
        <Header />
        <Navigation 
          currentPage={currentPage}
          onNavigate={handleNavigation}
        />
        <main className="flex-1">
          {renderCurrentPage()}
        </main>
        <Footer />
      </div>
    </AppProvider>
  );
}

export default App;
