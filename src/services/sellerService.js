const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const authHeaders = () => {
  const token = localStorage.getItem('token');
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

// Create a new seller product (multipart/form-data)
export const createSellerProduct = async (formData) => {
  const token = localStorage.getItem('token');
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
export const submitSellerVerification = async (formData) => {
  const token = localStorage.getItem('token');
  const headers = {};
  if (token) headers.Authorization = `Bearer ${token}`;
  const res = await fetch(`${API_BASE_URL}/seller/verification`, {
    method: 'POST',
    headers, // do NOT set Content-Type for FormData
    body: formData
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.message || `Failed to submit verification (${res.status})`);
  return data; // { success, message, data: seller }
};

// Get current seller verification status/details
export const getSellerVerification = async () => {
  const res = await fetch(`${API_BASE_URL}/seller/verification`, {
    method: 'GET',
    headers: authHeaders()
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.message || `Failed to fetch verification (${res.status})`);
  return data; // { success, data: { verificationStatus, verification, registeredOn } }
};

export default {
  getSellerProducts,
  toggleSellerProductStatus,
  getSellerOrders,
  getSellerOrderById,
  createSellerProduct,
  updateSellerOrderStatus,
  submitSellerVerification,
  getSellerVerification
};