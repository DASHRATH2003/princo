// src/components/SellerEditProductModal.jsx
import React, { useEffect, useState } from 'react';
import { updateProduct } from '../services/productService';
import { getSubcategoriesByCategory } from '../services/subcategoryService';

// Mirrors Admin EditProductModal but scoped for seller use
const SellerEditProductModal = ({ isOpen, onClose, product, onProductUpdated }) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    offerPrice: '',
    category: '',
    subcategory: '',
    colorVarients: [''],
    sizeVarients: [''],
    inStock: true,
    stockQuantity: 0,
    image: null,
    images: []
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [imagePreview, setImagePreview] = useState(null);
  const [multipleImagePreviews, setMultipleImagePreviews] = useState([]);
  const [subcategories, setSubcategories] = useState([]);

  useEffect(() => {
    if (product) {
      const initial = {
        name: product.name || '',
        description: product.description || '',
        price: product.price ?? '',
        offerPrice: product.offerPrice ?? '',
        category: product.category || product.category?.value || '',
        subcategory:
          typeof product.subcategory === 'object'
            ? (product.subcategory?.name || '')
            : (product.subcategory || ''),
        colorVarients: Array.isArray(product.colorVarients)
          ? product.colorVarients.map(v => (typeof v === 'string' ? v : (v && v.color ? String(v.color) : '')))
          : (product.colorVarients ? String(product.colorVarients).split(',').map(s => s.trim()) : ['']),
        sizeVarients: Array.isArray(product.sizeVarients)
          ? product.sizeVarients
          : (product.sizeVarients ? String(product.sizeVarients).split(',').map(s => s.trim()) : ['']),
        inStock: product.inStock !== undefined ? product.inStock : true,
        stockQuantity: product.stockQuantity ?? 0,
        image: null,
        images: []
      };
      setFormData(initial);
      if (product.image) setImagePreview(product.image);
      if (Array.isArray(product.images)) setMultipleImagePreviews(product.images);
    }
  }, [product]);

  useEffect(() => {
    const loadSubcategories = async () => {
      try {
        if (!formData.category) {
          setSubcategories([]);
          return;
        }
        const subs = await getSubcategoriesByCategory(formData.category);
        setSubcategories(subs);
        if (!subs.find(s => s.name === formData.subcategory)) {
          setFormData(prev => ({ ...prev, subcategory: '' }));
        }
      } catch (err) {
        console.error('Error loading subcategories', err);
        setSubcategories([]);
      }
    };
    loadSubcategories();
  }, [formData.category]);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
  };

  const addVariantChip = (key) => {
    setFormData(prev => {
      const existing = Array.isArray(prev[key])
        ? prev[key]
        : (prev[key] ? String(prev[key]).split(',').map(s => s.trim()).filter(Boolean) : []);
      return { ...prev, [key]: [...existing, ''] };
    });
  };

  const updateVariantChip = (key, index, value) => {
    setFormData(prev => {
      const arr = Array.isArray(prev[key]) ? [...prev[key]] : [];
      arr[index] = value;
      return { ...prev, [key]: arr };
    });
  };

  const removeVariantChip = (key, index) => {
    setFormData(prev => {
      const arr = Array.isArray(prev[key]) ? [...prev[key]] : [];
      arr.splice(index, 1);
      return { ...prev, [key]: arr.length ? arr : [''] };
    });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData(prev => ({ ...prev, image: file }));
      const reader = new FileReader();
      reader.onload = (ev) => setImagePreview(ev.target.result);
      reader.readAsDataURL(file);
    }
  };

  const handleMultipleImagesChange = (e) => {
    const files = Array.from(e.target.files);
    if (files && files.length) {
      setFormData(prev => ({ ...prev, images: files }));
      const previews = [];
      files.forEach(file => {
        const reader = new FileReader();
        reader.onload = (ev) => {
          previews.push(ev.target.result);
          if (previews.length === files.length) setMultipleImagePreviews(previews);
        };
        reader.readAsDataURL(file);
      });
    }
  };

  const removeMainImage = () => {
    setFormData(prev => ({ ...prev, image: null }));
    setImagePreview(null);
  };

  const removeAdditionalImage = (index) => {
    setFormData(prev => {
      const updated = [...(prev.images || [])];
      updated.splice(index, 1);
      return { ...prev, images: updated };
    });
    setMultipleImagePreviews(prev => {
      const updatedPrev = [...prev];
      updatedPrev.splice(index, 1);
      return updatedPrev;
    });
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = 'Product name is required';
    if (!formData.description.trim()) newErrors.description = 'Description is required';
    if (!formData.price || formData.price <= 0) newErrors.price = 'Valid price is required';
    if (!formData.category) newErrors.category = 'Category is required';
    if (!formData.subcategory) newErrors.subcategory = 'Subcategory is required';

    if (formData.offerPrice !== '' && formData.offerPrice !== null && formData.offerPrice !== undefined) {
      const offer = parseFloat(formData.offerPrice);
      const price = parseFloat(formData.price);
      if (isNaN(offer) || offer < 0) {
        newErrors.offerPrice = 'Offer price must be a non-negative number';
      } else if (!isNaN(price) && offer >= price) {
        newErrors.offerPrice = 'Offer price should be less than regular price';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    const submissionData = {
      ...formData,
      colorVarients: (Array.isArray(formData.colorVarients) ? formData.colorVarients : [])
        .map(v => {
          if (v === null || v === undefined) return '';
          return String(v).trim();
        })
        .filter(Boolean),
      sizeVarients: (Array.isArray(formData.sizeVarients) ? formData.sizeVarients : [])
        .map(v => {
          if (v === null || v === undefined) return '';
          return String(v).trim();
        })
        .filter(Boolean)
    };

    setLoading(true);
    try {
      const result = await updateProduct(product._id, submissionData);
      if (result.success) {
        onProductUpdated && onProductUpdated();
        onClose();
      }
    } catch (error) {
      console.error('Error updating product:', error);
      setErrors({ submit: 'Failed to update product. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => onClose();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="px-6 py-4 border-b border-gray-200 bg-gradient-to-r from-indigo-600 to-purple-600">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-white">Edit Product</h2>
            <button onClick={handleClose} className="text-white hover:text-gray-200 transition-colors">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Product Name *</label>
                <input type="text" name="name" value={formData.name} onChange={handleInputChange} className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500" />
                {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Description *</label>
                <textarea name="description" value={formData.description} onChange={handleInputChange} rows={3} className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500" />
                {errors.description && <p className="text-red-500 text-sm mt-1">{errors.description}</p>}
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Price *</label>
                  <input type="number" name="price" value={formData.price} onChange={handleInputChange} min="0" className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500" />
                  {errors.price && <p className="text-red-500 text-sm mt-1">{errors.price}</p>}
                </div>
                <div>
                  <label className="block text sm font-medium text-gray-700 mb-2">Offer Price</label>
                  <input type="number" name="offerPrice" value={formData.offerPrice} onChange={handleInputChange} min="0" className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500" />
                  {errors.offerPrice && <p className="text-red-500 text-sm mt-1">{errors.offerPrice}</p>}
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">In Stock</label>
                  <input type="checkbox" name="inStock" checked={formData.inStock} onChange={handleInputChange} className="mr-2" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Stock Quantity</label>
                  <input type="number" name="stockQuantity" value={formData.stockQuantity} onChange={handleInputChange} min="0" className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500" />
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Category *</label>
                <input type="text" name="category" value={formData.category} onChange={handleInputChange} className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500" />
                {errors.category && <p className="text-red-500 text-sm mt-1">{errors.category}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Subcategory *</label>
                <select name="subcategory" value={formData.subcategory} onChange={handleInputChange} className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500">
                  <option value="">Select subcategory</option>
                  {subcategories.map((sub) => (
                    <option key={sub._id || sub.name} value={sub.name}>{sub.name}</option>
                  ))}
                </select>
                {errors.subcategory && <p className="text-red-500 text-sm mt-1">{errors.subcategory}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Color Variants</label>
                <div className="space-y-2">
                  {Array.isArray(formData.colorVarients) && formData.colorVarients.map((chip, idx) => (
                    <div key={idx} className="flex items-center gap-2">
                      <input
                        type="text"
                        value={chip}
                        onChange={(e) => updateVariantChip('colorVarients', idx, e.target.value)}
                        className="flex-1 px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      />
                      <button type="button" onClick={() => removeVariantChip('colorVarients', idx)} className="px-3 py-2 bg-red-100 text-red-700 rounded-lg">Remove</button>
                    </div>
                  ))}
                  <button type="button" onClick={() => addVariantChip('colorVarients')} className="px-3 py-2 bg-indigo-100 text-indigo-700 rounded-lg">Add Color</button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Size Variants</label>
                <div className="space-y-2">
                  {Array.isArray(formData.sizeVarients) && formData.sizeVarients.map((chip, idx) => (
                    <div key={idx} className="flex items-center gap-2">
                      <input
                        type="text"
                        value={chip}
                        onChange={(e) => updateVariantChip('sizeVarients', idx, e.target.value)}
                        className="flex-1 px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      />
                      <button type="button" onClick={() => removeVariantChip('sizeVarients', idx)} className="px-3 py-2 bg-red-100 text-red-700 rounded-lg">Remove</button>
                    </div>
                  ))}
                  <button type="button" onClick={() => addVariantChip('sizeVarients')} className="px-3 py-2 bg-indigo-100 text-indigo-700 rounded-lg">Add Size</button>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Main Image</label>
              {imagePreview ? (
                <div className="space-y-2">
                  <img src={imagePreview} alt="Preview" className="w-full h-48 object-cover rounded-lg border" />
                  <div className="flex gap-2">
                    <button type="button" onClick={removeMainImage} className="px-3 py-2 bg-red-100 text-red-700 rounded-lg">Remove</button>
                  </div>
                </div>
              ) : (
                <input type="file" accept="image/*" onChange={handleImageChange} className="w-full" />
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Additional Images</label>
              <input type="file" multiple accept="image/*" onChange={handleMultipleImagesChange} className="w-full" />
              {multipleImagePreviews && multipleImagePreviews.length > 0 && (
                <div className="mt-3 grid grid-cols-2 gap-3">
                  {multipleImagePreviews.map((src, idx) => (
                    <div key={idx} className="relative">
                      <img src={src} alt={`Preview ${idx+1}`} className="w-full h-32 object-cover rounded-lg border" />
                      <button type="button" onClick={() => removeAdditionalImage(idx)} className="absolute top-2 right-2 px-2 py-1 bg-red-500 text-white text-xs rounded">Remove</button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {errors.submit && <p className="text-red-500 text-sm mt-4">{errors.submit}</p>}

          <div className="mt-6 flex items-center justify-end gap-3">
            <button type="button" onClick={handleClose} className="px-4 py-2 rounded-lg bg-gray-100 text-gray-700">Cancel</button>
            <button type="submit" disabled={loading} className="px-4 py-2 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 disabled:opacity-50">
              {loading ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SellerEditProductModal;