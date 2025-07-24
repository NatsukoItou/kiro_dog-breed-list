import { AppProvider } from './context/AppContext';
import { HomePage } from './pages/HomePage';
import { Header } from './components/Header';
import { Navigation } from './components/Navigation';
import { Footer } from './components/Footer';
import './App.css';

function App() {
  return (
    <AppProvider>
      <div className="min-h-screen bg-base-100 flex flex-col">
        <Header />
        <Navigation />
        <main className="flex-1 container mx-auto px-4">
          <HomePage />
        </main>
        <Footer />
      </div>
    </AppProvider>
  );
}

export default App;
