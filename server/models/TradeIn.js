import db from '../database/index.js';

class TradeIn {
  static collection = db.collection('tradein');

  static async findAll() {
    return await this.collection.find();
  }

  static async findById(id) {
    return await this.collection.findById(id);
  }

  static async create(tradeInData) {
    return await this.collection.insertOne({
      ...tradeInData,
      status: 'pending',
      evaluationNumber: this.generateEvaluationNumber()
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

  static async updateEvaluation(id, evaluationData) {
    return await this.collection.updateById(id, {
      ...evaluationData,
      evaluatedAt: new Date().toISOString()
    });
  }

  static generateEvaluationNumber() {
    const timestamp = Date.now().toString().slice(-6);
    const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
    return `EVAL-${timestamp}-${random}`;
  }
}

export default TradeIn;