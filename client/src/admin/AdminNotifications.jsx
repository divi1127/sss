import { useEffect, useState } from 'react';
import { Bell, ShoppingCart, Clock, CheckCircle, Eye, RefreshCw, Package } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';

export default function AdminNotifications() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const load = () => {
    setLoading(true);
    api.get('/orders').then(res => {
      // Sort by newest first, highlight pending/new orders
      const sorted = [...res.data].sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
      setOrders(sorted.slice(0, 50));
    }).catch(() => {}).finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  const pendingOrders = orders.filter(o =>
    o.status === 'Payment Verification Pending' || o.status === 'Pending'
  );
  const recentOrders = orders.filter(o =>
    o.status !== 'Payment Verification Pending' && o.status !== 'Pending'
  );

  const statusIcon = (status) => {
    if (status === 'Payment Verification Pending' || status === 'Pending') return <Clock className="w-4 h-4 text-yellow-500" />;
    if (status === 'Confirmed') return <CheckCircle className="w-4 h-4 text-green-500" />;
    if (status === 'Delivered') return <Package className="w-4 h-4 text-teal-500" />;
    return <ShoppingCart className="w-4 h-4 text-blue-500" />;
  };

  const timeAgo = (dateStr) => {
    const diff = Date.now() - new Date(dateStr).getTime();
    const mins = Math.floor(diff / 60000);
    const hrs = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);
    if (mins < 60) return `${mins}m ago`;
    if (hrs < 24) return `${hrs}h ago`;
    return `${days}d ago`;
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 flex items-center gap-3">
            <div className="w-10 h-10 bg-yellow-500 rounded-xl flex items-center justify-center">
              <Bell className="w-5 h-5 text-white" />
            </div>
            Notifications
          </h1>
          <p className="text-gray-500 text-sm mt-1">Stay updated on orders and activity</p>
        </div>
        <button onClick={load} className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-accent-600 transition-colors px-4 py-2 rounded-lg hover:bg-gray-100">
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} /> Refresh
        </button>
      </div>

      {pendingOrders.length > 0 && (
        <div className="mb-8">
          <h2 className="text-base font-bold text-gray-700 mb-3 flex items-center gap-2">
            <span className="w-2 h-2 bg-yellow-500 rounded-full animate-pulse" />
            Action Required ({pendingOrders.length})
          </h2>
          <div className="space-y-3">
            {pendingOrders.map(o => (
              <div key={o.id} className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-yellow-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <Clock className="w-5 h-5 text-yellow-600" />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-800 text-sm">
                      New Order #{o.id} — <span className="font-bold text-yellow-700">₹{parseFloat(o.total_amount).toFixed(2)}</span>
                    </p>
                    <p className="text-xs text-gray-500 mt-0.5">{o.customer_name} · {o.customer_phone} · {timeAgo(o.created_at)}</p>
                    <span className="text-xs bg-yellow-200 text-yellow-800 px-2 py-0.5 rounded-full font-medium mt-1 inline-block">{o.status}</span>
                  </div>
                </div>
                <button
                  onClick={() => navigate('/admin/orders')}
                  className="flex items-center gap-1.5 bg-yellow-500 text-white px-4 py-2 rounded-lg text-sm font-bold hover:bg-yellow-600 transition-colors flex-shrink-0"
                >
                  <Eye className="w-3.5 h-3.5" /> View
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      <div>
        <h2 className="text-base font-bold text-gray-700 mb-3">Recent Orders</h2>
        {loading ? (
          <div className="space-y-3">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="bg-white rounded-xl p-4 h-16 skeleton" />
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 divide-y divide-gray-50">
            {recentOrders.length === 0 && pendingOrders.length === 0 && (
              <div className="py-16 text-center text-gray-400">
                <Bell className="w-12 h-12 mx-auto mb-3 text-gray-200" />
                <p>No notifications yet</p>
              </div>
            )}
            {recentOrders.map(o => (
              <div key={o.id} className="flex items-center justify-between px-4 py-3 hover:bg-gray-50 transition-colors">
                <div className="flex items-center gap-3">
                  <div className="flex-shrink-0">{statusIcon(o.status)}</div>
                  <div>
                    <p className="text-sm font-medium text-gray-800">Order #{o.id} · {o.customer_name}</p>
                    <p className="text-xs text-gray-400">{o.status} · ₹{parseFloat(o.total_amount).toFixed(2)} · {timeAgo(o.created_at)}</p>
                  </div>
                </div>
                <button
                  onClick={() => navigate('/admin/orders')}
                  className="text-accent-600 hover:text-accent-700 text-xs font-medium px-2 py-1 rounded hover:bg-accent-50 transition-colors"
                >
                  View
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
