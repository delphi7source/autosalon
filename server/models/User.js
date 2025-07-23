import db from '../database/index.js';
import bcrypt from 'bcryptjs';

class User {
  static collection = db.collection('users');

  static async findAll() {
    return await this.collection.find();
  }

  static async findById(id) {
    return await this.collection.findById(id);
  }

  static async findByEmail(email) {
    return await this.collection.findOne({ email });
  }

  static async create(userData) {
    // Хешируем пароль
    if (userData.password) {
      userData.password = await bcrypt.hash(userData.password, 10);
    }
    
    return await this.collection.insertOne(userData);
  }

  static async update(id, updateData) {
    // Хешируем пароль если он обновляется
    if (updateData.password) {
      updateData.password = await bcrypt.hash(updateData.password, 10);
    }
    
    return await this.collection.updateById(id, updateData);
  }

  static async delete(id) {
    return await this.collection.deleteById(id);
  }

  static async validatePassword(user, password) {
    return await bcrypt.compare(password, user.password);
  }

  static async findByRole(role) {
    return await this.collection.find({ role });
  }

  static async updateLastLogin(id) {
    return await this.collection.updateById(id, { 
      lastLogin: new Date().toISOString() 
    });
  }
}

export default User;