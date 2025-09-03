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

      {/* Rest of your JSX remains the same */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className={`bg-white rounded-2xl shadow-2xl p-8 text-center transform transition-all duration-1000 ${
          animateSuccess ? 'scale-100 opacity-100' : 'scale-95 opacity-0'
        }`}>
          {/* Your existing success UI code */}
        </div>
      </div>
    </div>
  );
};

export default OrderSuccess;