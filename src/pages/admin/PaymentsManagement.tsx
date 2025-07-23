import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from '@/hooks/use-toast';
import DataTable, { Column } from '@/components/admin/DataTable';
import Icon from '@/components/ui/icon';

interface Payment {
  _id: string;
  orderId: string;
  amount: number;
  currency: string;
  method: string;
  status: string;
  transactionId: string;
  gateway: string;
  createdAt: string;
  processedAt?: string;
}

const PaymentsManagement: React.FC = () => {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState('all');

  useEffect(() => {
    fetchPayments();
  }, []);

  const fetchPayments = async () => {
    try {
      setIsLoading(true);
      // Симуляция данных платежей
      setPayments([
        {
          _id: '1',
          orderId: 'ORD-001',
          amount: 2890000,
          currency: 'RUB',
          method: 'card',
          status: 'completed',
          transactionId: 'TXN-123456789',
          gateway: 'Сбербанк',
          createdAt: '2024-01-15T10:30:00Z',
          processedAt: '2024-01-15T10:31:00Z'
        },
        {
          _id: '2',
          orderId: 'ORD-002',
          amount: 3450000,
          currency: 'RUB',
          method: 'bank_transfer',
          status: 'pending',
          transactionId: 'TXN-123456790',
          gateway: 'ВТБ',
          createdAt: '2024-01-15T11:00:00Z'
        },
        {
          _id: '3',
          orderId: 'ORD-003',
          amount: 4120000,
          currency: 'RUB',
          method: 'cash',
          status: 'completed',
          transactionId: 'TXN-123456791',
          gateway: 'Касса',
          createdAt: '2024-01-15T12:00:00Z',
          processedAt: '2024-01-15T12:00:00Z'
        }
      ]);
    } catch (error) {
      toast({
        title: 'Ошибка',
        description: 'Не удалось загрузить платежи',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusBadge = (status: string) => {
    const variants = {
      completed: 'default',
      pending: 'secondary',
      failed: 'destructive',
      refunded: 'outline'
    } as const;

    const labels = {
      completed: 'Завершен',
      pending: 'Ожидает',
      failed: 'Ошибка',
      refunded: 'Возврат'
    };

    return (
      <Badge variant={variants[status as keyof typeof variants] || 'outline'}>
        {labels[status as keyof typeof labels] || status}
      </Badge>
    );
  };

  const getMethodBadge = (method: string) => {
    const labels = {
      card: 'Карта',
      bank_transfer: 'Перевод',
      cash: 'Наличные',
      credit: 'Кредит'
    };

    return (
      <Badge variant="outline">
        {labels[method as keyof typeof labels] || method}
      </Badge>
    );
  };

  const filteredPayments = payments.filter(payment => 
    filterStatus === 'all' || payment.status === filterStatus
  );

  const columns: Column<Payment>[] = [
    {
      key: 'transactionId',
      title: 'ID транзакции',
      sortable: true,
      render: (id) => <code className="text-xs bg-gray-100 px-2 py-1 rounded">{id}</code>
    },
    {
      key: 'orderId',
      title: 'Заказ',
      sortable: true
    },
    {
      key: 'amount',
      title: 'Сумма',
      sortable: true,
      render: (amount, payment) => `${amount.toLocaleString('ru-RU')} ${payment.currency}`
    },
    {
      key: 'method',
      title: 'Способ оплаты',
      render: (method) => getMethodBadge(method)
    },
    {
      key: 'gateway',
      title: 'Платежная система',
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
      render: (date) => new Date(date).toLocaleString('ru-RU')
    }
  ];

  const totalAmount = filteredPayments.reduce((sum, payment) => sum + payment.amount, 0);
  const completedPayments = filteredPayments.filter(p => p.status === 'completed');
  const pendingPayments = filteredPayments.filter(p => p.status === 'pending');

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Управление платежами</h1>
          <p className="text-muted-foreground">Мониторинг и управление платежами</p>
        </div>
        <div className="flex items-center space-x-2">
          <Select value={filterStatus} onValueChange={setFilterStatus}>
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Все статусы</SelectItem>
              <SelectItem value="completed">Завершенные</SelectItem>
              <SelectItem value="pending">Ожидающие</SelectItem>
              <SelectItem value="failed">Ошибки</SelectItem>
              <SelectItem value="refunded">Возвраты</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline">
            <Icon name="Download" size={16} className="mr-2" />
            Экспорт
          </Button>
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
              <div className="p-3 rounded-full bg-green-100">
                <Icon name="DollarSign" size={24} className="text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Завершенные</p>
                <p className="text-2xl font-bold">{completedPayments.length}</p>
              </div>
              <div className="p-3 rounded-full bg-blue-100">
                <Icon name="CheckCircle" size={24} className="text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Ожидающие</p>
                <p className="text-2xl font-bold">{pendingPayments.length}</p>
              </div>
              <div className="p-3 rounded-full bg-yellow-100">
                <Icon name="Clock" size={24} className="text-yellow-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Средний чек</p>
                <p className="text-2xl font-bold">
                  {Math.round(totalAmount / filteredPayments.length).toLocaleString('ru-RU')} ₽
                </p>
              </div>
              <div className="p-3 rounded-full bg-purple-100">
                <Icon name="TrendingUp" size={24} className="text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Список платежей</CardTitle>
        </CardHeader>
        <CardContent>
          <DataTable
            data={filteredPayments}
            columns={columns}
            searchPlaceholder="Поиск платежей..."
            isLoading={isLoading}
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default PaymentsManagement;