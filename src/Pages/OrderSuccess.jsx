import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useOrder } from '../context/OrderContext';
import logo from '../assets/newlmart.png';

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
  
  // If no order data in state or sessionStorage, do NOT inject test data
  // This prevents saving placeholder orders like "Test User" in Admin Dashboard
  if (!orderData) {
    console.warn('⚠️ No order data found (state/sessionStorage empty). Skipping save and rendering info only.');
  }
  
  const { paymentId, orderId, amount, items, customerInfo } = orderData || {};
  // Determine payment mode from data or infer from paymentId
  const paymentMode = (orderData && orderData.paymentMode)
    || (paymentId ? (String(paymentId).startsWith('COD') ? 'Cash on Delivery' : 'Razorpay') : 'Razorpay');
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
    dataSource: orderData ? (location.state ? 'location.state' : 'sessionStorage') : 'test data'
  });
  
  // Use orderId from location state, fallback to generated one
  const finalOrderId = orderId || (paymentId ? `ORD${paymentId.slice(-6).toUpperCase()}` : null);

  // Generate printable invoice and trigger browser PDF save dialog
  const handleDownloadInvoice = () => {
    try {
      const invoiceId = finalOrderId || `INV-${Date.now()}`;
      const createdAt = new Date().toLocaleString('en-IN');
      const computedTotal = (amount ?? ((items || []).reduce((sum, it) => sum + ((it.price || 0) * (it.quantity || 0)), 0)));
      const rows = (items || []).map((it) => `
        <tr>
          <td style="padding:10px;border-bottom:1px solid #e5e7eb;">${it.name || 'Item'}</td>
          <td style="padding:10px;border-bottom:1px solid #e5e7eb;text-align:center;">${it.quantity || 1}</td>
          <td style="padding:10px;border-bottom:1px solid #e5e7eb;text-align:right;">₹${Number(it.price || 0).toFixed(2)}</td>
          <td style="padding:10px;border-bottom:1px solid #e5e7eb;text-align:right;">₹${((it.price || 0) * (it.quantity || 1)).toFixed(2)}</td>
        </tr>
      `).join('');

      const invoiceHtml = `<!doctype html>
      <html>
        <head>
          <meta charset="utf-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1" />
          <title>Invoice ${invoiceId}</title>
          <style>
            :root { --text:#111827; --muted:#6b7280; --light:#e5e7eb; --gray:#9ca3af; --dark:#374151; }
            body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Inter, Roboto, 'Helvetica Neue', Arial, sans-serif; color: var(--text); background:#ffffff; }
            .container { max-width: 800px; margin: 0 auto; padding: 24px 32px 40px; position: relative; }
            .top { display:flex; justify-content:space-between; align-items:flex-start; font-size:12px; color: var(--gray); }
            .big-title { font-weight:800; font-size:42px; letter-spacing:0.5px; margin:16px 0 8px; }
            .date { font-size:12px; color: var(--text); margin:6px 0 18px; }
            .cols { display:grid; grid-template-columns:1fr 1fr; gap:24px; margin:6px 0 18px; }
            .label { font-weight:700; font-size:12px; color: var(--text); margin-bottom:6px; }
            .muted { color: var(--muted); }
            table { width:100%; border-collapse: collapse; margin-top:8px; }
            thead th { background:#f3f4f6; color:#111827; font-weight:600; font-size:12px; padding:12px; text-align:left; border-bottom:1px solid var(--light); }
            tbody td { padding:12px; font-size:13px; border-bottom:1px solid var(--light); }
            tfoot td { padding:12px; font-size:13px; }
            .tfoot-row { border-top:2px solid var(--light); }
            .tfoot-label { text-align:right; font-weight:700; }
            .tfoot-value { text-align:right; font-weight:700; }
            .meta-line { margin-top:16px; font-size:13px; }
            .note { margin-top:6px; font-size:12px; color: var(--muted); }
            .waves { position:relative; margin-top:24px; height:140px; }
            .waves svg { width:100%; height:140px; }
            @page { margin: 16mm; }
            @media print { .no-print { display:none; } body { -webkit-print-color-adjust: exact; print-color-adjust: exact; } }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="top">
              <div style="display:flex;align-items:center;gap:8px;">
                <img src="${logo}" alt="Logo" style="height:28px;object-fit:contain;"/>
                <span style="font-size:12px;color:#6b7280;">Invoice ${invoiceId}</span>
              </div>
              <div>NO. ${invoiceId}</div>
            </div>

            <div class="big-title">INVOICE</div>
            <div class="date"><span style="font-weight:700">Date:</span> ${createdAt}</div>

            <div class="cols">
              <div>
                <div class="label">Billed to:</div>
                <div>${customerInfo?.name || 'Customer'}</div>
                ${customerInfo?.address ? `<div>${customerInfo.address}</div>` : ''}
                ${customerInfo?.city || customerInfo?.pincode ? `<div>${customerInfo?.city || ''} ${customerInfo?.pincode || ''}</div>` : ''}
                ${customerInfo?.email ? `<div class="muted">${customerInfo.email}</div>` : ''}
              </div>
              <div>
                <div class="label">From:</div>
                <div>L‑Mart</div>
                <div>#56 Industrial Estate, SINDAGI - 586128</div>
                <div class="muted">info@lmart.in</div>
              </div>
            </div>

            <table>
              <thead>
                <tr>
                  <th>Item</th>
                  <th style="text-align:center;">Quantity</th>
                  <th style="text-align:right;">Price</th>
                  <th style="text-align:right;">Amount</th>
                </tr>
              </thead>
              <tbody>
                ${rows}
              </tbody>
              <tfoot>
                <tr class="tfoot-row">
                  <td colspan="3" class="tfoot-label">Total</td>
                  <td class="tfoot-value">₹${Number(computedTotal).toFixed(2)}</td>
                </tr>
              </tfoot>
            </table>

            <div class="meta-line"><strong>Payment method:</strong> ${paymentMode || '—'}</div>
            <div class="note"><strong>Note:</strong> Thank you for choosing us!</div>

            <div class="no-print" style="margin-top:18px;">
              <button onclick="window.print()" style="background:#111827;color:#fff;border:none;padding:10px 16px;border-radius:8px;cursor:pointer;">Print / Save as PDF</button>
            </div>

            <div class="waves">
              <svg viewBox="0 0 800 160" preserveAspectRatio="none">
                <path d="M0,80 C200,140 600,20 800,90 L800,160 L0,160 Z" fill="#e5e7eb"></path>
                <path d="M0,110 C220,170 620,40 800,120 L800,160 L0,160 Z" fill="#4b5563"></path>
              </svg>
            </div>
          </div>
        </body>
      </html>`;

      const w = window.open('', '_blank');
      if (!w) {
        alert('Pop-up blocked. Please allow pop-ups to download invoice.');
        return;
      }
      w.document.open();
      w.document.write(invoiceHtml);
      w.document.close();
      w.onload = () => {
        w.focus();
        // Auto-open print dialog; button also available
        w.print();
      };
    } catch (err) {
      console.error('Invoice generation error:', err);
      alert('Invoice generate karte waqt error aaya.');
    }
  };
  
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
      setSaveStatus('saving');
      
      // Use environment variable or fallback to localhost
      const API_BASE_URL = import.meta.env.VITE_API_URL?.replace('/api', '') || 'http://localhost:5000';
      
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
        // Order doesn't exist. Only create fallback when we have real customer data
        const hasRealCustomer = !!(customerInfo && customerInfo.name && customerInfo.address);
        if (hasRealCustomer && !String(paymentId).startsWith('test_')) {
          console.log('⚠️ Order not found, creating fallback with real customer data...');
          await createFallbackOrder(API_BASE_URL);
        } else {
          console.warn('🚫 Skipping fallback order creation due to missing/placeholder data.');
          setSaveStatus('error');
          await savePendingOrderToLocalStorage();
        }
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
      console.error('❌ Error details:', error);
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
    
    // ✅ FIXED: Don't redirect immediately, show test data for debugging
    if (!paymentId) {
      console.log('❌ No paymentId found, but showing page with test data');
      // Don't redirect - let the component render with test data
    } else {
      console.log('✅ PaymentId found, proceeding with order save');
      
      // Check order status (should already exist from backend verification)
      if (paymentId && amount && items && finalOrderId) {
        console.log('✅ All required data present, calling checkOrderStatus');
        checkOrderStatus();
      } else {
        console.error('❌ Missing order data - Cannot save order');
        setSaveStatus('error');
      }
    }
    
    // Trigger success animation
    setTimeout(() => setAnimateSuccess(true), 300);
    setTimeout(() => setShowConfetti(false), 3000);
  }, [paymentId, navigate, amount, items, finalOrderId]);

  // ✅ FIXED: Always render the page, even without paymentId
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

      <div className="container-responsive">
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
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              {paymentId ? 'Payment Successful!' : 'Order Placed Successfully!'}
            </h1>
            <p className="text-lg text-gray-600">
              {paymentId 
                ? 'Thank you for your order. Your payment has been processed successfully.'
                : 'Thank you for your order. Your order has been placed successfully.'
              }
            </p>
            {!paymentId && (
              <p className="text-sm text-yellow-600 mt-2">
                Note: This is a test/demo order. In production, real payment data would be shown here.
              </p>
            )}
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
                {paymentId && (
                  <div className="flex justify-between items-center">
                    <span className="font-medium text-gray-700">Payment ID:</span>
                    <span className="text-gray-600 font-mono text-sm">{paymentId}</span>
                  </div>
                )}
                <div className="flex justify-between items-center">
                  <span className="font-medium text-gray-700">Payment Method:</span>
                  <span className="text-gray-600">{paymentMode}</span>
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
                    {customerInfo.email && (
                      <p><span className="font-medium text-gray-700">Email:</span> {customerInfo.email}</p>
                    )}
                    {customerInfo.phone && (
                      <p><span className="font-medium text-gray-700">Phone:</span> {customerInfo.phone}</p>
                    )}
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
              onClick={handleDownloadInvoice}
              className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-lg font-medium transition-colors duration-200 flex items-center justify-center"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v12m0 0l-3-3m3 3l3-3M4 20h16" />
              </svg>
              Download Invoice (PDF)
            </button>
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
              <li>• Order tracking details will be sent to your email</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderSuccess;