import React, { useState, useRef } from 'react';
import { Cell } from '../models/types';
import Board from './Board';
import {
  initializeBoard,
  expandZeroCells,
  countFlaggedNeighbors,
  checkVictory,
} from '../utils';

const Minesweeper: React.FC = () => {
  const [grid, setGrid] = useState<Cell[][]>(initializeBoard(8, 8));
  const touchStartRef = useRef<number | null>(null);
  const lastTapRef = useRef<number | null>(null);

  // Revelar celda
  const revealCell = (row: number, col: number) => {
    const newGrid = [...grid];
    const cell = newGrid[row][col];

    if (cell.isRevealed || cell.isFlagged) return;

    cell.isRevealed = true;

    if (cell.isMine) {
      alert('¡BOOM! Has pisado una mina.');
    } else if (cell.neighborMines === 0) {
      expandZeroCells(newGrid, row, col);
    }

    setGrid(newGrid);

    if (checkVictory(newGrid)) {
      alert('¡Felicidades! Has ganado el juego.');
    }
  };

  // Poner o quitar bandera
  const toggleFlag = (row: number, col: number) => {
    const newGrid = [...grid];
    const cell = newGrid[row][col];

    if (cell.isRevealed) return;

    cell.isFlagged = !cell.isFlagged;
    setGrid(newGrid);
  };

  // Lógica para doble clic en escritorio (revela vecinos si coincide el número de banderas)
  const revealNeighborsIfFlagsMatch = (row: number, col: number) => {
    const newGrid = [...grid];
    const cell = newGrid[row][col];

    if (!cell.isRevealed || cell.isMine) return;

    // Contamos las banderas alrededor
    const flaggedCount = countFlaggedNeighbors(newGrid, row, col);

    if (flaggedCount === cell.neighborMines) {
      // Revelar todas las celdas que no estén marcadas como bandera
      for (let dRow of [-1, 0, 1]) {
        for (let dCol of [-1, 0, 1]) {
          if (dRow === 0 && dCol === 0) continue;
          const newRow = row + dRow;
          const newCol = col + dCol;

          if (
            newRow >= 0 &&
            newRow < newGrid.length &&
            newCol >= 0 &&
            newCol < newGrid[0].length
          ) {
            const neighborCell = newGrid[newRow][newCol];
            if (!neighborCell.isRevealed && !neighborCell.isFlagged) {
              neighborCell.isRevealed = true;
              // Si es un 0, expandir
              if (neighborCell.neighborMines === 0 && !neighborCell.isMine) {
                expandZeroCells(newGrid, newRow, newCol);
              }
            }
          }
        }
      }
      setGrid(newGrid);

      if (checkVictory(newGrid)) {
        alert('¡Felicidades! Has ganado el juego2.');
      }
    }
  };

  // Versión para doble toque en móvil
  const handleDoubleTap = (row: number, col: number) => {
    revealNeighborsIfFlagsMatch(row, col);
  };

  // Lógica de "long press" en móviles
  const handleTouchStartCell = (e: React.TouchEvent, row: number, col: number) => {
    console.log(`Touch start: ${row}-${col}`);
    e.preventDefault();
    touchStartRef.current = Date.now();
  };

  const handleTouchEndCell = (e: React.TouchEvent, row: number, col: number) => {
    e.preventDefault();
    const currentTime = Date.now();

    if (touchStartRef.current !== null) {
      const duration = currentTime - touchStartRef.current;
      // Detectar long press
      if (duration >= 300) {
        toggleFlag(row, col);
      } else {
        // Detectar segundo toque
        if (lastTapRef.current && currentTime - lastTapRef.current < 300) {
          // Doble toque
          handleDoubleTap(row, col);
        } else {
          // Toque simple => revelar
          revealCell(row, col);
        }
      }
    }

    lastTapRef.current = currentTime;
    touchStartRef.current = null;
  };

  return (
    <Board
      grid={grid}
      onReveal={revealCell}
      onFlag={toggleFlag}
      onDoubleReveal={revealNeighborsIfFlagsMatch}
      onTouchStartCell={handleTouchStartCell}
      onTouchEndCell={handleTouchEndCell}
    />
  );
};

export default Minesweeper;
