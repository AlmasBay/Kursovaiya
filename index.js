import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import pkg from 'pg';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const { Pool } = pkg;
const app = express();
app.use(cors({
  origin: 'http://localhost:5173', // Замените на ваш домен фронтенда в продакшн
  credentials: true
}));
app.use(bodyParser.json());

// Настройки подключения к базе данных
const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'petcare',
  password: 'Almas200707',
  port: 5432,
});

const JWT_SECRET = process.env.JWT_SECRET || 'supersecretkey12345'; // Используйте переменные окружения в продакшене

// Генерация JWT токена с увеличенным сроком действия
const generateToken = (userId, userName) => {
  return jwt.sign({ id: userId, name: userName }, JWT_SECRET, { expiresIn: '7d' }); // Увеличиваем до 7 дней
};

// Мидлвар для проверки токена
const authenticateJWT = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: "Токен не предоставлен" });
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ message: "Неверный или просроченный токен" });
    }
    req.user = user;
    next();
  });
};

// Регистрация пользователя
app.post('/api/register', async (req, res) => {
  const { name, email, password } = req.body;

  try {
    // Проверка на существующего пользователя
    const userExists = await pool.query(
      "SELECT * FROM users WHERE email = $1 OR name = $2", 
      [email, name]
    );

    if (userExists.rows.length > 0) {
      return res.status(400).json({ 
        message: "Пользователь с таким email или именем уже существует" 
      });
    }

    // Хеширование пароля
    const hashedPassword = await bcrypt.hash(password, 10);
    
    // Создание пользователя
    const newUser = await pool.query(
      "INSERT INTO users (name, email, password) VALUES ($1, $2, $3) RETURNING id, name, email",
      [name, email, hashedPassword]
    );

    // Генерация токена
    const token = generateToken(newUser.rows[0].id, newUser.rows[0].name);

    res.status(201).json({ 
      message: "Регистрация успешна",
      user: newUser.rows[0],
      token 
    });
  } catch (err) {
    console.error("Ошибка регистрации:", err);
    res.status(500).json({ message: "Ошибка сервера при регистрации" });
  }
});

// Вход пользователя
app.post('/api/login', async (req, res) => {
  const { emailOrName, password } = req.body;

  try {
    // Поиск пользователя по email или имени
    const result = await pool.query(
      "SELECT * FROM users WHERE email = $1 OR name = $1",
      [emailOrName]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Пользователь не найден" });
    }

    const user = result.rows[0];
    
    // Проверка пароля
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Неверный пароль" });
    }

    // Генерация токена
    const token = generateToken(user.id, user.name);

    // Возвращаем данные пользователя (без пароля)
    const userData = {
      id: user.id,
      name: user.name,
      email: user.email,
      createdAt: user.created_at
    };

    res.status(200).json({ 
      message: "Вход выполнен успешно", 
      user: userData,
      token 
    });
  } catch (err) {
    console.error("Ошибка входа:", err);
    res.status(500).json({ message: "Ошибка сервера при входе" });
  }
});

// Получение данных пользователя
app.get('/api/user', authenticateJWT, async (req, res) => {
  try {
    const userId = req.user.id;
    
    const result = await pool.query(
      "SELECT id, name, email, created_at FROM users WHERE id = $1",
      [userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Пользователь не найден" });
    }

    res.json({ user: result.rows[0] });
  } catch (err) {
    console.error("Ошибка получения данных пользователя:", err);
    res.status(500).json({ message: "Ошибка сервера" });
  }
});

// Проверка валидности токена
app.get('/api/verify-token', authenticateJWT, (req, res) => {
  res.status(200).json({ 
    valid: true, 
    user: req.user 
  });
});

// Сброс пароля
app.post('/api/reset-password', async (req, res) => {
  const { email, newPassword } = req.body;

  try {
    // Проверка существования пользователя
    const user = await pool.query(
      "SELECT * FROM users WHERE email = $1", 
      [email]
    );

    if (user.rows.length === 0) {
      return res.status(404).json({ message: "Пользователь с таким email не найден" });
    }

    // Хеширование нового пароля
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Обновление пароля
    await pool.query(
      "UPDATE users SET password = $1 WHERE email = $2",
      [hashedPassword, email]
    );

    res.json({ message: "Пароль успешно обновлён" });
  } catch (err) {
    console.error("Ошибка сброса пароля:", err);
    res.status(500).json({ message: "Ошибка сервера при сбросе пароля" });
  }
});

// Защищенный маршрут для примера
app.get('/api/protected', authenticateJWT, (req, res) => {
  res.json({ 
    message: "Это защищенный маршрут",
    user: req.user 
  });
});

// Выход из системы (на клиенте просто удаляется токен)
app.post('/api/logout', authenticateJWT, (req, res) => {
  // В реальном приложении можно добавить токен в черный список
  res.json({ message: "Выход выполнен успешно" });
});



// Маршруты API для управления приемами пищи питомцев

// Получение всех приемов пищи пользователя
app.get('/api/pet-meals', authenticateJWT, async (req, res) => {
  try {
    const userId = req.user.id;
    
    const result = await pool.query(
      "SELECT * FROM pet_meals WHERE user_id = $1 ORDER BY meal_date DESC, meal_time DESC",
      [userId]
    );

    res.json({ meals: result.rows });
  } catch (err) {
    console.error("Ошибка получения приемов пищи:", err);
    res.status(500).json({ message: "Ошибка сервера" });
  }
});

// Добавление нового приема пищи
app.post('/api/pet-meals', authenticateJWT, async (req, res) => {
  const { meal_date, meal_time, food, quantity, notes } = req.body;
  const userId = req.user.id;

  try {
    const result = await pool.query(
      "INSERT INTO pet_meals (user_id, meal_date, meal_time, food, quantity, notes) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *",
      [userId, meal_date, meal_time, food, quantity, notes]
    );

    res.status(201).json({ 
      message: "Прием пищи успешно добавлен",
      meal: result.rows[0]
    });
  } catch (err) {
    console.error("Ошибка добавления приема пищи:", err);
    res.status(500).json({ message: "Ошибка сервера" });
  }
});

// Обновление приема пищи
app.put('/api/pet-meals/:id', authenticateJWT, async (req, res) => {
  const { meal_date, meal_time, food, quantity, notes } = req.body;
  const mealId = req.params.id;
  const userId = req.user.id;

  try {
    // Проверяем, принадлежит ли запись пользователю
    const mealCheck = await pool.query(
      "SELECT id FROM pet_meals WHERE id = $1 AND user_id = $2",
      [mealId, userId]
    );
    
    if (mealCheck.rows.length === 0) {
      return res.status(403).json({ message: "Доступ запрещен" });
    }
    
    const result = await pool.query(
      "UPDATE pet_meals SET meal_date = $1, meal_time = $2, food = $3, quantity = $4, notes = $5 WHERE id = $6 AND user_id = $7 RETURNING *",
      [meal_date, meal_time, food, quantity, notes, mealId, userId]
    );

    res.json({ 
      message: "Прием пищи успешно обновлен",
      meal: result.rows[0]
    });
  } catch (err) {
    console.error("Ошибка обновления приема пищи:", err);
    res.status(500).json({ message: "Ошибка сервера" });
  }
});

// Удаление приема пищи
app.delete('/api/pet-meals/:id', authenticateJWT, async (req, res) => {
  const mealId = req.params.id;
  const userId = req.user.id;

  try {
    // Проверяем, принадлежит ли запись пользователю
    const mealCheck = await pool.query(
      "SELECT id FROM pet_meals WHERE id = $1 AND user_id = $2",
      [mealId, userId]
    );
    
    if (mealCheck.rows.length === 0) {
      return res.status(403).json({ message: "Доступ запрещен" });
    }
    
    await pool.query(
      "DELETE FROM pet_meals WHERE id = $1 AND user_id = $2",
      [mealId, userId]
    );

    res.json({ message: "Прием пищи успешно удален" });
  } catch (err) {
    console.error("Ошибка удаления приема пищи:", err);
    res.status(500).json({ message: "Ошибка сервера" });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Сервер запущен на порту ${PORT}`);
});