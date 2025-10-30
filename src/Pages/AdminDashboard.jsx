import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useOrder } from '../context/OrderContext';
import { getAdminProductsByCategory, deleteProduct, getSellerProducts, deleteAllProducts } from '../services/productService';
// Edit modal will use updateProduct from productService
// (imported inside modal component to keep dashboard lean)
import AddProductModal from '../components/AddProductModal';
import EditProductModal from '../components/EditProductModal';
import { getAllSubcategoriesAdmin, createSubcategory, deleteSubcategory } from '../services/subcategoryService';
import { listCategoryCommissions, setCategoryCommission as setCategoryCommissionApi } from '../services/commissionService';
import { getPosters, createPoster, deletePoster } from '../services/posterService';
import { getBanners, createBanner, deleteBanner } from '../services/bannerService';
import { getAdminNotifications, markAllNotificationsAsRead, markNotificationAsRead, getUnreadCount } from '../services/notificationService';
import { adminDeleteSeller } from '../services/sellerService';

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    totalCustomers: 0,
    totalOrders: 0,
    totalRevenue: 0,
    pendingOrders: 0,
    totalProducts: 0
  });
  const [customers, setCustomers] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showOrderModal, setShowOrderModal] = useState(false);
  const [adminUser, setAdminUser] = useState(null);
  const [files, setFiles] = useState([]);
  const [fileStats, setFileStats] = useState({ totalFiles: 0, totalSize: 0, totalDownloads: 0 });
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [products, setProducts] = useState({
    emart: [],
    localmarket: [],
    printing: [],
    oldee: [],
    news: []
  });
  const [loadingProducts, setLoadingProducts] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isProductsMenuOpen, setIsProductsMenuOpen] = useState(false);
  const [isOrdersMenuOpen, setIsOrdersMenuOpen] = useState(false);
  const [showAddProductModal, setShowAddProductModal] = useState(false);
  const [showEditProductModal, setShowEditProductModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [showManageSubModal, setShowManageSubModal] = useState(false);
  const [subList, setSubList] = useState([]);
  const [subForm, setSubForm] = useState({ name: '', category: '', image: null, preview: null });
  const [categoryCommission, setCategoryCommission] = useState({});
  // Sellers state
  const [sellers, setSellers] = useState([]);
  const [selectedSeller, setSelectedSeller] = useState(null);
  const [showEditSellerModal, setShowEditSellerModal] = useState(false);
  const [editSellerForm, setEditSellerForm] = useState({
    name: '',
    sellerName: '',
    email: '',
    sellerHierarchyLevel: 0,
    shopName: '',
    phone: ''
  });
  // Seller products modal state
  const [sellerProductsModalOpen, setSellerProductsModalOpen] = useState(false);
  const [sellerProductsSeller, setSellerProductsSeller] = useState(null);
  const [sellerProducts, setSellerProducts] = useState([]);
  const [sellerProductsLoading, setSellerProductsLoading] = useState(false);
  const [sellerProductsError, setSellerProductsError] = useState(null);
  // Posters state
  const [posters, setPosters] = useState([]);
  const [posterTitle, setPosterTitle] = useState('');
  const [posterFile, setPosterFile] = useState(null);
  const [posterUploading, setPosterUploading] = useState(false);
  // Banner state
  const [bannerName, setBannerName] = useState('');
  const [bannerImageTitle, setBannerImageTitle] = useState('');
  const [bannerImageFile, setBannerImageFile] = useState(null);
  const [bannerUploading, setBannerUploading] = useState(false);
  const [selectedBannerProduct, setSelectedBannerProduct] = useState(null);
  const [productBanners, setProductBanners] = useState([]);
const subCategories = ['l-mart', 'localmarket', 'printing', 'news', 'oldee'];
  const navigate = useNavigate();
  const { getAllOrders } = useOrder();
  const [statusUpdate, setStatusUpdate] = useState('pending');
  // Orders filter (sidebar selection controls table rendering)
  const [orderStatusFilter, setOrderStatusFilter] = useState('all');
  // Orders search (customer name)
  const [orderSearchQuery, setOrderSearchQuery] = useState('');
  const [showOrderSuggestions, setShowOrderSuggestions] = useState(false);
  // Header search (seller name/ID, order id, customer)
  const [headerSearchQuery, setHeaderSearchQuery] = useState('');
  const [showHeaderSuggestions, setShowHeaderSuggestions] = useState(false);

  // Earnings (Admin) state
  const [earningsRange, setEarningsRange] = useState('monthly'); // 'weekly' | 'monthly' | 'yearly'
  const [earningsCounts, setEarningsCounts] = useState({ weeks: 8, months: 12, years: 3 });
  const [adminEarningsData, setAdminEarningsData] = useState(null);
  const [adminEarningsLoading, setAdminEarningsLoading] = useState(false);

  // Notifications state
  const [notifications, setNotifications] = useState([]);
  const [notificationsLoading, setNotificationsLoading] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const [notificationPage, setNotificationPage] = useState(1);
  const [notificationFilter, setNotificationFilter] = useState({ type: null, isRead: null });
  const [showNotificationModal, setShowNotificationModal] = useState(false);
  const [selectedNotification, setSelectedNotification] = useState(null);

  // Bulk upload state
  const [bulkUploadFile, setBulkUploadFile] = useState(null);
  const [bulkUploadLoading, setBulkUploadLoading] = useState(false);
  const [bulkUploadResults, setBulkUploadResults] = useState(null);

  // Delete all products state
  const [showDeleteAllModal, setShowDeleteAllModal] = useState(false);
  const [deleteAllLoading, setDeleteAllLoading] = useState(false);

  const getSubcategoryName = (sc) => {
    if (sc && typeof sc === 'object') {
      return sc.name || '';
    }
    return typeof sc === 'string' ? sc : '';
  };

  // Safely format variant values which may be strings, numbers, arrays or objects
  const formatVariant = (variant) => {
    if (variant === null || variant === undefined) return '';
    if (Array.isArray(variant)) {
      const items = variant
        .map((v) => {
          if (v === null || v === undefined) return '';
          if (typeof v === 'string' || typeof v === 'number') return String(v);
          if (typeof v === 'object') {
            if (v.name) return String(v.name);
            if (v.label) return String(v.label);
            if (v.value) return String(v.value);
            return JSON.stringify(v);
          }
          return String(v);
        })
        .filter(Boolean);
      return items.join(', ');
    }
    if (typeof variant === 'object') {
      if (variant.name) return String(variant.name);
      if (variant.label) return String(variant.label);
      if (variant.value) return String(variant.value);
      return JSON.stringify(variant);
    }
    return String(variant);
  };

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

  const fetchAdminEarnings = async () => {
    try {
      setAdminEarningsLoading(true);
      const token = localStorage.getItem('adminToken');
      const headers = {};
      if (token) headers.Authorization = `Bearer ${token}`;
      const API_BASE_URL = import.meta.env.VITE_API_URL?.replace('/api', '') || 'http://localhost:5000';
      const params = new URLSearchParams();
      const rangeParam = earningsRange === 'weekly' ? 'week' : earningsRange === 'monthly' ? 'month' : 'year';
      params.append('range', rangeParam);
      params.append('weeks', String(earningsCounts.weeks));
      params.append('months', String(earningsCounts.months));
      params.append('years', String(earningsCounts.years));
      const res = await fetch(`${API_BASE_URL}/api/dashboard/earnings?${params.toString()}`, { headers });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.message || `Failed to fetch admin earnings (${res.status})`);
      setAdminEarningsData(data?.data || null);
    } catch (err) {
      console.error('Error fetching admin earnings:', err);
    } finally {
      setAdminEarningsLoading(false);
    }
  };

  useEffect(() => {
    if (activeTab === 'earnings') {
      fetchAdminEarnings();
    }
  }, [activeTab, earningsRange, earningsCounts]);

  // Fetch notifications
  const fetchNotifications = async () => {
    try {
      setNotificationsLoading(true);
      const response = await getAdminNotifications(
        notificationPage, 
        20, 
        notificationFilter.type, 
        notificationFilter.isRead
      );
      
      if (response.success) {
        setNotifications(response.data.notifications);
        setUnreadCount(response.data.unreadCount);
      }
    } catch (error) {
      console.error('Error fetching notifications:', error);
    } finally {
      setNotificationsLoading(false);
    }
  };

  // Fetch unread count
  const fetchUnreadCount = async () => {
    try {
      const response = await getUnreadCount();
      if (response.success) {
        setUnreadCount(response.data.unreadCount);
      }
    } catch (error) {
      console.error('Error fetching unread count:', error);
    }
  };

  // Mark notification as read
  const handleMarkAsRead = async (notificationId) => {
    try {
      await markNotificationAsRead(notificationId);
      fetchNotifications(); // Refresh notifications
      fetchUnreadCount(); // Update unread count
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };

  // Mark all notifications as read
  const handleMarkAllAsRead = async () => {
    try {
      await markAllNotificationsAsRead();
      fetchNotifications(); // Refresh notifications
      fetchUnreadCount(); // Update unread count
    } catch (error) {
      console.error('Error marking all notifications as read:', error);
    }
  };

  // Fetch notifications when tab changes to notifications
  useEffect(() => {
    if (activeTab === 'notifications') {
      fetchNotifications();
    }
  }, [activeTab, notificationPage, notificationFilter]);

  // Fetch unread count on component mount
  useEffect(() => {
    fetchUnreadCount();
  }, []);

  // Notification modal functions
  const openNotificationModal = (notification) => {
    setSelectedNotification(notification);
    setShowNotificationModal(true);
  };

  const closeNotificationModal = () => {
    setShowNotificationModal(false);
    setSelectedNotification(null);
  };

  const fetchDashboardData = async () => {
    try {
      const token = localStorage.getItem('adminToken');
      if (!token) {
        navigate('/admin/login');
        return;
      }

      const headers = {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      };

      const API_BASE_URL = import.meta.env.VITE_API_URL?.replace('/api', '') || 'http://localhost:5000';
      
      // Fetch dashboard statistics from backend
      try {
        const statsResponse = await fetch(`${API_BASE_URL}/api/dashboard/stats`, { headers });
        if (statsResponse.ok) {
          const statsData = await statsResponse.json();
          setStats(statsData);
        }
      } catch (error) {
        console.error('Error fetching stats:', error);
      }

      // Fetch orders from backend
      try {
        const ordersResponse = await fetch(`${API_BASE_URL}/api/dashboard/orders`, { headers });
        if (ordersResponse.ok) {
          const ordersData = await ordersResponse.json();
          // Convert MongoDB orders to match frontend format
          const formattedOrders = ordersData.map(order => ({
            id: order._id,
            orderId: order.orderId,
            paymentId: order.paymentId,
            status: order.status.charAt(0).toUpperCase() + order.status.slice(1),
            orderDate: new Date(order.createdAt).toISOString().split('T')[0],
            createdAt: order.createdAt,
            items: order.items,
            total: order.total,
            amount: order.total,
            customerName: order.customerName || 'Guest Customer',
            customerEmail: order.customerEmail || 'N/A',
            customerPhone: order.customerPhone || 'N/A',
            customerAddress: order.customerAddress || 'N/A',
            customerCity: order.customerCity || 'N/A',
            customerPincode: order.customerPincode || 'N/A'
          }));
          setOrders(formattedOrders);
        }
      } catch (error) {
        console.error('Error fetching orders:', error);
      }
      
      // Fetch files from backend
      try {
        const filesResponse = await fetch(`${API_BASE_URL}/api/files/admin/all`, { headers });
        if (filesResponse.ok) {
          const filesData = await filesResponse.json();
          setFiles(filesData.files || []);
        }
      } catch (error) {
        console.error('Error fetching files:', error);
      }

      // Fetch file stats from backend
      try {
        const fileStatsResponse = await fetch(`${API_BASE_URL}/api/files/admin/stats`, { headers });
        if (fileStatsResponse.ok) {
          const fileStatsData = await fileStatsResponse.json();
          setFileStats(fileStatsData);
        }
      } catch (error) {
        console.error('Error fetching file stats:', error);
      }

      // Fetch customers from backend
      try {
        const customersResponse = await fetch(`${API_BASE_URL}/api/dashboard/customers`, { headers });
        if (customersResponse.ok) {
          const customersData = await customersResponse.json();
          setCustomers(customersData);
        }
      } catch (error) {
        console.error('Error fetching customers:', error);
      }

      // Fetch sellers (admin)
      try {
        const sellersResponse = await fetch(`${API_BASE_URL}/api/dashboard/sellers`, { headers });
        if (sellersResponse.ok) {
          const sellersData = await sellersResponse.json();
          setSellers(sellersData);
        }
      } catch (error) {
        console.error('Error fetching sellers:', error);
      }

      // Fetch category commissions
      try {
        const res = await listCategoryCommissions();
        const map = {};
        (res?.data || []).forEach(r => { map[r.category] = Number(r.commissionPercent || 2); });
        setCategoryCommission(map);
      } catch (error) {
        console.error('Error fetching category commissions:', error);
      }

      // Fetch products for all categories
      await fetchAllProducts();

      // Fetch posters
      try {
        const posterData = await getPosters();
        setPosters(posterData || []);
      } catch (err) {
        console.error('Error fetching posters:', err);
      }
      
      setLoading(false);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      setLoading(false);
    }
  };

  // Poster handlers
  const handlePosterCreate = async (e) => {
    e.preventDefault();
    if (!posterFile) { alert('Please select an image'); return; }
    try {
      setPosterUploading(true);
      const newPoster = await createPoster({ title: posterTitle, imageFile: posterFile });
      setPosters(prev => [newPoster, ...prev]);
      setPosterTitle('');
      setPosterFile(null);
      alert('Poster uploaded successfully');
    } catch (err) {
      console.error('Poster upload error:', err);
      alert('Failed to upload poster');
    } finally {
      setPosterUploading(false);
    }
  };

  const handlePosterDelete = async (id) => {
    if (!confirm('Delete this poster?')) return;
    try {
      await deletePoster(id);
      setPosters(prev => prev.filter(p => p._id !== id));
    } catch (err) {
      console.error('Delete poster error:', err);
      alert('Failed to delete poster');
    }
  };

  // Banner handlers
  const handleBannerSave = async (e) => {
    e.preventDefault();
    try {
      if (!selectedBannerProduct || !selectedBannerProduct._id) {
        alert('Please select a product first');
        return;
      }
      if (!bannerName.trim()) {
        alert('Please enter banner name');
        return;
      }
      if (!bannerImageTitle.trim()) {
        alert('Please enter image title');
        return;
      }
      if (!bannerImageFile) {
        alert('Please select an image');
        return;
      }
      setBannerUploading(true);
      await createBanner({ name: bannerName.trim(), imageTitle: bannerImageTitle.trim(), imageFile: bannerImageFile, productId: selectedBannerProduct._id });
      alert('Banner created successfully');
      setBannerName('');
      setBannerImageTitle('');
      setBannerImageFile(null);
      // Reload banners for selected product
      try {
        const list = await getBanners(selectedBannerProduct._id);
        setProductBanners(Array.isArray(list) ? list : []);
      } catch {}
    } catch (err) {
      console.error('Error creating banner:', err);
      alert(err.message || 'Failed to create banner');
    } finally {
      setBannerUploading(false);
    }
  };

  const handleSelectBannerProduct = async (product) => {
    setSelectedBannerProduct(product);
    try {
      const list = await getBanners(product._id);
      setProductBanners(Array.isArray(list) ? list : []);
    } catch (err) {
      console.error('Error fetching product banners:', err);
      setProductBanners([]);
    }
  };

  // Bulk upload functions
  const handleBulkUpload = async () => {
    if (!bulkUploadFile) {
      alert('Please select a file to upload');
      return;
    }

    try {
      setBulkUploadLoading(true);
      const token = localStorage.getItem('adminToken');
      const formData = new FormData();
      formData.append('file', bulkUploadFile);

      const API_BASE_URL = import.meta.env.VITE_API_URL?.replace('/api', '') || 'http://localhost:5000';
      const response = await fetch(`${API_BASE_URL}/api/bulk-upload/products`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData
      });

      const data = await response.json();
      
      if (response.ok) {
        setBulkUploadResults(data);
        setBulkUploadFile(null);
        fetchAllProducts(); // Refresh products
        alert(`Bulk upload completed! ${data.successCount} products added successfully.`);
      } else {
        alert(data.message || 'Bulk upload failed');
      }
    } catch (error) {
      console.error('Error during bulk upload:', error);
      alert('Error during bulk upload. Please try again.');
    } finally {
      setBulkUploadLoading(false);
    }
  };

  const downloadTemplate = async () => {
    try {
      const token = localStorage.getItem('adminToken');
      const API_BASE_URL = import.meta.env.VITE_API_URL?.replace('/api', '') || 'http://localhost:5000';
      const response = await fetch(`${API_BASE_URL}/api/bulk-upload/template/products`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'admin_bulk_upload_template.xlsx';
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
      } else {
        const data = await response.json();
        alert(data.message || 'Failed to download template');
      }
    } catch (error) {
      console.error('Error downloading template:', error);
      alert('Error downloading template. Please try again.');
    }
  };

  const downloadLocalCSVTemplate = () => {
    try {
      const header = [
        'name', 'description', 'price', 'offerPrice', 'originalPrice', 'discount',
        'category', 'subcategory', 'colorVarients', 'sizeVarients', 'image', 'images',
        'inStock', 'stockQuantity', 'isActive'
      ];
      const rows = [
        [
          'Product1', 'Sample description 1', '110', '100', '', '0', 'localmarket', 'general',
          'green;red;gray', 'm;l;xl',
          'https://nobero.com/cdn/shop/files/og.jpg?v=1744007258',
          'https://teetall.pk/cdn/shop/products/354f50347f49b27c850e735e7f570b10-_1.webp?crop=center&height=1733&v=1694555029&width=1300;https://media.istockphoto.com/id/471188329/photo/plain-red-tee-shirt-isolated-on-white-background.jpg?s=612x612&w=0&k=20&c=h1n990JR40ZFbPRDpxKppFziIWrisGcE_d9OqkLVAC4=',
          'True', '101', 'True'
        ],
        [
          'Product2', 'Sample description 2', '120', '110', '', '0', 'printing', 'general',
          'black;white;blue', 'l;xl',
          'https://images.pexels.com/photos/8532616/pexels-photo-8532616.jpeg?cs=srgb&dl=pexels-anna-nekrashevich-8532616.jpg&fm=jpg',
          'https://i.pinimg.com/564x/c1/1d/16/c11d164de692594acf53c9a855093139.jpg;https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS1I4GPMgj9q7UQMU89T-_1FEVKmxzdS6ikXA&s',
          'True', '102', 'True'
        ],
        [
          'Product3', 'Sample description 3', '130', '120', '', '0', 'printing', 'general',
          'red;black;blue', 'l;xl',
          'https://img.freepik.com/premium-photo/tshirt-isolated_719385-716.jpg?cs=srgb&dl=pexels-anna-nekrashevich-8532616.jpg&fm=jpg',
          'https://printmytee.in/wp-content/uploads/2021/05/Ruffty-Black-With-Red-Tipping.jpg;https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS1I4GPMgj9q7UQMU89T-_1FEVKmxzdS6ikXA&s',
          'True', '102', 'True'
        ]
      ];

      const lines = [header, ...rows].map(row => row.map(val => {
        const s = String(val ?? '');
        return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
      }).join(',')).join('\n');

      const blob = new Blob([lines], { type: 'text/csv;charset=utf-8' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'admin_bulk_upload_template.csv';
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error('Error generating CSV template:', error);
      alert('Error generating CSV template');
    }
  };

  // Delete all products function
  const handleDeleteAllProducts = async () => {
    try {
      setDeleteAllLoading(true);
      const response = await deleteAllProducts();
      
      if (response.success) {
        alert(`${response.message}`);
        fetchAllProducts(); // Refresh products
        setShowDeleteAllModal(false);
      } else {
        alert(response.message || 'Failed to delete all products');
      }
    } catch (error) {
      console.error('Error deleting all products:', error);
      alert('Error deleting all products. Please try again.');
    } finally {
      setDeleteAllLoading(false);
    }
  };

  const fetchAllProducts = async () => {
    setLoadingProducts(true);
    try {
const categories = ['emart', 'localmarket', 'printing', 'oldee', 'news'];
      const productPromises = categories.map(async (category) => {
        try {
          const response = await getAdminProductsByCategory(category);
          console.log(`Fetched ${category} products:`, response); // Debug log
          return { category, products: response.data || [] };
        } catch (error) {
          console.error(`Error fetching ${category} products:`, error);
          return { category, products: [] };
        }
      });

      const results = await Promise.all(productPromises);
      const newProducts = {};
      results.forEach(({ category, products }) => {
        newProducts[category] = products;
      });
      
      console.log('All products fetched:', newProducts); // Debug log
      setProducts(newProducts);
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoadingProducts(false);
    }
  };

  const handleProductAdded = () => {
    // Refresh all products after adding a new one
    fetchAllProducts();
    setShowAddProductModal(false);
  };

  const handleEditProduct = (product) => {
    setEditingProduct(product);
    setShowEditProductModal(true);
  };

  const handleProductUpdated = () => {
    // Refresh products after update
    fetchAllProducts();
    setShowEditProductModal(false);
    setEditingProduct(null);
  };

  const loadAdminSubcategories = async () => {
    try {
      const subs = await getAllSubcategoriesAdmin();
      setSubList(subs || []);
    } catch (err) {
      console.error('Error loading subcategories', err);
      setSubList([]);
    }
  };

  const handleOpenManageSub = async () => {
    await loadAdminSubcategories();
    setShowManageSubModal(true);
  };

  const handleCreateSub = async (e) => {
    e.preventDefault();
    if (!subForm.name.trim() || !subForm.category) return;
    try {
      await createSubcategory({ name: subForm.name.trim(), category: subForm.category, image: subForm.image });
      setSubForm({ name: '', category: '', image: null, preview: null });
      await loadAdminSubcategories();
    } catch (err) {
      alert(err.message || 'Failed to create subcategory');
    }
  };

  const handleDeleteSub = async (id) => {
    if (!window.confirm('Delete this subcategory?')) return;
    try {
      await deleteSubcategory(id);
      await loadAdminSubcategories();
    } catch (err) {
      alert(err.message || 'Failed to delete subcategory');
    }
  };

  const handleDeleteProduct = async (productId, category) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        await deleteProduct(productId);
        // Refresh products for this category
        const response = await getAdminProductsByCategory(category);
        setProducts(prev => ({
          ...prev,
          [category]: response.data || []
        }));
        alert('Product deleted successfully!');
      } catch (error) {
        console.error('Error deleting product:', error);
        alert('Error deleting product. Please try again.');
      }
    }
  };

  const handleViewSellerProducts = async (seller) => {
    setSellerProductsSeller(seller);
    setSellerProductsModalOpen(true);
    setSellerProductsLoading(true);
    setSellerProductsError(null);
    try {
      const resp = await getSellerProducts(seller._id);
      const list = Array.isArray(resp?.data) ? resp.data : Array.isArray(resp) ? resp : Array.isArray(resp?.products) ? resp.products : [];
      setSellerProducts(list);
    } catch (err) {
      console.error('Error fetching seller products:', err);
      setSellerProductsError(err.message || 'Failed to load products');
      setSellerProducts([]);
    } finally {
      setSellerProductsLoading(false);
    }
  };





  const updateOrderStatus = async (orderId, newStatus) => {
    try {
      const token = localStorage.getItem('adminToken');
      const API_BASE_URL = import.meta.env.VITE_API_URL?.replace('/api', '') || 'http://localhost:5000';
      const response = await fetch(`${API_BASE_URL}/api/orders/${orderId}/status`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ status: newStatus })
      });

      if (response.ok) {
        fetchDashboardData(); // Refresh data
        alert('Order status updated successfully!');
      } else {
        alert('Failed to update order status');
      }
    } catch (error) {
      console.error('Error updating order status:', error);
      alert('Error updating order status');
    }
  };

  // Delete all orders (Admin)
  const handleDeleteAllOrders = async () => {
    try {
      const token = localStorage.getItem('adminToken');
      if (!token) {
        navigate('/admin/login');
        return;
      }
      const confirmDelete = window.confirm('Kya aap sure hain? Saare orders delete ho jayenge aur ye action undo nahi ho sakta.');
      if (!confirmDelete) return;
      const headers = {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      };
      const API_BASE_URL = import.meta.env.VITE_API_URL?.replace('/api', '') || 'http://localhost:5000';
      const resp = await fetch(`${API_BASE_URL}/api/dashboard/orders/all`, { method: 'DELETE', headers });
      if (!resp.ok) {
        const err = await resp.json().catch(() => ({}));
        alert(err.message || 'Saare orders delete karne me problem aayi');
        return;
      }
      const data = await resp.json().catch(() => ({}));
      alert(`Deleted ${data.deletedCount || 0} orders.`);
      setOrders([]);
      // Refresh stats and other dashboard data
      fetchDashboardData();
    } catch (e) {
      console.error('Delete all orders failed:', e);
      alert('Delete all orders failed');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminUser');
    navigate('/admin/login');
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

  // File management functions
  const handleFileUpload = async (event) => {
    const files = Array.from(event.target.files);
    if (files.length === 0) return;

    setIsUploading(true);
    setUploadProgress(0);

    try {
      const token = localStorage.getItem('adminToken');
      const API_BASE_URL = import.meta.env.VITE_API_URL?.replace('/api', '') || 'http://localhost:5000';
      
      const formData = new FormData();
      files.forEach(file => {
        formData.append('files', file);
      });
      formData.append('category', 'admin-upload');
      formData.append('isPublic', 'true');

      const response = await fetch(`${API_BASE_URL}/api/files/upload-multiple`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData
      });

      if (response.ok) {
        const result = await response.json();
        alert(`Successfully uploaded ${result.files.length} files!`);
        fetchDashboardData(); // Refresh data
      } else {
        alert('Failed to upload files');
      }
    } catch (error) {
      console.error('Error uploading files:', error);
      alert('Error uploading files');
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
      event.target.value = ''; // Reset file input
    }
  };

  const handleDeleteFile = async (fileId) => {
    if (!confirm('Are you sure you want to delete this file?')) return;

    try {
      const token = localStorage.getItem('adminToken');
      const API_BASE_URL = import.meta.env.VITE_API_URL?.replace('/api', '') || 'http://localhost:5000';
      
      const response = await fetch(`${API_BASE_URL}/api/files/${fileId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        alert('File deleted successfully!');
        fetchDashboardData(); // Refresh data
      } else {
        alert('Failed to delete file');
      }
    } catch (error) {
      console.error('Error deleting file:', error);
      alert('Error deleting file');
    }
  };

  const handleDownloadFile = async (fileId, fileName) => {
    try {
      const token = localStorage.getItem('adminToken');
      const API_BASE_URL = import.meta.env.VITE_API_URL?.replace('/api', '') || 'http://localhost:5000';
      
      // Show downloading notification
      const downloadingToast = document.createElement('div');
      downloadingToast.className = 'fixed top-4 right-4 bg-blue-500 text-white px-6 py-3 rounded-lg shadow-lg z-50 transition-all duration-300';
      downloadingToast.innerHTML = `
        <div class="flex items-center space-x-3">
          <div class="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
          <span>Downloading ${fileName}...</span>
        </div>
      `;
      document.body.appendChild(downloadingToast);

      const response = await fetch(`${API_BASE_URL}/api/files/download/${fileId}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = fileName;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
        
        // Update notification to success
        downloadingToast.className = 'fixed top-4 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg z-50 transition-all duration-300';
        downloadingToast.innerHTML = `
          <div class="flex items-center space-x-3">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
            </svg>
            <span>${fileName} downloaded successfully!</span>
          </div>
        `;
        
        // Remove notification after 3 seconds
        setTimeout(() => {
          document.body.removeChild(downloadingToast);
        }, 3000);
        
        // Update download count in the UI
        setFiles(prevFiles => 
          prevFiles.map(file => 
            file._id === fileId ? { ...file, downloadCount: (file.downloadCount || 0) + 1 } : file
          )
        );
        
      } else {
        document.body.removeChild(downloadingToast);
        alert('Failed to download file');
      }
    } catch (error) {
      console.error('Error downloading file:', error);
      alert('Error downloading file');
    }
  };

  // Sellers handlers
  const refreshSellers = async () => {
    try {
      const token = localStorage.getItem('adminToken');
      const API_BASE_URL = import.meta.env.VITE_API_URL?.replace('/api', '') || 'http://localhost:5000';
      const res = await fetch(`${API_BASE_URL}/api/dashboard/sellers`, {
        headers: { ...(token ? { 'Authorization': `Bearer ${token}` } : {}) }
      });
      if (res.ok) {
        const data = await res.json();
        setSellers(data);
      }
    } catch (e) {
      console.error('Error refreshing sellers:', e);
    }
  };

  const handleDeleteSeller = async (sellerId) => {
    if (!sellerId) return;
    const ok = window.confirm('Are you sure you want to delete this seller and their products?');
    if (!ok) return;
    try {
      const resp = await adminDeleteSeller(sellerId);
      alert(resp?.message || 'Seller deleted successfully');
      // Clear selection if the deleted seller was open
      setSelectedSeller(prev => (prev && String(prev._id) === String(sellerId) ? null : prev));
      // Refresh list
      await refreshSellers();
    } catch (err) {
      console.error('Error deleting seller:', err);
      alert(err?.message || 'Failed to delete seller');
    }
  };
  const handleSelectSeller = async (sellerId) => {
    try {
      const token = localStorage.getItem('adminToken');
      const API_BASE_URL = import.meta.env.VITE_API_URL?.replace('/api', '') || 'http://localhost:5000';
      const response = await fetch(`${API_BASE_URL}/api/dashboard/sellers/${sellerId}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (response.ok) {
        const sellerDetails = await response.json();
        // API returns shape: { seller, summary }
        const sel = sellerDetails?.seller || sellerDetails;
        setSelectedSeller(sel);
        // Prefill edit form
        setEditSellerForm({
          name: sel.name || '',
          sellerName: sel.sellerName || '',
          email: sel.email || '',
          sellerHierarchyLevel: sel.sellerHierarchyLevel ?? 0,
          shopName: sel.verification?.shopName || '',
          phone: sel.verification?.phone || ''
        });
      } else {
        alert('Failed to fetch seller details');
      }
    } catch (error) {
      console.error('Error fetching seller details:', error);
      alert('Error fetching seller details');
    }
  };

  // Verify/approve/reject a seller's verification
  const handleVerifySeller = async (sellerId, action = 'approve') => {
    try {
      const token = localStorage.getItem('adminToken');
      if (!token) {
        alert('Admin session not found. Please login again.');
        navigate('/admin/login');
        return;
      }

      const API_BASE_URL = import.meta.env.VITE_API_URL?.replace('/api', '') || 'http://localhost:5000';
      // Normalize action to API expected values: 'approve' | 'reject'
      const actionLower = String(action).toLowerCase();
      const normalizedAction =
        actionLower === 'approved' ? 'approve' :
        actionLower === 'rejected' ? 'reject' :
        actionLower;

      const response = await fetch(`${API_BASE_URL}/api/dashboard/sellers/${sellerId}/verification`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ action: normalizedAction })
      });

      const data = await response.json().catch(() => ({}));
      if (response.ok) {
        alert(data.message || 'Seller verification updated successfully');
        // Refresh dashboard lists
        await fetchDashboardData();
        // If details modal is open for this seller, update it inline
        setSelectedSeller(prev => {
          if (!prev || prev._id !== sellerId) return prev;
          return {
            ...prev,
            verificationStatus: data?.data?.verificationStatus || (normalizedAction === 'approve' ? 'approved' : 'rejected'),
            verification: {
              ...(prev.verification || {}),
              reviewedAt: data?.data?.verification?.reviewedAt || new Date(),
              reviewerNote: data?.data?.verification?.reviewerNote || ''
            }
          };
        });
      } else {
        alert(data.message || 'Failed to update seller verification');
      }
    } catch (error) {
      console.error('Error verifying seller:', error);
      alert('Error verifying seller');
    }
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getFileIcon = (fileType) => {
    if (fileType.startsWith('image/')) {
      return 'M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z';
    } else if (fileType === 'application/pdf') {
      return 'M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z';
    } else {
      return 'M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
        </div>
  );
  };

  return (
    <div className="min-h-screen bg-white flex relative">
      
      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black/60 z-50 lg:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={`fixed lg:sticky top-0 left-0 z-40 w-72 lg:w-60 h-screen bg-white text-gray-800 shadow-sm border-r border-gray-200 flex flex-col transition-transform duration-300 ease-in-out ${
        isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
      }`}>
        {/* Header */}
        <div className="p-4 border-b border-gray-200 bg-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-gray-100 rounded-lg shadow-sm">
                <svg className="w-5 h-5 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <div>
                <h1 className="text-lg font-bold text-gray-800">Admin Dashboard</h1>
              </div>
            </div>
            {/* Close button for mobile */}
            <button
              onClick={() => setIsMobileMenuOpen(false)}
              className="lg:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors duration-200"
            >
              <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* Navigation */}
        <div className="flex-1 overflow-y-auto p-4 bg-white">
          <nav className="space-y-2">
            {/* Overview */}
            <button
              onClick={() => { setActiveTab('overview'); setIsMobileMenuOpen(false); }}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl font-medium text-sm transition-all duration-300 ${
                activeTab === 'overview'
                  ? 'bg-gray-100 text-gray-900 border border-gray-200'
                    : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
              }`}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
              <span>Overview</span>
            </button>

            {/* Customers */}
            <button
              onClick={() => { setActiveTab('customers'); setIsMobileMenuOpen(false); }}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl font-medium text-sm transition-all duration-300 ${
                activeTab === 'customers'
                  ? 'bg-gray-100 text-gray-900 border border-gray-200'
                    : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
              }`}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
              </svg>
              <span>Customers</span>
            </button>

            {/* Orders with dropdown */}
            <div className="space-y-1">
              <button
                onClick={() => setIsOrdersMenuOpen((prev) => !prev)}
                className={`w-full flex items-center justify-between px-4 py-3 rounded-xl font-medium text-sm transition-all duration-300 ${
                  activeTab === 'orders'
                    ? 'bg-gray-100 text-gray-900 border border-gray-200'
                    : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                }`}
              >
                <span className="flex items-center space-x-3">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                  </svg>
                  <span>Orders</span>
                </span>
                <svg className={`w-4 h-4 transition-transform ${isOrdersMenuOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              {isOrdersMenuOpen && (
                <div className="ml-6 space-y-2">
                   <button
                    onClick={() => { setActiveTab('orders'); setOrderStatusFilter('all'); setIsMobileMenuOpen(false); }}
                    className="w-full text-left px-3 py-2 text-sm rounded-lg text-gray-700 hover:text-gray-900 hover:bg-gray-100"
                  >
                    All Orders
                  </button>
                  <button
                    onClick={() => { setActiveTab('orders'); setOrderStatusFilter('pending'); setIsMobileMenuOpen(false); }}
                    className="w-full text-left px-3 py-2 text-sm rounded-lg text-gray-700 hover:text-gray-900 hover:bg-gray-100"
                  >
                    Pending
                  </button>
                  <button
                    onClick={() => { setActiveTab('orders'); setOrderStatusFilter('processing'); setIsMobileMenuOpen(false); }}
                    className="w-full text-left px-3 py-2 text-sm rounded-lg text-gray-700 hover:text-gray-900 hover:bg-gray-100"
                  >
                    Processing
                  </button>
                  <button
                    onClick={() => { setActiveTab('orders'); setOrderStatusFilter('delivered'); setIsMobileMenuOpen(false); }}
                    className="w-full text-left px-3 py-2 text-sm rounded-lg text-gray-700 hover:text-gray-900 hover:bg-gray-100"
                  >
                    Delivered
                  </button>
                  <button
                    onClick={() => { setActiveTab('orders'); setOrderStatusFilter('cancelled'); setIsMobileMenuOpen(false); }}
                    className="w-full text-left px-3 py-2 text-sm rounded-lg text-gray-700 hover:text-gray-900 hover:bg-gray-100"
                  >
                    Cancelled
                  </button>
                </div>
              )}
            </div>

            {/* Earnings */}
            <button
              onClick={() => { setActiveTab('earnings'); setIsMobileMenuOpen(false); }}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl font-medium text-sm transition-all duration-300 ${
                activeTab === 'earnings'
                  ? 'bg-gray-100 text-gray-900 border border-gray-200'
                    : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
              }`}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
              </svg>
              <span>Earnings</span>
            </button>

            {/* Products with dropdown */}
            <div className="space-y-1">
              <button
                onClick={() => setIsProductsMenuOpen((prev) => !prev)}
                className={`w-full flex items-center justify-between px-4 py-3 rounded-xl font-medium text-sm transition-all duration-300 ${
                  activeTab === 'products'
                    ? 'bg-gray-100 text-gray-900 border border-gray-200'
                    : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
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
                    onClick={() => { setActiveTab('products'); setShowManageSubModal(false); setShowAddProductModal(false); setIsMobileMenuOpen(false); }}
                    className="w-full text-left px-3 py-2 text-sm rounded-lg text-gray-700 hover:text-gray-900 hover:bg-gray-100"
                  >
                    View Products
                  </button>
                  <button
                    onClick={() => { setActiveTab('products'); setShowManageSubModal(true); setIsMobileMenuOpen(false); }}
                    className="w-full text-left px-3 py-2 text-sm rounded-lg text-gray-700 hover:text-gray-900 hover:bg-gray-100"
                  >
                    Manage Subcategories
                  </button>
                  <button
                    onClick={() => { setActiveTab('products'); setShowAddProductModal(true); setIsMobileMenuOpen(false); }}
                    className="w-full text-left px-3 py-2 text-sm rounded-lg text-gray-700 hover:text-gray-900 hover:bg-gray-100"
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
                  ? 'bg-gray-100 text-gray-900 border border-gray-200'
                    : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
              }`}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            <span>Files</span>
          </button>

            {/* Posters */}
            <button
              onClick={() => { setActiveTab('posters'); setIsMobileMenuOpen(false); }}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl font-medium text-sm transition-all duration-300 ${
                activeTab === 'posters'
                  ? 'bg-gray-100 text-gray-900 border border-gray-200'
                  : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
              }`}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <span>Posters</span>
            </button>

            {/* Banner */}
            <button
              onClick={() => { setActiveTab('banner'); setIsMobileMenuOpen(false); }}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl font-medium text-sm transition-all duration-300 ${
                activeTab === 'banner'
                  ? 'bg-gray-100 text-gray-900 border border-gray-200'
                  : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
              }`}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7h18M5 11h14M7 15h10" />
              </svg>
              <span>Banner</span>
            </button>

            {/* Sellers */}
            <button
              onClick={() => { setActiveTab('sellers'); setIsMobileMenuOpen(false); }}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl font-medium text-sm transition-all duration-300 ${
                activeTab === 'sellers'
                  ? 'bg-gray-100 text-gray-900 border border-gray-200'
                  : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
              }`}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5V4a2 2 0 00-2-2H7a2 2 0 00-2 2v16h5m7-10a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
              <span>Sellers</span>
            </button>

            {/* Recent Orders */}
            <button
              onClick={() => { setActiveTab('recent-orders'); setIsMobileMenuOpen(false); }}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl font-medium text-sm transition-all duration-300 ${
                activeTab === 'recent-orders'
                  ? 'bg-gray-100 text-gray-900 border border-gray-200'
                  : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
              }`}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>Recent Orders</span>
            </button>

            {/* Bulk Upload */}
            <button
              onClick={() => { setActiveTab('bulk-upload'); setIsMobileMenuOpen(false); }}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl font-medium text-sm transition-all duration-300 ${
                activeTab === 'bulk-upload'
                  ? 'bg-gray-100 text-gray-900 border border-gray-200'
                  : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
              }`}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
              </svg>
              <span>Bulk Upload</span>
            </button>

            {/* Notifications */}
            <button
              onClick={() => { setActiveTab('notifications'); setIsMobileMenuOpen(false); }}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl font-medium text-sm transition-all duration-300 ${
                activeTab === 'notifications'
                  ? 'bg-gray-100 text-gray-900 border border-gray-200'
                  : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
              }`}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-5 5v-5zM11 19H6a2 2 0 01-2-2V7a2 2 0 012-2h5m5 0v5" />
              </svg>
              <span>Notifications</span>
            </button>
          </nav>
        </div>



        {/* Logout Button */}
        <div className="p-4 border-t border-gray-200/50">
          <button
            onClick={handleLogout}
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
        <div className="hidden lg:flex bg-white shadow-sm border-b border-gray-200/50 p-4 items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="p-1.5 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg shadow-lg">
              <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <h1 className="text-lg font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">Dashboard</h1>
            <div className="hidden md:block ml-6 w-full flex-1 min-w-0 max-w-3xl">
              <div className="relative">
                <input
                  type="text"
                  value={headerSearchQuery}
                  onChange={(e) => { setHeaderSearchQuery(e.target.value); setShowHeaderSuggestions(true); }}
                  onFocus={() => setShowHeaderSuggestions(true)}
                  onBlur={() => setTimeout(() => setShowHeaderSuggestions(false), 150)}
                  placeholder="Seller name/ID, Order ID, Customer..."
                  className="w-full md:w-[900px] lg:w-[1000px] xl:w-[500px] px-4 py-2 text-base border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400 bg-white"
                />
                <svg className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-4.35-4.35M10 18a8 8 0 100-16 8 8 0 000 16z" />
                </svg>
                {showHeaderSuggestions && headerSearchQuery.length >= 1 && (
                  (() => {
                    const q = headerSearchQuery.trim().toLowerCase();
                    const sellerNames = (sellers || []).map(s => s.sellerName || s.name).filter(Boolean);
                    const sellerIds = (sellers || []).map(s => s._id).filter(Boolean).map(String);
                    const orderIds = (orders || []).map(o => String(o.orderId || o.id || o._id)).filter(Boolean);
                    const customerNames = (orders || []).map(o => o.customerName).filter(Boolean);
                    const pool = [...sellerNames, ...sellerIds, ...orderIds, ...customerNames].map(String);
                    const suggestions = Array.from(new Set(pool))
                      .filter(item => item.toLowerCase().startsWith(q))
                      .slice(0, 8);
                    return (
                      <div className="absolute z-10 mt-1 w-full bg-white border border-gray-200 rounded-lg shadow-md max-h-40 overflow-y-auto">
                        {suggestions.length > 0 ? suggestions.map((s, idx) => (
                          <button
                            key={idx}
                            type="button"
                            onMouseDown={() => { setHeaderSearchQuery(s); setShowHeaderSuggestions(false); }}
                            className="w-full text-left px-3 py-2 text-sm hover:bg-gray-100"
                          >
                            {s}
                          </button>
                        )) : (
                          <div className="px-3 py-2 text-xs text-gray-500">No matches</div>
                        )}
                      </div>
                    );
                  })()
                )}
              </div>
            </div>
          </div>
          
          {/* Admin User Profile */}
          <div className="flex items-center space-x-3">
            <div className="flex items-center space-x-2 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg px-3 py-2">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              <div className="text-left">
                <p className="text-xs font-medium text-gray-900">{adminUser?.name || 'Admin User'}</p>
                <p className="text-xs text-gray-500">{adminUser?.email || 'admin@printo.com'}</p>
              </div>
            </div>
            <button className="p-2 rounded-lg bg-gray-100 hover:bg-gray-200 transition-colors">
              <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Header */}
        <div className="lg:hidden bg-white shadow-sm border-b border-gray-200/50 p-3">
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
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <h1 className="text-lg font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">Admin Dashboard</h1>
            </div>
            <div className="ml-2 flex-1 min-w-0">
              <div className="relative">
                <input
                  type="text"
                  value={headerSearchQuery}
                  onChange={(e) => { setHeaderSearchQuery(e.target.value); setShowHeaderSuggestions(true); }}
                  onFocus={() => setShowHeaderSuggestions(true)}
                  onBlur={() => setTimeout(() => setShowHeaderSuggestions(false), 150)}
                  placeholder="Search seller/order/customer..."
                  className="w-full px-4 py-2 text-base border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400 bg-white"
                />
                {showHeaderSuggestions && headerSearchQuery.length >= 1 && (
                  (() => {
                    const q = headerSearchQuery.trim().toLowerCase();
                    const sellerNames = (sellers || []).map(s => s.sellerName || s.name).filter(Boolean);
                    const sellerIds = (sellers || []).map(s => s._id).filter(Boolean).map(String);
                    const orderIds = (orders || []).map(o => String(o.orderId || o.id || o._id)).filter(Boolean);
                    const customerNames = (orders || []).map(o => o.customerName).filter(Boolean);
                    const pool = [...sellerNames, ...sellerIds, ...orderIds, ...customerNames].map(String);
                    const suggestions = Array.from(new Set(pool))
                      .filter(item => item.toLowerCase().startsWith(q))
                      .slice(0, 8);
                    return (
                      <div className="absolute z-10 mt-1 w-full bg-white border border-gray-200 rounded-lg shadow-md max-h-40 overflow-y-auto">
                        {suggestions.length > 0 ? suggestions.map((s, idx) => (
                          <button
                            key={idx}
                            type="button"
                            onMouseDown={() => { setHeaderSearchQuery(s); setShowHeaderSuggestions(false); }}
                            className="w-full text-left px-3 py-2 text-sm hover:bg-gray-100"
                          >
                            {s}
                          </button>
                        )) : (
                          <div className="px-3 py-2 text-xs text-gray-500">No matches</div>
                        )}
                      </div>
                    );
                  })()
                )}
              </div>
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
          <div className="space-y-4">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 xs:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 lg:gap-4">
              <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg shadow-lg p-4 border border-blue-200/50 hover:shadow-xl transition-all duration-300">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs font-semibold text-blue-600 uppercase tracking-wide">Total Customers</p>
                    <p className="text-xl font-bold text-blue-900 mt-1">{stats.totalCustomers}</p>
                    <div className="flex items-center mt-1">
                      <div className="w-1.5 h-1.5 bg-green-400 rounded-full mr-1"></div>
                      <span className="text-xs text-blue-600">Active Users</span>
                    </div>
                  </div>
                  <div className="p-2 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg shadow-lg">
                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
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

              <div className="bg-gradient-to-br from-indigo-50 to-indigo-100 rounded-lg shadow-lg p-4 border border-indigo-200/50 hover:shadow-xl transition-all duration-300">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs font-semibold text-indigo-600 uppercase tracking-wide">Total Products</p>
                    <p className="text-xl font-bold text-indigo-900 mt-1">{stats.totalProducts}</p>
                    <div className="flex items-center mt-1">
                      <div className="w-1.5 h-1.5 bg-green-400 rounded-full mr-1"></div>
                      <span className="text-xs text-indigo-600">Active Products</span>
                    </div>
                  </div>
                  <div className="p-2 bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-lg shadow-lg">
                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                    </svg>
                  </div>
                </div>
              </div>
            </div>

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
                        <th className="px-4 py-2 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Customer Info</th>
                        <th className="px-4 py-2 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Items & Amount</th>
                        <th className="px-4 py-2 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Payment Date</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white/50 divide-y divide-gray-200/30">
                      {orders.slice(0, 5).map((order, index) => (
                        <tr key={order.id} className="hover:bg-gradient-to-r hover:from-blue-50/50 hover:to-purple-50/50 transition-all duration-200">
                          <td className="px-4 py-3 whitespace-nowrap text-sm">
                            <div className="flex items-center space-x-2">
                              <div className="w-8 h-8 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center text-white font-bold text-xs">
                                {order.customerName?.charAt(0) || 'U'}
                              </div>
                              <div>
                                <div className="font-semibold text-gray-900 text-sm">{order.customerName}</div>
                                <div className="text-xs text-gray-500">{order.customerEmail}</div>
                                <div className="text-xs text-gray-500">{order.customerPhone}</div>
                              </div>
                            </div>
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap text-sm">
                            <div>
                              <div className="font-bold text-base text-green-600">₹{order.total}</div>
                              <div className="text-xs text-gray-500 flex items-center mt-1">
                                <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                                </svg>
                                {order.items?.length || 0} items
                              </div>
                            </div>
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap text-sm">
                            <div>
                              <div className="text-gray-700 font-medium text-sm">{order.paymentDate ? new Date(order.paymentDate).toLocaleDateString() : new Date(order.createdAt).toLocaleDateString()}</div>
                              <button
                                onClick={() => openOrderModal(order)}
                                className="mt-1 bg-gradient-to-r from-blue-500 to-purple-600 text-white px-3 py-1 rounded-md text-xs font-medium hover:from-blue-600 hover:to-purple-700 transition-all duration-200 shadow-md hover:shadow-lg"
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
              
              {/* Bulk Upload Results */}
              {bulkUploadResults && (
                <div className="mt-6 bg-white rounded-lg shadow-lg border border-gray-200/50 p-6">
                  <h4 className="text-lg font-semibold text-gray-800 mb-4">Upload Results</h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                    <div className="bg-green-50 p-4 rounded-lg">
                      <div className="text-2xl font-bold text-green-600">{bulkUploadResults.successCount || 0}</div>
                      <div className="text-sm text-green-700">Successful</div>
                    </div>
                    <div className="bg-red-50 p-4 rounded-lg">
                      <div className="text-2xl font-bold text-red-600">{bulkUploadResults.errorCount || 0}</div>
                      <div className="text-sm text-red-700">Failed</div>
                    </div>
                    <div className="bg-blue-50 p-4 rounded-lg">
                      <div className="text-2xl font-bold text-blue-600">{bulkUploadResults.totalProcessed || 0}</div>
                      <div className="text-sm text-blue-700">Total</div>
                    </div>
                  </div>
                  
                  {bulkUploadResults.errors && bulkUploadResults.errors.length > 0 && (
                    <div className="mt-4">
                      <h5 className="font-medium text-red-800 mb-2">Errors:</h5>
                      <div className="bg-red-50 rounded-lg p-4 max-h-40 overflow-y-auto">
                        {bulkUploadResults.errors.map((error, index) => (
                          <div key={index} className="text-sm text-red-700 mb-1">
                            Row {error.row}: {error.message}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  {bulkUploadResults.message && (
                    <div className="mt-4 p-4 bg-blue-50 rounded-lg">
                      <p className="text-sm text-blue-700">{bulkUploadResults.message}</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Customers Tab */}
        {activeTab === 'customers' && (
          <div className="bg-white/70 backdrop-blur-sm rounded-lg shadow-lg border border-white/20">
            <div className="px-4 py-3 border-b border-gray-200/30">
              <div className="flex items-center space-x-2">
                <div className="w-6 h-6 bg-gradient-to-br from-green-400 to-blue-500 rounded-lg flex items-center justify-center">
                  <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                  </svg>
                </div>
                <h3 className="text-lg font-bold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">All Customers</h3>
              </div>
            </div>
            <div className="overflow-x-auto -mx-3 lg:mx-0">
              <div className="min-w-[700px] lg:min-w-0">
                <table className="min-w-full divide-y divide-gray-200/30">
                <thead className="bg-gradient-to-r from-green-50 to-blue-50">
                  <tr>
                    <th className="px-2 sm:px-4 py-2 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Name</th>
                    <th className="px-2 sm:px-4 py-2 text-left text-xs font-bold text-gray-700 uppercase tracking-wider hidden sm:table-cell">Email</th>
                    <th className="px-2 sm:px-4 py-2 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Orders</th>
                    <th className="px-2 sm:px-4 py-2 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Total Spent</th>
                    <th className="px-2 sm:px-4 py-2 text-left text-xs font-bold text-gray-700 uppercase tracking-wider hidden md:table-cell">Joined</th>
                  </tr>
                </thead>
                <tbody className="bg-white/50 divide-y divide-gray-200/30">
                  {customers.map((customer, index) => (
                    <tr key={customer.id} className="hover:bg-gradient-to-r hover:from-green-50/50 hover:to-blue-50/50 transition-all duration-200">
                      <td className="px-2 sm:px-4 py-3 text-sm">
                        <div className="flex items-center space-x-2">
                          <div className="w-8 h-8 bg-gradient-to-br from-green-400 to-blue-500 rounded-full flex items-center justify-center text-white font-bold text-xs">
                            {customer.name?.charAt(0) || 'U'}
                          </div>
                          <div>
                            <div className="font-semibold text-gray-900 text-sm">{customer.name}</div>
                            <div className="sm:hidden text-xs text-gray-500">{customer.email}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-2 sm:px-4 py-3 whitespace-nowrap text-sm text-gray-700 font-medium hidden sm:table-cell">{customer.email}</td>
                      <td className="px-2 sm:px-4 py-3 whitespace-nowrap text-sm">
                        <span className="bg-gradient-to-r from-blue-100 to-purple-100 text-blue-800 px-2 py-1 rounded-full text-xs font-semibold">
                          {customer.orderCount}
                        </span>
                      </td>
                      <td className="px-2 sm:px-4 py-3 whitespace-nowrap text-sm font-bold text-green-600">₹{customer.totalSpent}</td>
                      <td className="px-2 sm:px-4 py-3 whitespace-nowrap text-sm text-gray-600 font-medium hidden md:table-cell">{new Date(customer.createdAt).toLocaleDateString()}</td>
                    </tr>
                  ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Orders Tab */}
        {activeTab === 'orders' && (
          <div className="bg-white/70 backdrop-blur-sm rounded-lg shadow-lg border border-white/20">
            <div className="px-4 py-3 border-b border-gray-200/30">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <div className="w-6 h-6 bg-gradient-to-br from-purple-400 to-pink-500 rounded-lg flex items-center justify-center">
                    <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">All Orders</h3>
                </div>
                <div className="relative w-full max-w-xs">
                  <input
                    type="text"
                    value={orderSearchQuery}
                    onChange={(e) => { setOrderSearchQuery(e.target.value); setShowOrderSuggestions(true); }}
                    onFocus={() => setShowOrderSuggestions(true)}
                    onBlur={() => setTimeout(() => setShowOrderSuggestions(false), 150)}
                    placeholder="Search customer name..."
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400 bg-white"
                  />
                  {showOrderSuggestions && orderSearchQuery.length >= 1 && (
                    <div className="absolute z-10 mt-1 w-full bg-white border border-gray-200 rounded-lg shadow-md max-h-40 overflow-y-auto">
                      {Array.from(new Set(orders.map(o => o.customerName).filter(Boolean)))
                        .filter(name => name.toLowerCase().startsWith(orderSearchQuery.toLowerCase()))
                        .slice(0, 8)
                        .map((name, idx) => (
                          <button
                            key={idx}
                            type="button"
                            onMouseDown={() => { setOrderSearchQuery(name); setShowOrderSuggestions(false); }}
                            className="w-full text-left px-3 py-2 text-sm hover:bg-gray-100"
                          >
                            {name}
                          </button>
                        ))}
                      {Array.from(new Set(orders.map(o => o.customerName).filter(Boolean)))
                        .filter(name => name.toLowerCase().startsWith(orderSearchQuery.toLowerCase())).length === 0 && (
                        <div className="px-3 py-2 text-xs text-gray-500">No matches</div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
            <div className="overflow-x-auto -mx-3 lg:mx-0">
              <div className="min-w-[800px] lg:min-w-0">
                <table className="min-w-full divide-y divide-gray-200/30">
                <thead className="bg-gradient-to-r from-purple-50 to-pink-50">
                  <tr>
                    <th className="px-2 sm:px-4 py-2 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Customer</th>
                    <th className="px-2 sm:px-4 py-2 text-left text-xs font-bold text-gray-700 uppercase tracking-wider hidden md:table-cell">Contact</th>
                    <th className="px-2 sm:px-4 py-2 text-left text-xs font-bold text-gray-700 uppercase tracking-wider hidden lg:table-cell">Address</th>
                    <th className="px-2 sm:px-4 py-2 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Items</th>
                    <th className="px-2 sm:px-4 py-2 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Amount</th>
                    <th className="px-2 sm:px-4 py-2 text-left text-xs font-bold text-gray-700 uppercase tracking-wider hidden sm:table-cell">Date</th>
                    <th className="px-2 sm:px-4 py-2 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white/50 divide-y divide-gray-200/30">
                  {orders
                    .filter((o) => {
                      const f = (orderStatusFilter || 'all').toLowerCase();
                      if (f !== 'all' && (o.status || '').toLowerCase() !== f) return false;
                      const q1 = orderSearchQuery?.trim().toLowerCase();
                      const q2 = headerSearchQuery?.trim().toLowerCase();
                      const q = (q1 || q2 || '').toLowerCase();
                      if (!q) return true;
                      const idStr = String(o.id || o._id || '').toLowerCase();
                      const email = (o.customerEmail || '').toLowerCase();
                      const phone = String(o.customerPhone || '').toLowerCase();
                      const addr = (o.customerAddress || '').toLowerCase();
                      const city = (o.customerCity || '').toLowerCase();
                      const pincode = String(o.customerPincode || '').toLowerCase();
                      const itemsStr = (o.items || []).map(i => (i.name || '')).join(' ').toLowerCase();
                      return (
                        (o.customerName || '').toLowerCase().includes(q) ||
                        idStr.includes(q) ||
                        email.includes(q) ||
                        phone.includes(q) ||
                        addr.includes(q) ||
                        city.includes(q) ||
                        pincode.includes(q) ||
                        itemsStr.includes(q)
                      );
                    })
                    .map((order, index) => (
                     <tr key={order.id} className="hover:bg-gradient-to-r hover:from-purple-50/50 hover:to-pink-50/50 transition-all duration-200">
                       <td className="px-2 sm:px-4 py-3 whitespace-nowrap text-sm">
                         <div className="flex items-center space-x-2">
                           <div className="w-8 h-8 bg-gradient-to-br from-purple-400 to-pink-500 rounded-full flex items-center justify-center text-white font-bold text-xs">
                             {order.customerName?.charAt(0) || 'U'}
                           </div>
                          <div className="font-semibold text-gray-900 text-sm">{order.customerName}</div>
                        </div>
                      </td>
                      <td className="px-2 sm:px-4 py-3 whitespace-nowrap text-sm hidden md:table-cell">
                        <div>
                          {order.customerEmail && <div className="text-xs text-gray-600 font-medium">{order.customerEmail}</div>}
                          {order.customerPhone && <div className="text-xs text-gray-600 font-medium">{order.customerPhone}</div>}
                        </div>
                      </td>
                      <td className="px-2 sm:px-4 py-3 whitespace-nowrap text-sm hidden lg:table-cell">
                        <div className="text-xs text-gray-600">
                          {order.customerAddress && <div className="font-medium">{order.customerAddress}</div>}
                          {order.customerCity && <div className="font-medium">{order.customerCity}</div>}
                          {order.customerPincode && <div className="font-medium">PIN: {order.customerPincode}</div>}
                        </div>
                      </td>
                      <td className="px-2 sm:px-4 py-3 whitespace-nowrap text-sm">
                        <div>
                          <div className="font-semibold text-gray-900 text-sm">{order.items?.length || 0} items</div>
                          <div className="text-xs text-gray-500 mt-1">
                            {order.items?.map(item => item.name).join(', ')}
                          </div>
                        </div>
                      </td>
                      <td className="px-2 sm:px-4 py-3 whitespace-nowrap text-sm font-bold text-green-600">₹{order.total}</td>
                      <td className="px-2 sm:px-4 py-3 whitespace-nowrap text-sm text-gray-600 font-medium hidden sm:table-cell">
                        {order.paymentDate ? new Date(order.paymentDate).toLocaleDateString() : new Date(order.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-2 sm:px-4 py-3 whitespace-nowrap text-sm font-medium">
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

        {/* Earnings Tab */}
        {activeTab === 'earnings' && (
          <div className="space-y-4">
            {/* Header and Range Toggle */}
            <div className="bg-white/70 backdrop-blur-sm rounded-lg shadow-lg border border-gray-200/50">
              <div className="px-4 py-3 border-b border-gray-200/50 flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <div className="p-1.5 bg-gradient-to-r from-purple-500 to-indigo-600 rounded-lg">
                    <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">Earnings</h3>
                </div>
                <div className="flex items-center space-x-2">
                  {['weekly','monthly','yearly'].map((r) => (
                    <button
                      key={r}
                      onClick={() => setEarningsRange(r)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${earningsRange === r ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-md' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
                    >
                      {r.charAt(0).toUpperCase() + r.slice(1)}
                    </button>
                  ))}
                </div>
              </div>

              {/* Summary Cards */}
              <div className="p-4 grid grid-cols-1 xs:grid-cols-2 md:grid-cols-3 gap-3">
                <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg shadow-lg p-4 border border-green-200/50">
                  <p className="text-xs font-semibold text-green-700 uppercase">Earned</p>
                  <p className="text-xl font-bold text-green-900 mt-1">₹{adminEarningsData?.totalEarned || 0}</p>
                </div>
                <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg shadow-lg p-4 border border-blue-200/50">
                  <p className="text-xs font-semibold text-blue-700 uppercase">Upcoming</p>
                  <p className="text-xl font-bold text-blue-900 mt-1">₹{adminEarningsData?.totalUpcoming || 0}</p>
                </div>
                <div className="bg-gradient-to-br from-red-50 to-red-100 rounded-lg shadow-lg p-4 border border-red-200/50">
                  <p className="text-xs font-semibold text-red-700 uppercase">Cancelled</p>
                  <p className="text-xl font-bold text-red-900 mt-1">₹{adminEarningsData?.totalCancelled || 0}</p>
                </div>
              </div>
            </div>

            {/* Breakdown Table */}
            <div className="bg-white/70 backdrop-blur-sm rounded-lg shadow-lg border border-gray-200/50">
              <div className="px-4 py-3 border-b border-gray-200/50 flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <div className="p-1.5 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-lg">
                    <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">Breakdown</h3>
                </div>
                {adminEarningsLoading && <span className="text-xs text-gray-500">Loading...</span>}
              </div>
              <div className="overflow-x-auto -mx-3 lg:mx-0">
                <div className="min-w-[700px] lg:min-w-0">
                  {adminEarningsData?.breakdown?.length ? (
                    <table className="min-w-full divide-y divide-gray-200/50">
                      <thead className="bg-gradient-to-r from-gray-50 to-gray-100">
                        <tr>
                          <th className="px-2 sm:px-4 py-2 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Period</th>
                          <th className="px-2 sm:px-4 py-2 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Earned</th>
                          <th className="px-2 sm:px-4 py-2 text-left text-xs font-bold text-gray-700 uppercase tracking-wider hidden sm:table-cell">Upcoming</th>
                          <th className="px-2 sm:px-4 py-2 text-left text-xs font-bold text-gray-700 uppercase tracking-wider hidden md:table-cell">Cancelled</th>
                          <th className="px-2 sm:px-4 py-2 text-left text-xs font-bold text-gray-700 uppercase tracking-wider hidden lg:table-cell">Orders</th>
                        </tr>
                      </thead>
                      <tbody className="bg-white/50 divide-y divide-gray-200/30">
                        {adminEarningsData.breakdown.map((row, idx) => (
                          <tr key={idx} className="hover:bg-gradient-to-r hover:from-blue-50/50 hover:to-purple-50/50 transition-all duration-200">
                            <td className="px-2 sm:px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900">{row.label}</td>
                            <td className="px-2 sm:px-4 py-3 whitespace-nowrap text-sm font-bold text-green-600">₹{row.earned || 0}</td>
                            <td className="px-2 sm:px-4 py-3 whitespace-nowrap text-sm font-bold text-blue-600 hidden sm:table-cell">₹{row.upcoming || 0}</td>
                            <td className="px-2 sm:px-4 py-3 whitespace-nowrap text-sm font-bold text-red-600 hidden md:table-cell">₹{row.cancelled || 0}</td>
                            <td className="px-2 sm:px-4 py-3 whitespace-nowrap text-sm text-gray-700 hidden lg:table-cell">{row.count || 0}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  ) : (
                    <div className="p-4 text-sm text-gray-600">No earnings data found for selected range.</div>
                  )}
                </div>
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
                <h3 className="text-lg font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">All Products</h3>
                <div className="ml-auto flex items-center space-x-3">
                  <div className="text-sm text-gray-600 font-medium">
                    Total Products: {Object.values(products).flat().length}
                  </div>
                  <button
                    onClick={handleOpenManageSub}
                    className="bg-gradient-to-r from-indigo-500 to-indigo-600 hover:from-indigo-600 hover:to-indigo-700 text-white px-4 py-2 rounded-lg font-medium transition-all duration-200 flex items-center space-x-2 shadow-lg hover:shadow-xl"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7h18M3 12h12M3 17h6" />
                    </svg>
                    <span>Manage Subcategories</span>
                  </button>
                  <button
                    onClick={() => setShowAddProductModal(true)}
                    className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white px-4 py-2 rounded-lg font-medium transition-all duration-200 flex items-center space-x-2 shadow-lg hover:shadow-xl"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                    <span>Add Product</span>
                  </button>
                  {/* <button
                    onClick={() => setShowDeleteAllModal(true)}
                    className="bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white px-4 py-2 rounded-lg font-medium transition-all duration-200 flex items-center space-x-2 shadow-lg hover:shadow-xl"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                    <span>Delete All Products</span>
                  </button> */}
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
                    <th className="px-4 py-2 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Color variants</th>
                    <th className="px-4 py-2 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Size variants</th>
                    <th className="px-4 py-2 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Status</th>
                    <th className="px-4 py-2 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white/50 divide-y divide-gray-200/30">
                  {Object.entries(products).flatMap(([category, categoryProducts]) => 
                    categoryProducts.map((product) => (
                      <tr key={`${category}-${product._id}`} className="hover:bg-gradient-to-r hover:from-blue-50/50 hover:to-purple-50/50 transition-all duration-200">
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
                            <div className="font-semibold text-gray-900 text-sm capitalize">{category}</div>
                            <div className="text-xs text-gray-500">{getSubcategoryName(product.subcategory)}</div>
                          </div>
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm font-bold text-green-600">₹{product.price}</td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm">
                          <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
                            {Number(product.stockQuantity || 0)} in stock
                          </span>
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm">
                          <div className="flex items-center space-x-2">
                            {Array.isArray(product.colorVarients) && product.colorVarients.length > 0 ? (
                              <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
                                {product.colorVarients
                                  .map((v) => (typeof v === 'string' ? v : (v?.color || '')))
                                  .filter(Boolean)
                                  .join(', ')}
                              </span>
                            ) : (
                              <span className="text-xs text-gray-500">No colors</span>
                            )}
                          </div>
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm">
                          <div className="flex items-center space-x-2">
                            {Array.isArray(product.sizeVarients) && product.sizeVarients.length > 0 ? (
                              <span className="bg-purple-100 text-purple-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
                                {product.sizeVarients.join(', ')}
                              </span>
                            ) : (
                              <span className="text-xs text-gray-500">No sizes</span>
                            )}
                          </div>
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
                              onClick={() => handleEditProduct({ ...product, category })}
                              className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:from-indigo-600 hover:to-purple-700 transition-all duration-200 shadow-md hover:shadow-lg transform hover:-translate-y-0.5 touch-manipulation min-w-[80px]"
                            >
                              Edit
                            </button>
                            <button
                              onClick={() => handleDeleteProduct(product._id, category)}
                              className="bg-gradient-to-r from-red-500 to-red-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:from-red-600 hover:to-red-700 transition-all duration-200 shadow-md hover:shadow-lg transform hover:-translate-y-0.5 touch-manipulation min-w-[80px]"
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
            </div>
          </div>
          </div>
        )}

        {showManageSubModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl max-w-3xl w-full max-h-[80vh] overflow-y-auto">
              <div className="px-6 py-4 border-b border-gray-200 bg-gradient-to-r from-indigo-600 to-purple-600">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-bold text-white">Manage Subcategories</h2>
                  <button onClick={() => setShowManageSubModal(false)} className="text-white hover:text-gray-200 transition-colors">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              </div>
              <div className="p-6 space-y-6">
                <form onSubmit={handleCreateSub} className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="md:col-span-1">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Category *</label>
                    <select
                      value={subForm.category}
                      onChange={async (e) => {
                        const v = e.target.value;
                        setSubForm(prev => ({ ...prev, category: v }));
                        // Fetch current commission for selected category
                        try {
                          const res = await listCategoryCommissions();
                          const row = (res?.data || []).find(r => r.category === v);
                          setCategoryCommission(prev => ({ ...prev, [v]: row ? Number(row.commissionPercent || 2) : 2 }));
                        } catch {}
                      }}
                      className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    >
                      <option value="">Select Category</option>
                      {subCategories.map(c => (
                        <option key={c} value={c}>
                          {c === 'l-mart' ? 'E-market' : c === 'news' ? 'Market News' : c}
                        </option>
                      ))}
                    </select>
                  </div>
                  {/* Category Commission Editor */}
                  <div className="md:col-span-1">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Category Commission (%)</label>
                    <div className="flex items-center space-x-2">
                      <input
                        type="number"
                        min={0}
                        max={100}
                        step={0.5}
                        value={categoryCommission[subForm.category] ?? ''}
                        onChange={(e) => {
                          const v = e.target.value;
                          setCategoryCommission(prev => ({ ...prev, [subForm.category]: v }));
                        }}
                        className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        placeholder="e.g., 2"
                        disabled={!subForm.category}
                      />
                      <button
                        type="button"
                        onClick={async () => {
                          if (!subForm.category) return;
                          const val = Number(categoryCommission[subForm.category]);
                          if (Number.isNaN(val) || val < 0 || val > 100) return alert('Commission must be 0–100');
                          try {
                            await setCategoryCommissionApi(subForm.category, val);
                            alert('Commission saved');
                          } catch (err) {
                            alert(err?.message || 'Failed to save commission');
                          }
                        }}
                        className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white px-4 py-2 rounded-lg font-medium hover:from-indigo-600 hover:to-purple-700 transition-all duration-200 disabled:opacity-50"
                        disabled={!subForm.category}
                      >
                        Save
                      </button>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">Ye commission category ke liye set hoga. Seller ko product add karte waqt automatic dikh jayega.</p>
                  </div>
                  <div className="md:col-span-1">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Subcategory Name *</label>
                    <input
                      type="text"
                      value={subForm.name}
                      onChange={(e) => setSubForm(prev => ({ ...prev, name: e.target.value }))}
                      className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      placeholder="e.g., Laptops, Stationery"
                    />
                  </div>
                  {/* Subcategory Image (optional) */}
                  <div className="md:col-span-1">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Image (optional)</label>
                    <div className="flex items-center space-x-3">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => {
                          const file = e.target.files?.[0] || null;
                          if (!file) return setSubForm(prev => ({ ...prev, image: null, preview: null }));
                          setSubForm(prev => ({ ...prev, image: file }));
                          const reader = new FileReader();
                          reader.onload = () => setSubForm(prev => ({ ...prev, preview: reader.result }));
                          reader.readAsDataURL(file);
                        }}
                        className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      />
                      {subForm.preview && (
                        <img src={subForm.preview} alt="Preview" className="w-12 h-12 object-cover rounded" />
                      )}
                    </div>
                    <p className="text-xs text-gray-500 mt-1">Image subcategory ke saath show hoga.</p>
                  </div>
                  <div className="md:col-span-1 flex items-end">
                    <button type="submit" className="w-full bg-gradient-to-r from-indigo-500 to-purple-600 text-white px-4 py-2 rounded-lg font-medium hover:from-indigo-600 hover:to-purple-700 transition-all duration-200">
                      Add Subcategory
                    </button>
                  </div>
                </form>
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-3">Existing Subcategories</h3>
                  <div className="overflow-x-auto -mx-3 lg:mx-0">
                    <div className="min-w-[600px] lg:min-w-0">
                      <table className="min-w-full divide-y divide-gray-200/30">
                        <thead className="bg-gradient-to-r from-gray-50 to-gray-100">
                          <tr>
                            <th className="px-4 py-2 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Category</th>
                            <th className="px-4 py-2 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Subcategory</th>
                            <th className="px-4 py-2 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Actions</th>
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200/30">
                          {subList.map(sub => (
                            <tr key={sub._id} className="hover:bg-gradient-to-r hover:from-gray-50/50 hover:to-gray-50/50 transition-all duration-200">
                              <td className="px-4 py-2 text-sm capitalize">{sub.category === 'l-mart' ? 'L-mart' : sub.category}</td>
                              <td className="px-4 py-2 text-sm">{sub.name}</td>
                              <td className="px-4 py-2 text-sm">
                                <button
                                  onClick={() => handleDeleteSub(sub._id)}
                                  className="bg-gradient-to-r from-red-500 to-red-600 text-white px-3 py-1.5 rounded-lg text-xs font-medium hover:from-red-600 hover:to-red-700 transition-all duration-200"
                                >
                                  Delete
                                </button>
                              </td>
                            </tr>
                          ))}
                          {subList.length === 0 && (
                            <tr>
                              <td className="px-4 py-3 text-sm text-gray-500" colSpan={3}>No subcategories yet</td>
                            </tr>
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Files Tab */}
        {activeTab === 'files' && (
          <div className="space-y-6">
            {/* File Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-gradient-to-br from-indigo-50 to-indigo-100 rounded-lg shadow-lg p-4 border border-indigo-200/50 hover:shadow-xl transition-all duration-300">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs font-semibold text-indigo-600 uppercase tracking-wide">Total Files</p>
                    <p className="text-xl font-bold text-indigo-900 mt-1">{fileStats.totalFiles}</p>
                  </div>
                  <div className="p-2 bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-lg shadow-lg">
                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg shadow-lg p-4 border border-green-200/50 hover:shadow-xl transition-all duration-300">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs font-semibold text-green-600 uppercase tracking-wide">Total Size</p>
                    <p className="text-xl font-bold text-green-900 mt-1">{formatFileSize(fileStats.totalSize)}</p>
                  </div>
                  <div className="p-2 bg-gradient-to-br from-green-500 to-green-600 rounded-lg shadow-lg">
                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 19l3 3m0 0l3-3m-3 3V10" />
                    </svg>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-lg shadow-lg p-4 border border-orange-200/50 hover:shadow-xl transition-all duration-300">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs font-semibold text-orange-600 uppercase tracking-wide">Downloads</p>
                    <p className="text-xl font-bold text-orange-900 mt-1">{fileStats.totalDownloads}</p>
                  </div>
                  <div className="p-2 bg-gradient-to-br from-orange-500 to-orange-600 rounded-lg shadow-lg">
                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>
                </div>
              </div>
            </div>

            {/* Recent Downloads Section */}
            <div className="bg-white rounded-lg shadow-lg p-6 border border-gray-200/50">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-gray-800">Recent Downloads</h3>
                <div className="flex items-center space-x-2">
                  <div className="p-2 bg-gradient-to-br from-green-500 to-green-600 rounded-lg shadow-lg">
                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>
                </div>
              </div>
              <div className="bg-gradient-to-r from-green-50 to-blue-50 p-4 rounded-lg border border-green-200/30">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-gradient-to-br from-green-500 to-blue-600 rounded-lg flex items-center justify-center">
                    <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-800">Files are downloaded to your browser's default download folder</p>
                    <p className="text-xs text-gray-600 mt-1">💡 Tip: You can change your browser's download settings to specify a custom folder</p>
                  </div>
                </div>
                <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div className="bg-white/70 p-3 rounded-lg">
                    <h4 className="text-sm font-semibold text-gray-700 mb-2">For Chrome:</h4>
                    <p className="text-xs text-gray-600">Settings → Advanced → Downloads → Location</p>
                  </div>
                  <div className="bg-white/70 p-3 rounded-lg">
                    <h4 className="text-sm font-semibold text-gray-700 mb-2">For Firefox:</h4>
                    <p className="text-xs text-gray-600">Settings → General → Files and Applications</p>
                  </div>
                </div>
              </div>
            </div>

            {/* File Upload Section */}
            <div className="bg-white rounded-lg shadow-lg p-6 border border-gray-200/50">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-gray-800">Upload Files</h3>
                <div className="flex items-center space-x-2">
                  <input
                    type="file"
                    multiple
                    onChange={handleFileUpload}
                    disabled={isUploading}
                    className="hidden"
                    id="file-upload"
                    accept=".pdf,.doc,.docx,.jpg,.jpeg,.png,.gif,.txt,.zip,.rar"
                  />
                  <label
                    htmlFor="file-upload"
                    className={`bg-gradient-to-r from-blue-500 to-purple-600 text-white px-4 py-2 rounded-lg font-medium cursor-pointer hover:from-blue-600 hover:to-purple-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 ${
                      isUploading ? 'opacity-50 cursor-not-allowed' : ''
                    }`}
                  >
                    {isUploading ? 'Uploading...' : 'Choose Files'}
                  </label>
                </div>
              </div>
              {isUploading && (
                <div className="mb-4">
                  <div className="bg-gray-200 rounded-full h-2">
                    <div className="bg-gradient-to-r from-blue-500 to-purple-600 h-2 rounded-full transition-all duration-300" style={{ width: `${uploadProgress}%` }}></div>
                  </div>
                </div>
              )}
            </div>

            {/* Files List */}
            <div className="bg-white rounded-lg shadow-lg border border-gray-200/50 overflow-hidden">
              <div className="px-6 py-4 bg-gradient-to-r from-gray-50 to-gray-100 border-b border-gray-200/50">
                <h3 className="text-lg font-bold text-gray-800">All Files ({files.length})</h3>
              </div>
              <div className="overflow-x-auto -mx-3 lg:mx-0">
                <div className="min-w-[800px] lg:min-w-0">
                  <table className="min-w-full divide-y divide-gray-200/50">
                  <thead className="bg-gradient-to-r from-gray-50 to-gray-100">
                    <tr>
                      <th className="px-2 sm:px-6 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">File</th>
                      <th className="px-2 sm:px-6 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider hidden sm:table-cell">Type</th>
                      <th className="px-2 sm:px-6 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider hidden md:table-cell">Size</th>
                      <th className="px-2 sm:px-6 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider hidden lg:table-cell">Downloads</th>
                      <th className="px-2 sm:px-6 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider hidden lg:table-cell">Uploaded</th>
                      <th className="px-2 sm:px-6 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200/30">
                    {files.map((file) => (
                      <tr key={file._id} className="hover:bg-gray-50/50 transition-all duration-200">
                        <td className="px-2 sm:px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="flex-shrink-0 h-8 w-8">
                              <div className="h-8 w-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                                <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={getFileIcon(file.fileType)} />
                                </svg>
                              </div>
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-medium text-gray-900">{file.originalName}</div>
                              <div className="text-sm text-gray-500">{file.category}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-2 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-500 hidden sm:table-cell">
                          <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-gray-100 text-gray-800">
                            {file.fileType.split('/')[1]?.toUpperCase() || 'FILE'}
                          </span>
                        </td>
                        <td className="px-2 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-500 hidden md:table-cell">{formatFileSize(file.fileSize)}</td>
                        <td className="px-2 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-500 hidden lg:table-cell">
                          <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
                            {file.downloadCount}
                          </span>
                        </td>
                        <td className="px-2 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-500 hidden lg:table-cell">
                          {new Date(file.createdAt).toLocaleDateString()}
                        </td>
                        <td className="px-2 sm:px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <div className="flex space-x-2">
                            <button
                              onClick={() => handleDownloadFile(file._id, file.originalName)}
                              className="bg-gradient-to-r from-green-500 to-green-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:from-green-600 hover:to-green-700 transition-all duration-200 shadow-md hover:shadow-lg transform hover:-translate-y-0.5 touch-manipulation min-w-[90px]"
                            >
                              Download
                            </button>
                            <button
                              onClick={() => handleDeleteFile(file._id)}
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
          </div>
        )}

        {/* Posters Tab */}
        {activeTab === 'posters' && (
          <div className="space-y-6">
            {/* Poster Manager */}
            <div className="bg-white rounded-lg shadow-lg p-6 border border-gray-200/50">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-gray-800">Poster Manager</h3>
              </div>
              <form onSubmit={handlePosterCreate} className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Title (optional)</label>
                  <input
                    type="text"
                    value={posterTitle}
                    onChange={(e) => setPosterTitle(e.target.value)}
                    className="mt-1 w-full border rounded-md px-3 py-2"
                    placeholder="Poster title"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Image</label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => setPosterFile(e.target.files[0] || null)}
                    className="mt-1 w-full"
                  />
                </div>
                <div>
                  <button
                    type="submit"
                    disabled={posterUploading}
                    className={`bg-gradient-to-r from-blue-500 to-purple-600 text-white px-4 py-2 rounded-lg font-medium hover:from-blue-600 hover:to-purple-700 transition-all duration-200 shadow-lg hover:shadow-xl ${posterUploading ? 'opacity-50 cursor-not-allowed' : ''}`}
                  >
                    {posterUploading ? 'Uploading...' : 'Add Poster'}
                  </button>
                </div>
              </form>

              {/* Posters Grid */}
              <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {posters.map((poster) => (
                  <div key={poster._id} className="rounded-lg border border-gray-200 overflow-hidden bg-white shadow-sm">
                    <div className="aspect-[16/9] bg-gray-100">
                      <img src={poster.imageUrl} alt={poster.title || 'Poster'} className="w-full h-full object-cover" />
                    </div>
                    <div className="p-3 flex items-center justify-between">
                      <div>
                        <p className="text-sm font-semibold text-gray-800">{poster.title || 'Poster'}</p>
                        <p className="text-xs text-gray-500">{new Date(poster.createdAt).toLocaleString()}</p>
                      </div>
                      <button
                        onClick={() => handlePosterDelete(poster._id)}
                        className="bg-gradient-to-r from-red-500 to-red-600 text-white px-3 py-1.5 rounded-lg text-xs font-medium hover:from-red-600 hover:to-red-700 transition-all duration-200"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
                {posters.length === 0 && (
                  <div className="col-span-full text-sm text-gray-500">No posters yet</div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Banner Tab */}
        {activeTab === 'banner' && (
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow-lg p-6 border border-gray-200/50">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-gray-800">Banner</h3>
              </div>

              {/* Step 1: Select Product */}
              <div className="mb-6">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="text-md font-semibold text-gray-700">First, please select a product.</h4>
                  {selectedBannerProduct && (
                    <button
                      className="text-xs px-3 py-1 rounded-md bg-gray-100 hover:bg-gray-200 text-gray-700"
                      onClick={() => { setSelectedBannerProduct(null); setProductBanners([]); }}
                    >
                      Clear selection
                    </button>
                  )}
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  {Object.entries(products).flatMap(([cat, list]) => list.map(p => (
                    <div
                      key={p._id}
                      className={`cursor-pointer rounded-lg border ${selectedBannerProduct?._id === p._id ? 'border-blue-500' : 'border-gray-200'} bg-white shadow-sm hover:shadow-md transition`}
                      onClick={() => handleSelectBannerProduct({ ...p, category: cat })}
                    >
                      <div className="p-3 flex items-center space-x-3">
                        <div className="w-12 h-12 rounded-md overflow-hidden border border-gray-200 bg-gray-50">
                          <img src={p.image} alt={p.name} className="w-full h-full object-cover" />
                        </div>
                        <div className="flex-1">
                          <div className="text-sm font-semibold text-gray-800">{p.name}</div>
                          <div className="text-xs text-gray-500 capitalize">{cat}</div>
                        </div>
                      </div>
                    </div>
                  )))}
                  {Object.values(products).flat().length === 0 && (
                    <div className="col-span-full text-sm text-gray-500">No products available</div>
                  )}
                </div>
              </div>

              {/* Step 2: Fill Banner Details for selected product */}
              {selectedBannerProduct && (
                <div className="mt-4">
                  <div className="mb-4 p-4 rounded-md bg-blue-50 border border-blue-200">
                    <div className="flex items-center space-x-3">
                      <div className="w-12 h-12 rounded-md overflow-hidden border border-blue-200 bg-white">
                        <img src={selectedBannerProduct.image} alt={selectedBannerProduct.name} className="w-full h-full object-cover" />
                      </div>
                      <div>
                        <div className="text-sm font-bold text-blue-800">Selected: {selectedBannerProduct.name}</div>
                        <div className="text-xs text-blue-700 capitalize">Category: {selectedBannerProduct.category}</div>
                      </div>
                    </div>
                  </div>

                  <form onSubmit={handleBannerSave} className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Banner Name</label>
                      <input
                        type="text"
                        value={bannerName}
                        onChange={(e) => setBannerName(e.target.value)}
                        className="mt-1 w-full border rounded-md px-3 py-2"
                        placeholder="Enter banner name"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Image Title</label>
                      <input
                        type="text"
                        value={bannerImageTitle}
                        onChange={(e) => setBannerImageTitle(e.target.value)}
                        className="mt-1 w-full border rounded-md px-3 py-2"
                        placeholder="Enter image title"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Banner Image</label>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => setBannerImageFile(e.target.files?.[0] || null)}
                        className="mt-1 w-full border rounded-md px-3 py-2"
                      />
                      {bannerImageFile && (
                        <div className="mt-3 border rounded-md overflow-hidden bg-gray-50">
                          <div className="p-2 text-xs font-medium text-gray-700">Preview (uploaded image shown in banner)</div>
                          <img
                            src={URL.createObjectURL(bannerImageFile)}
                            alt={bannerImageTitle || 'Banner preview'}
                            className="w-full h-32 object-contain bg-white"
                          />
                        </div>
                      )}
                    </div>
                    <div>
                      <button
                        type="submit"
                        className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-4 py-2 rounded-lg font-medium hover:from-blue-600 hover:to-purple-700 transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-60"
                        disabled={bannerUploading}
                      >
                        {bannerUploading ? 'Saving...' : 'Save'}
                      </button>
                    </div>
                  </form>

                  {/* Existing banners for this product */}
                  <div className="mt-6">
                    <h4 className="text-md font-semibold text-gray-700 mb-2">Banners of this product.</h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                      {productBanners.map((b) => (
                        <div key={b._id} className="rounded-lg border border-gray-200 overflow-hidden bg-white shadow-sm">
                          <div className="aspect-[16/9] bg-gray-100">
                            <img src={b.imageUrl} alt={b.imageTitle || 'Banner'} className="w-full h-full object-cover" />
                          </div>
                          <div className="p-3">
                            <p className="text-sm font-semibold text-gray-800">{b.name || 'Banner'}</p>
                            <p className="text-xs text-gray-500">{b.imageTitle || ''}</p>
                          </div>
                        </div>
                      ))}
                      {productBanners.length === 0 && (
                        <div className="col-span-full text-sm text-gray-500">No banners for this product yet</div>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Sellers Tab */}
       

{/* Sellers Tab */}
{activeTab === 'sellers' && (
  <div className="space-y-6">
    {/* Sellers Summary Cards */}
    

    {/* Sellers List */}
    <div className="bg-white rounded-lg shadow-lg border border-gray-200/50 overflow-hidden">
      <div className="px-6 py-4 bg-gradient-to-r from-gray-50 to-gray-100 border-b border-gray-200/50">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-bold text-gray-800">All Sellers ({sellers.length})</h3>
          <div className="flex items-center space-x-2">
            <button className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-4 py-2 rounded-lg font-medium hover:from-blue-600 hover:to-purple-700 transition-all duration-200 flex items-center space-x-2">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              <span>Add Seller</span>
            </button>
          </div>
        </div>
      </div>
      
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200/50">
          <thead className="bg-gradient-to-r from-gray-50 to-gray-100">
            <tr>
              <th className="px-2 sm:px-6 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Seller</th>
              <th className="px-2 sm:px-6 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider hidden md:table-cell">Contact</th>
              <th className="px-2 sm:px-6 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider hidden lg:table-cell">Verification</th>
              <th className="px-2 sm:px-6 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider hidden lg:table-cell">Business</th>
              
              <th className="px-2 sm:px-6 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200/30">
            {sellers
              .filter((seller) => {
                const q = headerSearchQuery?.trim().toLowerCase();
                if (!q) return true;
                return (
                  (seller.sellerName && seller.sellerName.toLowerCase().includes(q)) ||
                  (seller._id && String(seller._id).toLowerCase().includes(q))
                );
              })
              .map((seller) => (
              <tr key={seller._id} className="hover:bg-gray-50/50 transition-all duration-200">
                {/* Seller Info */}
                <td className="px-2 sm:px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 h-10 w-10">
                      <div className="h-10 w-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold">
                        {seller.sellerName?.charAt(0) || seller.name?.charAt(0) || 'S'}
                      </div>
                    </div>
                    <div className="ml-4">
                      <div className="text-sm font-medium text-gray-900">
                        {seller.sellerName || seller.name}
                      </div>
                      <div className="text-sm text-gray-500">
                        Level: {seller.sellerHierarchyLevel ?? 0}
                      </div>
                      {seller.parentSeller && (
                        <div className="text-xs text-gray-400">
                          Parent: {seller.parentSeller?.sellerName || seller.parentSeller?.name}
                        </div>
                      )}
                    </div>
                  </div>
                </td>

                {/* Contact Info */}
                <td className="px-2 sm:px-6 py-4 whitespace-nowrap hidden md:table-cell">
                  <div className="text-sm text-gray-900">{seller.email}</div>
                  {seller.verification?.phone && (
                    <div className="text-sm text-gray-500">{seller.verification.phone}</div>
                  )}
                  <div className="text-xs text-gray-400">
                    Joined: {new Date(seller.registeredOn || seller.createdAt).toLocaleDateString()}
                  </div>
                </td>

                {/* Verification Status */}
                <td className="px-2 sm:px-6 py-4 whitespace-nowrap hidden lg:table-cell">
                  <div className="flex flex-col space-y-2">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      seller.verificationStatus === 'approved' 
                        ? 'bg-green-100 text-green-800'
                        : seller.verificationStatus === 'pending'
                        ? 'bg-yellow-100 text-yellow-800'
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {seller.verificationStatus?.toUpperCase() || 'PENDING'}
                    </span>
                    {seller.verification?.submittedAt && (
                      <div className="text-xs text-gray-500">
                        Submitted: {new Date(seller.verification.submittedAt).toLocaleDateString()}
                      </div>
                    )}
                  </div>
                </td>

                {/* Business Info */}
                <td className="px-2 sm:px-6 py-4 whitespace-nowrap hidden lg:table-cell">
                  <div className="text-sm text-gray-900">
                    {seller.verification?.shopName || 'No Shop Name'}
                  </div>
                  <div className="text-xs text-gray-500">
                    Login Count: {seller.loginCount || 0}
                  </div>
                </td>

                {/* Performance */}
                

                {/* Actions */}
                <td className="px-2 sm:px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleSelectSeller(seller._id)}
                      className="bg-gradient-to-r from-blue-500 to-blue-600 text-white px-3 py-1.5 rounded-lg text-xs font-medium hover:from-blue-600 hover:to-blue-700 transition-all duration-200"
                    >
                      View
                    </button>
                    <button
                      onClick={() => handleViewSellerProducts(seller)}
                      className="bg-gradient-to-r from-teal-500 to-teal-600 text-white px-3 py-1.5 rounded-lg text-xs font-medium hover:from-teal-600 hover:to-teal-700 transition-all duration-200"
                    >
                      View Products
                    </button>
                    <button
                      onClick={() => { handleSelectSeller(seller._id); setShowEditSellerModal(true); }}
                      className="bg-gradient-to-r from-indigo-500 to-indigo-600 text-white px-3 py-1.5 rounded-lg text-xs font-medium hover:from-indigo-600 hover:to-indigo-700 transition-all duration-200"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDeleteSeller(seller._id)}
                      className="bg-gradient-to-r from-red-500 to-red-600 text-white px-3 py-1.5 rounded-lg text-xs font-medium hover:from-red-600 hover:to-red-700 transition-all duration-200"
                    >
                      Delete
                    </button>
                    <button
                      onClick={() => handleVerifySeller(seller._id)}
                      className="bg-gradient-to-r from-green-500 to-green-600 text-white px-3 py-1.5 rounded-lg text-xs font-medium hover:from-green-600 hover:to-green-700 transition-all duration-200"
                    >
                      Verify
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        
        {sellers.length === 0 && (
          <div className="text-center py-8">
            <div className="text-gray-500">No sellers found</div>
          </div>
        )}
      </div>
    </div>

    {/* Seller Details Modal */}
    {selectedSeller && (
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm overflow-y-auto h-full w-full z-50 flex items-center justify-center p-4">
        <div className="relative w-full max-w-4xl max-h-[90vh] overflow-y-auto mx-auto p-6 shadow-2xl rounded-2xl bg-white/90 backdrop-blur-md border border-white/20">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-2xl font-bold text-gray-800">Seller Details</h3>
            <button
              onClick={() => setSelectedSeller(null)}
              className="text-gray-400 hover:text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-full p-2 transition-all duration-200"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Basic Information */}
            <div className="space-y-4">
              <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-4 rounded-lg border border-blue-200">
                <h4 className="font-bold text-gray-800 mb-3">Basic Information</h4>
                <div className="space-y-2">
                  <p><span className="font-semibold">Name:</span> {selectedSeller.sellerName || selectedSeller.name}</p>
                  <p><span className="font-semibold">Email:</span> {selectedSeller.email}</p>
                  <p><span className="font-semibold">Hierarchy Level:</span> {selectedSeller.sellerHierarchyLevel ?? 0}</p>
                  <p><span className="font-semibold">Registered On:</span> {new Date(selectedSeller.registeredOn || selectedSeller.createdAt).toLocaleDateString()}</p>
                </div>
              </div>

              {/* Business Information */}
              <div className="bg-gradient-to-br from-green-50 to-green-100 p-4 rounded-lg border border-green-200">
                <h4 className="font-bold text-gray-800 mb-3">Business Information</h4>
                <div className="space-y-2">
                  <p><span className="font-semibold">Shop Name:</span> {selectedSeller.verification?.shopName || 'Not provided'}</p>
                  <p><span className="font-semibold">Phone:</span> {selectedSeller.verification?.phone || 'Not provided'}</p>
                  <p className="flex items-center gap-3"><span className="font-semibold">Verification Status:</span> 
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      selectedSeller.verificationStatus === 'approved' 
                        ? 'bg-green-100 text-green-800'
                        : selectedSeller.verificationStatus === 'pending'
                        ? 'bg-yellow-100 text-yellow-800'
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {selectedSeller.verificationStatus?.toUpperCase() || 'PENDING'}
                    </span>
                    {/* Admin controls: Accepted / Rejected */}
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleVerifySeller(selectedSeller._id, 'approved')}
                        className="bg-gradient-to-r from-green-500 to-green-600 text-white px-2 py-1 rounded-md text-xs font-medium hover:from-green-600 hover:to-green-700 transition-all duration-200"
                        title="Mark as Accepted"
                      >
                        Accepted
                      </button>
                      <button
                        onClick={() => handleVerifySeller(selectedSeller._id, 'rejected')}
                        className="bg-gradient-to-r from-red-500 to-red-600 text-white px-2 py-1 rounded-md text-xs font-medium hover:from-red-600 hover:to-red-700 transition-all duration-200"
                        title="Mark as Rejected"
                      >
                        Rejected
                      </button>
                      <button
                        onClick={() => handleVerifySeller(selectedSeller._id, 'rejected')}
                        className="bg-gradient-to-r from-gray-700 to-gray-900 text-white px-2 py-1 rounded-md text-xs font-medium hover:from-gray-800 hover:to-black transition-all duration-200"
                        title="Block Seller"
                      >
                        Block Seller
                      </button>
                    </div>
                  </p>
                </div>
              </div>
            </div>

            {/* Verification Documents */}
            <div className="space-y-4">
              <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-4 rounded-lg border border-purple-200">
                <h4 className="font-bold text-gray-800 mb-3">Verification Documents</h4>
                <div className="space-y-3">
                  {selectedSeller.verification?.idProofUrl && (
                    <div>
                      <p className="font-semibold text-sm">ID Proof:</p>
                      <a 
                        href={(selectedSeller.verification.idProofUrl || '').replace(/`/g, '').trim()} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:text-blue-800 text-sm flex items-center space-x-1"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                        <span>View ID Proof</span>
                      </a>
                    </div>
                  )}
                  
                  {selectedSeller.verification?.addressProofUrl && (
                    <div>
                      <p className="font-semibold text-sm">Address Proof:</p>
                      <a 
                        href={(selectedSeller.verification.addressProofUrl || '').replace(/`/g, '').trim()} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:text-blue-800 text-sm flex items-center space-x-1"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                        <span>View Address Proof</span>
                      </a>
                    </div>
                  )}

                  {selectedSeller.verification?.businessProofUrl && (
                    <div>
                      <p className="font-semibold text-sm">Business Proof:</p>
                      <a 
                        href={(selectedSeller.verification.businessProofUrl || '').replace(/`/g, '').trim()} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:text-blue-800 text-sm flex items-center space-x-1"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                        <span>View Business Proof</span>
                      </a>
                    </div>
                  )}

                  {selectedSeller.verification?.bankProofUrl && (
                    <div>
                      <p className="font-semibold text-sm">Bank Proof:</p>
                      <a 
                        href={(selectedSeller.verification.bankProofUrl || '').replace(/`/g, '').trim()} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:text-blue-800 text-sm flex items-center space-x-1"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                        <span>View Bank Proof</span>
                      </a>
                    </div>
                  )}
                </div>
              </div>

              {/* Performance Stats */}
              <div className="bg-gradient-to-br from-orange-50 to-orange-100 p-4 rounded-lg border border-orange-200">
  <h4 className="font-bold text-gray-800 mb-3">Account Information</h4>
  <div className="grid grid-cols-2 gap-4">
    <div className="text-center">
      <p className="text-2xl font-bold text-blue-600">{selectedSeller.loginCount || 0}</p>
      <p className="text-sm text-gray-600">Login Count</p>
    </div>
    <div className="text-center">
      <p className="text-2xl font-bold text-purple-600">
        {selectedSeller.verificationStatus === 'approved' ? 'Verified' : 'Not Verified'}
      </p>
      <p className="text-sm text-gray-600">Status</p>
    </div>
  </div>
</div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="mt-6 flex justify-end space-x-3">
            <button
              onClick={() => setSelectedSeller(null)}
              className="bg-gradient-to-r from-gray-500 to-gray-600 text-white px-4 py-2 rounded-lg font-medium hover:from-gray-600 hover:to-gray-700 transition-all duration-200"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    )}

    {/* Edit Seller Modal */}
    {showEditSellerModal && selectedSeller && (
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm overflow-y-auto h-full w-full z-50 flex items-center justify-center p-4">
        <div className="relative w-full max-w-xl mx-auto p-6 shadow-2xl rounded-2xl bg-white/90 backdrop-blur-md border border-white/20">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-bold text-gray-800">Edit Seller</h3>
            <button
              onClick={() => setShowEditSellerModal(false)}
              className="text-gray-400 hover:text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-full p-2 transition-all duration-200"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <form
            onSubmit={async (e) => {
              e.preventDefault();
              try {
                const token = localStorage.getItem('adminToken');
                if (!token) { alert('Admin session expired'); navigate('/admin/login'); return; }
                const base = (import.meta.env.VITE_API_URL?.replace('/api', '') || 'http://localhost:5000');
                const res = await fetch(`${base}/api/dashboard/sellers/${selectedSeller._id}`, {
                  method: 'PUT',
                  headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
                  body: JSON.stringify(editSellerForm)
                });
                const data = await res.json().catch(() => ({}));
                if (res.ok) {
                  alert(data.message || 'Seller updated');
                  setShowEditSellerModal(false);
                  await fetchDashboardData();
                  // update selectedSeller inline
                  setSelectedSeller(data.data || selectedSeller);
                } else {
                  alert(data.message || 'Failed to update seller');
                }
              } catch (err) {
                console.error('Update seller error', err);
                alert('Error updating seller');
              }
            }}
            className="space-y-4"
          >
            <div>
              <label className="block text-sm font-medium text-gray-700">Name</label>
              <input
                type="text"
                value={editSellerForm.name}
                onChange={(e) => setEditSellerForm(prev => ({ ...prev, name: e.target.value }))}
                className="mt-1 w-full border rounded-md px-3 py-2"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Seller Name</label>
              <input
                type="text"
                value={editSellerForm.sellerName}
                onChange={(e) => setEditSellerForm(prev => ({ ...prev, sellerName: e.target.value }))}
                className="mt-1 w-full border rounded-md px-3 py-2"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Email</label>
              <input
                type="email"
                value={editSellerForm.email}
                onChange={(e) => setEditSellerForm(prev => ({ ...prev, email: e.target.value }))}
                className="mt-1 w-full border rounded-md px-3 py-2"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Hierarchy Level</label>
              <input
                type="number"
                value={editSellerForm.sellerHierarchyLevel}
                onChange={(e) => setEditSellerForm(prev => ({ ...prev, sellerHierarchyLevel: Number(e.target.value) }))}
                className="mt-1 w-full border rounded-md px-3 py-2"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Shop Name</label>
              <input
                type="text"
                value={editSellerForm.shopName}
                onChange={(e) => setEditSellerForm(prev => ({ ...prev, shopName: e.target.value }))}
                className="mt-1 w-full border rounded-md px-3 py-2"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Phone</label>
              <input
                type="text"
                value={editSellerForm.phone}
                onChange={(e) => setEditSellerForm(prev => ({ ...prev, phone: e.target.value }))}
                className="mt-1 w-full border rounded-md px-3 py-2"
              />
            </div>
            <div className="flex justify-end gap-3 pt-2">
              <button type="button" onClick={() => setShowEditSellerModal(false)} className="px-4 py-2 rounded-md bg-gray-100 text-gray-700">Cancel</button>
              <button type="submit" className="px-4 py-2 rounded-md bg-indigo-600 text-white">Save Changes</button>
            </div>
          </form>
        </div>
      </div>
    )}

    {/* Seller Products Modal */}
    {sellerProductsModalOpen && sellerProductsSeller && (
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm overflow-y-auto h-full w-full z-50 flex items-center justify-center p-4">
        <div className="relative w-full max-w-5xl max-h-[90vh] overflow-y-auto mx-auto p-6 shadow-2xl rounded-2xl bg-white/90 backdrop-blur-md border border-white/20">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h3 className="text-2xl font-bold text-gray-800">Seller Products</h3>
              <p className="text-sm text-gray-600 mt-1">
                Seller: <span className="font-semibold text-gray-800">{sellerProductsSeller.sellerName || sellerProductsSeller.name}</span> &middot; ID: <span className="font-mono text-gray-700">{sellerProductsSeller._id}</span>
              </p>
              <p className="text-sm text-gray-600">Total Products: <span className="font-semibold text-blue-700">{sellerProducts.length}</span></p>
            </div>
            <button
              onClick={() => { setSellerProductsModalOpen(false); setSellerProductsSeller(null); setSellerProducts([]); setSellerProductsError(null); }}
              className="text-gray-400 hover:text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-full p-2 transition-all duration-200"
              aria-label="Close"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {sellerProductsLoading ? (
            <div className="text-center py-10 text-gray-600">Loading products...</div>
          ) : sellerProductsError ? (
            <div className="text-center py-10 text-red-600">{sellerProductsError}</div>
          ) : (
            <div className="overflow-x-auto -mx-3 lg:mx-0">
              <div className="min-w-[900px] lg:min-w-0">
                <table className="min-w-full divide-y divide-gray-200/30">
                  <thead className="bg-gradient-to-r from-blue-50 to-purple-50">
                    <tr>
                      <th className="px-4 py-2 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Image</th>
                      <th className="px-4 py-2 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Name</th>
                      <th className="px-4 py-2 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Category</th>
                      <th className="px-4 py-2 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Price</th>
                      <th className="px-4 py-2 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Stock</th>
                      <th className="px-4 py-2 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Status</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white/50 divide-y divide-gray-200/30">
                    {sellerProducts.map((p) => (
                      <tr key={p._id} className="hover:bg-gradient-to-r hover:from-blue-50/50 hover:to-purple-50/50 transition-all duration-200">
                        <td className="px-4 py-3">
                          <div className="w-12 h-12 rounded-md overflow-hidden border border-gray-200 bg-gray-50">
                            <img
                              src={(p.imageUrl || p.image || (Array.isArray(p.images) ? p.images[0] : '')) || '/no-image.svg'}
                              alt={p.name || 'Product image'}
                              className="w-full h-full object-cover"
                              loading="lazy"
                              onError={(e) => { e.currentTarget.src = '/no-image.svg'; }}
                            />
                          </div>
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm font-semibold text-gray-900">{p.name}</td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700 capitalize">{p.category || '—'}</td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm font-bold text-green-600">₹{p.price}</td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm">
                          <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
                            {Number(p.stockQuantity || 0)} in stock
                          </span>
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm">
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${p.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                            {p.isActive ? 'Active' : 'Inactive'}
                          </span>
                        </td>
                      </tr>
                    ))}
                    {sellerProducts.length === 0 && !sellerProductsLoading && (
                      <tr>
                        <td className="px-4 py-6 text-center text-sm text-gray-500" colSpan={6}>No products found for this seller</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>
    )}
  </div>
)}

        {/* Recent Orders Tab */}
        {activeTab === 'recent-orders' && (
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow-lg border border-gray-200/50 overflow-hidden">
              <div className="px-6 py-4 bg-gradient-to-r from-gray-50 to-gray-100 border-b border-gray-200/50">
                <h3 className="text-lg font-bold text-gray-800">Recent Orders</h3>
              </div>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200/50">
                  <thead className="bg-gradient-to-r from-gray-50 to-gray-100">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Order ID</th>
                      <th className="px-6 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Customer</th>
                      <th className="px-6 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Amount</th>
                      <th className="px-6 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Status</th>
                      <th className="px-6 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Date</th>
                      <th className="px-6 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200/30">
                    {orders.slice(0, 10).map((order) => (
                      <tr key={order.id} className="hover:bg-gray-50/50 transition-all duration-200">
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-blue-600">
                          #{order.id}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {order.customerName}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          ₹{order.total || order.amount || 0}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(order.status)}`}>
                            {order.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {new Date(order.createdAt).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <button
                            onClick={() => openOrderModal(order)}
                            className="text-blue-600 hover:text-blue-900 mr-3"
                          >
                            View
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

        {/* Bulk Upload Tab */}
        {activeTab === 'bulk-upload' && (
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow-lg border border-gray-200/50 p-6">
              <div className="mb-6">
                <h3 className="text-lg font-bold text-gray-800 mb-2">Bulk Product Upload</h3>
                <p className="text-sm text-gray-600">Upload multiple products using CSV or Excel files</p>
              </div>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Upload Section */}
                <div className="space-y-4">
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-400 transition-colors">
                    <svg className="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48">
                      <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    <div className="mt-4">
                      <label htmlFor="bulk-upload" className="cursor-pointer">
                        <span className="mt-2 block text-sm font-medium text-gray-900">
                          Drop files here or click to upload
                        </span>
                        <span className="mt-1 block text-xs text-gray-500">
                          CSV or Excel files up to 10MB
                        </span>
                      </label>
                      <input
                        id="bulk-upload"
                        type="file"
                        className="hidden"
                        accept=".csv,.xlsx,.xls"
                        onChange={(e) => {
                          const file = e.target.files[0];
                          if (file) {
                            setBulkUploadFile(file);
                          }
                        }}
                      />
                    </div>
                  </div>
                  
                  {/* Selected File Display */}
                  {bulkUploadFile && (
                    <div className="bg-blue-50 rounded-lg p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <svg className="h-5 w-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                          </svg>
                          <span className="text-sm font-medium text-blue-800">{bulkUploadFile.name}</span>
                        </div>
                        <button
                          onClick={() => setBulkUploadFile(null)}
                          className="text-red-600 hover:text-red-800"
                        >
                          <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                      </div>
                    </div>
                  )}
                  
                  <button 
                    onClick={handleBulkUpload}
                    disabled={!bulkUploadFile || bulkUploadLoading}
                    className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white py-3 px-4 rounded-lg font-medium hover:from-blue-600 hover:to-purple-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {bulkUploadLoading ? 'Uploading...' : 'Upload Products'}
                  </button>
                </div>

                {/* Template Section */}
                <div className="space-y-4">
                  <h4 className="font-semibold text-gray-800">Download Template</h4>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <p className="text-sm text-gray-600 mb-3">
                      Download our template to ensure your data is formatted correctly.
                    </p>
                    <div className="flex flex-wrap gap-3">
                      <button 
                        onClick={downloadTemplate}
                        className="bg-green-500 text-white py-2 px-4 rounded-lg font-medium hover:bg-green-600 transition-colors"
                      >
                        Download Excel Template
                      </button>
                      <button 
                        onClick={downloadLocalCSVTemplate}
                        className="bg-blue-500 text-white py-2 px-4 rounded-lg font-medium hover:bg-blue-600 transition-colors"
                      >
                        Download CSV Template
                      </button>
                    </div>
                  </div>
                  
                  <div className="bg-blue-50 rounded-lg p-4">
                    <h5 className="font-medium text-blue-800 mb-2">Required Fields:</h5>
                    <ul className="text-sm text-blue-700 space-y-1">
                      <li>• Product Name</li>
                      <li>• Category</li>
                      <li>• Subcategory</li>
                      <li>• Price</li>
                      <li>• Description</li>
                      <li>• Image URL (optional)</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            {/* Bulk Upload Results */}
            {bulkUploadResults && (
              <div className="bg-white rounded-lg shadow-lg border border-gray-200/50 p-6">
                <h4 className="text-lg font-semibold text-gray-800 mb-4">Upload Results</h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                  <div className="bg-green-50 p-4 rounded-lg">
                    <div className="text-2xl font-bold text-green-600">{bulkUploadResults.successCount || 0}</div>
                    <div className="text-sm text-green-700">Successful</div>
                  </div>
                  <div className="bg-red-50 p-4 rounded-lg">
                    <div className="text-2xl font-bold text-red-600">{bulkUploadResults.errorCount || 0}</div>
                    <div className="text-sm text-red-700">Failed</div>
                  </div>
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <div className="text-2xl font-bold text-blue-600">{bulkUploadResults.totalProcessed || 0}</div>
                    <div className="text-sm text-blue-700">Total</div>
                  </div>
                </div>
                
                {bulkUploadResults.errors && bulkUploadResults.errors.length > 0 && (
                  <div className="mt-4">
                    <h5 className="font-medium text-red-800 mb-2">Errors:</h5>
                    <div className="bg-red-50 rounded-lg p-4 max-h-40 overflow-y-auto">
                      {bulkUploadResults.errors.map((error, index) => (
                        <div key={index} className="text-sm text-red-700 mb-1">
                          Row {error.row}: {error.message}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                
                {bulkUploadResults.message && (
                  <div className="mt-4 p-4 bg-blue-50 rounded-lg">
                    <p className="text-sm text-blue-700">{bulkUploadResults.message}</p>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* Notifications Tab */}
        {activeTab === 'notifications' && (
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow-lg border border-gray-200/50">
              <div className="px-6 py-4 bg-gradient-to-r from-gray-50 to-gray-100 border-b border-gray-200/50">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-bold text-gray-800">
                    Notifications {unreadCount > 0 && (
                      <span className="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                        {unreadCount} unread
                      </span>
                    )}
                  </h3>
                  <div className="flex items-center space-x-2">
                    <button 
                      onClick={handleMarkAllAsRead}
                      className="bg-gray-500 text-white px-4 py-2 rounded-lg font-medium hover:bg-gray-600 transition-colors"
                      disabled={unreadCount === 0}
                    >
                      Mark All Read
                    </button>
                  </div>
                </div>
              </div>
              
              <div className="divide-y divide-gray-200/30">
                {notificationsLoading ? (
                  <div className="p-6 text-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                    <p className="mt-2 text-sm text-gray-500">Loading notifications...</p>
                  </div>
                ) : notifications.length === 0 ? (
                  <div className="p-6 text-center">
                    <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-5 5-5-5h5v-5a7.5 7.5 0 1 0-15 0v5h5l-5 5-5-5h5V7a12 12 0 1 1 24 0v10z" />
                    </svg>
                    <p className="mt-2 text-sm text-gray-500">No notifications found</p>
                  </div>
                ) : (
                  notifications.map((notification) => (
                    <div 
                      key={notification._id} 
                      className={`p-6 hover:bg-gray-50/50 transition-colors cursor-pointer ${!notification.isRead ? 'bg-blue-50/30' : ''}`}
                      onClick={() => !notification.isRead && handleMarkAsRead(notification._id)}
                    >
                      <div className="flex items-start space-x-4">
                        <div className="flex-shrink-0">
                          <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                            notification.type === 'Seller' ? 'bg-green-100' :
                            notification.type === 'Order' ? 'bg-blue-100' :
                            notification.type === 'Product' ? 'bg-purple-100' :
                            'bg-gray-100'
                          }`}>
                            {notification.type === 'Seller' ? (
                              <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                              </svg>
                            ) : notification.type === 'Order' ? (
                              <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                              </svg>
                            ) : notification.type === 'Product' ? (
                              <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                              </svg>
                            ) : (
                              <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-5 5-5-5h5v-5a7.5 7.5 0 1 0-15 0v5h5l-5 5-5-5h5V7a12 12 0 1 1 24 0v10z" />
                              </svg>
                            )}
                          </div>
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <p className={`text-sm font-medium ${!notification.isRead ? 'text-gray-900' : 'text-gray-700'}`}>
                              {notification.title}
                            </p>
                            <div className="flex items-center space-x-2">
                              <p className="text-xs text-gray-500">
                                {new Date(notification.createdAt).toLocaleDateString('en-IN', {
                                  year: 'numeric',
                                  month: 'short',
                                  day: 'numeric',
                                  hour: '2-digit',
                                  minute: '2-digit'
                                })}
                              </p>
                              {!notification.isRead && (
                                <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                              )}
                            </div>
                          </div>
                          <p className="text-sm text-gray-600 mt-1">
                            {notification.message}
                          </p>
                          <div className="mt-2 flex items-center space-x-2">
                            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                              notification.priority === 'high' ? 'bg-red-100 text-red-800' :
                              notification.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                              'bg-green-100 text-green-800'
                            }`}>
                              {notification.priority.charAt(0).toUpperCase() + notification.priority.slice(1)} Priority
                            </span>
                            <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-gray-100 text-gray-800">
                              {notification.type}
                            </span>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                openNotificationModal(notification);
                              }}
                              className="text-xs text-blue-600 hover:text-blue-800"
                            >
                              View Details
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        )}

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
                      <p className="text-sm"><span className="font-semibold text-gray-700">Payment ID:</span> <span className="text-gray-600">{selectedOrder.paymentId}</span></p>
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
                            value={statusUpdate}
                            onChange={(e) => setStatusUpdate(e.target.value)}
                            className="px-3 py-2 border border-gray-300 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                          >
                            <option value="pending">Pending</option>
                            <option value="processing">Processing</option>
                            <option value="shipped">Shipped</option>
                            <option value="delivered">Delivered</option>
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
                          <th className="px-6 py-3 text-left text-xs font-bold text-gray-700 uppercase">Image</th>
                          <th className="px-6 py-3 text-left text-xs font-bold text-gray-700 uppercase">Item</th>
                          <th className="px-6 py-3 text-left text-xs font-bold text-gray-700 uppercase">Seller</th>
                          <th className="px-6 py-3 text-left text-xs font-bold text-gray-700 uppercase">Seller ID</th>
                          <th className="px-6 py-3 text-left text-xs font-bold text-gray-700 uppercase">Quantity</th>
                          <th className="px-6 py-3 text-left text-xs font-bold text-gray-700 uppercase">Price</th>
                          <th className="px-6 py-3 text-left text-xs font-bold text-gray-700 uppercase">Total</th>
                        </tr>
                      </thead>
                      <tbody className="bg-white/50 divide-y divide-gray-200/30">
                        {selectedOrder.items?.map((item, index) => (
                          <tr key={index} className="hover:bg-orange-50/50 transition-all duration-200">
                            <td className="px-6 py-3">
                              <div className="w-12 h-12 rounded-md overflow-hidden border border-gray-200 bg-gray-50">
                                <img
                                  src={(item.image || '').replace(/`/g, '').trim() || '/no-image.svg'}
                                  alt={item.name || 'Product image'}
                                  className="w-full h-full object-cover"
                                  loading="lazy"
                                  referrerPolicy="no-referrer"
                                  onError={(e) => { e.currentTarget.src = '/no-image.svg'; }}
                                />
                              </div>
                            </td>
                            <td className="px-6 py-4 text-sm font-semibold text-gray-900">
                              <div>{item.name}</div>
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
                            </td>
                            <td className="px-6 py-4 text-sm text-gray-700">
                              <span className="text-xs bg-orange-100 text-orange-800 px-2 py-1 rounded">
                                {item.sellerId ? 'Seller' : 'Admin'}
                              </span>
                            </td>
                            <td className="px-6 py-4 text-xs text-gray-500">
                              {item.sellerId || '—'}
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
      {showAddProductModal && (
        <AddProductModal
          isOpen={showAddProductModal}
          onClose={() => setShowAddProductModal(false)}
          onProductAdded={handleProductAdded}
        />
      )}

      {/* Edit Product Modal */}
      {showEditProductModal && editingProduct && (
        <EditProductModal
          isOpen={showEditProductModal}
          onClose={() => { setShowEditProductModal(false); setEditingProduct(null); }}
          product={editingProduct}
          onProductUpdated={handleProductUpdated}
        />
      )}

      {/* Notification Detail Modal */}
      {showNotificationModal && selectedNotification && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm overflow-y-auto h-full w-full z-50 flex items-center justify-center p-4">
          <div className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto mx-auto p-4 sm:p-6 lg:p-8 shadow-2xl rounded-2xl bg-white/90 backdrop-blur-md border border-white/20">
            <div className="mt-3">
              <div className="flex justify-between items-center mb-6">
                <div className="flex items-center space-x-3">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                    selectedNotification.type === 'Seller' ? 'bg-green-100' :
                    selectedNotification.type === 'Order' ? 'bg-blue-100' :
                    selectedNotification.type === 'Product' ? 'bg-purple-100' :
                    'bg-gray-100'
                  }`}>
                    {selectedNotification.type === 'Seller' ? (
                      <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                    ) : selectedNotification.type === 'Order' ? (
                      <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                      </svg>
                    ) : selectedNotification.type === 'Product' ? (
                      <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                      </svg>
                    ) : (
                      <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-5 5-5-5h5v-5a7.5 7.5 0 1 0-15 0v5h5l-5 5-5-5h5V7a12 12 0 1 1 24 0v10z" />
                      </svg>
                    )}
                  </div>
                  <h3 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                    Notification Details
                  </h3>
                </div>
                <button
                  onClick={closeNotificationModal}
                  className="text-gray-400 hover:text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-full p-3 transition-all duration-200"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              
              <div className="space-y-6">
                {/* Basic Information */}
                <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-6 border border-blue-100">
                  <h4 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                    <svg className="w-5 h-5 mr-2 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    Basic Information
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-600 mb-1">Title</label>
                      <p className="text-sm text-gray-900 bg-white rounded-lg px-3 py-2 border">{selectedNotification.title}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-600 mb-1">Type</label>
                      <p className="text-sm text-gray-900 bg-white rounded-lg px-3 py-2 border">{selectedNotification.type}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-600 mb-1">Priority</label>
                      <span className={`inline-flex px-3 py-1 text-sm font-semibold rounded-full ${
                        selectedNotification.priority === 'high' ? 'bg-red-100 text-red-800' :
                        selectedNotification.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-green-100 text-green-800'
                      }`}>
                        {selectedNotification.priority.charAt(0).toUpperCase() + selectedNotification.priority.slice(1)}
                      </span>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-600 mb-1">Status</label>
                      <span className={`inline-flex px-3 py-1 text-sm font-semibold rounded-full ${
                        selectedNotification.isRead ? 'bg-gray-100 text-gray-800' : 'bg-blue-100 text-blue-800'
                      }`}>
                        {selectedNotification.isRead ? 'Read' : 'Unread'}
                      </span>
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-600 mb-1">Message</label>
                      <p className="text-sm text-gray-900 bg-white rounded-lg px-3 py-2 border">{selectedNotification.message}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-600 mb-1">Created At</label>
                      <p className="text-sm text-gray-900 bg-white rounded-lg px-3 py-2 border">
                        {new Date(selectedNotification.createdAt).toLocaleDateString('en-IN', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-600 mb-1">Notification ID</label>
                      <p className="text-sm text-gray-900 bg-white rounded-lg px-3 py-2 border font-mono">{selectedNotification._id}</p>
                    </div>
                  </div>
                </div>

                {/* Seller Information (if type is Seller) */}
                {selectedNotification.type === 'Seller' && selectedNotification.metadata && (
                  <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-6 border border-green-100">
                    <h4 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                      <svg className="w-5 h-5 mr-2 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                      Seller Information
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-600 mb-1">Seller Name</label>
                        <p className="text-sm text-gray-900 bg-white rounded-lg px-3 py-2 border">
                          {selectedNotification.metadata.sellerName || 'N/A'}
                        </p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-600 mb-1">Email</label>
                        <p className="text-sm text-gray-900 bg-white rounded-lg px-3 py-2 border">
                          {selectedNotification.metadata.sellerEmail || 'N/A'}
                        </p>
                      </div>
                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-600 mb-1">Registration Date</label>
                        <p className="text-sm text-gray-900 bg-white rounded-lg px-3 py-2 border">
                          {selectedNotification.metadata.registrationDate ? 
                            new Date(selectedNotification.metadata.registrationDate).toLocaleDateString('en-IN', {
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit'
                            }) : 'N/A'
                          }
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex justify-between items-center pt-4 border-t border-gray-200">
                  <div className="flex space-x-3">
                    {!selectedNotification.isRead && (
                      <button
                        onClick={() => {
                          handleMarkAsRead(selectedNotification._id);
                          closeNotificationModal();
                        }}
                        className="bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors"
                      >
                        Mark as Read
                      </button>
                    )}
                    {selectedNotification.actionUrl && (
                      <a
                        href={selectedNotification.actionUrl}
                        className="bg-green-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-green-700 transition-colors"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        Go to Page
                      </a>
                    )}
                  </div>
                  <button
                    onClick={closeNotificationModal}
                    className="bg-gray-500 text-white px-4 py-2 rounded-lg font-medium hover:bg-gray-600 transition-colors"
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Delete All Products Confirmation Modal */}
      {showDeleteAllModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Delete All Products</h3>
                <p className="text-sm text-gray-500">This action cannot be undone</p>
              </div>
            </div>
            
            <div className="mb-6">
              <p className="text-gray-700">
                Are you sure you want to delete <strong>ALL products</strong> from the database? 
                This will permanently remove all products across all categories.
              </p>
              <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-sm text-red-800 font-medium">
                  ⚠️ Warning: This action is irreversible and will delete all products permanently.
                </p>
              </div>
            </div>
            
            <div className="flex space-x-3">
              <button
                onClick={() => setShowDeleteAllModal(false)}
                disabled={deleteAllLoading}
                className="flex-1 bg-gray-500 text-white px-4 py-2 rounded-lg font-medium hover:bg-gray-600 transition-colors disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteAllProducts}
                disabled={deleteAllLoading}
                className="flex-1 bg-red-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-red-700 transition-colors disabled:opacity-50 flex items-center justify-center space-x-2"
              >
                {deleteAllLoading ? (
                  <>
                    <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <span>Deleting...</span>
                  </>
                ) : (
                  <span>Delete All Products</span>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  </div>
  </div>
  );
};

export default AdminDashboard;