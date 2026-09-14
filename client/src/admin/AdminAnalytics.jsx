import { useEffect, useState } from 'react';
import { TrendingUp, Users, ShoppingBag, IndianRupee, RefreshCw, BarChart3 } from 'lucide-react';
import api from '../api/axios';

function MiniBar({ value, max, color = 'bg-brand-500' }) {
  const pct = max > 0 ? Math.min((value / max) * 100, 100) : 0;
  return (
    <div className="w-full bg-gray-100 rounded-full h-1.5 mt-1">
      <div className={`h-1.5 rounded-full transition-all duration-700 ${color}`} style={{ width: `${pct}%` }} />
    </div>
  );
}

export default function AdminAnalytics() {
  const [stats, setStats] = useState(null);
  const [orders, setOrders] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = () => {
    setLoading(true);
    Promise.all([
      api.get('/orders/stats/summary').then(r => setStats(r.data)),
      api.get('/orders').then(r => setOrders(r.data)),
      api.get('/customers').then(r => setCustomers(r.data)).catch(() => {}),
    ]).catch(() => {}).finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  // Build last 7 days order trend
  const last7Days = () => {
    const days = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const label = d.toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric' });
      const count = orders.filter(o => {
        const od = new Date(o.created_at);
        return od.getFullYear() === d.getFullYear() && od.getMonth() === d.getMonth() && od.getDate() === d.getDate();
      }).length;
      const revenue = orders.filter(o => {
        const od = new Date(o.created_at);
        return od.getFullYear() === d.getFullYear() && od.getMonth() === d.getMonth() && od.getDate() === d.getDate()
          && ['Confirmed','Out for Delivery','Delivered'].includes(o.status);
      }).reduce((sum, o) => sum + parseFloat(o.total_amount), 0);
      days.push({ label, count, revenue });
    }
    return days;
  };

  const trend = last7Days();
  const maxCount = Math.max(...trend.map(d => d.count), 1);
  const maxRevenue = Math.max(...trend.map(d => d.revenue), 1);

  const deliveredPct = stats && stats.totalOrders > 0
    ? ((stats.delivered / stats.totalOrders) * 100).toFixed(1)
    : 0;
  const confirmedPct = stats && stats.totalOrders > 0
    ? ((stats.confirmed / stats.totalOrders) * 100).toFixed(1)
    : 0;

  if (loading && !stats) return (
    <div className="flex items-center justify-center min-h-[50vh]">
      <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-accent-600" />
    </div>
  );

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 flex items-center gap-3">
            <div className="w-10 h-10 bg-purple-500 rounded-xl flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-white" />
            </div>
            Analytics
          </h1>
          <p className="text-gray-500 text-sm mt-1">Performance trends and business insights</p>
        </div>
        <button onClick={load} className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-accent-600 transition-colors px-4 py-2 rounded-lg hover:bg-gray-100">
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} /> Refresh
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {[
          { icon: ShoppingBag, label: 'Total Orders', value: stats?.totalOrders ?? 0, sub: `${stats?.todayOrders ?? 0} today`, color: 'from-blue-500 to-blue-600' },
          { icon: IndianRupee, label: 'Total Revenue', value: `₹${parseFloat(stats?.revenue || 0).toFixed(0)}`, sub: `₹${parseFloat(stats?.weekRevenue || 0).toFixed(0)} this week`, color: 'from-green-500 to-green-600' },
          { icon: Users, label: 'Customers', value: customers.length || '—', sub: 'Unique buyers', color: 'from-purple-500 to-purple-600' },
          { icon: TrendingUp, label: 'Delivery Rate', value: `${deliveredPct}%`, sub: `${stats?.delivered ?? 0} delivered`, color: 'from-teal-500 to-teal-600' },
        ].map(c => (
          <div key={c.label} className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 overflow-hidden relative">
            <div className={`absolute top-0 right-0 w-20 h-20 bg-gradient-to-br ${c.color} opacity-10 rounded-bl-full`} />
            <div className={`w-9 h-9 bg-gradient-to-br ${c.color} rounded-lg flex items-center justify-center mb-3`}>
              <c.icon className="w-5 h-5 text-white" />
            </div>
            <p className="text-2xl font-bold text-gray-800">{c.value}</p>
            <p className="text-sm text-gray-500 mt-0.5">{c.label}</p>
            <p className="text-xs text-gray-400 mt-1">{c.sub}</p>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-6 mb-6">
        {/* 7-Day Order Chart */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h3 className="font-bold text-gray-800 mb-5 flex items-center gap-2">
            <BarChart3 className="w-4 h-4 text-accent-500" /> Orders — Last 7 Days
          </h3>
          <div className="flex items-end gap-2 h-40">
            {trend.map((d, i) => (
              <div key={i} className="flex-1 flex flex-col items-center gap-1">
                <span className="text-xs font-bold text-gray-700">{d.count}</span>
                <div
                  className="w-full bg-gradient-to-t from-brand-600 to-brand-400 rounded-t-md transition-all duration-700"
                  style={{ height: `${maxCount > 0 ? (d.count / maxCount) * 100 : 4}%`, minHeight: d.count > 0 ? '4px' : '2px' }}
                />
                <span className="text-[10px] text-gray-400 text-center leading-tight">{d.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* 7-Day Revenue Chart */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h3 className="font-bold text-gray-800 mb-5 flex items-center gap-2">
            <IndianRupee className="w-4 h-4 text-green-500" /> Revenue — Last 7 Days
          </h3>
          <div className="flex items-end gap-2 h-40">
            {trend.map((d, i) => (
              <div key={i} className="flex-1 flex flex-col items-center gap-1">
                <span className="text-[10px] font-bold text-gray-700">₹{d.revenue > 0 ? (d.revenue/1000).toFixed(1)+'k' : '0'}</span>
                <div
                  className="w-full bg-gradient-to-t from-green-600 to-green-400 rounded-t-md transition-all duration-700"
                  style={{ height: `${maxRevenue > 0 ? (d.revenue / maxRevenue) * 100 : 4}%`, minHeight: d.revenue > 0 ? '4px' : '2px' }}
                />
                <span className="text-[10px] text-gray-400 text-center leading-tight">{d.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Conversion Metrics */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <h3 className="font-bold text-gray-800 mb-5">Order Conversion Funnel</h3>
        <div className="space-y-4">
          {[
            { label: 'Orders Placed', value: stats?.totalOrders ?? 0, pct: 100, color: 'bg-blue-500' },
            { label: 'Confirmed', value: stats?.confirmed ?? 0, pct: confirmedPct, color: 'bg-green-500' },
            { label: 'Delivered', value: stats?.delivered ?? 0, pct: deliveredPct, color: 'bg-teal-500' },
            { label: 'Pending Verification', value: stats?.pendingVerification ?? 0, pct: stats?.totalOrders > 0 ? (stats.pendingVerification / stats.totalOrders * 100).toFixed(1) : 0, color: 'bg-yellow-500' },
          ].map(m => (
            <div key={m.label}>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-gray-600">{m.label}</span>
                <span className="font-semibold text-gray-800">{m.value} ({m.pct}%)</span>
              </div>
              <div className="w-full bg-gray-100 rounded-full h-2.5">
                <div className={`h-2.5 rounded-full ${m.color} transition-all duration-700`} style={{ width: `${m.pct}%` }} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
