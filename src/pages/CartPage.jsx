import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Plus, Minus, Trash2, ShoppingBag } from 'lucide-react';
import { Button } from '../components/Button';
import { useCart } from '../context/CartContext';

const CartPage = () => {
  const { cart, updateQuantity, removeFromCart, clearCart } = useCart();
  const FALLBACK_IMAGE = import.meta.env.VITE_DEFAULT_PRODUCT_IMAGE || 'https://via.placeholder.com/200x200?text=No+Image';
  const navigate = useNavigate();
  const WHATSAPP_NUMBER = import.meta.env.VITE_WHATSAPP_NUMBER || '919179193970';
  const DEFAULT_MESSAGE = import.meta.env.VITE_WHATSAPP_ORDER_MESSAGE || 'Hello! I would like to place an order from KuberFashion.';

  const handleWhatsAppCheckout = () => {
    if (!WHATSAPP_NUMBER) {
      alert('WhatsApp number is not configured. Please set VITE_WHATSAPP_NUMBER in your .env file.');
      return;
    }

    const itemsLines = cart.items
      .map(
        (item) => `${item.name} x ${item.quantity} - ₹${(item.price * item.quantity).toFixed(2)}`
      )
      .join('\n');

    const subtotal = cart.totalAmount;
    const tax = cart.totalAmount * 0.08;
    const total = subtotal + tax;

    const message = `${DEFAULT_MESSAGE}\n\nItems:\n${itemsLines}\n\nSubtotal: ₹${subtotal.toFixed(2)}\nTax (8%): ₹${tax.toFixed(2)}\nTotal: ₹${total.toFixed(2)}\n\nShipping Address: `;

    const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
    window.open(url, '_blank');
  };

  const handleQuantityChange = (productId, newQuantity) => {
    updateQuantity(productId, newQuantity);
  };

  const handleRemoveItem = (productId) => {
    removeFromCart(productId);
  };

  if (cart.items.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col justify-center items-center py-12">
        <div className="text-center">
          <ShoppingBag className="h-24 w-24 text-gray-300 mx-auto mb-6" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Your cart is empty</h2>
          <p className="text-gray-600 mb-8">Looks like you haven't added any items to your cart yet.</p>
          <Button
            onClick={() => navigate('/')}
            className="bg-[#047BD2] hover:bg-[#0369A1] text-white px-8 py-3"
          >
            Continue Shopping
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button
                onClick={() => navigate('/')}
                variant="ghost"
                className="flex items-center space-x-2 text-[#047BD2] hover:text-[#0369A1]"
              >
                <ArrowLeft className="h-4 w-4" />
                <span>Continue Shopping</span>
              </Button>
              
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold text-[#1a1a1a]">
                  Shopping Cart
                </h1>
                <p className="text-gray-600 mt-1">{cart.totalItems} items in your cart</p>
              </div>
            </div>

            <Button
              onClick={clearCart}
              variant="outline"
              className="flex items-center space-x-2 text-red-600 border-red-600 hover:bg-red-50"
            >
              <Trash2 className="h-4 w-4" />
              <span>Clear Cart</span>
            </Button>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Cart Items */}
          <div className="flex-1">
            <div className="bg-white rounded-lg shadow-sm">
              <div className="p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-6">Cart Items</h2>
                
                <div className="space-y-6">
                  {cart.items.map((item) => (
                    <motion.div
                      key={item.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      className="flex items-center space-x-4 p-4 border border-gray-200 rounded-lg"
                    >
                      {/* Product Image */}
                      <div className="flex-shrink-0">
                        <img
                          src={item.image || FALLBACK_IMAGE}
                          alt={item.name}
                          className="h-20 w-20 object-cover rounded-lg"
                        />
                      </div>

                      {/* Product Info */}
                      <div className="flex-1 min-w-0">
                        <Link
                          to={`/products/${item.productId || item.id}`}
                          className="text-lg font-medium text-gray-900 hover:text-[#047BD2] transition-colors duration-200"
                        >
                          {item.name}
                        </Link>
                        <p className="text-sm text-gray-500 mt-1">{item.category}</p>
                        <p className="text-lg font-bold text-[#047BD2] mt-2">₹{item.price}</p>
                      </div>

                      {/* Quantity Controls */}
                      <div className="flex items-center space-x-3">
                        <Button
                          onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                          variant="outline"
                          size="sm"
                          className="h-8 w-8 p-0"
                        >
                          <Minus className="h-4 w-4" />
                        </Button>
                        
                        <span className="text-lg font-medium w-8 text-center">
                          {item.quantity}
                        </span>
                        
                        <Button
                          onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                          variant="outline"
                          size="sm"
                          className="h-8 w-8 p-0"
                        >
                          <Plus className="h-4 w-4" />
                        </Button>
                      </div>

                      {/* Remove Button */}
                      <Button
                        onClick={() => handleRemoveItem(item.id)}
                        variant="ghost"
                        size="sm"
                        className="text-red-600 hover:text-red-700 hover:bg-red-50"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:w-96">
            <div className="bg-white rounded-lg shadow-sm p-6 sticky top-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-6">Order Summary</h2>
              
              <div className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-gray-600">Subtotal ({cart.totalItems} items)</span>
                  <span className="font-medium">₹{cart.totalAmount.toFixed(2)}</span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-gray-600">Shipping</span>
                  <span className="font-medium text-green-600">Free</span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-gray-600">Tax</span>
                  <span className="font-medium">₹{(cart.totalAmount * 0.08).toFixed(2)}</span>
                </div>
                
                <div className="border-t pt-4">
                  <div className="flex justify-between">
                    <span className="text-lg font-semibold">Total</span>
                    <span className="text-lg font-bold text-[#047BD2]">
                      ₹{(cart.totalAmount * 1.08).toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>

              <div className="mt-6 space-y-3">
                <Button className="w-full bg-[#047BD2] hover:bg-[#0369A1] text-white py-3" onClick={handleWhatsAppCheckout}>
                  Proceed to Checkout
                </Button>
                
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => navigate('/')}
                >
                  Continue Shopping
                </Button>
              </div>

              {/* Security Badge */}
              <div className="mt-6 text-center">
                <div className="flex items-center justify-center space-x-2 text-sm text-gray-500">
                  <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                  </svg>
                  <span>Secure checkout</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartPage;
