import Insurance from '../models/Insurance.js';

class InsuranceController {
  static async getAllInsurance(req, res) {
    try {
      const insurance = await Insurance.findAll();
      
      res.json({
        success: true,
        data: insurance,
        count: insurance.length
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Ошибка при получении списка страховок',
        error: error.message
      });
    }
  }

  static async getInsuranceById(req, res) {
    try {
      const { id } = req.params;
      const insurance = await Insurance.findById(id);
      
      if (!insurance) {
        return res.status(404).json({
          success: false,
          message: 'Страховка не найдена'
        });
      }
      
      res.json({
        success: true,
        data: insurance
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Ошибка при получении страховки',
        error: error.message
      });
    }
  }

  static async createInsurance(req, res) {
    try {
      const insuranceData = req.body;
      const insurance = await Insurance.create(insuranceData);
      
      res.status(201).json({
        success: true,
        data: insurance,
        message: 'Заявка на страхование успешно создана'
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Ошибка при создании заявки на страхование',
        error: error.message
      });
    }
  }

  static async updateInsurance(req, res) {
    try {
      const { id } = req.params;
      const updateData = req.body;
      
      const result = await Insurance.update(id, updateData);
      
      if (result.matchedCount === 0) {
        return res.status(404).json({
          success: false,
          message: 'Страховка не найдена'
        });
      }
      
      const updatedInsurance = await Insurance.findById(id);
      
      res.json({
        success: true,
        data: updatedInsurance,
        message: 'Страховка успешно обновлена'
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Ошибка при обновлении страховки',
        error: error.message
      });
    }
  }

  static async deleteInsurance(req, res) {
    try {
      const { id } = req.params;
      const result = await Insurance.delete(id);
      
      if (result.deletedCount === 0) {
        return res.status(404).json({
          success: false,
          message: 'Страховка не найдена'
        });
      }
      
      res.json({
        success: true,
        message: 'Страховка успешно удалена'
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Ошибка при удалении страховки',
        error: error.message
      });
    }
  }

  static async getInsuranceByUserId(req, res) {
    try {
      const { userId } = req.params;
      const insurance = await Insurance.findByUserId(userId);
      
      res.json({
        success: true,
        data: insurance,
        count: insurance.length
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Ошибка при получении страховок пользователя',
        error: error.message
      });
    }
  }

  static async getInsuranceByType(req, res) {
    try {
      const { type } = req.params;
      const insurance = await Insurance.findByType(type);
      
      res.json({
        success: true,
        data: insurance,
        count: insurance.length
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Ошибка при получении страховок по типу',
        error: error.message
      });
    }
  }

  static async getInsuranceByStatus(req, res) {
    try {
      const { status } = req.params;
      const insurance = await Insurance.findByStatus(status);
      
      res.json({
        success: true,
        data: insurance,
        count: insurance.length
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Ошибка при получении страховок по статусу',
        error: error.message
      });
    }
  }

  static async updateInsuranceStatus(req, res) {
    try {
      const { id } = req.params;
      const { status } = req.body;
      
      const result = await Insurance.updateStatus(id, status);
      
      if (result.matchedCount === 0) {
        return res.status(404).json({
          success: false,
          message: 'Страховка не найдена'
        });
      }
      
      const updatedInsurance = await Insurance.findById(id);
      
      res.json({
        success: true,
        data: updatedInsurance,
        message: 'Статус страховки успешно обновлен'
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Ошибка при обновлении статуса страховки',
        error: error.message
      });
    }
  }
}

export default InsuranceController;