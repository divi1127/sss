import { useEffect, useState } from 'react';
import { ShoppingBag, Clock, CheckCircle, Truck, IndianRupee, Package, AlertTriangle } from 'lucide-react';
import api from '../api/axios';

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [productStats, setProductStats] = useState(null);

  useEffect(() => {
    api.get('/orders/stats/summary').then(res => setStats(res.data)).catch(() => {});
    api.get('/products/stats/summary').then(res => setProductStats(res.data)).catch(() => {});
  }, []);

  if (!stats) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent-600"></div>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-800 mb-8">Dashboard</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard icon={ShoppingBag} title="Total Orders" value={stats.totalOrders} color="bg-blue-500" />
        <StatCard icon={Clock} title="Pending Verification" value={stats.pendingVerification} color="bg-yellow-500" />
        <StatCard icon={CheckCircle} title="Confirmed" value={stats.confirmed} color="bg-green-500" />
        <StatCard icon={Truck} title="Delivered" value={stats.delivered} color="bg-teal-500" />
        <StatCard icon={IndianRupee} title="Revenue" value={`₹${parseFloat(stats.revenue).toFixed(2)}`} color="bg-purple-500" span={true} />
        <StatCard icon={Package} title="Total Products" value={productStats?.totalProducts ?? '...'} color="bg-accent-500" />
        <StatCard icon={AlertTriangle} title="Low Stock Alerts" value={productStats?.lowStockCount ?? '...'} color="bg-red-500" />
      </div>

      {productStats?.lowStockProducts?.length > 0 && (
        <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-red-500">
          <div className="flex items-center gap-2 mb-4">
            <AlertTriangle className="w-5 h-5 text-red-500" />
            <h2 className="text-lg font-bold text-gray-800">Low Stock Products</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b text-left text-gray-500">
                  <th className="py-2 font-semibold">Product</th>
                  <th className="py-2 font-semibold">Stock</th>
                  <th className="py-2 font-semibold">Status</th>
                </tr>
              </thead>
              <tbody>
                {productStats.lowStockProducts.map((p, i) => (
                  <tr key={p.id} className="border-b border-gray-50">
                    <td className="py-2 font-medium text-gray-800">{p.name}</td>
                    <td className="py-2">
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

function StatCard({ icon: Icon, title, value, color, span }) {
  return (
    <div className={`bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow ${span ? 'sm:col-span-2' : ''}`}>
      <div className="flex items-center justify-between mb-3">
        <div className={`w-10 h-10 rounded-lg ${color} flex items-center justify-center`}>
          <Icon className="w-5 h-5 text-white" />
        </div>
      </div>
      <p className="text-gray-500 text-sm font-medium">{title}</p>
      <p className="text-2xl font-bold text-gray-800 mt-1">{value}</p>
    </div>
  );
}
