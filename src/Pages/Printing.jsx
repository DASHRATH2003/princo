import React from 'react'

const Printing = () => {
  const printingServices = [
    {
      id: 1,
      name: "Business Cards",
      description: "Premium quality business cards with custom designs",
      price: "₹299",
      imageUrl: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
      features: ["Custom Design", "Premium Paper", "Fast Delivery"]
    },
    {
      id: 2,
      name: "Banners & Posters",
      description: "Large format printing for events and advertising",
      price: "₹899",
      imageUrl: "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
      features: ["Large Format", "Weather Resistant", "High Resolution"]
    },
    {
      id: 3,
      name: "Flyers & Brochures",
      description: "Marketing materials for your business",
      price: "₹199",
      imageUrl: "https://images.unsplash.com/photo-1586281380349-632531db7ed4?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
      features: ["Professional Design", "Multiple Sizes", "Bulk Discounts"]
    },
    {
      id: 4,
      name: "T-Shirt Printing",
      description: "Custom t-shirt printing with your designs",
      price: "₹399",
      imageUrl: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
      features: ["Custom Designs", "Quality Fabric", "Durable Print"]
    },
    {
      id: 5,
      name: "Stickers & Labels",
      description: "Custom stickers for branding and decoration",
      price: "₹99",
      imageUrl: "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
      features: ["Waterproof", "Custom Shapes", "Bulk Orders"]
    },
    {
      id: 6,
      name: "Photo Printing",
      description: "High-quality photo printing services",
      price: "₹149",
      imageUrl: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
      features: ["High Resolution", "Multiple Sizes", "Quick Turnaround"]
    }
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="relative bg-white text-gray-800 py-20 overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}></div>
        </div>
        
        <div className="max-w-7xl mx-auto px-4 relative z-10">
          <div className="text-center animate-fade-in">
            <h1 className="text-5xl font-bold mb-6 animate-fade-in-delay text-blue-500">Professional Printing Services</h1>
            <p className="text-xl mb-8 max-w-3xl mx-auto animate-fade-in-delay" style={{animationDelay: '0.2s'}}>
              High-quality printing solutions for all your business needs. From business cards to large banners, we deliver excellence.
            </p>
            <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-6 animate-fade-in-delay" style={{animationDelay: '0.4s'}}>
              <button className="bg-blue-500 text-white px-8 py-4 rounded-lg font-semibold hover:bg-blue-600 transition transform hover:scale-105 shadow-lg">
                Get Quote
              </button>
              <button className="border-2 border-blue-500 text-blue-500 px-8 py-4 rounded-lg font-semibold hover:bg-blue-500 hover:text-white transition transform hover:scale-105">
                Upload Design
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center animate-fade-in-delay">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Fast Delivery</h3>
              <p className="text-gray-600">Quick turnaround times for all your printing needs</p>
            </div>
            <div className="text-center animate-fade-in-delay" style={{animationDelay: '0.1s'}}>
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Quality Guaranteed</h3>
              <p className="text-gray-600">Premium quality materials and printing technology</p>
            </div>
            <div className="text-center animate-fade-in-delay" style={{animationDelay: '0.2s'}}>
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Best Prices</h3>
              <p className="text-gray-600">Competitive pricing with bulk order discounts</p>
            </div>
          </div>
        </div>
      </div>

      {/* Services Grid */}
      <div className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4 animate-fade-in">Our Printing Services</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto animate-fade-in-delay">
              Professional printing solutions tailored to your specific needs
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {printingServices.map((service, index) => (
              <div key={service.id} className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:scale-105 animate-fade-in-delay" style={{animationDelay: `${index * 0.1}s`}}>
                <div className="h-48 relative overflow-hidden">
                  <img 
                    src={service.imageUrl}
                    alt={service.name}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
                  <div className="absolute top-4 right-4">
                    <span className="bg-blue-500 text-white text-xs px-3 py-1 rounded-full">Popular</span>
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-semibold mb-2">{service.name}</h3>
                  <p className="text-gray-600 mb-4">{service.description}</p>
                  
                  {/* Features */}
                  <div className="mb-4">
                    {service.features.map((feature, idx) => (
                      <div key={idx} className="flex items-center mb-2">
                        <svg className="w-4 h-4 text-blue-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        <span className="text-sm text-gray-600">{feature}</span>
                      </div>
                    ))}
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-2xl font-bold text-blue-500">{service.price}</span>
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

      {/* Process Section */}
      <div className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4 animate-fade-in">How It Works</h2>
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
                <div className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-4 text-white text-xl font-bold">
                  {item.step}
                </div>
                <h3 className="text-lg font-semibold mb-2">{item.title}</h3>
                <p className="text-gray-600">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="py-16 bg-gradient-to-r from-blue-400 to-blue-600 text-white">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold mb-4 animate-fade-in">Ready to Start Printing?</h2>
          <p className="text-xl mb-8 animate-fade-in-delay">Get your professional prints delivered to your doorstep</p>
          <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-6 animate-fade-in-delay" style={{animationDelay: '0.2s'}}>
            <button className="bg-white text-blue-600 px-8 py-4 rounded-lg font-semibold hover:bg-gray-100 transition transform hover:scale-105 shadow-lg">
              Start Order
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

export default Printing
