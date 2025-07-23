import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { apiClient, TradeIn } from '@/lib/api';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from '@/hooks/use-toast';
import DataTable, { Column } from '@/components/admin/DataTable';
import Icon from '@/components/ui/icon';

const TradeInManagement: React.FC = () => {
  const [tradeIns, setTradeIns] = useState<TradeIn[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingTradeIn, setEditingTradeIn] = useState<TradeIn | null>(null);
  const [newStatus, setNewStatus] = useState('');

  const { hasPermission } = useAuth();

  useEffect(() => {
    fetchTradeIns();
  }, []);

  const fetchTradeIns = async () => {
    try {
      setIsLoading(true);
      const response = await apiClient.getTradeIns();
      if (response.success && response.data) {
        setTradeIns(response.data);
      }
    } catch (error) {
      toast({
        title: 'Ошибка',
        description: 'Не удалось загрузить заявки Trade-in',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleStatusUpdate = async () => {
    if (!editingTradeIn || !newStatus) return;

    try {
      const response = await apiClient.updateTradeIn(editingTradeIn._id, { status: newStatus as any });
      if (response.success) {
        toast({
          title: 'Успешно',
          description: 'Статус заявки обновлен',
        });
        setIsDialogOpen(false);
        setEditingTradeIn(null);
        setNewStatus('');
        fetchTradeIns();
      }
    } catch (error) {
      toast({
        title: 'Ошибка',
        description: 'Не удалось обновить статус заявки',
        variant: 'destructive',
      });
    }
  };

  const handleEdit = (tradeIn: TradeIn) => {
    setEditingTradeIn(tradeIn);
    setNewStatus(tradeIn.status);
    setIsDialogOpen(true);
  };

  const handleDelete = async (tradeIn: TradeIn) => {
    if (window.confirm('Вы уверены, что хотите удалить эту заявку?')) {
      try {
        const response = await apiClient.deleteTradeIn(tradeIn._id);
        if (response.success) {
          toast({
            title: 'Успешно',
            description: 'Заявка удалена',
          });
          fetchTradeIns();
        }
      } catch (error) {
        toast({
          title: 'Ошибка',
          description: 'Не удалось удалить заявку',
          variant: 'destructive',
        });
      }
    }
  };

  const getStatusBadge = (status: string) => {
    const variants = {
      pending: 'outline',
      evaluated: 'secondary',
      approved: 'default',
      completed: 'default'
    } as const;

    const labels = {
      pending: 'Ожидает',
      evaluated: 'Оценена',
      approved: 'Одобрена',
      completed: 'Завершена'
    };

    return (
      <Badge variant={variants[status as keyof typeof variants] || 'outline'}>
        {labels[status as keyof typeof labels] || status}
      </Badge>
    );
  };

  const columns: Column<TradeIn>[] = [
    {
      key: 'evaluationNumber',
      title: 'Номер оценки',
      sortable: true
    },
    {
      key: 'carBrand',
      title: 'Автомобиль',
      render: (_, tradeIn) => `${tradeIn.carBrand} ${tradeIn.carModel} ${tradeIn.carYear}`
    },
    {
      key: 'carMileage',
      title: 'Пробег',
      sortable: true,
      render: (mileage) => `${mileage.toLocaleString('ru-RU')} км`
    },
    {
      key: 'estimatedValue',
      title: 'Оценочная стоимость',
      sortable: true,
      render: (value) => `${value.toLocaleString('ru-RU')} ₽`
    },
    {
      key: 'status',
      title: 'Статус',
      render: (status) => getStatusBadge(status)
    },
    {
      key: 'createdAt',
      title: 'Дата создания',
      sortable: true,
      render: (date) => new Date(date).toLocaleDateString('ru-RU')
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Управление Trade-in</h1>
          <p className="text-muted-foreground">Управление заявками на обмен автомобилей</p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Список заявок Trade-in</CardTitle>
        </CardHeader>
        <CardContent>
          <DataTable
            data={tradeIns}
            columns={columns}
            onEdit={hasPermission('tradein.update') ? handleEdit : undefined}
            onDelete={hasPermission('tradein.delete') ? handleDelete : undefined}
            searchPlaceholder="Поиск заявок..."
            isLoading={isLoading}
          />
        </CardContent>
      </Card>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Изменить статус заявки Trade-in</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium mb-2 block">
                Заявка: {editingTradeIn?.evaluationNumber}
              </label>
              <label className="text-sm font-medium mb-2 block">
                Автомобиль: {editingTradeIn?.carBrand} {editingTradeIn?.carModel} {editingTradeIn?.carYear}
              </label>
              <label className="text-sm font-medium mb-2 block">Новый статус</label>
              <Select value={newStatus} onValueChange={setNewStatus}>
                <SelectTrigger>
                  <SelectValue placeholder="Выберите статус" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pending">Ожидает</SelectItem>
                  <SelectItem value="evaluated">Оценена</SelectItem>
                  <SelectItem value="approved">Одобрена</SelectItem>
                  <SelectItem value="completed">Завершена</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                Отмена
              </Button>
              <Button onClick={handleStatusUpdate}>
                Обновить статус
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default TradeInManagement;