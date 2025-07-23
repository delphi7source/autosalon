import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { format } from 'date-fns';
import { ru } from 'date-fns/locale';
import { toast } from '@/hooks/use-toast';
import Icon from '@/components/ui/icon';

const ReportsPage: React.FC = () => {
  const [selectedReport, setSelectedReport] = useState('');
  const [dateFrom, setDateFrom] = useState<Date>();
  const [dateTo, setDateTo] = useState<Date>();
  const [isGenerating, setIsGenerating] = useState(false);

  const reportTypes = [
    {
      id: 'sales',
      name: 'Отчет по продажам',
      description: 'Детальный отчет по продажам автомобилей',
      icon: 'ShoppingCart'
    },
    {
      id: 'revenue',
      name: 'Финансовый отчет',
      description: 'Отчет по доходам и расходам',
      icon: 'DollarSign'
    },
    {
      id: 'customers',
      name: 'Отчет по клиентам',
      description: 'Анализ клиентской базы',
      icon: 'Users'
    },
    {
      id: 'inventory',
      name: 'Отчет по складу',
      description: 'Состояние автопарка',
      icon: 'Package'
    },
    {
      id: 'services',
      name: 'Отчет по сервису',
      description: 'Статистика сервисного обслуживания',
      icon: 'Wrench'
    },
    {
      id: 'marketing',
      name: 'Маркетинговый отчет',
      description: 'Эффективность маркетинговых кампаний',
      icon: 'TrendingUp'
    }
  ];

  const recentReports = [
    {
      name: 'Продажи за июнь 2024',
      type: 'sales',
      date: '2024-07-01',
      status: 'completed',
      size: '2.4 MB'
    },
    {
      name: 'Финансовый отчет Q2 2024',
      type: 'revenue',
      date: '2024-06-30',
      status: 'completed',
      size: '1.8 MB'
    },
    {
      name: 'Клиентская база май 2024',
      type: 'customers',
      date: '2024-06-01',
      status: 'completed',
      size: '3.2 MB'
    }
  ];

  const handleGenerateReport = async () => {
    if (!selectedReport) {
      toast({
        title: 'Ошибка',
        description: 'Выберите тип отчета',
        variant: 'destructive',
      });
      return;
    }

    setIsGenerating(true);
    
    try {
      // Симуляция генерации отчета
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      toast({
        title: 'Отчет готов',
        description: 'Отчет успешно сгенерирован и готов к скачиванию',
      });
    } catch (error) {
      toast({
        title: 'Ошибка',
        description: 'Не удалось сгенерировать отчет',
        variant: 'destructive',
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const getStatusBadge = (status: string) => {
    const variants = {
      completed: 'default',
      processing: 'secondary',
      failed: 'destructive'
    } as const;

    const labels = {
      completed: 'Готов',
      processing: 'Обработка',
      failed: 'Ошибка'
    };

    return (
      <Badge variant={variants[status as keyof typeof variants] || 'outline'}>
        {labels[status as keyof typeof labels] || status}
      </Badge>
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Отчеты</h1>
          <p className="text-muted-foreground">Генерация и управление отчетами</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Report Generation */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Создать новый отчет</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <label className="text-sm font-medium mb-3 block">Тип отчета</label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {reportTypes.map((report) => (
                    <div
                      key={report.id}
                      className={`border rounded-lg p-4 cursor-pointer transition-all ${
                        selectedReport === report.id
                          ? 'border-primary bg-primary/5'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                      onClick={() => setSelectedReport(report.id)}
                    >
                      <div className="flex items-start space-x-3">
                        <div className="p-2 bg-primary/10 rounded-lg">
                          <Icon name={report.icon} size={20} className="text-primary" />
                        </div>
                        <div>
                          <h4 className="font-medium">{report.name}</h4>
                          <p className="text-sm text-gray-600 mt-1">{report.description}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">Дата начала</label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className="w-full justify-start text-left font-normal"
                      >
                        <Icon name="Calendar" size={16} className="mr-2" />
                        {dateFrom ? format(dateFrom, "PPP", { locale: ru }) : "Выберите дату"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={dateFrom}
                        onSelect={setDateFrom}
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
                        {dateTo ? format(dateTo, "PPP", { locale: ru }) : "Выберите дату"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={dateTo}
                        onSelect={setDateTo}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">Формат отчета</label>
                <Select defaultValue="excel">
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="excel">Excel (.xlsx)</SelectItem>
                    <SelectItem value="pdf">PDF</SelectItem>
                    <SelectItem value="csv">CSV</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Button 
                onClick={handleGenerateReport}
                disabled={isGenerating}
                className="w-full"
              >
                {isGenerating ? (
                  <>
                    <Icon name="Loader2" size={16} className="mr-2 animate-spin" />
                    Генерация отчета...
                  </>
                ) : (
                  <>
                    <Icon name="FileText" size={16} className="mr-2" />
                    Сгенерировать отчет
                  </>
                )}
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Recent Reports */}
        <div>
          <Card>
            <CardHeader>
              <CardTitle>Последние отчеты</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentReports.map((report, index) => (
                  <div key={index} className="border rounded-lg p-3">
                    <div className="flex items-start justify-between mb-2">
                      <h4 className="font-medium text-sm">{report.name}</h4>
                      {getStatusBadge(report.status)}
                    </div>
                    <div className="text-xs text-gray-600 space-y-1">
                      <div>Дата: {new Date(report.date).toLocaleDateString('ru-RU')}</div>
                      <div>Размер: {report.size}</div>
                    </div>
                    <div className="flex space-x-2 mt-3">
                      <Button size="sm" variant="outline" className="flex-1">
                        <Icon name="Download" size={14} className="mr-1" />
                        Скачать
                      </Button>
                      <Button size="sm" variant="outline">
                        <Icon name="Eye" size={14} />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="mt-6">
            <CardHeader>
              <CardTitle>Автоматические отчеты</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm">Ежедневные продажи</span>
                  <Badge variant="default">Включен</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Еженедельная аналитика</span>
                  <Badge variant="default">Включен</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Месячный финансовый</span>
                  <Badge variant="outline">Отключен</Badge>
                </div>
              </div>
              <Button variant="outline" className="w-full mt-4">
                <Icon name="Settings" size={16} className="mr-2" />
                Настроить
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ReportsPage;