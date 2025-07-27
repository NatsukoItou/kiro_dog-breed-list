import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AppProvider } from './context/AppContext';
import { ToastProvider } from './context/ToastContext';
import { ErrorBoundary } from './components/ErrorBoundary';
import { HomePage } from './pages/HomePage';
import { BreedPage } from './pages/BreedPage';
import { FavoritesPage } from './pages/FavoritesPage';
import { NotFoundPage } from './pages/NotFoundPage';
import { Header } from './components/Header';
import { Navigation } from './components/Navigation';
import { Footer } from './components/Footer';
import './App.css';
import styles from './styles/responsive.module.css';

function App() {
  return (
    <ErrorBoundary>
      <AppProvider>
        <ToastProvider>
          <Router>
            <div className="min-h-screen bg-base-100 flex flex-col">
              <Header />
              <Navigation />
              <main className={`flex-1 ${styles.main}`}>
                <ErrorBoundary>
                  <Routes>
                    <Route path="/" element={<HomePage />} />
                    <Route path="/breed/:breedId" element={<BreedPage />} />
                    <Route path="/favorites" element={<FavoritesPage />} />
                    <Route path="/404" element={<NotFoundPage />} />
                    <Route path="*" element={<NotFoundPage />} />
                  </Routes>
                </ErrorBoundary>
              </main>
              <Footer />
            </div>
          </Router>
        </ToastProvider>
      </AppProvider>
    </ErrorBoundary>
  );
}

export default App;
