import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Slider } from '@/components/ui/slider';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from '@/hooks/use-toast';
import Icon from '@/components/ui/icon';

const Financing = () => {
  const [loanAmount, setLoanAmount] = useState([2000000]);
  const [downPayment, setDownPayment] = useState([500000]);
  const [loanTerm, setLoanTerm] = useState([36]);
  const [interestRate, setInterestRate] = useState(12.5);
  const [selectedBank, setSelectedBank] = useState('');

  const banks = [
    {
      name: 'Сбербанк',
      rate: 12.5,
      minRate: 11.5,
      maxAmount: 5000000,
      features: ['Быстрое одобрение', 'Без справок о доходах', 'Досрочное погашение без комиссии']
    },
    {
      name: 'ВТБ',
      rate: 13.0,
      minRate: 12.0,
      maxAmount: 4000000,
      features: ['Льготные условия', 'Онлайн заявка', 'Гибкий график платежей']
    },
    {
      name: 'Альфа-Банк',
      rate: 12.8,
      minRate: 11.8,
      maxAmount: 6000000,
      features: ['Индивидуальные условия', 'Быстрое решение', 'Без скрытых комиссий']
    },
    {
      name: 'Тинькофф',
      rate: 13.5,
      minRate: 12.5,
      maxAmount: 3000000,
      features: ['100% онлайн', 'Решение за 2 минуты', 'Без посещения офиса']
    }
  ];

  const calculateMonthlyPayment = () => {
    const principal = loanAmount[0] - downPayment[0];
    const monthlyRate = interestRate / 100 / 12;
    const numPayments = loanTerm[0];
    
    if (monthlyRate === 0) {
      return principal / numPayments;
    }
    
    const monthlyPayment = principal * (monthlyRate * Math.pow(1 + monthlyRate, numPayments)) / 
                          (Math.pow(1 + monthlyRate, numPayments) - 1);
    
    return monthlyPayment;
  };

  const monthlyPayment = calculateMonthlyPayment();
  const totalAmount = monthlyPayment * loanTerm[0];
  const overpayment = totalAmount - (loanAmount[0] - downPayment[0]);

  const formatPrice = (price: number) => {
    return Math.round(price).toLocaleString('ru-RU');
  };

  const LeasingCalculator = () => {
    const [leasingAmount, setLeasingAmount] = useState([2000000]);
    const [leasingDownPayment, setLeasingDownPayment] = useState([600000]);
    const [leasingTerm, setLeasingTerm] = useState([36]);
    const [residualValue, setResidualValue] = useState([400000]);

    const monthlyLeasingPayment = (leasingAmount[0] - leasingDownPayment[0] - residualValue[0]) / leasingTerm[0];

    return (
      <div className="space-y-6">
        <div>
          <label className="text-sm font-medium mb-2 block">
            Стоимость автомобиля: {formatPrice(leasingAmount[0])} ₽
          </label>
          <Slider
            value={leasingAmount}
            onValueChange={setLeasingAmount}
            max={10000000}
            min={500000}
            step={50000}
            className="mt-2"
          />
        </div>

        <div>
          <label className="text-sm font-medium mb-2 block">
            Первоначальный взнос: {formatPrice(leasingDownPayment[0])} ₽
          </label>
          <Slider
            value={leasingDownPayment}
            onValueChange={setLeasingDownPayment}
            max={leasingAmount[0] * 0.5}
            min={leasingAmount[0] * 0.1}
            step={25000}
            className="mt-2"
          />
        </div>

        <div>
          <label className="text-sm font-medium mb-2 block">
            Срок лизинга: {leasingTerm[0]} месяцев
          </label>
          <Slider
            value={leasingTerm}
            onValueChange={setLeasingTerm}
            max={60}
            min={12}
            step={6}
            className="mt-2"
          />
        </div>

        <div>
          <label className="text-sm font-medium mb-2 block">
            Остаточная стоимость: {formatPrice(residualValue[0])} ₽
          </label>
          <Slider
            value={residualValue}
            onValueChange={setResidualValue}
            max={leasingAmount[0] * 0.5}
            min={leasingAmount[0] * 0.1}
            step={25000}
            className="mt-2"
          />
        </div>

        <Card className="bg-primary/5 border-primary/20">
          <CardContent className="pt-6">
            <div className="grid grid-cols-2 gap-4 text-center">
              <div>
                <div className="text-2xl font-bold text-primary">{formatPrice(monthlyLeasingPayment)} ₽</div>
                <div className="text-sm text-gray-600">Ежемесячный платеж</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-secondary">{formatPrice(monthlyLeasingPayment * leasingTerm[0])} ₽</div>
                <div className="text-sm text-gray-600">Общая сумма платежей</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="space-y-3">
          <h4 className="font-semibold">Преимущества лизинга:</h4>
          <div className="space-y-2">
            {[
              'Возможность получить автомобиль с минимальным первоначальным взносом',
              'Налоговые льготы для юридических лиц',
              'Возможность выкупа автомобиля по остаточной стоимости',
              'Включение расходов на обслуживание в лизинговые платежи'
            ].map((benefit, index) => (
              <div key={index} className="flex items-start space-x-2">
                <Icon name="Check" size={16} className="text-green-600 mt-0.5" />
                <span className="text-sm">{benefit}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <section className="bg-secondary text-white py-12">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl font-bold mb-4">Кредит и лизинг</h1>
          <p className="text-xl opacity-90">Выгодные условия финансирования для покупки автомобиля</p>
        </div>
      </section>

      <div className="container mx-auto px-4 py-8">
        <Tabs defaultValue="credit" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-8">
            <TabsTrigger value="credit">Автокредит</TabsTrigger>
            <TabsTrigger value="leasing">Лизинг</TabsTrigger>
          </TabsList>

          <TabsContent value="credit">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Calculator */}
              <div className="lg:col-span-2">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Icon name="Calculator" size={20} className="mr-2" />
                      Кредитный калькулятор
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div>
                      <label className="text-sm font-medium mb-2 block">
                        Стоимость автомобиля: {formatPrice(loanAmount[0])} ₽
                      </label>
                      <Slider
                        value={loanAmount}
                        onValueChange={setLoanAmount}
                        max={10000000}
                        min={500000}
                        step={50000}
                        className="mt-2"
                      />
                    </div>

                    <div>
                      <label className="text-sm font-medium mb-2 block">
                        Первоначальный взнос: {formatPrice(downPayment[0])} ₽ ({Math.round(downPayment[0] / loanAmount[0] * 100)}%)
                      </label>
                      <Slider
                        value={downPayment}
                        onValueChange={setDownPayment}
                        max={loanAmount[0] * 0.8}
                        min={loanAmount[0] * 0.1}
                        step={25000}
                        className="mt-2"
                      />
                    </div>

                    <div>
                      <label className="text-sm font-medium mb-2 block">
                        Срок кредита: {loanTerm[0]} месяцев ({Math.round(loanTerm[0] / 12 * 10) / 10} лет)
                      </label>
                      <Slider
                        value={loanTerm}
                        onValueChange={setLoanTerm}
                        max={84}
                        min={12}
                        step={6}
                        className="mt-2"
                      />
                    </div>

                    <div>
                      <label className="text-sm font-medium mb-2 block">
                        Процентная ставка: {interestRate}% годовых
                      </label>
                      <Select value={selectedBank} onValueChange={(value) => {
                        setSelectedBank(value);
                        const bank = banks.find(b => b.name === value);
                        if (bank) setInterestRate(bank.rate);
                      }}>
                        <SelectTrigger>
                          <SelectValue placeholder="Выберите банк" />
                        </SelectTrigger>
                        <SelectContent>
                          {banks.map(bank => (
                            <SelectItem key={bank.name} value={bank.name}>
                              {bank.name} - от {bank.minRate}%
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Results */}
                    <Card className="bg-primary/5 border-primary/20">
                      <CardContent className="pt-6">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
                          <div>
                            <div className="text-2xl font-bold text-primary">{formatPrice(monthlyPayment)} ₽</div>
                            <div className="text-sm text-gray-600">Ежемесячный платеж</div>
                          </div>
                          <div>
                            <div className="text-2xl font-bold text-secondary">{formatPrice(totalAmount)} ₽</div>
                            <div className="text-sm text-gray-600">Общая сумма</div>
                          </div>
                          <div>
                            <div className="text-2xl font-bold text-orange-600">{formatPrice(overpayment)} ₽</div>
                            <div className="text-sm text-gray-600">Переплата</div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    <Button className="w-full bg-primary hover:bg-primary/90" size="lg">
                      <Icon name="FileText" size={16} className="mr-2" />
                      <span onClick={() => toast({
                        title: 'Заявка отправлена',
                        description: 'Мы свяжемся с вами для оформления кредита',
                      })}>Подать заявку на кредит</span>
                    </Button>
                  </CardContent>
                </Card>
              </div>

              {/* Banks */}
              <div>
                <Card>
                  <CardHeader>
                    <CardTitle>Банки-партнеры</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {banks.map((bank, index) => (
                      <div 
                        key={index} 
                        className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                          selectedBank === bank.name ? 'border-primary bg-primary/5' : 'border-gray-200 hover:border-gray-300'
                        }`}
                        onClick={() => {
                          setSelectedBank(bank.name);
                          setInterestRate(bank.rate);
                        }}
                      >
                        <div className="flex justify-between items-start mb-2">
                          <h4 className="font-semibold">{bank.name}</h4>
                          <Badge variant="outline">от {bank.minRate}%</Badge>
                        </div>
                        <div className="text-sm text-gray-600 mb-2">
                          Макс. сумма: {formatPrice(bank.maxAmount)} ₽
                        </div>
                        <div className="space-y-1">
                          {bank.features.slice(0, 2).map((feature, idx) => (
                            <div key={idx} className="flex items-center space-x-1">
                              <Icon name="Check" size={12} className="text-green-600" />
                              <span className="text-xs text-gray-600">{feature}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </CardContent>
                </Card>

                <Card className="mt-6">
                  <CardHeader>
                    <CardTitle className="text-lg">Документы для кредита</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2 text-sm">
                      {[
                        'Паспорт гражданина РФ',
                        'Водительское удостоверение',
                        'Справка о доходах (2-НДФЛ)',
                        'Трудовая книжка или справка с места работы',
                        'СНИЛС',
                        'Справка из банка о движении средств'
                      ].map((doc, index) => (
                        <div key={index} className="flex items-center space-x-2">
                          <Icon name="FileText" size={14} className="text-primary" />
                          <span>{doc}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="leasing">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Icon name="Calculator" size={20} className="mr-2" />
                      Лизинговый калькулятор
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <LeasingCalculator />
                  </CardContent>
                </Card>
              </div>

              <div>
                <Card>
                  <CardHeader>
                    <CardTitle>Лизинговые компании</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {[
                      { name: 'Сбербанк Лизинг', rate: '8.5%', features: ['Быстрое оформление', 'Гибкие условия'] },
                      { name: 'ВЭБ Лизинг', rate: '9.0%', features: ['Льготные программы', 'Без залога'] },
                      { name: 'Европлан', rate: '8.8%', features: ['Полный сервис', 'Страхование включено'] }
                    ].map((company, index) => (
                      <div key={index} className="p-4 border rounded-lg">
                        <div className="flex justify-between items-start mb-2">
                          <h4 className="font-semibold">{company.name}</h4>
                          <Badge variant="outline">от {company.rate}</Badge>
                        </div>
                        <div className="space-y-1">
                          {company.features.map((feature, idx) => (
                            <div key={idx} className="flex items-center space-x-1">
                              <Icon name="Check" size={12} className="text-green-600" />
                              <span className="text-xs text-gray-600">{feature}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </CardContent>
                </Card>

                <Card className="mt-6">
                  <CardHeader>
                    <CardTitle className="text-lg">Кредит vs Лизинг</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4 text-sm">
                      <div>
                        <h5 className="font-medium text-green-600 mb-1">Преимущества лизинга:</h5>
                        <ul className="space-y-1 text-gray-600">
                          <li>• Меньший первоначальный взнос</li>
                          <li>• Налоговые льготы</li>
                          <li>• Включение сервиса</li>
                        </ul>
                      </div>
                      <div>
                        <h5 className="font-medium text-blue-600 mb-1">Преимущества кредита:</h5>
                        <ul className="space-y-1 text-gray-600">
                          <li>• Автомобиль сразу в собственности</li>
                          <li>• Возможность продажи</li>
                          <li>• Нет ограничений по пробегу</li>
                        </ul>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Financing;