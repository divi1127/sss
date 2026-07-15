import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ShoppingCart } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useCustomerAuth } from '../context/CustomerAuthContext';

export default function Navbar() {
  const { itemCount } = useCart();
  const { isAuthenticated, user, logout } = useCustomerAuth();
  const [open, setOpen] = useState(false);
  const location = useLocation();

  const links = [
    { to: '/', label: 'Home' },
    { to: '/about', label: 'About' },
    { to: '/products', label: 'Products' },
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <Link to="/" className="flex items-center space-x-2">
            <img src="/logo.png" alt="S cube" className="h-10 w-10 object-contain" />
            <span className="text-xl font-bold text-accent-600">S cube</span>
          </Link>

          <div className="hidden md:flex items-center space-x-6">
            {links.map(l => (
              <Link key={l.to} to={l.to} className={`${isActive(l.to) ? 'text-accent-600 font-semibold' : 'text-gray-600 hover:text-accent-600'} transition-colors`}>{l.label}</Link>
            ))}
            <Link to="/cart" className={`relative text-gray-600 hover:text-accent-600 transition-colors ${isActive('/cart') ? 'text-accent-600 font-semibold' : ''}`}>
              <ShoppingCart className="w-5 h-5" />
              {itemCount > 0 && (
                <span className="absolute -top-2 -right-4 bg-brand-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center animate-bounce-slow">{itemCount}</span>
              )}
            </Link>
            {isAuthenticated ? (
              <div className="flex items-center space-x-3 border-l pl-4 border-gray-200">
                <Link to="/my-orders" className={`text-sm ${isActive('/my-orders') ? 'text-accent-600 font-semibold' : 'text-gray-600 hover:text-accent-600'} transition-colors`}>My Orders</Link>
                <span className="text-gray-400 text-sm">|</span>
                <span className="text-gray-500 text-sm truncate max-w-[100px]">{user?.name}</span>
                <button onClick={logout} className="text-red-500 hover:text-red-700 text-sm font-medium">Logout</button>
              </div>
            ) : (
              <div className="flex items-center space-x-3 border-l pl-4 border-gray-200">
                <Link to="/login" className="text-gray-600 hover:text-accent-600 transition-colors">Login</Link>
                <Link to="/register" className="bg-brand-600 text-white px-6 py-2.5 rounded-lg hover:bg-brand-700 transition-all text-sm font-bold shadow-lg hover:shadow-xl border border-brand-500">Register</Link>
              </div>
            )}
          </div>

          <button className="md:hidden text-gray-600 p-2" onClick={() => setOpen(!open)}>
            {open ? (
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
            ) : (
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" /></svg>
            )}
          </button>
        </div>
      </div>

      {open && (
        <div className="md:hidden bg-white border-t animate-slide-down">
          <div className="px-4 py-3 space-y-2">
            {links.map(l => (
              <Link key={l.to} to={l.to} onClick={() => setOpen(false)} className={`block px-3 py-2 rounded-lg ${isActive(l.to) ? 'bg-brand-50 text-accent-700 font-semibold' : 'text-gray-600 hover:bg-gray-50'}`}>{l.label}</Link>
            ))}
            <Link to="/cart" onClick={() => setOpen(false)} className={`block px-3 py-2 rounded-lg ${isActive('/cart') ? 'bg-brand-50 text-accent-700 font-semibold' : 'text-gray-600 hover:bg-gray-50'}`}>
              <ShoppingCart className="w-5 h-5 inline mr-1" />
              Cart {itemCount > 0 && `(${itemCount})`}
            </Link>
            <hr className="my-2" />
            {isAuthenticated ? (
              <>
                <Link to="/my-orders" onClick={() => setOpen(false)} className="block px-3 py-2 rounded-lg text-gray-600 hover:bg-gray-50">My Orders</Link>
                <button onClick={() => { logout(); setOpen(false); }} className="block w-full text-left px-3 py-2 rounded-lg text-red-500 hover:bg-red-50">Logout ({user?.name})</button>
              </>
            ) : (
              <>
                <Link to="/login" onClick={() => setOpen(false)} className="block px-3 py-2 rounded-lg text-gray-600 hover:bg-gray-50">Login</Link>
                <Link to="/register" onClick={() => setOpen(false)} className="block px-3 py-2 rounded-lg bg-brand-600 text-white text-center font-bold hover:bg-brand-600">Register</Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
