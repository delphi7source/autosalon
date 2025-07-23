import express from 'express';
import InsuranceController from '../controllers/InsuranceController.js';
import { authenticateToken, authorizeRoles } from '../middleware/auth.js';
import { optionalAuth } from '../middleware/auth.js';

const router = express.Router();

// Публичные маршруты с опциональной аутентификацией
router.post('/', optionalAuth, InsuranceController.createInsurance);

// Защищенные маршруты
router.get('/', 
  authenticateToken,
  authorizeRoles('admin', 'manager'), 
  InsuranceController.getAllInsurance
);

router.get('/type/:type', 
  authenticateToken,
  authorizeRoles('admin', 'manager'), 
  InsuranceController.getInsuranceByType
);

router.get('/status/:status', 
  authenticateToken,
  authorizeRoles('admin', 'manager'), 
  InsuranceController.getInsuranceByStatus
);

router.get('/user/:userId', authenticateToken, InsuranceController.getInsuranceByUserId);

router.get('/:id', authenticateToken, InsuranceController.getInsuranceById);


router.put('/:id', authenticateToken, InsuranceController.updateInsurance);

router.put('/:id/status', 
  authenticateToken,
  authorizeRoles('admin', 'manager'), 
  InsuranceController.updateInsuranceStatus
);

router.delete('/:id', 
  authenticateToken,
  authorizeRoles('admin', 'manager'), 
  InsuranceController.deleteInsurance
);

export default router;