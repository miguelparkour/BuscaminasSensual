import React, { useState, useEffect } from 'react';
import { Cell } from '../models/types';
import CellComponent from './CellComponent';

interface BoardProps {
  grid: Cell[][];
  onReveal: (row: number, col: number) => void;
  onFlag: (row: number, col: number) => void;
  onDoubleReveal: (row: number, col: number) => void;
  onTouchStartCell: (e: React.TouchEvent, row: number, col: number) => void;
  onTouchEndCell: (e: React.TouchEvent, row: number, col: number) => void;
  isVictory: boolean;
  bgImage: () => string; // Recibimos la función desde el padre
  resetBoard: boolean;
}

const Board: React.FC<BoardProps> = ({
  grid,
  onReveal,
  onFlag,
  onDoubleReveal,
  onTouchStartCell,
  onTouchEndCell,
  isVictory,
  bgImage,
  resetBoard,
}) => {
  // Estado para manejar la imagen aleatoria
  const [randomImage, setRandomImage] = useState<string>('');

  const [customStyle, setCustomStyle] = useState({
    opacity: 1,
    transition: 'opacity 0.5s',
  });

  // Llama a initializeImage desde el prop cuando el componente se monta
  useEffect(() => {
    const image = bgImage();
    setRandomImage(image);
  }, [bgImage]);

  useEffect(() => {
      if (resetBoard) {
        setCustomStyle({
          opacity: 1,
          transition: 'opacity 0.5s',
        });
      }
    }, [resetBoard]);

  
  // Manejador para click izquierdo (revelar)
  const handleClick = () => {
    // Si es victoria, cada vez que se dé click en el tablero, se se cambia el customStyle para alternar la opacidad en 0 o en 1
    if (isVictory) {
      setCustomStyle({
        opacity: customStyle.opacity === 0 ? 1 : 0,
        transition: 'opacity 0.5s',
      });
    } else {
      setCustomStyle({
        opacity: 1,
        transition: 'opacity 0.5s',
      });
    }
  };

  return (
    <div className="relative">
      <div
        className="grid grid-cols-8 gap-1 p-4 bg-gray-800 bg-cover bg-center rounded-3xl absolute w-full h-full"
        style={{
          backgroundImage: `url(${randomImage})`,
          filter: isVictory ? '' : 'opacity(0.4) blur(12px)',
        }}
      ></div>
      <div 
        className="grid grid-cols-8 gap-1 p-4 bg-gray-800 z-10 relative bg-transparent select-none"
        onClick={handleClick}
        onTouchStart={handleClick}
        style={customStyle}>
        {grid.map((row, rowIndex) =>
          row.map((cell, colIndex) => (
            <CellComponent
              key={`${rowIndex}-${colIndex}`}
              cell={cell}
              rowIndex={rowIndex}
              colIndex={colIndex}
              onReveal={onReveal}
              onFlag={onFlag}
              onDoubleReveal={onDoubleReveal}
              onTouchStartCell={onTouchStartCell}
              onTouchEndCell={onTouchEndCell}
            />
          ))
        )}
      </div>
    </div>
  );
};

export default Board;
