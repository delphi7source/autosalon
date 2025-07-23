import { useParams, Link } from 'react-router-dom';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import Icon from '@/components/ui/icon';

const CarDetail = () => {
  const { id } = useParams();
  const [selectedImage, setSelectedImage] = useState(0);

  // В реальном приложении данные загружались бы по ID
  const car = {
    id: parseInt(id || '1'),
    name: 'BMW 3 Series',
    price: 2890000,
    year: 2024,
    fuel: 'Бензин',
    transmission: 'Автомат',
    mileage: '0',
    type: 'Седан',
    brand: 'BMW',
    images: [
      '/img/35658ce2-0e0f-41a4-a417-c35990cabc29.jpg',
      '/img/b6e0d970-0bdc-442d-af99-f0a51ff0863e.jpg',
      '/img/8da9e761-2e1b-453f-9c89-1afd4df236ee.jpg'
    ],
    features: ['Кожаный салон', 'Подогрев сидений', 'Навигация', 'Климат-контроль', 'Bluetooth', 'USB', 'Круиз-контроль', 'Парктроник'],
    engine: '2.0L турбо',
    power: '184 л.с.',
    acceleration: '7.1 сек',
    consumption: '6.8 л/100км',
    drive: 'Задний привод',
    color: 'Серебристый металлик',
    vin: 'WBAVA31070NL12345',
    description: 'Элегантный и динамичный BMW 3 Series представляет собой идеальное сочетание спортивности и комфорта. Этот седан оснащен передовыми технологиями и обеспечивает превосходное качество вождения. Автомобиль находится в идеальном состоянии и готов к передаче новому владельцу.',
    specs: {
      dimensions: '4709×1827×1442 мм',
      trunk: '480 л',
      weight: '1570 кг',
      fuelTank: '59 л',
      maxSpeed: '235 км/ч',
      doors: '4',
      seats: '5',
      wheelbase: '2851 мм'
    },
    equipment: {
      safety: ['ABS', 'ESP', 'Подушки безопасности', 'Система контроля давления в шинах', 'Система помощи при экстренном торможении'],
      comfort: ['Кондиционер', 'Подогрев сидений', 'Электростеклоподъемники', 'Центральный замок', 'Круиз-контроль'],
      multimedia: ['Мультимедийная система', 'Bluetooth', 'USB', 'AUX', 'Навигация'],
      exterior: ['LED фары', 'Легкосплавные диски', 'Тонированные стекла', 'Электрозеркала']
    }
  };

  const formatPrice = (price: number) => {
    return price.toLocaleString('ru-RU');
  };

  const ContactForm = () => {
    const [formData, setFormData] = useState({
      name: '',
      phone: '',
      email: '',
      message: ''
    });

    const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      // Здесь была бы отправка формы
      console.log('Form submitted:', formData);
    };

    return (
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="text-sm font-medium mb-1 block">Имя *</label>
          <Input
            required
            value={formData.name}
            onChange={(e) => setFormData({...formData, name: e.target.value})}
            placeholder="Ваше имя"
          />
        </div>
        <div>
          <label className="text-sm font-medium mb-1 block">Телефон *</label>
          <Input
            required
            type="tel"
            value={formData.phone}
            onChange={(e) => setFormData({...formData, phone: e.target.value})}
            placeholder="+7 (999) 123-45-67"
          />
        </div>
        <div>
          <label className="text-sm font-medium mb-1 block">Email</label>
          <Input
            type="email"
            value={formData.email}
            onChange={(e) => setFormData({...formData, email: e.target.value})}
            placeholder="your@email.com"
          />
        </div>
        <div>
          <label className="text-sm font-medium mb-1 block">Сообщение</label>
          <Textarea
            value={formData.message}
            onChange={(e) => setFormData({...formData, message: e.target.value})}
            placeholder="Дополнительная информация..."
            rows={3}
          />
        </div>
        <Button type="submit" className="w-full bg-primary hover:bg-primary/90">
          Отправить заявку
        </Button>
      </form>
    );
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Breadcrumbs */}
      <div className="bg-gray-50 py-4">
        <div className="container mx-auto px-4">
          <nav className="flex items-center space-x-2 text-sm text-gray-600">
            <Link to="/" className="hover:text-primary">Главная</Link>
            <Icon name="ChevronRight" size={14} />
            <Link to="/catalog" className="hover:text-primary">Каталог</Link>
            <Icon name="ChevronRight" size={14} />
            <span className="text-gray-900">{car.name}</span>
          </nav>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Images and Main Info */}
          <div className="lg:col-span-2">
            {/* Image Gallery */}
            <div className="mb-8">
              <div className="relative mb-4">
                <img 
                  src={car.images[selectedImage]} 
                  alt={car.name}
                  className="w-full h-96 object-cover rounded-lg"
                />
                <div className="absolute top-4 left-4 flex flex-col gap-2">
                  <Badge className="bg-green-600">Новый</Badge>
                  <Badge className="bg-primary">В наличии</Badge>
                </div>
              </div>
              <div className="flex gap-2 overflow-x-auto">
                {car.images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 ${
                      selectedImage === index ? 'border-primary' : 'border-gray-200'
                    }`}
                  >
                    <img src={image} alt={`${car.name} ${index + 1}`} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            </div>

            {/* Car Details Tabs */}
            <Tabs defaultValue="overview" className="w-full">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="overview">Обзор</TabsTrigger>
                <TabsTrigger value="specs">Характеристики</TabsTrigger>
                <TabsTrigger value="equipment">Комплектация</TabsTrigger>
                <TabsTrigger value="documents">Документы</TabsTrigger>
              </TabsList>
              
              <TabsContent value="overview" className="space-y-6 mt-6">
                <div>
                  <h3 className="text-xl font-semibold mb-4">Описание</h3>
                  <p className="text-gray-600 leading-relaxed">{car.description}</p>
                </div>
                
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="bg-gray-50 p-4 rounded-lg text-center">
                    <Icon name="Zap" size={24} className="text-primary mx-auto mb-2" />
                    <div className="font-semibold">{car.engine}</div>
                    <div className="text-sm text-gray-600">{car.power}</div>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg text-center">
                    <Icon name="Activity" size={24} className="text-primary mx-auto mb-2" />
                    <div className="font-semibold">0-100 км/ч</div>
                    <div className="text-sm text-gray-600">{car.acceleration}</div>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg text-center">
                    <Icon name="Gauge" size={24} className="text-primary mx-auto mb-2" />
                    <div className="font-semibold">Расход</div>
                    <div className="text-sm text-gray-600">{car.consumption}</div>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg text-center">
                    <Icon name="Settings" size={24} className="text-primary mx-auto mb-2" />
                    <div className="font-semibold">{car.drive}</div>
                    <div className="text-sm text-gray-600">{car.transmission}</div>
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="specs" className="space-y-6 mt-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-semibold mb-3 text-secondary">Двигатель и трансмиссия</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Двигатель:</span>
                        <span>{car.engine}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Мощность:</span>
                        <span>{car.power}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Привод:</span>
                        <span>{car.drive}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">КПП:</span>
                        <span>{car.transmission}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Макс. скорость:</span>
                        <span>{car.specs.maxSpeed}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Разгон 0-100:</span>
                        <span>{car.acceleration}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="font-semibold mb-3 text-secondary">Габариты и вес</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Размеры:</span>
                        <span>{car.specs.dimensions}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Колесная база:</span>
                        <span>{car.specs.wheelbase}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Багажник:</span>
                        <span>{car.specs.trunk}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Масса:</span>
                        <span>{car.specs.weight}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Топливный бак:</span>
                        <span>{car.specs.fuelTank}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Количество дверей:</span>
                        <span>{car.specs.doors}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Количество мест:</span>
                        <span>{car.specs.seats}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="equipment" className="space-y-6 mt-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {Object.entries(car.equipment).map(([category, items]) => (
                    <div key={category}>
                      <h4 className="font-semibold mb-3 text-secondary capitalize">
                        {category === 'safety' && 'Безопасность'}
                        {category === 'comfort' && 'Комфорт'}
                        {category === 'multimedia' && 'Мультимедиа'}
                        {category === 'exterior' && 'Экстерьер'}
                      </h4>
                      <div className="space-y-2">
                        {items.map((item, index) => (
                          <div key={index} className="flex items-center space-x-2">
                            <Icon name="Check" size={16} className="text-green-600" />
                            <span className="text-sm">{item}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </TabsContent>
              
              <TabsContent value="documents" className="space-y-6 mt-6">
                <div>
                  <h4 className="font-semibold mb-4 text-secondary">Документы и информация</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <h5 className="font-medium mb-2">VIN номер</h5>
                      <p className="text-sm text-gray-600 font-mono">{car.vin}</p>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <h5 className="font-medium mb-2">Год выпуска</h5>
                      <p className="text-sm text-gray-600">{car.year}</p>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <h5 className="font-medium mb-2">Цвет</h5>
                      <p className="text-sm text-gray-600">{car.color}</p>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <h5 className="font-medium mb-2">Пробег</h5>
                      <p className="text-sm text-gray-600">{car.mileage} км</p>
                    </div>
                  </div>
                  
                  <div className="mt-6">
                    <h5 className="font-medium mb-3">Доступные документы</h5>
                    <div className="space-y-2">
                      {[
                        'Паспорт транспортного средства (ПТС)',
                        'Свидетельство о регистрации ТС (СТС)',
                        'Сервисная книжка',
                        'Договор купли-продажи',
                        'Справка о ДТП'
                      ].map((doc, index) => (
                        <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                          <div className="flex items-center space-x-2">
                            <Icon name="FileText" size={16} className="text-primary" />
                            <span className="text-sm">{doc}</span>
                          </div>
                          <Badge variant="outline" className="text-green-600 border-green-600">
                            Доступен
                          </Badge>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-4 space-y-6">
              {/* Price and Basic Info */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-2xl text-secondary">{car.name}</CardTitle>
                  <div className="text-3xl font-bold text-primary">{formatPrice(car.price)} ₽</div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-gray-600">Год:</span>
                      <div className="font-medium">{car.year}</div>
                    </div>
                    <div>
                      <span className="text-gray-600">Пробег:</span>
                      <div className="font-medium">{car.mileage} км</div>
                    </div>
                    <div>
                      <span className="text-gray-600">Топливо:</span>
                      <div className="font-medium">{car.fuel}</div>
                    </div>
                    <div>
                      <span className="text-gray-600">КПП:</span>
                      <div className="font-medium">{car.transmission}</div>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button className="w-full bg-primary hover:bg-primary/90">
                          <Icon name="Phone" size={16} className="mr-2" />
                          Связаться с менеджером
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Связаться с менеджером</DialogTitle>
                        </DialogHeader>
                        <ContactForm />
                      </DialogContent>
                    </Dialog>

                    <Link to="/test-drive">
                      <Button variant="outline" className="w-full">
                        <Icon name="Car" size={16} className="mr-2" />
                        Записаться на тест-драйв
                      </Button>
                    </Link>

                    <Link to="/financing">
                      <Button variant="outline" className="w-full">
                        <Icon name="Calculator" size={16} className="mr-2" />
                        Рассчитать кредит
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>

              {/* Manager Contact */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Ваш менеджер</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center space-x-3 mb-4">
                    <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                      <Icon name="User" size={20} className="text-primary" />
                    </div>
                    <div>
                      <div className="font-medium">Алексей Петров</div>
                      <div className="text-sm text-gray-600">Старший менеджер</div>
                    </div>
                  </div>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center space-x-2">
                      <Icon name="Phone" size={14} className="text-gray-400" />
                      <span>+7 (495) 123-45-67</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Icon name="Mail" size={14} className="text-gray-400" />
                      <span>a.petrov@autopremium.ru</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Additional Services */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Дополнительные услуги</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Link to="/trade-in" className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                    <div className="flex items-center space-x-2">
                      <Icon name="RefreshCw" size={16} className="text-primary" />
                      <span className="text-sm">Trade-in</span>
                    </div>
                    <Icon name="ChevronRight" size={14} className="text-gray-400" />
                  </Link>
                  <Link to="/insurance" className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                    <div className="flex items-center space-x-2">
                      <Icon name="Shield" size={16} className="text-primary" />
                      <span className="text-sm">Страхование</span>
                    </div>
                    <Icon name="ChevronRight" size={14} className="text-gray-400" />
                  </Link>
                  <Link to="/warranty" className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                    <div className="flex items-center space-x-2">
                      <Icon name="Award" size={16} className="text-primary" />
                      <span className="text-sm">Гарантия</span>
                    </div>
                    <Icon name="ChevronRight" size={14} className="text-gray-400" />
                  </Link>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CarDetail;