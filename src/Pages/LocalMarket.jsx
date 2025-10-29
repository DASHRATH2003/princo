import React, { useState, useEffect } from 'react';
import { useCart } from '../context/CartContext';
import { useNavigate } from 'react-router-dom';
import { getProductsByCategory } from '../services/productService';
import { getSubcategoriesByCategory } from '../services/subcategoryService';

const LocalMarket = () => {
  const { addToCart } = useCart();
  const navigate = useNavigate();

  const [selectedCategory, setSelectedCategory] = useState('All');
  const [priceRange, setPriceRange] = useState([0, 5000]);
  const [showFilters, setShowFilters] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState(['All']);

  const getSubcategoryName = (sc) => {
    if (sc && typeof sc === 'object') {
      return sc.name || '';
    }
    return typeof sc === 'string' ? sc : '';
  };

  const extractCategories = (products) => {
    const uniqueCategories = new Set();
    uniqueCategories.add('All');
    products.forEach((product) => {
      const subName = getSubcategoryName(product.subcategory);
      if (subName && subName.trim() !== '') {
        uniqueCategories.add(subName);
      }
    });
    return Array.from(uniqueCategories);
  };

  const freshnessLevels = ['Fresh Today', 'Farm Fresh', 'Organic'];
  const deliveryOptions = ['Same Day', '2-4 Hours', 'Next Day'];

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Fetch products
        const productResponse = await getProductsByCategory('localmarket');
        if (productResponse.success) {
          setProducts(productResponse.data);
        } else {
          setProducts([]);
        }

        // Fetch subcategories from backend
        try {
          const subcategories = await getSubcategoriesByCategory('localmarket');
          const subcategoryNames = ['All', ...subcategories.map(sub => sub.name)];
          setCategories(subcategoryNames);
        } catch (subError) {
          console.error('Error fetching subcategories:', subError);
          // Fallback to extracting from products if subcategory fetch fails
          const uniqueCategories = extractCategories(productResponse.data || []);
          setCategories(uniqueCategories);
        }
      } catch (error) {
        console.error('Error fetching localmarket data:', error);
        setProducts([]);
        setCategories(['All']);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const filteredProducts = products.filter((product) => {
    const subName = getSubcategoryName(product.subcategory);
    const matchesCategory = selectedCategory === 'All' || (subName && subName === selectedCategory);
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesPrice = product.price >= priceRange[0] && product.price <= priceRange[1];
    return matchesSearch && matchesCategory && matchesPrice;
  });

  return (
    <div className="min-h-screen bg-gray-50 overflow-x-hidden">
      <div className="w-full mx-auto px-4 py-6">
        <div className="flex flex-col lg:flex-row gap-6 min-w-0">
          {/* Mobile Filter Toggle */}
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="lg:hidden mb-4 bg-white px-4 py-2 rounded-lg shadow-sm border flex items-center justify-center space-x-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
            </svg>
            <span>Filters</span>
          </button>

          {/* Sidebar Filters */}
          <div className={`w-full lg:w-64 xl:w-72 flex-shrink-0 space-y-6 ${showFilters ? 'block' : 'hidden lg:block'}`}>
            {/* Categories */}
            <div className="bg-white rounded-lg shadow-sm p-4">
              <h3 className="font-semibold text-gray-800 mb-4 text-base">Subcategories</h3>
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

            {/* Freshness */}
            <div className="bg-white rounded-lg shadow-sm p-4">
              <h3 className="font-semibold text-gray-800 mb-4 text-base">Freshness</h3>
              <div className="space-y-2">
                {freshnessLevels.map((level) => (
                  <div key={level} className="flex items-center space-x-3">
                    <input
                      type="checkbox"
                      id={level}
                      className="text-green-600 focus:ring-green-500 border-gray-300 rounded flex-shrink-0"
                    />
                    <label htmlFor={level} className="cursor-pointer text-sm text-gray-700 flex-1 truncate">{level}</label>
                  </div>
                ))}
              </div>
            </div>

            {/* Delivery Time */}
            <div className="bg-white rounded-lg shadow-sm p-4">
              <h3 className="font-semibold text-gray-800 mb-4 text-base">Delivery Time</h3>
              <div className="space-y-2">
                {deliveryOptions.map((option) => (
                  <div key={option} className="flex items-center space-x-3">
                    <input
                      type="checkbox"
                      id={option}
                      className="text-green-600 focus:ring-green-500 border-gray-300 rounded flex-shrink-0"
                    />
                    <label htmlFor={option} className="cursor-pointer text-sm text-gray-700 flex-1 truncate">{option}</label>
                  </div>
                ))}
              </div>
            </div>

            {/* Price Range */}
            <div className="bg-white rounded-lg shadow-sm p-4">
              <h3 className="font-semibold text-gray-800 mb-4 text-base">Price Range</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between text-sm text-gray-600">
                  <span>₹ {priceRange[0]}</span>
                  <span>₹ {priceRange[1]}.00</span>
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
                          onClick={() => addToCart(product)}
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
        </div>
      </div>
    </div>
  );
};

export default LocalMarket;
