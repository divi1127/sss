import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Search, Package, CheckCircle, Clock, Truck, AlertCircle, ShoppingBag } from 'lucide-react';
import api from '../api/axios';

const statusSteps = [
  { key: 'Payment Verification Pending', label: 'Payment Verification', icon: Clock },
  { key: 'Pending', label: 'Pending', icon: Clock },
  { key: 'Confirmed', label: 'Confirmed', icon: CheckCircle },
  { key: 'Out for Delivery', label: 'Out for Delivery', icon: Truck },
  { key: 'Delivered', label: 'Delivered', icon: ShoppingBag },
];

export default function TrackOrder() {
  const { id: urlId } = useParams();
  const [orderId, setOrderId] = useState(urlId || '');
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (urlId) {
      setOrderId(urlId);
      handleTrackSubmit(urlId);
    }
  }, [urlId]);

  const handleTrackSubmit = async (id) => {
    if (!id?.trim()) return;
    setLoading(true);
    setError('');
    setOrder(null);
    try {
      const res = await api.get(`/orders/track/${id.trim()}`);
      setOrder(res.data);
    } catch (err) {
      setError(err.response?.data?.error || 'Order not found');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    handleTrackSubmit(orderId);
  };

  const getCurrentStepIndex = (status) => {
    const idx = statusSteps.findIndex(s => s.key === status);
    return idx >= 0 ? idx : -1;
  };

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-16">
      <div className="animate-fade-in-up">
        <div className="text-center mb-8">
          <Package className="w-12 h-12 text-brand-600 mx-auto mb-3" />
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-800 mb-2">Track Your Order</h1>
          <p className="text-gray-500">Enter your order ID to check the current status.</p>
        </div>

        <form onSubmit={handleSubmit} className="flex gap-3 mb-8">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input required type="text" placeholder="Order ID (e.g. 123)" value={orderId} onChange={e => setOrderId(e.target.value)} className="w-full border rounded-xl pl-10 pr-4 py-3.5 focus:outline-none focus:ring-2 focus:ring-accent-400 text-lg" />
          </div>
          <button type="submit" disabled={loading} className="bg-brand-600 text-white px-8 py-3.5 rounded-xl hover:bg-brand-700 transition-all font-bold shadow-lg disabled:opacity-50 border border-brand-500">
            {loading ? '...' : 'Track'}
          </button>
        </form>

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center animate-fade-in">
            <AlertCircle className="w-10 h-10 text-red-500 mx-auto mb-2" />
            <p className="text-red-700 font-medium">{error}</p>
            <p className="text-red-500 text-sm mt-1">Please check the order ID and try again.</p>
          </div>
        )}

        {order && (
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 sm:p-8 animate-fade-in-up">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 pb-4 border-b border-gray-100">
              <div>
                <h2 className="text-lg font-bold text-gray-800">Order #{order.id}</h2>
                <p className="text-sm text-gray-500">{new Date(order.created_at).toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' })}</p>
              </div>
              <div className="mt-2 sm:mt-0">
                <span className="text-2xl font-bold text-gray-800">₹{parseFloat(order.total_amount).toFixed(2)}</span>
              </div>
            </div>

            <div className="mb-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-gray-700">Current Status</h3>
                <StatusBadge status={order.status} />
              </div>
              <div className="relative">
                {statusSteps.map((step, i) => {
                  const currentIdx = getCurrentStepIndex(order.status);
                  const isCompleted = i < currentIdx;
                  const isCurrent = i === currentIdx;
                  const isCancelled = order.status === 'Cancelled' || order.status === 'Payment Failed';
                  const Icon = step.icon;

                  let dotColor = 'bg-gray-300';
                  let lineColor = 'bg-gray-200';
                  let textColor = 'text-gray-400';

                  if (isCancelled && isCurrent) {
                    dotColor = 'bg-red-500';
                    lineColor = 'bg-red-300';
                    textColor = 'text-red-600';
                  } else if (isCompleted) {
                    dotColor = 'bg-green-500';
                    lineColor = 'bg-green-400';
                    textColor = 'text-green-700';
                  } else if (isCurrent) {
                    dotColor = 'bg-accent-500';
                    lineColor = 'bg-accent-300';
                    textColor = 'text-accent-700';
                  }

                  return (
                    <div key={step.key} className="flex items-start mb-2">
                      <div className="flex flex-col items-center mr-4">
                        <div className={`w-8 h-8 rounded-full ${dotColor} flex items-center justify-center shadow-sm`}>
                          {isCompleted ? <CheckCircle className="w-4 h-4 text-white" /> : <Icon className="w-4 h-4 text-white" />}
                        </div>
                        {i < statusSteps.length - 1 && <div className={`w-0.5 h-8 ${lineColor}`} />}
                      </div>
                      <div className={`pt-1 pb-6 ${textColor}`}>
                        <p className={`text-sm font-medium ${isCurrent ? 'font-bold' : ''}`}>
                          {isCancelled && isCurrent ? (
                            <span className="text-red-600">{order.status === 'Cancelled' ? 'Cancelled' : 'Payment Failed'}</span>
                          ) : step.label}
                        </p>
                        {isCurrent && !isCancelled && <p className="text-xs text-gray-400">Current status</p>}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {order.items && order.items.length > 0 && (
              <div className="mb-4">
                <h3 className="font-semibold text-gray-700 mb-3">Items Ordered</h3>
                <div className="divide-y divide-gray-100">
                  {order.items.map((item, i) => (
                    <div key={i} className="flex justify-between py-2 text-sm">
                      <span className="text-gray-700">{item.product_name || 'Product'} <span className="text-gray-400">x{item.quantity}</span></span>
                      <span className="font-medium text-gray-800">₹{(item.quantity * parseFloat(item.price)).toFixed(2)}</span>
                    </div>
                  ))}
                </div>
                <div className="flex justify-between pt-3 mt-2 border-t border-gray-100 font-bold text-base">
                  <span className="text-gray-700">Total</span>
                  <span className="text-gray-800">₹{parseFloat(order.total_amount).toFixed(2)}</span>
                </div>
              </div>
            )}

            <div className="bg-gray-50 rounded-xl p-4 text-sm text-gray-600 space-y-1">
              <p><strong>Customer:</strong> {order.customer_name}</p>
              <p><strong>Phone:</strong> {order.customer_phone}</p>
              <p><strong>Source:</strong> {order.order_source === 'online_payment' ? 'Online Payment' : order.order_source === 'whatsapp' ? 'WhatsApp' : 'Instagram'}</p>
            </div>
          </div>
        )}
      </div>
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
  return <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${colors[status] || 'bg-gray-100 text-gray-700'}`}>{status}</span>;
}
