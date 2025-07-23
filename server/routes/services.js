import express from 'express';
import ServiceController from '../controllers/ServiceController.js';
import { authenticateToken, authorizeRoles } from '../middleware/auth.js';
import { validateServiceData } from '../middleware/validation.js';

const router = express.Router();

// Публичные маршруты
router.get('/', ServiceController.getAllServices);
router.get('/active', ServiceController.getActiveServices);
router.get('/category/:category', ServiceController.getServicesByCategory);
router.get('/:id', ServiceController.getServiceById);

// Защищенные маршруты (только для администраторов и менеджеров)
router.post('/', 
  authenticateToken, 
  authorizeRoles('admin', 'manager'), 
  validateServiceData, 
  ServiceController.createService
);

router.put('/:id', 
  authenticateToken, 
  authorizeRoles('admin', 'manager'), 
  validateServiceData, 
  ServiceController.updateService
);

router.delete('/:id', 
  authenticateToken, 
  authorizeRoles('admin', 'manager'), 
  ServiceController.deleteService
);

export default router;