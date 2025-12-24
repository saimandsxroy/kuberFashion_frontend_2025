import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Heart, ShoppingCart, Star, Minus, Plus, Truck, Shield, RotateCcw } from 'lucide-react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Button } from './Button';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { useAuth } from '../hooks/useAuth';
import RequireAuth from './RequireAuth';

const Product = ({ product, onBack }) => {
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedSize, setSelectedSize] = useState('');
  const [selectedColor, setSelectedColor] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  
  const { addToCart } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();
  const { isAuthenticated } = useAuth();

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Product not found</h2>
          <p className="text-gray-600">The product you're looking for doesn't exist.</p>
        </div>
      </div>
    );
  }

  const handleQuantityChange = (change) => {
    setQuantity(Math.max(1, quantity + change));
  };

  const handleAddToCart = async () => {
    if (!selectedSize && product.sizes?.length > 0) {
      toast.error('Please select a size');
      return;
    }
    if (!selectedColor && product.colors?.length > 0) {
      toast.error('Please select a color');
      return;
    }
    
    setIsAddingToCart(true);
    try {
      const productWithOptions = {
        ...product,
        selectedSize,
        selectedColor,
        quantity
      };
      
      await addToCart(productWithOptions);
      toast.success(`${product.name} added to cart successfully!`);
      
      console.log('✅ Added to cart:', {
        product: product.name,
        size: selectedSize,
        color: selectedColor,
        quantity
      });
    } catch (error) {
      console.error('❌ Failed to add to cart:', error);
      toast.error('Failed to add to cart. Please try again.');
    } finally {
      setIsAddingToCart(false);
    }
  };

  const handleWishlistToggle = async () => {
    try {
      await toggleWishlist(product);
      const isNowInWishlist = isInWishlist(product.id);
      toast.success(
        isNowInWishlist 
          ? `${product.name} added to wishlist!` 
          : `${product.name} removed from wishlist!`
      );
    } catch (error) {
      console.error('❌ Failed to toggle wishlist:', error);
      toast.error('Failed to update wishlist. Please try again.');
    }
  };

  const renderStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    for (let i = 0; i < fullStars; i++) {
      stars.push(
        <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
      );
    }

    if (hasHalfStar) {
      stars.push(
        <div key="half" className="relative">
          <Star className="h-4 w-4 text-gray-300" />
          <div className="absolute inset-0 overflow-hidden w-1/2">
            <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
          </div>
        </div>
      );
    }

    const remainingStars = 5 - Math.ceil(rating);
    for (let i = 0; i < remainingStars; i++) {
      stars.push(
        <Star key={`empty-${i}`} className="h-4 w-4 text-gray-300" />
      );
    }

    return stars;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Back Button */}
      <div className="bg-white shadow-sm">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-4">
          <Button
            onClick={onBack}
            variant="ghost"
            className="flex items-center space-x-2 text-[#047BD2] hover:text-[#0369A1]"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Back to Products</span>
          </Button>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
          {/* Product Images */}
          <div className="space-y-4">
            {/* Main Image */}
            <motion.div
              key={selectedImage}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
              className="aspect-square overflow-hidden rounded-2xl bg-gray-100"
            >
              <img
                src={product.images?.[selectedImage] || product.image}
                alt={product.name}
                className="h-full w-full object-cover"
              />
            </motion.div>

            {/* Thumbnail Images */}
            {product.images && product.images.length > 1 && (
              <div className="flex space-x-4 overflow-x-auto">
                {product.images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={`flex-shrink-0 aspect-square w-20 sm:w-24 rounded-lg overflow-hidden border-2 transition-colors ${
                      selectedImage === index ? 'border-[#047BD2]' : 'border-gray-200'
                    }`}
                  >
                    <img
                      src={image}
                      alt={`${product.name} ${index + 1}`}
                      className="h-full w-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Details */}
          <div className="space-y-6">
            {/* Product Name and Rating */}
            <div>
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-[#1a1a1a] mb-4">
                {product.name}
              </h1>
              
              <div className="flex items-center space-x-4 mb-4">
                <div className="flex items-center space-x-1">
                  {renderStars(product.rating)}
                </div>
                <span className="text-sm text-gray-600">
                  {product.rating} ({product.reviews} reviews)
                </span>
              </div>
            </div>

            {/* Price */}
            <div className="flex items-center space-x-4">
              <span className="text-3xl font-bold text-[#1a1a1a]">
                ₹{product.price}
              </span>
              {product.originalPrice > product.price && (
                <>
                  <span className="text-xl text-gray-500 line-through">
                    ₹{product.originalPrice}
                  </span>
                  <span className="bg-[#FF4081] text-white px-3 py-1 rounded-full text-sm font-bold">
                    -{product.discount}%
                  </span>
                </>
              )}
            </div>

            {/* Description */}
            <div>
              <h3 className="text-lg font-semibold text-[#1a1a1a] mb-2">Description</h3>
              <p className="text-gray-600 leading-relaxed">{product.description}</p>
            </div>

            {/* Size Selection */}
            {product.sizes && product.sizes.length > 0 && (
              <div>
                <h3 className="text-lg font-semibold text-[#1a1a1a] mb-3">Size</h3>
                <div className="flex flex-wrap gap-3">
                  {product.sizes.map((size) => (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      className={`px-4 py-2 border rounded-lg font-medium transition-colors ${
                        selectedSize === size
                          ? 'border-[#047BD2] bg-[#047BD2] text-white'
                          : 'border-gray-300 text-gray-700 hover:border-[#047BD2]'
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Color Selection */}
            {product.colors && product.colors.length > 0 && (
              <div>
                <h3 className="text-lg font-semibold text-[#1a1a1a] mb-3">Color</h3>
                <div className="flex flex-wrap gap-3">
                  {product.colors.map((color) => (
                    <button
                      key={color}
                      onClick={() => setSelectedColor(color)}
                      className={`px-4 py-2 border rounded-lg font-medium transition-colors ${
                        selectedColor === color
                          ? 'border-[#047BD2] bg-[#047BD2] text-white'
                          : 'border-gray-300 text-gray-700 hover:border-[#047BD2]'
                      }`}
                    >
                      {color}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Quantity and Actions */}
            <div className="space-y-4">
              {/* Quantity Selector */}
              <div>
                <h3 className="text-lg font-semibold text-[#1a1a1a] mb-3">Quantity</h3>
                <div className="flex items-center space-x-4">
                  <div className="flex items-center border border-gray-300 rounded-lg">
                    <button
                      onClick={() => handleQuantityChange(-1)}
                      className="p-2 hover:bg-gray-100 transition-colors"
                    >
                      <Minus className="h-4 w-4" />
                    </button>
                    <span className="px-4 py-2 font-medium">{quantity}</span>
                    <button
                      onClick={() => handleQuantityChange(1)}
                      className="p-2 hover:bg-gray-100 transition-colors"
                    >
                      <Plus className="h-4 w-4" />
                    </button>
                  </div>
                  
                  <span className={`text-sm font-medium ${
                    product.inStock ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {product.inStock ? 'In Stock' : 'Out of Stock'}
                  </span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-4">
                <RequireAuth action="add to cart">
                  <Button
                    onClick={handleAddToCart}
                    disabled={!product.inStock || isAddingToCart}
                    className={`flex-1 flex items-center justify-center space-x-2 py-4 text-lg font-semibold rounded-lg transition-all duration-200 ${
                      product.inStock && !isAddingToCart
                        ? 'bg-[#047BD2] hover:bg-[#0369A1] text-white hover:shadow-lg'
                        : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    }`}
                  >
                    {isAddingToCart ? (
                      <>
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                        <span>Adding...</span>
                      </>
                    ) : (
                      <>
                        <ShoppingCart className="h-5 w-5" />
                        <span>{product.inStock ? 'Add to Cart' : 'Out of Stock'}</span>
                      </>
                    )}
                  </Button>
                </RequireAuth>

                <RequireAuth action="add to wishlist">
                  <Button
                    onClick={handleWishlistToggle}
                    variant="outline"
                    className={`px-6 py-4 border-2 rounded-lg transition-all duration-200 ${
                      isInWishlist(product.id)
                        ? 'border-[#FF4081] bg-[#FF4081] text-white'
                        : 'border-[#FF4081] text-[#FF4081] hover:bg-[#FF4081] hover:text-white'
                    }`}
                  >
                    <Heart className={`h-5 w-5 ${isInWishlist(product.id) ? 'fill-current' : ''}`} />
                  </Button>
                </RequireAuth>
              </div>
            </div>

            {/* Features */}
            <div className="border-t pt-6">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="flex items-center space-x-3 text-sm text-gray-600">
                  <Truck className="h-5 w-5 text-[#047BD2]" />
                  <span>Free Shipping</span>
                </div>
                <div className="flex items-center space-x-3 text-sm text-gray-600">
                  <RotateCcw className="h-5 w-5 text-[#047BD2]" />
                  <span>30-Day Returns</span>
                </div>
                <div className="flex items-center space-x-3 text-sm text-gray-600">
                  <Shield className="h-5 w-5 text-[#047BD2]" />
                  <span>2-Year Warranty</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Toast Container */}
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
    </div>
  );
};

export default Product;
