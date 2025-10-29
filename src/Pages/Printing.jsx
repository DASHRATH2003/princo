import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useCart } from '../context/CartContext'
import { getProductsByCategory } from '../services/productService'
import { getSubcategoriesByCategory } from '../services/subcategoryService'

// Add custom CSS animations
const customStyles = `
  @keyframes fadeInUp {
    from {
      opacity: 0;
      transform: translateY(30px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  @keyframes slideInLeft {
    from {
      opacity: 0;
      transform: translateX(-50px);
    }
    to {
      opacity: 1;
      transform: translateX(0);
    }
  }

  @keyframes slideInRight {
    from {
      opacity: 0;
      transform: translateX(50px);
    }
    to {
      opacity: 1;
      transform: translateX(0);
    }
  }

  @keyframes slideUp {
    from {
      opacity: 0;
      transform: translateY(50px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  @keyframes zoomIn {
    from {
      opacity: 0;
      transform: scale(0.8);
    }
    to {
      opacity: 1;
      transform: scale(1);
    }
  }

  @keyframes float {
    0%, 100% {
      transform: translateY(0px);
    }
    50% {
      transform: translateY(-20px);
    }
  }

  @keyframes bounceSlow {
    0%, 100% {
      transform: translateY(0);
    }
    50% {
      transform: translateY(-10px);
    }
  }

  @keyframes spinSlow {
    from {
      transform: rotate(0deg);
    }
    to {
      transform: rotate(360deg);
    }
  }

  .animate-fade-in-up {
    animation: fadeInUp 0.8s ease-out forwards;
  }

  .animate-slide-in-left {
    animation: slideInLeft 0.8s ease-out forwards;
  }

  .animate-slide-in-right {
    animation: slideInRight 0.8s ease-out forwards;
  }

  .animate-slide-up {
    animation: slideUp 0.8s ease-out forwards;
  }

  .animate-zoom-in {
    animation: zoomIn 0.8s ease-out forwards;
  }

  .animate-float {
    animation: float 3s ease-in-out infinite;
  }

  .animate-bounce-slow {
    animation: bounceSlow 2s ease-in-out infinite;
  }

  .animate-spin-slow {
    animation: spinSlow 3s linear infinite;
  }

  .animation-delay-100 {
    animation-delay: 0.1s;
  }

  .animation-delay-200 {
    animation-delay: 0.2s;
  }

  .animation-delay-300 {
    animation-delay: 0.3s;
  }

  .animation-delay-400 {
    animation-delay: 0.4s;
  }

  .animation-delay-500 {
    animation-delay: 0.5s;
  }

  .animation-delay-600 {
    animation-delay: 0.6s;
  }

  .animation-delay-700 {
    animation-delay: 0.7s;
  }

  .animation-delay-800 {
    animation-delay: 0.8s;
  }

  .animation-delay-900 {
    animation-delay: 0.9s;
  }
`;

// Inject styles
if (typeof document !== 'undefined') {
  const styleSheet = document.createElement('style');
  styleSheet.type = 'text/css';
  styleSheet.innerText = customStyles;
  document.head.appendChild(styleSheet);
}

const Printing = () => {
  const navigate = useNavigate()
  const { addToCart } = useCart()
  const [selectedCategory, setSelectedCategory] = useState('All Products')
  const [priceRange, setPriceRange] = useState([0, 25000])
  const [showFilters, setShowFilters] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [categories, setCategories] = useState(['All Products'])

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

  // Dynamic products and subcategories from backend - loaded in useEffect
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        
        // Fetch products
        const productResponse = await getProductsByCategory('printing')
        if (productResponse && productResponse.data) {
          setProducts(productResponse.data)
        } else {
          setProducts([])
        }

        // Fetch subcategories from backend
        try {
          const subcategories = await getSubcategoriesByCategory('printing')
          const subcategoryNames = ['All Products', ...subcategories.map(sub => sub.name)]
          setCategories(subcategoryNames)
        } catch (subError) {
          console.error('Error fetching subcategories:', subError)
          // Fallback to extracting from products if subcategory fetch fails
          const uniqueCategories = extractCategories(productResponse.data || [])
          setCategories(uniqueCategories)
        }
      } catch (error) {
        console.error('Error fetching printing data:', error)
        setProducts([])
        setCategories(['All Products'])
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  const filteredProducts = products.filter(product => {
    const subName = getSubcategoryName(product.subcategory)
    const matchesCategory = selectedCategory === 'All Products' || 
                          (subName && subName === selectedCategory)
    const matchesPrice = product.price >= priceRange[0] && product.price <= priceRange[1]
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase())
    return matchesCategory && matchesPrice && matchesSearch
  })

  return (
    <div className="min-h-screen bg-gray-50 overflow-x-hidden">
      <div className="w-full mx-auto px-4 py-6">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Mobile Filter Toggle */}
          <div className="lg:hidden mb-4">
            <button 
              onClick={() => setShowFilters(!showFilters)}
              className="w-full bg-green-600 text-white py-2 px-4 rounded-lg font-medium flex items-center justify-center gap-2"
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
              <h3 className="font-semibold text-gray-800 mb-4">Subcategories</h3>
              <div className="space-y-2">
                {categories.map((category) => (
                  <div key={category} className="flex items-center space-x-3">
                    <input
                      type="radio"
                      id={category}
                      name="category"
                      checked={selectedCategory === category}
                      onChange={() => setSelectedCategory(category)}
                      className="text-green-600 focus:ring-green-500 border-gray-300 flex-shrink-0"
                    />
                    <label htmlFor={category} className="cursor-pointer text-sm text-gray-700 flex-1 truncate">
                      {category}
                    </label>
                  </div>
                ))}
              </div>
            </div>

            {/* Service Type Filter */}
            <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
              <h3 className="font-semibold text-gray-800 mb-4">Service Type</h3>
              <div className="space-y-2">
                {['Design Only', 'Print Only', 'Design + Print', 'Rush Service'].map((type) => (
                  <div key={type} className="flex items-center space-x-3">
                    <input
                      type="checkbox"
                      id={type}
                      className="text-green-600 focus:ring-green-500 border-gray-300 rounded flex-shrink-0"
                    />
                    <label htmlFor={type} className="cursor-pointer text-sm text-gray-700 flex-1 truncate">
                      {type}
                    </label>
                  </div>
                ))}
              </div>
            </div>

            {/* Delivery Time Filter */}
            <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
              <h3 className="font-semibold text-gray-800 mb-4">Delivery Time</h3>
              <div className="space-y-2">
                {['Same Day', '1-2 days', '3-5 days', '1 week', '2+ weeks'].map((delivery) => (
                  <div key={delivery} className="flex items-center space-x-3">
                    <input
                      type="checkbox"
                      id={delivery}
                      className="text-green-600 focus:ring-green-500 border-gray-300 rounded flex-shrink-0"
                    />
                    <label htmlFor={delivery} className="cursor-pointer text-sm text-gray-700 flex-1 truncate">
                      {delivery}
                    </label>
                  </div>
                ))}
              </div>
            </div>

            {/* Price Range */}
            <div className="bg-white rounded-lg shadow-sm p-4">
              <h3 className="font-semibold text-gray-800 mb-4">Price Range</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between text-sm text-gray-600">
                  <span>₹ {priceRange[0]}</span>
                  <span>₹ {priceRange[1]}</span>
                </div>
                <div className="relative">
                  <input
                    type="range"
                    min="0"
                    max="5000"
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
            {/* Category Tabs - Show only subcategories */}
            <div className="mb-6">
              <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
                {categories.map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setSelectedCategory(tab)}
                    className={`flex-shrink-0 px-4 py-2 rounded-lg font-medium text-sm transition-colors ${
                      selectedCategory === tab
                        ? 'bg-green-600 text-white'
                        : 'bg-white text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    {tab}
                  </button>
                ))}
              </div>
            </div>

            {/* Results Header */}
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900">
                {selectedCategory === 'All Products' ? 'All Printing Services' : selectedCategory}
              </h2>
              <p className="text-gray-600">{filteredProducts.length} products found</p>
            </div>

            {/* Products Grid */}
            {loading ? (
              <div className="flex justify-center items-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
              </div>
            ) : (
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
                      {product.discount > 0 && (
                        <div className="absolute top-2 left-2 bg-red-500 text-white px-2 py-1 rounded text-xs">
                          {product.discount}% OFF
                        </div>
                      )}
                    </div>
                    <div className="p-4">
                      <h3 className="font-medium text-gray-900 mb-2 text-sm line-clamp-2">{product.name}</h3>
                    <p className="text-lg font-semibold text-gray-900 mb-3">₹ {((product.offerPrice !== null && product.offerPrice !== undefined && Number(product.offerPrice) > 0) ? Number(product.offerPrice) : Number(product.price || 0))}</p>
                      
                      {/* Add to Cart Section */}
                      <div className="flex items-center justify-between">
                        <button
                          onClick={() => {
                            const effectivePrice = (product.offerPrice !== null && product.offerPrice !== undefined && product.offerPrice > 0)
                              ? product.offerPrice
                              : product.price;
                            addToCart({ ...product, id: product._id, price: effectivePrice });
                          }}
                          className="flex-1 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center justify-center space-x-2 text-sm h-10"
                        >
                          <span>Add to Cart</span>
                        </button>
                        
                        {/* Quick View Button */}
                        <button 
                          onClick={() => navigate(`/product/${product._id}`)}
                          className="ml-2 p-2 text-gray-400 hover:text-green-600 transition-colors"
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
            )}
          </div>
          
          {/* Mobile Filter Toggle State */}
          <div className="lg:hidden">
            {showFilters && (
              <button 
                onClick={() => setShowFilters(false)}
                className="fixed top-4 right-4 z-50 bg-gray-800 text-white p-2 rounded-full shadow-lg"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            )}
          </div>
        </div>
      </div>
      {/* Printing Process Showcase Section */}
      <div className="bg-gradient-to-br from-purple-50 to-indigo-100 py-16">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4 animate-fade-in-up">
              Our Printing Process
            </h2>
            <p className="text-xl text-gray-600 animate-fade-in-up animation-delay-200">
              Professional Quality Printing with Advanced Technology
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {/* Step 1 */}
            <div className="text-center group animate-slide-in-left animation-delay-300">
              <div className="relative mb-6">
                <div className="w-24 h-24 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto shadow-2xl group-hover:scale-110 transition-transform duration-500 animate-bounce-slow">
                  <svg className="w-12 h-12 text-white animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6-4h6m2 5.291A7.962 7.962 0 0112 15c-2.34 0-4.29-1.009-5.824-2.562M15 6.306a7.962 7.962 0 00-6 0m6 0V5a2 2 0 00-2-2H9a2 2 0 00-2 2v1.306m8 0V7a2 2 0 012 2v10a2 2 0 01-2 2H7a2 2 0 01-2-2V9a2 2 0 012-2h8a2 2 0 012-2z" />
                  </svg>
                </div>
                <div className="absolute -top-2 -right-2 w-8 h-8 bg-yellow-400 rounded-full flex items-center justify-center text-sm font-bold text-gray-800 animate-spin-slow">
                  1
                </div>
              </div>
              <h3 className="text-lg font-semibold mb-2 text-gray-800">Upload Design</h3>
               <p className="text-gray-600 text-sm">Upload your design or choose from our templates</p>
            </div>

            {/* Step 2 */}
            <div className="text-center group animate-slide-in-left animation-delay-500">
              <div className="relative mb-6">
                <div className="w-24 h-24 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-full flex items-center justify-center mx-auto shadow-2xl group-hover:scale-110 transition-transform duration-500 animate-bounce-slow animation-delay-200">
                  <svg className="w-12 h-12 text-white animate-pulse animation-delay-100" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
                <div className="absolute -top-2 -right-2 w-8 h-8 bg-yellow-400 rounded-full flex items-center justify-center text-sm font-bold text-gray-800 animate-spin-slow animation-delay-200">
                  2
                </div>
              </div>
              <h3 className="text-lg font-semibold mb-2 text-gray-800">Quality Check</h3>
               <p className="text-gray-600 text-sm">Our experts review your design for quality</p>
            </div>

            {/* Step 3 */}
            <div className="text-center group animate-slide-in-right animation-delay-700">
              <div className="relative mb-6">
                <div className="w-24 h-24 bg-gradient-to-br from-green-500 to-emerald-500 rounded-full flex items-center justify-center mx-auto shadow-2xl group-hover:scale-110 transition-transform duration-500 animate-bounce-slow animation-delay-400">
                  <svg className="w-12 h-12 text-white animate-pulse animation-delay-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
                  </svg>
                </div>
                <div className="absolute -top-2 -right-2 w-8 h-8 bg-yellow-400 rounded-full flex items-center justify-center text-sm font-bold text-gray-800 animate-spin-slow animation-delay-400">
                  3
                </div>
              </div>
              <h3 className="text-lg font-semibold mb-2 text-gray-800">Printing</h3>
               <p className="text-gray-600 text-sm">High-quality machine printing</p>
            </div>

            {/* Step 4 */}
            <div className="text-center group animate-slide-in-right animation-delay-900">
              <div className="relative mb-6">
                <div className="w-24 h-24 bg-gradient-to-br from-orange-500 to-red-500 rounded-full flex items-center justify-center mx-auto shadow-2xl group-hover:scale-110 transition-transform duration-500 animate-bounce-slow animation-delay-600">
                  <svg className="w-12 h-12 text-white animate-pulse animation-delay-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                  </svg>
                </div>
                <div className="absolute -top-2 -right-2 w-8 h-8 bg-yellow-400 rounded-full flex items-center justify-center text-sm font-bold text-gray-800 animate-spin-slow animation-delay-600">
                  4
                </div>
              </div>
              <h3 className="text-lg font-semibold mb-2 text-gray-800">Delivery</h3>
               <p className="text-gray-600 text-sm">Fast and secure delivery</p>
            </div>
          </div>
        </div>
      </div>

      {/* Quality Features Section */}
      <div className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4 animate-fade-in-up">
              Why Choose Us?
            </h2>
            <p className="text-xl text-gray-600 animate-fade-in-up animation-delay-200">
              Premium Quality Printing Services
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="text-center group animate-zoom-in animation-delay-300">
              <div className="relative mb-6">
                <div className="w-32 h-32 bg-gradient-to-br from-purple-100 to-purple-200 rounded-full flex items-center justify-center mx-auto group-hover:shadow-2xl transition-all duration-500 animate-float">
                  <img 
                    src="https://images.unsplash.com/photo-1586953208448-b95a79798f07?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80" 
                    alt="High Quality Printing" 
                    className="w-20 h-20 rounded-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                </div>
                <div className="absolute -top-2 -right-8 animate-bounce">
                  <span className="text-2xl">✨</span>
                </div>
              </div>
              <h3 className="text-xl font-semibold mb-3 text-gray-800">Premium Quality</h3>
               <p className="text-gray-600">High-resolution printing with best materials</p>
            </div>

            {/* Feature 2 */}
            <div className="text-center group animate-zoom-in animation-delay-500">
              <div className="relative mb-6">
                <div className="w-32 h-32 bg-gradient-to-br from-blue-100 to-blue-200 rounded-full flex items-center justify-center mx-auto group-hover:shadow-2xl transition-all duration-500 animate-float animation-delay-200">
                  <img 
                    src="https://images.unsplash.com/photo-1558618666-fcd25c85cd64?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80" 
                    alt="Fast Delivery" 
                    className="w-20 h-20 rounded-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                </div>
                <div className="absolute -top-2 -right-8 animate-bounce animation-delay-200">
                  <span className="text-2xl">⚡</span>
                </div>
              </div>
              <h3 className="text-xl font-semibold mb-3 text-gray-800">Fast Delivery</h3>
               <p className="text-gray-600">Ready in 24-48 hours, express delivery available</p>
            </div>

            {/* Feature 3 */}
            <div className="text-center group animate-zoom-in animation-delay-700">
              <div className="relative mb-6">
                <div className="w-32 h-32 bg-gradient-to-br from-green-100 to-green-200 rounded-full flex items-center justify-center mx-auto group-hover:shadow-2xl transition-all duration-500 animate-float animation-delay-400">
                  <img 
                    src="https://images.unsplash.com/photo-1560472354-b33ff0c44a43?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80" 
                    alt="Affordable Price" 
                    className="w-20 h-20 rounded-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                </div>
                <div className="absolute -top-2 -right-8 animate-bounce animation-delay-400">
                  <span className="text-2xl">💰</span>
                </div>
              </div>
              <h3 className="text-xl font-semibold mb-3 text-gray-800">Affordable Price</h3>
               <p className="text-gray-600">Best price guarantee, no hidden charges</p>
            </div>
          </div>
        </div>
      </div>

      {/* Printing Samples Gallery */}
      <div className="bg-gradient-to-r from-gray-50 to-gray-100 py-16">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4 animate-fade-in-up">
              Our Work Samples
            </h2>
            <p className="text-xl text-gray-600 animate-fade-in-up animation-delay-200">
              Our Recent Printing Work Samples
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80',
              'https://images.unsplash.com/photo-1586953208448-b95a79798f07?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80',
              'https://images.unsplash.com/photo-1611224923853-80b023f02d71?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80',
              'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80',
              'https://images.unsplash.com/photo-1541701494587-cb58502866ab?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80',
              'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80',
              'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80',
              'https://images.unsplash.com/photo-1594736797933-d0401ba2fe65?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80'
            ].map((image, index) => (
              <div key={index} className={`group cursor-pointer animate-slide-up animation-delay-${(index + 1) * 100}`}>
                <div className="relative overflow-hidden rounded-lg shadow-lg group-hover:shadow-2xl transition-all duration-500">
                  <img 
                    src={image} 
                    alt={`Printing Sample ${index + 1}`}
                    className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div className="absolute bottom-4 left-4 text-white">
                      <p className="text-sm font-medium">Sample {index + 1}</p>
                    </div>
                  </div>
                  <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div className="w-8 h-8 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center animate-pulse">
                      <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Customer Testimonials */}
      <div className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4 animate-fade-in-up">
              Customer Reviews
            </h2>
            <p className="text-xl text-gray-600 animate-fade-in-up animation-delay-200">
              What Our Customers Say About Us
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                 name: 'Rahul Sharma',
                 business: 'Digital Marketing Agency',
                 review: 'Excellent quality and fast service. All our business cards came out perfect.',
                 rating: 5,
                 image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&q=80'
               },
               {
                 name: 'Priya Gupta',
                 business: 'Event Management',
                 review: 'The wedding invitation cards quality was amazing. All guests praised them.',
                 rating: 5,
                 image: 'https://images.unsplash.com/photo-1494790108755-2616c9c0e8d3?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&q=80'
               },
               {
                 name: 'Amit Kumar',
                 business: 'Restaurant Owner',
                 review: 'Menu cards and posters printing was very professional. Rates are reasonable too.',
                 rating: 5,
                 image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&q=80'
               }
            ].map((testimonial, index) => (
              <div key={index} className={`bg-gradient-to-br from-purple-50 to-indigo-50 rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all duration-500 group animate-slide-up animation-delay-${(index + 1) * 200}`}>
                <div className="flex items-center mb-4">
                  <img 
                    src={testimonial.image} 
                    alt={testimonial.name}
                    className="w-12 h-12 rounded-full object-cover mr-4 group-hover:scale-110 transition-transform duration-300"
                  />
                  <div>
                    <h4 className="font-semibold text-gray-800">{testimonial.name}</h4>
                    <p className="text-sm text-gray-600">{testimonial.business}</p>
                  </div>
                </div>
                <div className="flex mb-3">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <svg key={i} className="w-5 h-5 text-yellow-400 animate-pulse" style={{animationDelay: `${i * 100}ms`}} fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
                <p className="text-gray-700 italic">"{testimonial.review}"</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Call to Action Section */}
      <div className="bg-gradient-to-r from-purple-600 via-pink-600 to-indigo-600 py-16 relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-black/20"></div>
          <div className="absolute top-0 left-0 w-full h-full">
            <div className="animate-float absolute top-10 left-10 w-20 h-20 bg-white/10 rounded-full"></div>
            <div className="animate-float animation-delay-200 absolute top-20 right-20 w-16 h-16 bg-white/10 rounded-full"></div>
            <div className="animate-float animation-delay-400 absolute bottom-20 left-20 w-24 h-24 bg-white/10 rounded-full"></div>
            <div className="animate-float animation-delay-600 absolute bottom-10 right-10 w-12 h-12 bg-white/10 rounded-full"></div>
          </div>
        </div>
        
        <div className="container-responsive text-center relative z-10">
          <div className="animate-fade-in-up">
            <h2 className="text-5xl font-bold text-white mb-6">
              Order Today!
            </h2>
            <p className="text-xl text-white/90 mb-8">
              Professional Printing Services at Your Doorstep
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row justify-center items-center space-y-4 sm:space-y-0 sm:space-x-6 animate-slide-up animation-delay-300">
            <button className="bg-white text-purple-600 px-8 py-4 rounded-full font-bold text-lg hover:bg-gray-100 transition-all duration-300 transform hover:scale-105 shadow-2xl animate-pulse">
              📞 Call Now
            </button>
            <button className="bg-yellow-400 text-gray-800 px-8 py-4 rounded-full font-bold text-lg hover:bg-yellow-300 transition-all duration-300 transform hover:scale-105 shadow-2xl animate-bounce-slow">
              💬 WhatsApp Message
            </button>
          </div>
          
          <div className="mt-8 animate-fade-in-up animation-delay-500">
            <p className="text-white/80 text-lg">
              🎯 Free Design Consultation | ⚡ Same Day Delivery Available | 💯 100% Quality Guarantee
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Printing
