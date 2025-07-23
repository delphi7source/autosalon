import TradeIn from '../models/TradeIn.js';

class TradeInController {
  static async getAllTradeIns(req, res) {
    try {
      const tradeIns = await TradeIn.findAll();
      
      res.json({
        success: true,
        data: tradeIns,
        count: tradeIns.length
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Ошибка при получении списка оценок Trade-in',
        error: error.message
      });
    }
  }

  static async getTradeInById(req, res) {
    try {
      const { id } = req.params;
      const tradeIn = await TradeIn.findById(id);
      
      if (!tradeIn) {
        return res.status(404).json({
          success: false,
          message: 'Оценка Trade-in не найдена'
        });
      }
      
      res.json({
        success: true,
        data: tradeIn
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Ошибка при получении оценки Trade-in',
        error: error.message
      });
    }
  }

  static async createTradeIn(req, res) {
    try {
      const tradeInData = req.body;
      
      // Если пользователь не авторизован, создаем гостевую заявку
      if (!req.user && tradeInData.userId === 'guest') {
        tradeInData.userId = null;
      }
      
      const tradeIn = await TradeIn.create(tradeInData);
      
      res.status(201).json({
        success: true,
        data: tradeIn,
        message: 'Заявка на Trade-in успешно создана'
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Ошибка при создании заявки на Trade-in',
        error: error.message
      });
    }
  }

  static async updateTradeIn(req, res) {
    try {
      const { id } = req.params;
      const updateData = req.body;
      
      const result = await TradeIn.update(id, updateData);
      
      if (result.matchedCount === 0) {
        return res.status(404).json({
          success: false,
          message: 'Оценка Trade-in не найдена'
        });
      }
      
      const updatedTradeIn = await TradeIn.findById(id);
      
      res.json({
        success: true,
        data: updatedTradeIn,
        message: 'Оценка Trade-in успешно обновлена'
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Ошибка при обновлении оценки Trade-in',
        error: error.message
      });
    }
  }

  static async deleteTradeIn(req, res) {
    try {
      const { id } = req.params;
      const result = await TradeIn.delete(id);
      
      if (result.deletedCount === 0) {
        return res.status(404).json({
          success: false,
          message: 'Оценка Trade-in не найдена'
        });
      }
      
      res.json({
        success: true,
        message: 'Оценка Trade-in успешно удалена'
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Ошибка при удалении оценки Trade-in',
        error: error.message
      });
    }
  }

  static async getTradeInsByUserId(req, res) {
    try {
      const { userId } = req.params;
      const tradeIns = await TradeIn.findByUserId(userId);
      
      res.json({
        success: true,
        data: tradeIns,
        count: tradeIns.length
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Ошибка при получении оценок Trade-in пользователя',
        error: error.message
      });
    }
  }

  static async getTradeInsByStatus(req, res) {
    try {
      const { status } = req.params;
      const tradeIns = await TradeIn.findByStatus(status);
      
      res.json({
        success: true,
        data: tradeIns,
        count: tradeIns.length
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Ошибка при получении оценок Trade-in по статусу',
        error: error.message
      });
    }
  }

  static async updateTradeInStatus(req, res) {
    try {
      const { id } = req.params;
      const { status } = req.body;
      
      const result = await TradeIn.updateStatus(id, status);
      
      if (result.matchedCount === 0) {
        return res.status(404).json({
          success: false,
          message: 'Оценка Trade-in не найдена'
        });
      }
      
      const updatedTradeIn = await TradeIn.findById(id);
      
      res.json({
        success: true,
        data: updatedTradeIn,
        message: 'Статус оценки Trade-in успешно обновлен'
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Ошибка при обновлении статуса оценки Trade-in',
        error: error.message
      });
    }
  }

  static async updateTradeInEvaluation(req, res) {
    try {
      const { id } = req.params;
      const evaluationData = req.body;
      
      const result = await TradeIn.updateEvaluation(id, evaluationData);
      
      if (result.matchedCount === 0) {
        return res.status(404).json({
          success: false,
          message: 'Оценка Trade-in не найдена'
        });
      }
      
      const updatedTradeIn = await TradeIn.findById(id);
      
      res.json({
        success: true,
        data: updatedTradeIn,
        message: 'Оценка автомобиля успешно обновлена'
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Ошибка при обновлении оценки автомобиля',
        error: error.message
      });
    }
  }
}

export default TradeInController;