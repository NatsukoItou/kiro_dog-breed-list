import { AppProvider } from './context/AppContext';
import { HomePage } from './pages/HomePage';
import './App.css';

function App() {
  return (
    <AppProvider>
      <div className="App">
        <HomePage />
      </div>
    </AppProvider>
  );
}

export default App;
