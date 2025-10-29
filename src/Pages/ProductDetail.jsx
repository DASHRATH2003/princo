import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { getProductsByCategory } from "../services/productService";
import LoginModal from "../components/LoginModal";
import { getCurrentUser } from "../services/authService";

const ProductDetail = () => {
  const { productId } = useParams();
  const navigate = useNavigate();
  const { addToCart, items: cart, setSelected } = useCart();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [selectedMedia, setSelectedMedia] = useState('image'); // 'image' | 'video'
  const [selectedSize, setSelectedSize] = useState("");
  const [selectedColor, setSelectedColor] = useState("");
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [relatedLoading, setRelatedLoading] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const API_BASE_URL =
          import.meta.env.VITE_API_URL || "http://localhost:5000/api";

        const headers = { "Content-Type": "application/json" };
        const token = localStorage.getItem("adminToken");
        if (token) headers["Authorization"] = `Bearer ${token}`;

        const response = await fetch(`${API_BASE_URL}/products/single/${productId}`, {
          method: "GET",
          headers,
        });

        const data = await response.json();
        if (data.success && data.data) setProduct(data.data);
        else setProduct(null);
      } catch (error) {
        console.error("Error fetching product details:", error);
        setProduct(null);
      } finally {
        setLoading(false);
      }
    };

    if (productId) fetchProduct();
  }, [productId]);

  useEffect(() => {
    if (product) {
      const sizes = toList(product.sizeVarients);
      const colors = toList(product.colorVarients);

      // Remove auto-select of size to avoid showing "M" or any default
      if (!selectedSize && sizes.length > 0) setSelectedSize("");
      if (!selectedColor && colors.length > 0) setSelectedColor("");
    }
  }, [product]);

  const toList = (val) => {
    // Normalize to a list of strings for rendering
    if (Array.isArray(val)) {
      // If this is an array of objects (e.g., colorVarients as { color, images }), pick the color names
      if (val.length > 0 && typeof val[0] === "object" && val[0] !== null) {
        return val.map((v) => (typeof v === "string" ? v : (v?.color || ""))).filter(Boolean);
      }
      return val.filter(Boolean);
    }
    if (typeof val === "string") {
      try {
        const parsed = JSON.parse(val);
        if (Array.isArray(parsed)) {
          // If parsed array contains objects, map to color names
          if (parsed.length > 0 && typeof parsed[0] === "object" && parsed[0] !== null) {
            return parsed.map((v) => (typeof v === "string" ? v : (v?.color || ""))).filter(Boolean);
          }
          return parsed.filter(Boolean);
        }
      } catch {}
      return val.split(",").map((s) => s.trim()).filter(Boolean);
    }
    return [];
  };

  const getSubcategoryName = (sc) => {
    if (sc && typeof sc === "object") {
      return sc.name || "";
    }
    return typeof sc === "string" ? sc : "";
  };

  const handleAddToCart = () => {
    if (!product) return;
    const effectivePrice =
      product.offerPrice && product.offerPrice < product.price
        ? product.offerPrice
        : product.price;

    // Build a variant UID when size/color are chosen so variants remain distinct in cart
    const variantParts = [];
    if (selectedColor) variantParts.push(`color:${selectedColor}`);
    if (selectedSize) variantParts.push(`size:${selectedSize}`);
    const uid = variantParts.length
      ? `${product._id || product.id}::${variantParts.join('::')}`
      : undefined;

    // Ensure the image we add to cart matches the currently displayed image
    const allImages = [product.imageUrl || product.image, ...(product.images || [])].filter(Boolean);
    const selectedImageSrc = allImages[selectedImageIndex] || product.imageUrl || product.image;

    addToCart({
      ...product,
      id: product._id || product.id,
      uid,
      image: selectedImageSrc,
      price: effectivePrice,
      quantity,
      selectedSize,
      selectedColor,
    });
  };

  // Buy Now: add current selection to cart; if not logged in, prompt login before checkout
  const handleBuyNow = () => {
    if (!product) return;
    const effectivePrice =
      product.offerPrice && product.offerPrice < product.price
        ? product.offerPrice
        : product.price;

    const variantParts = [];
    if (selectedColor) variantParts.push(`color:${selectedColor}`);
    if (selectedSize) variantParts.push(`size:${selectedSize}`);
    const uid = variantParts.length
      ? `${product._id || product.id}::${variantParts.join('::')}`
      : (product._id || product.id);

    const allImages = [product.imageUrl || product.image, ...(product.images || [])].filter(Boolean);
    const selectedImageSrc = allImages[selectedImageIndex] || product.imageUrl || product.image;

    const targetItem = {
      ...product,
      id: product._id || product.id,
      uid,
      image: selectedImageSrc,
      price: effectivePrice,
      quantity,
      selectedSize,
      selectedColor,
    };

    // Ensure item exists in cart
    addToCart(targetItem);
    // Select only this item for checkout
    setSelected([uid]);

    // Require login before proceeding to checkout
    const user = getCurrentUser();
    if (!user) {
      try {
        localStorage.setItem(
          'buyNowIntent',
          JSON.stringify({ type: 'buyNow', uids: [uid], ts: Date.now() })
        );
      } catch (_) {}
      setShowLoginModal(true);
      return;
    }

    navigate('/checkout');
  };

  const incrementQuantity = () => setQuantity((q) => q + 1);
  const decrementQuantity = () => setQuantity((q) => (q > 1 ? q - 1 : 1));
  
  const handleQuantityChange = (e) => {
    const value = e.target.value;
    // Allow empty string for user to clear and type new number
    if (value === '') {
      setQuantity('');
      return;
    }
    // Parse and validate the number
    const num = parseInt(value, 10);
    if (!isNaN(num) && num >= 1) {
      setQuantity(num);
    }
  };

  const handleQuantityBlur = () => {
    // If quantity is empty or invalid, reset to 1
    if (quantity === '' || quantity < 1) {
      setQuantity(1);
    }
  };

  // Map product category to its listing page route
  const getCategoryRoute = (product) => {
    if (!product) return '/e-market';
    
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
      'news': '/news-today',
      'news-today': '/news-today',
    };
    return map[cat] || '/e-market';
  };

  // Display label for product category
  const getCategoryLabel = (product) => {
    const cat = String(product?.category || '').toLowerCase();
    const map = {
      'emart': 'E-Market',
      'e-mart': 'E-Market',
      'l-mart': 'E-Market',
      'lmart': 'E-Market',
      'localmarket': 'Local Market',
      'local-market': 'Local Market',
      'printing': 'Printing',
      'print': 'Printing',
      'oldee': 'Oldee',
      'news': 'Market News',
      'news-today': 'Market News',
    };
    return map[cat] || 'E-Market';
  };

  const getCategoryBadgeClass = (product) => {
    const cat = String(product?.category || '').toLowerCase();
    if (['localmarket','local-market'].includes(cat))
      return 'bg-green-100 text-green-700 border-green-200';
    if (['printing','print'].includes(cat))
      return 'bg-orange-100 text-orange-700 border-orange-200';
    if (['oldee'].includes(cat))
      return 'bg-pink-100 text-pink-700 border-pink-200';
    if (['news','news-today'].includes(cat))
      return 'bg-blue-100 text-blue-700 border-blue-200';
    return 'bg-purple-100 text-purple-700 border-purple-200';
  };

  // When a color is selected, switch the main image to the corresponding one
  const handleSelectColor = (color) => {
    setSelectedColor(color);
    if (!product) return;
    // If colorVarients are objects with images, switch to the first image for that color when available
    const variants = Array.isArray(product.colorVarients) ? product.colorVarients : [];
    const allImages = [product.imageUrl || product.image, ...(product.images || [])].filter(Boolean);
    const match = variants.find((v) => {
      const name = typeof v === "string" ? v : (v?.color || "");
      return name.toLowerCase() === (color || "").toLowerCase();
    });
    const firstImage = match && typeof match !== "string" ? (match.images?.[0] || null) : null;
    if (firstImage) {
      const idx = allImages.findIndex((img) => img === firstImage);
      if (idx >= 0) setSelectedImageIndex(idx);
    } else {
      // Fallback: try by position of color name among normalized list
      const colors = toList(product.colorVarients);
      const idx = colors.findIndex((c) => (c || "").toLowerCase() === (color || "").toLowerCase());
      // Map color index to product.images index; add 1 because allImages[0] is the main image
      const mappedIndex = idx >= 0 ? (idx + 1) : -1;
      if (mappedIndex >= 0 && mappedIndex < allImages.length) setSelectedImageIndex(mappedIndex);
    }
  };

  // Fetch related products based on same category and matching subcategory
  useEffect(() => {
    const fetchRelated = async () => {
      if (!product) return;
      try {
        setRelatedLoading(true);
        const res = await getProductsByCategory(product.category);
        const all = res?.data || [];
        const currentId = product._id || product.id;
        const subName = getSubcategoryName(product.subcategory);
        const filtered = all
          .filter((p) => (p._id || p.id) !== currentId)
          .filter((p) => {
            const ps = getSubcategoryName(p.subcategory);
            return subName ? ps === subName : true;
          });
        setRelatedProducts(filtered.slice(0, 8));
      } catch (err) {
        console.error("Error fetching related products:", err);
        setRelatedProducts([]);
      } finally {
        setRelatedLoading(false);
      }
    };
    fetchRelated();
  }, [product]);

  if (loading)
    return (
      <div className="flex justify-center items-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-purple-500"></div>
      </div>
    );

  if (!product)
    return (
      <div className="text-center py-20">
        <h2 className="text-2xl font-bold text-gray-800">Product Not Found</h2>
        <p className="text-gray-600 mt-2">
          The product you're looking for doesn't exist or has been removed.
        </p>
        <button
          onClick={() => navigate("/e-market")}
          className="mt-5 bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-lg font-medium"
        >
          Back to Shop
        </button>
      </div>
    );

  return (
    <div className="container mx-auto px-4 py-10">
      <div className="flex flex-col md:flex-row gap-8">
        {/* LEFT - Images */}
        <div className="md:w-1/2">
          <div className="bg-white rounded-xl shadow-md overflow-hidden">
            {selectedMedia === 'video' && product.videoUrl ? (
              <video
                controls
                src={product.videoUrl}
                className="w-full h-[400px] object-contain bg-gray-50"
              />
            ) : (
              <img
                src={
                  selectedImageIndex === 0
                    ? product.imageUrl || product.image
                    : product.images?.[selectedImageIndex - 1]
                }
                alt={product.name}
                className="w-full h-[400px] object-contain bg-gray-50"
                onError={(e) => { e.target.src = '/no-image.svg'; }}
              />
            )}

            <div className="flex gap-3 p-3 justify-center flex-wrap bg-gray-100">
              {(product.imageUrl || product.image) && (
                <img
                  src={product.imageUrl || product.image}
                  alt="Main"
                  onClick={() => { setSelectedMedia('image'); setSelectedImageIndex(0); }}
                  className={`w-16 h-16 object-contain bg-white cursor-pointer rounded-md border-2 ${
                    selectedImageIndex === 0
                      ? "border-purple-600"
                      : "border-gray-300"
                  }`}
                  onError={(e) => { e.target.src = '/no-image.svg'; }}
                />
              )}
              {product.images?.map((img, index) => (
                <img
                  key={index}
                  src={img}
                  alt={`Thumbnail ${index}`}
                  onClick={() => { setSelectedMedia('image'); setSelectedImageIndex(index + 1); }}
                  className={`w-16 h-16 object-contain bg-white cursor-pointer rounded-md border-2 ${
                    selectedImageIndex === index + 1
                      ? "border-purple-600"
                      : "border-gray-300"
                  }`}
                  onError={(e) => { e.target.src = '/no-image.svg'; }}
                />
              ))}
              {product.videoUrl && (
                <button
                  type="button"
                  onClick={() => setSelectedMedia('video')}
                  className={`w-16 h-16 flex items-center justify-center bg-white rounded-md border-2 ${
                    selectedMedia === 'video' ? 'border-purple-600' : 'border-gray-300'
                  }`}
                  title="View Video"
                >
                  <svg className="w-8 h-8 text-gray-700" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M10 8l6 4-6 4V8z" />
                  </svg>
                </button>
              )}
            </div>
          </div>
        </div>

        {/* RIGHT - Details */}
        <div className="md:w-1/2 bg-white p-6 rounded-xl shadow-md border border-gray-200">
          <div className="border-b pb-4 mb-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <h3 className="text-2xl font-bold text-gray-900">Product Details</h3>
              {product && (
                <span className={`px-2.5 py-1 text-xs font-semibold rounded-md border ${getCategoryBadgeClass(product)}`}>
                  {getCategoryLabel(product)}
                </span>
              )}
            </div>
            <button
              onClick={() => navigate(getCategoryRoute(product))}
              className="px-4 py-2 text-sm font-medium rounded-md border border-purple-200 text-purple-700 bg-purple-50 hover:bg-purple-100"
            >
              Continue Shopping
            </button>
          </div>

          <h1 className="text-2xl font-semibold text-gray-800 mb-3">
            {product.name}
          </h1>

          <div className="flex items-center mb-3">
            <span className="text-2xl font-bold text-purple-600">
              ₹{Number(((product.offerPrice !== null && product.offerPrice !== undefined && Number(product.offerPrice) > 0) ? product.offerPrice : (product.price || 0))).toLocaleString()}
            </span>
            {(product.offerPrice !== null && product.offerPrice !== undefined && Number(product.offerPrice) > 0 && product.price && Number(product.price) > Number(product.offerPrice)) && (
              <span className="ml-2 text-sm text-gray-500 line-through">
                ₹{product.price?.toLocaleString()}
              </span>
            )}
          </div>

          <p className="text-gray-600 mb-6">{product.description}</p>

          <div className="space-y-4 mb-6">
            {toList(product.sizeVarients).length > 0 && (
              <div>
                <p className="text-sm font-medium text-gray-700 mb-2">
                  Size:{" "}
                  <span className="text-gray-900">
                    {selectedSize || "Select Size"}
                  </span>
                </p>
                <div className="flex flex-wrap gap-2">
                  {toList(product.sizeVarients).map((size) => (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      className={`px-4 py-2 rounded-md border text-sm font-medium transition ${
                        selectedSize === size
                          ? "border-purple-600 bg-purple-50 text-purple-700"
                          : "border-gray-300 hover:border-gray-400"
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {toList(product.colorVarients).length > 0 && (
              <div>
                <p className="text-sm font-medium text-gray-700 mb-2">
                  Color:{" "}
                  <span className="text-gray-900">
                    {selectedColor || "Select Color"}
                  </span>
                </p>
                <div className="flex flex-wrap gap-2">
                  {toList(product.colorVarients).map((color) => (
                    <button
                      key={color}
                      onClick={() => handleSelectColor(color)}
                      className={`px-4 py-2 rounded-md border text-sm font-medium transition ${
                        selectedColor === color
                          ? "border-purple-600 bg-purple-50 text-purple-700"
                          : "border-gray-300 hover:border-gray-400"
                      }`}
                    >
                      {color}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Quantity Section */}
          <div className="flex items-center justify-between mt-6">
            <div className="flex items-center">
              <span className="text-gray-700 font-medium mr-4">Quantity:</span>
              <input
                type="number"
                min="1"
                value={quantity}
                onChange={handleQuantityChange}
                onBlur={handleQuantityBlur}
                className="px-4 py-2 border border-gray-300 rounded-md w-20 text-center focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>
          </div>

          <div className="mt-6 flex gap-3">
            <button
              onClick={handleAddToCart}
              disabled={!product.inStock}
              className={`flex-1 py-2 rounded-md text-white font-medium transition ${
                product.inStock
                  ? "bg-purple-600 hover:bg-purple-700"
                  : "bg-gray-400 cursor-not-allowed"
              }`}
            >
              Add to Cart
            </button>
            <button
              onClick={handleBuyNow}
              disabled={!product.inStock}
              className={`flex-1 py-2 rounded-md text-white font-medium transition ${
                product.inStock
                  ? "bg-green-600 hover:bg-green-700"
                  : "bg-gray-400 cursor-not-allowed"
              }`}
            >
              Buy Now
            </button>
          </div>
        </div>
      </div>

      {/* Related Products */}
      <div className="mt-8">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">Related Products</h2>
        {relatedLoading ? (
          <div className="flex justify-center items-center h-24">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-purple-500"></div>
          </div>
        ) : relatedProducts.length === 0 ? (
          <p className="text-gray-600">No similar products found.</p>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {relatedProducts.map((p) => {
              const effectivePrice = (p.offerPrice !== null && p.offerPrice !== undefined && p.offerPrice > 0)
                ? p.offerPrice
                : p.price;
              return (
                <div key={p._id || p.id} className="bg-white border rounded-lg overflow-hidden shadow-sm">
                  <img
                    src={p.imageUrl || p.image || "/no-image.svg"}
                    alt={p.name}
                    className="w-full h-32 object-contain bg-white cursor-pointer"
                    onClick={() => navigate(`/product/${p._id || p.id}`)}
                    onError={(e) => { e.target.src = "/no-image.svg"; }}
                  />
                  <div className="p-3">
                    <div className="text-sm text-gray-500 mb-1">{getSubcategoryName(p.subcategory) || p.category}</div>
                    <h3 className="font-medium text-gray-900 truncate">{p.name}</h3>
                    <div className="flex items-center mt-1">
                      <span className="text-purple-600 font-semibold">₹{(effectivePrice || 0).toLocaleString()}</span>
                      {(p.offerPrice !== null && p.offerPrice !== undefined && p.offerPrice > 0 && p.price && p.price > p.offerPrice) && (
                        <span className="ml-2 text-xs text-gray-400 line-through">₹{p.price?.toLocaleString()}</span>
                      )}
                    </div>
                    <div className="mt-3 flex gap-2">
                      <button
                        className="flex-1 bg-purple-600 hover:bg-purple-700 text-white text-sm py-2 rounded"
                        onClick={() => addToCart({ ...p, id: p._id || p.id, price: effectivePrice })}
                      >
                        Add to Cart
                      </button>
                      <button
                        className="px-3 py-2 text-sm border rounded hover:bg-gray-50"
                        onClick={() => navigate(`/product/${p._id || p.id}`)}
                      >
                        View
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Website Description */}
      <div className="mt-8 bg-gray-50 border border-gray-200 rounded-lg p-5">
        <h3 className="text-xl font-semibold text-gray-800 mb-2">About L-Mart</h3>
        <p className="text-gray-700 text-sm leading-6">
          L-Mart is a marketplace where you can find quality products and reliable printing services all in one place. Browse curated items across categories like L-mart, Local Market, and Printing. With transparent pricing, special offer benefits, and fast checkout, we're focused on giving you a smooth and seamless shopping experience.
        </p>
      </div>

      {/* Login Prompt Modal for Buy Now */}
      <LoginModal isOpen={showLoginModal} onClose={() => setShowLoginModal(false)} />
    </div>
  );
};

export default ProductDetail;