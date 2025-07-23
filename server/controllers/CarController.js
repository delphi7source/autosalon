import Car from '../models/Car.js';

class CarController {
  static async getAllCars(req, res) {
    try {
      const filters = req.query;
      const cars = await Car.findAll(filters);
      
      res.json({
        success: true,
        data: cars,
        count: cars.length
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Ошибка при получении списка автомобилей',
        error: error.message
      });
    }
  }

  static async getCarById(req, res) {
    try {
      const { id } = req.params;
      const car = await Car.findById(id);
      
      if (!car) {
        return res.status(404).json({
          success: false,
          message: 'Автомобиль не найден'
        });
      }
      
      res.json({
        success: true,
        data: car
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Ошибка при получении автомобиля',
        error: error.message
      });
    }
  }

  static async createCar(req, res) {
    try {
      const carData = req.body;
      const car = await Car.create(carData);
      
      res.status(201).json({
        success: true,
        data: car,
        message: 'Автомобиль успешно добавлен'
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Ошибка при создании автомобиля',
        error: error.message
      });
    }
  }

  static async updateCar(req, res) {
    try {
      const { id } = req.params;
      const updateData = req.body;
      
      const result = await Car.update(id, updateData);
      
      if (result.matchedCount === 0) {
        return res.status(404).json({
          success: false,
          message: 'Автомобиль не найден'
        });
      }
      
      const updatedCar = await Car.findById(id);
      
      res.json({
        success: true,
        data: updatedCar,
        message: 'Автомобиль успешно обновлен'
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Ошибка при обновлении автомобиля',
        error: error.message
      });
    }
  }

  static async deleteCar(req, res) {
    try {
      const { id } = req.params;
      const result = await Car.delete(id);
      
      if (result.deletedCount === 0) {
        return res.status(404).json({
          success: false,
          message: 'Автомобиль не найден'
        });
      }
      
      res.json({
        success: true,
        message: 'Автомобиль успешно удален'
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Ошибка при удалении автомобиля',
        error: error.message
      });
    }
  }

  static async getCarsByBrand(req, res) {
    try {
      const { brand } = req.params;
      const cars = await Car.findByBrand(brand);
      
      res.json({
        success: true,
        data: cars,
        count: cars.length
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Ошибка при получении автомобилей по бренду',
        error: error.message
      });
    }
  }

  static async getAvailableCars(req, res) {
    try {
      const cars = await Car.findAvailable();
      
      res.json({
        success: true,
        data: cars,
        count: cars.length
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Ошибка при получении доступных автомобилей',
        error: error.message
      });
    }
  }

  static async getCarStatistics(req, res) {
    try {
      const stats = await Car.getStatistics();
      
      res.json({
        success: true,
        data: stats
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Ошибка при получении статистики',
        error: error.message
      });
    }
  }
}

export default CarController;