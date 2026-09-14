import { useEffect, useState } from 'react';
import {
  ShoppingBag, Clock, CheckCircle, Truck, IndianRupee, Package,
  AlertTriangle, RefreshCw, TrendingUp, Calendar, CreditCard, Wallet,
  Smartphone, BarChart3, Users, ArrowRight, Plus
} from 'lucide-react';
import { Link } from 'react-router-dom';
import api from '../api/axios';

const STATUS_ORDER = ['Payment Verification Pending', 'Confirmed', 'Out for Delivery', 'Delivered', 'Cancelled'];
const STATUS_COLORS = {
  'Payment Verification Pending': 'bg-yellow-500',
  'Confirmed': 'bg-green-500',
  'Out for Delivery': 'bg-blue-500',
  'Delivered': 'bg-teal-500',
  'Cancelled': 'bg-red-500',
};

function StatCard({ icon: Icon, title, value, color, trend }) {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 hover:shadow-md transition-all group card-hover overflow-hidden relative">
      <div className={`absolute top-0 right-0 w-24 h-24 ${color} opacity-5 rounded-bl-full`} />
      <div className={`w-10 h-10 rounded-xl ${color} flex items-center justify-center mb-3 shadow-sm`}>
        <Icon className="w-5 h-5 text-white" />
      </div>
      <p className="text-gray-500 text-xs font-medium uppercase tracking-wide">{title}</p>
      <p className="text-2xl font-bold text-gray-800 mt-1 truncate">{value}</p>
      {trend && <p className="text-xs text-green-500 mt-1">{trend}</p>}
    </div>
  );
}

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
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-600 mx-auto mb-4" />
          <p className="text-gray-500 text-sm">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  const sourceColors = { online_payment: 'bg-blue-500', whatsapp: 'bg-green-500', instagram: 'bg-pink-500' };
  const sourceLabels = { online_payment: 'Online Payment', whatsapp: 'WhatsApp', instagram: 'Instagram' };

  return (
    <div>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">Dashboard</h1>
          <p className="text-gray-500 text-sm mt-1">
            {new Date().toLocaleDateString('en-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
          </p>
        </div>
        <div className="flex gap-3">
          <Link to="/admin/products" className="inline-flex items-center gap-2 bg-brand-600 text-white px-4 py-2.5 rounded-xl text-sm font-bold hover:bg-brand-700 transition-colors shadow-md">
            <Plus className="w-4 h-4" /> Add Product
          </Link>
          <button
            onClick={loadData}
            className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-accent-600 transition-colors px-4 py-2.5 rounded-xl hover:bg-gray-100 border border-gray-200"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} /> Refresh
          </button>
        </div>
      </div>

      {/* Stat Cards Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard icon={ShoppingBag} title="Total Orders"      value={stats?.totalOrders ?? '-'}         color="bg-blue-500"    />
        <StatCard icon={Calendar}    title="Today's Orders"    value={stats?.todayOrders ?? '-'}          color="bg-indigo-500"  trend={`${stats?.todayOrders ?? 0} today`} />
        <StatCard icon={IndianRupee} title="Total Revenue"     value={stats ? `₹${parseFloat(stats.revenue).toLocaleString('en-IN')}` : '-'} color="bg-green-500"  />
        <StatCard icon={TrendingUp}  title="Week Revenue"      value={stats ? `₹${parseFloat(stats.weekRevenue).toLocaleString('en-IN')}` : '-'} color="bg-emerald-500" />
        <StatCard icon={Clock}       title="Pending Verify"    value={stats?.pendingVerification ?? '-'}  color="bg-yellow-500"  />
        <StatCard icon={CheckCircle} title="Confirmed"         value={stats?.confirmed ?? '-'}            color="bg-green-600"   />
        <StatCard icon={Truck}       title="Delivered"         value={stats?.delivered ?? '-'}            color="bg-teal-500"    />
        <StatCard icon={Package}     title="Products"          value={productStats?.totalProducts ?? '-'} color="bg-accent-500"  />
      </div>

      {/* Charts Row */}
      <div className="grid lg:grid-cols-3 gap-5 mb-5">
        {/* Orders by Source */}
        {stats?.sourceBreakdown && (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
            <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2 text-sm">
              <BarChart3 className="w-4 h-4 text-accent-500" /> Orders by Source
            </h3>
            <div className="space-y-3">
              {stats.sourceBreakdown.map(s => {
                const total = stats.sourceBreakdown.reduce((sum, x) => sum + parseInt(x.count), 0);
                const pct = total > 0 ? (parseInt(s.count) / total * 100).toFixed(1) : 0;
                return (
                  <div key={s.order_source}>
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-gray-600">{sourceLabels[s.order_source] || s.order_source}</span>
                      <span className="font-semibold text-gray-800">{s.count} ({pct}%)</span>
                    </div>
                    <div className="w-full bg-gray-100 rounded-full h-1.5">
                      <div className={`h-1.5 rounded-full transition-all duration-700 ${sourceColors[s.order_source] || 'bg-gray-400'}`} style={{ width: `${pct}%` }} />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Payment Methods */}
        {stats?.paymentMethodStats && (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
            <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2 text-sm">
              <CreditCard className="w-4 h-4 text-accent-500" /> Payment Methods
            </h3>
            <div className="space-y-3">
              {stats.paymentMethodStats.length === 0 && <p className="text-gray-400 text-sm text-center py-3">No payment data yet</p>}
              {stats.paymentMethodStats.map(p => {
                const total = stats.paymentMethodStats.reduce((sum, x) => sum + parseInt(x.count), 0);
                const pct = total > 0 ? (parseInt(p.count) / total * 100).toFixed(1) : 0;
                const icon = p.method === 'upi' ? Wallet : p.method === 'bank' ? CreditCard : Smartphone;
                return (
                  <div key={p.method}>
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-gray-600 flex items-center gap-1.5"><icon className="w-3 h-3 text-gray-400" /> {p.method?.toUpperCase()}</span>
                      <span className="font-semibold">{p.count} ({pct}%)</span>
                    </div>
                    <div className="w-full bg-gray-100 rounded-full h-1.5">
                      <div className="h-1.5 rounded-full bg-brand-500 transition-all duration-700" style={{ width: `${pct}%` }} />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Order Status Flow */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
          <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2 text-sm">
            <Clock className="w-4 h-4 text-accent-500" /> Status Breakdown
          </h3>
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
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-gray-600 truncate pr-2">{s}</span>
                    <span className="font-semibold text-gray-800 flex-shrink-0">{count}</span>
                  </div>
                  <div className="w-full bg-gray-100 rounded-full h-1.5">
                    <div className={`h-1.5 rounded-full ${STATUS_COLORS[s]} transition-all duration-700`} style={{ width: `${pct}%` }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Bottom Row */}
      <div className="grid lg:grid-cols-2 gap-5 mb-5">
        {/* Recent Orders */}
        {stats?.recentOrders?.length > 0 && (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-gray-800 flex items-center gap-2 text-sm">
                <ShoppingBag className="w-4 h-4 text-accent-500" /> Recent Orders
              </h3>
              <Link to="/admin/orders" className="text-xs text-accent-600 hover:text-accent-700 flex items-center gap-1 font-medium">
                View all <ArrowRight className="w-3 h-3" />
              </Link>
            </div>
            <div className="space-y-2">
              {stats.recentOrders.map(o => (
                <div key={o.id} className="flex items-center justify-between py-2.5 border-b border-gray-50 last:border-0">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center text-xs font-bold text-gray-500">
                      #{o.id}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-800">{o.customer_name}</p>
                      <p className="text-xs text-gray-400">{o.order_source === 'online_payment' ? 'Online' : o.order_source}</p>
                    </div>
                  </div>
                  <span className="text-sm font-bold text-gray-800">₹{parseFloat(o.total_amount).toFixed(0)}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Low Stock */}
        {productStats?.lowStockProducts?.length > 0 && (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 border-l-4 border-l-red-500">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-gray-800 flex items-center gap-2 text-sm">
                <AlertTriangle className="w-4 h-4 text-red-500" /> Low Stock Alert
              </h3>
              <Link to="/admin/products" className="text-xs text-red-600 hover:text-red-700 flex items-center gap-1 font-medium">
                Manage <ArrowRight className="w-3 h-3" />
              </Link>
            </div>
            <div className="space-y-2">
              {productStats.lowStockProducts.map(p => (
                <div key={p.id} className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0">
                  <span className="text-sm text-gray-700">{p.name}</span>
                  <span className={`text-sm font-bold px-2 py-0.5 rounded-full ${p.stock <= 0 ? 'bg-red-100 text-red-700' : 'bg-orange-100 text-orange-700'}`}>
                    {p.stock <= 0 ? 'Out of stock' : `${p.stock} left`}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Quick Stats */}
      <div className="bg-gradient-to-r from-brand-600 to-brand-700 rounded-2xl p-6 text-white">
        <h3 className="font-bold mb-5 flex items-center gap-2">
          <Users className="w-5 h-5" /> Quick Overview
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {[
            { label: 'Orders Today', value: stats?.todayOrders ?? 0, bg: 'bg-white/15' },
            { label: 'Confirmed',    value: stats?.confirmed ?? 0,   bg: 'bg-white/15' },
            { label: 'Week Revenue', value: `₹${parseFloat(stats?.weekRevenue || 0).toFixed(0)}`, bg: 'bg-white/15' },
            { label: 'Low Stock',    value: productStats?.lowStockCount ?? 0, bg: 'bg-white/15' },
          ].map((s, i) => (
            <div key={i} className={`${s.bg} backdrop-blur-sm rounded-xl p-4 text-center`}>
              <p className="text-2xl font-bold">{s.value}</p>
              <p className="text-brand-100 text-xs mt-0.5">{s.label}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
