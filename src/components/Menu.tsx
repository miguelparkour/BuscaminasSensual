import React from 'react';
import { useNavigate } from 'react-router-dom';

const Menu: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-800 text-white">
      <h1 className="text-5xl font-bold mb-10 text-center">Buscaminas Sensual</h1>
      <button
        className="bg-pink-500 hover:bg-pink-600 text-white font-bold py-2 px-4 rounded mb-4 w-40"
        onClick={() => navigate('/juego')}
      >
        Jugar
      </button>
      <button
        className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded w-40"
        onClick={() => navigate('/galeria')}
      >
        Galería
      </button>
    </div>
  );
};

export default Menu;
