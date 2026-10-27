import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Plus, Minus, Trash2, ShoppingBag, ShieldCheck, ArrowRight } from 'lucide-react';
import { Button } from '../components/Button';
import { useCart } from '../context/CartContext';
import { cn } from '../lib/utils';
import { useNotification } from '../components/Notification';

const CartPage = () => {
  const { cart, updateQuantity, removeFromCart, clearCart } = useCart();
  const { showNotification, NotificationComponent } = useNotification();
  const FALLBACK_IMAGE = import.meta.env.VITE_DEFAULT_PRODUCT_IMAGE || 'https://via.placeholder.com/200x200?text=No+Image';
  const navigate = useNavigate();

  const handleQuantityChange = (productId, newQuantity) => {
    if (newQuantity < 1) return;
    updateQuantity(productId, newQuantity);
  };

  const handleRemoveItem = (productId) => {
    removeFromCart(productId);
    showNotification('info', 'Item removed from cart');
  };

  const handleClearCart = () => {
    if (window.confirm('Are you sure you want to clear your cart?')) {
      clearCart();
      showNotification('success', 'Cart cleared successfully');
    }
  };

  if (cart.items.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col justify-center items-center py-12 px-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center max-w-md mx-auto"
        >
          <div className="bg-white p-6 rounded-full inline-block shadow-premium mb-6">
            <ShoppingBag className="h-16 w-16 text-primary-300" />
          </div>
          <h2 className="text-3xl font-heading font-bold text-primary-900 mb-3">Your cart is empty</h2>
          <p className="text-primary-500 mb-8 text-lg font-light">Looks like you haven't discovered our premium collection yet.</p>
          <Button
            onClick={() => navigate('/')}
            className="bg-primary-900 hover:bg-black text-white px-8 py-4 rounded-full text-lg shadow-lg hover:shadow-xl transition-all duration-300"
          >
            Start Shopping
          </Button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-20 pb-12">
      <NotificationComponent />
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-md sticky top-0 z-30 border-b border-primary-100 hidden lg:block">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link
                to="/"
                className="flex items-center space-x-2 text-primary-600 hover:text-action transition-colors group"
              >
                <ArrowLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform" />
                <span className="font-medium">Continue Shopping</span>
              </Link>
              <div className="h-6 w-px bg-primary-200 mx-4" />
              <h1 className="text-xl font-heading font-bold text-primary-900">
                Shopping Cart <span className="text-primary-400 font-normal text-base ml-2">({cart.totalItems} items)</span>
              </h1>
            </div>

            <Button
              onClick={handleClearCart}
              variant="ghost"
              className="text-red-500 hover:text-red-700 hover:bg-red-50"
            >
              <Trash2 className="h-4 w-4 mr-2" />
              <span>Clear Cart</span>
            </Button>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
        <div className="flex flex-col lg:flex-row gap-8 lg:gap-12">
          {/* Cart Items List */}
          <div className="flex-1 space-y-6">
            <div className="lg:hidden flex justify-between items-center mb-4">
              <h1 className="text-2xl font-heading font-bold text-primary-900">Cart ({cart.totalItems})</h1>
              <Button onClick={handleClearCart} variant="ghost" className="text-red-500 text-sm p-0 h-auto hover:bg-transparent">Clear</Button>
            </div>

            <AnimatePresence mode='popLayout'>
              {cart.items.map((item) => (
                <motion.div
                  key={item.id}
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, x: -100 }}
                  className="group bg-white rounded-2xl p-4 sm:p-6 shadow-sm border border-transparent hover:border-primary-100 hover:shadow-md transition-all duration-300 relative overflow-hidden"
                >
                  <div className="flex gap-4 sm:gap-6">
                    {/* Product Image */}
                    <div className="flex-shrink-0 w-24 h-24 sm:w-32 sm:h-32 bg-gray-100 rounded-xl overflow-hidden aspect-square">
                      <img
                        src={item.image || FALLBACK_IMAGE}
                        alt={item.name}
                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                      />
                    </div>

                    {/* Content */}
                    <div className="flex-1 flex flex-col justify-between min-w-0">
                      <div>
                        <div className="flex justify-between items-start gap-4">
                          <div>
                            <p className="text-xs text-primary-500 font-medium uppercase tracking-wider mb-1">{item.brand || 'Category'}</p>
                            <Link
                              to={`/products/${item.productId || item.id}`}
                              className="text-base sm:text-lg font-bold text-primary-900 hover:text-action transition-colors line-clamp-2"
                            >
                              {item.name}
                            </Link>
                          </div>
                          <button
                            onClick={() => handleRemoveItem(item.id)}
                            className="text-primary-400 hover:text-red-500 transition-colors p-1"
                            aria-label="Remove item"
                          >
                            <Trash2 className="h-5 w-5" />
                          </button>
                        </div>
                        <div className="flex items-center gap-2 mt-1 flex-wrap">
                          <span className="text-sm text-primary-500">{item.category}</span>
                          {item.selectedSize && (
                            <span className="text-xs bg-gray-100 text-gray-800 font-semibold px-2 py-0.5 rounded border border-gray-200">
                              Size: {item.selectedSize}
                            </span>
                          )}
                          {item.selectedColor && (
                            <span className="text-xs bg-gray-100 text-gray-800 font-semibold px-2 py-0.5 rounded border border-gray-200">
                              Color: {item.selectedColor}
                            </span>
                          )}
                        </div>
                      </div>

                      <div className="flex items-end justify-between mt-4">
                        {/* Quantity */}
                        <div className="flex items-center bg-gray-50 rounded-lg p-1 border border-gray-200">
                          <button
                            onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                            className="p-1 hover:bg-white rounded-md text-primary-600 transition-shadow disabled:opacity-50"
                            disabled={item.quantity <= 1}
                          >
                            <Minus className="h-4 w-4" />
                          </button>
                          <span className="w-8 text-center font-medium text-primary-900 text-sm">{item.quantity}</span>
                          <button
                            onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                            className="p-1 hover:bg-white rounded-md text-primary-600 transition-shadow"
                          >
                            <Plus className="h-4 w-4" />
                          </button>
                        </div>

                        {/* Price */}
                        <div className="text-right">
                          <p className="text-lg sm:text-xl font-bold text-primary-900">₹{(item.price * item.quantity).toLocaleString()}</p>
                          {item.quantity > 1 && (
                            <p className="text-xs text-primary-400">₹{item.price.toLocaleString()} each</p>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          {/* Order Summary */}
          <div className="lg:w-[400px]">
            <div className="bg-white rounded-2xl shadow-premium p-6 sm:p-8 sticky top-24 border border-primary-100">
              <h2 className="text-xl font-heading font-bold text-primary-900 mb-6 flex items-center gap-2">
                Order Summary
              </h2>

              {/* Tiered shipping calculation: <500: ₹79, 500-999: ₹59, >999: ₹49 */}
              {(() => {
                const subtotal = cart.totalAmount;
                const shipping = subtotal > 999 ? 49 : (subtotal >= 500 ? 59 : 79);
                const total = subtotal + shipping;
                return (
                  <div className="space-y-4">
                    <div className="flex justify-between text-primary-600">
                      <span>Subtotal</span>
                      <span className="font-medium text-primary-900">₹{subtotal.toLocaleString()}</span>
                    </div>

                    <div className="flex justify-between items-center text-primary-600">
                      <span>Shipping</span>
                      <span className="font-medium text-primary-900">₹{shipping}</span>
                    </div>

                    {/* Shipping tier info */}
                    <div className="text-xs text-primary-400 bg-gray-50 p-2 rounded">
                      {subtotal > 999 ? '🎉 Best rate! ₹49 shipping on orders >₹999' :
                        subtotal >= 500 ? '💡 Add ₹' + Math.ceil(1000 - subtotal) + ' more for ₹49 shipping' :
                          '💡 Add ₹' + Math.ceil(500 - subtotal) + ' more for ₹59 shipping'}
                    </div>

                    <div className="border-t border-dashed border-primary-200 my-4 pt-4">
                      <div className="flex justify-between items-baseline">
                        <span className="text-lg font-bold text-primary-900">Total</span>
                        <span className="text-2xl font-bold text-action">
                          ₹{Math.round(total).toLocaleString()}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })()}

              <div className="mt-8 space-y-4">
                <button
                  onClick={() => navigate('/checkout')}
                  className="w-full bg-black text-white py-4 rounded-xl text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center gap-2 hover:bg-gray-900"
                >
                  <span>Checkout Securely</span>
                  <ArrowRight className="h-5 w-5" />
                </button>

                <div className="flex items-center justify-center gap-2 text-xs text-primary-400 bg-gray-50 py-2 rounded-lg">
                  <ShieldCheck className="h-4 w-4 text-green-500" />
                  <span>SSL Encrypted Payment</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Sticky Checkout Bar */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 lg:hidden z-50 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)]">
        <div className="flex items-center justify-between gap-4 max-w-7xl mx-auto">
          <div>
            <p className="text-xs text-gray-500">Total</p>
            <p className="text-xl font-bold text-primary-900">₹{(cart.totalAmount * 1.08).toLocaleString()}</p>
          </div>
          <Button
            onClick={() => navigate('/checkout')}
            className="bg-primary-900 text-white px-8 py-3 rounded-xl font-semibold shadow-lg"
          >
            Checkout
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CartPage;
