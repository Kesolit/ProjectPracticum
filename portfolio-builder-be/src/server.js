const express = require('express');
const cors = require('cors');

const app = express();
const PORT = 5000;

// CORS — разрешаем запросы с локального фронтенда
app.use(cors({
  origin: ['http://localhost:3000', 'http://localhost:5173'],
  credentials: true
}));

app.use(express.json());

// Моковые данные (черновик портфолио)
let draftPortfolio = {
  id: 'draft-1',
  title: 'Моё портфолио',
  sections: [
    { id: '1', type: 'about', title: 'О себе', content: 'Привет! Я разработчик' },
    { id: '2', type: 'skills', title: 'Навыки', content: ['JavaScript', 'React', 'Node.js'] }
  ],
  updatedAt: new Date().toISOString()
};

// GET /api/portfolio/draft — получить черновик
app.get('/api/portfolio/draft', (req, res) => {
  res.json({
    success: true,
    data: draftPortfolio
  });
});

// POST /api/portfolio/draft — сохранить черновик
app.post('/api/portfolio/draft', (req, res) => {
  const updatedData = req.body;
  
  draftPortfolio = {
    ...draftPortfolio,
    ...updatedData,
    updatedAt: new Date().toISOString()
  };
  
  res.json({
    success: true,
    message: 'Черновик сохранён',
    data: draftPortfolio
  });
});

// Запуск сервера
app.listen(PORT, () => {
  console.log(`🚀 Сервер запущен на http://localhost:${PORT}`);
  console.log(`   GET  /api/portfolio/draft`);
  console.log(`   POST /api/portfolio/draft`);
});