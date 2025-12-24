import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ShoppingCart, Star, Heart, Eye } from 'lucide-react';
import { Button } from './Button';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import RequireAuth from './RequireAuth';

const FALLBACK_IMAGE = import.meta.env.VITE_DEFAULT_PRODUCT_IMAGE || 'https://via.placeholder.com/600x600?text=No+Image';

const ProductCard = ({ product }) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const { addToCart } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product);
  };

  const handleWishlistToggle = (e) => {
    e.preventDefault();
    e.stopPropagation();
    toggleWishlist(product);
  };

  const renderStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    for (let i = 0; i < fullStars; i++) {
      stars.push(
        <Star key={i} className="h-3 w-3 fill-yellow-400 text-yellow-400" />
      );
    }

    if (hasHalfStar) {
      stars.push(
        <div key="half" className="relative">
          <Star className="h-3 w-3 text-gray-300" />
          <div className="absolute inset-0 overflow-hidden w-1/2">
            <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
          </div>
        </div>
      );
    }

    const remainingStars = 5 - Math.ceil(rating);
    for (let i = 0; i < remainingStars; i++) {
      stars.push(
        <Star key={`empty-${i}`} className="h-3 w-3 text-gray-300" />
      );
    }

    return stars;
  };

  return (
    <motion.div
      whileHover={{ y: -8 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className="group relative bg-white rounded-2xl shadow-md hover:shadow-2xl transition-all duration-300 overflow-hidden h-full flex flex-col"
    >
      <Link to={`/products/${product.id}`} className="block">
        {/* Image Container */}
        <div className="relative aspect-square overflow-hidden bg-gray-100">
          {/* Discount Badge */}
          {product.discount > 0 && (
            <div className="absolute top-3 left-3 z-10 bg-[#FF4081] text-white px-2 py-1 rounded-lg text-xs font-bold shadow-md">
              -{product.discount}%
            </div>
          )}

          {/* Wishlist Button */}
          <RequireAuth action="add to wishlist">
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={handleWishlistToggle}
              className={`absolute top-3 right-3 z-10 p-2 rounded-full shadow-md transition-all duration-200 ${
                isInWishlist(product.id) 
                  ? 'bg-[#FF4081] text-white' 
                  : 'bg-white/90 text-gray-600 hover:bg-white hover:text-[#FF4081]'
              }`}
            >
              <Heart className={`h-4 w-4 ${isInWishlist(product.id) ? 'fill-current' : ''}`} />
            </motion.button>
          </RequireAuth>

          {/* Product Image */}
          <div className="relative h-full w-full">
            {!imageLoaded && (
              <div className="absolute inset-0 bg-gray-200 animate-pulse" />
            )}
            <img
              src={product.image || FALLBACK_IMAGE}
              alt={product.name}
              className={`h-full w-full object-cover transition-all duration-500 group-hover:scale-110 ${
                imageLoaded ? 'opacity-100' : 'opacity-0'
              }`}
              onLoad={() => setImageLoaded(true)}
              loading="lazy"
            />
          </div>

          {/* Quick View Overlay */}
          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              whileHover={{ scale: 1, opacity: 1 }}
              className="bg-white/90 backdrop-blur-sm rounded-full p-3 shadow-lg"
            >
              <Eye className="h-5 w-5 text-[#047BD2]" />
            </motion.div>
          </div>
        </div>

        {/* Product Info */}
        <div className="p-3 sm:p-4 space-y-2 sm:space-y-3 flex-1 flex flex-col">
          {/* Product Name */}
          <h3 className="font-semibold text-[#1a1a1a] text-xs sm:text-sm line-clamp-2 group-hover:text-[#047BD2] transition-colors duration-200">
            {product.name}
          </h3>

          {/* Rating */}
          <div className="flex items-center space-x-1 sm:space-x-2">
            <div className="flex items-center space-x-0.5 sm:space-x-1">
              {renderStars(product.rating)}
            </div>
            <span className="text-xs text-gray-500">({product.reviews})</span>
          </div>

          {/* Price */}
          <div className="flex items-center space-x-1 sm:space-x-2">
            <span className="text-sm sm:text-lg font-bold text-[#1a1a1a]">
              ₹{product.price}
            </span>
            {product.originalPrice > product.price && (
              <span className="text-xs sm:text-sm text-gray-500 line-through">
                ₹{product.originalPrice}
              </span>
            )}
          </div>

          {/* Stock Status - Simplified for mobile */}
          <div className="flex items-center justify-between mt-auto">
            <span className={`text-xs font-medium ${
              product.inStock ? 'text-green-600' : 'text-red-600'
            }`}>
              {product.inStock ? 'In Stock' : 'Out of Stock'}
            </span>
            
            {/* Available Colors Indicator - Hidden on very small screens */}
            {product.colors && product.colors.length > 0 && (
              <div className="hidden sm:flex items-center space-x-1">
                <div className="flex space-x-1">
                  {product.colors.slice(0, 2).map((color, index) => (
                    <div
                      key={index}
                      className="w-3 h-3 rounded-full border border-gray-300"
                      style={{ 
                        backgroundColor: color.toLowerCase() === 'white' ? '#ffffff' :
                                       color.toLowerCase() === 'black' ? '#000000' :
                                       color.toLowerCase() === 'navy' ? '#1e3a8a' :
                                       color.toLowerCase() === 'gray' ? '#6b7280' :
                                       color.toLowerCase() === 'red' ? '#ef4444' :
                                       color.toLowerCase() === 'blue' ? '#3b82f6' :
                                       '#e5e7eb'
                      }}
                    />
                  ))}
                  {product.colors.length > 2 && (
                    <span className="text-xs text-gray-400">+{product.colors.length - 2}</span>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </Link>

      {/* Add to Cart Button */}
      <div className="p-3 sm:p-4 pt-0">
        <RequireAuth action="add to cart">
          <Button
            onClick={handleAddToCart}
            disabled={!product.inStock}
            className={`w-full flex items-center justify-center space-x-1 sm:space-x-2 py-2 sm:py-2.5 text-xs sm:text-sm font-semibold rounded-lg transition-all duration-200 ${
              product.inStock
                ? 'bg-[#047BD2] hover:bg-[#0369A1] text-white hover:shadow-lg transform hover:-translate-y-0.5'
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }`}
          >
            <ShoppingCart className="h-3 w-3 sm:h-4 sm:w-4" />
            <span className="hidden sm:inline">{product.inStock ? 'Add to Cart' : 'Out of Stock'}</span>
            <span className="sm:hidden">{product.inStock ? 'Add' : 'N/A'}</span>
          </Button>
        </RequireAuth>
      </div>
    </motion.div>
  );
};

export default ProductCard;