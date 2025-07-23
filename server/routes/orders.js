import express from 'express';
import OrderController from '../controllers/OrderController.js';
import { authenticateToken, authorizeRoles } from '../middleware/auth.js';
import { validateOrderData } from '../middleware/validation.js';

const router = express.Router();

// Все маршруты требуют аутентификации
router.use(authenticateToken);

router.get('/', 
  authorizeRoles('admin', 'manager'), 
  OrderController.getAllOrders
);

router.get('/statistics', 
  authorizeRoles('admin', 'manager'), 
  OrderController.getOrderStatistics
);

router.get('/status/:status', 
  authorizeRoles('admin', 'manager'), 
  OrderController.getOrdersByStatus
);

router.get('/user/:userId', OrderController.getOrdersByUserId);

router.get('/:id', OrderController.getOrderById);

router.post('/', validateOrderData, OrderController.createOrder);

router.put('/:id', OrderController.updateOrder);

router.put('/:id/status', 
  authorizeRoles('admin', 'manager'), 
  OrderController.updateOrderStatus
);

router.delete('/:id', 
  authorizeRoles('admin', 'manager'), 
  OrderController.deleteOrder
);

export default router;