import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const MyOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      console.log("Fetching orders from backend...");

      const API_BASE_URL =
        import.meta.env.VITE_API_URL || "http://localhost:5000/api";

      // Backend se orders fetch karo
      const response = await fetch(`${API_BASE_URL}/orders`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      console.log("Orders API Response:", response);

      if (response.ok) {
        const ordersData = await response.json();
        console.log("Orders data received:", ordersData);
        setOrders(ordersData);
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
              Continue Shopping
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
                Start Shopping
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
                          <div className="w-12 h-12 bg-gray-200 rounded flex items-center justify-center">
                            <svg
                              className="w-6 h-6 text-gray-400"
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
                          <div className="flex-1">
                            <p className="font-medium text-gray-900">
                              {item.name}
                            </p>
                            <p className="text-sm text-gray-600">
                              Quantity: {item.quantity}
                            </p>
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

                  {/* Customer Info */}
                  <div className="border-t pt-4 mt-4">
                    <h4 className="font-semibold text-gray-900 mb-3">
                      Delivery Information
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="text-gray-600">
                          Customer: {order.customerName}
                        </p>
                        {order.customerEmail && (
                          <p className="text-gray-600">
                            Email: {order.customerEmail}
                          </p>
                        )}
                        {order.customerPhone && (
                          <p className="text-gray-600">
                            Phone: {order.customerPhone}
                          </p>
                        )}
                      </div>
                      <div>
                        {order.customerAddress && (
                          <p className="text-gray-600">
                            Address: {order.customerAddress}
                          </p>
                        )}
                        {order.customerCity && (
                          <p className="text-gray-600">
                            City: {order.customerCity}
                          </p>
                        )}
                        {order.customerPincode && (
                          <p className="text-gray-600">
                            PIN: {order.customerPincode}
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
