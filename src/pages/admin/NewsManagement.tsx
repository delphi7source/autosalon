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

interface NewsArticle {
  _id: string;
  title: string;
  content: string;
  excerpt: string;
  author: string;
  category: string;
  status: string;
  featured: boolean;
  publishedAt?: string;
  createdAt: string;
  updatedAt: string;
}

const NewsManagement: React.FC = () => {
  const [articles, setArticles] = useState<NewsArticle[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingArticle, setEditingArticle] = useState<NewsArticle | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    excerpt: '',
    author: '',
    category: '',
    status: 'draft',
    featured: false
  });

  useEffect(() => {
    fetchArticles();
  }, []);

  const fetchArticles = async () => {
    try {
      setIsLoading(true);
      // Симуляция данных новостей
      setArticles([
        {
          _id: '1',
          title: 'Новые модели BMW 2024',
          content: 'Подробная статья о новых моделях BMW...',
          excerpt: 'BMW представила новые модели на 2024 год',
          author: 'Редакция',
          category: 'Новинки',
          status: 'published',
          featured: true,
          publishedAt: '2024-01-15T10:00:00Z',
          createdAt: '2024-01-15T09:00:00Z',
          updatedAt: '2024-01-15T10:00:00Z'
        },
        {
          _id: '2',
          title: 'Советы по выбору автомобиля',
          content: 'Полезные советы для покупателей...',
          excerpt: 'Как правильно выбрать автомобиль',
          author: 'Эксперт',
          category: 'Советы',
          status: 'draft',
          featured: false,
          createdAt: '2024-01-14T15:00:00Z',
          updatedAt: '2024-01-14T15:00:00Z'
        }
      ]);
    } catch (error) {
      toast({
        title: 'Ошибка',
        description: 'Не удалось загрузить новости',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      if (editingArticle) {
        toast({
          title: 'Успешно',
          description: 'Статья обновлена',
        });
      } else {
        toast({
          title: 'Успешно',
          description: 'Статья создана',
        });
      }
      
      setIsDialogOpen(false);
      setEditingArticle(null);
      resetForm();
      fetchArticles();
    } catch (error) {
      toast({
        title: 'Ошибка',
        description: 'Не удалось сохранить статью',
        variant: 'destructive',
      });
    }
  };

  const handleEdit = (article: NewsArticle) => {
    setEditingArticle(article);
    setFormData({
      title: article.title,
      content: article.content,
      excerpt: article.excerpt,
      author: article.author,
      category: article.category,
      status: article.status,
      featured: article.featured
    });
    setIsDialogOpen(true);
  };

  const handleDelete = async (article: NewsArticle) => {
    if (window.confirm('Вы уверены, что хотите удалить эту статью?')) {
      try {
        toast({
          title: 'Успешно',
          description: 'Статья удалена',
        });
        fetchArticles();
      } catch (error) {
        toast({
          title: 'Ошибка',
          description: 'Не удалось удалить статью',
          variant: 'destructive',
        });
      }
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      content: '',
      excerpt: '',
      author: '',
      category: '',
      status: 'draft',
      featured: false
    });
  };

  const getStatusBadge = (status: string) => {
    const variants = {
      published: 'default',
      draft: 'secondary',
      archived: 'outline'
    } as const;

    const labels = {
      published: 'Опубликована',
      draft: 'Черновик',
      archived: 'Архив'
    };

    return (
      <Badge variant={variants[status as keyof typeof variants] || 'outline'}>
        {labels[status as keyof typeof labels] || status}
      </Badge>
    );
  };

  const columns: Column<NewsArticle>[] = [
    {
      key: 'title',
      title: 'Заголовок',
      sortable: true
    },
    {
      key: 'author',
      title: 'Автор',
      sortable: true
    },
    {
      key: 'category',
      title: 'Категория',
      sortable: true
    },
    {
      key: 'status',
      title: 'Статус',
      render: (status) => getStatusBadge(status)
    },
    {
      key: 'featured',
      title: 'Рекомендуемая',
      render: (featured) => featured ? <Badge>Да</Badge> : null
    },
    {
      key: 'publishedAt',
      title: 'Дата публикации',
      sortable: true,
      render: (date) => date ? new Date(date).toLocaleDateString('ru-RU') : '-'
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Управление новостями</h1>
          <p className="text-muted-foreground">Создание и управление новостными статьями</p>
        </div>
        
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => { resetForm(); setEditingArticle(null); }}>
              <Icon name="Plus" size={16} className="mr-2" />
              Создать статью
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {editingArticle ? 'Редактировать статью' : 'Создать статью'}
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="text-sm font-medium mb-1 block">Заголовок</label>
                <Input
                  value={formData.title}
                  onChange={(e) => setFormData({...formData, title: e.target.value})}
                  required
                />
              </div>
              
              <div>
                <label className="text-sm font-medium mb-1 block">Краткое описание</label>
                <Textarea
                  value={formData.excerpt}
                  onChange={(e) => setFormData({...formData, excerpt: e.target.value})}
                  rows={2}
                  placeholder="Краткое описание статьи для превью"
                />
              </div>

              <div>
                <label className="text-sm font-medium mb-1 block">Содержание</label>
                <Textarea
                  value={formData.content}
                  onChange={(e) => setFormData({...formData, content: e.target.value})}
                  rows={10}
                  placeholder="Полный текст статьи"
                  required
                />
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="text-sm font-medium mb-1 block">Автор</label>
                  <Input
                    value={formData.author}
                    onChange={(e) => setFormData({...formData, author: e.target.value})}
                    required
                  />
                </div>
                <div>
                  <label className="text-sm font-medium mb-1 block">Категория</label>
                  <Select value={formData.category} onValueChange={(value) => setFormData({...formData, category: value})}>
                    <SelectTrigger>
                      <SelectValue placeholder="Выберите категорию" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Новинки">Новинки</SelectItem>
                      <SelectItem value="Советы">Советы</SelectItem>
                      <SelectItem value="Обзоры">Обзоры</SelectItem>
                      <SelectItem value="События">События</SelectItem>
                      <SelectItem value="Технологии">Технологии</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="text-sm font-medium mb-1 block">Статус</label>
                  <Select value={formData.status} onValueChange={(value) => setFormData({...formData, status: value})}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="draft">Черновик</SelectItem>
                      <SelectItem value="published">Опубликована</SelectItem>
                      <SelectItem value="archived">Архив</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="featured"
                  checked={formData.featured}
                  onChange={(e) => setFormData({...formData, featured: e.target.checked})}
                />
                <label htmlFor="featured" className="text-sm font-medium">
                  Рекомендуемая статья
                </label>
              </div>
              
              <div className="flex justify-end space-x-2">
                <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Отмена
                </Button>
                <Button type="submit">
                  {editingArticle ? 'Обновить' : 'Создать'}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Список статей</CardTitle>
        </CardHeader>
        <CardContent>
          <DataTable
            data={articles}
            columns={columns}
            onEdit={handleEdit}
            onDelete={handleDelete}
            searchPlaceholder="Поиск статей..."
            isLoading={isLoading}
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default NewsManagement;