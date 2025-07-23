import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import path from 'path';
import { fileURLToPath } from 'url';

import apiRoutes from './routes/index.js';
import { errorHandler, notFoundHandler } from './middleware/errorHandler.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(helmet());
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true
}));
app.use(morgan('combined'));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Статические файлы
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// API маршруты
app.use('/api', apiRoutes);

// Корневой маршрут
app.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'AutoPremium Backend API',
    version: '1.0.0',
    status: 'running',
    timestamp: new Date().toISOString(),
    endpoints: {
      api: '/api',
      cars: '/api/cars',
      users: '/api/users',
      orders: '/api/orders',
      services: '/api/services',
      appointments: '/api/appointments',
      tradein: '/api/tradein',
      insurance: '/api/insurance'
    }
  });
});

// Health check
app.get('/health', (req, res) => {
  res.json({
    success: true,
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    memory: process.memoryUsage(),
    version: process.version
  });
});

// Обработка ошибок
app.use(notFoundHandler);
app.use(errorHandler);

// Запуск сервера
app.listen(PORT, () => {
  console.log(`🚀 Сервер запущен на порту ${PORT}`);
  console.log(`📡 API доступен по адресу: http://localhost:${PORT}/api`);
  console.log(`🏥 Health check: http://localhost:${PORT}/health`);
  console.log(`📚 Документация: http://localhost:${PORT}/api`);
  console.log('\n🔧 Для заполнения базы данных выполните: npm run seed');
});

export default app;