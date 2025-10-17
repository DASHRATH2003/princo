const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// 🟢 Get all products by category
export const getProductsByCategory = async (category) => {
  try {
    const headers = {
      'Content-Type': 'application/json'
    };
    
    const token = localStorage.getItem('adminToken');
    if (token) headers['Authorization'] = `Bearer ${token}`;
    
    const response = await fetch(`${API_BASE_URL}/products/category/${category}`, {
      method: 'GET',
      headers
    });

    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

    return await response.json();
  } catch (error) {
    console.error('Error fetching products:', error);
    throw error;
  }
};

// 🟢 Get all products
export const getAllProducts = async () => {
  try {
    const headers = {
      'Content-Type': 'application/json'
    };
    
    const token = localStorage.getItem('adminToken');
    if (token) headers['Authorization'] = `Bearer ${token}`;
    
    const response = await fetch(`${API_BASE_URL}/products`, {
      method: 'GET',
      headers
    });

    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

    return await response.json();
  } catch (error) {
    console.error('Error fetching all products:', error);
    throw error;
  }
};

// 🟢 Search products
export const searchProducts = async (search) => {
  try {
    const headers = { 'Content-Type': 'application/json' };
    const token = localStorage.getItem('adminToken');
    if (token) headers['Authorization'] = `Bearer ${token}`;

    const params = new URLSearchParams();
    if (search) params.set('search', search);
    params.set('limit', '100');

    const response = await fetch(`${API_BASE_URL}/products?${params.toString()}`, {
      method: 'GET',
      headers
    });

    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

    return await response.json();
  } catch (error) {
    console.error('Error searching products:', error);
    throw error;
  }
};

// 🟢 Create new product
export const createProduct = async (productData) => {
  try {
    const formData = new FormData();

    // ✅ Automatically attach sellerId if logged in as seller
    const sellerId = localStorage.getItem('sellerId');
    if (sellerId) productData.sellerId = sellerId;

    console.log('🔄 Creating product with data:', productData);

    Object.keys(productData).forEach(key => {
      if (key === 'images' && productData[key]) {
        Array.from(productData[key]).forEach(file => {
          formData.append('images', file);
        });
      } else if (key === 'image' && productData[key] instanceof File) {
        formData.append('image', productData[key]);
      } else if (key === 'video' && productData[key] instanceof File) {
        formData.append('video', productData[key]);
      } else if (productData[key] !== null && productData[key] !== undefined) {
        if (typeof productData[key] === 'object' && !Array.isArray(productData[key])) {
          formData.append(key, JSON.stringify(productData[key]));
        } else if (Array.isArray(productData[key])) {
          formData.append(key, JSON.stringify(productData[key]));
        } else {
          formData.append(key, productData[key]);
        }
      }
    });

    // Get the appropriate token based on user type
    const adminToken = localStorage.getItem('adminToken');
    const sellerToken = localStorage.getItem('sellerToken');
    const token = adminToken || sellerToken;

    if (!token) {
      throw new Error('Authentication token not found. Please login again.');
    }

    const response = await fetch(`${API_BASE_URL}/products`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`
      },
      body: formData
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('❌ Server error response:', errorText);
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error creating product:', error);
    throw error;
  }
};

// 🟢 Update product
export const updateProduct = async (productId, productData) => {
  try {
    const formData = new FormData();

    Object.keys(productData).forEach(key => {
      if (key === 'images' && productData[key]) {
        Array.from(productData[key]).forEach(file => {
          formData.append('images', file);
        });
      } else if (key === 'image' && productData[key] instanceof File) {
        formData.append('image', productData[key]);
      } else if (key === 'video' && productData[key] instanceof File) {
        formData.append('video', productData[key]);
      } else if (productData[key] !== null && productData[key] !== undefined) {
        if (typeof productData[key] === 'object' && !Array.isArray(productData[key])) {
          formData.append(key, JSON.stringify(productData[key]));
        } else if (Array.isArray(productData[key])) {
          formData.append(key, JSON.stringify(productData[key]));
        } else {
          formData.append(key, productData[key]);
        }
      }
    });

    const response = await fetch(`${API_BASE_URL}/products/update/${productId}`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('sellerToken') || localStorage.getItem('adminToken')}`
      },
      body: formData
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('❌ Server error response:', errorText);
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error updating product:', error);
    throw error;
  }
};

// 🟢 Delete product
export const deleteProduct = async (productId) => {
  try {
    const response = await fetch(`${API_BASE_URL}/products/delete/${productId}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('sellerToken') || localStorage.getItem('adminToken')}`
      }
    });

    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

    return await response.json();
  } catch (error) {
    console.error('Error deleting product:', error);
    throw error;
  }
};

// 🟢 Toggle product status
export const toggleProductStatus = async (productId) => {
  try {
    const response = await fetch(`${API_BASE_URL}/products/toggle-status/${productId}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('sellerToken') || localStorage.getItem('adminToken')}`
      }
    });

    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

    return await response.json();
  } catch (error) {
    console.error('Error toggling product status:', error);
    throw error;
  }
};

// 🟢 Get products for a specific seller
export const getSellerProducts = async (sellerId) => {
  try {
    const token = localStorage.getItem('sellerToken') || localStorage.getItem('adminToken');
    const headers = { 'Content-Type': 'application/json' };
    if (token) headers['Authorization'] = `Bearer ${token}`;

    const response = await fetch(`${API_BASE_URL}/products/seller/${sellerId}`, {
      method: 'GET',
      headers
    });

    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

    return await response.json();
  } catch (error) {
    console.error('Error fetching seller products:', error);
    throw error;
  }
};

// 🟢 Get admin-only products by category
export const getAdminProductsByCategory = async (category) => {
  try {
    const token = localStorage.getItem('adminToken');
    if (!token) throw new Error('Admin access required');

    const headers = {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    };

    const response = await fetch(`${API_BASE_URL}/products/admin/all?category=${category}`, {
      method: 'GET',
      headers
    });

    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

    return await response.json();
  } catch (error) {
    console.error('Error fetching admin products by category:', error);
    throw error;
  }
};

// 🟢 Delete all products (Admin only)
export const deleteAllProducts = async () => {
  try {
    const token = localStorage.getItem('adminToken');
    if (!token) throw new Error('Admin token not found');

    const response = await fetch(`${API_BASE_URL}/products/admin/delete-all`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    });

    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

    return await response.json();
  } catch (error) {
    console.error('Error deleting all products:', error);
    throw error;
  }
};
