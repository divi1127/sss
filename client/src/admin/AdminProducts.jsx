import { useEffect, useState } from 'react';
import { Package, Plus, Pencil, Trash2, AlertTriangle, Image as ImageIcon, Search, X, Upload, Link as LinkIcon, Check } from 'lucide-react';
import api from '../api/axios';

// Resize & compress file to Base64 data URL for permanent database storage
function fileToBase64(file, maxWidth = 800, maxHeight = 800, quality = 0.85) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (e) => {
      const img = document.createElement('img');
      img.src = e.target.result;
      img.onload = () => {
        const canvas = document.createElement('canvas');
        let { width, height } = img;
        if (width > maxWidth || height > maxHeight) {
          if (width > height) {
            height = Math.round((height * maxWidth) / width);
            width = maxWidth;
          } else {
            width = Math.round((width * maxHeight) / height);
            height = maxHeight;
          }
        }
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, width, height);
        resolve(canvas.toDataURL('image/jpeg', quality));
      };
      img.onerror = () => resolve(e.target.result);
    };
    reader.onerror = reject;
  });
}

function ProductThumbnail({ src, alt }) {
  const [error, setError] = useState(false);

  useEffect(() => {
    setError(false);
  }, [src]);

  if (!src || error) {
    return (
      <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gray-100 rounded-lg flex items-center justify-center border border-gray-200 text-gray-400">
        <ImageIcon className="w-5 h-5 text-gray-400" />
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt || ''}
      className="w-10 h-10 sm:w-12 sm:h-12 object-cover rounded-lg border border-gray-200"
      onError={() => setError(true)}
    />
  );
}

export default function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [search, setSearch] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({ name: '', description: '', price: '', size: '', stock: '' });
  const [imageMode, setImageMode] = useState('upload'); // 'upload' | 'url'
  const [imagePreview, setImagePreview] = useState(null);
  const [urlInput, setUrlInput] = useState('');
  const [saving, setSaving] = useState(false);

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
    setImagePreview(null);
    setUrlInput('');
    setImageMode('upload');
    setShowForm(true);
  };

  const openEdit = (p) => {
    setEditing(p);
    setForm({ name: p.name, description: p.description || '', price: p.price, size: p.size || '', stock: p.stock });
    setImagePreview(p.image_url || null);
    setUrlInput(p.image_url?.startsWith('http') ? p.image_url : '');
    setImageMode(p.image_url?.startsWith('http') ? 'url' : 'upload');
    setShowForm(true);
  };

  const handleImageFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    try {
      const base64 = await fileToBase64(file);
      setImagePreview(base64);
    } catch {
      alert('Could not read image file');
    }
  };

  const handleApplyUrl = () => {
    if (urlInput.trim()) {
      setImagePreview(urlInput.trim());
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);

    const payload = {
      name: form.name,
      description: form.description,
      price: form.price,
      size: form.size,
      stock: form.stock,
      image_url: imagePreview || null,
    };

    try {
      if (editing) {
        await api.put(`/products/${editing.id}`, payload);
      } else {
        await api.post('/products', payload);
      }
      setShowForm(false);
      loadProducts();
    } catch (err) {
      alert(err.response?.data?.error || 'Failed to save product');
    } finally {
      setSaving(false);
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
            <form onSubmit={handleSave} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">Product Name *</label>
                <input required placeholder="e.g. Vessel Washing Liquid" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} className="w-full border rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-accent-400 text-sm" />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">Description</label>
                <textarea placeholder="Describe features, scent, ingredients..." value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} className="w-full border rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-accent-400 text-sm" rows="3" />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1">Price (₹) *</label>
                  <input required type="number" step="0.01" placeholder="399.00" value={form.price} onChange={e => setForm({ ...form, price: e.target.value })} className="w-full border rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-accent-400 text-sm" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1">Stock Quantity</label>
                  <input type="number" placeholder="10" value={form.stock} onChange={e => setForm({ ...form, stock: e.target.value })} className="w-full border rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-accent-400 text-sm" />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">Size / Volume</label>
                <input placeholder="e.g. 500ml, 1L, 5L" value={form.size} onChange={e => setForm({ ...form, size: e.target.value })} className="w-full border rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-accent-400 text-sm" />
              </div>

              {/* Product Image Section (Upload or URL) */}
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1.5">Product Image (Stored in Database)</label>

                {/* Mode Selector */}
                <div className="flex bg-gray-100 p-1 rounded-lg mb-3">
                  <button
                    type="button"
                    onClick={() => setImageMode('upload')}
                    className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 text-xs font-semibold rounded-md transition-all ${
                      imageMode === 'upload' ? 'bg-white text-gray-800 shadow-sm' : 'text-gray-500 hover:text-gray-800'
                    }`}
                  >
                    <Upload className="w-3.5 h-3.5" /> Upload File
                  </button>
                  <button
                    type="button"
                    onClick={() => setImageMode('url')}
                    className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 text-xs font-semibold rounded-md transition-all ${
                      imageMode === 'url' ? 'bg-white text-gray-800 shadow-sm' : 'text-gray-500 hover:text-gray-800'
                    }`}
                  >
                    <LinkIcon className="w-3.5 h-3.5" /> Image URL
                  </button>
                </div>

                {imageMode === 'upload' ? (
                  <div className="border-2 border-dashed border-gray-300 hover:border-brand-500 rounded-xl p-4 transition-colors">
                    <label className="flex flex-col items-center gap-2 cursor-pointer">
                      <div className="w-10 h-10 bg-brand-50 rounded-full flex items-center justify-center text-brand-600">
                        <Upload className="w-5 h-5" />
                      </div>
                      <span className="text-sm font-medium text-gray-700">Click to choose image file</span>
                      <span className="text-xs text-gray-400">JPEG, PNG, WebP — automatically compressed & stored in DB</span>
                      <input type="file" accept="image/*" onChange={handleImageFileChange} className="hidden" />
                    </label>
                  </div>
                ) : (
                  <div className="flex gap-2">
                    <input
                      type="url"
                      placeholder="https://example.com/product-image.jpg"
                      value={urlInput}
                      onChange={(e) => setUrlInput(e.target.value)}
                      className="flex-1 border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-accent-400"
                    />
                    <button
                      type="button"
                      onClick={handleApplyUrl}
                      className="bg-gray-800 text-white px-3 py-2 rounded-lg text-xs font-semibold hover:bg-gray-900"
                    >
                      Apply
                    </button>
                  </div>
                )}

                {/* Live Preview */}
                {imagePreview && (
                  <div className="mt-3 relative bg-gray-50 border rounded-xl p-2 flex items-center gap-3">
                    <img
                      src={imagePreview}
                      alt="Preview"
                      className="w-16 h-16 object-cover rounded-lg border bg-white"
                      onError={() => alert('Image preview failed to load. Please check the URL.')}
                    />
                    <div className="flex-1 text-xs">
                      <p className="font-semibold text-green-700 flex items-center gap-1">
                        <Check className="w-3.5 h-3.5" /> Image ready to save
                      </p>
                      <p className="text-gray-400 truncate max-w-[200px]">
                        {imagePreview.startsWith('data:') ? 'Stored as Base64 in Database' : imagePreview}
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => { setImagePreview(null); setUrlInput(''); }}
                      className="text-red-500 hover:text-red-700 p-1.5 rounded-lg hover:bg-red-50"
                      title="Remove image"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                )}
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="submit"
                  disabled={saving}
                  className="flex-1 bg-accent-600 text-white py-2.5 rounded-lg hover:bg-accent-700 font-bold shadow-md text-sm disabled:opacity-50"
                >
                  {saving ? 'Saving...' : (editing ? 'Update Product' : 'Create Product')}
                </button>
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="flex-1 border border-gray-300 py-2.5 rounded-lg hover:bg-gray-50 font-medium text-sm"
                >
                  Cancel
                </button>
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
                      <ProductThumbnail src={p.image_url} alt={p.name} />
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

