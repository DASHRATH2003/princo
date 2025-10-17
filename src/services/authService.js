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

export const forgotPassword = async ({ email }) => {
  const res = await fetch(`${API_BASE_URL}/auth/forgot-password`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email })
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.message || `Forgot password failed (${res.status})`);
  return data; // { message }
};

export const resetPassword = async ({ email, token, password }) => {
  const res = await fetch(`${API_BASE_URL}/auth/reset-password`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, token, password })
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.message || `Reset password failed (${res.status})`);
  return data; // { message }
};

export const saveUserSession = ({ token, user }) => {
  localStorage.setItem('token', token);
  localStorage.setItem('user', JSON.stringify(user));
};

export const getCurrentUser = () => {
  try {
    const u = localStorage.getItem('user');
    return u ? JSON.parse(u) : null;
  } catch (_) {
    return null;
  }
};

export const logoutUser = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
};

// Separate session management for sellers
export const saveSellerSession = ({ token, user }) => {
  localStorage.setItem('sellerToken', token);
  localStorage.setItem('sellerUser', JSON.stringify(user));
};

export const getCurrentSeller = () => {
  try {
    const u = localStorage.getItem('sellerUser');
    return u ? JSON.parse(u) : null;
  } catch (_) {
    return null;
  }
};

export const logoutSeller = () => {
  localStorage.removeItem('sellerToken');
  localStorage.removeItem('sellerUser');
};