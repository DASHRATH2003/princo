import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useCart } from '../context/CartContext'
import { getProductsByCategory } from '../services/productService'
import { getSubcategoriesByCategory } from '../services/subcategoryService'

// Reuse animations and styles from Printing page
const customStyles = `
  .scrollbar-hide::-webkit-scrollbar { display: none; }
  .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
  @keyframes fade-in-up { 0% { opacity: 0; transform: translateY(20px);} 100% { opacity:1; transform: translateY(0); } }
  .animate-fade-in-up { animation: fade-in-up 0.6s ease-out; }
  @keyframes slide-up { 0% { opacity:0; transform: translateY(10px);} 100% { opacity:1; transform: translateY(0);} }
  .animate-slide-up { animation: slide-up 0.5s ease-out; }
  @keyframes float { 0% { transform: translateY(0);} 50% { transform: translateY(-8px);} 100% { transform: translateY(0);} }
  .animate-float { animation: float 3s ease-in-out infinite; }
  .animation-delay-200 { animation-delay: 200ms; }
  .animation-delay-300 { animation-delay: 300ms; }
  .animation-delay-400 { animation-delay: 400ms; }
  .animation-delay-500 { animation-delay: 500ms; }
  .animation-delay-600 { animation-delay: 600ms; }
  .animation-delay-700 { animation-delay: 700ms; }
  .animation-delay-900 { animation-delay: 900ms; }
  .animate-bounce-slow { animation: bounce 2s infinite; }
  .animate-spin-slow { animation: spin 3s linear infinite; }
`

if (typeof document !== 'undefined') {
  const styleSheet = document.createElement('style');
  styleSheet.type = 'text/css';
  styleSheet.innerText = customStyles;
  document.head.appendChild(styleSheet);
}

const Oldee = () => {
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

  const extractCategories = (products) => {
    const unique = new Set();
    unique.add('All Products');
    products.forEach(p => {
      const subName = getSubcategoryName(p.subcategory);
      if (subName && subName.trim() !== '') unique.add(subName);
    });
    return Array.from(unique);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const productResponse = await getProductsByCategory('oldee');
        setProducts(productResponse?.data || []);
        try {
          const subs = await getSubcategoriesByCategory('oldee');
          const subNames = ['All Products', ...subs.map(s => s.name)];
          setCategories(subNames);
        } catch (e) {
          console.error('Subcategory fetch failed for oldee:', e);
          setCategories(extractCategories(productResponse?.data || []));
        }
      } catch (err) {
        console.error('Error fetching oldee data:', err);
        setProducts([]);
        setCategories(['All Products']);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const filteredProducts = products.filter(product => {
    const subName = getSubcategoryName(product.subcategory);
    const matchesCategory = selectedCategory === 'All Products' || (subName && subName === selectedCategory);
    const matchesPrice = product.price >= priceRange[0] && product.price <= priceRange[1];
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesPrice && matchesSearch;
  });

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
            {/* Subcategories */}
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

          {/* Service Type Filter (Oldee specific) */}
          <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
            <h3 className="font-semibold text-gray-800 mb-4">Service Type</h3>
            <div className="space-y-2">
              {['Consultation', 'Custom Design', 'Restoration', 'Digital Setup', 'End-to-End Service'].map((type) => (
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

          {/* Delivery Time Filter (Oldee specific) */}
          <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
            <h3 className="font-semibold text-gray-800 mb-4">Delivery Time</h3>
            <div className="space-y-2">
              {['48 hours', '3-5 days', '1 week', '2+ weeks', 'On-demand schedule'].map((delivery) => (
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
            {/* Category Tabs */}
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
                {selectedCategory === 'All Products' ? 'All Oldee Services' : selectedCategory}
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
        </div>
      </div>

      {/* Hero/Info sections reused with Oldee wording */}
      <div className="bg-gradient-to-br from-purple-50 to-indigo-100 py-16">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4 animate-fade-in-up">Our Oldee Process</h2>
            <p className="text-xl text-gray-600 animate-fade-in-up animation-delay-200">Professional Quality Services with Advanced Technology</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="bg-white rounded-xl shadow-sm p-6 animate-slide-up">
              <div className="flex items-center mb-3">
                <div className="w-10 h-10 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center font-bold">1</div>
                <h3 className="ml-3 text-lg font-semibold text-gray-900">Requirement Consultation</h3>
              </div>
              <p className="text-gray-600 text-sm">We understand your exact needs, budget, timeline and expected outcomes to suggest the best Oldee service plan.</p>
            </div>
            <div className="bg-white rounded-xl shadow-sm p-6 animate-slide-up animation-delay-200">
              <div className="flex items-center mb-3">
                <div className="w-10 h-10 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center font-bold">2</div>
                <h3 className="ml-3 text-lg font-semibold text-gray-900">Design & Proposal</h3>
              </div>
              <p className="text-gray-600 text-sm">Clear scope, mockups and pricing with multiple options so you can pick exactly what fits.</p>
            </div>
            <div className="bg-white rounded-xl shadow-sm p-6 animate-slide-up animation-delay-300">
              <div className="flex items-center mb-3">
                <div className="w-10 h-10 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center font-bold">3</div>
                <h3 className="ml-3 text-lg font-semibold text-gray-900">Prototype & Approval</h3>
              </div>
              <p className="text-gray-600 text-sm">We prepare a sample/prototype for your review and iterate until you’re happy.</p>
            </div>
            <div className="bg-white rounded-xl shadow-sm p-6 animate-slide-up animation-delay-400">
              <div className="flex items-center mb-3">
                <div className="w-10 h-10 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center font-bold">4</div>
                <h3 className="ml-3 text-lg font-semibold text-gray-900">Production & Execution</h3>
              </div>
              <p className="text-gray-600 text-sm">Managed execution with quality controls, milestone updates and transparent progress tracking.</p>
            </div>
            <div className="bg-white rounded-xl shadow-sm p-6 animate-slide-up animation-delay-500">
              <div className="flex items-center mb-3">
                <div className="w-10 h-10 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center font-bold">5</div>
                <h3 className="ml-3 text-lg font-semibold text-gray-900">Quality Assurance</h3>
              </div>
              <p className="text-gray-600 text-sm">Multi‑point checks for material, finish and specifications so the final output meets standards.</p>
            </div>
            <div className="bg-white rounded-xl shadow-sm p-6 animate-slide-up animation-delay-600">
              <div className="flex items-center mb-3">
                <div className="w-10 h-10 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center font-bold">6</div>
                <h3 className="ml-3 text-lg font-semibold text-gray-900">Delivery & Support</h3>
              </div>
              <p className="text-gray-600 text-sm">On‑time delivery with post‑service assistance, warranty guidance and easy re‑orders.</p>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4 animate-fade-in-up">Why Choose Oldee?</h2>
            <p className="text-xl text-gray-600 animate-fade-in-up animation-delay-200">Premium Quality Oldee Services</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="border rounded-xl p-6 bg-gray-50 hover:bg-white transition-colors shadow-sm animate-slide-up">
              <div className="text-2xl mb-2">🎯</div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Tailored Solutions</h3>
              <p className="text-gray-600 text-sm">Every order is customized to your industry, use‑case and brand needs.</p>
            </div>
            <div className="border rounded-xl p-6 bg-gray-50 hover:bg-white transition-colors shadow-sm animate-slide-up animation-delay-200">
              <div className="text-2xl mb-2">⚡</div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Fast Turnaround</h3>
              <p className="text-gray-600 text-sm">Efficient workflows and priority lanes to meet tight deadlines.</p>
            </div>
            <div className="border rounded-xl p-6 bg-gray-50 hover:bg-white transition-colors shadow-sm animate-slide-up animation-delay-300">
              <div className="text-2xl mb-2">🧩</div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Expert Team</h3>
              <p className="text-gray-600 text-sm">Skilled professionals with hands‑on execution and proactive communication.</p>
            </div>
            <div className="border rounded-xl p-6 bg-gray-50 hover:bg-white transition-colors shadow-sm animate-slide-up animation-delay-400">
              <div className="text-2xl mb-2">🔍</div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Quality Control</h3>
              <p className="text-gray-600 text-sm">Checks at each stage ensure consistent results and minimal defects.</p>
            </div>
            <div className="border rounded-xl p-6 bg-gray-50 hover:bg-white transition-colors shadow-sm animate-slide-up animation-delay-500">
              <div className="text-2xl mb-2">💰</div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Transparent Pricing</h3>
              <p className="text-gray-600 text-sm">Clear estimates with no hidden charges and best value guarantees.</p>
            </div>
            <div className="border rounded-xl p-6 bg-gray-50 hover:bg-white transition-colors shadow-sm animate-slide-up animation-delay-600">
              <div className="text-2xl mb-2">🚚</div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Doorstep Service</h3>
              <p className="text-gray-600 text-sm">Pickup, delivery and on‑site assistance available in supported locations.</p>
            </div>
          </div>

          <div className="mt-10 grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
            <div className="bg-gray-50 rounded-xl p-4">
              <div className="text-2xl font-bold text-gray-900">500+</div>
              <div className="text-xs text-gray-600">Projects Delivered</div>
            </div>
            <div className="bg-gray-50 rounded-xl p-4">
              <div className="text-2xl font-bold text-gray-900">4.8★</div>
              <div className="text-xs text-gray-600">Avg. Customer Rating</div>
            </div>
            <div className="bg-gray-50 rounded-xl p-4">
              <div className="text-2xl font-bold text-gray-900">24–72h</div>
              <div className="text-xs text-gray-600">Priority Turnaround</div>
            </div>
            <div className="bg-gray-50 rounded-xl p-4">
              <div className="text-2xl font-bold text-gray-900">100%</div>
              <div className="text-xs text-gray-600">Quality Checked</div>
            </div>
          </div>
        </div>
      </div>

     

      <div className="bg-gradient-to-r from-purple-600 via-pink-600 to-indigo-600 py-16 relative overflow-hidden">
        <div className="container-responsive text-center relative z-10">
          <div className="animate-fade-in-up">
            <h2 className="text-5xl font-bold text-white mb-6">Order Today!</h2>
            <p className="text-xl text-white/90 mb-8">Professional Oldee Services at Your Doorstep</p>
          </div>
          <div className="flex flex-col sm:flex-row justify-center items-center space-y-4 sm:space-y-0 sm:space-x-6 animate-slide-up animation-delay-300">
            <button className="bg-white text-purple-600 px-8 py-4 rounded-full font-bold text-lg hover:bg-gray-100 transition-all duration-300 transform hover:scale-105 shadow-2xl animate-pulse">📞 Call Now</button>
            <button className="bg-yellow-400 text-gray-800 px-8 py-4 rounded-full font-bold text-lg hover:bg-yellow-300 transition-all duration-300 transform hover:scale-105 shadow-2xl animate-bounce-slow">💬 WhatsApp Message</button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Oldee