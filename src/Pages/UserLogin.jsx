import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { userLogin, saveUserSession } from "../services/authService";
import { Mail, Lock } from "lucide-react";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const data = await userLogin({ email, password });
      saveUserSession({ token: data.token, user: data.user });
      navigate("/", { replace: true });
    } catch (err) {
      setError(err.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="bg-white rounded-2xl shadow-lg w-full max-w-md p-8">
        <h2 className="text-2xl font-bold text-center text-gray-800">
          User Login
        </h2>
        <p className="text-center text-gray-500 mt-1">
          Sign in to your account
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

          {/* Password Input */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Password
            </label>
            <div className="flex items-center border rounded-lg px-3 py-2 bg-gray-50 focus-within:ring-2 focus-within:ring-purple-500">
              <Lock className="w-5 h-5 text-gray-400 mr-2" />
              <input
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-transparent outline-none text-gray-700"
              />
            </div>
          </div>

          {/* Remember Me & Forgot Password */}
          <div className="flex items-center justify-between text-sm">
            <label className="flex items-center space-x-2">
              <input type="checkbox" className="accent-purple-600" />
              <span className="text-gray-600">Remember me</span>
            </label>
            <a href="#" className="text-purple-600 hover:underline">
              Forgot password?
            </a>
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
            Don’t have an account?{" "}
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
