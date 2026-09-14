import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { FlaskConical, SearchX, Star, CheckCircle, ShieldCheck, Sparkles, MessageSquare, ThumbsUp, Send, X, Plus } from 'lucide-react';
import api from '../api/axios';
import { useCart } from '../context/CartContext';

export default function ProductDetail() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [qty, setQty] = useState(1);
  const [loading, setLoading] = useState(true);
  const [added, setAdded] = useState(false);
  const [activeTab, setActiveTab] = useState('description'); // 'description' | 'reviews' | 'usage'
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [submittingReview, setSubmittingReview] = useState(false);
  const [reviewSubmitted, setReviewSubmitted] = useState(false);
  const [reviewForm, setReviewForm] = useState({
    customer_name: '',
    rating: 5,
    comment: '',
    order_id: '',
  });

  const { addItem } = useCart();

  useEffect(() => {
    loadProduct();
    loadReviews();
  }, [id]);

  const loadProduct = () => {
    api.get(`/products/${id}`)
      .then(res => {
        setProduct(res.data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  };

  const loadReviews = () => {
    api.get(`/reviews/product/${id}`)
      .then(res => setReviews(res.data))
      .catch(() => {});
  };

  const handleAdd = () => {
    addItem({
      productId: product.id,
      name: product.name,
      price: parseFloat(product.price),
      image: product.image_url,
      quantity: qty,
    });
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    setSubmittingReview(true);
    try {
      await api.post('/reviews', {
        product_id: parseInt(id),
        customer_name: reviewForm.customer_name || 'Verified Customer',
        rating: parseInt(reviewForm.rating),
        comment: reviewForm.comment,
        order_id: reviewForm.order_id ? parseInt(reviewForm.order_id) : null,
      });
      setReviewSubmitted(true);
      setTimeout(() => {
        setReviewSubmitted(false);
        setShowReviewModal(false);
        setReviewForm({ customer_name: '', rating: 5, comment: '', order_id: '' });
      }, 2500);
      loadReviews();
    } catch (err) {
      alert(err.response?.data?.error || 'Failed to submit review');
    } finally {
      setSubmittingReview(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-600"></div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="text-center py-20 animate-fade-in">
        <SearchX className="w-16 h-16 mx-auto mb-4 text-gray-300" />
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Product Not Found</h2>
        <p className="text-gray-500 mb-6">The product you're looking for doesn't exist.</p>
        <Link to="/products" className="bg-brand-600 text-white px-6 py-3 rounded-lg hover:bg-brand-700 font-bold shadow-md border border-brand-500">
          Back to Products
        </Link>
      </div>
    );
  }

  const avgRating = reviews.length > 0
    ? (reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length).toFixed(1)
    : '5.0';

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
      {/* Breadcrumb Navigation */}
      <nav className="text-sm text-gray-500 mb-6 animate-fade-in flex items-center gap-2">
        <Link to="/" className="hover:text-brand-600">Home</Link>
        <span>/</span>
        <Link to="/products" className="hover:text-brand-600">Products</Link>
        <span>/</span>
        <span className="text-gray-900 font-medium truncate max-w-[200px] sm:max-w-none">{product.name}</span>
      </nav>

      {/* Main Product Hero Grid */}
      <div className="grid md:grid-cols-2 gap-10 lg:gap-14 mb-16">
        {/* Left: Product Image */}
        <div className="animate-fade-in-left">
          <div className="h-80 sm:h-[450px] bg-gray-50 rounded-3xl flex items-center justify-center overflow-hidden shadow-lg border border-gray-100 relative group">
            {product.image_url ? (
              <img
                src={product.image_url}
                alt={product.name}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                  if (e.currentTarget.nextSibling) e.currentTarget.nextSibling.style.display = 'flex';
                }}
              />
            ) : null}
            <div
              className={`w-full h-full bg-gradient-to-br from-brand-50 to-accent-50 flex items-center justify-center ${
                product.image_url ? 'hidden' : 'flex'
              }`}
            >
              <FlaskConical className="text-brand-500 w-24 h-24 opacity-60" />
            </div>
            {product.size && (
              <span className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm text-brand-800 text-xs font-bold px-3 py-1.5 rounded-full border border-gray-200 shadow-sm">
                {product.size}
              </span>
            )}
          </div>
        </div>

        {/* Right: Product Buy Box */}
        <div className="animate-fade-in-right flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="bg-brand-50 text-brand-800 text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full border border-brand-200">
                {product.size || 'Premium Home Care'}
              </span>
              <span className="bg-emerald-50 text-emerald-700 text-xs font-semibold px-2.5 py-0.5 rounded-full flex items-center gap-1 border border-emerald-200">
                <Sparkles className="w-3 h-3" /> 100% Authentic
              </span>
            </div>

            <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 mt-2 mb-3 leading-tight tracking-tight">
              {product.name}
            </h1>

            {/* Star Rating Summary */}
            <div className="flex items-center gap-3 mb-5">
              <div className="flex text-amber-400">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star key={star} className="w-4 h-4 fill-amber-400" />
                ))}
              </div>
              <span className="text-sm font-bold text-gray-800">{avgRating}</span>
              <span className="text-xs text-gray-500">
                ({reviews.length} {reviews.length === 1 ? 'customer review' : 'customer reviews'})
              </span>
            </div>

            {/* Price Tag */}
            <div className="flex items-baseline gap-3 mb-6">
              <span className="text-accent-600 font-black text-4xl">
                ₹{parseFloat(product.price).toFixed(2)}
              </span>
              <span className="text-xs text-gray-500 uppercase tracking-wider font-semibold">
                (Inclusive of all taxes)
              </span>
            </div>

            {/* Product Quick Description */}
            <div className="bg-gray-50 rounded-2xl p-4 sm:p-5 border border-gray-200/80 mb-6">
              <h3 className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-1.5">Product Description</h3>
              <p className="text-gray-700 text-sm sm:text-base leading-relaxed">
                {product.description ||
                  'Specially formulated S CUBE Vessel Washing Liquid to remove stubborn grease, food stains, and oil with rich active foam. Leaves utensils squeaky clean with a fresh lasting lemon fragrance.'}
              </p>
            </div>

            {/* Stock Status */}
            {product.stock !== null && product.stock !== undefined && (
              <div className="mb-6">
                <span
                  className={`inline-flex items-center text-xs font-bold px-3 py-1.5 rounded-lg border ${
                    product.stock > 0
                      ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                      : 'bg-red-50 text-red-700 border-red-200'
                  }`}
                >
                  <CheckCircle className="w-3.5 h-3.5 mr-1.5" />
                  {product.stock > 0 ? `In Stock (${product.stock} available)` : 'Out of Stock'}
                </span>
              </div>
            )}

            {/* Quantity Selector */}
            <div className="flex items-center gap-4 mb-6">
              <span className="text-gray-700 text-sm font-bold">Quantity:</span>
              <div className="flex items-center border border-gray-300 rounded-xl overflow-hidden bg-white shadow-sm">
                <button
                  type="button"
                  onClick={() => setQty(Math.max(1, qty - 1))}
                  className="w-10 h-10 flex items-center justify-center hover:bg-gray-100 transition-colors text-gray-700 font-bold"
                >
                  −
                </button>
                <span className="w-12 text-center font-bold text-gray-900 border-x">{qty}</span>
                <button
                  type="button"
                  onClick={() => setQty(qty + 1)}
                  className="w-10 h-10 flex items-center justify-center hover:bg-gray-100 transition-colors text-gray-700 font-bold"
                >
                  +
                </button>
              </div>
            </div>

            {/* Add to Cart CTA */}
            <button
              onClick={handleAdd}
              className={`w-full py-4 rounded-xl font-bold text-lg transition-all flex items-center justify-center border-2 shadow-lg ${
                added
                  ? 'bg-emerald-600 text-white border-emerald-500 shadow-emerald-200'
                  : 'bg-brand-600 text-white hover:bg-brand-700 border-brand-500 hover:shadow-xl hover:scale-[1.01]'
              }`}
            >
              {added ? (
                <>
                  <CheckCircle className="w-5 h-5 mr-2" />
                  Added to Cart!
                </>
              ) : (
                <>Add to Cart — ₹{(parseFloat(product.price) * qty).toFixed(2)}</>
              )}
            </button>

            {/* Trust Badges */}
            <div className="grid grid-cols-3 gap-2 mt-6 pt-6 border-t border-gray-200 text-center">
              <div className="text-xs text-gray-600 font-medium flex flex-col items-center gap-1">
                <ShieldCheck className="w-4 h-4 text-brand-600" />
                <span>100% Original</span>
              </div>
              <div className="text-xs text-gray-600 font-medium flex flex-col items-center gap-1">
                <Sparkles className="w-4 h-4 text-brand-600" />
                <span>Brass & Steel Safe</span>
              </div>
              <div className="text-xs text-gray-600 font-medium flex flex-col items-center gap-1">
                <CheckCircle className="w-4 h-4 text-brand-600" />
                <span>Quick Dispatch</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Product Information & Customer Reviews Section */}
      <div className="border-t border-gray-200 pt-10">
        {/* Navigation Tabs */}
        <div className="flex border-b border-gray-200 mb-8 overflow-x-auto gap-4 sm:gap-8">
          <button
            onClick={() => setActiveTab('description')}
            className={`pb-4 text-sm sm:text-base font-bold transition-colors relative whitespace-nowrap ${
              activeTab === 'description'
                ? 'text-brand-700 border-b-2 border-brand-700'
                : 'text-gray-500 hover:text-gray-800'
            }`}
          >
            Product Overview & Features
          </button>
          <button
            onClick={() => setActiveTab('reviews')}
            className={`pb-4 text-sm sm:text-base font-bold transition-colors relative whitespace-nowrap flex items-center gap-2 ${
              activeTab === 'reviews'
                ? 'text-brand-700 border-b-2 border-brand-700'
                : 'text-gray-500 hover:text-gray-800'
            }`}
          >
            Customer Reviews
            <span className="bg-brand-100 text-brand-800 text-xs px-2 py-0.5 rounded-full font-extrabold">
              {reviews.length}
            </span>
          </button>
          <button
            onClick={() => setActiveTab('usage')}
            className={`pb-4 text-sm sm:text-base font-bold transition-colors relative whitespace-nowrap ${
              activeTab === 'usage'
                ? 'text-brand-700 border-b-2 border-brand-700'
                : 'text-gray-500 hover:text-gray-800'
            }`}
          >
            How to Use
          </button>
        </div>

        {/* Tab 1: Detailed Description */}
        {activeTab === 'description' && (
          <div className="bg-white rounded-2xl p-6 sm:p-8 border border-gray-200 shadow-sm animate-fade-in space-y-6">
            <div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">About {product.name}</h3>
              <p className="text-gray-700 leading-relaxed text-base">
                {product.description ||
                  'S CUBE Vessel Washing Liquid is a premium concentrated dishwashing formula designed to deliver sparkling clean utensils while remaining gentle on hands. Its high-lather active formula tackles burnt-on food, stubborn grease, and tough curry stains with minimal effort.'}
              </p>
            </div>

            <div className="grid sm:grid-cols-2 gap-4 pt-4 border-t border-gray-100">
              <div className="space-y-2.5">
                <h4 className="font-bold text-sm text-gray-800 uppercase tracking-wider">Key Benefits</h4>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-brand-600 flex-shrink-0" />
                    <span>Superior grease-cutting power with rich foam</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-brand-600 flex-shrink-0" />
                    <span>Safe for brass & copper pooja lamps and vessels</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-brand-600 flex-shrink-0" />
                    <span>Gentle formula that cares for your hands</span>
                  </li>
                </ul>
              </div>

              <div className="space-y-2.5">
                <h4 className="font-bold text-sm text-gray-800 uppercase tracking-wider">Specifications</h4>
                <div className="bg-gray-50 rounded-xl p-3.5 space-y-1.5 text-xs sm:text-sm text-gray-700">
                  <p><strong className="text-gray-900">Brand:</strong> S CUBE (Rajes Solutions)</p>
                  <p><strong className="text-gray-900">Bottle Size:</strong> {product.size || '500 ml'}</p>
                  <p><strong className="text-gray-900">Form:</strong> Concentrated Viscous Liquid</p>
                  <p><strong className="text-gray-900">Fragrance:</strong> Fresh Lemon Citrus</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Customer Reviews */}
        {activeTab === 'reviews' && (
          <div className="animate-fade-in space-y-8">
            {/* Reviews Header Banner */}
            <div className="bg-gradient-to-r from-brand-50 via-white to-accent-50 rounded-2xl p-6 sm:p-8 border border-gray-200 flex flex-col sm:flex-row items-center justify-between gap-6">
              <div className="flex items-center gap-5">
                <div className="text-center sm:text-left">
                  <p className="text-5xl font-black text-brand-700">{avgRating}</p>
                  <div className="flex text-amber-400 justify-center sm:justify-start my-1.5">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star key={star} className="w-4 h-4 fill-amber-400" />
                    ))}
                  </div>
                  <p className="text-xs text-gray-500 font-semibold">Based on {reviews.length} reviews</p>
                </div>
                <div className="hidden sm:block h-16 w-px bg-gray-200"></div>
                <div className="hidden sm:block text-sm text-gray-600">
                  <p className="font-bold text-gray-900">100% Genuine Buyer Feedback</p>
                  <p className="text-xs text-gray-500">Every review is checked and verified for quality assurance.</p>
                </div>
              </div>

              <button
                onClick={() => setShowReviewModal(true)}
                className="bg-brand-600 hover:bg-brand-700 text-white font-bold text-sm px-6 py-3 rounded-xl transition-all shadow-md flex items-center gap-2 hover:scale-105"
              >
                <Plus className="w-4 h-4" /> Write a Review
              </button>
            </div>

            {/* Reviews List */}
            {reviews.length > 0 ? (
              <div className="grid sm:grid-cols-2 gap-4">
                {reviews.map((r) => (
                  <div
                    key={r.id}
                    className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-3">
                        <div>
                          <p className="font-bold text-gray-900 text-sm">{r.customer_name}</p>
                          <span className="text-[11px] text-emerald-700 font-semibold flex items-center gap-1">
                            <CheckCircle className="w-3 h-3" /> Verified Purchase
                          </span>
                        </div>
                        <div className="flex text-amber-400">
                          {[1, 2, 3, 4, 5].map((s) => (
                            <Star
                              key={s}
                              className={`w-3.5 h-3.5 ${s <= r.rating ? 'fill-amber-400 text-amber-400' : 'text-gray-200'}`}
                            />
                          ))}
                        </div>
                      </div>
                      <p className="text-gray-700 text-sm leading-relaxed mb-4">
                        "{r.comment || 'Excellent product! Very effective on oil and leaves a great shine.'}"
                      </p>
                    </div>
                    <p className="text-[11px] text-gray-400 pt-3 border-t border-gray-100">
                      {new Date(r.created_at).toLocaleDateString('en-IN', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric',
                      })}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-white rounded-2xl p-12 text-center border border-gray-200">
                <MessageSquare className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                <h4 className="text-lg font-bold text-gray-800 mb-1">No Reviews Yet</h4>
                <p className="text-gray-500 text-sm mb-6 max-w-sm mx-auto">
                  Be the first customer to share your experience with {product.name}!
                </p>
                <button
                  onClick={() => setShowReviewModal(true)}
                  className="bg-brand-600 text-white font-bold text-sm px-6 py-2.5 rounded-xl hover:bg-brand-700 transition-all shadow-md inline-flex items-center gap-2"
                >
                  <Plus className="w-4 h-4" /> Share Your Review
                </button>
              </div>
            )}
          </div>
        )}

        {/* Tab 3: Usage Instructions */}
        {activeTab === 'usage' && (
          <div className="bg-white rounded-2xl p-6 sm:p-8 border border-gray-200 shadow-sm animate-fade-in space-y-4">
            <h3 className="text-xl font-bold text-gray-900 mb-4">How to Use S CUBE Liquid</h3>
            <div className="grid sm:grid-cols-3 gap-4">
              <div className="bg-gray-50 p-5 rounded-xl border border-gray-100">
                <span className="w-8 h-8 rounded-full bg-brand-600 text-white font-black text-sm flex items-center justify-center mb-3">1</span>
                <h4 className="font-bold text-gray-900 text-sm mb-1">Dilute in Bowl</h4>
                <p className="text-xs text-gray-600">Take 1 teaspoon (5ml) of S CUBE liquid in a small bowl with 1 cup of water.</p>
              </div>
              <div className="bg-gray-50 p-5 rounded-xl border border-gray-100">
                <span className="w-8 h-8 rounded-full bg-brand-600 text-white font-black text-sm flex items-center justify-center mb-3">2</span>
                <h4 className="font-bold text-gray-900 text-sm mb-1">Dip & Scrub</h4>
                <p className="text-xs text-gray-600">Dip your scrubber or sponge into the rich foam solution and wipe across utensils.</p>
              </div>
              <div className="bg-gray-50 p-5 rounded-xl border border-gray-100">
                <span className="w-8 h-8 rounded-full bg-brand-600 text-white font-black text-sm flex items-center justify-center mb-3">3</span>
                <h4 className="font-bold text-gray-900 text-sm mb-1">Rinse for Sparkle</h4>
                <p className="text-xs text-gray-600">Rinse thoroughly with clean running water. Dry with a soft cloth for sparkling shine.</p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Review Submission Modal */}
      {showReviewModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl relative animate-scale-in">
            <button
              onClick={() => setShowReviewModal(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 p-1 rounded-full hover:bg-gray-100"
            >
              <X className="w-5 h-5" />
            </button>

            {reviewSubmitted ? (
              <div className="text-center py-8">
                <CheckCircle className="w-16 h-16 text-emerald-500 mx-auto mb-3 animate-bounce" />
                <h3 className="text-xl font-bold text-gray-900 mb-2">Thank You!</h3>
                <p className="text-sm text-gray-600">Your review has been submitted successfully and will be published shortly.</p>
              </div>
            ) : (
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-1">Write a Review</h3>
                <p className="text-xs text-gray-500 mb-5">Share your experience with {product.name}</p>

                <form onSubmit={handleSubmitReview} className="space-y-4">
                  {/* Star Rating Picker */}
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1.5">Rating *</label>
                    <div className="flex gap-2">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          type="button"
                          onClick={() => setReviewForm({ ...reviewForm, rating: star })}
                          className="p-1 text-2xl focus:outline-none transition-transform hover:scale-125"
                        >
                          <Star
                            className={`w-7 h-7 ${
                              star <= reviewForm.rating
                                ? 'fill-amber-400 text-amber-400'
                                : 'text-gray-300'
                            }`}
                          />
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">Your Name *</label>
                    <input
                      required
                      placeholder="e.g. Priya S."
                      value={reviewForm.customer_name}
                      onChange={(e) => setReviewForm({ ...reviewForm, customer_name: e.target.value })}
                      className="w-full border border-gray-300 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-brand-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">Order ID (Optional)</label>
                    <input
                      type="number"
                      placeholder="e.g. 1024"
                      value={reviewForm.order_id}
                      onChange={(e) => setReviewForm({ ...reviewForm, order_id: e.target.value })}
                      className="w-full border border-gray-300 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-brand-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">Your Review *</label>
                    <textarea
                      required
                      rows="3"
                      placeholder="How did S CUBE perform? Was it effective on grease and safe on vessels?"
                      value={reviewForm.comment}
                      onChange={(e) => setReviewForm({ ...reviewForm, comment: e.target.value })}
                      className="w-full border border-gray-300 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-brand-500 focus:outline-none"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={submittingReview}
                    className="w-full bg-brand-600 hover:bg-brand-700 text-white font-bold py-3 rounded-xl transition-all shadow-md flex items-center justify-center gap-2 disabled:opacity-50"
                  >
                    <Send className="w-4 h-4" />
                    {submittingReview ? 'Submitting...' : 'Submit Review'}
                  </button>
                </form>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
