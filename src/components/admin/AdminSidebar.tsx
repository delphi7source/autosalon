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