import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';
import { useCart } from '../context/CartContext';
import { useCustomerAuth } from '../context/CustomerAuthContext';

export default function Checkout() {
  const { items, subtotal, clearCart } = useCart();
  const { user } = useCustomerAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({ name: user?.name || '', phone: '', address: '' });
  const [orderSource, setOrderSource] = useState('online_payment');
  const [screenshot, setScreenshot] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const formData = new FormData();
      formData.append('customerName', form.name);
      formData.append('customerPhone', form.phone);
      formData.append('customerAddress', form.address);
      formData.append('items', JSON.stringify(items.map(i => ({ productId: i.productId, quantity: i.quantity, price: i.price }))));
      formData.append('orderSource', orderSource);
      if (user) formData.append('userId', user.id);

      if (orderSource === 'online_payment' && screenshot) {
        formData.append('paymentScreenshot', screenshot);
      }

      const res = await api.post('/orders', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      const orderId = res.data.orderId;

      if (orderSource === 'whatsapp') {
        const message = items.map(i => `${i.name} x${i.quantity} = ₹${(i.price * i.quantity).toFixed(2)}`).join('\n');
        const total = subtotal.toFixed(2);
        const text = encodeURIComponent(`Hi! I want to order:\n\n${message}\n\nTotal: ₹${total}\nName: ${form.name}\nPhone: ${form.phone}\nAddress: ${form.address}`);
        window.open(`https://wa.me/918825733129?text=${text}`, '_blank');
        clearCart();
        navigate(`/order-confirmation/${orderId}`);
        return;
      }

      if (orderSource === 'instagram') {
        window.open('https://instagram.com/scubeofficial', '_blank');
        clearCart();
        navigate(`/order-confirmation/${orderId}`);
        return;
      }

      clearCart();
      navigate(`/order-confirmation/${orderId}`);
    } catch (err) {
      const msg = err.response?.data?.error || err.message || 'Failed to place order';
      alert(msg);
    } finally {
      setLoading(false);
    }
  };

  if (items.length === 0) {
    navigate('/cart');
    return null;
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="animate-fade-in-up">
        <h1 className="text-3xl sm:text-4xl font-bold text-gray-800 mb-8 flex items-center">
          <svg className="w-8 h-8 mr-3 text-accent-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
          Checkout
        </h1>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 space-y-4 animate-fade-in-up">
          <h2 className="text-xl font-semibold text-gray-700 flex items-center">
            <svg className="w-5 h-5 mr-2 text-accent-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
            Customer Details
          </h2>
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="relative">
              <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
              <input required type="text" placeholder="Full Name" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} className="w-full border rounded-lg pl-10 pr-4 py-3 focus:outline-none focus:ring-2 focus:ring-accent-400" />
            </div>
            <div className="relative">
              <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>
              <input required type="tel" placeholder="Phone Number" value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} className="w-full border rounded-lg pl-10 pr-4 py-3 focus:outline-none focus:ring-2 focus:ring-accent-400" />
            </div>
          </div>
          <div className="relative">
            <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
            <input required type="text" placeholder="Delivery Address (full address)" value={form.address} onChange={e => setForm({ ...form, address: e.target.value })} className="w-full border rounded-lg pl-10 pr-4 py-3 focus:outline-none focus:ring-2 focus:ring-accent-400" />
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 space-y-3 animate-fade-in-up animate-delay-100">
          <h2 className="text-xl font-semibold text-gray-700 flex items-center">
            <svg className="w-5 h-5 mr-2 text-accent-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" /></svg>
            Order Summary
          </h2>
          <div className="divide-y">
            {items.map(item => (
              <div key={item.productId} className="flex justify-between py-2 text-gray-600">
                <span>{item.name} <span className="text-gray-400">x{item.quantity}</span></span>
                <span className="font-medium">₹{(item.price * item.quantity).toFixed(2)}</span>
              </div>
            ))}
          </div>
          <div className="border-t pt-3 flex justify-between font-bold text-xl text-gray-800">
            <span>Total</span>
            <span className="text-accent-600">₹{subtotal.toFixed(2)}</span>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 space-y-4 animate-fade-in-up animate-delay-200">
          <h2 className="text-xl font-semibold text-gray-700 flex items-center">
            <svg className="w-5 h-5 mr-2 text-accent-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" /></svg>
            Choose Order Method
          </h2>

          <label className={`block border-2 rounded-xl p-4 sm:p-5 cursor-pointer transition-all ${orderSource === 'online_payment' ? 'border-accent-500 bg-accent-50' : 'border-gray-200 hover:border-gray-300'}`}>
            <div className="flex items-start">
              <input type="radio" name="orderSource" value="online_payment" checked={orderSource === 'online_payment'} onChange={() => setOrderSource('online_payment')} className="mt-1 mr-3" />
              <div>
                <span className="font-medium text-gray-800 flex items-center">
                  <svg className="w-5 h-5 mr-1.5 text-accent-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                  A. Online Payment (UPI / Bank Transfer)
                </span>
                {orderSource === 'online_payment' && (
                  <div className="mt-4 space-y-3 animate-slide-down">
                    <div className="bg-gray-50 p-4 rounded-lg text-sm grid sm:grid-cols-2 gap-2">
                      <p><span className="text-gray-500">UPI ID:</span> <strong>scube@upi</strong></p>
                      <p><span className="text-gray-500">Bank:</span> <strong>S cube Bank</strong></p>
                      <p><span className="text-gray-500">Account:</span> <strong>8825733129</strong></p>
                      <p><span className="text-gray-500">IFSC:</span> <strong>SCUB0001234</strong></p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1.5 flex items-center">
                        <svg className="w-4 h-4 mr-1.5 text-accent-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                        Upload Payment Screenshot *
                      </label>
                      <input required type="file" accept="image/*" onChange={e => setScreenshot(e.target.files[0])} className="w-full text-sm file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-accent-50 file:text-accent-700 hover:file:bg-accent-100" />
                    </div>
                  </div>
                )}
              </div>
            </div>
          </label>

          <label className={`block border-2 rounded-xl p-4 sm:p-5 cursor-pointer transition-all ${orderSource === 'whatsapp' ? 'border-accent-500 bg-accent-50' : 'border-gray-200 hover:border-gray-300'}`}>
            <div className="flex items-start">
              <input type="radio" name="orderSource" value="whatsapp" checked={orderSource === 'whatsapp'} onChange={() => setOrderSource('whatsapp')} className="mt-1 mr-3" />
              <div>
                <span className="font-medium text-gray-800 flex items-center">
                  <svg className="w-5 h-5 mr-1.5 text-green-500" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
                  B. Order via WhatsApp
                </span>
                <p className="text-sm text-gray-500 mt-1">You'll be redirected to WhatsApp with your order details pre-filled.</p>
              </div>
            </div>
          </label>

          <label className={`block border-2 rounded-xl p-4 sm:p-5 cursor-pointer transition-all ${orderSource === 'instagram' ? 'border-accent-500 bg-accent-50' : 'border-gray-200 hover:border-gray-300'}`}>
            <div className="flex items-start">
              <input type="radio" name="orderSource" value="instagram" checked={orderSource === 'instagram'} onChange={() => setOrderSource('instagram')} className="mt-1 mr-3" />
              <div>
                <span className="font-medium text-gray-800 flex items-center">
                  <svg className="w-5 h-5 mr-1.5 text-pink-500" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>
                  C. Order via Instagram
                </span>
                <p className="text-sm text-gray-500 mt-1">You'll be redirected to Instagram DM to place your order.</p>
              </div>
            </div>
          </label>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-brand-600 text-white py-4 rounded-xl hover:bg-brand-700 transition-all font-bold text-lg disabled:opacity-50 flex items-center justify-center shadow-xl hover:shadow-2xl border border-brand-500 animate-fade-in-up animate-delay-300"
        >
          {loading ? 'Processing...' : 'Place Order'}
        </button>
      </form>
    </div>
  );
}
