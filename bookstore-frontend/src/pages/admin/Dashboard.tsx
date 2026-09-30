import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Book, ShoppingBag, Users, DollarSign, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { mockOrders } from '@/data/mock';
import { Badge } from '@/components/ui/Badge';

export default function Dashboard() {
  const stats = [
    { name: 'Total Revenue', value: '$12,426', change: '+14%', trend: 'up', icon: DollarSign },
    { name: 'Total Orders', value: '342', change: '+8%', trend: 'up', icon: ShoppingBag },
    { name: 'Total Books', value: '1,204', change: '-2%', trend: 'down', icon: Book },
    { name: 'Active Users', value: '8,234', change: '+24%', trend: 'up', icon: Users },
  ];

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold tracking-tight">Dashboard Overview</h1>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, i) => {
          const Icon = stat.icon;
          return (
            <Card key={i}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between space-y-0 pb-2">
                  <p className="text-sm font-medium text-muted-foreground">{stat.name}</p>
                  <Icon className="h-4 w-4 text-muted-foreground" />
                </div>
                <div className="flex items-baseline justify-between pt-2">
                  <h2 className="text-3xl font-bold">{stat.value}</h2>
                  <div className={`flex items-center text-xs font-medium ${stat.trend === 'up' ? 'text-green-600' : 'text-red-600'}`}>
                    {stat.trend === 'up' ? <ArrowUpRight className="h-3 w-3 mr-1" /> : <ArrowDownRight className="h-3 w-3 mr-1" />}
                    {stat.change}
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Placeholder Chart */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Sales Overview</CardTitle>
          </CardHeader>
          <CardContent className="h-[300px] flex items-end justify-between gap-2 pt-4">
            {/* Very simple mock bar chart using pure CSS */}
            {[40, 70, 45, 90, 65, 85, 120, 95, 110, 80, 130, 100].map((height, i) => (
              <div key={i} className="w-full bg-primary/20 rounded-t-sm hover:bg-primary transition-colors group relative" style={{ height: `${(height/130)*100}%` }}>
                <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-popover border text-popover-foreground text-xs py-1 px-2 rounded opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity shadow-sm">
                  ${height}0
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Recent Orders */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle>Recent Orders</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {mockOrders.slice(0, 5).map(order => (
                <div key={order.id} className="flex items-center justify-between">
                  <div className="flex flex-col gap-1">
                    <span className="text-sm font-medium leading-none">{order.customerName}</span>
                    <span className="text-xs text-muted-foreground">{order.id}</span>
                  </div>
                  <div className="flex flex-col items-end gap-1">
                    <span className="text-sm font-bold">${order.amount.toFixed(2)}</span>
                    <Badge variant={order.paymentStatus === 'Paid' ? 'success' : 'warning'} className="text-[10px] px-1.5 py-0">
                      {order.paymentStatus}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
