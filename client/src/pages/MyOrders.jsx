import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { PackageSearch } from 'lucide-react';
import api from '../api/axios';
import { useCustomerAuth } from '../context/CustomerAuthContext';

export default function MyOrders() {
  const { isAuthenticated, loading: authLoading, user } = useCustomerAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    if (authLoading) return;
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    api.get('/orders/my').then(res => {
      setOrders(res.data);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, [isAuthenticated, authLoading, navigate]);

  if (authLoading || loading) return (
    <div className="flex items-center justify-center min-h-[50vh]">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent-600"></div>
    </div>
  );

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="animate-fade-in-up">
        <h1 className="text-3xl sm:text-4xl font-bold text-gray-800 mb-2 flex items-center">
          <PackageSearch className="w-8 h-8 mr-3 text-accent-500" />
          My Orders
        </h1>
        <p className="text-gray-500 mb-8">Welcome back, <span className="font-medium text-gray-700">{user?.name}</span></p>
      </div>

      {orders.length === 0 ? (
        <div className="text-center py-16 animate-fade-in">
          <PackageSearch className="w-20 h-20 mx-auto mb-6 text-gray-300" />
          <h2 className="text-2xl font-bold text-gray-800 mb-2">No Orders Yet</h2>
          <p className="text-gray-500 mb-8">You haven't placed any orders. Browse our products and place your first order!</p>
          <Link to="/products" className="inline-flex items-center bg-brand-600 text-white px-8 py-3.5 rounded-xl hover:bg-brand-700 transition-all font-bold shadow-lg border border-brand-500">
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" /></svg>
            Browse Products
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order, i) => (
            <div key={order.id} className={`bg-white rounded-xl shadow-sm border border-gray-100 p-5 sm:p-6 hover:shadow-md transition-all animate-fade-in-up`} style={{ animationDelay: `${i * 0.05}s` }}>
              <div className="flex flex-col sm:flex-row justify-between items-start gap-3 mb-4">
                <div>
                  <p className="text-sm text-gray-400">Order <span className="font-semibold text-gray-700">#{order.id}</span></p>
                  <p className="text-xs text-gray-400 mt-0.5">{new Date(order.created_at).toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' })}</p>
                </div>
                <div className="flex items-center space-x-3">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                    order.status === 'Delivered' ? 'bg-teal-100 text-teal-700' :
                    order.status === 'Confirmed' || order.status === 'Out for Delivery' ? 'bg-green-100 text-green-700' :
                    order.status === 'Cancelled' || order.status === 'Payment Failed' ? 'bg-red-100 text-red-700' :
                    'bg-yellow-100 text-yellow-700'
                  }`}>{order.status}</span>
                </div>
              </div>

              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center space-x-4">
                  <span className="text-gray-500 flex items-center">
                    <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                    {order.customer_address || 'No address'}
                  </span>
                  <span className={`text-xs px-2 py-1 rounded ${
                    order.order_source === 'online_payment' ? 'bg-accent-100 text-accent-700' :
                    order.order_source === 'whatsapp' ? 'bg-green-100 text-green-700' : 'bg-pink-100 text-pink-700'
                  }`}>
                    {order.order_source === 'online_payment' ? 'Online Payment' : order.order_source === 'whatsapp' ? 'WhatsApp' : 'Instagram'}
                  </span>
                </div>
                <p className="font-bold text-gray-800 text-lg">₹{parseFloat(order.total_amount).toFixed(2)}</p>
              </div>

              {order.payment_screenshot_url && (
                <div className="mt-4 pt-4 border-t border-gray-100">
                  <p className="text-xs text-gray-500 mb-2">Payment Screenshot:</p>
                  <img src={order.payment_screenshot_url} alt="Payment proof" className="h-20 rounded-lg border shadow-sm" />
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
