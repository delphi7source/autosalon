import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { apiClient, Insurance } from '@/lib/api';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from '@/hooks/use-toast';
import DataTable, { Column } from '@/components/admin/DataTable';
import Icon from '@/components/ui/icon';

const InsuranceManagement: React.FC = () => {
  const [insurance, setInsurance] = useState<Insurance[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingInsurance, setEditingInsurance] = useState<Insurance | null>(null);
  const [newStatus, setNewStatus] = useState('');

  const { hasPermission } = useAuth();

  useEffect(() => {
    fetchInsurance();
  }, []);

  const fetchInsurance = async () => {
    try {
      setIsLoading(true);
      const response = await apiClient.getInsurance();
      if (response.success && response.data) {
        setInsurance(response.data);
      }
    } catch (error) {
      toast({
        title: 'Ошибка',
        description: 'Не удалось загрузить страховки',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleStatusUpdate = async () => {
    if (!editingInsurance || !newStatus) return;

    try {
      const response = await apiClient.updateInsurance(editingInsurance._id, { status: newStatus as any });
      if (response.success) {
        toast({
          title: 'Успешно',
          description: 'Статус страховки обновлен',
        });
        setIsDialogOpen(false);
        setEditingInsurance(null);
        setNewStatus('');
        fetchInsurance();
      }
    } catch (error) {
      toast({
        title: 'Ошибка',
        description: 'Не удалось обновить статус страховки',
        variant: 'destructive',
      });
    }
  };

  const handleEdit = (insurance: Insurance) => {
    setEditingInsurance(insurance);
    setNewStatus(insurance.status);
    setIsDialogOpen(true);
  };

  const handleDelete = async (insurance: Insurance) => {
    if (window.confirm('Вы уверены, что хотите удалить эту страховку?')) {
      try {
        const response = await apiClient.deleteInsurance(insurance._id);
        if (response.success) {
          toast({
            title: 'Успешно',
            description: 'Страховка удалена',
          });
          fetchInsurance();
        }
      } catch (error) {
        toast({
          title: 'Ошибка',
          description: 'Не удалось удалить страховку',
          variant: 'destructive',
        });
      }
    }
  };

  const getStatusBadge = (status: string) => {
    const variants = {
      active: 'default',
      expired: 'destructive',
      cancelled: 'destructive'
    } as const;

    const labels = {
      active: 'Активна',
      expired: 'Истекла',
      cancelled: 'Отменена'
    };

    return (
      <Badge variant={variants[status as keyof typeof variants] || 'outline'}>
        {labels[status as keyof typeof labels] || status}
      </Badge>
    );
  };

  const getTypeBadge = (type: string) => {
    return (
      <Badge variant="outline">
        {type === 'kasko' ? 'КАСКО' : 'ОСАГО'}
      </Badge>
    );
  };

  const columns: Column<Insurance>[] = [
    {
      key: 'policyNumber',
      title: 'Номер полиса',
      sortable: true
    },
    {
      key: 'type',
      title: 'Тип',
      render: (type) => getTypeBadge(type)
    },
    {
      key: 'insuranceCompany',
      title: 'Страховая компания',
      sortable: true
    },
    {
      key: 'premium',
      title: 'Премия',
      sortable: true,
      render: (premium) => `${premium.toLocaleString('ru-RU')} ₽`
    },
    {
      key: 'coverage',
      title: 'Покрытие',
      sortable: true,
      render: (coverage) => `${coverage.toLocaleString('ru-RU')} ₽`
    },
    {
      key: 'status',
      title: 'Статус',
      render: (status) => getStatusBadge(status)
    },
    {
      key: 'endDate',
      title: 'Действует до',
      sortable: true,
      render: (date) => new Date(date).toLocaleDateString('ru-RU')
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Управление страхованием</h1>
          <p className="text-muted-foreground">Управление страховыми полисами</p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Список страховых полисов</CardTitle>
        </CardHeader>
        <CardContent>
          <DataTable
            data={insurance}
            columns={columns}
            onEdit={hasPermission('insurance.update') ? handleEdit : undefined}
            onDelete={hasPermission('insurance.delete') ? handleDelete : undefined}
            searchPlaceholder="Поиск страховок..."
            isLoading={isLoading}
          />
        </CardContent>
      </Card>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Изменить статус страховки</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium mb-2 block">
                Полис: {editingInsurance?.policyNumber}
              </label>
              <label className="text-sm font-medium mb-2 block">
                Тип: {editingInsurance?.type === 'kasko' ? 'КАСКО' : 'ОСАГО'}
              </label>
              <label className="text-sm font-medium mb-2 block">Новый статус</label>
              <Select value={newStatus} onValueChange={setNewStatus}>
                <SelectTrigger>
                  <SelectValue placeholder="Выберите статус" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">Активна</SelectItem>
                  <SelectItem value="expired">Истекла</SelectItem>
                  <SelectItem value="cancelled">Отменена</SelectItem>
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

export default InsuranceManagement;