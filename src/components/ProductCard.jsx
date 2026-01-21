import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ShoppingBag, Heart, Star } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import RequireAuth from './RequireAuth';
import { cn } from '../lib/utils';
import { useNotification } from './Notification';

const FALLBACK_IMAGE = import.meta.env.VITE_DEFAULT_PRODUCT_IMAGE || 'https://via.placeholder.com/600x600?text=No+Image';

const ProductCard = ({ product }) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const { addToCart } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();
  const { showNotification, NotificationComponent } = useNotification();

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product);
    showNotification('success', 'Added to Bag Successfully');
  };

  const handleWishlistToggle = (e) => {
    e.preventDefault();
    e.stopPropagation();
    const isAdding = !isInWishlist(product.id);
    toggleWishlist(product);
    showNotification(
      isAdding ? 'success' : 'info',
      isAdding ? 'Added to Wishlist' : 'Removed from Wishlist'
    );
  };

  // Format numbers for "1.2k" style
  const formatCount = (num) => {
    if (num >= 1000) return (num / 1000).toFixed(1) + 'k';
    return num;
  };

  return (
    <>
      <NotificationComponent />
      <div className="group flex flex-col h-full bg-white border border-transparent hover:border-gray-100/50 hover:shadow-[0_8px_30px_rgb(0,0,0,0.04)] transition-all duration-300 rounded-[4px]">

        {/* 1. Image Container */}
        <Link to={`/products/${product.id}`} className="block relative overflow-hidden bg-gray-50 aspect-[4/5]">

          {/* Main Image - Zoom Effect */}
          <img
            src={product.image || FALLBACK_IMAGE}
            alt={product.name}
            className={cn(
              "absolute inset-0 w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105",
              imageLoaded ? "opacity-100" : "opacity-0"
            )}
            onLoad={() => setImageLoaded(true)}
            loading="lazy"
          />



          {/* Floating Actions (Mobile: Always Visible / Desktop: On Hover) */}

          {/* Wishlist - Top Right */}
          <RequireAuth action="add to wishlist">
            <button
              onClick={handleWishlistToggle}
              className={cn(
                "absolute top-2 right-2 w-8 h-8 flex items-center justify-center rounded-full backdrop-blur-md shadow-sm transition-all duration-300 z-20",
                // Mobile: Always visible. Desktop: Visible only on hover
                "lg:opacity-0 lg:group-hover:opacity-100",
                isInWishlist(product.id) ? "bg-red-50 text-red-500" : "bg-white/90 text-gray-900 hover:bg-white"
              )}
            >
              <Heart className={cn("h-4 w-4", isInWishlist(product.id) && "fill-current")} />
            </button>
          </RequireAuth>

          {/* Mobile Only: Add to Cart (Bottom Right) */}
          <div className="lg:hidden">
            <RequireAuth action="add to cart">
              <button
                onClick={handleAddToCart}
                disabled={!product.inStock}
                className={cn(
                  "absolute bottom-2 right-2 w-9 h-9 flex items-center justify-center rounded-full shadow-lg transition-colors z-20",
                  product.inStock ? "bg-black text-white" : "bg-gray-200 text-gray-400"
                )}
              >
                <ShoppingBag className="h-4 w-4" />
              </button>
            </RequireAuth>
          </div>

          {/* Desktop Only: Slide Up "Add to Bag" (Full Width) */}
          <div className="hidden lg:flex absolute inset-x-0 bottom-0 top-auto bg-white/98 py-3 translate-y-full group-hover:translate-y-0 transition-transform duration-300 z-20 shadow-[0_-4px_15px_rgba(0,0,0,0.05)] items-center justify-center border-t border-gray-100">
            <RequireAuth action="add to cart">
              <button
                onClick={handleAddToCart}
                disabled={!product.inStock}
                className="flex items-center gap-2 px-6 py-1 w-full justify-center text-gray-900 hover:text-black transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-bold uppercase tracking-wider text-sm"
              >
                <ShoppingBag className="h-4 w-4" />
                <span>{product.inStock ? 'Add to Bag' : 'Sold Out'}</span>
              </button>
            </RequireAuth>
          </div>

        </Link>

        {/* 2. Content Area - Clean & Decongested Typography */}
        <div className="p-3 flex flex-col gap-1">

          {/* Brand - Matches Category 'Items' tag style (Uppercase, Tracking) */}
          <h3 className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-500 leading-tight truncate">
            {product.brand || ''}
          </h3>

          {/* Title - Clean & Readable */}
          <p className="text-[13px] font-medium text-gray-900 truncate leading-snug">
            {product.name}
          </p>

          {/* Pricing Row - Single Line, Clean */}
          <div className="mt-1 flex items-baseline gap-1.5 flex-wrap">

            {/* Current Price */}
            <span className="text-sm font-bold text-gray-900">
              Rs. {product.price.toLocaleString()}
            </span>

            {/* Original Price - Subtle */}
            {product.originalPrice > product.price && (
              <span className="text-[11px] text-gray-400 line-through decoration-gray-300">
                Rs. {product.originalPrice.toLocaleString()}
              </span>
            )}

            {/* Discount - Crisp Orange */}
            {product.discount > 0 && (
              <span className="text-[10px] font-bold text-orange-600 uppercase tracking-wide">
                ({product.discount}% OFF)
              </span>
            )}
          </div>
        </div>
      </div>

    </>
  );
};

export default ProductCard;