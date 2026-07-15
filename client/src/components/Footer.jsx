import { Link } from 'react-router-dom';
import { Phone, Mail, MapPin } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-green-900 text-gray-300 mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          <div className="animate-fade-in-up">
            <div className="flex items-center space-x-2 mb-4">
              <img src="/logo.png" alt="" className="h-8 w-8 object-contain" />
              <h3 className="text-xl font-bold text-white">S cube</h3>
            </div>
            <p className="text-sm text-gray-400 leading-relaxed">Premium vessel washing liquid for a cleaner, greener kitchen. Eco-friendly, effective, and affordable.</p>
            <div className="flex space-x-3 mt-4">
              <a href="https://wa.me/918825733129" target="_blank" rel="noopener noreferrer" className="w-9 h-9 bg-green-600 rounded-full flex items-center justify-center hover:bg-green-500 transition-colors" title="WhatsApp">
                <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
              </a>
              <a href="https://instagram.com/scubeofficial" target="_blank" rel="noopener noreferrer" className="w-9 h-9 bg-pink-600 rounded-full flex items-center justify-center hover:bg-pink-500 transition-colors" title="Instagram">
                <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>
              </a>
              <a href="mailto:info@scube.in" className="w-9 h-9 bg-gray-600 rounded-full flex items-center justify-center hover:bg-gray-500 transition-colors" title="Email">
                <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24"><path d="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/></svg>
              </a>
            </div>
          </div>

          <div className="animate-fade-in-up animate-delay-100">
            <h4 className="text-lg font-semibold text-white mb-4 flex items-center">
              <svg className="w-5 h-5 mr-2 text-highlight-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
              Quick Links
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li><Link to="/" className="text-gray-400 hover:text-highlight-400 transition-colors flex items-center"><span className="mr-2 text-highlight-500">›</span>Home</Link></li>
              <li><Link to="/about" className="text-gray-400 hover:text-highlight-400 transition-colors flex items-center"><span className="mr-2 text-highlight-500">›</span>About Us</Link></li>
              <li><Link to="/products" className="text-gray-400 hover:text-highlight-400 transition-colors flex items-center"><span className="mr-2 text-highlight-500">›</span>Products</Link></li>
              <li><Link to="/cart" className="text-gray-400 hover:text-highlight-400 transition-colors flex items-center"><span className="mr-2 text-highlight-500">›</span>Cart</Link></li>
              <li><Link to="/my-orders" className="text-gray-400 hover:text-highlight-400 transition-colors flex items-center"><span className="mr-2 text-highlight-500">›</span>My Orders</Link></li>
            </ul>
          </div>

          <div className="animate-fade-in-up animate-delay-200">
            <h4 className="text-lg font-semibold text-white mb-4 flex items-center">
              <Phone className="w-5 h-5 mr-2 text-highlight-400" />
              Contact
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li className="flex items-start">
                <Phone className="w-4 h-4 mr-2 mt-0.5 text-highlight-400 flex-shrink-0" />
                <span className="text-gray-400">+91 88257 33129</span>
              </li>
              <li className="flex items-start">
                <Mail className="w-4 h-4 mr-2 mt-0.5 text-highlight-400 flex-shrink-0" />
                <span className="text-gray-400">info@scube.in</span>
              </li>
              <li className="flex items-start">
                <MapPin className="w-4 h-4 mr-2 mt-0.5 text-highlight-400 flex-shrink-0" />
                <span className="text-gray-400">Pudukkottai</span>
              </li>
            </ul>
          </div>

          <div className="animate-fade-in-up animate-delay-300">
            <h4 className="text-lg font-semibold text-white mb-4 flex items-center">
              <svg className="w-5 h-5 mr-2 text-highlight-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
              Secure Shopping
            </h4>
            <p className="text-sm text-gray-400 leading-relaxed mb-4">100% secure checkout. Your payment details are protected. Multiple payment options available.</p>
            <div className="flex flex-wrap gap-2">
              <span className="px-3 py-1.5 bg-gray-800 rounded text-xs text-gray-400">UPI</span>
              <span className="px-3 py-1.5 bg-gray-800 rounded text-xs text-gray-400">Bank Transfer</span>
              <span className="px-3 py-1.5 bg-gray-800 rounded text-xs text-gray-400">WhatsApp</span>
              <span className="px-3 py-1.5 bg-gray-800 rounded text-xs text-gray-400">Instagram</span>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-10 pt-6 flex flex-col sm:flex-row justify-between items-center text-sm">
          <p className="text-gray-500">&copy; 2026 S cube. All rights reserved.</p>
          <div className="flex items-center space-x-4 mt-3 sm:mt-0">
            <Link to="/" className="text-gray-500 hover:text-gray-300 transition-colors">Home</Link>
            <span className="text-gray-700">|</span>
            <Link to="/about" className="text-gray-500 hover:text-gray-300 transition-colors">About</Link>
            <span className="text-gray-700">|</span>
            <Link to="/admin" className="text-gray-600 hover:text-gray-400 transition-colors text-xs">Admin</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
