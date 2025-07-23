import express from 'express';
import CarController from '../controllers/CarController.js';
import { authenticateToken, authorizeRoles } from '../middleware/auth.js';
import { validateCarData } from '../middleware/validation.js';

const router = express.Router();

// Публичные маршруты
router.get('/', CarController.getAllCars);
router.get('/available', CarController.getAvailableCars);
router.get('/statistics', CarController.getCarStatistics);
router.get('/brand/:brand', CarController.getCarsByBrand);
router.get('/:id', CarController.getCarById);

// Защищенные маршруты (только для администраторов и менеджеров)
router.post('/', 
  authenticateToken, 
  authorizeRoles('admin', 'manager'), 
  validateCarData, 
  CarController.createCar
);

router.put('/:id', 
  authenticateToken, 
  authorizeRoles('admin', 'manager'), 
  validateCarData, 
  CarController.updateCar
);

router.delete('/:id', 
  authenticateToken, 
  authorizeRoles('admin', 'manager'), 
  CarController.deleteCar
);

export default router;