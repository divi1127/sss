import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Search, Package, CheckCircle, Clock, Truck, AlertCircle, ShoppingBag, Star, Send, MapPin } from 'lucide-react';
import api from '../api/axios';

const FLOW_STATUSES = [
  { key: 'Pending',                      label: 'Order Placed',        icon: ShoppingBag },
  { key: 'Payment Verification Pending', label: 'Payment Verification', icon: Clock },
  { key: 'Confirmed',                    label: 'Confirmed',            icon: CheckCircle },
  { key: 'Out for Delivery',             label: 'Out for Delivery',     icon: Truck },
  { key: 'Delivered',                    label: 'Delivered',            icon: Package },
];

const STATUS_META = {
  'Payment Verification Pending': { color: 'text-yellow-600', bg: 'bg-yellow-50', border: 'border-yellow-200', badge: 'bg-yellow-100 text-yellow-700' },
  'Pending':        { color: 'text-orange-600', bg: 'bg-orange-50', border: 'border-orange-200', badge: 'bg-orange-100 text-orange-700' },
  'Confirmed':      { color: 'text-green-600',  bg: 'bg-green-50',  border: 'border-green-200',  badge: 'bg-green-100 text-green-700' },
  'Out for Delivery': { color: 'text-blue-600', bg: 'bg-blue-50',   border: 'border-blue-200',   badge: 'bg-blue-100 text-blue-700' },
  'Delivered':      { color: 'text-teal-600',   bg: 'bg-teal-50',   border: 'border-teal-200',   badge: 'bg-teal-100 text-teal-700' },
  'Cancelled':      { color: 'text-red-600',    bg: 'bg-red-50',    border: 'border-red-200',    badge: 'bg-red-100 text-red-700' },
  'Payment Failed': { color: 'text-red-600',    bg: 'bg-red-50',    border: 'border-red-200',    badge: 'bg-red-100 text-red-700' },
};

function StarPicker({ value, onChange }) {
  const [hover, setHover] = useState(0);
  return (
    <div className="flex gap-1">
      {[1,2,3,4,5].map(s => (
        <button
          key={s}
          type="button"
          onClick={() => onChange(s)}
          onMouseEnter={() => setHover(s)}
          onMouseLeave={() => setHover(0)}
          className="transition-transform hover:scale-110"
        >
          <Star className={`w-8 h-8 ${s <= (hover || value) ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`} />
        </button>
      ))}
    </div>
  );
}

export default function TrackOrder() {
  const { id: urlId } = useParams();
  const [orderId, setOrderId] = useState(urlId || '');
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Review form
  const [showReview, setShowReview] = useState(false);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [reviewName, setReviewName] = useState('');
  const [reviewSubmitting, setReviewSubmitting] = useState(false);
  const [reviewDone, setReviewDone] = useState(false);

  useEffect(() => {
    if (urlId) {
      setOrderId(urlId);
      trackOrder(urlId);
    }
  }, [urlId]);

  const trackOrder = async (id) => {
    if (!id?.trim()) return;
    setLoading(true); setError(''); setOrder(null);
    try {
      const res = await api.get(`/orders/track/${id.trim()}`);
      setOrder(res.data);
      setReviewName(res.data.customer_name || '');
    } catch (err) {
      setError(err.response?.data?.error || 'Order not found. Please check your order ID.');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e) => { e.preventDefault(); trackOrder(orderId); };

  const getCurrentStep = (status) => {
    if (status === 'Cancelled' || status === 'Payment Failed') return -1;
    const idx = FLOW_STATUSES.findIndex(s => s.key === status);
    return idx >= 0 ? idx : 0;
  };

  const submitReview = async (e) => {
    e.preventDefault();
    if (!rating) return alert('Please select a rating');
    setReviewSubmitting(true);
    try {
      await api.post('/reviews', {
        order_id: order.id,
        customer_name: reviewName || order.customer_name,
        rating,
        comment,
      });
      setReviewDone(true);
    } catch (err) {
      alert('Failed to submit review. Please try again.');
    } finally {
      setReviewSubmitting(false);
    }
  };

  const meta = order ? (STATUS_META[order.status] || STATUS_META['Pending']) : null;
  const isCancelled = order?.status === 'Cancelled' || order?.status === 'Payment Failed';
  const isDelivered = order?.status === 'Delivered';
  const currentStep = order ? getCurrentStep(order.status) : -1;

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-16">
      <div>
        {/* Header */}
        <div className="text-center mb-10">
          <div className="w-16 h-16 bg-gradient-to-br from-brand-500 to-brand-700 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
            <Package className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-800 mb-2">Track Your Order</h1>
          <p className="text-gray-500">Enter your Order ID to see real-time status.</p>
        </div>

        {/* Search Form */}
        <form onSubmit={handleSubmit} className="flex gap-3 mb-8">
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              required type="text" placeholder="Enter Order ID (e.g. 42)"
              value={orderId} onChange={e => setOrderId(e.target.value)}
              className="w-full border-2 border-gray-200 rounded-xl pl-11 pr-4 py-3.5 focus:outline-none focus:border-brand-400 text-base transition-colors"
            />
          </div>
          <button
            type="submit" disabled={loading}
            className="bg-brand-600 text-white px-8 py-3.5 rounded-xl hover:bg-brand-700 transition-all font-bold shadow-lg disabled:opacity-50 border border-brand-500 flex items-center gap-2"
          >
            {loading ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <Search className="w-5 h-5" />}
            {loading ? '' : 'Track'}
          </button>
        </form>

        {/* Error */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center animate-fade-in mb-6">
            <AlertCircle className="w-10 h-10 text-red-400 mx-auto mb-3" />
            <p className="text-red-700 font-semibold">{error}</p>
            <p className="text-red-500 text-sm mt-1">Double-check your Order ID and try again.</p>
          </div>
        )}

        {/* Order Details */}
        {order && (
          <div className="animate-fade-in-up space-y-5">
            {/* Order Header */}
            <div className={`${meta.bg} border ${meta.border} rounded-2xl p-6`}>
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h2 className="text-xl font-bold text-gray-800">Order #{order.id}</h2>
                  <p className="text-sm text-gray-500 mt-0.5">
                    {new Date(order.created_at).toLocaleDateString('en-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                  </p>
                </div>
                <span className={`text-sm px-3 py-1.5 rounded-full font-semibold ${meta.badge}`}>{order.status}</span>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">Customer</p>
                  <p className="font-semibold text-gray-800">{order.customer_name}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-500">Order Total</p>
                  <p className="text-2xl font-bold text-gray-800">₹{parseFloat(order.total_amount).toFixed(2)}</p>
                </div>
              </div>
            </div>

            {/* Tracking Number */}
            {order.tracking_number && (
              <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 flex items-start gap-3">
                <MapPin className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-blue-800 text-sm">Tracking Number: {order.tracking_number}</p>
                  {order.estimated_delivery && (
                    <p className="text-blue-600 text-xs mt-0.5">
                      Estimated Delivery: {new Date(order.estimated_delivery).toLocaleDateString('en-IN', { weekday: 'long', month: 'long', day: 'numeric' })}
                    </p>
                  )}
                </div>
              </div>
            )}

            {/* Status Stepper */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <h3 className="font-bold text-gray-700 mb-6">Order Progress</h3>

              {isCancelled ? (
                <div className="flex items-center gap-3 p-4 bg-red-50 border border-red-200 rounded-xl">
                  <AlertCircle className="w-6 h-6 text-red-500" />
                  <div>
                    <p className="font-bold text-red-700">{order.status}</p>
                    <p className="text-sm text-red-500">Please contact us at 04322 222646 for assistance.</p>
                  </div>
                </div>
              ) : (
                <div className="relative">
                  {FLOW_STATUSES.map((step, i) => {
                    const isDone = i < currentStep;
                    const isCurrent = i === currentStep;
                    const Icon = step.icon;
                    return (
                      <div key={step.key} className="flex gap-4 mb-0">
                        {/* Timeline column */}
                        <div className="flex flex-col items-center">
                          <div className={`w-10 h-10 rounded-full flex items-center justify-center shadow-sm flex-shrink-0 transition-all duration-500 ${
                            isDone ? 'bg-green-500' : isCurrent ? 'bg-brand-600 ring-4 ring-brand-100' : 'bg-gray-100'
                          }`}>
                            {isDone
                              ? <CheckCircle className="w-5 h-5 text-white" />
                              : <Icon className={`w-5 h-5 ${isCurrent ? 'text-white' : 'text-gray-400'}`} />
                            }
                          </div>
                          {i < FLOW_STATUSES.length - 1 && (
                            <div className={`w-0.5 h-10 mt-1 transition-all duration-700 ${isDone ? 'bg-green-400' : 'bg-gray-200'}`} />
                          )}
                        </div>
                        {/* Content */}
                        <div className={`pb-8 pt-1.5 ${i === FLOW_STATUSES.length - 1 ? 'pb-0' : ''}`}>
                          <p className={`font-semibold text-sm transition-colors ${
                            isDone ? 'text-green-700' : isCurrent ? 'text-brand-700' : 'text-gray-400'
                          }`}>
                            {step.label}
                            {isCurrent && <span className="ml-2 text-xs bg-brand-100 text-brand-700 px-2 py-0.5 rounded-full font-medium">Current</span>}
                          </p>
                          {isDone && <p className="text-xs text-green-500 mt-0.5">✓ Completed</p>}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Items */}
            {order.items?.length > 0 && (
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                <h3 className="font-bold text-gray-700 mb-4">Items Ordered</h3>
                <div className="divide-y divide-gray-50">
                  {order.items.map((item, i) => (
                    <div key={i} className="flex justify-between py-3 text-sm">
                      <span className="text-gray-700 font-medium">
                        {item.product_name || 'Product'} <span className="text-gray-400 font-normal">×{item.quantity}</span>
                      </span>
                      <span className="font-semibold text-gray-800">₹{(item.quantity * parseFloat(item.price)).toFixed(2)}</span>
                    </div>
                  ))}
                  <div className="flex justify-between pt-3 font-bold text-base">
                    <span className="text-gray-700">Total</span>
                    <span className="text-gray-800">₹{parseFloat(order.total_amount).toFixed(2)}</span>
                  </div>
                </div>
              </div>
            )}

            {/* Review Section (Delivered only) */}
            {isDelivered && !reviewDone && (
              <div className="bg-gradient-to-br from-yellow-50 to-orange-50 border border-yellow-200 rounded-2xl p-6">
                {!showReview ? (
                  <div className="text-center">
                    <div className="text-3xl mb-2">⭐</div>
                    <h3 className="font-bold text-gray-800 mb-1">Enjoying S CUBE?</h3>
                    <p className="text-gray-500 text-sm mb-4">Your feedback helps us improve!</p>
                    <button
                      onClick={() => setShowReview(true)}
                      className="bg-yellow-500 text-white px-6 py-2.5 rounded-xl font-bold hover:bg-yellow-600 transition-colors shadow-md"
                    >
                      Leave a Review
                    </button>
                  </div>
                ) : (
                  <form onSubmit={submitReview}>
                    <h3 className="font-bold text-gray-800 mb-4 text-center">Rate Your Experience</h3>
                    <div className="flex justify-center mb-4">
                      <StarPicker value={rating} onChange={setRating} />
                    </div>
                    <input
                      type="text"
                      placeholder="Your name"
                      value={reviewName}
                      onChange={e => setReviewName(e.target.value)}
                      className="w-full border-2 border-yellow-200 rounded-xl px-4 py-2.5 text-sm mb-3 focus:outline-none focus:border-yellow-400 bg-white"
                    />
                    <textarea
                      placeholder="Share your experience with S CUBE..."
                      value={comment} onChange={e => setComment(e.target.value)}
                      rows="3"
                      className="w-full border-2 border-yellow-200 rounded-xl px-4 py-2.5 text-sm mb-4 focus:outline-none focus:border-yellow-400 bg-white resize-none"
                    />
                    <div className="flex gap-3">
                      <button
                        type="submit"
                        disabled={reviewSubmitting || !rating}
                        className="flex-1 flex items-center justify-center gap-2 bg-yellow-500 text-white py-2.5 rounded-xl font-bold hover:bg-yellow-600 transition-colors disabled:opacity-50"
                      >
                        <Send className="w-4 h-4" />
                        {reviewSubmitting ? 'Submitting...' : 'Submit Review'}
                      </button>
                      <button type="button" onClick={() => setShowReview(false)} className="px-4 py-2.5 border border-yellow-300 rounded-xl text-sm text-gray-600 hover:bg-yellow-50">
                        Cancel
                      </button>
                    </div>
                  </form>
                )}
              </div>
            )}

            {reviewDone && (
              <div className="bg-green-50 border border-green-200 rounded-2xl p-6 text-center animate-scale-in">
                <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-3" />
                <h3 className="font-bold text-green-800 mb-1">Thank You for Your Review!</h3>
                <p className="text-green-600 text-sm">Your feedback will appear after moderation.</p>
              </div>
            )}

            {/* Contact */}
            <div className="bg-gray-50 rounded-xl p-4 text-sm text-gray-500 text-center">
              Need help? Call us at <a href="tel:0432222646" className="font-bold text-brand-600">04322 222646</a>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
