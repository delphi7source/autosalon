export const validateCarData = (req, res, next) => {
  const { brand, model, year, price } = req.body;
  const errors = [];

  if (!brand || brand.trim().length === 0) {
    errors.push('Марка автомобиля обязательна');
  }

  if (!model || model.trim().length === 0) {
    errors.push('Модель автомобиля обязательна');
  }

  if (!year || isNaN(year) || year < 1900 || year > new Date().getFullYear() + 1) {
    errors.push('Некорректный год выпуска');
  }

  if (!price || isNaN(price) || price <= 0) {
    errors.push('Некорректная цена');
  }

  if (errors.length > 0) {
    return res.status(400).json({
      success: false,
      message: 'Ошибки валидации',
      errors
    });
  }

  next();
};

export const validateUserData = (req, res, next) => {
  const { firstName, lastName, email, phone } = req.body;
  const errors = [];

  if (!firstName || firstName.trim().length === 0) {
    errors.push('Имя обязательно');
  }

  if (!lastName || lastName.trim().length === 0) {
    errors.push('Фамилия обязательна');
  }

  if (!email || !isValidEmail(email)) {
    errors.push('Некорректный email');
  }

  if (!phone || !isValidPhone(phone)) {
    errors.push('Некорректный номер телефона');
  }

  if (errors.length > 0) {
    return res.status(400).json({
      success: false,
      message: 'Ошибки валидации',
      errors
    });
  }

  next();
};

export const validateOrderData = (req, res, next) => {
  const { carId, userId, totalAmount } = req.body;
  const errors = [];

  if (!carId || carId.trim().length === 0) {
    errors.push('ID автомобиля обязателен');
  }

  if (!userId || userId.trim().length === 0) {
    errors.push('ID пользователя обязателен');
  }

  if (!totalAmount || isNaN(totalAmount) || totalAmount <= 0) {
    errors.push('Некорректная сумма заказа');
  }

  if (errors.length > 0) {
    return res.status(400).json({
      success: false,
      message: 'Ошибки валидации',
      errors
    });
  }

  next();
};

export const validateAppointmentData = (req, res, next) => {
  const { userId, appointmentDate, type } = req.body;
  const errors = [];

  if (!userId || userId.trim().length === 0) {
    errors.push('ID пользователя обязателен');
  }

  if (!appointmentDate || !isValidDate(appointmentDate)) {
    errors.push('Некорректная дата записи');
  }

  if (!type || type.trim().length === 0) {
    errors.push('Тип записи обязателен');
  }

  // Проверяем, что дата записи не в прошлом
  if (appointmentDate && new Date(appointmentDate) < new Date()) {
    errors.push('Дата записи не может быть в прошлом');
  }

  if (errors.length > 0) {
    return res.status(400).json({
      success: false,
      message: 'Ошибки валидации',
      errors
    });
  }

  next();
};

export const validateServiceData = (req, res, next) => {
  const { name, category, price, duration } = req.body;
  const errors = [];

  if (!name || name.trim().length === 0) {
    errors.push('Название услуги обязательно');
  }

  if (!category || category.trim().length === 0) {
    errors.push('Категория услуги обязательна');
  }

  if (!price || isNaN(price) || price <= 0) {
    errors.push('Некорректная цена услуги');
  }

  if (!duration || duration.trim().length === 0) {
    errors.push('Продолжительность услуги обязательна');
  }

  if (errors.length > 0) {
    return res.status(400).json({
      success: false,
      message: 'Ошибки валидации',
      errors
    });
  }

  next();
};

// Вспомогательные функции
function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

function isValidPhone(phone) {
  const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
  return phoneRegex.test(phone.replace(/[\s\-\(\)]/g, ''));
}

function isValidDate(dateString) {
  const date = new Date(dateString);
  return date instanceof Date && !isNaN(date);
}