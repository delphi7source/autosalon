import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from '@/hooks/use-toast';
import DataTable, { Column } from '@/components/admin/DataTable';
import Icon from '@/components/ui/icon';

interface Newsletter {
  _id: string;
  subject: string;
  content: string;
  recipients: string;
  status: string;
  sentAt?: string;
  openRate?: number;
  clickRate?: number;
  createdAt: string;
}

interface Subscriber {
  _id: string;
  email: string;
  name: string;
  status: string;
  subscribedAt: string;
  lastActivity?: string;
}

const NewslettersManagement: React.FC = () => {
  const [newsletters, setNewsletters] = useState<Newsletter[]>([]);
  const [subscribers, setSubscribers] = useState<Subscriber[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
    subject: '',
    content: '',
    recipients: 'all'
  });

  useEffect(() => {
    fetchNewsletters();
    fetchSubscribers();
  }, []);

  const fetchNewsletters = async () => {
    try {
      setIsLoading(true);
      // Симуляция данных рассылок
      setNewsletters([
        {
          _id: '1',
          subject: 'Новые поступления BMW',
          content: 'Уважаемые клиенты! У нас появились новые модели BMW...',
          recipients: 'all',
          status: 'sent',
          sentAt: '2024-01-15T10:00:00Z',
          openRate: 45.2,
          clickRate: 12.8,
          createdAt: '2024-01-15T09:00:00Z'
        },
        {
          _id: '2',
          subject: 'Специальные предложения января',
          content: 'Только в январе скидки до 15% на все автомобили...',
          recipients: 'customers',
          status: 'draft',
          createdAt: '2024-01-14T15:00:00Z'
        }
      ]);
    } catch (error) {
      toast({
        title: 'Ошибка',
        description: 'Не удалось загрузить рассылки',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const fetchSubscribers = async () => {
    try {
      // Симуляция данных подписчиков
      setSubscribers([
        {
          _id: '1',
          email: 'ivan@example.com',
          name: 'Иван Петров',
          status: 'active',
          subscribedAt: '2024-01-01T00:00:00Z',
          lastActivity: '2024-01-15T10:30:00Z'
        },
        {
          _id: '2',
          email: 'maria@example.com',
          name: 'Мария Сидорова',
          status: 'active',
          subscribedAt: '2024-01-05T00:00:00Z',
          lastActivity: '2024-01-14T14:20:00Z'
        },
        {
          _id: '3',
          email: 'alex@example.com',
          name: 'Александр Козлов',
          status: 'unsubscribed',
          subscribedAt: '2023-12-15T00:00:00Z',
          lastActivity: '2024-01-10T09:15:00Z'
        }
      ]);
    } catch (error) {
      console.error('Error fetching subscribers:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      toast({
        title: 'Рассылка создана',
        description: 'Рассылка успешно создана и отправлена',
      });
      
      setIsDialogOpen(false);
      resetForm();
      fetchNewsletters();
    } catch (error) {
      toast({
        title: 'Ошибка',
        description: 'Не удалось создать рассылку',
        variant: 'destructive',
      });
    }
  };

  const resetForm = () => {
    setFormData({
      subject: '',
      content: '',
      recipients: 'all'
    });
  };

  const getStatusBadge = (status: string) => {
    const variants = {
      sent: 'default',
      draft: 'secondary',
      scheduled: 'outline',
      failed: 'destructive'
    } as const;

    const labels = {
      sent: 'Отправлена',
      draft: 'Черновик',
      scheduled: 'Запланирована',
      failed: 'Ошибка'
    };

    return (
      <Badge variant={variants[status as keyof typeof variants] || 'outline'}>
        {labels[status as keyof typeof labels] || status}
      </Badge>
    );
  };

  const getSubscriberStatusBadge = (status: string) => {
    const variants = {
      active: 'default',
      unsubscribed: 'destructive',
      bounced: 'outline'
    } as const;

    const labels = {
      active: 'Активен',
      unsubscribed: 'Отписался',
      bounced: 'Недоступен'
    };

    return (
      <Badge variant={variants[status as keyof typeof variants] || 'outline'}>
        {labels[status as keyof typeof labels] || status}
      </Badge>
    );
  };

  const newsletterColumns: Column<Newsletter>[] = [
    {
      key: 'subject',
      title: 'Тема',
      sortable: true
    },
    {
      key: 'recipients',
      title: 'Получатели',
      render: (recipients) => {
        const labels = {
          all: 'Все пользователи',
          customers: 'Клиенты',
          subscribers: 'Подписчики'
        };
        return labels[recipients as keyof typeof labels] || recipients;
      }
    },
    {
      key: 'status',
      title: 'Статус',
      render: (status) => getStatusBadge(status)
    },
    {
      key: 'openRate',
      title: 'Открытия',
      render: (rate) => rate ? `${rate}%` : '-'
    },
    {
      key: 'clickRate',
      title: 'Клики',
      render: (rate) => rate ? `${rate}%` : '-'
    },
    {
      key: 'sentAt',
      title: 'Дата отправки',
      sortable: true,
      render: (date) => date ? new Date(date).toLocaleDateString('ru-RU') : '-'
    }
  ];

  const subscriberColumns: Column<Subscriber>[] = [
    {
      key: 'email',
      title: 'Email',
      sortable: true
    },
    {
      key: 'name',
      title: 'Имя',
      sortable: true
    },
    {
      key: 'status',
      title: 'Статус',
      render: (status) => getSubscriberStatusBadge(status)
    },
    {
      key: 'subscribedAt',
      title: 'Дата подписки',
      sortable: true,
      render: (date) => new Date(date).toLocaleDateString('ru-RU')
    },
    {
      key: 'lastActivity',
      title: 'Последняя активность',
      sortable: true,
      render: (date) => date ? new Date(date).toLocaleDateString('ru-RU') : '-'
    }
  ];

  const activeSubscribers = subscribers.filter(s => s.status === 'active');

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Email рассылки</h1>
          <p className="text-muted-foreground">Управление email рассылками и подписчиками</p>
        </div>
        
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={resetForm}>
              <Icon name="Plus" size={16} className="mr-2" />
              Создать рассылку
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Создать новую рассылку</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="text-sm font-medium mb-1 block">Тема письма</label>
                <Input
                  value={formData.subject}
                  onChange={(e) => setFormData({...formData, subject: e.target.value})}
                  placeholder="Введите тему письма"
                  required
                />
              </div>
              
              <div>
                <label className="text-sm font-medium mb-1 block">Получатели</label>
                <Select value={formData.recipients} onValueChange={(value) => setFormData({...formData, recipients: value})}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Все пользователи</SelectItem>
                    <SelectItem value="customers">Только клиенты</SelectItem>
                    <SelectItem value="subscribers">Подписчики рассылки</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="text-sm font-medium mb-1 block">Содержание письма</label>
                <Textarea
                  value={formData.content}
                  onChange={(e) => setFormData({...formData, content: e.target.value})}
                  rows={10}
                  placeholder="Введите текст письма..."
                  required
                />
              </div>
              
              <div className="flex justify-end space-x-2">
                <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Отмена
                </Button>
                <Button type="button" variant="outline">
                  Сохранить как черновик
                </Button>
                <Button type="submit">
                  Отправить сейчас
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Всего рассылок</p>
                <p className="text-2xl font-bold">{newsletters.length}</p>
              </div>
              <div className="p-3 rounded-full bg-blue-100">
                <Icon name="Mail" size={24} className="text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Активные подписчики</p>
                <p className="text-2xl font-bold">{activeSubscribers.length}</p>
              </div>
              <div className="p-3 rounded-full bg-green-100">
                <Icon name="Users" size={24} className="text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Средний % открытий</p>
                <p className="text-2xl font-bold">
                  {newsletters.filter(n => n.openRate).length > 0 
                    ? Math.round(newsletters.reduce((sum, n) => sum + (n.openRate || 0), 0) / newsletters.filter(n => n.openRate).length)
                    : 0}%
                </p>
              </div>
              <div className="p-3 rounded-full bg-yellow-100">
                <Icon name="Eye" size={24} className="text-yellow-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Средний % кликов</p>
                <p className="text-2xl font-bold">
                  {newsletters.filter(n => n.clickRate).length > 0 
                    ? Math.round(newsletters.reduce((sum, n) => sum + (n.clickRate || 0), 0) / newsletters.filter(n => n.clickRate).length)
                    : 0}%
                </p>
              </div>
              <div className="p-3 rounded-full bg-purple-100">
                <Icon name="MousePointer" size={24} className="text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="newsletters" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="newsletters">Рассылки</TabsTrigger>
          <TabsTrigger value="subscribers">Подписчики</TabsTrigger>
        </TabsList>

        <TabsContent value="newsletters">
          <Card>
            <CardHeader>
              <CardTitle>Список рассылок</CardTitle>
            </CardHeader>
            <CardContent>
              <DataTable
                data={newsletters}
                columns={newsletterColumns}
                searchPlaceholder="Поиск рассылок..."
                isLoading={isLoading}
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="subscribers">
          <Card>
            <CardHeader>
              <CardTitle>Список подписчиков</CardTitle>
            </CardHeader>
            <CardContent>
              <DataTable
                data={subscribers}
                columns={subscriberColumns}
                searchPlaceholder="Поиск подписчиков..."
                isLoading={false}
              />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default NewslettersManagement;