import db from '../database/index.js';

class Service {
  static collection = db.collection('services');

  static async findAll() {
    return await this.collection.find();
  }

  static async findById(id) {
    return await this.collection.findById(id);
  }

  static async create(serviceData) {
    return await this.collection.insertOne(serviceData);
  }

  static async update(id, updateData) {
    return await this.collection.updateById(id, updateData);
  }

  static async delete(id) {
    return await this.collection.deleteById(id);
  }

  static async findByCategory(category) {
    return await this.collection.find({ category });
  }

  static async findByPriceRange(minPrice, maxPrice) {
    return await this.collection.find({
      price: { $gte: minPrice, $lte: maxPrice }
    });
  }

  static async findActive() {
    return await this.collection.find({ isActive: true });
  }
}

export default Service;