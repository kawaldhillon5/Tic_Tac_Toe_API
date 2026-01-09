import { error } from 'node:console';
import type { Board, Player, GameStatus, Cell } from '../types/game.js';

export const checkWinner = (board: Board): GameStatus => {

    // 1. Check Rows
    for (let i = 0; i < 3; i++) {
        const row = board[i];
        if (row && row[0] && row[0] === row[1] && row[0] === row[2]) {
            return { winner: row[0], gameOver: true };
        }
    } 

    // 2. Check Columns
    for (let i = 0; i < 3; i++) {
        const cell0 = board[0]?.[i];
        const cell1 = board[1]?.[i];
        const cell2 = board[2]?.[i];

        if (cell0 && cell0 === cell1 && cell0 === cell2) {
            return { winner: cell0, gameOver: true };
        }
    }

    // 3. Check Diagonals
    const mid = board[1]?.[1];
    if (mid) {
        if (board[0]?.[0] === mid && board[2]?.[2] === mid) {
            return { winner: mid, gameOver: true };
        }
        if (board[0]?.[2] === mid && board[2]?.[0] === mid) {
            return { winner: mid, gameOver: true };
        }
    }

    // 4. Check Draw
    const isDraw = board.flat().every(cell => cell !== null);
    if (isDraw) {
        return { winner: 'Draw', gameOver: true };
    }

    // Final Fallback
    return { winner: null, gameOver: false };
};

export const validateMove = (board:Board, row:number, column: number)=>{
    
    //check if board is valid
    if(!board || board[0]?.length ===0){
        return {isValid: false, error:"Invalid Board"}
    }

    //check for out of board cordinates 
    const boardRowLenght = board.length;
    const boardColumnLenght = board[0]?.length;
    if((boardRowLenght && boardColumnLenght) && (row >= boardRowLenght || column >= boardColumnLenght || row < 0 || column < 0) ){
        return {isValid:false, error:"Coordinates are out of bounds"}
    }
    //check if cell is already occupied
    if(board[row]?.[column] !==null){
        return {isValid:false, error:"Cell is Already occupied"}
    }
    return {isValid:true}
}