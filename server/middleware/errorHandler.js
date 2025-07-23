export const errorHandler = (err, req, res, next) => {
  console.error('Error:', err);

  // Ошибка валидации JWT
  if (err.name === 'JsonWebTokenError') {
    return res.status(401).json({
      success: false,
      message: 'Недействительный токен'
    });
  }

  // Ошибка истечения токена
  if (err.name === 'TokenExpiredError') {
    return res.status(401).json({
      success: false,
      message: 'Токен истек'
    });
  }

  // Ошибка парсинга JSON
  if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
    return res.status(400).json({
      success: false,
      message: 'Некорректный JSON'
    });
  }

  // Общая ошибка сервера
  res.status(500).json({
    success: false,
    message: 'Внутренняя ошибка сервера',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
};

export const notFoundHandler = (req, res) => {
  res.status(404).json({
    success: false,
    message: `Маршрут ${req.originalUrl} не найден`
  });
};