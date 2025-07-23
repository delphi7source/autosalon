import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { apiClient, Service } from '@/lib/api';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from '@/hooks/use-toast';
import DataTable, { Column } from '@/components/admin/DataTable';
import Icon from '@/components/ui/icon';

const ServicesManagement: React.FC = () => {
  const [services, setServices] = useState<Service[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingService, setEditingService] = useState<Service | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    category: '',
    price: 0,
    duration: '',
    description: '',
    isActive: true
  });

  const { hasPermission } = useAuth();

  useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = async () => {
    try {
      setIsLoading(true);
      const response = await apiClient.getServices();
      if (response.success && response.data) {
        setServices(response.data);
      }
    } catch (error) {
      toast({
        title: 'Ошибка',
        description: 'Не удалось загрузить услуги',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      if (editingService) {
        const response = await apiClient.updateService(editingService._id, formData);
        if (response.success) {
          toast({
            title: 'Успешно',
            description: 'Услуга обновлена',
          });
        }
      } else {
        const response = await apiClient.createService(formData);
        if (response.success) {
          toast({
            title: 'Успешно',
            description: 'Услуга добавлена',
          });
        }
      }
      
      setIsDialogOpen(false);
      setEditingService(null);
      resetForm();
      fetchServices();
    } catch (error) {
      toast({
        title: 'Ошибка',
        description: 'Не удалось сохранить услугу',
        variant: 'destructive',
      });
    }
  };

  const handleEdit = (service: Service) => {
    setEditingService(service);
    setFormData({
      name: service.name,
      category: service.category,
      price: service.price,
      duration: service.duration,
      description: service.description,
      isActive: service.isActive
    });
    setIsDialogOpen(true);
  };

  const handleDelete = async (service: Service) => {
    if (window.confirm('Вы уверены, что хотите удалить эту услугу?')) {
      try {
        const response = await apiClient.deleteService(service._id);
        if (response.success) {
          toast({
            title: 'Успешно',
            description: 'Услуга удалена',
          });
          fetchServices();
        }
      } catch (error) {
        toast({
          title: 'Ошибка',
          description: 'Не удалось удалить услугу',
          variant: 'destructive',
        });
      }
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      category: '',
      price: 0,
      duration: '',
      description: '',
      isActive: true
    });
  };

  const columns: Column<Service>[] = [
    {
      key: 'name',
      title: 'Название',
      sortable: true
    },
    {
      key: 'category',
      title: 'Категория',
      sortable: true
    },
    {
      key: 'price',
      title: 'Цена',
      sortable: true,
      render: (price) => `${price.toLocaleString('ru-RU')} ₽`
    },
    {
      key: 'duration',
      title: 'Длительность',
      sortable: true
    },
    {
      key: 'isActive',
      title: 'Статус',
      render: (isActive) => (
        <Badge variant={isActive ? 'default' : 'destructive'}>
          {isActive ? 'Активна' : 'Неактивна'}
        </Badge>
      )
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Управление услугами</h1>
          <p className="text-muted-foreground">Управление каталогом услуг</p>
        </div>
        
        {hasPermission('services.create') && (
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={() => { resetForm(); setEditingService(null); }}>
                <Icon name="Plus" size={16} className="mr-2" />
                Добавить услугу
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>
                  {editingService ? 'Редактировать услугу' : 'Добавить услугу'}
                </DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="text-sm font-medium mb-1 block">Название</label>
                  <Input
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    required
                  />
                </div>
                
                <div>
                  <label className="text-sm font-medium mb-1 block">Категория</label>
                  <Input
                    value={formData.category}
                    onChange={(e) => setFormData({...formData, category: e.target.value})}
                    required
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium mb-1 block">Цена</label>
                    <Input
                      type="number"
                      value={formData.price}
                      onChange={(e) => setFormData({...formData, price: parseInt(e.target.value)})}
                      required
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-1 block">Длительность</label>
                    <Input
                      value={formData.duration}
                      onChange={(e) => setFormData({...formData, duration: e.target.value})}
                      placeholder="2-3 часа"
                      required
                    />
                  </div>
                </div>
                
                <div>
                  <label className="text-sm font-medium mb-1 block">Описание</label>
                  <Textarea
                    value={formData.description}
                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                    rows={3}
                  />
                </div>
                
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="isActive"
                    checked={formData.isActive}
                    onChange={(e) => setFormData({...formData, isActive: e.target.checked})}
                  />
                  <label htmlFor="isActive" className="text-sm font-medium">
                    Активная услуга
                  </label>
                </div>
                
                <div className="flex justify-end space-x-2">
                  <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                    Отмена
                  </Button>
                  <Button type="submit">
                    {editingService ? 'Обновить' : 'Создать'}
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        )}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Список услуг</CardTitle>
        </CardHeader>
        <CardContent>
          <DataTable
            data={services}
            columns={columns}
            onEdit={hasPermission('services.update') ? handleEdit : undefined}
            onDelete={hasPermission('services.delete') ? handleDelete : undefined}
            searchPlaceholder="Поиск услуг..."
            isLoading={isLoading}
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default ServicesManagement;