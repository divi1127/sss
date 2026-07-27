import { useEffect, useState } from 'react';
import { Users, Search, X, Eye, Phone, Mail, MapPin, ShoppingBag, IndianRupee, Calendar, ArrowUpDown } from 'lucide-react';
import api from '../api/axios';

export default function AdminCustomers() {
  const [customers, setCustomers] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [search, setSearch] = useState('');
  const [sort, setSort] = useState('date');
  const [detail, setDetail] = useState(null);

  useEffect(() => { loadCustomers(); }, []);

  useEffect(() => {
    let result = customers;
    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(c => c.name?.toLowerCase().includes(q) || c.phone?.includes(q) || c.email?.toLowerCase().includes(q));
    }
    setFiltered(result);
  }, [search, customers]);

  useEffect(() => {
    loadCustomers();
  }, [sort]);

  const loadCustomers = () => {
    api.get(`/customers?sort=${sort}`).then(res => { setCustomers(res.data); setFiltered(res.data); }).catch(() => {});
  };

  const viewDetail = async (id) => {
    try {
      const res = await api.get(`/customers/${id}`);
      setDetail(res.data);
    } catch { alert('Failed to load customer'); }
  };

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 flex items-center gap-3">
          <Users className="w-7 h-7 sm:w-8 sm:h-8 text-accent-600" />
          Customers
          <span className="text-base font-normal text-gray-400">({filtered.length})</span>
        </h1>
        <div className="flex gap-2">
          {[
            { key: 'date', label: 'Newest' },
            { key: 'orders', label: 'Most Orders' },
            { key: 'spent', label: 'Top Spenders' },
            { key: 'name', label: 'Name' },
          ].map(s => (
            <button key={s.key} onClick={() => setSort(s.key)} className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${sort === s.key ? 'bg-accent-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>{s.label}</button>
          ))}
        </div>
      </div>

      <div className="relative mb-4">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
        <input type="text" placeholder="Search by name, phone, or email..." value={search} onChange={e => setSearch(e.target.value)} className="w-full border rounded-lg pl-10 pr-10 py-2.5 focus:outline-none focus:ring-2 focus:ring-accent-400 text-sm" />
        {search && <button onClick={() => setSearch('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"><X className="w-4 h-4" /></button>}
      </div>

      <div className="grid gap-4">
        {filtered.map((c, i) => (
          <div key={c.id} className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 sm:p-5 hover:shadow-md transition-all animate-fade-in-up" style={{ animationDelay: `${i * 0.03}s` }}>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-brand-100 to-accent-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-brand-700 font-bold text-lg">{c.name?.charAt(0)?.toUpperCase()}</span>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-800">{c.name}</h3>
                  <div className="flex flex-wrap gap-x-3 gap-y-0.5 text-xs text-gray-500">
                    {c.phone && <span className="flex items-center gap-0.5"><Phone className="w-3 h-3" /> {c.phone}</span>}
                    {c.email && <span className="flex items-center gap-0.5"><Mail className="w-3 h-3" /> {c.email}</span>}
                  </div>
                  {c.address && <p className="text-xs text-gray-400 flex items-center gap-0.5 mt-0.5"><MapPin className="w-3 h-3" /> {c.address}</p>}
                </div>
              </div>
              <div className="flex items-center gap-4 sm:gap-6 text-sm">
                <div className="text-center">
                  <p className="font-bold text-gray-800">{c.total_orders || 0}</p>
                  <p className="text-xs text-gray-500">Orders</p>
                </div>
                <div className="text-center">
                  <p className="font-bold text-gray-800">₹{parseFloat(c.total_spent || 0).toFixed(2)}</p>
                  <p className="text-xs text-gray-500">Spent</p>
                </div>
                <div className="text-center">
                  <p className="text-xs text-gray-400">{c.last_order_date ? new Date(c.last_order_date).toLocaleDateString() : '—'}</p>
                  <p className="text-xs text-gray-500">Last Order</p>
                </div>
                <button onClick={() => viewDetail(c.id)} className="text-accent-600 hover:text-accent-700 text-sm font-medium px-3 py-1.5 rounded-lg hover:bg-accent-50 transition-colors flex items-center gap-1"><Eye className="w-3.5 h-3.5" /> View</button>
              </div>
            </div>
          </div>
        ))}
        {filtered.length === 0 && (
          <div className="text-center py-16 text-gray-500">
            <Users className="w-16 h-16 mx-auto mb-3 text-gray-300" />
            <p>{search ? 'No customers match your search' : 'No customers yet'}</p>
          </div>
        )}
      </div>

      {detail && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-start sm:items-center justify-center z-50 p-4 pt-16 sm:pt-4 overflow-y-auto">
          <div className="bg-white rounded-2xl p-6 w-full max-w-lg shadow-2xl my-4">
            <div className="flex justify-between items-start mb-4">
              <h2 className="text-xl font-bold flex items-center gap-2"><Users className="w-5 h-5 text-accent-600" /> {detail.name}</h2>
              <button onClick={() => setDetail(null)} className="text-gray-500 hover:text-gray-700 text-2xl leading-none">&times;</button>
            </div>
            <div className="space-y-3 text-sm">
              <div className="grid grid-cols-2 gap-2">
                {detail.phone && <div><strong>Phone:</strong><br /><span className="text-gray-600">{detail.phone}</span></div>}
                {detail.email && <div><strong>Email:</strong><br /><span className="text-gray-600">{detail.email}</span></div>}
                {detail.address && <div className="col-span-2"><strong>Address:</strong><br /><span className="text-gray-600">{detail.address}</span></div>}
                <div><strong>Total Orders:</strong><br /><span className="text-gray-600">{detail.total_orders || 0}</span></div>
                <div><strong>Total Spent:</strong><br /><span className="text-gray-600">₹{parseFloat(detail.total_spent || 0).toFixed(2)}</span></div>
                <div><strong>Customer Since:</strong><br /><span className="text-gray-600">{new Date(detail.created_at).toLocaleDateString()}</span></div>
              </div>
            </div>
            {detail.orders?.length > 0 && (
              <div className="mt-4 pt-4 border-t">
                <h3 className="font-semibold text-sm mb-2">Recent Orders</h3>
                <div className="space-y-2 max-h-48 overflow-y-auto">
                  {detail.orders.map(o => (
                    <div key={o.id} className="flex justify-between items-center bg-gray-50 rounded-lg p-2.5 text-sm">
                      <div>
                        <span className="font-medium text-gray-800">#{o.id}</span>
                        <span className={`ml-2 text-xs px-1.5 py-0.5 rounded ${o.status === 'Delivered' ? 'bg-teal-100 text-teal-700' : o.status === 'Confirmed' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>{o.status}</span>
                      </div>
                      <span className="font-semibold">₹{parseFloat(o.total_amount).toFixed(2)}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
