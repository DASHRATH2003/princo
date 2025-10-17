const API_BASE_URL = import.meta.env.VITE_API_URL?.replace('/api', '') || 'http://localhost:5000';

export async function getBanners(productId) {
  const url = productId ? `${API_BASE_URL}/api/banners?productId=${productId}` : `${API_BASE_URL}/api/banners`;
  const res = await fetch(url);
  if (!res.ok) throw new Error('Failed to load banners');
  return res.json();
}

export async function createBanner({ name, imageTitle, imageFile, productId }) {
  const token = localStorage.getItem('adminToken');
  const formData = new FormData();
  if (name) formData.append('name', name);
  if (imageTitle) formData.append('imageTitle', imageTitle);
  formData.append('image', imageFile);
  if (productId) formData.append('productId', productId);

  const res = await fetch(`${API_BASE_URL}/api/banners`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}` },
    body: formData,
  });
  if (!res.ok) {
    const msg = await res.text();
    throw new Error(msg || 'Failed to create banner');
  }
  return res.json();
}

export async function deleteBanner(id) {
  const token = localStorage.getItem('adminToken');
  const res = await fetch(`${API_BASE_URL}/api/banners/${id}`, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error('Failed to delete banner');
  return res.json();
}