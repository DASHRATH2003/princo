import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useOrder } from '../context/OrderContext';

const OrderSuccess = () => {
  console.log('🎯 OrderSuccess component loaded!');
  
  const location = useLocation();
  const navigate = useNavigate();
  const { addOrder } = useOrder();
  
  console.log('🔍 Location state received:', location.state);
  
  // Try to get data from location.state first, then from sessionStorage
  let orderData = location.state;
  if (!orderData) {
    console.log('🔄 No location.state found, checking sessionStorage...');
    const sessionData = sessionStorage.getItem('orderSuccessData');
    if (sessionData) {
      try {
        orderData = JSON.parse(sessionData);
        console.log('✅ Retrieved data from sessionStorage:', orderData);
        // Clear sessionStorage after use
        sessionStorage.removeItem('orderSuccessData');
      } catch (error) {
        console.error('❌ Error parsing sessionStorage data:', error);
      }
    }
  }
  
  const { paymentId, orderId, amount, items, customerInfo } = orderData || {};
  const [showConfetti, setShowConfetti] = useState(true);
  const [animateSuccess, setAnimateSuccess] = useState(false);
  const [saveStatus, setSaveStatus] = useState('pending');
  
  // Debug: Log all received data
  console.log('🔍 OrderSuccess received data:', {
    paymentId,
    orderId,
    amount,
    items,
    customerInfo,
    locationState: location.state,
    dataSource: orderData ? (location.state ? 'location.state' : 'sessionStorage') : 'none'
  });
  
  // Use orderId from location state, fallback to generated one
  const finalOrderId = orderId || (paymentId ? `ORD${paymentId.slice(-6).toUpperCase()}` : null);
  
  // Additional debugging for missing data
  console.log('🔍 Data validation:', {
    hasPaymentId: !!paymentId,
    hasAmount: !!amount,
    hasItems: !!(items && items.length > 0),
    hasOrderId: !!finalOrderId,
    hasCustomerInfo: !!customerInfo,
  });

  // Check if order was already created by backend verification
  const checkOrderStatus = async () => {
    try {
      console.log('🔍 Checking if order was already created by backend verification...');
      console.log('🔍 Environment check:', {
        VITE_API_BASE_URL: import.meta.env.VITE_API_BASE_URL,
        NODE_ENV: import.meta.env.NODE_ENV,
        MODE: import.meta.env.MODE
      });
      setSaveStatus('saving');
      
      // Use environment variable or fallback to localhost
      const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';
      
      // First, try to find existing order by payment ID
      const checkOrderUrl = `${API_BASE_URL}/api/orders/payment/${paymentId}`;
      console.log('🌐 Checking order URL:', checkOrderUrl);
      
      const checkResponse = await fetch(checkOrderUrl, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        }
      });
      
      console.log('📨 Check response received!');
      console.log('📨 Response status:', checkResponse.status);
      console.log('📨 Response ok:', checkResponse.ok);
      
      if (checkResponse.ok) {
        // Order already exists from backend verification
        const existingOrder = await checkResponse.json();
        console.log('✅ Order already exists from backend verification:', existingOrder);
        setSaveStatus('success');
        localStorage.removeItem('pendingOrder');
      } else if (checkResponse.status === 404) {
        // Order doesn't exist, create it as fallback
        console.log('⚠️ Order not found, creating as fallback...');
        await createFallbackOrder(API_BASE_URL);
      } else {
        // Other error occurred
        const errorText = await checkResponse.text();
        console.error('❌ Server error checking order:', {
          status: checkResponse.status,
          errorText
        });
        setSaveStatus('error');
        await savePendingOrderToLocalStorage();
      }
    } catch (error) {
      console.error('❌ Network error occurred!');
      console.error('❌ Error type:', error.constructor.name);
      console.error('❌ Error message:', error.message);
      console.error('❌ Error stack:', error.stack);
      setSaveStatus('error');
      await savePendingOrderToLocalStorage();
    }
  };

  // Create fallback order if backend verification didn't create one
  const createFallbackOrder = async (API_BASE_URL) => {
    try {
      const orderPayload = {
        orderId: finalOrderId,
        paymentId,
        total: amount,
        items,
        customerName: customerInfo?.name || 'Anonymous User',
        customerEmail: customerInfo?.email || '',
        customerPhone: customerInfo?.phone || '',
        customerAddress: customerInfo?.address || '',
        customerCity: customerInfo?.city || '',
        customerPincode: customerInfo?.pincode || ''
      };
      
      console.log('📦 Creating fallback order:', JSON.stringify(orderPayload, null, 2));
      
      const response = await fetch(`${API_BASE_URL}/api/orders`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(orderPayload)
      });
      
      if (response.ok) {
        const result = await response.json();
        console.log('✅ Fallback order created successfully:', result);
        setSaveStatus('success');
        localStorage.removeItem('pendingOrder');
      } else {
        throw new Error(`Failed to create fallback order: ${response.status}`);
      }
    } catch (error) {
      console.error('❌ Error creating fallback order:', error);
      setSaveStatus('error');
      await savePendingOrderToLocalStorage();
    }
  };

  // Save order to localStorage for later sync
  const savePendingOrderToLocalStorage = async () => {
    const pendingOrder = {
      orderId: finalOrderId,
      paymentId,
      total: amount,
      items,
      customerName: customerInfo?.name || 'Anonymous User',
      customerEmail: customerInfo?.email || '',
      customerPhone: customerInfo?.phone || '',
      customerAddress: customerInfo?.address || '',
      customerCity: customerInfo?.city || '',
      customerPincode: customerInfo?.pincode || '',
      timestamp: new Date().toISOString(),
      status: 'pending_sync'
    };
    localStorage.setItem('pendingOrder', JSON.stringify(pendingOrder));
    console.log('📦 Order saved to localStorage for later sync');
  };

  useEffect(() => {
    console.log('🔄 OrderSuccess useEffect triggered');
    console.log('🔍 useEffect data check:', { paymentId, amount, items: items?.length, finalOrderId });
    console.log('🌐 Current URL:', window.location.href);
    console.log('🔍 SessionStorage check:', sessionStorage.getItem('orderSuccessData'));
    
    // Redirect to home if no payment data
    if (!paymentId) {
      console.log('❌ No paymentId found, redirecting to home');
      navigate('/');
      return;
    }
    
    console.log('✅ PaymentId found, proceeding with order save');
    
    // Check order status (should already exist from backend verification)
    if (paymentId && amount && items && finalOrderId) {
      console.log('✅ All required data present, calling checkOrderStatus');
      console.log('🔍 Data validation before API call:', {
        paymentId: paymentId,
        amount: amount,
        itemsCount: items?.length,
        finalOrderId: finalOrderId,
        customerInfo: customerInfo
      });
      checkOrderStatus();
    } else {
      console.error('❌ Missing order data - Cannot save order');
      console.error('Missing data details:', {
        hasPaymentId: !!paymentId,
        hasAmount: !!amount,
        hasItems: !!(items && items.length > 0),
        hasFinalOrderId: !!finalOrderId
      });
      setSaveStatus('error');
    }
    
    // Trigger success animation
    setTimeout(() => setAnimateSuccess(true), 300);
    setTimeout(() => setShowConfetti(false), 3000);
  }, [paymentId, navigate, amount, items, finalOrderId]);

  if (!paymentId) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-purple-50 py-12 relative overflow-hidden">
      {/* Status Indicator */}
      <div className="fixed top-4 right-4 z-50">
        {saveStatus === 'saving' && (
          <div className="bg-blue-100 text-blue-800 px-4 py-2 rounded-lg shadow-lg flex items-center">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-800 mr-2"></div>
            Saving to database...
          </div>
        )}
        {saveStatus === 'success' && (
          <div className="bg-green-100 text-green-800 px-4 py-2 rounded-lg shadow-lg flex items-center">
            ✅ Saved successfully
          </div>
        )}
        {saveStatus === 'error' && (
          <div className="bg-yellow-100 text-yellow-800 px-4 py-2 rounded-lg shadow-lg flex items-center">
            ⚠️ Saved offline (will sync later)
          </div>
        )}
      </div>

      {/* Confetti Animation */}
      {showConfetti && (
        <div className="fixed inset-0 pointer-events-none z-10">
          <div className="absolute top-1/4 left-1/4 animate-bounce">
            <div className="w-3 h-3 bg-yellow-400 rounded-full"></div>
          </div>
          <div className="absolute top-1/3 right-1/4 animate-bounce delay-100">
            <div className="w-2 h-2 bg-green-400 rounded-full"></div>
          </div>
          <div className="absolute top-1/2 left-1/3 animate-bounce delay-200">
            <div className="w-4 h-4 bg-blue-400 rounded-full"></div>
          </div>
          <div className="absolute top-2/3 right-1/3 animate-bounce delay-300">
            <div className="w-3 h-3 bg-purple-400 rounded-full"></div>
          </div>
        </div>
      )}

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className={`bg-white rounded-2xl shadow-2xl p-8 transform transition-all duration-1000 ${
          animateSuccess ? 'scale-100 opacity-100' : 'scale-95 opacity-0'
        }`}>
          {/* Success Header */}
          <div className="text-center mb-8">
            <div className="mx-auto w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-4">
              <svg className="w-10 h-10 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Payment Successful!</h1>
            <p className="text-lg text-gray-600">Thank you for your order. Your payment has been processed successfully.</p>
          </div>

          {/* Order Details Card */}
          <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-6 mb-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
              <svg className="w-5 h-5 mr-2 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              Order Details
            </h2>
            
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="font-medium text-gray-700">Order ID:</span>
                  <span className="text-blue-600 font-bold text-lg">{finalOrderId}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="font-medium text-gray-700">Payment ID:</span>
                  <span className="text-gray-600 font-mono text-sm">{paymentId}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="font-medium text-gray-700">Total Amount:</span>
                  <span className="text-green-600 font-bold text-xl">₹{amount}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="font-medium text-gray-700">Order Date:</span>
                  <span className="text-gray-600">{new Date().toLocaleDateString('en-IN')}</span>
                </div>
              </div>
              
              {customerInfo && (
                <div className="space-y-3">
                  <h3 className="font-semibold text-gray-800 border-b pb-1">Customer Information</h3>
                  <div className="space-y-2 text-sm">
                    <p><span className="font-medium text-gray-700">Name:</span> {customerInfo.name}</p>
                    <p><span className="font-medium text-gray-700">Email:</span> {customerInfo.email}</p>
                    <p><span className="font-medium text-gray-700">Phone:</span> {customerInfo.phone}</p>
                    {customerInfo.address && (
                      <p><span className="font-medium text-gray-700">Address:</span> {customerInfo.address}, {customerInfo.city} - {customerInfo.pincode}</p>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Order Items */}
          {items && items.length > 0 && (
            <div className="bg-gray-50 rounded-xl p-6 mb-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                <svg className="w-5 h-5 mr-2 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
                Order Items ({items.length})
              </h3>
              <div className="space-y-3">
                {items.map((item, index) => (
                  <div key={index} className="bg-white rounded-lg p-4 flex justify-between items-center shadow-sm">
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-800">{item.name || item.title || 'Product'}</h4>
                      <p className="text-sm text-gray-600">Quantity: {item.quantity || 1}</p>
                      {item.specifications && (
                        <p className="text-xs text-gray-500 mt-1">{item.specifications}</p>
                      )}
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-gray-800">₹{item.price || item.total || 0}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">

            <button
              onClick={() => navigate('/')}
              className="bg-gray-600 hover:bg-gray-700 text-white px-6 py-3 rounded-lg font-medium transition-colors duration-200 flex items-center justify-center"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
              Continue Shopping
            </button>
          </div>

          {/* Additional Information */}
          <div className="mt-8 p-4 bg-blue-50 rounded-lg">
            <h4 className="font-semibold text-blue-800 mb-2">What's Next?</h4>
            <ul className="text-sm text-blue-700 space-y-1">
              <li>• Your order will be processed within 24 hours</li>
              <li>• For any queries, contact our support team</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderSuccess;