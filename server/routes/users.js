import express from 'express';
import UserController from '../controllers/UserController.js';
import { authenticateToken, authorizeRoles } from '../middleware/auth.js';
import { validateUserData } from '../middleware/validation.js';

const router = express.Router();

// Публичные маршруты
router.post('/register', validateUserData, UserController.register);
router.post('/login', UserController.login);

// Защищенные маршруты
router.get('/', 
  authenticateToken, 
  authorizeRoles('admin', 'manager'), 
  UserController.getAllUsers
);

router.get('/role/:role', 
  authenticateToken, 
  authorizeRoles('admin', 'manager'), 
  UserController.getUsersByRole
);

router.get('/:id', 
  authenticateToken, 
  UserController.getUserById
);

router.post('/', 
  authenticateToken, 
  authorizeRoles('admin'), 
  validateUserData, 
  UserController.createUser
);

router.put('/:id', 
  authenticateToken, 
  UserController.updateUser
);

router.delete('/:id', 
  authenticateToken, 
  authorizeRoles('admin'), 
  UserController.deleteUser
);

export default router;