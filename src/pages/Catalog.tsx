import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import Icon from '@/components/ui/icon';

const Catalog = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedBrand, setSelectedBrand] = useState('all');
  const [selectedType, setSelectedType] = useState('all');
  const [priceRange, setPriceRange] = useState([0, 10000000]);
  const [sortBy, setSortBy] = useState('price-asc');

  const cars = [
    {
      id: 1,
      name: 'BMW 3 Series',
      price: 2890000,
      year: 2024,
      fuel: 'Бензин',
      transmission: 'Автомат',
      mileage: '0',
      type: 'Седан',
      brand: 'BMW',
      image: '/img/35658ce2-0e0f-41a4-a417-c35990cabc29.jpg',
      features: ['Кожаный салон', 'Подогрев сидений', 'Навигация', 'Климат-контроль'],
      isNew: true,
      isHit: false
    },
    {
      id: 2,
      name: 'Audi Q5',
      price: 3450000,
      year: 2024,
      fuel: 'Бензин',
      transmission: 'Автомат',
      mileage: '0',
      type: 'Кроссовер',
      brand: 'Audi',
      image: '/img/b6e0d970-0bdc-442d-af99-f0a51ff0863e.jpg',
      features: ['Полный привод', 'Панорамная крыша', 'LED фары', 'Virtual Cockpit'],
      isNew: true,
      isHit: true
    },
    {
      id: 3,
      name: 'Mercedes C-Class Coupe',
      price: 4120000,
      year: 2024,
      fuel: 'Бензин',
      transmission: 'Автомат',
      mileage: '0',
      type: 'Купе',
      brand: 'Mercedes',
      image: '/img/8da9e761-2e1b-453f-9c89-1afd4df236ee.jpg',
      features: ['AMG пакет', 'Премиум звук', 'Автопилот', 'Панорамная крыша'],
      isNew: true,
      isHit: false
    },
    {
      id: 4,
      name: 'BMW X5',
      price: 5200000,
      year: 2023,
      fuel: 'Бензин',
      transmission: 'Автомат',
      mileage: '15000',
      type: 'Кроссовер',
      brand: 'BMW',
      image: '/img/35658ce2-0e0f-41a4-a417-c35990cabc29.jpg',
      features: ['xDrive', 'Harman Kardon', 'Головной дисплей', 'Массаж сидений'],
      isNew: false,
      isHit: false
    },
    {
      id: 5,
      name: 'Audi A4',
      price: 2650000,
      year: 2023,
      fuel: 'Бензин',
      transmission: 'Автомат',
      mileage: '8500',
      type: 'Седан',
      brand: 'Audi',
      image: '/img/b6e0d970-0bdc-442d-af99-f0a51ff0863e.jpg',
      features: ['quattro', 'Matrix LED', 'Bang & Olufsen', 'Адаптивная подвеска'],
      isNew: false,
      isHit: true
    },
    {
      id: 6,
      name: 'Mercedes E-Class',
      price: 3890000,
      year: 2023,
      fuel: 'Гибрид',
      transmission: 'Автомат',
      mileage: '12000',
      type: 'Седан',
      brand: 'Mercedes',
      image: '/img/8da9e761-2e1b-453f-9c89-1afd4df236ee.jpg',
      features: ['MBUX', 'Air Body Control', 'Burmester', 'Multibeam LED'],
      isNew: false,
      isHit: false
    }
  ];

  const brands = ['BMW', 'Audi', 'Mercedes'];
  const types = ['Седан', 'Кроссовер', 'Купе'];

  const filteredCars = cars.filter(car => {
    return (
      car.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
      (selectedBrand === 'all' || car.brand === selectedBrand) &&
      (selectedType === 'all' || car.type === selectedType) &&
      car.price >= priceRange[0] && car.price <= priceRange[1]
    );
  });

  const sortedCars = [...filteredCars].sort((a, b) => {
    switch (sortBy) {
      case 'price-asc':
        return a.price - b.price;
      case 'price-desc':
        return b.price - a.price;
      case 'year-desc':
        return b.year - a.year;
      case 'name-asc':
        return a.name.localeCompare(b.name);
      default:
        return 0;
    }
  });

  const formatPrice = (price: number) => {
    return price.toLocaleString('ru-RU');
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <section className="bg-secondary text-white py-12">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl font-bold mb-4">Каталог автомобилей</h1>
          <p className="text-xl opacity-90">Найдите идеальный автомобиль из нашего обширного каталога</p>
        </div>
      </section>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Filters Sidebar */}
          <div className="lg:col-span-1">
            <Card className="sticky top-4">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Icon name="Filter" size={20} className="mr-2" />
                  Фильтры
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Search */}
                <div>
                  <label className="text-sm font-medium mb-2 block">Поиск</label>
                  <Input
                    placeholder="Модель автомобиля..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>

                {/* Brand Filter */}
                <div>
                  <label className="text-sm font-medium mb-2 block">Марка</label>
                  <Select value={selectedBrand} onValueChange={setSelectedBrand}>
                    <SelectTrigger>
                      <SelectValue placeholder="Выберите марку" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Все марки</SelectItem>
                      {brands.map(brand => (
                        <SelectItem key={brand} value={brand}>{brand}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Type Filter */}
                <div>
                  <label className="text-sm font-medium mb-2 block">Тип кузова</label>
                  <Select value={selectedType} onValueChange={setSelectedType}>
                    <SelectTrigger>
                      <SelectValue placeholder="Выберите тип" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Все типы</SelectItem>
                      {types.map(type => (
                        <SelectItem key={type} value={type}>{type}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Price Range */}
                <div>
                  <label className="text-sm font-medium mb-2 block">
                    Цена: {formatPrice(priceRange[0])} - {formatPrice(priceRange[1])} ₽
                  </label>
                  <Slider
                    value={priceRange}
                    onValueChange={setPriceRange}
                    max={10000000}
                    min={0}
                    step={100000}
                    className="mt-2"
                  />
                </div>

                {/* Reset Filters */}
                <Button 
                  variant="outline" 
                  className="w-full"
                  onClick={() => {
                    setSearchTerm('');
                    setSelectedBrand('all');
                    setSelectedType('all');
                    setPriceRange([0, 10000000]);
                  }}
                >
                  Сбросить фильтры
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Cars Grid */}
          <div className="lg:col-span-3">
            {/* Sort and Results Count */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
              <div>
                <h2 className="text-2xl font-bold text-secondary">
                  Найдено {sortedCars.length} автомобилей
                </h2>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-600">Сортировать:</span>
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="w-48">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="price-asc">По цене (возрастание)</SelectItem>
                    <SelectItem value="price-desc">По цене (убывание)</SelectItem>
                    <SelectItem value="year-desc">По году (новые)</SelectItem>
                    <SelectItem value="name-asc">По названию (А-Я)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Cars Grid */}
            {sortedCars.length === 0 ? (
              <div className="text-center py-12">
                <Icon name="Search" size={48} className="mx-auto text-gray-400 mb-4" />
                <h3 className="text-xl font-semibold text-gray-600 mb-2">Автомобили не найдены</h3>
                <p className="text-gray-500">Попробуйте изменить параметры поиска</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {sortedCars.map((car) => (
                  <Card key={car.id} className="group hover:shadow-xl transition-all duration-300 overflow-hidden">
                    <div className="relative overflow-hidden">
                      <img 
                        src={car.image} 
                        alt={car.name}
                        className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <div className="absolute top-4 right-4 flex flex-col gap-2">
                        {car.isNew && <Badge className="bg-green-600">Новый</Badge>}
                        {car.isHit && <Badge className="bg-primary">Хит</Badge>}
                      </div>
                    </div>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg text-secondary">{car.name}</CardTitle>
                      <div className="text-2xl font-bold text-primary">{formatPrice(car.price)} ₽</div>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-2 gap-2 mb-4 text-sm text-gray-600">
                        <div className="flex items-center">
                          <Icon name="Calendar" size={14} className="mr-1" />
                          {car.year}
                        </div>
                        <div className="flex items-center">
                          <Icon name="Zap" size={14} className="mr-1" />
                          {car.fuel}
                        </div>
                        <div className="flex items-center">
                          <Icon name="Settings" size={14} className="mr-1" />
                          {car.transmission}
                        </div>
                        <div className="flex items-center">
                          <Icon name="Activity" size={14} className="mr-1" />
                          {car.mileage} км
                        </div>
                      </div>
                      
                      <div className="flex flex-wrap gap-1 mb-4">
                        {car.features.slice(0, 2).map((feature, index) => (
                          <Badge key={index} variant="secondary" className="text-xs">
                            {feature}
                          </Badge>
                        ))}
                        {car.features.length > 2 && (
                          <Badge variant="outline" className="text-xs">
                            +{car.features.length - 2}
                          </Badge>
                        )}
                      </div>

                      <div className="flex gap-2">
                        <Link to={`/car/${car.id}`} className="flex-1">
                          <Button className="w-full bg-primary hover:bg-primary/90">
                            Подробнее
                          </Button>
                        </Link>
                        <Button variant="outline" size="icon">
                          <Icon name="Heart" size={16} />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}

            {/* Load More Button */}
            {sortedCars.length > 0 && (
              <div className="text-center mt-8">
                <Button variant="outline" size="lg">
                  Загрузить еще
                  <Icon name="ChevronDown" size={16} className="ml-2" />
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Catalog;