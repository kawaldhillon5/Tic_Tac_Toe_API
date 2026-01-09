export type Player = 'X' | 'O';
export type Cell = Player | null;
export type Board = Cell[][];

export interface GameStatus {
    winner: Player | 'Draw' | null;
    gameOver: boolean;
}