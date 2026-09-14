import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { CartProvider } from './context/CartContext';
import { AuthProvider } from './context/AuthContext';
import { CustomerAuthProvider } from './context/CustomerAuthContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ScrollToTop from './components/ScrollToTop';
import ScrollToTopButton from './components/ScrollToTopButton';
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
import TrackOrder from './pages/TrackOrder';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import AdminLogin from './admin/AdminLogin';
import AdminForgotPassword from './admin/AdminForgotPassword';
import AdminResetPassword from './admin/AdminResetPassword';
import AdminLayout from './admin/AdminLayout';
import AdminDashboard from './admin/AdminDashboard';
import AdminProducts from './admin/AdminProducts';
import AdminOrders from './admin/AdminOrders';
import AdminPayments from './admin/AdminPayments';
import AdminCustomers from './admin/AdminCustomers';
import AdminReports from './admin/AdminReports';
import AdminAnalytics from './admin/AdminAnalytics';
import AdminSettings from './admin/AdminSettings';
import AdminNotifications from './admin/AdminNotifications';
import AdminReviews from './admin/AdminReviews';
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
      <ScrollToTop />
      <AuthProvider>
        <CustomerAuthProvider>
          <CartProvider>
            <ScrollToTopButton />
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
              <Route path="/track-order" element={<CustomerLayout><TrackOrder /></CustomerLayout>} />
              <Route path="/track-order/:id" element={<CustomerLayout><TrackOrder /></CustomerLayout>} />
              <Route path="/forgot-password" element={<CustomerLayout><ForgotPassword /></CustomerLayout>} />
              <Route path="/reset-password/:token" element={<CustomerLayout><ResetPassword /></CustomerLayout>} />
              <Route path="/admin" element={<AdminLogin />} />
              <Route path="/admin/forgot-password" element={<AdminForgotPassword />} />
              <Route path="/admin/reset-password/:token" element={<AdminResetPassword />} />
              <Route element={<AdminRoute />}>
                <Route element={<AdminLayout />}>
                  <Route path="/admin/dashboard" element={<AdminDashboard />} />
                  <Route path="/admin/products" element={<AdminProducts />} />
                  <Route path="/admin/orders" element={<AdminOrders />} />
                  <Route path="/admin/payments" element={<AdminPayments />} />
                  <Route path="/admin/customers" element={<AdminCustomers />} />
                  <Route path="/admin/reports" element={<AdminReports />} />
                  <Route path="/admin/analytics" element={<AdminAnalytics />} />
                  <Route path="/admin/settings" element={<AdminSettings />} />
                  <Route path="/admin/notifications" element={<AdminNotifications />} />
                  <Route path="/admin/reviews" element={<AdminReviews />} />
                </Route>
              </Route>
            </Routes>
          </CartProvider>
        </CustomerAuthProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}
