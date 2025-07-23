import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { apiClient, Order } from '@/lib/api';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from '@/hooks/use-toast';
import DataTable, { Column } from '@/components/admin/DataTable';
import Icon from '@/components/ui/icon';

const OrdersManagement: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingOrder, setEditingOrder] = useState<Order | null>(null);
  const [newStatus, setNewStatus] = useState('');

  const { hasPermission } = useAuth();

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      setIsLoading(true);
      const response = await apiClient.getOrders();
      if (response.success && response.data) {
        setOrders(response.data);
      }
    } catch (error) {
      toast({
        title: 'Ошибка',
        description: 'Не удалось загрузить заказы',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleStatusUpdate = async () => {
    if (!editingOrder || !newStatus) return;

    try {
      const response = await apiClient.updateOrder(editingOrder._id, { status: newStatus as any });
      if (response.success) {
        toast({
          title: 'Успешно',
          description: 'Статус заказа обновлен',
        });
        setIsDialogOpen(false);
        setEditingOrder(null);
        setNewStatus('');
        fetchOrders();
      }
    } catch (error) {
      toast({
        title: 'Ошибка',
        description: 'Не удалось обновить статус заказа',
        variant: 'destructive',
      });
    }
  };

  const handleEdit = (order: Order) => {
    setEditingOrder(order);
    setNewStatus(order.status);
    setIsDialogOpen(true);
  };

  const handleDelete = async (order: Order) => {
    if (window.confirm('Вы уверены, что хотите удалить этот заказ?')) {
      try {
        const response = await apiClient.deleteOrder(order._id);
        if (response.success) {
          toast({
            title: 'Успешно',
            description: 'Заказ удален',
          });
          fetchOrders();
        }
      } catch (error) {
        toast({
          title: 'Ошибка',
          description: 'Не удалось удалить заказ',
          variant: 'destructive',
        });
      }
    }
  };

  const getStatusBadge = (status: string) => {
    const variants = {
      pending: 'outline',
      confirmed: 'secondary',
      completed: 'default',
      cancelled: 'destructive'
    } as const;

    const labels = {
      pending: 'Ожидает',
      confirmed: 'Подтвержден',
      completed: 'Завершен',
      cancelled: 'Отменен'
    };

    return (
      <Badge variant={variants[status as keyof typeof variants] || 'outline'}>
        {labels[status as keyof typeof labels] || status}
      </Badge>
    );
  };

  const columns: Column<Order>[] = [
    {
      key: 'orderNumber',
      title: 'Номер заказа',
      sortable: true
    },
    {
      key: 'totalAmount',
      title: 'Сумма',
      sortable: true,
      render: (amount) => `${amount?.toLocaleString('ru-RU')} ₽`
    },
    {
      key: 'paymentMethod',
      title: 'Способ оплаты',
      render: (method) => method === 'cash' ? 'Наличные' : method === 'credit' ? 'Кредит' : method
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
          <h1 className="text-3xl font-bold">Управление заказами</h1>
          <p className="text-muted-foreground">Управление заказами клиентов</p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Список заказов</CardTitle>
        </CardHeader>
        <CardContent>
          <DataTable
            data={orders}
            columns={columns}
            onEdit={hasPermission('orders.update') ? handleEdit : undefined}
            onDelete={hasPermission('orders.delete') ? handleDelete : undefined}
            searchPlaceholder="Поиск заказов..."
            isLoading={isLoading}
          />
        </CardContent>
      </Card>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Изменить статус заказа</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium mb-2 block">
                Заказ: {editingOrder?.orderNumber}
              </label>
              <label className="text-sm font-medium mb-2 block">Новый статус</label>
              <Select value={newStatus} onValueChange={setNewStatus}>
                <SelectTrigger>
                  <SelectValue placeholder="Выберите статус" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pending">Ожидает</SelectItem>
                  <SelectItem value="confirmed">Подтвержден</SelectItem>
                  <SelectItem value="completed">Завершен</SelectItem>
                  <SelectItem value="cancelled">Отменен</SelectItem>
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

export default OrdersManagement;