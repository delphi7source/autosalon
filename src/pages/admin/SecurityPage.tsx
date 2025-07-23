import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from '@/hooks/use-toast';
import DataTable, { Column } from '@/components/admin/DataTable';
import Icon from '@/components/ui/icon';

interface SecurityEvent {
  _id: string;
  type: string;
  severity: string;
  description: string;
  ip: string;
  userAgent: string;
  userId?: string;
  userEmail?: string;
  timestamp: string;
  status: string;
}

interface FirewallRule {
  _id: string;
  name: string;
  type: string;
  source: string;
  action: string;
  isActive: boolean;
  createdAt: string;
}

const SecurityPage: React.FC = () => {
  const [securityEvents, setSecurityEvents] = useState<SecurityEvent[]>([]);
  const [firewallRules, setFirewallRules] = useState<FirewallRule[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [securitySettings, setSecuritySettings] = useState({
    maxLoginAttempts: 5,
    lockoutDuration: 30,
    sessionTimeout: 60,
    passwordMinLength: 8,
    requireTwoFactor: false,
    allowedIPs: '',
    blockedIPs: ''
  });

  React.useEffect(() => {
    fetchSecurityData();
  }, []);

  const fetchSecurityData = async () => {
    try {
      // Симуляция данных безопасности
      setSecurityEvents([
        {
          _id: '1',
          type: 'failed_login',
          severity: 'medium',
          description: 'Множественные неудачные попытки входа',
          ip: '192.168.1.100',
          userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
          userEmail: 'attacker@example.com',
          timestamp: '2024-01-15T10:30:00Z',
          status: 'blocked'
        },
        {
          _id: '2',
          type: 'suspicious_activity',
          severity: 'high',
          description: 'Подозрительная активность API',
          ip: '10.0.0.1',
          userAgent: 'curl/7.68.0',
          timestamp: '2024-01-15T10:25:00Z',
          status: 'investigating'
        },
        {
          _id: '3',
          type: 'privilege_escalation',
          severity: 'critical',
          description: 'Попытка повышения привилегий',
          ip: '192.168.1.101',
          userAgent: 'Mozilla/5.0 (Linux; Android 10)',
          userId: 'user123',
          userEmail: 'suspicious@example.com',
          timestamp: '2024-01-15T10:20:00Z',
          status: 'blocked'
        }
      ]);

      setFirewallRules([
        {
          _id: '1',
          name: 'Блокировка подозрительных IP',
          type: 'ip_block',
          source: '192.168.1.100',
          action: 'deny',
          isActive: true,
          createdAt: '2024-01-15T10:30:00Z'
        },
        {
          _id: '2',
          name: 'Разрешение для офиса',
          type: 'ip_allow',
          source: '10.0.0.0/24',
          action: 'allow',
          isActive: true,
          createdAt: '2024-01-01T00:00:00Z'
        }
      ]);
    } catch (error) {
      console.error('Error fetching security data:', error);
    }
  };

  const getSeverityBadge = (severity: string) => {
    const variants = {
      critical: 'destructive',
      high: 'destructive',
      medium: 'secondary',
      low: 'outline'
    } as const;

    const labels = {
      critical: 'Критический',
      high: 'Высокий',
      medium: 'Средний',
      low: 'Низкий'
    };

    return (
      <Badge variant={variants[severity as keyof typeof variants] || 'outline'}>
        {labels[severity as keyof typeof labels] || severity}
      </Badge>
    );
  };

  const getStatusBadge = (status: string) => {
    const variants = {
      blocked: 'destructive',
      investigating: 'secondary',
      resolved: 'default',
      ignored: 'outline'
    } as const;

    const labels = {
      blocked: 'Заблокирован',
      investigating: 'Расследуется',
      resolved: 'Решен',
      ignored: 'Игнорируется'
    };

    return (
      <Badge variant={variants[status as keyof typeof variants] || 'outline'}>
        {labels[status as keyof typeof labels] || status}
      </Badge>
    );
  };

  const getTypeBadge = (type: string) => {
    const labels = {
      failed_login: 'Неудачный вход',
      suspicious_activity: 'Подозрительная активность',
      privilege_escalation: 'Повышение привилегий',
      data_breach: 'Утечка данных',
      malware: 'Вредоносное ПО'
    };

    return (
      <Badge variant="outline">
        {labels[type as keyof typeof labels] || type}
      </Badge>
    );
  };

  const handleSaveSettings = async () => {
    try {
      toast({
        title: 'Настройки сохранены',
        description: 'Настройки безопасности успешно обновлены',
      });
    } catch (error) {
      toast({
        title: 'Ошибка',
        description: 'Не удалось сохранить настройки',
        variant: 'destructive',
      });
    }
  };

  const handleBlockIP = async (ip: string) => {
    try {
      toast({
        title: 'IP заблокирован',
        description: `IP адрес ${ip} добавлен в черный список`,
      });
    } catch (error) {
      toast({
        title: 'Ошибка',
        description: 'Не удалось заблокировать IP',
        variant: 'destructive',
      });
    }
  };

  const securityColumns: Column<SecurityEvent>[] = [
    {
      key: 'timestamp',
      title: 'Время',
      sortable: true,
      render: (timestamp) => new Date(timestamp).toLocaleString('ru-RU')
    },
    {
      key: 'type',
      title: 'Тип',
      render: (type) => getTypeBadge(type)
    },
    {
      key: 'severity',
      title: 'Серьезность',
      render: (severity) => getSeverityBadge(severity)
    },
    {
      key: 'description',
      title: 'Описание',
      render: (desc) => desc.length > 50 ? `${desc.substring(0, 50)}...` : desc
    },
    {
      key: 'ip',
      title: 'IP адрес',
      render: (ip) => <code className="text-xs bg-gray-100 px-1 rounded">{ip}</code>
    },
    {
      key: 'userEmail',
      title: 'Пользователь',
      render: (email) => email || 'Неизвестен'
    },
    {
      key: 'status',
      title: 'Статус',
      render: (status) => getStatusBadge(status)
    }
  ];

  const firewallColumns: Column<FirewallRule>[] = [
    {
      key: 'name',
      title: 'Название',
      sortable: true
    },
    {
      key: 'type',
      title: 'Тип',
      render: (type) => (
        <Badge variant="outline">
          {type === 'ip_block' ? 'Блокировка IP' : 
           type === 'ip_allow' ? 'Разрешение IP' : type}
        </Badge>
      )
    },
    {
      key: 'source',
      title: 'Источник',
      render: (source) => <code className="text-xs bg-gray-100 px-1 rounded">{source}</code>
    },
    {
      key: 'action',
      title: 'Действие',
      render: (action) => (
        <Badge variant={action === 'deny' ? 'destructive' : 'default'}>
          {action === 'deny' ? 'Запретить' : 'Разрешить'}
        </Badge>
      )
    },
    {
      key: 'isActive',
      title: 'Активно',
      render: (active) => active ? <Badge>Да</Badge> : <Badge variant="outline">Нет</Badge>
    },
    {
      key: 'createdAt',
      title: 'Создано',
      sortable: true,
      render: (date) => new Date(date).toLocaleDateString('ru-RU')
    }
  ];

  const criticalEvents = securityEvents.filter(e => e.severity === 'critical');
  const blockedEvents = securityEvents.filter(e => e.status === 'blocked');
  const todayEvents = securityEvents.filter(e => 
    new Date(e.timestamp).toDateString() === new Date().toDateString()
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Безопасность</h1>
          <p className="text-muted-foreground">Мониторинг безопасности и управление доступом</p>
        </div>
        <Button variant="destructive">
          <Icon name="Shield" size={16} className="mr-2" />
          Режим блокировки
        </Button>
      </div>

      {/* Security Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">События безопасности</p>
                <p className="text-2xl font-bold">{securityEvents.length}</p>
              </div>
              <div className="p-3 rounded-full bg-red-100">
                <Icon name="AlertTriangle" size={24} className="text-red-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Критические</p>
                <p className="text-2xl font-bold">{criticalEvents.length}</p>
              </div>
              <div className="p-3 rounded-full bg-red-100">
                <Icon name="AlertCircle" size={24} className="text-red-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Заблокировано</p>
                <p className="text-2xl font-bold">{blockedEvents.length}</p>
              </div>
              <div className="p-3 rounded-full bg-yellow-100">
                <Icon name="Shield" size={24} className="text-yellow-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Сегодня</p>
                <p className="text-2xl font-bold">{todayEvents.length}</p>
              </div>
              <div className="p-3 rounded-full bg-blue-100">
                <Icon name="Calendar" size={24} className="text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="events" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="events">События безопасности</TabsTrigger>
          <TabsTrigger value="firewall">Правила файрвола</TabsTrigger>
          <TabsTrigger value="settings">Настройки</TabsTrigger>
        </TabsList>

        <TabsContent value="events">
          <Card>
            <CardHeader>
              <CardTitle>События безопасности</CardTitle>
            </CardHeader>
            <CardContent>
              <DataTable
                data={securityEvents}
                columns={securityColumns}
                searchPlaceholder="Поиск событий..."
                isLoading={false}
                onView={(event) => {
                  console.log('View security event:', event);
                }}
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="firewall">
          <div className="space-y-6">
            <div className="flex justify-end">
              <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogTrigger asChild>
                  <Button>
                    <Icon name="Plus" size={16} className="mr-2" />
                    Добавить правило
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Новое правило файрвола</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm font-medium mb-1 block">Название</label>
                      <Input placeholder="Название правила" />
                    </div>
                    <div>
                      <label className="text-sm font-medium mb-1 block">Тип</label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Выберите тип" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="ip_block">Блокировка IP</SelectItem>
                          <SelectItem value="ip_allow">Разрешение IP</SelectItem>
                          <SelectItem value="country_block">Блокировка страны</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <label className="text-sm font-medium mb-1 block">IP адрес или диапазон</label>
                      <Input placeholder="192.168.1.1 или 192.168.1.0/24" />
                    </div>
                    <div>
                      <label className="text-sm font-medium mb-1 block">Действие</label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Выберите действие" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="allow">Разрешить</SelectItem>
                          <SelectItem value="deny">Запретить</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="flex justify-end space-x-2">
                      <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                        Отмена
                      </Button>
                      <Button>
                        Создать правило
                      </Button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Правила файрвола</CardTitle>
              </CardHeader>
              <CardContent>
                <DataTable
                  data={firewallRules}
                  columns={firewallColumns}
                  searchPlaceholder="Поиск правил..."
                  isLoading={false}
                />
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="settings">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Настройки аутентификации</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-sm font-medium mb-1 block">Максимум попыток входа</label>
                  <Input
                    type="number"
                    value={securitySettings.maxLoginAttempts}
                    onChange={(e) => setSecuritySettings({...securitySettings, maxLoginAttempts: parseInt(e.target.value)})}
                  />
                </div>
                <div>
                  <label className="text-sm font-medium mb-1 block">Время блокировки (минуты)</label>
                  <Input
                    type="number"
                    value={securitySettings.lockoutDuration}
                    onChange={(e) => setSecuritySettings({...securitySettings, lockoutDuration: parseInt(e.target.value)})}
                  />
                </div>
                <div>
                  <label className="text-sm font-medium mb-1 block">Таймаут сессии (минуты)</label>
                  <Input
                    type="number"
                    value={securitySettings.sessionTimeout}
                    onChange={(e) => setSecuritySettings({...securitySettings, sessionTimeout: parseInt(e.target.value)})}
                  />
                </div>
                <div>
                  <label className="text-sm font-medium mb-1 block">Минимальная длина пароля</label>
                  <Input
                    type="number"
                    value={securitySettings.passwordMinLength}
                    onChange={(e) => setSecuritySettings({...securitySettings, passwordMinLength: parseInt(e.target.value)})}
                  />
                </div>
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="requireTwoFactor"
                    checked={securitySettings.requireTwoFactor}
                    onChange={(e) => setSecuritySettings({...securitySettings, requireTwoFactor: e.target.checked})}
                  />
                  <label htmlFor="requireTwoFactor" className="text-sm font-medium">
                    Требовать двухфакторную аутентификацию
                  </label>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Управление IP адресами</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-sm font-medium mb-1 block">Разрешенные IP (через запятую)</label>
                  <Input
                    value={securitySettings.allowedIPs}
                    onChange={(e) => setSecuritySettings({...securitySettings, allowedIPs: e.target.value})}
                    placeholder="192.168.1.1, 10.0.0.0/24"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium mb-1 block">Заблокированные IP (через запятую)</label>
                  <Input
                    value={securitySettings.blockedIPs}
                    onChange={(e) => setSecuritySettings({...securitySettings, blockedIPs: e.target.value})}
                    placeholder="192.168.1.100, 203.0.113.0/24"
                  />
                </div>
                
                <div className="pt-4 border-t">
                  <h4 className="font-medium mb-3">Быстрые действия</h4>
                  <div className="space-y-2">
                    <Button variant="outline" className="w-full justify-start">
                      <Icon name="Shield" size={16} className="mr-2" />
                      Включить режим защиты от DDoS
                    </Button>
                    <Button variant="outline" className="w-full justify-start">
                      <Icon name="Lock" size={16} className="mr-2" />
                      Заблокировать все внешние IP
                    </Button>
                    <Button variant="outline" className="w-full justify-start">
                      <Icon name="RefreshCw" size={16} className="mr-2" />
                      Сбросить все сессии
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="flex justify-end">
            <Button onClick={handleSaveSettings}>
              <Icon name="Save" size={16} className="mr-2" />
              Сохранить настройки безопасности
            </Button>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SecurityPage;