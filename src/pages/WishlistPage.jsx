import React, { useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Trash2, Heart } from 'lucide-react';
import { useWishlist } from '../context/WishlistContext';
import { useCart } from '../context/CartContext';
import { Button } from '../components/Button';
import ProductCard from '../components/ProductCard';
import { useNotification } from '../components/Notification';

const WishlistPage = () => {
  const navigate = useNavigate();
  const { wishlistItems, clearWishlist } = useWishlist();
  const { showNotification, NotificationComponent } = useNotification();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handleClearWishlist = () => {
    if (window.confirm('Are you sure you want to clear your entire wishlist?')) {
      clearWishlist();
      showNotification('success', 'Wishlist cleared successfully');
    }
  };

  // Helper to ensure product has an image property for ProductCard
  const prepareProduct = (product) => {
    if (!product.image && product.images && product.images.length > 0) {
      return { ...product, image: product.images[0] };
    }
    return product;
  };

  if (wishlistItems.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col justify-center items-center py-12 px-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center max-w-md mx-auto"
        >
          <div className="bg-white p-6 rounded-full inline-block shadow-premium mb-6">
            <Heart className="h-16 w-16 text-primary-300 fill-primary-50" />
          </div>
          <h2 className="text-3xl font-heading font-bold text-primary-900 mb-3">Your wishlist is empty</h2>
          <p className="text-primary-500 mb-8 text-lg font-light">Save items you love to your wishlist and shop them later.</p>
          <Button
            onClick={() => navigate('/')}
            className="bg-primary-900 hover:bg-black text-white px-8 py-4 rounded-full text-lg shadow-lg hover:shadow-xl transition-all duration-300"
          >
            Explore Collection
          </Button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-20 pb-12">
      <NotificationComponent />
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-md sticky top-0 z-30 border-b border-primary-100">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link
                to="/"
                className="flex items-center space-x-2 text-primary-600 hover:text-action transition-colors group"
              >
                <ArrowLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform" />
                <span className="font-medium hidden sm:inline">Back to Home</span>
                <span className="font-medium sm:hidden">Back</span>
              </Link>
              <div className="h-6 w-px bg-primary-200 mx-4" />
              <h1 className="text-xl font-heading font-bold text-primary-900">
                My Wishlist <span className="text-primary-400 font-normal text-base ml-2">({wishlistItems.length} items)</span>
              </h1>
            </div>

            {wishlistItems.length > 0 && (
              <Button
                onClick={handleClearWishlist}
                variant="ghost"
                className="text-red-500 hover:text-red-700 hover:bg-red-50"
              >
                <Trash2 className="h-4 w-4 mr-2" />
                <span>Clear All</span>
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Wishlist Items Grid */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 sm:gap-8">
          <AnimatePresence>
            {wishlistItems.map((product, index) => (
              <motion.div
                key={product.id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ delay: index * 0.05 }}
              >
                <ProductCard product={prepareProduct(product)} />
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default WishlistPage;
