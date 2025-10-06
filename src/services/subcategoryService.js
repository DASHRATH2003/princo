const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const authHeaders = () => {
  const headers = { 'Content-Type': 'application/json' };
  const token = localStorage.getItem('adminToken');
  if (token) headers['Authorization'] = `Bearer ${token}`;
  return headers;
};

export const getSubcategoriesByCategory = async (category) => {
  const res = await fetch(`${API_BASE_URL}/subcategories/category/${category}`, {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' }
  });
  if (!res.ok) throw new Error(`HTTP error ${res.status}`);
  const data = await res.json();
  return data.data;
};

export const getAllSubcategoriesAdmin = async () => {
  const res = await fetch(`${API_BASE_URL}/subcategories/admin/all`, {
    method: 'GET',
    headers: authHeaders()
  });
  if (!res.ok) throw new Error(`HTTP error ${res.status}`);
  const data = await res.json();
  return data.data;
};

export const createSubcategory = async ({ name, category }) => {
  const res = await fetch(`${API_BASE_URL}/subcategories`, {
    method: 'POST',
    headers: authHeaders(),
    body: JSON.stringify({ name, category })
  });
  const data = await res.json();
  if (!res.ok || !data.success) throw new Error(data.message || `HTTP error ${res.status}`);
  return data.data;
};

export const deleteSubcategory = async (id) => {
  const res = await fetch(`${API_BASE_URL}/subcategories/${id}`, {
    method: 'DELETE',
    headers: authHeaders()
  });
  const data = await res.json();
  if (!res.ok || !data.success) throw new Error(data.message || `HTTP error ${res.status}`);
  return data.data;
};