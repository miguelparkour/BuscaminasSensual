import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Minesweeper from '../components/Minesweeper';

import libraryGirl from '../assets/girls/library.webp';
import motorcycleGirl from '../assets/girls/motocycle.webp';
import milf from '../assets/girls/milf.webp';
import gamerGirl from '../assets/girls/gamer.webp';
import cheerleader from '../assets/girls/cheerleader.webp';

const GamePage: React.FC = () => {
  const navigate = useNavigate();
  const [gameIsOver, setGameIsOver] = useState(false);

  // Función para inicializar una imagen aleatoria
  const initializeImage = () => {
    const images = [libraryGirl, milf, motorcycleGirl, gamerGirl, cheerleader];
    return images[Math.floor(Math.random() * images.length)];
  };

  // Estado para disparar un "reset" del tablero:
  const [resetBoard, setResetBoard] = useState(false);

  // Estado para la imagen actual
  const [currentImage, setCurrentImage] = useState<string>(initializeImage());

  const handleGameIsOver = () => {
    setGameIsOver(true);
  };

  const startNewGame = () => {
    // Cada vez que hagas clic en "Nueva Partida":
    // Resetea el tablero y el estado de "gameIsOver"
    setResetBoard(true);
    setGameIsOver(false);
    setCurrentImage(initializeImage());

    // Espera a que el tablero se resetee antes de cambiar el estado de "resetBoard"
    setTimeout(() => setResetBoard(false), 0);
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-800 text-white">
      <h1 className="text-4xl font-bold mb-5">Buscaminas</h1>
      <Minesweeper onGameIsOver={handleGameIsOver} resetBoard={resetBoard} bgImage={currentImage} />

      <div className="flex items-center justify-center gap-5">
        <button
          className="mt-5 bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded"
          onClick={() => navigate('/')}
        >
          Volver al Menú
        </button>

        {gameIsOver && (
          <button
            className="mt-5 bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded"
            onClick={startNewGame}
          >
            Nueva Partida
          </button>
        )}
      </div>
    </div>
  );
};

export default GamePage;
