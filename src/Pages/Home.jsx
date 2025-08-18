import React from "react";
import { Link } from "react-router-dom";

const Home = () => {
  const allProducts = [
    {
      id: 1,
      name: "Business Cards",
      description: "Premium quality printing",
      price: "₹299",
      category: "Printing",
      imageUrl:
        "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
      relatedProducts: [2, 9, 10],
      featured: true,
    },
    {
      id: 2,
      name: "Premium Paper",
      description: "A4 size, 100 sheets",
      price: "₹150",
      category: "Office Supplies",
      imageUrl:
        "https://images.unsplash.com/photo-1586281380349-632531db7ed4?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
      relatedProducts: [1, 9, 10],
      featured: true,
    },
    {
      id: 3,
      name: "Digital Marketing",
      description: "Complete package",
      price: "₹4999",
      category: "Digital Services",
      imageUrl:
        "https://images.unsplash.com/photo-1557838923-2985c318be48?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
      relatedProducts: [5, 8, 11],
      featured: true,
    },
    {
      id: 4,
      name: "Banner Printing",
      description: "Large format printing",
      price: "₹899",
      category: "Printing",
      imageUrl:
        "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
      relatedProducts: [1, 7, 9],
      featured: true,
    },
    {
      id: 5,
      name: "Website Design",
      description: "Professional website design",
      price: "₹15,999",
      category: "Digital Services",
      imageUrl:
        "https://images.unsplash.com/photo-1460925895917-afdab827c52f?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
      relatedProducts: [6, 11, 12],
      featured: false,
    },
    {
      id: 6,
      name: "Logo Design",
      description: "Custom logo design",
      price: "₹2,999",
      category: "Digital Services",
      imageUrl:
        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
      relatedProducts: [5, 8, 12],
      featured: false,
    },
    {
      id: 7,
      name: "T-Shirt Printing",
      description: "Custom t-shirt printing",
      price: "₹399",
      category: "Printing",
      imageUrl:
        "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
      relatedProducts: [1, 4, 9],
      featured: false,
    },
    {
      id: 8,
      name: "Social Media Management",
      description: "Monthly management",
      price: "₹4,999",
      category: "Digital Services",
      imageUrl:
        "https://images.unsplash.com/photo-1557838923-2985c318be48?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
      relatedProducts: [3, 6, 12],
      featured: false,
    },
    {
      id: 9,
      name: "Stickers & Labels",
      description: "Custom stickers",
      price: "₹99",
      category: "Printing",
      imageUrl:
        "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
      relatedProducts: [1, 4, 7],
      featured: false,
    },
    {
      id: 10,
      name: "Photo Printing",
      description: "High-quality photos",
      price: "₹149",
      category: "Printing",
      imageUrl:
        "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
      relatedProducts: [1, 2, 9],
      featured: false,
    },
    {
      id: 11,
      name: "E-commerce Setup",
      description: "Complete setup",
      price: "₹12,999",
      category: "Digital Services",
      imageUrl:
        "https://images.unsplash.com/photo-1460925895917-afdab827c52f?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
      relatedProducts: [5, 6, 12],
      featured: false,
    },
    {
      id: 12,
      name: "Content Writing",
      description: "Professional content",
      price: "₹1,999",
      category: "Digital Services",
      imageUrl:
        "https://images.unsplash.com/photo-1586281380349-632531db7ed4?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
      relatedProducts: [5, 6, 8],
      featured: false,
    },
  ];

  const featuredProducts = allProducts.filter((product) => product.featured);
  const otherProducts = allProducts.filter((product) => !product.featured);

  return (
    <div className="min-h-screen bg-white relative overflow-hidden">
      {/* Hero Section */}
      <div className="relative z-10 flex flex-col lg:flex-row min-h-screen">
        {/* Left Side - White Space with Wavy Line */}
        <div className="flex-1 relative min-h-[55vh] lg:min-h-screen">
          {/* Wavy Line */}
          <div className="absolute top-0 left-0 w-full h-full">
            <svg
              className="w-full h-full"
              viewBox="0 0 100 100"
              preserveAspectRatio="none"
            >
              <path
                d="M0,20 Q25,10 50,20 T100,20 L100,100 L0,100 Z"
                fill="url(#wavyGradient)"
                opacity="0.3"
              />
              <defs>
                <linearGradient
                  id="wavyGradient"
                  x1="0%"
                  y1="0%"
                  x2="100%"
                  y2="0%"
                >
                  <stop offset="0%" stopColor="#60A5FA" />
                  <stop offset="100%" stopColor="#34D399" />
                </linearGradient>
              </defs>
            </svg>
          </div>

          {/* Hero Content */}
          <div className="absolute inset-0 flex flex-col justify-start px-4 sm:px-8 lg:px-12 pt-10 sm:pt-16">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-800 mb-3 lg:mb-4 animate-fade-in">
              Welcome to <span className="text-purple-600">PrintCo</span>
            </h1>
            <p className="text-lg sm:text-xl text-gray-600 mb-4 lg:mb-6 max-w-md animate-fade-in-delay">
              Your one-stop destination for all printing needs, office supplies,
              and digital solutions
            </p>
            <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4 animate-fade-in-delay-2">
                                   <button 
                                     onClick={() => document.getElementById('featured-products').scrollIntoView({ behavior: 'smooth' })}
                                     className="bg-gradient-to-r from-blue-400 to-blue-600 text-white px-6 sm:px-8 py-3 rounded-lg hover:from-blue-500 hover:to-blue-700 transition transform hover:scale-105 shadow-lg"
                                   >
                       Shop Now
                     </button>
            </div>
          </div>

          {/* Community Icon at Bottom Left */}
          <div className="absolute bottom-4 sm:bottom-8 left-4 sm:left-8 animate-bounce">
            <div className="w-8 h-8 sm:w-12 sm:h-12 bg-gradient-to-r from-blue-400 to-blue-500 rounded-full flex items-center justify-center shadow-lg">
              <svg
                className="w-4 h-4 sm:w-6 sm:h-6 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                />
              </svg>
            </div>
          </div>
        </div>

        {/* Right Side - Orange Background with Circular Graphic */}
        <div className="flex-1 mt-[-100px] bg-gradient-to-br from-orange-400 to-yellow-400 relative min-h-[20vh] sm:min-h-[30vh] lg:min-h-screen">
          {/* Large Circular Graphic */}
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 animate-pulse">
            <div className="relative">
              {/* Outer Circle with Segments */}
              <div className="w-48 h-48 sm:w-64 sm:h-64 lg:w-80 lg:h-80 rounded-full bg-white relative overflow-hidden">
                {/* Blue/Teal Segment */}
                <div className="absolute top-0 left-0 w-1/2 h-1/2 bg-gradient-to-br from-blue-400 to-teal-400 rounded-tl-full"></div>

                {/* Black Segment */}
                <div className="absolute bottom-0 right-0 w-1/2 h-1/2 bg-black rounded-br-full"></div>

                {/* Inner Rings */}
                <div className="absolute top-2 sm:top-4 left-2 sm:left-4 w-44 h-44 sm:w-56 sm:h-56 lg:w-72 lg:h-72 rounded-full border-4 sm:border-8 border-white"></div>
                <div className="absolute top-4 sm:top-8 left-4 sm:left-8 w-40 h-40 sm:w-48 sm:h-48 lg:w-64 lg:h-64 rounded-full border-2 sm:border-4 border-blue-300"></div>
                <div className="absolute top-6 sm:top-12 left-6 sm:left-12 w-36 h-36 sm:w-40 sm:h-40 lg:w-56 lg:h-56 rounded-full border-2 border-blue-200"></div>

                {/* Content Area */}
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <div className="text-center space-y-1 sm:space-y-2">
                    <div className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-700">
                      Featured
                    </div>
                    <div className="text-base sm:text-lg lg:text-xl font-semibold text-gray-600">
                      Products
                    </div>
                    <div className="text-sm sm:text-base lg:text-lg font-medium text-gray-500">
                      50% OFF
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Categories Section */}
      <div className="py-8 sm:py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-2xl sm:text-3xl font-bold text-center mb-8 sm:mb-12 animate-fade-in">
            Shop by Category
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {/* Printing Category */}
            <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition transform hover:scale-105 animate-fade-in-delay">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mb-4">
                <svg
                  className="w-8 h-8 text-purple-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Printing Services</h3>
              <p className="text-gray-600 mb-4">
                Business cards, banners, flyers, and more
              </p>
              <Link
                to="/printing"
                className="text-blue-500 hover:text-blue-600 font-medium transition-colors"
              >
                Explore →
              </Link>
            </div>

            {/* Office Supplies */}
            <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition transform hover:scale-105 animate-fade-in-delay">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                <svg
                  className="w-8 h-8 text-blue-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Office Supplies</h3>
              <p className="text-gray-600 mb-4">
                Papers, pens, notebooks, and stationery
              </p>
              <Link
                to="/local-market"
                className="text-blue-500 hover:text-blue-600 font-medium transition-colors"
              >
                Explore →
              </Link>
            </div>

            {/* Digital Solutions */}
            <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition transform hover:scale-105 animate-fade-in-delay">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
                <svg
                  className="w-8 h-8 text-green-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Digital Solutions</h3>
              <p className="text-gray-600 mb-4">
                Web design, digital marketing, and IT services
              </p>
              <Link
                to="/e-market"
                className="text-blue-500 hover:text-blue-600 font-medium transition-colors"
              >
                Explore →
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Featured Products */}
      <div id="featured-products" className="py-8 sm:py-16">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-2xl sm:text-3xl font-bold text-center mb-8 sm:mb-12 animate-fade-in">
            Featured Products
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {featuredProducts.map((product, index) => (
              <div
                key={product.id}
                className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition transform hover:scale-105 animate-fade-in-delay"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="h-32 sm:h-48 relative overflow-hidden">
                  <img
                    src={product.imageUrl}
                    alt={product.name}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-20"></div>
                </div>
                <div className="p-3 sm:p-4">
                  <div className="flex justify-between items-start mb-1 sm:mb-2">
                    <h3 className="font-semibold text-sm sm:text-base">
                      {product.name}
                    </h3>
                    <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                      {product.category}
                    </span>
                  </div>
                  <p className="text-gray-600 text-xs sm:text-sm mb-2">
                    {product.description}
                  </p>
                  <div className="flex justify-between items-center">
                    <span className="text-blue-500 font-bold text-sm sm:text-base">
                      {product.price}
                    </span>
                    <button className="bg-blue-400 hover:bg-blue-500 text-white px-2 sm:px-3 py-1 rounded text-xs sm:text-sm transition">
                      Add to Cart
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* All Products Section */}
      <div className="py-8 sm:py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-2xl sm:text-3xl font-bold text-center mb-8 sm:mb-12 animate-fade-in">
            All Products
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
            {otherProducts.map((product, index) => (
              <div
                key={product.id}
                className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition transform hover:scale-105 animate-fade-in-delay"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="h-32 sm:h-48 relative overflow-hidden">
                  <img
                    src={product.imageUrl}
                    alt={product.name}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-20"></div>
                </div>
                <div className="p-3 sm:p-4">
                  <div className="flex justify-between items-start mb-1 sm:mb-2">
                    <h3 className="font-semibold text-sm sm:text-base">
                      {product.name}
                    </h3>
                    <span
                      className={`text-xs px-2 py-1 rounded ${
                        product.category === "Printing"
                          ? "bg-blue-100 text-blue-800"
                          : product.category === "Office Supplies"
                          ? "bg-blue-100 text-blue-800"
                          : "bg-blue-100 text-blue-800"
                      }`}
                    >
                      {product.category}
                    </span>
                  </div>
                  <p className="text-gray-600 text-xs sm:text-sm mb-2">
                    {product.description}
                  </p>
                  <div className="flex justify-between items-center">
                    <span className="text-blue-500 font-bold text-sm sm:text-base">
                      {product.price}
                    </span>
                    <button className="bg-blue-400 hover:bg-blue-500 px-2 sm:px-3 py-1 rounded text-xs sm:text-sm text-white transition">
                      Add to Cart
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Related Products Section */}
      <div className="py-8 sm:py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-2xl sm:text-3xl font-bold text-center mb-8 sm:mb-12 animate-fade-in">
            You Might Also Like
          </h2>
          <p className="text-gray-600 text-center mb-8 sm:mb-12 max-w-2xl mx-auto animate-fade-in-delay">
            Discover related products that complement your needs
          </p>

          {/* Related Products Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {/* Related Product 1 */}
            <div className="group relative overflow-hidden rounded-lg shadow-md hover:shadow-lg transition-all duration-300 animate-fade-in-delay">
              <div className="h-48 relative overflow-hidden">
                <img
                  src="https://images.unsplash.com/photo-1558618666-fcd25c85cd64?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80"
                  alt="Business Cards"
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
                <div className="absolute top-2 right-2">
                  <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                    Popular
                  </span>
                </div>
              </div>
              <div className="p-4">
                <h3 className="font-semibold text-lg mb-2">Business Cards</h3>
                <p className="text-gray-600 text-sm mb-3">
                  Premium quality printing with custom designs
                </p>
                <div className="flex justify-between items-center">
                  <span className="text-blue-500 font-bold">₹299</span>
                  <button className="bg-blue-400 text-white px-4 py-2 rounded-lg hover:bg-blue-500 transition">
                    Add to Cart
                  </button>
                </div>
              </div>
            </div>

            {/* Related Product 2 */}
            <div
              className="group relative overflow-hidden rounded-lg shadow-md hover:shadow-lg transition-all duration-300 animate-fade-in-delay"
              style={{ animationDelay: "0.1s" }}
            >
              <div className="h-48 relative overflow-hidden">
                <img
                  src="https://images.unsplash.com/photo-1586281380349-632531db7ed4?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80"
                  alt="Premium Paper"
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
                <div className="absolute top-2 right-2">
                  <span className="bg-green-500 text-white text-xs px-2 py-1 rounded-full">
                    Best Seller
                  </span>
                </div>
              </div>
              <div className="p-4">
                <h3 className="font-semibold text-lg mb-2">Premium Paper</h3>
                <p className="text-gray-600 text-sm mb-3">
                  A4 size, 100 sheets high quality
                </p>
                <div className="flex justify-between items-center">
                  <span className="text-blue-500 font-bold">₹150</span>
                  <button className="bg-blue-400 text-white px-4 py-2 rounded-lg hover:bg-blue-500 transition">
                    Add to Cart
                  </button>
                </div>
              </div>
            </div>

            {/* Related Product 3 */}
            <div
              className="group relative overflow-hidden rounded-lg shadow-md hover:shadow-lg transition-all duration-300 animate-fade-in-delay"
              style={{ animationDelay: "0.2s" }}
            >
              <div className="h-48 relative overflow-hidden">
                <img
                  src="https://images.unsplash.com/photo-1557838923-2985c318be48?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80"
                  alt="Digital Marketing"
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
                <div className="absolute top-2 right-2">
                  <span className="bg-blue-500 text-white text-xs px-2 py-1 rounded-full">
                    Trending
                  </span>
                </div>
              </div>
              <div className="p-4">
                <h3 className="font-semibold text-lg mb-2">
                  Digital Marketing
                </h3>
                <p className="text-gray-600 text-sm mb-3">
                  Complete digital marketing package
                </p>
                <div className="flex justify-between items-center">
                  <span className="text-blue-500 font-bold">₹4,999</span>
                  <button className="bg-blue-400 text-white px-4 py-2 rounded-lg hover:bg-blue-500 transition">
                    Add to Cart
                  </button>
                </div>
              </div>
            </div>

            {/* Related Product 4 */}
            <div
              className="group relative overflow-hidden rounded-lg shadow-md hover:shadow-lg transition-all duration-300 animate-fade-in-delay"
              style={{ animationDelay: "0.3s" }}
            >
              <div className="h-48 relative overflow-hidden">
                <img
                  src="https://images.unsplash.com/photo-1560472354-b33ff0c44a43?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80"
                  alt="Banner Printing"
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
                <div className="absolute top-2 right-2">
                  <span className="bg-orange-500 text-white text-xs px-2 py-1 rounded-full">
                    New
                  </span>
                </div>
              </div>
              <div className="p-4">
                <h3 className="font-semibold text-lg mb-2">Banner Printing</h3>
                <p className="text-gray-600 text-sm mb-3">
                  Large format printing for events
                </p>
                <div className="flex justify-between items-center">
                  <span className="text-blue-500 font-bold">₹899</span>
                  <button className="bg-blue-400 text-white px-4 py-2 rounded-lg hover:bg-blue-500 transition">
                    Add to Cart
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* View More Button */}
          <div
            className="text-center mt-8 animate-fade-in-delay"
            style={{ animationDelay: "0.4s" }}
          >
            <button className="bg-gradient-to-r from-blue-400 to-blue-600 text-white px-8 py-3 rounded-lg hover:from-blue-500 hover:to-blue-700 transition-all duration-300 transform hover:scale-105 shadow-lg">
              View More Products
            </button>
          </div>
        </div>
      </div>

      {/* Image Gallery Section */}
      <div className="py-8 sm:py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-2xl sm:text-3xl font-bold text-center mb-8 sm:mb-12 animate-fade-in">
            Our Work Gallery
          </h2>
          <p className="text-gray-600 text-center mb-8 sm:mb-12 max-w-2xl mx-auto animate-fade-in-delay">
            Explore our portfolio of successful projects and creative designs
          </p>

          {/* Gallery Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-8">
            {/* Business Cards */}
            <div className="group relative overflow-hidden rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 animate-fade-in-delay">
              <img
                src="https://images.unsplash.com/photo-1558618666-fcd25c85cd64?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80"
                alt="Business Cards"
                className="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-300"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent"></div>
              <div className="absolute bottom-0 left-0 right-0 p-4 text-white transform translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                <h3 className="text-lg font-semibold mb-2">Business Cards</h3>
                <p className="text-sm opacity-90">
                  Premium quality printing with custom designs
                </p>
              </div>
            </div>

            {/* Website Design */}
            <div
              className="group relative overflow-hidden rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 animate-fade-in-delay"
              style={{ animationDelay: "0.1s" }}
            >
              <img
                src="https://images.unsplash.com/photo-1460925895917-afdab827c52f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80"
                alt="Website Design"
                className="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-300"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent"></div>
              <div className="absolute bottom-0 left-0 right-0 p-4 text-white transform translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                <h3 className="text-lg font-semibold mb-2">Website Design</h3>
                <p className="text-sm opacity-90">
                  Modern and responsive web solutions
                </p>
              </div>
            </div>

            {/* Banner Printing */}
            <div
              className="group relative overflow-hidden rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 animate-fade-in-delay"
              style={{ animationDelay: "0.2s" }}
            >
              <img
                src="https://images.unsplash.com/photo-1560472354-b33ff0c44a43?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80"
                alt="Banner Printing"
                className="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-300"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent"></div>
              <div className="absolute bottom-0 left-0 right-0 p-4 text-white transform translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                <h3 className="text-lg font-semibold mb-2">Banner Printing</h3>
                <p className="text-sm opacity-90">
                  Large format printing for events
                </p>
              </div>
            </div>

            {/* Office Supplies */}
            <div
              className="group relative overflow-hidden rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 animate-fade-in-delay"
              style={{ animationDelay: "0.3s" }}
            >
              <img
                src="https://images.unsplash.com/photo-1586281380349-632531db7ed4?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80"
                alt="Office Supplies"
                className="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-300"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent"></div>
              <div className="absolute bottom-0 left-0 right-0 p-4 text-white transform translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                <h3 className="text-lg font-semibold mb-2">Office Supplies</h3>
                <p className="text-sm opacity-90">Complete office solutions</p>
              </div>
            </div>

            {/* Digital Marketing */}
            <div
              className="group relative overflow-hidden rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 animate-fade-in-delay"
              style={{ animationDelay: "0.4s" }}
            >
              <img
                src="https://images.unsplash.com/photo-1557838923-2985c318be48?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80"
                alt="Digital Marketing"
                className="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-300"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent"></div>
              <div className="absolute bottom-0 left-0 right-0 p-4 text-white transform translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                <h3 className="text-lg font-semibold mb-2">
                  Digital Marketing
                </h3>
                <p className="text-sm opacity-90">Complete digital solutions</p>
              </div>
            </div>

            {/* Custom Printing */}
            <div
              className="group relative overflow-hidden rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 animate-fade-in-delay"
              style={{ animationDelay: "0.5s" }}
            >
              <img
                src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80"
                alt="Custom Printing"
                className="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-300"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent"></div>
              <div className="absolute bottom-0 left-0 right-0 p-4 text-white transform translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                <h3 className="text-lg font-semibold mb-2">Custom Printing</h3>
                <p className="text-sm opacity-90">
                  Personalized printing services
                </p>
              </div>
            </div>
          </div>

          {/* Call to Action */}
          <div
            className="text-center animate-fade-in-delay"
            style={{ animationDelay: "0.6s" }}
          >
            <button className="bg-gradient-to-r from-blue-400 to-blue-600 text-white px-8 py-3 rounded-lg hover:from-blue-500 hover:to-blue-700 transition-all duration-300 transform hover:scale-105 shadow-lg">
              View Full Portfolio
            </button>
          </div>
        </div>
      </div>

      {/* Showcase Section */}
      <div className="py-8 sm:py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-2xl sm:text-3xl font-bold text-center mb-8 sm:mb-12 animate-fade-in">
            Our Latest Projects
          </h2>
          <p className="text-gray-600 text-center mb-8 sm:mb-12 max-w-2xl mx-auto animate-fade-in-delay">
            Take a look at some of our recent work and creative solutions
          </p>

          {/* Showcase Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-8">
            {/* Project 1 */}
            <div className="group relative overflow-hidden rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 animate-fade-in-delay">
              <img
                src="https://images.unsplash.com/photo-1542744173-8e7e53415bb0?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80"
                alt="Corporate Branding"
                className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-300"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
              <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
                <h3 className="text-lg font-semibold mb-1">
                  Corporate Branding
                </h3>
                <p className="text-sm opacity-90">
                  Complete brand identity design
                </p>
              </div>
            </div>

            {/* Project 2 */}
            <div
              className="group relative overflow-hidden rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 animate-fade-in-delay"
              style={{ animationDelay: "0.1s" }}
            >
              <img
                src="https://images.unsplash.com/photo-1558655146-d09347e92766?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80"
                alt="E-commerce Website"
                className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-300"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
              <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
                <h3 className="text-lg font-semibold mb-1">
                  E-commerce Website
                </h3>
                <p className="text-sm opacity-90">Modern online store design</p>
              </div>
            </div>

            {/* Project 3 */}
            <div
              className="group relative overflow-hidden rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 animate-fade-in-delay"
              style={{ animationDelay: "0.2s" }}
            >
              <img
                src="https://images.unsplash.com/photo-1563013544-824ae1b704d3?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80"
                alt="Marketing Campaign"
                className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-300"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
              <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
                <h3 className="text-lg font-semibold mb-1">
                  Marketing Campaign
                </h3>
                <p className="text-sm opacity-90">Digital marketing strategy</p>
              </div>
            </div>

            {/* Project 4 */}
            <div
              className="group relative overflow-hidden rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 animate-fade-in-delay"
              style={{ animationDelay: "0.3s" }}
            >
              <img
                src="https://images.unsplash.com/photo-1559136555-9303baea8ebd?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80"
                alt="Print Materials"
                className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-300"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
              <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
                <h3 className="text-lg font-semibold mb-1">Print Materials</h3>
                <p className="text-sm opacity-90">
                  High-quality printing solutions
                </p>
              </div>
            </div>
          </div>

          {/* Call to Action */}
          <div
            className="text-center animate-fade-in-delay"
            style={{ animationDelay: "0.4s" }}
          >
            <button className="bg-gradient-to-r from-blue-400 to-blue-600 text-white px-8 py-3 rounded-lg hover:from-blue-500 hover:to-blue-700 transition-all duration-300 transform hover:scale-105 shadow-lg">
              View All Projects
            </button>
          </div>
        </div>
      </div>

      {/* Testimonials Section */}
      <div className="py-8 sm:py-16 bg-gradient-to-r from-purple-50 to-blue-50">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-2xl sm:text-3xl font-bold text-center mb-8 sm:mb-12 animate-fade-in">
            What Our Clients Say
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
            {/* Testimonial 1 */}
            <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-all duration-300 animate-fade-in-delay">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-purple-400 to-pink-400 rounded-full flex items-center justify-center text-white font-bold text-lg mr-4">
                  R
                </div>
                <div>
                  <h4 className="font-semibold text-gray-800">Rahul Sharma</h4>
                  <p className="text-sm text-gray-600">Business Owner</p>
                </div>
              </div>
              <p className="text-gray-700 italic">
                "PrintCo delivered exceptional quality business cards that
                perfectly represent our brand. Highly recommended!"
              </p>
              <div className="flex text-yellow-400 mt-3">
                {[...Array(5)].map((_, i) => (
                  <svg
                    key={i}
                    className="w-4 h-4"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
            </div>

            {/* Testimonial 2 */}
            <div
              className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-all duration-300 animate-fade-in-delay"
              style={{ animationDelay: "0.1s" }}
            >
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-cyan-400 rounded-full flex items-center justify-center text-white font-bold text-lg mr-4">
                  P
                </div>
                <div>
                  <h4 className="font-semibold text-gray-800">Priya Patel</h4>
                  <p className="text-sm text-gray-600">Marketing Manager</p>
                </div>
              </div>
              <p className="text-gray-700 italic">
                "Their digital marketing services helped us increase our online
                presence significantly. Great team to work with!"
              </p>
              <div className="flex text-yellow-400 mt-3">
                {[...Array(5)].map((_, i) => (
                  <svg
                    key={i}
                    className="w-4 h-4"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
            </div>

            {/* Testimonial 3 */}
            <div
              className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-all duration-300 animate-fade-in-delay"
              style={{ animationDelay: "0.2s" }}
            >
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-green-400 to-emerald-400 rounded-full flex items-center justify-center text-white font-bold text-lg mr-4">
                  A
                </div>
                <div>
                  <h4 className="font-semibold text-gray-800">Amit Kumar</h4>
                  <p className="text-sm text-gray-600">Startup Founder</p>
                </div>
              </div>
              <p className="text-gray-700 italic">
                "Professional website design and excellent support. They
                understood our vision perfectly!"
              </p>
              <div className="flex text-yellow-400 mt-3">
                {[...Array(5)].map((_, i) => (
                  <svg
                    key={i}
                    className="w-4 h-4"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="py-8 sm:py-16 bg-gradient-to-r from-blue-400 via-blue-500 to-blue-600 text-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div className="animate-fade-in-delay">
              <div className="text-3xl sm:text-4xl font-bold mb-2">500+</div>
              <div className="text-purple-100">Happy Clients</div>
            </div>
            <div
              className="animate-fade-in-delay"
              style={{ animationDelay: "0.2s" }}
            >
              <div className="text-3xl sm:text-4xl font-bold mb-2">1000+</div>
              <div className="text-purple-100">Projects Completed</div>
            </div>
            <div
              className="animate-fade-in-delay"
              style={{ animationDelay: "0.4s" }}
            >
              <div className="text-3xl sm:text-4xl font-bold mb-2">50+</div>
              <div className="text-purple-100">Products Available</div>
            </div>
            <div
              className="animate-fade-in-delay"
              style={{ animationDelay: "0.6s" }}
            >
              <div className="text-3xl sm:text-4xl font-bold mb-2">24/7</div>
              <div className="text-purple-100">Support Available</div>
            </div>
          </div>
        </div>
      </div>

      {/* Custom CSS for animations */}
      <style jsx>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-fade-in {
          animation: fade-in 0.6s ease-out;
        }

        .animate-fade-in-delay {
          animation: fade-in 0.6s ease-out 0.2s both;
        }

        .animate-fade-in-delay-2 {
          animation: fade-in 0.6s ease-out 0.4s both;
        }
      `}</style>
    </div>
  );
};

export default Home;
