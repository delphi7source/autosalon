import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { apiClient } from '@/lib/api';
import Icon from '@/components/ui/icon';

const AdminDashboard: React.FC = () => {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalCars: 0,
    totalOrders: 0,
    totalAppointments: 0,
    recentOrders: [],
    recentAppointments: []
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [usersRes, carsRes, ordersRes, appointmentsRes] = await Promise.all([
          apiClient.getUsers(),
          apiClient.getCars(),
          apiClient.getOrders(),
          apiClient.getAppointments()
        ]);

        setStats({
          totalUsers: usersRes.data?.length || 0,
          totalCars: carsRes.data?.length || 0,
          totalOrders: ordersRes.data?.length || 0,
          totalAppointments: appointmentsRes.data?.length || 0,
          recentOrders: ordersRes.data?.slice(0, 5) || [],
          recentAppointments: appointmentsRes.data?.slice(0, 5) || []
        });
      } catch (error) {
        console.error('Error fetching stats:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchStats();
  }, []);

  const statCards = [
    {
      title: 'Пользователи',
      value: stats.totalUsers,
      icon: 'Users',
      color: 'text-blue-600',
      bgColor: 'bg-blue-100'
    },
    {
      title: 'Автомобили',
      value: stats.totalCars,
      icon: 'Car',
      color: 'text-green-600',
      bgColor: 'bg-green-100'
    },
    {
      title: 'Заказы',
      value: stats.totalOrders,
      icon: 'ShoppingCart',
      color: 'text-orange-600',
      bgColor: 'bg-orange-100'
    },
    {
      title: 'Записи',
      value: stats.totalAppointments,
      icon: 'Calendar',
      color: 'text-purple-600',
      bgColor: 'bg-purple-100'
    }
  ];

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Icon name="Loader2" size={32} className="animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Панель управления</h1>
        <p className="text-muted-foreground">Обзор основных показателей системы</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat, index) => (
          <Card key={index}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    {stat.title}
                  </p>
                  <p className="text-2xl font-bold">{stat.value}</p>
                </div>
                <div className={`p-3 rounded-full ${stat.bgColor}`}>
                  <Icon name={stat.icon} size={24} className={stat.color} />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Orders */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Icon name="ShoppingCart" size={20} className="mr-2" />
              Последние заказы
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {stats.recentOrders.length === 0 ? (
                <p className="text-muted-foreground text-center py-4">
                  Заказов пока нет
                </p>
              ) : (
                stats.recentOrders.map((order: any, index) => (
                  <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <div className="font-medium">{order.orderNumber}</div>
                      <div className="text-sm text-muted-foreground">
                        {new Date(order.createdAt).toLocaleDateString('ru-RU')}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-medium">
                        {order.totalAmount?.toLocaleString('ru-RU')} ₽
                      </div>
                      <Badge variant={
                        order.status === 'completed' ? 'default' :
                        order.status === 'confirmed' ? 'secondary' :
                        order.status === 'cancelled' ? 'destructive' : 'outline'
                      }>
                        {order.status === 'pending' ? 'Ожидает' :
                         order.status === 'confirmed' ? 'Подтвержден' :
                         order.status === 'completed' ? 'Завершен' : 'Отменен'}
                      </Badge>
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>

        {/* Recent Appointments */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Icon name="Calendar" size={20} className="mr-2" />
              Последние записи
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {stats.recentAppointments.length === 0 ? (
                <p className="text-muted-foreground text-center py-4">
                  Записей пока нет
                </p>
              ) : (
                stats.recentAppointments.map((appointment: any, index) => (
                  <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <div className="font-medium">
                        {appointment.type === 'test-drive' ? 'Тест-драйв' :
                         appointment.type === 'service' ? 'Сервис' : 'Консультация'}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {new Date(appointment.appointmentDate).toLocaleDateString('ru-RU')} в {appointment.appointmentTime}
                      </div>
                    </div>
                    <Badge variant={
                      appointment.status === 'completed' ? 'default' :
                      appointment.status === 'confirmed' ? 'secondary' :
                      appointment.status === 'cancelled' ? 'destructive' : 'outline'
                    }>
                      {appointment.status === 'scheduled' ? 'Запланирована' :
                       appointment.status === 'confirmed' ? 'Подтверждена' :
                       appointment.status === 'completed' ? 'Завершена' : 'Отменена'}
                    </Badge>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminDashboard;