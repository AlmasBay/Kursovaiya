// server.js
import express from 'express';
import fetch from 'node-fetch';
import cors from 'cors';
import bcrypt from 'bcrypt';
import { Pool } from 'pg';
import crypto from 'crypto';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const port = process.env.PORT || 5000;

// Настройка подключения к PostgreSQL
const pool = new Pool({
  user: process.env.DB_USER || 'postgres',
  host: process.env.DB_HOST || 'localhost',
  database: process.env.DB_NAME || 'petcare',
  password: process.env.DB_PASSWORD || 'yourpassword',
  port: process.env.DB_PORT || 5432,
});

// Middleware
app.use(cors({
  origin: 'https://almasbay.github.io',
  credentials: true
}));
app.use(express.json());

// API для мест
app.get('/api/places', async (req, res) => {
  const { lat, lng } = req.query;
  const apiKey = process.env.GOOGLE_API_KEY;
  const url = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${lat},${lng}&radius=10000&keyword=pet+store&key=${apiKey}`;

  try {
    const response = await fetch(url);
    const data = await response.json();
    res.json(data);
  } catch (error) {
    console.error('Error fetching data:', error);
    res.status(500).json({ error: 'Error fetching data' });
  }
});

// API для аутентификации
app.post('/api/auth/register', async (req, res) => {
  const { username, email, password, full_name } = req.body;

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    
    const result = await pool.query(
      'INSERT INTO users (username, email, password_hash, full_name) VALUES ($1, $2, $3, $4) RETURNING id, username, email, full_name',
      [username, email, hashedPassword, full_name]
    );
    
    res.status(201).json({ user: result.rows[0] });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(400).json({ error: error.message });
  }
});

app.post('/api/auth/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    
    if (user.rows.length === 0) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    
    const isValid = await bcrypt.compare(password, user.rows[0].password_hash);
    
    if (!isValid) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    
    // Обновляем время последнего входа
    await pool.query(
      'UPDATE users SET last_login = CURRENT_TIMESTAMP WHERE id = $1',
      [user.rows[0].id]
    );
    
    res.json({ 
      user: {
        id: user.rows[0].id,
        username: user.rows[0].username,
        email: user.rows[0].email,
        full_name: user.rows[0].full_name
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Login failed' });
  }
});

// API для сброса пароля
app.post('/api/auth/forgot-password', async (req, res) => {
  const { email } = req.body;
  
  try {
    const user = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    
    if (user.rows.length === 0) {
      return res.status(404).json({ message: 'Если email существует, инструкции отправлены' });
    }
    
    const token = crypto.randomBytes(20).toString('hex');
    const expiresAt = new Date(Date.now() + 3600000); // 1 час
    
    await pool.query(
      'INSERT INTO password_resets (user_id, token, expires_at) VALUES ($1, $2, $3)',
      [user.rows[0].id, token, expiresAt]
    );
    
    // В реальном приложении здесь будет отправка email
    console.log(`Ссылка для сброса: https://almasbay.github.io/reset-password?token=${token}`);
    
    res.json({ message: 'Если email существует, инструкции отправлены' });
  } catch (error) {
    console.error('Forgot password error:', error);
    res.status(500).json({ error: 'Error processing request' });
  }
});

app.post('/api/auth/reset-password', async (req, res) => {
  const { token, newPassword } = req.body;
  
  try {
    const reset = await pool.query(
      `SELECT * FROM password_resets 
       WHERE token = $1 AND used = false AND expires_at > NOW()`,
      [token]
    );
    
    if (reset.rows.length === 0) {
      return res.status(400).json({ error: 'Недействительный или просроченный токен' });
    }
    
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    
    await pool.query('BEGIN');
    
    await pool.query(
      'UPDATE users SET password_hash = $1 WHERE id = $2',
      [hashedPassword, reset.rows[0].user_id]
    );
    
    await pool.query(
      'UPDATE password_resets SET used = true WHERE id = $1',
      [reset.rows[0].id]
    );
    
    await pool.query('COMMIT');
    
    res.json({ message: 'Пароль успешно изменен' });
  } catch (error) {
    await pool.query('ROLLBACK');
    console.error('Reset password error:', error);
    res.status(500).json({ error: 'Error resetting password' });
  }
});

// Запуск сервера
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});