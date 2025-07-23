import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuth } from '@/contexts/AuthContext';
import { apiClient, Order, Appointment, TradeIn, Insurance } from '@/lib/api';
import { toast } from '@/hooks/use-toast';
import Icon from '@/components/ui/icon';

const Profile = () => {
  const { user, isAuthenticated } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [tradeIns, setTradeIns] = useState<TradeIn[]>([]);
  const [insurance, setInsurance] = useState<Insurance[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [profileForm, setProfileForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: ''
  });

  useEffect(() => {
    if (user) {
      setProfileForm({
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        phone: user.phone
      });
    }
  }, [user]);

  useEffect(() => {
    const fetchUserData = async () => {
      if (!user) return;
      
      try {
        setIsLoading(true);
        const [ordersRes, appointmentsRes, tradeInsRes, insuranceRes] = await Promise.all([
          apiClient.getOrders(),
          apiClient.getAppointments(),
          apiClient.getTradeIns(),
          apiClient.getInsurance()
        ]);

        // Фильтруем данные по текущему пользователю
        if (ordersRes.success && ordersRes.data) {
          setOrders(ordersRes.data.filter(order => order.userId === user._id));
        }
        if (appointmentsRes.success && appointmentsRes.data) {
          setAppointments(appointmentsRes.data.filter(appointment => appointment.userId === user._id));
        }
        if (tradeInsRes.success && tradeInsRes.data) {
          setTradeIns(tradeInsRes.data.filter(tradeIn => tradeIn.userId === user._id));
        }
        if (insuranceRes.success && insuranceRes.data) {
          setInsurance(insuranceRes.data.filter(ins => ins.userId === user._id));
        }
      } catch (error) {
        toast({
          title: 'Ошибка',
          description: 'Не удалось загрузить данные профиля',
          variant: 'destructive',
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserData();
  }, [user]);

  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    try {
      const response = await apiClient.updateUser(user._id, profileForm);
      if (response.success) {
        toast({
          title: 'Профиль обновлен',
          description: 'Ваши данные успешно сохранены',
        });
      }
    } catch (error) {
      toast({
        title: 'Ошибка',
        description: 'Не удалось обновить профиль',
        variant: 'destructive',
      });
    }
  };

  const getStatusBadge = (status: string, type: 'order' | 'appointment' | 'tradein' | 'insurance') => {
    const variants: Record<string, any> = {
      pending: 'outline',
      scheduled: 'outline',
      confirmed: 'secondary',
      completed: 'default',
      cancelled: 'destructive',
      active: 'default',
      expired: 'destructive',
      evaluated: 'secondary',
      approved: 'default'
    };

    const labels: Record<string, string> = {
      pending: 'Ожидает',
      scheduled: 'Запланирована',
      confirmed: 'Подтверждена',
      completed: 'Завершена',
      cancelled: 'Отменена',
      active: 'Активна',
      expired: 'Истекла',
      evaluated: 'Оценена',
      approved: 'Одобрена'
    };

    return (
      <Badge variant={variants[status] || 'outline'}>
        {labels[status] || status}
      </Badge>
    );
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8">
          <Card>
            <CardContent className="pt-6 text-center">
              <Icon name="User" size={48} className="mx-auto mb-4 text-gray-400" />
              <h2 className="text-2xl font-bold mb-4">Вход в личный кабинет</h2>
              <p className="text-gray-600 mb-6">Для доступа к личному кабинету необходимо войти в систему</p>
              <Button asChild>
                <a href="/login">Войти в систему</a>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <section className="bg-secondary text-white py-12">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl font-bold mb-4">Личный кабинет</h1>
          <p className="text-xl opacity-90">Управление профилем и отслеживание заказов</p>
        </div>
      </section>

      <div className="container mx-auto px-4 py-8">
        <Tabs defaultValue="profile" className="w-full">
          <TabsList className="grid w-full grid-cols-5 mb-8">
            <TabsTrigger value="profile">Профиль</TabsTrigger>
            <TabsTrigger value="orders">Заказы</TabsTrigger>
            <TabsTrigger value="appointments">Записи</TabsTrigger>
            <TabsTrigger value="tradein">Trade-in</TabsTrigger>
            <TabsTrigger value="insurance">Страхование</TabsTrigger>
          </TabsList>

          <TabsContent value="profile">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2">
                <Card>
                  <CardHeader>
                    <CardTitle>Личная информация</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <form onSubmit={handleProfileUpdate} className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="text-sm font-medium mb-1 block">Имя</label>
                          <Input
                            value={profileForm.firstName}
                            onChange={(e) => setProfileForm({...profileForm, firstName: e.target.value})}
                          />
                        </div>
                        <div>
                          <label className="text-sm font-medium mb-1 block">Фамилия</label>
                          <Input
                            value={profileForm.lastName}
                            onChange={(e) => setProfileForm({...profileForm, lastName: e.target.value})}
                          />
                        </div>
                      </div>
                      <div>
                        <label className="text-sm font-medium mb-1 block">Email</label>
                        <Input
                          type="email"
                          value={profileForm.email}
                          onChange={(e) => setProfileForm({...profileForm, email: e.target.value})}
                        />
                      </div>
                      <div>
                        <label className="text-sm font-medium mb-1 block">Телефон</label>
                        <Input
                          value={profileForm.phone}
                          onChange={(e) => setProfileForm({...profileForm, phone: e.target.value})}
                        />
                      </div>
                      <Button type="submit" className="bg-primary hover:bg-primary/90">
                        Сохранить изменения
                      </Button>
                    </form>
                  </CardContent>
                </Card>
              </div>

              <div>
                <Card>
                  <CardHeader>
                    <CardTitle>Информация об аккаунте</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <span className="text-sm text-gray-600">Роль:</span>
                      <div className="font-medium">
                        {user?.role === 'admin' ? 'Администратор' : 
                         user?.role === 'manager' ? 'Менеджер' : 'Клиент'}
                      </div>
                    </div>
                    <div>
                      <span className="text-sm text-gray-600">Дата регистрации:</span>
                      <div className="font-medium">
                        {user?.createdAt ? new Date(user.createdAt).toLocaleDateString('ru-RU') : '-'}
                      </div>
                    </div>
                    <div>
                      <span className="text-sm text-gray-600">Последний вход:</span>
                      <div className="font-medium">
                        {user?.lastLogin ? new Date(user.lastLogin).toLocaleDateString('ru-RU') : '-'}
                      </div>
                    </div>
                    <div>
                      <span className="text-sm text-gray-600">Статус:</span>
                      <div>
                        <Badge variant={user?.isActive ? 'default' : 'destructive'}>
                          {user?.isActive ? 'Активен' : 'Неактивен'}
                        </Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="orders">
            <Card>
              <CardHeader>
                <CardTitle>Мои заказы</CardTitle>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <div className="flex items-center justify-center h-32">
                    <Icon name="Loader2" size={32} className="animate-spin" />
                  </div>
                ) : orders.length === 0 ? (
                  <div className="text-center py-8">
                    <Icon name="ShoppingCart" size={48} className="mx-auto mb-4 text-gray-400" />
                    <p className="text-gray-600">У вас пока нет заказов</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {orders.map((order) => (
                      <div key={order._id} className="border rounded-lg p-4">
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <h4 className="font-semibold">Заказ {order.orderNumber}</h4>
                            <p className="text-sm text-gray-600">
                              {new Date(order.createdAt).toLocaleDateString('ru-RU')}
                            </p>
                          </div>
                          <div className="text-right">
                            <div className="font-bold text-primary">
                              {order.totalAmount?.toLocaleString('ru-RU')} ₽
                            </div>
                            {getStatusBadge(order.status, 'order')}
                          </div>
                        </div>
                        <div className="text-sm text-gray-600">
                          <p>Способ оплаты: {order.paymentMethod === 'cash' ? 'Наличные' : 'Кредит'}</p>
                          {order.deliveryAddress && <p>Адрес доставки: {order.deliveryAddress}</p>}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="appointments">
            <Card>
              <CardHeader>
                <CardTitle>Мои записи</CardTitle>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <div className="flex items-center justify-center h-32">
                    <Icon name="Loader2" size={32} className="animate-spin" />
                  </div>
                ) : appointments.length === 0 ? (
                  <div className="text-center py-8">
                    <Icon name="Calendar" size={48} className="mx-auto mb-4 text-gray-400" />
                    <p className="text-gray-600">У вас пока нет записей</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {appointments.map((appointment) => (
                      <div key={appointment._id} className="border rounded-lg p-4">
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <h4 className="font-semibold">
                              {appointment.type === 'test-drive' ? 'Тест-драйв' :
                               appointment.type === 'service' ? 'Сервис' : 'Консультация'}
                            </h4>
                            <p className="text-sm text-gray-600">
                              {new Date(appointment.appointmentDate).toLocaleDateString('ru-RU')} в {appointment.appointmentTime}
                            </p>
                          </div>
                          {getStatusBadge(appointment.status, 'appointment')}
                        </div>
                        {appointment.notes && (
                          <p className="text-sm text-gray-600 mt-2">{appointment.notes}</p>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="tradein">
            <Card>
              <CardHeader>
                <CardTitle>Trade-in заявки</CardTitle>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <div className="flex items-center justify-center h-32">
                    <Icon name="Loader2" size={32} className="animate-spin" />
                  </div>
                ) : tradeIns.length === 0 ? (
                  <div className="text-center py-8">
                    <Icon name="RefreshCw" size={48} className="mx-auto mb-4 text-gray-400" />
                    <p className="text-gray-600">У вас пока нет заявок Trade-in</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {tradeIns.map((tradeIn) => (
                      <div key={tradeIn._id} className="border rounded-lg p-4">
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <h4 className="font-semibold">
                              {tradeIn.carBrand} {tradeIn.carModel} {tradeIn.carYear}
                            </h4>
                            <p className="text-sm text-gray-600">
                              Заявка {tradeIn.evaluationNumber}
                            </p>
                          </div>
                          <div className="text-right">
                            <div className="font-bold text-primary">
                              {tradeIn.estimatedValue.toLocaleString('ru-RU')} ₽
                            </div>
                            {getStatusBadge(tradeIn.status, 'tradein')}
                          </div>
                        </div>
                        <div className="text-sm text-gray-600">
                          <p>Пробег: {tradeIn.carMileage.toLocaleString('ru-RU')} км</p>
                          <p>Состояние: {tradeIn.carCondition}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="insurance">
            <Card>
              <CardHeader>
                <CardTitle>Мои страховки</CardTitle>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <div className="flex items-center justify-center h-32">
                    <Icon name="Loader2" size={32} className="animate-spin" />
                  </div>
                ) : insurance.length === 0 ? (
                  <div className="text-center py-8">
                    <Icon name="Shield" size={48} className="mx-auto mb-4 text-gray-400" />
                    <p className="text-gray-600">У вас пока нет страховых полисов</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {insurance.map((policy) => (
                      <div key={policy._id} className="border rounded-lg p-4">
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <h4 className="font-semibold">
                              {policy.type === 'kasko' ? 'КАСКО' : 'ОСАГО'}
                            </h4>
                            <p className="text-sm text-gray-600">
                              Полис {policy.policyNumber}
                            </p>
                          </div>
                          <div className="text-right">
                            <div className="font-bold text-primary">
                              {policy.premium.toLocaleString('ru-RU')} ₽
                            </div>
                            {getStatusBadge(policy.status, 'insurance')}
                          </div>
                        </div>
                        <div className="text-sm text-gray-600">
                          <p>Страховая: {policy.insuranceCompany}</p>
                          <p>Покрытие: {policy.coverage.toLocaleString('ru-RU')} ₽</p>
                          <p>Действует до: {new Date(policy.endDate).toLocaleDateString('ru-RU')}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Profile;