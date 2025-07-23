import express from 'express';
import AppointmentController from '../controllers/AppointmentController.js';
import { authenticateToken, authorizeRoles } from '../middleware/auth.js';
import { validateAppointmentData } from '../middleware/validation.js';

const router = express.Router();

// Публичные маршруты с опциональной аутентификацией
router.post('/', optionalAuth, validateAppointmentData, AppointmentController.createAppointment);

// Защищенные маршруты
router.get('/', 
  authenticateToken,
  authorizeRoles('admin', 'manager'), 
  AppointmentController.getAllAppointments
);

router.get('/upcoming', 
  authenticateToken,
  authorizeRoles('admin', 'manager'), 
  AppointmentController.getUpcomingAppointments
);

router.get('/date/:date', 
  authenticateToken,
  authorizeRoles('admin', 'manager'), 
  AppointmentController.getAppointmentsByDate
);

router.get('/type/:type', 
  authenticateToken,
  authorizeRoles('admin', 'manager'), 
  AppointmentController.getAppointmentsByType
);

router.get('/user/:userId', authenticateToken, AppointmentController.getAppointmentsByUserId);

router.get('/:id', authenticateToken, AppointmentController.getAppointmentById);


router.put('/:id', authenticateToken, AppointmentController.updateAppointment);

router.put('/:id/status', 
  authenticateToken,
  authorizeRoles('admin', 'manager'), 
  AppointmentController.updateAppointmentStatus
);

router.delete('/:id', authenticateToken, AppointmentController.deleteAppointment);

export default router;