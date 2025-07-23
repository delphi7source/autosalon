import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useState } from 'react';
import Icon from '@/components/ui/icon';

const Warranty = () => {
  const [warrantyNumber, setWarrantyNumber] = useState('');

  const warrantyTypes = [
    {
      type: 'Заводская гарантия',
      duration: '2-5 лет',
      coverage: 'Полная гарантия производителя',
      description: 'Официальная гарантия от производителя автомобиля',
      features: [
        'Покрытие всех заводских дефектов',
        'Бесплатный ремонт и замена деталей',
        'Действует по всему миру',
        'Техническая поддержка 24/7'
      ]
    },
    {
      type: 'Расширенная гарантия',
      duration: 'до 7 лет',
      coverage: 'Дополнительная защита',
      description: 'Продление гарантийного покрытия после окончания заводской гарантии',
      features: [
        'Покрытие основных узлов и агрегатов',
        'Защита от непредвиденных расходов',
        'Возможность передачи новому владельцу',
        'Сервис в авторизованных центрах'
      ]
    },
    {
      type: 'Гарантия на работы',
      duration: '1-2 года',
      coverage: 'Выполненные работы',
      description: 'Гарантия на все виды ремонтных и сервисных работ',
      features: [
        'Гарантия качества выполненных работ',
        'Бесплатное устранение дефектов',
        'Использование оригинальных запчастей',
        'Квалифицированные специалисты'
      ]
    }
  ];

  const warrantyConditions = [
    {
      title: 'Соблюдение регламента ТО',
      description: 'Прохождение технического обслуживания согласно регламенту производителя',
      icon: 'Calendar'
    },
    {
      title: 'Использование оригинальных запчастей',
      description: 'Применение только оригинальных или рекомендованных производителем деталей',
      icon: 'Settings'
    },
    {
      title: 'Обслуживание в авторизованных центрах',
      description: 'Проведение работ в сертифицированных сервисных центрах',
      icon: 'Award'
    },
    {
      title: 'Правильная эксплуатация',
      description: 'Использование автомобиля в соответствии с инструкцией производителя',
      icon: 'Book'
    }
  ];

  const exclusions = [
    'Естественный износ деталей (тормозные колодки, шины, фильтры)',
    'Повреждения в результате ДТП или неправильной эксплуатации',
    'Ущерб от стихийных бедствий',
    'Повреждения от использования некачественного топлива или масла',
    'Самостоятельное вмешательство в конструкцию автомобиля',
    'Повреждения от участия в гонках или соревнованиях'
  ];

  const warrantyProcess = [
    {
      step: 1,
      title: 'Обращение в сервис',
      description: 'Свяжитесь с нами при обнаружении неисправности',
      icon: 'Phone'
    },
    {
      step: 2,
      title: 'Диагностика',
      description: 'Проведение диагностики для определения причины неисправности',
      icon: 'Search'
    },
    {
      step: 3,
      title: 'Принятие решения',
      description: 'Определение гарантийного случая и способа устранения',
      icon: 'CheckCircle'
    },
    {
      step: 4,
      title: 'Выполнение работ',
      description: 'Бесплатное устранение неисправности или замена детали',
      icon: 'Wrench'
    }
  ];

  const faqItems = [
    {
      question: 'Что делать, если автомобиль сломался в другом городе?',
      answer: 'Обратитесь в ближайший авторизованный сервисный центр или свяжитесь с нашей службой поддержки. Мы поможем организовать ремонт или эвакуацию.'
    },
    {
      question: 'Можно ли передать гарантию новому владельцу?',
      answer: 'Да, заводская гарантия передается вместе с автомобилем. Для этого необходимо уведомить производителя о смене владельца.'
    },
    {
      question: 'Что происходит с гарантией при продаже автомобиля?',
      answer: 'Гарантия сохраняется и переходит к новому владельцу. Необходимо передать все гарантийные документы.'
    },
    {
      question: 'Покрывает ли гарантия расходные материалы?',
      answer: 'Расходные материалы (масло, фильтры, тормозные колодки) не покрываются гарантией, так как подлежат плановой замене.'
    },
    {
      question: 'Что делать, если отказали в гарантийном ремонте?',
      answer: 'Вы можете обратиться к нашему менеджеру по гарантии или в службу поддержки производителя для разрешения спорной ситуации.'
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <section className="bg-secondary text-white py-12">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl font-bold mb-4">Гарантийное обслуживание</h1>
          <p className="text-xl opacity-90">Полная защита вашего автомобиля и спокойствие на дороге</p>
        </div>
      </section>

      <div className="container mx-auto px-4 py-8">
        <Tabs defaultValue="types" className="w-full">
          <TabsList className="grid w-full grid-cols-4 mb-8">
            <TabsTrigger value="types">Виды гарантии</TabsTrigger>
            <TabsTrigger value="conditions">Условия</TabsTrigger>
            <TabsTrigger value="process">Процедура</TabsTrigger>
            <TabsTrigger value="check">Проверка</TabsTrigger>
          </TabsList>

          <TabsContent value="types">
            <div className="space-y-8">
              {/* Warranty Types */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {warrantyTypes.map((warranty, index) => (
                  <Card key={index} className="h-full">
                    <CardHeader>
                      <div className="flex justify-between items-start mb-2">
                        <CardTitle className="text-xl">{warranty.type}</CardTitle>
                        <Badge variant="outline">{warranty.duration}</Badge>
                      </div>
                      <p className="text-gray-600">{warranty.description}</p>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <div className="font-medium text-primary">{warranty.coverage}</div>
                        <div className="space-y-2">
                          {warranty.features.map((feature, idx) => (
                            <div key={idx} className="flex items-start space-x-2">
                              <Icon name="Check" size={16} className="text-green-600 mt-0.5" />
                              <span className="text-sm">{feature}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* Coverage Details */}
              <Card>
                <CardHeader>
                  <CardTitle>Что покрывает гарантия</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <div>
                      <h4 className="font-semibold mb-3 text-green-600">Двигатель и трансмиссия</h4>
                      <ul className="space-y-1 text-sm">
                        <li>• Блок двигателя и головка блока</li>
                        <li>• Коробка передач</li>
                        <li>• Система охлаждения</li>
                        <li>• Топливная система</li>
                        <li>• Система зажигания</li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-semibold mb-3 text-green-600">Электроника</h4>
                      <ul className="space-y-1 text-sm">
                        <li>• Блоки управления</li>
                        <li>• Датчики и актуаторы</li>
                        <li>• Мультимедийная система</li>
                        <li>• Система навигации</li>
                        <li>• Климат-контроль</li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-semibold mb-3 text-green-600">Подвеска и тормоза</h4>
                      <ul className="space-y-1 text-sm">
                        <li>• Амортизаторы и пружины</li>
                        <li>• Тормозная система (кроме колодок)</li>
                        <li>• Рулевое управление</li>
                        <li>• Приводы и шарниры</li>
                        <li>• Система ABS/ESP</li>
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="conditions">
            <div className="space-y-8">
              {/* Warranty Conditions */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {warrantyConditions.map((condition, index) => (
                  <Card key={index} className="text-center">
                    <CardContent className="pt-6">
                      <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Icon name={condition.icon} size={24} className="text-primary" />
                      </div>
                      <h3 className="font-semibold mb-2">{condition.title}</h3>
                      <p className="text-sm text-gray-600">{condition.description}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* Exclusions */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center text-red-600">
                    <Icon name="AlertTriangle" size={20} className="mr-2" />
                    Что НЕ покрывается гарантией
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {exclusions.map((exclusion, index) => (
                      <div key={index} className="flex items-start space-x-2">
                        <Icon name="X" size={16} className="text-red-600 mt-0.5" />
                        <span className="text-sm">{exclusion}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Maintenance Schedule */}
              <Card>
                <CardHeader>
                  <CardTitle>Регламент технического обслуживания</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b">
                          <th className="text-left py-2">Пробег (км)</th>
                          <th className="text-left py-2">Время (мес.)</th>
                          <th className="text-left py-2">Основные работы</th>
                          <th className="text-left py-2">Стоимость</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr className="border-b">
                          <td className="py-2">15,000</td>
                          <td className="py-2">12</td>
                          <td className="py-2">Замена масла, фильтров, диагностика</td>
                          <td className="py-2">от 8,500 ₽</td>
                        </tr>
                        <tr className="border-b">
                          <td className="py-2">30,000</td>
                          <td className="py-2">24</td>
                          <td className="py-2">ТО-2, замена свечей, проверка тормозов</td>
                          <td className="py-2">от 12,500 ₽</td>
                        </tr>
                        <tr className="border-b">
                          <td className="py-2">45,000</td>
                          <td className="py-2">36</td>
                          <td className="py-2">ТО-3, замена жидкостей, ремня ГРМ</td>
                          <td className="py-2">от 15,500 ₽</td>
                        </tr>
                        <tr>
                          <td className="py-2">60,000</td>
                          <td className="py-2">48</td>
                          <td className="py-2">Большое ТО, замена амортизаторов</td>
                          <td className="py-2">от 25,000 ₽</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="process">
            <div className="space-y-8">
              {/* Warranty Process */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {warrantyProcess.map((step, index) => (
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

              {/* Contact Information */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Контакты гарантийного отдела</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center space-x-3">
                        <Icon name="Phone" size={20} className="text-primary" />
                        <div>
                          <div className="font-medium">Горячая линия</div>
                          <div className="text-sm text-gray-600">+7 (495) 123-45-68</div>
                          <div className="text-xs text-gray-500">Пн-Пт: 8:00-20:00, Сб: 9:00-18:00</div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-3">
                        <Icon name="Mail" size={20} className="text-primary" />
                        <div>
                          <div className="font-medium">Email</div>
                          <div className="text-sm text-gray-600">warranty@autopremium.ru</div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-3">
                        <Icon name="MapPin" size={20} className="text-primary" />
                        <div>
                          <div className="font-medium">Адрес</div>
                          <div className="text-sm text-gray-600">Москва, ул. Примерная, 123</div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Необходимые документы</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {[
                        'Гарантийный талон',
                        'Сервисная книжка с отметками о ТО',
                        'Документы на автомобиль (ПТС/СТС)',
                        'Паспорт владельца',
                        'Документы о последнем ТО',
                        'Описание неисправности'
                      ].map((doc, index) => (
                        <div key={index} className="flex items-center space-x-2">
                          <Icon name="FileText" size={16} className="text-primary" />
                          <span className="text-sm">{doc}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* FAQ */}
              <Card>
                <CardHeader>
                  <CardTitle>Часто задаваемые вопросы</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {faqItems.map((faq, index) => (
                      <div key={index} className="border-b pb-4 last:border-b-0">
                        <div className="font-medium mb-2">{faq.question}</div>
                        <div className="text-sm text-gray-600">{faq.answer}</div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="check">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Warranty Check */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Icon name="Search" size={20} className="mr-2" />
                    Проверка гарантии
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm font-medium mb-2 block">
                        Номер гарантийного талона или VIN
                      </label>
                      <Input
                        value={warrantyNumber}
                        onChange={(e) => setWarrantyNumber(e.target.value)}
                        placeholder="Введите номер или VIN"
                      />
                    </div>
                    <Button className="w-full bg-primary hover:bg-primary/90">
                      <Icon name="Search" size={16} className="mr-2" />
                      Проверить гарантию
                    </Button>
                    
                    {warrantyNumber && (
                      <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg">
                        <div className="flex items-center space-x-2 mb-3">
                          <Icon name="CheckCircle" size={20} className="text-green-600" />
                          <span className="font-medium text-green-800">Гарантия действительна</span>
                        </div>
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span>Модель:</span>
                            <span className="font-medium">BMW 3 Series</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Дата покупки:</span>
                            <span className="font-medium">15.03.2024</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Действует до:</span>
                            <span className="font-medium">15.03.2027</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Пробег:</span>
                            <span className="font-medium">8,500 км</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Последнее ТО:</span>
                            <span className="font-medium">10.01.2025</span>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Warranty Registration */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Icon name="FileText" size={20} className="mr-2" />
                    Регистрация гарантии
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <p className="text-sm text-gray-600 mb-4">
                      Зарегистрируйте свой автомобиль для активации расширенной гарантии
                    </p>
                    
                    <div className="space-y-3">
                      <Input placeholder="VIN номер автомобиля" />
                      <Input placeholder="Ваше имя" />
                      <Input placeholder="Телефон" />
                      <Input placeholder="Email" />
                      <Input type="date" placeholder="Дата покупки" />
                    </div>
                    
                    <Button className="w-full bg-primary hover:bg-primary/90">
                      <Icon name="FileText" size={16} className="mr-2" />
                      Зарегистрировать гарантию
                    </Button>
                    
                    <div className="text-xs text-gray-500">
                      Регистрация гарантии позволяет получить расширенное покрытие и 
                      дополнительные сервисы
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Warranty Statistics */}
            <Card className="mt-8">
              <CardHeader>
                <CardTitle>Статистика гарантийного обслуживания</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-primary mb-2">98%</div>
                    <div className="text-sm text-gray-600">Удовлетворенность клиентов</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-primary mb-2">24ч</div>
                    <div className="text-sm text-gray-600">Среднее время ремонта</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-primary mb-2">99.5%</div>
                    <div className="text-sm text-gray-600">Успешных ремонтов</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-primary mb-2">5,000+</div>
                    <div className="text-sm text-gray-600">Гарантийных случаев в год</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Warranty;