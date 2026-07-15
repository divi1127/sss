import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { CartProvider } from './context/CartContext';
import { AuthProvider } from './context/AuthContext';
import { CustomerAuthProvider } from './context/CustomerAuthContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import About from './pages/About';
import Products from './pages/Products';
import ProductDetail from './pages/ProductDetail';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import OrderConfirmation from './pages/OrderConfirmation';
import Register from './pages/Register';
import Login from './pages/Login';
import MyOrders from './pages/MyOrders';
import AdminLogin from './admin/AdminLogin';
import AdminLayout from './admin/AdminLayout';
import AdminDashboard from './admin/AdminDashboard';
import AdminProducts from './admin/AdminProducts';
import AdminOrders from './admin/AdminOrders';
import AdminRoute from './components/AdminRoute';

function CustomerLayout({ children }) {
  return (
    <>
      <Navbar />
      <main className="min-h-screen">{children}</main>
      <Footer />
    </>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <CustomerAuthProvider>
          <CartProvider>
            <Routes>
              <Route path="/" element={<CustomerLayout><Home /></CustomerLayout>} />
              <Route path="/about" element={<CustomerLayout><About /></CustomerLayout>} />
              <Route path="/products" element={<CustomerLayout><Products /></CustomerLayout>} />
              <Route path="/products/:id" element={<CustomerLayout><ProductDetail /></CustomerLayout>} />
              <Route path="/cart" element={<CustomerLayout><Cart /></CustomerLayout>} />
              <Route path="/checkout" element={<CustomerLayout><Checkout /></CustomerLayout>} />
              <Route path="/order-confirmation/:id" element={<CustomerLayout><OrderConfirmation /></CustomerLayout>} />
              <Route path="/register" element={<CustomerLayout><Register /></CustomerLayout>} />
              <Route path="/login" element={<CustomerLayout><Login /></CustomerLayout>} />
              <Route path="/my-orders" element={<CustomerLayout><MyOrders /></CustomerLayout>} />
              <Route path="/admin" element={<AdminLogin />} />
              <Route element={<AdminRoute />}>
                <Route element={<AdminLayout />}>
                  <Route path="/admin/dashboard" element={<AdminDashboard />} />
                  <Route path="/admin/products" element={<AdminProducts />} />
                  <Route path="/admin/orders" element={<AdminOrders />} />
                </Route>
              </Route>
            </Routes>
          </CartProvider>
        </CustomerAuthProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}
