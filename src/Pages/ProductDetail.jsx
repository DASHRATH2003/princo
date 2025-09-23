import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';

const ProductDetail = () => {
  const { productId } = useParams();
  const navigate = useNavigate();
  const { addToCart, items: cart, updateQuantity } = useCart();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [selectedColor, setSelectedColor] = useState('');
  const [selectedSize, setSelectedSize] = useState('');
  
  // Find the product from the EMarket products
  // This is a simplified approach - in a real app, you would fetch from an API
  const products = [
    // Business Cards
    {
      id: "1",
      name: 'Premium Business Cards',
      price: 2159,
      image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
      category: 'Business Cards',
      isNew: true,
      onSale: false,
      description: 'High-quality premium business cards printed on thick card stock with a professional finish. Perfect for making a lasting impression with clients and partners.',
      colors: ['White', 'Black', 'Cream'],
      sizes: ['Standard', 'Square', 'Mini'],
      brand: 'PrintCo Premium',
      material: '350gsm Art Card',
      inStock: true
    },
    {
      id: "2",
      name: 'Matte Finish Business Cards',
      price: 2491,
      image: 'https://images.unsplash.com/photo-1611224923853-80b023f02d71?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
      category: 'Business Cards',
      isNew: false,
      onSale: true,
      description: 'Elegant matte finish business cards that provide a sophisticated look and feel. The non-glossy surface makes them easy to write on.',
      colors: ['White', 'Black', 'Gray'],
      sizes: ['Standard', 'Square'],
      brand: 'PrintCo Matte',
      material: '300gsm Matte Card',
      inStock: true
    },
    {
      id: "3",
      name: 'Glossy Business Cards',
      price: 1909,
      image: 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
      category: 'Business Cards',
      isNew: false,
      onSale: false,
      description: 'Vibrant glossy business cards that make your colors pop. Perfect for designs with photos or bold graphics.',
      colors: ['White', 'Ivory', 'Blue'],
      sizes: ['Standard', 'Mini'],
      brand: 'PrintCo Glossy',
      material: '300gsm Glossy Card',
      inStock: true
    }
  ];

  // Find the product based on productId
  useEffect(() => {
    const foundProduct = products.find(p => p.id === productId);
    if (foundProduct) {
      setProduct(foundProduct);
      if (foundProduct.colors && foundProduct.colors.length > 0) {
        setSelectedColor(foundProduct.colors[0]);
      }
      if (foundProduct.sizes && foundProduct.sizes.length > 0) {
        setSelectedSize(foundProduct.sizes[0]);
      }
    }
    setLoading(false);
  }, [productId]);

  // Get cart item quantity for this product
  const getProductQuantity = (productId) => {
    const item = cart.find(item => item.id === productId);
    return item ? item.quantity : 0;
  };

  // Handle add to cart
  const handleAddToCart = () => {
    if (product) {
      const productToAdd = {
        ...product,
        selectedColor,
        selectedSize,
        quantity
      };
      addToCart(productToAdd);
    }
  };

  // Handle quantity change
  const incrementQuantity = () => setQuantity(prev => prev + 1);
  const decrementQuantity = () => setQuantity(prev => prev > 1 ? prev - 1 : 1);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-800">Product Not Found</h2>
          <p className="mt-4 text-gray-600">The product you're looking for doesn't exist or has been removed.</p>
          <button 
            onClick={() => navigate('/e-market')}
            className="mt-6 bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-lg font-medium"
          >
            Back to Shop
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row gap-8">
        {/* Product Image */}
        <div className="md:w-1/2">
          <div className="bg-white rounded-lg overflow-hidden shadow-lg">
            <img 
              src={product.imageUrl || product.image || 'https://via.placeholder.com/400x300?text=Product+Image'} 
              alt={product.name} 
              className="w-full h-auto object-cover"
              onError={(e) => {
                console.log('Product detail image failed to load:', product.name, 'Image URL:', product.imageUrl || product.image);
                e.target.src = 'https://via.placeholder.com/400x300?text=Product+Image';
              }}
            />
            {product.isNew && (
              <div className="absolute top-4 left-4 bg-blue-500 text-white text-xs font-bold px-2 py-1 rounded">
                NEW
              </div>
            )}
            {product.onSale && (
              <div className="absolute top-4 right-4 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded">
                SALE
              </div>
            )}
          </div>
        </div>

        {/* Product Details */}
        <div className="md:w-1/2">
          <nav className="flex mb-4" aria-label="Breadcrumb">
            <ol className="inline-flex items-center space-x-1 md:space-x-3">
              <li className="inline-flex items-center">
                <a href="/" className="text-gray-600 hover:text-purple-600">Home</a>
              </li>
              <li>
                <div className="flex items-center">
                  <span className="mx-2 text-gray-400">/</span>
                  <a href="/e-market" className="text-gray-600 hover:text-purple-600">E-Market</a>
                </div>
              </li>
              <li>
                <div className="flex items-center">
                  <span className="mx-2 text-gray-400">/</span>
                  <span className="text-gray-500">{product.category}</span>
                </div>
              </li>
            </ol>
          </nav>

          <h1 className="text-3xl font-bold text-gray-800 mb-2">{product.name}</h1>
          
          <div className="flex items-center mb-4">
            <span className="text-2xl font-bold text-purple-600">₹{product.price.toLocaleString()}</span>
            {product.onSale && (
              <span className="ml-2 text-sm text-gray-500 line-through">₹{Math.round(product.price * 1.2).toLocaleString()}</span>
            )}
          </div>

          <div className="mb-6">
            <div className="flex items-center mb-2">
              <span className="text-yellow-400">★★★★</span>
              <span className="text-gray-300">★</span>
              <span className="ml-2 text-sm text-gray-600">4.0 (24 reviews)</span>
            </div>
          </div>

          <p className="text-gray-600 mb-6">{product.description}</p>

          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-2">Product Details</h3>
            <ul className="space-y-2">
              <li className="flex">
                <span className="font-medium w-24 text-gray-700">Category:</span>
                <span className="text-gray-600">{product.category}</span>
              </li>
              <li className="flex">
                <span className="font-medium w-24 text-gray-700">Brand:</span>
                <span className="text-gray-600">{product.brand}</span>
              </li>
              <li className="flex">
                <span className="font-medium w-24 text-gray-700">Material:</span>
                <span className="text-gray-600">{product.material}</span>
              </li>
              <li className="flex">
                <span className="font-medium w-24 text-gray-700">In Stock:</span>
                <span className={product.inStock ? "text-green-600" : "text-red-600"}>
                  {product.inStock ? "Yes" : "No"}
                </span>
              </li>
            </ul>
          </div>

          {/* Color Selection */}
          {product.colors && product.colors.length > 0 && (
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-2">Color</h3>
              <div className="flex space-x-2">
                {product.colors.map(color => (
                  <button
                    key={color}
                    onClick={() => setSelectedColor(color)}
                    className={`px-4 py-2 border rounded-md ${
                      selectedColor === color 
                        ? 'border-purple-600 bg-purple-50 text-purple-600' 
                        : 'border-gray-300 text-gray-700'
                    }`}
                  >
                    {color}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Size Selection */}
          {product.sizes && product.sizes.length > 0 && (
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-2">Size</h3>
              <div className="flex space-x-2">
                {product.sizes.map(size => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={`px-4 py-2 border rounded-md ${
                      selectedSize === size 
                        ? 'border-purple-600 bg-purple-50 text-purple-600' 
                        : 'border-gray-300 text-gray-700'
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Quantity and Add to Cart */}
          <div className="mt-8">
            <div className="flex items-center mb-4">
              <span className="mr-4 text-gray-700 font-medium">Quantity:</span>
              <div className="flex items-center border border-gray-300 rounded-md">
                <button 
                  onClick={decrementQuantity}
                  className="px-3 py-1 text-gray-600 hover:bg-gray-100"
                >
                  -
                </button>
                <span className="px-4 py-1 border-x border-gray-300">{quantity}</span>
                <button 
                  onClick={incrementQuantity}
                  className="px-3 py-1 text-gray-600 hover:bg-gray-100"
                >
                  +
                </button>
              </div>
            </div>

            <div className="flex space-x-4">
              <button
                onClick={handleAddToCart}
                disabled={!product.inStock}
                className={`flex-1 py-3 px-6 rounded-lg font-medium text-white ${
                  product.inStock 
                    ? 'bg-purple-600 hover:bg-purple-700' 
                    : 'bg-gray-400 cursor-not-allowed'
                }`}
              >
                Add to Cart
              </button>
              <button className="p-3 border border-gray-300 rounded-lg hover:bg-gray-50">
                <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
  
  
 