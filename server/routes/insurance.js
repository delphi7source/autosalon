import express from 'express';
import InsuranceController from '../controllers/InsuranceController.js';
import { authenticateToken, authorizeRoles } from '../middleware/auth.js';

const router = express.Router();

// Все маршруты требуют аутентификации
router.use(authenticateToken);

router.get('/', 
  authorizeRoles('admin', 'manager'), 
  InsuranceController.getAllInsurance
);

router.get('/type/:type', 
  authorizeRoles('admin', 'manager'), 
  InsuranceController.getInsuranceByType
);

router.get('/status/:status', 
  authorizeRoles('admin', 'manager'), 
  InsuranceController.getInsuranceByStatus
);

router.get('/user/:userId', InsuranceController.getInsuranceByUserId);

router.get('/:id', InsuranceController.getInsuranceById);

router.post('/', InsuranceController.createInsurance);

router.put('/:id', InsuranceController.updateInsurance);

router.put('/:id/status', 
  authorizeRoles('admin', 'manager'), 
  InsuranceController.updateInsuranceStatus
);

router.delete('/:id', 
  authorizeRoles('admin', 'manager'), 
  InsuranceController.deleteInsurance
);

export default router;