import { useState } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { LayoutDashboard, Package, ShoppingCart, LogOut, Shield, Menu, X, IndianRupee, Users } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function AdminLayout() {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/admin');
  };

  const linkClass = ({ isActive }) =>
    `flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${isActive ? 'bg-accent-600 text-white shadow-md' : 'text-gray-300 hover:bg-gray-800 hover:text-white'}`;

  return (
    <div className="min-h-screen flex bg-gray-50">
      <button onClick={() => setSidebarOpen(true)} className="fixed top-4 left-4 z-50 lg:hidden bg-gray-900 text-white p-2.5 rounded-lg shadow-lg hover:bg-gray-800 transition-colors">
        <Menu className="w-5 h-5" />
      </button>

      {sidebarOpen && <div className="fixed inset-0 bg-black/50 z-40 lg:hidden" onClick={() => setSidebarOpen(false)} />}

      <aside className={`fixed lg:static inset-y-0 left-0 z-50 w-64 bg-gray-900 text-white flex flex-col flex-shrink-0 transition-transform duration-300 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}>
        <div className="flex items-center justify-between p-6 border-b border-gray-800">
          <div className="flex items-center gap-2">
            <Shield className="w-6 h-6 text-accent-400" />
            <h1 className="text-lg font-bold">S cube Admin</h1>
          </div>
          <button onClick={() => setSidebarOpen(false)} className="lg:hidden text-gray-400 hover:text-white transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>
        <nav className="flex-1 px-4 py-4 space-y-1">
          <NavLink to="/admin/dashboard" className={linkClass} onClick={() => setSidebarOpen(false)}>
            <LayoutDashboard className="w-5 h-5" /> Dashboard
          </NavLink>
          <NavLink to="/admin/products" className={linkClass} onClick={() => setSidebarOpen(false)}>
            <Package className="w-5 h-5" /> Products
          </NavLink>
          <NavLink to="/admin/orders" className={linkClass} onClick={() => setSidebarOpen(false)}>
            <ShoppingCart className="w-5 h-5" /> Orders
          </NavLink>
          <NavLink to="/admin/payments" className={linkClass} onClick={() => setSidebarOpen(false)}>
            <IndianRupee className="w-5 h-5" /> Payments
          </NavLink>
          <NavLink to="/admin/customers" className={linkClass} onClick={() => setSidebarOpen(false)}>
            <Users className="w-5 h-5" /> Customers
          </NavLink>
        </nav>
        <div className="p-4 border-t border-gray-800">
          <button onClick={handleLogout} className="flex items-center gap-2 text-sm text-gray-400 hover:text-white transition-colors w-full px-4 py-2 rounded-lg hover:bg-gray-800">
            <LogOut className="w-4 h-4" /> Logout
          </button>
        </div>
      </aside>

      <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto min-h-screen lg:ml-0 ml-0">
        <Outlet />
      </main>
    </div>
  );
}
