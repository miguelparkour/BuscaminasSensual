import { Cell } from './models/types';

/**
 * Genera un tablero sin minas iniciales.
 */
export function initializeEmptyBoard(rows: number, cols: number): Cell[][] {
  const board: Cell[][] = [];
  for (let row = 0; row < rows; row++) {
    const newRow: Cell[] = [];
    for (let col = 0; col < cols; col++) {
      newRow.push({
        isMine: false, // Sin minas al principio
        isRevealed: false,
        neighborMines: 0,
        isFlagged: false,
      });
    }
    board.push(newRow);
  }
  return board;
}

/**
 * Distribuye minas en el tablero excluyendo una celda inicial y sus vecinas.
 */
export function placeMines(
  board: Cell[][],
  initialRow: number,
  initialCol: number,
  totalMines: number
): Cell[][] {
  const rows = board.length;
  const cols = board[0].length;

  // Genera todas las posiciones posibles
  const positions: [number, number][] = [];
  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      // Excluir la celda inicial y las adyacentes
      if (Math.abs(row - initialRow) > 1 || Math.abs(col - initialCol) > 1) {
        positions.push([row, col]);
      }
    }
  }

  // Verifica si hay suficientes posiciones para colocar las minas
  if (totalMines > positions.length) {
    throw new Error('Número de minas excede el número de celdas disponibles');
  }

  // Mezcla aleatoriamente las posiciones
  for (let i = positions.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [positions[i], positions[j]] = [positions[j], positions[i]];
  }

  // Toma las primeras `totalMines` posiciones y coloca las minas
  for (let i = 0; i < totalMines; i++) {
    const [row, col] = positions[i];
    board[row][col].isMine = true;
  }

  // Actualiza el número de minas vecinas después de colocar las minas
  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      board[row][col].neighborMines = countNeighborMines(board, row, col);
    }
  }

  return board;
}

/**
 * Retorna la cantidad de minas vecinas de una celda específica.
 */
export function countNeighborMines(board: Cell[][], row: number, col: number): number {
  let minesCount = 0;

  for (let dRow of [-1, 0, 1]) {
    for (let dCol of [-1, 0, 1]) {
      if (dRow === 0 && dCol === 0) continue;
      const newRow = row + dRow;
      const newCol = col + dCol;

      if (
        newRow >= 0 &&
        newRow < board.length &&
        newCol >= 0 &&
        newCol < board[0].length
      ) {
        if (board[newRow][newCol].isMine) {
          minesCount++;
        }
      }
    }
  }
  return minesCount;
}

/**
 * Expande recursivamente todas las celdas con 0 minas vecinas.
 */
export function expandZeroCells(board: Cell[][], row: number, col: number) {
  for (let dRow of [-1, 0, 1]) {
    for (let dCol of [-1, 0, 1]) {
      if (dRow === 0 && dCol === 0) continue;
      const newRow = row + dRow;
      const newCol = col + dCol;

      if (
        newRow >= 0 &&
        newRow < board.length &&
        newCol >= 0 &&
        newCol < board[0].length
      ) {
        const neighborCell = board[newRow][newCol];
        if (!neighborCell.isRevealed && !neighborCell.isMine) {
          neighborCell.isRevealed = true;
          if (neighborCell.neighborMines === 0) {
            expandZeroCells(board, newRow, newCol);
          }
        }
      }
    }
  }
}

/**
 * Cuenta cuántas banderas hay alrededor de una celda
 */
export function countFlaggedNeighbors(board: Cell[][], row: number, col: number): number {
  let flaggedCount = 0;

  for (let dRow of [-1, 0, 1]) {
    for (let dCol of [-1, 0, 1]) {
      if (dRow === 0 && dCol === 0) continue;
      const newRow = row + dRow;
      const newCol = col + dCol;

      if (
        newRow >= 0 &&
        newRow < board.length &&
        newCol >= 0 &&
        newCol < board[0].length
      ) {
        if (board[newRow][newCol].isFlagged) {
          flaggedCount++;
        }
      }
    }
  }
  return flaggedCount;
}

/**
 * Verifica si todas las minas están sin revelar (o con bandera) y
 * todas las celdas sin mina están reveladas.
 */
export function checkVictory(grid: Cell[][]): boolean {
  return grid.every((row) =>
    row.every(
      (cell) =>
        (cell.isMine && !cell.isRevealed) ||
        (!cell.isMine && cell.isRevealed)
    )
  );
}

export function checkDefeat(grid: Cell[][]): boolean {
  return grid.some((row) => row.some((cell) => cell.isMine && cell.isRevealed));
}

/**
 * Revela todas las celdas (bombas incluidas).
 * Devuelve una copia del grid modificado.
 */
export function revealAllCells(grid: Cell[][]): Cell[][] {
  return grid.map((row) =>
    row.map((cell) => ({
      ...cell,
      isRevealed: true,
    }))
  );
}
