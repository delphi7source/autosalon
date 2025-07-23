import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from '@/hooks/use-toast';
import Icon from '@/components/ui/icon';

const SettingsPage: React.FC = () => {
  const [generalSettings, setGeneralSettings] = useState({
    siteName: 'AutoPremium',
    siteDescription: 'Ведущий автосалон премиальных автомобилей',
    contactEmail: 'info@autopremium.ru',
    contactPhone: '+7 (495) 123-45-67',
    address: 'Москва, ул. Примерная, 123',
    workingHours: 'Пн-Вс: 9:00-21:00'
  });

  const [emailSettings, setEmailSettings] = useState({
    smtpHost: 'smtp.gmail.com',
    smtpPort: '587',
    smtpUser: 'noreply@autopremium.ru',
    smtpPassword: '',
    fromName: 'AutoPremium',
    fromEmail: 'noreply@autopremium.ru'
  });

  const [seoSettings, setSeoSettings] = useState({
    metaTitle: 'AutoPremium - Премиальные автомобили',
    metaDescription: 'Продажа премиальных автомобилей BMW, Audi, Mercedes-Benz',
    metaKeywords: 'автомобили, BMW, Audi, Mercedes, продажа, автосалон',
    googleAnalytics: 'GA-XXXXXXXXX',
    yandexMetrica: '12345678'
  });

  const [socialSettings, setSocialSettings] = useState({
    facebook: 'https://facebook.com/autopremium',
    instagram: 'https://instagram.com/autopremium',
    youtube: 'https://youtube.com/autopremium',
    vk: 'https://vk.com/autopremium',
    telegram: 'https://t.me/autopremium'
  });

  const [systemSettings, setSystemSettings] = useState({
    timezone: 'Europe/Moscow',
    language: 'ru',
    currency: 'RUB',
    dateFormat: 'DD.MM.YYYY',
    maintenanceMode: false,
    debugMode: false
  });

  const handleSaveGeneral = async () => {
    try {
      toast({
        title: 'Настройки сохранены',
        description: 'Общие настройки успешно обновлены',
      });
    } catch (error) {
      toast({
        title: 'Ошибка',
        description: 'Не удалось сохранить настройки',
        variant: 'destructive',
      });
    }
  };

  const handleSaveEmail = async () => {
    try {
      toast({
        title: 'Настройки сохранены',
        description: 'Настройки email успешно обновлены',
      });
    } catch (error) {
      toast({
        title: 'Ошибка',
        description: 'Не удалось сохранить настройки email',
        variant: 'destructive',
      });
    }
  };

  const handleSaveSEO = async () => {
    try {
      toast({
        title: 'Настройки сохранены',
        description: 'SEO настройки успешно обновлены',
      });
    } catch (error) {
      toast({
        title: 'Ошибка',
        description: 'Не удалось сохранить SEO настройки',
        variant: 'destructive',
      });
    }
  };

  const handleSaveSocial = async () => {
    try {
      toast({
        title: 'Настройки сохранены',
        description: 'Настройки социальных сетей успешно обновлены',
      });
    } catch (error) {
      toast({
        title: 'Ошибка',
        description: 'Не удалось сохранить настройки социальных сетей',
        variant: 'destructive',
      });
    }
  };

  const handleSaveSystem = async () => {
    try {
      toast({
        title: 'Настройки сохранены',
        description: 'Системные настройки успешно обновлены',
      });
    } catch (error) {
      toast({
        title: 'Ошибка',
        description: 'Не удалось сохранить системные настройки',
        variant: 'destructive',
      });
    }
  };

  const handleTestEmail = async () => {
    try {
      toast({
        title: 'Тестовое письмо отправлено',
        description: 'Проверьте почту для подтверждения настроек',
      });
    } catch (error) {
      toast({
        title: 'Ошибка',
        description: 'Не удалось отправить тестовое письмо',
        variant: 'destructive',
      });
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Настройки системы</h1>
        <p className="text-muted-foreground">Конфигурация и настройки приложения</p>
      </div>

      <Tabs defaultValue="general" className="w-full">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="general">Общие</TabsTrigger>
          <TabsTrigger value="email">Email</TabsTrigger>
          <TabsTrigger value="seo">SEO</TabsTrigger>
          <TabsTrigger value="social">Соц. сети</TabsTrigger>
          <TabsTrigger value="system">Система</TabsTrigger>
        </TabsList>

        <TabsContent value="general">
          <Card>
            <CardHeader>
              <CardTitle>Общие настройки</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium mb-1 block">Название сайта</label>
                  <Input
                    value={generalSettings.siteName}
                    onChange={(e) => setGeneralSettings({...generalSettings, siteName: e.target.value})}
                  />
                </div>
                <div>
                  <label className="text-sm font-medium mb-1 block">Email для связи</label>
                  <Input
                    type="email"
                    value={generalSettings.contactEmail}
                    onChange={(e) => setGeneralSettings({...generalSettings, contactEmail: e.target.value})}
                  />
                </div>
              </div>

              <div>
                <label className="text-sm font-medium mb-1 block">Описание сайта</label>
                <Textarea
                  value={generalSettings.siteDescription}
                  onChange={(e) => setGeneralSettings({...generalSettings, siteDescription: e.target.value})}
                  rows={2}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium mb-1 block">Телефон</label>
                  <Input
                    value={generalSettings.contactPhone}
                    onChange={(e) => setGeneralSettings({...generalSettings, contactPhone: e.target.value})}
                  />
                </div>
                <div>
                  <label className="text-sm font-medium mb-1 block">Режим работы</label>
                  <Input
                    value={generalSettings.workingHours}
                    onChange={(e) => setGeneralSettings({...generalSettings, workingHours: e.target.value})}
                  />
                </div>
              </div>

              <div>
                <label className="text-sm font-medium mb-1 block">Адрес</label>
                <Input
                  value={generalSettings.address}
                  onChange={(e) => setGeneralSettings({...generalSettings, address: e.target.value})}
                />
              </div>

              <Button onClick={handleSaveGeneral}>
                <Icon name="Save" size={16} className="mr-2" />
                Сохранить общие настройки
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="email">
          <Card>
            <CardHeader>
              <CardTitle>Настройки Email</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium mb-1 block">SMTP хост</label>
                  <Input
                    value={emailSettings.smtpHost}
                    onChange={(e) => setEmailSettings({...emailSettings, smtpHost: e.target.value})}
                  />
                </div>
                <div>
                  <label className="text-sm font-medium mb-1 block">SMTP порт</label>
                  <Input
                    value={emailSettings.smtpPort}
                    onChange={(e) => setEmailSettings({...emailSettings, smtpPort: e.target.value})}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium mb-1 block">SMTP пользователь</label>
                  <Input
                    value={emailSettings.smtpUser}
                    onChange={(e) => setEmailSettings({...emailSettings, smtpUser: e.target.value})}
                  />
                </div>
                <div>
                  <label className="text-sm font-medium mb-1 block">SMTP пароль</label>
                  <Input
                    type="password"
                    value={emailSettings.smtpPassword}
                    onChange={(e) => setEmailSettings({...emailSettings, smtpPassword: e.target.value})}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium mb-1 block">Имя отправителя</label>
                  <Input
                    value={emailSettings.fromName}
                    onChange={(e) => setEmailSettings({...emailSettings, fromName: e.target.value})}
                  />
                </div>
                <div>
                  <label className="text-sm font-medium mb-1 block">Email отправителя</label>
                  <Input
                    type="email"
                    value={emailSettings.fromEmail}
                    onChange={(e) => setEmailSettings({...emailSettings, fromEmail: e.target.value})}
                  />
                </div>
              </div>

              <div className="flex space-x-2">
                <Button onClick={handleSaveEmail}>
                  <Icon name="Save" size={16} className="mr-2" />
                  Сохранить настройки
                </Button>
                <Button variant="outline" onClick={handleTestEmail}>
                  <Icon name="Mail" size={16} className="mr-2" />
                  Отправить тест
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="seo">
          <Card>
            <CardHeader>
              <CardTitle>SEO настройки</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium mb-1 block">Meta Title</label>
                <Input
                  value={seoSettings.metaTitle}
                  onChange={(e) => setSeoSettings({...seoSettings, metaTitle: e.target.value})}
                />
              </div>

              <div>
                <label className="text-sm font-medium mb-1 block">Meta Description</label>
                <Textarea
                  value={seoSettings.metaDescription}
                  onChange={(e) => setSeoSettings({...seoSettings, metaDescription: e.target.value})}
                  rows={2}
                />
              </div>

              <div>
                <label className="text-sm font-medium mb-1 block">Meta Keywords</label>
                <Textarea
                  value={seoSettings.metaKeywords}
                  onChange={(e) => setSeoSettings({...seoSettings, metaKeywords: e.target.value})}
                  rows={2}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium mb-1 block">Google Analytics ID</label>
                  <Input
                    value={seoSettings.googleAnalytics}
                    onChange={(e) => setSeoSettings({...seoSettings, googleAnalytics: e.target.value})}
                    placeholder="GA-XXXXXXXXX"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium mb-1 block">Яндекс.Метрика ID</label>
                  <Input
                    value={seoSettings.yandexMetrica}
                    onChange={(e) => setSeoSettings({...seoSettings, yandexMetrica: e.target.value})}
                    placeholder="12345678"
                  />
                </div>
              </div>

              <Button onClick={handleSaveSEO}>
                <Icon name="Save" size={16} className="mr-2" />
                Сохранить SEO настройки
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="social">
          <Card>
            <CardHeader>
              <CardTitle>Социальные сети</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium mb-1 block">Facebook</label>
                <Input
                  value={socialSettings.facebook}
                  onChange={(e) => setSocialSettings({...socialSettings, facebook: e.target.value})}
                  placeholder="https://facebook.com/autopremium"
                />
              </div>

              <div>
                <label className="text-sm font-medium mb-1 block">Instagram</label>
                <Input
                  value={socialSettings.instagram}
                  onChange={(e) => setSocialSettings({...socialSettings, instagram: e.target.value})}
                  placeholder="https://instagram.com/autopremium"
                />
              </div>

              <div>
                <label className="text-sm font-medium mb-1 block">YouTube</label>
                <Input
                  value={socialSettings.youtube}
                  onChange={(e) => setSocialSettings({...socialSettings, youtube: e.target.value})}
                  placeholder="https://youtube.com/autopremium"
                />
              </div>

              <div>
                <label className="text-sm font-medium mb-1 block">ВКонтакте</label>
                <Input
                  value={socialSettings.vk}
                  onChange={(e) => setSocialSettings({...socialSettings, vk: e.target.value})}
                  placeholder="https://vk.com/autopremium"
                />
              </div>

              <div>
                <label className="text-sm font-medium mb-1 block">Telegram</label>
                <Input
                  value={socialSettings.telegram}
                  onChange={(e) => setSocialSettings({...socialSettings, telegram: e.target.value})}
                  placeholder="https://t.me/autopremium"
                />
              </div>

              <Button onClick={handleSaveSocial}>
                <Icon name="Save" size={16} className="mr-2" />
                Сохранить настройки соц. сетей
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="system">
          <Card>
            <CardHeader>
              <CardTitle>Системные настройки</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium mb-1 block">Часовой пояс</label>
                  <Select value={systemSettings.timezone} onValueChange={(value) => setSystemSettings({...systemSettings, timezone: value})}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Europe/Moscow">Москва (UTC+3)</SelectItem>
                      <SelectItem value="Europe/Kiev">Киев (UTC+2)</SelectItem>
                      <SelectItem value="Asia/Almaty">Алматы (UTC+6)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="text-sm font-medium mb-1 block">Язык</label>
                  <Select value={systemSettings.language} onValueChange={(value) => setSystemSettings({...systemSettings, language: value})}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ru">Русский</SelectItem>
                      <SelectItem value="en">English</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium mb-1 block">Валюта</label>
                  <Select value={systemSettings.currency} onValueChange={(value) => setSystemSettings({...systemSettings, currency: value})}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="RUB">Рубль (₽)</SelectItem>
                      <SelectItem value="USD">Доллар ($)</SelectItem>
                      <SelectItem value="EUR">Евро (€)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="text-sm font-medium mb-1 block">Формат даты</label>
                  <Select value={systemSettings.dateFormat} onValueChange={(value) => setSystemSettings({...systemSettings, dateFormat: value})}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="DD.MM.YYYY">ДД.ММ.ГГГГ</SelectItem>
                      <SelectItem value="MM/DD/YYYY">ММ/ДД/ГГГГ</SelectItem>
                      <SelectItem value="YYYY-MM-DD">ГГГГ-ММ-ДД</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium">Режим обслуживания</div>
                    <div className="text-sm text-gray-600">Отключить сайт для обслуживания</div>
                  </div>
                  <input 
                    type="checkbox" 
                    checked={systemSettings.maintenanceMode}
                    onChange={(e) => setSystemSettings({...systemSettings, maintenanceMode: e.target.checked})}
                    className="toggle" 
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium">Режим отладки</div>
                    <div className="text-sm text-gray-600">Показывать подробные ошибки</div>
                  </div>
                  <input 
                    type="checkbox" 
                    checked={systemSettings.debugMode}
                    onChange={(e) => setSystemSettings({...systemSettings, debugMode: e.target.checked})}
                    className="toggle" 
                  />
                </div>
              </div>

              <Button onClick={handleSaveSystem}>
                <Icon name="Save" size={16} className="mr-2" />
                Сохранить системные настройки
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SettingsPage;