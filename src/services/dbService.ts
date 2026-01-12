import pool from '../config/db.js';
import type { Board } from '../types/game.js';

export const createGame = async (): Promise<string> => {
    const board: Board = [
        [null, null, null],
        [null, null, null],
        [null, null, null]
    ];


    const queryText = 'INSERT INTO games (board) VALUES ($1) RETURNING id';
    
    const res = await pool.query(queryText, [JSON.stringify(board)]);

    return res.rows[0].id;
};