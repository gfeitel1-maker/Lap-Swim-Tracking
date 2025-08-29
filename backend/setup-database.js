const { Pool } = require('pg');
require('dotenv').config();


const pool = new Pool({
connectionString: process.env.DATABASE_URL,
ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
});


async function setupDatabase() {
const client = await pool.connect();
try {
console.log('Setting up database...');
await client.query(`
CREATE TABLE IF NOT EXISTS entries (
id SERIAL PRIMARY KEY,
swimmer_name VARCHAR(255) NOT NULL,
laps INTEGER NOT NULL CHECK (laps > 0),
date DATE NOT NULL,
created_at TIMESTAMP DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_entries_swimmer_name ON entries(swimmer_name);
CREATE INDEX IF NOT EXISTS idx_entries_date ON entries(date);
CREATE INDEX IF NOT EXISTS idx_entries_created_at ON entries(created_at);
`);
console.log('Database ready.');
} catch (e) {
console.error('Error setting up database:', e);
process.exit(1);
} finally {
client.release();
await pool.end();
}
}
setupDatabase();
