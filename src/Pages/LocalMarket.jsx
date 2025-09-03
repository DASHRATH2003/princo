import React, { useState } from 'react'
import { useCart } from '../context/CartContext'

const LocalMarket = () => {
  const { addToCart } = useCart()
  const [pageTitle] = useState('Local Market')
  const [pageDescription] = useState('Fresh Local Products & Groceries')
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [searchTerm, setSearchTerm] = useState('')
  const [sortBy, setSortBy] = useState('Popular')
  const [priceRange, setPriceRange] = useState([0, 1000])

  // Categories for local market
  const categories = [
    'All', 'Vegetables', 'Fruits', 'Groceries', 'Dairy', 'Bakery', 'Meat & Fish', 'Spices'
  ]

  // Product freshness levels
  const freshnessLevels = ['Fresh Today', 'Farm Fresh', 'Organic']

  // Delivery options
  const deliveryOptions = ['Same Day', '2-4 Hours', 'Next Day']

  // Local market products
  const products = [
    {
      id: 1,
      name: 'Fresh Tomatoes',
      category: 'Vegetables',
      price: 40,
      originalPrice: 50,
      image: 'https://images.unsplash.com/photo-1546470427-e5d491d121f4?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80',
      freshness: 'Fresh Today',
      delivery: 'Same Day',
      rating: 4.8,
      unit: 'per kg',
      discount: 20,
      inStock: true
    },
    {
      id: 2,
      name: 'Organic Bananas',
      category: 'Fruits',
      price: 60,
      originalPrice: 70,
      image: 'https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80',
      freshness: 'Organic',
      delivery: '2-4 Hours',
      rating: 4.9,
      unit: 'per dozen',
      discount: 14,
      inStock: true
    },
    {
      id: 3,
      name: 'Fresh Milk',
      category: 'Dairy',
      price: 55,
      originalPrice: 60,
      image: 'https://images.unsplash.com/photo-1550583724-b2692b85b150?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80',
      freshness: 'Fresh Today',
      delivery: 'Same Day',
      rating: 4.7,
      unit: 'per liter',
      discount: 8,
      inStock: true
    },
    {
      id: 4,
      name: 'Whole Wheat Bread',
      category: 'Bakery',
      price: 35,
      originalPrice: 40,
      image: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80',
      freshness: 'Fresh Today',
      delivery: 'Same Day',
      rating: 4.6,
      unit: 'per loaf',
      discount: 12,
      inStock: true
    },
    {
      id: 5,
      name: 'Fresh Spinach',
      category: 'Vegetables',
      price: 25,
      originalPrice: 30,
      image: 'https://images.unsplash.com/photo-1576045057995-568f588f82fb?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80',
      freshness: 'Farm Fresh',
      delivery: 'Same Day',
      rating: 4.8,
      unit: 'per bunch',
      discount: 17,
      inStock: true
    },
    {
      id: 6,
      name: 'Red Apples',
      category: 'Fruits',
      price: 120,
      originalPrice: 140,
      image: 'https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80',
      freshness: 'Farm Fresh',
      delivery: '2-4 Hours',
      rating: 4.9,
      unit: 'per kg',
      discount: 14,
      inStock: true
    },
    {
      id: 7,
      name: 'Basmati Rice',
      category: 'Groceries',
      price: 180,
      originalPrice: 200,
      image: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80',
      freshness: 'Farm Fresh',
      delivery: 'Next Day',
      rating: 4.7,
      unit: 'per kg',
      discount: 10,
      inStock: true
    },
    {
      id: 8,
      name: 'Fresh Chicken',
      category: 'Meat & Fish',
      price: 280,
      originalPrice: 320,
      image: 'https://images.unsplash.com/photo-1604503468506-a8da13d82791?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80',
      freshness: 'Fresh Today',
      delivery: 'Same Day',
      rating: 4.8,
      unit: 'per kg',
      discount: 12,
      inStock: true
    },
    {
      id: 9,
      name: 'Turmeric Powder',
      category: 'Spices',
      price: 45,
      originalPrice: 50,
      image: 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80',
      freshness: 'Organic',
      delivery: 'Next Day',
      rating: 4.9,
      unit: 'per 100g',
      discount: 10,
      inStock: true
    },
    {
      id: 10,
      name: 'Fresh Carrots',
      category: 'Vegetables',
      price: 35,
      originalPrice: 40,
      image: 'https://images.unsplash.com/photo-1445282768818-728615cc910a?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80',
      freshness: 'Farm Fresh',
      delivery: 'Same Day',
      rating: 4.7,
      unit: 'per kg',
      discount: 12,
      inStock: true
    },
    {
      id: 11,
      name: 'Fresh Oranges',
      category: 'Fruits',
      price: 80,
      originalPrice: 90,
      image: 'https://images.unsplash.com/photo-1547036967-23d11aacaee0?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80',
      freshness: 'Farm Fresh',
      delivery: '2-4 Hours',
      rating: 4.8,
      unit: 'per kg',
      discount: 11,
      inStock: true
    },
    {
      id: 12,
      name: 'Paneer',
      category: 'Dairy',
      price: 320,
      originalPrice: 350,
      image: 'https://images.unsplash.com/photo-1631452180519-c014fe946bc7?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80',
      freshness: 'Fresh Today',
      delivery: 'Same Day',
      rating: 4.9,
      unit: 'per kg',
      discount: 9,
      inStock: true
    }
  ]

  // Filter products based on search, category, and price range
  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = selectedCategory === 'All' || product.category === selectedCategory
    const matchesPrice = product.price >= priceRange[0] && product.price <= priceRange[1]
    return matchesSearch && matchesCategory && matchesPrice
  })

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div className="mb-4 md:mb-0">
              <h1 className="text-3xl font-bold text-gray-900">{pageTitle}</h1>
              <p className="text-gray-600 mt-1">{pageDescription}</p>
            </div>
            
            {/* Search Bar */}
            <div className="flex-1 max-w-lg mx-4">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search for fresh products..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
                <svg className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
            </div>

            {/* Sort By */}
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600">Sort by:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="border border-gray-300 rounded-md px-3 py-1 text-sm focus:ring-2 focus:ring-green-500 focus:border-transparent"
              >
                <option>Popular</option>
                <option>Price: Low to High</option>
                <option>Price: High to Low</option>
                <option>Newest</option>
                <option>Rating</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Sidebar Filters */}
          <div className="lg:w-64 space-y-6">
            {/* Categories */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Categories</h3>
              <div className="space-y-2">
                {categories.map((category) => (
                  <button
                    key={category}
                    onClick={() => setSelectedCategory(category)}
                    className={`w-full text-left px-3 py-2 rounded-md text-sm transition-colors ${
                      selectedCategory === category
                        ? 'bg-green-100 text-green-800 font-medium'
                        : 'text-gray-600 hover:bg-gray-100'
                    }`}
                  >
                    {category}
                  </button>
                ))}
              </div>
            </div>

            {/* Freshness Filter */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Freshness</h3>
              <div className="space-y-2">
                {freshnessLevels.map((level) => (
                  <label key={level} className="flex items-center">
                    <input type="checkbox" className="rounded border-gray-300 text-green-600 focus:ring-green-500" />
                    <span className="ml-2 text-sm text-gray-600">{level}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Delivery Time Filter */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Delivery Time</h3>
              <div className="space-y-2">
                {deliveryOptions.map((option) => (
                  <label key={option} className="flex items-center">
                    <input type="checkbox" className="rounded border-gray-300 text-green-600 focus:ring-green-500" />
                    <span className="ml-2 text-sm text-gray-600">{option}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Price Range */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Price Range</h3>
              <div className="space-y-4">
                <input
                  type="range"
                  min="0"
                  max="1000"
                  value={priceRange[1]}
                  onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value)])}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                />
                <div className="flex justify-between text-sm text-gray-600">
                  <span>₹{priceRange[0]}</span>
                  <span>₹{priceRange[1]}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            {/* Category Tabs */}
            <div className="bg-white rounded-lg shadow-sm mb-6">
              <div className="flex flex-wrap border-b">
                {categories.slice(0, 6).map((category) => (
                  <button
                    key={category}
                    onClick={() => setSelectedCategory(category)}
                    className={`px-6 py-3 text-sm font-medium border-b-2 transition-colors ${
                      selectedCategory === category
                        ? 'border-green-500 text-green-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700'
                    }`}
                  >
                    {category}
                  </button>
                ))}
              </div>
            </div>

            {/* Products Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredProducts.map((product) => (
                <div key={product.id} className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200 overflow-hidden group">
                  <div className="relative">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-200"
                    />
                    {product.discount > 0 && (
                      <div className="absolute top-2 left-2 bg-red-500 text-white px-2 py-1 rounded-md text-xs font-medium">
                        {product.discount}% OFF
                      </div>
                    )}
                    <div className="absolute top-2 right-2 bg-green-500 text-white px-2 py-1 rounded-md text-xs font-medium">
                      {product.freshness}
                    </div>
                    <button className="absolute bottom-2 right-2 bg-white rounded-full p-2 shadow-md opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                      <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                      </svg>
                    </button>
                  </div>
                  
                  <div className="p-4">
                    <h3 className="text-lg font-semibold text-gray-900 mb-1">{product.name}</h3>
                    <p className="text-sm text-gray-600 mb-2">{product.unit}</p>
                    
                    <div className="flex items-center mb-2">
                      <div className="flex items-center">
                        {[...Array(5)].map((_, i) => (
                          <svg
                            key={i}
                            className={`w-4 h-4 ${
                              i < Math.floor(product.rating) ? 'text-yellow-400' : 'text-gray-300'
                            }`}
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                          </svg>
                        ))}
                        <span className="ml-1 text-sm text-gray-600">({product.rating})</span>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center space-x-2">
                        <span className="text-lg font-bold text-gray-900">₹{product.price}</span>
                        {product.originalPrice > product.price && (
                          <span className="text-sm text-gray-500 line-through">₹{product.originalPrice}</span>
                        )}
                      </div>
                      <span className="text-xs text-green-600 font-medium">{product.delivery}</span>
                    </div>
                    
                    <button 
                      onClick={() => addToCart(product)}
                      className="w-full bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 transition-colors duration-200 font-medium"
                    >
                      Add to Cart
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Empty State */}
            {filteredProducts.length === 0 && (
              <div className="text-center py-12">
                <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2M4 13h2m13-8l-4 4m0 0l-4-4m4 4V3" />
                </svg>
                <h3 className="text-lg font-medium text-gray-900 mb-2">No products found</h3>
                <p className="text-gray-600">Try adjusting your search or filter criteria</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default LocalMarket