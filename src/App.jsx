import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './hooks/useAuth';
import { CartProvider } from './context/CartContext';
import { WishlistProvider } from './context/WishlistContext';
import HomePage from './user/pages/HomePage';
import CategoryPage from './user/pages/CategoryPage';
import ProductDetailPage from './user/pages/ProductDetailPage';
import SearchResults from './pages/SearchResults';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import CartPage from './user/pages/CartPage';
import WishlistPage from './user/pages/WishlistPage';
import OrdersPage from './user/pages/OrdersPage';
import CheckoutPage from './user/pages/CheckoutPage';
import PaymentStatusPage from './user/pages/PaymentStatusPage';
import TrendingPage from './user/pages/TrendingPage';
import TopProductsPage from './user/pages/TopProductsPage';
import InterestProductsPage from './user/pages/InterestProductsPage';
import Referral from './pages/Referral';
import Terms from './pages/Terms';
import PrivacyPolicy from './pages/PrivacyPolicy';
import RefundPolicy from './pages/RefundPolicy';
import ReturnPolicy from './pages/ReturnPolicy';
import ShippingPolicy from './pages/ShippingPolicy';
import AboutPage from './pages/AboutPage';
import { Footer } from './components/Footer';
import ScrollToTop from './components/ScrollToTop';
import RequireAuth from './utils/RequireAuth';
import RequireRole from './utils/RequireRole';
// Admin scaffolding
import AdminLayout from './admin/components/AdminLayout';
import AdminDashboard from './admin/pages/Dashboard';
import AdminUsers from './admin/pages/Users';
import AdminProducts from './admin/pages/Products';
import AdminUploads from './admin/pages/Uploads';
import AdminOrders from './admin/pages/Orders';
import AdminReferrals from './admin/pages/Referrals';
import UserProfilePage from './user/pages/Profile';
import AdminProfilePage from './admin/pages/Profile';
import AuthPage from './pages/AuthPage';
import UserDashboard from './user/pages/UserDashboard';
// Import test utilities for development
import '../src/utils/createTestAdmin.js';

function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <WishlistProvider>
          <div className="min-h-screen flex flex-col">
            <ScrollToTop />
            <main className="flex-1">
              <Routes>
                {/* Public Landing Page */}
                <Route path="/" element={<HomePage />} />

                {/* Public Auth Routes */}
                <Route path="/login" element={<LoginPage />} />
                <Route path="/signup" element={<SignupPage />} />
                <Route path="/admin/login" element={<LoginPage isAdmin={true} />} />

                {/* Public Product Routes - No Auth Required */}
                <Route path="/categories/:category" element={<CategoryPage />} />
                <Route path="/products/:productId" element={<ProductDetailPage />} />
                <Route path="/search" element={<SearchResults />} />
                <Route path="/trending" element={<TrendingPage />} />
                <Route path="/top-products" element={<TopProductsPage />} />
                <Route path="/interest-products" element={<InterestProductsPage />} />
                <Route path="/terms" element={<Terms />} />
                <Route path="/privacy-policy" element={<PrivacyPolicy />} />
                <Route path="/refund-policy" element={<RefundPolicy />} />
                <Route path="/return-policy" element={<ReturnPolicy />} />
                <Route path="/shipping-policy" element={<ShippingPolicy />} />
                <Route path="/about" element={<AboutPage />} />

                {/* Protected User Routes */}
                <Route element={<RequireAuth />}>
                  <Route path="/user" element={<UserDashboard />} />
                  <Route path="/dashboard" element={<UserDashboard />} />
                  <Route path="/cart" element={<CartPage />} />
                  <Route path="/wishlist" element={<WishlistPage />} />
                  <Route path="/referral" element={<Referral />} />
                  <Route path="/orders" element={<OrdersPage />} />
                  <Route path="/checkout" element={<CheckoutPage />} />
                  <Route path="/payment/status" element={<PaymentStatusPage />} />
                  <Route path="/profile" element={<UserProfilePage />} />
                </Route>

                {/* Protected Admin Routes - RequireRole handles both auth and role check */}
                <Route element={<RequireRole role="admin" />}>
                  <Route path="/admin" element={<AdminLayout />}>
                    <Route index element={<AdminDashboard />} />
                    <Route path="dashboard" element={<AdminDashboard />} />

                    <Route path="users" element={<AdminUsers />} />
                    <Route path="products" element={<AdminProducts />} />
                    <Route path="profile" element={<AdminProfilePage />} />
                    <Route path="uploads" element={<AdminUploads />} />
                    <Route path="orders" element={<AdminOrders />} />
                    <Route path="referrals" element={<AdminReferrals />} />
                  </Route>
                </Route>

                {/* Legacy redirects */}
                <Route path="/old-dashboard" element={<Navigate to="/user" replace />} />
              </Routes>
            </main>
            <Footer />
          </div>
        </WishlistProvider>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;
