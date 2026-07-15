import { useEffect, useState } from 'react';
import { SearchX } from 'lucide-react';
import api from '../api/axios';
import ProductCard from '../components/ProductCard';

export default function Products() {
  const [products, setProducts] = useState([]);
  const [sort, setSort] = useState('');
  const [sizeFilter, setSizeFilter] = useState('');

  useEffect(() => {
    const params = {};
    if (sort) params.sort = sort;
    if (sizeFilter) params.size = sizeFilter;
    api.get('/products', { params }).then(res => setProducts(res.data)).catch(() => {});
  }, [sort, sizeFilter]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="text-center mb-10 animate-fade-in-up">
        <span className="text-accent-600 font-semibold text-sm tracking-wider uppercase">Shop</span>
        <h1 className="text-3xl sm:text-4xl font-bold text-gray-800 mt-2">Our Products</h1>
        <p className="text-gray-500 mt-2">Browse our range of eco-friendly vessel washing liquids.</p>
      </div>

      <div className="flex flex-wrap gap-4 mb-8 animate-fade-in">
        <div className="relative">
          <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" /></svg>
          <select value={sort} onChange={e => setSort(e.target.value)} className="border rounded-lg pl-10 pr-4 py-2.5 text-gray-700 bg-white appearance-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-accent-400">
            <option value="">Sort: Default</option>
            <option value="price_asc">Price: Low to High</option>
            <option value="price_desc">Price: High to Low</option>
            <option value="name">Name: A-Z</option>
          </select>
        </div>

        <div className="relative">
          <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" /></svg>
          <select value={sizeFilter} onChange={e => setSizeFilter(e.target.value)} className="border rounded-lg pl-10 pr-4 py-2.5 text-gray-700 bg-white appearance-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-accent-400">
            <option value="">All Sizes</option>
            <option value="250ml">250ml</option>
            <option value="500ml">500ml</option>
            <option value="1L">1L</option>
            <option value="2L">2L</option>
            <option value="5L">5L</option>
          </select>
        </div>

        {(sort || sizeFilter) && (
          <button onClick={() => { setSort(''); setSizeFilter(''); }} className="text-sm text-red-500 hover:text-red-700 flex items-center">
            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
            Clear filters
          </button>
        )}
      </div>

      {products.length === 0 ? (
        <div className="text-center py-16 animate-fade-in">
          <SearchX className="w-16 h-16 mx-auto mb-4 text-gray-300" />
          <p className="text-gray-500 text-lg">No products found.</p>
          <button onClick={() => { setSort(''); setSizeFilter(''); }} className="mt-4 text-accent-600 hover:underline">Clear filters</button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {products.map((p, i) => (
            <div key={p.id} className="animate-fade-in-up" style={{ animationDelay: `${i * 0.05}s` }}>
              <ProductCard product={p} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
