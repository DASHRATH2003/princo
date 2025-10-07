import React, { useState, useEffect } from 'react';
import { useCart } from '../context/CartContext';
import { useNavigate } from 'react-router-dom';
import { getProductsByCategory } from '../services/productService';

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
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const response = await getProductsByCategory('localmarket');
        if (response.success) {
          setProducts(response.data);
          const uniqueCategories = extractCategories(response.data);
          setCategories(uniqueCategories);
        } else {
          setCategories(['All']);
        }
      } catch (error) {
        setCategories(['All']);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  const filteredProducts = products.filter((product) => {
    const subName = getSubcategoryName(product.subcategory);
    const matchesCategory = selectedCategory === 'All' || (subName && subName === selectedCategory);
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesPrice = product.price >= priceRange[0] && product.price <= priceRange[1];
    return matchesSearch && matchesCategory && matchesPrice;
  });

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-full mx-auto px-2 py-6">
        <div className="flex flex-col lg:flex-row gap-4">
          {/* Sidebar Filters */}
          <div className={`w-full lg:w-60 space-y-5 ${showFilters ? 'block' : 'hidden lg:block'}`}>
            {/* Categories */}
            <div className="bg-white rounded-lg shadow-sm p-3">
              <h3 className="text-md font-semibold text-gray-900 mb-3">Categories</h3>
              <div className="space-y-1">
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

            {/* Freshness */}
            <div className="bg-white rounded-lg shadow-sm p-3">
              <h3 className="text-md font-semibold text-gray-900 mb-3">Freshness</h3>
              <div className="space-y-1">
                {freshnessLevels.map((level) => (
                  <label key={level} className="flex items-center">
                    <input type="checkbox" className="rounded border-gray-300 text-green-600 focus:ring-green-500" />
                    <span className="ml-2 text-sm text-gray-600">{level}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Delivery Time */}
            <div className="bg-white rounded-lg shadow-sm p-3">
              <h3 className="text-md font-semibold text-gray-900 mb-3">Delivery Time</h3>
              <div className="space-y-1">
                {deliveryOptions.map((option) => (
                  <label key={option} className="flex items-center">
                    <input type="checkbox" className="rounded border-gray-300 text-green-600 focus:ring-green-500" />
                    <span className="ml-2 text-sm text-gray-600">{option}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Price Range */}
            <div className="bg-white rounded-lg shadow-sm p-3">
              <h3 className="text-md font-semibold text-gray-900 mb-3">Price Range</h3>
              <input
                type="range"
                min="0"
                max="1000"
                value={priceRange[1]}
                onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value)])}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
              />
              <div className="flex justify-between text-sm text-gray-600 mt-1">
                <span>₹{priceRange[0]}</span>
                <span>₹{priceRange[1]}</span>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            {/* Tabs */}
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

            {/* 🧹 Search Box Removed */}

            {/* Product Cards */}
            {loading ? (
              <div className="flex justify-center items-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 2xl:grid-cols-6 gap-4">
                {filteredProducts.map((product) => (
                  <div
                    key={product._id}
                    className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200 overflow-hidden group"
                  >
                    <div className="relative">
                      <img
                        src={product.image || '/no-image.svg'}
                        alt={product.name}
                        className="w-full h-40 object-contain bg-white group-hover:scale-105 transition-transform duration-200 cursor-pointer"
                        onError={(e) => {
                          e.currentTarget.src = '/no-image.svg';
                        }}
                        onClick={() => navigate(`/product/${product._id}`)}
                      />
                      {product.discount > 0 && (
                        <div className="absolute top-2 left-2 bg-red-500 text-white px-2 py-1 rounded-md text-xs font-medium">
                          {product.discount}% OFF
                        </div>
                      )}
                    </div>

                    <div className="p-4">
                      <h3 className="text-lg font-semibold text-gray-900 mb-1">{product.name}</h3>
                      <p className="text-sm text-gray-600 mb-2">{product.unit || 'per unit'}</p>
                      <span className="text-lg font-bold text-gray-900">₹{product.offerPrice ?? product.price}</span>

                      {/* ✅ Add to Cart Button */}
                      <button
                        onClick={() => addToCart(product)}
                        className="mt-3 w-full bg-green-500 hover:bg-green-600 text-white py-2 rounded-lg transition-colors text-sm font-medium"
                      >
                        Add to Cart
                      </button>
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
