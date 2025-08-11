const express = require('express');
const { Client } = require('pg');
const app = express();
const port = 5000;

const dbClient = new Client({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || 'postgres',
  database: process.env.DB_NAME || 'testdb',
  port: process.env.DB_PORT || 5432,
});

async function initDb() {
  await dbClient.connect();
  console.log('Connected to Postgres');

  // Create table if not exists
  await dbClient.query(`
    CREATE TABLE IF NOT EXISTS messages (
      id SERIAL PRIMARY KEY,
      text TEXT NOT NULL
    );
  `);

  // Check if table has any data
  const res = await dbClient.query('SELECT COUNT(*) FROM messages;');
  if (parseInt(res.rows[0].count, 10) === 0) {
    await dbClient.query('INSERT INTO messages (text) VALUES ($1)', [
      'Hello from Postgres (persistent data)!',
    ]);
    console.log('Inserted initial message into DB');
  } else {
    console.log('DB already has data, skipping insert');
  }
}

app.get('/api', async (req, res) => {
  try {
    const result = await dbClient.query(
      'SELECT text FROM messages ORDER BY id LIMIT 1;'
    );
    res.send(result.rows[0].text);
  } catch (err) {
    console.error('DB query error:', err);
    res.status(500).send('Database error');
  }
});

app.listen(port, async () => {
  try {
    await initDb();
    console.log(`Backend listening at http://localhost:${port}`);
  } catch (err) {
    console.error('Failed to initialize DB:', err);
  }
});
