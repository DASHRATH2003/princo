import React, { createContext, useContext, useReducer, useEffect } from 'react';

// Cart Context
const CartContext = createContext();

// Cart Actions
const CART_ACTIONS = {
  ADD_ITEM: 'ADD_ITEM',
  REMOVE_ITEM: 'REMOVE_ITEM',
  UPDATE_QUANTITY: 'UPDATE_QUANTITY',
  CLEAR_CART: 'CLEAR_CART',
  LOAD_CART: 'LOAD_CART',
  SHOW_NOTIFICATION: 'SHOW_NOTIFICATION',
  HIDE_NOTIFICATION: 'HIDE_NOTIFICATION'
}

// Cart Reducer
const cartReducer = (state, action) => {
  switch (action.type) {
    case CART_ACTIONS.ADD_ITEM: {
      const existingItem = state.items.find(item => item.id === action.payload.id);
      let newItems;
      
      if (existingItem) {
        newItems = state.items.map(item =>
          item.id === action.payload.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      } else {
        newItems = [...state.items, { ...action.payload, quantity: 1 }];
      }
      
      const totalItems = newItems.reduce((sum, item) => sum + item.quantity, 0);
      
      return {
        ...state,
        items: newItems,
        notification: {
          show: true,
          message: `${totalItems} cart`
        }
      };
    }
    
    case CART_ACTIONS.REMOVE_ITEM:
      return {
        ...state,
        items: state.items.filter(item => item.id !== action.payload)
      };
    
    case CART_ACTIONS.UPDATE_QUANTITY:
      return {
        ...state,
        items: state.items.map(item =>
          item.id === action.payload.id
            ? { ...item, quantity: action.payload.quantity }
            : item
        ).filter(item => item.quantity > 0)
      };
    
    case CART_ACTIONS.CLEAR_CART:
      return {
        ...state,
        items: []
      };
    
    case CART_ACTIONS.LOAD_CART:
      return {
        ...state,
        items: action.payload
      };
    
    case CART_ACTIONS.SHOW_NOTIFICATION:
      return {
        ...state,
        notification: {
          show: true,
          message: action.payload
        }
      };
    
    case CART_ACTIONS.HIDE_NOTIFICATION:
      return {
        ...state,
        notification: {
          show: false,
          message: ''
        }
      };
    
    default:
      return state;
  }
};

// Initial State
const initialState = {
  items: [],
  notification: {
    show: false,
    message: ''
  }
};

// Cart Provider Component
export const CartProvider = ({ children }) => {
  const [state, dispatch] = useReducer(cartReducer, initialState);

  // Load cart from localStorage on mount
  useEffect(() => {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
      try {
        const cartItems = JSON.parse(savedCart);
        // Filter out items without proper price values
        const validCartItems = cartItems.filter(item => 
          item && typeof item.price === 'number' && !isNaN(item.price) && item.price > 0
        );
        console.log('Loading cart from localStorage:', validCartItems);
        dispatch({ type: CART_ACTIONS.LOAD_CART, payload: validCartItems });
      } catch (error) {
        console.error('Error loading cart from localStorage:', error);
        // Clear corrupted cart data
        localStorage.removeItem('cart');
      }
    }
  }, []);

  // Save cart to localStorage whenever cart changes
  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(state.items));
  }, [state.items]);

  // Cart Actions
  const addToCart = (product) => {
    // Validate product has proper price
    if (!product || typeof product.price !== 'number' || isNaN(product.price) || product.price <= 0) {
      console.error('Invalid product price:', product);
      showNotification('Error: Invalid product price');
      return;
    }
    
    console.log('Adding to cart:', product);
    dispatch({ type: CART_ACTIONS.ADD_ITEM, payload: product });
    
    // Auto-hide notification after 3 seconds
    setTimeout(() => {
      dispatch({ type: CART_ACTIONS.HIDE_NOTIFICATION });
    }, 3000);
  };

  const removeFromCart = (productId) => {
    dispatch({ type: CART_ACTIONS.REMOVE_ITEM, payload: productId });
  };

  const updateQuantity = (productId, quantity) => {
    dispatch({ type: CART_ACTIONS.UPDATE_QUANTITY, payload: { id: productId, quantity } });
  };

  const clearCart = () => {
    dispatch({ type: CART_ACTIONS.CLEAR_CART });
    localStorage.removeItem('cart');
  };

  const clearCorruptedCart = () => {
    localStorage.removeItem('cart');
    dispatch({ type: CART_ACTIONS.CLEAR_CART });
    showNotification('Cart cleared successfully');
  };

  // Notification Actions
  const showNotification = (message) => {
    dispatch({ type: CART_ACTIONS.SHOW_NOTIFICATION, payload: message });
  };

  const hideNotification = () => {
    dispatch({ type: CART_ACTIONS.HIDE_NOTIFICATION });
  };

  // Cart Calculations
  const getCartTotal = () => {
    return state.items.reduce((total, item) => {
      const price = item.price || 0;
      const quantity = item.quantity || 0;
      return total + (price * quantity);
    }, 0);
  };

  const getCartItemsCount = () => {
    return state.items.reduce((count, item) => count + item.quantity, 0);
  };

  const getCartItem = (productId) => {
    return state.items.find(item => item.id === productId);
  };

  const value = {
    items: state.items,
    notification: state.notification,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    clearCorruptedCart,
    getCartTotal,
    getCartItemsCount,
    getCartItem,
    showNotification,
    hideNotification
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
};

// Custom Hook to use Cart Context
export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

export default CartContext;