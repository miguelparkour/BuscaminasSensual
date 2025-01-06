import React, { useState, useRef, useEffect } from 'react';
import { Cell } from '../models/types';
import Board from './Board';
import {
  initializeBoard,
  expandZeroCells,
  countFlaggedNeighbors,
  checkVictory,
  checkDefeat
} from '../utils';
import { revealAllCells } from '../utils';
import ModalMessage from './ModalMessage';

interface MinesweeperProps {
  onGameIsOver: () => void;
  resetBoard: boolean;
}

const Minesweeper: React.FC<MinesweeperProps> = ({ onGameIsOver, resetBoard  }) => {
  const [grid, setGrid] = useState<Cell[][]>(initializeBoard(8, 8));
  const touchStartRef = useRef<number | null>(null);
  const lastTapRef = useRef<number | null>(null);
  const [victory, setVictory] = useState(false);
  const [defeat, setDefeat] = useState(false);

  const [gameIsOver, setGameIsOver] = useState(false);

  // Revelar celda
  const revealCell = (row: number, col: number) => {
    const newGrid = [...grid];
    const cell = newGrid[row][col];

    if (cell.isRevealed || cell.isFlagged) return;

    cell.isRevealed = true;

    if (cell.neighborMines === 0) {
      expandZeroCells(newGrid, row, col);
    }

    setGrid(newGrid);
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

  /**
   * useEffect para comprobar victoria o derrota DESPUÉS de que el estado 'grid' cambie.
   * Si se cumple la condición de victoria, se revelan todas las celdas y se muestra el modal.
   * Si se cumple la condición de derrota, se revelan todas las minas y se muestra el modal.
   * Si no se cumple ninguna, no pasa nada.
   * Este useEffect se ejecuta cada vez que 'grid' cambia.
   */
  useEffect(() => {
    if(gameIsOver == false) {

      if (checkVictory(grid)) {
        setVictory(true);
      } else if (checkDefeat(grid)) {
        setDefeat(true);
      }
    }
  }, [grid]);
  
  // Cada vez que resetBoard cambie a true, reinicia la grid:
  useEffect(() => {
    if (resetBoard) {
      setGrid(initializeBoard(8, 8));
      setVictory(false);
      setDefeat(false);
      setGameIsOver(false);
    }
  }, [resetBoard]);

  // Función para cerrar el modal
  const handleCloseModal = () => {
    setGrid(revealAllCells(grid));
    setGameIsOver(true);
    setVictory(false);
    setDefeat(false);
    onGameIsOver();
  };

  return (
    <>
      <Board
        grid={grid}
        onReveal={revealCell}
        onFlag={toggleFlag}
        onDoubleReveal={revealNeighborsIfFlagsMatch}
        onTouchStartCell={handleTouchStartCell}
        onTouchEndCell={handleTouchEndCell}
      />
      
      {/* Si victory == true, muestra el Modal */}
      {victory && <ModalMessage message="🎉 ¡Has ganado! 🎉" onClose={handleCloseModal} />}
      
      {/* Si defeat == true, muestra el Modal */}
      {defeat && <ModalMessage message="💣¡Boom! Has perdido." onClose={handleCloseModal} />}
    </>
  );
};

export default Minesweeper;
