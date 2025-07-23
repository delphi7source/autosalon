import express from 'express';
import TradeInController from '../controllers/TradeInController.js';
import { authenticateToken, authorizeRoles } from '../middleware/auth.js';

const router = express.Router();

// Все маршруты требуют аутентификации
router.use(authenticateToken);

router.get('/', 
  authorizeRoles('admin', 'manager'), 
  TradeInController.getAllTradeIns
);

router.get('/status/:status', 
  authorizeRoles('admin', 'manager'), 
  TradeInController.getTradeInsByStatus
);

router.get('/user/:userId', TradeInController.getTradeInsByUserId);

router.get('/:id', TradeInController.getTradeInById);

router.post('/', TradeInController.createTradeIn);

router.put('/:id', TradeInController.updateTradeIn);

router.put('/:id/status', 
  authorizeRoles('admin', 'manager'), 
  TradeInController.updateTradeInStatus
);

router.put('/:id/evaluation', 
  authorizeRoles('admin', 'manager'), 
  TradeInController.updateTradeInEvaluation
);

router.delete('/:id', 
  authorizeRoles('admin', 'manager'), 
  TradeInController.deleteTradeIn
);

export default router;