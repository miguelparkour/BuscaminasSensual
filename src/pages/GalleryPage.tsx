import React from 'react';
import { useNavigate } from 'react-router-dom';
import Gallery from '../components/Gallery';

const GalleryPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center bg-gray-800 text-white py-8">
      <h1 className="text-4xl font-bold mb-10">Pantalla de Galería</h1>
      <Gallery />
      <button
        className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded mt-10"
        onClick={() => navigate('/')}
      >
        Volver al Menú
      </button>
    </div>
  );
};

export default GalleryPage;
