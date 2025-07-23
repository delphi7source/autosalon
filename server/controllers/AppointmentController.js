import Appointment from '../models/Appointment.js';

class AppointmentController {
  static async getAllAppointments(req, res) {
    try {
      const appointments = await Appointment.findAll();
      
      res.json({
        success: true,
        data: appointments,
        count: appointments.length
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Ошибка при получении списка записей',
        error: error.message
      });
    }
  }

  static async getAppointmentById(req, res) {
    try {
      const { id } = req.params;
      const appointment = await Appointment.findById(id);
      
      if (!appointment) {
        return res.status(404).json({
          success: false,
          message: 'Запись не найдена'
        });
      }
      
      res.json({
        success: true,
        data: appointment
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Ошибка при получении записи',
        error: error.message
      });
    }
  }

  static async createAppointment(req, res) {
    try {
      const appointmentData = req.body;
      
      // Если пользователь не авторизован, создаем гостевую запись
      if (!req.user && appointmentData.userId === 'guest') {
        appointmentData.userId = null;
      }
      
      const appointment = await Appointment.create(appointmentData);
      
      res.status(201).json({
        success: true,
        data: appointment,
        message: 'Запись успешно создана'
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Ошибка при создании записи',
        error: error.message
      });
    }
  }

  static async updateAppointment(req, res) {
    try {
      const { id } = req.params;
      const updateData = req.body;
      
      const result = await Appointment.update(id, updateData);
      
      if (result.matchedCount === 0) {
        return res.status(404).json({
          success: false,
          message: 'Запись не найдена'
        });
      }
      
      const updatedAppointment = await Appointment.findById(id);
      
      res.json({
        success: true,
        data: updatedAppointment,
        message: 'Запись успешно обновлена'
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Ошибка при обновлении записи',
        error: error.message
      });
    }
  }

  static async deleteAppointment(req, res) {
    try {
      const { id } = req.params;
      const result = await Appointment.delete(id);
      
      if (result.deletedCount === 0) {
        return res.status(404).json({
          success: false,
          message: 'Запись не найдена'
        });
      }
      
      res.json({
        success: true,
        message: 'Запись успешно удалена'
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Ошибка при удалении записи',
        error: error.message
      });
    }
  }

  static async getAppointmentsByUserId(req, res) {
    try {
      const { userId } = req.params;
      const appointments = await Appointment.findByUserId(userId);
      
      res.json({
        success: true,
        data: appointments,
        count: appointments.length
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Ошибка при получении записей пользователя',
        error: error.message
      });
    }
  }

  static async getAppointmentsByDate(req, res) {
    try {
      const { date } = req.params;
      const appointments = await Appointment.findByDate(date);
      
      res.json({
        success: true,
        data: appointments,
        count: appointments.length
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Ошибка при получении записей по дате',
        error: error.message
      });
    }
  }

  static async getAppointmentsByType(req, res) {
    try {
      const { type } = req.params;
      const appointments = await Appointment.findByType(type);
      
      res.json({
        success: true,
        data: appointments,
        count: appointments.length
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Ошибка при получении записей по типу',
        error: error.message
      });
    }
  }

  static async updateAppointmentStatus(req, res) {
    try {
      const { id } = req.params;
      const { status } = req.body;
      
      const result = await Appointment.updateStatus(id, status);
      
      if (result.matchedCount === 0) {
        return res.status(404).json({
          success: false,
          message: 'Запись не найдена'
        });
      }
      
      const updatedAppointment = await Appointment.findById(id);
      
      res.json({
        success: true,
        data: updatedAppointment,
        message: 'Статус записи успешно обновлен'
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Ошибка при обновлении статуса записи',
        error: error.message
      });
    }
  }

  static async getUpcomingAppointments(req, res) {
    try {
      const appointments = await Appointment.findUpcoming();
      
      res.json({
        success: true,
        data: appointments,
        count: appointments.length
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Ошибка при получении предстоящих записей',
        error: error.message
      });
    }
  }
}

export default AppointmentController;