import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from '@/hooks/use-toast';
import DataTable, { Column } from '@/components/admin/DataTable';
import Icon from '@/components/ui/icon';

interface Review {
  _id: string;
  customerName: string;
  customerEmail: string;
  rating: number;
  title: string;
  content: string;
  carModel?: string;
  serviceType?: string;
  status: string;
  isVerified: boolean;
  createdAt: string;
  moderatedAt?: string;
}

const ReviewsManagement: React.FC = () => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedReview, setSelectedReview] = useState<Review | null>(null);
  const [moderationNote, setModerationNote] = useState('');
  const [newStatus, setNewStatus] = useState('');

  useEffect(() => {
    fetchReviews();
  }, []);

  const fetchReviews = async () => {
    try {
      setIsLoading(true);
      // Симуляция данных отзывов
      setReviews([
        {
          _id: '1',
          customerName: 'Иван Петров',
          customerEmail: 'ivan@example.com',
          rating: 5,
          title: 'Отличный сервис!',
          content: 'Очень доволен покупкой BMW 3 Series. Менеджеры профессиональные, все объяснили подробно.',
          carModel: 'BMW 3 Series',
          status: 'approved',
          isVerified: true,
          createdAt: '2024-01-15T10:30:00Z',
          moderatedAt: '2024-01-15T11:00:00Z'
        },
        {
          _id: '2',
          customerName: 'Мария Сидорова',
          customerEmail: 'maria@example.com',
          rating: 4,
          title: 'Хорошее обслуживание',
          content: 'Быстро и качественно провели ТО. Единственный минус - долго ждали запчасти.',
          serviceType: 'Техническое обслуживание',
          status: 'pending',
          isVerified: false,
          createdAt: '2024-01-14T14:20:00Z'
        },
        {
          _id: '3',
          customerName: 'Анонимный пользователь',
          customerEmail: 'anon@example.com',
          rating: 2,
          title: 'Не очень',
          content: 'Плохой отзыв с нецензурной лексикой...',
          carModel: 'Audi A4',
          status: 'rejected',
          isVerified: false,
          createdAt: '2024-01-13T16:45:00Z',
          moderatedAt: '2024-01-13T17:00:00Z'
        }
      ]);
    } catch (error) {
      toast({
        title: 'Ошибка',
        description: 'Не удалось загрузить отзывы',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleModerate = async () => {
    if (!selectedReview || !newStatus) return;

    try {
      toast({
        title: 'Успешно',
        description: `Отзыв ${newStatus === 'approved' ? 'одобрен' : 'отклонен'}`,
      });
      
      setIsDialogOpen(false);
      setSelectedReview(null);
      setModerationNote('');
      setNewStatus('');
      fetchReviews();
    } catch (error) {
      toast({
        title: 'Ошибка',
        description: 'Не удалось обновить статус отзыва',
        variant: 'destructive',
      });
    }
  };

  const handleView = (review: Review) => {
    setSelectedReview(review);
    setNewStatus(review.status);
    setIsDialogOpen(true);
  };

  const handleDelete = async (review: Review) => {
    if (window.confirm('Вы уверены, что хотите удалить этот отзыв?')) {
      try {
        toast({
          title: 'Успешно',
          description: 'Отзыв удален',
        });
        fetchReviews();
      } catch (error) {
        toast({
          title: 'Ошибка',
          description: 'Не удалось удалить отзыв',
          variant: 'destructive',
        });
      }
    }
  };

  const getStatusBadge = (status: string) => {
    const variants = {
      approved: 'default',
      pending: 'secondary',
      rejected: 'destructive'
    } as const;

    const labels = {
      approved: 'Одобрен',
      pending: 'На модерации',
      rejected: 'Отклонен'
    };

    return (
      <Badge variant={variants[status as keyof typeof variants] || 'outline'}>
        {labels[status as keyof typeof labels] || status}
      </Badge>
    );
  };

  const renderStars = (rating: number) => {
    return (
      <div className="flex items-center space-x-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Icon
            key={star}
            name="Star"
            size={14}
            className={star <= rating ? 'text-yellow-500 fill-current' : 'text-gray-300'}
          />
        ))}
        <span className="text-sm ml-1">({rating})</span>
      </div>
    );
  };

  const columns: Column<Review>[] = [
    {
      key: 'customerName',
      title: 'Клиент',
      sortable: true
    },
    {
      key: 'title',
      title: 'Заголовок',
      sortable: true
    },
    {
      key: 'rating',
      title: 'Оценка',
      sortable: true,
      render: (rating) => renderStars(rating)
    },
    {
      key: 'carModel',
      title: 'Автомобиль/Услуга',
      render: (_, review) => review.carModel || review.serviceType || '-'
    },
    {
      key: 'status',
      title: 'Статус',
      render: (status) => getStatusBadge(status)
    },
    {
      key: 'isVerified',
      title: 'Проверен',
      render: (verified) => verified ? <Badge variant="outline">Да</Badge> : null
    },
    {
      key: 'createdAt',
      title: 'Дата создания',
      sortable: true,
      render: (date) => new Date(date).toLocaleDateString('ru-RU')
    }
  ];

  const pendingReviews = reviews.filter(r => r.status === 'pending');
  const approvedReviews = reviews.filter(r => r.status === 'approved');
  const averageRating = reviews.length > 0 
    ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length 
    : 0;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Управление отзывами</h1>
          <p className="text-muted-foreground">Модерация и управление отзывами клиентов</p>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Всего отзывов</p>
                <p className="text-2xl font-bold">{reviews.length}</p>
              </div>
              <div className="p-3 rounded-full bg-blue-100">
                <Icon name="MessageSquare" size={24} className="text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">На модерации</p>
                <p className="text-2xl font-bold">{pendingReviews.length}</p>
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
                <p className="text-sm font-medium text-muted-foreground">Одобренные</p>
                <p className="text-2xl font-bold">{approvedReviews.length}</p>
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
                <p className="text-sm font-medium text-muted-foreground">Средняя оценка</p>
                <p className="text-2xl font-bold">{averageRating.toFixed(1)}</p>
              </div>
              <div className="p-3 rounded-full bg-purple-100">
                <Icon name="Star" size={24} className="text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Список отзывов</CardTitle>
        </CardHeader>
        <CardContent>
          <DataTable
            data={reviews}
            columns={columns}
            onView={handleView}
            onDelete={handleDelete}
            searchPlaceholder="Поиск отзывов..."
            isLoading={isLoading}
          />
        </CardContent>
      </Card>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Модерация отзыва</DialogTitle>
          </DialogHeader>
          {selectedReview && (
            <div className="space-y-4">
              <div className="border rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-medium">{selectedReview.title}</h4>
                  {renderStars(selectedReview.rating)}
                </div>
                <p className="text-sm text-gray-600 mb-2">
                  От: {selectedReview.customerName} ({selectedReview.customerEmail})
                </p>
                <p className="text-sm mb-2">{selectedReview.content}</p>
                <div className="text-xs text-gray-500">
                  {selectedReview.carModel && `Автомобиль: ${selectedReview.carModel}`}
                  {selectedReview.serviceType && `Услуга: ${selectedReview.serviceType}`}
                </div>
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">Статус</label>
                <Select value={newStatus} onValueChange={setNewStatus}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="approved">Одобрить</SelectItem>
                    <SelectItem value="rejected">Отклонить</SelectItem>
                    <SelectItem value="pending">На модерации</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">Комментарий модератора</label>
                <Textarea
                  value={moderationNote}
                  onChange={(e) => setModerationNote(e.target.value)}
                  placeholder="Причина отклонения или дополнительные комментарии..."
                  rows={3}
                />
              </div>

              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Отмена
                </Button>
                <Button onClick={handleModerate}>
                  Сохранить
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ReviewsManagement;