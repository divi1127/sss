import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../api/axios';

export default function OrderConfirmation() {
  const { id } = useParams();
  const [order, setOrder] = useState(null);

  useEffect(() => {
    api.get(`/orders/${id}`, {
      headers: { Authorization: `Bearer ${localStorage.getItem('adminToken') || ''}` }
    }).then(res => setOrder(res.data)).catch(() => {});
  }, [id]);

  return (
    <div className="max-w-2xl mx-auto px-4 py-16 animate-fade-in-up">
      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8 sm:p-12 text-center">
        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <svg className="w-10 h-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
        </div>

        <h1 className="text-3xl sm:text-4xl font-bold text-gray-800 mb-3">Order Placed!</h1>
        <p className="text-gray-500 mb-2">Order ID: <strong className="text-gray-800">#{id}</strong></p>

        {order && (
          <div className="flex items-center justify-center space-x-2 mb-6">
            <span className="text-gray-500">Status:</span>
            <span className={`px-3 py-1 rounded-full text-sm font-medium ${
              order.status === 'Payment Verification Pending' || order.status === 'Pending'
                ? 'bg-yellow-100 text-yellow-700'
                : 'bg-green-100 text-green-700'
            }`}>{order.status}</span>
          </div>
        )}

        <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-6 mb-8 text-left">
          <div className="flex items-start">
            <svg className="w-5 h-5 text-yellow-600 mr-3 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
            <div>
              <p className="text-yellow-800 font-medium">Your order is under verification. You'll be notified once confirmed.</p>
              {order?.order_source === 'online_payment' && (
                <p className="text-yellow-700 text-sm mt-1">Our team will verify your payment screenshot and update the order status shortly.</p>
              )}
            </div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link to="/products" className="inline-flex items-center justify-center bg-brand-600 text-white px-8 py-3.5 rounded-xl hover:bg-brand-700 transition-all font-bold shadow-lg hover:shadow-xl border border-brand-500">
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" /></svg>
            Continue Shopping
          </Link>
          <Link to="/" className="inline-flex items-center justify-center border-2 border-gray-200 text-gray-700 px-8 py-3 rounded-xl hover:bg-gray-50 transition-all font-semibold">
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg>
            Go Home
          </Link>
        </div>
      </div>
    </div>
  );
}
