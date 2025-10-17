const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const authHeaders = () => {
  const token = localStorage.getItem('adminToken');
  return {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  };
};

// Get all notifications for admin
export const getAdminNotifications = async (page = 1, limit = 20, type = null, isRead = null) => {
  try {
    let url = `${API_BASE_URL}/notifications/admin?page=${page}&limit=${limit}`;
    
    if (type) {
      url += `&type=${type}`;
    }
    
    if (isRead !== null) {
      url += `&isRead=${isRead}`;
    }

    const response = await fetch(url, {
      method: 'GET',
      headers: authHeaders()
    });

    if (!response.ok) {
      throw new Error('Failed to fetch notifications');
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching admin notifications:', error);
    throw error;
  }
};

// Get unread count for admin
export const getUnreadCount = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/notifications/admin/unread-count`, {
      method: 'GET',
      headers: authHeaders()
    });

    if (!response.ok) {
      throw new Error('Failed to fetch unread count');
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching unread count:', error);
    throw error;
  }
};

// Mark notification as read
export const markNotificationAsRead = async (notificationId) => {
  try {
    const response = await fetch(`${API_BASE_URL}/notifications/${notificationId}/read`, {
      method: 'PATCH',
      headers: authHeaders()
    });

    if (!response.ok) {
      throw new Error('Failed to mark notification as read');
    }

    return await response.json();
  } catch (error) {
    console.error('Error marking notification as read:', error);
    throw error;
  }
};

// Mark all notifications as read
export const markAllNotificationsAsRead = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/notifications/admin/mark-all-read`, {
      method: 'PATCH',
      headers: authHeaders()
    });

    if (!response.ok) {
      throw new Error('Failed to mark all notifications as read');
    }

    return await response.json();
  } catch (error) {
    console.error('Error marking all notifications as read:', error);
    throw error;
  }
};

// Create new notification
export const createNotification = async (notificationData) => {
  try {
    const response = await fetch(`${API_BASE_URL}/notifications`, {
      method: 'POST',
      headers: authHeaders(),
      body: JSON.stringify(notificationData)
    });

    if (!response.ok) {
      throw new Error('Failed to create notification');
    }

    return await response.json();
  } catch (error) {
    console.error('Error creating notification:', error);
    throw error;
  }
};

// Delete notification
export const deleteNotification = async (notificationId) => {
  try {
    const response = await fetch(`${API_BASE_URL}/notifications/${notificationId}`, {
      method: 'DELETE',
      headers: authHeaders()
    });

    if (!response.ok) {
      throw new Error('Failed to delete notification');
    }

    return await response.json();
  } catch (error) {
    console.error('Error deleting notification:', error);
    throw error;
  }
};

// Clear all read notifications
export const clearReadNotifications = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/notifications/admin/clear-read`, {
      method: 'DELETE',
      headers: authHeaders()
    });

    if (!response.ok) {
      throw new Error('Failed to clear read notifications');
    }

    return await response.json();
  } catch (error) {
    console.error('Error clearing read notifications:', error);
    throw error;
  }
};