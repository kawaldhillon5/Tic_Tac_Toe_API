// import pg from 'pg';
// const { Pool } = pg;
// import dotenv from 'dotenv';

// dotenv.config();

// const pool = new Pool({
//   user: process.env.DB_USER,
//   host: process.env.DB_HOST,
//   database: process.env.DB_NAME,
//   password: process.env.DB_PASSWORD,
//   port: Number(process.env.DB_PORT) || 5432,
// });

// // A quick helper to test the connection
// pool.on('connect', () => {
//   console.log('Connected to PostgreSQL');
// });

// export default pool;


//sqlite

import Database from 'better-sqlite3';

const db: Database.Database = new Database('tictactoe.db', { verbose: console.log });

db.exec(`
  CREATE TABLE IF NOT EXISTS games (
    id Text PRIMARY KEY ,
    board TEXT NOT NULL,
    player1 JSONB,
    player2 JSONB,
    current_turn JSONB,
    status TEXT NOT NULL DEFAULT 'waiting',
    winner JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
  )
`);

export default db;