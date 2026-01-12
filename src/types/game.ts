export type Player = 'X' | 'O';
export type Cell = Player | null;
export type Board = Cell[][];

export interface GameStatus {
    winner: Player | null;
    gameOver: boolean;
    gameStatus: 'ongoing' | 'won' | 'draw'
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

export interface GameRow {
    id: string;             
    board: Board;        
    current_turn: 'X' | 'O';
    status: 'ongoing' | 'won' | 'draw';
    winner: 'X' | 'O' | null;
    created_at: Date;
}