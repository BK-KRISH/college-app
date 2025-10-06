// backend/server.js
const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql2/promise');
const path = require('path');

const PORT = process.env.PORT || 3000;
const DB_HOST = process.env.DB_HOST || 'db';
const DB_USER = process.env.DB_USER || 'dev';
const DB_PASSWORD = process.env.DB_PASSWORD || 'devpass';
const DB_NAME = process.env.DB_NAME || 'college_db';

let pool;

async function initDbWithRetry(retries = 10, delay = 5000) {
  while (retries > 0) {
    try {
      console.log(`🔄 Trying to connect to DB (${DB_HOST})...`);
      pool = mysql.createPool({
        host: DB_HOST,
        user: DB_USER,
        password: DB_PASSWORD,
        database: DB_NAME,
        waitForConnections: true,
        connectionLimit: 10,
      });
      await pool.query('SELECT 1');
      console.log('✅ Database connected successfully!');
      return;
    } catch (err) {
      retries -= 1;
      console.error(`❌ DB connection failed (${err.code}). Retries left: ${retries}`);
      if (retries === 0) throw err;
      await new Promise((resolve) => setTimeout(resolve, delay));
    }
  }
}

const app = express();
app.use(bodyParser.json());

// Serve frontend static files
app.use(express.static(path.join(__dirname, 'public')));

// Health endpoint
app.get('/health', (req, res) => res.json({ status: 'ok' }));

// Login
app.post('/api/login', async (req, res) => {
  const { username, password } = req.body || {};
  if (!username || !password)
    return res.status(400).json({ error: 'Missing credentials' });
  try {
    const [rows] = await pool.query(
      'SELECT id, username, role FROM users WHERE username = ? AND password = ?',
      [username, password]
    );
    if (rows.length) return res.json({ success: true, user: rows[0] });
    return res.status(401).json({ success: false, message: 'Invalid username or password' });
  } catch (err) {
    console.error('Login error', err);
    res.status(500).json({ error: 'db error' });
  }
});

// Students
app.get('/api/students', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM students');
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'db error' });
  }
});

// Staffs
app.get('/api/staffs', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM staffs');
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'db error' });
  }
});

// HODs
app.get('/api/hod', async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT name, department, email FROM staffs WHERE role = 'HOD'");
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'db error' });
  }
});

// Start server after DB connection
initDbWithRetry()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`🚀 App listening on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error('❌ Failed to initialize DB after retries', err);
    process.exit(1);
  });

module.exports = app;
