import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { format } from 'date-fns';
import { ru } from 'date-fns/locale';
import Icon from '@/components/ui/icon';

const TestDrive = () => {
  const [selectedDate, setSelectedDate] = useState<Date>();
  const [selectedTime, setSelectedTime] = useState('');
  const [selectedCar, setSelectedCar] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    experience: '',
    comments: ''
  });

  const availableCars = [
    { id: 1, name: 'BMW 3 Series', image: '/img/35658ce2-0e0f-41a4-a417-c35990cabc29.jpg', available: true },
    { id: 2, name: 'Audi Q5', image: '/img/b6e0d970-0bdc-442d-af99-f0a51ff0863e.jpg', available: true },
    { id: 3, name: 'Mercedes C-Class Coupe', image: '/img/8da9e761-2e1b-453f-9c89-1afd4df236ee.jpg', available: false },
    { id: 4, name: 'BMW X5', image: '/img/35658ce2-0e0f-41a4-a417-c35990cabc29.jpg', available: true },
    { id: 5, name: 'Audi A4', image: '/img/b6e0d970-0bdc-442d-af99-f0a51ff0863e.jpg', available: true },
    { id: 6, name: 'Mercedes E-Class', image: '/img/8da9e761-2e1b-453f-9c89-1afd4df236ee.jpg', available: true }
  ];

  const timeSlots = [
    '09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00', '18:00'
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Здесь была бы отправка формы
    console.log('Test drive booking:', {
      ...formData,
      date: selectedDate,
      time: selectedTime,
      car: selectedCar
    });
  };

  const isFormValid = () => {
    return formData.name && formData.phone && selectedDate && selectedTime && selectedCar;
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <section className="bg-secondary text-white py-12">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl font-bold mb-4">Тест-драйв</h1>
          <p className="text-xl opacity-90">Запишитесь на тест-драйв и почувствуйте автомобиль в действии</p>
        </div>
      </section>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Booking Form */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Icon name="Car" size={20} className="mr-2" />
                  Запись на тест-драйв
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Car Selection */}
                  <div>
                    <label className="text-sm font-medium mb-3 block">Выберите автомобиль</label>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {availableCars.map((car) => (
                        <div
                          key={car.id}
                          className={`relative border-2 rounded-lg overflow-hidden cursor-pointer transition-all ${
                            selectedCar === car.name
                              ? 'border-primary ring-2 ring-primary/20'
                              : car.available
                              ? 'border-gray-200 hover:border-gray-300'
                              : 'border-gray-100 opacity-50 cursor-not-allowed'
                          }`}
                          onClick={() => car.available && setSelectedCar(car.name)}
                        >
                          <img src={car.image} alt={car.name} className="w-full h-32 object-cover" />
                          <div className="p-3">
                            <h4 className="font-medium">{car.name}</h4>
                            <div className="mt-2">
                              {car.available ? (
                                <Badge className="bg-green-600">Доступен</Badge>
                              ) : (
                                <Badge variant="secondary">Недоступен</Badge>
                              )}
                            </div>
                          </div>
                          {selectedCar === car.name && (
                            <div className="absolute top-2 right-2">
                              <div className="w-6 h-6 bg-primary rounded-full flex items-center justify-center">
                                <Icon name="Check" size={14} className="text-white" />
                              </div>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Date and Time */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium mb-2 block">Дата</label>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            className={`w-full justify-start text-left font-normal ${
                              !selectedDate && "text-muted-foreground"
                            }`}
                          >
                            <Icon name="Calendar" size={16} className="mr-2" />
                            {selectedDate ? format(selectedDate, "PPP", { locale: ru }) : "Выберите дату"}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0">
                          <Calendar
                            mode="single"
                            selected={selectedDate}
                            onSelect={setSelectedDate}
                            disabled={(date) => date < new Date() || date.getDay() === 0}
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                    </div>

                    <div>
                      <label className="text-sm font-medium mb-2 block">Время</label>
                      <Select value={selectedTime} onValueChange={setSelectedTime}>
                        <SelectTrigger>
                          <SelectValue placeholder="Выберите время" />
                        </SelectTrigger>
                        <SelectContent>
                          {timeSlots.map(time => (
                            <SelectItem key={time} value={time}>{time}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  {/* Personal Information */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium mb-2 block">Имя *</label>
                      <Input
                        required
                        value={formData.name}
                        onChange={(e) => setFormData({...formData, name: e.target.value})}
                        placeholder="Ваше имя"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium mb-2 block">Телефон *</label>
                      <Input
                        required
                        type="tel"
                        value={formData.phone}
                        onChange={(e) => setFormData({...formData, phone: e.target.value})}
                        placeholder="+7 (999) 123-45-67"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-sm font-medium mb-2 block">Email</label>
                    <Input
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({...formData, email: e.target.value})}
                      placeholder="your@email.com"
                    />
                  </div>

                  <div>
                    <label className="text-sm font-medium mb-2 block">Водительский стаж</label>
                    <Select value={formData.experience} onValueChange={(value) => setFormData({...formData, experience: value})}>
                      <SelectTrigger>
                        <SelectValue placeholder="Выберите стаж" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="less-1">Менее 1 года</SelectItem>
                        <SelectItem value="1-3">1-3 года</SelectItem>
                        <SelectItem value="3-5">3-5 лет</SelectItem>
                        <SelectItem value="5-10">5-10 лет</SelectItem>
                        <SelectItem value="more-10">Более 10 лет</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <label className="text-sm font-medium mb-2 block">Комментарии</label>
                    <Textarea
                      value={formData.comments}
                      onChange={(e) => setFormData({...formData, comments: e.target.value})}
                      placeholder="Дополнительные пожелания или вопросы..."
                      rows={3}
                    />
                  </div>

                  <Button 
                    type="submit" 
                    className="w-full bg-primary hover:bg-primary/90" 
                    size="lg"
                    disabled={!isFormValid()}
                  >
                    <Icon name="Calendar" size={16} className="mr-2" />
                    Записаться на тест-драйв
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div>
            <div className="sticky top-4 space-y-6">
              {/* Information */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Информация о тест-драйве</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div className="flex items-start space-x-3">
                      <Icon name="Clock" size={16} className="text-primary mt-1" />
                      <div>
                        <div className="font-medium">Продолжительность</div>
                        <div className="text-sm text-gray-600">30-60 минут</div>
                      </div>
                    </div>
                    <div className="flex items-start space-x-3">
                      <Icon name="MapPin" size={16} className="text-primary mt-1" />
                      <div>
                        <div className="font-medium">Место проведения</div>
                        <div className="text-sm text-gray-600">Автосалон AutoPremium<br />ул. Примерная, 123</div>
                      </div>
                    </div>
                    <div className="flex items-start space-x-3">
                      <Icon name="FileText" size={16} className="text-primary mt-1" />
                      <div>
                        <div className="font-medium">Документы</div>
                        <div className="text-sm text-gray-600">Водительское удостоверение</div>
                      </div>
                    </div>
                    <div className="flex items-start space-x-3">
                      <Icon name="Shield" size={16} className="text-primary mt-1" />
                      <div>
                        <div className="font-medium">Страхование</div>
                        <div className="text-sm text-gray-600">Полная страховка включена</div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Rules */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Правила тест-драйва</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3 text-sm">
                    <div className="flex items-start space-x-2">
                      <Icon name="Check" size={14} className="text-green-600 mt-0.5" />
                      <span>Возраст от 21 года</span>
                    </div>
                    <div className="flex items-start space-x-2">
                      <Icon name="Check" size={14} className="text-green-600 mt-0.5" />
                      <span>Водительский стаж от 2 лет</span>
                    </div>
                    <div className="flex items-start space-x-2">
                      <Icon name="Check" size={14} className="text-green-600 mt-0.5" />
                      <span>Наличие действующих прав</span>
                    </div>
                    <div className="flex items-start space-x-2">
                      <Icon name="Check" size={14} className="text-green-600 mt-0.5" />
                      <span>Сопровождение менеджера</span>
                    </div>
                    <div className="flex items-start space-x-2">
                      <Icon name="X" size={14} className="text-red-600 mt-0.5" />
                      <span>Запрещено курение в автомобиле</span>
                    </div>
                    <div className="flex items-start space-x-2">
                      <Icon name="X" size={14} className="text-red-600 mt-0.5" />
                      <span>Максимальная скорость 80 км/ч</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Contact */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Контакты</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3 text-sm">
                    <div className="flex items-center space-x-2">
                      <Icon name="Phone" size={14} className="text-primary" />
                      <span>+7 (495) 123-45-67</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Icon name="Mail" size={14} className="text-primary" />
                      <span>testdrive@autopremium.ru</span>
                    </div>
                    <div className="flex items-start space-x-2">
                      <Icon name="MapPin" size={14} className="text-primary mt-0.5" />
                      <span>Москва, ул. Примерная, 123<br />Ежедневно с 9:00 до 20:00</span>
                    </div>
                  </div>
                  
                  <Button variant="outline" className="w-full mt-4">
                    <Icon name="Navigation" size={16} className="mr-2" />
                    Построить маршрут
                  </Button>
                </CardContent>
              </Card>

              {/* FAQ */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Часто задаваемые вопросы</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4 text-sm">
                    <div>
                      <div className="font-medium mb-1">Можно ли перенести запись?</div>
                      <div className="text-gray-600">Да, за 24 часа до назначенного времени</div>
                    </div>
                    <div>
                      <div className="font-medium mb-1">Что если опоздаю?</div>
                      <div className="text-gray-600">Запись сохраняется в течение 15 минут</div>
                    </div>
                    <div>
                      <div className="font-medium mb-1">Можно ли взять с собой пассажира?</div>
                      <div className="text-gray-600">Да, до 2 пассажиров</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TestDrive;