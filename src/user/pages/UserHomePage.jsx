import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '../../components/Button';
import { InfiniteSlider } from '../../components/InfiniteSlider';
import { cn } from '../../lib/utils';
import { Menu, X, ShoppingBag, User, Heart, Search, Bell, MapPin, ChevronDown, Settings, LogOut } from 'lucide-react';
import ProgressiveBlur from '../../components/ProgressiveBlur';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';
import { useAuth } from '../../hooks/useAuth';
import FeaturedCategories from '../../components/FeaturedCategories';
import ProductRibbon from '../../components/ProductRibbon';
import { getFeaturedProducts, fetchProducts } from '../../data/products';
import { productsAPI } from '../../services/api';

const UserHomePage = () => {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [likedProducts, setLikedProducts] = useState([]);
  const [trendingProducts, setTrendingProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadProducts = async () => {
      try {
        setLoading(true);
        setError(null);
        console.log('🏠 Loading homepage products from backend...');

        // Try to load all products from backend first
        let allProducts = [];
        let featured = [];
        let topRated = [];
        let newest = [];

        try {
          // Load all products from backend
          const allProductsResponse = await productsAPI.getAll();
          if (allProductsResponse.data?.success) {
            allProducts = allProductsResponse.data.data || [];
            console.log('✅ Loaded', allProducts.length, 'products from backend');
          }
        } catch (err) {
          console.warn('⚠️ Failed to load all products from backend:', err.message);
        }

        // Load featured products from backend
        try {
          const featuredResponse = await productsAPI.getFeatured();
          if (featuredResponse.data?.success) {
            featured = featuredResponse.data.data || [];
            console.log('✅ Loaded', featured.length, 'featured products from backend');
          }
        } catch (err) {
          console.warn('⚠️ Failed to load featured products from backend:', err.message);
          // Fallback: get featured from all products
          featured = allProducts.filter(p => p.featured).slice(0, 6);
        }

        // Load top-rated products for "Inspired by Your Interest"
        try {
          const topRatedResponse = await productsAPI.getTopRated();
          if (topRatedResponse.data?.success) {
            topRated = topRatedResponse.data.data?.slice(0, 6) || [];
            console.log('✅ Loaded', topRated.length, 'top-rated products from backend');
          }
        } catch (err) {
          console.warn('⚠️ Failed to load top-rated products from backend:', err.message);
          // Fallback: sort by rating from all products
          topRated = allProducts
            .sort((a, b) => (b.rating || 0) - (a.rating || 0))
            .slice(0, 6);
        }

        // Load newest products for "Trending Now"
        try {
          const newestResponse = await productsAPI.getNewest();
          if (newestResponse.data?.success) {
            newest = newestResponse.data.data?.slice(0, 6) || [];
            console.log('✅ Loaded', newest.length, 'newest products from backend');
          }
        } catch (err) {
          console.warn('⚠️ Failed to load newest products from backend:', err.message);
          // Fallback: get most recent from all products
          newest = allProducts
            .sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0))
            .slice(0, 6);
        }

        // If we have no products from backend, fall back to local data
        if (allProducts.length === 0) {
          console.warn('⚠️ No products from backend, falling back to local data');
          const localFeatured = await getFeaturedProducts();
          const localProducts = await fetchProducts();

          setFeaturedProducts(localFeatured);
          setLikedProducts(localProducts.slice(0, 6));
          setTrendingProducts(localProducts.slice(2, 8));
        } else {
          // Use backend data
          setFeaturedProducts(featured.length > 0 ? featured : allProducts.slice(0, 6));
          setLikedProducts(topRated.length > 0 ? topRated : allProducts.slice(0, 6));
          setTrendingProducts(newest.length > 0 ? newest : allProducts.slice(2, 8));
        }

        console.log('✅ Homepage products loaded successfully');

      } catch (err) {
        console.error('❌ Error loading homepage products:', err);
        setError('Failed to load products. Please try again later.');

        // Last resort: try to load local fallback data
        try {
          const localFeatured = await getFeaturedProducts();
          const localProducts = await fetchProducts();
          setFeaturedProducts(localFeatured);
          setLikedProducts(localProducts.slice(0, 6));
          setTrendingProducts(localProducts.slice(2, 8));
          setError(null); // Clear error if fallback works
        } catch (fallbackErr) {
          console.error('❌ Even fallback data failed:', fallbackErr);
        }
      } finally {
        setLoading(false);
      }
    };

    loadProducts();
  }, []);

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Oops! Something went wrong</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <UserHeroHeader />

      <main className="mt-16">
        {/* Hero Banner Section */}
        <section className="bg-gradient-to-br from-blue-50 via-white to-indigo-50 min-h-screen">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            {/* Main Hero Content */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 py-12 sm:py-16 lg:py-20 min-h-[calc(80vh-4rem)]">
              {/* Left Content */}
              <div className="flex flex-col justify-center space-y-8 px-2 sm:px-4 lg:px-0">
                <div className="space-y-4 sm:space-y-6">
                  <div className="inline-flex items-center rounded-full bg-white border-2 border-[#FF4081] px-6 py-2.5 text-sm font-semibold text-[#FF4081] shadow-sm hover:shadow-md hover:bg-[#FF4081] hover:text-white transition-all duration-300 mt-2">
                    <span className="mr-2 text-base">🔥</span>
                    Big Fashion Sale - Up to 80% OFF
                  </div>

                  <div className="space-y-2 sm:space-y-4">
                    <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-7.5xl font-bold tracking-tight text-[#1a1a1a] leading-[1.1] font-sans">
                      <span className="block">Fashion That</span>
                      <span className="text-[#047BD2] bg-clip-text bg-gradient-to-r from-[#047BD2] to-[#00B4D8]">Makes You</span>
                    </h1>

                    <p className="text-base sm:text-lg md:text-xl text-[#4B5563] max-w-xl leading-relaxed font-sans font-light tracking-wide">
                      Discover premium fashion collections with exclusive designs and unbeatable prices.
                    </p>
                  </div>
                </div>

                {/* CTA Buttons */}
                <div className="flex flex-col sm:flex-row gap-4 sm:gap-6">
                  <Button asChild className="bg-[#047BD2] hover:bg-[#0369A1] text-white px-8 py-4 text-base sm:text-lg font-semibold rounded-lg shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300 font-body">
                    <Link to="/shop" className="flex items-center justify-center space-x-2">
                      <span>Shop Now</span>
                      <ShoppingBag className="h-5 w-5" />
                    </Link>
                  </Button>
                  <Button asChild variant="outline" className="border-2 border-[#FF4081] text-[#FF4081] hover:bg-[#FF4081] hover:text-white px-8 py-4 text-base sm:text-lg rounded-lg shadow-md hover:shadow-lg transform hover:-translate-y-1 transition-all duration-300 font-body">
                    <Link to="/categories" className="flex items-center justify-center space-x-2">
                      <span>Explore Categories</span>
                      <Search className="h-5 w-5" />
                    </Link>
                  </Button>
                </div>

                {/* Popular Searches */}
                <div className="flex flex-wrap items-center gap-3">
                  <span className="text-sm sm:text-base text-[#666666] font-medium font-body">Popular:</span>
                  {['Shirts', 'Jeans', 'Dresses', 'Shoes', 'Accessories'].map((item) => (
                    <Link
                      key={item}
                      to={`/search?q=${item.toLowerCase()}`}
                      className="text-sm sm:text-base text-[#047BD2] hover:text-[#0369A1] hover:bg-blue-50 px-3 py-1 rounded-full transition-all duration-200 font-medium font-body"
                    >
                      {item}
                    </Link>
                  ))}
                </div>

                {/* Trust Indicators */}
                <div className="flex flex-wrap items-center gap-6 text-sm text-[#666666] pt-4">
                  <div className="flex items-center space-x-2">
                    <div className="w-5 h-5 bg-green-100 rounded-full flex items-center justify-center">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    </div>
                    <span className="font-medium">10M+ Happy Customers</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-5 h-5 bg-blue-100 rounded-full flex items-center justify-center">
                      <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    </div>
                    <span className="font-medium">500+ Brands</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-5 h-5 bg-orange-100 rounded-full flex items-center justify-center">
                      <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                    </div>
                    <span className="font-medium">24/7 Support</span>
                  </div>
                </div>
              </div>

              {/* Right Image */}
              <div className="relative order-first lg:order-last">
                <div className="aspect-square lg:aspect-auto lg:h-full relative overflow-hidden rounded-2xl bg-gradient-to-br from-gray-100 to-gray-200 shadow-2xl">
                  <img
                    src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80"
                    alt="Fashion Collection"
                    className="h-full w-full object-cover hover:scale-105 transition-transform duration-700"
                  />

                  {/* Floating Offers */}
                  <div className="absolute top-4 sm:top-6 right-4 sm:right-6 bg-gradient-to-r from-[#FF4081] to-[#E91E63] text-white px-4 py-3 rounded-xl text-sm sm:text-base font-bold shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300">
                    50% OFF
                  </div>

                  <div className="absolute bottom-4 sm:bottom-6 left-4 sm:left-6 bg-white/95 backdrop-blur-md px-4 sm:px-6 py-3 sm:py-4 rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300">
                    <div className="text-xs sm:text-sm text-[#666666] font-medium">Starting from</div>
                    <div className="text-lg sm:text-xl font-bold text-[#1a1a1a]">₹299</div>
                  </div>

                  {/* Decorative Elements */}
                  <div className="absolute top-1/2 left-0 w-4 h-4 bg-[#047BD2] rounded-full opacity-70 animate-bounce" style={{ animationDelay: '0s' }}></div>
                  <div className="absolute top-1/3 right-0 w-3 h-3 bg-[#FF4081] rounded-full opacity-70 animate-bounce" style={{ animationDelay: '1s' }}></div>
                  <div className="absolute bottom-1/3 left-1/4 w-2 h-2 bg-[#10B981] rounded-full opacity-70 animate-bounce" style={{ animationDelay: '2s' }}></div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Reduced spacing between sections */}
      <div className="space-y-4 sm:space-y-6">
        <FeaturedCategories />

        <ProductRibbon
          products={featuredProducts}
          title="Top Products"
          showTitle={true}
          loading={loading}
        />

        <ProductRibbon
          products={likedProducts}
          title="Inspired by Your Interest"
          showTitle={true}
          loading={loading}
        />

        <ProductRibbon
          products={trendingProducts}
          title="Trending Now"
          showTitle={true}
          loading={loading}
        />
      </div>
    </div>
  );
};

const menuItems = [
  { name: 'Men', href: '/categories/mens-fashion' },
  { name: 'Women', href: '/categories/womens-fashion' },
  { name: 'Kids', href: '/categories/kids-fashion' },
  { name: 'Shoes', href: '/categories/footwear' },
  { name: 'Accessories', href: '/categories/accessories' },
  { name: 'Sports', href: '/categories/sports-active' },
];

const UserProfileDropdown = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/');
    setIsOpen(false);
  };

  return (
    <div className="relative z-50">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="group flex items-center space-x-3 px-3 py-2 rounded-full border border-transparent hover:border-gray-100 transition-all duration-300"
      >
        <div className="h-9 w-9 bg-black text-white rounded-full flex items-center justify-center shadow-md group-hover:scale-105 transition-transform duration-300">
          <span className="font-heading font-bold text-sm">
            {user?.firstName?.charAt(0) || user?.email?.charAt(0) || 'U'}
          </span>
        </div>
        <div className="text-left hidden sm:block">
          <p className="text-xs font-bold uppercase tracking-widest text-black group-hover:text-gray-600 transition-colors">
            {user?.firstName || 'My Account'}
          </p>
        </div>
        <ChevronDown
          className={cn(
            "h-4 w-4 text-gray-400 transition-transform duration-300 ease-out",
            isOpen ? 'rotate-180 text-black' : 'group-hover:text-black'
          )}
        />
      </button>

      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0, y: 8, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 8, scale: 0.96 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
              className="absolute right-0 mt-3 w-72 bg-white rounded-xl shadow-[0_4px_30px_rgba(0,0,0,0.1)] border border-gray-100 overflow-hidden z-[60]"
            >
              {/* User Info Header */}
              <div className="px-6 py-6 bg-gray-50 border-b border-gray-100">
                <div className="flex items-center space-x-4">
                  <div className="h-12 w-12 bg-gradient-to-br from-black to-gray-800 text-white rounded-full flex items-center justify-center text-lg font-bold shadow-sm">
                    {user?.firstName?.charAt(0).toUpperCase() || 'U'}
                  </div>
                  <div className="flex flex-col overflow-hidden">
                    <span className="text-sm font-bold text-black truncate">
                      {user?.firstName ? `${user.firstName} ${user.lastName || ''}` : 'Fashion Enthusiast'}
                    </span>
                    <span className="text-xs text-gray-500 truncate max-w-[160px]">{user?.email}</span>
                  </div>
                </div>
              </div>

              {/* Menu Items */}
              <div className="py-2">
                {[
                  { icon: Settings, label: 'Account Settings', path: '/profile' },
                  { icon: ShoppingBag, label: 'My Orders', path: '/cart' },
                  { icon: Heart, label: 'Wishlist', path: '/wishlist' }
                ].map((item, idx) => (
                  <Link
                    key={idx}
                    to={item.path}
                    onClick={() => setIsOpen(false)}
                    className="flex items-center space-x-3 px-6 py-3.5 text-sm font-medium text-gray-600 hover:text-black hover:bg-gray-50 transition-colors group"
                  >
                    <item.icon className="h-4 w-4 text-gray-400 group-hover:text-black transition-colors" />
                    <span>{item.label}</span>
                  </Link>
                ))}
              </div>

              {/* Logout */}
              <div className="border-t border-gray-100 p-2">
                <button
                  onClick={handleLogout}
                  className="flex items-center space-x-3 w-full px-4 py-3 rounded-lg text-sm font-bold text-red-500 hover:bg-red-50 transition-colors group"
                >
                  <LogOut className="h-4 w-4" />
                  <span>Sign Out</span>
                </button>
              </div>
            </motion.div>

            {/* Invisible Backdrop to close on click outside */}
            <div
              className="fixed inset-0 z-40 bg-transparent"
              onClick={() => setIsOpen(false)}
            />
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

const UserHeroHeader = () => {
  const [menuState, setMenuState] = useState(false);
  const { cart } = useCart();
  const { wishlistCount } = useWishlist();
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleMobileLogout = async () => {
    await logout();
    navigate('/');
    setMenuState(false);
  };

  return (
    <header className="fixed top-0 w-full z-50 bg-white border-b border-gray-200 shadow-sm">
      {/* Top Bar */}
      <div className="bg-[#047BD2] text-white text-xs py-1.5">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-1">
                <MapPin className="h-3 w-3" />
                <span className="font-body">Deliver to 400708</span>
              </div>
            </div>
            <div className="hidden md:flex items-center space-x-4 font-body">
              <span>Download App</span>
              <span>|</span>
              <span>Become a Seller</span>
              <span>|</span>
              <span>Customer Care</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Header */}
      <div className="bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="relative flex items-center justify-between h-16">
            {/* Left Section: Logo */}
            <div className="flex items-center">
              <Link to="/user" className="flex-shrink-0">
                <KuberFashionLogo />
              </Link>
            </div>

            {/* Center Section: Search Bar (Desktop) */}
            <div className="hidden lg:flex flex-1 items-center justify-center px-8 mr-25">
              <div className="w-full max-w-2xl ml-25">
                <div className="relative group">
                  <div className="flex">
                    <input
                      type="text"
                      placeholder="Search for products, brands and more"
                      className="w-full h-[42px] px-4 border border-gray-300 rounded-l-lg focus:outline-none focus:ring-1 focus:ring-[#047BD2] focus:border-[#047BD2] font-body text-[#1a1a1a] transition-all duration-200"
                    />
                    <Button className="h-[42px] bg-[#047BD2] hover:bg-[#0369A1] px-6 rounded-l-none rounded-r-lg group-hover:bg-[#0369A1] transition-all duration-200 hover:shadow-md">
                      <Search className="h-5 w-5" />
                    </Button>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Section: User Profile & Actions */}
            <div className="flex items-center space-x-6">
              {/* User Profile Dropdown */}
              <div className="hidden lg:block">
                <UserProfileDropdown />
              </div>

              {/* Wishlist */}
              <Link to="/wishlist" className="hidden sm:flex items-center space-x-1 hover:text-[#047BD2] transition-colors">
                <Heart className={`h-4 w-4 ${wishlistCount > 0 ? 'fill-current text-red-500' : ''}`} />
                <span>Wishlist</span>
                {wishlistCount > 0 && (
                  <span className="bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    {wishlistCount}
                  </span>
                )}
              </Link>

              {/* Cart */}
              <Link to="/cart" className="relative p-2 text-[#1a1a1a] hover:text-[#047BD2] transition-colors duration-200">
                <ShoppingBag className="h-6 w-6" />
                {cart.totalItems > 0 && (
                  <span className="absolute -top-1 -right-1 bg-[#FF4081] text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-medium font-body">
                    {cart.totalItems}
                  </span>
                )}
              </Link>

              {/* Mobile Menu Button */}
              <button
                onClick={() => setMenuState(!menuState)}
                className="lg:hidden p-2 text-[#1a1a1a] hover:text-[#047BD2] transition-colors duration-200"
              >
                {menuState ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </button>
            </div>
          </div>

          {/* Mobile Search */}
          <div className="lg:hidden pb-4">
            <div className="relative group">
              <div className="flex">
                <input
                  type="text"
                  placeholder="Search for products, brands and more"
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-[#047BD2] focus:border-[#047BD2] font-body text-[#1a1a1a] transition-all duration-200"
                />
                <Button className="bg-[#047BD2] hover:bg-[#0369A1] px-6 rounded-l-none rounded-r-lg group-hover:bg-[#0369A1] transition-all duration-200">
                  <Search className="h-5 w-5" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Categories Bar */}
      <div className="hidden lg:block bg-white border-t border-gray-100">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex items-center space-x-8 py-3">
            {menuItems.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className="text-sm font-medium text-[#1a1a1a] hover:text-[#047BD2] transition-colors duration-200 font-body relative group"
              >
                {item.name}
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-[#047BD2] transition-all duration-200 group-hover:w-full"></span>
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {menuState && (
        <div className="lg:hidden bg-white border-t border-gray-200 shadow-lg">
          <div className="px-4 py-4 space-y-4">
            {menuItems.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className="block text-[#1a1a1a] hover:text-[#047BD2] font-medium font-body py-2 transition-colors duration-200"
                onClick={() => setMenuState(false)}
              >
                {item.name}
              </Link>
            ))}
            <div className="border-t border-gray-200 pt-4">
              <div className="space-y-2">
                <Link
                  to="/profile"
                  className="block text-[#047BD2] hover:text-[#0369A1] font-medium font-body py-2 transition-colors duration-200"
                  onClick={() => setMenuState(false)}
                >
                  My Profile
                </Link>
                <button
                  onClick={handleMobileLogout}
                  className="block text-red-600 hover:text-red-700 font-medium font-body py-2 transition-colors duration-200 w-full text-left"
                >
                  Logout
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

const KuberFashionLogo = () => {
  return (
    <div className="flex items-center space-x-3">
      <div className="flex flex-col justify-center">
        <div className="text-xl font-bold text-[#047BD2] font-body leading-tight whitespace-nowrap">
          KuberFashion
        </div>
        <div className="text-xs text-[#666666] font-body -mt-0.5">Fashion Store</div>
      </div>
    </div>
  );
};

export default UserHomePage;
