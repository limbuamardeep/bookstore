import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Book, ShoppingBag, Users, DollarSign, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { Badge } from '@/components/ui/Badge';
import { useQuery } from '@apollo/client/react';
import { GET_BOOKS, type BooksQuery } from '@/graphql/books';
import { GET_ORDERS, type OrdersQuery } from '@/graphql/order';
import { GET_USERS, type UsersQuery } from '@/graphql/user';

export default function Dashboard() {
  const { data: booksData } = useQuery<BooksQuery>(GET_BOOKS);
  const { data: ordersData } = useQuery<OrdersQuery>(GET_ORDERS);
  const { data: usersData } = useQuery<UsersQuery>(GET_USERS);

  const totalBooks = booksData?.books.length || 0;
  const totalOrders = ordersData?.orders.length || 0;
  const totalUsers = usersData?.users.length || 0;
  const totalRevenue = ordersData?.orders.reduce((sum, order) => sum + order.total, 0) || 0;

  const stats = [
    { name: 'Total Revenue', value: `$${totalRevenue.toFixed(2)}`, change: '+14%', trend: 'up', icon: DollarSign },
    { name: 'Total Orders', value: totalOrders.toString(), change: '+8%', trend: 'up', icon: ShoppingBag },
    { name: 'Total Books', value: totalBooks.toString(), change: '-2%', trend: 'down', icon: Book },
    { name: 'Active Users', value: totalUsers.toString(), change: '+24%', trend: 'up', icon: Users },
  ];

  const recentOrders = ordersData?.orders.slice(-5).reverse() || [];

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
          <CardContent className="h-75 flex items-end justify-between gap-2 pt-4">
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
              {recentOrders.length === 0 ? (
                <div className="text-sm text-muted-foreground text-center py-4">No orders yet.</div>
              ) : (
                recentOrders.map(order => (
                  <div key={order.id} className="flex items-center justify-between">
                    <div className="flex flex-col gap-1">
                      <span className="text-sm font-medium leading-none">User #{order.userId}</span>
                      <span className="text-xs text-muted-foreground">Order #{order.id}</span>
                    </div>
                    <div className="flex flex-col items-end gap-1">
                      <span className="text-sm font-bold">${order.total.toFixed(2)}</span>
                      <Badge variant={order.status === 'PAID' ? 'success' : order.status === 'PENDING' ? 'warning' : 'secondary'} className="text-[10px] px-1.5 py-0">
                        {order.status}
                      </Badge>
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
