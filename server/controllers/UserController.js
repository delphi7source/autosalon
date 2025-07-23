import User from '../models/User.js';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

class UserController {
  static async getAllUsers(req, res) {
    try {
      const users = await User.findAll();
      
      // Убираем пароли из ответа
      const usersWithoutPasswords = users.map(user => {
        const { password, ...userWithoutPassword } = user;
        return userWithoutPassword;
      });
      
      res.json({
        success: true,
        data: usersWithoutPasswords,
        count: usersWithoutPasswords.length
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Ошибка при получении списка пользователей',
        error: error.message
      });
    }
  }

  static async getUserById(req, res) {
    try {
      const { id } = req.params;
      const user = await User.findById(id);
      
      if (!user) {
        return res.status(404).json({
          success: false,
          message: 'Пользователь не найден'
        });
      }
      
      const { password, ...userWithoutPassword } = user;
      
      res.json({
        success: true,
        data: userWithoutPassword
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Ошибка при получении пользователя',
        error: error.message
      });
    }
  }

  static async createUser(req, res) {
    try {
      const userData = req.body;
      
      // Проверяем, существует ли пользователь с таким email
      const existingUser = await User.findByEmail(userData.email);
      if (existingUser) {
        return res.status(400).json({
          success: false,
          message: 'Пользователь с таким email уже существует'
        });
      }
      
      const user = await User.create(userData);
      const { password, ...userWithoutPassword } = user;
      
      res.status(201).json({
        success: true,
        data: userWithoutPassword,
        message: 'Пользователь успешно создан'
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Ошибка при создании пользователя',
        error: error.message
      });
    }
  }

  static async updateUser(req, res) {
    try {
      const { id } = req.params;
      const updateData = req.body;
      
      const result = await User.update(id, updateData);
      
      if (result.matchedCount === 0) {
        return res.status(404).json({
          success: false,
          message: 'Пользователь не найден'
        });
      }
      
      const updatedUser = await User.findById(id);
      const { password, ...userWithoutPassword } = updatedUser;
      
      res.json({
        success: true,
        data: userWithoutPassword,
        message: 'Пользователь успешно обновлен'
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Ошибка при обновлении пользователя',
        error: error.message
      });
    }
  }

  static async deleteUser(req, res) {
    try {
      const { id } = req.params;
      const result = await User.delete(id);
      
      if (result.deletedCount === 0) {
        return res.status(404).json({
          success: false,
          message: 'Пользователь не найден'
        });
      }
      
      res.json({
        success: true,
        message: 'Пользователь успешно удален'
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Ошибка при удалении пользователя',
        error: error.message
      });
    }
  }

  static async login(req, res) {
    try {
      const { email, password } = req.body;
      
      const user = await User.findByEmail(email);
      if (!user) {
        return res.status(401).json({
          success: false,
          message: 'Неверный email или пароль'
        });
      }
      
      const isValidPassword = await User.validatePassword(user, password);
      if (!isValidPassword) {
        return res.status(401).json({
          success: false,
          message: 'Неверный email или пароль'
        });
      }
      
      // Обновляем время последнего входа
      await User.updateLastLogin(user._id);
      
      // Создаем JWT токен
      const token = jwt.sign(
        { userId: user._id, email: user.email, role: user.role },
        JWT_SECRET,
        { expiresIn: '24h' }
      );
      
      const { password: _, ...userWithoutPassword } = user;
      
      res.json({
        success: true,
        data: {
          user: userWithoutPassword,
          token
        },
        message: 'Успешный вход в систему'
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Ошибка при входе в систему',
        error: error.message
      });
    }
  }

  static async register(req, res) {
    try {
      const userData = {
        ...req.body,
        role: 'customer' // По умолчанию роль клиента
      };
      
      // Проверяем, существует ли пользователь с таким email
      const existingUser = await User.findByEmail(userData.email);
      if (existingUser) {
        return res.status(400).json({
          success: false,
          message: 'Пользователь с таким email уже существует'
        });
      }
      
      const user = await User.create(userData);
      const { password, ...userWithoutPassword } = user;
      
      // Создаем JWT токен
      const token = jwt.sign(
        { userId: user._id, email: user.email, role: user.role },
        JWT_SECRET,
        { expiresIn: '24h' }
      );
      
      res.status(201).json({
        success: true,
        data: {
          user: userWithoutPassword,
          token
        },
        message: 'Регистрация прошла успешно'
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Ошибка при регистрации',
        error: error.message
      });
    }
  }

  static async getUsersByRole(req, res) {
    try {
      const { role } = req.params;
      const users = await User.findByRole(role);
      
      const usersWithoutPasswords = users.map(user => {
        const { password, ...userWithoutPassword } = user;
        return userWithoutPassword;
      });
      
      res.json({
        success: true,
        data: usersWithoutPasswords,
        count: usersWithoutPasswords.length
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Ошибка при получении пользователей по роли',
        error: error.message
      });
    }
  }
}

export default UserController;