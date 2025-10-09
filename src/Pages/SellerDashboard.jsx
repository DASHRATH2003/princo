import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getCurrentUser, logoutUser } from '../services/authService';
import SellerAddProductModal from '../components/SellerAddProductModal';
import SellerEditProductModal from '../components/SellerEditProductModal';
import { deleteProduct } from '../services/productService';
import sellerService from '../services/sellerService';
import { getSubcategoriesByCategory } from '../services/subcategoryService';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const SellerDashboard = () => {
  const user = getCurrentUser();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isProductsMenuOpen, setIsProductsMenuOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');
  const [stats, setStats] = useState({
    totalProducts: 0,
    totalOrders: 0,
    totalRevenue: 0,
    pendingOrders: 0
  });
  const [orders, setOrders] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddProductModal, setShowAddProductModal] = useState(false);
  const [showEditProductModal, setShowEditProductModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showOrderModal, setShowOrderModal] = useState(false);
  const [statusUpdate, setStatusUpdate] = useState('pending');

  // Files state
  const [files, setFiles] = useState([]);
  const [filesLoading, setFilesLoading] = useState(false);
  const [selectedUploadFile, setSelectedUploadFile] = useState(null);
  const [fileDescription, setFileDescription] = useState('');
  const [fileIsPublic, setFileIsPublic] = useState(false);

  // Manage Category/Subcategories state
  const [selectedCategory, setSelectedCategory] = useState('printing');
  const [subcategories, setSubcategories] = useState([]);
  const [subsLoading, setSubsLoading] = useState(false);

  if (!user || user.role !== 'seller') {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="bg-yellow-50 border border-yellow-200 text-yellow-700 px-4 py-3 rounded-lg">Access denied. Seller role required.</div>
      </div>
    );
  }

  useEffect(() => {
    fetchSellerData();
  }, []);

 const fetchSellerData = async () => {
  try {
    // Fetch seller products using sellerService
    const productsResponse = await sellerService.getSellerProducts({ limit: 100 });
    const sellerProducts = productsResponse?.data || [];
    setProducts(sellerProducts);

    // Fetch seller orders
    const ordersResponse = await sellerService.getSellerOrders({ limit: 100 });
    const sellerOrders = (ordersResponse?.data || []).map(o => ({
      id: o._id,
      orderId: o.orderId || o._id,
      customerName: o.customerName || 'Customer',
      customerEmail: o.customerEmail || '',
      customerPhone: o.customerPhone || '',
      customerAddress: o.customerAddress || '',
      customerCity: o.customerCity || '',
      customerPincode: o.customerPincode || '',
      total: o.total || 0,
      items: o.items || [],
      status: o.status || 'pending',
      createdAt: o.createdAt || new Date().toISOString()
    }));
    setOrders(sellerOrders);

    // Compute stats
    const totalOrders = sellerOrders.length;
    const totalRevenue = sellerOrders.reduce((sum, o) => sum + (Number(o.total) || 0), 0);
    const pendingOrders = sellerOrders.filter(o => (o.status || '').toLowerCase() === 'pending').length;

    setStats({
      totalProducts: sellerProducts.length,
      totalOrders,
      totalRevenue,
      pendingOrders
    });

    setLoading(false);
  } catch (error) {
    console.error('Error fetching seller data:', error);
    setLoading(false);
  }
};

  const logout = () => {
    logoutUser();
    navigate('/');
  };

  const handleProductAdded = () => {
    setShowAddProductModal(false);
    fetchSellerData(); // Refresh data
  };

  const handleEditProduct = (product) => {
    setEditingProduct(product);
    setShowEditProductModal(true);
  };

  const handleProductUpdated = () => {
    setShowEditProductModal(false);
    setEditingProduct(null);
    fetchSellerData(); // Refresh data
  };

  const handleDeleteProduct = async (productId) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        await deleteProduct(productId);
        fetchSellerData(); // Refresh data
        alert('Product deleted successfully!');
      } catch (error) {
        console.error('Error deleting product:', error);
        alert('Error deleting product. Please try again.');
      }
    }
  };

  const getStatusColor = (status) => {
    const s = (status || '').toLowerCase();
    switch (s) {
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
    setStatusUpdate((order.status || 'pending').toLowerCase());
    setShowOrderModal(true);
  };

  const closeOrderModal = () => {
    setSelectedOrder(null);
    setShowOrderModal(false);
  };

  const updateOrderStatus = async (orderId, newStatus) => {
    try {
      await sellerService.updateSellerOrderStatus(orderId, newStatus);
      alert('Order status updated successfully!');
      setSelectedOrder(prev => ({ ...prev, status: newStatus }));
      fetchSellerData(); // Refresh data
    } catch (error) {
      console.error('Error updating order status:', error);
      alert('Error updating order status');
    }
  };

  // Helpers
  const authHeaders = () => {
    const token = localStorage.getItem('token');
    const headers = { 'Content-Type': 'application/json' };
    if (token) headers.Authorization = `Bearer ${token}`;
    return headers;
  };

  const loadMyFiles = async () => {
    try {
      setFilesLoading(true);
      const res = await fetch(`${API_BASE_URL}/files/my-files`, {
        method: 'GET',
        headers: authHeaders()
      });
      const data = await res.json().catch(() => ({}));
      if (res.ok) {
        setFiles(data.files || []);
      } else {
        console.error('Failed to load files:', data.message);
      }
    } catch (err) {
      console.error('Error loading files:', err);
    } finally {
      setFilesLoading(false);
    }
  };

  const handleFileUpload = async (e) => {
    e.preventDefault();
    if (!selectedUploadFile) {
      alert('Please select a file to upload');
      return;
    }
    try {
      const token = localStorage.getItem('token');
      const formData = new FormData();
      formData.append('file', selectedUploadFile);
      if (fileDescription) formData.append('description', fileDescription);
      formData.append('isPublic', String(fileIsPublic));

      const res = await fetch(`${API_BASE_URL}/files/upload`, {
        method: 'POST',
        headers: token ? { 'Authorization': `Bearer ${token}` } : {},
        body: formData
      });
      const data = await res.json().catch(() => ({}));
      if (res.ok) {
        setSelectedUploadFile(null);
        setFileDescription('');
        setFileIsPublic(false);
        await loadMyFiles();
        alert('File uploaded successfully!');
      } else {
        alert(data.message || 'Failed to upload file');
      }
    } catch (error) {
      console.error('Upload error:', error);
      alert('Error uploading file');
    }
  };

  const handleDeleteFile = async (fileId) => {
    if (!window.confirm('Delete this file?')) return;
    try {
      const res = await fetch(`${API_BASE_URL}/files/${fileId}`, {
        method: 'DELETE',
        headers: authHeaders()
      });
      const data = await res.json().catch(() => ({}));
      if (res.ok) {
        await loadMyFiles();
        alert('File deleted.');
      } else {
        alert(data.message || 'Failed to delete file');
      }
    } catch (err) {
      console.error('Delete error:', err);
      alert('Error deleting file');
    }
  };

  const handleDownloadFile = (fileId) => {
    const url = `${API_BASE_URL}/files/${fileId}/download`;
    window.open(url, '_blank');
  };

  const fetchSubcategories = async (category) => {
    try {
      setSubsLoading(true);
      const subs = await getSubcategoriesByCategory(category);
      setSubcategories(subs || []);
    } catch (err) {
      console.error('Error fetching subcategories:', err);
      setSubcategories([]);
    } finally {
      setSubsLoading(false);
    }
  };

  useEffect(() => {
    if (activeTab === 'files') {
      loadMyFiles();
    }
  }, [activeTab]);

  useEffect(() => {
    if (activeTab === 'manageCategory' && selectedCategory) {
      fetchSubcategories(selectedCategory);
    }
  }, [activeTab, selectedCategory]);

  const formatBytes = (bytes = 0) => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex relative">
      
      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 lg:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={`fixed lg:sticky top-0 left-0 z-40 w-72 lg:w-60 h-screen bg-gradient-to-b from-white/95 to-blue-50/90 backdrop-blur-md shadow-xl border-r border-blue-200/50 flex flex-col transition-transform duration-300 ease-in-out ${
        isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
      }`}>
        {/* Header */}
        <div className="p-4 border-b border-gray-200/50">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg shadow-lg">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h18v4H3zM3 9h18v12H3z" />
              </svg>
            </div>
            <div>
              <h1 className="text-lg font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">Seller Panel</h1>
              <p className="text-xs text-gray-500">Manage your store</p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <div className="flex-1 p-4">
          <nav className="space-y-2">
            {/* Overview */}
            <button
              onClick={() => { setActiveTab('overview'); setIsMobileMenuOpen(false); }}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl font-medium text-sm transition-all duration-300 ${
                activeTab === 'overview'
                  ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg transform scale-105'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 hover:shadow-md'
              }`}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
              <span>Overview</span>
            </button>

            {/* Orders */}
            <button
              onClick={() => { setActiveTab('orders'); setIsMobileMenuOpen(false); }}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl font-medium text-sm transition-all duration-300 ${
                activeTab === 'orders'
                  ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg transform scale-105'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 hover:shadow-md'
              }`}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
              <span>Orders</span>
            </button>

            {/* Products with dropdown */}
            <div className="space-y-1">
              <button
                onClick={() => setIsProductsMenuOpen((prev) => !prev)}
                className={`w-full flex items-center justify-between px-4 py-3 rounded-xl font-medium text-sm transition-all duration-300 ${
                  activeTab === 'products'
                    ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg transform scale-105'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 hover:shadow-md'
                }`}
              >
                <span className="flex items-center space-x-3">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                  </svg>
                  <span>Products</span>
                </span>
                <svg className={`w-4 h-4 transition-transform ${isProductsMenuOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              {isProductsMenuOpen && (
                <div className="ml-6 space-y-2">
                  <button
                    onClick={() => { setActiveTab('products'); setIsMobileMenuOpen(false); }}
                    className="w-full text-left px-3 py-2 text-sm rounded-lg text-gray-600 hover:text-gray-900 hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50"
                  >
                    View Products
                  </button>
                  <button
                    onClick={() => { setActiveTab('manageCategory'); setIsMobileMenuOpen(false); }}
                    className="w-full text-left px-3 py-2 text-sm rounded-lg text-gray-600 hover:text-gray-900 hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50"
                  >
                    Manage Subcategories
                  </button>
                  <button
                    onClick={() => { setActiveTab('products'); setShowAddProductModal(true); setIsMobileMenuOpen(false); }}
                    className="w-full text-left px-3 py-2 text-sm rounded-lg text-gray-600 hover:text-gray-900 hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50"
                  >
                    Add Product
                  </button>
                </div>
              )}
            </div>
            {/* Files */}
            <button
              onClick={() => { setActiveTab('files'); setIsMobileMenuOpen(false); }}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl font-medium text-sm transition-all duration-300 ${
                activeTab === 'files'
                  ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg transform scale-105'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 hover:shadow-md'
              }`}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4h16v16H4zM8 8h8v8H8z" />
              </svg>
              <span>Files</span>
            </button>
          </nav>
        </div>

        {/* Logout Button */}
        <div className="p-4 border-t border-gray-200/50">
          <button
            onClick={logout}
            className="w-full bg-gradient-to-r from-red-500 to-red-600 text-white px-4 py-3 rounded-xl hover:from-red-600 hover:to-red-700 transition-all duration-300 shadow-lg hover:shadow-xl flex items-center justify-center space-x-2 font-medium text-sm transform hover:scale-105"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            <span>Logout</span>
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Desktop Header */}
        <div className="hidden lg:flex bg-white/95 backdrop-blur-md shadow-sm border-b border-gray-200/50 p-4 items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="p-1.5 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg shadow-lg">
              <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h18v4H3zM3 9h18v12H3z" />
              </svg>
            </div>
            <h1 className="text-lg font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">Seller Dashboard</h1>
          </div>
          
          {/* Seller User Profile */}
          <div className="flex items-center space-x-3">
            <div className="flex items-center space-x-2 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg px-3 py-2">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              <div className="text-left">
                <p className="text-xs font-medium text-gray-900">{user?.name || 'Seller'}</p>
                <p className="text-xs text-gray-500">{user?.email}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Mobile Header */}
        <div className="lg:hidden bg-white/95 backdrop-blur-md shadow-sm border-b border-gray-200/50 p-3">
          <div className="flex items-center justify-between">
            <button
              onClick={() => setIsMobileMenuOpen(true)}
              className="p-2 rounded-lg bg-gray-100 hover:bg-gray-200 transition-colors touch-manipulation"
            >
              <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
            <div className="flex items-center space-x-2">
              <div className="p-1.5 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg shadow-lg">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h18v4H3zM3 9h18v12H3z" />
                </svg>
              </div>
              <h1 className="text-lg font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">Seller Dashboard</h1>
            </div>
            <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
              <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 p-3 lg:p-6 overflow-y-auto">
          {/* Overview Tab */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              {/* Stats Cards */}
              <div className="grid grid-cols-1 xs:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 lg:gap-4">
                <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg shadow-lg p-4 border border-blue-200/50 hover:shadow-xl transition-all duration-300">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs font-semibold text-blue-600 uppercase tracking-wide">Total Products</p>
                      <p className="text-xl font-bold text-blue-900 mt-1">{stats.totalProducts}</p>
                      <div className="flex items-center mt-1">
                        <div className="w-1.5 h-1.5 bg-green-400 rounded-full mr-1"></div>
                        <span className="text-xs text-blue-600">Active Products</span>
                      </div>
                    </div>
                    <div className="p-2 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg shadow-lg">
                      <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                      </svg>
                    </div>
                  </div>
                </div>

                <div className="bg-gradient-to-br from-emerald-50 to-emerald-100 rounded-lg shadow-lg p-4 border border-emerald-200/50 hover:shadow-xl transition-all duration-300">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs font-semibold text-emerald-600 uppercase tracking-wide">Total Orders</p>
                      <p className="text-xl font-bold text-emerald-900 mt-1">{stats.totalOrders}</p>
                      <div className="flex items-center mt-1">
                        <div className="w-1.5 h-1.5 bg-green-400 rounded-full mr-1"></div>
                        <span className="text-xs text-emerald-600">All Time</span>
                      </div>
                    </div>
                    <div className="p-2 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-lg shadow-lg">
                      <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                      </svg>
                    </div>
                  </div>
                </div>

                <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg shadow-lg p-4 border border-purple-200/50 hover:shadow-xl transition-all duration-300">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs font-semibold text-purple-600 uppercase tracking-wide">Total Revenue</p>
                      <p className="text-xl font-bold text-purple-900 mt-1">₹{stats.totalRevenue}</p>
                      <div className="flex items-center mt-1">
                        <div className="w-1.5 h-1.5 bg-green-400 rounded-full mr-1"></div>
                        <span className="text-xs text-purple-600">This Month</span>
                      </div>
                    </div>
                    <div className="p-2 bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg shadow-lg">
                      <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                      </svg>
                    </div>
                  </div>
                </div>

                <div className="bg-gradient-to-br from-amber-50 to-amber-100 rounded-lg shadow-lg p-4 border border-amber-200/50 hover:shadow-xl transition-all duration-300">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs font-semibold text-amber-600 uppercase tracking-wide">Pending Orders</p>
                      <p className="text-xl font-bold text-amber-900 mt-1">{stats.pendingOrders}</p>
                      <div className="flex items-center mt-1">
                        <div className="w-1.5 h-1.5 bg-yellow-400 rounded-full mr-1"></div>
                        <span className="text-xs text-amber-600">Needs Action</span>
                      </div>
                    </div>
                    <div className="p-2 bg-gradient-to-br from-amber-500 to-amber-600 rounded-lg shadow-lg">
                      <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                  </div>
                </div>
              </div>

              {/* Quick Actions */}
             

              {/* Recent Orders */}
              <div className="bg-white/70 backdrop-blur-sm rounded-lg shadow-lg border border-gray-200/50">
                <div className="px-4 py-3 border-b border-gray-200/50">
                  <div className="flex items-center space-x-2">
                    <div className="p-1.5 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-lg">
                      <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                      </svg>
                    </div>
                    <h3 className="text-lg font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">Recent Orders</h3>
                  </div>
                </div>
                <div className="overflow-x-auto -mx-3 lg:mx-0">
                  <div className="min-w-[600px] lg:min-w-0 max-h-80 overflow-y-auto">
                    <table className="min-w-full divide-y divide-gray-200/50">
                      <thead className="bg-gradient-to-r from-gray-50 to-gray-100 sticky top-0 z-10">
                        <tr>
                          <th className="px-4 py-2 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Order Info</th>
                          <th className="px-4 py-2 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Customer</th>
                          <th className="px-4 py-2 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Amount</th>
                          <th className="px-4 py-2 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Status</th>
                          <th className="px-4 py-2 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="bg-white/50 divide-y divide-gray-200/30">
                        {orders.map((order, index) => (
                          <tr key={order.id} className="hover:bg-gradient-to-r hover:from-blue-50/50 hover:to-purple-50/50 transition-all duration-200">
                            <td className="px-4 py-3 whitespace-nowrap text-sm">
                              <div>
                                <div className="font-semibold text-gray-900 text-sm">{order.orderId}</div>
                                <div className="text-xs text-gray-500">{new Date(order.createdAt).toLocaleDateString()}</div>
                              </div>
                            </td>
                            <td className="px-4 py-3 whitespace-nowrap text-sm">
                              <div className="flex items-center space-x-2">
                                <div className="w-8 h-8 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center text-white font-bold text-xs">
                                  {order.customerName?.charAt(0) || 'U'}
                                </div>
                                <div>
                                  <div className="font-semibold text-gray-900 text-sm">{order.customerName}</div>
                                  <div className="text-xs text-gray-500">{order.customerEmail}</div>
                                </div>
                              </div>
                            </td>
                            <td className="px-4 py-3 whitespace-nowrap text-sm font-bold text-green-600">₹{order.total}</td>
                            <td className="px-4 py-3 whitespace-nowrap text-sm">
                              <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(order.status)}`}>
                                {order.status}
                              </span>
                            </td>
                            <td className="px-4 py-3 whitespace-nowrap text-sm">
                              <button
                                onClick={() => openOrderModal(order)}
                                className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-3 py-1.5 rounded-lg text-xs font-medium hover:from-blue-600 hover:to-purple-700 transition-all duration-200 shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
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
              </div>
            </div>
          )}

          {/* Orders Tab */}
          {activeTab === 'orders' && (
            <div className="bg-white/70 backdrop-blur-sm rounded-lg shadow-lg border border-white/20">
              <div className="px-4 py-3 border-b border-gray-200/30">
                <div className="flex items-center space-x-2">
                  <div className="w-6 h-6 bg-gradient-to-br from-purple-400 to-pink-500 rounded-lg flex items-center justify-center">
                    <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">All Orders</h3>
                </div>
              </div>
              <div className="overflow-x-auto -mx-3 lg:mx-0">
                <div className="min-w-[800px] lg:min-w-0">
                  <table className="min-w-full divide-y divide-gray-200/30">
                    <thead className="bg-gradient-to-r from-purple-50 to-pink-50">
                      <tr>
                        <th className="px-4 py-2 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Order Info</th>
                        <th className="px-4 py-2 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Customer</th>
                        <th className="px-4 py-2 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Items</th>
                        <th className="px-4 py-2 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Amount</th>
                        <th className="px-4 py-2 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Status</th>
                        <th className="px-4 py-2 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Date</th>
                        <th className="px-4 py-2 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white/50 divide-y divide-gray-200/30">
                      {orders.map((order, index) => (
                        <tr key={order.id} className="hover:bg-gradient-to-r hover:from-purple-50/50 hover:to-pink-50/50 transition-all duration-200">
                          <td className="px-4 py-3 whitespace-nowrap text-sm">
                            <div>
                              <div className="font-semibold text-gray-900 text-sm">{order.orderId}</div>
                            </div>
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap text-sm">
                            <div className="flex items-center space-x-2">
                              <div className="w-8 h-8 bg-gradient-to-br from-purple-400 to-pink-500 rounded-full flex items-center justify-center text-white font-bold text-xs">
                                {order.customerName?.charAt(0) || 'U'}
                              </div>
                              <div>
                                <div className="font-semibold text-gray-900 text-sm">{order.customerName}</div>
                                <div className="text-xs text-gray-500">{order.customerEmail}</div>
                              </div>
                            </div>
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap text-sm">
                            <div>
                              <div className="font-semibold text-gray-900 text-sm">{order.items?.length || 0} items</div>
                              <div className="text-xs text-gray-500 mt-1">
                                {order.items?.map(item => item.name).join(', ')}
                              </div>
                            </div>
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap text-sm font-bold text-green-600">₹{order.total}</td>
                          <td className="px-4 py-3 whitespace-nowrap text-sm">
                            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(order.status)}`}>
                              {order.status}
                            </span>
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-600 font-medium">
                            {new Date(order.createdAt).toLocaleDateString()}
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap text-sm font-medium">
                            <button
                              onClick={() => openOrderModal(order)}
                              className="bg-gradient-to-r from-purple-500 to-pink-600 text-white px-3 py-1.5 rounded-lg text-xs font-medium hover:from-purple-600 hover:to-pink-700 transition-all duration-200 shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
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
            </div>
          )}

          {/* Files Tab */}
          {activeTab === 'files' && (
            <div className="bg-white/70 backdrop-blur-sm rounded-lg shadow-lg border border-white/20">
              <div className="px-4 py-3 border-b border-gray-200/30">
                <div className="flex items-center space-x-2">
                  <div className="w-6 h-6 bg-gradient-to-br from-blue-400 to-purple-500 rounded-lg flex items-center justify-center">
                    <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4h16v16H4zM8 8h8v8H8z" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">My Files</h3>
                </div>
              </div>
              <div className="p-4 space-y-4">
                <form onSubmit={handleFileUpload} className="bg-white/60 rounded-lg border border-gray-200/30 p-4 space-y-3">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    <input
                      type="file"
                      onChange={(e) => setSelectedUploadFile(e.target.files?.[0] || null)}
                      className="border border-gray-300 rounded-lg p-2 text-sm bg-white"
                    />
                    <input
                      type="text"
                      placeholder="Description (optional)"
                      value={fileDescription}
                      onChange={(e) => setFileDescription(e.target.value)}
                      className="border border-gray-300 rounded-lg p-2 text-sm bg-white"
                    />
                    <label className="inline-flex items-center space-x-2 text-sm">
                      <input
                        type="checkbox"
                        checked={fileIsPublic}
                        onChange={(e) => setFileIsPublic(e.target.checked)}
                      />
                      <span>Public</span>
                    </label>
                  </div>
                  <div>
                    <button
                      type="submit"
                      className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-4 py-2 rounded-lg font-medium hover:from-blue-600 hover:to-purple-700 transition-all duration-200 shadow-md hover:shadow-lg"
                    >
                      Upload
                    </button>
                  </div>
                </form>

                <div className="bg-white/60 rounded-lg border border-gray-200/30 overflow-x-auto">
                  {filesLoading ? (
                    <div className="p-4 text-sm text-gray-600">Loading files...</div>
                  ) : (
                    <table className="min-w-full divide-y divide-gray-200/30">
                      <thead className="bg-gradient-to-r from-blue-50 to-purple-50">
                        <tr>
                          <th className="px-4 py-2 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Name</th>
                          <th className="px-4 py-2 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Type</th>
                          <th className="px-4 py-2 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Size</th>
                          <th className="px-4 py-2 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Public</th>
                          <th className="px-4 py-2 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Downloads</th>
                          <th className="px-4 py-2 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="bg-white/50 divide-y divide-gray-200/30">
                        {files.length === 0 ? (
                          <tr>
                            <td colSpan="6" className="px-4 py-3 text-sm text-gray-600">No files uploaded yet.</td>
                          </tr>
                        ) : (
                          files.map((file) => (
                            <tr key={file._id} className="hover:bg-gradient-to-r hover:from-blue-50/50 hover:to-purple-50/50 transition-all duration-200">
                              <td className="px-4 py-3 text-sm">{file.originalName || file.filename}</td>
                              <td className="px-4 py-3 text-sm">{file.mimeType || 'Unknown'}</td>
                              <td className="px-4 py-3 text-sm">{formatBytes(file.size)}</td>
                              <td className="px-4 py-3 text-sm">
                                <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${file.isPublic ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                                  {file.isPublic ? 'Yes' : 'No'}
                                </span>
                              </td>
                              <td className="px-4 py-3 text-sm">{file.downloadCount || 0}</td>
                              <td className="px-4 py-3 text-sm">
                                <div className="flex space-x-2">
                                  <button
                                    onClick={() => handleDownloadFile(file._id)}
                                    className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white px-3 py-1.5 rounded-lg text-xs font-medium hover:from-indigo-600 hover:to-purple-700 transition-all duration-200"
                                  >
                                    Download
                                  </button>
                                  <button
                                    onClick={() => handleDeleteFile(file._id)}
                                    className="bg-gradient-to-r from-red-500 to-red-600 text-white px-3 py-1.5 rounded-lg text-xs font-medium hover:from-red-600 hover:to-red-700 transition-all duration-200"
                                  >
                                    Delete
                                  </button>
                                </div>
                              </td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Manage Category Tab */}
          {activeTab === 'manageCategory' && (
            <div className="bg-white/70 backdrop-blur-sm rounded-lg shadow-lg border border-white/20">
              <div className="px-4 py-3 border-b border-gray-200/30">
                <div className="flex items-center space-x-2">
                  <div className="w-6 h-6 bg-gradient-to-br from-blue-400 to-purple-500 rounded-lg flex items-center justify-center">
                    <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4M4 7v10l8 4m0-10l8-4v10" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">Manage Subcategories</h3>
                </div>
              </div>
              <div className="p-4 space-y-4">
                <div className="flex items-center space-x-2">
                  {['printing','e-market','local-market'].map((cat) => (
                    <button
                      key={cat}
                      onClick={() => setSelectedCategory(cat)}
                      className={`px-3 py-2 rounded-lg text-sm font-medium border transition-all ${
                        selectedCategory === cat
                          ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white border-transparent'
                          : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>

                <div className="bg-white/60 rounded-lg border border-gray-200/30 overflow-x-auto">
                  {subsLoading ? (
                    <div className="p-4 text-sm text-gray-600">Loading subcategories...</div>
                  ) : (
                    <table className="min-w-full divide-y divide-gray-200/30">
                      <thead className="bg-gradient-to-r from-blue-50 to-purple-50">
                        <tr>
                          <th className="px-4 py-2 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Name</th>
                          <th className="px-4 py-2 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Active</th>
                        </tr>
                      </thead>
                      <tbody className="bg-white/50 divide-y divide-gray-200/30">
                        {subcategories.length === 0 ? (
                          <tr>
                            <td colSpan="2" className="px-4 py-3 text-sm text-gray-600">No subcategories found.</td>
                          </tr>
                        ) : (
                          subcategories.map((sub) => (
                            <tr key={sub._id} className="hover:bg-gradient-to-r hover:from-blue-50/50 hover:to-purple-50/50 transition-all duration-200">
                              <td className="px-4 py-3 text-sm">{sub.name}</td>
                              <td className="px-4 py-3 text-sm">
                                <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${sub.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                                  {sub.isActive ? 'Active' : 'Inactive'}
                                </span>
                              </td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Products Tab */}
          {activeTab === 'products' && (
            <div className="bg-white/70 backdrop-blur-sm rounded-lg shadow-lg border border-white/20">
              <div className="px-4 py-3 border-b border-gray-200/30">
                <div className="flex items-center space-x-2">
                  <div className="w-6 h-6 bg-gradient-to-br from-blue-400 to-purple-500 rounded-lg flex items-center justify-center">
                    <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">Your Products</h3>
                  <div className="ml-auto">
                    <button
                      onClick={() => setShowAddProductModal(true)}
                      className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white px-4 py-2 rounded-lg font-medium transition-all duration-200 flex items-center space-x-2 shadow-lg hover:shadow-xl"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                      </svg>
                      <span>Add Product</span>
                    </button>
                  </div>
                </div>
              </div>
              <div className="overflow-x-auto -mx-3 lg:mx-0">
                <div className="min-w-[900px] lg:min-w-0">
                  <table className="min-w-full divide-y divide-gray-200/30">
                    <thead className="bg-gradient-to-r from-blue-50 to-purple-50">
                      <tr>
                        <th className="px-4 py-2 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Product</th>
                        <th className="px-4 py-2 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Category</th>
                        <th className="px-4 py-2 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Price</th>
                        <th className="px-4 py-2 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Stock</th>
                        <th className="px-4 py-2 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Status</th>
                        <th className="px-4 py-2 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white/50 divide-y divide-gray-200/30">
                      {products.map((product) => (
                        <tr key={product._id} className="hover:bg-gradient-to-r hover:from-blue-50/50 hover:to-purple-50/50 transition-all duration-200">
                          <td className="px-4 py-3 whitespace-nowrap text-sm">
                            <div className="flex items-center space-x-3">
                              <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-purple-500 rounded-lg flex items-center justify-center text-white font-bold text-xs">
                                {product.name?.charAt(0) || 'P'}
                              </div>
                              <div>
                                <div className="font-semibold text-gray-900 text-sm">{product.name}</div>
                                <div className="text-xs text-gray-500 mt-1 max-w-xs truncate">{product.description}</div>
                              </div>
                            </div>
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap text-sm">
                            <div>
                              <div className="font-semibold text-gray-900 text-sm capitalize">{product.category}</div>
                              <div className="text-xs text-gray-500">{product.subcategory}</div>
                            </div>
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap text-sm font-bold text-green-600">₹{product.price}</td>
                          <td className="px-4 py-3 whitespace-nowrap text-sm">
                            <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
                              {product.stock || 0} in stock
                            </span>
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap text-sm">
                            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                              product.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                            }`}>
                              {product.isActive ? 'Active' : 'Inactive'}
                            </span>
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap text-sm font-medium">
                            <div className="flex space-x-2">
                              <button
                                onClick={() => handleEditProduct(product)}
                                className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:from-indigo-600 hover:to-purple-700 transition-all duration-200 shadow-md hover:shadow-lg transform hover:-translate-y-0.5 touch-manipulation min-w-[80px]"
                              >
                                Edit
                              </button>
                              <button
                                onClick={() => handleDeleteProduct(product._id)}
                                className="bg-gradient-to-r from-red-500 to-red-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:from-red-600 hover:to-red-700 transition-all duration-200 shadow-md hover:shadow-lg transform hover:-translate-y-0.5 touch-manipulation min-w-[80px]"
                              >
                                Delete
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
        </div>

        {/* Order Details Modal */}
        {showOrderModal && selectedOrder && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm overflow-y-auto h-full w-full z-50 flex items-center justify-center p-4">
            <div className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto mx-auto p-4 sm:p-6 lg:p-8 shadow-2xl rounded-2xl bg-white/90 backdrop-blur-md border border-white/20">
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
                    className="text-gray-400 hover:text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-full p-3 transition-all duration-200 touch-manipulation"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
                
                <div className="space-y-4 lg:space-y-6">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6">
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
                        <p className="text-sm"><span className="font-semibold text-gray-700">Status:</span> 
                          <span className={`ml-2 inline-flex px-3 py-1 text-xs font-semibold rounded-full ${getStatusColor(selectedOrder.status)}`}>
                            {selectedOrder.status}
                          </span>
                        </p>
                        {/* Status Update Controls */}
                        <div className="mt-4">
                          <label className="text-sm font-semibold text-gray-700">Update Status</label>
                          <div className="flex items-center space-x-2 mt-2">
                            <select
                              className="border border-purple-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                              value={statusUpdate}
                              onChange={(e) => setStatusUpdate(e.target.value)}
                            >
                              <option value="pending">Pending</option>
                              <option value="processing">Processing</option>
                              <option value="shipped">Shipped</option>
                              <option value="cancelled">Cancelled</option>
                            </select>
                            <button
                              onClick={() => updateOrderStatus(selectedOrder.id, statusUpdate)}
                              className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:from-blue-600 hover:to-purple-700 transition-all duration-200 shadow-md hover:shadow-lg"
                            >
                              Update
                            </button>
                          </div>
                        </div>
                        <p className="text-sm"><span className="font-semibold text-gray-700">Total Amount:</span> <span className="text-green-600 font-bold text-lg">₹{selectedOrder.total}</span></p>
                        <p className="text-sm"><span className="font-semibold text-gray-700">Order Date:</span> <span className="text-gray-600">{new Date(selectedOrder.createdAt).toLocaleDateString()}</span></p>
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
                        {selectedOrder.customerEmail && (
                          <p className="text-sm"><span className="font-semibold text-gray-700">Email:</span> <span className="text-gray-600">{selectedOrder.customerEmail}</span></p>
                        )}
                        {selectedOrder.customerPhone && (
                          <p className="text-sm"><span className="font-semibold text-gray-700">Phone:</span> <span className="text-gray-600">{selectedOrder.customerPhone}</span></p>
                        )}
                        {selectedOrder.customerAddress && (
                          <div>
                            <p className="font-semibold text-gray-700 text-sm mb-1">Address:</p>
                            <div className="bg-white/60 p-3 rounded-lg text-sm text-gray-700">
                              <p>{selectedOrder.customerAddress}</p>
                              {selectedOrder.customerCity && <p>{selectedOrder.customerCity}</p>}
                              {selectedOrder.customerPincode && <p className="font-medium">PIN: {selectedOrder.customerPincode}</p>}
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
                              <td className="px-6 py-4 text-sm text-gray-900">
                                <div className="flex items-center space-x-3">
                                  <div className="w-12 h-12 rounded overflow-hidden border border-gray-200 bg-white">
                                    <img
                                      src={(item?.image || item?.imageUrl || '').trim() || '/no-image.svg'}
                                      alt={item?.name || 'Product image'}
                                      className="w-full h-full object-cover"
                                      loading="lazy"
                                      referrerPolicy="no-referrer"
                                      onError={(e) => { e.currentTarget.src = 'https://via.placeholder.com/100x100?text=No+Image'; }}
                                    />
                                  </div>
                                  <div>
                                    <div className="font-semibold text-gray-900">{item.name}</div>
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
                              </td>
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
                
                <div className="mt-6 lg:mt-8 flex justify-end">
                  <button
                    onClick={closeOrderModal}
                    className="bg-gradient-to-r from-gray-500 to-gray-600 text-white px-6 py-3 rounded-xl hover:from-gray-600 hover:to-gray-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 font-medium touch-manipulation w-full sm:w-auto"
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Add Product Modal */}
        <SellerAddProductModal
          isOpen={showAddProductModal}
          onClose={() => setShowAddProductModal(false)}
          onProductAdded={handleProductAdded}
        />

        {/* Edit Product Modal */}
        {showEditProductModal && editingProduct && (
          <SellerEditProductModal
            isOpen={showEditProductModal}
            onClose={() => { setShowEditProductModal(false); setEditingProduct(null); }}
            product={editingProduct}
            onProductUpdated={handleProductUpdated}
          />
        )}
      </div>
    </div>
  );
};

export default SellerDashboard;