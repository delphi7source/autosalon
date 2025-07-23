import express from 'express';
import carsRouter from './cars.js';
import usersRouter from './users.js';
import ordersRouter from './orders.js';
import servicesRouter from './services.js';
import appointmentsRouter from './appointments.js';
import tradeinRouter from './tradein.js';
import insuranceRouter from './insurance.js';

const router = express.Router();

// API маршруты
router.use('/cars', carsRouter);
router.use('/users', usersRouter);
router.use('/orders', ordersRouter);
router.use('/services', servicesRouter);
router.use('/appointments', appointmentsRouter);
router.use('/tradein', tradeinRouter);
router.use('/insurance', insuranceRouter);

// Корневой маршрут API
router.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'AutoPremium API v1.0',
    version: '1.0.0',
    endpoints: {
      cars: '/api/cars',
      users: '/api/users',
      orders: '/api/orders',
      services: '/api/services',
      appointments: '/api/appointments',
      tradein: '/api/tradein',
      insurance: '/api/insurance'
    },
    documentation: 'https://api.autopremium.ru/docs'
  });
});

export default router;