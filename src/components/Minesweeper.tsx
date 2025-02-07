import React, { useState, useRef, useEffect } from 'react';
import { Cell } from '../models/types';
import Board from './Board';
import {
  expandZeroCells,
  countFlaggedNeighbors,
  checkVictory,
  checkDefeat,
  initializeEmptyBoard,
  placeMines,
} from '../utils';
import { revealAllCells } from '../utils';
import ModalMessage from './ModalMessage';

interface MinesweeperProps {
  onGameIsOver: () => void;
  resetBoard: boolean;
  bgImage: string;
}

const Minesweeper: React.FC<MinesweeperProps> = ({ onGameIsOver, resetBoard, bgImage }) => {
  const [grid, setGrid] = useState<Cell[][]>(initializeEmptyBoard(8, 8));
  const [isFirstClick, setIsFirstClick] = useState(true); // Nuevo estado
  const touchStartRef = useRef<number | null>(null);
  const lastTapRef = useRef<number | null>(null);
  const [victory, setVictory] = useState(false);

  const [showVictoryModal, setShowVictoryModal] = useState(false);
  const [showDefeatModal, setShowDefeatModal] = useState(false);

  const [gameIsOver, setGameIsOver] = useState(false);

  // funcion para pintar en la consola el estado de la grid
  // const printGrid = () => {
  //   console.log(grid.map(row => row.map(cell => (cell.isMine ? '💣' : cell.neighborMines)).join(' ')).join('\n'));
  // };

  // Revelar celda
  const revealCell = (row: number, col: number) => {
    let newGrid = [...grid];

    if (isFirstClick) {
      // Colocar minas en el primer clic
      // en porcentaje va en función de las victorias conseguidas, sumando cada una un 0.05 de minas y empezando por 0.05
      const victoryCount = JSON.parse(localStorage.getItem('victories') || '[]').length;
      const minesPercentage = 0.05 + victoryCount * 0.05;
      newGrid = placeMines(newGrid, row, col, Math.floor(8 * 8 * minesPercentage));
      setIsFirstClick(false);
      // printGrid();
    } else {
      // printGrid();
    }

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
        setShowVictoryModal(true);
      } else if (checkDefeat(grid)) {
        setShowDefeatModal(true);
      }
    }
  }, [grid]);
  
  // Cada vez que resetBoard cambie a true, reinicia la grid:
  useEffect(() => {
    if (resetBoard) {
      setGrid(initializeEmptyBoard(8, 8));
      setVictory(false);
      setGameIsOver(false);
      setIsFirstClick(true); // Reinicia el estado para el primer clic
    }
  }, [resetBoard]);

  // Función para cerrar el modal
  const handleCloseModal = () => {
    setGrid(revealAllCells(grid));
    setGameIsOver(true);
    setShowVictoryModal(false);
    setShowDefeatModal(false);
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
        isVictory={victory}
        bgImage= {() => bgImage}
        resetBoard={resetBoard}
      />
      
      {showVictoryModal && <ModalMessage message="🎉 ¡Has ganado! 🎉" onClose={handleCloseModal} />}
      
      {showDefeatModal && <ModalMessage message="💣¡Boom! Has perdido." onClose={handleCloseModal} />}
    </>
  );
};

export default Minesweeper;
