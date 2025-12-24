import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { cartAPI } from '../services/api';
import { useAuth } from '../hooks/useAuth';

const CartContext = createContext();

const cartReducer = (state, action) => {
  switch (action.type) {
    case 'ADD_TO_CART':
      const matches = (it, p) => (p.productId ? it.productId === p.productId : it.id === p.id);
      const existingItem = state.items.find(item => matches(item, action.payload));
      if (existingItem) {
        return {
          ...state,
          items: state.items.map(item =>
            matches(item, action.payload)
              ? { ...item, quantity: item.quantity + 1 }
              : item
          ),
          totalItems: state.totalItems + 1,
          totalAmount: state.totalAmount + action.payload.price
        };
      } else {
        return {
          ...state,
          items: [
            ...state.items,
            {
              ...action.payload,
              quantity: 1,
              productId: action.payload.productId || action.payload.id,
            }
          ],
          totalItems: state.totalItems + 1,
          totalAmount: state.totalAmount + action.payload.price
        };
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
    if (isAuthenticated) {
      try {
        const res = await cartAPI.addItem(product.id, 1, null, null);
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
              quantity: cartItem.quantity,
            }
          });
        } else {
          // Fallback (should not happen)
          dispatch({ type: 'ADD_TO_CART', payload: product });
        }
      } catch (error) {
        console.error('Failed to add to cart:', error);
      }
    } else {
      dispatch({ type: 'ADD_TO_CART', payload: product });
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
