import React from 'react'
import { useCart } from '../context/CartContext'
import { useNavigate } from 'react-router-dom'
import { getCurrentUser } from '../services/authService'

const Cart = () => {
  // Map product category to its listing page route
  const getCategoryRoute = (product) => {
    if (!product) return '/e-market';
    
    const cat = String(product?.category || '').toLowerCase();
    const map = {
      'emart': '/e-market',
      'e-mart': '/e-market',
      'l-mart': '/e-market',
      'lmart': '/e-market',
      'localmarket': '/local-market',
      'local-market': '/local-market',
      'printing': '/printing',
      'print': '/printing',
      'news': '/news-today',
      'news-today': '/news-today',
    };
    return map[cat] || '/e-market';
  };

  // Get the most appropriate category route based on cart items
  const getCartCategoryRoute = () => {
    if (items.length === 0) return '/e-market';
    
    // Get the first item's category as the primary category
    const firstItem = items[0];
    return getCategoryRoute(firstItem);
  };
  const { items, removeFromCart, updateQuantity, clearCart, getCartTotal, getCartItemsCount, selectedIds, isSelected, toggleSelect, selectAll, deselectAll, getSelectedTotal, getSelectedItemsCount } = useCart()
  const navigate = useNavigate()

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="container-responsive">
          <div className="text-center">
            <div className="mx-auto h-24 w-24 text-gray-400">
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-2.5 5M7 13l2.5 5m6-5v6a2 2 0 11-4 0v-6m4 0V9a2 2 0 10-4 0v4.01" />
              </svg>
            </div>
            <h2 className="mt-6 text-3xl font-bold text-gray-900">Your cart is empty</h2>
            <p className="mt-2 text-lg text-gray-600">Start shopping to add items to your cart</p>
            <button
              onClick={() => navigate(getCartCategoryRoute())}
              className="mt-8 inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
            >
              Continue Shopping
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container-responsive">
        <div className="bg-white rounded-lg shadow-sm">
          <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
            <h1 className="text-2xl font-bold text-gray-900">Shopping Cart ({getCartItemsCount()} items)</h1>
            <label className="flex items-center gap-2 text-sm text-gray-700">
              <input
                type="checkbox"
                checked={items.length > 0 && selectedIds && selectedIds.length === items.length}
                onChange={(e) => (e.target.checked ? selectAll() : deselectAll())}
              />
              Select All
            </label>
          </div>
          
          <div className="p-6">
            <div className="space-y-6">
              {items.map((item) => (
                <div key={item.uid || item.id} className="flex items-center space-x-4 p-4 border border-gray-200 rounded-lg">
                  <input
                    type="checkbox"
                    className="w-4 h-4"
                    checked={isSelected(item.uid || item.id)}
                    onChange={() => toggleSelect(item.uid || item.id)}
                  />
                  <img
                    src={item.image || 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODAiIGhlaWdodD0iODAiIHZpZXdCb3g9IjAgMCA4MCA4MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjgwIiBoZWlnaHQ9IjgwIiBmaWxsPSIjRjNGNEY2Ii8+Cjx0ZXh0IHg9IjQwIiB5PSI0MCIgZm9udC1mYW1pbHk9IkFyaWFsIiBmb250LXNpemU9IjEwIiBmaWxsPSIjOUI5QjlCIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBkeT0iLjNlbSI+Tm8gSW1hZ2U8L3RleHQ+Cjwvc3ZnPgo='}
                    alt={item.name}
                    className="w-20 h-20 object-cover rounded-md"
                    onError={(e) => {
                      console.log('Cart image failed to load:', item.name, 'Image URL:', item.image);
                      e.target.src = 'https://via.placeholder.com/80?text=No+Image';
                    }}
                  />
                  
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900">{item.name}</h3>
                    <p className="text-gray-600">{item.description}</p>
                    {(item.selectedColor || item.selectedSize) && (
                      <p className="text-sm text-gray-700">
                        {item.selectedColor && (<span>Color: <span className="font-medium">{item.selectedColor}</span></span>)}
                        {item.selectedColor && item.selectedSize && <span className="mx-2">•</span>}
                        {item.selectedSize && (<span>Size: <span className="font-medium">{item.selectedSize}</span></span>)}
                      </p>
                    )}
                    <p className="text-lg font-bold text-purple-600">₹{item.price.toLocaleString()}</p>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => {
                        console.log('Decreasing quantity for:', item.uid || item.id);
                        updateQuantity(item.uid || item.id, item.quantity - 1);
                      }}
                      className="w-8 h-8 rounded-full bg-gray-200 hover:bg-gray-300 flex items-center justify-center transition-colors"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                      </svg>
                    </button>
                    <span className="w-8 text-center font-medium">{item.quantity}</span>
                    <button
                      onClick={() => {
                        console.log('Increasing quantity for:', item.uid || item.id);
                        updateQuantity(item.uid || item.id, item.quantity + 1);
                      }}
                      className="w-8 h-8 rounded-full bg-purple-600 hover:bg-purple-700 text-white flex items-center justify-center transition-colors"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                      </svg>
                    </button>
                  </div>
                  
                  <div className="text-right">
                    <p className="text-lg font-bold text-gray-900">₹{(item.price * item.quantity).toLocaleString()}</p>
                    <button
                      onClick={() => removeFromCart(item.uid || item.id)}
                      className="mt-2 text-red-600 hover:text-red-800 text-sm font-medium"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="mt-8 border-t border-gray-200 pt-6">
              <div className="flex justify-between items-center mb-4">
                <span className="text-xl font-bold text-gray-900">
                  {selectedIds && selectedIds.length > 0
                    ? `Selected Total (${getSelectedItemsCount()}): ₹${getSelectedTotal().toLocaleString()}`
                    : `Total: ₹${getCartTotal().toLocaleString()}`}
                </span>
                <button
                  onClick={clearCart}
                  className="text-red-600 hover:text-red-800 font-medium"
                >
                  Clear Cart
                </button>
              </div>
              
              <div className="flex space-x-4">
                <button
                  onClick={() => navigate(getCartCategoryRoute())}
                  className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium py-3 px-6 rounded-lg transition-colors"
                >
                  Continue Shopping
                </button>
                <button
                  onClick={() => {
                    const user = getCurrentUser();
                    if (!user) {
                      try {
                        localStorage.setItem('buyNowIntent', JSON.stringify({
                          type: 'checkout',
                          redirectTo: '/checkout',
                          ts: Date.now()
                        }));
                      } catch (_) {}
                      navigate('/login');
                    } else {
                      navigate('/checkout');
                    }
                  }}
                  className="flex-1 bg-purple-600 hover:bg-purple-700 text-white font-medium py-3 px-6 rounded-lg transition-colors"
                >
                  Proceed to Checkout
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Cart