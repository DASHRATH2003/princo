import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { useCart } from '../context/CartContext';
import { getAllProducts } from '../services/productService';
import { getPosters } from '../services/posterService';
import { getBanners } from '../services/bannerService';
import { getSubcategoriesByCategory } from '../services/subcategoryService';

const Home = () => {
  const { addToCart } = useCart();
  const [products, setProducts] = useState([]);
  const [error, setError] = useState(null);
  const [categories, setCategories] = useState([]);
  const [subcategories, setSubcategories] = useState([]);
  const [subsLoading, setSubsLoading] = useState(false);
  const subsScrollRef = useRef(null);
  const [subsOverflow, setSubsOverflow] = useState(false);

  const handleSubsWheelScroll = (e) => {
    // Convert vertical mouse wheel to horizontal scroll inside subcategory strip
    if (!subsScrollRef.current) return;
    const absY = Math.abs(e.deltaY);
    const absX = Math.abs(e.deltaX || 0);
    if (absY > absX) {
      e.preventDefault();
      subsScrollRef.current.scrollBy({ left: e.deltaY, behavior: 'smooth' });
    }
  };

  // Detect overflow to conditionally show edge mask (no blur when centered few items)
  useEffect(() => {
    const el = subsScrollRef.current;
    if (!el) return;
    // small timeout to ensure layout computed after images load
    const id = setTimeout(() => {
      setSubsOverflow(el.scrollWidth > el.clientWidth + 2);
    }, 50);
    return () => clearTimeout(id);
  }, [subcategories]);
  
  // Hero slider images (only posters from backend)
  const [images, setImages] = useState([]);
  const [current, setCurrent] = useState(0);
  const [banners, setBanners] = useState([]);

  // Fetch real products from database
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await getAllProducts();
        console.log('Products response:', response); // Debug log
        if (response && response.data) {
          setProducts(response.data);
        } else if (Array.isArray(response)) {
          setProducts(response);
        } else if (response && response.products) {
          setProducts(response.products);
        }
      } catch (err) {
        console.error('Error fetching products:', err);
        setError('Failed to load products. Please try again later.');
      }
    };

    fetchProducts();
  }, []);

  // Fetch posters for hero slider
  useEffect(() => {
    const fetchPosters = async () => {
      try {
        const posters = await getPosters();
        const urls = Array.isArray(posters)
          ? posters.map(p => p.imageUrl).filter(Boolean)
          : [];
        setImages(urls);
      } catch (err) {
        console.error('Error fetching posters for hero slider:', err);
        setImages([]);
      }
    };

    fetchPosters();
  }, []);

  // Fetch banners for hero overlay scrolling
  useEffect(() => {
    const loadBanners = async () => {
      try {
        const list = await getBanners();
        const arr = Array.isArray(list) ? list : [];
        setBanners(arr);
      } catch (err) {
        console.error('Error fetching banners:', err);
        setBanners([]);
      }
    };
    loadBanners();
  }, []);

  // Auto change every 4 sec
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrent((prev) => (prev === images.length - 1 ? 0 : prev + 1));
    }, 4000);
    return () => clearInterval(interval);
  }, [images.length]);

  // Fetch subcategories for all categories (dynamic)
  useEffect(() => {
    const loadSubs = async () => {
      try {
        setSubsLoading(true);
        const categoriesToLoad = ['l-mart', 'localmarket', 'printing', 'oldee'];
        const results = await Promise.all(
          categoriesToLoad.map((cat) => getSubcategoriesByCategory(cat).catch(() => []))
        );
        // Merge and filter: only include subcategories that have an imageUrl
        const merged = results
          .flat()
          .filter(Boolean)
          .filter((sc) => {
            const url = String(sc?.imageUrl || '').trim();
            return url.length > 0; // only those with image
          });
        // Optional: sort by name for consistent ordering
        merged.sort((a, b) => String(a?.name || '').localeCompare(String(b?.name || '')));
        setSubcategories(merged);
      } catch (err) {
        console.error('Error fetching subcategories:', err);
        setSubcategories([]);
      } finally {
        setSubsLoading(false);
      }
    };
    loadSubs();
  }, []);

  const featuredProducts = products.filter((product) => product.featured);
  const otherProducts = products.filter((product) => !product.featured);

  // If no featured products, use all products
  const displayProducts = featuredProducts.length > 0 ? featuredProducts : products;

  // Map product category to its listing page route
  const getCategoryRoute = (product) => {
    const cat = String(product?.category || '').toLowerCase();
    const map = {
      'emart': '/e-market',
      'e-mart': '/e-market',
      'l-mart': '/e-market',
      'lmart': '/e-market',
      'localmarket': '/local-market',
      'local-market': '/local-market',
      'printing': '/printing',
      'print': '/printing',
      'oldee': '/oldee',
      'news': '/news-today',
      'news-today': '/news-today',
    };
    return map[cat] || `/product/${product._id || product.id}`;
  };

  // Compute route for a banner using its stored category or linked product
  const getBannerRoute = (banner) => {
    const map = {
      'emart': '/e-market',
      'e-mart': '/e-market',
      'l-mart': '/e-market',
      'lmart': '/e-market',
      'localmarket': '/local-market',
      'local-market': '/local-market',
      'printing': '/printing',
      'print': '/printing',
      'oldee': '/oldee',
      'news': '/news-today',
      'news-today': '/news-today',
    };
    // 1) Prefer category stored on banner
    let category = String(banner?.category || '').toLowerCase();
    if (map[category]) return map[category];

    // 2) If product populated with category
    category = String(banner?.productId?.category || '').toLowerCase();
    if (map[category]) return map[category];

    // 3) If only productId string available, find in fetched products
    const pid = banner?.productId;
    if (pid) {
      const match = products.find(pr => String(pr._id || pr.id) === String(typeof pid === 'string' ? pid : pid?._id || pid?.id));
      const cat2 = String(match?.category || '').toLowerCase();
      if (map[cat2]) return map[cat2];
      const id = typeof pid === 'string' ? pid : (pid?._id || pid?.id);
      if (id) return `/product/${id}`;
    }

    // Fallback to home
    return '/';
  };

  return (
    <div className="min-h-screen bg-white relative overflow-hidden">
      {/* Error State */}
      {error && (
        <div className="fixed inset-0 bg-white/80 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="text-center bg-red-50 border border-red-200 rounded-lg p-6 max-w-md">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <p className="text-red-600 font-medium mb-4">{error}</p>
            <button 
              onClick={() => window.location.reload()} 
              className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
            >
              Retry
            </button>
          </div>
        </div>
      )}

      {/* Hero Section */}
      <div className="relative w-full h-[70vh] sm:h-[75vh] md:h-[80vh] lg:h-[85vh] xl:h-[90vh] overflow-hidden">
        {images.length > 0 ? (
          images.map((img, index) => (
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
                onError={(e) => { e.currentTarget.style.display = 'none'; }}
              />
            </div>
          ))
        ) : (
          <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-purple-100 to-blue-100">
            <div className="text-center">
              <div className="text-sm text-gray-600">No posters found</div>
              <div className="text-xs text-gray-500">Add posters in Admin Dashboard</div>
            </div>
          </div>
        )}

        {/* Welcome Text Overlay */}
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-black bg-opacity-40">
          <div className="text-center text-white px-4 mb-6 sm:mb-8 lg:mb-10">
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold mb-3 sm:mb-4 lg:mb-6 animate-fade-in leading-tight">
              Welcome to L-Mart
            </h1>
            <p className="text-lg sm:text-xl md:text-2xl lg:text-3xl xl:text-4xl font-medium animate-slide-up leading-relaxed">
              A Small Attempt at Online Shopping with all
            </p>
          </div>
          
          {/* Banner Boxes Overlay with Auto Scroll */}
          <div className="container-responsive">
            <div className="relative overflow-hidden">
              <div className={`flex space-x-2 sm:space-x-3 md:space-x-4 lg:space-x-5 ${banners.length > 6 ? 'animate-scroll-horizontal' : ''}`} style={{width: banners.length > 6 ? '200%' : '100%'}}>
                {/* First set of banners */}
                {banners.length > 0 ? banners.map((banner) => (
                  <Link
                    to={getBannerRoute(banner)}
                    key={`banner-first-${banner._id}`}
                    className="bg-white bg-opacity-90 rounded-lg shadow-lg overflow-hidden border-2 border-yellow-400 hover:shadow-xl transition-all transform hover:scale-105 flex-shrink-0 w-28 sm:w-32 md:w-36 lg:w-40 xl:w-44"
                  >
                    <img
                      src={banner.imageUrl || '/no-image.svg'}
                      alt={banner.imageTitle || banner.name || 'Banner'}
                      className="w-full h-14 sm:h-16 md:h-20 lg:h-24 xl:h-28 object-contain bg-white"
                      onError={(e) => { e.currentTarget.src = '/no-image.svg'; }}
                    />
                    <div className="p-1 sm:p-2 lg:p-3">
                      <h3 className="text-xs sm:text-sm lg:text-base font-semibold text-gray-800 truncate">{banner.name || 'Banner'}</h3>
                      <p className="text-xs sm:text-sm text-gray-600 truncate">{banner.imageTitle || ''}</p>
                    </div>
                  </Link>
                )) : (
                  <div className="flex items-center justify-center w-full py-8">
                    <p className="text-gray-500 text-center">No banners available</p>
                  </div>
                )}

                {/* Removed duplicate set to avoid showing banners twice */}
              </div>
            </div>
          </div>
        </div>

        {/* Dots Indicator */}
        {images.length > 0 && (
          <div className="absolute bottom-3 sm:bottom-4 md:bottom-6 lg:bottom-8 left-1/2 transform -translate-x-1/2 flex space-x-2">
            {images.map((_, index) => (
              <button
                key={index}
                className={`w-2 h-2 sm:w-3 sm:h-3 lg:w-4 lg:h-4 rounded-full transition-colors ${
                  index === current ? "bg-white" : "bg-gray-400"
                }`}
                onClick={() => setCurrent(index)}
              ></button>
            ))}
          </div>
        )}
      </div>

      {/* Categories Section */}
      <div className="py-6 sm:py-8 md:py-10 lg:py-12 bg-gray-50">
        <div className="container-responsive">
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-center mb-6 sm:mb-8 md:mb-10 lg:mb-12 animate-fade-in">
            Shop by Category
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 md:gap-8 lg:gap-10">
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
                Explore L-mart →
              </Link>
            </div>

            {/* Fashion & Apparel */}
            <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition transform hover:scale-105 animate-fade-in-delay">
              <div className="w-16 h-16 bg-pink-100 rounded-full flex items-center justify-center mb-4">
                <svg
                  className="w-8 h-8 text-pink-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 7l8-4 8 4v10a2 2 0 01-2 2H6a2 2 0 01-2-2V7zm4 4h8m-8 4h8"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Fashion & Apparel</h3>
              <p className="text-gray-600 mb-4">
                T‑shirts, clothing, and accessories
              </p>
              <Link
                to="/e-market"
                className="text-pink-600 hover:text-pink-800 font-medium transition-colors"
              >
                Explore →
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Sub Category Section */}
      <div className="py-12 bg-white">
        <div className="container-responsive">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center px-6 py-2 bg-gradient-to-r from-orange-400 to-red-500 text-white rounded-full text-sm font-semibold mb-4">
              <span className="mr-2">◀</span>
              SUB CATEGORY
              <span className="ml-2">▶</span>
            </div>
          </div>
          {subsLoading ? (
            <div className="flex justify-center items-center py-6">
              <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-purple-600"></div>
            </div>
          ) : (
            <div
              className={`mb-8 relative overflow-x-auto scrollbar-hide`}
              ref={subsScrollRef}
              onWheel={handleSubsWheelScroll}
            >
              {/* Center when few items; scroll when overflow */}
              <div className="flex items-start gap-6 px-1 sm:px-2 md:px-3 lg:px-4 flex-nowrap w-max mx-auto justify-center">
                {subcategories.map((sc) => {
                  const routeMap = {
                    'l-mart': '/e-market',
                    'localmarket': '/local-market',
                    'printing': '/printing',
                    'oldee': '/oldee'
                  };
                  const target = routeMap[String(sc?.category || '').toLowerCase()] || '/';
                  return (
                    <Link
                      to={target}
                      key={sc._id}
                      className="flex flex-col items-center group cursor-pointer flex-shrink-0 snap-start"
                    >
                      <div className="w-24 h-24 bg-gradient-to-br from-purple-100 to-purple-200 rounded-full flex items-center justify-center mb-3 group-hover:scale-110 transition-transform duration-300 overflow-hidden">
                        <img
                          src={sc.imageUrl || "/no-image.svg"}
                          alt={sc.name}
                          className="w-20 h-20 rounded-full object-cover shadow-md"
                          onError={(e) => { e.currentTarget.src = '/no-image.svg'; }}
                        />
                      </div>
                      <h3 className="text-sm font-medium text-gray-900 text-center whitespace-nowrap">{sc.name}</h3>
                    </Link>
                  );
                })}
                {subcategories.length === 0 && (
                  <div className="text-center text-gray-500 py-4 w-full">
                    No subcategories found
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Complete Product Collection */}
      <div className="py-8 bg-white">
        <div className="container-responsive">
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
              <Link 
                to={`/product/${product._id || product.id}`}
                key={product._id || product.id || index} 
                className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:scale-105"
              >
                {/* Product Image */}
                <div className="relative bg-white">
                  <img
                    src={product.imageUrl || product.image || 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTUwIiBoZWlnaHQ9IjE1MCIgdmlld0JveD0iMCAwIDE1MCAxNTAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIxNTAiIGhlaWdodD0iMTUwIiBmaWxsPSIjRjNGNEY2Ii8+Cjx0ZXh0IHg9Ijc1IiB5PSI3NSIgZm9udC1mYW1pbHk9IkFyaWFsIiBmb250LXNpemU9IjEyIiBmaWxsPSIjOUI5QjlCIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBkeT0iLjNlbSI+Tm8gSW1hZ2U8L3RleHQ+Cjwvc3ZnPgo='}
                    alt={product.name}
                    className="w-full h-32 sm:h-40 md:h-48 object-contain"
                    onError={(e) => {
                      console.log('Image failed to load in featured section for product:', product.name, 'Image URL:', product.imageUrl || product.image);
                      e.target.src = 'https://via.placeholder.com/150?text=Product+Image';
                    }}
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
                      <span className="text-sm sm:text-lg font-bold text-gray-900">₹{(product.offerPrice ?? product.price)}</span>
                      <span className="text-xs sm:text-sm text-gray-500 line-through">₹{(product.price + 50)}</span>
                    </div>
                  </div>
                  
                  {/* Add to Cart Button */}
                  <button 
                    onClick={() => {
                      const effectivePrice = (product.offerPrice !== null && product.offerPrice !== undefined && product.offerPrice > 0)
                        ? product.offerPrice
                        : product.price;
                      addToCart({ ...product, id: product._id || product.id, image: product.imageUrl, price: effectivePrice });
                    }}
                    className="w-full bg-orange-500 hover:bg-orange-600 text-white py-1.5 sm:py-2 px-2 sm:px-4 rounded-lg text-xs sm:text-sm font-medium transition-colors duration-200 flex items-center justify-center space-x-1"
                  >
                    <svg className="w-3 h-3 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-2.5 5M7 13l2.5 5m6-5v6a2 2 0 01-2 2H9a2 2 0 01-2-2v-6m8 0V9a2 2 0 00-2-2H9a2 2 0 00-2 2v4.01" />
                    </svg>
                    <span className="hidden sm:inline">Add to Cart</span>
                    <span className="sm:hidden">Add</span>
                  </button>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Premium Bestsellers */}
      <div className="py-8 bg-gray-50">
        <div className="container-responsive">
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
              <Link 
                to={`/product/${product._id || product.id}`}
                key={product.id} 
                className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:scale-105"
              >
                {/* Product Image */}
                <div className="relative bg-white">
                  <img
                    src={product.imageUrl || product.image || 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgdmlld0JveD0iMCAwIDQwMCAzMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSI0MDAiIGhlaWdodD0iMzAwIiBmaWxsPSIjRjNGNEY2Ii8+Cjx0ZXh0IHg9IjIwMCIgeT0iMTUwIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMTYiIGZpbGw9IiM5QjlCOUIiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGR5PSIuM2VtIj5ObyBJbWFnZTwvdGV4dD4KPC9zdmc+Cg=='}
                    alt={product.name}
                    className="w-full h-32 sm:h-40 md:h-48 object-contain"
                    onError={(e) => {
                      console.log('Product grid image failed to load:', product.name, 'Image URL:', product.imageUrl || product.image);
                      e.target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgdmlld0JveD0iMCAwIDQwMCAzMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSI0MDAiIGhlaWdodD0iMzAwIiBmaWxsPSIjRjNGNEY2Ii8+Cjx0ZXh0IHg9IjIwMCIgeT0iMTUwIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMTYiIGZpbGw9IiM5QjlCOUIiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGR5PSIuM2VtIj5ObyBJbWFnZTwvdGV4dD4KPC9zdmc+Cg==';
                    }}
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
                      <span className="text-sm sm:text-lg font-bold text-gray-900">₹{(product.offerPrice ?? product.price)}</span>
                      <span className="text-xs sm:text-sm text-gray-500 line-through">₹{(product.price + 100)}</span>
                    </div>
                  </div>
                  
                  {/* Add to Cart Button */}
                  <button 
                    onClick={() => {
                      const effectivePrice = (product.offerPrice !== null && product.offerPrice !== undefined && product.offerPrice > 0)
                        ? product.offerPrice
                        : product.price;
                      addToCart({ ...product, id: product._id || product.id, image: product.imageUrl, price: effectivePrice });
                    }}
                    className="w-full bg-purple-600 hover:bg-purple-700 text-white py-1.5 sm:py-2 px-2 sm:px-4 rounded-lg text-xs sm:text-sm font-medium transition-colors duration-200 flex items-center justify-center space-x-1"
                  >
                    <svg className="w-3 h-3 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-2.5 5M7 13l2.5 5m6-5v6a2 2 0 01-2 2H9a2 2 0 01-2-2v-6m8 0V9a2 2 0 00-2-2H9a2 2 0 00-2 2v4.01" />
                    </svg>
                    <span className="hidden sm:inline">Add to Cart</span>
                    <span className="sm:hidden">Add</span>
                  </button>
                </div>
              </Link>
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
        <div className="container-responsive">
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
          Welcome to <span className="text-orange-500">L-Mart</span> – India's Trusted Online Printing Partner
        </h2>
        
        {/* Intro */}
        <p className="text-gray-700 text-lg leading-relaxed mb-4 text-center">
          At <b>L-Mart</b>, we deliver <span className="text-purple-600 font-semibold">reliable, affordable, and premium-quality online printing</span> services for students, startups, corporates, and individuals across India.
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
            💡 Why Choose L-Mart?
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
    </div>
  );
};

export default Home;