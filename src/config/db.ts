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
    id TEXT PRIMARY KEY,
    board TEXT NOT NULL,
    current_turn TEXT NOT NULL DEFAULT 'X',
    status TEXT NOT NULL DEFAULT 'ongoing',
    winner TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )
`);

export default db;