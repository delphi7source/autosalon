import db from '../database/index.js';

class Appointment {
  static collection = db.collection('appointments');

  static async findAll() {
    return await this.collection.find();
  }

  static async findById(id) {
    return await this.collection.findById(id);
  }

  static async create(appointmentData) {
    return await this.collection.insertOne({
      ...appointmentData,
      status: 'scheduled'
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

  static async findByDate(date) {
    const startOfDay = new Date(date);
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date(date);
    endOfDay.setHours(23, 59, 59, 999);
    
    return await this.collection.find({
      appointmentDate: {
        $gte: startOfDay.toISOString(),
        $lte: endOfDay.toISOString()
      }
    });
  }

  static async findByType(type) {
    return await this.collection.find({ type });
  }

  static async updateStatus(id, status) {
    return await this.collection.updateById(id, { 
      status,
      statusUpdatedAt: new Date().toISOString()
    });
  }

  static async findUpcoming() {
    const now = new Date().toISOString();
    return await this.collection.find({
      appointmentDate: { $gte: now },
      status: { $in: ['scheduled', 'confirmed'] }
    });
  }
}

export default Appointment;