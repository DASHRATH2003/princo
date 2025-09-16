import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';

const ProductDetailModal = ({ product, isOpen, onClose, allProducts = [] }) => {
  const navigate = useNavigate();
  const { addToCart } = useCart();

  const handleAddToCart = () => {
    const cartItem = {
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.imageUrl,
      quantity: 1
    };
    addToCart(cartItem);
    onClose(); // Close modal after adding to cart
  };

  const handleBuyNow = () => {
    const cartItem = {
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.imageUrl,
      quantity: 1
    };
    addToCart(cartItem);
    onClose(); // Close modal
    navigate('/checkout'); // Navigate to checkout page
  };

  if (!isOpen || !product) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
        {/* Header */}
        <div className="flex justify-between items-center p-4 border-b">
          <h2 className="text-xl font-bold text-gray-800">Product Details</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 p-1 rounded-full hover:bg-gray-100 transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 p-6">
          {/* Product Image */}
          <div className="relative">
            <img 
              src={product.imageUrl} 
              alt={product.name}
              className="w-full h-80 object-cover rounded-lg shadow-lg"
            />
            {product.featured && (
              <div className="absolute top-4 left-4 bg-yellow-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
                Featured
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className="space-y-4">
            <div>
              <h3 className="text-2xl font-bold text-gray-800 mb-1">{product.name}</h3>
              <p className="text-base text-gray-600 mb-2">{product.category}</p>
              <p className="text-gray-700 text-sm leading-relaxed">{product.description}</p>
            </div>

            {/* Price */}
            <div className="border-t pt-4">
              <div className="flex items-center space-x-4">
                <span className="text-3xl font-bold text-green-600">₹{product.price}</span>
                {product.originalPrice && product.originalPrice > product.price && (
                  <span className="text-xl text-gray-500 line-through">₹{product.originalPrice}</span>
                )}
              </div>
              {product.originalPrice && product.originalPrice > product.price && (
                <div className="mt-2">
                  <span className="bg-red-100 text-red-800 px-2 py-1 rounded-full text-sm font-semibold">
                    {Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}% OFF
                  </span>
                </div>
              )}
            </div>

            {/* Delivery Benefits */}
            <div className="bg-green-50 border border-green-200 rounded-lg p-3">
              <div className="flex items-center space-x-2 mb-2">
                <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span className="text-green-800 font-semibold text-sm">FREE Delivery</span>
              </div>
              <div className="flex items-center space-x-2 mb-1">
                <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span className="text-green-700 text-xs">Fast 2-3 days delivery</span>
              </div>
              <div className="flex items-center space-x-2">
                <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span className="text-green-700 text-xs">Quality guaranteed</span>
              </div>
            </div>

            {/* Stock Status */}
            {product.stockQuantity !== undefined && (
              <div className="pt-2">
                <div className="flex items-center space-x-2">
                  <span className="text-gray-700 font-medium text-sm">Stock:</span>
                  <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                    product.stockQuantity > 10 
                      ? 'bg-green-100 text-green-800' 
                      : product.stockQuantity > 0 
                        ? 'bg-yellow-100 text-yellow-800' 
                        : 'bg-red-100 text-red-800'
                  }`}>
                    {product.stockQuantity > 0 ? `${product.stockQuantity} available` : 'Out of stock'}
                  </span>
                </div>
              </div>
            )}

            {/* Tags */}
            {product.tags && (
              <div className="pt-3">
                <h4 className="text-base font-semibold text-gray-800 mb-2">Tags</h4>
                <div className="flex flex-wrap gap-1">
                  {product.tags.split(',').map((tag, index) => (
                    <span 
                      key={index}
                      className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs font-medium"
                    >
                      {tag.trim()}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="border-t pt-4 space-y-2">
              <button 
                onClick={handleAddToCart}
                className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white py-3 px-6 rounded-lg font-semibold hover:from-blue-600 hover:to-purple-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
              >
                Add to Cart
              </button>
              <button 
                onClick={handleBuyNow}
                className="w-full bg-gradient-to-r from-green-500 to-teal-600 text-white py-3 px-6 rounded-lg font-semibold hover:from-green-600 hover:to-teal-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
              >
                Buy Now
              </button>
            </div>
          </div>
        </div>

        {/* Related Products */}
        {product.relatedProducts && product.relatedProducts.length > 0 && (
          <div className="border-t mt-6 pt-4">
            <h4 className="text-lg font-semibold text-gray-800 mb-3">Related Products</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {product.relatedProducts
                .map(relatedId => allProducts.find(p => p.id === relatedId))
                .filter(Boolean)
                .slice(0, 3)
                .map((relatedProduct) => (
                  <div 
                    key={relatedProduct.id}
                    className="bg-gray-50 rounded-lg overflow-hidden hover:shadow-md transition-all duration-200 cursor-pointer group"
                    onClick={() => {
                      onClose();
                      setTimeout(() => {
                        const newModal = document.createElement('div');
                        document.body.appendChild(newModal);
                        // This will trigger the parent component to open modal for this product
                        window.dispatchEvent(new CustomEvent('openProductModal', { 
                          detail: relatedProduct 
                        }));
                      }, 100);
                    }}
                  >
                    <div className="relative">
                      <img 
                        src={relatedProduct.imageUrl} 
                        alt={relatedProduct.name}
                        className="w-full h-24 object-cover group-hover:scale-105 transition-transform duration-200"
                      />
                      {relatedProduct.featured && (
                        <span className="absolute top-2 left-2 bg-yellow-500 text-white px-2 py-1 rounded-full text-xs font-semibold">
                          Featured
                        </span>
                      )}
                    </div>
                    <div className="p-2">
                      <h5 className="font-semibold text-gray-800 text-xs mb-1 truncate">
                        {relatedProduct.name}
                      </h5>
                      <p className="text-xs text-gray-600 mb-1 truncate">
                        {relatedProduct.description}
                      </p>
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-bold text-green-600">
                          ₹{relatedProduct.price}
                        </span>
                        <span className="text-xs text-gray-500">
                          {relatedProduct.category}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductDetailModal;