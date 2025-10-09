const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export const userRegister = async ({ name, email, password }) => {
  const res = await fetch(`${API_BASE_URL}/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name, email, password })
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message || `Register failed (${res.status})`);
  }
  const data = await res.json();
  return data; // { token, user }
};

export const sellerRegister = async ({ name, email, password }) => {
  const res = await fetch(`${API_BASE_URL}/auth/register-seller`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name, email, password })
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message || `Seller register failed (${res.status})`);
  }
  const data = await res.json();
  return data; // { token, user }
};

export const userLogin = async ({ email, password }) => {
  const res = await fetch(`${API_BASE_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password })
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message || `Login failed (${res.status})`);
  }
  const data = await res.json();
  return data; // { token, user }
};

export const sellerLogin = async ({ email, password }) => {
  // Uses same /auth/login; role decided by user in DB
  const res = await fetch(`${API_BASE_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password })
  });
  if (!res.ok) {
    const errData = await res.json().catch(() => ({}));
    const error = new Error(errData.message || `Seller login failed (${res.status})`);
    error.status = res.status;
    throw error;
  }
  const data = await res.json();
  return data; // { token, user }
};

export const saveUserSession = ({ token, user }) => {
  localStorage.setItem('token', token);
  localStorage.setItem('user', JSON.stringify(user));
};

export const getCurrentUser = () => {
  try {
    const raw = localStorage.getItem('user');
    return raw ? JSON.parse(raw) : null;
  } catch (e) {
    return null;
  }
};

export const logoutUser = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
};