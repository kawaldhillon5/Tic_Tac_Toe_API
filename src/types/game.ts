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

export interface GameRow {
    id: string;             // The UUID from Postgres
    board: Cell[][];        // Your 2D array (parsed from JSONB)
    current_turn: 'X' | 'O';
    status: 'ongoing' | 'won' | 'draw';
    winner: 'X' | 'O' | null;
    created_at: Date;
}