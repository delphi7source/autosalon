import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from '@/hooks/use-toast';
import DataTable, { Column } from '@/components/admin/DataTable';
import Icon from '@/components/ui/icon';

interface LogEntry {
  _id: string;
  level: string;
  message: string;
  timestamp: string;
  userId?: string;
  userEmail?: string;
  ip: string;
  userAgent: string;
  module: string;
  action: string;
  details?: any;
}

const LogsPage: React.FC = () => {
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filterLevel, setFilterLevel] = useState('all');
  const [filterModule, setFilterModule] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchLogs();
  }, []);

  const fetchLogs = async () => {
    try {
      setIsLoading(true);
      // Симуляция данных логов
      setLogs([
        {
          _id: '1',
          level: 'info',
          message: 'Пользователь вошел в систему',
          timestamp: '2024-01-15T10:30:00Z',
          userId: 'user123',
          userEmail: 'admin@autopremium.ru',
          ip: '192.168.1.100',
          userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
          module: 'auth',
          action: 'login'
        },
        {
          _id: '2',
          level: 'warning',
          message: 'Неудачная попытка входа',
          timestamp: '2024-01-15T10:25:00Z',
          ip: '192.168.1.101',
          userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
          module: 'auth',
          action: 'login_failed',
          details: { email: 'wrong@email.com', reason: 'invalid_password' }
        },
        {
          _id: '3',
          level: 'error',
          message: 'Ошибка подключения к базе данных',
          timestamp: '2024-01-15T10:20:00Z',
          ip: 'server',
          userAgent: 'system',
          module: 'database',
          action: 'connection_error',
          details: { error: 'Connection timeout', database: 'main' }
        },
        {
          _id: '4',
          level: 'info',
          message: 'Создан новый автомобиль',
          timestamp: '2024-01-15T10:15:00Z',
          userId: 'user456',
          userEmail: 'manager@autopremium.ru',
          ip: '192.168.1.102',
          userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)',
          module: 'cars',
          action: 'create',
          details: { carId: 'car789', brand: 'BMW', model: '3 Series' }
        },
        {
          _id: '5',
          level: 'debug',
          message: 'API запрос обработан',
          timestamp: '2024-01-15T10:10:00Z',
          ip: '192.168.1.103',
          userAgent: 'PostmanRuntime/7.32.3',
          module: 'api',
          action: 'request',
          details: { endpoint: '/api/cars', method: 'GET', responseTime: '150ms' }
        }
      ]);
    } catch (error) {
      toast({
        title: 'Ошибка',
        description: 'Не удалось загрузить логи',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const getLevelBadge = (level: string) => {
    const variants = {
      error: 'destructive',
      warning: 'secondary',
      info: 'default',
      debug: 'outline'
    } as const;

    const labels = {
      error: 'Ошибка',
      warning: 'Предупреждение',
      info: 'Информация',
      debug: 'Отладка'
    };

    return (
      <Badge variant={variants[level as keyof typeof variants] || 'outline'}>
        {labels[level as keyof typeof labels] || level}
      </Badge>
    );
  };

  const getModuleBadge = (module: string) => {
    const colors = {
      auth: 'bg-blue-100 text-blue-800',
      cars: 'bg-green-100 text-green-800',
      users: 'bg-purple-100 text-purple-800',
      orders: 'bg-orange-100 text-orange-800',
      api: 'bg-gray-100 text-gray-800',
      database: 'bg-red-100 text-red-800',
      system: 'bg-yellow-100 text-yellow-800'
    };

    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${colors[module as keyof typeof colors] || 'bg-gray-100 text-gray-800'}`}>
        {module}
      </span>
    );
  };

  const filteredLogs = logs.filter(log => {
    const matchesLevel = filterLevel === 'all' || log.level === filterLevel;
    const matchesModule = filterModule === 'all' || log.module === filterModule;
    const matchesSearch = searchTerm === '' || 
      log.message.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.userEmail?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.action.toLowerCase().includes(searchTerm.toLowerCase());
    
    return matchesLevel && matchesModule && matchesSearch;
  });

  const handleClearLogs = async () => {
    if (window.confirm('Вы уверены, что хотите очистить все логи?')) {
      try {
        toast({
          title: 'Логи очищены',
          description: 'Все логи успешно удалены',
        });
        setLogs([]);
      } catch (error) {
        toast({
          title: 'Ошибка',
          description: 'Не удалось очистить логи',
          variant: 'destructive',
        });
      }
    }
  };

  const handleExportLogs = async () => {
    try {
      toast({
        title: 'Экспорт начат',
        description: 'Логи экспортируются в файл',
      });
    } catch (error) {
      toast({
        title: 'Ошибка',
        description: 'Не удалось экспортировать логи',
        variant: 'destructive',
      });
    }
  };

  const columns: Column<LogEntry>[] = [
    {
      key: 'timestamp',
      title: 'Время',
      sortable: true,
      render: (timestamp) => new Date(timestamp).toLocaleString('ru-RU')
    },
    {
      key: 'level',
      title: 'Уровень',
      render: (level) => getLevelBadge(level)
    },
    {
      key: 'module',
      title: 'Модуль',
      render: (module) => getModuleBadge(module)
    },
    {
      key: 'action',
      title: 'Действие',
      sortable: true
    },
    {
      key: 'message',
      title: 'Сообщение',
      render: (message) => message.length > 60 ? `${message.substring(0, 60)}...` : message
    },
    {
      key: 'userEmail',
      title: 'Пользователь',
      render: (email) => email || 'Система'
    },
    {
      key: 'ip',
      title: 'IP',
      render: (ip) => <code className="text-xs bg-gray-100 px-1 rounded">{ip}</code>
    }
  ];

  const errorLogs = logs.filter(log => log.level === 'error');
  const warningLogs = logs.filter(log => log.level === 'warning');
  const todayLogs = logs.filter(log => 
    new Date(log.timestamp).toDateString() === new Date().toDateString()
  );

  const modules = [...new Set(logs.map(log => log.module))];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Системные логи</h1>
          <p className="text-muted-foreground">Мониторинг активности и ошибок системы</p>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline" onClick={handleExportLogs}>
            <Icon name="Download" size={16} className="mr-2" />
            Экспорт
          </Button>
          <Button variant="destructive" onClick={handleClearLogs}>
            <Icon name="Trash2" size={16} className="mr-2" />
            Очистить
          </Button>
        </div>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Всего записей</p>
                <p className="text-2xl font-bold">{logs.length}</p>
              </div>
              <div className="p-3 rounded-full bg-blue-100">
                <Icon name="FileText" size={24} className="text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Ошибки</p>
                <p className="text-2xl font-bold">{errorLogs.length}</p>
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
                <p className="text-sm font-medium text-muted-foreground">Предупреждения</p>
                <p className="text-2xl font-bold">{warningLogs.length}</p>
              </div>
              <div className="p-3 rounded-full bg-yellow-100">
                <Icon name="AlertTriangle" size={24} className="text-yellow-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Сегодня</p>
                <p className="text-2xl font-bold">{todayLogs.length}</p>
              </div>
              <div className="p-3 rounded-full bg-green-100">
                <Icon name="Calendar" size={24} className="text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Фильтры</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="text-sm font-medium mb-1 block">Поиск</label>
              <Input
                placeholder="Поиск по сообщению, пользователю..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div>
              <label className="text-sm font-medium mb-1 block">Уровень</label>
              <Select value={filterLevel} onValueChange={setFilterLevel}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Все уровни</SelectItem>
                  <SelectItem value="error">Ошибки</SelectItem>
                  <SelectItem value="warning">Предупреждения</SelectItem>
                  <SelectItem value="info">Информация</SelectItem>
                  <SelectItem value="debug">Отладка</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-sm font-medium mb-1 block">Модуль</label>
              <Select value={filterModule} onValueChange={setFilterModule}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Все модули</SelectItem>
                  {modules.map(module => (
                    <SelectItem key={module} value={module}>{module}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-end">
              <Button 
                variant="outline" 
                onClick={() => {
                  setFilterLevel('all');
                  setFilterModule('all');
                  setSearchTerm('');
                }}
                className="w-full"
              >
                Сбросить фильтры
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Logs Table */}
      <Card>
        <CardHeader>
          <CardTitle>Журнал событий ({filteredLogs.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <DataTable
            data={filteredLogs}
            columns={columns}
            searchPlaceholder="Поиск в логах..."
            isLoading={isLoading}
            onView={(log) => {
              // Показать детали лога
              console.log('View log details:', log);
            }}
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default LogsPage;