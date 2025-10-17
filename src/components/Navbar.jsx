import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useCart } from "../context/CartContext";
import logo from "../assets/newlmart.png";
import { getCurrentUser, logoutUser } from "../services/authService";
import { searchProducts } from "../services/productService";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const profileRef = useRef(null);
  const navigate = useNavigate();
  const location = useLocation();
  const [searchTerm, setSearchTerm] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [isSuggestOpen, setIsSuggestOpen] = useState(false);
  const [suggestLoading, setSuggestLoading] = useState(false);
  const suggestionRef = useRef(null);
  const {
    getCartItemsCount,
    items,
    removeFromCart,
    updateQuantity,
    getCartTotal,
    clearCorruptedCart,
    selectedIds,
    isSelected,
    toggleSelect,
    selectAll,
    deselectAll,
    getSelectedTotal,
    getSelectedItemsCount,
  } = useCart();
  const cartItemsCount = getCartItemsCount();

  // NEW: track which nav path should be highlighted (supports product detail pages)
  const [highlightPath, setHighlightPath] = useState(location.pathname);

  useEffect(() => {
    const user = getCurrentUser();
    setCurrentUser(user);
  }, [location.pathname]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setIsProfileOpen(false);
      }
      if (suggestionRef.current && !suggestionRef.current.contains(event.target)) {
        setIsSuggestOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Debounced live product search for suggestions
  useEffect(() => {
    const term = searchTerm.trim();
    if (!term) {
      setSuggestions([]);
      setIsSuggestOpen(false);
      return;
    }
    setSuggestLoading(true);
    const handle = setTimeout(async () => {
      try {
        const res = await searchProducts(term);
        const list = res?.data || (Array.isArray(res) ? res : res?.products) || [];
        setSuggestions(list.slice(0, 8));
        setIsSuggestOpen(true);
      } catch (e) {
        setSuggestions([]);
        setIsSuggestOpen(false);
      } finally {
        setSuggestLoading(false);
      }
    }, 300);
    return () => clearTimeout(handle);
  }, [searchTerm]);

  // NEW: map product category to navbar route
  const mapCategoryToNavPath = (category) => {
    const c = String(category || '').toLowerCase();
    if (["localmarket", "local-market"].includes(c)) return "/local-market";
    if (["printing", "print"].includes(c)) return "/printing";
    if (["news", "news-today"].includes(c)) return "/news-today";
    // default group: E-Market / L-mart
    return "/e-market";
  };

  // NEW: set highlightPath based on current route; if product detail, derive from product category
  useEffect(() => {
    const path = location.pathname || "/";
    if (path.startsWith("/product/")) {
      const productId = path.split("/").pop();
      const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";
      const headers = { "Content-Type": "application/json" };
      const token = localStorage.getItem("adminToken");
      if (token) headers["Authorization"] = `Bearer ${token}`;
      fetch(`${API_BASE_URL}/products/single/${productId}`, { method: "GET", headers })
        .then((res) => res.json())
        .then((data) => {
          const cat = data?.data?.category;
          setHighlightPath(mapCategoryToNavPath(cat));
        })
        .catch(() => setHighlightPath("/e-market"));
    } else {
      setHighlightPath(path);
    }
  }, [location.pathname]);

  return (
    <div className="bg-white shadow-sm">
      {/* Navigation Menu */}

      {/* Top Header */}
<div className="container-responsive transition-all duration-500 bg-gradient-to-r from-[#04044C] via-[#1E3A8A] to-[#6D28D9]">

        <div className="flex justify-between items-center py-1">
          {/* Logo and Brand */}
          <div className="flex items-center space-x-3">
            <div className="relative transform transition-transform duration-300 hover:scale-110">
              <img
                src={logo}
                alt="L-mart Logo"
                className="w-14 h-14 sm:w-40 sm:h-16 object-contain transition-all duration-300 hover:brightness-110 hover:drop-shadow-lg cursor-pointer"
                onClick={() => navigate("/")}
              />
            </div>
          </div>

          {/* Contact and Icons - Hidden on mobile */}
          <div className="hidden md:flex items-center space-x-6">
            <div className="text-lg text-white font-bold">📞 9880444189</div>
            {/* Become a Seller CTA (Desktop) */}
            <Link
              to="/seller/login"
              className="bg-yellow-400 text-gray-900 px-3 py-1 rounded-full font-semibold shadow-sm hover:bg-yellow-300 transition-colors"
            >
              Become a Seller
            </Link>

            <div className="flex space-x-3">
              <button
                onClick={() => navigate("/")}
                className="w-8 h-8 border border-purple-300 rounded-full flex items-center justify-center bg-white hover:bg-gray-50 transition duration-200"
              >
                <svg
                  className="w-4 h-4 text-orange-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                  />
                </svg>
              </button>
              {/* Desktop User / Profile */}
              <div className="relative" ref={profileRef}>
                {!currentUser ? (
                  <button
                    onClick={() => navigate("/login")}
                    className="w-8 h-8 border border-purple-300 rounded-full flex items-center justify-center bg-white hover:bg-gray-50 transition duration-200"
                  >
                    <svg
                      className="w-4 h-4 text-purple-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                      />
                    </svg>
                  </button>
                ) : (
                  <button
                    onClick={() => setIsProfileOpen(!isProfileOpen)}
                    className="w-8 h-8 border border-purple-300 rounded-full flex items-center justify-center bg-white hover:bg-gray-50 transition duration-200"
                    title={currentUser?.name || currentUser?.email}
                  >
                    <svg
                      className="w-4 h-4 text-purple-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                      />
                    </svg>
                  </button>
                )}
                {isProfileOpen && currentUser && (
                  <div
                    className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-lg border p-3 z-50 pointer-events-auto"
                    onMouseDown={(e) => e.stopPropagation()}
                    onClick={(e) => e.stopPropagation()}
                  >
                    <div className="flex items-center space-x-3 pb-3 border-b">
                      <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center">
                        <span className="text-purple-700 font-bold">
                          {(currentUser?.name || currentUser?.email || "U")
                            .charAt(0)
                            .toUpperCase()}
                        </span>
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-semibold text-gray-900 truncate">
                          {currentUser?.name || "User"}
                        </p>
                        <p className="text-xs text-gray-600 truncate">
                          {currentUser?.email}
                        </p>
                      </div>
                    </div>
                    <div className="py-2 space-y-1">
                      {/* Removed Seller Panel from profile dropdown */}
                      <Link
                        to="/file-downloads"
                        onClick={() => setIsProfileOpen(false)}
                        className="block w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded"
                      >
                        My Files
                      </Link>
                      <Link
                        to="/my-orders"
                        onClick={() => setIsProfileOpen(false)}
                        className="block w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded"
                      >
                        My Orders
                      </Link>
                      <button
                        type="button"
                        onClick={() => {
                          logoutUser();
                          setIsProfileOpen(false);
                          setCurrentUser(null);
                          navigate("/");
                        }}
                        className="w-full text-left px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded"
                      >
                        Logout
                      </button>
                    </div>
                  </div>
                )}
              </div>
              <button
                onClick={() => setIsCartOpen(!isCartOpen)}
                className="relative w-8 h-8 border border-purple-300 rounded-full flex items-center justify-center bg-white hover:bg-gray-50 transition duration-200"
              >
                <svg
                  className="w-4 h-4 text-orange-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-2.5 5M7 13l2.5 5m6-5v6a2 2 0 01-2 2H9a2 2 0 01-2-2v-6m8 0V9a2 2 0 00-2-2H9a2 2 0 00-2 2v4.01"
                  />
                </svg>
                {cartItemsCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-bold">
                    {cartItemsCount > 99 ? "99+" : cartItemsCount}
                  </span>
                )}
              </button>
            </div>
          </div>

          {/* Mobile Contact - Visible only on mobile */}
          <div className="md:hidden flex items-center space-x-2">
            
            {/* Mobile Home Icon */}
            <button
              onClick={() => navigate("/")}
              className="w-8 h-8 border border-purple-300 rounded-full flex items-center justify-center bg-white hover:bg-gray-50 transition duration-200"
            >
              <svg
                className="w-4 h-4 text-orange-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                />
              </svg>
            </button>
            {/* Mobile Login/Profile Icon */}
            {!currentUser ? (
              <button
                onClick={() => navigate("/login")}
                className="w-8 h-8 border border-purple-300 rounded-full flex items-center justify-center bg-white hover:bg-gray-50 transition duration-200"
              >
                <svg
                  className="w-4 h-4 text-purple-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                  />
                </svg>
              </button>
            ) : (
              <div className="relative" ref={profileRef}>
                <button
                  onClick={() => setIsProfileOpen(!isProfileOpen)}
                  className="w-8 h-8 border border-purple-300 rounded-full flex items-center justify-center bg-white hover:bg-gray-50 transition duration-200"
                  title={currentUser?.name || currentUser?.email}
                >
                  <svg
                    className="w-4 h-4 text-purple-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                    />
                  </svg>
                </button>
                {isProfileOpen && (
                  <div
                    className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-lg border p-3 z-50 pointer-events-auto"
                    onMouseDown={(e) => e.stopPropagation()}
                    onClick={(e) => e.stopPropagation()}
                  >
                    <div className="flex items-center space-x-3 pb-3 border-b">
                      <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center">
                        <span className="text-purple-700 font-bold">
                          {(currentUser?.name || currentUser?.email || "U").charAt(0).toUpperCase()}
                        </span>
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-semibold text-gray-900 truncate">
                          {currentUser?.name || "User"}
                        </p>
                        <p className="text-xs text-gray-600 truncate">
                          {currentUser?.email}
                        </p>
                      </div>
                    </div>
                    <div className="py-2 space-y-1">
                      <Link
                        to="/file-downloads"
                        onClick={() => setIsProfileOpen(false)}
                        className="block w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded"
                      >
                        My Files
                      </Link>
                      <Link
                        to="/my-orders"
                        onClick={() => setIsProfileOpen(false)}
                        className="block w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded"
                      >
                        My Orders
                      </Link>
                      <button
                        onClick={() => {
                          logoutUser();
                          setIsProfileOpen(false);
                          setCurrentUser(null);
                          navigate("/");
                        }}
                        className="w-full text-left px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded"
                      >
                        Logout
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}
            {/* Mobile Cart Icon */}
            <button
              onClick={() => setIsCartOpen(!isCartOpen)}
              className="relative w-8 h-8 border border-purple-300 rounded-full flex items-center justify-center bg-white hover:bg-gray-50 transition duration-200"
            >
              <svg
                className="w-4 h-4 text-orange-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-2.5 5M7 13l2.5 5m6-5v6a2 2 0 01-2 2H9a2 2 0 01-2-2v-6m8 0V9a2 2 0 00-2-2H9a2 2 0 00-2 2v4.01"
                />
              </svg>
              {cartItemsCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-bold">
                  {cartItemsCount > 99 ? "99+" : cartItemsCount}
                </span>
              )}
            </button>
            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-2 bg-yellow-400 rounded-md"
            >
              <svg
                className="w-5 h-5 text-gray-800"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Secondary navigation bar – show only on desktop to avoid mobile gap */}
      <div className="border-t border-gray-200 hidden md:block">
        <div className="container-responsive">
          <div className="flex items-center justify-between md:py-3">
            {/* Navigation Links - Hidden on mobile, visible on desktop */}
            <nav className="hidden md:flex items-center space-x-8">
              <Link
                to="/"
                className={`text-blue-700 hover:text-purple-500 font-medium relative ${
                  location.pathname === "/" ? "active-nav-item" : ""
                }`}
              >
                Home
                {location.pathname === "/" && (
                  <span className="absolute bottom-[-8px] left-0 w-full h-[3px] bg-purple-500 rounded-full"></span>
                )}
              </Link>
              <Link
                to="/e-market"
                className={`text-blue-700 hover:text-purple-500 font-medium relative ${
                  location.pathname === "/e-market" ? "active-nav-item" : ""
                }`}
              >
                E-Market
                {location.pathname === "/e-market" && (
                  <span className="absolute bottom-[-8px] left-0 w-full h-[3px] bg-purple-500 rounded-full"></span>
                )}
              </Link>
              <Link
                to="/local-market"
                className={`text-blue-700 hover:text-purple-500 font-medium relative ${
                  location.pathname === "/local-market" ? "active-nav-item" : ""
                }`}
              >
                Local Market
                {location.pathname === "/local-market" && (
                  <span className="absolute bottom-[-8px] left-0 w-full h-[3px] bg-purple-500 rounded-full"></span>
                )}
              </Link>
              <Link
                to="/printing"
                className={`text-blue-700 hover:text-purple-500 font-medium relative ${
                  location.pathname === "/printing" ? "active-nav-item" : ""
                }`}
              >
                Printing
                {location.pathname === "/printing" && (
                  <span className="absolute bottom-[-8px] left-0 w-full h-[3px] bg-purple-500 rounded-full"></span>
                )}
              </Link>

              <Link
                to="/news-today"
                className={`text-blue-700 hover:text-purple-500 font-medium relative ${
                  location.pathname === "/news-today" ? "active-nav-item" : ""
                }`}
              >
                MARKET NEWS 
                {location.pathname === "/news-today" && (
                  <span className="absolute bottom-[-8px] left-0 w-full h-[3px] bg-purple-500 rounded-full"></span>
                )}
              </Link>
              {/* Public Seller link navigates to seller login */}
             
            </nav>

            {/* Search and Actions - Hidden on mobile */}
            <div className="hidden md:flex items-center space-x-3">
              {/* Search Bar - White background */}
              <div className="relative flex items-center bg-white border border-gray-400 rounded-lg px-3 py-2">
                <input
                  type="text"
                  placeholder="Search bar"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      const q = searchTerm.trim();
                      navigate(`/search?q=${encodeURIComponent(q)}`);
                    }
                  }}
                  className="bg-transparent outline-none text-sm w-48 text-gray-500"
                />
                <button
                  className="ml-2 p-1 bg-blue-400 text-white rounded"
                  onClick={() => {
                    const q = searchTerm.trim();
                    navigate(`/search?q=${encodeURIComponent(q)}`);
                  }}
                >
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                    />
                  </svg>
                </button>

                {isSuggestOpen && (
                  <div
                    ref={suggestionRef}
                    className="absolute top-full left-0 mt-2 w-64 max-h-96 overflow-auto bg-white border border-gray-200 rounded-lg shadow-lg z-50"
                  >
                    {suggestLoading ? (
                      <div className="p-3 text-sm text-gray-500">Searching...</div>
                    ) : suggestions.length === 0 ? (
                      <div className="p-3 text-sm text-gray-500">No matches.</div>
                    ) : (
                      <ul>
                        {suggestions.map((p) => (
                          <li
                            key={p._id || p.id}
                            className="px-3 py-2 hover:bg-gray-50 cursor-pointer flex items-center space-x-2"
                            onClick={() => {
                              setIsSuggestOpen(false);
                              setSearchTerm(p.name);
                              navigate(`/product/${p._id || p.id}`);
                            }}
                          >
                            <img
                              src={p.image || "https://via.placeholder.com/40x40?text=+"}
                              alt=""
                              className="w-8 h-8 rounded object-cover"
                            />
                            <span className="text-sm text-gray-800 truncate">
                              {p.name}
                            </span>
                          </li>
                        ))}
                      </ul>
                    )}
                    <div className="px-3 py-2 border-t text-xs text-gray-500">
                      Press Enter to search all results
                    </div>
                  </div>
                )}
              </div>

              {/* Upload and Download functionality */}
              <div className="flex items-center space-x-2">
                <label className="flex items-center text-gray-700 hover:text-purple-600 text-sm cursor-pointer transition duration-200">
                  <svg
                    className="w-4 h-4 mr-1 text-gray-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                    />
                  </svg>
                  Upload files
                  <input
                    type="file"
                    multiple
                    className="hidden"
                    onChange={async (e) => {
                      const files = Array.from(e.target.files);
                      if (files.length > 0) {
                        try {
                          const formData = new FormData();
                          files.forEach((file) =>
                            formData.append("files", file)
                          );

                          // Get token from localStorage
                          const token = localStorage.getItem("token");
                          const headers = {};
                          if (token) {
                            headers.Authorization = `Bearer ${token}`;
                          }

                          const API_BASE_URL =
                            import.meta.env.VITE_API_BASE_URL?.replace("/api", "") ||
                            "http://localhost:5000";
                          const response = await fetch(
                            `${API_BASE_URL}/api/files/upload-multiple-public`,
                            {
                              method: "POST",
                              headers: headers,
                              body: formData,
                            }
                          );

                          if (response.ok) {
                            const result = await response.json();
                            alert(
                              `Successfully uploaded ${result.files.length} files to Cloudinary!`
                            );
                          } else {
                            const errorData = await response.json();
                            alert(
                              `Failed to upload files: ${
                                errorData.message || "Unknown error"
                              }`
                            );
                          }
                        } catch (error) {
                          console.error("Error uploading files:", error);
                          alert("Error uploading files");
                        }
                      }
                      e.target.value = "";
                    }}
                  />
                </label>
                <button
                  onClick={() => navigate("/file-downloads")}
                  className="flex items-center text-gray-700 hover:text-purple-600 text-sm cursor-pointer transition duration-200"
                >
                  <svg
                    className="w-4 h-4 mr-1 text-gray-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                    />
                  </svg>
                  Download
                </button>
              </div>

              <Link
                to="/contact"
                className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 font-medium text-sm transition duration-200 whitespace-nowrap inline-block text-center"
              >
                Join US
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Menu - Dropdown */}
      {isMenuOpen && (
        <div className="md:hidden bg-white border-t border-gray-200">
          <div className="px-4 py-2 space-y-2">
            {/* Mobile Navigation Links */}
            <nav className="flex flex-col space-y-2">
              <Link
                to="/"
                className={`text-gray-700 hover:text-purple-600 font-medium py-2 border-b border-gray-100 ${
                  location.pathname === "/" ? "text-purple-600" : ""
                }`}
                onClick={() => setIsMenuOpen(false)}
              >
                Home
              </Link>
              <Link
                to="/printing"
                className={`text-gray-700 hover:text-purple-600 font-medium py-2 border-b border-gray-100 ${
                  location.pathname === "/printing" ? "text-purple-600" : ""
                }`}
                onClick={() => setIsMenuOpen(false)}
              >
                Printing
              </Link>
              <Link
                to="/e-market"
                className={`text-gray-700 hover:text-purple-600 font-medium py-2 border-b border-gray-100 ${
                  location.pathname === "/e-market" ? "text-purple-600" : ""
                }`}
                onClick={() => setIsMenuOpen(false)}
              >
                E-Market
              </Link>
              <Link
                to="/local-market"
                className={`text-gray-700 hover:text-purple-600 font-medium py-2 border-b border-gray-100 ${
                  location.pathname === "/local-market" ? "text-purple-600" : ""
                }`}
                onClick={() => setIsMenuOpen(false)}
              >
                Local Market
              </Link>
              <Link
                to="/news-today"
                className={`text-gray-700 hover:text-purple-600 font-medium py-2 border-b border-gray-100 ${
                  location.pathname === "/news-today" ? "text-purple-600" : ""
                }`}
                onClick={() => setIsMenuOpen(false)}
              >
                NEWS TODAY
              </Link>
              {/* Public Seller link in mobile menu navigates to seller login */}
              
            </nav>

            {/* Mobile Search */}
            <div className="pt-4">
              <div className="flex items-center bg-gray-50 border border-gray-200 rounded-lg px-3 py-2">
                <input
                  type="text"
                  placeholder="Search..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      const q = searchTerm.trim();
                      setIsMenuOpen(false);
                      navigate(`/search?q=${encodeURIComponent(q)}`);
                    }
                  }}
                  className="bg-transparent outline-none text-sm flex-1 text-gray-500"
                />
                <button
                  className="ml-2 p-1 bg-blue-400 text-white rounded"
                  onClick={() => {
                    const q = searchTerm.trim();
                    setIsMenuOpen(false);
                    navigate(`/search?q=${encodeURIComponent(q)}`);
                  }}
                >
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                    />
                  </svg>
                </button>
              </div>

              {isSuggestOpen && (
                <div className="mt-2 bg-white border border-gray-200 rounded-lg shadow max-h-64 overflow-auto">
                  {suggestLoading ? (
                    <div className="p-3 text-sm text-gray-500">Searching...</div>
                  ) : suggestions.length === 0 ? (
                    <div className="p-3 text-sm text-gray-500">No matches.</div>
                  ) : (
                    <ul>
                      {suggestions.map((p) => (
                        <li
                          key={p._id || p.id}
                          className="px-3 py-2 hover:bg-gray-50 cursor-pointer flex items-center space-x-2"
                          onClick={() => {
                            setIsSuggestOpen(false);
                            setSearchTerm(p.name);
                            setIsMenuOpen(false);
                            navigate(`/product/${p._id || p.id}`);
                          }}
                        >
                          <img
                            src={p.image || "https://via.placeholder.com/40x40?text=+"}
                            alt=""
                            className="w-8 h-8 rounded object-cover"
                          />
                          <span className="text-sm text-gray-800 truncate">{p.name}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              )}
            </div>

            {/* Mobile Actions */}
            <div className="pt-4 space-y-2">
              {/* Become a Seller CTA inside mobile menu */}
              <button
                onClick={() => { setIsMenuOpen(false); navigate("/seller/login"); }}
                className="w-full bg-yellow-400 text-gray-900 px-4 py-2 rounded-lg hover:bg-yellow-300 font-medium text-center"
              >
                Become a Seller
              </button>
              <button
                onClick={() => navigate("/contact")}
                className="w-full bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 font-medium text-center"
              >
                Join US
              </button>
              <div className="flex space-x-4 pt-2">
                <label className="flex items-center text-gray-700 hover:text-purple-600 text-sm cursor-pointer">
                  <svg
                    className="w-4 h-4 mr-1 text-gray-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                    />
                  </svg>
                  Upload files
                  <input
                    type="file"
                    multiple
                    className="hidden"
                    onChange={async (e) => {
                      const files = Array.from(e.target.files);
                      if (files.length > 0) {
                        try {
                          const formData = new FormData();
                          files.forEach((file) =>
                            formData.append("files", file)
                          );

                          // Get token from localStorage
                          const token = localStorage.getItem("token");
                          const headers = {};
                          if (token) {
                            headers.Authorization = `Bearer ${token}`;
                          }

                          const API_BASE_URL =
                            import.meta.env.VITE_API_BASE_URL ||
                            "http://localhost:5000";
                          const response = await fetch(
                            `${API_BASE_URL}/api/files/upload-multiple-public`,
                            {
                              method: "POST",
                              headers: headers,
                              body: formData,
                            }
                          );

                          if (response.ok) {
                            const result = await response.json();
                            alert(
                              `Successfully uploaded ${result.files.length} files to Cloudinary!`
                            );
                          } else {
                            const errorData = await response.json();
                            alert(
                              `Failed to upload files: ${
                                errorData.message || "Unknown error"
                              }`
                            );
                          }
                        } catch (error) {
                          console.error("Error uploading files:", error);
                          alert("Error uploading files");
                        }
                      }
                      e.target.value = "";
                    }}
                  />
                </label>
                <button
                  onClick={() => navigate("/file-downloads")}
                  className="flex items-center text-gray-700 hover:text-purple-600 text-sm cursor-pointer"
                >
                  <svg
                    className="w-4 h-4 mr-1 text-gray-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                    />
                  </svg>
                  Download
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Cart Dropdown/Sidebar */}
      {isCartOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden">
          <div
            className="absolute inset-0 bg-black bg-opacity-50"
            onClick={() => setIsCartOpen(false)}
          ></div>
          <div className="absolute right-0 top-0 h-full w-96 bg-white shadow-xl transform transition-transform duration-300 ease-in-out">
            <div className="flex flex-col h-full">
              {/* Cart Header */}
              <div className="flex items-center justify-between p-4 border-b bg-purple-600">
                <h2 className="text-lg font-semibold text-white">
                  Shopping Cart ({cartItemsCount})
                </h2>
                <div className="flex items-center gap-4">
                  <label className="flex items-center gap-2 text-white text-sm">
                    <input
                      type="checkbox"
                      checked={items.length > 0 && selectedIds && selectedIds.length === items.length}
                      onChange={(e) => (e.target.checked ? selectAll() : deselectAll())}
                    />
                    Select All
                  </label>
                  <button
                    onClick={() => setIsCartOpen(false)}
                    className="p-2 hover:bg-purple-700 rounded-full transition-colors text-white"
                  >
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </button>
                </div>
              </div>

              {/* Cart Items */}
              <div className="flex-1 overflow-y-auto p-4">
                {items.length === 0 ? (
                  <div className="text-center py-8">
                    <svg
                      className="w-16 h-16 text-gray-300 mx-auto mb-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-2.5 5M7 13l2.5 5m6-5v6a2 2 0 01-2 2H9a2 2 0 01-2-2v-6m8 0V9a2 2 0 00-2-2H9a2 2 0 00-2 2v4.01"
                      />
                    </svg>
                    <p className="text-gray-500 mb-4">Your cart is empty</p>
                    <button
                      onClick={() => setIsCartOpen(false)}
                      className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-2 rounded-lg transition-colors"
                    >
                      Continue Shopping
                    </button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {items.map((item) => (
                      <div
                        key={item.uid || item.id}
                        className="flex items-center space-x-3 p-3 border border-gray-200 rounded-lg hover:shadow-md transition-shadow"
                      >
                        <input
                          type="checkbox"
                          className="w-4 h-4"
                          checked={isSelected(item.uid || item.id)}
                          onChange={() => toggleSelect(item.uid || item.id)}
                        />
                        <img
                          src={item.image || item.imgUrl}
                          alt={item.name}
                          className="w-16 h-16 object-cover rounded-md flex-shrink-0"
                        />
                        <div className="flex-1 min-w-0">
                          <h3 className="text-sm font-semibold text-gray-900 truncate">
                            {item.name}
                          </h3>
                          <p className="text-xs text-gray-600 truncate">
                            {item.description}
                          </p>
                          {(item.selectedColor || item.selectedSize) && (
                            <p className="text-xs text-gray-700 truncate">
                              {item.selectedColor && (
                                <span>
                                  Color:{" "}
                                  <span className="font-medium">
                                    {item.selectedColor}
                                  </span>
                                </span>
                              )}
                              {item.selectedColor && item.selectedSize && (
                                <span className="mx-1">•</span>
                              )}
                              {item.selectedSize && (
                                <span>
                                  Size:{" "}
                                  <span className="font-medium">
                                    {item.selectedSize}
                                  </span>
                                </span>
                              )}
                            </p>
                          )}
                          <p className="text-sm font-bold text-purple-600">
                            ₹{item.price.toLocaleString()}
                          </p>
                        </div>
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() =>
                              updateQuantity(
                                item.uid || item.id,
                                item.quantity - 1
                              )
                            }
                            className="w-6 h-6 rounded-full bg-gray-200 hover:bg-gray-300 flex items-center justify-center transition-colors"
                          >
                            <svg
                              className="w-3 h-3"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M20 12H4"
                              />
                            </svg>
                          </button>
                          <span className="w-6 text-center text-sm font-medium">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() =>
                              updateQuantity(
                                item.uid || item.id,
                                item.quantity + 1
                              )
                            }
                            className="w-6 h-6 rounded-full bg-purple-600 hover:bg-purple-700 text-white flex items-center justify-center transition-colors"
                          >
                            <svg
                              className="w-3 h-3"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                              />
                            </svg>
                          </button>
                        </div>
                        <button
                          onClick={() => removeFromCart(item.uid || item.id)}
                          className="p-1 text-red-500 hover:text-red-700 transition-colors flex-shrink-0"
                        >
                          <svg
                            className="w-4 h-4"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                            />
                          </svg>
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Cart Footer */}
              {items.length > 0 && (
                <div className="border-t p-4 space-y-4 bg-gray-50">
                  <div className="flex justify-between items-center">
                    <span className="text-lg font-semibold text-gray-900">
                      {selectedIds && selectedIds.length > 0 ? `Selected Total (${getSelectedItemsCount()}):` : 'Total:'}
                    </span>
                    <span className="text-xl font-bold text-purple-600">
                      ₹{(selectedIds && selectedIds.length > 0 ? getSelectedTotal() : getCartTotal()).toLocaleString()}
                    </span>
                  </div>
                  <div className="space-y-2">
                    <button
                      onClick={() => {
                        setIsCartOpen(false);
                        navigate("/checkout");
                      }}
                      className="w-full bg-green-600 hover:bg-green-700 text-white py-3 rounded-lg font-medium transition-colors"
                    >
                      Checkout Now
                    </button>
                    <button
                      onClick={() => {
                        setIsCartOpen(false);
                        navigate("/cart");
                      }}
                      className="w-full bg-purple-600 hover:bg-purple-700 text-white py-2 rounded-lg font-medium transition-colors"
                    >
                      View Full Cart
                    </button>
                    <button
                      onClick={() => setIsCartOpen(false)}
                      className="w-full bg-gray-200 hover:bg-gray-300 text-gray-800 py-2 rounded-lg font-medium transition-colors"
                    >
                      Continue Shopping
                    </button>
                    <button
                      onClick={() => {
                        clearCorruptedCart();
                        setIsCartOpen(false);
                      }}
                      className="w-full bg-red-600 hover:bg-red-700 text-white py-2 rounded-lg font-medium transition-colors text-sm"
                    >
                      Clear Cart (Fix NaN)
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Navbar;
