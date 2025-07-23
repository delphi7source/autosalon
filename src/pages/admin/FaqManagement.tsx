import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from '@/hooks/use-toast';
import DataTable, { Column } from '@/components/admin/DataTable';
import Icon from '@/components/ui/icon';

interface FaqItem {
  _id: string;
  question: string;
  answer: string;
  category: string;
  isActive: boolean;
  sortOrder: number;
  createdAt: string;
  updatedAt: string;
}

const FaqManagement: React.FC = () => {
  const [faqItems, setFaqItems] = useState<FaqItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<FaqItem | null>(null);
  const [formData, setFormData] = useState({
    question: '',
    answer: '',
    category: '',
    isActive: true,
    sortOrder: 0
  });

  useEffect(() => {
    fetchFaqItems();
  }, []);

  const fetchFaqItems = async () => {
    try {
      setIsLoading(true);
      // Симуляция данных FAQ
      setFaqItems([
        {
          _id: '1',
          question: 'Как записаться на тест-драйв?',
          answer: 'Вы можете записаться на тест-драйв через наш сайт, позвонив по телефону или посетив салон лично.',
          category: 'Тест-драйв',
          isActive: true,
          sortOrder: 1,
          createdAt: '2024-01-01T00:00:00Z',
          updatedAt: '2024-01-01T00:00:00Z'
        },
        {
          _id: '2',
          question: 'Какие документы нужны для покупки автомобиля?',
          answer: 'Для покупки автомобиля необходимы: паспорт, водительское удостоверение, справка о доходах (для кредита).',
          category: 'Покупка',
          isActive: true,
          sortOrder: 2,
          createdAt: '2024-01-01T00:00:00Z',
          updatedAt: '2024-01-01T00:00:00Z'
        },
        {
          _id: '3',
          question: 'Есть ли гарантия на автомобили?',
          answer: 'Да, на все новые автомобили действует официальная гарантия производителя сроком от 2 до 5 лет.',
          category: 'Гарантия',
          isActive: true,
          sortOrder: 3,
          createdAt: '2024-01-01T00:00:00Z',
          updatedAt: '2024-01-01T00:00:00Z'
        }
      ]);
    } catch (error) {
      toast({
        title: 'Ошибка',
        description: 'Не удалось загрузить FAQ',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      if (editingItem) {
        toast({
          title: 'Успешно',
          description: 'Вопрос обновлен',
        });
      } else {
        toast({
          title: 'Успешно',
          description: 'Вопрос создан',
        });
      }
      
      setIsDialogOpen(false);
      setEditingItem(null);
      resetForm();
      fetchFaqItems();
    } catch (error) {
      toast({
        title: 'Ошибка',
        description: 'Не удалось сохранить вопрос',
        variant: 'destructive',
      });
    }
  };

  const handleEdit = (item: FaqItem) => {
    setEditingItem(item);
    setFormData({
      question: item.question,
      answer: item.answer,
      category: item.category,
      isActive: item.isActive,
      sortOrder: item.sortOrder
    });
    setIsDialogOpen(true);
  };

  const handleDelete = async (item: FaqItem) => {
    if (window.confirm('Вы уверены, что хотите удалить этот вопрос?')) {
      try {
        toast({
          title: 'Успешно',
          description: 'Вопрос удален',
        });
        fetchFaqItems();
      } catch (error) {
        toast({
          title: 'Ошибка',
          description: 'Не удалось удалить вопрос',
          variant: 'destructive',
        });
      }
    }
  };

  const resetForm = () => {
    setFormData({
      question: '',
      answer: '',
      category: '',
      isActive: true,
      sortOrder: 0
    });
  };

  const categories = [...new Set(faqItems.map(item => item.category))];

  const columns: Column<FaqItem>[] = [
    {
      key: 'question',
      title: 'Вопрос',
      sortable: true,
      render: (question) => question.length > 80 ? `${question.substring(0, 80)}...` : question
    },
    {
      key: 'category',
      title: 'Категория',
      sortable: true,
      render: (category) => <Badge variant="outline">{category}</Badge>
    },
    {
      key: 'sortOrder',
      title: 'Порядок',
      sortable: true
    },
    {
      key: 'isActive',
      title: 'Статус',
      render: (isActive) => (
        <Badge variant={isActive ? 'default' : 'destructive'}>
          {isActive ? 'Активен' : 'Неактивен'}
        </Badge>
      )
    },
    {
      key: 'updatedAt',
      title: 'Обновлен',
      sortable: true,
      render: (date) => new Date(date).toLocaleDateString('ru-RU')
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Управление FAQ</h1>
          <p className="text-muted-foreground">Часто задаваемые вопросы и ответы</p>
        </div>
        
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => { resetForm(); setEditingItem(null); }}>
              <Icon name="Plus" size={16} className="mr-2" />
              Добавить вопрос
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>
                {editingItem ? 'Редактировать вопрос' : 'Добавить вопрос'}
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="text-sm font-medium mb-1 block">Вопрос</label>
                <Textarea
                  value={formData.question}
                  onChange={(e) => setFormData({...formData, question: e.target.value})}
                  rows={2}
                  placeholder="Введите вопрос"
                  required
                />
              </div>
              
              <div>
                <label className="text-sm font-medium mb-1 block">Ответ</label>
                <Textarea
                  value={formData.answer}
                  onChange={(e) => setFormData({...formData, answer: e.target.value})}
                  rows={5}
                  placeholder="Введите подробный ответ"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium mb-1 block">Категория</label>
                  <Select value={formData.category} onValueChange={(value) => setFormData({...formData, category: value})}>
                    <SelectTrigger>
                      <SelectValue placeholder="Выберите категорию" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map(category => (
                        <SelectItem key={category} value={category}>{category}</SelectItem>
                      ))}
                      <SelectItem value="Тест-драйв">Тест-драйв</SelectItem>
                      <SelectItem value="Покупка">Покупка</SelectItem>
                      <SelectItem value="Гарантия">Гарантия</SelectItem>
                      <SelectItem value="Сервис">Сервис</SelectItem>
                      <SelectItem value="Финансы">Финансы</SelectItem>
                      <SelectItem value="Trade-in">Trade-in</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="text-sm font-medium mb-1 block">Порядок сортировки</label>
                  <Input
                    type="number"
                    value={formData.sortOrder}
                    onChange={(e) => setFormData({...formData, sortOrder: parseInt(e.target.value)})}
                  />
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
                  Активный вопрос
                </label>
              </div>
              
              <div className="flex justify-end space-x-2">
                <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Отмена
                </Button>
                <Button type="submit">
                  {editingItem ? 'Обновить' : 'Создать'}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Всего вопросов</p>
                <p className="text-2xl font-bold">{faqItems.length}</p>
              </div>
              <div className="p-3 rounded-full bg-blue-100">
                <Icon name="HelpCircle" size={24} className="text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Активные</p>
                <p className="text-2xl font-bold">{faqItems.filter(item => item.isActive).length}</p>
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
                <p className="text-sm font-medium text-muted-foreground">Категории</p>
                <p className="text-2xl font-bold">{categories.length}</p>
              </div>
              <div className="p-3 rounded-full bg-yellow-100">
                <Icon name="Folder" size={24} className="text-yellow-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Обновлено сегодня</p>
                <p className="text-2xl font-bold">
                  {faqItems.filter(item => 
                    new Date(item.updatedAt).toDateString() === new Date().toDateString()
                  ).length}
                </p>
              </div>
              <div className="p-3 rounded-full bg-purple-100">
                <Icon name="Clock" size={24} className="text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Список вопросов</CardTitle>
        </CardHeader>
        <CardContent>
          <DataTable
            data={faqItems}
            columns={columns}
            onEdit={handleEdit}
            onDelete={handleDelete}
            searchPlaceholder="Поиск вопросов..."
            isLoading={isLoading}
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default FaqManagement;