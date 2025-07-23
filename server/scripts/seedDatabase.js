import db from '../database/index.js';
import bcrypt from 'bcryptjs';

const seedData = {
  users: [
    {
      firstName: 'Администратор',
      lastName: 'Системы',
      email: 'admin@autopremium.ru',
      phone: '+7 (495) 123-45-67',
      password: 'admin123',
      role: 'admin',
      isActive: true
    },
    {
      firstName: 'Александр',
      lastName: 'Иванов',
      email: 'manager@autopremium.ru',
      phone: '+7 (495) 123-45-68',
      password: 'manager123',
      role: 'manager',
      isActive: true
    },
    {
      firstName: 'Елена',
      lastName: 'Петрова',
      email: 'elena.petrova@example.com',
      phone: '+7 (916) 555-01-01',
      password: 'customer123',
      role: 'customer',
      isActive: true
    },
    {
      firstName: 'Михаил',
      lastName: 'Сидоров',
      email: 'mikhail.sidorov@example.com',
      phone: '+7 (916) 555-01-02',
      password: 'customer123',
      role: 'customer',
      isActive: true
    },
    {
      firstName: 'Анна',
      lastName: 'Козлова',
      email: 'anna.kozlova@example.com',
      phone: '+7 (916) 555-01-03',
      password: 'customer123',
      role: 'customer',
      isActive: true
    }
  ],

  cars: [
    {
      brand: 'BMW',
      model: '3 Series',
      year: 2024,
      price: 2890000,
      mileage: 0,
      fuelType: 'Бензин',
      transmission: 'Автомат',
      bodyType: 'Седан',
      engineVolume: 2.0,
      power: 184,
      color: 'Серебристый металлик',
      vin: 'WBAVA31070NL12345',
      status: 'available',
      images: ['/img/35658ce2-0e0f-41a4-a417-c35990cabc29.jpg'],
      features: ['Кожаный салон', 'Подогрев сидений', 'Навигация', 'Климат-контроль', 'Bluetooth', 'USB'],
      description: 'Элегантный и динамичный BMW 3 Series представляет собой идеальное сочетание спортивности и комфорта.',
      isNew: true,
      isHit: false
    },
    {
      brand: 'Audi',
      model: 'Q5',
      year: 2024,
      price: 3450000,
      mileage: 0,
      fuelType: 'Бензин',
      transmission: 'Автомат',
      bodyType: 'Кроссовер',
      engineVolume: 2.0,
      power: 249,
      color: 'Черный',
      vin: 'WAUZZZFY7N2123456',
      status: 'available',
      images: ['/img/b6e0d970-0bdc-442d-af99-f0a51ff0863e.jpg'],
      features: ['Полный привод', 'Панорамная крыша', 'LED фары', 'Virtual Cockpit'],
      description: 'Премиальный кроссовер Audi Q5 с передовыми технологиями и превосходным комфортом.',
      isNew: true,
      isHit: true
    },
    {
      brand: 'Mercedes-Benz',
      model: 'C-Class Coupe',
      year: 2024,
      price: 4120000,
      mileage: 0,
      fuelType: 'Бензин',
      transmission: 'Автомат',
      bodyType: 'Купе',
      engineVolume: 2.0,
      power: 258,
      color: 'Белый',
      vin: 'WDD2050461F123456',
      status: 'available',
      images: ['/img/8da9e761-2e1b-453f-9c89-1afd4df236ee.jpg'],
      features: ['AMG пакет', 'Премиум звук', 'Автопилот', 'Панорамная крыша'],
      description: 'Стильное купе Mercedes-Benz C-Class с роскошным интерьером и мощным двигателем.',
      isNew: true,
      isHit: false
    },
    {
      brand: 'BMW',
      model: 'X5',
      year: 2023,
      price: 5200000,
      mileage: 15000,
      fuelType: 'Бензин',
      transmission: 'Автомат',
      bodyType: 'Кроссовер',
      engineVolume: 3.0,
      power: 340,
      color: 'Синий металлик',
      vin: 'WBAFR9C50DD123456',
      status: 'available',
      images: ['/img/35658ce2-0e0f-41a4-a417-c35990cabc29.jpg'],
      features: ['xDrive', 'Harman Kardon', 'Головной дисплей', 'Массаж сидений'],
      description: 'Мощный и роскошный BMW X5 с полным приводом и премиальным оснащением.',
      isNew: false,
      isHit: false
    },
    {
      brand: 'Audi',
      model: 'A4',
      year: 2023,
      price: 2650000,
      mileage: 8500,
      fuelType: 'Бензин',
      transmission: 'Автомат',
      bodyType: 'Седан',
      engineVolume: 2.0,
      power: 190,
      color: 'Серый',
      vin: 'WAUZZZ8K7DA123456',
      status: 'available',
      images: ['/img/b6e0d970-0bdc-442d-af99-f0a51ff0863e.jpg'],
      features: ['quattro', 'Matrix LED', 'Bang & Olufsen', 'Адаптивная подвеска'],
      description: 'Элегантный седан Audi A4 с полным приводом и передовыми технологиями.',
      isNew: false,
      isHit: true
    },
    {
      brand: 'Mercedes-Benz',
      model: 'E-Class',
      year: 2023,
      price: 3890000,
      mileage: 12000,
      fuelType: 'Гибрид',
      transmission: 'Автомат',
      bodyType: 'Седан',
      engineVolume: 2.0,
      power: 299,
      color: 'Черный металлик',
      vin: 'WDD2130461A123456',
      status: 'available',
      images: ['/img/8da9e761-2e1b-453f-9c89-1afd4df236ee.jpg'],
      features: ['MBUX', 'Air Body Control', 'Burmester', 'Multibeam LED'],
      description: 'Роскошный гибридный седан Mercedes-Benz E-Class с инновационными технологиями.',
      isNew: false,
      isHit: false
    }
  ],

  services: [
    {
      name: 'ТО-1 (15 000 км)',
      category: 'Техническое обслуживание',
      price: 8500,
      duration: '2-3 часа',
      description: 'Базовое техническое обслуживание',
      isActive: true
    },
    {
      name: 'ТО-2 (30 000 км)',
      category: 'Техническое обслуживание',
      price: 12500,
      duration: '3-4 часа',
      description: 'Расширенное техническое обслуживание',
      isActive: true
    },
    {
      name: 'Компьютерная диагностика',
      category: 'Диагностика',
      price: 2500,
      duration: '1 час',
      description: 'Полная диагностика всех систем',
      isActive: true
    },
    {
      name: 'Замена масла и фильтров',
      category: 'Ремонт двигателя',
      price: 3500,
      duration: '1 час',
      description: 'Замена моторного масла и фильтров',
      isActive: true
    },
    {
      name: 'Покраска элемента',
      category: 'Кузовной ремонт',
      price: 15000,
      duration: '2-3 дня',
      description: 'Покраска одного элемента кузова',
      isActive: true
    }
  ],

  orders: [
    {
      orderNumber: 'ORD-240101-001',
      userId: null, // Будет заполнено после создания пользователей
      carId: null, // Будет заполнено после создания автомобилей
      status: 'pending',
      totalAmount: 2890000,
      paymentMethod: 'credit',
      deliveryAddress: 'Москва, ул. Примерная, 45',
      notes: 'Срочный заказ, требуется быстрое оформление'
    },
    {
      orderNumber: 'ORD-240102-002',
      userId: null,
      carId: null,
      status: 'confirmed',
      totalAmount: 3450000,
      paymentMethod: 'cash',
      deliveryAddress: 'Москва, пр-т Мира, 123',
      notes: 'Клиент готов к получению'
    }
  ],

  appointments: [
    {
      userId: null,
      type: 'test-drive',
      appointmentDate: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(), // Завтра
      appointmentTime: '14:00',
      carId: null,
      status: 'scheduled',
      notes: 'Первый тест-драйв клиента'
    },
    {
      userId: null,
      type: 'service',
      appointmentDate: new Date(Date.now() + 48 * 60 * 60 * 1000).toISOString(), // Послезавтра
      appointmentTime: '10:00',
      serviceId: null,
      status: 'confirmed',
      notes: 'Плановое ТО'
    }
  ],

  tradein: [
    {
      userId: null,
      evaluationNumber: 'EVAL-240101-001',
      carBrand: 'BMW',
      carModel: '3 Series',
      carYear: 2020,
      carMileage: 45000,
      carCondition: 'good',
      estimatedValue: 1800000,
      status: 'pending',
      notes: 'Автомобиль в хорошем состоянии, один владелец'
    }
  ],

  insurance: [
    {
      userId: null,
      policyNumber: 'POL-240101-001',
      type: 'kasko',
      carId: null,
      insuranceCompany: 'Росгосстрах',
      premium: 85000,
      coverage: 2890000,
      startDate: new Date().toISOString(),
      endDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(),
      status: 'active'
    }
  ]
};

async function seedDatabase() {
  try {
    console.log('🌱 Начинаем заполнение базы данных...');

    // Очищаем существующие данные
    console.log('🗑️ Очищаем существующие данные...');
    await db.collection('users').deleteMany({});
    await db.collection('cars').deleteMany({});
    await db.collection('services').deleteMany({});
    await db.collection('orders').deleteMany({});
    await db.collection('appointments').deleteMany({});
    await db.collection('tradein').deleteMany({});
    await db.collection('insurance').deleteMany({});

    // Создаем пользователей
    console.log('👥 Создаем пользователей...');
    const hashedUsers = await Promise.all(
      seedData.users.map(async (user) => ({
        ...user,
        password: await bcrypt.hash(user.password, 10)
      }))
    );
    const createdUsers = await db.collection('users').insertMany(hashedUsers);
    console.log(`✅ Создано ${createdUsers.length} пользователей`);

    // Создаем автомобили
    console.log('🚗 Создаем автомобили...');
    const createdCars = await db.collection('cars').insertMany(seedData.cars);
    console.log(`✅ Создано ${createdCars.length} автомобилей`);

    // Создаем услуги
    console.log('🔧 Создаем услуги...');
    const createdServices = await db.collection('services').insertMany(seedData.services);
    console.log(`✅ Создано ${createdServices.length} услуг`);

    // Создаем заказы с привязкой к пользователям и автомобилям
    console.log('📋 Создаем заказы...');
    const ordersWithIds = seedData.orders.map((order, index) => ({
      ...order,
      userId: createdUsers[index + 2]._id, // Привязываем к клиентам
      carId: createdCars[index]._id
    }));
    const createdOrders = await db.collection('orders').insertMany(ordersWithIds);
    console.log(`✅ Создано ${createdOrders.length} заказов`);

    // Создаем записи
    console.log('📅 Создаем записи...');
    const appointmentsWithIds = seedData.appointments.map((appointment, index) => ({
      ...appointment,
      userId: createdUsers[index + 2]._id,
      carId: index === 0 ? createdCars[0]._id : undefined,
      serviceId: index === 1 ? createdServices[0]._id : undefined
    }));
    const createdAppointments = await db.collection('appointments').insertMany(appointmentsWithIds);
    console.log(`✅ Создано ${createdAppointments.length} записей`);

    // Создаем оценки Trade-in
    console.log('🔄 Создаем оценки Trade-in...');
    const tradeinWithIds = seedData.tradein.map((tradein) => ({
      ...tradein,
      userId: createdUsers[2]._id
    }));
    const createdTradeIn = await db.collection('tradein').insertMany(tradeinWithIds);
    console.log(`✅ Создано ${createdTradeIn.length} оценок Trade-in`);

    // Создаем страховки
    console.log('🛡️ Создаем страховки...');
    const insuranceWithIds = seedData.insurance.map((insurance) => ({
      ...insurance,
      userId: createdUsers[2]._id,
      carId: createdCars[0]._id
    }));
    const createdInsurance = await db.collection('insurance').insertMany(insuranceWithIds);
    console.log(`✅ Создано ${createdInsurance.length} страховок`);

    console.log('🎉 База данных успешно заполнена!');
    console.log('\n📊 Статистика:');
    console.log(`👥 Пользователи: ${createdUsers.length}`);
    console.log(`🚗 Автомобили: ${createdCars.length}`);
    console.log(`🔧 Услуги: ${createdServices.length}`);
    console.log(`📋 Заказы: ${createdOrders.length}`);
    console.log(`📅 Записи: ${createdAppointments.length}`);
    console.log(`🔄 Trade-in: ${createdTradeIn.length}`);
    console.log(`🛡️ Страховки: ${createdInsurance.length}`);

    console.log('\n🔑 Тестовые аккаунты:');
    console.log('Администратор: admin@autopremium.ru / admin123');
    console.log('Менеджер: manager@autopremium.ru / manager123');
    console.log('Клиент: elena.petrova@example.com / customer123');

  } catch (error) {
    console.error('❌ Ошибка при заполнении базы данных:', error);
    process.exit(1);
  }
}

// Запускаем заполнение базы данных
seedDatabase();