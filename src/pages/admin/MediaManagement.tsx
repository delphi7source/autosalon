import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from '@/hooks/use-toast';
import Icon from '@/components/ui/icon';

interface MediaFile {
  _id: string;
  filename: string;
  originalName: string;
  mimeType: string;
  size: number;
  url: string;
  alt: string;
  category: string;
  uploadedBy: string;
  createdAt: string;
}

const MediaManagement: React.FC = () => {
  const [mediaFiles, setMediaFiles] = useState<MediaFile[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  useEffect(() => {
    fetchMediaFiles();
  }, []);

  const fetchMediaFiles = async () => {
    try {
      setIsLoading(true);
      // Симуляция данных медиафайлов
      setMediaFiles([
        {
          _id: '1',
          filename: 'bmw-3-series-1.jpg',
          originalName: 'BMW 3 Series Front.jpg',
          mimeType: 'image/jpeg',
          size: 2048576,
          url: '/img/35658ce2-0e0f-41a4-a417-c35990cabc29.jpg',
          alt: 'BMW 3 Series вид спереди',
          category: 'cars',
          uploadedBy: 'admin',
          createdAt: '2024-01-15T10:30:00Z'
        },
        {
          _id: '2',
          filename: 'audi-a4-1.jpg',
          originalName: 'Audi A4 Side.jpg',
          mimeType: 'image/jpeg',
          size: 1856432,
          url: '/img/b6e0d970-0bdc-442d-af99-f0a51ff0863e.jpg',
          alt: 'Audi A4 вид сбоку',
          category: 'cars',
          uploadedBy: 'manager',
          createdAt: '2024-01-14T14:20:00Z'
        },
        {
          _id: '3',
          filename: 'mercedes-c-class-1.jpg',
          originalName: 'Mercedes C-Class.jpg',
          mimeType: 'image/jpeg',
          size: 2234567,
          url: '/img/8da9e761-2e1b-453f-9c89-1afd4df236ee.jpg',
          alt: 'Mercedes C-Class',
          category: 'cars',
          uploadedBy: 'admin',
          createdAt: '2024-01-13T16:45:00Z'
        }
      ]);
    } catch (error) {
      toast({
        title: 'Ошибка',
        description: 'Не удалось загрузить медиафайлы',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpload = async (files: FileList | null) => {
    if (!files || files.length === 0) return;

    try {
      // Симуляция загрузки файлов
      toast({
        title: 'Файлы загружены',
        description: `Загружено ${files.length} файлов`,
      });
      
      fetchMediaFiles();
    } catch (error) {
      toast({
        title: 'Ошибка',
        description: 'Не удалось загрузить файлы',
        variant: 'destructive',
      });
    }
  };

  const handleDelete = async (file: MediaFile) => {
    if (window.confirm('Вы уверены, что хотите удалить этот файл?')) {
      try {
        toast({
          title: 'Успешно',
          description: 'Файл удален',
        });
        fetchMediaFiles();
      } catch (error) {
        toast({
          title: 'Ошибка',
          description: 'Не удалось удалить файл',
          variant: 'destructive',
        });
      }
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getFileIcon = (mimeType: string) => {
    if (mimeType.startsWith('image/')) return 'Image';
    if (mimeType.startsWith('video/')) return 'Video';
    if (mimeType.startsWith('audio/')) return 'Music';
    if (mimeType.includes('pdf')) return 'FileText';
    return 'File';
  };

  const getCategoryBadge = (category: string) => {
    const labels = {
      cars: 'Автомобили',
      banners: 'Баннеры',
      news: 'Новости',
      other: 'Прочее'
    };

    return (
      <Badge variant="outline">
        {labels[category as keyof typeof labels] || category}
      </Badge>
    );
  };

  const filteredFiles = mediaFiles.filter(file => 
    selectedCategory === 'all' || file.category === selectedCategory
  );

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Icon name="Loader2" size={32} className="animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Медиа файлы</h1>
          <p className="text-muted-foreground">Управление изображениями и файлами</p>
        </div>
        
        <div className="flex items-center space-x-2">
          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Все категории</SelectItem>
              <SelectItem value="cars">Автомобили</SelectItem>
              <SelectItem value="banners">Баннеры</SelectItem>
              <SelectItem value="news">Новости</SelectItem>
              <SelectItem value="other">Прочее</SelectItem>
            </SelectContent>
          </Select>
          
          <Button
            variant="outline"
            size="icon"
            onClick={() => setViewMode(viewMode === 'grid' ? 'list' : 'grid')}
          >
            <Icon name={viewMode === 'grid' ? 'List' : 'Grid3X3'} size={16} />
          </Button>

          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Icon name="Upload" size={16} className="mr-2" />
                Загрузить файлы
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Загрузить новые файлы</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">Выберите файлы</label>
                  <Input
                    type="file"
                    multiple
                    accept="image/*,video/*,audio/*,.pdf,.doc,.docx"
                    onChange={(e) => handleUpload(e.target.files)}
                  />
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block">Категория</label>
                  <Select defaultValue="other">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="cars">Автомобили</SelectItem>
                      <SelectItem value="banners">Баннеры</SelectItem>
                      <SelectItem value="news">Новости</SelectItem>
                      <SelectItem value="other">Прочее</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex justify-end space-x-2">
                  <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                    Отмена
                  </Button>
                  <Button onClick={() => setIsDialogOpen(false)}>
                    Загрузить
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Всего файлов</p>
                <p className="text-2xl font-bold">{filteredFiles.length}</p>
              </div>
              <div className="p-3 rounded-full bg-blue-100">
                <Icon name="File" size={24} className="text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Изображения</p>
                <p className="text-2xl font-bold">
                  {filteredFiles.filter(f => f.mimeType.startsWith('image/')).length}
                </p>
              </div>
              <div className="p-3 rounded-full bg-green-100">
                <Icon name="Image" size={24} className="text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Общий размер</p>
                <p className="text-2xl font-bold">
                  {formatFileSize(filteredFiles.reduce((sum, f) => sum + f.size, 0))}
                </p>
              </div>
              <div className="p-3 rounded-full bg-yellow-100">
                <Icon name="HardDrive" size={24} className="text-yellow-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Загружено сегодня</p>
                <p className="text-2xl font-bold">
                  {filteredFiles.filter(f => 
                    new Date(f.createdAt).toDateString() === new Date().toDateString()
                  ).length}
                </p>
              </div>
              <div className="p-3 rounded-full bg-purple-100">
                <Icon name="Upload" size={24} className="text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Media Grid/List */}
      <Card>
        <CardHeader>
          <CardTitle>Медиа файлы</CardTitle>
        </CardHeader>
        <CardContent>
          {viewMode === 'grid' ? (
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {filteredFiles.map((file) => (
                <div key={file._id} className="border rounded-lg overflow-hidden group">
                  <div className="aspect-square bg-gray-100 flex items-center justify-center relative">
                    {file.mimeType.startsWith('image/') ? (
                      <img 
                        src={file.url} 
                        alt={file.alt}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <Icon name={getFileIcon(file.mimeType)} size={32} className="text-gray-400" />
                    )}
                    <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-all flex items-center justify-center opacity-0 group-hover:opacity-100">
                      <div className="flex space-x-2">
                        <Button size="sm" variant="secondary">
                          <Icon name="Eye" size={14} />
                        </Button>
                        <Button size="sm" variant="secondary">
                          <Icon name="Copy" size={14} />
                        </Button>
                        <Button 
                          size="sm" 
                          variant="destructive"
                          onClick={() => handleDelete(file)}
                        >
                          <Icon name="Trash2" size={14} />
                        </Button>
                      </div>
                    </div>
                  </div>
                  <div className="p-3">
                    <div className="text-sm font-medium truncate" title={file.originalName}>
                      {file.originalName}
                    </div>
                    <div className="text-xs text-gray-500 mt-1">
                      {formatFileSize(file.size)}
                    </div>
                    <div className="mt-2">
                      {getCategoryBadge(file.category)}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="space-y-2">
              {filteredFiles.map((file) => (
                <div key={file._id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                      {file.mimeType.startsWith('image/') ? (
                        <img 
                          src={file.url} 
                          alt={file.alt}
                          className="w-full h-full object-cover rounded-lg"
                        />
                      ) : (
                        <Icon name={getFileIcon(file.mimeType)} size={20} className="text-gray-400" />
                      )}
                    </div>
                    <div>
                      <div className="font-medium">{file.originalName}</div>
                      <div className="text-sm text-gray-500">
                        {formatFileSize(file.size)} • {new Date(file.createdAt).toLocaleDateString('ru-RU')}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    {getCategoryBadge(file.category)}
                    <Button size="sm" variant="outline">
                      <Icon name="Eye" size={14} />
                    </Button>
                    <Button size="sm" variant="outline">
                      <Icon name="Copy" size={14} />
                    </Button>
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => handleDelete(file)}
                    >
                      <Icon name="Trash2" size={14} />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default MediaManagement;