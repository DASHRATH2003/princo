import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const MyOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [ratingState, setRatingState] = useState({}); // { [productId]: { rating, comment, submitting } }
  const navigate = useNavigate();

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      console.log("Fetching orders from backend...");

      const API_ROOT = (import.meta.env.VITE_API_URL || 'http://localhost:5000').replace(/\/$/, '').replace('/api', '');
      const API_BASE_URL = `${API_ROOT}/api`;

      // Authenticated customer orders fetch karo
      const token = localStorage.getItem("token");
      if (!token) {
        setOrders([]);
        setLoading(false);
        navigate("/login");
        return;
      }

      const response = await fetch(`${API_BASE_URL}/orders/my`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      console.log("Orders API Response:", response);

      if (response.ok) {
        const ordersData = await response.json();
        console.log("Orders data received:", ordersData);
        setOrders(Array.isArray(ordersData) ? ordersData : []);
      } else if (response.status === 401) {
        navigate("/login");
        setOrders([]);
      } else {
        console.error("Failed to fetch orders:", response.status);
        setOrders([]);
      }
    } catch (error) {
      console.error("Error fetching orders:", error);
      setOrders([]);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case "delivered":
        return "bg-green-100 text-green-800";
      case "processing":
        return "bg-blue-100 text-blue-800";
      case "shipped":
        return "bg-purple-100 text-purple-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "cancelled":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const cancelOrder = async (orderId) => {
    try {
      const API_ROOT = (import.meta.env.VITE_API_URL || 'http://localhost:5000').replace(/\/$/, '').replace('/api', '');
      const API_BASE_URL = `${API_ROOT}/api`;

      const token = localStorage.getItem("token");
      if (!token) {
        alert("Please login to cancel your order.");
        navigate("/login");
        return;
      }

      const confirmCancel = confirm(
        "Are you sure you want to cancel this order?"
      );
      if (!confirmCancel) return;

      const response = await fetch(`${API_BASE_URL}/orders/${orderId}/cancel`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        alert("Order cancelled successfully.");
        // Refresh orders list
        fetchOrders();
      } else {
        const err = await response.json().catch(() => ({}));
        alert(err.message || "Failed to cancel order.");
      }
    } catch (error) {
      console.error("Error cancelling order:", error);
      alert("Error cancelling order.");
    }
  };

  const getApiBaseUrl = () => {
    const API_ROOT = (import.meta.env.VITE_API_URL || 'http://localhost:5000').replace(/\/$/, '').replace('/api', '');
    return `${API_ROOT}/api`;
  };

  const setItemRating = (productId, rating) => {
    setRatingState((prev) => ({
      ...prev,
      [productId]: { ...(prev[productId] || {}), rating }
    }));
  };

  const setItemComment = (productId, comment) => {
    setRatingState((prev) => ({
      ...prev,
      [productId]: { ...(prev[productId] || {}), comment }
    }));
  };

  const submitRating = async (productId, orderId) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        alert("Please login to rate products.");
        navigate('/login');
        return;
      }

      const API_BASE_URL = getApiBaseUrl();
      const rating = Number(ratingState[productId]?.rating || 0);
      const comment = String(ratingState[productId]?.comment || '').trim();

      if (!rating || rating < 1 || rating > 5) {
        alert("Please select a star rating between 1 and 5.");
        return;
      }

      setRatingState((prev) => ({
        ...prev,
        [productId]: { ...(prev[productId] || {}), submitting: true }
      }));

      const response = await fetch(`${API_BASE_URL}/products/rate/${productId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ rating, orderId, comment }),
      });

      const data = await response.json().catch(() => ({}));

      if (response.ok) {
        alert('Thanks! Your rating has been submitted.');
        // Optional: refresh orders to reflect any changes
        // fetchOrders();
      } else {
        alert(data.message || 'Failed to submit rating.');
      }
    } catch (error) {
      console.error('Error submitting rating:', error);
      alert('Error submitting rating.');
    } finally {
      setRatingState((prev) => ({
        ...prev,
        [productId]: { ...(prev[productId] || {}), submitting: false }
      }));
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4">
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                My Orders
              </h1>
              <p className="text-gray-600">
                View your order history and track current orders
              </p>
            </div>
            <button
              onClick={() => navigate("/e-market")}
              className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
            >
              Continue on L-mart
            </button>
          </div>

          {loading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500 mx-auto"></div>
              <p className="mt-4 text-gray-600">Loading your orders...</p>
            </div>
          ) : orders.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg
                  className="w-12 h-12 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1}
                    d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                  />
                </svg>
              </div>
              <h2 className="text-xl font-semibold text-gray-900 mb-2">
                No orders yet
              </h2>
              <p className="text-gray-600 mb-6">
                Start shopping to see your orders here
              </p>
              <button
                onClick={() => navigate("/e-market")}
                className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
              >
                Start Shopping on L-mart
              </button>
            </div>
          ) : (
            <div className="space-y-6">
              {orders.map((order) => (
                <div
                  key={order._id || order.id}
                  className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow"
                >
                  <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-4">
                    <div className="mb-4 lg:mb-0">
                      <div className="flex items-center space-x-4">
                        <div className="flex-1">
                          <h3 className="text-lg font-semibold text-gray-900">
                            Order #{order.orderId || order._id}
                          </h3>
                          <p className="text-gray-600 text-sm">
                            Placed on{" "}
                            {formatDate(order.createdAt || order.paymentDate)}
                          </p>
                        </div>
                        <span
                          className={`inline-flex px-3 py-1 text-sm font-semibold rounded-full ${getStatusColor(
                            order.status
                          )}`}
                        >
                          {order.status?.charAt(0).toUpperCase() +
                            order.status?.slice(1) || "Processing"}
                        </span>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold text-purple-600">
                        ₹{order.total}
                      </p>
                      <p className="text-sm text-gray-500">
                        {order.items?.length || 0} items
                      </p>
                    </div>
                  </div>

                  {/* Order Items */}
                  <div className="border-t pt-4">
                    <h4 className="font-semibold text-gray-900 mb-3">
                      Order Items
                    </h4>
                    <div className="space-y-3">
                      {order.items?.map((item, index) => (
                        <div
                          key={index}
                          className="flex items-center space-x-4 p-3 bg-gray-50 rounded-lg"
                        >
                          <div className="w-12 h-12 rounded overflow-hidden border border-gray-200 bg-white">
                            <img
                              src={
                                (item?.image || item?.imageUrl || '').trim() || '/no-image.svg'
                              }
                              alt={item?.name || 'Product image'}
                              className="w-full h-full object-cover"
                              loading="lazy"
                              referrerPolicy="no-referrer"
                              onError={(e) => {
                                e.currentTarget.src = '/no-image.svg';
                              }}
                            />
                          </div>
                          <div className="flex-1">
                            <p className="font-medium text-gray-900">
                              {item.name}
                            </p>
                            <p className="text-sm text-gray-600">
                              Quantity: {item.quantity}
                            </p>
                            {(item.size || item.color) && (
                              <div className="flex space-x-2 mt-1">
                                {item.size && (
                                  <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                                    Size: {item.size}
                                  </span>
                                )}
                                {item.color && (
                                  <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">
                                    Color: {item.color}
                                  </span>
                                )}
                              </div>
                            )}
                          </div>
                          <div className="text-right">
                            <p className="font-semibold text-gray-900">
                              ₹{item.price}
                            </p>
                            <p className="text-sm text-gray-600">
                              Total: ₹{item.price * item.quantity}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Rating Section: Show only when delivered */}
                  {String(order.status || '').toLowerCase() === 'delivered' && (
                    <div className="border-t pt-4 mt-4">
                      <h4 className="font-semibold text-gray-900 mb-3">Rate Your Products</h4>
                      <div className="space-y-3">
                        {order.items?.map((item, idx) => {
                          const productId = item.productId || item._id || item.id;
                          const state = ratingState[productId] || {};
                          const selected = Number(state.rating || 0);
                          return (
                            <div key={`rate-${idx}`} className="p-3 bg-white border rounded-lg">
                              <div className="flex items-center justify-between">
                                <div className="flex items-center space-x-3">
                                  <div className="w-10 h-10 rounded overflow-hidden border bg-gray-50">
                                    <img
                                      src={(item?.image || item?.imageUrl || '').trim() || '/no-image.svg'}
                                      alt={item?.name || 'Product image'}
                                      className="w-full h-full object-cover"
                                      onError={(e) => { e.currentTarget.src = '/no-image.svg'; }}
                                    />
                                  </div>
                                  <div>
                                    <p className="text-sm font-medium text-gray-900">{item.name}</p>
                                    <div className="flex space-x-1 mt-1">
                                      {[1,2,3,4,5].map((star) => (
                                        <button
                                          key={star}
                                          type="button"
                                          onClick={() => setItemRating(productId, star)}
                                          className={`text-xl ${selected >= star ? 'text-yellow-500' : 'text-gray-300'} hover:text-yellow-500`}
                                          title={`${star} star${star>1?'s':''}`}
                                        >
                                          ★
                                        </button>
                                      ))}
                                    </div>
                                  </div>
                                </div>
                                <div className="flex items-center space-x-2">
                                  <input
                                    type="text"
                                    placeholder="Optional comment"
                                    value={state.comment || ''}
                                    onChange={(e) => setItemComment(productId, e.target.value)}
                                    className="w-48 px-3 py-2 border rounded-md text-sm"
                                  />
                                  <button
                                    onClick={() => submitRating(productId, order.orderId)}
                                    disabled={!selected || state.submitting}
                                    className={`px-4 py-2 rounded-md text-white text-sm font-medium ${(!selected || state.submitting) ? 'bg-gray-300 cursor-not-allowed' : 'bg-purple-600 hover:bg-purple-700'}`}
                                  >
                                    {state.submitting ? 'Submitting...' : 'Submit Rating'}
                                  </button>
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                      <p className="text-xs text-gray-500 mt-2">You can rate delivered items only.</p>
                    </div>
                  )}

                  {/* Customer Info */}
                  <div className="border-t pt-4 mt-4">
  <h4 className="font-semibold text-gray-900 mb-3">
    Delivery Information
  </h4>
  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
    <div>
      <p className="text-gray-600">
        <span className="font-semibold">Customer:</span> {order.customerName}
      </p>
      {order.customerEmail && (
        <p className="text-gray-600">
          <span className="font-semibold">Email:</span> {order.customerEmail}
        </p>
      )}
      {order.customerPhone && (
        <p className="text-gray-600">
          <span className="font-semibold">Phone:</span> {order.customerPhone}
        </p>
      )}
    </div>

    <div>
      {order.customerAddress && (
        <p className="text-gray-600">
          <span className="font-semibold">Address:</span> {order.customerAddress}
        </p>
      )}
      {order.customerCity && (
        <p className="text-gray-600">
          <span className="font-semibold">City:</span> {order.customerCity}
        </p>
      )}
      {order.customerPincode && (
        <p className="text-gray-600">
          <span className="font-semibold">PIN:</span> {order.customerPincode}
        </p>
      )}
    </div>
  </div>
</div>


                  {/* View Details Button - YEH ADD KIYA HAI */}
                  <div className="border-t pt-4 mt-4 flex justify-end">
                    <button
                      onClick={() =>
                        navigate(`/orderDetails/${order._id || order.id}`, {
                          state: { order },
                        })
                      }
                      className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-2 rounded-lg font-medium transition-colors"
                    >
                      View Order Details
                    </button>
                    {(() => {
                      const canCancel = ["pending", "processing"].includes(String(order.status || "").toLowerCase());
                      const baseClasses = "ml-3 px-6 py-2 rounded-lg font-medium transition-colors";
                      const enabledClasses = "bg-red-600 hover:bg-red-700 text-white";
                      const disabledClasses = "bg-gray-200 text-gray-500 cursor-not-allowed";
                      return (
                        <button
                          onClick={() => cancelOrder(order._id || order.id)}
                          disabled={!canCancel}
                          title={!canCancel ? "Cancel only for Pending/Processing orders" : ""}
                          className={`${baseClasses} ${canCancel ? enabledClasses : disabledClasses}`}
                        >
                          Cancel Order
                        </button>
                      );
                    })()}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MyOrders;
