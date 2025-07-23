import express from 'express';
import TradeInController from '../controllers/TradeInController.js';
import { authenticateToken, authorizeRoles } from '../middleware/auth.js';
import { optionalAuth } from '../middleware/auth.js';

const router = express.Router();

// Публичные маршруты с опциональной аутентификацией
router.post('/', optionalAuth, TradeInController.createTradeIn);

// Защищенные маршруты
router.get('/', 
  authenticateToken,
  authorizeRoles('admin', 'manager'), 
  TradeInController.getAllTradeIns
);

router.get('/status/:status', 
  authenticateToken,
  authorizeRoles('admin', 'manager'), 
  TradeInController.getTradeInsByStatus
);

router.get('/user/:userId', authenticateToken, TradeInController.getTradeInsByUserId);

router.get('/:id', authenticateToken, TradeInController.getTradeInById);


router.put('/:id', authenticateToken, TradeInController.updateTradeIn);

router.put('/:id/status', 
  authenticateToken,
  authorizeRoles('admin', 'manager'), 
  TradeInController.updateTradeInStatus
);

router.put('/:id/evaluation', 
  authenticateToken,
  authorizeRoles('admin', 'manager'), 
  TradeInController.updateTradeInEvaluation
);

router.delete('/:id', 
  authenticateToken,
  authorizeRoles('admin', 'manager'), 
  TradeInController.deleteTradeIn
);

export default router;