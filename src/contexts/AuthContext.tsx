import React, { createContext, useContext, useEffect, useState } from 'react';
import { apiClient, User } from '@/lib/api';
import { toast } from '@/hooks/use-toast';

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  register: (userData: Partial<User> & { password: string }) => Promise<boolean>;
  logout: () => void;
  hasRole: (roles: string | string[]) => boolean;
  hasPermission: (permission: string) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: React.ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('auth_token');
    const userData = localStorage.getItem('user_data');
    
    if (token && userData) {
      try {
        const parsedUser = JSON.parse(userData);
        setUser(parsedUser);
        apiClient.setToken(token);
      } catch (error) {
        console.error('Error parsing user data:', error);
        localStorage.removeItem('auth_token');
        localStorage.removeItem('user_data');
      }
    }
    
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      setIsLoading(true);
      const response = await apiClient.login(email, password);
      
      if (response.success && response.data) {
        const { user: userData, token } = response.data;
        setUser(userData);
        apiClient.setToken(token);
        localStorage.setItem('user_data', JSON.stringify(userData));
        
        toast({
          title: 'Успешный вход',
          description: `Добро пожаловать, ${userData.firstName}!`,
        });
        
        return true;
      }
      
      return false;
    } catch (error: any) {
      toast({
        title: 'Ошибка входа',
        description: error.message || 'Неверный email или пароль',
        variant: 'destructive',
      });
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (userData: Partial<User> & { password: string }): Promise<boolean> => {
    try {
      setIsLoading(true);
      const response = await apiClient.register(userData);
      
      if (response.success && response.data) {
        const { user: newUser, token } = response.data;
        setUser(newUser);
        apiClient.setToken(token);
        localStorage.setItem('user_data', JSON.stringify(newUser));
        
        toast({
          title: 'Регистрация успешна',
          description: `Добро пожаловать, ${newUser.firstName}!`,
        });
        
        return true;
      }
      
      return false;
    } catch (error: any) {
      toast({
        title: 'Ошибка регистрации',
        description: error.message || 'Не удалось создать аккаунт',
        variant: 'destructive',
      });
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    apiClient.setToken(null);
    localStorage.removeItem('auth_token');
    localStorage.removeItem('user_data');
    
    toast({
      title: 'Выход выполнен',
      description: 'Вы успешно вышли из системы',
    });
  };

  const hasRole = (roles: string | string[]): boolean => {
    if (!user) return false;
    const roleArray = Array.isArray(roles) ? roles : [roles];
    return roleArray.includes(user.role);
  };

  const hasPermission = (permission: string): boolean => {
    if (!user) return false;
    
    // Определяем права доступа для каждой роли
    const permissions: Record<string, string[]> = {
      admin: [
        'users.read', 'users.create', 'users.update', 'users.delete',
        'cars.read', 'cars.create', 'cars.update', 'cars.delete',
        'services.read', 'services.create', 'services.update', 'services.delete',
        'orders.read', 'orders.create', 'orders.update', 'orders.delete',
        'appointments.read', 'appointments.create', 'appointments.update', 'appointments.delete',
        'tradein.read', 'tradein.create', 'tradein.update', 'tradein.delete',
        'insurance.read', 'insurance.create', 'insurance.update', 'insurance.delete',
        'admin.access'
      ],
      manager: [
        'cars.read', 'cars.create', 'cars.update',
        'services.read', 'services.create', 'services.update',
        'orders.read', 'orders.update',
        'appointments.read', 'appointments.create', 'appointments.update',
        'tradein.read', 'tradein.update',
        'insurance.read', 'insurance.update'
      ],
      customer: [
        'cars.read',
        'services.read',
        'orders.read', 'orders.create',
        'appointments.read', 'appointments.create',
        'tradein.read', 'tradein.create',
        'insurance.read', 'insurance.create'
      ]
    };

    const userPermissions = permissions[user.role] || [];
    return userPermissions.includes(permission);
  };

  const isAuthenticated = !!user;

  const value: AuthContextType = {
    user,
    isLoading,
    isAuthenticated,
    login,
    register,
    logout,
    hasRole,
    hasPermission,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};