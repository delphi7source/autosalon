import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from '@/hooks/use-toast';
import Icon from '@/components/ui/icon';

const NotificationsPage: React.FC = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [notificationForm, setNotificationForm] = useState({
    title: '',
    message: '',
    type: 'info',
    recipients: 'all'
  });

  const notifications = [
    {
      id: 1,
      title: 'Новый заказ #ORD-001',
      message: 'Поступил новый заказ на BMW 3 Series',
      type: 'info',
      read: false,
      timestamp: '2024-01-15T10:30:00Z',
      sender: 'Система'
    },
    {
      id: 2,
      title: 'Низкий остаток на складе',
      message: 'Заканчиваются автомобили Audi A4',
      type: 'warning',
      read: false,
      timestamp: '2024-01-15T09:15:00Z',
      sender: 'Система'
    },
    {
      id: 3,
      title: 'Отмена записи',
      message: 'Клиент отменил запись на тест-драйв',
      type: 'error',
      read: true,
      timestamp: '2024-01-15T08:45:00Z',
      sender: 'Система'
    }
  ];

  const systemAlerts = [
    {
      id: 1,
      title: 'Обновление системы',
      message: 'Запланировано обновление на 20.01.2024 в 02:00',
      type: 'info',
      priority: 'medium',
      active: true
    },
    {
      id: 2,
      title: 'Резервное копирование',
      message: 'Ошибка создания резервной копии',
      type: 'error',
      priority: 'high',
      active: true
    },
    {
      id: 3,
      title: 'Превышен лимит API',
      message: 'Достигнут лимит запросов к внешним сервисам',
      type: 'warning',
      priority: 'medium',
      active: false
    }
  ];

  const handleSendNotification = async () => {
    try {
      // Симуляция отправки уведомления
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast({
        title: 'Уведомление отправлено',
        description: 'Уведомление успешно отправлено получателям',
      });
      
      setIsDialogOpen(false);
      setNotificationForm({
        title: '',
        message: '',
        type: 'info',
        recipients: 'all'
      });
    } catch (error) {
      toast({
        title: 'Ошибка',
        description: 'Не удалось отправить уведомление',
        variant: 'destructive',
      });
    }
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'info': return 'Info';
      case 'warning': return 'AlertTriangle';
      case 'error': return 'AlertCircle';
      case 'success': return 'CheckCircle';
      default: return 'Bell';
    }
  };

  const getNotificationColor = (type: string) => {
    switch (type) {
      case 'info': return 'text-blue-600';
      case 'warning': return 'text-yellow-600';
      case 'error': return 'text-red-600';
      case 'success': return 'text-green-600';
      default: return 'text-gray-600';
    }
  };

  const getPriorityBadge = (priority: string) => {
    const variants = {
      high: 'destructive',
      medium: 'secondary',
      low: 'outline'
    } as const;

    const labels = {
      high: 'Высокий',
      medium: 'Средний',
      low: 'Низкий'
    };

    return (
      <Badge variant={variants[priority as keyof typeof variants] || 'outline'}>
        {labels[priority as keyof typeof labels] || priority}
      </Badge>
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Уведомления</h1>
          <p className="text-muted-foreground">Управление уведомлениями и оповещениями</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Icon name="Plus" size={16} className="mr-2" />
              Создать уведомление
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Новое уведомление</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium mb-1 block">Заголовок</label>
                <Input
                  value={notificationForm.title}
                  onChange={(e) => setNotificationForm({...notificationForm, title: e.target.value})}
                  placeholder="Заголовок уведомления"
                />
              </div>
              <div>
                <label className="text-sm font-medium mb-1 block">Сообщение</label>
                <Textarea
                  value={notificationForm.message}
                  onChange={(e) => setNotificationForm({...notificationForm, message: e.target.value})}
                  placeholder="Текст уведомления"
                  rows={3}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium mb-1 block">Тип</label>
                  <Select value={notificationForm.type} onValueChange={(value) => setNotificationForm({...notificationForm, type: value})}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="info">Информация</SelectItem>
                      <SelectItem value="warning">Предупреждение</SelectItem>
                      <SelectItem value="error">Ошибка</SelectItem>
                      <SelectItem value="success">Успех</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="text-sm font-medium mb-1 block">Получатели</label>
                  <Select value={notificationForm.recipients} onValueChange={(value) => setNotificationForm({...notificationForm, recipients: value})}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Все пользователи</SelectItem>
                      <SelectItem value="admins">Администраторы</SelectItem>
                      <SelectItem value="managers">Менеджеры</SelectItem>
                      <SelectItem value="customers">Клиенты</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Отмена
                </Button>
                <Button onClick={handleSendNotification}>
                  Отправить
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <Tabs defaultValue="notifications" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="notifications">Уведомления</TabsTrigger>
          <TabsTrigger value="alerts">Системные оповещения</TabsTrigger>
          <TabsTrigger value="settings">Настройки</TabsTrigger>
        </TabsList>

        <TabsContent value="notifications">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                Входящие уведомления
                <Button variant="outline" size="sm">
                  <Icon name="Check" size={16} className="mr-2" />
                  Отметить все как прочитанные
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {notifications.map((notification) => (
                  <div 
                    key={notification.id} 
                    className={`border rounded-lg p-4 ${!notification.read ? 'bg-blue-50 border-blue-200' : ''}`}
                  >
                    <div className="flex items-start space-x-3">
                      <div className={`p-2 rounded-full ${!notification.read ? 'bg-blue-100' : 'bg-gray-100'}`}>
                        <Icon 
                          name={getNotificationIcon(notification.type)} 
                          size={16} 
                          className={getNotificationColor(notification.type)} 
                        />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-1">
                          <h4 className="font-medium">{notification.title}</h4>
                          <div className="flex items-center space-x-2">
                            {!notification.read && <Badge variant="default">Новое</Badge>}
                            <span className="text-xs text-gray-500">
                              {new Date(notification.timestamp).toLocaleString('ru-RU')}
                            </span>
                          </div>
                        </div>
                        <p className="text-sm text-gray-600 mb-2">{notification.message}</p>
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-gray-500">От: {notification.sender}</span>
                          <div className="flex space-x-2">
                            {!notification.read && (
                              <Button size="sm" variant="outline">
                                Отметить как прочитанное
                              </Button>
                            )}
                            <Button size="sm" variant="outline">
                              <Icon name="Trash2" size={14} />
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="alerts">
          <Card>
            <CardHeader>
              <CardTitle>Системные оповещения</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {systemAlerts.map((alert) => (
                  <div key={alert.id} className="border rounded-lg p-4">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center space-x-2">
                        <Icon 
                          name={getNotificationIcon(alert.type)} 
                          size={16} 
                          className={getNotificationColor(alert.type)} 
                        />
                        <h4 className="font-medium">{alert.title}</h4>
                      </div>
                      <div className="flex items-center space-x-2">
                        {getPriorityBadge(alert.priority)}
                        <Badge variant={alert.active ? 'default' : 'outline'}>
                          {alert.active ? 'Активно' : 'Неактивно'}
                        </Badge>
                      </div>
                    </div>
                    <p className="text-sm text-gray-600 mb-3">{alert.message}</p>
                    <div className="flex space-x-2">
                      <Button size="sm" variant="outline">
                        Подробнее
                      </Button>
                      {alert.active && (
                        <Button size="sm" variant="outline">
                          Отключить
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="settings">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Настройки уведомлений</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium">Email уведомления</div>
                    <div className="text-sm text-gray-600">Отправлять уведомления на email</div>
                  </div>
                  <input type="checkbox" defaultChecked className="toggle" />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium">Push уведомления</div>
                    <div className="text-sm text-gray-600">Браузерные push-уведомления</div>
                  </div>
                  <input type="checkbox" defaultChecked className="toggle" />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium">SMS уведомления</div>
                    <div className="text-sm text-gray-600">Отправлять SMS для критических событий</div>
                  </div>
                  <input type="checkbox" className="toggle" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Автоматические уведомления</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium">Новые заказы</div>
                    <div className="text-sm text-gray-600">Уведомлять о новых заказах</div>
                  </div>
                  <input type="checkbox" defaultChecked className="toggle" />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium">Низкий остаток</div>
                    <div className="text-sm text-gray-600">Предупреждать о низком остатке товаров</div>
                  </div>
                  <input type="checkbox" defaultChecked className="toggle" />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium">Системные ошибки</div>
                    <div className="text-sm text-gray-600">Уведомлять об ошибках системы</div>
                  </div>
                  <input type="checkbox" defaultChecked className="toggle" />
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default NotificationsPage;