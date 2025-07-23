import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import Icon from '@/components/ui/icon';

const About = () => {
  const milestones = [
    { year: '2009', event: 'Основание компании AutoPremium' },
    { year: '2012', event: 'Открытие первого сервисного центра' },
    { year: '2015', event: 'Запуск программы Trade-in' },
    { year: '2018', event: 'Расширение до 3 салонов в Москве' },
    { year: '2020', event: 'Внедрение онлайн-продаж' },
    { year: '2022', event: 'Получение статуса "Дилер года"' },
    { year: '2024', event: 'Более 10,000 довольных клиентов' }
  ];

  const values = [
    {
      title: 'Качество',
      description: 'Мы предлагаем только проверенные автомобили высокого качества',
      icon: 'Award'
    },
    {
      title: 'Честность',
      description: 'Прозрачные цены и условия без скрытых платежей',
      icon: 'Shield'
    },
    {
      title: 'Сервис',
      description: 'Индивидуальный подход к каждому клиенту',
      icon: 'Heart'
    },
    {
      title: 'Инновации',
      description: 'Современные технологии в продажах и обслуживании',
      icon: 'Zap'
    }
  ];

  const team = [
    {
      name: 'Владимир Петров',
      position: 'Генеральный директор',
      experience: '20 лет в автомобильной индустрии',
      description: 'Основатель компании, эксперт в области премиальных автомобилей'
    },
    {
      name: 'Елена Иванова',
      position: 'Коммерческий директор',
      experience: '15 лет в продажах',
      description: 'Отвечает за развитие продаж и работу с клиентами'
    },
    {
      name: 'Андрей Сидоров',
      position: 'Технический директор',
      experience: '18 лет в автосервисе',
      description: 'Руководит всеми техническими процессами и сервисным обслуживанием'
    },
    {
      name: 'Мария Козлова',
      position: 'Финансовый директор',
      experience: '12 лет в финансах',
      description: 'Управляет финансовыми операциями и кредитными программами'
    }
  ];

  const achievements = [
    { title: 'Дилер года 2022', description: 'По версии BMW Group' },
    { title: 'Лучший сервис', description: 'Премия "Автомобиль года"' },
    { title: 'ISO 9001:2015', description: 'Сертификат качества' },
    { title: 'Партнер года', description: 'Audi AG 2023' }
  ];

  const partners = [
    { name: 'BMW', description: 'Официальный дилер' },
    { name: 'Audi', description: 'Авторизованный партнер' },
    { name: 'Mercedes-Benz', description: 'Сертифицированный дилер' },
    { name: 'Сбербанк', description: 'Партнер по кредитованию' },
    { name: 'ВТБ', description: 'Финансовый партнер' },
    { name: 'Росгосстрах', description: 'Страховой партнер' }
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <section className="bg-secondary text-white py-12">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl font-bold mb-4">О компании AutoPremium</h1>
          <p className="text-xl opacity-90">15 лет успешной работы в сфере продажи премиальных автомобилей</p>
        </div>
      </section>

      <div className="container mx-auto px-4 py-8">
        {/* Company Story */}
        <section className="mb-16">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-secondary mb-6">Наша история</h2>
              <div className="space-y-4 text-gray-600">
                <p>
                  AutoPremium была основана в 2009 году с простой миссией: предоставлять клиентам доступ к лучшим премиальным автомобилям с исключительным уровнем сервиса.
                </p>
                <p>
                  За 15 лет работы мы выросли от небольшого автосалона до ведущего дилерского центра, обслуживающего тысячи довольных клиентов по всей Москве и области.
                </p>
                <p>
                  Сегодня AutoPremium — это не просто место покупки автомобиля, это полноценный автомобильный центр, предлагающий весь спектр услуг: от продажи и обслуживания до страхования и финансирования.
                </p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center p-6 bg-primary/5 rounded-lg">
                <div className="text-3xl font-bold text-primary mb-2">15+</div>
                <div className="text-sm text-gray-600">Лет на рынке</div>
              </div>
              <div className="text-center p-6 bg-primary/5 rounded-lg">
                <div className="text-3xl font-bold text-primary mb-2">10K+</div>
                <div className="text-sm text-gray-600">Довольных клиентов</div>
              </div>
              <div className="text-center p-6 bg-primary/5 rounded-lg">
                <div className="text-3xl font-bold text-primary mb-2">500+</div>
                <div className="text-sm text-gray-600">Автомобилей в наличии</div>
              </div>
              <div className="text-center p-6 bg-primary/5 rounded-lg">
                <div className="text-3xl font-bold text-primary mb-2">98%</div>
                <div className="text-sm text-gray-600">Положительных отзывов</div>
              </div>
            </div>
          </div>
        </section>

        {/* Timeline */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-center text-secondary mb-12">Ключевые вехи</h2>
          <div className="relative">
            <div className="absolute left-1/2 transform -translate-x-1/2 w-1 h-full bg-primary/20"></div>
            <div className="space-y-8">
              {milestones.map((milestone, index) => (
                <div key={index} className={`flex items-center ${index % 2 === 0 ? 'flex-row' : 'flex-row-reverse'}`}>
                  <div className={`w-1/2 ${index % 2 === 0 ? 'pr-8 text-right' : 'pl-8'}`}>
                    <div className="bg-white p-4 rounded-lg shadow-md border">
                      <div className="text-lg font-bold text-primary mb-1">{milestone.year}</div>
                      <div className="text-gray-600">{milestone.event}</div>
                    </div>
                  </div>
                  <div className="relative z-10 w-4 h-4 bg-primary rounded-full border-4 border-white shadow-md"></div>
                  <div className="w-1/2"></div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Values */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-center text-secondary mb-12">Наши ценности</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((value, index) => (
              <Card key={index} className="text-center hover:shadow-lg transition-shadow">
                <CardContent className="pt-8">
                  <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Icon name={value.icon} size={24} className="text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold mb-3">{value.title}</h3>
                  <p className="text-gray-600 text-sm">{value.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Team */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-center text-secondary mb-12">Руководство компании</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {team.map((member, index) => (
              <Card key={index} className="text-center">
                <CardContent className="pt-6">
                  <div className="w-24 h-24 bg-gray-200 rounded-full mx-auto mb-4 flex items-center justify-center">
                    <Icon name="User" size={32} className="text-gray-400" />
                  </div>
                  <h3 className="text-lg font-semibold mb-1">{member.name}</h3>
                  <p className="text-primary font-medium mb-2">{member.position}</p>
                  <p className="text-sm text-gray-600 mb-3">{member.experience}</p>
                  <p className="text-xs text-gray-500">{member.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Achievements */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-center text-secondary mb-12">Награды и достижения</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {achievements.map((achievement, index) => (
              <Card key={index} className="text-center">
                <CardContent className="pt-6">
                  <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Icon name="Trophy" size={24} className="text-yellow-600" />
                  </div>
                  <h3 className="font-semibold mb-2">{achievement.title}</h3>
                  <p className="text-sm text-gray-600">{achievement.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Partners */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-center text-secondary mb-12">Наши партнеры</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
            {partners.map((partner, index) => (
              <Card key={index} className="text-center hover:shadow-md transition-shadow">
                <CardContent className="pt-6">
                  <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                    <Icon name="Building" size={20} className="text-gray-400" />
                  </div>
                  <h4 className="font-semibold text-sm mb-1">{partner.name}</h4>
                  <p className="text-xs text-gray-600">{partner.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Mission & Vision */}
        <section className="mb-16">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Icon name="Target" size={20} className="mr-2 text-primary" />
                  Наша миссия
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Предоставлять клиентам доступ к лучшим премиальным автомобилям с исключительным уровнем сервиса, 
                  создавая долгосрочные отношения, основанные на доверии, качестве и профессионализме.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Icon name="Eye" size={20} className="mr-2 text-primary" />
                  Наше видение
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Стать ведущим автомобильным центром в России, устанавливающим стандарты качества обслуживания 
                  и инноваций в автомобильной индустрии.
                </p>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Certifications */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-center text-secondary mb-12">Сертификаты и лицензии</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardContent className="pt-6 text-center">
                <Icon name="Award" size={32} className="text-primary mx-auto mb-4" />
                <h3 className="font-semibold mb-2">ISO 9001:2015</h3>
                <p className="text-sm text-gray-600">Система менеджмента качества</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6 text-center">
                <Icon name="Shield" size={32} className="text-primary mx-auto mb-4" />
                <h3 className="font-semibold mb-2">Лицензия дилера</h3>
                <p className="text-sm text-gray-600">Официальное дилерство BMW, Audi, Mercedes</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6 text-center">
                <Icon name="CheckCircle" size={32} className="text-primary mx-auto mb-4" />
                <h3 className="font-semibold mb-2">Сертификат сервиса</h3>
                <p className="text-sm text-gray-600">Авторизованный сервисный центр</p>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* CTA */}
        <section className="text-center bg-gray-50 rounded-2xl p-12">
          <h2 className="text-3xl font-bold text-secondary mb-4">Присоединяйтесь к нашей семье</h2>
          <p className="text-gray-600 text-lg mb-8">
            Более 10,000 клиентов уже доверили нам покупку своего автомобиля мечты
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/catalog">
              <Button size="lg" className="bg-primary hover:bg-primary/90">
                <Icon name="Car" size={16} className="mr-2" />
                Посмотреть автомобили
              </Button>
            </Link>
            <Link to="/contacts">
              <Button size="lg" variant="outline">
                <Icon name="Phone" size={16} className="mr-2" />
                Связаться с нами
              </Button>
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
};

export default About;