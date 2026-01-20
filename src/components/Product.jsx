import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Heart, ShoppingBag, Star, Minus, Plus, Truck, Shield, RotateCcw, ChevronDown, Share2, Ruler, ArrowRight } from 'lucide-react';
import { Button } from './Button';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { useNotification } from './Notification';
import RequireAuth from './RequireAuth';
import { cn } from '../lib/utils';
import { HeroHeader } from './hero';
import { Footer } from './Footer';

const Product = ({ product, onBack }) => {
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedSize, setSelectedSize] = useState('');
  const [selectedColor, setSelectedColor] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const [expandedSection, setExpandedSection] = useState('description');

  const { addToCart } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();
  const { showNotification, NotificationComponent } = useNotification();

  // Ensure we have an array of images. If product.images is empty, use product.image
  const images = product?.images?.length > 0 ? product.images : [product?.image];

  // Pre-select first options if available to reduce friction
  useEffect(() => {
    if (product) {
      if (product.sizes?.length > 0 && !selectedSize) setSelectedSize(product.sizes[0]);
      if (product.colors?.length > 0 && !selectedColor) setSelectedColor(product.colors[0]);
    }
  }, [product]);

  if (!product) return null;

  const handleQuantityChange = (change) => {
    setQuantity(Math.max(1, quantity + change));
  };

  const handleAddToCart = async () => {
    // Validation handled by pre-selection, but good to keep safe
    if (!selectedSize && product.sizes?.length > 0) {
      showNotification('error', 'Please select a size');
      return;
    }

    setIsAddingToCart(true);
    try {
      const productWithOptions = { ...product, selectedSize, selectedColor, quantity };
      await addToCart(productWithOptions);
      showNotification('success', `${product.name} added to bag`);
    } catch (error) {
      showNotification('error', 'Failed to add to cart');
    } finally {
      setIsAddingToCart(false);
    }
  };

  const AccordionItem = ({ id, title, content, icon: Icon }) => (
    <div className="border-b border-gray-200/60 overflow-hidden">
      <button
        onClick={() => setExpandedSection(expandedSection === id ? null : id)}
        className="w-full flex items-center justify-between py-5 text-left group transition-colors hover:bg-gray-50/50 px-2"
      >
        <span className="font-sans font-bold text-sm tracking-widest uppercase text-gray-900 group-hover:text-black transition-colors">
          {title}
        </span>
        <ChevronDown
          className={cn(
            "h-4 w-4 text-gray-400 transition-transform duration-300",
            expandedSection === id ? "rotate-180 text-black" : "group-hover:text-black"
          )}
        />
      </button>
      <AnimatePresence>
        {expandedSection === id && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.04, 0.62, 0.23, 0.98] }}
          >
            <p className="pb-6 px-2 text-gray-600 leading-relaxed font-light text-sm">
              {content}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );

  return (
    <div className="min-h-screen bg-white">
      <HeroHeader />

      <main className="pt-24 pb-20">

        {/* Breadcrumb - Minimal */}
        <div className="px-4 md:px-8 mb-8">
          <button
            onClick={onBack}
            className="group flex items-center text-xs font-bold uppercase tracking-widest text-gray-500 hover:text-black transition-colors"
          >
            <ArrowLeft className="w-3 h-3 mr-2 group-hover:-translate-x-1 transition-transform" />
            Back
          </button>
        </div>

        <div className="max-w-[1600px] mx-auto px-4 md:px-8">
          <div className="flex flex-col lg:flex-row gap-12 xl:gap-24">

            {/* LEFT: Sticky Gallery */}
            <div className="w-full lg:w-[58%]">
              <div className="lg:sticky lg:top-32 space-y-2">
                {/* Main Stage */}
                <div className="aspect-[3/4] lg:aspect-[4/5] w-full bg-gray-100 rounded-[2px] overflow-hidden relative group">
                  <motion.img
                    key={selectedImage}
                    src={images[selectedImage]}
                    initial={{ opacity: 0, scale: 1.05 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.7, ease: "easeOut" }}
                    className="w-full h-full object-cover transition-transform duration-[2s] ease-in-out group-hover:scale-105"
                    alt={product.name}
                  />

                  {/* Badges - Floating Minimal */}
                  <div className="absolute top-6 left-6 flex flex-col gap-3">
                    {product.discount > 0 && (
                      <div className="bg-orange-500 text-white px-3 py-1.5 text-[10px] font-bold uppercase tracking-widest backdrop-blur-md">
                        -{product.discount}% OFF
                      </div>
                    )}
                    {!product.inStock && (
                      <div className="bg-black text-white px-3 py-1.5 text-[10px] font-bold uppercase tracking-widest">
                        Sold Out
                      </div>
                    )}
                  </div>
                </div>

                {/* Thumbnails - Horizontal Scroll on Mobile, Grid on Desktop */}
                <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
                  {images.map((img, idx) => (
                    <button
                      key={idx}
                      onClick={() => setSelectedImage(idx)}
                      className={cn(
                        "relative flex-shrink-0 w-20 aspect-[3/4] overflow-hidden transition-all duration-300",
                        selectedImage === idx ? "opacity-100 ring-1 ring-black" : "opacity-50 hover:opacity-100"
                      )}
                    >
                      <img src={img} className="w-full h-full object-cover" alt="" />
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* RIGHT: Product Details */}
            <div className="w-full lg:w-[42%] flex flex-col pt-4 lg:pt-0">

              {/* Brand */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="mb-4"
              >
                <h2 className="text-xs font-bold uppercase tracking-[0.25em] text-gray-500 flex items-center gap-3">
                  {product.brand || 'KUBER FASHION'}
                  <span className="w-8 h-[1px] bg-gray-300"></span>
                </h2>
              </motion.div>

              {/* Title */}
              <motion.h1
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="text-4xl md:text-5xl lg:text-6xl font-black text-black leading-[0.9] tracking-tighter uppercase mb-6"
              >
                {product.name}
              </motion.h1>

              {/* Price & Rating */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="flex flex-wrap items-end justify-between gap-4 mb-8 pb-8 border-b border-gray-100"
              >
                <div className="flex items-baseline gap-3">
                  <span className="text-3xl font-light text-black tracking-tight">
                    ₹{product.price.toLocaleString()}
                  </span>
                  {product.originalPrice > product.price && (
                    <span className="text-lg text-gray-400 line-through font-light">
                      ₹{product.originalPrice.toLocaleString()}
                    </span>
                  )}
                </div>

                {product.rating > 0 && (
                  <div className="flex items-center gap-1.5 bg-gray-50 px-3 py-1.5 rounded-full">
                    <Star className="w-3.5 h-3.5 fill-black text-black" />
                    <span className="text-xs font-bold text-black">{product.rating}</span>
                    <span className="text-[10px] text-gray-400 font-medium">({product.reviews} Reviews)</span>
                  </div>
                )}
              </motion.div>

              {/* Description Short */}
              <p className="text-gray-600 leading-relaxed font-light mb-10 max-w-lg">
                {product.shortDescription || product.description?.substring(0, 150) + "..."}
              </p>

              {/* Selectors */}
              <div className="space-y-8 mb-10">

                {/* Colors */}
                {product.colors?.length > 0 && (
                  <div className="space-y-4">
                    <span className="text-xs font-bold uppercase tracking-widest text-black">Select Color</span>
                    <div className="flex flex-wrap gap-3">
                      {product.colors.map(color => (
                        <button
                          key={color}
                          onClick={() => setSelectedColor(color)}
                          className={cn(
                            "h-10 px-6 rounded-none text-xs font-bold uppercase tracking-wider border transition-all duration-300",
                            selectedColor === color
                              ? "bg-black text-white border-black"
                              : "bg-white text-gray-500 border-gray-200 hover:border-black hover:text-black"
                          )}
                        >
                          {color}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Sizes */}
                {product.sizes?.length > 0 && (
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-xs font-bold uppercase tracking-widest text-black">Select Size</span>
                      <button className="text-[10px] font-bold uppercase tracking-wider text-gray-400 hover:text-black underline transition-colors">
                        Size Guide
                      </button>
                    </div>
                    <div className="grid grid-cols-4 sm:grid-cols-6 gap-2">
                      {product.sizes.map(size => (
                        <button
                          key={size}
                          onClick={() => setSelectedSize(size)}
                          className={cn(
                            "h-12 flex items-center justify-center text-xs font-bold border transition-all duration-300",
                            selectedSize === size
                              ? "bg-black text-white border-black"
                              : "bg-white text-gray-900 border-gray-200 hover:border-black"
                          )}
                        >
                          {size}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Action Bar */}
              <div className="flex gap-4 mb-4">
                {/* Quantity */}
                <div className="h-14 w-32 border border-gray-200 flex items-center justify-between px-3 hover:border-black transition-colors">
                  <button onClick={() => handleQuantityChange(-1)} className="p-2 hover:text-gray-500 transition-colors"><Minus className="w-3 h-3" /></button>
                  <span className="font-bold text-sm">{quantity}</span>
                  <button onClick={() => handleQuantityChange(1)} className="p-2 hover:text-gray-500 transition-colors"><Plus className="w-3 h-3" /></button>
                </div>

                {/* Add to Cart Button - Massive Black */}
                <RequireAuth action="add to cart">
                  <button
                    onClick={handleAddToCart}
                    disabled={!product.inStock || isAddingToCart}
                    className={cn(
                      "flex-1 h-14 relative overflow-hidden rounded-full border border-black bg-black text-white text-sm font-bold uppercase tracking-widest transition-all duration-500 flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed group hover:shadow-2xl",
                    )}
                  >
                    {/* Slide Animation Background */}
                    <div className="absolute inset-0 bg-white translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-[cubic-bezier(0.19,1,0.22,1)]" />

                    {isAddingToCart ? (
                      <div className="relative z-10 w-5 h-5 border-2 border-white/30 border-t-white group-hover:border-black/30 group-hover:border-t-black rounded-full animate-spin" />
                    ) : (
                      <div className="relative z-10 flex items-center gap-3 group-hover:text-black transition-colors duration-500">
                        <span>{product.inStock ? 'Add to Bag' : 'Sold Out'}</span>
                        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
                      </div>
                    )}
                  </button>
                </RequireAuth>

                {/* Wishlist */}
                <RequireAuth action="add to wishlist">
                  <button
                    onClick={() => {
                      const isAdding = !isInWishlist(product.id);
                      toggleWishlist(product);
                      showNotification(
                        isAdding ? 'success' : 'info',
                        isAdding ? 'Added to Wishlist' : 'Removed from Wishlist'
                      );
                    }}
                    className={cn(
                      "h-14 w-14 flex items-center justify-center border transition-all duration-300 group",
                      isInWishlist(product.id) ? "border-red-500 text-red-500" : "border-gray-200 text-gray-900 hover:border-black"
                    )}
                  >
                    <Heart className={cn("w-5 h-5 transition-transform group-active:scale-90", isInWishlist(product.id) && "fill-current")} />
                  </button>
                </RequireAuth>
              </div>

              {/* Trust Badges */}
              <div className="grid grid-cols-2 gap-4 py-8 mb-4 border-b border-gray-100">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center">
                    <Truck className="w-4 h-4 text-gray-900" />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-[10px] font-bold uppercase tracking-wide">Free Shipping</span>
                    <span className="text-[10px] text-gray-500">On orders over ₹999</span>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center">
                    <RotateCcw className="w-4 h-4 text-gray-900" />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-[10px] font-bold uppercase tracking-wide">Easy Returns</span>
                    <span className="text-[10px] text-gray-500">14 Days policy</span>
                  </div>
                </div>
              </div>

              {/* Accordions Details */}
              <div className="mt-auto">
                <AccordionItem id="desc" title="Product Description" content={product.description} />
                <AccordionItem id="care" title="Material & Care" content="100% Premium Cotton. Machine wash gently. Do not bleach. Iron on low heat." />
                <AccordionItem id="ship" title="Shipping Information" content="Orders are typically processed within 1-2 business days. Standard shipping takes 3-5 business days." />
              </div>

            </div>
          </div>
        </div>
      </main>

      {/* Mobile Bottom Bar */}
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-white border-t border-gray-100 lg:hidden z-30">
        <RequireAuth action="add to cart">
          <button
            onClick={handleAddToCart}
            disabled={!product.inStock}
            className="w-full h-12 bg-black text-white text-xs font-bold uppercase tracking-widest rounded-none"
          >
            {product.inStock ? `Add to Bag - ₹${product.price}` : 'Sold Out'}
          </button>
        </RequireAuth>
      </div>

      <Footer />
      <NotificationComponent />
    </div>
  );
};

export default Product;
