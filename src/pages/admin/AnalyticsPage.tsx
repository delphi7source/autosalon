import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { apiClient } from '@/lib/api';
import { toast } from '@/hooks/use-toast';
import Icon from '@/components/ui/icon';

const AnalyticsPage: React.FC = () => {
  const [period, setPeriod] = useState('month');
  const [isLoading, setIsLoading] = useState(true);
  const [analytics, setAnalytics] = useState({
    sales: {
      total: 0,
      growth: 0,
      byMonth: [],
      byBrand: []
    },
    users: {
      total: 0,
      new: 0,
      active: 0,
      byRole: []
    },
    appointments: {
      total: 0,
      completed: 0,
      cancelled: 0,
      byType: []
    },
    revenue: {
      total: 0,
      growth: 0,
      byService: []
    }
  });

  useEffect(() => {
    fetchAnalytics();
  }, [period]);

  const fetchAnalytics = async () => {
    try {
      setIsLoading(true);
      // Симуляция данных аналитики
      setAnalytics({
        sales: {
          total: 156,
          growth: 12.5,
          byMonth: [
            { month: 'Янв', value: 12 },
            { month: 'Фев', value: 18 },
            { month: 'Мар', value: 15 },
            { month: 'Апр', value: 22 },
            { month: 'Май', value: 28 },
            { month: 'Июн', value: 35 }
          ],
          byBrand: [
            { brand: 'BMW', count: 45, percentage: 28.8 },
            { brand: 'Audi', count: 38, percentage: 24.4 },
            { brand: 'Mercedes', count: 42, percentage: 26.9 },
            { brand: 'Другие', count: 31, percentage: 19.9 }
          ]
        },
        users: {
          total: 1247,
          new: 89,
          active: 892,
          byRole: [
            { role: 'Клиенты', count: 1198 },
            { role: 'Менеджеры', count: 35 },
            { role: 'Администраторы', count: 14 }
          ]
        },
        appointments: {
          total: 324,
          completed: 278,
          cancelled: 46,
          byType: [
            { type: 'Тест-драйв', count: 156 },
            { type: 'Сервис', count: 98 },
            { type: 'Консультация', count: 70 }
          ]
        },
        revenue: {
          total: 45600000,
          growth: 18.3,
          byService: [
            { service: 'Продажи', amount: 38400000 },
            { service: 'Сервис', amount: 4200000 },
            { service: 'Страхование', amount: 2100000 },
            { service: 'Trade-in', amount: 900000 }
          ]
        }
      });
    } catch (error) {
      toast({
        title: 'Ошибка',
        description: 'Не удалось загрузить аналитику',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('ru-RU', {
      style: 'currency',
      currency: 'RUB',
      minimumFractionDigits: 0
    }).format(amount);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Icon name="Loader2" size={32} className="animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Аналитика</h1>
          <p className="text-muted-foreground">Детальная аналитика бизнес-показателей</p>
        </div>
        <div className="flex items-center space-x-2">
          <Select value={period} onValueChange={setPeriod}>
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="week">Неделя</SelectItem>
              <SelectItem value="month">Месяц</SelectItem>
              <SelectItem value="quarter">Квартал</SelectItem>
              <SelectItem value="year">Год</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline">
            <Icon name="Download" size={16} className="mr-2" />
            Экспорт
          </Button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Продажи</p>
                <p className="text-2xl font-bold">{analytics.sales.total}</p>
                <div className="flex items-center text-sm">
                  <Icon name="TrendingUp" size={14} className="text-green-600 mr-1" />
                  <span className="text-green-600">+{analytics.sales.growth}%</span>
                </div>
              </div>
              <div className="p-3 rounded-full bg-blue-100">
                <Icon name="ShoppingCart" size={24} className="text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Выручка</p>
                <p className="text-2xl font-bold">{formatCurrency(analytics.revenue.total)}</p>
                <div className="flex items-center text-sm">
                  <Icon name="TrendingUp" size={14} className="text-green-600 mr-1" />
                  <span className="text-green-600">+{analytics.revenue.growth}%</span>
                </div>
              </div>
              <div className="p-3 rounded-full bg-green-100">
                <Icon name="DollarSign" size={24} className="text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Пользователи</p>
                <p className="text-2xl font-bold">{analytics.users.total}</p>
                <div className="flex items-center text-sm">
                  <span className="text-muted-foreground">Новых: </span>
                  <span className="text-blue-600 ml-1">+{analytics.users.new}</span>
                </div>
              </div>
              <div className="p-3 rounded-full bg-purple-100">
                <Icon name="Users" size={24} className="text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Записи</p>
                <p className="text-2xl font-bold">{analytics.appointments.total}</p>
                <div className="flex items-center text-sm">
                  <span className="text-muted-foreground">Завершено: </span>
                  <span className="text-green-600 ml-1">{analytics.appointments.completed}</span>
                </div>
              </div>
              <div className="p-3 rounded-full bg-orange-100">
                <Icon name="Calendar" size={24} className="text-orange-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="sales" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="sales">Продажи</TabsTrigger>
          <TabsTrigger value="users">Пользователи</TabsTrigger>
          <TabsTrigger value="appointments">Записи</TabsTrigger>
          <TabsTrigger value="revenue">Выручка</TabsTrigger>
        </TabsList>

        <TabsContent value="sales" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Продажи по месяцам</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {analytics.sales.byMonth.map((item, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <span className="text-sm font-medium">{item.month}</span>
                      <div className="flex items-center space-x-2">
                        <div className="w-24 bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-blue-600 h-2 rounded-full" 
                            style={{ width: `${(item.value / 35) * 100}%` }}
                          ></div>
                        </div>
                        <span className="text-sm font-bold">{item.value}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Продажи по брендам</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {analytics.sales.byBrand.map((item, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <span className="text-sm font-medium">{item.brand}</span>
                      <div className="flex items-center space-x-2">
                        <Badge variant="outline">{item.percentage}%</Badge>
                        <span className="text-sm font-bold">{item.count}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="users" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Статистика пользователей</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span>Всего пользователей</span>
                    <span className="font-bold">{analytics.users.total}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Новых за период</span>
                    <span className="font-bold text-green-600">+{analytics.users.new}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Активных</span>
                    <span className="font-bold text-blue-600">{analytics.users.active}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Пользователи по ролям</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {analytics.users.byRole.map((item, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <span className="text-sm font-medium">{item.role}</span>
                      <span className="text-sm font-bold">{item.count}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="appointments" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Статистика записей</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span>Всего записей</span>
                    <span className="font-bold">{analytics.appointments.total}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Завершено</span>
                    <span className="font-bold text-green-600">{analytics.appointments.completed}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Отменено</span>
                    <span className="font-bold text-red-600">{analytics.appointments.cancelled}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Записи по типам</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {analytics.appointments.byType.map((item, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <span className="text-sm font-medium">{item.type}</span>
                      <span className="text-sm font-bold">{item.count}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="revenue" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Выручка по услугам</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {analytics.revenue.byService.map((item, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <span className="text-sm font-medium">{item.service}</span>
                      <span className="text-sm font-bold">{formatCurrency(item.amount)}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Финансовые показатели</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span>Общая выручка</span>
                    <span className="font-bold">{formatCurrency(analytics.revenue.total)}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Рост</span>
                    <span className="font-bold text-green-600">+{analytics.revenue.growth}%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Средний чек</span>
                    <span className="font-bold">{formatCurrency(analytics.revenue.total / analytics.sales.total)}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AnalyticsPage;