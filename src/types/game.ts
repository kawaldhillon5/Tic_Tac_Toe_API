export type Player = 'X' | 'O';
export type Cell = Player | null;
export type Board = Cell[][];

export interface GameStatus {
    winner: Player | 'Draw' | null;
    gameOver: boolean;
}

export interface ValidateMoveResult {
    isValid: boolean;
    error: string|null
}

export interface MoveResult {
    board: Board;
    success: boolean;
    error: string | null;
}