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

  // Save to MongoDB via API
  const saveOrderToDatabase = async () => {
    try {
      console.log('🚀 Attempting to save order to database...');
      setSaveStatus('saving');
      
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
      
      console.log('📦 Order payload:', orderPayload);
      
      // Use environment variable or fallback to localhost
      const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';
      const API_URL = `${API_BASE_URL}/api/orders`;
      
      console.log('🌐 Using API URL:', API_URL);
      
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(orderPayload)
      });
      
      console.log('📨 Response status:', response.status);
      
      if (response.ok) {
        const result = await response.json();
        console.log('✅ Order saved to MongoDB successfully:', result);
        setSaveStatus('success');
        localStorage.removeItem('pendingOrder');
      } else {
        const errorText = await response.text();
        console.error('❌ Server error:', {
          status: response.status,
          errorText
        });
        setSaveStatus('error');
        
        // Fallback to localStorage
        const pendingOrder = {
          ...orderPayload,
          timestamp: new Date().toISOString(),
          status: 'pending_sync'
        };
        localStorage.setItem('pendingOrder', JSON.stringify(pendingOrder));
        console.log('📦 Order saved to localStorage for later sync');
      }
    } catch (error) {
      console.error('❌ Network error:', error);
      setSaveStatus('error');
      
      // Fallback to localStorage
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
      console.log('📦 Order saved to localStorage due to network error');
    }
  };

  useEffect(() => {
    console.log('🔄 OrderSuccess useEffect triggered');
    console.log('🔍 useEffect data check:', { paymentId, amount, items: items?.length, finalOrderId });
    
    // Redirect to home if no payment data
    if (!paymentId) {
      console.log('❌ No paymentId found, redirecting to home');
      navigate('/');
      return;
    }
    
    console.log('✅ PaymentId found, proceeding with order save');
    
    // Save order to database
    if (paymentId && amount && items && finalOrderId) {
      console.log('✅ All required data present, calling saveOrderToDatabase');
      saveOrderToDatabase();
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