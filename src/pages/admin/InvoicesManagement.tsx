import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from '@/hooks/use-toast';
import DataTable, { Column } from '@/components/admin/DataTable';
import Icon from '@/components/ui/icon';

interface Invoice {
  _id: string;
  number: string;
  orderId: string;
  customerId: string;
  customerName: string;
  amount: number;
  tax: number;
  total: number;
  status: string;
  dueDate: string;
  createdAt: string;
  paidAt?: string;
}

const InvoicesManagement: React.FC = () => {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [filterStatus, setFilterStatus] = useState('all');

  useEffect(() => {
    fetchInvoices();
  }, []);

  const fetchInvoices = async () => {
    try {
      setIsLoading(true);
      // Симуляция данных счетов
      setInvoices([
        {
          _id: '1',
          number: 'INV-2024-001',
          orderId: 'ORD-001',
          customerId: 'USR-001',
          customerName: 'Иванов Иван Иванович',
          amount: 2890000,
          tax: 578000,
          total: 3468000,
          status: 'paid',
          dueDate: '2024-02-15T00:00:00Z',
          createdAt: '2024-01-15T10:30:00Z',
          paidAt: '2024-01-16T14:20:00Z'
        },
        {
          _id: '2',
          number: 'INV-2024-002',
          orderId: 'ORD-002',
          customerId: 'USR-002',
          customerName: 'Петров Петр Петрович',
          amount: 3450000,
          tax: 690000,
          total: 4140000,
          status: 'pending',
          dueDate: '2024-02-20T00:00:00Z',
          createdAt: '2024-01-20T11:00:00Z'
        },
        {
          _id: '3',
          number: 'INV-2024-003',
          orderId: 'ORD-003',
          customerId: 'USR-003',
          customerName: 'Сидоров Сидор Сидорович',
          amount: 4120000,
          tax: 824000,
          total: 4944000,
          status: 'overdue',
          dueDate: '2024-01-10T00:00:00Z',
          createdAt: '2024-01-01T09:00:00Z'
        }
      ]);
    } catch (error) {
      toast({
        title: 'Ошибка',
        description: 'Не удалось загрузить счета',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusBadge = (status: string) => {
    const variants = {
      paid: 'default',
      pending: 'secondary',
      overdue: 'destructive',
      cancelled: 'outline'
    } as const;

    const labels = {
      paid: 'Оплачен',
      pending: 'Ожидает оплаты',
      overdue: 'Просрочен',
      cancelled: 'Отменен'
    };

    return (
      <Badge variant={variants[status as keyof typeof variants] || 'outline'}>
        {labels[status as keyof typeof labels] || status}
      </Badge>
    );
  };

  const handleSendInvoice = async (invoice: Invoice) => {
    try {
      toast({
        title: 'Счет отправлен',
        description: `Счет ${invoice.number} отправлен клиенту`,
      });
    } catch (error) {
      toast({
        title: 'Ошибка',
        description: 'Не удалось отправить счет',
        variant: 'destructive',
      });
    }
  };

  const handleMarkAsPaid = async (invoice: Invoice) => {
    try {
      toast({
        title: 'Счет отмечен как оплаченный',
        description: `Счет ${invoice.number} помечен как оплаченный`,
      });
      fetchInvoices();
    } catch (error) {
      toast({
        title: 'Ошибка',
        description: 'Не удалось обновить статус счета',
        variant: 'destructive',
      });
    }
  };

  const filteredInvoices = invoices.filter(invoice => 
    filterStatus === 'all' || invoice.status === filterStatus
  );

  const columns: Column<Invoice>[] = [
    {
      key: 'number',
      title: 'Номер счета',
      sortable: true,
      render: (number) => <code className="text-xs bg-gray-100 px-2 py-1 rounded">{number}</code>
    },
    {
      key: 'customerName',
      title: 'Клиент',
      sortable: true
    },
    {
      key: 'total',
      title: 'Сумма',
      sortable: true,
      render: (total) => `${total.toLocaleString('ru-RU')} ₽`
    },
    {
      key: 'status',
      title: 'Статус',
      render: (status) => getStatusBadge(status)
    },
    {
      key: 'dueDate',
      title: 'Срок оплаты',
      sortable: true,
      render: (date) => new Date(date).toLocaleDateString('ru-RU')
    },
    {
      key: 'createdAt',
      title: 'Дата создания',
      sortable: true,
      render: (date) => new Date(date).toLocaleDateString('ru-RU')
    }
  ];

  const totalAmount = filteredInvoices.reduce((sum, invoice) => sum + invoice.total, 0);
  const paidInvoices = filteredInvoices.filter(i => i.status === 'paid');
  const overdueInvoices = filteredInvoices.filter(i => i.status === 'overdue');

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Управление счетами</h1>
          <p className="text-muted-foreground">Создание и управление счетами</p>
        </div>
        <div className="flex items-center space-x-2">
          <Select value={filterStatus} onValueChange={setFilterStatus}>
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Все статусы</SelectItem>
              <SelectItem value="paid">Оплаченные</SelectItem>
              <SelectItem value="pending">Ожидающие</SelectItem>
              <SelectItem value="overdue">Просроченные</SelectItem>
              <SelectItem value="cancelled">Отмененные</SelectItem>
            </SelectContent>
          </Select>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Icon name="Plus" size={16} className="mr-2" />
                Создать счет
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Создать новый счет</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium mb-1 block">Клиент</label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Выберите клиента" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1">Иванов Иван Иванович</SelectItem>
                      <SelectItem value="2">Петров Петр Петрович</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="text-sm font-medium mb-1 block">Заказ</label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Выберите заказ" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1">ORD-001</SelectItem>
                      <SelectItem value="2">ORD-002</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium mb-1 block">Сумма</label>
                    <Input type="number" placeholder="0" />
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-1 block">НДС (%)</label>
                    <Input type="number" placeholder="20" defaultValue="20" />
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium mb-1 block">Срок оплаты</label>
                  <Input type="date" />
                </div>
                <div className="flex justify-end space-x-2">
                  <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                    Отмена
                  </Button>
                  <Button>
                    Создать счет
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Общая сумма</p>
                <p className="text-2xl font-bold">{totalAmount.toLocaleString('ru-RU')} ₽</p>
              </div>
              <div className="p-3 rounded-full bg-blue-100">
                <Icon name="Receipt" size={24} className="text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Оплаченные</p>
                <p className="text-2xl font-bold">{paidInvoices.length}</p>
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
                <p className="text-sm font-medium text-muted-foreground">Просроченные</p>
                <p className="text-2xl font-bold">{overdueInvoices.length}</p>
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
                <p className="text-sm font-medium text-muted-foreground">Всего счетов</p>
                <p className="text-2xl font-bold">{filteredInvoices.length}</p>
              </div>
              <div className="p-3 rounded-full bg-purple-100">
                <Icon name="FileText" size={24} className="text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Список счетов</CardTitle>
        </CardHeader>
        <CardContent>
          <DataTable
            data={filteredInvoices}
            columns={columns}
            searchPlaceholder="Поиск счетов..."
            isLoading={isLoading}
            onView={(invoice) => {
              // Действия для просмотра счета
              console.log('View invoice:', invoice);
            }}
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default InvoicesManagement;