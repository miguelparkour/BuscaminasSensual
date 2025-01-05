import { Cell } from './models/types';

/**
 * Genera un tablero con el número de filas y columnas indicado
 * y distribuye minas de manera aleatoria.
 */
export function initializeBoard(rows: number, cols: number): Cell[][] {
  const board: Cell[][] = [];

  for (let row = 0; row < rows; row++) {
    const newRow: Cell[] = [];
    for (let col = 0; col < cols; col++) {
      newRow.push({
        isMine: Math.random() < 0.05, // 5% de probabilidad de ser mina
        isRevealed: false,
        neighborMines: 0,
        isFlagged: false,
      });
    }
    board.push(newRow);
  }

  // Calcula el número de minas vecinas de cada celda
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
