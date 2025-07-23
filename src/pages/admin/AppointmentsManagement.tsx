import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { apiClient, Appointment } from '@/lib/api';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from '@/hooks/use-toast';
import DataTable, { Column } from '@/components/admin/DataTable';
import Icon from '@/components/ui/icon';

const AppointmentsManagement: React.FC = () => {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingAppointment, setEditingAppointment] = useState<Appointment | null>(null);
  const [newStatus, setNewStatus] = useState('');

  const { hasPermission } = useAuth();

  useEffect(() => {
    fetchAppointments();
  }, []);

  const fetchAppointments = async () => {
    try {
      setIsLoading(true);
      const response = await apiClient.getAppointments();
      if (response.success && response.data) {
        setAppointments(response.data);
      }
    } catch (error) {
      toast({
        title: 'Ошибка',
        description: 'Не удалось загрузить записи',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleStatusUpdate = async () => {
    if (!editingAppointment || !newStatus) return;

    try {
      const response = await apiClient.updateAppointment(editingAppointment._id, { status: newStatus as any });
      if (response.success) {
        toast({
          title: 'Успешно',
          description: 'Статус записи обновлен',
        });
        setIsDialogOpen(false);
        setEditingAppointment(null);
        setNewStatus('');
        fetchAppointments();
      }
    } catch (error) {
      toast({
        title: 'Ошибка',
        description: 'Не удалось обновить статус записи',
        variant: 'destructive',
      });
    }
  };

  const handleEdit = (appointment: Appointment) => {
    setEditingAppointment(appointment);
    setNewStatus(appointment.status);
    setIsDialogOpen(true);
  };

  const handleDelete = async (appointment: Appointment) => {
    if (window.confirm('Вы уверены, что хотите удалить эту запись?')) {
      try {
        const response = await apiClient.deleteAppointment(appointment._id);
        if (response.success) {
          toast({
            title: 'Успешно',
            description: 'Запись удалена',
          });
          fetchAppointments();
        }
      } catch (error) {
        toast({
          title: 'Ошибка',
          description: 'Не удалось удалить запись',
          variant: 'destructive',
        });
      }
    }
  };

  const getStatusBadge = (status: string) => {
    const variants = {
      scheduled: 'outline',
      confirmed: 'secondary',
      completed: 'default',
      cancelled: 'destructive'
    } as const;

    const labels = {
      scheduled: 'Запланирована',
      confirmed: 'Подтверждена',
      completed: 'Завершена',
      cancelled: 'Отменена'
    };

    return (
      <Badge variant={variants[status as keyof typeof variants] || 'outline'}>
        {labels[status as keyof typeof labels] || status}
      </Badge>
    );
  };

  const getTypeBadge = (type: string) => {
    const labels = {
      'test-drive': 'Тест-драйв',
      'service': 'Сервис',
      'consultation': 'Консультация'
    };

    return labels[type as keyof typeof labels] || type;
  };

  const columns: Column<Appointment>[] = [
    {
      key: 'type',
      title: 'Тип',
      render: (type) => getTypeBadge(type)
    },
    {
      key: 'appointmentDate',
      title: 'Дата',
      sortable: true,
      render: (date) => new Date(date).toLocaleDateString('ru-RU')
    },
    {
      key: 'appointmentTime',
      title: 'Время',
      sortable: true
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
          <h1 className="text-3xl font-bold">Управление записями</h1>
          <p className="text-muted-foreground">Управление записями клиентов</p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Список записей</CardTitle>
        </CardHeader>
        <CardContent>
          <DataTable
            data={appointments}
            columns={columns}
            onEdit={hasPermission('appointments.update') ? handleEdit : undefined}
            onDelete={hasPermission('appointments.delete') ? handleDelete : undefined}
            searchPlaceholder="Поиск записей..."
            isLoading={isLoading}
          />
        </CardContent>
      </Card>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Изменить статус записи</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium mb-2 block">
                Запись: {getTypeBadge(editingAppointment?.type || '')} на {editingAppointment?.appointmentDate ? new Date(editingAppointment.appointmentDate).toLocaleDateString('ru-RU') : ''}
              </label>
              <label className="text-sm font-medium mb-2 block">Новый статус</label>
              <Select value={newStatus} onValueChange={setNewStatus}>
                <SelectTrigger>
                  <SelectValue placeholder="Выберите статус" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="scheduled">Запланирована</SelectItem>
                  <SelectItem value="confirmed">Подтверждена</SelectItem>
                  <SelectItem value="completed">Завершена</SelectItem>
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

export default AppointmentsManagement;