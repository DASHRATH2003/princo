import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useCart } from '../context/CartContext'
import { useWishlist } from '../context/WishlistContext'
import { getProductsByCategory } from '../services/productService'
import { getSubcategoriesByCategory } from '../services/subcategoryService'
import { calculateDiscountPercent } from '../utils/discount'

const EMarket = () => {
  const navigate = useNavigate()
  const pageTitle = "E-market"
  const pageDescription = "Online marketplace for electronics and gadgets"
  const [selectedCategory, setSelectedCategory] = useState('All Products')
  const [priceRange, setPriceRange] = useState([0, 332500])
  const [isCartOpen, setIsCartOpen] = useState(false)
  const [showFilters, setShowFilters] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [categories, setCategories] = useState(['All Products'])
  const [selectedRating, setSelectedRating] = useState(0)
  const { items: cart, addToCart, removeFromCart, updateQuantity, getCartTotal, getCartItemsCount } = useCart()
  const { addToWishlist, removeFromWishlist, isWishlisted } = useWishlist()

  const getSubcategoryName = (sc) => {
    if (sc && typeof sc === 'object') {
      return sc.name || '';
    }
    return typeof sc === 'string' ? sc : '';
  };

  // Extract unique subcategories from products (only subcategories, not main categories)
  const extractCategories = (products) => {
    const uniqueCategories = new Set()
    uniqueCategories.add('All Products')
    
    products.forEach(product => {
      // Only add subcategories, not main categories
      const subName = getSubcategoryName(product.subcategory)
      if (subName && subName.trim() !== '') {
        uniqueCategories.add(subName)
      }
    })
    
    return Array.from(uniqueCategories)
  }

  // Fetch products and subcategories from backend
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        
        // Fetch products
        const productResponse = await getProductsByCategory('emart')
        if (productResponse.success && productResponse.data) {
          setProducts(productResponse.data)
        } else {
          setProducts([])
        }

        // Fetch subcategories from backend
        try {
          const subcategories = await getSubcategoriesByCategory('l-mart')
          const subcategoryNames = ['All Products', ...subcategories.map(sub => sub.name)]
          setCategories(subcategoryNames)
        } catch (subError) {
          console.error('Error fetching subcategories:', subError)
          // Fallback to extracting from products if subcategory fetch fails
          const uniqueCategories = extractCategories(productResponse.data || [])
          setCategories(uniqueCategories)
        }
      } catch (error) {
        console.error('Error fetching emart data:', error)
        setProducts([])
        setCategories(['All Products'])
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  // Get cart item quantity for a specific product
  const getProductQuantity = (productId) => {
    const item = cart.find(item => item.id === productId)
    return item ? item.quantity : 0
  }

  const getTotalItems = () => {
    return cart.reduce((total, item) => total + item.quantity, 0)
  }

  const legs = ['Steel', 'Aluminium', 'Custom', 'Wood']
  const durations = ['-', '1-3 days', '1 week', '2 weeks', '1 month']

  // Safely read product rating from multiple possible fields
  const getProductRating = (product) => {
    const raw = product?.averageRating ?? product?.rating ?? (typeof product?.ratings === 'number' ? product?.ratings : null)
    const num = typeof raw === 'string' ? parseFloat(raw) : raw
    return Number.isFinite(num) ? num : 0
  }

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading products...</p>
        </div>
      </div>
    )
  }

  // Filter products based on search, subcategory only, and price range
  const filteredProducts = products.filter(product => {
    const subName = getSubcategoryName(product.subcategory)
    const matchesFilter = selectedCategory === 'All Products' || 
                         (subName && subName.toLowerCase() === selectedCategory.toLowerCase())
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesPrice = product.price >= priceRange[0] && product.price <= priceRange[1]
    const matchesRating = selectedRating === 0 || getProductRating(product) >= selectedRating
    return matchesFilter && matchesSearch && matchesPrice && matchesRating
  })

  return (
    <div className="min-h-screen bg-gray-50 overflow-x-hidden">
      <div className="w-full mx-auto px-4">
        <div className="flex flex-col md:flex-row md:items-center gap-4">
          <div className="flex-1">
          </div>
          
          <div className="flex items-center justify-between md:justify-end gap-4">
            {/* Cart Icon */}
           
          </div>
        </div>
      </div>

      <div className="w-full mx-auto px-4 py-6">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Mobile Filter Toggle */}
          <div className="lg:hidden mb-4">
            <button 
              onClick={() => setShowFilters(!showFilters)}
              className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg font-medium flex items-center justify-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.707A1 1 0 013 7V4z" />
              </svg>
              Filters
            </button>
          </div>
          
          {/* Sidebar */}
          <div className={`w-full lg:w-64 flex-shrink-0 ${showFilters ? 'block' : 'hidden lg:block'}`}>
            {/* Categories */}
            <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
              <h3 className="font-semibold text-gray-800 mb-4 text-base">Subcategories</h3>
              <div className="space-y-2">
                {categories.map((category) => (
                  <div key={category} className="flex items-center space-x-3">
                    <input
                      type="radio"
                      id={category}
                      name="category"
                      checked={selectedCategory === category}
                      onChange={() => setSelectedCategory(category)}
                      className="text-blue-600 focus:ring-blue-500 border-gray-300 flex-shrink-0"
                    />
                    <label htmlFor={category} className="cursor-pointer text-sm text-gray-700 flex-1 truncate">
                      {category}
                    </label>
                  </div>
                ))}
              </div>
            </div>

            {/* Rating Filter */}
            <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
              <h3 className="font-semibold text-gray-800 mb-4 text-base">Customer Rating</h3>
              <div className="space-y-2">
                {[5,4,3,2,1].map((stars) => (
                  <button
                    key={stars}
                    onClick={() => setSelectedRating(stars)}
                    className={`w-full flex items-center justify-between px-3 py-2 rounded-md border transition-colors ${selectedRating === stars ? 'border-blue-600 bg-blue-50 text-blue-700' : 'border-gray-200 hover:border-blue-400'}`}
                    aria-label={`Filter ${stars} stars & up`}
                  >
                    <div className="flex items-center">
                      {[...Array(5)].map((_, i) => (
                        <svg key={i} className={`w-4 h-4 ${i < stars ? 'text-yellow-400' : 'text-gray-300'}`} fill="currentColor" viewBox="0 0 20 20">
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      ))}
                    </div>
                    <span className="text-xs text-gray-600">{stars}★ & up</span>
                  </button>
                ))}
                <button
                  onClick={() => setSelectedRating(0)}
                  className="w-full mt-2 text-xs text-gray-600 underline"
                >
                  Clear rating
                </button>
              </div>
            </div>

            {/* Price Range */}
            <div className="bg-white rounded-lg shadow-sm p-4">
              <h3 className="font-semibold text-gray-800 mb-4 text-base">Price Range</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between text-sm text-gray-600">
                  <span>₹ {priceRange[0]}</span>
                  <span>₹ {priceRange[1]}.00</span>
                </div>
                <div className="relative">
                  <input
                    type="range"
                    min="999"
                    max="332500"
                    value={priceRange[1]}
                    onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value)])}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1 min-w-0">
            {/* Category Tabs */}
            <div className="mb-6">
              <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
                {categories.map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setSelectedCategory(tab)}
                    className={`flex-shrink-0 px-4 py-2 rounded-lg font-medium text-sm transition-colors ${
                      selectedCategory === tab
                        ? 'bg-blue-600 text-white'
                        : 'bg-white text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    {tab}
                  </button>
                ))}
              </div>
            </div>

            {/* Products Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
              {filteredProducts.map((product) => (
                <div key={product._id} className="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow">
                  <div className="relative">
                    <img
                      src={product.image || '/no-image.svg'}
                      alt={product.name}
                      className="w-full h-40 object-contain bg-white cursor-pointer hover:scale-105 transition-transform duration-200"
                      onError={(e) => { e.currentTarget.src = '/no-image.svg' }}
                      onClick={() => navigate(`/product/${product._id}`)}
                    />
                    {product.isNew && (
                      <span className="absolute top-2 left-2 bg-purple-600 text-white text-xs px-2 py-1 rounded">
                        New!
                      </span>
                    )}
                    {(() => {
                      const pct = calculateDiscountPercent(product.price, product.offerPrice);
                      return pct > 0 ? (
                        <span className={`absolute ${product.isNew ? 'top-10 left-2' : 'top-2 left-2'} bg-red-500 text-white text-xs px-2 py-1 rounded`}>
                          {pct}% OFF
                        </span>
                      ) : null;
                    })()}
                    {product.onSale && (
                      <span className="absolute top-2 right-2 bg-green-600 text-white text-xs px-2 py-1 rounded">
                        Sale
                      </span>
                    )}
                    {/* Wishlist Heart Icon */}
                    {(() => {
                      const pid = product._id || product.id;
                      const wished = isWishlisted(pid);
                      return (
                        <button
                          onClick={(e) => {
                            e.preventDefault();
                            if (wished) removeFromWishlist(pid);
                            else addToWishlist(product);
                          }}
                          className="absolute top-2 right-2 w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-md hover:bg-gray-100 transition-colors"
                          aria-label="Toggle wishlist"
                        >
                          <svg className={`w-4 h-4 ${wished ? 'text-red-500' : 'text-gray-400'}`} fill={wished ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                          </svg>
                        </button>
                      );
                    })()}
                  </div>
                  <div className="p-4">
                    <h3 className="font-medium text-gray-900 mb-2 text-sm line-clamp-2">{product.name}</h3>
                    <p className="text-lg font-semibold text-gray-900 mb-3">₹ {((product.offerPrice !== null && product.offerPrice !== undefined && Number(product.offerPrice) > 0) ? Number(product.offerPrice) : Number(product.price || 0))}</p>
                    
                    {/* Add to Cart Section */}
                    <div className="flex items-center justify-between">
                      {getProductQuantity(product._id) > 0 ? (
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => updateQuantity(product._id, getProductQuantity(product._id) - 1)}
                            className="w-8 h-8 rounded-full bg-gray-200 hover:bg-gray-300 flex items-center justify-center transition-colors"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                            </svg>
                          </button>
                          <span className="w-8 text-center font-medium text-base">{getProductQuantity(product._id)}</span>
                          <button
                            onClick={() => updateQuantity(product._id, getProductQuantity(product._id) + 1)}
                            className="w-8 h-8 rounded-full bg-purple-600 hover:bg-purple-700 text-white flex items-center justify-center transition-colors"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                            </svg>
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => {
                            const effectivePrice = (product.offerPrice !== null && product.offerPrice !== undefined && product.offerPrice > 0)
                              ? product.offerPrice
                              : product.price;
                            addToCart({ ...product, id: product._id, price: effectivePrice });
                          }}
                          className="flex-1 bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center justify-center space-x-2 text-sm h-10"
                        >
                          <span>Add to Cart</span>
                        </button>
                      )}
                      
                      {/* Quick View Button */}
                      <button 
                        onClick={() => navigate(`/product/${product._id}`)}
                        className="ml-2 p-2 text-gray-400 hover:text-purple-600 transition-colors"
                        aria-label="Quick view product"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Cart Sidebar */}
      {isCartOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden">
          <div className="absolute inset-0 bg-black bg-opacity-50" onClick={() => setIsCartOpen(false)}></div>
          <div className="absolute right-0 top-0 h-full w-96 bg-white shadow-xl transform transition-transform duration-300 ease-in-out">
            <div className="flex flex-col h-full">
              {/* Cart Header */}
              <div className="flex items-center justify-between p-4 border-b">
                <h2 className="text-lg font-semibold text-gray-900">Shopping Cart ({getTotalItems()})</h2>
                <button 
                  onClick={() => setIsCartOpen(false)}
                  className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {/* Cart Items */}
              <div className="flex-1 overflow-y-auto p-4">
                {cart.length === 0 ? (
                  <div className="text-center py-8">
                    <svg className="w-16 h-16 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-2.5 5M7 13l2.5 5m6-5v6a2 2 0 01-2 2H9a2 2 0 01-2-2v-6m8 0V9a2 2 0 00-2-2H9a2 2 0 00-2 2v4.01" />
                    </svg>
                    <p className="text-gray-500 mb-4">Your cart is empty</p>
                    <button 
                      onClick={() => setIsCartOpen(false)}
                      className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-2 rounded-lg transition-colors"
                    >
                      Continue Shopping
                    </button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {cart.map((item) => (
                      <div key={(item.uid || item.id)} className="flex items-center space-x-4 bg-gray-50 p-3 rounded-lg">
                        <img 
                          src={item.image} 
                          alt={item.name}
                          className="w-16 h-16 object-cover rounded-md"
                        />
                        <div className="flex-1">
                          <h3 className="font-medium text-gray-900 text-sm">{item.name}</h3>
                          {(item.selectedColor || item.selectedSize) && (
                            <p className="text-xs text-gray-700">
                              {item.selectedColor && (<span>Color: <span className="font-medium">{item.selectedColor}</span></span>)}
                              {item.selectedColor && item.selectedSize && <span className="mx-1">•</span>}
                              {item.selectedSize && (<span>Size: <span className="font-medium">{item.selectedSize}</span></span>)}
                            </p>
                          )}
                          <p className="text-purple-600 font-semibold">₹ {item.price}</p>
                        </div>
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => updateQuantity((item.uid || item.id), item.quantity - 1)}
                            className="w-6 h-6 rounded-full bg-gray-200 hover:bg-gray-300 flex items-center justify-center transition-colors"
                          >
                            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                            </svg>
                          </button>
                          <span className="w-8 text-center text-sm font-medium">{item.quantity}</span>
                          <button
                            onClick={() => updateQuantity((item.uid || item.id), item.quantity + 1)}
                            className="w-6 h-6 rounded-full bg-purple-600 hover:bg-purple-700 text-white flex items-center justify-center transition-colors"
                          >
                            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                            </svg>
                          </button>
                        </div>
                        <button
                          onClick={() => removeFromCart((item.uid || item.id))}
                          className="p-1 text-red-500 hover:text-red-700 transition-colors"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Cart Footer */}
              {cart.length > 0 && (
                <div className="border-t p-4 space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-lg font-semibold text-gray-900">Total:</span>
                    <span className="text-xl font-bold text-purple-600">₹ {getCartTotal().toLocaleString()}</span>
                  </div>
                  <div className="space-y-2">
                    <button className="w-full bg-purple-600 hover:bg-purple-700 text-white py-3 rounded-lg font-medium transition-colors">
                      Proceed to Checkout
                    </button>
                    <button 
                      onClick={() => setIsCartOpen(false)}
                      className="w-full bg-gray-200 hover:bg-gray-300 text-gray-800 py-2 rounded-lg font-medium transition-colors"
                    >
                      Continue Shopping
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default EMarket