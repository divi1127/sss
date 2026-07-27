import { useEffect, useState } from 'react';
import { Package, Plus, Pencil, Trash2, AlertTriangle, Image, Search, X, Upload } from 'lucide-react';
import api from '../api/axios';

export default function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [search, setSearch] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({ name: '', description: '', price: '', size: '', stock: '' });
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  useEffect(() => { loadProducts(); }, []);

  useEffect(() => {
    if (!search.trim()) { setFiltered(products); return; }
    const q = search.toLowerCase();
    setFiltered(products.filter(p => p.name.toLowerCase().includes(q) || (p.size && p.size.toLowerCase().includes(q))));
  }, [search, products]);

  const loadProducts = () => api.get('/products').then(res => { setProducts(res.data); setFiltered(res.data); }).catch(() => {});

  const openNew = () => {
    setEditing(null);
    setForm({ name: '', description: '', price: '', size: '', stock: '' });
    setImage(null);
    setImagePreview(null);
    setShowForm(true);
  };

  const openEdit = (p) => {
    setEditing(p);
    setForm({ name: p.name, description: p.description || '', price: p.price, size: p.size || '', stock: p.stock });
    setImage(null);
    setImagePreview(p.image_url || null);
    setShowForm(true);
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setImage(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const handleSave = async (e) => {
    e.preventDefault();
    const fd = new FormData();
    fd.append('name', form.name);
    fd.append('description', form.description);
    fd.append('price', form.price);
    fd.append('size', form.size);
    fd.append('stock', form.stock);
    if (image) fd.append('image', image);

    try {
      if (editing) {
        await api.put(`/products/${editing.id}`, fd);
      } else {
        await api.post('/products', fd);
      }
      setShowForm(false);
      loadProducts();
    } catch (err) {
      alert('Failed to save product');
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this product?')) return;
    try {
      await api.delete(`/products/${id}`);
      loadProducts();
    } catch { alert('Failed to delete'); }
  };

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 flex items-center gap-3">
          <Package className="w-7 h-7 sm:w-8 sm:h-8 text-accent-600" />
          Products
          <span className="text-base font-normal text-gray-400">({filtered.length})</span>
        </h1>
        <button onClick={openNew} className="bg-brand-600 text-white px-5 py-3 rounded-xl hover:bg-brand-700 transition-all font-bold shadow-lg flex items-center gap-2 border border-brand-500 text-sm sm:text-base self-start sm:self-auto">
          <Plus className="w-4 h-4" /> Add Product
        </button>
      </div>

      <div className="relative mb-4">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
        <input type="text" placeholder="Search products by name or size..." value={search} onChange={e => setSearch(e.target.value)} className="w-full border rounded-lg pl-10 pr-10 py-2.5 focus:outline-none focus:ring-2 focus:ring-accent-400 text-sm" />
        {search && <button onClick={() => setSearch('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"><X className="w-4 h-4" /></button>}
      </div>

      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-start sm:items-center justify-center z-50 p-4 pt-16 sm:pt-4 overflow-y-auto">
          <div className="bg-white rounded-2xl p-6 w-full max-w-lg shadow-2xl my-4">
            <h2 className="text-xl font-bold mb-4">{editing ? 'Edit Product' : 'New Product'}</h2>
            <form onSubmit={handleSave} className="space-y-3">
              <input required placeholder="Product Name" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} className="w-full border rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-accent-400 text-sm" />
              <textarea placeholder="Description" value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} className="w-full border rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-accent-400 text-sm" rows="3" />
              <div className="grid grid-cols-2 gap-3">
                <input required type="number" step="0.01" placeholder="Price (₹)" value={form.price} onChange={e => setForm({ ...form, price: e.target.value })} className="w-full border rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-accent-400 text-sm" />
                <input type="number" placeholder="Stock Qty" value={form.stock} onChange={e => setForm({ ...form, stock: e.target.value })} className="w-full border rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-accent-400 text-sm" />
              </div>
              <input placeholder="Size (e.g. 500ml, 1L)" value={form.size} onChange={e => setForm({ ...form, size: e.target.value })} className="w-full border rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-accent-400 text-sm" />
              <div className="border rounded-lg p-3">
                <label className="flex flex-col items-center gap-2 cursor-pointer">
                  {imagePreview ? (
                    <div className="relative w-full">
                      <img src={imagePreview} alt="Preview" className="w-full max-h-40 object-contain rounded-lg mx-auto" />
                      <button type="button" onClick={() => { setImage(null); setImagePreview(null); }} className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 shadow"><X className="w-3 h-3" /></button>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center gap-1 py-4">
                      <Upload className="w-8 h-8 text-gray-400" />
                      <span className="text-sm text-gray-500">Click to upload image</span>
                      <span className="text-xs text-gray-400">JPEG, PNG, WebP, GIF (max 20MB)</span>
                    </div>
                  )}
                  <input type="file" accept="image/jpeg,image/png,image/webp,image/gif" onChange={handleImageChange} className="hidden" />
                </label>
              </div>
              <div className="flex gap-3 pt-2">
                <button type="submit" className="flex-1 bg-accent-600 text-white py-2.5 rounded-lg hover:bg-accent-700 font-bold shadow-md text-sm">{editing ? 'Update' : 'Create'}</button>
                <button type="button" onClick={() => setShowForm(false)} className="flex-1 border border-gray-300 py-2.5 rounded-lg hover:bg-gray-50 font-medium text-sm">Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="bg-white rounded-xl shadow-md overflow-x-auto">
        <div className="min-w-[600px]">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="text-left px-4 py-3 text-sm font-semibold text-gray-600">Image</th>
                <th className="text-left px-4 py-3 text-sm font-semibold text-gray-600">Name</th>
                <th className="text-left px-4 py-3 text-sm font-semibold text-gray-600">Size</th>
                <th className="text-left px-4 py-3 text-sm font-semibold text-gray-600">Price</th>
                <th className="text-left px-4 py-3 text-sm font-semibold text-gray-600">Stock</th>
                <th className="text-left px-4 py-3 text-sm font-semibold text-gray-600">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(p => {
                const isLowStock = p.stock !== null && p.stock < 10;
                return (
                  <tr key={p.id} className={`border-t hover:bg-gray-50 transition-colors ${isLowStock ? 'bg-orange-50' : ''}`}>
                    <td className="px-4 py-3">
                      {p.image_url ? <img src={p.image_url} alt="" className="w-10 h-10 sm:w-12 sm:h-12 object-cover rounded-lg" /> : <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gray-100 rounded-lg flex items-center justify-center"><Image className="w-5 h-5 text-gray-400" /></div>}
                    </td>
                    <td className="px-4 py-3 font-medium text-sm sm:text-base">{p.name}</td>
                    <td className="px-4 py-3 text-gray-500 text-sm">{p.size || '-'}</td>
                    <td className="px-4 py-3 font-semibold text-gray-800 text-sm">₹{parseFloat(p.price).toFixed(2)}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <span className={`text-sm ${isLowStock ? 'text-red-600 font-bold' : 'text-gray-700'}`}>{p.stock ?? '-'}</span>
                        {isLowStock && <AlertTriangle className="w-4 h-4 text-red-500 flex-shrink-0" title={p.stock <= 0 ? 'Out of Stock' : 'Low Stock'} />}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1 sm:gap-2">
                        <button onClick={() => openEdit(p)} className="flex items-center gap-1 text-accent-600 hover:text-accent-700 text-xs sm:text-sm font-medium px-2 sm:px-3 py-1.5 rounded-lg hover:bg-accent-50 transition-colors"><Pencil className="w-3 h-3 sm:w-3.5 sm:h-3.5" /> <span className="hidden sm:inline">Edit</span></button>
                        <button onClick={() => handleDelete(p.id)} className="flex items-center gap-1 text-red-600 hover:text-red-700 text-xs sm:text-sm font-medium px-2 sm:px-3 py-1.5 rounded-lg hover:bg-red-50 transition-colors"><Trash2 className="w-3 h-3 sm:w-3.5 sm:h-3.5" /> <span className="hidden sm:inline">Delete</span></button>
                      </div>
                    </td>
                  </tr>
                );
              })}
              {filtered.length === 0 && (
                <tr><td colSpan="6" className="px-4 py-12 text-center text-gray-500">
                  <Package className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                  <p>{search ? 'No products match your search' : 'No products yet'}</p>
                </td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
