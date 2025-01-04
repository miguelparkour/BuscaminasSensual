import React from 'react';
import { useNavigate } from 'react-router-dom';

const GalleryPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-800 text-white">
      <h1 className="text-4xl font-bold mb-10">Pantalla de Galería</h1>
      <button
        className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded"
        onClick={() => navigate('/BuscaminasSensual/')}
      >
        Volver al Menú
      </button>
    </div>
  );
};

export default GalleryPage;
