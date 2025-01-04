import React from 'react';
import { useNavigate } from 'react-router-dom';
import Minesweeper from '../components/Minesweeper';


const GamePage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-800 text-white">
      <h1 className="text-4xl font-bold mb-5">Buscaminas</h1>
      <Minesweeper />
      <button
        className="mt-5 bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded"
        onClick={() => navigate('/')}
      >
        Volver al Menú
      </button>
    </div>
  );
};

export default GamePage;
