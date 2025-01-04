import React from 'react';
import { Cell } from '../models/types';
import CellComponent from './CellComponent';

interface BoardProps {
  grid: Cell[][];
  onReveal: (row: number, col: number) => void;
  onFlag: (row: number, col: number) => void;
  onDoubleReveal: (row: number, col: number) => void;
  onTouchStartCell: (e: React.TouchEvent, row: number, col: number) => void;
  onTouchEndCell: (e: React.TouchEvent, row: number, col: number) => void;
}

const Board: React.FC<BoardProps> = ({
  grid,
  onReveal,
  onFlag,
  onDoubleReveal,
  onTouchStartCell,
  onTouchEndCell,
}) => {
  return (
    <div className="grid grid-cols-8 gap-1 p-4 bg-gray-800">
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
  );
};

export default Board;
