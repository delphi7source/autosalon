import Order from '../models/Order.js';

class OrderController {
  static async getAllOrders(req, res) {
    try {
      const orders = await Order.findAll();
      
      res.json({
        success: true,
        data: orders,
        count: orders.length
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Ошибка при получении списка заказов',
        error: error.message
      });
    }
  }

  static async getOrderById(req, res) {
    try {
      const { id } = req.params;
      const order = await Order.findById(id);
      
      if (!order) {
        return res.status(404).json({
          success: false,
          message: 'Заказ не найден'
        });
      }
      
      res.json({
        success: true,
        data: order
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Ошибка при получении заказа',
        error: error.message
      });
    }
  }

  static async createOrder(req, res) {
    try {
      const orderData = req.body;
      const order = await Order.create(orderData);
      
      res.status(201).json({
        success: true,
        data: order,
        message: 'Заказ успешно создан'
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Ошибка при создании заказа',
        error: error.message
      });
    }
  }

  static async updateOrder(req, res) {
    try {
      const { id } = req.params;
      const updateData = req.body;
      
      const result = await Order.update(id, updateData);
      
      if (result.matchedCount === 0) {
        return res.status(404).json({
          success: false,
          message: 'Заказ не найден'
        });
      }
      
      const updatedOrder = await Order.findById(id);
      
      res.json({
        success: true,
        data: updatedOrder,
        message: 'Заказ успешно обновлен'
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Ошибка при обновлении заказа',
        error: error.message
      });
    }
  }

  static async deleteOrder(req, res) {
    try {
      const { id } = req.params;
      const result = await Order.delete(id);
      
      if (result.deletedCount === 0) {
        return res.status(404).json({
          success: false,
          message: 'Заказ не найден'
        });
      }
      
      res.json({
        success: true,
        message: 'Заказ успешно удален'
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Ошибка при удалении заказа',
        error: error.message
      });
    }
  }

  static async getOrdersByUserId(req, res) {
    try {
      const { userId } = req.params;
      const orders = await Order.findByUserId(userId);
      
      res.json({
        success: true,
        data: orders,
        count: orders.length
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Ошибка при получении заказов пользователя',
        error: error.message
      });
    }
  }

  static async getOrdersByStatus(req, res) {
    try {
      const { status } = req.params;
      const orders = await Order.findByStatus(status);
      
      res.json({
        success: true,
        data: orders,
        count: orders.length
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Ошибка при получении заказов по статусу',
        error: error.message
      });
    }
  }

  static async updateOrderStatus(req, res) {
    try {
      const { id } = req.params;
      const { status } = req.body;
      
      const result = await Order.updateStatus(id, status);
      
      if (result.matchedCount === 0) {
        return res.status(404).json({
          success: false,
          message: 'Заказ не найден'
        });
      }
      
      const updatedOrder = await Order.findById(id);
      
      res.json({
        success: true,
        data: updatedOrder,
        message: 'Статус заказа успешно обновлен'
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Ошибка при обновлении статуса заказа',
        error: error.message
      });
    }
  }

  static async getOrderStatistics(req, res) {
    try {
      const stats = await Order.getStatistics();
      
      res.json({
        success: true,
        data: stats
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Ошибка при получении статистики заказов',
        error: error.message
      });
    }
  }
}

export default OrderController;