import React, { useState, useEffect } from 'react';
import { updateProduct } from '../services/productService';
import { getSubcategoriesByCategory } from '../services/subcategoryService';

const EditProductModal = ({ isOpen, onClose, product, onProductUpdated }) => {
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
        subcategory: typeof product.subcategory === 'object' ? (product.subcategory?.name || '') : (product.subcategory || ''),
        // Ensure we load colors as plain strings for editing chips
        colorVarients: Array.isArray(product.colorVarients)
          ? product.colorVarients.map(v => (typeof v === 'string' ? v : (v && v.color ? String(v.color) : '')))
          : (product.colorVarients ? String(product.colorVarients).split(',').map(s => s.trim()) : ['']),
        sizeVarients: Array.isArray(product.sizeVarients) ? product.sizeVarients : (product.sizeVarients ? String(product.sizeVarients).split(',').map(s => s.trim()) : ['']),
        inStock: product.inStock !== undefined ? product.inStock : true,
        stockQuantity: product.stockQuantity ?? 0,
        image: null,
        images: []
      };
      setFormData(initial);
      // Setup previews if product has existing image urls
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
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
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
          if (previews.length === files.length) {
            setMultipleImagePreviews(previews);
          }
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
        // Convert to string first, then trim
        if (v === null || v === undefined) return '';
        return String(v).trim();
      })
      .filter(Boolean),
    sizeVarients: (Array.isArray(formData.sizeVarients) ? formData.sizeVarients : [])
      .map(v => {
        // Convert to string first, then trim
        if (v === null || v === undefined) return '';
        return String(v).trim();
      })
      .filter(Boolean)
  };

  setLoading(true);
  try {
    const result = await updateProduct(product._id, submissionData);
    if (result.success) {
      onProductUpdated();
      onClose();
    }
  } catch (error) {
    console.error('Error updating product:', error);
    setErrors({ submit: 'Failed to update product. Please try again.' });
  } finally {
    setLoading(false);
  }
};

  const handleClose = () => {
    onClose();
  };

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
                  <label className="block text-sm font-medium text-gray-700 mb-2">Offer Price</label>
                  <input type="number" name="offerPrice" value={formData.offerPrice} onChange={handleInputChange} min="0" className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500" />
                  {errors.offerPrice && <p className="text-red-500 text-sm mt-1">{errors.offerPrice}</p>}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Category *</label>
                <select name="category" value={formData.category} onChange={handleInputChange} className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500">
                  <option value="">Select Category</option>
                  <option value="emart">L-mart</option>
                  <option value="localmarket">Local-market</option>
                  <option value="printing">Printing</option>
                  <option value="news">TodayNews</option>
                </select>
                {errors.category && <p className="text-red-500 text-sm mt-1">{errors.category}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Subcategory *</label>
                <select name="subcategory" value={formData.subcategory} onChange={handleInputChange} className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500">
                  <option value="">Select Subcategory</option>
                  {subcategories.map(sc => (
                    <option key={sc._id} value={sc.name}>{sc.name}</option>
                  ))}
                </select>
                {errors.subcategory && <p className="text-red-500 text-sm mt-1">{errors.subcategory}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Color variant</label>
                <div className="flex flex-wrap gap-2">
                  {(Array.isArray(formData.colorVarients) ? formData.colorVarients : [formData.colorVarients]).map((val, idx) => (
                    <div key={idx} className="flex items-center gap-1">
                      <input type="text" value={val} onChange={(e) => updateVariantChip('colorVarients', idx, e.target.value)} className="w-24 px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-indigo-500" placeholder={idx === 0 ? 'Red' : ''} />
                      {((formData.colorVarients || []).length > 1 || val) && (
                        <button type="button" onClick={() => removeVariantChip('colorVarients', idx)} className="p-1 rounded border text-gray-600 hover:text-red-600" aria-label="Remove color">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12"/></svg>
                        </button>
                      )}
                    </div>
                  ))}
                  <button type="button" onClick={() => addVariantChip('colorVarients')} className="px-2 py-1 text-sm border rounded flex items-center gap-1 hover:bg-gray-50" aria-label="Add color">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4"/></svg>
                    Add
                  </button>
                </div>
              </div>

              <div>
                <label className="block text sm font-medium text-gray-700 mb-2">Size variant</label>
                <div className="flex flex-wrap gap-2">
                  {(Array.isArray(formData.sizeVarients) ? formData.sizeVarients : [formData.sizeVarients]).map((val, idx) => (
                    <div key={idx} className="flex items-center gap-1">
                      <input type="text" value={val} onChange={(e) => updateVariantChip('sizeVarients', idx, e.target.value)} className="w-20 px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-indigo-500" placeholder={idx === 0 ? 'S' : ''} />
                      {((formData.sizeVarients || []).length > 1 || val) && (
                        <button type="button" onClick={() => removeVariantChip('sizeVarients', idx)} className="p-1 rounded border text-gray-600 hover:text-red-600" aria-label="Remove size">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12"/></svg>
                        </button>
                      )}
                    </div>
                  ))}
                  <button type="button" onClick={() => addVariantChip('sizeVarients')} className="px-2 py-1 text-sm border rounded flex items-center gap-1 hover:bg-gray-50" aria-label="Add size">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4"/></svg>
                    Add
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Stock Quantity</label>
                <input type="number" name="stockQuantity" value={formData.stockQuantity} onChange={handleInputChange} min="0" className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500" placeholder="Enter stock quantity" />
              </div>

              <div className="flex items-center">
                <input type="checkbox" name="inStock" checked={formData.inStock} onChange={handleInputChange} className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded" />
                <label className="ml-2 block text-sm text-gray-700">Product is in stock</label>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Main Product Image</label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
                  <input type="file" accept="image/*" onChange={handleImageChange} className="hidden" id="edit-main-image" />
                  <label htmlFor="edit-main-image" className="cursor-pointer">
                    {imagePreview ? (
                      <div className="relative">
                        <img src={imagePreview} alt="Preview" className="w-full h-32 object-contain bg-white rounded-lg mb-2" />
                        <button type="button" onClick={removeMainImage} className="absolute top-2 right-2 bg-white/80 hover:bg-white text-gray-700 hover:text-red-600 border border-gray-300 rounded-full p-1 shadow" aria-label="Remove main image">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                        </button>
                      </div>
                    ) : (
                      <div className="py-8">
                        <svg className="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48">
                          <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                        <p className="mt-2 text-sm text-gray-600">Click to upload main image</p>
                      </div>
                    )}
                  </label>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Additional Images (Optional, up to 10)</label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
                  <input type="file" accept="image/*" multiple onChange={handleMultipleImagesChange} className="hidden" id="edit-multiple-images" />
                  <label htmlFor="edit-multiple-images" className="cursor-pointer">
                    {multipleImagePreviews.length > 0 ? (
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mb-2">
                        {multipleImagePreviews.map((preview, index) => (
                          <div key={index} className="relative">
                            <img src={preview} alt={`Preview ${index + 1}`} className="w-full h-20 object-contain bg-white rounded" />
                            <button type="button" onClick={() => removeAdditionalImage(index)} className="absolute top-1 right-1 bg-white/80 hover:bg-white text-gray-700 hover:text-red-600 border border-gray-300 rounded-full p-1 shadow" aria-label={`Remove image ${index + 1}`}>
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                            </button>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="py-6">
                        <svg className="mx-auto h-10 w-10 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48">
                          <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                        <p className="mt-2 text-sm text-gray-600">Click to upload additional images</p>
                      </div>
                    )}
                  </label>
                </div>
              </div>
            </div>
          </div>

          {errors.submit && (
            <div className="mt-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">{errors.submit}</div>
          )}

          <div className="flex justify-end space-x-3 mt-6 pt-4 border-t border-gray-200">
            <button type="button" onClick={handleClose} className="px-4 py-2 text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300 transition-colors">Cancel</button>
            <button type="submit" disabled={loading} className="px-6 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg hover:from-indigo-700 hover:to-purple-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed">
              {loading ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditProductModal;