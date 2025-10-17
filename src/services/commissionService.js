const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const adminHeaders = () => {
  const token = localStorage.getItem('adminToken') || localStorage.getItem('token');
  const headers = { 'Content-Type': 'application/json' };
  if (token) headers.Authorization = `Bearer ${token}`;
  return headers;
};

export const listCategoryCommissions = async () => {
  const res = await fetch(`${API_BASE_URL}/dashboard/commissions`, {
    method: 'GET',
    headers: adminHeaders()
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.message || `Failed to fetch commissions (${res.status})`);
  return data; // { success, data: [{ category, commissionPercent }] }
};

export const setCategoryCommission = async (category, commissionPercent) => {
  const res = await fetch(`${API_BASE_URL}/dashboard/commissions/${encodeURIComponent(category)}`, {
    method: 'PUT',
    headers: adminHeaders(),
    body: JSON.stringify({ commissionPercent })
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.message || `Failed to set commission (${res.status})`);
  return data; // { success, message, data }
};

export default { listCategoryCommissions, setCategoryCommission };