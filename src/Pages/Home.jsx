import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useCart } from '../context/CartContext';

const Home = () => {
  const { addToCart } = useCart();

  const allProducts = [
    {
      id: 1,
      name: "Business Cards",
      description: "Premium quality printing",
      price: 299,
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
      price: 150,
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
      price: 4999,
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
      price: 899,
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
      price: 15999,
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
      price: 2999,
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
      price: 399,
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
      price: 4999,
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
      price: 99,
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
      price: 149,
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
      price: 12999,
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
      price: 1999,
      category: "Digital Services",
      imageUrl:
        "https://images.unsplash.com/photo-1586281380349-632531db7ed4?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
      relatedProducts: [5, 6, 8],
      featured: false,
    },
    {
      id: 13,
      name: "Brochure Design",
      description: "Professional brochures",
      price: 799,
      category: "Printing",
      imageUrl: "https://images.unsplash.com/photo-1586281380349-632531db7ed4?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
      relatedProducts: [1, 4, 7],
      featured: false,
    },
    {
      id: 14,
      name: "Poster Printing",
      description: "High-quality posters",
      price: 599,
      category: "Printing",
      imageUrl: "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
      relatedProducts: [4, 7, 9],
      featured: false,
    },
    {
      id: 15,
      name: "Flyer Design",
      description: "Eye-catching flyers",
      price: 499,
      category: "Printing",
      imageUrl: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
      relatedProducts: [1, 4, 13],
      featured: false,
    },
    {
      id: 16,
      name: "Mug Printing",
      description: "Custom printed mugs",
      price: 299,
      category: "Printing",
      imageUrl: "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
      relatedProducts: [7, 9, 10],
      featured: false,
    },
    {
      id: 17,
      name: "Calendar Printing",
      description: "Custom calendars",
      price: 399,
      category: "Printing",
      imageUrl: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
      relatedProducts: [1, 2, 10],
      featured: false,
    },
    {
      id: 18,
      name: "Book Printing",
      description: "Professional book printing",
      price: 999,
      category: "Printing",
      imageUrl: "https://images.unsplash.com/photo-1586281380349-632531db7ed4?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
      relatedProducts: [2, 12, 13],
      featured: false,
    },
    {
      id: 19,
      name: "Premium Invitation Cards",
      description: "Luxury wedding invitations",
      price: 1299,
      category: "Printing",
      imageUrl: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
      relatedProducts: [1, 2, 4],
      featured: true,
    },
    {
      id: 20,
      name: "Corporate Branding Package",
      description: "Complete brand identity",
      price: 8999,
      category: "Digital Services",
      imageUrl: "https://images.unsplash.com/photo-1557838923-2985c318be48?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
      relatedProducts: [3, 5, 6],
      featured: true,
    },
    {
      id: 21,
      name: "Custom Packaging Design",
      description: "Professional packaging",
      price: 2499,
      category: "Printing",
      imageUrl: "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
      relatedProducts: [1, 4, 13],
      featured: true,
    },
    {
      id: 22,
      name: "Premium Photo Albums",
      description: "High-quality photo books",
      price: 1799,
      category: "Printing",
      imageUrl: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
      relatedProducts: [10, 18, 2],
      featured: true,
    },
    {
      id: 23,
      name: "Digital Marketing Campaign",
      description: "Complete social media package",
      price: 6999,
      category: "Digital Services",
      imageUrl: "https://images.unsplash.com/photo-1557838923-2985c318be48?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
      relatedProducts: [3, 8, 20],
      featured: true,
    },
    {
      id: 24,
      name: "Luxury Certificate Printing",
      description: "Premium certificates",
      price: 899,
      category: "Printing",
      imageUrl: "https://images.unsplash.com/photo-1586281380349-632531db7ed4?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
      relatedProducts: [1, 2, 18],
      featured: true,
    },
  ];
   const images = [
    "https://trios.qa/wp-content/uploads/2024/10/Printing.jpeg",
    "https://simplife.ae/uploads/business_sliders/slider-1692617396-951.jpg",
    "https://www.indusdubai.com/wp-content/uploads/2021/10/slide44-scaled.jpg",
    "https://descoonline.com/wp-content/uploads/2020/10/Same-Day-Printing-in-Dubai.jpg",
    "https://macedoniaprojects.co.zw/wp-content/uploads/2023/12/Digital-Printing-Services.jpg",
  ];
   const [current, setCurrent] = useState(0);

  // Auto change every 4 sec
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrent((prev) => (prev === images.length - 1 ? 0 : prev + 1));
    }, 4000);
    return () => clearInterval(interval);
  }, [images.length]);

  const featuredProducts = allProducts.filter((product) => product.featured);
  const otherProducts = allProducts.filter((product) => !product.featured);

  return (
    <div className="min-h-screen bg-white relative overflow-hidden">
      {/* Hero Section */}
      <div className="relative w-full h-[80vh] overflow-hidden">
      {images.map((img, index) => (
        <div
          key={index}
          className={`absolute inset-0 transition-opacity duration-1000 ${
            index === current ? "opacity-100" : "opacity-0"
          }`}
        >
          <img
            src={img}
            alt={`Slide ${index + 1}`}
            className="w-full h-full object-cover"
          />
        </div>
      ))}

      {/* Dots Indicator */}
      <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 flex space-x-2">
        {images.map((_, index) => (
          <button
            key={index}
            className={`w-3 h-3 rounded-full ${
              index === current ? "bg-white" : "bg-gray-400"
            }`}
            onClick={() => setCurrent(index)}
          ></button>
        ))}
      </div>
    </div>

      {/* Custom Printing Banner Section */}
      

      {/* Categories Section */}
      <div className="py-4 sm:py-8 bg-gray-50">
        <div className="max-w-7xl mx-auto px-2 sm:px-4">
          <h2 className="text-2xl sm:text-3xl font-bold text-center mb-4 sm:mb-6 animate-fade-in">
            Shop by Category
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 px-2 sm:px-0">
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
                className="text-purple-500 hover:text-purple-600 font-medium transition-colors"
              >
                Explore →
              </Link>
            </div>

            {/* Office Supplies */}
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
                className="text-purple-600 hover:text-purple-800 font-medium transition-colors"
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
                className="text-purple-600 hover:text-purple-800 font-medium transition-colors"
              >
                Explore →
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Featured Products */}

      {/* Sub Category Section */}
      <div className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-8">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center px-6 py-2 bg-gradient-to-r from-orange-400 to-red-500 text-white rounded-full text-sm font-semibold mb-4">
              <span className="mr-2">◀</span>
              SUB CATEGORY
              <span className="ml-2">▶</span>
            </div>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6 mb-8">
            {/* Logo Design */}
            <div className="flex flex-col items-center group cursor-pointer">
              <div className="w-24 h-24 bg-gradient-to-br from-blue-100 to-blue-200 rounded-full flex items-center justify-center mb-3 group-hover:scale-110 transition-transform duration-300 overflow-hidden">
                <img 
                  src="https://images.unsplash.com/photo-1611224923853-80b023f02d71?ixlib=rb-4.0.3&auto=format&fit=crop&w=80&h=80&q=80" 
                  alt="Logo Design" 
                  className="w-20 h-20 rounded-full object-cover shadow-md"
                />
              </div>
              <h3 className="text-sm font-medium text-gray-900 text-center">Logo Design</h3>
            </div>

            {/* Web Design */}
            <div className="flex flex-col items-center group cursor-pointer">
              <div className="w-24 h-24 bg-gradient-to-br from-green-100 to-green-200 rounded-full flex items-center justify-center mb-3 group-hover:scale-110 transition-transform duration-300 overflow-hidden">
                <img 
                  src="https://images.unsplash.com/photo-1547658719-da2b51169166?ixlib=rb-4.0.3&auto=format&fit=crop&w=80&h=80&q=80" 
                  alt="Web Design" 
                  className="w-20 h-20 rounded-full object-cover shadow-md"
                />
              </div>
              <h3 className="text-sm font-medium text-gray-900 text-center">Web Design</h3>
            </div>

            {/* T-shirt Design */}
            <div className="flex flex-col items-center group cursor-pointer">
              <div className="w-24 h-24 bg-gradient-to-br from-purple-100 to-purple-200 rounded-full flex items-center justify-center mb-3 group-hover:scale-110 transition-transform duration-300 overflow-hidden">
                <img 
                  src="https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?ixlib=rb-4.0.3&auto=format&fit=crop&w=80&h=80&q=80" 
                  alt="T-shirt Design" 
                  className="w-20 h-20 rounded-full object-cover shadow-md"
                />
              </div>
              <h3 className="text-sm font-medium text-gray-900 text-center">T-shirt Design</h3>
            </div>

            {/* Flyer Design */}
            <div className="flex flex-col items-center group cursor-pointer">
              <div className="w-24 h-24 bg-gradient-to-br from-yellow-100 to-yellow-200 rounded-full flex items-center justify-center mb-3 group-hover:scale-110 transition-transform duration-300 overflow-hidden">
                <img 
                  src="https://images.unsplash.com/photo-1586281380349-632531db7ed4?ixlib=rb-4.0.3&auto=format&fit=crop&w=80&h=80&q=80" 
                  alt="Flyer Design" 
                  className="w-20 h-20 rounded-full object-cover shadow-md"
                />
              </div>
              <h3 className="text-sm font-medium text-gray-900 text-center">Flyer Design</h3>
            </div>

            {/* Brochure Design */}
            <div className="flex flex-col items-center group cursor-pointer">
              <div className="w-24 h-24 bg-gradient-to-br from-pink-100 to-pink-200 rounded-full flex items-center justify-center mb-3 group-hover:scale-110 transition-transform duration-300 overflow-hidden">
                <img 
                  src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=80&h=80&q=80" 
                  alt="Brochure Design" 
                  className="w-20 h-20 rounded-full object-cover shadow-md"
                />
              </div>
              <h3 className="text-sm font-medium text-gray-900 text-center">Brochure Design</h3>
            </div>

            {/* Business Card Design */}
            <div className="flex flex-col items-center group cursor-pointer">
              <div className="w-24 h-24 bg-gradient-to-br from-indigo-100 to-indigo-200 rounded-full flex items-center justify-center mb-3 group-hover:scale-110 transition-transform duration-300 overflow-hidden">
                <img 
                  src="https://images.unsplash.com/photo-1558618666-fcd25c85cd64?ixlib=rb-4.0.3&auto=format&fit=crop&w=80&h=80&q=80" 
                  alt="Business Card Design" 
                  className="w-20 h-20 rounded-full object-cover shadow-md"
                />
              </div>
              <h3 className="text-sm font-medium text-gray-900 text-center">Business Card Design</h3>
            </div>
          </div>

          {/* Sample Work Display */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Sample 1 */}
            <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
              <img 
                src="https://images.unsplash.com/photo-1558618666-fcd25c85cd64?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80" 
                alt="Sample Work 1" 
                className="w-full h-48 object-cover"
              />
            </div>

            {/* Sample 2 */}
            <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
              <img 
                src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80" 
                alt="Sample Work 2" 
                className="w-full h-48 object-cover"
              />
            </div>

            {/* Sample 3 */}
            <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
              <img 
                src="https://images.unsplash.com/photo-1560472354-b33ff0c44a43?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80" 
                alt="Sample Work 3" 
                className="w-full h-48 object-cover"
              />
            </div>

            {/* Sample 4 */}
            <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
              <img 
                src="https://images.unsplash.com/photo-1586281380349-632531db7ed4?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80" 
                alt="Sample Work 4" 
                className="w-full h-48 object-cover"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Wall Decoratives Section */}
     \

      {/* Complete Product Collection */}
      <div className="py-8 bg-white">
        <div className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-8">
          <div className="text-center mb-6">
            <h2 className="text-3xl font-bold text-gray-900 mb-4 animate-fade-in">
              Complete Product Collection
            </h2>
            <p className="text-lg text-gray-600 animate-slide-up">
              Discover our full range of premium printing and design solutions
            </p>
          </div>

          {/* Products Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 sm:gap-4 md:gap-6">
            {otherProducts.map((product, index) => (
              <div key={product.id} className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:scale-105">
                {/* Product Image */}
                <div className="relative">
                  <img
                    src={product.imageUrl}
                    alt={product.name}
                    className="w-full h-32 sm:h-40 md:h-48 object-cover"
                  />
                  {/* Discount Badge */}
                  <div className="absolute top-2 left-2 bg-orange-500 text-white px-2 py-1 rounded-md text-xs font-semibold">
                    -15%
                  </div>
                  {/* Heart Icon */}
                  <div className="absolute top-2 right-2 w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-md cursor-pointer hover:bg-gray-100 transition-colors">
                    <svg className="w-4 h-4 text-gray-400 hover:text-red-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                    </svg>
                  </div>
                </div>
                
                {/* Product Info */}
                <div className="p-2 sm:p-3 md:p-4">
                  <h3 className="font-semibold text-gray-900 mb-1 text-xs sm:text-sm truncate">
                    {product.name}
                  </h3>
                  <p className="text-xs text-gray-500 mb-2 hidden sm:block">
                    {product.description}
                  </p>
                  
                  {/* Rating */}
                  <div className="flex items-center mb-2">
                    <div className="flex items-center">
                      {[...Array(5)].map((_, i) => (
                        <svg key={i} className="w-3 h-3 text-yellow-400 fill-current" viewBox="0 0 20 20">
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      ))}
                    </div>
                    <span className="text-xs text-gray-500 ml-1">4.3</span>
                  </div>
                  
                  {/* Price */}
                  <div className="flex items-center justify-between mb-2 sm:mb-3">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-1">
                      <span className="text-sm sm:text-lg font-bold text-gray-900">₹{product.price}</span>
                    <span className="text-xs sm:text-sm text-gray-500 line-through">₹{product.price + 50}</span>
                    </div>
                  </div>
                  
                  {/* Add to Cart Button */}
                  <button 
                    onClick={() => addToCart({...product, image: product.imageUrl})}
                    className="w-full bg-orange-500 hover:bg-orange-600 text-white py-1.5 sm:py-2 px-2 sm:px-4 rounded-lg text-xs sm:text-sm font-medium transition-colors duration-200 flex items-center justify-center space-x-1"
                  >
                    <svg className="w-3 h-3 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-2.5 5M7 13l2.5 5m6-5v6a2 2 0 01-2 2H9a2 2 0 01-2-2v-6m8 0V9a2 2 0 00-2-2H9a2 2 0 00-2 2v4.01" />
                    </svg>
                    <span className="hidden sm:inline">Add to Cart</span>
                    <span className="sm:hidden">Add</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Premium Bestsellers */}
      <div className="py-8 bg-gray-50">
        <div className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-8">
          <div className="text-center mb-6">
            <h2 className="text-3xl font-bold text-gray-900 mb-4 animate-fade-in">
              Premium Bestsellers
            </h2>
            <p className="text-lg text-gray-600 animate-slide-up">
              Our most loved and highly-rated printing services
            </p>
          </div>

          {/* Products Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 sm:gap-4 md:gap-6">
            {featuredProducts.map((product, index) => (
              <div key={product.id} className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:scale-105">
                {/* Product Image */}
                <div className="relative">
                  <img
                    src={product.imageUrl}
                    alt={product.name}
                    className="w-full h-32 sm:h-40 md:h-48 object-cover"
                  />
                  {/* Discount Badge */}
                  <div className="absolute top-2 left-2 bg-green-500 text-white px-2 py-1 rounded-md text-xs font-semibold">
                    -25%
                  </div>
                  {/* Heart Icon */}
                  <div className="absolute top-2 right-2 w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-md cursor-pointer hover:bg-gray-100 transition-colors">
                    <svg className="w-4 h-4 text-gray-400 hover:text-red-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                    </svg>
                  </div>
                </div>
                
                {/* Product Info */}
                <div className="p-2 sm:p-3 md:p-4">
                  <h3 className="font-semibold text-gray-900 mb-1 text-xs sm:text-sm truncate">
                    {product.name}
                  </h3>
                  <p className="text-xs text-gray-500 mb-2 hidden sm:block">
                    {product.description}
                  </p>
                  
                  {/* Rating */}
                  <div className="flex items-center mb-2 hidden sm:flex">
                    <div className="flex items-center">
                      {[...Array(5)].map((_, i) => (
                        <svg key={i} className="w-3 h-3 text-yellow-400 fill-current" viewBox="0 0 20 20">
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      ))}
                    </div>
                    <span className="text-xs text-gray-500 ml-1">4.5</span>
                  </div>
                  
                  {/* Price */}
                  <div className="flex items-center justify-between mb-2 sm:mb-3">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-1">
                      <span className="text-sm sm:text-lg font-bold text-gray-900">₹{product.price}</span>
                      <span className="text-xs sm:text-sm text-gray-500 line-through">₹{product.price + 100}</span>
                    </div>
                  </div>
                  
                  {/* Add to Cart Button */}
                  <button 
                    onClick={() => addToCart({...product, image: product.imageUrl})}
                    className="w-full bg-purple-600 hover:bg-purple-700 text-white py-1.5 sm:py-2 px-2 sm:px-4 rounded-lg text-xs sm:text-sm font-medium transition-colors duration-200 flex items-center justify-center space-x-1"
                  >
                    <svg className="w-3 h-3 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-2.5 5M7 13l2.5 5m6-5v6a2 2 0 01-2 2H9a2 2 0 01-2-2v-6m8 0V9a2 2 0 00-2-2H9a2 2 0 00-2 2v4.01" />
                    </svg>
                    <span className="hidden sm:inline">Add to Cart</span>
                    <span className="sm:hidden">Add</span>
                  </button>
                </div>
              </div>
            ))}
          </div>

        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-6 max-w-6xl mx-auto">
        {/* Left big image with text overlay */}
        <div className="relative">
          <img
            src="https://png.pngtree.com/thumb_back/fh260/background/20230612/pngtree-multiple-prints-of-flowers-on-a-machine-image_2966676.jpg"
            alt="Printing Sample"
            className="w-full h-full object-cover rounded-lg shadow-md"
          />
          <div className="absolute top-4 left-4 bg-white bg-opacity-90 p-3 rounded-md shadow">
            <h2 className="text-lg font-bold">PrintOnWeb.in</h2>
            <p className="text-sm">Makes Every Experience Unique</p>
          </div>
        </div>

        {/* Right side 2 images stacked */}
        <div className="grid grid-cols-1 gap-4">
          <img
            src="https://encrypted-tbn3.gstatic.com/shopping?q=tbn:ANd9GcTOzBuq7zogJW-CSybROTQ6DYOS8HVt_9Dv_SadbxkCaBQA6QMrHAxS5_TX9IkRwDakiELbITXNwm4TWtjHBkTHH46RiLC_bY7qpLuQA_n-"
            alt="Printing Sample 2"
            className="w-full h-48 object-cover rounded-lg shadow-md"
          />
          <img
            src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRFvpo_ux3dbiP7QSXHELt7oqNK_Qf2xLgSUA&s"
            alt="Printing Sample 3"
            className="w-full h-48 object-cover rounded-lg shadow-md"
          />
        </div>
      </div>

      {/* Customer Reviews Section */}
      <div className="bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-center">
            {/* Left Side - Image */}
            <div className="relative">
              <img
                src="https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=600&h=400&fit=crop"
                alt="Happy Customer"
                className="w-full h-96 object-cover rounded-2xl shadow-2xl"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent rounded-2xl"></div>
              <div className="absolute bottom-6 left-6 text-white">
                <h3 className="text-2xl font-bold mb-2">Happy Customers</h3>
                <p className="text-lg opacity-90">
                  Trusted by 10,000+ customers
                </p>
              </div>
            </div>

            {/* Right Side - Auto Scrolling Reviews */}
            <div className="space-y-6">
              <div className="text-center lg:text-left">
                <h2 className="text-3xl font-bold text-gray-900 mb-4">
                  What Our Customers Say
                </h2>
                <p className="text-gray-600 text-lg">
                  Real reviews from real customers who love our printing
                  services
                </p>
              </div>

              {/* Auto Scrolling Reviews Container */}
              <div className="relative h-80 overflow-hidden">
                <div className="absolute inset-0 auto-scroll-reviews">
                  {/* Review 1 */}
                  <div className="bg-white p-6 rounded-xl shadow-lg mb-4 review-card">
                    <div className="flex items-center mb-4">
                      <img
                        src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=50&h=50&fit=crop&crop=face"
                        alt="Customer"
                        className="w-12 h-12 rounded-full mr-4"
                      />
                      <div>
                        <h4 className="font-semibold text-gray-900">
                          Rahul Sharma
                        </h4>
                        <div className="flex text-yellow-400">★★★★★</div>
                      </div>
                    </div>
                    <p className="text-gray-700">
                      "Excellent quality prints! The colors are vibrant and the
                      delivery was super fast. Highly recommended for all
                      printing needs."
                    </p>
                  </div>

                  {/* Review 2 */}
                  <div className="bg-white p-6 rounded-xl shadow-lg mb-4 review-card">
                    <div className="flex items-center mb-4">
                      <img
                        src="https://images.unsplash.com/photo-1494790108755-2616b612b786?w=50&h=50&fit=crop&crop=face"
                        alt="Customer"
                        className="w-12 h-12 rounded-full mr-4"
                      />
                      <div>
                        <h4 className="font-semibold text-gray-900">
                          Priya Patel
                        </h4>
                        <div className="flex text-yellow-400">★★★★★</div>
                      </div>
                    </div>
                    <p className="text-gray-700">
                      "Amazing service! Got my wedding invitations printed here
                      and they turned out perfect. Great customer support too."
                    </p>
                  </div>

                  {/* Review 3 */}
                  <div className="bg-white p-6 rounded-xl shadow-lg mb-4 review-card">
                    <div className="flex items-center mb-4">
                      <img
                        src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=50&h=50&fit=crop&crop=face"
                        alt="Customer"
                        className="w-12 h-12 rounded-full mr-4"
                      />
                      <div>
                        <h4 className="font-semibold text-gray-900">
                          Amit Kumar
                        </h4>
                        <div className="flex text-yellow-400">★★★★★</div>
                      </div>
                    </div>
                    <p className="text-gray-700">
                      "Best printing service in the city! Professional quality
                      at affordable prices. Will definitely use again."
                    </p>
                  </div>

                  {/* Review 4 */}
                  <div className="bg-white p-6 rounded-xl shadow-lg mb-4 review-card">
                    <div className="flex items-center mb-4">
                      <img
                        src="https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=50&h=50&fit=crop&crop=face"
                        alt="Customer"
                        className="w-12 h-12 rounded-full mr-4"
                      />
                      <div>
                        <h4 className="font-semibold text-gray-900">
                          Sneha Gupta
                        </h4>
                        <div className="flex text-yellow-400">★★★★★</div>
                      </div>
                    </div>
                    <p className="text-gray-700">
                      "Fantastic experience! The team is very helpful and the
                      print quality is outstanding. Highly satisfied with the
                      service."
                    </p>
                  </div>

                  {/* Review 5 */}
                  <div className="bg-white p-6 rounded-xl shadow-lg mb-4 review-card">
                    <div className="flex items-center mb-4">
                      <img
                        src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=50&h=50&fit=crop&crop=face"
                        alt="Customer"
                        className="w-12 h-12 rounded-full mr-4"
                      />
                      <div>
                        <h4 className="font-semibold text-gray-900">
                          Vikash Singh
                        </h4>
                        <div className="flex text-yellow-400">★★★★★</div>
                      </div>
                    </div>
                    <p className="text-gray-700">
                      "Quick turnaround time and excellent quality. Got my
                      business cards printed and they look amazing. Great job!"
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="content-section p-4 bg-gradient-to-br from-white to-purple-50 rounded-3xl shadow-xl mt-4 border border-gray-200">
  {/* Heading */}
  <h2 className="text-3xl font-extrabold text-purple-700 mb-4 text-center">
    Welcome to <span className="text-orange-500">PrintCo</span> – India’s Trusted Online Printing Partner
  </h2>
  
  {/* Intro */}
  <p className="text-gray-700 text-lg leading-relaxed mb-4 text-center">
    At <b>PrintCo</b>, we deliver <span className="text-purple-600 font-semibold">reliable, affordable, and premium-quality online printing</span> services for students, startups, corporates, and individuals across India.
  </p>
  <p className="text-gray-600 text-base mb-4 text-center">
    From <b>business cards</b> to <b>books</b>, <b>posters</b>, <b>brochures</b>, and <b>custom marketing materials</b> – our user-friendly platform makes printing fast, easy, and stress-free with <span className="text-orange-500 font-medium">free Pan-India delivery</span> & <span className="text-purple-600 font-medium">bulk discounts</span>.
  </p>

  {/* Services */}
  <div className="mb-6">
    <h3 className="text-2xl font-semibold text-orange-600 mb-3 flex items-center gap-2">
      📌 Our Most Popular Online Printing Services
    </h3>
    <ul className="grid grid-cols-1 md:grid-cols-2 gap-3 text-gray-700">
      <li className="bg-white rounded-xl p-4 shadow hover:shadow-md transition">
        <b>Document Printing</b> – Fast and affordable printing for assignments & business needs.
      </li>
      <li className="bg-white rounded-xl p-4 shadow hover:shadow-md transition">
        <b>Book Printing</b> – Perfect for students, authors & institutions with multiple bindings.
      </li>
      <li className="bg-white rounded-xl p-4 shadow hover:shadow-md transition">
        <b>Brochure Printing</b> – Eye-catching prints to promote your events or business.
      </li>
      <li className="bg-white rounded-xl p-4 shadow hover:shadow-md transition">
        <b>Posters & Banners</b> – High-quality large-format prints for retail & academic needs.
      </li>
      <li className="bg-white rounded-xl p-4 shadow hover:shadow-md transition">
        <b>Sticker Printing</b> – Vibrant stickers, perfect for branding & promotions.
      </li>
    </ul>
  </div>

  {/* Why Choose Us */}
  <div className="mb-6">
    <h3 className="text-2xl font-semibold text-green-700 mb-3">
      💡 Why Choose PrintCo?
    </h3>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-gray-700">
      <p className="bg-gradient-to-r from-green-50 to-white rounded-lg p-3 shadow">✅ Pan-India Delivery across all major cities</p>
      <p className="bg-gradient-to-r from-green-50 to-white rounded-lg p-3 shadow">✅ Affordable Pricing with premium quality</p>
      <p className="bg-gradient-to-r from-green-50 to-white rounded-lg p-3 shadow">✅ User-Friendly Website – upload, preview & order easily</p>
      <p className="bg-gradient-to-r from-green-50 to-white rounded-lg p-3 shadow">✅ Fast Turnaround – On-time delivery</p>
      <p className="bg-gradient-to-r from-green-50 to-white rounded-lg p-3 shadow">✅ Bulk Order Discounts – Ideal for SMEs & startups</p>
      <p className="bg-gradient-to-r from-green-50 to-white rounded-lg p-3 shadow">✅ High Print Quality – Vivid colors & durable materials</p>
    </div>
  </div>

  {/* Who We Serve */}
  <div>
    <h3 className="text-2xl font-semibold text-purple-600 mb-3">
      👥 Who We Serve
    </h3>
    <ul className="grid grid-cols-1 md:grid-cols-2 gap-3 text-gray-700">
      <li className="bg-blue-50 rounded-xl p-4 shadow">
        <b>Students & Institutions</b> – Affordable project & dissertation printing.
      </li>
      <li className="bg-blue-50 rounded-xl p-4 shadow">
        <b>Startups & Small Businesses</b> – Flyers, catalogs & pitch decks.
      </li>
      <li className="bg-blue-50 rounded-xl p-4 shadow">
        <b>Event Planners & Agencies</b> – Marketing banners & invitations.
      </li>
      <li className="bg-blue-50 rounded-xl p-4 shadow">
        <b>Authors & Publishers</b> – High-quality book printing with binding options.
      </li>
      <li className="bg-blue-50 rounded-xl p-4 shadow">
        <b>Corporate Clients</b> – Reports, manuals & branded stationery.
      </li>
    </ul>
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

        @keyframes slide-up {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-slide-up {
          animation: slide-up 0.8s ease-out 0.3s both;
        }

        @keyframes bounce-in {
          0% {
            opacity: 0;
            transform: scale(0.3) translateY(50px);
          }
          50% {
            opacity: 1;
            transform: scale(1.05) translateY(-10px);
          }
          70% {
            transform: scale(0.9) translateY(0);
          }
          100% {
            opacity: 1;
            transform: scale(1) translateY(0);
          }
        }

        .animate-bounce-in {
          animation: bounce-in 0.8s ease-out both;
        }

        @keyframes scroll-reviews {
          0% {
            transform: translateY(0);
          }
          100% {
            transform: translateY(-100%);
          }
        }

        .auto-scroll-reviews {
          animation: scroll-reviews 15s linear infinite;
        }

        .auto-scroll-reviews:hover {
          animation-play-state: paused;
        }

        .review-card {
          transition: all 0.3s ease;
        }

        .review-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1),
            0 10px 10px -5px rgba(0, 0, 0, 0.04);
        }
      `}</style>
    </div>
  );
};

export default Home;