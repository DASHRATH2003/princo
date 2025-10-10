import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';

const OrderDetails = () => {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  
  // Pehle state se order check karo
  const [order, setOrder] = useState(location.state?.order || null);
  const [loading, setLoading] = useState(!location.state?.order);

  useEffect(() => {
    // Agar state mein order nahi hai, tabhi API call karo
    if (!order) {
      fetchOrderDetails();
    }
  }, [orderId, order]);

  const fetchOrderDetails = async () => {
    try {
      setLoading(true);
      const API_ROOT = (import.meta.env.VITE_API_URL || 'http://localhost:5000').replace(/\/$/, '').replace('/api', '');
      const API_BASE_URL = `${API_ROOT}/api`;
      
      console.log('Fetching order details for ID:', orderId); // Debug log
      console.log('API URL:', `${API_BASE_URL}/orders/${orderId}`); // Debug log
      
      const response = await fetch(`${API_BASE_URL}/orders/${orderId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        }
      });

      console.log('Order details response:', response); // Debug log

      if (response.ok) {
        const orderData = await response.json();
        console.log('Order data received:', orderData); // Debug log
        setOrder(orderData);
      } else {
        console.error('Failed to fetch order details, status:', response.status);
        setOrder(null);
      }
    } catch (error) {
      console.error('Error fetching order details:', error);
      setOrder(null);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'delivered': return 'bg-green-100 text-green-800';
      case 'processing': return 'bg-blue-100 text-blue-800';
      case 'shipped': return 'bg-purple-100 text-purple-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Order Not Found</h2>
          <button
            onClick={() => navigate('/my-orders')}
            className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-lg"
          >
            Back to Orders
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="bg-white rounded-lg shadow-sm p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                Order #{order.orderId || order._id}
              </h1>
              <p className="text-gray-600">
                Placed on {formatDate(order.createdAt || order.paymentDate)}
              </p>
            </div>
            <button
              onClick={() => navigate('/my-orders')}
              className="bg-gray-600 hover:bg-gray-700 text-white px-6 py-3 rounded-lg font-medium"
            >
              Back to Orders
            </button>
          </div>

          {/* Order Status */}
          <div className="bg-gray-50 rounded-lg p-4 mb-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Order Status</h3>
                <p className="text-gray-600">Current status of your order</p>
              </div>
              <span className={`inline-flex px-4 py-2 text-sm font-semibold rounded-full ${getStatusColor(order.status)}`}>
                {order.status?.charAt(0).toUpperCase() + order.status?.slice(1) || 'Processing'}
              </span>
            </div>
          </div>

          {/* Order Items */}
          <div className="mb-6">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">Order Items</h3>
            <div className="space-y-4">
              {order.items?.map((item, index) => (
                <div key={index} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                  <div className="flex items-center space-x-4">
                    <div className="w-16 h-16 rounded overflow-hidden border border-gray-200 bg-white">
                      <img
                        src={(item?.image || item?.imageUrl || '').trim() || '/no-image.svg'}
                        alt={item?.name || 'Product image'}
                        className="w-full h-full object-cover"
                        loading="lazy"
                        referrerPolicy="no-referrer"
                        onError={(e) => { e.currentTarget.src = '/no-image.svg'; }}
                      />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{item.name}</p>
                      <p className="text-sm text-gray-600">Quantity: {item.quantity}</p>
                      {(item.size || item.color) && (
                        <div className="flex space-x-2 mt-1">
                          {item.size && (
                            <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">Size: {item.size}</span>
                          )}
                          {item.color && (
                            <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">Color: {item.color}</span>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-gray-900">₹{item.price} each</p>
                    <p className="text-lg font-bold text-purple-600">₹{item.price * item.quantity}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Order Summary */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Customer Information */}
            <div className="bg-gray-50 rounded-lg p-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Customer Information</h3>
              <div className="space-y-2">
                <p><strong>Name:</strong> {order.customerName}</p>
                {order.customerEmail && <p><strong>Email:</strong> {order.customerEmail}</p>}
                {order.customerPhone && <p><strong>Phone:</strong> {order.customerPhone}</p>}
                {order.customerAddress && <p><strong>Address:</strong> {order.customerAddress}</p>}
                {order.customerCity && <p><strong>City:</strong> {order.customerCity}</p>}
                {order.customerPincode && <p><strong>PIN Code:</strong> {order.customerPincode}</p>}
              </div>
            </div>

            {/* Order Total */}
            <div className="bg-gray-50 rounded-lg p-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Order Summary</h3>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>Items Total:</span>
                  <span>₹{order.total}</span>
                </div>
                <div className="flex justify-between">
                  <span>Shipping:</span>
                  <span>FREE</span>
                </div>
                <div className="flex justify-between border-t border-gray-300 pt-2">
                  <strong>Total Amount:</strong>
                  <strong className="text-lg text-purple-600">₹{order.total}</strong>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetails;