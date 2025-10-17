import React, { useState, useEffect } from "react";
import { useCart } from "../context/CartContext";
import { useNavigate } from "react-router-dom";
import { getCurrentUser } from "../services/authService";

const Checkout = () => {
  const { items, getCartTotal, clearCart, selectedIds, getSelectedTotal } = useCart();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("online");
  const [customerInfo, setCustomerInfo] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    pincode: "",
  });

  // Debug: Check what's in cart items
  console.log("Checkout items:", items);

  // Redirect if cart is empty
  useEffect(() => {
    if (items.length === 0) {
      navigate("/cart");
      return;
    }
    // Guard: require login before entering checkout
    const user = getCurrentUser();
    if (!user) {
      try {
        localStorage.setItem('buyNowIntent', JSON.stringify({
          type: 'checkout',
          redirectTo: '/checkout',
          ts: Date.now()
        }));
      } catch (_) {}
      navigate('/login');
    }
  }, [items, navigate]);

  const handleInputChange = (e) => {
    setCustomerInfo({
      ...customerInfo,
      [e.target.name]: e.target.value,
    });
  };

  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  // ✅ FIXED: Razorpay compatible items format
  const getRazorpayItems = () => {
    const ids = new Set(selectedIds || []);
    const source = (selectedIds && selectedIds.length > 0) ? items.filter(i => ids.has(i.uid || i.id)) : items;
    return source.map((item, index) => ({
      id: String(item._id || item.id || `item_${index}`),
      name: String(item.name || 'Product').substring(0, 100), // Razorpay has length limits
      price: Math.round((item.price || 0) * 100), // Convert to paise
      quantity: Math.max(1, item.quantity || 1)
    }));
  };

  // ✅ For your order records (with all details)
  const getOrderItems = () => {
    const ids = new Set(selectedIds || []);
    const source = (selectedIds && selectedIds.length > 0) ? items.filter(i => ids.has(i.uid || i.id)) : items;
    return source.map(item => ({
      name: item.name,
      quantity: item.quantity,
      price: item.price,
      size: item.selectedSize,
      color: item.selectedColor,
      image: item.image,
      productId: item._id || item.id
    }));
  };

  const handlePayment = async () => {
    // Validate customer info
    if (
      !customerInfo.name ||
      !customerInfo.email ||
      !customerInfo.phone ||
      !customerInfo.address
    ) {
      alert("Please fill all required fields");
      return;
    }

    setLoading(true);

    try {
      // Load Razorpay script
      const scriptLoaded = await loadRazorpayScript();
      if (!scriptLoaded) {
        alert(
          "Razorpay SDK failed to load. Please check your internet connection."
        );
        setLoading(false);
        return;
      }

      const amount = (selectedIds && selectedIds.length > 0) ? getSelectedTotal() : getCartTotal();
      
      // ✅ FIXED: Use Razorpay compatible items
      const razorpayItems = getRazorpayItems();
      const orderItems = getOrderItems(); // For your records

      console.log("📦 Razorpay Items:", razorpayItems);
      console.log("📦 Order Items:", orderItems);

      // Validate items before sending to Razorpay
      const invalidItems = razorpayItems.filter(item => 
        !item.id || !item.name || isNaN(item.price) || isNaN(item.quantity)
      );

      if (invalidItems.length > 0) {
        console.error("❌ Invalid items found:", invalidItems);
        throw new Error("Some items have invalid format. Please check your cart.");
      }

      // Create payment order through backend
      const API_BASE_URL =
        import.meta.env.VITE_API_URL?.replace("/api", "") ||
        "http://localhost:5000";
      console.log(
        "🚀 Making API call to:",
        `${API_BASE_URL}/api/payment/create-order`
      );

      const orderResponse = await fetch(
        `${API_BASE_URL}/api/payment/create-order`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            amount: amount, // ✅ Send rupees; backend converts to paise
            currency: "INR",
            receipt: `receipt_${Date.now()}`,
            customerInfo: customerInfo,
            items: razorpayItems, // ✅ Use Razorpay compatible items
            orderItems: orderItems // ✅ Keep detailed items for your records
          }),
        }
      );

      if (!orderResponse.ok) {
        const errorText = await orderResponse.text();
        console.error("❌ Error response:", errorText);
        throw new Error(
          `Failed to create payment order: ${orderResponse.status} - ${errorText}`
        );
      }

      const orderData = await orderResponse.json();
      console.log("🎯 Payment order created:", orderData);

      // Razorpay options with backend order
      const options = {
        key: orderData.key,
        amount: orderData.order.amount,
        currency: orderData.order.currency,
        name: "L-Mart",
        description: "Printing Services Payment",
        image: "/logo.png",
        order_id: orderData.order.id,
        handler: async function (response) {
          // Payment successful - verify through backend
          console.log("🎉 Payment successful:", response);

          try {
            // Verify payment through backend
            const verifyResponse = await fetch(
              `${API_BASE_URL}/api/payment/verify`,
              {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify({
                  razorpay_order_id: response.razorpay_order_id,
                  razorpay_payment_id: response.razorpay_payment_id,
                  razorpay_signature: response.razorpay_signature,
                  customerInfo: customerInfo,
                  items: orderItems, // ✅ Use detailed items for order creation
                  amount: amount,
                }),
              }
            );

            if (!verifyResponse.ok) {
              throw new Error("Payment verification failed");
            }

            const verifyData = await verifyResponse.json();
            console.log("✅ Payment verified:", verifyData);

            // Prepare navigation data
            const navigationData = {
              paymentId: response.razorpay_payment_id,
              orderId: verifyData.orderId,
              amount: amount,
              items: orderItems, // ✅ Use detailed items
              customerInfo: customerInfo,
            };

            console.log(
              "🚀 Navigating to OrderSuccess with data:",
              navigationData
            );

            // ✅ FIXED: Save data and navigate FIRST
            sessionStorage.setItem(
              "orderSuccessData",
              JSON.stringify(navigationData)
            );
            navigate("/order-success", { state: navigationData });
            
            // ✅ FIXED: Clear cart AFTER navigation
            setTimeout(() => {
              clearCart();
            }, 1000);

          } catch (verifyError) {
            console.error("Payment verification error:", verifyError);
            alert("Payment verification failed. Please contact support.");
            setLoading(false);
          }
        },
        prefill: {
          name: customerInfo.name,
          email: customerInfo.email,
          contact: customerInfo.phone,
        },
        notes: {
          address: customerInfo.address,
          city: customerInfo.city,
          pincode: customerInfo.pincode,
        },
        theme: {
          color: "#7C3AED",
        },
        modal: {
          ondismiss: function () {
            setLoading(false);
          },
        },
      };

      const razorpay = new window.Razorpay(options);
      razorpay.open();
    } catch (error) {
      console.error("💥 Payment error details:", error);
      alert(`Payment failed: ${error.message}. Please try again.`);
      setLoading(false);
    }
  };

  // Cash on Delivery flow - FIXED
  const handleCod = async () => {
    if (!customerInfo.name || !customerInfo.phone || !customerInfo.address) {
      alert("Please fill all required fields");
      return;
    }
    try {
      setLoading(true);
      const amount = (selectedIds && selectedIds.length > 0) ? getSelectedTotal() : getCartTotal();
      const ts = Date.now();
      const orderId = `ORD${ts}`;
      const paymentId = `COD${ts}`;
      const API_BASE_URL =
        import.meta.env.VITE_API_URL?.replace("/api", "") ||
        "http://localhost:5000";
      
      const orderItems = getOrderItems(); // ✅ Use detailed items
      
      const payload = {
        orderId,
        paymentId,
        total: amount,
        items: orderItems, // ✅ Use detailed items
        customerName: customerInfo.name,
        customerEmail: customerInfo.email || "",
        customerPhone: customerInfo.phone || "",
        customerAddress: customerInfo.address || "",
        customerCity: customerInfo.city || "",
        customerPincode: customerInfo.pincode || "",
      };
      
      console.log("📦 COD Payload:", payload);
      
      const res = await fetch(`${API_BASE_URL}/api/orders`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      
      if (!res.ok) {
        const t = await res.text();
        throw new Error(`Failed to place COD order: ${res.status} - ${t}`);
      }
      
      const orderResult = await res.json();
      console.log("✅ COD Order created:", orderResult);
      
      const navData = { 
        paymentId, 
        orderId, 
        amount, 
        items: orderItems, // ✅ Use detailed items
        customerInfo 
      };
      
      // ✅ FIXED: Save data and navigate FIRST
      sessionStorage.setItem("orderSuccessData", JSON.stringify(navData));
      navigate("/order-success", { state: navData });
      
      // ✅ FIXED: Clear cart AFTER navigation
      setTimeout(() => {
        clearCart();
      }, 1000);
      
    } catch (err) {
      console.error("💥 COD order error:", err);
      alert(`COD order failed: ${err.message}`);
      setLoading(false);
    }
  };

  const handlePlaceOrder = async () => {
    if (paymentMethod === "cod") return handleCod();
    return handlePayment();
  };

  if (items.length === 0) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Customer Information Form */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              Billing Information
            </h2>

            <form className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={customerInfo.name}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={customerInfo.email}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Phone Number *
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={customerInfo.phone}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Address *
                </label>
                <textarea
                  name="address"
                  value={customerInfo.address}
                  onChange={handleInputChange}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    City
                  </label>
                  <input
                    type="text"
                    name="city"
                    value={customerInfo.city}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    PIN Code
                  </label>
                  <input
                    type="text"
                    name="pincode"
                    value={customerInfo.pincode}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>
              </div>
            </form>
          </div>

          {/* Order Summary */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              Order Summary
            </h2>

            <div className="space-y-4 mb-6">
              {((selectedIds && selectedIds.length > 0) ? items.filter(i => new Set(selectedIds).has(i.uid || i.id)) : items).map((item) => (
                <div
                  key={item.uid || item.id}
                  className="border border-gray-200 rounded-lg p-4"
                >
                  <div className="flex items-start space-x-4 mb-3">
                    <img
                      src={
                        item.image ||
                        "https://via.placeholder.com/64?text=No+Image"
                      }
                      alt={item.name}
                      className="w-16 h-16 object-cover rounded-md flex-shrink-0"
                      onError={(e) => {
                        e.target.src =
                          "https://via.placeholder.com/64?text=No+Image";
                      }}
                    />
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-gray-900 text-sm leading-tight mb-1">
                        {item.name}
                      </h3>
                      <p className="text-lg font-bold text-purple-600">
                        ₹
                        {(
                          (item.price || 0) * (item.quantity || 0)
                        ).toLocaleString()}
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div className="bg-gray-50 rounded-md p-2">
                      <span className="text-gray-600 font-medium">
                        Quantity:
                      </span>
                      <span className="ml-1 text-gray-900">
                        {item.quantity}
                      </span>
                    </div>

                    <div className="bg-gray-50 rounded-md p-2">
                      <span className="text-gray-600 font-medium">Price:</span>
                      <span className="ml-1 text-gray-900">
                        ₹{item.price?.toLocaleString()}
                      </span>
                    </div>

                    {item.selectedColor && (
                      <div className="bg-gray-50 rounded-md p-2">
                        <span className="text-gray-600 font-medium">
                          Color:
                        </span>
                        <span className="ml-1 text-gray-900">
                          {item.selectedColor}
                        </span>
                      </div>
                    )}

                    {item.selectedSize && (
                      <div className="bg-gray-50 rounded-md p-2">
                        <span className="text-gray-600 font-medium">Size:</span>
                        <span className="ml-1 text-gray-900">
                          {item.selectedSize}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>

            <div className="border-t pt-4">
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Payment Method
                </label>
                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={() => setPaymentMethod("online")}
                    className={`flex-1 px-4 py-2 rounded-lg border ${
                      paymentMethod === "online"
                        ? "border-purple-600 text-purple-700 bg-purple-50"
                        : "border-gray-300 text-gray-700"
                    } hover:border-purple-500`}
                  >
                    Online Payment (Razorpay)
                  </button>
                  <button
                    type="button"
                    onClick={() => setPaymentMethod("cod")}
                    className={`flex-1 px-4 py-2 rounded-lg border ${
                      paymentMethod === "cod"
                        ? "border-green-600 text-green-700 bg-green-50"
                        : "border-gray-300 text-gray-700"
                    } hover:border-green-500`}
                  >
                    Cash on Delivery (COD)
                  </button>
                </div>
                {paymentMethod === "cod" ? (
                  <p className="mt-2 text-sm text-green-700">
                    The order will be placed now. Payment will be collected at
                    the time of delivery.
                  </p>
                ) : (
                  <p className="mt-2 text-sm text-purple-700">
                    Secure online payment via Razorpay (Cards, UPI, Wallets).
                  </p>
                )}
              </div>

              <div className="space-y-3 mb-6">
                <div className="flex justify-between items-center">
                  <span className="text-lg font-semibold text-gray-900">
                    Subtotal:
                  </span>
                  <span className="text-lg font-bold text-gray-900">
                    ₹{((selectedIds && selectedIds.length > 0) ? getSelectedTotal() : getCartTotal()).toLocaleString()}
                  </span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-lg font-semibold text-gray-900">
                    Shipping:
                  </span>
                  <span className="text-lg font-bold text-green-600">Free</span>
                </div>

                <div className="flex justify-between items-center text-xl font-bold border-t pt-4">
                  <span className="text-gray-900">Total:</span>
                  <span className="text-purple-600">
                    ₹{((selectedIds && selectedIds.length > 0) ? getSelectedTotal() : getCartTotal()).toLocaleString()}
                  </span>
                </div>
              </div>

              <button
                onClick={handlePlaceOrder}
                disabled={loading}
                className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-4 px-6 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
              >
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2" aria-hidden="true"></div>
                    Processing...
                  </>
                ) : (
                  <>
                    <svg
                      className="w-5 h-5 mr-2"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                      />
                    </svg>
                    {paymentMethod === "cod"
                      ? "Place Order (COD)"
                      : "Pay with Razorpay"}
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
       <div className="mt-8 bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="p-6">
          <h3 className="text-xl font-bold text-gray-900 mb-6 text-center">
            Why Shop With L-Mart?
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Free Delivery */}
            <div className="text-center">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <svg
                  className="w-6 h-6 text-green-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>
              <h4 className="font-semibold text-gray-900 mb-2">
                Free Delivery
              </h4>
              <p className="text-sm text-gray-600">
                Always free shipping on all orders
              </p>
            </div>

            {/* Quality Assurance */}
            <div className="text-center">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <svg
                  className="w-6 h-6 text-blue-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                  />
                </svg>
              </div>
              <h4 className="font-semibold text-gray-900 mb-2">
                Quality Assurance
              </h4>
              <p className="text-sm text-gray-600">Premium quality products</p>
            </div>

            {/* Fast Delivery */}
            <div className="text-center">
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <svg
                  className="w-6 h-6 text-purple-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 10V3L4 14h7v7l9-11h-7z"
                  />
                </svg>
              </div>
              <h4 className="font-semibold text-gray-900 mb-2">
                Fast Delivery
              </h4>
              <p className="text-sm text-gray-600">
                2-3 business days delivery
              </p>
            </div>

            {/* Easy Returns */}
            <div className="text-center">
              <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <svg
                  className="w-6 h-6 text-orange-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                  />
                </svg>
              </div>
              <h4 className="font-semibold text-gray-900 mb-2">Easy Returns</h4>
              <p className="text-sm text-gray-600">2-day return policy</p>
            </div>
          </div>

          {/* Support Section */}
          <div className="mt-8 pt-6 border-t border-gray-200">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* 24/7 Support */}
              <div className="text-center md:text-left">
                <div className="flex items-center justify-center md:justify-start mb-3">
                  <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center mr-3">
                    <svg
                      className="w-5 h-5 text-red-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                      />
                    </svg>
                  </div>
                  <h4 className="font-semibold text-gray-900">24/7 Support</h4>
                </div>
                <p className="text-sm text-gray-600">
                  Call us anytime at{" "}
                  <span className="font-semibold text-gray-900">
                    98/04/1989
                  </span>
                </p>
              </div>

              {/* Genuine Products */}
              <div className="text-center md:text-left">
                <div className="flex items-center justify-center md:justify-start mb-3">
                  <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center mr-3">
                    <svg
                      className="w-5 h-5 text-indigo-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                      />
                    </svg>
                  </div>
                  <h4 className="font-semibold text-gray-900">
                    Genuine Products
                  </h4>
                </div>
                <p className="text-sm text-gray-600">
                  100% authentic items with warranty
                </p>
              </div>
            </div>
          </div>

          {/* Final CTA */}
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-500">
              Your trusted partner for all printing needs and office supplies
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;