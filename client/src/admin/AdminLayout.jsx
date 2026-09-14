import { useState, useEffect } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard, Package, ShoppingCart, LogOut, Shield,
  Menu, X, IndianRupee, Users, BarChart3, TrendingUp,
  Settings, Bell, Star, ChevronRight
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';

export default function AdminLayout() {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [pendingCount, setPendingCount] = useState(0);
  const [reviewPending, setReviewPending] = useState(0);

  useEffect(() => {
    // Fetch pending orders count for notification badge
    api.get('/orders/stats/summary').then(res => {
      setPendingCount(res.data.pendingVerification || 0);
    }).catch(() => {});
    api.get('/reviews/stats').then(res => {
      setReviewPending(res.data.pending || 0);
    }).catch(() => {});
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/admin');
  };

  const navGroups = [
    {
      label: 'Main',
      items: [
        { to: '/admin/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
        { to: '/admin/notifications', icon: Bell, label: 'Notifications', badge: pendingCount },
      ],
    },
    {
      label: 'Store',
      items: [
        { to: '/admin/products', icon: Package, label: 'Products' },
        { to: '/admin/orders', icon: ShoppingCart, label: 'Orders' },
        { to: '/admin/payments', icon: IndianRupee, label: 'Payments' },
        { to: '/admin/customers', icon: Users, label: 'Customers' },
        { to: '/admin/reviews', icon: Star, label: 'Reviews', badge: reviewPending },
      ],
    },
    {
      label: 'Insights',
      items: [
        { to: '/admin/reports', icon: BarChart3, label: 'Reports' },
        { to: '/admin/analytics', icon: TrendingUp, label: 'Analytics' },
      ],
    },
    {
      label: 'System',
      items: [
        { to: '/admin/settings', icon: Settings, label: 'Settings' },
      ],
    },
  ];

  return (
    <div className="min-h-screen flex bg-gray-50">
      {/* Mobile menu button */}
      <button
        onClick={() => setSidebarOpen(true)}
        className="fixed top-4 left-4 z-50 lg:hidden bg-gray-900 text-white p-2.5 rounded-lg shadow-lg hover:bg-gray-800 transition-colors"
      >
        <Menu className="w-5 h-5" />
      </button>

      {/* Overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 bg-black/60 z-40 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      {/* Sidebar */}
      <aside className={`fixed lg:static inset-y-0 left-0 z-50 w-64 flex flex-col flex-shrink-0 transition-transform duration-300
        bg-gradient-to-b from-gray-900 via-gray-900 to-gray-950
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-5 border-b border-white/10">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 bg-gradient-to-br from-brand-500 to-brand-700 rounded-xl flex items-center justify-center shadow-lg">
              <Shield className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="text-white font-bold text-sm leading-none">S CUBE</p>
              <p className="text-gray-400 text-xs mt-0.5">Admin Panel</p>
            </div>
          </div>
          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden text-gray-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 py-4 overflow-y-auto sidebar-scroll space-y-5">
          {navGroups.map(group => (
            <div key={group.label}>
              <p className="text-gray-500 text-[10px] font-semibold uppercase tracking-widest px-3 mb-1.5">
                {group.label}
              </p>
              <div className="space-y-0.5">
                {group.items.map(item => (
                  <NavLink
                    key={item.to}
                    to={item.to}
                    onClick={() => setSidebarOpen(false)}
                    className={({ isActive }) =>
                      `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all group relative
                      ${isActive
                        ? 'bg-brand-600 text-white shadow-lg shadow-brand-900/30'
                        : 'text-gray-400 hover:bg-white/5 hover:text-white'
                      }`
                    }
                  >
                    <item.icon className="w-4.5 h-4.5 flex-shrink-0" />
                    <span className="flex-1">{item.label}</span>
                    {item.badge > 0 && (
                      <span className="bg-red-500 text-white text-xs rounded-full min-w-[18px] h-[18px] flex items-center justify-center px-1 font-bold">
                        {item.badge > 99 ? '99+' : item.badge}
                      </span>
                    )}
                  </NavLink>
                ))}
              </div>
            </div>
          ))}
        </nav>

        {/* Footer */}
        <div className="p-3 border-t border-white/10">
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 text-sm text-gray-400 hover:text-white transition-colors w-full px-3 py-2.5 rounded-xl hover:bg-red-500/10 hover:text-red-400"
          >
            <LogOut className="w-4 h-4" />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto min-h-screen">
        <Outlet />
      </main>
    </div>
  );
}
