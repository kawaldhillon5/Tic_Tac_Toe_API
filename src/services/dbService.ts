import { json } from 'stream/consumers';
import db from '../config/db.js';
// import pool from '../config/db.js';
import type { Board, GameRow } from '../types/game.js';
import { v4 as uuidv4 } from 'uuid';

export const createGame = async (username:string): Promise<string> => {
    const id  = uuidv4();
    const board: Board = [
        [null, null, null],
        [null, null, null],
        [null, null, null]
    ];

    //Postgresql
    // const queryText = 'INSERT INTO games (board, created_at) VALUES ($1) RETURNING id';
    
    // const res = await pool.query(queryText, [JSON.stringify(board)]);

    // return res.rows[0].id;

    //SQLite

    const stmt = db.prepare('INSERT INTO games (id, board, player1) VALUES (?, ?, ?)');
    stmt.run(id, JSON.stringify(board), JSON.stringify({username:username, mark:'X'}));
    
    return id;
};



export const updateGame = async (game: GameRow): Promise<GameRow> =>{
    //postgreSql
    // const queryText = `
    //     UPDATE games 
    //     SET board = $1, current_turn = $2, status = $3, winner = $4, updated_at = NOW() 
    //     WHERE id = $5 
    //     RETURNING *;
    // `;

    // const res = await pool.query(queryText, values);

    // if (res.rows.length === 0) {
    //     throw new Error('Could not find game to update');
    // }

    // return res.rows[0];

    //sqlite

    const stmt = db.prepare(`
        UPDATE games 
        SET board = ?, player1 = ?, player2 = ?,  current_turn = ?, status = ?, winner = ? 
        WHERE id = ?
    `); 
    
    const values = [
        JSON.stringify(game.board), 
        JSON.stringify(game.player1),
        JSON.stringify(game.player2),
        JSON.stringify(game.current_turn), 
        game.status, 
        JSON.stringify(game.winner), 
        game.id
    ];

    const info = stmt.run(values);
    
    if (info.changes === 0) {
        throw new Error('Could not find game to update');
    }

    return game;
    
     
}

export const getGameinWaiting = async (username:string): Promise<GameRow | null> =>{
    const stmt = db.prepare(`
        SELECT * FROM games WHERE status = 'waiting' AND player1 NOT LIKE ? LIMIT 1;
    `);
    const row = stmt.get(`%${username}%`) as any;
    
    if (!row) return null;

    return {
        ...row,
        board: JSON.parse(row.board),
        player1: JSON.parse(row.player1)
    };

}

export const getGameById =  async (id: string): Promise<GameRow | null> =>{
    // const queryText  = 'SELECT * FROM games WHERE id = $1';
    // const res = await pool.query(queryText, [id])

    // if (res.rows.length === 0) {
    //     return null; 
    // }

    // return res.rows[0];

    //sqlite
    const stmt = db.prepare('SELECT * FROM games WHERE id = ?');
    const row = stmt.get(id) as any;

    if (!row) return null;

    // We manually parse the board string back into a 2D array
    return {
        ...row,
        board: JSON.parse(row.board),
        player1: JSON.parse(row.player1),
        player2: JSON.parse(row.player2),
        current_turn: JSON.parse(row.current_turn)
    };
} 

export const deleteOldGames = async (hours: number): Promise<number> => {
    //postgresql
    // const queryText = `
    //     DELETE FROM games 
    //     WHERE updated_at < NOW() - ($1 || ' hours')::INTERVAL;
    // `;
    
    // const res = await pool.query(queryText, [hours]);
    
    // return res.rowCount || 0;


    //sqlite
    const stmt = db.prepare(`
        DELETE FROM games 
        WHERE created_at < datetime('now', ?)
    `);
    
    const info = stmt.run(`-${hours} hours`);
    
    return info.changes;
};