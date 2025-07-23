import Service from '../models/Service.js';

class ServiceController {
  static async getAllServices(req, res) {
    try {
      const services = await Service.findAll();
      
      res.json({
        success: true,
        data: services,
        count: services.length
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Ошибка при получении списка услуг',
        error: error.message
      });
    }
  }

  static async getServiceById(req, res) {
    try {
      const { id } = req.params;
      const service = await Service.findById(id);
      
      if (!service) {
        return res.status(404).json({
          success: false,
          message: 'Услуга не найдена'
        });
      }
      
      res.json({
        success: true,
        data: service
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Ошибка при получении услуги',
        error: error.message
      });
    }
  }

  static async createService(req, res) {
    try {
      const serviceData = req.body;
      const service = await Service.create(serviceData);
      
      res.status(201).json({
        success: true,
        data: service,
        message: 'Услуга успешно создана'
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Ошибка при создании услуги',
        error: error.message
      });
    }
  }

  static async updateService(req, res) {
    try {
      const { id } = req.params;
      const updateData = req.body;
      
      const result = await Service.update(id, updateData);
      
      if (result.matchedCount === 0) {
        return res.status(404).json({
          success: false,
          message: 'Услуга не найдена'
        });
      }
      
      const updatedService = await Service.findById(id);
      
      res.json({
        success: true,
        data: updatedService,
        message: 'Услуга успешно обновлена'
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Ошибка при обновлении услуги',
        error: error.message
      });
    }
  }

  static async deleteService(req, res) {
    try {
      const { id } = req.params;
      const result = await Service.delete(id);
      
      if (result.deletedCount === 0) {
        return res.status(404).json({
          success: false,
          message: 'Услуга не найдена'
        });
      }
      
      res.json({
        success: true,
        message: 'Услуга успешно удалена'
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Ошибка при удалении услуги',
        error: error.message
      });
    }
  }

  static async getServicesByCategory(req, res) {
    try {
      const { category } = req.params;
      const services = await Service.findByCategory(category);
      
      res.json({
        success: true,
        data: services,
        count: services.length
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Ошибка при получении услуг по категории',
        error: error.message
      });
    }
  }

  static async getActiveServices(req, res) {
    try {
      const services = await Service.findActive();
      
      res.json({
        success: true,
        data: services,
        count: services.length
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Ошибка при получении активных услуг',
        error: error.message
      });
    }
  }
}

export default ServiceController;