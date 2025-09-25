import React, { useState, useEffect } from "react";
import { createProduct, updateProduct } from "../services/productService";

const ProductForm = ({ category: initialCategory, onClose, onSubmit, product: editProduct, editMode = false }) => {
  const [selectedCategory, setSelectedCategory] = useState(
    editMode && editProduct ? editProduct.category : (initialCategory || "emart")
  );
  const [formData, setFormData] = useState({
    name: editMode && editProduct ? editProduct.name : "",
    description: editMode && editProduct ? editProduct.description : "",
    price: editMode && editProduct ? editProduct.price : "",
    subcategory: editMode && editProduct ? editProduct.subcategory : "",
    // Simplified color variants - 3 layers
    colorLayer1: editMode && editProduct && editProduct.colorVariants ? editProduct.colorVariants.layer1 : "",
    colorLayer2: editMode && editProduct && editProduct.colorVariants ? editProduct.colorVariants.layer2 : "",
    colorLayer3: editMode && editProduct && editProduct.colorVariants ? editProduct.colorVariants.layer3 : "",
  });
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [existingImage, setExistingImage] = useState(editMode && editProduct ? editProduct.image || editProduct.imageUrl : "");

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    if (name.includes(".")) {
      const [parent, child] = name.split(".");
      setFormData((prev) => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: value,
        },
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
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
        subcategory: formData.subcategory,
        // Simplified color variants
        colorVariants: {
          layer1: formData.colorLayer1,
          layer2: formData.colorLayer2,
          layer3: formData.colorLayer3,
        },
        image: image,
      };

      let result;
      if (editMode && editProduct) {
        result = await updateProduct(editProduct._id, productData);
        alert("Product updated successfully!");
      } else {
        result = await createProduct(productData);
        alert("Product created successfully!");
      }

      console.log("Product saved successfully:", result);

      // Call onSuccess if provided, otherwise onClose
      if (onSubmit) {
        await onSubmit(result);
      }
      onClose();

    } catch (error) {
      console.error("Error submitting form:", error);
      alert(editMode ? "Error updating product. Please try again." : "Error creating product. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const getCategoryTitle = () => {
    switch (selectedCategory) {
      case "emart":
        return editMode ? "E-Mart Product" : "E-Mart Product";
      case "localmarket":
        return editMode ? "Local Market Product" : "Local Market Product";
      case "printing":
        return editMode ? "Printing Service" : "Printing Service";
      case "news":
        return editMode ? "News Article" : "News Article";
      default:
        return editMode ? "Edit Product" : "Product";
    }
  };

  const getCategoryColor = () => {
    switch (selectedCategory) {
      case "emart":
        return "from-blue-500 to-purple-600";
      case "localmarket":
        return "from-green-500 to-blue-600";
      case "printing":
        return "from-purple-500 to-pink-600";
      case "news":
        return "from-orange-500 to-red-600";
      default:
        return "from-gray-500 to-gray-600";
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm overflow-y-auto h-full w-full z-50">
      <div className="relative top-10 mx-auto p-8 w-11/12 md:w-3/4 lg:w-2/3 xl:w-1/2 shadow-2xl rounded-2xl bg-white/90 backdrop-blur-md border border-white/20 mb-10">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center space-x-3">
            <div
              className={`w-10 h-10 bg-gradient-to-br ${getCategoryColor()} rounded-xl flex items-center justify-center`}
            >
              <svg
                className="w-6 h-6 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                />
              </svg>
            </div>
            <h3
              className={`text-2xl font-bold bg-gradient-to-r ${getCategoryColor()} bg-clip-text text-transparent`}
            >
              {editMode ? "Edit" : "Add"} {getCategoryTitle()}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-full p-2 transition-all duration-200"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Category Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Category *
            </label>
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
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Product Name *
            </label>
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
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Price *
            </label>
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

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description *
            </label>
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

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Subcategory
            </label>
            <input
              type="text"
              name="subcategory"
              value={formData.subcategory}
              onChange={handleInputChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
              placeholder="Enter subcategory"
            />
          </div>

          {/* Color Variants - 3 Layers */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Color Variants (3 Layers)
            </label>
            <div className="space-y-3">
              <select
                name="colorLayer1"
                value={formData.colorLayer1}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white"
              >
                <option value="">Select Layer 1 Color</option>
                <option value="Red">Red</option>
                <option value="Blue">Blue</option>
                <option value="Green">Green</option>
                <option value="Yellow">Yellow</option>
                <option value="Orange">Orange</option>
                <option value="Purple">Purple</option>
                <option value="Pink">Pink</option>
                <option value="Black">Black</option>
                <option value="White">White</option>
                <option value="Gray">Gray</option>
                <option value="Brown">Brown</option>
                <option value="Gold">Gold</option>
                <option value="Silver">Silver</option>
              </select>
              <select
                name="colorLayer2"
                value={formData.colorLayer2}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white"
              >
                <option value="">Select Layer 2 Color</option>
                <option value="Red">Yellow+Red</option>
                <option value="Blue">Yellow+Green</option>
                <option value="Green">Orange+blue</option>
                <option value="Yellow">Blue+red</option>
                <option value="Orange">Orange+White</option>
                <option value="Purple">Yellow+Blue</option>
                <option value="Pink">Orange+Green</option>
                <option value="White">Red+Yellow</option>
              </select>
              <select
                name="colorLayer3"
                value={formData.colorLayer3}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white"
              >
                <option value="">Select Layer 3 Color</option>
                <option value="Red">Blue+Yellow+Red</option>
                <option value="Blue">Orange+White+Green</option>
                <option value="Green">Red+Yellow+Green</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Product Image {editMode ? "" : "*"}
            </label>
            {existingImage && (
              <div className="mb-3">
                <img src={existingImage} alt="Current product" className="w-32 h-32 object-cover rounded-lg border" />
                <p className="text-xs text-gray-500 mt-1">Current image</p>
              </div>
            )}
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              required={!editMode}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
            />
            {editMode && (
              <p className="text-xs text-gray-500 mt-1">Leave empty to keep current image</p>
            )}
          </div>

          {/* Simplified form - no category-specific fields */}

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
              {loading ? (editMode ? "Updating..." : "Creating...") : (editMode ? `Update ${getCategoryTitle()}` : `Create ${getCategoryTitle()}`)}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProductForm;
