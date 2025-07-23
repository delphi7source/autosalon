import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Icon from '@/components/ui/icon';

const Unauthorized = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <Card className="w-full max-w-md text-center">
        <CardHeader>
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Icon name="ShieldX" size={32} className="text-red-600" />
          </div>
          <CardTitle className="text-2xl">Доступ запрещен</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-600 mb-6">
            У вас нет прав доступа к этой странице. Обратитесь к администратору для получения необходимых разрешений.
          </p>
          <div className="space-y-2">
            <Link to="/">
              <Button className="w-full">
                <Icon name="Home" size={16} className="mr-2" />
                На главную
              </Button>
            </Link>
            <Link to="/login">
              <Button variant="outline" className="w-full">
                <Icon name="LogIn" size={16} className="mr-2" />
                Войти под другим аккаунтом
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Unauthorized;