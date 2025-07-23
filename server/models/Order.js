import db from '../database/index.js';

class Order {
  static collection = db.collection('orders');

  static async findAll() {
    return await this.collection.find();
  }

  static async findById(id) {
    return await this.collection.findById(id);
  }

  static async create(orderData) {
    return await this.collection.insertOne({
      ...orderData,
      orderNumber: this.generateOrderNumber(),
      status: 'pending'
    });
  }

  static async update(id, updateData) {
    return await this.collection.updateById(id, updateData);
  }

  static async delete(id) {
    return await this.collection.deleteById(id);
  }

  static async findByUserId(userId) {
    return await this.collection.find({ userId });
  }

  static async findByStatus(status) {
    return await this.collection.find({ status });
  }

  static async updateStatus(id, status) {
    return await this.collection.updateById(id, { 
      status,
      statusUpdatedAt: new Date().toISOString()
    });
  }

  static generateOrderNumber() {
    const timestamp = Date.now().toString().slice(-6);
    const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
    return `ORD-${timestamp}-${random}`;
  }

  static async getStatistics() {
    const orders = await this.collection.find();
    
    const stats = {
      total: orders.length,
      byStatus: {},
      totalAmount: 0,
      averageAmount: 0,
      byMonth: {}
    };

    let totalAmount = 0;

    orders.forEach(order => {
      // По статусам
      stats.byStatus[order.status] = (stats.byStatus[order.status] || 0) + 1;
      
      // Сумма заказов
      if (order.totalAmount) {
        totalAmount += order.totalAmount;
      }
      
      // По месяцам
      const month = new Date(order.createdAt).toISOString().slice(0, 7);
      stats.byMonth[month] = (stats.byMonth[month] || 0) + 1;
    });

    stats.totalAmount = totalAmount;
    stats.averageAmount = orders.length > 0 ? Math.round(totalAmount / orders.length) : 0;

    return stats;
  }
}

export default Order;