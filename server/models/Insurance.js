import db from '../database/index.js';

class Insurance {
  static collection = db.collection('insurance');

  static async findAll() {
    return await this.collection.find();
  }

  static async findById(id) {
    return await this.collection.findById(id);
  }

  static async create(insuranceData) {
    return await this.collection.insertOne({
      ...insuranceData,
      policyNumber: this.generatePolicyNumber(),
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

  static async findByType(type) {
    return await this.collection.find({ type });
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

  static generatePolicyNumber() {
    const timestamp = Date.now().toString().slice(-6);
    const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
    return `POL-${timestamp}-${random}`;
  }
}

export default Insurance;