import { useEffect, useState } from 'react';
import { IndianRupee, Search, X, Eye, CheckCircle, XCircle, RotateCcw, CreditCard, Wallet } from 'lucide-react';
import api from '../api/axios';

export default function AdminPayments() {
  const [payments, setPayments] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [detail, setDetail] = useState(null);
  const [verifyModal, setVerifyModal] = useState(null);
  const [verifyForm, setVerifyForm] = useState({ transactionId: '', notes: '' });

  useEffect(() => { loadPayments(); }, []);

  useEffect(() => {
    let result = payments;
    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(p => p.customer_name?.toLowerCase().includes(q) || p.customer_phone?.includes(q) || p.transaction_id?.toLowerCase().includes(q) || String(p.order_id).includes(q));
    }
    if (statusFilter) result = result.filter(p => p.status === statusFilter);
    setFiltered(result);
  }, [search, statusFilter, payments]);

  const loadPayments = () => {
    api.get('/payments').then(res => { setPayments(res.data); setFiltered(res.data); }).catch(() => {});
  };

  const viewDetail = async (id) => {
    try {
      const res = await api.get(`/payments/${id}`);
      setDetail(res.data);
    } catch { alert('Failed to load payment'); }
  };

  const openVerify = (p) => {
    setVerifyModal(p);
    setVerifyForm({ transactionId: p.transaction_id || '', notes: '' });
  };

  const handleVerify = async (status) => {
    if (!verifyModal) return;
    try {
      await api.put(`/payments/${verifyModal.id}/verify`, { status, ...verifyForm });
      setVerifyModal(null);
      setDetail(null);
      loadPayments();
    } catch { alert('Failed to update payment'); }
  };

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 flex items-center gap-3">
          <IndianRupee className="w-7 h-7 sm:w-8 sm:h-8 text-accent-600" />
          Payments
          <span className="text-base font-normal text-gray-400">({filtered.length})</span>
        </h1>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 mb-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input type="text" placeholder="Search by customer, phone, transaction ID..." value={search} onChange={e => setSearch(e.target.value)} className="w-full border rounded-lg pl-10 pr-10 py-2.5 focus:outline-none focus:ring-2 focus:ring-accent-400 text-sm" />
          {search && <button onClick={() => setSearch('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"><X className="w-4 h-4" /></button>}
        </div>
        <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)} className="border rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-accent-400 bg-white">
          <option value="">All Statuses</option>
          <option value="pending">Pending</option>
          <option value="verified">Verified</option>
          <option value="failed">Failed</option>
          <option value="refunded">Refunded</option>
        </select>
      </div>

      <div className="bg-white rounded-xl shadow-md overflow-x-auto">
        <div className="min-w-[700px]">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="text-left px-4 py-3 text-sm font-semibold text-gray-600">Order</th>
                <th className="text-left px-4 py-3 text-sm font-semibold text-gray-600">Customer</th>
                <th className="text-left px-4 py-3 text-sm font-semibold text-gray-600">Amount</th>
                <th className="text-left px-4 py-3 text-sm font-semibold text-gray-600">Method</th>
                <th className="text-left px-4 py-3 text-sm font-semibold text-gray-600">Transaction ID</th>
                <th className="text-left px-4 py-3 text-sm font-semibold text-gray-600">Status</th>
                <th className="text-left px-4 py-3 text-sm font-semibold text-gray-600">Date</th>
                <th className="text-left px-4 py-3 text-sm font-semibold text-gray-600">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(p => (
                <tr key={p.id} className="border-t hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-3 font-medium text-sm">#{p.order_id}</td>
                  <td className="px-4 py-3 text-sm">{p.customer_name}<br /><span className="text-xs text-gray-500">{p.customer_phone}</span></td>
                  <td className="px-4 py-3 font-semibold text-sm">₹{parseFloat(p.amount).toFixed(2)}</td>
                  <td className="px-4 py-3">
                    <span className="flex items-center gap-1 text-xs font-medium">
                      {p.method === 'upi' ? <Wallet className="w-3 h-3" /> : <CreditCard className="w-3 h-3" />}
                      {p.method?.toUpperCase()}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-500">{p.transaction_id || '-'}</td>
                  <td className="px-4 py-3"><PaymentBadge status={p.status} /></td>
                  <td className="px-4 py-3 text-sm text-gray-500">{new Date(p.created_at).toLocaleDateString()}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1">
                      <button onClick={() => viewDetail(p.id)} className="text-accent-600 hover:text-accent-700 text-sm font-medium px-2 py-1.5 rounded-lg hover:bg-accent-50 transition-colors"><Eye className="w-3.5 h-3.5" /></button>
                      {p.status === 'pending' && (
                        <button onClick={() => openVerify(p)} className="text-green-600 hover:text-green-700 text-sm font-medium px-2 py-1.5 rounded-lg hover:bg-green-50 transition-colors"><CheckCircle className="w-3.5 h-3.5" /></button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr><td colSpan="8" className="px-4 py-12 text-center text-gray-500">
                  <IndianRupee className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                  <p>{search || statusFilter ? 'No payments match your filters' : 'No payments yet'}</p>
                </td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {detail && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-start sm:items-center justify-center z-50 p-4 pt-16 sm:pt-4 overflow-y-auto">
          <div className="bg-white rounded-2xl p-6 w-full max-w-lg shadow-2xl my-4">
            <div className="flex justify-between items-start mb-4">
              <h2 className="text-xl font-bold flex items-center gap-2"><IndianRupee className="w-5 h-5 text-accent-600" /> Payment #{detail.id}</h2>
              <button onClick={() => setDetail(null)} className="text-gray-500 hover:text-gray-700 text-2xl leading-none">&times;</button>
            </div>
            <div className="space-y-3 text-sm">
              <div className="grid grid-cols-2 gap-3">
                <div><strong>Order:</strong> #{detail.order_id}</div>
                <div><strong>Amount:</strong> ₹{parseFloat(detail.amount).toFixed(2)}</div>
                <div><strong>Customer:</strong> {detail.customer_name}</div>
                <div><strong>Phone:</strong> {detail.customer_phone}</div>
                {detail.customer_email && <div className="col-span-2"><strong>Email:</strong> {detail.customer_email}</div>}
                <div><strong>Method:</strong> {detail.method?.toUpperCase()}</div>
                <div><strong>Transaction:</strong> {detail.transaction_id || 'N/A'}</div>
                <div><strong>Status:</strong> <PaymentBadge status={detail.status} /></div>
                <div><strong>Order Status:</strong> {detail.order_status}</div>
              </div>
              {detail.screenshot_url && (
                <div><strong>Screenshot:</strong><div className="mt-1"><img src={detail.screenshot_url} alt="Payment" className="max-h-48 rounded-lg border" /></div></div>
              )}
              {detail.notes && <div><strong>Notes:</strong><p className="text-gray-600 mt-1">{detail.notes}</p></div>}
            </div>
            <div className="flex gap-2 mt-4 pt-4 border-t">
              {detail.status === 'pending' && (
                <>
                  <button onClick={() => { setDetail(null); openVerify(detail); }} className="flex-1 bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 font-medium text-sm">Verify</button>
                  <button onClick={async () => { await api.put(`/payments/${detail.id}/verify`, { status: 'failed' }); setDetail(null); loadPayments(); }} className="flex-1 bg-red-600 text-white py-2 rounded-lg hover:bg-red-700 font-medium text-sm">Mark Failed</button>
                </>
              )}
            </div>
          </div>
        </div>
      )}

      {verifyModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-2xl">
            <h2 className="text-xl font-bold mb-4">Verify Payment #{verifyModal.id}</h2>
            <p className="text-sm text-gray-500 mb-4">Order #{verifyModal.order_id} — ₹{parseFloat(verifyModal.amount).toFixed(2)} from {verifyModal.customer_name}</p>
            <div className="space-y-3">
              <input placeholder="Transaction ID (optional)" value={verifyForm.transactionId} onChange={e => setVerifyForm({ ...verifyForm, transactionId: e.target.value })} className="w-full border rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-accent-400 text-sm" />
              <textarea placeholder="Notes (optional)" value={verifyForm.notes} onChange={e => setVerifyForm({ ...verifyForm, notes: e.target.value })} className="w-full border rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-accent-400 text-sm" rows="2" />
              {verifyModal.screenshot_url && (
                <div><img src={verifyModal.screenshot_url} alt="Screenshot" className="max-h-40 rounded-lg border mx-auto" /></div>
              )}
              <div className="flex gap-2 pt-2">
                <button onClick={() => handleVerify('verified')} className="flex-1 bg-green-600 text-white py-2.5 rounded-lg hover:bg-green-700 font-bold text-sm flex items-center justify-center gap-1"><CheckCircle className="w-4 h-4" /> Approve</button>
                <button onClick={() => handleVerify('failed')} className="flex-1 bg-red-600 text-white py-2.5 rounded-lg hover:bg-red-700 font-bold text-sm flex items-center justify-center gap-1"><XCircle className="w-4 h-4" /> Reject</button>
                <button onClick={() => setVerifyModal(null)} className="flex-1 border border-gray-300 py-2.5 rounded-lg hover:bg-gray-50 font-medium text-sm">Cancel</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function PaymentBadge({ status }) {
  const colors = {
    pending: 'bg-yellow-100 text-yellow-700',
    verified: 'bg-green-100 text-green-700',
    failed: 'bg-red-100 text-red-700',
    refunded: 'bg-purple-100 text-purple-700',
  };
  return <span className={`text-xs px-2 py-1 rounded font-medium ${colors[status] || 'bg-gray-100 text-gray-700'}`}>{status.charAt(0).toUpperCase() + status.slice(1)}</span>;
}
