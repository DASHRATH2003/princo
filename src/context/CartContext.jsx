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
  HIDE_NOTIFICATION: 'HIDE_NOTIFICATION',
  TOGGLE_SELECT: 'TOGGLE_SELECT',
  SELECT_ALL: 'SELECT_ALL',
  DESELECT_ALL: 'DESELECT_ALL',
  SET_SELECTED: 'SET_SELECTED'
}

// Cart Reducer - FIXED VERSION
const cartReducer = (state, action) => {
  switch (action.type) {
    case CART_ACTIONS.ADD_ITEM: {
      // Prefer merging by variant uid if provided; fallback to product id
      const targetUid = action.payload.uid || action.payload.id;
      const existingItem = state.items.find(item => (item.uid || item.id) === targetUid);
      let newItems;

      if (existingItem) {
        newItems = state.items.map(item =>
          (item.uid || item.id) === targetUid
            ? { 
                ...item, 
                quantity: (item.quantity || 0) + (action.payload.quantity || 1),
                // Ensure color/size are preserved when updating existing item
                selectedColor: action.payload.selectedColor || item.selectedColor,
                selectedSize: action.payload.selectedSize || item.selectedSize
              }
            : item
        );
      } else {
        newItems = [...state.items, { 
          ...action.payload, 
          quantity: action.payload.quantity || 1,
          // Ensure new items have color/size
          selectedColor: action.payload.selectedColor || '',
          selectedSize: action.payload.selectedSize || ''
        }];
      }

      const totalItems = newItems.reduce((sum, item) => sum + (item.quantity || 0), 0);

      return {
        ...state,
        items: newItems,
        notification: {
          show: true,
          message: `${totalItems} items in cart`
        }
      };
    }
    
    case CART_ACTIONS.REMOVE_ITEM:
      return {
        ...state,
        items: state.items.filter(item => (item.uid || item.id) !== action.payload),
        selectedIds: (state.selectedIds || []).filter(id => id !== action.payload)
      };
    
    case CART_ACTIONS.UPDATE_QUANTITY: {
      // FIXED: Handle both uid and id properly
      const { id, uid, quantity } = action.payload;
      const targetId = uid || id;
      
      const updatedItems = state.items
        .map(item =>
          (item.uid || item.id) === targetId
            ? { ...item, quantity: Math.max(0, quantity) }
            : item
        )
        .filter(item => (item.quantity || 0) > 0);

      const updatedSelected = (state.selectedIds || []).filter(id =>
        updatedItems.some(i => (i.uid || i.id) === id)
      );

      return {
        ...state,
        items: updatedItems,
        selectedIds: updatedSelected
      };
    }
    
    case CART_ACTIONS.CLEAR_CART:
      return {
        ...state,
        items: [],
        selectedIds: []
      };
    
    case CART_ACTIONS.LOAD_CART:
      return {
        ...state,
        items: action.payload,
        selectedIds: []
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

    case CART_ACTIONS.SET_SELECTED: {
      const requested = Array.isArray(action.payload) ? action.payload : [];
      const validIds = requested.filter(id =>
        state.items.some(i => (i.uid || i.id) === id)
      );
      return {
        ...state,
        selectedIds: validIds
      };
    }

    case CART_ACTIONS.TOGGLE_SELECT: {
      const id = action.payload;
      const current = new Set(state.selectedIds || []);
      if (current.has(id)) {
        current.delete(id);
      } else {
        current.add(id);
      }
      return {
        ...state,
        selectedIds: Array.from(current)
      };
    }

    case CART_ACTIONS.SELECT_ALL: {
      const allIds = state.items.map(i => i.uid || i.id);
      return {
        ...state,
        selectedIds: allIds
      };
    }

    case CART_ACTIONS.DESELECT_ALL:
      return {
        ...state,
        selectedIds: []
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
  },
  selectedIds: []
};

// Cart Provider Component - FIXED VERSION
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

  // Cart Actions - FIXED VERSION
  const addToCart = (product) => {
    // Validate product has proper price
    if (!product || typeof product.price !== 'number' || isNaN(product.price) || product.price <= 0) {
      console.error('Invalid product price:', product);
      showNotification('Error: Invalid product price');
      return;
    }
    
    // Stock-aware clamp: respect product.stockQuantity minus already-in-cart count
    const baseId = product.id || product._id;
    const totalInCart = state.items
      .filter((it) => it.id === baseId)
      .reduce((sum, it) => sum + (Number(it.quantity) || 0), 0);
    const stock = Number(product.stockQuantity ?? Infinity);
    const desired = Number(product.quantity ?? 1);
    const remaining = isFinite(stock) ? Math.max(0, stock - totalInCart) : desired;
    const finalQty = isFinite(stock) ? Math.min(desired, remaining) : desired;

    if (isFinite(stock) && finalQty <= 0) {
      alert('This product is out of stock.');
      return;
    }

    console.log('Adding to cart (stock-aware):', { ...product, quantity: finalQty });
    dispatch({ type: CART_ACTIONS.ADD_ITEM, payload: { ...product, quantity: finalQty, stockQuantity: Number(product.stockQuantity ?? 0) } });
    
    // Auto-hide notification after 3 seconds
    setTimeout(() => {
      dispatch({ type: CART_ACTIONS.HIDE_NOTIFICATION });
    }, 3000);
  };

  const removeFromCart = (productId) => {
    dispatch({ type: CART_ACTIONS.REMOVE_ITEM, payload: productId });
  };

  const updateQuantity = (productId, quantity) => {
    // Locate item to compute remaining stock excluding its current quantity
    const idx = state.items.findIndex((it) => (it.uid || it.id) === productId);
    if (idx === -1) {
      // Fallback: dispatch as-is
      const payload = typeof productId === 'string' && productId.includes('::') 
        ? { uid: productId, quantity } 
        : { id: productId, quantity };
      dispatch({ type: CART_ACTIONS.UPDATE_QUANTITY, payload });
      return;
    }

    const item = state.items[idx];
    const baseId = item.id;
    const othersTotal = state.items
      .filter((it, j) => it.id === baseId && j !== idx)
      .reduce((sum, it) => sum + (Number(it.quantity) || 0), 0);
    const stock = Number(item.stockQuantity ?? Infinity);
    let requested = Number(quantity);
    if (isNaN(requested)) requested = 0;

    let finalQty = requested;
    if (isFinite(stock)) {
      const remaining = Math.max(0, stock - othersTotal);
      if (requested > remaining) {
        alert(`Only ${remaining} left in stock.`);
        finalQty = remaining;
      }
    }

    // FIXED: Pass both uid and id to handle both cases
    const payload = typeof productId === 'string' && productId.includes('::') 
      ? { uid: productId, quantity: finalQty } 
      : { id: productId, quantity: finalQty };
    
    dispatch({ type: CART_ACTIONS.UPDATE_QUANTITY, payload });
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
    return state.items.reduce((count, item) => count + (item.quantity || 0), 0);
  };

  // Selected calculations
  const getSelectedItemsCount = () => {
    const ids = new Set(state.selectedIds || []);
    return state.items.filter(i => ids.has(i.uid || i.id)).reduce((count, item) => count + (item.quantity || 0), 0);
  };

  const getSelectedTotal = () => {
    const ids = new Set(state.selectedIds || []);
    return state.items.reduce((total, item) => {
      const id = item.uid || item.id;
      if (ids.has(id)) {
        const price = item.price || 0;
        const quantity = item.quantity || 0;
        return total + (price * quantity);
      }
      return total;
    }, 0);
  };

  const getCartItem = (productId) => {
    return state.items.find(item => (item.uid || item.id) === productId);
  };

  // Selection helpers
  const isSelected = (productId) => (state.selectedIds || []).includes(productId);
  const toggleSelect = (productId) => dispatch({ type: CART_ACTIONS.TOGGLE_SELECT, payload: productId });
  const selectAll = () => dispatch({ type: CART_ACTIONS.SELECT_ALL });
  const deselectAll = () => dispatch({ type: CART_ACTIONS.DESELECT_ALL });
  const removeSelected = () => {
    (state.selectedIds || []).forEach(id => {
      dispatch({ type: CART_ACTIONS.REMOVE_ITEM, payload: id });
    });
  };

  // Directly set selected ids (useful for Buy Now)
  const setSelected = (ids) => {
    const list = Array.isArray(ids) ? ids : [];
    dispatch({ type: CART_ACTIONS.SET_SELECTED, payload: list });
  };

  const value = {
    items: state.items,
    notification: state.notification,
    selectedIds: state.selectedIds,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    clearCorruptedCart,
    getCartTotal,
    getSelectedTotal,
    getSelectedItemsCount,
    getCartItemsCount,
    getCartItem,
    isSelected,
    toggleSelect,
    selectAll,
    deselectAll,
    removeSelected,
    setSelected,
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