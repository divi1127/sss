import { useEffect, useState } from 'react';
import { Star, Check, X, Trash2, Search, RefreshCw, MessageSquare } from 'lucide-react';
import api from '../api/axios';

function StarDisplay({ rating }) {
  return (
    <div className="flex gap-0.5">
      {[1,2,3,4,5].map(s => (
        <Star key={s} className={`w-4 h-4 ${s <= rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-200'}`} />
      ))}
    </div>
  );
}

export default function AdminReviews() {
  const [reviews, setReviews] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [statusFilter, setStatusFilter] = useState('pending');
  const [search, setSearch] = useState('');
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  const load = () => {
    setLoading(true);
    Promise.all([
      api.get('/reviews' + (statusFilter ? `?status=${statusFilter}` : '')).then(r => { setReviews(r.data); setFiltered(r.data); }),
      api.get('/reviews/stats').then(r => setStats(r.data)).catch(() => {}),
    ]).catch(() => {}).finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, [statusFilter]);

  useEffect(() => {
    if (!search.trim()) { setFiltered(reviews); return; }
    const q = search.toLowerCase();
    setFiltered(reviews.filter(r =>
      r.customer_name?.toLowerCase().includes(q) ||
      r.comment?.toLowerCase().includes(q) ||
      r.product_name?.toLowerCase().includes(q)
    ));
  }, [search, reviews]);

  const updateStatus = async (id, status) => {
    try {
      await api.put(`/reviews/${id}/status`, { status });
      load();
    } catch { alert('Failed to update'); }
  };

  const deleteReview = async (id) => {
    if (!confirm('Delete this review?')) return;
    try { await api.delete(`/reviews/${id}`); load(); } catch { alert('Failed to delete'); }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 flex items-center gap-3">
            <div className="w-10 h-10 bg-yellow-400 rounded-xl flex items-center justify-center">
              <Star className="w-5 h-5 text-white" />
            </div>
            Customer Reviews
          </h1>
          <p className="text-gray-500 text-sm mt-1">Manage and moderate customer reviews</p>
        </div>
        <button onClick={load} className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-accent-600 transition-colors px-4 py-2 rounded-lg hover:bg-gray-100">
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} /> Refresh
        </button>
      </div>

      {/* Stats */}
      {stats && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
          {[
            { label: 'Total Reviews', value: stats.total, color: 'bg-blue-500' },
            { label: 'Pending', value: stats.pending, color: 'bg-yellow-500' },
            { label: 'Approved', value: stats.approved, color: 'bg-green-500' },
            { label: 'Avg Rating', value: stats.avgRating ? `${stats.avgRating} ⭐` : 'N/A', color: 'bg-purple-500' },
          ].map(s => (
            <div key={s.label} className="bg-white rounded-xl shadow-sm p-4 border border-gray-100">
              <div className={`w-8 h-8 ${s.color} rounded-lg flex items-center justify-center mb-2`}>
                <Star className="w-4 h-4 text-white" />
              </div>
              <p className="text-xl font-bold text-gray-800">{s.value}</p>
              <p className="text-xs text-gray-500">{s.label}</p>
            </div>
          ))}
        </div>
      )}

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3 mb-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text" placeholder="Search reviews..."
            value={search} onChange={e => setSearch(e.target.value)}
            className="w-full border rounded-lg pl-10 pr-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-accent-400 text-sm"
          />
        </div>
        <select
          value={statusFilter} onChange={e => setStatusFilter(e.target.value)}
          className="border rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-accent-400 bg-white"
        >
          <option value="">All Reviews</option>
          <option value="pending">Pending</option>
          <option value="approved">Approved</option>
          <option value="rejected">Rejected</option>
        </select>
      </div>

      {/* Reviews list */}
      <div className="space-y-3">
        {loading ? (
          [...Array(4)].map((_, i) => <div key={i} className="bg-white rounded-xl p-5 h-24 skeleton" />)
        ) : filtered.length === 0 ? (
          <div className="bg-white rounded-xl p-12 text-center text-gray-400 shadow-sm">
            <MessageSquare className="w-12 h-12 mx-auto mb-3 text-gray-200" />
            <p>No reviews found</p>
          </div>
        ) : (
          filtered.map(r => (
            <div key={r.id} className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2 flex-wrap">
                    <span className="font-semibold text-gray-800">{r.customer_name}</span>
                    <StarDisplay rating={r.rating} />
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                      r.status === 'approved' ? 'bg-green-100 text-green-700' :
                      r.status === 'rejected' ? 'bg-red-100 text-red-700' :
                      'bg-yellow-100 text-yellow-700'
                    }`}>
                      {r.status}
                    </span>
                    {r.product_name && (
                      <span className="text-xs text-gray-400">· {r.product_name}</span>
                    )}
                  </div>
                  {r.comment && <p className="text-gray-600 text-sm leading-relaxed">{r.comment}</p>}
                  <p className="text-xs text-gray-400 mt-2">
                    {new Date(r.created_at).toLocaleString('en-IN')}
                    {r.order_ref && ` · Order #${r.order_ref}`}
                  </p>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  {r.status !== 'approved' && (
                    <button
                      onClick={() => updateStatus(r.id, 'approved')}
                      className="flex items-center gap-1.5 bg-green-100 text-green-700 hover:bg-green-200 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors"
                    >
                      <Check className="w-3.5 h-3.5" /> Approve
                    </button>
                  )}
                  {r.status !== 'rejected' && (
                    <button
                      onClick={() => updateStatus(r.id, 'rejected')}
                      className="flex items-center gap-1.5 bg-red-100 text-red-700 hover:bg-red-200 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors"
                    >
                      <X className="w-3.5 h-3.5" /> Reject
                    </button>
                  )}
                  <button
                    onClick={() => deleteReview(r.id)}
                    className="flex items-center gap-1 text-gray-400 hover:text-red-500 p-1.5 rounded-lg hover:bg-red-50 transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
