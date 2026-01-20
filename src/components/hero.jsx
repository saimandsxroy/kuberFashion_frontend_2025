import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from './Button';
import { cn } from '../lib/utils';
import { Menu, X, ShoppingBag, User, Heart, Search, Bell, MapPin, ChevronDown, Settings, LogOut, MessageCircle, ArrowRight } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { useAuth } from '../hooks/useAuth';
import ProfileDropdown from './ProfileDropdown';

export function HeroSection() {
  const WHATSAPP_NUMBER = import.meta.env.VITE_WHATSAPP_NUMBER || '919179193970';
  const WHATSAPP_TEXT = encodeURIComponent(
    import.meta.env.VITE_WHATSAPP_DEFAULT_MESSAGE || 'Hi! I want to purchase some clothes from you shop.'
  );

  const images = [
    { src: '/src/assets/hero-4.jpg', alt: "Editorial Fashion 1" }, // Original
    { src: '/src/assets/hero-1.jpg', alt: "Editorial Fashion 2" },
    { src: '/src/assets/hero-2.jpg', alt: "Editorial Fashion 3" },
    { src: '/src/assets/hero-3.jpg', alt: "Editorial Fashion 4" },
  ];

  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % images.length);
    }, 4000); // Change image every 4 seconds
    return () => clearInterval(timer);
  }, [images.length]);

  return (
    <>
      <HeroHeader />
      <main className="relative bg-[#f8f9fa]">
        {/* Abstract Background Ethereal Glow */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none -z-10">
          <div className="absolute top-[-10%] right-[-5%] w-[60vw] h-[60vw] rounded-full bg-blue-100/40 blur-[100px] animate-pulse-slow" />
          <div className="absolute bottom-[-10%] left-[-10%] w-[50vw] h-[50vw] rounded-full bg-purple-50/40 blur-[100px] animate-pulse-slow" style={{ animationDelay: '1s' }} />
        </div>

        {/* Mobile Hero Section - Full Width Image with Overlay */}
        <section className="relative h-[85vh] lg:hidden w-full overflow-hidden mt-20">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentIndex}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.8 }}
              className="absolute inset-0 w-full h-full"
            >
              <img
                src={images[currentIndex].src}
                alt={images[currentIndex].alt}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-white/95 via-white/50 to-transparent" />
            </motion.div>
          </AnimatePresence>

          <div className="absolute inset-0 flex flex-col justify-end px-6 pb-20 z-10 pointer-events-none">
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="pointer-events-auto"
            >
              <div className="bg-black text-white px-4 py-1.5 rounded-full inline-block mb-4 text-xs font-bold uppercase tracking-widest shadow-lg">
                New Collection 2026
              </div>
              <h1 className="text-5xl font-black font-heading leading-[0.9] mb-4 drop-shadow-sm text-primary-950">
                Timeless
                <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-action-dark to-purple-900">
                  Aura.
                </span>
              </h1>
              <p className="text-gray-800 text-lg font-medium mb-6 max-w-xs leading-relaxed">
                Unlock Radiance. <br /><span className="text-2xl font-black text-black">50-80% OFF</span>
              </p>

              <Button asChild className="bg-black text-white hover:bg-gray-800 rounded-full px-8 py-6 text-sm font-bold uppercase tracking-widest shadow-xl transition-transform hover:scale-105 active:scale-95 text-center flex items-center gap-2 w-max">
                <Link to="/shop">
                  Shop Now <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
            </motion.div>
          </div>
        </section>

        {/* Desktop Hero Section */}
        <section className="hidden lg:flex relative min-h-[calc(100vh-4rem)] items-center pt-32 pb-12 overflow-hidden">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-24 items-center">

              {/* Left Content - Typography Focused */}
              <div className="flex flex-col space-y-8 max-w-2xl mx-auto lg:mx-0 text-center lg:text-left z-10">

                {/* Minimalist Badge */}
                <div className="animate-fade-in flex justify-center lg:justify-start">
                  <span className="inline-block py-1 px-3 rounded-full bg-white border border-gray-200 text-xs font-semibold tracking-[0.2em] text-gray-500 uppercase shadow-sm">
                    Collection 2026
                  </span>
                </div>

                {/* Heading */}
                <div className="space-y-6 animate-slide-up">
                  <h1 className="text-6xl sm:text-7xl lg:text-8xl xl:text-9xl font-heading font-black text-primary-950 leading-[0.9] tracking-tight">
                    Timeless
                    <br />
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-action-dark to-purple-900">
                      Aura.
                    </span>
                  </h1>

                  <p className="text-lg sm:text-xl text-gray-600 max-w-lg mx-auto lg:mx-0 font-light leading-relaxed">
                    Where elegance fulfills your every desire. Experience the new standard of luxury fashion.
                  </p>
                </div>

                {/* CTA Buttons - Refined */}
                <div className="flex flex-col sm:flex-row gap-5 justify-center lg:justify-start pt-6 animate-slide-up" style={{ animationDelay: '0.2s' }}>
                  <Button asChild className="group bg-black hover:bg-gray-800 text-white px-10 py-7 text-lg rounded-full shadow-2xl hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
                    <Link to="/shop" className="flex items-center justify-center space-x-3">
                      <span className="font-medium tracking-wide">Shop Now</span>
                      <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                    </Link>
                  </Button>
                  <Button asChild variant="ghost" className="group text-primary-900 px-8 py-7 text-lg hover:bg-transparent transition-all duration-300">
                    <Link to="/categories/mens-fashion" className="flex items-center justify-center space-x-2">
                      <div className="w-10 h-10 rounded-full border border-gray-300 flex items-center justify-center group-hover:border-black transition-colors">
                        <span className="block w-0 h-0 border-t-4 border-t-transparent border-l-[8px] border-l-black border-b-4 border-b-transparent ml-1"></span>
                      </div>
                      <span className="font-medium">Watch Film</span>
                    </Link>
                  </Button>
                </div>

                {/* Minimal Stats */}
                <div className="pt-12 flex items-center justify-center lg:justify-start gap-12 text-gray-400 animate-fade-in opacity-80" style={{ animationDelay: '0.4s' }}>
                  <div>
                    <p className="text-2xl font-bold text-gray-900 font-heading">500+</p>
                    <p className="text-xs uppercase tracking-widest mt-1">Designers</p>
                  </div>
                  <div className="w-px h-8 bg-gray-300"></div>
                  <div>
                    <p className="text-2xl font-bold text-gray-900 font-heading">Global</p>
                    <p className="text-xs uppercase tracking-widest mt-1">Shipping</p>
                  </div>
                </div>
              </div>

              {/* Right Image Composition - Editorial Style */}
              <div className="relative hidden lg:block h-[850px] w-full animate-fade-in" style={{ animationDelay: '0.3s' }}>
                <div className="absolute right-[-10%] top-[-5%] w-[110%] h-[105%]">
                  <motion.div className="relative w-full h-full">
                    <AnimatePresence mode="popLayout" >
                      <motion.img
                        key={currentIndex}
                        src={images[currentIndex].src}
                        alt={images[currentIndex].alt}
                        initial={{ opacity: 0, scale: 0.95, x: 20 }}
                        animate={{ opacity: 1, scale: 1, x: 0, zIndex: 1 }}
                        exit={{ opacity: 0, scale: 1.05, x: -20, zIndex: 0 }}
                        transition={{ duration: 0.8, ease: "easeInOut" }}
                        className="absolute inset-0 w-full h-full object-cover rounded-bl-[100px] shadow-2xl"
                      />
                    </AnimatePresence>
                  </motion.div>


                </div>
              </div>
            </div>
          </div>

          {/* WhatsApp Float */}
          {WHATSAPP_NUMBER && (
            <a
              href={`https://wa.me/${WHATSAPP_NUMBER}?text=${WHATSAPP_TEXT}`}
              target="_blank"
              rel="noopener noreferrer"
              className="fixed bottom-8 right-8 z-50 bg-black hover:bg-gray-800 text-white p-4 rounded-full shadow-2xl transition-all duration-300 hover:scale-110 group border border-gray-800"
              aria-label="Chat on WhatsApp"
            >
              <MessageCircle className="h-6 w-6" />
            </a>
          )}
        </section>
      </main>
    </>
  );
}

const menuItems = [
  { name: 'Men', href: '/categories/mens-fashion' },
  { name: 'Women', href: '/categories/womens-fashion' },
  { name: 'Kids', href: '/categories/kids-fashion' },
  { name: 'KVision', href: '/categories/kvision' },
  { name: 'Accessories', href: '/categories/accessories' },
  { name: 'Sports', href: '/categories/sports-active' },
];

export const HeroHeader = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const { cart } = useCart();
  const { wishlistCount } = useWishlist();
  const { isAuthenticated, loading } = useAuth();
  const navigate = useNavigate();

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchTerm.trim())}`);
      setSearchTerm('');
      setMobileMenuOpen(false);
    }
  };

  return (
    <header
      className={cn(
        "fixed top-0 w-full z-50 transition-all duration-500 border-b border-transparent",
        isScrolled
          ? "bg-white/90 backdrop-blur-md border-gray-100 py-3 shadow-sm"
          : "bg-transparent py-5"
      )}
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">

          {/* Logo - Text Based Premium */}
          <Link to="/" className="flex-shrink-0 group z-50">
            <div className="flex flex-col items-start">
              <span className="text-3xl font-heading font-black tracking-tighter text-black group-hover:opacity-70 transition-opacity uppercase leading-none">
                KuberFashion
              </span>
              <span className="text-[10px] uppercase tracking-[0.3em] text-gray-500 font-bold mt-0.5 ml-0.5">
                Premium Store
              </span>
            </div>
          </Link>

          {/* Desktop Navigation - Clean & Uppercase */}
          <nav className="hidden lg:flex items-center space-x-10">
            {menuItems.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className="text-xs font-bold uppercase tracking-[0.15em] text-gray-800 hover:text-black transition-all duration-300 relative group"
              >
                {item.name}
                <span className="absolute -bottom-2 left-0 w-0 h-[1px] bg-black transition-all duration-300 group-hover:w-full"></span>
              </Link>
            ))}
          </nav>

          {/* Right Icons - Minimalist & Thin */}
          <div className="flex items-center space-x-6">

            {/* Search Toggle (Desktop) - Minimalist Expandable */}
            <div className="hidden lg:block relative group">
              <form onSubmit={handleSearch} className="relative flex items-center">
                <input
                  type="text"
                  placeholder="SEARCH"
                  className="w-0 group-hover:w-32 focus:w-48 bg-transparent border-b border-transparent focus:border-black py-1 text-xs uppercase tracking-widest placeholder:text-gray-400 focus:outline-none transition-all duration-500 opacity-0 group-hover:opacity-100 focus:opacity-100 pr-0 group-hover:pr-2"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <button type="submit" className="text-gray-900 hover:text-black transition-colors">
                  <Search className="h-5 w-5" strokeWidth={1.5} />
                </button>
              </form>
            </div>

            <Link to="/wishlist" className="hidden sm:flex relative text-gray-900 hover:text-black transition-colors group">
              <Heart className="h-5 w-5 group-hover:fill-black/5 transition-all" strokeWidth={1.5} />
              {wishlistCount > 0 && <span className="absolute -top-1 -right-1 w-1.5 h-1.5 bg-red-500 rounded-full"></span>}
            </Link>

            <Link to="/cart" className="relative text-gray-900 hover:text-black transition-colors group">
              <ShoppingBag className="h-5 w-5 group-hover:fill-black/5 transition-all" strokeWidth={1.5} />
              {cart.totalItems > 0 && (
                <span className="absolute -top-2 -right-2 bg-black text-white text-[9px] font-bold h-4 w-4 flex items-center justify-center rounded-full">
                  {cart.totalItems}
                </span>
              )}
            </Link>

            {/* Auth / Profile */}
            {loading ? (
              <div className="w-8 h-8 rounded-full bg-gray-100 animate-pulse"></div>
            ) : isAuthenticated ? (
              <ProfileDropdown />
            ) : (
              <Link to="/login" className="hidden sm:flex" title="Login">
                <User className="h-5 w-5 text-gray-900 hover:text-black" strokeWidth={1.5} />
              </Link>
            )}

            {/* Mobile Menu Toggle */}
            <button
              className="lg:hidden p-1 text-black"
              onClick={() => setMobileMenuOpen(true)}
            >
              <Menu className="h-6 w-6" strokeWidth={1.5} />
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Drawer - Premium Overlay */}
      <div className={cn(
        "fixed inset-0 z-50 bg-black/40 backdrop-blur-sm transition-opacity duration-500 lg:hidden",
        mobileMenuOpen ? "opacity-100" : "opacity-0 pointer-events-none"
      )} onClick={() => setMobileMenuOpen(false)}>
        <div
          className={cn(
            "absolute right-0 top-0 h-full w-[85%] max-w-sm bg-white shadow-2xl transition-transform duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] transform",
            mobileMenuOpen ? "translate-x-0" : "translate-x-full"
          )}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex flex-col h-full bg-white">
            <div className="flex items-center justify-between p-6 border-b border-gray-100">
              <span className="text-xl font-heading font-black uppercase tracking-tight text-black">Menu</span>
              <button
                onClick={() => setMobileMenuOpen(false)}
                className="p-2 text-gray-500 hover:text-black transition-colors"
              >
                <X className="h-6 w-6" strokeWidth={1.5} />
              </button>
            </div>

            <div className="p-6 flex-1 overflow-y-auto">
              <form onSubmit={handleSearch} className="mb-10">
                <div className="relative border-b border-gray-200 focus-within:border-black transition-colors">
                  <input
                    type="text"
                    placeholder="WHAT ARE YOU LOOKING FOR?"
                    className="w-full py-3 bg-transparent border-none focus:ring-0 text-sm uppercase tracking-wider placeholder:text-gray-400"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                  <Search className="absolute right-0 top-3 h-5 w-5 text-gray-400" strokeWidth={1.5} />
                </div>
              </form>

              <nav className="flex flex-col space-y-6">
                {menuItems.map((item) => (
                  <Link
                    key={item.name}
                    to={item.href}
                    className="text-2xl font-light uppercase tracking-tight text-gray-900 hover:translate-x-2 transition-transform duration-300"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {item.name}
                  </Link>
                ))}
              </nav>
            </div>

            <div className="p-8 border-t border-gray-100 bg-gray-50">
              {!isAuthenticated && (
                <div className="grid gap-4">
                  <Button asChild className="w-full py-6 bg-black text-white hover:bg-gray-800 uppercase tracking-widest text-xs font-bold rounded-none">
                    <Link to="/login" onClick={() => setMobileMenuOpen(false)}>Log In</Link>
                  </Button>
                  <Button asChild variant="outline" className="w-full py-6 border-black text-black hover:bg-black hover:text-white uppercase tracking-widest text-xs font-bold rounded-none">
                    <Link to="/signup" onClick={() => setMobileMenuOpen(false)}>Sign Up</Link>
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default HeroSection;
