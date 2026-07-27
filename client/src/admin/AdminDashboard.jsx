import { useEffect, useState } from 'react';
import { ShoppingBag, Clock, CheckCircle, Truck, IndianRupee, Package, AlertTriangle, RefreshCw, TrendingUp, Calendar, CreditCard, Wallet, Smartphone, BarChart3, Users } from 'lucide-react';
import api from '../api/axios';

const STATUS_ORDER = ['Payment Verification Pending', 'Confirmed', 'Out for Delivery', 'Delivered', 'Cancelled'];
const STATUS_COLORS = {
  'Payment Verification Pending': 'bg-yellow-500',
  'Confirmed': 'bg-green-500',
  'Out for Delivery': 'bg-blue-500',
  'Delivered': 'bg-teal-500',
  'Cancelled': 'bg-red-500',
};

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [productStats, setProductStats] = useState(null);
  const [loading, setLoading] = useState(true);

  const loadData = () => {
    setLoading(true);
    Promise.all([
      api.get('/orders/stats/summary').then(res => setStats(res.data)).catch(() => {}),
      api.get('/products/stats/summary').then(res => setProductStats(res.data)).catch(() => {}),
    ]).finally(() => setLoading(false));
  };

  useEffect(() => { loadData(); }, []);

  if (loading && !stats) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent-600"></div>
      </div>
    );
  }

  const sourceColors = { online_payment: 'bg-blue-500', whatsapp: 'bg-green-500', instagram: 'bg-pink-500' };
  const sourceLabels = { online_payment: 'Online', whatsapp: 'WhatsApp', instagram: 'Instagram' };

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">Dashboard</h1>
          <p className="text-gray-500 text-sm mt-1">Overview of your store performance</p>
        </div>
        <button onClick={loadData} className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-accent-600 transition-colors px-4 py-2 rounded-lg hover:bg-gray-100 self-start sm:self-auto">
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} /> Refresh
        </button>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-6">
        <StatCard icon={ShoppingBag} title="Total Orders" value={stats?.totalOrders ?? '-'} color="bg-blue-500" />
        <StatCard icon={Calendar} title="Today's Orders" value={stats?.todayOrders ?? '-'} color="bg-indigo-500" />
        <StatCard icon={IndianRupee} title="Total Revenue" value={stats ? `₹${parseFloat(stats.revenue).toFixed(2)}` : '-'} color="bg-purple-500" />
        <StatCard icon={TrendingUp} title="This Week Revenue" value={stats ? `₹${parseFloat(stats.weekRevenue).toFixed(2)}` : '-'} color="bg-emerald-500" />
        <StatCard icon={Clock} title="Pending Verification" value={stats?.pendingVerification ?? '-'} color="bg-yellow-500" />
        <StatCard icon={CheckCircle} title="Confirmed" value={stats?.confirmed ?? '-'} color="bg-green-500" />
        <StatCard icon={Truck} title="Delivered" value={stats?.delivered ?? '-'} color="bg-teal-500" />
        <StatCard icon={Package} title="Total Products" value={productStats?.totalProducts ?? '-'} color="bg-accent-500" />
      </div>

      <div className="grid lg:grid-cols-3 gap-6 mb-6">
        {stats?.sourceBreakdown && (
          <div className="bg-white rounded-xl shadow-md p-4 sm:p-6">
            <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2"><BarChart3 className="w-5 h-5 text-accent-500" /> Orders by Source</h3>
            <div className="space-y-3">
              {stats.sourceBreakdown.map(s => {
                const total = stats.sourceBreakdown.reduce((sum, x) => sum + parseInt(x.count), 0);
                const pct = total > 0 ? (parseInt(s.count) / total * 100).toFixed(1) : 0;
                return (
                  <div key={s.order_source}>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-gray-600">{sourceLabels[s.order_source] || s.order_source}</span>
                      <span className="font-semibold text-gray-800">{s.count} ({pct}%)</span>
                    </div>
                    <div className="w-full bg-gray-100 rounded-full h-2">
                      <div className={`h-2 rounded-full transition-all duration-500 ${sourceColors[s.order_source] || 'bg-gray-400'}`} style={{ width: `${pct}%` }} />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {stats?.paymentMethodStats && (
          <div className="bg-white rounded-xl shadow-md p-4 sm:p-6">
            <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2"><CreditCard className="w-5 h-5 text-accent-500" /> Payment Methods</h3>
            <div className="space-y-3">
              {stats.paymentMethodStats.length === 0 && <p className="text-gray-400 text-sm">No payment data yet</p>}
              {stats.paymentMethodStats.map(p => {
                const total = stats.paymentMethodStats.reduce((sum, x) => sum + parseInt(x.count), 0);
                const pct = total > 0 ? (parseInt(p.count) / total * 100).toFixed(1) : 0;
                const icon = p.method === 'upi' ? Wallet : p.method === 'bank' ? CreditCard : Smartphone;
                return (
                  <div key={p.method}>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-gray-600 flex items-center gap-1.5"><icon className="w-3.5 h-3.5 text-gray-400" /> {p.method?.toUpperCase()}</span>
                      <span className="font-semibold text-gray-800">{p.count} ({pct}%)</span>
                    </div>
                    <div className="w-full bg-gray-100 rounded-full h-2">
                      <div className="h-2 rounded-full bg-brand-500 transition-all duration-500" style={{ width: `${pct}%` }} />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        <div className="bg-white rounded-xl shadow-md p-4 sm:p-6">
          <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2"><Clock className="w-5 h-5 text-accent-500" /> Order Status Flow</h3>
          <div className="space-y-3">
            {STATUS_ORDER.map(s => {
              const count = s === 'Payment Verification Pending' ? (stats?.pendingVerification ?? 0)
                : s === 'Confirmed' ? (stats?.confirmed ?? 0)
                : s === 'Delivered' ? (stats?.delivered ?? 0)
                : 0;
              const max = Math.max(stats?.totalOrders || 1, 1);
              const pct = (count / max * 100).toFixed(1);
              return (
                <div key={s}>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-600">{s}</span>
                    <span className="font-semibold text-gray-800">{count}</span>
                  </div>
                  <div className="w-full bg-gray-100 rounded-full h-1.5">
                    <div className={`h-1.5 rounded-full ${STATUS_COLORS[s]} transition-all duration-500`} style={{ width: `${pct}%` }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-6 mb-6">
        {stats?.recentOrders?.length > 0 && (
          <div className="bg-white rounded-xl shadow-md p-4 sm:p-6">
            <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2"><ShoppingBag className="w-5 h-5 text-accent-500" /> Recent Orders</h3>
            <div className="space-y-2">
              {stats.recentOrders.map(o => (
                <div key={o.id} className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0">
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-medium text-gray-800">#{o.id}</span>
                    <span className="text-xs text-gray-500">{o.customer_name}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-xs px-2 py-0.5 rounded font-medium bg-gray-100 text-gray-700">{o.order_source === 'online_payment' ? 'Online' : o.order_source}</span>
                    <span className="text-sm font-semibold">₹{parseFloat(o.total_amount).toFixed(2)}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {productStats?.lowStockProducts?.length > 0 && (
          <div className="bg-white rounded-xl shadow-md p-4 sm:p-6 border-l-4 border-red-500">
            <div className="flex items-center gap-2 mb-4">
              <AlertTriangle className="w-5 h-5 text-red-500 flex-shrink-0" />
              <h3 className="font-bold text-gray-800">Low Stock Alerts</h3>
            </div>
            <div className="space-y-2">
              {productStats.lowStockProducts.map(p => (
                <div key={p.id} className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0">
                  <span className="text-sm text-gray-700">{p.name}</span>
                  <span className={`text-sm font-bold ${p.stock <= 0 ? 'text-red-600' : 'text-orange-500'}`}>{p.stock} left</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="bg-white rounded-xl shadow-md p-4 sm:p-6">
        <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
          <Users className="w-5 h-5 text-accent-500" /> Quick Stats
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-sm">
          <div className="bg-blue-50 rounded-xl p-4 text-center">
            <p className="text-2xl font-bold text-blue-700">{stats?.todayOrders ?? 0}</p>
            <p className="text-blue-600 text-xs">Orders Today</p>
          </div>
          <div className="bg-green-50 rounded-xl p-4 text-center">
            <p className="text-2xl font-bold text-green-700">{stats?.confirmed ?? 0}</p>
            <p className="text-green-600 text-xs">Confirmed</p>
          </div>
          <div className="bg-purple-50 rounded-xl p-4 text-center">
            <p className="text-2xl font-bold text-purple-700">{stats ? `₹${parseFloat(stats.weekRevenue).toFixed(0)}` : 0}</p>
            <p className="text-purple-600 text-xs">Week Revenue</p>
          </div>
          <div className="bg-orange-50 rounded-xl p-4 text-center">
            <p className="text-2xl font-bold text-orange-700">{productStats?.lowStockCount ?? 0}</p>
            <p className="text-orange-600 text-xs">Low Stock Items</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({ icon: Icon, title, value, color }) {
  return (
    <div className="bg-white rounded-xl shadow-md p-4 sm:p-6 hover:shadow-lg transition-shadow">
      <div className={`w-8 h-8 sm:w-10 sm:h-10 rounded-lg ${color} flex items-center justify-center mb-2 sm:mb-3`}>
        <Icon className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
      </div>
      <p className="text-gray-500 text-xs sm:text-sm font-medium">{title}</p>
      <p className="text-lg sm:text-2xl font-bold text-gray-800 mt-0.5 sm:mt-1 truncate">{value}</p>
    </div>
  );
}
