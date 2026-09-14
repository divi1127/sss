import { useEffect, useState } from 'react';
import { BarChart3, Download, RefreshCw, IndianRupee, ShoppingBag, TrendingUp, Package } from 'lucide-react';
import api from '../api/axios';

export default function AdminReports() {
  const [stats, setStats] = useState(null);
  const [orders, setOrders] = useState([]);
  const [products, setProducts] = useState([]);
  const [dateRange, setDateRange] = useState('all');
  const [loading, setLoading] = useState(true);

  const load = () => {
    setLoading(true);
    Promise.all([
      api.get('/orders/stats/summary').then(r => setStats(r.data)),
      api.get('/orders').then(r => setOrders(r.data)),
      api.get('/products').then(r => setProducts(r.data)),
    ]).catch(() => {}).finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  const filterOrders = (orders) => {
    if (dateRange === 'all') return orders;
    const now = new Date();
    const start = new Date();
    if (dateRange === 'today') start.setHours(0,0,0,0);
    else if (dateRange === 'week') start.setDate(now.getDate() - 7);
    else if (dateRange === 'month') start.setMonth(now.getMonth() - 1);
    return orders.filter(o => new Date(o.created_at) >= start);
  };

  const filtered = filterOrders(orders);
  const revenue = filtered
    .filter(o => ['Confirmed','Out for Delivery','Delivered'].includes(o.status))
    .reduce((sum, o) => sum + parseFloat(o.total_amount), 0);
  const byStatus = {};
  filtered.forEach(o => { byStatus[o.status] = (byStatus[o.status] || 0) + 1; });

  // Product sales from orders
  const productSales = {};
  orders.forEach(order => {
    // We'd need order items, but use total count per status for now
  });

  const exportCSV = () => {
    const rows = [
      ['Order ID', 'Customer', 'Phone', 'Amount', 'Status', 'Source', 'Date'],
      ...filtered.map(o => [
        o.id, o.customer_name, o.customer_phone,
        parseFloat(o.total_amount).toFixed(2),
        o.status, o.order_source,
        new Date(o.created_at).toLocaleDateString('en-IN')
      ])
    ];
    const csv = rows.map(r => r.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a'); a.href = url; a.download = `scube-orders-${dateRange}.csv`; a.click();
    URL.revokeObjectURL(url);
  };

  const STATUS_COLORS = {
    'Payment Verification Pending': 'bg-yellow-500',
    'Confirmed': 'bg-green-500',
    'Out for Delivery': 'bg-blue-500',
    'Delivered': 'bg-teal-500',
    'Cancelled': 'bg-red-500',
    'Pending': 'bg-orange-500',
    'Payment Failed': 'bg-red-700',
  };

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-500 rounded-xl flex items-center justify-center">
              <BarChart3 className="w-5 h-5 text-white" />
            </div>
            Reports
          </h1>
          <p className="text-gray-500 text-sm mt-1">Sales performance and order summaries</p>
        </div>
        <div className="flex gap-2">
          <select
            value={dateRange} onChange={e => setDateRange(e.target.value)}
            className="border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-accent-400 bg-white"
          >
            <option value="all">All Time</option>
            <option value="today">Today</option>
            <option value="week">Last 7 Days</option>
            <option value="month">Last 30 Days</option>
          </select>
          <button
            onClick={exportCSV}
            className="flex items-center gap-2 bg-brand-600 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-brand-700 transition-colors"
          >
            <Download className="w-4 h-4" /> Export CSV
          </button>
          <button onClick={load} className="text-gray-500 hover:text-accent-600 p-2 rounded-lg hover:bg-gray-100 transition-colors">
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {[
          { icon: ShoppingBag, label: 'Total Orders', value: filtered.length, color: 'bg-blue-500' },
          { icon: IndianRupee, label: 'Revenue', value: `₹${revenue.toFixed(2)}`, color: 'bg-green-500' },
          { icon: TrendingUp, label: 'Avg Order Value', value: filtered.length > 0 ? `₹${(revenue / filtered.length).toFixed(0)}` : '₹0', color: 'bg-purple-500' },
          { icon: Package, label: 'Products', value: products.length, color: 'bg-orange-500' },
        ].map(c => (
          <div key={c.label} className="bg-white rounded-xl shadow-sm p-5 border border-gray-100">
            <div className={`w-9 h-9 ${c.color} rounded-lg flex items-center justify-center mb-3`}>
              <c.icon className="w-5 h-5 text-white" />
            </div>
            <p className="text-2xl font-bold text-gray-800">{c.value}</p>
            <p className="text-sm text-gray-500 mt-0.5">{c.label}</p>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-6 mb-6">
        {/* Order Status Breakdown */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h3 className="font-bold text-gray-800 mb-4">Orders by Status</h3>
          <div className="space-y-3">
            {Object.entries(byStatus).map(([status, count]) => {
              const pct = filtered.length > 0 ? (count / filtered.length * 100).toFixed(1) : 0;
              return (
                <div key={status}>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-600">{status}</span>
                    <span className="font-semibold text-gray-800">{count} ({pct}%)</span>
                  </div>
                  <div className="w-full bg-gray-100 rounded-full h-2">
                    <div className={`h-2 rounded-full transition-all duration-700 ${STATUS_COLORS[status] || 'bg-gray-400'}`} style={{ width: `${pct}%` }} />
                  </div>
                </div>
              );
            })}
            {Object.keys(byStatus).length === 0 && <p className="text-gray-400 text-sm text-center py-4">No data for this period</p>}
          </div>
        </div>

        {/* Source Breakdown */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h3 className="font-bold text-gray-800 mb-4">Orders by Source</h3>
          {stats?.sourceBreakdown?.length > 0 ? (
            <div className="space-y-3">
              {stats.sourceBreakdown.map(s => {
                const total = stats.sourceBreakdown.reduce((sum, x) => sum + parseInt(x.count), 0);
                const pct = total > 0 ? (parseInt(s.count) / total * 100).toFixed(1) : 0;
                const labels = { online_payment: 'Online Payment', whatsapp: 'WhatsApp', instagram: 'Instagram' };
                const colors = { online_payment: 'bg-blue-500', whatsapp: 'bg-green-500', instagram: 'bg-pink-500' };
                return (
                  <div key={s.order_source}>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-gray-600">{labels[s.order_source] || s.order_source}</span>
                      <span className="font-semibold">{s.count} ({pct}%)</span>
                    </div>
                    <div className="w-full bg-gray-100 rounded-full h-2">
                      <div className={`h-2 rounded-full transition-all duration-700 ${colors[s.order_source] || 'bg-gray-400'}`} style={{ width: `${pct}%` }} />
                    </div>
                  </div>
                );
              })}
            </div>
          ) : <p className="text-gray-400 text-sm text-center py-4">No source data</p>}
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100">
        <div className="p-4 border-b border-gray-100 flex justify-between items-center">
          <h3 className="font-bold text-gray-800">Orders ({filtered.length})</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[600px] text-sm">
            <thead className="bg-gray-50">
              <tr>
                {['ID','Customer','Amount','Status','Source','Date'].map(h => (
                  <th key={h} className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.slice(0, 20).map(o => (
                <tr key={o.id} className="border-t border-gray-50 hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-3 font-medium">#{o.id}</td>
                  <td className="px-4 py-3">{o.customer_name}</td>
                  <td className="px-4 py-3 font-semibold">₹{parseFloat(o.total_amount).toFixed(2)}</td>
                  <td className="px-4 py-3">
                    <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                      o.status === 'Delivered' ? 'bg-teal-100 text-teal-700' :
                      o.status === 'Confirmed' ? 'bg-green-100 text-green-700' :
                      o.status === 'Cancelled' ? 'bg-red-100 text-red-700' :
                      'bg-yellow-100 text-yellow-700'
                    }`}>{o.status}</span>
                  </td>
                  <td className="px-4 py-3 text-gray-500 capitalize">{o.order_source === 'online_payment' ? 'Online' : o.order_source}</td>
                  <td className="px-4 py-3 text-gray-500">{new Date(o.created_at).toLocaleDateString('en-IN')}</td>
                </tr>
              ))}
              {filtered.length > 20 && (
                <tr><td colSpan="6" className="px-4 py-3 text-center text-gray-400 text-xs">
                  Showing 20 of {filtered.length} orders. Export CSV for full report.
                </td></tr>
              )}
              {filtered.length === 0 && (
                <tr><td colSpan="6" className="px-4 py-8 text-center text-gray-400">No orders in this period</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
