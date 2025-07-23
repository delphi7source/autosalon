import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Progress } from '@/components/ui/progress';
import { toast } from '@/hooks/use-toast';
import DataTable, { Column } from '@/components/admin/DataTable';
import Icon from '@/components/ui/icon';

interface Backup {
  _id: string;
  name: string;
  type: string;
  size: number;
  status: string;
  createdAt: string;
  completedAt?: string;
  description: string;
  downloadUrl?: string;
}

const BackupsPage: React.FC = () => {
  const [backups, setBackups] = useState<Backup[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [backupProgress, setBackupProgress] = useState(0);
  const [formData, setFormData] = useState({
    name: '',
    type: 'full',
    description: ''
  });

  useEffect(() => {
    fetchBackups();
  }, []);

  const fetchBackups = async () => {
    try {
      setIsLoading(true);
      // Симуляция данных резервных копий
      setBackups([
        {
          _id: '1',
          name: 'Полная резервная копия',
          type: 'full',
          size: 1024 * 1024 * 150, // 150 MB
          status: 'completed',
          createdAt: '2024-01-15T02:00:00Z',
          completedAt: '2024-01-15T02:15:00Z',
          description: 'Автоматическая еженедельная резервная копия',
          downloadUrl: '/backups/backup-2024-01-15.zip'
        },
        {
          _id: '2',
          name: 'Резервная копия базы данных',
          type: 'database',
          size: 1024 * 1024 * 45, // 45 MB
          status: 'completed',
          createdAt: '2024-01-14T02:00:00Z',
          completedAt: '2024-01-14T02:05:00Z',
          description: 'Ежедневная резервная копия БД',
          downloadUrl: '/backups/db-backup-2024-01-14.sql'
        },
        {
          _id: '3',
          name: 'Резервная копия файлов',
          type: 'files',
          size: 1024 * 1024 * 89, // 89 MB
          status: 'in_progress',
          createdAt: '2024-01-15T10:30:00Z',
          description: 'Резервная копия медиафайлов'
        },
        {
          _id: '4',
          name: 'Неудачная резервная копия',
          type: 'full',
          size: 0,
          status: 'failed',
          createdAt: '2024-01-13T02:00:00Z',
          description: 'Ошибка при создании резервной копии'
        }
      ]);
    } catch (error) {
      toast({
        title: 'Ошибка',
        description: 'Не удалось загрузить резервные копии',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateBackup = async () => {
    if (!formData.name.trim()) {
      toast({
        title: 'Ошибка',
        description: 'Введите название резервной копии',
        variant: 'destructive',
      });
      return;
    }

    setIsCreating(true);
    setBackupProgress(0);

    try {
      // Симуляция создания резервной копии с прогрессом
      const interval = setInterval(() => {
        setBackupProgress(prev => {
          if (prev >= 100) {
            clearInterval(interval);
            setIsCreating(false);
            setIsDialogOpen(false);
            setFormData({ name: '', type: 'full', description: '' });
            toast({
              title: 'Резервная копия создана',
              description: 'Резервная копия успешно создана',
            });
            fetchBackups();
            return 100;
          }
          return prev + 10;
        });
      }, 500);
    } catch (error) {
      setIsCreating(false);
      toast({
        title: 'Ошибка',
        description: 'Не удалось создать резервную копию',
        variant: 'destructive',
      });
    }
  };

  const handleDownload = async (backup: Backup) => {
    try {
      toast({
        title: 'Загрузка начата',
        description: `Загрузка ${backup.name}`,
      });
    } catch (error) {
      toast({
        title: 'Ошибка',
        description: 'Не удалось загрузить резервную копию',
        variant: 'destructive',
      });
    }
  };

  const handleRestore = async (backup: Backup) => {
    if (window.confirm('Вы уверены, что хотите восстановить систему из этой резервной копии? Все текущие данные будут заменены.')) {
      try {
        toast({
          title: 'Восстановление начато',
          description: 'Система восстанавливается из резервной копии',
        });
      } catch (error) {
        toast({
          title: 'Ошибка',
          description: 'Не удалось восстановить из резервной копии',
          variant: 'destructive',
        });
      }
    }
  };

  const handleDelete = async (backup: Backup) => {
    if (window.confirm('Вы уверены, что хотите удалить эту резервную копию?')) {
      try {
        toast({
          title: 'Успешно',
          description: 'Резервная копия удалена',
        });
        fetchBackups();
      } catch (error) {
        toast({
          title: 'Ошибка',
          description: 'Не удалось удалить резервную копию',
          variant: 'destructive',
        });
      }
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getStatusBadge = (status: string) => {
    const variants = {
      completed: 'default',
      in_progress: 'secondary',
      failed: 'destructive',
      scheduled: 'outline'
    } as const;

    const labels = {
      completed: 'Завершена',
      in_progress: 'Выполняется',
      failed: 'Ошибка',
      scheduled: 'Запланирована'
    };

    return (
      <Badge variant={variants[status as keyof typeof variants] || 'outline'}>
        {labels[status as keyof typeof labels] || status}
      </Badge>
    );
  };

  const getTypeBadge = (type: string) => {
    const labels = {
      full: 'Полная',
      database: 'База данных',
      files: 'Файлы',
      config: 'Конфигурация'
    };

    return (
      <Badge variant="outline">
        {labels[type as keyof typeof labels] || type}
      </Badge>
    );
  };

  const columns: Column<Backup>[] = [
    {
      key: 'name',
      title: 'Название',
      sortable: true
    },
    {
      key: 'type',
      title: 'Тип',
      render: (type) => getTypeBadge(type)
    },
    {
      key: 'size',
      title: 'Размер',
      sortable: true,
      render: (size) => formatFileSize(size)
    },
    {
      key: 'status',
      title: 'Статус',
      render: (status) => getStatusBadge(status)
    },
    {
      key: 'createdAt',
      title: 'Создана',
      sortable: true,
      render: (date) => new Date(date).toLocaleString('ru-RU')
    },
    {
      key: 'completedAt',
      title: 'Завершена',
      sortable: true,
      render: (date) => date ? new Date(date).toLocaleString('ru-RU') : '-'
    }
  ];

  const completedBackups = backups.filter(b => b.status === 'completed');
  const totalSize = backups.reduce((sum, b) => sum + b.size, 0);
  const todayBackups = backups.filter(b => 
    new Date(b.createdAt).toDateString() === new Date().toDateString()
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Резервные копии</h1>
          <p className="text-muted-foreground">Создание и управление резервными копиями</p>
        </div>
        
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Icon name="Plus" size={16} className="mr-2" />
              Создать резервную копию
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Создать резервную копию</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium mb-1 block">Название</label>
                <Input
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  placeholder="Название резервной копии"
                />
              </div>
              
              <div>
                <label className="text-sm font-medium mb-1 block">Тип</label>
                <Select value={formData.type} onValueChange={(value) => setFormData({...formData, type: value})}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="full">Полная резервная копия</SelectItem>
                    <SelectItem value="database">Только база данных</SelectItem>
                    <SelectItem value="files">Только файлы</SelectItem>
                    <SelectItem value="config">Только конфигурация</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="text-sm font-medium mb-1 block">Описание</label>
                <Input
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  placeholder="Описание резервной копии"
                />
              </div>

              {isCreating && (
                <div>
                  <label className="text-sm font-medium mb-2 block">Прогресс создания</label>
                  <Progress value={backupProgress} className="w-full" />
                  <div className="text-sm text-gray-600 mt-1">{backupProgress}%</div>
                </div>
              )}
              
              <div className="flex justify-end space-x-2">
                <Button 
                  variant="outline" 
                  onClick={() => setIsDialogOpen(false)}
                  disabled={isCreating}
                >
                  Отмена
                </Button>
                <Button 
                  onClick={handleCreateBackup}
                  disabled={isCreating}
                >
                  {isCreating ? (
                    <>
                      <Icon name="Loader2" size={16} className="mr-2 animate-spin" />
                      Создание...
                    </>
                  ) : (
                    'Создать'
                  )}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Всего копий</p>
                <p className="text-2xl font-bold">{backups.length}</p>
              </div>
              <div className="p-3 rounded-full bg-blue-100">
                <Icon name="Database" size={24} className="text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Успешные</p>
                <p className="text-2xl font-bold">{completedBackups.length}</p>
              </div>
              <div className="p-3 rounded-full bg-green-100">
                <Icon name="CheckCircle" size={24} className="text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Общий размер</p>
                <p className="text-2xl font-bold">{formatFileSize(totalSize)}</p>
              </div>
              <div className="p-3 rounded-full bg-yellow-100">
                <Icon name="HardDrive" size={24} className="text-yellow-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Сегодня</p>
                <p className="text-2xl font-bold">{todayBackups.length}</p>
              </div>
              <div className="p-3 rounded-full bg-purple-100">
                <Icon name="Calendar" size={24} className="text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Backup Schedule */}
      <Card>
        <CardHeader>
          <CardTitle>Расписание резервного копирования</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="border rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-medium">Ежедневное копирование БД</h4>
                <Badge variant="default">Включено</Badge>
              </div>
              <p className="text-sm text-gray-600 mb-2">Каждый день в 02:00</p>
              <div className="flex space-x-2">
                <Button size="sm" variant="outline">Настроить</Button>
                <Button size="sm" variant="outline">Отключить</Button>
              </div>
            </div>

            <div className="border rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-medium">Еженедельное полное копирование</h4>
                <Badge variant="default">Включено</Badge>
              </div>
              <p className="text-sm text-gray-600 mb-2">Каждое воскресенье в 01:00</p>
              <div className="flex space-x-2">
                <Button size="sm" variant="outline">Настроить</Button>
                <Button size="sm" variant="outline">Отключить</Button>
              </div>
            </div>

            <div className="border rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-medium">Месячное архивирование</h4>
                <Badge variant="outline">Отключено</Badge>
              </div>
              <p className="text-sm text-gray-600 mb-2">1 числа каждого месяца</p>
              <div className="flex space-x-2">
                <Button size="sm" variant="outline">Настроить</Button>
                <Button size="sm" variant="outline">Включить</Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Backups List */}
      <Card>
        <CardHeader>
          <CardTitle>Список резервных копий</CardTitle>
        </CardHeader>
        <CardContent>
          <DataTable
            data={backups}
            columns={columns}
            searchPlaceholder="Поиск резервных копий..."
            isLoading={isLoading}
            onView={(backup) => {
              if (backup.status === 'completed') {
                handleDownload(backup);
              }
            }}
            onDelete={handleDelete}
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default BackupsPage;