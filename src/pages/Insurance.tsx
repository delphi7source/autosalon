import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Slider } from '@/components/ui/slider';
import { apiClient } from '@/lib/api';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from '@/hooks/use-toast';
import Icon from '@/components/ui/icon';

const Insurance = () => {
  const [insuranceType, setInsuranceType] = useState('kasko');
  const [carValue, setCarValue] = useState([3000000]);
  const [driverAge, setDriverAge] = useState([30]);
  const [driverExperience, setDriverExperience] = useState([5]);
  const [selectedOptions, setSelectedOptions] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    carModel: '',
    year: '',
    vin: ''
  });

  const { user } = useAuth();

  const insuranceCompanies = [
    {
      name: 'Росгосстрах',
      logo: '/placeholder.svg',
      kaskoPrice: 85000,
      osagoPrice: 4500,
      rating: 4.8,
      features: ['Быстрые выплаты', 'Широкая сеть партнеров', 'Онлайн оформление']
    },
    {
      name: 'СОГАЗ',
      logo: '/placeholder.svg',
      kaskoPrice: 82000,
      osagoPrice: 4200,
      rating: 4.7,
      features: ['Без справок', 'Скидки за безаварийность', 'Эвакуатор 24/7']
    },
    {
      name: 'Ингосстрах',
      logo: '/placeholder.svg',
      kaskoPrice: 88000,
      osagoPrice: 4800,
      rating: 4.6,
      features: ['Европротокол', 'Замещающий автомобиль', 'Техпомощь на дороге']
    },
    {
      name: 'АльфаСтрахование',
      logo: '/placeholder.svg',
      kaskoPrice: 79000,
      osagoPrice: 4100,
      rating: 4.9,
      features: ['Мобильное приложение', 'Урегулирование без справок', 'Бонусная программа']
    }
  ];

  const kaskoOptions = [
    { id: 'theft', name: 'Угон', price: 15000, description: 'Защита от угона и хищения' },
    { id: 'fire', name: 'Пожар', price: 8000, description: 'Ущерб от пожара и взрыва' },
    { id: 'natural', name: 'Стихийные бедствия', price: 12000, description: 'Град, наводнение, ураган' },
    { id: 'vandalism', name: 'Вандализм', price: 6000, description: 'Умышленные повреждения третьими лицами' },
    { id: 'glass', name: 'Стекла', price: 4000, description: 'Повреждение стекол без франшизы' },
    { id: 'evacuation', name: 'Эвакуатор', price: 3000, description: 'Услуги эвакуатора 24/7' }
  ];

  const calculateKaskoPrice = () => {
    const basePrice = carValue[0] * 0.025; // 2.5% от стоимости авто
    const ageCoeff = driverAge[0] < 25 ? 1.3 : driverAge[0] > 50 ? 0.9 : 1.0;
    const expCoeff = driverExperience[0] < 3 ? 1.4 : driverExperience[0] > 10 ? 0.8 : 1.0;
    const optionsPrice = selectedOptions.reduce((sum, optionId) => {
      const option = kaskoOptions.find(opt => opt.id === optionId);
      return sum + (option?.price || 0);
    }, 0);
    
    return Math.round(basePrice * ageCoeff * expCoeff + optionsPrice);
  };

  const calculateOsagoPrice = () => {
    const basePrice = 3500;
    const ageCoeff = driverAge[0] < 25 ? 1.8 : driverAge[0] > 50 ? 0.9 : 1.0;
    const expCoeff = driverExperience[0] < 3 ? 1.8 : driverExperience[0] > 10 ? 0.8 : 1.0;
    
    return Math.round(basePrice * ageCoeff * expCoeff);
  };

  const handleOptionChange = (optionId: string, checked: boolean) => {
    if (checked) {
      setSelectedOptions([...selectedOptions, optionId]);
    } else {
      setSelectedOptions(selectedOptions.filter(id => id !== optionId));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    setIsSubmitting(true);
    
    try {
      const insuranceData = {
        userId: user?._id || 'guest',
        type: insuranceType as 'kasko' | 'osago',
        insuranceCompany: 'AutoPremium Partner',
        premium: insuranceType === 'kasko' ? calculateKaskoPrice() : calculateOsagoPrice(),
        coverage: insuranceType === 'kasko' ? carValue[0] : 400000,
        startDate: new Date().toISOString(),
        endDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(),
        status: 'active' as const
      };
      
      if (user) {
        const response = await apiClient.createInsurance(insuranceData);
        if (response.success) {
          toast({
            title: 'Заявка создана',
            description: `Ваша заявка на ${insuranceType === 'kasko' ? 'КАСКО' : 'ОСАГО'} принята. Полис №${response.data?.policyNumber}`,
          });
          setFormData({
            name: '',
            phone: '',
            email: '',
            carModel: '',
            year: '',
            vin: ''
          });
        }
      } else {
        toast({
          title: 'Заявка отправлена',
          description: 'Мы подготовим для вас лучшие предложения по страхованию. Для оформления полиса рекомендуем зарегистрироваться.',
        });
      }
    } catch (error) {
      toast({
        title: 'Ошибка',
        description: 'Не удалось отправить заявку. Попробуйте еще раз.',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatPrice = (price: number) => {
    return price.toLocaleString('ru-RU');
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <section className="bg-secondary text-white py-12">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl font-bold mb-4">Страхование автомобилей</h1>
          <p className="text-xl opacity-90">КАСКО и ОСАГО на выгодных условиях от ведущих страховых компаний</p>
        </div>
      </section>

      <div className="container mx-auto px-4 py-8">
        <Tabs value={insuranceType} onValueChange={setInsuranceType} className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-8">
            <TabsTrigger value="kasko">КАСКО</TabsTrigger>
            <TabsTrigger value="osago">ОСАГО</TabsTrigger>
          </TabsList>

          <TabsContent value="kasko">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Calculator */}
              <div className="lg:col-span-2">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Icon name="Calculator" size={20} className="mr-2" />
                      Калькулятор КАСКО
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div>
                      <label className="text-sm font-medium mb-2 block">
                        Стоимость автомобиля: {formatPrice(carValue[0])} ₽
                      </label>
                      <Slider
                        value={carValue}
                        onValueChange={setCarValue}
                        max={10000000}
                        min={500000}
                        step={100000}
                        className="mt-2"
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm font-medium mb-2 block">
                          Возраст водителя: {driverAge[0]} лет
                        </label>
                        <Slider
                          value={driverAge}
                          onValueChange={setDriverAge}
                          max={70}
                          min={18}
                          step={1}
                          className="mt-2"
                        />
                      </div>
                      <div>
                        <label className="text-sm font-medium mb-2 block">
                          Стаж вождения: {driverExperience[0]} лет
                        </label>
                        <Slider
                          value={driverExperience}
                          onValueChange={setDriverExperience}
                          max={50}
                          min={0}
                          step={1}
                          className="mt-2"
                        />
                      </div>
                    </div>

                    {/* Options */}
                    <div>
                      <h4 className="font-semibold mb-4">Дополнительные опции:</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {kaskoOptions.map((option) => (
                          <div key={option.id} className="flex items-start space-x-3 p-3 border rounded-lg">
                            <Checkbox
                              id={option.id}
                              checked={selectedOptions.includes(option.id)}
                              onCheckedChange={(checked) => handleOptionChange(option.id, checked as boolean)}
                            />
                            <div className="flex-1">
                              <label htmlFor={option.id} className="font-medium cursor-pointer">
                                {option.name}
                              </label>
                              <p className="text-sm text-gray-600 mt-1">{option.description}</p>
                              <Badge variant="outline" className="mt-2">
                                +{formatPrice(option.price)} ₽
                              </Badge>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Result */}
                    <Card className="bg-primary/5 border-primary/20">
                      <CardContent className="pt-6">
                        <div className="text-center">
                          <div className="text-3xl font-bold text-primary mb-2">
                            {formatPrice(calculateKaskoPrice())} ₽
                          </div>
                          <div className="text-gray-600">Стоимость полиса КАСКО в год</div>
                        </div>
                      </CardContent>
                    </Card>
                  </CardContent>
                </Card>

                {/* Insurance Companies */}
                <Card className="mt-6">
                  <CardHeader>
                    <CardTitle>Предложения страховых компаний</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {insuranceCompanies.map((company, index) => (
                        <div key={index} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                          <div className="flex items-center justify-between mb-3">
                            <div className="flex items-center space-x-3">
                              <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                                <Icon name="Shield" size={20} className="text-primary" />
                              </div>
                              <div>
                                <h4 className="font-semibold">{company.name}</h4>
                                <div className="flex items-center space-x-1">
                                  <Icon name="Star" size={14} className="text-yellow-500 fill-current" />
                                  <span className="text-sm">{company.rating}</span>
                                </div>
                              </div>
                            </div>
                            <div className="text-right">
                              <div className="text-xl font-bold text-primary">
                                {formatPrice(company.kaskoPrice)} ₽
                              </div>
                              <div className="text-sm text-gray-600">КАСКО</div>
                            </div>
                          </div>
                          <div className="flex flex-wrap gap-2 mb-3">
                            {company.features.map((feature, idx) => (
                              <Badge key={idx} variant="secondary" className="text-xs">
                                {feature}
                              </Badge>
                            ))}
                          </div>
                          <Button className="w-full">Оформить полис</Button>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Sidebar */}
              <div>
                <div className="sticky top-4 space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Что покрывает КАСКО</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        {[
                          'ДТП по вашей вине',
                          'ДТП по вине третьих лиц',
                          'Повреждения при парковке',
                          'Падение предметов',
                          'Действия животных',
                          'Противоправные действия третьих лиц'
                        ].map((item, index) => (
                          <div key={index} className="flex items-center space-x-2">
                            <Icon name="Check" size={16} className="text-green-600" />
                            <span className="text-sm">{item}</span>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>Документы для оформления</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2 text-sm">
                        {[
                          'Паспорт владельца',
                          'Водительское удостоверение',
                          'ПТС или СТС',
                          'Диагностическая карта',
                          'Справка о стоимости автомобиля'
                        ].map((doc, index) => (
                          <div key={index} className="flex items-center space-x-2">
                            <Icon name="FileText" size={14} className="text-primary" />
                            <span>{doc}</span>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>Быстрая заявка</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <form onSubmit={handleSubmit} className="space-y-4">
                        <Input
                          placeholder="Ваше имя"
                          value={formData.name}
                          onChange={(e) => setFormData({...formData, name: e.target.value})}
                        />
                        <Input
                          placeholder="Телефон"
                          value={formData.phone}
                          onChange={(e) => setFormData({...formData, phone: e.target.value})}
                        />
                        <Input
                          placeholder="Модель автомобиля"
                          value={formData.carModel}
                          onChange={(e) => setFormData({...formData, carModel: e.target.value})}
                        />
                          disabled={isSubmitting}
                        <Button type="submit" className="w-full bg-primary hover:bg-primary/90">
                          {isSubmitting ? (
                            <>
                              <Icon name="Loader2" size={16} className="mr-2 animate-spin" />
                              Отправка...
                            </>
                          ) : (
                            'Получить предложения'
                          )}
                        </Button>
                      </form>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="osago">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Icon name="Calculator" size={20} className="mr-2" />
                      Калькулятор ОСАГО
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm font-medium mb-2 block">
                          Возраст водителя: {driverAge[0]} лет
                        </label>
                        <Slider
                          value={driverAge}
                          onValueChange={setDriverAge}
                          max={70}
                          min={18}
                          step={1}
                          className="mt-2"
                        />
                      </div>
                      <div>
                        <label className="text-sm font-medium mb-2 block">
                          Стаж вождения: {driverExperience[0]} лет
                        </label>
                        <Slider
                          value={driverExperience}
                          onValueChange={setDriverExperience}
                          max={50}
                          min={0}
                          step={1}
                          className="mt-2"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm font-medium mb-2 block">Регион регистрации</label>
                        <Select>
                          <SelectTrigger>
                            <SelectValue placeholder="Выберите регион" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="moscow">Москва</SelectItem>
                            <SelectItem value="spb">Санкт-Петербург</SelectItem>
                            <SelectItem value="region">Другие регионы</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <label className="text-sm font-medium mb-2 block">Мощность двигателя</label>
                        <Select>
                          <SelectTrigger>
                            <SelectValue placeholder="Выберите мощность" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="50">до 50 л.с.</SelectItem>
                            <SelectItem value="70">50-70 л.с.</SelectItem>
                            <SelectItem value="100">70-100 л.с.</SelectItem>
                            <SelectItem value="120">100-120 л.с.</SelectItem>
                            <SelectItem value="150">120-150 л.с.</SelectItem>
                            <SelectItem value="more">свыше 150 л.с.</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <Card className="bg-primary/5 border-primary/20">
                      <CardContent className="pt-6">
                        <div className="text-center">
                          <div className="text-3xl font-bold text-primary mb-2">
                            {formatPrice(calculateOsagoPrice())} ₽
                          </div>
                          <div className="text-gray-600">Стоимость полиса ОСАГО в год</div>
                        </div>
                      </CardContent>
                    </Card>
                  </CardContent>
                </Card>

                <Card className="mt-6">
                  <CardHeader>
                    <CardTitle>Предложения по ОСАГО</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {insuranceCompanies.map((company, index) => (
                        <div key={index} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                          <div className="flex items-center justify-between mb-3">
                            <div className="flex items-center space-x-3">
                              <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                                <Icon name="Shield" size={20} className="text-primary" />
                              </div>
                              <div>
                                <h4 className="font-semibold">{company.name}</h4>
                                <div className="flex items-center space-x-1">
                                  <Icon name="Star" size={14} className="text-yellow-500 fill-current" />
                                  <span className="text-sm">{company.rating}</span>
                                </div>
                              </div>
                            </div>
                            <div className="text-right">
                              <div className="text-xl font-bold text-primary">
                                {formatPrice(company.osagoPrice)} ₽
                              </div>
                              <div className="text-sm text-gray-600">ОСАГО</div>
                            </div>
                          </div>
                          <Button className="w-full">Оформить полис</Button>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>

              <div>
                <div className="sticky top-4 space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Что покрывает ОСАГО</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        {[
                          'Ущерб автомобилю потерпевшего',
                          'Вред здоровью потерпевшего',
                          'Моральный вред',
                          'Утрата товарной стоимости',
                          'Расходы на лечение',
                          'Упущенная выгода'
                        ].map((item, index) => (
                          <div key={index} className="flex items-center space-x-2">
                            <Icon name="Check" size={16} className="text-green-600" />
                            <span className="text-sm">{item}</span>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>Лимиты выплат ОСАГО</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3 text-sm">
                        <div className="flex justify-between">
                          <span>Ущерб имуществу:</span>
                          <span className="font-medium">400 000 ₽</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Вред здоровью:</span>
                          <span className="font-medium">500 000 ₽</span>
                        </div>
                        <div className="flex justify-between">
                          <span>На одного потерпевшего:</span>
                          <span className="font-medium">500 000 ₽</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>Преимущества ОСАГО</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        {[
                          'Обязательное для всех водителей',
                          'Защита от финансовых рисков',
                          'Единые тарифы по всей России',
                          'Возможность прямого возмещения',
                          'Европротокол до 400 000 ₽'
                        ].map((item, index) => (
                          <div key={index} className="flex items-center space-x-2">
                            <Icon name="Check" size={16} className="text-green-600" />
                            <span className="text-sm">{item}</span>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Insurance;