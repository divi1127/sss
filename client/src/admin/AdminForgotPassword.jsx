import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail, ArrowLeft, CheckCircle, AlertCircle, Shield } from 'lucide-react';
import api from '../api/axios';

export default function AdminForgotPassword() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [resetUrl, setResetUrl] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res = await api.post('/auth/forgot-password', { email });
      setResetUrl(res.data.resetUrl || '');
      setSent(true);
    } catch (err) {
      setError(err.response?.data?.error || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-900/90 via-green-700/70 to-white/20 p-4">
      <div className="bg-white p-6 sm:p-8 rounded-2xl shadow-2xl w-full max-w-md">
        <div className="text-center mb-6">
          <div className="flex justify-center mb-3">
            <div className="w-14 h-14 bg-brand-100 rounded-full flex items-center justify-center">
              <Shield className="w-7 h-7 text-brand-600" />
            </div>
          </div>
          <h1 className="text-2xl font-bold text-gray-800">Admin Forgot Password</h1>
          <p className="text-gray-500 text-sm mt-1">Enter your admin email</p>
        </div>

        {sent ? (
          <div className="text-center animate-fade-in">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
            <h2 className="text-lg font-semibold text-gray-800 mb-2">Reset Link Sent</h2>
            <p className="text-gray-500 text-sm mb-4">If an admin account exists for <strong>{email}</strong>, you'll receive a reset link.</p>
            {resetUrl && (
              <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 mb-4 text-left">
                <p className="text-yellow-800 text-xs font-semibold mb-1">⚠ Dev Mode — Direct Link</p>
                <a href={resetUrl} className="text-accent-600 text-sm font-medium break-all hover:underline">{resetUrl}</a>
                <p className="text-yellow-700 text-xs mt-1">Configure SMTP in .env for email delivery.</p>
              </div>
            )}
            <Link to="/admin" className="text-accent-600 hover:underline font-medium text-sm">Back to Admin Login</Link>
          </div>
        ) : (
          <>
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg px-4 py-3 mb-4 flex items-center">
                <AlertCircle className="w-5 h-5 text-red-500 mr-2 flex-shrink-0" />
                <p className="text-red-600 text-sm">{error}</p>
              </div>
            )}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input required type="email" placeholder="Admin email" value={email} onChange={e => setEmail(e.target.value)} className="w-full border rounded-lg pl-10 pr-4 py-3 focus:outline-none focus:ring-2 focus:ring-accent-400 text-sm" />
              </div>
              <button type="submit" disabled={loading} className="w-full bg-brand-600 text-white py-3.5 rounded-xl hover:bg-brand-700 transition-all font-bold shadow-xl border border-brand-500">
                {loading ? 'Sending...' : 'Send Reset Link'}
              </button>
            </form>
            <p className="text-center mt-6">
              <Link to="/admin" className="text-accent-600 hover:underline font-medium text-sm inline-flex items-center gap-1">
                <ArrowLeft className="w-4 h-4" /> Back to Login
              </Link>
            </p>
          </>
        )}
      </div>
    </div>
  );
}
