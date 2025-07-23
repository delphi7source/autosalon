import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Slider } from '@/components/ui/slider';
import Icon from '@/components/ui/icon';

const TradeIn = () => {
  const [currentCarValue, setCurrentCarValue] = useState([0]);
  const [evaluationForm, setEvaluationForm] = useState({
    brand: '',
    model: '',
    year: '',
    mileage: '',
    engine: '',
    transmission: '',
    condition: '',
    accidents: false,
    modifications: false,
    serviceHistory: true,
    description: ''
  });
  const [contactForm, setContactForm] = useState({
    name: '',
    phone: '',
    email: '',
    preferredTime: ''
  });

  const tradeInSteps = [
    {
      step: 1,
      title: 'Оценка автомобиля',
      description: 'Заполните форму с данными о вашем автомобиле',
      icon: 'FileText'
    },
    {
      step: 2,
      title: 'Осмотр специалистом',
      description: 'Наш эксперт проведет детальный осмотр',
      icon: 'Search'
    },
    {
      step: 3,
      title: 'Получение предложения',
      description: 'Мы предложим справедливую цену за ваш автомобиль',
      icon: 'DollarSign'
    },
    {
      step: 4,
      title: 'Оформление сделки',
      description: 'Быстрое оформление всех документов',
      icon: 'CheckCircle'
    }
  ];

  const advantages = [
    {
      title: 'Быстрая оценка',
      description: 'Предварительная оценка за 15 минут',
      icon: 'Clock'
    },
    {
      title: 'Справедливая цена',
      description: 'Рыночная стоимость без скрытых комиссий',
      icon: 'TrendingUp'
    },
    {
      title: 'Все документы',
      description: 'Полное юридическое сопровождение',
      icon: 'Shield'
    },
    {
      title: 'Удобство',
      description: 'Одновременная покупка нового автомобиля',
      icon: 'RefreshCw'
    }
  ];

  const popularModels = [
    { brand: 'BMW', model: '3 Series', year: '2020', estimatedValue: '2 100 000 - 2 400 000' },
    { brand: 'Audi', model: 'A4', year: '2019', estimatedValue: '1 800 000 - 2 100 000' },
    { brand: 'Mercedes', model: 'C-Class', year: '2021', estimatedValue: '2 500 000 - 2 800 000' },
    { brand: 'BMW', model: 'X5', year: '2018', estimatedValue: '3 200 000 - 3 600 000' },
    { brand: 'Audi', model: 'Q5', year: '2020', estimatedValue: '2 800 000 - 3 200 000' },
    { brand: 'Mercedes', model: 'GLC', year: '2019', estimatedValue: '2 600 000 - 3 000 000' }
  ];

  const handleEvaluationSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: 'Заявка отправлена',
      description: 'Мы свяжемся с вами для назначения времени осмотра',
    });
    // Здесь была бы отправка формы на сервер
  };

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: 'Заявка отправлена',
      description: 'Мы свяжемся с вами в ближайшее время',
    });
    // Здесь была бы отправка формы на сервер
  };

  const estimateValue = () => {
    // Простая логика оценки на основе года и пробега
    const currentYear = new Date().getFullYear();
    const carAge = currentYear - parseInt(evaluationForm.year || '2020');
    const mileage = parseInt(evaluationForm.mileage || '50000');
    
    let baseValue = 2000000; // Базовая стоимость
    
    // Корректировка по возрасту
    baseValue -= carAge * 150000;
    
    // Корректировка по пробегу
    if (mileage > 100000) {
      baseValue -= (mileage - 100000) * 5;
    }
    
    // Корректировка по состоянию
    if (evaluationForm.condition === 'excellent') baseValue *= 1.1;
    if (evaluationForm.condition === 'poor') baseValue *= 0.8;
    
    // Корректировка по ДТП
    if (evaluationForm.accidents) baseValue *= 0.85;
    
    return Math.max(baseValue, 500000);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <section className="bg-secondary text-white py-12">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl font-bold mb-4">Trade-in</h1>
          <p className="text-xl opacity-90">Обменяйте свой автомобиль на новый с доплатой</p>
        </div>
      </section>

      <div className="container mx-auto px-4 py-8">
        {/* How it works */}
        <section className="mb-12">
          <h2 className="text-3xl font-bold text-center text-secondary mb-8">Как это работает</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {tradeInSteps.map((step, index) => (
              <Card key={index} className="text-center">
                <CardContent className="pt-6">
                  <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Icon name={step.icon} size={24} className="text-primary" />
                  </div>
                  <div className="w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center mx-auto mb-3 text-sm font-bold">
                    {step.step}
                  </div>
                  <h3 className="font-semibold mb-2">{step.title}</h3>
                  <p className="text-sm text-gray-600">{step.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Evaluation Form */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Icon name="Car" size={20} className="mr-2" />
                  Оценка вашего автомобиля
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleEvaluationSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="text-sm font-medium mb-2 block">Марка *</label>
                      <Select value={evaluationForm.brand} onValueChange={(value) => setEvaluationForm({...evaluationForm, brand: value})}>
                        <SelectTrigger>
                          <SelectValue placeholder="Выберите марку" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="bmw">BMW</SelectItem>
                          <SelectItem value="audi">Audi</SelectItem>
                          <SelectItem value="mercedes">Mercedes-Benz</SelectItem>
                          <SelectItem value="volkswagen">Volkswagen</SelectItem>
                          <SelectItem value="toyota">Toyota</SelectItem>
                          <SelectItem value="other">Другая</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <label className="text-sm font-medium mb-2 block">Модель *</label>
                      <Input
                        required
                        value={evaluationForm.model}
                        onChange={(e) => setEvaluationForm({...evaluationForm, model: e.target.value})}
                        placeholder="Например: 3 Series"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium mb-2 block">Год выпуска *</label>
                      <Input
                        required
                        type="number"
                        min="1990"
                        max="2024"
                        value={evaluationForm.year}
                        onChange={(e) => setEvaluationForm({...evaluationForm, year: e.target.value})}
                        placeholder="2020"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium mb-2 block">Пробег (км) *</label>
                      <Input
                        required
                        type="number"
                        value={evaluationForm.mileage}
                        onChange={(e) => setEvaluationForm({...evaluationForm, mileage: e.target.value})}
                        placeholder="50000"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium mb-2 block">Объем двигателя</label>
                      <Select value={evaluationForm.engine} onValueChange={(value) => setEvaluationForm({...evaluationForm, engine: value})}>
                        <SelectTrigger>
                          <SelectValue placeholder="Выберите объем" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="1.0">1.0 л</SelectItem>
                          <SelectItem value="1.4">1.4 л</SelectItem>
                          <SelectItem value="1.6">1.6 л</SelectItem>
                          <SelectItem value="2.0">2.0 л</SelectItem>
                          <SelectItem value="2.5">2.5 л</SelectItem>
                          <SelectItem value="3.0">3.0 л и более</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium mb-2 block">Коробка передач</label>
                      <Select value={evaluationForm.transmission} onValueChange={(value) => setEvaluationForm({...evaluationForm, transmission: value})}>
                        <SelectTrigger>
                          <SelectValue placeholder="Выберите КПП" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="manual">Механическая</SelectItem>
                          <SelectItem value="automatic">Автоматическая</SelectItem>
                          <SelectItem value="robot">Робот</SelectItem>
                          <SelectItem value="variator">Вариатор</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <label className="text-sm font-medium mb-2 block">Состояние</label>
                      <Select value={evaluationForm.condition} onValueChange={(value) => setEvaluationForm({...evaluationForm, condition: value})}>
                        <SelectTrigger>
                          <SelectValue placeholder="Оцените состояние" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="excellent">Отличное</SelectItem>
                          <SelectItem value="good">Хорошее</SelectItem>
                          <SelectItem value="fair">Удовлетворительное</SelectItem>
                          <SelectItem value="poor">Требует ремонта</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="accidents"
                        checked={evaluationForm.accidents}
                        onCheckedChange={(checked) => setEvaluationForm({...evaluationForm, accidents: checked as boolean})}
                      />
                      <label htmlFor="accidents" className="text-sm">Автомобиль участвовал в ДТП</label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="modifications"
                        checked={evaluationForm.modifications}
                        onCheckedChange={(checked) => setEvaluationForm({...evaluationForm, modifications: checked as boolean})}
                      />
                      <label htmlFor="modifications" className="text-sm">Есть тюнинг или модификации</label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="serviceHistory"
                        checked={evaluationForm.serviceHistory}
                        onCheckedChange={(checked) => setEvaluationForm({...evaluationForm, serviceHistory: checked as boolean})}
                      />
                      <label htmlFor="serviceHistory" className="text-sm">Полная история обслуживания</label>
                    </div>
                  </div>

                  <div>
                    <label className="text-sm font-medium mb-2 block">Дополнительная информация</label>
                    <Textarea
                      value={evaluationForm.description}
                      onChange={(e) => setEvaluationForm({...evaluationForm, description: e.target.value})}
                      placeholder="Опишите особенности автомобиля, дополнительное оборудование, дефекты..."
                      rows={3}
                    />
                  </div>

                  {/* Estimated Value */}
                  {evaluationForm.brand && evaluationForm.model && evaluationForm.year && (
                    <Card className="bg-primary/5 border-primary/20">
                      <CardContent className="pt-6">
                        <div className="text-center">
                          <div className="text-2xl font-bold text-primary mb-2">
                            {estimateValue().toLocaleString('ru-RU')} ₽
                          </div>
                          <div className="text-gray-600">Предварительная оценка</div>
                          <div className="text-sm text-gray-500 mt-2">
                            Точная стоимость определяется после осмотра
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  )}

                  <Button type="submit" className="w-full bg-primary hover:bg-primary/90" size="lg">
                    <Icon name="Calculator" size={16} className="mr-2" />
                    Получить точную оценку
                  </Button>
                </form>
              </CardContent>
            </Card>

            {/* Popular Models */}
            <Card className="mt-6">
              <CardHeader>
                <CardTitle>Популярные модели для Trade-in</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {popularModels.map((car, index) => (
                    <div key={index} className="border rounded-lg p-4">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <h4 className="font-semibold">{car.brand} {car.model}</h4>
                          <p className="text-sm text-gray-600">{car.year} год</p>
                        </div>
                        <Badge variant="outline">Trade-in</Badge>
                      </div>
                      <div className="text-sm">
                        <span className="text-gray-600">Оценочная стоимость:</span>
                        <div className="font-medium text-primary">{car.estimatedValue} ₽</div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div>
            <div className="sticky top-4 space-y-6">
              {/* Contact Form */}
              <Card>
                <CardHeader>
                  <CardTitle>Записаться на осмотр</CardTitle>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleContactSubmit} className="space-y-4">
                    <div>
                      <label className="text-sm font-medium mb-1 block">Имя *</label>
                      <Input
                        required
                        value={contactForm.name}
                        onChange={(e) => setContactForm({...contactForm, name: e.target.value})}
                        placeholder="Ваше имя"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium mb-1 block">Телефон *</label>
                      <Input
                        required
                        type="tel"
                        value={contactForm.phone}
                        onChange={(e) => setContactForm({...contactForm, phone: e.target.value})}
                        placeholder="+7 (999) 123-45-67"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium mb-1 block">Email</label>
                      <Input
                        type="email"
                        value={contactForm.email}
                        onChange={(e) => setContactForm({...contactForm, email: e.target.value})}
                        placeholder="your@email.com"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium mb-1 block">Удобное время</label>
                      <Select value={contactForm.preferredTime} onValueChange={(value) => setContactForm({...contactForm, preferredTime: value})}>
                        <SelectTrigger>
                          <SelectValue placeholder="Выберите время" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="morning">Утром (9:00-12:00)</SelectItem>
                          <SelectItem value="afternoon">Днем (12:00-15:00)</SelectItem>
                          <SelectItem value="evening">Вечером (15:00-18:00)</SelectItem>
                          <SelectItem value="weekend">В выходные</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <Button type="submit" className="w-full bg-primary hover:bg-primary/90">
                      <Icon name="Calendar" size={16} className="mr-2" />
                      Записаться на осмотр
                    </Button>
                  </form>
                </CardContent>
              </Card>

              {/* Advantages */}
              <Card>
                <CardHeader>
                  <CardTitle>Преимущества Trade-in</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {advantages.map((advantage, index) => (
                      <div key={index} className="flex items-start space-x-3">
                        <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                          <Icon name={advantage.icon} size={16} className="text-primary" />
                        </div>
                        <div>
                          <h4 className="font-medium">{advantage.title}</h4>
                          <p className="text-sm text-gray-600">{advantage.description}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Documents */}
              <Card>
                <CardHeader>
                  <CardTitle>Необходимые документы</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 text-sm">
                    {[
                      'Паспорт владельца',
                      'ПТС (оригинал)',
                      'СТС',
                      'Сервисная книжка',
                      'Справка об отсутствии ограничений',
                      'Ключи от автомобиля'
                    ].map((doc, index) => (
                      <div key={index} className="flex items-center space-x-2">
                        <Icon name="FileText" size={14} className="text-primary" />
                        <span>{doc}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* FAQ */}
              <Card>
                <CardHeader>
                  <CardTitle>Часто задаваемые вопросы</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4 text-sm">
                    <div>
                      <div className="font-medium mb-1">Сколько времени занимает оценка?</div>
                      <div className="text-gray-600">Предварительная оценка - 15 минут, детальный осмотр - 1 час</div>
                    </div>
                    <div>
                      <div className="font-medium mb-1">Можно ли доплатить разницу наличными?</div>
                      <div className="text-gray-600">Да, возможна доплата наличными или банковским переводом</div>
                    </div>
                    <div>
                      <div className="font-medium mb-1">Что если не устроит цена?</div>
                      <div className="text-gray-600">Вы не обязаны продавать автомобиль, оценка бесплатная</div>
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

export default TradeIn;