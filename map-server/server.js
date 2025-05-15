// server.js - Сервер с разрешенным CORS для любого домена
import express from 'express';
import cors from 'cors';

const app = express();
const port = 5000;

// Google API Key
const GOOGLE_API_KEY = 'AIzaSyCn2ndeHkGiOjNO-TaIgWGUjBgL1NyilHw';

// Middleware - разрешаем запросы с любого источника
app.use(cors({
  origin: '*',  // Разрешаем запросы с любого источника
  credentials: true
}));
app.use(express.json());

// API для мест
app.get('/api/places', async (req, res) => {
  const { lat, lng } = req.query;
  
  if (!lat || !lng) {
    return res.status(400).json({ error: 'Необходимы широта и долгота' });
  }
  
  const url = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${lat},${lng}&radius=10000&keyword=pet+store&key=${GOOGLE_API_KEY}`;

  try {
    const response = await fetch(url);
    const data = await response.json();
    res.json(data);
  } catch (error) {
    console.error('Ошибка получения данных:', error);
    res.status(500).json({ error: 'Ошибка получения данных из Google Places API' });
  }
});

// Проверка работы сервера
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Запуск сервера
app.listen(port, () => {
  console.log(`Сервер запущен на http://localhost:${port}`);
});