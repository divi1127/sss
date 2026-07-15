import { useEffect, useState } from 'react';
import { ShoppingCart, Eye, Check, X, Truck, Clock, AlertTriangle } from 'lucide-react';
import api from '../api/axios';

const STATUSES = ['Payment Verification Pending', 'Confirmed', 'Out for Delivery', 'Delivered', 'Cancelled', 'Payment Failed', 'Pending'];

export default function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [detail, setDetail] = useState(null);

  useEffect(() => { loadOrders(); }, []);

  const loadOrders = () => {
    api.get('/orders').then(res => setOrders(res.data)).catch(() => {});
  };

  const viewDetail = async (id) => {
    try {
      const res = await api.get(`/orders/${id}`);
      setDetail(res.data);
    } catch { alert('Failed to load order'); }
  };

  const updateStatus = async (id, status) => {
    try {
      await api.put(`/orders/${id}/status`, { status });
      loadOrders();
      if (detail && detail.id === id) setDetail({ ...detail, status });
    } catch { alert('Failed to update status'); }
  };

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-800 mb-6 flex items-center gap-3">
        <ShoppingCart className="w-8 h-8 text-accent-600" />
        Orders
        <span className="text-base font-normal text-gray-400">({orders.length})</span>
      </h1>

      <div className="bg-white rounded-xl shadow-md overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="text-left px-4 py-3 text-sm font-semibold text-gray-600">Order ID</th>
              <th className="text-left px-4 py-3 text-sm font-semibold text-gray-600">Customer</th>
              <th className="text-left px-4 py-3 text-sm font-semibold text-gray-600">Total</th>
              <th className="text-left px-4 py-3 text-sm font-semibold text-gray-600">Source</th>
              <th className="text-left px-4 py-3 text-sm font-semibold text-gray-600">Status</th>
              <th className="text-left px-4 py-3 text-sm font-semibold text-gray-600">Date</th>
              <th className="text-left px-4 py-3 text-sm font-semibold text-gray-600">Actions</th>
            </tr>
          </thead>
          <tbody>
            {orders.map(o => (
              <tr key={o.id} className="border-t">
                <td className="px-4 py-3 font-medium">#{o.id}</td>
                <td className="px-4 py-3">{o.customer_name}<br /><span className="text-xs text-gray-500">{o.customer_phone}</span></td>
                <td className="px-4 py-3">₹{parseFloat(o.total_amount).toFixed(2)}</td>
                <td className="px-4 py-3">
                  <span className={`text-xs px-2 py-1 rounded ${o.order_source === 'online_payment' ? 'bg-blue-100 text-blue-700' : o.order_source === 'whatsapp' ? 'bg-green-100 text-green-700' : 'bg-pink-100 text-pink-700'}`}>
                    {o.order_source === 'online_payment' ? 'Online' : o.order_source === 'whatsapp' ? 'WhatsApp' : 'Instagram'}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <StatusBadge status={o.status} />
                </td>
                <td className="px-4 py-3 text-sm text-gray-500">{new Date(o.created_at).toLocaleDateString()}</td>
                <td className="px-4 py-3">
                  <button onClick={() => viewDetail(o.id)} className="flex items-center gap-1 text-accent-600 hover:text-accent-700 text-sm font-medium px-3 py-1.5 rounded-lg hover:bg-accent-50 transition-colors"><Eye className="w-3.5 h-3.5" /> View</button>
                </td>
              </tr>
            ))}
            {orders.length === 0 && (
              <tr><td colSpan="7" className="px-4 py-8 text-center text-gray-500">No orders yet</td></tr>
            )}
          </tbody>
        </table>
      </div>

      {detail && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="flex justify-between items-start mb-4">
              <h2 className="text-xl font-bold flex items-center gap-2"><ShoppingCart className="w-5 h-5 text-accent-600" /> Order #{detail.id}</h2>
              <button onClick={() => setDetail(null)} className="text-gray-500 hover:text-gray-700 text-2xl leading-none">&times;</button>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
              <div><strong>Customer:</strong> {detail.customer_name}</div>
              <div><strong>Phone:</strong> {detail.customer_phone}</div>
              <div className="col-span-2"><strong>Address:</strong> {detail.customer_address || 'N/A'}</div>
              <div><strong>Source:</strong> {detail.order_source}</div>
              <div><strong>Total:</strong> ₹{parseFloat(detail.total_amount).toFixed(2)}</div>
              <div><strong>Date:</strong> {new Date(detail.created_at).toLocaleString()}</div>
              <div><strong>Status:</strong> <StatusBadge status={detail.status} /></div>
            </div>

            {detail.payment_screenshot_url && (
              <div className="mb-4">
                <strong className="text-sm">Payment Screenshot:</strong>
                <div className="mt-2">
                  <img src={detail.payment_screenshot_url} alt="Payment proof" className="max-h-64 rounded-lg border" />
                </div>
              </div>
            )}

            <div className="mb-4">
              <strong className="text-sm">Items:</strong>
              <table className="w-full mt-2 text-sm">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-2">Product</th>
                    <th className="text-left py-2">Qty</th>
                    <th className="text-left py-2">Price</th>
                    <th className="text-left py-2">Subtotal</th>
                  </tr>
                </thead>
                <tbody>
                  {(detail.items || []).map(item => (
                    <tr key={item.id} className="border-b">
                      <td className="py-2">{item.product_name || `Product #${item.product_id}`}</td>
                      <td className="py-2">{item.quantity}</td>
                      <td className="py-2">₹{parseFloat(item.price).toFixed(2)}</td>
                      <td className="py-2">₹{(item.quantity * parseFloat(item.price)).toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="border-t pt-4">
              <strong className="text-sm">Update Status:</strong>
              <div className="flex flex-wrap gap-2 mt-2">
                {STATUSES.map(s => (
                  <button
                    key={s}
                    onClick={() => updateStatus(detail.id, s)}
                    disabled={s === detail.status}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                      s === detail.status
                        ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                        : s === 'Cancelled' || s === 'Payment Failed'
                        ? 'bg-red-100 text-red-700 hover:bg-red-200'
                        : s === 'Confirmed'
                        ? 'bg-green-100 text-green-700 hover:bg-green-200'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function StatusBadge({ status }) {
  const colors = {
    'Payment Verification Pending': 'bg-yellow-100 text-yellow-700',
    'Pending': 'bg-yellow-100 text-yellow-700',
    'Confirmed': 'bg-green-100 text-green-700',
    'Out for Delivery': 'bg-blue-100 text-blue-700',
    'Delivered': 'bg-teal-100 text-teal-700',
    'Cancelled': 'bg-red-100 text-red-700',
    'Payment Failed': 'bg-red-100 text-red-700',
  };
  return (
    <span className={`text-xs px-2 py-1 rounded ${colors[status] || 'bg-gray-100 text-gray-700'}`}>{status}</span>
  );
}
