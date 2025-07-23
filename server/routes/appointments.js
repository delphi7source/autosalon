import express from 'express';
import AppointmentController from '../controllers/AppointmentController.js';
import { authenticateToken, authorizeRoles } from '../middleware/auth.js';
import { validateAppointmentData } from '../middleware/validation.js';

const router = express.Router();

// Все маршруты требуют аутентификации
router.use(authenticateToken);

router.get('/', 
  authorizeRoles('admin', 'manager'), 
  AppointmentController.getAllAppointments
);

router.get('/upcoming', 
  authorizeRoles('admin', 'manager'), 
  AppointmentController.getUpcomingAppointments
);

router.get('/date/:date', 
  authorizeRoles('admin', 'manager'), 
  AppointmentController.getAppointmentsByDate
);

router.get('/type/:type', 
  authorizeRoles('admin', 'manager'), 
  AppointmentController.getAppointmentsByType
);

router.get('/user/:userId', AppointmentController.getAppointmentsByUserId);

router.get('/:id', AppointmentController.getAppointmentById);

router.post('/', validateAppointmentData, AppointmentController.createAppointment);

router.put('/:id', AppointmentController.updateAppointment);

router.put('/:id/status', 
  authorizeRoles('admin', 'manager'), 
  AppointmentController.updateAppointmentStatus
);

router.delete('/:id', AppointmentController.deleteAppointment);

export default router;