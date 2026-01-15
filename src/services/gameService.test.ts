import { describe, it, expect } from 'vitest';
import { checkWinner, makeMove, validateMove } from './gameService.js';
import { Board } from '../types/game.js';

describe('Game Logic Service', () => {
    
    it('should detect a winning row', () => {
        const board: Board = [
            ['X', 'X', 'X'],
            [null, 'O', null],
            ['O', null, null]
        ];
        
        const result = checkWinner(board);
        expect(result.winner).toBe('X');
        expect(result.gameOver).toBe(true);
    });

    it('should detect a winning column', () => {
        const board: Board = [
            ['O', 'X', null],
            ['O', 'X', null],
            ['O', null, null]
        ];
        
        const result = checkWinner(board);
        expect(result.winner).toBe('O');
        expect(result.gameOver).toBe(true);
    });

    it('should return no winner for an empty board', () => {
        const board: Board = [
            [null, null, null],
            [null, null, null],
            [null, null, null]
        ];
        
        const result = checkWinner(board);
        expect(result.winner).toBe(null);
        expect(result.gameOver).toBe(false);
    });

    it('should return an error if the cell is already occupied', () => {
        const board: Board = [
            ['X', null, null],
            [null, null, null],
            [null, null, null]
        ];
        
        // We expect this to return an error because (0,0) is 'X'
        const result = validateMove(board, 0, 0); 
        expect(result.isValid).toBe(false);
        expect(result.error).toBe('Cell is Already occupied');
    });

    it('should return an error if the coordinates are out of bounds', () => {
        const board: Board = [
            [null, null, null],
            [null, null, null],
            [null, null, null]
        ];
        
        // Testing row too high
        const resultHigh = validateMove(board, 3, 0); 
        expect(resultHigh.isValid).toBe(false);
        expect(resultHigh.error).toBe('Coordinates are out of bounds');

        // Testing column too low
        const resultLow = validateMove(board, 0, -1); 
        expect(resultLow.isValid).toBe(false);
        expect(resultLow.error).toBe('Coordinates are out of bounds');
    });

    it('should return a new board with the move applied without mutating the original', () => {
        const originalBoard: Board = [
            [null, null, null],
            [null, null, null],
            [null, null, null]
        ];
        
        const row = 1;
        const col = 1;
        const player = 'X';

        const newBoard = makeMove(originalBoard, row, col, player).board;

        // Check if the move is there
        expect(newBoard[row][col]).toBe('X');
        
        // Check if the original board is still empty (No Mutation!)
        expect(originalBoard[row][col]).toBe(null);
    });

    it('should return an error message when attempting an invalid move', () => {
        const board: Board = [
            ['X', null, null],
            [null, null, null],
            [null, null, null]
        ];
        
        // We try to move where 'X' already is
        const result = makeMove(board, 0, 0, 'O');
            
        expect(result.success).toBe(false);
        expect(result.error).toBe('Cell is Already occupied'); // Matching your specific casing
        expect(result.board).toEqual(board); // Board should remain unchanged
    });
});