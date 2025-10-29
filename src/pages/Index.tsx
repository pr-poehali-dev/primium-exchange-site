import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import Icon from '@/components/ui/icon';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';

interface MarketData {
  symbol: string;
  name: string;
  price: number;
  change: number;
  volume: string;
  marketCap: string;
}

const mockMarkets: MarketData[] = [
  { symbol: 'BTC/USDT', name: 'Bitcoin', price: 67450.23, change: 2.45, volume: '24.5B', marketCap: '1.32T' },
  { symbol: 'ETH/USDT', name: 'Ethereum', price: 3542.18, change: -1.23, volume: '12.8B', marketCap: '425B' },
  { symbol: 'BNB/USDT', name: 'Binance Coin', price: 312.45, change: 0.87, volume: '2.1B', marketCap: '48B' },
  { symbol: 'SOL/USDT', name: 'Solana', price: 142.67, change: 5.32, volume: '3.4B', marketCap: '62B' },
  { symbol: 'XRP/USDT', name: 'Ripple', price: 0.6234, change: -0.45, volume: '1.8B', marketCap: '34B' },
];

const Index = () => {
  const [currentSection, setCurrentSection] = useState('home');
  const [chartData, setChartData] = useState<{ time: number; price: number }[]>([]);

  useEffect(() => {
    const basePrice = 67450;
    const data = Array.from({ length: 50 }, (_, i) => ({
      time: Date.now() - (50 - i) * 60000,
      price: basePrice + Math.sin(i / 5) * 500 + Math.random() * 200,
    }));
    setChartData(data);

    const interval = setInterval(() => {
      setChartData((prev) => {
        const newData = [...prev.slice(1)];
        const lastPrice = prev[prev.length - 1].price;
        newData.push({
          time: Date.now(),
          price: lastPrice + (Math.random() - 0.5) * 50,
        });
        return newData;
      });
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  const maxPrice = Math.max(...chartData.map((d) => d.price));
  const minPrice = Math.min(...chartData.map((d) => d.price));

  const renderChart = () => {
    if (chartData.length === 0) return null;

    return (
      <div className="relative h-64 w-full">
        <svg className="w-full h-full" viewBox="0 0 800 256">
          <defs>
            <linearGradient id="priceGradient" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity="0.3" />
              <stop offset="100%" stopColor="hsl(var(--primary))" stopOpacity="0" />
            </linearGradient>
          </defs>
          <path
            d={chartData
              .map((point, i) => {
                const x = (i / (chartData.length - 1)) * 800;
                const y = 256 - ((point.price - minPrice) / (maxPrice - minPrice)) * 256;
                return `${i === 0 ? 'M' : 'L'} ${x} ${y}`;
              })
              .join(' ')}
            fill="none"
            stroke="hsl(var(--primary))"
            strokeWidth="2"
            className="drop-shadow-[0_0_8px_hsl(var(--primary))]"
          />
          <path
            d={
              chartData
                .map((point, i) => {
                  const x = (i / (chartData.length - 1)) * 800;
                  const y = 256 - ((point.price - minPrice) / (maxPrice - minPrice)) * 256;
                  return `${i === 0 ? 'M' : 'L'} ${x} ${y}`;
                })
                .join(' ') + ' L 800 256 L 0 256 Z'
            }
            fill="url(#priceGradient)"
          />
        </svg>
      </div>
    );
  };

  const navItems = [
    { id: 'home', label: 'Главная', icon: 'Home' },
    { id: 'trade', label: 'Торговля', icon: 'TrendingUp' },
    { id: 'markets', label: 'Рынки', icon: 'BarChart3' },
    { id: 'wallet', label: 'Кошелёк', icon: 'Wallet' },
    { id: 'about', label: 'О бирже', icon: 'Info' },
    { id: 'faq', label: 'FAQ', icon: 'HelpCircle' },
    { id: 'support', label: 'Поддержка', icon: 'MessageSquare' },
    { id: 'contact', label: 'Контакты', icon: 'Mail' },
  ];

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between px-4">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-lg bg-gradient-primary flex items-center justify-center animate-glow">
              <Icon name="Zap" className="text-white" size={24} />
            </div>
            <span className="text-2xl font-bold text-gradient">Overnight Exchange</span>
          </div>

          <nav className="hidden md:flex items-center gap-6">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => setCurrentSection(item.id)}
                className={`text-sm font-medium transition-colors hover:text-primary ${
                  currentSection === item.id ? 'text-primary' : 'text-muted-foreground'
                }`}
              >
                {item.label}
              </button>
            ))}
          </nav>

          <div className="flex items-center gap-3">
            <Button variant="outline" size="sm">Войти</Button>
            <Button size="sm" className="bg-gradient-primary">Регистрация</Button>
          </div>
        </div>
      </header>

      <main className="container px-4 py-8">
        {currentSection === 'home' && (
          <div className="space-y-8 animate-fade-in">
            <section className="text-center py-16 space-y-6">
              <h1 className="text-5xl md:text-7xl font-bold text-gradient animate-slide-up">
                Торгуйте криптовалютой
              </h1>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto animate-slide-up" style={{ animationDelay: '0.1s' }}>
                Премиум-платформа для профессиональной торговли цифровыми активами 24/7
              </p>
              <div className="flex gap-4 justify-center animate-slide-up" style={{ animationDelay: '0.2s' }}>
                <Button size="lg" className="bg-gradient-primary text-lg px-8">
                  Начать торговлю
                </Button>
                <Button size="lg" variant="outline" className="text-lg px-8">
                  Узнать больше
                </Button>
              </div>
            </section>

            <section>
              <div className="grid md:grid-cols-3 gap-6 mb-8">
                <Card className="p-6 bg-card/50 backdrop-blur border-border/50 hover:border-primary/50 transition-all">
                  <Icon name="Shield" className="text-primary mb-4" size={32} />
                  <h3 className="text-xl font-semibold mb-2">Безопасность</h3>
                  <p className="text-muted-foreground">Многоуровневая защита и холодное хранение активов</p>
                </Card>
                <Card className="p-6 bg-card/50 backdrop-blur border-border/50 hover:border-primary/50 transition-all">
                  <Icon name="Zap" className="text-primary mb-4" size={32} />
                  <h3 className="text-xl font-semibold mb-2">Скорость</h3>
                  <p className="text-muted-foreground">Молниеносное исполнение сделок до 100,000 в секунду</p>
                </Card>
                <Card className="p-6 bg-card/50 backdrop-blur border-border/50 hover:border-primary/50 transition-all">
                  <Icon name="Globe" className="text-primary mb-4" size={32} />
                  <h3 className="text-xl font-semibold mb-2">Доступность</h3>
                  <p className="text-muted-foreground">Торговля 24/7 из любой точки мира</p>
                </Card>
              </div>
            </section>
          </div>
        )}

        {currentSection === 'trade' && (
          <div className="space-y-6 animate-fade-in">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-3xl font-bold mb-2">Торговая панель</h2>
                <p className="text-muted-foreground">Профессиональные инструменты для трейдинга</p>
              </div>
              <Badge className="bg-success text-success-foreground">
                <Icon name="Activity" size={14} className="mr-1" />
                Онлайн
              </Badge>
            </div>

            <div className="grid lg:grid-cols-3 gap-6">
              <Card className="lg:col-span-2 p-6 bg-card/50 backdrop-blur">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-4">
                    <h3 className="text-2xl font-bold">BTC/USDT</h3>
                    <Badge variant="outline" className="text-success border-success/50">
                      +2.45%
                    </Badge>
                  </div>
                  <div className="text-right">
                    <div className="text-3xl font-bold text-primary">
                      ${chartData[chartData.length - 1]?.price.toFixed(2)}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      24ч объём: $24.5B
                    </div>
                  </div>
                </div>
                {renderChart()}
                <div className="grid grid-cols-4 gap-4 mt-6 text-sm">
                  <div>
                    <div className="text-muted-foreground">24ч Макс</div>
                    <div className="font-semibold">${maxPrice.toFixed(2)}</div>
                  </div>
                  <div>
                    <div className="text-muted-foreground">24ч Мин</div>
                    <div className="font-semibold">${minPrice.toFixed(2)}</div>
                  </div>
                  <div>
                    <div className="text-muted-foreground">Объём BTC</div>
                    <div className="font-semibold">362,456</div>
                  </div>
                  <div>
                    <div className="text-muted-foreground">Капитализация</div>
                    <div className="font-semibold">$1.32T</div>
                  </div>
                </div>
              </Card>

              <Card className="p-6 bg-card/50 backdrop-blur">
                <Tabs defaultValue="buy">
                  <TabsList className="grid w-full grid-cols-2 mb-6">
                    <TabsTrigger value="buy" className="data-[state=active]:bg-success data-[state=active]:text-success-foreground">
                      Купить
                    </TabsTrigger>
                    <TabsTrigger value="sell" className="data-[state=active]:bg-destructive data-[state=active]:text-destructive-foreground">
                      Продать
                    </TabsTrigger>
                  </TabsList>
                  <TabsContent value="buy" className="space-y-4">
                    <div>
                      <label className="text-sm text-muted-foreground mb-2 block">Цена</label>
                      <div className="flex gap-2">
                        <input
                          type="text"
                          placeholder="67,450.23"
                          className="flex-1 bg-muted border border-border rounded-lg px-4 py-2"
                        />
                        <span className="px-4 py-2 bg-muted border border-border rounded-lg">USDT</span>
                      </div>
                    </div>
                    <div>
                      <label className="text-sm text-muted-foreground mb-2 block">Количество</label>
                      <div className="flex gap-2">
                        <input
                          type="text"
                          placeholder="0.00"
                          className="flex-1 bg-muted border border-border rounded-lg px-4 py-2"
                        />
                        <span className="px-4 py-2 bg-muted border border-border rounded-lg">BTC</span>
                      </div>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Доступно:</span>
                      <span className="font-semibold">10,000 USDT</span>
                    </div>
                    <Button className="w-full bg-success hover:bg-success/90 text-success-foreground">
                      Купить BTC
                    </Button>
                  </TabsContent>
                  <TabsContent value="sell" className="space-y-4">
                    <div>
                      <label className="text-sm text-muted-foreground mb-2 block">Цена</label>
                      <div className="flex gap-2">
                        <input
                          type="text"
                          placeholder="67,450.23"
                          className="flex-1 bg-muted border border-border rounded-lg px-4 py-2"
                        />
                        <span className="px-4 py-2 bg-muted border border-border rounded-lg">USDT</span>
                      </div>
                    </div>
                    <div>
                      <label className="text-sm text-muted-foreground mb-2 block">Количество</label>
                      <div className="flex gap-2">
                        <input
                          type="text"
                          placeholder="0.00"
                          className="flex-1 bg-muted border border-border rounded-lg px-4 py-2"
                        />
                        <span className="px-4 py-2 bg-muted border border-border rounded-lg">BTC</span>
                      </div>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Доступно:</span>
                      <span className="font-semibold">0.5 BTC</span>
                    </div>
                    <Button className="w-full bg-destructive hover:bg-destructive/90 text-destructive-foreground">
                      Продать BTC
                    </Button>
                  </TabsContent>
                </Tabs>
              </Card>
            </div>
          </div>
        )}

        {currentSection === 'markets' && (
          <div className="space-y-6 animate-fade-in">
            <h2 className="text-3xl font-bold">Рынки</h2>
            <Card className="p-6 bg-card/50 backdrop-blur">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-border">
                      <th className="text-left py-4 px-2">Пара</th>
                      <th className="text-right py-4 px-2">Цена</th>
                      <th className="text-right py-4 px-2">Изменение 24ч</th>
                      <th className="text-right py-4 px-2">Объём</th>
                      <th className="text-right py-4 px-2">Капитализация</th>
                      <th className="text-right py-4 px-2">Действие</th>
                    </tr>
                  </thead>
                  <tbody>
                    {mockMarkets.map((market) => (
                      <tr key={market.symbol} className="border-b border-border/50 hover:bg-muted/30 transition-colors">
                        <td className="py-4 px-2">
                          <div>
                            <div className="font-semibold">{market.symbol}</div>
                            <div className="text-sm text-muted-foreground">{market.name}</div>
                          </div>
                        </td>
                        <td className="text-right py-4 px-2 font-mono font-semibold">
                          ${market.price.toLocaleString()}
                        </td>
                        <td className="text-right py-4 px-2">
                          <Badge
                            variant="outline"
                            className={market.change >= 0 ? 'text-success border-success/50' : 'text-destructive border-destructive/50'}
                          >
                            {market.change >= 0 ? '+' : ''}{market.change}%
                          </Badge>
                        </td>
                        <td className="text-right py-4 px-2 text-muted-foreground">{market.volume}</td>
                        <td className="text-right py-4 px-2 text-muted-foreground">{market.marketCap}</td>
                        <td className="text-right py-4 px-2">
                          <Button size="sm" variant="outline" className="hover:border-primary hover:text-primary">
                            Торговать
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>
          </div>
        )}

        {currentSection === 'wallet' && (
          <div className="space-y-6 animate-fade-in">
            <h2 className="text-3xl font-bold">Кошелёк</h2>
            <div className="grid md:grid-cols-2 gap-6">
              <Card className="p-6 bg-gradient-primary text-white">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <div className="text-sm opacity-80 mb-1">Общий баланс</div>
                    <div className="text-4xl font-bold">$125,432.50</div>
                  </div>
                  <Icon name="Wallet" size={48} className="opacity-50" />
                </div>
                <div className="flex gap-3">
                  <Button variant="secondary" className="flex-1">
                    <Icon name="ArrowDownToLine" size={16} className="mr-2" />
                    Пополнить
                  </Button>
                  <Button variant="secondary" className="flex-1">
                    <Icon name="ArrowUpFromLine" size={16} className="mr-2" />
                    Вывести
                  </Button>
                </div>
              </Card>

              <Card className="p-6 bg-card/50 backdrop-blur">
                <h3 className="text-xl font-semibold mb-4">Активы</h3>
                <div className="space-y-3">
                  {[
                    { coin: 'BTC', amount: '1.5432', value: '$104,123.45', change: '+2.45%' },
                    { coin: 'ETH', amount: '5.2100', value: '$18,454.72', change: '-1.23%' },
                    { coin: 'USDT', amount: '2,854.28', value: '$2,854.28', change: '0.00%' },
                  ].map((asset) => (
                    <div key={asset.coin} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center font-bold text-primary">
                          {asset.coin.slice(0, 1)}
                        </div>
                        <div>
                          <div className="font-semibold">{asset.coin}</div>
                          <div className="text-sm text-muted-foreground">{asset.amount}</div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-semibold">{asset.value}</div>
                        <div className={`text-sm ${asset.change.startsWith('+') ? 'text-success' : asset.change.startsWith('-') ? 'text-destructive' : 'text-muted-foreground'}`}>
                          {asset.change}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            </div>
          </div>
        )}

        {currentSection === 'about' && (
          <div className="max-w-4xl mx-auto space-y-8 animate-fade-in">
            <h2 className="text-3xl font-bold">О бирже Overnight Exchange</h2>
            <Card className="p-8 bg-card/50 backdrop-blur">
              <div className="space-y-6">
                <p className="text-lg text-muted-foreground">
                  Overnight Exchange — это премиум-платформа для торговли криптовалютами, созданная командой профессионалов с опытом работы в ведущих финансовых институтах и технологических компаниях.
                </p>
                <div className="grid md:grid-cols-2 gap-6 pt-6">
                  <div>
                    <h3 className="text-xl font-semibold mb-3 flex items-center gap-2">
                      <Icon name="Target" className="text-primary" />
                      Наша миссия
                    </h3>
                    <p className="text-muted-foreground">
                      Сделать торговлю криптовалютами доступной, безопасной и эффективной для всех — от начинающих до профессиональных трейдеров.
                    </p>
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold mb-3 flex items-center gap-2">
                      <Icon name="Award" className="text-primary" />
                      Наши преимущества
                    </h3>
                    <ul className="text-muted-foreground space-y-2">
                      <li>• Лицензированная платформа</li>
                      <li>• Низкие комиссии</li>
                      <li>• 24/7 поддержка клиентов</li>
                      <li>• Высокая ликвидность</li>
                    </ul>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        )}

        {currentSection === 'faq' && (
          <div className="max-w-4xl mx-auto space-y-6 animate-fade-in">
            <h2 className="text-3xl font-bold">Вопросы и ответы</h2>
            <Card className="p-6 bg-card/50 backdrop-blur">
              <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="item-1">
                  <AccordionTrigger className="text-left">Как начать торговать на бирже?</AccordionTrigger>
                  <AccordionContent className="text-muted-foreground">
                    Зарегистрируйтесь на платформе, пройдите верификацию KYC, пополните баланс и начните торговать. Весь процесс занимает не более 15 минут.
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-2">
                  <AccordionTrigger className="text-left">Какие комиссии за торговлю?</AccordionTrigger>
                  <AccordionContent className="text-muted-foreground">
                    Комиссия мейкера составляет 0.1%, тейкера — 0.15%. Для VIP-клиентов действуют специальные тарифы от 0.05%.
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-3">
                  <AccordionTrigger className="text-left">Как защищены мои средства?</AccordionTrigger>
                  <AccordionContent className="text-muted-foreground">
                    95% средств хранятся в холодных кошельках, используется многоуровневая система безопасности, 2FA и страхование активов.
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-4">
                  <AccordionTrigger className="text-left">Какие способы пополнения и вывода доступны?</AccordionTrigger>
                  <AccordionContent className="text-muted-foreground">
                    Поддерживаются банковские переводы, карты Visa/Mastercard, криптовалютные переводы и P2P-обмен.
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-5">
                  <AccordionTrigger className="text-left">Есть ли мобильное приложение?</AccordionTrigger>
                  <AccordionContent className="text-muted-foreground">
                    Да, приложения доступны для iOS и Android с полным функционалом веб-версии.
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </Card>
          </div>
        )}

        {currentSection === 'support' && (
          <div className="max-w-4xl mx-auto space-y-6 animate-fade-in">
            <h2 className="text-3xl font-bold">Поддержка</h2>
            <div className="grid md:grid-cols-3 gap-6">
              <Card className="p-6 bg-card/50 backdrop-blur text-center hover:border-primary/50 transition-all cursor-pointer">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-primary/20 flex items-center justify-center">
                  <Icon name="MessageSquare" className="text-primary" size={32} />
                </div>
                <h3 className="text-xl font-semibold mb-2">Онлайн-чат</h3>
                <p className="text-muted-foreground mb-4">Ответим за 2 минуты</p>
                <Button variant="outline" className="w-full">Открыть чат</Button>
              </Card>

              <Card className="p-6 bg-card/50 backdrop-blur text-center hover:border-primary/50 transition-all cursor-pointer">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-primary/20 flex items-center justify-center">
                  <Icon name="Mail" className="text-primary" size={32} />
                </div>
                <h3 className="text-xl font-semibold mb-2">Email</h3>
                <p className="text-muted-foreground mb-4">support@overnight.exchange</p>
                <Button variant="outline" className="w-full">Написать</Button>
              </Card>

              <Card className="p-6 bg-card/50 backdrop-blur text-center hover:border-primary/50 transition-all cursor-pointer">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-primary/20 flex items-center justify-center">
                  <Icon name="Phone" className="text-primary" size={32} />
                </div>
                <h3 className="text-xl font-semibold mb-2">Телефон</h3>
                <p className="text-muted-foreground mb-4">+7 (800) 123-45-67</p>
                <Button variant="outline" className="w-full">Позвонить</Button>
              </Card>
            </div>
          </div>
        )}

        {currentSection === 'contact' && (
          <div className="max-w-2xl mx-auto space-y-6 animate-fade-in">
            <h2 className="text-3xl font-bold">Контакты</h2>
            <Card className="p-8 bg-card/50 backdrop-blur">
              <form className="space-y-6">
                <div>
                  <label className="text-sm font-medium mb-2 block">Ваше имя</label>
                  <input
                    type="text"
                    placeholder="Иван Иванов"
                    className="w-full bg-muted border border-border rounded-lg px-4 py-3"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block">Email</label>
                  <input
                    type="email"
                    placeholder="ivan@example.com"
                    className="w-full bg-muted border border-border rounded-lg px-4 py-3"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block">Тема</label>
                  <input
                    type="text"
                    placeholder="Вопрос о торговле"
                    className="w-full bg-muted border border-border rounded-lg px-4 py-3"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block">Сообщение</label>
                  <textarea
                    rows={5}
                    placeholder="Опишите ваш вопрос подробнее..."
                    className="w-full bg-muted border border-border rounded-lg px-4 py-3 resize-none"
                  />
                </div>
                <Button className="w-full bg-gradient-primary text-lg py-6">
                  Отправить сообщение
                </Button>
              </form>
            </Card>
          </div>
        )}
      </main>

      <footer className="border-t border-border/40 mt-16">
        <div className="container px-4 py-12">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 rounded-lg bg-gradient-primary flex items-center justify-center">
                  <Icon name="Zap" className="text-white" size={18} />
                </div>
                <span className="text-xl font-bold text-gradient">Overnight</span>
              </div>
              <p className="text-sm text-muted-foreground">
                Премиум-платформа для торговли криптовалютами
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Биржа</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="#" className="hover:text-primary transition-colors">Торговля</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Рынки</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Кошелёк</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Компания</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="#" className="hover:text-primary transition-colors">О нас</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Карьера</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Блог</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Поддержка</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="#" className="hover:text-primary transition-colors">FAQ</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Контакты</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">API</a></li>
              </ul>
            </div>
          </div>
          <div className="pt-8 border-t border-border/40 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-muted-foreground">
            <div>© 2024 Overnight Exchange. Все права защищены.</div>
            <div className="flex gap-6">
              <a href="#" className="hover:text-primary transition-colors">Политика конфиденциальности</a>
              <a href="#" className="hover:text-primary transition-colors">Условия использования</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
