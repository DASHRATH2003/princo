import React, { useState, useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { CartProvider } from './context/CartContext'
import { WishlistProvider } from './context/WishlistContext'
import { OrderProvider } from './context/OrderContext'
import Navbar from './components/Navbar'
import ScrollToTop from './components/ScrollToTop'
import ErrorBoundary from './components/ErrorBoundary'
import Footer from './components/Footer'
import CartNotification from './components/CartNotification'
import LoginModal from './components/LoginModal'
import Home from './Pages/Home'
import Printing from './Pages/Printing'
import Oldee from './Pages/Oldee'
import EMarket from './Pages/EMarket'
import LocalMarket from './Pages/LocalMarket'
import NewsToday from './Pages/NewsToday'
import AdminLogin from './Pages/AdminLogin'
import AdminDashboard from './Pages/AdminDashboard'
import UserLogin from './Pages/UserLogin'
import UserRegister from './Pages/UserRegister'
import Cart from './Pages/Cart'
import Checkout from './Pages/Checkout'
import OrderSuccess from './Pages/OrderSuccess'
import TermsOfService from './Pages/TermsOfService'
import PrivacyPolicy from './Pages/PrivacyPolicy'
import CookiePolicy from './Pages/CookiePolicy'
import ShippingPolicy from './Pages/ShippingPolicy'
import RefundPolicy from './Pages/RefundPolicy'
import FileDownloads from './Pages/FileDownloads'
import ProductDetail from './Pages/ProductDetail'
import Contact from './Pages/Contact'
import NotFound from './Pages/NotFound'
import SearchResults from './Pages/SearchResults'
import Wishlist from './Pages/Wishlist'
import ForgotPassword from './Pages/ForgotPassword.jsx'
import ResetPassword from './Pages/ResetPassword.jsx'
import OrderDetails from './components/OrderDetails';
import MyOrders from './Pages/MyOrders.jsx' // ✅ .jsx 
import SellerDashboard from './Pages/SellerDashboard.jsx';


import SellerLogin from './Pages/SellerLogin.jsx';
import SellerRegister from './Pages/SellerRegister.jsx';
import { getCurrentUser, getCurrentSeller } from './services/authService';

// Route guard component for seller pages to ensure fresh evaluation on navigation
const SellerRouteElement = () => {
  const seller = getCurrentSeller();
  if (!seller) return <SellerLogin />;
  if (seller.role !== 'seller') return <NotFound />;
  const status = String(seller.verificationStatus || 'pending').toLowerCase();
  if (status !== 'approved') {
    return <SellerRegister />;
  }
  return <SellerDashboard />;
};

const App = () => {
  const [showLoginModal, setShowLoginModal] = useState(false);

  useEffect(() => {
    // Check if user has visited before
    const hasVisited = localStorage.getItem('hasVisitedBefore');
    
    if (!hasVisited) {
      // Show modal after a short delay for better UX
      const timer = setTimeout(() => {
        setShowLoginModal(true);
        localStorage.setItem('hasVisitedBefore', 'true');
      }, 1000);
      
      return () => clearTimeout(timer);
    }
  }, []);

  const handleCloseModal = () => {
    setShowLoginModal(false);
  };

  return (
    <OrderProvider>
      <CartProvider>
        <WishlistProvider>
        <Router>
          <ScrollToTop />
          <Routes>
            {/* Admin routes without navbar/footer */}
            <Route path="/admin/login" element={<AdminLogin />} />
            <Route path="/admin/dashboard" element={<ErrorBoundary><AdminDashboard /></ErrorBoundary>} />
            
            {/* ✅ Seller routes WITHOUT navbar/footer */}
            <Route path="/seller/login" element={<SellerLogin />} />

            <Route path="/seller/register" element={<SellerRegister />} />
            <Route path="/seller" element={<SellerRouteElement />} />
            <Route path="/seller/dashboard" element={<SellerRouteElement />} />

            {/* Password reset routes at top-level to ensure matching in production */}
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/reset-password" element={<ResetPassword />} />
            
            

            {/* Regular routes with navbar/footer */}
            <Route path="/*" element={
              <ErrorBoundary>
                <div className="min-h-screen bg-white flex flex-col">
                  <Navbar />
                  <CartNotification />
                  <LoginModal isOpen={showLoginModal} onClose={handleCloseModal} />
                  <main className="flex-1">
                    <Routes>
                      <Route path="/" element={<Home />} />
                      <Route path="/wishlist" element={<Wishlist />} />
                      <Route path="/printing" element={<Printing />} />
                      <Route path="/oldee" element={<Oldee />} />
                      <Route path="/e-market" element={<EMarket />} />
                      <Route path="/local-market" element={<LocalMarket />} />
                      <Route path="/forgot-password" element={<ForgotPassword />} />
                      <Route path="/reset-password" element={<ResetPassword />} />
                      <Route path="/news-today" element={<NewsToday />} />
                      <Route path="/login" element={<UserLogin />} />
                      <Route path="/register" element={<UserRegister />} />
                      <Route path="/cart" element={<Cart />} />
                      <Route path="/checkout" element={<Checkout />} />
                      <Route path="/order-success" element={<OrderSuccess />} />
                      <Route path="/my-orders" element={<MyOrders />} /> 
                      <Route path="/terms-of-service" element={<TermsOfService />} />
                      <Route path="/privacy-policy" element={<PrivacyPolicy />} />
                      <Route path="/cookie-policy" element={<CookiePolicy />} />
                      <Route path="/shipping-policy" element={<ShippingPolicy />} />
                      <Route path="/refund-policy" element={<RefundPolicy />} />
                      <Route path="/file-downloads" element={<FileDownloads />} />
                      <Route path="/contact" element={<Contact />} />
                      <Route path="/product/:productId" element={<ProductDetail />} />

                      <Route path="/search" element={<SearchResults />} />
                      <Route path="*" element={<NotFound />} />
                      <Route path="/orderDetails/:orderId" element={<OrderDetails />} />
                      
                    </Routes>
                  </main>
                  <Footer />
                </div>
              </ErrorBoundary>
            } />
          </Routes>
        </Router>
        </WishlistProvider>
      </CartProvider>
    </OrderProvider>
  )
}

export default App