import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { apiClient, Car } from '@/lib/api';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from '@/hooks/use-toast';
import DataTable, { Column } from '@/components/admin/DataTable';
import Icon from '@/components/ui/icon';

const CarsManagement: React.FC = () => {
  const [cars, setCars] = useState<Car[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingCar, setEditingCar] = useState<Car | null>(null);
  const [formData, setFormData] = useState({
    brand: '',
    model: '',
    year: new Date().getFullYear(),
    price: 0,
    mileage: 0,
    fuelType: '',
    transmission: '',
    bodyType: '',
    engineVolume: 0,
    power: 0,
    color: '',
    vin: '',
    status: 'available' as 'available' | 'sold' | 'reserved',
    images: [''],
    features: [''],
    description: '',
    isNew: true,
    isHit: false
  });

  const { hasPermission } = useAuth();

  useEffect(() => {
    fetchCars();
  }, []);

  const fetchCars = async () => {
    try {
      setIsLoading(true);
      const response = await apiClient.getCars();
      if (response.success && response.data) {
        setCars(response.data);
      }
    } catch (error) {
      toast({
        title: 'Ошибка',
        description: 'Не удалось загрузить автомобили',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const carData = {
        ...formData,
        images: formData.images.filter(img => img.trim() !== ''),
        features: formData.features.filter(feature => feature.trim() !== '')
      };

      if (editingCar) {
        const response = await apiClient.updateCar(editingCar._id, carData);
        if (response.success) {
          toast({
            title: 'Успешно',
            description: 'Автомобиль обновлен',
          });
        }
      } else {
        const response = await apiClient.createCar(carData);
        if (response.success) {
          toast({
            title: 'Успешно',
            description: 'Автомобиль добавлен',
          });
        }
      }
      
      setIsDialogOpen(false);
      setEditingCar(null);
      resetForm();
      fetchCars();
    } catch (error) {
      toast({
        title: 'Ошибка',
        description: 'Не удалось сохранить автомобиль',
        variant: 'destructive',
      });
    }
  };

  const handleEdit = (car: Car) => {
    setEditingCar(car);
    setFormData({
      brand: car.brand,
      model: car.model,
      year: car.year,
      price: car.price,
      mileage: car.mileage,
      fuelType: car.fuelType,
      transmission: car.transmission,
      bodyType: car.bodyType,
      engineVolume: car.engineVolume,
      power: car.power,
      color: car.color,
      vin: car.vin,
      status: car.status,
      images: car.images.length > 0 ? car.images : [''],
      features: car.features.length > 0 ? car.features : [''],
      description: car.description,
      isNew: car.isNew,
      isHit: car.isHit
    });
    setIsDialogOpen(true);
  };

  const handleDelete = async (car: Car) => {
    if (window.confirm('Вы уверены, что хотите удалить этот автомобиль?')) {
      try {
        const response = await apiClient.deleteCar(car._id);
        if (response.success) {
          toast({
            title: 'Успешно',
            description: 'Автомобиль удален',
          });
          fetchCars();
        }
      } catch (error) {
        toast({
          title: 'Ошибка',
          description: 'Не удалось удалить автомобиль',
          variant: 'destructive',
        });
      }
    }
  };

  const resetForm = () => {
    setFormData({
      brand: '',
      model: '',
      year: new Date().getFullYear(),
      price: 0,
      mileage: 0,
      fuelType: '',
      transmission: '',
      bodyType: '',
      engineVolume: 0,
      power: 0,
      color: '',
      vin: '',
      status: 'available',
      images: [''],
      features: [''],
      description: '',
      isNew: true,
      isHit: false
    });
  };

  const addImageField = () => {
    setFormData({
      ...formData,
      images: [...formData.images, '']
    });
  };

  const removeImageField = (index: number) => {
    setFormData({
      ...formData,
      images: formData.images.filter((_, i) => i !== index)
    });
  };

  const addFeatureField = () => {
    setFormData({
      ...formData,
      features: [...formData.features, '']
    });
  };

  const removeFeatureField = (index: number) => {
    setFormData({
      ...formData,
      features: formData.features.filter((_, i) => i !== index)
    });
  };

  const columns: Column<Car>[] = [
    {
      key: 'brand',
      title: 'Марка',
      sortable: true,
      render: (_, car) => `${car.brand} ${car.model}`
    },
    {
      key: 'year',
      title: 'Год',
      sortable: true
    },
    {
      key: 'price',
      title: 'Цена',
      sortable: true,
      render: (price) => `${price.toLocaleString('ru-RU')} ₽`
    },
    {
      key: 'mileage',
      title: 'Пробег',
      sortable: true,
      render: (mileage) => `${mileage.toLocaleString('ru-RU')} км`
    },
    {
      key: 'status',
      title: 'Статус',
      render: (status) => (
        <Badge variant={
          status === 'available' ? 'default' :
          status === 'sold' ? 'destructive' : 'secondary'
        }>
          {status === 'available' ? 'Доступен' :
           status === 'sold' ? 'Продан' : 'Зарезервирован'}
        </Badge>
      )
    },
    {
      key: 'isNew',
      title: 'Новый',
      render: (isNew) => isNew ? <Badge>Новый</Badge> : null
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Управление автомобилями</h1>
          <p className="text-muted-foreground">Управление каталогом автомобилей</p>
        </div>
        
        {hasPermission('cars.create') && (
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={() => { resetForm(); setEditingCar(null); }}>
                <Icon name="Plus" size={16} className="mr-2" />
                Добавить автомобиль
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>
                  {editingCar ? 'Редактировать автомобиль' : 'Добавить автомобиль'}
                </DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium mb-1 block">Марка</label>
                    <Input
                      value={formData.brand}
                      onChange={(e) => setFormData({...formData, brand: e.target.value})}
                      required
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-1 block">Модель</label>
                    <Input
                      value={formData.model}
                      onChange={(e) => setFormData({...formData, model: e.target.value})}
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="text-sm font-medium mb-1 block">Год</label>
                    <Input
                      type="number"
                      value={formData.year}
                      onChange={(e) => setFormData({...formData, year: parseInt(e.target.value)})}
                      required
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-1 block">Цена</label>
                    <Input
                      type="number"
                      value={formData.price}
                      onChange={(e) => setFormData({...formData, price: parseInt(e.target.value)})}
                      required
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-1 block">Пробег</label>
                    <Input
                      type="number"
                      value={formData.mileage}
                      onChange={(e) => setFormData({...formData, mileage: parseInt(e.target.value)})}
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium mb-1 block">Тип топлива</label>
                    <Select value={formData.fuelType} onValueChange={(value) => setFormData({...formData, fuelType: value})}>
                      <SelectTrigger>
                        <SelectValue placeholder="Выберите тип топлива" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Бензин">Бензин</SelectItem>
                        <SelectItem value="Дизель">Дизель</SelectItem>
                        <SelectItem value="Гибрид">Гибрид</SelectItem>
                        <SelectItem value="Электро">Электро</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-1 block">КПП</label>
                    <Select value={formData.transmission} onValueChange={(value) => setFormData({...formData, transmission: value})}>
                      <SelectTrigger>
                        <SelectValue placeholder="Выберите КПП" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Механика">Механика</SelectItem>
                        <SelectItem value="Автомат">Автомат</SelectItem>
                        <SelectItem value="Робот">Робот</SelectItem>
                        <SelectItem value="Вариатор">Вариатор</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium mb-1 block">Тип кузова</label>
                    <Input
                      value={formData.bodyType}
                      onChange={(e) => setFormData({...formData, bodyType: e.target.value})}
                      required
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-1 block">Цвет</label>
                    <Input
                      value={formData.color}
                      onChange={(e) => setFormData({...formData, color: e.target.value})}
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="text-sm font-medium mb-1 block">Объем двигателя</label>
                    <Input
                      type="number"
                      step="0.1"
                      value={formData.engineVolume}
                      onChange={(e) => setFormData({...formData, engineVolume: parseFloat(e.target.value)})}
                      required
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-1 block">Мощность</label>
                    <Input
                      type="number"
                      value={formData.power}
                      onChange={(e) => setFormData({...formData, power: parseInt(e.target.value)})}
                      required
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-1 block">Статус</label>
                    <Select value={formData.status} onValueChange={(value: any) => setFormData({...formData, status: value})}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="available">Доступен</SelectItem>
                        <SelectItem value="sold">Продан</SelectItem>
                        <SelectItem value="reserved">Зарезервирован</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium mb-1 block">VIN номер</label>
                  <Input
                    value={formData.vin}
                    onChange={(e) => setFormData({...formData, vin: e.target.value})}
                    required
                  />
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">Изображения</label>
                  {formData.images.map((image, index) => (
                    <div key={index} className="flex gap-2 mb-2">
                      <Input
                        value={image}
                        onChange={(e) => {
                          const newImages = [...formData.images];
                          newImages[index] = e.target.value;
                          setFormData({...formData, images: newImages});
                        }}
                        placeholder="URL изображения"
                      />
                      {formData.images.length > 1 && (
                        <Button type="button" variant="outline" size="icon" onClick={() => removeImageField(index)}>
                          <Icon name="X" size={16} />
                        </Button>
                      )}
                    </div>
                  ))}
                  <Button type="button" variant="outline" onClick={addImageField}>
                    <Icon name="Plus" size={16} className="mr-2" />
                    Добавить изображение
                  </Button>
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">Особенности</label>
                  {formData.features.map((feature, index) => (
                    <div key={index} className="flex gap-2 mb-2">
                      <Input
                        value={feature}
                        onChange={(e) => {
                          const newFeatures = [...formData.features];
                          newFeatures[index] = e.target.value;
                          setFormData({...formData, features: newFeatures});
                        }}
                        placeholder="Особенность"
                      />
                      {formData.features.length > 1 && (
                        <Button type="button" variant="outline" size="icon" onClick={() => removeFeatureField(index)}>
                          <Icon name="X" size={16} />
                        </Button>
                      )}
                    </div>
                  ))}
                  <Button type="button" variant="outline" onClick={addFeatureField}>
                    <Icon name="Plus" size={16} className="mr-2" />
                    Добавить особенность
                  </Button>
                </div>

                <div>
                  <label className="text-sm font-medium mb-1 block">Описание</label>
                  <Textarea
                    value={formData.description}
                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                    rows={3}
                  />
                </div>

                <div className="flex space-x-4">
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="isNew"
                      checked={formData.isNew}
                      onChange={(e) => setFormData({...formData, isNew: e.target.checked})}
                    />
                    <label htmlFor="isNew" className="text-sm font-medium">
                      Новый автомобиль
                    </label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="isHit"
                      checked={formData.isHit}
                      onChange={(e) => setFormData({...formData, isHit: e.target.checked})}
                    />
                    <label htmlFor="isHit" className="text-sm font-medium">
                      Хит продаж
                    </label>
                  </div>
                </div>
                
                <div className="flex justify-end space-x-2">
                  <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                    Отмена
                  </Button>
                  <Button type="submit">
                    {editingCar ? 'Обновить' : 'Создать'}
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        )}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Список автомобилей</CardTitle>
        </CardHeader>
        <CardContent>
          <DataTable
            data={cars}
            columns={columns}
            onEdit={hasPermission('cars.update') ? handleEdit : undefined}
            onDelete={hasPermission('cars.delete') ? handleDelete : undefined}
            searchPlaceholder="Поиск автомобилей..."
            isLoading={isLoading}
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default CarsManagement;