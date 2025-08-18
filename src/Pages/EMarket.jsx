import React, { useState } from 'react'

const EMarket = () => {
  const [selectedCategory, setSelectedCategory] = useState('all')

  const digitalServices = [
    {
      id: 1,
      name: "Website Design",
      description: "Professional website design and development",
      price: "₹15,999",
      category: "Web Development",
      imageUrl: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
      features: ["Responsive Design", "SEO Optimized", "CMS Integration"]
    },
    {
      id: 2,
      name: "Digital Marketing",
      description: "Complete digital marketing solutions",
      price: "₹4,999",
      category: "Marketing",
      imageUrl: "https://images.unsplash.com/photo-1557838923-2985c318be48?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
      features: ["Social Media", "Google Ads", "Analytics"]
    },
    {
      id: 3,
      name: "Logo Design",
      description: "Custom logo design for your brand",
      price: "₹2,999",
      category: "Design",
      imageUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
      features: ["Multiple Concepts", "Vector Files", "Brand Guidelines"]
    },
    {
      id: 4,
      name: "E-commerce Setup",
      description: "Complete e-commerce website setup",
      price: "₹12,999",
      category: "Web Development",
      imageUrl: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
      features: ["Payment Gateway", "Inventory Management", "Mobile App"]
    },
    {
      id: 5,
      name: "Content Writing",
      description: "Professional content writing services",
      price: "₹1,999",
      category: "Content",
      imageUrl: "https://images.unsplash.com/photo-1586281380349-632531db7ed4?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
      features: ["SEO Content", "Blog Posts", "Product Descriptions"]
    },
    {
      id: 6,
      name: "Social Media Management",
      description: "Monthly social media management",
      price: "₹4,999",
      category: "Marketing",
      imageUrl: "https://images.unsplash.com/photo-1557838923-2985c318be48?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
      features: ["Daily Posts", "Engagement", "Analytics Reports"]
    }
  ]

  const categories = [
    { id: 'all', name: 'All Services' },
    { id: 'Web Development', name: 'Web Development' },
    { id: 'Marketing', name: 'Digital Marketing' },
    { id: 'Design', name: 'Design' },
    { id: 'Content', name: 'Content' }
  ]

  const filteredServices = selectedCategory === 'all' 
    ? digitalServices 
    : digitalServices.filter(service => service.category === selectedCategory)

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
            <h1 className="text-5xl font-bold mb-6 animate-fade-in-delay text-blue-500">Digital Solutions Marketplace</h1>
            <p className="text-xl mb-8 max-w-3xl mx-auto animate-fade-in-delay" style={{animationDelay: '0.2s'}}>
              Professional digital services to grow your business online. From web design to digital marketing, we have everything you need.
            </p>
            <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-6 animate-fade-in-delay" style={{animationDelay: '0.4s'}}>
              <button className="bg-blue-500 text-white px-8 py-4 rounded-lg font-semibold hover:bg-blue-600 transition transform hover:scale-105 shadow-lg">
                Browse Services
              </button>
              <button className="border-2 border-blue-500 text-blue-500 px-8 py-4 rounded-lg font-semibold hover:bg-blue-500 hover:text-white transition transform hover:scale-105">
                Get Consultation
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div className="animate-fade-in-delay">
              <div className="text-3xl font-bold text-blue-600 mb-2">500+</div>
              <div className="text-gray-600">Projects Completed</div>
            </div>
            <div className="animate-fade-in-delay" style={{animationDelay: '0.1s'}}>
              <div className="text-3xl font-bold text-blue-600 mb-2">50+</div>
              <div className="text-gray-600">Expert Developers</div>
            </div>
            <div className="animate-fade-in-delay" style={{animationDelay: '0.2s'}}>
              <div className="text-3xl font-bold text-blue-600 mb-2">98%</div>
              <div className="text-gray-600">Client Satisfaction</div>
            </div>
            <div className="animate-fade-in-delay" style={{animationDelay: '0.3s'}}>
              <div className="text-3xl font-bold text-blue-600 mb-2">24/7</div>
              <div className="text-gray-600">Support Available</div>
            </div>
          </div>
        </div>
      </div>

      {/* Category Filters */}
      <div className="py-8 bg-gray-100">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex flex-wrap justify-center gap-4">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`px-6 py-3 rounded-lg font-medium transition-all duration-300 transform hover:scale-105 ${
                  selectedCategory === category.id
                    ? 'bg-blue-500 text-white shadow-lg'
                    : 'bg-white text-gray-700 hover:bg-blue-50 hover:text-blue-600'
                }`}
              >
                {category.name}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Services Grid */}
      <div className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4 animate-fade-in">Digital Services</h2>
            <p className="text-xl text-gray-600 animate-fade-in-delay">
              Professional digital solutions to boost your online presence
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredServices.map((service, index) => (
              <div key={service.id} className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:scale-105 animate-fade-in-delay" style={{animationDelay: `${index * 0.1}s`}}>
                <div className="h-48 relative overflow-hidden">
                  <img 
                    src={service.imageUrl}
                    alt={service.name}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
                  <div className="absolute top-4 right-4">
                    <span className="bg-blue-500 text-white text-xs px-3 py-1 rounded-full">{service.category}</span>
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
                      Get Quote
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
            <h2 className="text-4xl font-bold mb-4 animate-fade-in">How We Work</h2>
            <p className="text-xl text-gray-600 animate-fade-in-delay">Simple process to get your digital project done</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {[
              { step: "1", title: "Consultation", desc: "Discuss your requirements and goals" },
              { step: "2", title: "Planning", desc: "Create detailed project plan and timeline" },
              { step: "3", title: "Development", desc: "Build your project with regular updates" },
              { step: "4", title: "Launch", desc: "Deploy and provide ongoing support" }
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
          <h2 className="text-4xl font-bold mb-4 animate-fade-in">Ready to Start Your Digital Journey?</h2>
          <p className="text-xl mb-8 animate-fade-in-delay">Let's discuss your project and bring your vision to life</p>
          <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-6 animate-fade-in-delay" style={{animationDelay: '0.2s'}}>
            <button className="bg-white text-blue-600 px-8 py-4 rounded-lg font-semibold hover:bg-gray-100 transition transform hover:scale-105 shadow-lg">
              Start Project
            </button>
            <button className="border-2 border-white text-white px-8 py-4 rounded-lg font-semibold hover:bg-white hover:text-blue-600 transition transform hover:scale-105">
              Schedule Call
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

export default EMarket
