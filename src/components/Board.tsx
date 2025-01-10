import React from 'react';
import { Cell } from '../models/types';
import CellComponent from './CellComponent';
// importamos todas la imagenes de public/girls
import libraryGirl from '../assets/girls/library.webp';
import motorcycleGirl from '../assets/girls/motocycle.webp';
import milf from '../assets/girls/milf.webp';
import gamerGirl from '../assets/girls/gamer.webp';
import cheerleader from '../assets/girls/cheerleader.webp';

interface BoardProps {
  grid: Cell[][];
  onReveal: (row: number, col: number) => void;
  onFlag: (row: number, col: number) => void;
  onDoubleReveal: (row: number, col: number) => void;
  onTouchStartCell: (e: React.TouchEvent, row: number, col: number) => void;
  onTouchEndCell: (e: React.TouchEvent, row: number, col: number) => void;
  isVictory: boolean;
}

const Board: React.FC<BoardProps> = ({
  grid,
  onReveal,
  onFlag,
  onDoubleReveal,
  onTouchStartCell,
  onTouchEndCell,
  isVictory
}) => {

  const images = [libraryGirl, milf, motorcycleGirl, gamerGirl, cheerleader];
  const randomImage = images[Math.floor(Math.random() * images.length)];


  return (
    <div className='relative'>
    <div className="grid grid-cols-8 gap-1 p-4 bg-gray-800 bg-cover bg-center rounded-3xl absolute w-full h-full" style={{
      backgroundImage: `url(${randomImage})`,
      filter: isVictory ? '' : 'opacity(0.4) blur(12px)',
    }}></div>
    <div className="grid grid-cols-8 gap-1 p-4 bg-gray-800 z-10 relative bg-transparent">
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
