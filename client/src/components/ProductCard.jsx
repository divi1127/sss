import { Link } from 'react-router-dom';
import { FlaskConical, Star, ShoppingCart } from 'lucide-react';
import { useCart } from '../context/CartContext';

export default function ProductCard({ product }) {
  const { addItem } = useCart();

  return (
    <div className="bg-white rounded-2xl shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden border border-gray-100 group hover:-translate-y-1">
      <Link to={`/products/${product.id}`}>
        <div className="h-52 bg-gradient-to-br from-brand-50 to-accent-50 flex items-center justify-center overflow-hidden relative">
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
            <FlaskConical className="text-brand-400 w-16 h-16 opacity-50" />
          </div>
          {product.size && (
            <span className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm text-brand-800 text-[11px] font-bold px-2.5 py-1 rounded-full border border-brand-100 shadow-sm">
              {product.size}
            </span>
          )}
        </div>
      </Link>
      <div className="p-4">
        <Link to={`/products/${product.id}`}>
          <h3 className="font-bold text-gray-800 text-base leading-snug mb-1 hover:text-brand-600 transition-colors">
            {product.name}
          </h3>
        </Link>
        {product.description && (
          <p className="text-xs text-gray-500 mb-2 line-clamp-2 leading-relaxed">
            {product.description}
          </p>
        )}
        {/* Star Rating */}
        <div className="flex items-center gap-1 mb-3">
          {[1, 2, 3, 4, 5].map((s) => (
            <Star key={s} className="w-3 h-3 fill-amber-400 text-amber-400" />
          ))}
          <span className="text-[11px] text-gray-400 ml-1">5.0</span>
        </div>
        <div className="flex items-center justify-between gap-2">
          <span className="text-accent-600 font-black text-xl">
            ₹{parseFloat(product.price).toFixed(2)}
          </span>
          <button
            onClick={() =>
              addItem({
                productId: product.id,
                name: product.name,
                price: parseFloat(product.price),
                image: product.image_url,
              })
            }
            className="flex items-center gap-1.5 bg-brand-600 text-white px-4 py-2 rounded-xl hover:bg-brand-700 transition-all font-bold text-sm shadow-sm hover:shadow-md border border-brand-500"
          >
            <ShoppingCart className="w-3.5 h-3.5" />
            Add
          </button>
        </div>
      </div>
    </div>
  );
}
