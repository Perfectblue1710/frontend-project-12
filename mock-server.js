const express = require('express');
const cors = require('cors');
const path = require('path');
const crypto = require('crypto');

const app = express();
const PORT = process.env.PORT || 5001;

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'frontend/dist')));

// База данных пользователей
const users = new Map();
users.set('admin', { password: 'admin', id: 1 });
users.set('user2', { password: 'password', id: 2 });

// Логирование всех запросов
app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  next();
});

// Регистрация
app.post('/api/v1/signup', (req, res) => {
  const { username, password } = req.body;
  console.log('Signup request:', { username });
  
  if (users.has(username)) {
    return res.status(409).json({ error: 'User already exists' });
  }
  
  const token = crypto.randomBytes(32).toString('hex');
  users.set(username, { password, id: users.size + 1 });
  
  res.json({ token, username });
});

// Логин
app.post('/api/v1/login', (req, res) => {
  const { username, password } = req.body;
  console.log('Login request:', { username });
  
  const user = users.get(username);
  if (!user || user.password !== password) {
    return res.status(401).json({ error: 'Invalid credentials' });
  }
  
  const token = crypto.randomBytes(32).toString('hex');
  res.json({ token, username });
});

// Получение каналов
app.get('/api/v1/channels', (req, res) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  res.json([
    { id: 1, name: 'general' },
    { id: 2, name: 'random' }
  ]);
});

// Получение сообщений
app.get('/api/v1/messages', (req, res) => {
  res.json([]);
});

// Отправка сообщения
app.post('/api/v1/messages', (req, res) => {
  const { channelId, body } = req.body;
  res.json({ 
    id: Date.now(), 
    channelId, 
    body, 
    username: 'test', 
    createdAt: new Date(),
    userId: 1
  });
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`✓ Mock server listening at http://0.0.0.0:${PORT}`);
  console.log(`✓ POST /api/v1/signup - регистрация доступна`);
  console.log(`✓ POST /api/v1/login - логин доступен`);
  console.log(`✓ GET /api/v1/channels - каналы доступны`);
});
