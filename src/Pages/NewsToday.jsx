import React, { useState } from 'react'

const NewsToday = () => {
  const [selectedCategory, setSelectedCategory] = useState('all')

  const newsArticles = [
    {
      id: 1,
      title: "PrintCo Expands to New Markets",
      excerpt: "PrintCo announces expansion plans to serve customers in 5 new cities across India",
      category: "Company News",
      author: "PrintCo Team",
      date: "2024-01-15",
      readTime: "3 min read",
      imageUrl: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
      featured: true
    },
    {
      id: 2,
      title: "Digital Marketing Trends 2024",
      excerpt: "Explore the latest digital marketing trends that will dominate the industry this year",
      category: "Industry Insights",
      author: "Marketing Expert",
      date: "2024-01-14",
      readTime: "5 min read",
      imageUrl: "https://images.unsplash.com/photo-1557838923-2985c318be48?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
      featured: false
    },
    {
      id: 3,
      title: "Local Business Success Stories",
      excerpt: "Meet the local entrepreneurs who transformed their businesses with PrintCo services",
      category: "Local Business",
      author: "Business Reporter",
      date: "2024-01-13",
      readTime: "4 min read",
      imageUrl: "https://images.unsplash.com/photo-1586281380349-632531db7ed4?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
      featured: false
    },
    {
      id: 4,
      title: "Printing Technology Innovations",
      excerpt: "Latest advancements in printing technology that are revolutionizing the industry",
      category: "Technology",
      author: "Tech Writer",
      date: "2024-01-12",
      readTime: "6 min read",
      imageUrl: "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
      featured: false
    },
    {
      id: 5,
      title: "E-commerce Growth in Local Markets",
      excerpt: "How local businesses are leveraging e-commerce to reach more customers",
      category: "Local Business",
      author: "E-commerce Analyst",
      date: "2024-01-11",
      readTime: "4 min read",
      imageUrl: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
      featured: false
    },
    {
      id: 6,
      title: "Customer Success: Restaurant Branding",
      excerpt: "How a local restaurant increased sales by 40% with professional branding",
      category: "Success Stories",
      author: "Brand Consultant",
      date: "2024-01-10",
      readTime: "3 min read",
      imageUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
      featured: false
    }
  ]

  const categories = [
    { id: 'all', name: 'All News' },
    { id: 'Company News', name: 'Company News' },
    { id: 'Industry Insights', name: 'Industry Insights' },
    { id: 'Local Business', name: 'Local Business' },
    { id: 'Technology', name: 'Technology' },
    { id: 'Success Stories', name: 'Success Stories' }
  ]

  const filteredArticles = selectedCategory === 'all' 
    ? newsArticles 
    : newsArticles.filter(article => article.category === selectedCategory)

  const featuredArticle = newsArticles.find(article => article.featured)
  const otherArticles = filteredArticles.filter(article => !article.featured)

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
            <h1 className="text-5xl font-bold mb-6 animate-fade-in-delay text-blue-500">News Today</h1>
            <p className="text-xl mb-8 max-w-3xl mx-auto animate-fade-in-delay" style={{animationDelay: '0.2s'}}>
              Stay updated with the latest news, industry insights, and success stories from the business world.
            </p>
            <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-6 animate-fade-in-delay" style={{animationDelay: '0.4s'}}>
              <button className="bg-blue-500 text-white px-8 py-4 rounded-lg font-semibold hover:bg-blue-600 transition transform hover:scale-105 shadow-lg">
                Subscribe to Newsletter
              </button>
              <button className="border-2 border-blue-500 text-blue-500 px-8 py-4 rounded-lg font-semibold hover:bg-blue-500 hover:text-white transition transform hover:scale-105">
                Share Your Story
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Newsletter Signup */}
      <div className="py-8 bg-white border-b">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-center">
            <div className="flex-1 max-w-md">
              <h3 className="text-lg font-semibold mb-2">Get Latest News</h3>
              <p className="text-gray-600 text-sm">Subscribe to our newsletter for updates</p>
            </div>
            <div className="flex flex-1 max-w-md gap-2">
              <input
                type="email"
                placeholder="Enter your email..."
                className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <button className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold transition transform hover:scale-105">
                Subscribe
              </button>
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

      {/* Featured Article */}
      {featuredArticle && (
        <div className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold mb-4 animate-fade-in">Featured Story</h2>
              <p className="text-xl text-gray-600 animate-fade-in-delay">Today's top story</p>
            </div>
            <div className="bg-white rounded-xl shadow-lg overflow-hidden animate-fade-in-delay">
              <div className="md:flex">
                <div className="md:w-1/2">
                  <img 
                    src={featuredArticle.imageUrl}
                    alt={featuredArticle.title}
                    className="w-full h-64 md:h-full object-cover"
                  />
                </div>
                <div className="md:w-1/2 p-8">
                  <div className="flex items-center mb-4">
                    <span className="bg-blue-500 text-white text-xs px-3 py-1 rounded-full">{featuredArticle.category}</span>
                    <span className="text-gray-500 text-sm ml-4">{featuredArticle.readTime}</span>
                  </div>
                  <h3 className="text-2xl font-bold mb-4">{featuredArticle.title}</h3>
                  <p className="text-gray-600 mb-6">{featuredArticle.excerpt}</p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                        <span className="text-blue-600 font-semibold text-sm">{featuredArticle.author.charAt(0)}</span>
                      </div>
                      <div>
                        <p className="font-medium text-gray-800">{featuredArticle.author}</p>
                        <p className="text-sm text-gray-500">{new Date(featuredArticle.date).toLocaleDateString()}</p>
                      </div>
                    </div>
                    <button className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-lg transition transform hover:scale-105">
                      Read More
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* News Grid */}
      <div className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4 animate-fade-in">Latest News</h2>
            <p className="text-xl text-gray-600 animate-fade-in-delay">
              Stay informed with the latest updates and insights
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {otherArticles.map((article, index) => (
              <div key={article.id} className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:scale-105 animate-fade-in-delay" style={{animationDelay: `${index * 0.1}s`}}>
                <div className="h-48 relative overflow-hidden">
                  <img 
                    src={article.imageUrl}
                    alt={article.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
                  <div className="absolute top-4 right-4">
                    <span className="bg-blue-500 text-white text-xs px-3 py-1 rounded-full">{article.category}</span>
                  </div>
                </div>
                <div className="p-6">
                  <div className="flex items-center mb-3">
                    <span className="text-gray-500 text-sm">{article.readTime}</span>
                    <span className="text-gray-400 mx-2">•</span>
                    <span className="text-gray-500 text-sm">{new Date(article.date).toLocaleDateString()}</span>
                  </div>
                  <h3 className="text-xl font-semibold mb-3 line-clamp-2">{article.title}</h3>
                  <p className="text-gray-600 mb-4 line-clamp-3">{article.excerpt}</p>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                        <span className="text-blue-600 font-semibold text-sm">{article.author.charAt(0)}</span>
                      </div>
                      <span className="text-sm text-gray-600">{article.author}</span>
                    </div>
                    <button className="text-blue-500 hover:text-blue-600 font-medium text-sm transition">
                      Read More →
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Industry Stats */}
      <div className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4 animate-fade-in">Industry Insights</h2>
            <p className="text-xl text-gray-600 animate-fade-in-delay">Key statistics and trends</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="text-center animate-fade-in-delay">
              <div className="text-3xl font-bold text-blue-600 mb-2">85%</div>
              <div className="text-gray-600">Business Growth</div>
            </div>
            <div className="text-center animate-fade-in-delay" style={{animationDelay: '0.1s'}}>
              <div className="text-3xl font-bold text-blue-600 mb-2">200+</div>
              <div className="text-gray-600">Articles Published</div>
            </div>
            <div className="text-center animate-fade-in-delay" style={{animationDelay: '0.2s'}}>
              <div className="text-3xl font-bold text-blue-600 mb-2">50K+</div>
              <div className="text-gray-600">Monthly Readers</div>
            </div>
            <div className="text-center animate-fade-in-delay" style={{animationDelay: '0.3s'}}>
              <div className="text-3xl font-bold text-blue-600 mb-2">95%</div>
              <div className="text-gray-600">Reader Satisfaction</div>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="py-16 bg-gradient-to-r from-blue-400 to-blue-600 text-white">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold mb-4 animate-fade-in">Share Your Story</h2>
          <p className="text-xl mb-8 animate-fade-in-delay">Have a success story or industry insight? We'd love to hear from you!</p>
          <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-6 animate-fade-in-delay" style={{animationDelay: '0.2s'}}>
            <button className="bg-white text-blue-600 px-8 py-4 rounded-lg font-semibold hover:bg-gray-100 transition transform hover:scale-105 shadow-lg">
              Submit Article
            </button>
            <button className="border-2 border-white text-white px-8 py-4 rounded-lg font-semibold hover:bg-white hover:text-blue-600 transition transform hover:scale-105">
              Contact Editor
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

        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }

        .line-clamp-3 {
          display: -webkit-box;
          -webkit-line-clamp: 3;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
      `}</style>
    </div>
  )
}

export default NewsToday
