import { Link } from 'react-router-dom';
import { ShoppingCart, FlaskConical } from 'lucide-react';
import { useCart } from '../context/CartContext';

export default function Cart() {
  const { items, updateQuantity, removeItem, subtotal } = useCart();

  if (items.length === 0) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-20 text-center animate-fade-in">
        <ShoppingCart className="w-20 h-20 mx-auto mb-6 text-gray-300" />
        <h1 className="text-3xl font-bold text-gray-800 mb-3">Your Cart is Empty</h1>
        <p className="text-gray-500 mb-8 text-lg">Looks like you haven't added any products yet. Browse our collection and find the perfect wash for your kitchen.</p>
        <Link to="/products" className="inline-flex items-center bg-brand-600 text-white px-8 py-3.5 rounded-lg hover:bg-brand-700 transition-all shadow-lg font-bold border border-brand-500">
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" /></svg>
          Browse Products
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="animate-fade-in-up">
        <h1 className="text-3xl sm:text-4xl font-bold text-gray-800 mb-8 flex items-center">
          <ShoppingCart className="w-8 h-8 mr-3 text-accent-500" />
          Shopping Cart
          <span className="text-base font-normal text-gray-400 ml-3">({items.length} {items.length === 1 ? 'item' : 'items'})</span>
        </h1>
      </div>

      <div className="space-y-4">
        {items.map((item, i) => (
          <div key={item.productId} className={`bg-white rounded-xl shadow-sm border border-gray-100 p-4 flex flex-col sm:flex-row sm:items-center gap-4 hover:shadow-md transition-all animate-fade-in-up`} style={{ animationDelay: `${i * 0.05}s` }}>
            <div className="w-20 h-20 bg-gray-100 rounded-xl flex items-center justify-center overflow-hidden flex-shrink-0">
              {item.image ? <img src={item.image} alt={item.name} className="w-full h-full object-cover" /> : <FlaskConical className="w-8 h-8 text-gray-400" />}
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-gray-800 truncate">{item.name}</h3>
              <p className="text-accent-600 font-bold mt-0.5">₹{parseFloat(item.price).toFixed(2)}</p>
            </div>
            <div className="flex items-center justify-between sm:justify-end gap-4 w-full sm:w-auto">
              <div className="flex items-center border rounded-lg overflow-hidden">
                <button onClick={() => updateQuantity(item.productId, item.quantity - 1)} className="w-9 h-9 flex items-center justify-center hover:bg-gray-100 text-gray-600 transition-colors">−</button>
                <span className="w-10 text-center font-semibold border-x">{item.quantity}</span>
                <button onClick={() => updateQuantity(item.productId, item.quantity + 1)} className="w-9 h-9 flex items-center justify-center hover:bg-gray-100 text-gray-600 transition-colors">+</button>
              </div>
              <p className="font-bold text-gray-800 w-20 text-right">₹{(parseFloat(item.price) * item.quantity).toFixed(2)}</p>
              <button onClick={() => removeItem(item.productId)} className="text-red-400 hover:text-red-600 transition-colors p-1" title="Remove item">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mt-8 animate-fade-in-up animate-delay-200">
        <div className="flex justify-between items-center mb-2 text-gray-600">
          <span>Subtotal ({items.length} items)</span>
          <span>₹{subtotal.toFixed(2)}</span>
        </div>
        <div className="flex justify-between items-center mb-2 text-gray-600">
          <span className="flex items-center"><svg className="w-4 h-4 mr-1.5 text-green-500" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg>Delivery</span>
          <span className="text-green-600 font-medium">Free</span>
        </div>
        <div className="border-t pt-3 mt-3 flex justify-between text-xl font-bold text-gray-800">
          <span>Total</span>
          <span>₹{subtotal.toFixed(2)}</span>
        </div>
        <Link to="/checkout" className="mt-6 w-full bg-brand-600 text-white py-4 rounded-xl hover:bg-brand-700 transition-all font-bold text-lg flex items-center justify-center shadow-xl hover:shadow-2xl border border-brand-500">
          Proceed to Checkout
          <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" /></svg>
        </Link>
      </div>
    </div>
  );
}
