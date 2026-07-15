import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { LayoutDashboard, Package, ShoppingCart, LogOut, Shield } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function AdminLayout() {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/admin');
  };

  const linkClass = ({ isActive }) =>
    `flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${isActive ? 'bg-accent-600 text-white shadow-md' : 'text-gray-300 hover:bg-gray-800 hover:text-white'}`;

  return (
    <div className="min-h-screen flex">
      <aside className="w-64 bg-gray-900 text-white flex flex-col flex-shrink-0">
        <div className="p-6 border-b border-gray-800">
          <div className="flex items-center gap-2">
            <Shield className="w-6 h-6 text-accent-400" />
            <h1 className="text-lg font-bold">S cube Admin</h1>
          </div>
        </div>
        <nav className="flex-1 px-4 py-4 space-y-1">
          <NavLink to="/admin/dashboard" className={linkClass}>
            <LayoutDashboard className="w-5 h-5" />
            Dashboard
          </NavLink>
          <NavLink to="/admin/products" className={linkClass}>
            <Package className="w-5 h-5" />
            Products
          </NavLink>
          <NavLink to="/admin/orders" className={linkClass}>
            <ShoppingCart className="w-5 h-5" />
            Orders
          </NavLink>
        </nav>
        <div className="p-4 border-t border-gray-800">
          <button onClick={handleLogout} className="flex items-center gap-2 text-sm text-gray-400 hover:text-white transition-colors w-full px-4 py-2 rounded-lg hover:bg-gray-800">
            <LogOut className="w-4 h-4" />
            Logout
          </button>
        </div>
      </aside>
      <main className="flex-1 p-8 bg-gray-50 overflow-y-auto">
        <Outlet />
      </main>
    </div>
  );
}
