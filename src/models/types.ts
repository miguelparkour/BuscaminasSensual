export type Cell = {
    isMine: boolean;
    isRevealed: boolean;
    neighborMines: number;
    isFlagged: boolean;
  };