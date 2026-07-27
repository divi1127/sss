import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail, ArrowLeft, CheckCircle, AlertCircle } from 'lucide-react';
import api from '../api/axios';

export default function ForgotPassword() {
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
      const res = await api.post('/customer/forgot-password', { email });
      setResetUrl(res.data.resetUrl || '');
      setSent(true);
    } catch (err) {
      setError(err.response?.data?.error || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4 py-12">
      <div className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-md animate-fade-in-up">
        <div className="text-center mb-6">
          <img src="/logo.png" alt="S cube" className="w-16 h-16 mx-auto mb-3" />
          <h1 className="text-2xl font-bold text-gray-800">Forgot Password</h1>
          <p className="text-gray-500 text-sm mt-1">Enter your email to receive a reset link</p>
        </div>

        {sent ? (
          <div className="text-center animate-fade-in">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
            <h2 className="text-lg font-semibold text-gray-800 mb-2">Reset Link Sent</h2>
            <p className="text-gray-500 text-sm mb-4">
              If an account exists with <strong>{email}</strong>, you'll receive a password reset link.
            </p>
            {resetUrl && (
              <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 mb-4 text-left">
                <p className="text-yellow-800 text-xs font-semibold mb-1">⚠ Dev Mode — Direct Link</p>
                <a href={resetUrl} className="text-accent-600 text-sm font-medium break-all hover:underline">{resetUrl}</a>
                <p className="text-yellow-700 text-xs mt-1">Configure SMTP in .env for email delivery.</p>
              </div>
            )}
            <Link to="/login" className="text-accent-600 hover:underline font-medium text-sm">Back to Login</Link>
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
                <input required type="email" placeholder="Your email address" value={email} onChange={e => setEmail(e.target.value)} className="w-full border rounded-lg pl-10 pr-4 py-3 focus:outline-none focus:ring-2 focus:ring-accent-400" />
              </div>
              <button type="submit" disabled={loading} className="w-full bg-brand-600 text-white py-3.5 rounded-xl hover:bg-brand-700 transition-all font-bold text-lg disabled:opacity-50 shadow-lg border border-brand-500">
                {loading ? 'Sending...' : 'Send Reset Link'}
              </button>
            </form>
            <p className="text-center text-sm text-gray-500 mt-6">
              <Link to="/login" className="text-accent-600 hover:underline font-medium inline-flex items-center gap-1">
                <ArrowLeft className="w-4 h-4" /> Back to Login
              </Link>
            </p>
          </>
        )}
      </div>
    </div>
  );
}
