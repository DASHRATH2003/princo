import React, { useState, useEffect } from 'react';
import { useCart } from '../context/CartContext';
import { useNavigate } from 'react-router-dom';

const Checkout = () => {
  const { items, getCartTotal, clearCart } = useCart();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('online');
  const [customerInfo, setCustomerInfo] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    pincode: ''
  });

  // Redirect if cart is empty
  useEffect(() => {
    if (items.length === 0) {
      navigate('/cart');
    }
  }, [items, navigate]);

  const handleInputChange = (e) => {
    setCustomerInfo({
      ...customerInfo,
      [e.target.name]: e.target.value
    });
  };

  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const handlePayment = async () => {
    // Validate customer info
    if (!customerInfo.name || !customerInfo.email || !customerInfo.phone || !customerInfo.address) {
      alert('Please fill all required fields');
      return;
    }

    setLoading(true);

    try {
      // Load Razorpay script
      const scriptLoaded = await loadRazorpayScript();
      if (!scriptLoaded) {
        alert('Razorpay SDK failed to load. Please check your internet connection.');
        setLoading(false);
        return;
      }

      const amount = getCartTotal();
      
      // Create payment order through backend
      const API_BASE_URL = import.meta.env.VITE_API_URL?.replace('/api', '') || 'http://localhost:5000';
      console.log('🚀 Making API call to:', `${API_BASE_URL}/api/payment/create-order`);
      console.log('📦 Request data:', {
        amount: amount,
        currency: 'INR',
        receipt: `receipt_${Date.now()}`,
        customerInfo: customerInfo,
        items: items
      });
      
      const orderResponse = await fetch(`${API_BASE_URL}/api/payment/create-order`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount: amount,
          currency: 'INR',
          receipt: `receipt_${Date.now()}`,
          customerInfo: customerInfo,
          items: items
        })
      });

      console.log('📡 Response status:', orderResponse.status);
      console.log('📡 Response ok:', orderResponse.ok);
      
      if (!orderResponse.ok) {
        const errorText = await orderResponse.text();
        console.error('❌ Error response:', errorText);
        throw new Error(`Failed to create payment order: ${orderResponse.status} - ${errorText}`);
      }

      const orderData = await orderResponse.json();
      console.log('🎯 Payment order created:', orderData);
      
      // Razorpay options with backend order
      const options = {
        key: orderData.key, // Razorpay key from backend
        amount: orderData.order.amount, // Amount in paise from backend
        currency: orderData.order.currency,
        name: 'PrintCo',
        description: 'Printing Services Payment',
        image: '/logo.png',
        order_id: orderData.order.id, // Order ID from backend
        handler: async function (response) {
          // Payment successful - verify through backend
          console.log('🎉 Payment successful:', response);
          
          try {
            // Verify payment through backend
            const verifyResponse = await fetch(`${API_BASE_URL}/api/payment/verify`, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
                customerInfo: customerInfo,
                items: items,
                amount: amount
              })
            });

            if (!verifyResponse.ok) {
              throw new Error('Payment verification failed');
            }

            const verifyData = await verifyResponse.json();
            console.log('✅ Payment verified:', verifyData);
            
            // Prepare navigation data
            const navigationData = {
              paymentId: response.razorpay_payment_id,
              orderId: verifyData.orderId,
              amount: amount,
              items: items,
              customerInfo: customerInfo
            };
            
            console.log('🚀 Navigating to OrderSuccess with data:', navigationData);
            
            // Clear cart AFTER preparing data
            clearCart();
            
            // Navigate within SPA and pass state (keeps same origin for sessionStorage)
            sessionStorage.setItem('orderSuccessData', JSON.stringify(navigationData));
            navigate('/order-success', { state: navigationData });
            
          } catch (verifyError) {
            console.error('Payment verification error:', verifyError);
            alert('Payment verification failed. Please contact support.');
          }
        },
        prefill: {
          name: customerInfo.name,
          email: customerInfo.email,
          contact: customerInfo.phone
        },
        notes: {
          address: customerInfo.address,
          city: customerInfo.city,
          pincode: customerInfo.pincode
        },
        theme: {
          color: '#7C3AED'
        },
        modal: {
          ondismiss: function() {
            setLoading(false);
          }
        }
      };

      const razorpay = new window.Razorpay(options);
      razorpay.open();
      
    } catch (error) {
      console.error('💥 Payment error details:', {
        message: error.message,
        stack: error.stack,
        name: error.name
      });
      alert(`Payment failed: ${error.message}. Please try again.`);
      setLoading(false);
    }
  };

  // Cash on Delivery flow
  const handleCod = async () => {
    if (!customerInfo.name || !customerInfo.phone || !customerInfo.address) {
      alert('Please fill all required fields');
      return;
    }
    try {
      setLoading(true);
      const amount = getCartTotal();
      const ts = Date.now();
      const orderId = `ORD${ts}`;
      const paymentId = `COD${ts}`;
      const API_BASE_URL = import.meta.env.VITE_API_URL?.replace('/api', '') || 'http://localhost:5000';
      const payload = {
        orderId,
        paymentId,
        total: amount,
        items,
        customerName: customerInfo.name,
        customerEmail: customerInfo.email || '',
        customerPhone: customerInfo.phone || '',
        customerAddress: customerInfo.address || '',
        customerCity: customerInfo.city || '',
        customerPincode: customerInfo.pincode || ''
      };
      const res = await fetch(`${API_BASE_URL}/api/orders`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      if (!res.ok) {
        const t = await res.text();
        throw new Error(`Failed to place COD order: ${res.status} - ${t}`);
      }
      const navData = { paymentId, orderId, amount, items, customerInfo };
      clearCart();
      // Navigate within SPA and pass state so OrderSuccess reads it reliably
      sessionStorage.setItem('orderSuccessData', JSON.stringify(navData));
      navigate('/order-success', { state: navData });
    } catch (err) {
      console.error('💥 COD order error:', err);
      alert(`COD order failed: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handlePlaceOrder = async () => {
    if (paymentMethod === 'cod') return handleCod();
    return handlePayment();
  };

  if (items.length === 0) {
    return null; // Will redirect via useEffect
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Customer Information Form */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Billing Information</h2>
            
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
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Order Summary</h2>
            
            <div className="space-y-4 mb-6">
              {items.map((item) => (
                <div key={item.id} className="flex items-center space-x-4 p-4 border border-gray-200 rounded-lg">
                  <img
                    src={item.image || 'https://via.placeholder.com/64?text=No+Image'}
                    alt={item.name}
                    className="w-16 h-16 object-cover rounded-md"
                    onError={(e) => {
                      console.log('Checkout image failed to load:', item.name, 'Image URL:', item.image);
                      e.target.src = 'https://via.placeholder.com/64?text=No+Image';
                    }}
                  />
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900">{item.name}</h3>
                    <p className="text-sm text-gray-600">Quantity: {item.quantity}</p>
                    <p className="text-lg font-bold text-purple-600">₹{((item.price || 0) * (item.quantity || 0)).toLocaleString()}</p>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="border-t pt-4">
              {/* Payment Method */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">Payment Method</label>
                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('online')}
                    className={`flex-1 px-4 py-2 rounded-lg border ${paymentMethod === 'online' ? 'border-purple-600 text-purple-700 bg-purple-50' : 'border-gray-300 text-gray-700'} hover:border-purple-500`}
                  >
                    Online Payment (Razorpay)
                  </button>
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('cod')}
                    className={`flex-1 px-4 py-2 rounded-lg border ${paymentMethod === 'cod' ? 'border-green-600 text-green-700 bg-green-50' : 'border-gray-300 text-gray-700'} hover:border-green-500`}
                  >
                    Cash on Delivery (COD)
                  </button>
                </div>
                {paymentMethod === 'cod' ? (
                  <p className="mt-2 text-sm text-green-700">Order abhi place hoga. Payment delivery ke waqt collect hoga.</p>
                ) : (
                  <p className="mt-2 text-sm text-purple-700">Secure online payment via Razorpay (Cards, UPI, Wallets).</p>
                )}
              </div>
              <div className="flex justify-between items-center mb-4">
                <span className="text-lg font-semibold text-gray-900">Subtotal:</span>
                <span className="text-lg font-bold text-gray-900">₹{getCartTotal().toLocaleString()}</span>
              </div>
              
              <div className="flex justify-between items-center mb-4">
                <span className="text-lg font-semibold text-gray-900">Shipping:</span>
                <span className="text-lg font-bold text-green-600">Free</span>
              </div>
              
              <div className="flex justify-between items-center mb-6 text-xl font-bold border-t pt-4">
                <span className="text-gray-900">Total:</span>
                <span className="text-purple-600">₹{getCartTotal().toLocaleString()}</span>
              </div>
              
              <button
                onClick={handlePlaceOrder}
                disabled={loading}
                className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-4 px-6 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
              >
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                    Processing...
                  </>
                ) : (
                  <>
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                    {paymentMethod === 'cod' ? 'Place Order (COD)' : 'Pay with Razorpay'}
                  </>
                )}
              </button>
              
              <div className="mt-4 text-center">
                {paymentMethod === 'online' ? (
                  <p className="text-sm text-gray-500">Secure payment powered by Razorpay</p>
                ) : (
                  <p className="text-sm text-gray-500">COD available: Payment on delivery.</p>
                )}
                <div className="flex justify-center items-center mt-2 space-x-4">
                  {paymentMethod === 'online' ? (
                    <>
                      <span className="text-xs text-gray-400">We accept:</span>
                      <div className="flex space-x-2">
                        <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">Cards</span>
                        <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">UPI</span>
                        <span className="text-xs bg-purple-100 text-purple-800 px-2 py-1 rounded">Wallets</span>
                        <span className="text-xs bg-orange-100 text-orange-800 px-2 py-1 rounded">Net Banking</span>
                      </div>
                    </>
                  ) : (
                    <span className="text-xs text-gray-400">Pay on delivery</span>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;