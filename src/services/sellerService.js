const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const authHeaders = () => {
  const token = localStorage.getItem('sellerToken');
  const headers = { 'Content-Type': 'application/json' };
  if (token) headers.Authorization = `Bearer ${token}`;
  return headers;
};

export const getSellerProducts = async ({ page = 1, limit = 10, search, category, isActive, inStock } = {}) => {
  const params = new URLSearchParams();
  params.append('page', String(page));
  params.append('limit', String(limit));
  if (search) params.append('search', search);
  if (category) params.append('category', category);
  if (typeof isActive !== 'undefined') params.append('isActive', String(isActive));
  if (typeof inStock !== 'undefined') params.append('inStock', String(inStock));

  const res = await fetch(`${API_BASE_URL}/seller/products?${params.toString()}`, {
    method: 'GET',
    headers: authHeaders()
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.message || `Failed to fetch seller products (${res.status})`);
  return data; // { success, data, pagination }
};

export const toggleSellerProductStatus = async (productId) => {
  const res = await fetch(`${API_BASE_URL}/seller/products/${productId}/toggle-status`, {
    method: 'PATCH',
    headers: authHeaders()
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.message || `Failed to toggle product status (${res.status})`);
  return data; // { success, message, data }
};

export const getSellerOrders = async ({ page = 1, limit = 10, status } = {}) => {
  const params = new URLSearchParams();
  params.append('page', String(page));
  params.append('limit', String(limit));
  if (status) params.append('status', status);

  const res = await fetch(`${API_BASE_URL}/seller/orders?${params.toString()}`, {
    method: 'GET',
    headers: authHeaders()
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.message || `Failed to fetch seller orders (${res.status})`);
  return data; // { success, data, pagination }
};

export const getSellerOrderById = async (id) => {
  const res = await fetch(`${API_BASE_URL}/seller/orders/${id}`, {
    method: 'GET',
    headers: authHeaders()
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.message || `Failed to fetch order (${res.status})`);
  return data; // { success, data }
};

// Get earnings summary and breakdown for current seller
export const getSellerEarnings = async ({ range = 'month', months = 12, weeks = 8, years = 3 } = {}) => {
  const params = new URLSearchParams();
  params.append('range', range);
  params.append('months', String(months));
  params.append('weeks', String(weeks));
  params.append('years', String(years));
  const token = localStorage.getItem('sellerToken');
  const headers = {};
  if (token) headers.Authorization = `Bearer ${token}`;
  const res = await fetch(`${API_BASE_URL}/seller/earnings?${params.toString()}`, {
    method: 'GET',
    headers
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.message || `Failed to fetch earnings (${res.status})`);
  return data; // { success, data: { totals, breakdown } }
};

// Create a new seller product (multipart/form-data)
export const createSellerProduct = async (formData) => {
  const token = localStorage.getItem('sellerToken');
  const headers = {};
  if (token) headers.Authorization = `Bearer ${token}`;
  const res = await fetch(`${API_BASE_URL}/seller/products`, {
    method: 'POST',
    headers, // do NOT set Content-Type: browser will set boundary for FormData
    body: formData
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.message || `Failed to create product (${res.status})`);
  return data; // { success, message, data }
};

// Update order status for seller-owned order
export const updateSellerOrderStatus = async (orderId, status) => {
  const res = await fetch(`${API_BASE_URL}/seller/orders/${orderId}/status`, {
    method: 'PUT',
    headers: authHeaders(),
    body: JSON.stringify({ status })
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.message || `Failed to update order status (${res.status})`);
  return data; // { success, message, data }
};

// Submit seller verification details (multipart/form-data)
export const submitSellerVerification = async (formData, email) => {
  // Add email to formData if not already present
  if (email && !formData.has('email')) {
    formData.append('email', email);
  }
  
  const res = await fetch(`${API_BASE_URL}/seller/verification`, {
    method: 'POST',
    headers: {}, // do NOT set Content-Type for FormData, no auth needed
    body: formData
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.message || `Failed to submit verification (${res.status})`);
  return data; // { success, message, data: seller }
};

// Get current seller verification status/details
export const getSellerVerification = async (email) => {
  const params = new URLSearchParams();
  if (email) params.append('email', email);
  
  const res = await fetch(`${API_BASE_URL}/seller/verification?${params.toString()}`, {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' } // no auth needed
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.message || `Failed to fetch verification (${res.status})`);
  return data; // { success, data: { verificationStatus, verification, registeredOn } }
};

// Get commission percent for a category (seller-visible)
export const getCategoryCommission = async (category) => {
  const res = await fetch(`${API_BASE_URL}/seller/category-commission/${encodeURIComponent(category)}`, {
    method: 'GET',
    headers: authHeaders()
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.message || `Failed to fetch commission (${res.status})`);
  return data; // { success, data: { category, commissionPercent } }
};

export default {
  getSellerProducts,
  toggleSellerProductStatus,
  getSellerOrders,
  getSellerOrderById,
  getSellerEarnings,
  createSellerProduct,
  updateSellerOrderStatus,
  submitSellerVerification,
  getSellerVerification
};

// Admin helper: update seller (dashboard scope)
export const adminUpdateSeller = async (sellerId, payload) => {
  const base = (import.meta.env.VITE_API_URL?.replace('/api', '') || 'http://localhost:5000');
  const token = localStorage.getItem('adminToken');
  const res = await fetch(`${base}/api/dashboard/sellers/${sellerId}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { 'Authorization': `Bearer ${token}` } : {})
    },
    body: JSON.stringify(payload)
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.message || `Failed to update seller (${res.status})`);
  return data; // { success, message, data }
};

// Admin: Delete seller and related products
export const adminDeleteSeller = async (sellerId) => {
  const base = (import.meta.env.VITE_API_URL?.replace('/api', '') || 'http://localhost:5000');
  const token = localStorage.getItem('adminToken');
  const res = await fetch(`${base}/api/dashboard/sellers/${sellerId}`, {
    method: 'DELETE',
    headers: {
      ...(token ? { 'Authorization': `Bearer ${token}` } : {})
    }
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.message || `Failed to delete seller (${res.status})`);
  return data; // { success, message, data }
};