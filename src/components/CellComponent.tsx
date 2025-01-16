import React from 'react';
import { Cell } from '../models/types';

interface CellComponentProps {
  cell: Cell;
  rowIndex: number;
  colIndex: number;
  onReveal: (row: number, col: number) => void;
  onFlag: (row: number, col: number) => void;
  onDoubleReveal: (row: number, col: number) => void;
  onTouchStartCell: (e: React.TouchEvent, row: number, col: number) => void;
  onTouchEndCell: (e: React.TouchEvent, row: number, col: number) => void;
}

const CellComponent: React.FC<CellComponentProps> = ({
  cell,
  rowIndex,
  colIndex,
  onReveal,
  onFlag,
  onDoubleReveal,
  onTouchStartCell,
  onTouchEndCell,
}) => {
  const { isMine, isRevealed, neighborMines, isFlagged } = cell;

  // Manejador para click izquierdo (revelar)
  const handleClick = () => {
    onReveal(rowIndex, colIndex);
  };

  // Manejador para click derecho (poner bandera)
  const handleRightClick = (e: React.MouseEvent) => {
    e.preventDefault();
    onFlag(rowIndex, colIndex);
  };

  // Manejador para doble click en escritorio
  const handleDoubleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    onDoubleReveal(rowIndex, colIndex);
  };

  // Clases de estilo básicas, adáptalas a tu gusto
  const cellClassName = `
    w-10 h-10 flex items-center justify-center border
    ${isRevealed ? (isMine ? 'bg-red-600' : (neighborMines == 0 ? 'opacity-30' : 'bg-gray-500')) : 'bg-gray-700'}
    cursor-pointer
  `;

  return (
    <div
      className={cellClassName}
      onClick={handleClick}
      onContextMenu={handleRightClick}
      onDoubleClick={handleDoubleClick}
      onTouchStart={(e) => onTouchStartCell(e, rowIndex, colIndex)}
      onTouchEnd={(e) => onTouchEndCell(e, rowIndex, colIndex)}
      
    >
      {/* Mostrar bandera si no está revelada y está marcada */}
      {!isRevealed && isFlagged && (
        <span className="text-yellow-400 text-xl">🚩</span>
      )}

      {/* Mostrar mina si está revelada y es mina */}
      {isRevealed && isMine && <span className="text-red-700 text-xl">💣</span>}

      {/* Mostrar número de minas si está revelada y no es mina */}
      {isRevealed && !isMine && neighborMines > 0 && (
        <span
          className={
            neighborMines === 1
              ? 'text-blue-500 font-bold'
              : neighborMines === 2
              ? 'text-green-500 font-bold'
              : neighborMines === 3
              ? 'text-red-500 font-bold'
              : neighborMines === 4
              ? 'text-purple-500 font-bold'
              : 'text-yellow-500 font-bold'
          }
        >
          {neighborMines}
        </span>
      )}
    </div>
  );
};

export default CellComponent;
