import { useEffect, useState } from 'react';
import { MessageSquare, Search, X, Trash2, CheckCircle, Clock } from 'lucide-react';
import api from '../api/axios';

export default function AdminEnquiries() {
  const [enquiries, setEnquiries] = useState([]);
  const [search, setSearch] = useState('');

  useEffect(() => { loadEnquiries(); }, []);

  const loadEnquiries = () => {
    api.get('/enquiries').then(res => setEnquiries(res.data)).catch(() => {});
  };

  const updateStatus = async (id, status) => {
    try {
      await api.put(`/enquiries/${id}`, { status });
      loadEnquiries();
    } catch {
      alert('Failed to update status');
    }
  };

  const deleteEnquiry = async (id) => {
    if (!window.confirm('Are you sure you want to delete this enquiry?')) return;
    try {
      await api.delete(`/enquiries/${id}`);
      loadEnquiries();
    } catch {
      alert('Failed to delete enquiry');
    }
  };

  const filtered = enquiries.filter(e => 
    e.name?.toLowerCase().includes(search.toLowerCase()) || 
    e.phone?.includes(search) || 
    e.product_name?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 flex items-center gap-3">
          <MessageSquare className="w-7 h-7 sm:w-8 sm:h-8 text-accent-600" />
          Enquiries
          <span className="text-base font-normal text-gray-400">({filtered.length})</span>
        </h1>
      </div>

      <div className="relative mb-4">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
        <input type="text" placeholder="Search by name, phone, or product..." value={search} onChange={e => setSearch(e.target.value)} className="w-full border rounded-lg pl-10 pr-10 py-2.5 focus:outline-none focus:ring-2 focus:ring-accent-400 text-sm" />
        {search && <button onClick={() => setSearch('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"><X className="w-4 h-4" /></button>}
      </div>

      <div className="bg-white rounded-xl shadow-md overflow-x-auto">
        <div className="min-w-[800px]">
          <table className="w-full">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="text-left px-4 py-3 text-sm font-semibold text-gray-600">Date</th>
                <th className="text-left px-4 py-3 text-sm font-semibold text-gray-600">Customer</th>
                <th className="text-left px-4 py-3 text-sm font-semibold text-gray-600">Product</th>
                <th className="text-left px-4 py-3 text-sm font-semibold text-gray-600">Message</th>
                <th className="text-left px-4 py-3 text-sm font-semibold text-gray-600">Status</th>
                <th className="text-left px-4 py-3 text-sm font-semibold text-gray-600">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(e => (
                <tr key={e.id} className="border-b hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-3 text-sm text-gray-500 whitespace-nowrap">{new Date(e.created_at).toLocaleDateString()}</td>
                  <td className="px-4 py-3 text-sm">
                    <p className="font-semibold text-gray-900">{e.name}</p>
                    <p className="text-gray-500 text-xs">{e.phone}</p>
                  </td>
                  <td className="px-4 py-3 text-sm text-brand-700 font-medium">{e.product_name || 'General Enquiry'}</td>
                  <td className="px-4 py-3 text-sm text-gray-600 max-w-xs truncate">{e.message || '-'}</td>
                  <td className="px-4 py-3">
                    <select
                      value={e.status}
                      onChange={(evt) => updateStatus(e.id, evt.target.value)}
                      className={`text-xs px-2 py-1.5 rounded-lg border-none font-bold focus:ring-2 focus:ring-accent-400 ${
                        e.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' :
                        e.status === 'Responded' ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-600'
                      }`}
                    >
                      <option value="Pending">Pending</option>
                      <option value="Responded">Responded</option>
                      <option value="Closed">Closed</option>
                    </select>
                  </td>
                  <td className="px-4 py-3 text-sm">
                    <button onClick={() => deleteEnquiry(e.id)} className="text-red-500 hover:text-red-700 p-1.5 rounded-lg hover:bg-red-50 transition-colors" title="Delete Enquiry">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan="6" className="px-4 py-12 text-center text-gray-500">
                    <MessageSquare className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                    <p>No enquiries found.</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
