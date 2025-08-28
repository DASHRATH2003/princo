import React, { useState, useEffect } from 'react'

const Printing = () => {
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [hoveredService, setHoveredService] = useState(null)
  const [activeTab, setActiveTab] = useState('services')
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    setIsVisible(true)
  }, [])

  const printingServices = [
    {
      id: 1,
      name: "Business Cards",
      description: "Professional business cards with premium finish",
      price: "₹299",
      originalPrice: "₹399",
      category: "Business",
      imageUrl: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
      features: ["Premium Paper", "Multiple Designs", "Fast Delivery"],
      rating: 4.8,
      reviews: 156,
      deliveryTime: "2-3 days",
      popular: true
    },
    {
      id: 2,
      name: "Flyers & Brochures",
      description: "Eye-catching marketing materials",
      price: "₹199",
      originalPrice: "₹249",
      category: "Marketing",
      imageUrl: "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
      features: ["High Quality Print", "Custom Design", "Bulk Orders"],
      rating: 4.6,
      reviews: 89,
      deliveryTime: "1-2 days",
      popular: false
    },
    {
      id: 3,
      name: "Banners & Posters",
      description: "Large format printing for events and promotions",
      price: "₹599",
      originalPrice: "₹799",
      category: "Large Format",
      imageUrl: "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
      features: ["Weather Resistant", "Various Sizes", "Vibrant Colors"],
      rating: 4.9,
      reviews: 234,
      deliveryTime: "3-5 days",
      popular: true
    },
    {
      id: 4,
      name: "Letterheads",
      description: "Professional letterheads for your business",
      price: "₹149",
      originalPrice: "₹199",
      category: "Business",
      imageUrl: "https://images.unsplash.com/photo-1586281380349-632531db7ed4?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
      features: ["Corporate Design", "Premium Paper", "Watermark Option"],
      rating: 4.5,
      reviews: 67,
      deliveryTime: "2-3 days",
      popular: false
    },
    {
      id: 5,
      name: "Stickers & Labels",
      description: "Custom stickers and labels for any purpose",
      price: "₹99",
      originalPrice: "₹129",
      category: "Custom",
      imageUrl: "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
      features: ["Waterproof", "Die Cut", "Various Shapes"],
      rating: 4.7,
      reviews: 123,
      deliveryTime: "1-2 days",
      popular: false
    },
    {
      id: 6,
      name: "Invitations",
      description: "Beautiful invitations for special occasions",
      price: "₹249",
      originalPrice: "₹299",
      category: "Personal",
      imageUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
      features: ["Elegant Design", "RSVP Cards", "Envelope Included"],
      rating: 4.8,
      reviews: 98,
      deliveryTime: "3-4 days",
      popular: true
    }
  ]

  const categories = [
    { id: 'all', name: 'All Services', icon: '🎯' },
    { id: 'Business', name: 'Business', icon: '💼' },
    { id: 'Marketing', name: 'Marketing', icon: '📢' },
    { id: 'Large Format', name: 'Large Format', icon: '🖼️' },
    { id: 'Custom', name: 'Custom', icon: '✨' },
    { id: 'Personal', name: 'Personal', icon: '🎉' }
  ]

  const testimonials = [
    {
      id: 1,
      name: "Sarah Johnson",
      company: "Tech Startup Inc.",
      rating: 5,
      comment: "Exceptional quality and fast delivery. Our business cards look absolutely professional!",
      avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80"
    },
    {
      id: 2,
      name: "Michael Chen",
      company: "Design Agency",
      rating: 5,
      comment: "The banner quality exceeded our expectations. Perfect for our event!",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80"
    },
    {
      id: 3,
      name: "Emily Rodriguez",
      company: "Wedding Planner",
      rating: 5,
      comment: "Beautiful invitation cards with elegant finishing. Highly recommended!",
      avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80"
    }
  ]

  const filteredServices = selectedCategory === 'all' 
    ? printingServices 
    : printingServices.filter(service => service.category === selectedCategory)

  const popularServices = printingServices.filter(service => service.popular)

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section with Interactive Elements */}
      <div className="relative bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-800 text-white py-12 overflow-hidden">
        {/* Animated Background */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-black opacity-20"></div>
          <div className="absolute inset-0" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23ffffff' fill-opacity='0.03'%3E%3Cpolygon points='50 0 60 40 100 50 60 60 50 100 40 60 0 50 40 40'/%3E%3C/g%3E%3C/svg%3E")`
          }}></div>
          {/* Floating Elements */}
          <div className="absolute top-20 left-10 w-20 h-20 bg-white opacity-5 rounded-full animate-float"></div>
          <div className="absolute top-40 right-20 w-16 h-16 bg-white opacity-5 rounded-full animate-float-delayed"></div>
          <div className="absolute bottom-20 left-1/4 w-12 h-12 bg-white opacity-5 rounded-full animate-float"></div>
        </div>
        
        <div className="max-w-7xl mx-auto px-4 relative z-10">
          <div className={`text-center transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            <div className="inline-flex items-center bg-white bg-opacity-10 backdrop-blur-sm rounded-full px-6 py-2 mb-3">
              <span className="text-sm font-medium">🎨 Premium Printing Solutions</span>
            </div>
            <h1 className="text-6xl md:text-7xl font-bold mb-3 bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
              Print Your
              <span className="block text-transparent bg-gradient-to-r from-pink-400 to-purple-400 bg-clip-text">
                Vision
              </span>
            </h1>
            <p className="text-xl md:text-2xl mb-4 max-w-4xl mx-auto text-gray-200 leading-relaxed">
              Transform your ideas into stunning printed materials with our cutting-edge technology and premium quality services.
            </p>
            <div className="flex flex-col sm:flex-row justify-center items-center space-y-4 sm:space-y-0 sm:space-x-6">
              <button className="group bg-gradient-to-r from-pink-500 to-purple-600 text-white px-10 py-4 rounded-full font-semibold hover:from-pink-600 hover:to-purple-700 transition-all duration-300 transform hover:scale-105 shadow-2xl hover:shadow-pink-500/25">
                <span className="flex items-center">
                  Start Printing
                  <svg className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </span>
              </button>
              <button className="group border-2 border-white text-white px-10 py-4 rounded-full font-semibold hover:bg-white hover:text-purple-900 transition-all duration-300 transform hover:scale-105 backdrop-blur-sm">
                <span className="flex items-center">
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h1m4 0h1m-6 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  View Portfolio
                </span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Interactive Tabs Section */}
      <div className="py-8 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-6">
            <h2 className="text-4xl font-bold mb-2 bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
              Explore Our Services
            </h2>
            <p className="text-xl text-gray-600">
              Choose from our comprehensive range of printing solutions
            </p>
          </div>
          
          {/* Tab Navigation */}
          <div className="flex flex-wrap justify-center mb-6 bg-gray-100 rounded-2xl p-2 max-w-4xl mx-auto">
            {['services', 'popular', 'process'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-8 py-3 rounded-xl font-medium transition-all duration-300 capitalize ${
                  activeTab === tab
                    ? 'bg-white text-purple-600 shadow-lg transform scale-105'
                    : 'text-gray-600 hover:text-purple-600'
                }`}
              >
                {tab === 'services' ? '🎯 All Services' : tab === 'popular' ? '⭐ Popular' : '🔄 Process'}
              </button>
            ))}
          </div>

          {/* Tab Content */}
          {activeTab === 'services' && (
            <div className="animate-fade-in">
              {/* Category Filters */}
              <div className="flex flex-wrap justify-center gap-4 mb-6">
                {categories.map((category) => (
                  <button
                    key={category.id}
                    onClick={() => setSelectedCategory(category.id)}
                    className={`group flex items-center px-6 py-3 rounded-full font-medium transition-all duration-300 transform hover:scale-105 ${
                      selectedCategory === category.id
                        ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg'
                        : 'bg-white text-gray-700 hover:bg-purple-50 hover:text-purple-600 border border-gray-200'
                    }`}
                  >
                    <span className="mr-2 text-lg">{category.icon}</span>
                    {category.name}
                  </button>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'popular' && (
            <div className="text-center mb-4 animate-fade-in">
              <div className="inline-flex items-center bg-gradient-to-r from-yellow-100 to-orange-100 rounded-full px-6 py-3">
                <span className="text-2xl mr-2">🔥</span>
                <span className="font-semibold text-gray-800">Most Popular Services</span>
              </div>
            </div>
          )}

          {activeTab === 'process' && (
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8 animate-fade-in">
              {[
                { step: '01', title: 'Choose Service', desc: 'Select from our range of printing services', icon: '🎯' },
                { step: '02', title: 'Upload Design', desc: 'Upload your design or let us create one', icon: '📤' },
                { step: '03', title: 'Review & Pay', desc: 'Review your order and make payment', icon: '💳' },
                { step: '04', title: 'Get Delivered', desc: 'Receive your prints at your doorstep', icon: '🚚' }
              ].map((item, index) => (
                <div key={index} className="text-center group">
                  <div className="relative mb-3">
                    <div className="w-20 h-20 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                      <span className="text-2xl">{item.icon}</span>
                    </div>
                    <div className="absolute -top-2 -right-2 w-8 h-8 bg-white rounded-full flex items-center justify-center text-sm font-bold text-purple-600 shadow-lg">
                      {item.step}
                    </div>
                  </div>
                  <h3 className="text-lg font-semibold mb-2 text-gray-800">{item.title}</h3>
                  <p className="text-gray-600 text-sm">{item.desc}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Services Grid */}
      <div className="py-8 bg-gradient-to-br from-gray-50 to-purple-50">
        <div className="max-w-7xl mx-auto px-4">
          {(activeTab === 'services' || activeTab === 'popular') && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {(activeTab === 'popular' 
                ? printingServices.filter(service => service.popular)
                : selectedCategory === 'all' 
                  ? printingServices 
                  : printingServices.filter(service => service.category === selectedCategory)
              ).map((service, index) => (
                <div 
                  key={index} 
                  className="group relative bg-white rounded-3xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 animate-fade-in-delay" 
                  style={{animationDelay: `${index * 0.1}s`}}
                  onMouseEnter={() => setHoveredService(index)}
                  onMouseLeave={() => setHoveredService(null)}
                >
                  {/* Popular Badge */}
                  {service.popular && (
                    <div className="absolute top-4 left-4 z-10 bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-3 py-1 rounded-full text-xs font-bold flex items-center">
                      <span className="mr-1">🔥</span>
                      POPULAR
                    </div>
                  )}
                  
                  {/* Discount Badge */}
                  {service.originalPrice && (
                    <div className="absolute top-4 right-4 z-10 bg-red-500 text-white px-3 py-1 rounded-full text-xs font-bold">
                      SAVE {Math.round(((parseFloat(service.originalPrice.replace('₹', '')) - parseFloat(service.price.replace('₹', ''))) / parseFloat(service.originalPrice.replace('₹', ''))) * 100)}%
                    </div>
                  )}

                  <div className="relative overflow-hidden">
                    <img 
                      src={service.imageUrl} 
                      alt={service.name} 
                      className={`w-full h-56 object-cover transition-transform duration-500 ${
                        hoveredService === index ? 'scale-110' : 'scale-100'
                      }`} 
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  </div>
                  
                  <div className="p-6">
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="text-xl font-bold text-gray-800 group-hover:text-purple-600 transition-colors duration-300">
                        {service.name}
                      </h3>
                      <div className="flex items-center text-yellow-400">
                        <span className="text-sm font-medium mr-1">{service.rating}</span>
                        <svg className="w-4 h-4 fill-current" viewBox="0 0 20 20">
                          <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z"/>
                        </svg>
                        <span className="text-xs text-gray-500 ml-1">({service.reviews})</span>
                      </div>
                    </div>
                    
                    <p className="text-gray-600 mb-2 text-sm leading-relaxed">{service.description}</p>
                    
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center space-x-2">
                        <span className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                          {service.price}
                        </span>
                        {service.originalPrice && (
                          <span className="text-sm text-gray-400 line-through">{service.originalPrice}</span>
                        )}
                      </div>
                      <div className="flex items-center text-green-600 text-sm font-medium">
                        <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                        </svg>
                        {service.deliveryTime}
                      </div>
                    </div>
                    
                    <div className="space-y-1 mb-3">
                      {service.features.slice(0, 3).map((feature, idx) => (
                        <div key={idx} className="flex items-center text-sm text-gray-600">
                          <div className="w-2 h-2 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full mr-3 flex-shrink-0" />
                          {feature}
                        </div>
                      ))}
                    </div>
                    
                    <div className="flex space-x-3">
                      <button className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 text-white py-3 px-4 rounded-xl font-medium hover:from-purple-700 hover:to-pink-700 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl">
                        Order Now
                      </button>
                      <button className="px-4 py-3 border-2 border-purple-200 text-purple-600 rounded-xl hover:bg-purple-50 transition-all duration-300 group">
                        <svg className="w-5 h-5 group-hover:scale-110 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Process Section */}
      <div className="py-8 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-6">
            <h2 className="text-4xl font-bold mb-2 animate-fade-in">How It Works</h2>
            <p className="text-xl text-gray-600 animate-fade-in-delay">Simple 4-step process to get your prints</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {[
              { step: "1", title: "Upload Design", desc: "Upload your design files or use our templates" },
              { step: "2", title: "Choose Options", desc: "Select paper type, size, and quantity" },
              { step: "3", title: "Review & Pay", desc: "Review your order and make payment" },
              { step: "4", title: "Get Delivery", desc: "Receive your prints at your doorstep" }
            ].map((item, index) => (
              <div key={index} className="text-center animate-fade-in-delay" style={{animationDelay: `${index * 0.1}s`}}>
                <div className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-2 text-white text-xl font-bold">
                  {item.step}
                </div>
                <h3 className="text-lg font-semibold mb-1">{item.title}</h3>
                <p className="text-gray-600">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Testimonials Section */}
      <div className="py-8 bg-gradient-to-br from-purple-50 to-pink-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-6">
            <h2 className="text-4xl font-bold mb-2 bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
              What Our Customers Say
            </h2>
            <p className="text-xl text-gray-600">
              Trusted by thousands of satisfied customers
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div 
                key={testimonial.id} 
                className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 animate-fade-in-delay"
                style={{animationDelay: `${index * 0.1}s`}}
              >
                <div className="flex items-center mb-2">
                  <img 
                    src={testimonial.avatar} 
                    alt={testimonial.name}
                    className="w-12 h-12 rounded-full object-cover mr-4"
                  />
                  <div>
                    <h4 className="font-semibold text-gray-800">{testimonial.name}</h4>
                    <p className="text-sm text-gray-600">{testimonial.company}</p>
                  </div>
                </div>
                
                <div className="flex items-center mb-2">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <svg key={i} className="w-5 h-5 text-yellow-400 fill-current" viewBox="0 0 20 20">
                      <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z"/>
                    </svg>
                  ))}
                </div>
                
                <p className="text-gray-700 italic leading-relaxed">
                  "{testimonial.comment}"
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Enhanced CTA Section */}
      <div className="py-10 bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-800 text-white relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='4'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
          }}></div>
        </div>
        
        <div className="max-w-7xl mx-auto px-4 text-center relative z-10">
          <div className="max-w-4xl mx-auto">
            <div className="inline-flex items-center bg-white bg-opacity-10 backdrop-blur-sm rounded-full px-6 py-2 mb-3">
              <span className="text-sm font-medium">🚀 Start Your Print Journey</span>
            </div>
            
            <h2 className="text-5xl md:text-6xl font-bold mb-3 bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
              Ready to Print Your
              <span className="block text-transparent bg-gradient-to-r from-pink-400 to-purple-400 bg-clip-text">
                Success Story?
              </span>
            </h2>
            
            <p className="text-xl md:text-2xl mb-5 text-gray-200 leading-relaxed">
              Join thousands of satisfied customers who trust us with their printing needs. 
              Get professional quality prints delivered to your doorstep.
            </p>
            
            <div className="flex flex-col sm:flex-row justify-center items-center space-y-4 sm:space-y-0 sm:space-x-6 mb-6">
              <button className="group bg-gradient-to-r from-pink-500 to-purple-600 text-white px-12 py-4 rounded-full font-semibold hover:from-pink-600 hover:to-purple-700 transition-all duration-300 transform hover:scale-105 shadow-2xl hover:shadow-pink-500/25">
                <span className="flex items-center">
                  Start Your Order
                  <svg className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </span>
              </button>
              
              <button className="group border-2 border-white text-white px-12 py-4 rounded-full font-semibold hover:bg-white hover:text-purple-900 transition-all duration-300 transform hover:scale-105 backdrop-blur-sm">
                <span className="flex items-center">
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                  Get Free Quote
                </span>
              </button>
            </div>
            
            {/* Trust Indicators */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
              <div className="group">
                <div className="text-3xl font-bold mb-0 group-hover:scale-110 transition-transform duration-300">10K+</div>
                <div className="text-sm text-gray-300">Happy Customers</div>
              </div>
              <div className="group">
                <div className="text-3xl font-bold mb-0 group-hover:scale-110 transition-transform duration-300">24/7</div>
                <div className="text-sm text-gray-300">Support Available</div>
              </div>
              <div className="group">
                <div className="text-3xl font-bold mb-0 group-hover:scale-110 transition-transform duration-300">2-3</div>
                <div className="text-sm text-gray-300">Days Delivery</div>
              </div>
              <div className="group">
                <div className="text-3xl font-bold mb-0 group-hover:scale-110 transition-transform duration-300">100%</div>
                <div className="text-sm text-gray-300">Quality Guarantee</div>
              </div>
            </div>
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

export default Printing
