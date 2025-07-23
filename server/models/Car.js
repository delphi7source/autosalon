import db from '../database/index.js';

class Car {
  static collection = db.collection('cars');

  static async findAll(filters = {}) {
    const query = {};
    
    if (filters.brand) {
      query.brand = { $regex: filters.brand, $options: 'i' };
    }
    
    if (filters.model) {
      query.model = { $regex: filters.model, $options: 'i' };
    }
    
    if (filters.year) {
      query.year = parseInt(filters.year);
    }
    
    if (filters.minPrice) {
      query.price = { ...query.price, $gte: parseInt(filters.minPrice) };
    }
    
    if (filters.maxPrice) {
      query.price = { ...query.price, $lte: parseInt(filters.maxPrice) };
    }
    
    if (filters.fuelType) {
      query.fuelType = filters.fuelType;
    }
    
    if (filters.transmission) {
      query.transmission = filters.transmission;
    }
    
    if (filters.bodyType) {
      query.bodyType = filters.bodyType;
    }

    const cars = await this.collection.find(query);
    
    // Сортировка
    if (filters.sortBy) {
      const sortField = filters.sortBy;
      const sortOrder = filters.sortOrder === 'desc' ? -1 : 1;
      cars.sort((a, b) => {
        if (a[sortField] < b[sortField]) return -sortOrder;
        if (a[sortField] > b[sortField]) return sortOrder;
        return 0;
      });
    }
    
    return cars;
  }

  static async findById(id) {
    return await this.collection.findById(id);
  }

  static async create(carData) {
    return await this.collection.insertOne(carData);
  }

  static async update(id, updateData) {
    return await this.collection.updateById(id, updateData);
  }

  static async delete(id) {
    return await this.collection.deleteById(id);
  }

  static async findByBrand(brand) {
    return await this.collection.find({ brand: { $regex: brand, $options: 'i' } });
  }

  static async findInPriceRange(minPrice, maxPrice) {
    return await this.collection.find({
      price: { $gte: minPrice, $lte: maxPrice }
    });
  }

  static async findAvailable() {
    return await this.collection.find({ status: 'available' });
  }

  static async getStatistics() {
    const cars = await this.collection.find();
    
    const stats = {
      total: cars.length,
      byBrand: {},
      byYear: {},
      byFuelType: {},
      averagePrice: 0,
      priceRange: { min: Infinity, max: 0 }
    };

    let totalPrice = 0;

    cars.forEach(car => {
      // По брендам
      stats.byBrand[car.brand] = (stats.byBrand[car.brand] || 0) + 1;
      
      // По годам
      stats.byYear[car.year] = (stats.byYear[car.year] || 0) + 1;
      
      // По типу топлива
      stats.byFuelType[car.fuelType] = (stats.byFuelType[car.fuelType] || 0) + 1;
      
      // Цены
      totalPrice += car.price;
      stats.priceRange.min = Math.min(stats.priceRange.min, car.price);
      stats.priceRange.max = Math.max(stats.priceRange.max, car.price);
    });

    stats.averagePrice = Math.round(totalPrice / cars.length);

    return stats;
  }
}

export default Car;