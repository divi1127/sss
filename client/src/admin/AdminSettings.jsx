import { useState } from 'react';
import { Settings, Save, Phone, Mail, MapPin, Clock, Bell, Shield, CheckCircle } from 'lucide-react';

export default function AdminSettings() {
  const [saved, setSaved] = useState(false);
  const [storeInfo, setStoreInfo] = useState({
    storeName: 'S CUBE',
    phone: '04322 222646',
    whatsapp: '+91 88257 33129',
    email: 'info@scube.in',
    address: 'Pudukkottai, Tamil Nadu, India',
    businessHours: 'Mon–Sat, 9AM–6PM',
  });
  const [emailSettings, setEmailSettings] = useState({
    brevoApiKey: '',
    fromEmail: 'divyadharshini1109@gmail.com',
    adminEmail: 'divyadharshini1109@gmail.com',
    sendOrderConfirmation: true,
    sendStatusUpdates: true,
    sendAdminAlerts: true,
    sendReviewRequests: true,
  });

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
    // In production: call API to save settings to DB
  };

  const inputClass = "w-full border border-gray-200 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-accent-400 text-sm bg-white";
  const labelClass = "block text-sm font-medium text-gray-700 mb-1.5";

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 flex items-center gap-3">
            <div className="w-10 h-10 bg-gray-700 rounded-xl flex items-center justify-center">
              <Settings className="w-5 h-5 text-white" />
            </div>
            Settings
          </h1>
          <p className="text-gray-500 text-sm mt-1">Configure your store and notification preferences</p>
        </div>
        <button
          onClick={handleSave}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-sm transition-all shadow-md ${
            saved ? 'bg-green-600 text-white' : 'bg-accent-600 text-white hover:bg-accent-700'
          }`}
        >
          {saved ? <CheckCircle className="w-4 h-4" /> : <Save className="w-4 h-4" />}
          {saved ? 'Saved!' : 'Save Changes'}
        </button>
      </div>

      <div className="space-y-6">
        {/* Store Information */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h2 className="font-bold text-gray-800 mb-5 flex items-center gap-2">
            <MapPin className="w-5 h-5 text-brand-600" /> Store Information
          </h2>
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>Store Name</label>
              <input value={storeInfo.storeName} onChange={e => setStoreInfo({...storeInfo, storeName: e.target.value})} className={inputClass} />
            </div>
            <div>
              <label className={labelClass}>Phone / Call Number</label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input value={storeInfo.phone} onChange={e => setStoreInfo({...storeInfo, phone: e.target.value})} className={`${inputClass} pl-10`} />
              </div>
            </div>
            <div>
              <label className={labelClass}>WhatsApp Number</label>
              <input value={storeInfo.whatsapp} onChange={e => setStoreInfo({...storeInfo, whatsapp: e.target.value})} className={inputClass} />
            </div>
            <div>
              <label className={labelClass}>Email Address</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input value={storeInfo.email} onChange={e => setStoreInfo({...storeInfo, email: e.target.value})} className={`${inputClass} pl-10`} />
              </div>
            </div>
            <div className="sm:col-span-2">
              <label className={labelClass}>Address</label>
              <input value={storeInfo.address} onChange={e => setStoreInfo({...storeInfo, address: e.target.value})} className={inputClass} />
            </div>
            <div>
              <label className={labelClass}>Business Hours</label>
              <div className="relative">
                <Clock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input value={storeInfo.businessHours} onChange={e => setStoreInfo({...storeInfo, businessHours: e.target.value})} className={`${inputClass} pl-10`} />
              </div>
            </div>
          </div>
        </div>

        {/* Email / Brevo Settings */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h2 className="font-bold text-gray-800 mb-2 flex items-center gap-2">
            <Mail className="w-5 h-5 text-accent-600" /> Email Configuration (Brevo)
          </h2>
          <p className="text-sm text-gray-500 mb-5">
            API key from{' '}
            <a href="https://app.brevo.com/settings/keys/api" target="_blank" rel="noopener noreferrer" className="text-accent-600 underline">brevo.com</a>.
            Free plan sends 300 emails/day to any recipient without domain verification.
          </p>
          <div className="grid sm:grid-cols-2 gap-4 mb-5">
            <div className="sm:col-span-2">
              <label className={labelClass}>Brevo API Key</label>
              <input
                type="password"
                placeholder="xkeysib-xxxxxxxxxxxxxxxxxxxxxxxx"
                value={emailSettings.brevoApiKey}
                onChange={e => setEmailSettings({...emailSettings, brevoApiKey: e.target.value})}
                className={inputClass}
              />
              <p className="text-xs text-gray-400 mt-1">Set as <code>BREVO_API_KEY</code> on Render Environment</p>
            </div>
            <div>
              <label className={labelClass}>From Email Address (Brevo verified sender)</label>
              <input
                value={emailSettings.fromEmail}
                onChange={e => setEmailSettings({...emailSettings, fromEmail: e.target.value})}
                className={inputClass}
                placeholder="divyadharshini1109@gmail.com"
              />
              <p className="text-xs text-gray-400 mt-1">Must match your Brevo account email</p>
            </div>
            <div>
              <label className={labelClass}>Admin Alert Email</label>
              <input
                value={emailSettings.adminEmail}
                onChange={e => setEmailSettings({...emailSettings, adminEmail: e.target.value})}
                className={inputClass}
                placeholder="divyadharshini1109@gmail.com"
              />
              <p className="text-xs text-gray-400 mt-1">Receives alerts on every new order</p>
            </div>
          </div>

          {/* Notification Toggles */}
          <h3 className="font-semibold text-gray-700 mb-3 flex items-center gap-2">
            <Bell className="w-4 h-4 text-gray-500" /> Email Notifications
          </h3>
          <div className="space-y-3">
            {[
              { key: 'sendOrderConfirmation', label: 'Send order confirmation to customers', desc: 'Sent when a new order is placed' },
              { key: 'sendStatusUpdates', label: 'Send status update emails to customers', desc: 'When order status changes' },
              { key: 'sendAdminAlerts', label: 'Send new order alerts to admin', desc: 'Admin receives email when new order arrives' },
              { key: 'sendReviewRequests', label: 'Send review request after delivery', desc: 'Ask customers for a review after order is delivered' },
            ].map(item => (
              <label key={item.key} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100 transition-colors">
                <div>
                  <p className="text-sm font-medium text-gray-800">{item.label}</p>
                  <p className="text-xs text-gray-400">{item.desc}</p>
                </div>
                <div
                  onClick={() => setEmailSettings({...emailSettings, [item.key]: !emailSettings[item.key]})}
                  className={`relative w-11 h-6 rounded-full transition-colors cursor-pointer flex-shrink-0 ${emailSettings[item.key] ? 'bg-brand-600' : 'bg-gray-300'}`}
                >
                  <div className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full shadow transition-transform ${emailSettings[item.key] ? 'translate-x-5' : 'translate-x-0'}`} />
                </div>
              </label>
            ))}
          </div>
        </div>

        {/* Security */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h2 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
            <Shield className="w-5 h-5 text-gray-600" /> Admin Access
          </h2>
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-sm text-blue-700">
            <p className="font-semibold mb-1">🔒 Change Admin Password</p>
            <p>Use the Forgot Password feature on the admin login page to reset your password via email.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
