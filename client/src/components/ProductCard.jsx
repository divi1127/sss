import { Link } from 'react-router-dom';
import { FlaskConical } from 'lucide-react';
import { useCart } from '../context/CartContext';

export default function ProductCard({ product }) {
  const { addItem } = useCart();

  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow">
      <Link to={`/products/${product.id}`}>
        <div className="h-48 bg-gray-100 flex items-center justify-center overflow-hidden">
          {product.image_url ? (
            <img src={product.image_url} alt={product.name} className="w-full h-full object-cover" />
          ) : (
            <FlaskConical className="text-gray-400 w-12 h-12" />
          )}
        </div>
      </Link>
      <div className="p-4">
        <Link to={`/products/${product.id}`}>
          <h3 className="font-semibold text-gray-800 text-lg mb-1">{product.name}</h3>
        </Link>
        {product.size && <p className="text-sm text-gray-500 mb-2">{product.size}</p>}
        <p className="text-accent-600 font-bold text-xl mb-3">₹{parseFloat(product.price).toFixed(2)}</p>
        <button
          onClick={() => addItem({ productId: product.id, name: product.name, price: parseFloat(product.price), image: product.image_url })}
          className="w-full bg-brand-600 text-white py-2.5 rounded-lg hover:bg-brand-700 transition-all font-bold tracking-wide shadow-md hover:shadow-lg border border-brand-500"
        >
          Add to Cart
        </button>
      </div>
    </div>
  );
}
