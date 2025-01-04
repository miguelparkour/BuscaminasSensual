import { Routes, Route } from 'react-router-dom';
import Menu from './components/Menu';
import GamePage from './pages/GamePage';
import GalleryPage from './pages/GalleryPage';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Menu />} />
      <Route path="/juego" element={<GamePage />} />
      <Route path="/galeria" element={<GalleryPage />} />
    </Routes>
  );
}

export default App;
