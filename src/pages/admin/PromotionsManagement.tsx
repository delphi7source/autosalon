import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { format } from 'date-fns';
import { ru } from 'date-fns/locale';
import { toast } from '@/hooks/use-toast';
import DataTable, { Column } from '@/components/admin/DataTable';
import Icon from '@/components/ui/icon';

interface Promotion {
  _id: string;
  title: string;
  description: string;
  type: string;
  value: number;
  code: string;
  startDate: string;
  endDate: string;
  isActive: boolean;
  usageLimit: number;
  usageCount: number;
  createdAt: string;
}

const PromotionsManagement: React.FC = () => {
  const [promotions, setPromotions] = useState<Promotion[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingPromotion, setEditingPromotion] = useState<Promotion | null>(null);
  const [startDate, setStartDate] = useState<Date>();
  const [endDate, setEndDate] = useState<Date>();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    type: 'percentage',
    value: 0,
    code: '',
    isActive: true,
    usageLimit: 100
  });

  useEffect(() => {
    fetchPromotions();
  }, []);

  const fetchPromotions = async () => {
    try {
      setIsLoading(true);
      // Симуляция данных акций
      setPromotions([
        {
          _id: '1',
          title: 'Скидка на BMW',
          description: 'Скидка 10% на все автомобили BMW',
          type: 'percentage',
          value: 10,
          code: 'BMW10',
          startDate: '2024-01-01T00:00:00Z',
          endDate: '2024-03-31T23:59:59Z',
          isActive: true,
          usageLimit: 100,
          usageCount: 25,
          createdAt: '2024-01-01T00:00:00Z'
        },
        {
          _id: '2',
          title: 'Новогодняя акция',
          description: 'Фиксированная скидка 200,000 рублей',
          type: 'fixed',
          value: 200000,
          code: 'NEWYEAR2024',
          startDate: '2024-01-01T00:00:00Z',
          endDate: '2024-01-31T23:59:59Z',
          isActive: false,
          usageLimit: 50,
          usageCount: 50,
          createdAt: '2024-01-01T00:00:00Z'
        }
      ]);
    } catch (error) {
      toast({
        title: 'Ошибка',
        description: 'Не удалось загрузить акции',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const promotionData = {
        ...formData,
        startDate: startDate?.toISOString(),
        endDate: endDate?.toISOString()
      };

      if (editingPromotion) {
        toast({
          title: 'Успешно',
          description: 'Акция обновлена',
        });
      } else {
        toast({
          title: 'Успешно',
          description: 'Акция создана',
        });
      }
      
      setIsDialogOpen(false);
      setEditingPromotion(null);
      resetForm();
      fetchPromotions();
    } catch (error) {
      toast({
        title: 'Ошибка',
        description: 'Не удалось сохранить акцию',
        variant: 'destructive',
      });
    }
  };

  const handleEdit = (promotion: Promotion) => {
    setEditingPromotion(promotion);
    setFormData({
      title: promotion.title,
      description: promotion.description,
      type: promotion.type,
      value: promotion.value,
      code: promotion.code,
      isActive: promotion.isActive,
      usageLimit: promotion.usageLimit
    });
    setStartDate(new Date(promotion.startDate));
    setEndDate(new Date(promotion.endDate));
    setIsDialogOpen(true);
  };

  const handleDelete = async (promotion: Promotion) => {
    if (window.confirm('Вы уверены, что хотите удалить эту акцию?')) {
      try {
        toast({
          title: 'Успешно',
          description: 'Акция удалена',
        });
        fetchPromotions();
      } catch (error) {
        toast({
          title: 'Ошибка',
          description: 'Не удалось удалить акцию',
          variant: 'destructive',
        });
      }
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      type: 'percentage',
      value: 0,
      code: '',
      isActive: true,
      usageLimit: 100
    });
    setStartDate(undefined);
    setEndDate(undefined);
  };

  const generateCode = () => {
    const code = Math.random().toString(36).substring(2, 8).toUpperCase();
    setFormData({...formData, code});
  };

  const getTypeBadge = (type: string, value: number) => {
    if (type === 'percentage') {
      return <Badge variant="outline">{value}%</Badge>;
    } else {
      return <Badge variant="outline">{value.toLocaleString('ru-RU')} ₽</Badge>;
    }
  };

  const columns: Column<Promotion>[] = [
    {
      key: 'title',
      title: 'Название',
      sortable: true
    },
    {
      key: 'code',
      title: 'Код',
      render: (code) => <code className="text-xs bg-gray-100 px-2 py-1 rounded">{code}</code>
    },
    {
      key: 'type',
      title: 'Скидка',
      render: (type, promotion) => getTypeBadge(type, promotion.value)
    },
    {
      key: 'usageCount',
      title: 'Использовано',
      render: (count, promotion) => `${count} / ${promotion.usageLimit}`
    },
    {
      key: 'startDate',
      title: 'Начало',
      sortable: true,
      render: (date) => new Date(date).toLocaleDateString('ru-RU')
    },
    {
      key: 'endDate',
      title: 'Окончание',
      sortable: true,
      render: (date) => new Date(date).toLocaleDateString('ru-RU')
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
          <h1 className="text-3xl font-bold">Управление акциями</h1>
          <p className="text-muted-foreground">Создание и управление промо-акциями</p>
        </div>
        
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => { resetForm(); setEditingPromotion(null); }}>
              <Icon name="Plus" size={16} className="mr-2" />
              Создать акцию
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>
                {editingPromotion ? 'Редактировать акцию' : 'Создать акцию'}
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="text-sm font-medium mb-1 block">Название</label>
                <Input
                  value={formData.title}
                  onChange={(e) => setFormData({...formData, title: e.target.value})}
                  required
                />
              </div>
              
              <div>
                <label className="text-sm font-medium mb-1 block">Описание</label>
                <Textarea
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  rows={3}
                />
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="text-sm font-medium mb-1 block">Тип скидки</label>
                  <Select value={formData.type} onValueChange={(value) => setFormData({...formData, type: value})}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="percentage">Процент</SelectItem>
                      <SelectItem value="fixed">Фиксированная сумма</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="text-sm font-medium mb-1 block">
                    Значение {formData.type === 'percentage' ? '(%)' : '(₽)'}
                  </label>
                  <Input
                    type="number"
                    value={formData.value}
                    onChange={(e) => setFormData({...formData, value: parseFloat(e.target.value)})}
                    required
                  />
                </div>
                <div>
                  <label className="text-sm font-medium mb-1 block">Лимит использований</label>
                  <Input
                    type="number"
                    value={formData.usageLimit}
                    onChange={(e) => setFormData({...formData, usageLimit: parseInt(e.target.value)})}
                    required
                  />
                </div>
              </div>

              <div>
                <label className="text-sm font-medium mb-1 block">Промокод</label>
                <div className="flex space-x-2">
                  <Input
                    value={formData.code}
                    onChange={(e) => setFormData({...formData, code: e.target.value.toUpperCase()})}
                    required
                  />
                  <Button type="button" variant="outline" onClick={generateCode}>
                    Генерировать
                  </Button>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">Дата начала</label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className="w-full justify-start text-left font-normal"
                      >
                        <Icon name="Calendar" size={16} className="mr-2" />
                        {startDate ? format(startDate, "PPP", { locale: ru }) : "Выберите дату"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={startDate}
                        onSelect={setStartDate}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">Дата окончания</label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className="w-full justify-start text-left font-normal"
                      >
                        <Icon name="Calendar" size={16} className="mr-2" />
                        {endDate ? format(endDate, "PPP", { locale: ru }) : "Выберите дату"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={endDate}
                        onSelect={setEndDate}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>
              </div>
              
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="isActive"
                  checked={formData.isActive}
                  onChange={(e) => setFormData({...formData, isActive: e.target.checked})}
                />
                <label htmlFor="isActive" className="text-sm font-medium">
                  Активная акция
                </label>
              </div>
              
              <div className="flex justify-end space-x-2">
                <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Отмена
                </Button>
                <Button type="submit">
                  {editingPromotion ? 'Обновить' : 'Создать'}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Список акций</CardTitle>
        </CardHeader>
        <CardContent>
          <DataTable
            data={promotions}
            columns={columns}
            onEdit={handleEdit}
            onDelete={handleDelete}
            searchPlaceholder="Поиск акций..."
            isLoading={isLoading}
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default PromotionsManagement;