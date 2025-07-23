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

interface Banner {
  _id: string;
  title: string;
  description: string;
  imageUrl: string;
  linkUrl: string;
  position: string;
  isActive: boolean;
  startDate: string;
  endDate: string;
  clickCount: number;
  impressions: number;
  createdAt: string;
  updatedAt: string;
}

const BannersManagement: React.FC = () => {
  const [banners, setBanners] = useState<Banner[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingBanner, setEditingBanner] = useState<Banner | null>(null);
  const [startDate, setStartDate] = useState<Date>();
  const [endDate, setEndDate] = useState<Date>();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    imageUrl: '',
    linkUrl: '',
    position: 'hero',
    isActive: true
  });

  useEffect(() => {
    fetchBanners();
  }, []);

  const fetchBanners = async () => {
    try {
      setIsLoading(true);
      // Симуляция данных баннеров
      setBanners([
        {
          _id: '1',
          title: 'Новые BMW 2024',
          description: 'Скидки до 15% на новые модели BMW',
          imageUrl: '/img/35658ce2-0e0f-41a4-a417-c35990cabc29.jpg',
          linkUrl: '/catalog?brand=bmw',
          position: 'hero',
          isActive: true,
          startDate: '2024-01-01T00:00:00Z',
          endDate: '2024-03-31T23:59:59Z',
          clickCount: 245,
          impressions: 5420,
          createdAt: '2024-01-01T00:00:00Z',
          updatedAt: '2024-01-15T10:00:00Z'
        },
        {
          _id: '2',
          title: 'Trade-in выгодно',
          description: 'Обменяйте свой автомобиль с выгодой',
          imageUrl: '/img/b6e0d970-0bdc-442d-af99-f0a51ff0863e.jpg',
          linkUrl: '/trade-in',
          position: 'sidebar',
          isActive: true,
          startDate: '2024-01-15T00:00:00Z',
          endDate: '2024-02-29T23:59:59Z',
          clickCount: 89,
          impressions: 2340,
          createdAt: '2024-01-15T00:00:00Z',
          updatedAt: '2024-01-15T00:00:00Z'
        }
      ]);
    } catch (error) {
      toast({
        title: 'Ошибка',
        description: 'Не удалось загрузить баннеры',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const bannerData = {
        ...formData,
        startDate: startDate?.toISOString(),
        endDate: endDate?.toISOString()
      };

      if (editingBanner) {
        toast({
          title: 'Успешно',
          description: 'Баннер обновлен',
        });
      } else {
        toast({
          title: 'Успешно',
          description: 'Баннер создан',
        });
      }
      
      setIsDialogOpen(false);
      setEditingBanner(null);
      resetForm();
      fetchBanners();
    } catch (error) {
      toast({
        title: 'Ошибка',
        description: 'Не удалось сохранить баннер',
        variant: 'destructive',
      });
    }
  };

  const handleEdit = (banner: Banner) => {
    setEditingBanner(banner);
    setFormData({
      title: banner.title,
      description: banner.description,
      imageUrl: banner.imageUrl,
      linkUrl: banner.linkUrl,
      position: banner.position,
      isActive: banner.isActive
    });
    setStartDate(new Date(banner.startDate));
    setEndDate(new Date(banner.endDate));
    setIsDialogOpen(true);
  };

  const handleDelete = async (banner: Banner) => {
    if (window.confirm('Вы уверены, что хотите удалить этот баннер?')) {
      try {
        toast({
          title: 'Успешно',
          description: 'Баннер удален',
        });
        fetchBanners();
      } catch (error) {
        toast({
          title: 'Ошибка',
          description: 'Не удалось удалить баннер',
          variant: 'destructive',
        });
      }
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      imageUrl: '',
      linkUrl: '',
      position: 'hero',
      isActive: true
    });
    setStartDate(undefined);
    setEndDate(undefined);
  };

  const getPositionBadge = (position: string) => {
    const labels = {
      hero: 'Главный баннер',
      sidebar: 'Боковая панель',
      footer: 'Подвал',
      popup: 'Всплывающий'
    };

    return (
      <Badge variant="outline">
        {labels[position as keyof typeof labels] || position}
      </Badge>
    );
  };

  const calculateCTR = (clicks: number, impressions: number) => {
    if (impressions === 0) return 0;
    return ((clicks / impressions) * 100).toFixed(2);
  };

  const columns: Column<Banner>[] = [
    {
      key: 'imageUrl',
      title: 'Превью',
      render: (imageUrl, banner) => (
        <div className="w-16 h-10 bg-gray-100 rounded overflow-hidden">
          <img src={imageUrl} alt={banner.title} className="w-full h-full object-cover" />
        </div>
      )
    },
    {
      key: 'title',
      title: 'Название',
      sortable: true
    },
    {
      key: 'position',
      title: 'Позиция',
      render: (position) => getPositionBadge(position)
    },
    {
      key: 'clickCount',
      title: 'Клики',
      sortable: true
    },
    {
      key: 'impressions',
      title: 'Показы',
      sortable: true
    },
    {
      key: 'ctr',
      title: 'CTR',
      render: (_, banner) => `${calculateCTR(banner.clickCount, banner.impressions)}%`
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
      key: 'endDate',
      title: 'Действует до',
      sortable: true,
      render: (date) => new Date(date).toLocaleDateString('ru-RU')
    }
  ];

  const activeBanners = banners.filter(b => b.isActive);
  const totalClicks = banners.reduce((sum, b) => sum + b.clickCount, 0);
  const totalImpressions = banners.reduce((sum, b) => sum + b.impressions, 0);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Управление баннерами</h1>
          <p className="text-muted-foreground">Создание и управление рекламными баннерами</p>
        </div>
        
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => { resetForm(); setEditingBanner(null); }}>
              <Icon name="Plus" size={16} className="mr-2" />
              Создать баннер
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>
                {editingBanner ? 'Редактировать баннер' : 'Создать баннер'}
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
                  rows={2}
                />
              </div>

              <div>
                <label className="text-sm font-medium mb-1 block">URL изображения</label>
                <Input
                  value={formData.imageUrl}
                  onChange={(e) => setFormData({...formData, imageUrl: e.target.value})}
                  placeholder="https://example.com/banner.jpg"
                  required
                />
              </div>

              <div>
                <label className="text-sm font-medium mb-1 block">Ссылка</label>
                <Input
                  value={formData.linkUrl}
                  onChange={(e) => setFormData({...formData, linkUrl: e.target.value})}
                  placeholder="/catalog или https://example.com"
                />
              </div>

              <div>
                <label className="text-sm font-medium mb-1 block">Позиция</label>
                <Select value={formData.position} onValueChange={(value) => setFormData({...formData, position: value})}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="hero">Главный баннер</SelectItem>
                    <SelectItem value="sidebar">Боковая панель</SelectItem>
                    <SelectItem value="footer">Подвал</SelectItem>
                    <SelectItem value="popup">Всплывающий</SelectItem>
                  </SelectContent>
                </Select>
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
                  Активный баннер
                </label>
              </div>
              
              <div className="flex justify-end space-x-2">
                <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Отмена
                </Button>
                <Button type="submit">
                  {editingBanner ? 'Обновить' : 'Создать'}
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
                <p className="text-sm font-medium text-muted-foreground">Всего баннеров</p>
                <p className="text-2xl font-bold">{banners.length}</p>
              </div>
              <div className="p-3 rounded-full bg-blue-100">
                <Icon name="Layout" size={24} className="text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Активные</p>
                <p className="text-2xl font-bold">{activeBanners.length}</p>
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
                <p className="text-sm font-medium text-muted-foreground">Всего кликов</p>
                <p className="text-2xl font-bold">{totalClicks}</p>
              </div>
              <div className="p-3 rounded-full bg-yellow-100">
                <Icon name="MousePointer" size={24} className="text-yellow-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Средний CTR</p>
                <p className="text-2xl font-bold">{calculateCTR(totalClicks, totalImpressions)}%</p>
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
          <CardTitle>Список баннеров</CardTitle>
        </CardHeader>
        <CardContent>
          <DataTable
            data={banners}
            columns={columns}
            onEdit={handleEdit}
            onDelete={handleDelete}
            searchPlaceholder="Поиск баннеров..."
            isLoading={isLoading}
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default BannersManagement;