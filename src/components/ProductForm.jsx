import React, { useState } from 'react';
import { createProduct } from '../services/productService';

const ProductForm = ({ category: initialCategory, onClose, onSubmit }) => {
  const [selectedCategory, setSelectedCategory] = useState(initialCategory || 'emart');
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    originalPrice: '',
    discount: '',
    subcategory: '',
    stockQuantity: '',
    tags: '',
    specifications: '',
    // News specific fields
    newsContent: '',
    newsDate: '',
    newsAuthor: '',
    // Printing specific fields
    printingOptions: {
      paperType: '',
      size: '',
      color: '',
      quantity: 1
    },
    // Local Market specific fields
    businessInfo: {
      businessName: '',
      address: '',
      phone: '',
      email: ''
    }
  });
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setImage(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const productData = {
        name: formData.name,
        description: formData.description,
        price: formData.price,
        category: selectedCategory,
        originalPrice: formData.originalPrice,
        discount: formData.discount,
        subcategory: formData.subcategory,
        stockQuantity: formData.stockQuantity,
        tags: formData.tags ? formData.tags.split(',').map(tag => tag.trim()) : [],
        specifications: formData.specifications,
        image: image
      };
      
      // Add category-specific fields
      if (selectedCategory === 'news') {
        productData.newsContent = formData.newsContent;
        productData.newsDate = formData.newsDate;
        productData.newsAuthor = formData.newsAuthor;
      }
      
      if (selectedCategory === 'printing') {
        productData.printingOptions = formData.printingOptions;
      }
      
      if (selectedCategory === 'localmarket') {
        productData.businessInfo = formData.businessInfo;
      }

      const result = await createProduct(productData);
      console.log('Product created successfully:', result);
      
      // Call onSuccess if provided, otherwise onClose
      if (onSubmit) {
        await onSubmit(result);
      }
      onClose();
      
      alert('Product created successfully!');
    } catch (error) {
      console.error('Error submitting form:', error);
      alert('Error creating product. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const getCategoryTitle = () => {
    switch (selectedCategory) {
      case 'emart': return 'E-Mart Product';
      case 'localmarket': return 'Local Market Product';
      case 'printing': return 'Printing Service';
      case 'news': return 'News Article';
      default: return 'Product';
    }
  };

  const getCategoryColor = () => {
    switch (selectedCategory) {
      case 'emart': return 'from-blue-500 to-purple-600';
      case 'localmarket': return 'from-green-500 to-blue-600';
      case 'printing': return 'from-purple-500 to-pink-600';
      case 'news': return 'from-orange-500 to-red-600';
      default: return 'from-gray-500 to-gray-600';
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm overflow-y-auto h-full w-full z-50">
      <div className="relative top-10 mx-auto p-8 w-11/12 md:w-3/4 lg:w-2/3 xl:w-1/2 shadow-2xl rounded-2xl bg-white/90 backdrop-blur-md border border-white/20 mb-10">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center space-x-3">
            <div className={`w-10 h-10 bg-gradient-to-br ${getCategoryColor()} rounded-xl flex items-center justify-center`}>
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
            </div>
            <h3 className={`text-2xl font-bold bg-gradient-to-r ${getCategoryColor()} bg-clip-text text-transparent`}>
              Add {getCategoryTitle()}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-full p-2 transition-all duration-200"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Category Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Category *</label>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white"
            >
              <option value="emart">E-Mart</option>
              <option value="printing">Printing</option>
              <option value="localmarket">Local Market</option>
              <option value="news">Today News</option>
            </select>
          </div>

          {/* Basic Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Product Name *</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                placeholder="Enter product name"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Price *</label>
              <input
                type="number"
                name="price"
                value={formData.price}
                onChange={handleInputChange}
                required
                min="0"
                step="0.01"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                placeholder="Enter price"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Description *</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              required
              rows="4"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
              placeholder="Enter product description"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Original Price</label>
              <input
                type="number"
                name="originalPrice"
                value={formData.originalPrice}
                onChange={handleInputChange}
                min="0"
                step="0.01"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                placeholder="Original price"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Discount (%)</label>
              <input
                type="number"
                name="discount"
                value={formData.discount}
                onChange={handleInputChange}
                min="0"
                max="100"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                placeholder="Discount percentage"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Stock Quantity</label>
              <input
                type="number"
                name="stockQuantity"
                value={formData.stockQuantity}
                onChange={handleInputChange}
                min="0"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                placeholder="Stock quantity"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Subcategory</label>
              <input
                type="text"
                name="subcategory"
                value={formData.subcategory}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                placeholder="Enter subcategory"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Tags (comma separated)</label>
              <input
                type="text"
                name="tags"
                value={formData.tags}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                placeholder="tag1, tag2, tag3"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Product Image *</label>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
            />
          </div>

          {/* Category-specific fields */}
          {selectedCategory === 'news' && (
            <div className="space-y-4 border-t pt-6">
              <h4 className="text-lg font-semibold text-gray-800">News Details</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Author</label>
                  <input
                    type="text"
                    name="newsAuthor"
                    value={formData.newsAuthor}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                    placeholder="Author name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">News Date</label>
                  <input
                    type="date"
                    name="newsDate"
                    value={formData.newsDate}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">News Content</label>
                <textarea
                  name="newsContent"
                  value={formData.newsContent}
                  onChange={handleInputChange}
                  rows="6"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  placeholder="Enter news content"
                />
              </div>
            </div>
          )}

          {selectedCategory === 'printing' && (
            <div className="space-y-4 border-t pt-6">
              <h4 className="text-lg font-semibold text-gray-800">Printing Options</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Paper Type</label>
                  <select
                    name="printingOptions.paperType"
                    value={formData.printingOptions.paperType}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  >
                    <option value="">Select paper type</option>
                    <option value="A4">A4</option>
                    <option value="A3">A3</option>
                    <option value="Letter">Letter</option>
                    <option value="Legal">Legal</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Size</label>
                  <input
                    type="text"
                    name="printingOptions.size"
                    value={formData.printingOptions.size}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                    placeholder="e.g., 8.5x11"
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Color</label>
                  <select
                    name="printingOptions.color"
                    value={formData.printingOptions.color}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  >
                    <option value="">Select color option</option>
                    <option value="Black & White">Black & White</option>
                    <option value="Color">Color</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Default Quantity</label>
                  <input
                    type="number"
                    name="printingOptions.quantity"
                    value={formData.printingOptions.quantity}
                    onChange={handleInputChange}
                    min="1"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                    placeholder="Default quantity"
                  />
                </div>
              </div>
            </div>
          )}

          {selectedCategory === 'localmarket' && (
            <div className="space-y-4 border-t pt-6">
              <h4 className="text-lg font-semibold text-gray-800">Business Information</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Business Name</label>
                  <input
                    type="text"
                    name="businessInfo.businessName"
                    value={formData.businessInfo.businessName}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                    placeholder="Business name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Phone</label>
                  <input
                    type="tel"
                    name="businessInfo.phone"
                    value={formData.businessInfo.phone}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                    placeholder="Phone number"
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                  <input
                    type="email"
                    name="businessInfo.email"
                    value={formData.businessInfo.email}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                    placeholder="Business email"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Address</label>
                  <input
                    type="text"
                    name="businessInfo.address"
                    value={formData.businessInfo.address}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                    placeholder="Business address"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Submit Buttons */}
          <div className="flex justify-end space-x-4 pt-6 border-t">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-all duration-200 font-medium"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className={`px-6 py-3 bg-gradient-to-r ${getCategoryColor()} text-white rounded-lg hover:shadow-lg transition-all duration-200 font-medium disabled:opacity-50 disabled:cursor-not-allowed`}
            >
              {loading ? 'Creating...' : `Create ${getCategoryTitle()}`}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProductForm;