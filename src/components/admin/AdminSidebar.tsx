import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from '@/components/ui/sidebar';
import { useAuth } from '@/contexts/AuthContext';
import Icon from '@/components/ui/icon';

const AdminSidebar: React.FC = () => {
  const location = useLocation();
  const { user, hasPermission } = useAuth();

  const menuItems = [
    {
      title: 'Панель управления',
      items: [
        {
          title: 'Главная',
          url: '/admin',
          icon: 'Home',
          permission: 'admin.access'
        },
        {
          title: 'Аналитика',
          url: '/admin/analytics',
          icon: 'BarChart3',
          permission: 'admin.access'
        },
        {
          title: 'Отчеты',
          url: '/admin/reports',
          icon: 'FileText',
          permission: 'admin.access'
        },
        {
          title: 'Уведомления',
          url: '/admin/notifications',
          icon: 'Bell',
          permission: 'admin.access'
        }
      ]
    },
    {
      title: 'Управление данными',
      items: [
        {
          title: 'Пользователи',
          url: '/admin/users',
          icon: 'Users',
          permission: 'users.read'
        },
        {
          title: 'Автомобили',
          url: '/admin/cars',
          icon: 'Car',
          permission: 'cars.read'
        },
        {
          title: 'Услуги',
          url: '/admin/services',
          icon: 'Wrench',
          permission: 'services.read'
        },
        {
          title: 'Категории',
          url: '/admin/categories',
          icon: 'Folder',
          permission: 'admin.access'
        },
        {
          title: 'Бренды',
          url: '/admin/brands',
          icon: 'Tag',
          permission: 'admin.access'
        }
      ]
    },
    {
      title: 'Заказы и записи',
      items: [
        {
          title: 'Заказы',
          url: '/admin/orders',
          icon: 'ShoppingCart',
          permission: 'orders.read'
        },
        {
          title: 'Записи',
          url: '/admin/appointments',
          icon: 'Calendar',
          permission: 'appointments.read'
        },
        {
          title: 'Trade-in',
          url: '/admin/tradein',
          icon: 'RefreshCw',
          permission: 'tradein.read'
        },
        {
          title: 'Страхование',
          url: '/admin/insurance',
          icon: 'Shield',
          permission: 'insurance.read'
        },
        {
          title: 'Платежи',
          url: '/admin/payments',
          icon: 'CreditCard',
          permission: 'admin.access'
        },
        {
          title: 'Счета',
          url: '/admin/invoices',
          icon: 'Receipt',
          permission: 'admin.access'
        }
      ]
    },
    {
      title: 'Маркетинг',
      items: [
        {
          title: 'Акции',
          url: '/admin/promotions',
          icon: 'Percent',
          permission: 'admin.access'
        },
        {
          title: 'Новости',
          url: '/admin/news',
          icon: 'Newspaper',
          permission: 'admin.access'
        },
        {
          title: 'Отзывы',
          url: '/admin/reviews',
          icon: 'Star',
          permission: 'admin.access'
        },
        {
          title: 'Email рассылки',
          url: '/admin/newsletters',
          icon: 'Mail',
          permission: 'admin.access'
        }
      ]
    },
    {
      title: 'Контент',
      items: [
        {
          title: 'Страницы',
          url: '/admin/pages',
          icon: 'FileText',
          permission: 'admin.access'
        },
        {
          title: 'Медиа файлы',
          url: '/admin/media',
          icon: 'Image',
          permission: 'admin.access'
        },
        {
          title: 'FAQ',
          url: '/admin/faq',
          icon: 'HelpCircle',
          permission: 'admin.access'
        },
        {
          title: 'Баннеры',
          url: '/admin/banners',
          icon: 'Layout',
          permission: 'admin.access'
        }
      ]
    },
    {
      title: 'Система',
      items: [
        {
          title: 'Настройки',
          url: '/admin/settings',
          icon: 'Settings',
          permission: 'admin.access'
        },
        {
          title: 'Логи',
          url: '/admin/logs',
          icon: 'FileText',
          permission: 'admin.access'
        },
        {
          title: 'Резервные копии',
          url: '/admin/backups',
          icon: 'Database',
          permission: 'admin.access'
        },
        {
          title: 'Безопасность',
          url: '/admin/security',
          icon: 'Lock',
          permission: 'admin.access'
        }
      ]
    }
  ];

  const isActive = (url: string) => {
    if (url === '/admin') {
      return location.pathname === '/admin';
    }
    return location.pathname.startsWith(url);
  };

  return (
    <Sidebar>
      <SidebarHeader className="border-b p-4">
        <div className="flex items-center space-x-2">
          <Icon name="Car" size={24} className="text-primary" />
          <div>
            <div className="font-bold text-lg">AutoPremium</div>
            <div className="text-xs text-muted-foreground">Админ-панель</div>
          </div>
        </div>
      </SidebarHeader>
      
      <SidebarContent>
        {menuItems.map((group, groupIndex) => (
          <SidebarGroup key={groupIndex}>
            <SidebarGroupLabel>{group.title}</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {group.items
                  .filter(item => hasPermission(item.permission))
                  .map((item, itemIndex) => (
                    <SidebarMenuItem key={itemIndex}>
                      <SidebarMenuButton asChild isActive={isActive(item.url)}>
                        <Link to={item.url}>
                          <Icon name={item.icon} size={16} />
                          <span>{item.title}</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>
      
      <SidebarRail />
    </Sidebar>
  );
};

export default AdminSidebar;