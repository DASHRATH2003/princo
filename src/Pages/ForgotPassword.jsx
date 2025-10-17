import React, { useState } from 'react';
import { forgotPassword } from '../services/authService';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [resetUrl, setResetUrl] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setMessage('');
    try {
      const res = await forgotPassword({ email });
      setMessage(res.message || 'If the email exists, a reset link has been sent');
      if (res.resetUrl) {
        setResetUrl(res.resetUrl);
      }
    } catch (err) {
      setError(err.message || 'Failed to request reset');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="bg-white rounded-2xl shadow-lg w-full max-w-md p-8">
        <h2 className="text-2xl font-bold text-center text-gray-800">Forgot Password</h2>
        <p className="text-center text-gray-500 mt-1">Enter your email to receive a reset link</p>
        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Enter your email" className="w-full border rounded-lg px-3 py-2 bg-gray-50 focus:ring-2 focus:ring-purple-500" />
          </div>
          {message && <div className="text-green-600 text-sm text-center">{message}</div>}
          {error && <div className="text-red-600 text-sm text-center">{error}</div>}
          {resetUrl && (
            <div className="text-center text-sm mt-2">
              <a href={resetUrl} target="_blank" rel="noopener noreferrer" className="text-indigo-600 underline">
                Open Reset Link
              </a>
            </div>
          )}
          <button type="submit" disabled={loading} className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-semibold py-3 rounded-lg transition disabled:opacity-60">
            {loading ? 'Sending...' : 'Send Reset Link'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ForgotPassword;