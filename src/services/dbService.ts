import pool from '../config/db.js';
import type { Board, GameRow } from '../types/game.js';

export const createGame = async (): Promise<string> => {

    const board: Board = [
        [null, null, null],
        [null, null, null],
        [null, null, null]
    ];


    const queryText = 'INSERT INTO games (board, created_at) VALUES ($1) RETURNING id';
    
    const res = await pool.query(queryText, [JSON.stringify(board)]);

    return res.rows[0].id;
};

export const updateGame = async (game: GameRow): Promise<GameRow> =>{
    const queryText = `
        UPDATE games 
        SET board = $1, current_turn = $2, status = $3, winner = $4, updated_at = NOW() 
        WHERE id = $5 
        RETURNING *;
    `;
    
    
    const values = [
        JSON.stringify(game.board), 
        game.current_turn, 
        game.status, 
        game.winner, 
        game.id
    ];

    const res = await pool.query(queryText, values);
    
    if (res.rows.length === 0) {
        throw new Error('Could not find game to update');
    }

    return res.rows[0]; 
}

export const getGameById =  async (id: string): Promise<GameRow | null> =>{
    const queryText  = 'SELECT * FROM games WHERE id = $1';
    const res = await pool.query(queryText, [id])

    if (res.rows.length === 0) {
        return null; 
    }

    return res.rows[0];
} 

export const deleteOldGames = async (hours: number): Promise<number> => {
    const queryText = `
        DELETE FROM games 
        WHERE updated_at < NOW() - ($1 || ' hours')::INTERVAL;
    `;
    
    const res = await pool.query(queryText, [hours]);
    
    return res.rowCount || 0;
};