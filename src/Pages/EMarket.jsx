import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useCart } from '../context/CartContext'

const EMarket = () => {
  const navigate = useNavigate()
  const pageTitle = "Printing Services"
  const pageDescription = "Professional printing and design services for your business needs"
  const [selectedCategory, setSelectedCategory] = useState('All Products')
  const [priceRange, setPriceRange] = useState([999, 332500])
  const [isCartOpen, setIsCartOpen] = useState(false)
  const [showFilters, setShowFilters] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const { items: cart, addToCart, removeFromCart, updateQuantity, getCartTotal, getCartItemsCount } = useCart()

  // Get cart item quantity for a specific product
  const getProductQuantity = (productId) => {
    const item = cart.find(item => item.id === productId)
    return item ? item.quantity : 0
  }

  const getTotalItems = () => {
    return cart.reduce((total, item) => total + item.quantity, 0)
  }

  const categories = [
    'All Products',
    'Services',
    'Business Cards',
    'Brochures',
    'Posters',
    'Flyers',
    'Banners',
    'Logo Design',
    'Stickers',
    'Booklets'
  ]

  const legs = ['Steel', 'Aluminium', 'Custom', 'Wood']
  const durations = ['-', '1-3 days', '1 week', '2 weeks', '1 month']

  const products = [
    // Business Cards
    {
      id: "1",
      name: 'Premium Business Cards',
      price: 2159,
      image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
      category: 'Business Cards',
      isNew: true,
      onSale: false
    },
    {
      id: "2",
      name: 'Matte Finish Business Cards',
      price: 2491,
      image: 'https://images.unsplash.com/photo-1611224923853-80b023f02d71?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
      category: 'Business Cards',
      isNew: false,
      onSale: true
    },
    {
      id: 3,
      name: 'Glossy Business Cards',
      price: 1909,
      image: 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
      category: 'Business Cards',
      isNew: false,
      onSale: false
    },
    // Brochures
    {
      id: 4,
      name: 'Tri-fold Brochures',
      price: 7474,
      image: 'https://images.unsplash.com/photo-1586953208448-b95a79798f07?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
      category: 'Brochures',
      isNew: false,
      onSale: true
    },
    {
      id: 5,
      name: 'Bi-fold Brochures',
      price: 6643,
      image: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
      category: 'Brochures',
      isNew: false,
      onSale: false
    },
    {
      id: 6,
      name: 'Z-fold Brochures',
      price: 7972,
      image: 'https://images.unsplash.com/photo-1611224923853-80b023f02d71?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
      category: 'Brochures',
      isNew: true,
      onSale: false
    },
    // Posters
    {
      id: 7,
      name: 'A3 Poster Printing',
      price: 1287,
      image: 'https://images.unsplash.com/photo-1541701494587-cb58502866ab?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
      category: 'Posters',
      isNew: false,
      onSale: false
    },
    {
      id: 8,
      name: 'A2 Poster Printing',
      price: 2118,
      image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
      category: 'Posters',
      isNew: false,
      onSale: true
    },
    {
      id: 9,
      name: 'A1 Large Poster',
      price: 2949,
      image: 'https://m.media-amazon.com/images/I/71LiV1XNphL._UF894,1000_QL80_.jpg',
      category: 'Posters',
      isNew: true,
      onSale: false
    },
    // Flyers
    {
      id: 10,
      name: 'A5 Flyer Design',
      price: 2908,
      image: 'https://images.unsplash.com/photo-1611224923853-80b023f02d71?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
      category: 'Flyers',
      isNew: false,
      onSale: true
    },
    {
      id: 11,
      name: 'A4 Flyer Printing',
      price: 3739,
      image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
      category: 'Flyers',
      isNew: false,
      onSale: false
    },
    {
      id: 12,
      name: 'Double-sided Flyers',
      price: 4570,
      image: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
      category: 'Flyers',
      isNew: true,
      onSale: false
    },
    // Banners
    {
      id: 13,
      name: 'Vinyl Banner Printing',
      price: 10385,
      image: 'https://encrypted-tbn3.gstatic.com/shopping?q=tbn:ANd9GcQFtOF-6TGnt0I1uruUVy1kMsk9YsvUdSQMERFebE0iHQZk4x8d8CbbzsYjP9qElLWeRURuCx8JDAbiWic-fz60xR6vVDPxmwTg0OSuM2ESCsQsdGRtEtg-Yg',
      category: 'Banners',
      isNew: false,
      onSale: false
    },
    {
      id: 14,
      name: 'Fabric Banner',
      price: 12047,
      image: 'https://images.unsplash.com/photo-1541701494587-cb58502866ab?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
      category: 'Banners',
      isNew: true,
      onSale: false
    },
    {
      id: 15,
      name: 'Mesh Banner',
      price: 11216,
      image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
      category: 'Banners',
      isNew: false,
      onSale: true
    },
    // Logo Design
    {
      id: 16,
      name: 'Professional Logo Design',
      price: 16614,
      image: 'https://images.unsplash.com/photo-1611224923853-80b023f02d71?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
      category: 'Logo Design',
      isNew: true,
      onSale: false
    },
    {
      id: 17,
      name: 'Logo + Brand Identity',
      price: 24922,
      image: 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
      category: 'Logo Design',
      isNew: false,
      onSale: true
    },
    {
      id: 18,
      name: 'Logo Redesign',
      price: 12461,
      image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
      category: 'Logo Design',
      isNew: false,
      onSale: false
    },
    // Stickers
    {
      id: 19,
      name: 'Vinyl Stickers',
      price: 1079,
      image: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
      category: 'Stickers',
      isNew: false,
      onSale: false
    },
    {
      id: 20,
      name: 'Die-cut Stickers',
      price: 1578,
      image: 'https://www.tradeprint.co.uk/dam/jcr:a7fcbe27-b906-447f-a05e-5174f335948b/Stickers%20-%20Die%20Cut.webp',
      category: 'Stickers',
      isNew: true,
      onSale: false
    },
    {
      id: 21,
      name: 'Transparent Stickers',
      price: 1328,
      image: 'https://images.unsplash.com/photo-1541701494587-cb58502866ab?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
      category: 'Stickers',
      isNew: false,
      onSale: true
    },
    // Booklets
    {
      id: 22,
      name: 'Saddle-stitched Booklet',
      price: 3739,
      image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
      category: 'Booklets',
      isNew: false,
      onSale: true
    },
    {
      id: 23,
      name: 'Perfect Bound Booklet',
      price: 5401,
      image: 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
      category: 'Booklets',
      isNew: true,
      onSale: false
    },
    {
      id: 24,
      name: 'Spiral Bound Booklet',
      price: 4570,
      image: 'https://images.unsplash.com/photo-1611224923853-80b023f02d71?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
      category: 'Booklets',
      isNew: false,
      onSale: false
    }
  ]

  const filteredProducts = products.filter(product => {
    const matchesCategory = selectedCategory === 'All Products' || product.category === selectedCategory
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesPrice = product.price >= priceRange[0] && product.price <= priceRange[1]
    return matchesCategory && matchesSearch && matchesPrice
  })

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white shadow-sm border-b">
        <div className="container-responsive py-4">
          <div className="flex flex-col md:flex-row md:items-center gap-4">
            <div className="flex-1">
            </div>
            
            <div className="flex items-center justify-between md:justify-end gap-4">

              {/* Cart Icon */}
             
            </div>
          </div>
        </div>
      </div>

      <div className="container-responsive py-6">
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
            <div className="bg-white rounded-lg shadow-sm p-3 lg:p-4 mb-4 lg:mb-6">
              <h3 className="font-semibold text-gray-800 mb-3 lg:mb-4 text-sm lg:text-base">Categories</h3>
              <div className="space-y-1 lg:space-y-2">
                {categories.map((category) => (
                  <div key={category} className="flex items-center">
                    <input
                      type="radio"
                      id={category}
                      name="category"
                      checked={selectedCategory === category}
                      onChange={() => setSelectedCategory(category)}
                      className="h-3 w-3 lg:h-4 lg:w-4 text-blue-600 focus:ring-blue-500 border-gray-300 flex-shrink-0"
                    />
                    <label htmlFor={category} className="ml-2 text-xs lg:text-sm text-gray-700 cursor-pointer truncate">
                      {category}
                    </label>
                    {category !== 'All Products' && (
                      <svg className="h-3 w-3 lg:h-4 lg:w-4 text-gray-400 ml-auto flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Service Type Filter */}
            <div className="bg-white rounded-lg shadow-sm p-3 lg:p-4 mb-4 lg:mb-6">
              <h3 className="font-semibold text-gray-800 mb-3 lg:mb-4 text-sm lg:text-base">Service Type</h3>
              <div className="space-y-1 lg:space-y-2">
                {['Design Only', 'Print Only', 'Design + Print', 'Rush Service'].map((type) => (
                  <div key={type} className="flex items-center">
                    <input
                      type="checkbox"
                      id={type}
                      className="h-3 w-3 lg:h-4 lg:w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded flex-shrink-0"
                    />
                    <label htmlFor={type} className="ml-2 text-xs lg:text-sm text-gray-700 cursor-pointer truncate">
                      {type}
                    </label>
                  </div>
                ))}
              </div>
            </div>

            {/* Delivery Time Filter */}
            <div className="bg-white rounded-lg shadow-sm p-3 lg:p-4 mb-4 lg:mb-6">
              <h3 className="font-semibold text-gray-800 mb-3 lg:mb-4 text-sm lg:text-base">Delivery Time</h3>
              <div className="space-y-1 lg:space-y-2">
                {['Same Day', '1-2 days', '3-5 days', '1 week', '2+ weeks'].map((delivery) => (
                  <div key={delivery} className="flex items-center">
                    <input
                      type="checkbox"
                      id={delivery}
                      className="h-3 w-3 lg:h-4 lg:w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded flex-shrink-0"
                    />
                    <label htmlFor={delivery} className="ml-2 text-xs lg:text-sm text-gray-700 cursor-pointer truncate">
                      {delivery}
                    </label>
                  </div>
                ))}
              </div>
            </div>

            {/* Price Range */}
            <div className="bg-white rounded-lg shadow-sm p-3 lg:p-4">
              <h3 className="font-semibold text-gray-800 mb-3 lg:mb-4 text-sm lg:text-base">Price Range</h3>
              <div className="space-y-3 lg:space-y-4">
                <div className="flex items-center justify-between text-xs lg:text-sm text-gray-600">
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
                    className="w-full h-1 lg:h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            {/* Category Tabs */}
            <div className="mb-4 lg:mb-6">
              <div className="flex overflow-x-auto space-x-1 bg-gray-100 p-1 rounded-lg scrollbar-hide">
                {['Services', 'Business Cards', 'Brochures', 'Posters', 'Flyers', 'Banners'].map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setSelectedCategory(tab)}
                    className={`flex-shrink-0 px-3 lg:px-4 py-2 text-xs lg:text-sm font-medium rounded-md transition-colors whitespace-nowrap ${
                      selectedCategory === tab
                        ? 'bg-white text-gray-900 shadow-sm'
                        : 'text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    <div className="flex items-center justify-center space-x-1 lg:space-x-2">
                      <div className="w-4 h-4 lg:w-6 lg:h-6 bg-purple-300 rounded flex items-center justify-center">
                        <div className="w-2 h-2 lg:w-3 lg:h-3 bg-purple-600 rounded"></div>
                      </div>
                      <span className="hidden sm:inline">{tab}</span>
                      <span className="sm:hidden">{tab.split(' ')[0]}</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Products Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 lg:gap-6">
              {filteredProducts.map((product) => (
                <div key={product.id} className="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow">
                  <div className="relative">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-40 lg:h-48 object-cover"
                    />
                    {product.isNew && (
                      <span className="absolute top-2 left-2 bg-purple-600 text-white text-xs px-2 py-1 rounded">
                        New!
                      </span>
                    )}
                    {product.onSale && (
                      <span className="absolute top-2 right-2 bg-green-600 text-white text-xs px-2 py-1 rounded">
                        Sale
                      </span>
                    )}
                  </div>
                  <div className="p-3 lg:p-4">
                    <h3 className="font-medium text-gray-900 mb-2 text-sm lg:text-base line-clamp-2">{product.name}</h3>
                    <p className="text-base lg:text-lg font-semibold text-gray-900 mb-3">₹ {product.price}</p>
                    
                    {/* Add to Cart Section */}
                    <div className="flex items-center justify-between">
                      {getProductQuantity(product.id) > 0 ? (
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => updateQuantity(product.id, getProductQuantity(product.id) - 1)}
                            className="w-7 h-7 lg:w-8 lg:h-8 rounded-full bg-gray-200 hover:bg-gray-300 flex items-center justify-center transition-colors"
                          >
                            <svg className="w-3 h-3 lg:w-4 lg:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                            </svg>
                          </button>
                          <span className="w-6 lg:w-8 text-center font-medium text-sm lg:text-base">{getProductQuantity(product.id)}</span>
                          <button
                            onClick={() => updateQuantity(product.id, getProductQuantity(product.id) + 1)}
                            className="w-7 h-7 lg:w-8 lg:h-8 rounded-full bg-purple-600 hover:bg-purple-700 text-white flex items-center justify-center transition-colors"
                          >
                            <svg className="w-3 h-3 lg:w-4 lg:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                            </svg>
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => addToCart({...product})}
                          className="flex-1 bg-purple-600 hover:bg-purple-700 text-white px-3 lg:px-4 py-3 rounded-lg font-medium transition-colors flex items-center justify-center space-x-1 lg:space-x-2 text-sm lg:text-base h-10 lg:h-12"
                        >
                         
                          <span className="hidden sm:inline">Add to Cart</span>
                          <span className="sm:hidden">Add</span>
                        </button>
                      )}
                      
                      {/* Quick View Button */}
                      <button 
                        onClick={() => navigate(`/product/${product.id}`)}
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
                      <div key={item.id} className="flex items-center space-x-4 bg-gray-50 p-3 rounded-lg">
                        <img 
                          src={item.image} 
                          alt={item.name}
                          className="w-16 h-16 object-cover rounded-md"
                        />
                        <div className="flex-1">
                          <h3 className="font-medium text-gray-900 text-sm">{item.name}</h3>
                          <p className="text-purple-600 font-semibold">₹ {item.price}</p>
                        </div>
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            className="w-6 h-6 rounded-full bg-gray-200 hover:bg-gray-300 flex items-center justify-center transition-colors"
                          >
                            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                            </svg>
                          </button>
                          <span className="w-8 text-center text-sm font-medium">{item.quantity}</span>
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            className="w-6 h-6 rounded-full bg-purple-600 hover:bg-purple-700 text-white flex items-center justify-center transition-colors"
                          >
                            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                            </svg>
                          </button>
                        </div>
                        <button
                          onClick={() => removeFromCart(item.id)}
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
