import React, { useState, useEffect } from 'react';
import { getSubcategoriesByCategory } from '../services/subcategoryService';
import sellerService, { createSellerProduct, getCategoryCommission } from '../services/sellerService';



const SellerAddProductModal = ({ isOpen, onClose, onProductAdded }) => {
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
    images: [],
    video: null,
    adminCommissionPercent: 2
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [imagePreview, setImagePreview] = useState(null);
  const [multipleImagePreviews, setMultipleImagePreviews] = useState([]);
  // Map image index -> assigned color (string)
  const [imageColorAssignments, setImageColorAssignments] = useState({});
  const [subcategories, setSubcategories] = useState([]);
  // Control per-color expanded state to allow re-selection
  const [expandedColors, setExpandedColors] = useState({});

  // Ensure uniqueness: only one image may be assigned to a given color
  const assignColorToImage = (index, color) => {
    setImageColorAssignments(prev => {
      const next = { ...prev };
      const normalizedColor = (color || '').trim();
      // Clear previous assignment for this color from other images
      if (normalizedColor) {
        Object.keys(next).forEach((key) => {
          const k = Number(key);
          if (k !== index && (next[k] || '').trim().toLowerCase() === normalizedColor.toLowerCase()) {
            next[k] = '';
          }
        });
      }
      // Set current image assignment
      next[index] = normalizedColor;
      return next;
    });
    // Collapse the color section after selecting
    const lower = (color || '').trim().toLowerCase();
    if (lower) setExpandedColors(prev => ({ ...prev, [lower]: false }));
  };

  // Category options
  const categories = [
    { value: 'l-mart', label: 'E-market' },
    { value: 'localmarket', label: 'Local-market' },
    { value: 'printing', label: 'Printing' },
    { value: 'oldee', label: 'Oldee' },
    { value: 'news', label: 'TodayNews' }
  ];

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

    // Auto-load category commission when category changes
    if (name === 'category') {
      const newCat = value;
      if (newCat) {
        getCategoryCommission(newCat).then((res) => {
          const pct = Number(res?.data?.commissionPercent ?? 2);
          setFormData(prev => ({ ...prev, adminCommissionPercent: pct }));
        }).catch(() => {
          setFormData(prev => ({ ...prev, adminCommissionPercent: 2 }));
        });
      } else {
        setFormData(prev => ({ ...prev, adminCommissionPercent: 2 }));
      }
    }
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  // Variant chip helpers
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
      
      // Create preview
      const reader = new FileReader();
      reader.onload = (e) => setImagePreview(e.target.result);
      reader.readAsDataURL(file);
    }
  };

  // Handle optional product video upload (max 5MB)
  const handleVideoChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      setErrors(prev => ({ ...prev, video: 'Video size must be ≤ 5MB' }));
      return;
    }
    setErrors(prev => ({ ...prev, video: null }));
    setFormData(prev => ({ ...prev, video: file }));
  };

  const handleMultipleImagesChange = (e) => {
    const files = Array.from(e.target.files || []);
    // Merge newly selected files with any existing files; cap at 10
    setFormData(prev => {
      const merged = [...(prev.images || []), ...files].slice(0, 10);
      return { ...prev, images: merged };
    });

    // Create previews for newly added files and append to existing previews; cap at 10
    const newPreviews = [];
    files.forEach(file => {
      const reader = new FileReader();
      reader.onload = (ev) => {
        newPreviews.push(ev.target.result);
        if (newPreviews.length === files.length) {
          setMultipleImagePreviews(prev => {
            const mergedPrev = [...prev, ...newPreviews].slice(0, 10);
            return mergedPrev;
          });
          // Initialize assignment placeholders for newly added indices (no color yet)
          setImageColorAssignments(prev => {
            const startIndex = (formData.images || []).length; // previous length before merge
            const next = { ...prev };
            for (let i = 0; i < newPreviews.length && (startIndex + i) < 10; i++) {
              const idx = startIndex + i;
              if (next[idx] === undefined) next[idx] = '';
            }
            return next;
          });
        }
      };
      reader.readAsDataURL(file);
    });

    // Reset input value so user can re-select the same files if needed
    if (e.target) e.target.value = '';
  };

  // Remove main image
  const removeMainImage = () => {
    setFormData(prev => ({ ...prev, image: null }));
    setImagePreview(null);
  };

  // Remove a specific additional image by index
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
    // Reindex imageColorAssignments after removal
    setImageColorAssignments(prev => {
      const next = {};
      const total = (multipleImagePreviews?.length || 0) - 1; // after removal
      let shift = 0;
      for (let i = 0; i < total + 1; i++) {
        if (i === index) { shift = 1; continue; }
        const newIdx = i - shift;
        if (newIdx >= 0) next[newIdx] = prev[i] ?? '';
      }
      return next;
    });
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.name.trim()) newErrors.name = 'Product name is required';
    if (!formData.description.trim()) newErrors.description = 'Description is required';
    if (!formData.price || formData.price <= 0) newErrors.price = 'Valid price is required';
    if (!formData.category) newErrors.category = 'Category is required';
    if (!formData.subcategory) newErrors.subcategory = 'Subcategory is required';

    // Optional offer price: if provided, must be non-negative and less than price
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
        .map(v => (v || '').trim())
        .filter(Boolean),
      sizeVarients: (Array.isArray(formData.sizeVarients) ? formData.sizeVarients : [])
        .map(v => (v || '').trim())
        .filter(Boolean)
    };
    // Build imagesColorMap: { normalizedColor: [imageIndexes] }
    const imagesColorMap = {};
    Object.entries(imageColorAssignments || {}).forEach(([idxStr, color]) => {
      const idx = Number(idxStr);
      const c = (color || '').trim().toLowerCase();
      if (!c) return;
      if (!imagesColorMap[c]) imagesColorMap[c] = [];
      imagesColorMap[c].push(idx);
    });

    // Strict validation: each color must have exactly one assigned image
    const colorsListNorm = (submissionData.colorVarients || []).map(c => (c || '').trim().toLowerCase());
    const missing = colorsListNorm.filter(c => !imagesColorMap[c] || imagesColorMap[c].length === 0);
    const multi = colorsListNorm.filter(c => (imagesColorMap[c] || []).length > 1);
    if (missing.length || multi.length) {
      const msgParts = [];
      if (missing.length) msgParts.push(`इन रंगों के लिए इमेज चुनें: ${missing.join(', ')}`);
      if (multi.length) msgParts.push(`हर रंग के लिए सिर्फ एक इमेज चुने (अभी एक से ज़्यादा चुना है: ${multi.join(', ')})`);
      setErrors({ submit: msgParts.join(' | ') });
      return;
    }
    if (Object.keys(imagesColorMap).length) {
      submissionData.imagesColorMap = imagesColorMap;
    }
    console.log('Form data being submitted:', submissionData);
    
    setLoading(true);
    try {
      const fd = new FormData();
      fd.append('name', submissionData.name);
      fd.append('description', submissionData.description);
      fd.append('price', submissionData.price);
      if (submissionData.offerPrice) fd.append('offerPrice', submissionData.offerPrice);
      fd.append('category', submissionData.category);
      if (submissionData.subcategory) fd.append('subcategory', submissionData.subcategory);
      fd.append('colorVarients', JSON.stringify((Array.isArray(submissionData.colorVarients) ? submissionData.colorVarients : [submissionData.colorVarients]).filter(Boolean)));
      fd.append('sizeVarients', JSON.stringify((Array.isArray(submissionData.sizeVarients) ? submissionData.sizeVarients : [submissionData.sizeVarients]).filter(Boolean)));
      fd.append('inStock', String(!!submissionData.inStock));
      fd.append('stockQuantity', String(submissionData.stockQuantity ?? 0));
      if (submissionData.image) {
        fd.append('image', submissionData.image);
      }
      (submissionData.images || []).forEach((imgFile) => {
        fd.append('images', imgFile);
      });
      if (submissionData.video) {
        fd.append('video', submissionData.video);
      }
      if (submissionData.imagesColorMap && Object.keys(submissionData.imagesColorMap).length) {
        fd.append('imagesColorMap', JSON.stringify(submissionData.imagesColorMap));
      }
      // Include admin commission percent
      if (typeof submissionData.adminCommissionPercent !== 'undefined') {
        fd.append('adminCommissionPercent', String(submissionData.adminCommissionPercent));
      }

      const result = await (createSellerProduct ? createSellerProduct(fd) : sellerService.createSellerProduct(fd));
      console.log('Seller product creation result:', result);
      if (result?.success) {
        onProductAdded();
        onClose();
        resetForm();
      } else {
        setErrors({ submit: result?.message || 'Failed to create product. Please try again.' });
      }
    } catch (error) {
      console.error('Error creating seller product:', error);
      setErrors({ submit: error?.response?.data?.message || 'Failed to create product. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
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
      images: [],
      video: null,
      adminCommissionPercent: 2
    });
    setErrors({});
    setImagePreview(null);
    setMultipleImagePreviews([]);
    setImageColorAssignments({});
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-200 bg-gradient-to-r from-blue-600 to-purple-600">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-white">Add New Product</h2>
            <button
              onClick={handleClose}
              className="text-white hover:text-gray-200 transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Left Column */}
            <div className="space-y-4">
              {/* Product Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Product Name *
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.name ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Enter product name"
                />
                {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description *
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  rows={4}
                  className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.description ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Enter product description"
                />
                {errors.description && <p className="text-red-500 text-sm mt-1">{errors.description}</p>}
              </div>

              {/* Price */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Price (₹) *
                </label>
                <input
                  type="number"
                  name="price"
                  value={formData.price}
                  onChange={handleInputChange}
                  min="0"
                  step="0.01"
                  className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.price ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Enter price"
                />
                {errors.price && <p className="text-red-500 text-sm mt-1">{errors.price}</p>}
              </div>

              {/* Offer Price (Optional) */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Offer Price (₹) <span className="text-gray-500">(Optional)</span>
                </label>
                <input
                  type="number"
                  name="offerPrice"
                  value={formData.offerPrice}
                  onChange={handleInputChange}
                  min="0"
                  step="0.01"
                  className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.offerPrice ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Enter offer price (optional)"
                />
                {errors.offerPrice && (
                  <p className="text-red-500 text-sm mt-1">{errors.offerPrice}</p>
                )}
              </div>

              {/* Category */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Category *
                </label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.category ? 'border-red-500' : 'border-gray-300'
                  }`}
                >
                  <option value="">Select Category</option>
                  {categories.map(cat => (
                    <option key={cat.value} value={cat.value}>{cat.label}</option>
                  ))}
                </select>
                {errors.category && <p className="text-red-500 text-sm mt-1">{errors.category}</p>}
                {formData.category && (
                  <p className="text-xs text-gray-600 mt-1">Admin Commission for this category: <span className="font-semibold">{formData.adminCommissionPercent}%</span></p>
                )}
              </div>

              {/* Subcategory */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Subcategory *
                </label>
                <select
                  name="subcategory"
                  value={formData.subcategory}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.subcategory ? 'border-red-500' : 'border-gray-300'
                  }`}
                >
                  <option value="">{formData.category ? 'Select Subcategory' : 'Select category first'}</option>
                  {subcategories.map(sc => (
                    <option key={sc._id} value={sc.name}>{sc.name}</option>
                  ))}
                </select>
                {errors.subcategory && <p className="text-red-500 text-sm mt-1">{errors.subcategory}</p>}
              </div>

              {/* Color variant chips */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Color variant</label>
                <div className="flex flex-wrap gap-2">
                  {(Array.isArray(formData.colorVarients) ? formData.colorVarients : [formData.colorVarients]).map((val, idx) => (
                    <div key={idx} className="flex items-center gap-1">
                      <input
                        type="text"
                        value={val}
                        onChange={(e) => updateVariantChip('colorVarients', idx, e.target.value)}
                        className="w-24 px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder={idx === 0 ? 'Red' : ''}
                      />
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

                {/* Color-wise image assignment helper */}
                {(multipleImagePreviews.length > 0 && (Array.isArray(formData.colorVarients) ? formData.colorVarients : []).some(v => (v || '').trim())) && (
                  <div className="mt-4 space-y-3">
                    <p className="text-xs text-gray-600">Assign exactly one image to each color:</p>
                    {(Array.isArray(formData.colorVarients) ? formData.colorVarients : [])
                      .map(v => (v || '').trim())
                      .filter(Boolean)
                      .map((color, ci) => (
                         <div key={`${color}-${ci}`} className="border rounded p-2">
                           <div className="flex items-center justify-between mb-2">
                             <div className="text-sm font-medium">{color}</div>
                             {(() => {
                               const lower = color.trim().toLowerCase();
                               const assignedIndex = Object.keys(imageColorAssignments).find((idx) => (
                                 (imageColorAssignments[idx] || '').trim().toLowerCase() === lower
                               ));
                               if (assignedIndex && !expandedColors[lower]) {
                                 return (
                                   <button
                                     type="button"
                                     className="text-xs text-blue-600 hover:underline"
                                     onClick={() => setExpandedColors(prev => ({ ...prev, [lower]: true }))}
                                   >
                                     Change
                                   </button>
                                 );
                               }
                               return null;
                             })()}
                           </div>
                           <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                             {(() => {
                               const lower = color.trim().toLowerCase();
                               const assignedIndex = Object.keys(imageColorAssignments).find((idx) => (
                                 (imageColorAssignments[idx] || '').trim().toLowerCase() === lower
                               ));
                               const showOnlyAssigned = !!assignedIndex && !expandedColors[lower];
                               const previewsToRender = showOnlyAssigned
                                 ? multipleImagePreviews.map((p, i) => ({ p, i })).filter(({ i }) => String(i) === String(assignedIndex))
                                 : multipleImagePreviews.map((p, i) => ({ p, i }));
                               return previewsToRender.map(({ p: preview, i: index }) => {
                                 const assigned = (imageColorAssignments[index] || '').trim().toLowerCase() === lower;
                                 return (
                                   <label key={index} className="flex items-center gap-2">
                                     <input
                                       type="radio"
                                       name={`color-image-${color}`}
                                       checked={assigned}
                                       onChange={() => assignColorToImage(index, color)}
                                     />
                                     <img src={preview} alt={`img-${index + 1}`} className="w-12 h-12 object-cover rounded" />
                                   </label>
                                 );
                               });
                             })()}
                           </div>
                         </div>
                       ))}
                   </div>
                 )}
               </div>

              {/* Size variant chips */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Size variant</label>
                <div className="flex flex-wrap gap-2">
                  {(Array.isArray(formData.sizeVarients) ? formData.sizeVarients : [formData.sizeVarients]).map((val, idx) => (
                    <div key={idx} className="flex items-center gap-1">
                      <input
                        type="text"
                        value={val}
                        onChange={(e) => updateVariantChip('sizeVarients', idx, e.target.value)}
                        className="w-20 px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder={idx === 0 ? 'S' : ''}
                      />
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

              {/* Stock Quantity */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Stock Quantity
                </label>
                <input
                  type="number"
                  name="stockQuantity"
                  value={formData.stockQuantity}
                  onChange={handleInputChange}
                  min="0"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter stock quantity"
                />
              </div>

              {/* In Stock Checkbox */}
              <div className="flex items-center">
                <input
                  type="checkbox"
                  name="inStock"
                  checked={formData.inStock}
                  onChange={handleInputChange}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label className="ml-2 block text-sm text-gray-700">
                  Product is in stock
                </label>
              </div>
            </div>

            {/* Right Column - Images and Video */}
            <div className="space-y-4">
              {/* Main Image */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Main Product Image
                </label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="hidden"
                    id="main-image"
                  />
                  <label htmlFor="main-image" className="cursor-pointer">
                    {imagePreview ? (
                      <div className="relative">
                        <img src={imagePreview} alt="Preview" className="w-full h-32 object-cover rounded-lg mb-2" />
                        <button
                          type="button"
                          onClick={removeMainImage}
                          className="absolute top-2 right-2 bg-white/80 hover:bg-white text-gray-700 hover:text-red-600 border border-gray-300 rounded-full p-1 shadow"
                          aria-label="Remove main image"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
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

              {/* Multiple Images */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Additional Images (Optional, up to 10)
                </label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleMultipleImagesChange}
                    className="hidden"
                    id="multiple-images"
                  />
                  <label htmlFor="multiple-images" className="cursor-pointer">
                    {multipleImagePreviews.length > 0 ? (
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mb-2">
                        {multipleImagePreviews.map((preview, index) => (
                          <div key={index} className="relative">
                            <img src={preview} alt={`Preview ${index + 1}`} className="w-full h-20 object-cover rounded" />
                            <button
                              type="button"
                              onClick={() => removeAdditionalImage(index)}
                              className="absolute top-1 right-1 bg-white/80 hover:bg-white text-gray-700 hover:text-red-600 border border-gray-300 rounded-full p-1 shadow"
                              aria-label={`Remove image ${index + 1}`}
                            >
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                              </svg>
                            </button>
                            {/* Color assignment dropdown */}
                            <div className="mt-1">
                              <select
                                value={imageColorAssignments[index] ?? ''}
                                onChange={(e) => assignColorToImage(index, e.target.value)}
                                className="w-full px-2 py-1 text-xs border rounded bg-white"
                                aria-label={`Assign color to image ${index + 1}`}
                              >
                                <option value="">Assign color…</option>
                                {(Array.isArray(formData.colorVarients) ? formData.colorVarients : [])
                                  .map(v => (v || '').trim())
                                  .filter(Boolean)
                                  .map((colorOpt, i) => (
                                    <option key={`${colorOpt}-${i}`} value={colorOpt}>{colorOpt}</option>
                                  ))}
                              </select>
                            </div>
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

              {/* Product Video (Optional, up to 5MB) - MOVED HERE */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Add Video (Optional, up to 5MB)
                </label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
                  <input
                    type="file"
                    accept="video/*"
                    onChange={handleVideoChange}
                    className="hidden"
                    id="seller-video-upload"
                  />
                  <label htmlFor="seller-video-upload" className="cursor-pointer flex flex-col items-center text-gray-500">
                    {formData.video ? (
                      <div className="text-sm text-gray-700">
                        <p className="font-medium">{formData.video.name}</p>
                        <p className="text-xs">{(formData.video.size / (1024 * 1024)).toFixed(2)} MB</p>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center py-8">
                        <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 48 48">
                          <path d="M16 12h16a4 4 0 014 4v16a4 4 0 01-4 4H16a4 4 0 01-4-4V16a4 4 0 014-4zm8 8l10 6-10 6V20z" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                        <p className="mt-2 text-sm text-gray-600">Click to upload product video</p>
                      </div>
                    )}
                  </label>
                </div>
                {errors.video && <p className="text-red-500 text-sm mt-1">{errors.video}</p>}
              </div>

            </div> {/* End of Right Column */}
          </div> {/* End of grid-cols-1 md:grid-cols-2 */}


          {/* Error Message */}
          {errors.submit && (
            <div className="mt-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
              {errors.submit}
            </div>
          )}

          {/* Form Actions */}
          <div className="flex justify-end space-x-3 mt-6 pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={handleClose}
              className="px-4 py-2 text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Creating...' : 'Create Product'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SellerAddProductModal;