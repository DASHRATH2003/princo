const API_BASE_URL = import.meta.env.VITE_API_URL?.replace('/api', '') || 'http://localhost:5000';

export async function getPosters() {
  const res = await fetch(`${API_BASE_URL}/api/posters`);
  if (!res.ok) throw new Error('Failed to load posters');
  return res.json();
}

export async function createPoster({ title, imageFile }) {
  const token = localStorage.getItem('adminToken');
  const formData = new FormData();
  if (title) formData.append('title', title);
  formData.append('image', imageFile);

  const res = await fetch(`${API_BASE_URL}/api/posters`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: formData,
  });
  if (!res.ok) {
    const msg = await res.text();
    throw new Error(msg || 'Failed to create poster');
  }
  return res.json();
}

export async function deletePoster(id) {
  const token = localStorage.getItem('adminToken');
  const res = await fetch(`${API_BASE_URL}/api/posters/${id}`, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error('Failed to delete poster');
  return res.json();
}