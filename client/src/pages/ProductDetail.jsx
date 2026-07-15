import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { FlaskConical, SearchX } from 'lucide-react';
import api from '../api/axios';
import { useCart } from '../context/CartContext';

export default function ProductDetail() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [qty, setQty] = useState(1);
  const [loading, setLoading] = useState(true);
  const [added, setAdded] = useState(false);
  const { addItem } = useCart();

  useEffect(() => {
    api.get(`/products/${id}`).then(res => {
      setProduct(res.data);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, [id]);

  const handleAdd = () => {
    addItem({ productId: product.id, name: product.name, price: parseFloat(product.price), image: product.image_url, quantity: qty });
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  if (loading) return (
    <div className="flex items-center justify-center min-h-[50vh]">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent-600"></div>
    </div>
  );

  if (!product) return (
    <div className="text-center py-20 animate-fade-in">
      <SearchX className="w-16 h-16 mx-auto mb-4 text-gray-300" />
      <h2 className="text-2xl font-bold text-gray-800 mb-2">Product Not Found</h2>
      <p className="text-gray-500 mb-6">The product you're looking for doesn't exist.</p>
      <Link to="/products" className="bg-brand-600 text-white px-6 py-3 rounded-lg hover:bg-brand-700 font-bold shadow-md border border-brand-500">Back to Products</Link>
    </div>
  );

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <nav className="text-sm text-gray-500 mb-6 animate-fade-in">
        <Link to="/" className="hover:text-accent-600">Home</Link>
        <span className="mx-2">/</span>
        <Link to="/products" className="hover:text-accent-600">Products</Link>
        <span className="mx-2">/</span>
        <span className="text-gray-800 font-medium">{product.name}</span>
      </nav>

      <div className="grid md:grid-cols-2 gap-10">
        <div className="animate-fade-in-left">
          <div className="h-72 sm:h-96 bg-gray-100 rounded-2xl flex items-center justify-center overflow-hidden shadow-lg">
            {product.image_url ? (
              <img src={product.image_url} alt={product.name} className="w-full h-full object-cover hover:scale-105 transition-transform duration-500" />
            ) : (
              <FlaskConical className="text-gray-400 w-20 h-20" />
            )}
          </div>
        </div>

        <div className="animate-fade-in-right">
          <span className="text-accent-600 font-semibold text-sm tracking-wider uppercase">
            {product.size || 'Standard'}
          </span>
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-800 mt-1 mb-3">{product.name}</h1>

          <div className="flex items-center space-x-2 mb-4">
            <svg className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>
            <svg className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>
            <svg className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>
            <svg className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>
            <svg className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>
            <span className="text-gray-500 text-sm ml-2">(5.0)</span>
          </div>

          <p className="text-accent-600 font-bold text-4xl mb-6">₹{parseFloat(product.price).toFixed(2)}</p>
          <p className="text-gray-600 mb-6 leading-relaxed">{product.description || 'Premium quality vessel washing liquid for everyday use.'}</p>

          {product.stock !== null && product.stock !== undefined && (
            <p className={`flex items-center text-sm mb-6 ${product.stock > 0 ? 'text-green-600' : 'text-red-500'}`}>
              <svg className="w-4 h-4 mr-1.5" fill="currentColor" viewBox="0 0 20 20">
                {product.stock > 0
                  ? <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  : <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                }
              </svg>
              {product.stock > 0 ? `In Stock (${product.stock} available)` : 'Out of Stock'}
            </p>
          )}

          <div className="flex items-center space-x-4 mb-6">
            <span className="text-gray-700 font-medium flex items-center">
              <svg className="w-5 h-5 mr-1.5 text-accent-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" /></svg>
              Quantity:
            </span>
            <div className="flex items-center border rounded-lg overflow-hidden">
              <button onClick={() => setQty(Math.max(1, qty - 1))} className="w-10 h-10 flex items-center justify-center hover:bg-gray-100 transition-colors text-gray-600 font-medium">−</button>
              <span className="w-12 text-center font-semibold text-lg border-x">{qty}</span>
              <button onClick={() => setQty(qty + 1)} className="w-10 h-10 flex items-center justify-center hover:bg-gray-100 transition-colors text-gray-600 font-medium">+</button>
            </div>
          </div>

          <button
            onClick={handleAdd}
            className={`w-full py-4 rounded-xl font-bold text-lg transition-all flex items-center justify-center border-2 ${added ? 'bg-green-500 text-white border-green-400' : 'bg-brand-600 text-white hover:bg-brand-700 border-brand-500 shadow-xl hover:shadow-2xl'}`}
          >
            {added ? (
              <>
                <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg>
                Added to Cart!
              </>
            ) : (
              <>
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 100 4 2 2 0 000-4z" /></svg>
                Add to Cart — ₹{(parseFloat(product.price) * qty).toFixed(2)}
              </>
            )}
          </button>

          <div className="flex items-center space-x-6 mt-6 text-sm text-gray-500">
            <span className="flex items-center"><svg className="w-4 h-4 mr-1.5 text-green-500" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg>Free Delivery</span>
            <span className="flex items-center"><svg className="w-4 h-4 mr-1.5 text-green-500" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg>Secure Payment</span>
            <span className="flex items-center"><svg className="w-4 h-4 mr-1.5 text-green-500" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M4 4a2 2 0 00-2 2v4a2 2 0 002 2V6h10a2 2 0 00-2-2H4zm2 6a2 2 0 012-2h8a2 2 0 012 2v4a2 2 0 01-2 2H8a2 2 0 01-2-2v-4zm6 4a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" /></svg>Easy Returns</span>
          </div>
        </div>
      </div>
    </div>
  );
}
