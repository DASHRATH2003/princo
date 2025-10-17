import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { userLogin, saveUserSession } from "../services/authService";
import { Mail, Lock, Eye, EyeOff } from "lucide-react";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false); // New state for password visibility
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const data = await userLogin({ email, password });
      saveUserSession({ token: data.token, user: data.user });
      // If logged-in user is a seller, send directly to Seller Panel
      const role = String(data?.user?.role || '').toLowerCase();
      if (role === 'seller') {
        navigate('/seller/dashboard', { replace: true });
      } else {
        // If user came from Buy Now intent, go to checkout directly
        try {
          const intentRaw = localStorage.getItem('buyNowIntent');
          if (intentRaw) {
            const intent = JSON.parse(intentRaw);
            if (intent && (intent.type === 'buyNow' || intent.type === 'checkout')) {
              localStorage.removeItem('buyNowIntent');
              const target = intent.redirectTo || '/checkout';
              navigate(target, { replace: true });
              return;
            }
          }
        } catch (_) {}
        navigate('/', { replace: true });
      }
    } catch (err) {
      setError(err.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="bg-white rounded-2xl shadow-lg w-full max-w-md p-8">
        <h2 className="text-2xl font-bold text-center text-gray-800">
          welcome to L-Mart
        </h2>
        <p className="text-center text-gray-500 mt-1">
          L-mart
        </p>

        <form onSubmit={handleLogin} className="mt-6 space-y-5">
          {/* Email Input */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email Address
            </label>
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

          {/* Password Input - UPDATED WITH EYE ICON */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Password
            </label>
            <div className="flex items-center border rounded-lg px-3 py-2 bg-gray-50 focus-within:ring-2 focus-within:ring-purple-500">
              <Lock className="w-5 h-5 text-gray-400 mr-2" />
              <input
                type={showPassword ? "text" : "password"} // Toggle between text and password
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-transparent outline-none text-gray-700"
              />
              {/* Eye Icon Button */}
              <button
                type="button"
                onClick={togglePasswordVisibility}
                className="text-gray-400 hover:text-gray-600 focus:outline-none"
              >
                {showPassword ? (
                  <EyeOff className="w-5 h-5" />
                ) : (
                  <Eye className="w-5 h-5" />
                )}
              </button>
            </div>
          </div>

          {/* Remember Me & Forgot Password */}
          <div className="flex items-center justify-between text-sm">
            <label className="flex items-center space-x-2">
              <input type="checkbox" className="accent-purple-600" />
              <span className="text-gray-600">Remember me</span>
            </label>
            <Link to="/forgot-password" className="text-purple-600 hover:underline">
              Forgot password?
            </Link>
          </div>

          {/* Sign In Button */}
          {error && (
            <div className="text-red-600 text-sm text-center">{error}</div>
          )}

          <button
            type="submit"
            className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-semibold py-3 rounded-lg transition-all duration-200 disabled:opacity-60"
            disabled={loading}
          >
            {loading ? "Signing In..." : "Sign In"}
          </button>

          {/* Sign Up Link */}
          <p className="text-center text-sm text-gray-600 mt-4">
            Don't have an account?{" "}
            <Link to="/register" className="text-purple-600 hover:underline">
              Sign up here
            </Link>
          </p>

          <p className="text-center text-xs text-gray-500 mt-4">
            Demo User: user@printo.com / user123
          </p>
        </form>
      </div>
    </div>
  );
};

export default Login;