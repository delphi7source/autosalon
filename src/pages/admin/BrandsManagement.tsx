import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { toast } from '@/hooks/use-toast';
import DataTable, { Column } from '@/components/admin/DataTable';
import Icon from '@/components/ui/icon';

interface Brand {
  _id: string;
  name: string;
  description: string;
  logo: string;
  website: string;
  country: string;
  isActive: boolean;
  sortOrder: number;
  createdAt: string;
  updatedAt: string;
}

const BrandsManagement: React.FC = () => {
  const [brands, setBrands] = useState<Brand[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingBrand, setEditingBrand] = useState<Brand | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    logo: '',
    website: '',
    country: '',
    isActive: true,
    sortOrder: 0
  });

  useEffect(() => {
    fetchBrands();
  }, []);

  const fetchBrands = async () => {
    try {
      setIsLoading(true);
      // Симуляция данных брендов
      setBrands([
        {
          _id: '1',
          name: 'BMW',
          description: 'Баварский автомобильный завод',
          logo: '/img/bmw-logo.png',
          website: 'https://www.bmw.com',
          country: 'Германия',
          isActive: true,
          sortOrder: 1,
          createdAt: '2024-01-01T00:00:00Z',
          updatedAt: '2024-01-01T00:00:00Z'
        },
        {
          _id: '2',
          name: 'Audi',
          description: 'Немецкий производитель автомобилей',
          logo: '/img/audi-logo.png',
          website: 'https://www.audi.com',
          country: 'Германия',
          isActive: true,
          sortOrder: 2,
          createdAt: '2024-01-01T00:00:00Z',
          updatedAt: '2024-01-01T00:00:00Z'
        },
        {
          _id: '3',
          name: 'Mercedes-Benz',
          description: 'Немецкий производитель премиальных автомобилей',
          logo: '/img/mercedes-logo.png',
          website: 'https://www.mercedes-benz.com',
          country: 'Германия',
          isActive: true,
          sortOrder: 3,
          createdAt: '2024-01-01T00:00:00Z',
          updatedAt: '2024-01-01T00:00:00Z'
        }
      ]);
    } catch (error) {
      toast({
        title: 'Ошибка',
        description: 'Не удалось загрузить бренды',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      if (editingBrand) {
        toast({
          title: 'Успешно',
          description: 'Бренд обновлен',
        });
      } else {
        toast({
          title: 'Успешно',
          description: 'Бренд создан',
        });
      }
      
      setIsDialogOpen(false);
      setEditingBrand(null);
      resetForm();
      fetchBrands();
    } catch (error) {
      toast({
        title: 'Ошибка',
        description: 'Не удалось сохранить бренд',
        variant: 'destructive',
      });
    }
  };

  const handleEdit = (brand: Brand) => {
    setEditingBrand(brand);
    setFormData({
      name: brand.name,
      description: brand.description,
      logo: brand.logo,
      website: brand.website,
      country: brand.country,
      isActive: brand.isActive,
      sortOrder: brand.sortOrder
    });
    setIsDialogOpen(true);
  };

  const handleDelete = async (brand: Brand) => {
    if (window.confirm('Вы уверены, что хотите удалить этот бренд?')) {
      try {
        toast({
          title: 'Успешно',
          description: 'Бренд удален',
        });
        fetchBrands();
      } catch (error) {
        toast({
          title: 'Ошибка',
          description: 'Не удалось удалить бренд',
          variant: 'destructive',
        });
      }
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      logo: '',
      website: '',
      country: '',
      isActive: true,
      sortOrder: 0
    });
  };

  const columns: Column<Brand>[] = [
    {
      key: 'logo',
      title: 'Логотип',
      render: (logo, brand) => (
        <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
          {logo ? (
            <img src={logo} alt={brand.name} className="w-8 h-8 object-contain" />
          ) : (
            <Icon name="Image" size={16} className="text-gray-400" />
          )}
        </div>
      )
    },
    {
      key: 'name',
      title: 'Название',
      sortable: true
    },
    {
      key: 'country',
      title: 'Страна',
      sortable: true
    },
    {
      key: 'website',
      title: 'Сайт',
      render: (website) => website ? (
        <a href={website} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
          {website.replace('https://', '').replace('www.', '')}
        </a>
      ) : '-'
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
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Управление брендами</h1>
          <p className="text-muted-foreground">Управление брендами автомобилей</p>
        </div>
        
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => { resetForm(); setEditingBrand(null); }}>
              <Icon name="Plus" size={16} className="mr-2" />
              Добавить бренд
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {editingBrand ? 'Редактировать бренд' : 'Добавить бренд'}
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="text-sm font-medium mb-1 block">Название</label>
                <Input
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
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

              <div>
                <label className="text-sm font-medium mb-1 block">URL логотипа</label>
                <Input
                  value={formData.logo}
                  onChange={(e) => setFormData({...formData, logo: e.target.value})}
                  placeholder="https://example.com/logo.png"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium mb-1 block">Сайт</label>
                  <Input
                    value={formData.website}
                    onChange={(e) => setFormData({...formData, website: e.target.value})}
                    placeholder="https://example.com"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium mb-1 block">Страна</label>
                  <Input
                    value={formData.country}
                    onChange={(e) => setFormData({...formData, country: e.target.value})}
                    placeholder="Германия"
                  />
                </div>
              </div>

              <div>
                <label className="text-sm font-medium mb-1 block">Порядок сортировки</label>
                <Input
                  type="number"
                  value={formData.sortOrder}
                  onChange={(e) => setFormData({...formData, sortOrder: parseInt(e.target.value)})}
                />
              </div>
              
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="isActive"
                  checked={formData.isActive}
                  onChange={(e) => setFormData({...formData, isActive: e.target.checked})}
                />
                <label htmlFor="isActive" className="text-sm font-medium">
                  Активный бренд
                </label>
              </div>
              
              <div className="flex justify-end space-x-2">
                <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Отмена
                </Button>
                <Button type="submit">
                  {editingBrand ? 'Обновить' : 'Создать'}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Список брендов</CardTitle>
        </CardHeader>
        <CardContent>
          <DataTable
            data={brands}
            columns={columns}
            onEdit={handleEdit}
            onDelete={handleDelete}
            searchPlaceholder="Поиск брендов..."
            isLoading={isLoading}
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default BrandsManagement;