import React, { useState, useEffect } from 'react'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'

const LocalMarket = () => {
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [searchTerm, setSearchTerm] = useState('')
  const [sortBy, setSortBy] = useState('popular')
  const [viewMode, setViewMode] = useState('grid')
  const [hoveredProduct, setHoveredProduct] = useState(null)
  const [isVisible, setIsVisible] = useState(false)
  const [selectedLocation, setSelectedLocation] = useState('All Locations')
  const [priceRange, setPriceRange] = useState([0, 1000])

  useEffect(() => {
    setIsVisible(true)
  }, [])

  const localProducts = [
    {
      id: 1,
      name: "Premium Paper",
      description: "A4 size, 100 sheets high quality paper",
      price: "₹150",
      originalPrice: "₹200",
      category: "Office Supplies",
      vendor: "Local Stationery",
      imageUrl: "https://images.unsplash.com/photo-1586281380349-632531db7ed4?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
      rating: 4.5,
      reviews: 89,
      location: "Mumbai Central",
      vendorImage: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80",
      inStock: true,
      featured: true,
      deliveryTime: "Same day",
      tags: ["Premium", "A4", "Quality", "Office"],
      distance: "2.1 km",
      verified: true
    },
    {
      id: 2,
      name: "Business Cards",
      description: "Professional business cards printing",
      price: "₹299",
      originalPrice: "₹399",
      category: "Printing",
      vendor: "PrintCo Express",
      imageUrl: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
      rating: 4.8,
      reviews: 156,
      location: "Andheri West",
      vendorImage: "https://images.unsplash.com/photo-1494790108755-2616b612b786?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80",
      inStock: true,
      featured: false,
      deliveryTime: "1-2 days",
      tags: ["Business", "Professional", "Printing", "Cards"],
      distance: "5.3 km",
      verified: true
    },
    {
      id: 3,
      name: "Pens & Stationery",
      description: "Quality pens and office stationery",
      price: "₹99",
      originalPrice: null,
      category: "Office Supplies",
      vendor: "Stationery Hub",
      imageUrl: "https://images.unsplash.com/photo-1586281380349-632531db7ed4?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
      rating: 4.3,
      reviews: 234,
      location: "Bandra East",
      vendorImage: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80",
      inStock: true,
      featured: true,
      deliveryTime: "Same day",
      tags: ["Pens", "Stationery", "Quality", "Office"],
      distance: "3.7 km",
      verified: true
    },
    {
      id: 4,
      name: "Banner Printing",
      description: "Large format banner printing",
      price: "₹899",
      originalPrice: "₹1199",
      category: "Printing",
      vendor: "Sign Solutions",
      imageUrl: "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
      rating: 4.6,
      reviews: 67,
      location: "Dadar West",
      vendorImage: "https://images.unsplash.com/photo-1560250097-0b93528c311a?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80",
      inStock: true,
      featured: false,
      deliveryTime: "2-3 days",
      tags: ["Banner", "Large Format", "Printing", "Custom"],
      distance: "7.2 km",
      verified: true
    },
    {
      id: 5,
      name: "Notebooks",
      description: "Professional notebooks and diaries",
      price: "₹199",
      originalPrice: "₹249",
      category: "Office Supplies",
      vendor: "Paper World",
      imageUrl: "https://images.unsplash.com/photo-1586281380349-632531db7ed4?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
      rating: 4.4,
      reviews: 123,
      location: "Kurla West",
      vendorImage: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80",
      inStock: false,
      featured: true,
      deliveryTime: "1-2 days",
      tags: ["Notebooks", "Professional", "Diaries", "Paper"],
      distance: "9.1 km",
      verified: true
    },
    {
      id: 6,
      name: "Stickers & Labels",
      description: "Custom stickers and labels",
      price: "₹99",
      originalPrice: null,
      category: "Printing",
      vendor: "Sticker Pro",
      imageUrl: "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
      rating: 4.7,
      reviews: 298,
      location: "Santacruz East",
      vendorImage: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80",
      inStock: true,
      featured: false,
      deliveryTime: "1-2 days",
      tags: ["Stickers", "Labels", "Custom", "Printing"],
      distance: "4.8 km",
      verified: true
    }
  ]

  const categories = [
    { id: 'all', name: 'All Products' },
    { id: 'Office Supplies', name: 'Office Supplies' },
    { id: 'Printing', name: 'Printing Services' }
  ]

  const filteredProducts = selectedCategory === 'all' 
    ? localProducts 
    : localProducts.filter(product => product.category === selectedCategory)

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className={`relative bg-gradient-to-br from-emerald-50 via-green-50 to-teal-50 py-20 overflow-hidden transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
        {/* Animated Background Elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-green-200/30 to-emerald-300/30 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-tr from-teal-200/30 to-green-300/30 rounded-full blur-3xl animate-pulse delay-1000"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-r from-emerald-100/20 to-green-200/20 rounded-full blur-3xl animate-spin-slow"></div>
        </div>
        
        {/* Floating Elements */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-20 left-10 animate-float">
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-4 shadow-lg">
              <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
            </div>
          </div>
          <div className="absolute top-32 right-20 animate-float-delayed">
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-4 shadow-lg">
              <svg className="w-8 h-8 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </div>
          </div>
          <div className="absolute bottom-32 left-20 animate-float">
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-4 shadow-lg">
              <svg className="w-8 h-8 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
            </div>
          </div>
        </div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="inline-flex items-center bg-white/80 backdrop-blur-sm rounded-full px-6 py-2 mb-6 shadow-lg">
              <span className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse"></span>
              <span className="text-green-700 font-medium">Supporting Local Businesses</span>
            </div>
            
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
              Discover Your
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-600 to-emerald-600"> Local</span>
              <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-teal-600">Community</span>
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto leading-relaxed">
              Connect with trusted local vendors and discover unique products from your neighborhood. 
              Support your community while finding exactly what you need, delivered fresh and fast.
            </p>
            
            {/* Enhanced Search Bar */}
            <div className="max-w-4xl mx-auto mb-8">
              <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-2 shadow-2xl border border-white/20">
                <div className="flex flex-col md:flex-row gap-2">
                  <div className="flex-1 relative">
                    <svg className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                    <input
                      type="text"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      placeholder="Search products, vendors, or services..."
                      className="w-full pl-12 pr-4 py-4 text-lg border-0 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 bg-transparent"
                    />
                  </div>
                  <div className="flex gap-2">
                    <select 
                      value={selectedLocation}
                      onChange={(e) => setSelectedLocation(e.target.value)}
                      className="px-4 py-4 border-0 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 bg-gray-50 text-gray-700"
                    >
                      <option value="">All Locations</option>
                      <option value="Downtown">Downtown</option>
                      <option value="Arts District">Arts District</option>
                      <option value="Countryside">Countryside</option>
                      <option value="Industrial Area">Industrial Area</option>
                    </select>
                    <button className="bg-gradient-to-r from-green-600 to-emerald-600 text-white px-8 py-4 rounded-xl hover:from-green-700 hover:to-emerald-700 transition-all duration-300 transform hover:scale-105 shadow-lg">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="flex flex-wrap justify-center gap-4">
              <button className="bg-gradient-to-r from-green-600 to-emerald-600 text-white px-8 py-4 rounded-full hover:from-green-700 hover:to-emerald-700 transition-all duration-300 transform hover:scale-105 shadow-lg flex items-center gap-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                Browse by Location
              </button>
              <button className="bg-white/90 backdrop-blur-sm border-2 border-green-600 text-green-600 px-8 py-4 rounded-full hover:bg-green-50 transition-all duration-300 transform hover:scale-105 shadow-lg flex items-center gap-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
                Become a Vendor
              </button>
              <button className="bg-white/90 backdrop-blur-sm border-2 border-emerald-600 text-emerald-600 px-8 py-4 rounded-full hover:bg-emerald-50 transition-all duration-300 transform hover:scale-105 shadow-lg flex items-center gap-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
                Support Local
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Search & Location */}
      <div className="py-8 bg-white border-b">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-center">
            <div className="relative flex-1 max-w-md">
              <input
                type="text"
                placeholder="Search for products or vendors..."
                className="w-full px-4 py-3 pl-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <svg className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <div className="relative flex-1 max-w-md">
              <input
                type="text"
                placeholder="Enter your location..."
                className="w-full px-4 py-3 pl-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <svg className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </div>
            <button className="bg-blue-500 hover:bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold transition transform hover:scale-105">
              Search
            </button>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <section className="py-20 bg-gradient-to-r from-white via-green-50/30 to-emerald-50/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Empowering Local Communities</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">Join thousands of customers supporting local businesses and building stronger communities together.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="group text-center p-8 bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border border-green-100">
              <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
              </div>
              <div className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-green-600 to-emerald-600 mb-2">500+</div>
              <div className="text-gray-600 font-medium">Trusted Local Vendors</div>
              <div className="text-sm text-gray-500 mt-1">Verified & Quality Assured</div>
            </div>
            
            <div className="group text-center p-8 bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border border-emerald-100">
              <div className="w-16 h-16 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                </svg>
              </div>
              <div className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-teal-600 mb-2">12K+</div>
              <div className="text-gray-600 font-medium">Unique Products</div>
              <div className="text-sm text-gray-500 mt-1">Fresh & Local Sourced</div>
            </div>
            
            <div className="group text-center p-8 bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border border-teal-100">
              <div className="w-16 h-16 bg-gradient-to-br from-teal-500 to-green-600 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                </svg>
              </div>
              <div className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-teal-600 to-green-600 mb-2">35+</div>
              <div className="text-gray-600 font-medium">Product Categories</div>
              <div className="text-sm text-gray-500 mt-1">From Food to Crafts</div>
            </div>
            
            <div className="group text-center p-8 bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border border-green-100">
              <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
              </div>
              <div className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-green-600 to-emerald-600 mb-2">98%</div>
              <div className="text-gray-600 font-medium">Customer Satisfaction</div>
              <div className="text-sm text-gray-500 mt-1">5-Star Average Rating</div>
            </div>
          </div>
          
          {/* Community Impact */}
          <div className="mt-16 text-center">
            <div className="bg-gradient-to-r from-green-600 to-emerald-600 rounded-2xl p-8 text-white">
              <h3 className="text-2xl font-bold mb-4">Community Impact This Month</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <div className="text-3xl font-bold mb-1">₹2.5M+</div>
                  <div className="text-green-100">Revenue to Local Businesses</div>
                </div>
                <div>
                  <div className="text-3xl font-bold mb-1">1,200+</div>
                  <div className="text-green-100">Jobs Supported</div>
                </div>
                <div>
                  <div className="text-3xl font-bold mb-1">85%</div>
                  <div className="text-green-100">Same-Day Delivery</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Category Filters */}
      <section className="py-20 bg-gradient-to-br from-gray-50 to-green-50/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Explore Local Categories</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">Discover amazing products and services from local businesses in your area</p>
          </div>
          
          {/* Filter Controls */}
          <div className="flex flex-col lg:flex-row justify-between items-center mb-12 gap-6">
            <div className="flex flex-wrap justify-center gap-3">
              {categories.map((category) => {
                const categoryIcons = {
                  'all': '🏪',
                  'Office Supplies': '📋',
                  'Printing': '🖨️'
                };
                
                return (
                  <button
                    key={category.id}
                    onClick={() => setSelectedCategory(category.id)}
                    className={`group px-6 py-3 rounded-2xl font-medium transition-all duration-300 transform hover:scale-105 flex items-center gap-2 ${
                      selectedCategory === category.id
                        ? 'bg-gradient-to-r from-green-600 to-emerald-600 text-white shadow-lg'
                        : 'bg-white/80 backdrop-blur-sm text-gray-700 hover:bg-green-50 border border-gray-200 hover:border-green-300 shadow-md hover:shadow-lg'
                    }`}
                  >
                    <span className="text-lg">{categoryIcons[category.id] || '📦'}</span>
                    <span>{category.name}</span>
                    {selectedCategory === category.id && (
                      <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                    )}
                  </button>
                );
              })}
            </div>
            
            {/* Sort and View Controls */}
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <label className="text-gray-600 font-medium">Sort by:</label>
                <select 
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 bg-white"
                >
                  <option value="popular">Popular</option>
                  <option value="name">Name</option>
                  <option value="price">Price</option>
                  <option value="rating">Rating</option>
                  <option value="distance">Distance</option>
                  <option value="featured">Featured</option>
                </select>
              </div>
              
              <div className="flex items-center gap-2">
                <label className="text-gray-600 font-medium">View:</label>
                <div className="flex bg-white rounded-xl border border-gray-300 p-1">
                  <button
                    onClick={() => setViewMode('grid')}
                    className={`p-2 rounded-lg transition-colors ${
                      viewMode === 'grid' ? 'bg-green-600 text-white' : 'text-gray-600 hover:bg-gray-100'
                    }`}
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                    </svg>
                  </button>
                  <button
                    onClick={() => setViewMode('list')}
                    className={`p-2 rounded-lg transition-colors ${
                      viewMode === 'list' ? 'bg-green-600 text-white' : 'text-gray-600 hover:bg-gray-100'
                    }`}
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          </div>
          
          {/* Price Range Filter */}
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 mb-8 shadow-lg border border-gray-200">
            <div className="flex flex-col md:flex-row items-center gap-6">
              <div className="flex items-center gap-4">
                <label className="text-gray-700 font-medium whitespace-nowrap">Price Range:</label>
                <div className="flex items-center gap-2">
                  <span className="text-gray-600">₹{priceRange[0]}</span>
                  <input
                    type="range"
                    min="0"
                    max="1000"
                    value={priceRange[0]}
                    onChange={(e) => setPriceRange([parseInt(e.target.value), priceRange[1]])}
                    className="w-32 accent-green-600"
                  />
                  <span className="text-gray-600">to</span>
                  <input
                    type="range"
                    min="0"
                    max="1000"
                    value={priceRange[1]}
                    onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value)])}
                    className="w-32 accent-green-600"
                  />
                  <span className="text-gray-600">₹{priceRange[1]}</span>
                </div>
              </div>
              
              <div className="flex items-center gap-4">
                <label className="flex items-center gap-2">
                  <input type="checkbox" className="rounded text-green-600 focus:ring-green-500" />
                  <span className="text-gray-700">In Stock Only</span>
                </label>
                <label className="flex items-center gap-2">
                  <input type="checkbox" className="rounded text-green-600 focus:ring-green-500" />
                  <span className="text-gray-700">Verified Vendors</span>
                </label>
                <label className="flex items-center gap-2">
                  <input type="checkbox" className="rounded text-green-600 focus:ring-green-500" />
                  <span className="text-gray-700">Same Day Delivery</span>
                </label>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Products Grid */}
      <div className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4 animate-fade-in">Local Products</h2>
            <p className="text-xl text-gray-600 animate-fade-in-delay">
              Quality products from trusted local vendors in your area
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredProducts.map((product, index) => (
              <div key={product.id} className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:scale-105 animate-fade-in-delay" style={{animationDelay: `${index * 0.1}s`}}>
                <div className="h-48 relative overflow-hidden">
                  <img 
                    src={product.imageUrl}
                    alt={product.name}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
                  <div className="absolute top-4 right-4">
                    <span className="bg-blue-500 text-white text-xs px-3 py-1 rounded-full">{product.category}</span>
                  </div>
                  <div className="absolute bottom-4 left-4">
                    <div className="flex items-center text-white">
                      <div className="flex text-yellow-400">
                        {[...Array(5)].map((_, i) => (
                          <svg key={i} className={`w-4 h-4 ${i < Math.floor(product.rating) ? 'text-yellow-400' : 'text-gray-300'}`} fill="currentColor" viewBox="0 0 20 20">
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                          </svg>
                        ))}
                      </div>
                      <span className="ml-2 text-sm">{product.rating}</span>
                    </div>
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-semibold mb-2">{product.name}</h3>
                  <p className="text-gray-600 mb-4">{product.description}</p>
                  
                  {/* Vendor Info */}
                  <div className="mb-4 p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-gray-800">{product.vendor}</p>
                        <p className="text-sm text-gray-600 flex items-center">
                          <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                          </svg>
                          {product.location}
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-2xl font-bold text-blue-500">{product.price}</span>
                    <button className="bg-blue-400 hover:bg-blue-500 text-white px-6 py-2 rounded-lg transition transform hover:scale-105">
                      Order Now
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Become a Vendor Section */}
      <div className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4 animate-fade-in">Become a Local Vendor</h2>
            <p className="text-xl text-gray-600 animate-fade-in-delay">
              Join our platform and reach more customers in your area
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { icon: "M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1", title: "Easy Setup", desc: "Simple registration and profile setup" },
              { icon: "M13 10V3L4 14h7v7l9-11h-7z", title: "Reach More Customers", desc: "Connect with customers in your area" },
              { icon: "M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z", title: "Secure Payments", desc: "Safe and secure payment processing" }
            ].map((item, index) => (
              <div key={index} className="text-center animate-fade-in-delay" style={{animationDelay: `${index * 0.1}s`}}>
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={item.icon} />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold mb-2">{item.title}</h3>
                <p className="text-gray-600">{item.desc}</p>
              </div>
            ))}
          </div>
          <div className="text-center mt-8">
            <button className="bg-blue-500 hover:bg-blue-600 text-white px-8 py-4 rounded-lg font-semibold transition transform hover:scale-105 shadow-lg">
              Register as Vendor
            </button>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="py-16 bg-gradient-to-r from-blue-400 to-blue-600 text-white">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold mb-4 animate-fade-in">Support Local Business</h2>
          <p className="text-xl mb-8 animate-fade-in-delay">Discover amazing products from vendors in your neighborhood</p>
          <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-6 animate-fade-in-delay" style={{animationDelay: '0.2s'}}>
            <button className="bg-white text-blue-600 px-8 py-4 rounded-lg font-semibold hover:bg-gray-100 transition transform hover:scale-105 shadow-lg">
              Explore Local Vendors
            </button>
            <button className="border-2 border-white text-white px-8 py-4 rounded-lg font-semibold hover:bg-white hover:text-blue-600 transition transform hover:scale-105">
              Contact Us
            </button>
          </div>
        </div>
      </div>

      {/* Custom CSS for animations */}
      <style jsx>{`
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }

        .animate-fade-in {
          animation: fade-in 0.6s ease-out;
        }

        .animate-fade-in-delay {
          animation: fade-in 0.6s ease-out 0.2s both;
        }
      `}</style>
    </div>
  )
}

export default LocalMarket
