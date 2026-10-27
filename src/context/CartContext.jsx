import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { cartAPI } from '../services/api';
import { useAuth } from '../hooks/useAuth';

const CartContext = createContext();

const cartReducer = (state, action) => {
  switch (action.type) {
    case 'ADD_TO_CART': {
      const p = action.payload;
      const pQty = p.quantity || 1;
      const matches = (it) => {
        const itPid = it.productId || it.id;
        const pPid = p.productId || p.id;
        const sameProduct = String(itPid) === String(pPid);
        const itSize = it.selectedSize || it.size || '';
        const pSize = p.selectedSize || p.size || '';
        const itColor = it.selectedColor || it.color || '';
        const pColor = p.selectedColor || p.color || '';
        return sameProduct && itSize === pSize && itColor === pColor;
      };

      const existingItem = state.items.find(matches);
      if (existingItem) {
        return {
          ...state,
          items: state.items.map(item =>
            matches(item)
              ? { ...item, quantity: item.quantity + pQty }
              : item
          ),
          totalItems: state.totalItems + pQty,
          totalAmount: state.totalAmount + (p.price * pQty)
        };
      } else {
        const newItem = {
          ...p,
          quantity: pQty,
          productId: p.productId || p.id,
          selectedSize: p.selectedSize || p.size || null,
          selectedColor: p.selectedColor || p.color || null,
        };
        return {
          ...state,
          items: [
            ...state.items,
            newItem
          ],
          totalItems: state.totalItems + pQty,
          totalAmount: state.totalAmount + (p.price * pQty)
        };
      }
    }

    case 'REMOVE_FROM_CART':
      const itemToRemove = state.items.find(item => item.id === action.payload);
      return {
        ...state,
        items: state.items.filter(item => item.id !== action.payload),
        totalItems: state.totalItems - itemToRemove.quantity,
        totalAmount: state.totalAmount - (itemToRemove.price * itemToRemove.quantity)
      };

    case 'UPDATE_QUANTITY':
      const item = state.items.find(item => item.id === action.payload.id);
      const quantityDiff = action.payload.quantity - item.quantity;
      
      return {
        ...state,
        items: state.items.map(item =>
          item.id === action.payload.id
            ? { ...item, quantity: action.payload.quantity }
            : item
        ),
        totalItems: state.totalItems + quantityDiff,
        totalAmount: state.totalAmount + (item.price * quantityDiff)
      };

    case 'CLEAR_CART':
      return {
        items: [],
        totalItems: 0,
        totalAmount: 0
      };

    case 'LOAD_CART':
      return action.payload;

    default:
      return state;
  }
};

const initialState = {
  items: [],
  totalItems: 0,
  totalAmount: 0
};

export const CartProvider = ({ children }) => {
  const [cart, dispatch] = useReducer(cartReducer, initialState);
  const { isAuthenticated } = useAuth();

  // Load cart from backend on mount if authenticated
  useEffect(() => {
    const loadCart = async () => {
      if (isAuthenticated) {
        try {
          const response = await cartAPI.getCart();
          if (response.data?.success) {
            const items = response.data.data || [];
            const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
            const totalAmount = items.reduce((sum, item) => {
              const price = item.price ?? (item.product?.price ?? 0);
              return sum + (price * item.quantity);
            }, 0);
            dispatch({ 
              type: 'LOAD_CART', 
              payload: { items, totalItems, totalAmount } 
            });
          }
        } catch (error) {
          console.error('Failed to load cart:', error);
          // Fallback to localStorage for guest users
          const savedCart = localStorage.getItem('kuberFashionCart');
          if (savedCart) {
            dispatch({ type: 'LOAD_CART', payload: JSON.parse(savedCart) });
          }
        }
      } else {
        // Load from localStorage for guest users
        const savedCart = localStorage.getItem('kuberFashionCart');
        if (savedCart) {
          dispatch({ type: 'LOAD_CART', payload: JSON.parse(savedCart) });
        }
      }
    };
    loadCart();
  }, [isAuthenticated]);

  // Save cart to localStorage for guest users
  useEffect(() => {
    if (!isAuthenticated) {
      localStorage.setItem('kuberFashionCart', JSON.stringify(cart));
    }
  }, [cart, isAuthenticated]);

  const addToCart = async (product) => {
    const qty = product.quantity || 1;
    const size = product.selectedSize || product.size || null;
    const color = product.selectedColor || product.color || null;
    const targetProductId = product.productId || product.id;

    if (isAuthenticated) {
      try {
        const res = await cartAPI.addItem(targetProductId, qty, size, color);
        const cartItem = res.data?.data;
        if (cartItem) {
          // Use backend DTO so id is the cart item ID (needed for update/remove)
          dispatch({
            type: 'ADD_TO_CART',
            payload: {
              id: cartItem.id,
              productId: cartItem.productId,
              name: cartItem.name,
              image: cartItem.image,
              price: cartItem.price,
              category: cartItem.category,
              quantity: cartItem.quantity || qty,
              selectedSize: cartItem.selectedSize || size,
              selectedColor: cartItem.selectedColor || color,
            }
          });
          return true;
        } else {
          dispatch({
            type: 'ADD_TO_CART',
            payload: {
              ...product,
              productId: targetProductId,
              quantity: qty,
              selectedSize: size,
              selectedColor: color,
            }
          });
          return true;
        }
      } catch (error) {
        console.error('Failed to add to cart:', error);
        throw error;
      }
    } else {
      const guestId = `${targetProductId}-${size || 'nosize'}-${color || 'nocolor'}`;
      dispatch({
        type: 'ADD_TO_CART',
        payload: {
          ...product,
          id: guestId,
          productId: targetProductId,
          quantity: qty,
          selectedSize: size,
          selectedColor: color,
        }
      });
      return true;
    }
  };

  const removeFromCart = async (productId) => {
    if (isAuthenticated) {
      try {
        await cartAPI.removeItem(productId);
        dispatch({ type: 'REMOVE_FROM_CART', payload: productId });
      } catch (error) {
        console.error('Failed to remove from cart:', error);
      }
    } else {
      dispatch({ type: 'REMOVE_FROM_CART', payload: productId });
    }
  };

  const updateQuantity = async (productId, quantity) => {
    if (quantity <= 0) {
      removeFromCart(productId);
    } else {
      if (isAuthenticated) {
        try {
          await cartAPI.updateItem(productId, quantity);
          dispatch({ type: 'UPDATE_QUANTITY', payload: { id: productId, quantity } });
        } catch (error) {
          console.error('Failed to update quantity:', error);
        }
      } else {
        dispatch({ type: 'UPDATE_QUANTITY', payload: { id: productId, quantity } });
      }
    }
  };

  const clearCart = async () => {
    if (isAuthenticated) {
      try {
        await cartAPI.clearCart();
        dispatch({ type: 'CLEAR_CART' });
      } catch (error) {
        console.error('Failed to clear cart:', error);
      }
    } else {
      dispatch({ type: 'CLEAR_CART' });
    }
  };

  const value = {
    cart,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
