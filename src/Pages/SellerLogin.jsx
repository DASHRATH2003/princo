import React, { useState, useEffect } from "react";
import { useNavigate, Link, useLocation } from "react-router-dom";
import { sellerLogin, saveSellerSession } from "../services/authService";
import { Mail, Lock, Eye, EyeOff, Store } from "lucide-react";

const SellerLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // Check for success message from registration
    if (location.state?.message) {
      setSuccessMessage(location.state.message);
      // Pre-fill email if provided
      if (location.state?.email) {
        setEmail(location.state.email);
      }
    }
  }, [location.state]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const data = await sellerLogin({ email, password });
      if (data.user?.role !== 'seller') {
        throw new Error('Seller access required. Your account is not a seller.');
      }
      // Save session and open Seller Dashboard directly; route gating will handle approval
      saveSellerSession({ token: data.token, user: data.user });
      navigate('/seller/dashboard', { replace: true });
    } catch (err) {
      const msg = err.message || "Login failed";
      // If backend blocks with 403 for pending/rejected, redirect to register with notice
      if (err.status === 403) {
        navigate('/seller/register', { replace: true, state: { pendingMessage: msg } });
        return;
      }
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  const togglePasswordVisibility = () => setShowPassword(!showPassword);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="bg-white rounded-2xl shadow-lg w-full max-w-md p-8">
        <div className="flex items-center justify-center gap-2 text-gray-800">
          <Store className="w-6 h-6 text-purple-600" />
          <h2 className="text-2xl font-bold">Seller Login</h2>
        </div>
        <p className="text-center text-gray-500 mt-1">Sign in to your seller account</p>

        <form onSubmit={handleLogin} className="mt-6 space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
            <div className="flex items-center border rounded-lg px-3 py-2 bg-gray-50 focus-within:ring-2 focus-within:ring-purple-500">
              <Mail className="w-5 h-5 text-gray-400 mr-2" />
              <input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-transparent outline-none text-gray-700"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
            <div className="flex items-center border rounded-lg px-3 py-2 bg-gray-50 focus-within:ring-2 focus-within:ring-purple-500">
              <Lock className="w-5 h-5 text-gray-400 mr-2" />
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-transparent outline-none text-gray-700"
              />
              <button type="button" onClick={togglePasswordVisibility} className="text-gray-400 hover:text-gray-600 focus:outline-none">
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
            <div className="mt-2 text-right">
              <Link to="/forgot-password" className="text-sm text-purple-600 hover:underline">Forgot password?</Link>
            </div>
          </div>

          {successMessage && <div className="text-green-600 text-sm text-center bg-green-50 border border-green-200 rounded-lg p-3">{successMessage}</div>}
          {error && <div className="text-red-600 text-sm text-center">{error}</div>}

          <button
            type="submit"
            className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-semibold py-3 rounded-lg transition-all duration-200 disabled:opacity-60"
            disabled={loading}
          >
            {loading ? "Signing In..." : "Sign In"}
          </button>

          <p className="text-center text-sm text-gray-600 mt-4">
            New seller? {" "}
            <Link to="/seller/register" className="text-purple-600 hover:underline">Register here</Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default SellerLogin;