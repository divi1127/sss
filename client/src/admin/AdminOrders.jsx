import { useEffect, useState } from 'react';
import { ShoppingCart, Eye, Search, X, Filter, Download, Truck } from 'lucide-react';
import api from '../api/axios';

const STATUSES = ['Payment Verification Pending', 'Confirmed', 'Out for Delivery', 'Delivered', 'Cancelled', 'Payment Failed', 'Pending'];

export default function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [detail, setDetail] = useState(null);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [sourceFilter, setSourceFilter] = useState('');

  useEffect(() => { loadOrders(); }, []);

  useEffect(() => {
    let result = orders;
    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(o => o.customer_name?.toLowerCase().includes(q) || o.customer_phone?.includes(q) || String(o.id).includes(q));
    }
    if (statusFilter) result = result.filter(o => o.status === statusFilter);
    if (sourceFilter) result = result.filter(o => o.order_source === sourceFilter);
    setFiltered(result);
  }, [search, statusFilter, sourceFilter, orders]);

  const loadOrders = () => {
    api.get('/orders').then(res => { setOrders(res.data); setFiltered(res.data); }).catch(() => {});
  };

  const viewDetail = async (id) => {
    try {
      const res = await api.get(`/orders/${id}`);
      setDetail(res.data);
    } catch { alert('Failed to load order'); }
  };

  const updateStatus = async (id, status, trackingNumber, estimatedDelivery) => {
    try {
      await api.put(`/orders/${id}/status`, {
        status,
        ...(trackingNumber !== undefined ? { tracking_number: trackingNumber } : {}),
        ...(estimatedDelivery !== undefined ? { estimated_delivery: estimatedDelivery } : {}),
      });
      loadOrders();
      if (detail && detail.id === id) setDetail({ ...detail, status, tracking_number: trackingNumber, estimated_delivery: estimatedDelivery });
    } catch { alert('Failed to update status'); }
  };

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 flex items-center gap-3">
          <ShoppingCart className="w-7 h-7 sm:w-8 sm:h-8 text-accent-600" />
          Orders
          <span className="text-base font-normal text-gray-400">({filtered.length})</span>
        </h1>
        <button
          onClick={() => {
            const rows = [['ID','Customer','Phone','Amount','Status','Source','Date'], ...filtered.map(o => [o.id, o.customer_name, o.customer_phone, parseFloat(o.total_amount).toFixed(2), o.status, o.order_source, new Date(o.created_at).toLocaleDateString()])];
            const csv = rows.map(r => r.join(',')).join('\n');
            const a = document.createElement('a'); a.href = URL.createObjectURL(new Blob([csv],{type:'text/csv'})); a.download='orders.csv'; a.click();
          }}
          className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-green-700 transition-colors"
        >
          <Download className="w-4 h-4" /> Export CSV
        </button>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 mb-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input type="text" placeholder="Search by name, phone, or order ID..." value={search} onChange={e => setSearch(e.target.value)} className="w-full border rounded-lg pl-10 pr-10 py-2.5 focus:outline-none focus:ring-2 focus:ring-accent-400 text-sm" />
          {search && <button onClick={() => setSearch('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"><X className="w-4 h-4" /></button>}
        </div>
        <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)} className="border rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-accent-400 bg-white">
          <option value="">All Statuses</option>
          {STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
        </select>
        <select value={sourceFilter} onChange={e => setSourceFilter(e.target.value)} className="border rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-accent-400 bg-white">
          <option value="">All Sources</option>
          <option value="online_payment">Online Payment</option>
          <option value="whatsapp">WhatsApp</option>
          <option value="instagram">Instagram</option>
        </select>
      </div>

      <div className="bg-white rounded-xl shadow-md overflow-x-auto">
        <div className="min-w-[700px]">
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
              {filtered.map(o => (
                <tr key={o.id} className="border-t hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-3 font-medium text-sm">#{o.id}</td>
                  <td className="px-4 py-3 text-sm">{o.customer_name}<br /><span className="text-xs text-gray-500">{o.customer_phone}</span></td>
                  <td className="px-4 py-3 font-semibold text-sm">₹{parseFloat(o.total_amount).toFixed(2)}</td>
                  <td className="px-4 py-3">
                    <span className={`text-xs px-2 py-1 rounded ${o.order_source === 'online_payment' ? 'bg-blue-100 text-blue-700' : o.order_source === 'whatsapp' ? 'bg-green-100 text-green-700' : 'bg-pink-100 text-pink-700'}`}>
                      {o.order_source === 'online_payment' ? 'Online' : o.order_source === 'whatsapp' ? 'WhatsApp' : 'Instagram'}
                    </span>
                  </td>
                  <td className="px-4 py-3"><StatusBadge status={o.status} /></td>
                  <td className="px-4 py-3 text-sm text-gray-500">{new Date(o.created_at).toLocaleDateString()}</td>
                  <td className="px-4 py-3">
                    <button onClick={() => viewDetail(o.id)} className="flex items-center gap-1 text-accent-600 hover:text-accent-700 text-sm font-medium px-3 py-1.5 rounded-lg hover:bg-accent-50 transition-colors"><Eye className="w-3.5 h-3.5" /> View</button>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr><td colSpan="7" className="px-4 py-12 text-center text-gray-500">
                  <ShoppingCart className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                  <p>{search || statusFilter || sourceFilter ? 'No orders match your filters' : 'No orders yet'}</p>
                </td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {detail && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-start sm:items-center justify-center z-50 p-4 pt-16 sm:pt-4 overflow-y-auto">
          <div className="bg-white rounded-2xl p-6 w-full max-w-2xl shadow-2xl my-4">
            <div className="flex justify-between items-start mb-4">
              <h2 className="text-xl font-bold flex items-center gap-2"><ShoppingCart className="w-5 h-5 text-accent-600" /> Order #{detail.id}</h2>
              <button onClick={() => setDetail(null)} className="text-gray-500 hover:text-gray-700 text-2xl leading-none">&times;</button>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
              <div><strong>Customer:</strong> {detail.customer_name}</div>
              <div><strong>Phone:</strong> {detail.customer_phone}</div>
              <div className="col-span-2"><strong>Address:</strong> {detail.customer_address || 'N/A'}</div>
              {detail.customer_email && <div className="col-span-2"><strong>Email:</strong> {detail.customer_email}</div>}
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

              <div className="grid grid-cols-2 gap-2 mt-2 mb-3">
                <div>
                  <label className="text-xs text-gray-500 mb-1 block">Tracking Number</label>
                  <input
                    type="text"
                    placeholder="e.g. TRK123456"
                    defaultValue={detail.tracking_number || ''}
                    id="trackingInput"
                    className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-accent-400"
                  />
                </div>
                <div>
                  <label className="text-xs text-gray-500 mb-1 block">Estimated Delivery</label>
                  <input
                    type="date"
                    defaultValue={detail.estimated_delivery ? detail.estimated_delivery.substring(0,10) : ''}
                    id="deliveryInput"
                    className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-accent-400"
                  />
                </div>
              </div>

              <div className="flex flex-wrap gap-2">
                {STATUSES.map(s => (
                  <button
                    key={s}
                    onClick={() => updateStatus(
                      detail.id, s,
                      document.getElementById('trackingInput')?.value,
                      document.getElementById('deliveryInput')?.value,
                    )}
                    disabled={s === detail.status}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                      s === detail.status
                        ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                        : s === 'Cancelled' || s === 'Payment Failed'
                        ? 'bg-red-100 text-red-700 hover:bg-red-200'
                        : s === 'Confirmed'
                        ? 'bg-green-100 text-green-700 hover:bg-green-200'
                        : s === 'Out for Delivery'
                        ? 'bg-blue-100 text-blue-700 hover:bg-blue-200'
                        : s === 'Delivered'
                        ? 'bg-teal-100 text-teal-700 hover:bg-teal-200'
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
