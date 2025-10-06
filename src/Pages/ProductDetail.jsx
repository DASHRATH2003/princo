import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { getProductsByCategory } from "../services/productService";

const ProductDetail = () => {
  const { productId } = useParams();
  const navigate = useNavigate();
  const { addToCart, items: cart } = useCart();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [selectedSize, setSelectedSize] = useState("");
  const [selectedColor, setSelectedColor] = useState("");
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [relatedLoading, setRelatedLoading] = useState(false);

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
    if (Array.isArray(val)) return val.filter(Boolean);
    if (typeof val === "string") {
      try {
        const parsed = JSON.parse(val);
        if (Array.isArray(parsed)) return parsed.filter(Boolean);
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

    addToCart({
      ...product,
      id: product._id || product.id,
      price: effectivePrice,
      quantity,
      selectedSize,
      selectedColor,
    });
  };

  const incrementQuantity = () => setQuantity((q) => q + 1);
  const decrementQuantity = () => setQuantity((q) => (q > 1 ? q - 1 : 1));

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

            <div className="flex gap-3 p-3 justify-center flex-wrap bg-gray-100">
              {(product.imageUrl || product.image) && (
                <img
                  src={product.imageUrl || product.image}
                  alt="Main"
                  onClick={() => setSelectedImageIndex(0)}
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
                  onClick={() => setSelectedImageIndex(index + 1)}
                  className={`w-16 h-16 object-contain bg-white cursor-pointer rounded-md border-2 ${
                    selectedImageIndex === index + 1
                      ? "border-purple-600"
                      : "border-gray-300"
                  }`}
                  onError={(e) => { e.target.src = '/no-image.svg'; }}
                />
              ))}
            </div>
          </div>
        </div>

        {/* RIGHT - Details */}
        <div className="md:w-1/2 bg-white p-6 rounded-xl shadow-md border border-gray-200">
          <div className="border-b pb-4 mb-4">
            <h3 className="text-2xl font-bold text-gray-900 mb-3">Product Details</h3>
          </div>

          <h1 className="text-2xl font-semibold text-gray-800 mb-3">
            {product.name}
          </h1>

          <div className="flex items-center mb-3">
            <span className="text-2xl font-bold text-purple-600">
              ₹{(product.offerPrice ?? product.price)?.toLocaleString()}
            </span>
            {product.offerPrice && product.offerPrice < product.price && (
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
                      onClick={() => setSelectedColor(color)}
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
              <div className="flex items-center border border-gray-300 rounded-md">
                <button
                  onClick={decrementQuantity}
                  className="px-3 py-1 text-gray-600 hover:bg-gray-100"
                >
                  -
                </button>
                <span className="px-4 py-1 border-x border-gray-300">
                  {quantity}
                </span>
                <button
                  onClick={incrementQuantity}
                  className="px-3 py-1 text-gray-600 hover:bg-gray-100"
                >
                  +
                </button>
              </div>
            </div>
          </div>

          <button
            onClick={handleAddToCart}
            disabled={!product.inStock}
            className={`w-full mt-6 py-3 rounded-lg text-white font-semibold transition ${
              product.inStock
                ? "bg-purple-600 hover:bg-purple-700"
                : "bg-gray-400 cursor-not-allowed"
            }`}
          >
            Add to Cart
          </button>
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
                      {p.originalPrice && p.originalPrice > effectivePrice && (
                        <span className="ml-2 text-xs text-gray-400 line-through">₹{p.originalPrice.toLocaleString()}</span>
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
        <h3 className="text-xl font-semibold text-gray-800 mb-2">About Printco</h3>
        <p className="text-gray-700 text-sm leading-6">
          Printco is a marketplace where you can find quality products and reliable printing services all in one place. Browse curated items across categories like E-Market, Local Market, and Printing. With transparent pricing, special offer benefits, and fast checkout, we’re focused on giving you a smooth and seamless shopping experience.
        </p>
      </div>
    </div>
  );
};

export default ProductDetail;
