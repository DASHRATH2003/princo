import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useOrder } from '../context/OrderContext';

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    totalCustomers: 0,
    totalOrders: 0,
    totalRevenue: 0,
    pendingOrders: 0
  });
  const [customers, setCustomers] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showOrderModal, setShowOrderModal] = useState(false);
  const [adminUser, setAdminUser] = useState(null);
  const navigate = useNavigate();
  const { getAllOrders } = useOrder();

  useEffect(() => {
    const token = localStorage.getItem('adminToken');
    if (!token) {
      navigate('/admin/login');
      return;
    }
    
    // Get admin user data from localStorage
    const userData = localStorage.getItem('adminUser');
    if (userData) {
      setAdminUser(JSON.parse(userData));
    }
    
    fetchDashboardData();
    
    // Auto-refresh every 5 seconds for live updates
    const interval = setInterval(() => {
      fetchDashboardData();
    }, 5000);
    
    return () => clearInterval(interval);
  }, [navigate]);

  const fetchDashboardData = async () => {
    try {
      // localStorage disabled - only fetch from MongoDB
      // const liveOrders = getAllOrders();
      
      // Fetch orders from MongoDB only
      let mongoOrders = [];
      try {
        const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';
        const response = await fetch(`${API_BASE_URL}/orders`);
        if (response.ok) {
          const data = await response.json();
          // Convert MongoDB orders to match frontend format
          mongoOrders = data.map(order => ({
            id: order.orderId,
            paymentId: order.paymentId,
            status: order.status.charAt(0).toUpperCase() + order.status.slice(1),
            orderDate: new Date(order.createdAt).toISOString().split('T')[0],
            createdAt: order.createdAt,
            items: order.items,
            total: order.total,
            amount: order.total,
            customerName: order.customerName || 'Guest Customer'
          }));
        }
      } catch (mongoError) {
        console.log('MongoDB orders not available:', mongoError);
      }
      
      // Use only MongoDB orders (localStorage disabled)
      const allOrders = mongoOrders;
      // const allOrders = [...liveOrders];
      // mongoOrders.forEach(mongoOrder => {
      //   const existingIndex = allOrders.findIndex(order => order.id === mongoOrder.id);
      //   if (existingIndex >= 0) {
      //     // Replace localStorage order with MongoDB data
      //     allOrders[existingIndex] = mongoOrder;
      //   } else {
      //     // Add new MongoDB order
      //     allOrders.push(mongoOrder);
      //   }
      // });
      
      // Calculate statistics from combined orders
      const totalOrders = allOrders.length;
      const totalRevenue = allOrders.reduce((sum, order) => sum + (order.total || order.amount || 0), 0);
      const pendingOrders = allOrders.filter(order => order.status === 'Processing' || order.status === 'pending').length;
      
      // Update stats with combined data
      setStats({
        totalCustomers: 0, // Keep existing or set to 0 for now
        totalOrders,
        totalRevenue,
        pendingOrders
      });
      
      // Set combined orders
      setOrders(allOrders);
      
      // Try to fetch backend data as well (if available)
      const token = localStorage.getItem('adminToken');
      if (token) {
        const headers = {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        };

        try {
          // Use environment variable for API URL
          const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';
          
          // Fetch customers from backend
          const customersResponse = await fetch(`${API_BASE_URL}/dashboard/customers`, { headers });
          if (customersResponse.ok) {
            const customersData = await customersResponse.json();
            setCustomers(customersData);
            setStats(prev => ({ ...prev, totalCustomers: customersData.length }));
          }
        } catch (backendError) {
          console.log('Backend not available, using live data only');
        }
      }
      
      setLoading(false);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      setLoading(false);
    }
  };

  const updateOrderStatus = async (orderId, newStatus) => {
    try {
      const token = localStorage.getItem('adminToken');
      const response = await fetch(`http://localhost:5000/api/dashboard/orders/${orderId}/status`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ status: newStatus })
      });

      if (response.ok) {
        fetchDashboardData(); // Refresh data
      }
    } catch (error) {
      console.error('Error updating order status:', error);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminUser');
    navigate('/admin/login');
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'processing': return 'bg-blue-100 text-blue-800';
      case 'shipped': return 'bg-purple-100 text-purple-800';
      case 'delivered': return 'bg-green-100 text-green-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const openOrderModal = (order) => {
    setSelectedOrder(order);
    setShowOrderModal(true);
  };

  const closeOrderModal = () => {
    setSelectedOrder(null);
    setShowOrderModal(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex">
      {/* Sidebar */}
      <div className="w-64 bg-white/90 backdrop-blur-md shadow-2xl border-r border-gray-200/50 flex flex-col">
        {/* Header */}
        <div className="p-6 border-b border-gray-200/50">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg shadow-lg">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <div>
              <h1 className="text-lg font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">Dashboard</h1>
            </div>
          </div>
        </div>

        {/* User Info */}
        <div className="p-4 border-b border-gray-200/50">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 truncate">
                {adminUser?.name || 'Admin User'}
              </p>
              <p className="text-xs text-gray-500 truncate">
                {adminUser?.email || 'admin@printo.com'}
              </p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <div className="flex-1 p-4">
          <nav className="space-y-2">
            {[
              { key: 'overview', label: 'Overview', icon: 'M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z' },
              { key: 'customers', label: 'Customers', icon: 'M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z' },
              { key: 'orders', label: 'Orders', icon: 'M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z' }
            ].map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl font-medium text-sm transition-all duration-300 ${
                  activeTab === tab.key
                    ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg transform scale-105'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100/50'
                }`}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={tab.icon} />
                </svg>
                <span>{tab.label}</span>
              </button>
            ))}
          </nav>
        </div>

        {/* Logout Button */}
        <div className="p-4 border-t border-gray-200/50">
          <button
            onClick={handleLogout}
            className="w-full bg-gradient-to-r from-red-500 to-red-600 text-white px-4 py-3 rounded-xl hover:from-red-600 hover:to-red-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 flex items-center justify-center space-x-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            <span>Logout</span>
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-8">

        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div className="space-y-8">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl shadow-xl p-6 border border-blue-200/50 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-semibold text-blue-600 uppercase tracking-wide">Total Customers</p>
                    <p className="text-3xl font-bold text-blue-900 mt-2">{stats.totalCustomers}</p>
                    <div className="flex items-center mt-2">
                      <div className="w-2 h-2 bg-green-400 rounded-full mr-2"></div>
                      <span className="text-xs text-blue-600">Active Users</span>
                    </div>
                  </div>
                  <div className="p-4 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl shadow-lg">
                    <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                    </svg>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-br from-emerald-50 to-emerald-100 rounded-2xl shadow-xl p-6 border border-emerald-200/50 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-semibold text-emerald-600 uppercase tracking-wide">Total Orders</p>
                    <p className="text-3xl font-bold text-emerald-900 mt-2">{stats.totalOrders}</p>
                    <div className="flex items-center mt-2">
                      <div className="w-2 h-2 bg-green-400 rounded-full mr-2"></div>
                      <span className="text-xs text-emerald-600">All Time</span>
                    </div>
                  </div>
                  <div className="p-4 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-2xl shadow-lg">
                    <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                    </svg>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-2xl shadow-xl p-6 border border-purple-200/50 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-semibold text-purple-600 uppercase tracking-wide">Total Revenue</p>
                    <p className="text-3xl font-bold text-purple-900 mt-2">₹{stats.totalRevenue}</p>
                    <div className="flex items-center mt-2">
                      <div className="w-2 h-2 bg-green-400 rounded-full mr-2"></div>
                      <span className="text-xs text-purple-600">This Month</span>
                    </div>
                  </div>
                  <div className="p-4 bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl shadow-lg">
                    <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                    </svg>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-br from-amber-50 to-amber-100 rounded-2xl shadow-xl p-6 border border-amber-200/50 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-semibold text-amber-600 uppercase tracking-wide">Pending Orders</p>
                    <p className="text-3xl font-bold text-amber-900 mt-2">{stats.pendingOrders}</p>
                    <div className="flex items-center mt-2">
                      <div className="w-2 h-2 bg-yellow-400 rounded-full mr-2"></div>
                      <span className="text-xs text-amber-600">Needs Action</span>
                    </div>
                  </div>
                  <div className="p-4 bg-gradient-to-br from-amber-500 to-amber-600 rounded-2xl shadow-lg">
                    <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                </div>
              </div>
            </div>

            {/* Recent Orders */}
            <div className="bg-white/70 backdrop-blur-sm rounded-2xl shadow-xl border border-gray-200/50">
              <div className="px-8 py-6 border-b border-gray-200/50">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-xl">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">Recent Orders</h3>
                </div>
              </div>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200/50">
                  <thead className="bg-gradient-to-r from-gray-50 to-gray-100">
                    <tr>
                      <th className="px-8 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Customer Info</th>
                      <th className="px-8 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Items & Amount</th>
                      <th className="px-8 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Payment Date</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white/50 divide-y divide-gray-200/30">
                    {orders.slice(0, 5).map((order, index) => (
                      <tr key={order.id} className="hover:bg-gradient-to-r hover:from-blue-50/50 hover:to-purple-50/50 transition-all duration-200">
                        <td className="px-8 py-6 whitespace-nowrap text-sm">
                          <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
                              {order.customerName?.charAt(0) || 'U'}
                            </div>
                            <div>
                              <div className="font-semibold text-gray-900">{order.customerName}</div>
                              <div className="text-xs text-gray-500">{order.customerEmail}</div>
                              <div className="text-xs text-gray-500">{order.customerPhone}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-8 py-6 whitespace-nowrap text-sm">
                          <div>
                            <div className="font-bold text-lg text-green-600">₹{order.total}</div>
                            <div className="text-xs text-gray-500 flex items-center mt-1">
                              <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                              </svg>
                              {order.items?.length || 0} items
                            </div>
                          </div>
                        </td>
                        <td className="px-8 py-6 whitespace-nowrap text-sm">
                          <div>
                            <div className="text-gray-700 font-medium">{order.paymentDate ? new Date(order.paymentDate).toLocaleDateString() : new Date(order.createdAt).toLocaleDateString()}</div>
                            <button
                              onClick={() => openOrderModal(order)}
                              className="mt-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white px-4 py-2 rounded-lg text-xs font-medium hover:from-blue-600 hover:to-purple-700 transition-all duration-200 shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
                            >
                              View Details
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Customers Tab */}
        {activeTab === 'customers' && (
          <div className="bg-white/70 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20">
            <div className="px-8 py-6 border-b border-gray-200/30">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-gradient-to-br from-green-400 to-blue-500 rounded-lg flex items-center justify-center">
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">All Customers</h3>
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200/30">
                <thead className="bg-gradient-to-r from-green-50 to-blue-50">
                  <tr>
                    <th className="px-8 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Name</th>
                    <th className="px-8 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Email</th>
                    <th className="px-8 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Orders</th>
                    <th className="px-8 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Total Spent</th>
                    <th className="px-8 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Joined</th>
                  </tr>
                </thead>
                <tbody className="bg-white/50 divide-y divide-gray-200/30">
                  {customers.map((customer, index) => (
                    <tr key={customer.id} className="hover:bg-gradient-to-r hover:from-green-50/50 hover:to-blue-50/50 transition-all duration-200">
                      <td className="px-8 py-6 whitespace-nowrap text-sm">
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 bg-gradient-to-br from-green-400 to-blue-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
                            {customer.name?.charAt(0) || 'U'}
                          </div>
                          <div className="font-semibold text-gray-900">{customer.name}</div>
                        </div>
                      </td>
                      <td className="px-8 py-6 whitespace-nowrap text-sm text-gray-700 font-medium">{customer.email}</td>
                      <td className="px-8 py-6 whitespace-nowrap text-sm">
                        <span className="bg-gradient-to-r from-blue-100 to-purple-100 text-blue-800 px-3 py-1 rounded-full text-xs font-semibold">
                          {customer.orderCount} orders
                        </span>
                      </td>
                      <td className="px-8 py-6 whitespace-nowrap text-sm font-bold text-green-600 text-lg">₹{customer.totalSpent}</td>
                      <td className="px-8 py-6 whitespace-nowrap text-sm text-gray-600 font-medium">{new Date(customer.createdAt).toLocaleDateString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Orders Tab */}
        {activeTab === 'orders' && (
          <div className="bg-white/70 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20">
            <div className="px-8 py-6 border-b border-gray-200/30">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-gradient-to-br from-purple-400 to-pink-500 rounded-lg flex items-center justify-center">
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">All Orders</h3>
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200/30">
                <thead className="bg-gradient-to-r from-purple-50 to-pink-50">
                  <tr>
                    <th className="px-8 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Customer Details</th>
                    <th className="px-8 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Contact Info</th>
                    <th className="px-8 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Address</th>
                    <th className="px-8 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Items</th>
                    <th className="px-8 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Amount</th>
                    <th className="px-8 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Payment Date</th>
                    <th className="px-8 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white/50 divide-y divide-gray-200/30">
                  {orders.map((order, index) => (
                    <tr key={order.id} className="hover:bg-gradient-to-r hover:from-purple-50/50 hover:to-pink-50/50 transition-all duration-200">
                      <td className="px-8 py-6 whitespace-nowrap text-sm">
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 bg-gradient-to-br from-purple-400 to-pink-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
                            {order.customerName?.charAt(0) || 'U'}
                          </div>
                          <div className="font-semibold text-gray-900">{order.customerName}</div>
                        </div>
                      </td>
                      <td className="px-8 py-6 whitespace-nowrap text-sm">
                        <div>
                          {order.customerEmail && <div className="text-xs text-gray-600 font-medium">{order.customerEmail}</div>}
                          {order.customerPhone && <div className="text-xs text-gray-600 font-medium">{order.customerPhone}</div>}
                        </div>
                      </td>
                      <td className="px-8 py-6 whitespace-nowrap text-sm">
                        <div className="text-xs text-gray-600">
                          {order.customerAddress && <div className="font-medium">{order.customerAddress}</div>}
                          {order.customerCity && <div className="font-medium">{order.customerCity}</div>}
                          {order.customerPincode && <div className="font-medium">PIN: {order.customerPincode}</div>}
                        </div>
                      </td>
                      <td className="px-8 py-6 whitespace-nowrap text-sm">
                        <div>
                          <div className="font-semibold text-gray-900">{order.items?.length || 0} items</div>
                          <div className="text-xs text-gray-500 mt-1">
                            {order.items?.map(item => item.name).join(', ')}
                          </div>
                        </div>
                      </td>
                      <td className="px-8 py-6 whitespace-nowrap text-sm font-bold text-green-600 text-lg">₹{order.total}</td>
                      <td className="px-8 py-6 whitespace-nowrap text-sm text-gray-600 font-medium">
                        {order.paymentDate ? new Date(order.paymentDate).toLocaleDateString() : new Date(order.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-8 py-6 whitespace-nowrap text-sm font-medium">
                        <button
                          onClick={() => openOrderModal(order)}
                          className="bg-gradient-to-r from-purple-500 to-pink-600 text-white px-4 py-2 rounded-lg text-xs font-medium hover:from-purple-600 hover:to-pink-700 transition-all duration-200 shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
                        >
                          View Details
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* Order Details Modal */}
      {showOrderModal && selectedOrder && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-8 w-11/12 md:w-3/4 lg:w-1/2 shadow-2xl rounded-2xl bg-white/90 backdrop-blur-md border border-white/20">
            <div className="mt-3">
              <div className="flex justify-between items-center mb-6">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>
                  <h3 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">Order Details</h3>
                </div>
                <button
                  onClick={closeOrderModal}
                  className="text-gray-400 hover:text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-full p-2 transition-all duration-200"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-gradient-to-br from-blue-50 to-purple-50 p-6 rounded-xl border border-blue-200/30">
                    <div className="flex items-center space-x-2 mb-4">
                      <div className="w-6 h-6 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                        <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                      </div>
                      <h4 className="font-bold text-gray-800">Order Information</h4>
                    </div>
                    <div className="space-y-3">
                      <p className="text-sm"><span className="font-semibold text-gray-700">Order ID:</span> <span className="text-blue-600 font-medium">#{selectedOrder.id}</span></p>
                      <p className="text-sm"><span className="font-semibold text-gray-700">Payment ID:</span> <span className="text-gray-600">{selectedOrder.paymentId}</span></p>
                      <p className="text-sm"><span className="font-semibold text-gray-700">Status:</span> 
                        <span className={`ml-2 inline-flex px-3 py-1 text-xs font-semibold rounded-full ${getStatusColor(selectedOrder.status)}`}>
                          {selectedOrder.status}
                        </span>
                      </p>
                      <p className="text-sm"><span className="font-semibold text-gray-700">Total Amount:</span> <span className="text-green-600 font-bold text-lg">₹{selectedOrder.total}</span></p>
                      <p className="text-sm"><span className="font-semibold text-gray-700">Order Date:</span> <span className="text-gray-600">{selectedOrder.paymentDate ? new Date(selectedOrder.paymentDate).toLocaleDateString() : new Date(selectedOrder.createdAt).toLocaleDateString()}</span></p>
                    </div>
                  </div>
                  
                  <div className="bg-gradient-to-br from-green-50 to-blue-50 p-6 rounded-xl border border-green-200/30">
                    <div className="flex items-center space-x-2 mb-4">
                      <div className="w-6 h-6 bg-gradient-to-br from-green-500 to-blue-600 rounded-lg flex items-center justify-center">
                        <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                      </div>
                      <h4 className="font-bold text-gray-800">Customer Information</h4>
                    </div>
                    <div className="space-y-3">
                      <p className="text-sm"><span className="font-semibold text-gray-700">Name:</span> <span className="text-gray-800 font-medium">{selectedOrder.customerName}</span></p>
                      {selectedOrder.customerEmail && <p className="text-sm"><span className="font-semibold text-gray-700">Email:</span> <span className="text-gray-600">{selectedOrder.customerEmail}</span></p>}
                      {selectedOrder.customerPhone && <p className="text-sm"><span className="font-semibold text-gray-700">Phone:</span> <span className="text-gray-600">{selectedOrder.customerPhone}</span></p>}
                      {selectedOrder.customerAddress && (
                        <div>
                          <p className="font-semibold text-gray-700 text-sm mb-1">Address:</p>
                          <div className="bg-white/60 p-3 rounded-lg text-sm text-gray-700">
                            <p>{selectedOrder.customerAddress}</p>
                            <p>{selectedOrder.customerCity}</p>
                            <p className="font-medium">PIN: {selectedOrder.customerPincode}</p>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                
                <div className="bg-gradient-to-br from-orange-50 to-red-50 p-6 rounded-xl border border-orange-200/30">
                  <div className="flex items-center space-x-2 mb-4">
                    <div className="w-6 h-6 bg-gradient-to-br from-orange-500 to-red-600 rounded-lg flex items-center justify-center">
                      <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                      </svg>
                    </div>
                    <h4 className="font-bold text-gray-800">Order Items</h4>
                  </div>
                  <div className="bg-white/60 rounded-xl overflow-hidden border border-orange-200/30">
                    <table className="min-w-full divide-y divide-gray-200/30">
                      <thead className="bg-gradient-to-r from-orange-100 to-red-100">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-bold text-gray-700 uppercase">Item</th>
                          <th className="px-6 py-3 text-left text-xs font-bold text-gray-700 uppercase">Quantity</th>
                          <th className="px-6 py-3 text-left text-xs font-bold text-gray-700 uppercase">Price</th>
                          <th className="px-6 py-3 text-left text-xs font-bold text-gray-700 uppercase">Total</th>
                        </tr>
                      </thead>
                      <tbody className="bg-white/50 divide-y divide-gray-200/30">
                        {selectedOrder.items?.map((item, index) => (
                          <tr key={index} className="hover:bg-orange-50/50 transition-all duration-200">
                            <td className="px-6 py-4 text-sm font-semibold text-gray-900">{item.name}</td>
                            <td className="px-6 py-4 text-sm text-gray-700">
                              <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs font-medium">
                                {item.quantity}
                              </span>
                            </td>
                            <td className="px-6 py-4 text-sm font-medium text-gray-700">₹{item.price}</td>
                            <td className="px-6 py-4 text-sm font-bold text-green-600">₹{item.price * item.quantity}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
              
              <div className="mt-8 flex justify-end">
                <button
                  onClick={closeOrderModal}
                  className="bg-gradient-to-r from-gray-500 to-gray-600 text-white px-6 py-3 rounded-xl hover:from-gray-600 hover:to-gray-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 font-medium"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;