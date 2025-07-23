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

interface Page {
  _id: string;
  title: string;
  slug: string;
  content: string;
  metaTitle: string;
  metaDescription: string;
  status: string;
  template: string;
  isPublished: boolean;
  publishedAt?: string;
  createdAt: string;
  updatedAt: string;
}

const PagesManagement: React.FC = () => {
  const [pages, setPages] = useState<Page[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingPage, setEditingPage] = useState<Page | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    content: '',
    metaTitle: '',
    metaDescription: '',
    status: 'draft',
    template: 'default',
    isPublished: false
  });

  useEffect(() => {
    fetchPages();
  }, []);

  const fetchPages = async () => {
    try {
      setIsLoading(true);
      // Симуляция данных страниц
      setPages([
        {
          _id: '1',
          title: 'О компании',
          slug: 'about',
          content: 'Содержание страницы о компании...',
          metaTitle: 'О компании AutoPremium',
          metaDescription: 'Информация о компании AutoPremium',
          status: 'published',
          template: 'default',
          isPublished: true,
          publishedAt: '2024-01-01T00:00:00Z',
          createdAt: '2024-01-01T00:00:00Z',
          updatedAt: '2024-01-15T10:00:00Z'
        },
        {
          _id: '2',
          title: 'Политика конфиденциальности',
          slug: 'privacy',
          content: 'Текст политики конфиденциальности...',
          metaTitle: 'Политика конфиденциальности',
          metaDescription: 'Политика конфиденциальности AutoPremium',
          status: 'published',
          template: 'legal',
          isPublished: true,
          publishedAt: '2024-01-01T00:00:00Z',
          createdAt: '2024-01-01T00:00:00Z',
          updatedAt: '2024-01-01T00:00:00Z'
        },
        {
          _id: '3',
          title: 'Новая страница',
          slug: 'new-page',
          content: 'Содержание новой страницы...',
          metaTitle: '',
          metaDescription: '',
          status: 'draft',
          template: 'default',
          isPublished: false,
          createdAt: '2024-01-15T12:00:00Z',
          updatedAt: '2024-01-15T12:00:00Z'
        }
      ]);
    } catch (error) {
      toast({
        title: 'Ошибка',
        description: 'Не удалось загрузить страницы',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      if (editingPage) {
        toast({
          title: 'Успешно',
          description: 'Страница обновлена',
        });
      } else {
        toast({
          title: 'Успешно',
          description: 'Страница создана',
        });
      }
      
      setIsDialogOpen(false);
      setEditingPage(null);
      resetForm();
      fetchPages();
    } catch (error) {
      toast({
        title: 'Ошибка',
        description: 'Не удалось сохранить страницу',
        variant: 'destructive',
      });
    }
  };

  const handleEdit = (page: Page) => {
    setEditingPage(page);
    setFormData({
      title: page.title,
      slug: page.slug,
      content: page.content,
      metaTitle: page.metaTitle,
      metaDescription: page.metaDescription,
      status: page.status,
      template: page.template,
      isPublished: page.isPublished
    });
    setIsDialogOpen(true);
  };

  const handleDelete = async (page: Page) => {
    if (window.confirm('Вы уверены, что хотите удалить эту страницу?')) {
      try {
        toast({
          title: 'Успешно',
          description: 'Страница удалена',
        });
        fetchPages();
      } catch (error) {
        toast({
          title: 'Ошибка',
          description: 'Не удалось удалить страницу',
          variant: 'destructive',
        });
      }
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      slug: '',
      content: '',
      metaTitle: '',
      metaDescription: '',
      status: 'draft',
      template: 'default',
      isPublished: false
    });
  };

  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[а-я]/g, (char) => {
        const map: { [key: string]: string } = {
          'а': 'a', 'б': 'b', 'в': 'v', 'г': 'g', 'д': 'd', 'е': 'e', 'ё': 'yo',
          'ж': 'zh', 'з': 'z', 'и': 'i', 'й': 'y', 'к': 'k', 'л': 'l', 'м': 'm',
          'н': 'n', 'о': 'o', 'п': 'p', 'р': 'r', 'с': 's', 'т': 't', 'у': 'u',
          'ф': 'f', 'х': 'h', 'ц': 'ts', 'ч': 'ch', 'ш': 'sh', 'щ': 'sch',
          'ъ': '', 'ы': 'y', 'ь': '', 'э': 'e', 'ю': 'yu', 'я': 'ya'
        };
        return map[char] || char;
      })
      .replace(/[^a-z0-9]/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-|-$/g, '');
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

  const columns: Column<Page>[] = [
    {
      key: 'title',
      title: 'Заголовок',
      sortable: true
    },
    {
      key: 'slug',
      title: 'URL',
      render: (slug) => (
        <code className="text-xs bg-gray-100 px-2 py-1 rounded">/{slug}</code>
      )
    },
    {
      key: 'template',
      title: 'Шаблон',
      sortable: true
    },
    {
      key: 'status',
      title: 'Статус',
      render: (status) => getStatusBadge(status)
    },
    {
      key: 'isPublished',
      title: 'Опубликована',
      render: (published) => published ? <Badge>Да</Badge> : <Badge variant="outline">Нет</Badge>
    },
    {
      key: 'updatedAt',
      title: 'Обновлена',
      sortable: true,
      render: (date) => new Date(date).toLocaleDateString('ru-RU')
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Управление страницами</h1>
          <p className="text-muted-foreground">Создание и редактирование страниц сайта</p>
        </div>
        
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => { resetForm(); setEditingPage(null); }}>
              <Icon name="Plus" size={16} className="mr-2" />
              Создать страницу
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {editingPage ? 'Редактировать страницу' : 'Создать страницу'}
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium mb-1 block">Заголовок</label>
                  <Input
                    value={formData.title}
                    onChange={(e) => {
                      const title = e.target.value;
                      setFormData({
                        ...formData, 
                        title,
                        slug: generateSlug(title),
                        metaTitle: title
                      });
                    }}
                    required
                  />
                </div>
                <div>
                  <label className="text-sm font-medium mb-1 block">URL (slug)</label>
                  <Input
                    value={formData.slug}
                    onChange={(e) => setFormData({...formData, slug: e.target.value})}
                    required
                  />
                </div>
              </div>
              
              <div>
                <label className="text-sm font-medium mb-1 block">Содержание</label>
                <Textarea
                  value={formData.content}
                  onChange={(e) => setFormData({...formData, content: e.target.value})}
                  rows={10}
                  placeholder="HTML содержание страницы"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium mb-1 block">Meta Title</label>
                  <Input
                    value={formData.metaTitle}
                    onChange={(e) => setFormData({...formData, metaTitle: e.target.value})}
                    placeholder="SEO заголовок"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium mb-1 block">Шаблон</label>
                  <Select value={formData.template} onValueChange={(value) => setFormData({...formData, template: value})}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="default">По умолчанию</SelectItem>
                      <SelectItem value="legal">Юридический</SelectItem>
                      <SelectItem value="landing">Лендинг</SelectItem>
                      <SelectItem value="blog">Блог</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <label className="text-sm font-medium mb-1 block">Meta Description</label>
                <Textarea
                  value={formData.metaDescription}
                  onChange={(e) => setFormData({...formData, metaDescription: e.target.value})}
                  rows={2}
                  placeholder="SEO описание"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
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
                <div className="flex items-center space-x-2 pt-6">
                  <input
                    type="checkbox"
                    id="isPublished"
                    checked={formData.isPublished}
                    onChange={(e) => setFormData({...formData, isPublished: e.target.checked})}
                  />
                  <label htmlFor="isPublished" className="text-sm font-medium">
                    Опубликовать страницу
                  </label>
                </div>
              </div>
              
              <div className="flex justify-end space-x-2">
                <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Отмена
                </Button>
                <Button type="submit">
                  {editingPage ? 'Обновить' : 'Создать'}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Список страниц</CardTitle>
        </CardHeader>
        <CardContent>
          <DataTable
            data={pages}
            columns={columns}
            onEdit={handleEdit}
            onDelete={handleDelete}
            searchPlaceholder="Поиск страниц..."
            isLoading={isLoading}
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default PagesManagement;