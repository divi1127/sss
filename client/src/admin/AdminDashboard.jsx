import { useEffect, useState } from 'react';
import { ShoppingBag, Clock, CheckCircle, Truck, IndianRupee, Package, AlertTriangle, RefreshCw } from 'lucide-react';
import api from '../api/axios';

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

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">Dashboard</h1>
        <button onClick={loadData} className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-accent-600 transition-colors px-4 py-2 rounded-lg hover:bg-gray-100 self-start sm:self-auto">
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} /> Refresh
        </button>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-8">
        <StatCard icon={ShoppingBag} title="Total Orders" value={stats?.totalOrders ?? '-'} color="bg-blue-500" />
        <StatCard icon={Clock} title="Pending Verification" value={stats?.pendingVerification ?? '-'} color="bg-yellow-500" />
        <StatCard icon={CheckCircle} title="Confirmed" value={stats?.confirmed ?? '-'} color="bg-green-500" />
        <StatCard icon={Truck} title="Delivered" value={stats?.delivered ?? '-'} color="bg-teal-500" />
        <StatCard icon={IndianRupee} title="Revenue" value={stats ? `₹${parseFloat(stats.revenue).toFixed(2)}` : '-'} color="bg-purple-500" />
        <StatCard icon={Package} title="Total Products" value={productStats?.totalProducts ?? '-'} color="bg-accent-500" />
        <StatCard icon={AlertTriangle} title="Low Stock Alerts" value={productStats?.lowStockCount ?? '-'} color="bg-red-500" />
      </div>

      {productStats?.lowStockProducts?.length > 0 && (
        <div className="bg-white rounded-xl shadow-md p-4 sm:p-6 border-l-4 border-red-500 overflow-x-auto">
          <div className="flex items-center gap-2 mb-4">
            <AlertTriangle className="w-5 h-5 text-red-500 flex-shrink-0" />
            <h2 className="text-lg font-bold text-gray-800">Low Stock Products</h2>
          </div>
          <div className="min-w-[300px]">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b text-left text-gray-500">
                  <th className="py-2 pr-4 font-semibold">Product</th>
                  <th className="py-2 pr-4 font-semibold">Stock</th>
                  <th className="py-2 font-semibold">Status</th>
                </tr>
              </thead>
              <tbody>
                {productStats.lowStockProducts.map(p => (
                  <tr key={p.id} className="border-b border-gray-50">
                    <td className="py-2 pr-4 font-medium text-gray-800">{p.name}</td>
                    <td className="py-2 pr-4">
                      <span className={p.stock <= 0 ? 'text-red-600 font-bold' : 'text-orange-500 font-medium'}>{p.stock}</span>
                    </td>
                    <td className="py-2">
                      <span className={`px-2 py-0.5 rounded text-xs font-medium ${p.stock <= 0 ? 'bg-red-100 text-red-700' : 'bg-orange-100 text-orange-700'}`}>
                        {p.stock <= 0 ? 'Out of Stock' : 'Low Stock'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
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
