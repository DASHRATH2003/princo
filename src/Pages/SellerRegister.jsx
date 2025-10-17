import React, { useState } from "react";
import { useNavigate, Link, useLocation } from "react-router-dom";
import { sellerRegister } from "../services/authService";
import { submitSellerVerification, getSellerVerification } from "../services/sellerService";
import { Mail, Lock, User, Eye, EyeOff, Store, FileText } from "lucide-react";

const SellerRegister = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [step, setStep] = useState("register");
  const [verification, setVerification] = useState({
    sellerName: "",
    shopName: "",
    email: "",
    phone: "",
    status: "",
    registeredOn: "",
    idProofFile: null,
    addressProofFile: null,
    businessProofFile: null, // Naya document
    bankProofFile: null, // Naya document
  });
  const [verifySubmitting, setVerifySubmitting] = useState(false);
  const [verifyError, setVerifyError] = useState("");
  const [verifySuccess, setVerifySuccess] = useState("");
  const navigate = useNavigate();
  const location = useLocation();
  const pendingMessageFromLogin = location.state?.pendingMessage;

  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }
    setLoading(true);
    try {
      const data = await sellerRegister({ name, email, password });
      // Show verification step after successful registration (no automatic login)
      setStep('verify');
      setVerification(v => ({ ...v, sellerName: name, email: email }));
      
      // Try to load existing verification data if any
      try {
        const vdata = await getSellerVerification(email);
        if (vdata?.data) {
          setVerification(v => ({
            ...v,
            status: (vdata.data.verificationStatus || 'pending').replace(/\b\w/g, c => c.toUpperCase()),
            shopName: vdata.data.verification?.shopName || v.shopName,
          }));
        }
      } catch (_) {
        // If no verification data exists, that's fine - user will fill the form
      }
    } catch (err) {
      setError(err.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  const togglePasswordVisibility = () => setShowPassword(!showPassword);

  const handleVerifyChange = (field, value) => {
    setVerification((v) => ({ ...v, [field]: value }));
  };

  const handleVerifySubmit = async (e) => {
    e.preventDefault();
    setVerifyError("");
    setVerifySuccess("");
    if (!verification.sellerName || !verification.shopName || (!verification.email && !verification.phone) || 
        !verification.idProofFile || !verification.addressProofFile || 
        !verification.businessProofFile || !verification.bankProofFile) {
      setVerifyError("Please fill all required fields and upload all documents.");
      return;
    }
    try {
      setVerifySubmitting(true);
      const formData = new FormData();
      formData.append("sellerName", verification.sellerName);
      formData.append("shopName", verification.shopName);
      if (verification.email) formData.append("email", verification.email);
      if (verification.phone) formData.append("phone", verification.phone);
      if (verification.idProofFile) formData.append("idProof", verification.idProofFile);
      if (verification.addressProofFile) formData.append("addressProof", verification.addressProofFile);
      if (verification.businessProofFile) formData.append("businessProof", verification.businessProofFile);
      if (verification.bankProofFile) formData.append("bankProof", verification.bankProofFile);
      
      const resp = await submitSellerVerification(formData, verification.email);
      setVerifySuccess(resp.message || "Verification submitted successfully.");
      // Refresh current verification status
      try {
        const vdata = await getSellerVerification(verification.email);
        if (vdata?.data) {
          setVerification(v => ({
            ...v,
            status: (vdata.data.verificationStatus || 'pending').replace(/\b\w/g, c => c.toUpperCase()),
            shopName: vdata.data.verification?.shopName || v.shopName,
          }));
        }
      } catch (_) {}
    } catch (err) {
      setVerifyError(err.message || "Failed to submit verification");
    } finally {
      setVerifySubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="bg-white rounded-2xl shadow-lg w-full max-w-md p-8">
        <div className="flex items-center justify-center gap-2 text-gray-800">
          <Store className="w-6 h-6 text-purple-600" />
          <h2 className="text-2xl font-bold">{step === 'register' ? 'Seller Register' : 'Document Verification'}</h2>
        </div>
        <p className="text-center text-gray-500 mt-1">
          {step === 'register' ? 'Create your seller account' : 'Submit documents for verification'}
        </p>

        {/* Approval notice shown after registration and when redirected from login due to pending approval */}
        {step === 'verify' && (
          <div className="mt-4 p-3 rounded-lg bg-blue-50 border border-blue-200 text-blue-700 text-sm text-center">
            You will receive admin approval within 24 hours.
          </div>
        )}
        {step === 'register' && pendingMessageFromLogin && (
          <div className="mt-4 p-3 rounded-lg bg-blue-50 border border-blue-200 text-blue-700 text-sm text-center">
            {pendingMessageFromLogin}
          </div>
        )}

        {step === 'register' ? (
        <form onSubmit={handleRegister} className="mt-6 space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
            <div className="flex items-center border rounded-lg px-3 py-2 bg-gray-50 focus-within:ring-2 focus-within:ring-purple-500">
              <User className="w-5 h-5 text-gray-400 mr-2" />
              <input
                type="text"
                placeholder="Enter your name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-transparent outline-none text-gray-700"
              />
            </div>
          </div>

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
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Confirm Password</label>
            <div className="flex items-center border rounded-lg px-3 py-2 bg-gray-50 focus-within:ring-2 focus-within:ring-purple-500">
              <Lock className="w-5 h-5 text-gray-400 mr-2" />
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Re-enter your password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full bg-transparent outline-none text-gray-700"
              />
            </div>
          </div>

          {error && <div className="text-red-600 text-sm text-center">{error}</div>}

          <button
            type="submit"
            className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-semibold py-3 rounded-lg transition-all duration-200 disabled:opacity-60"
            disabled={loading}
          >
            {loading ? "Creating Account..." : "Create Account"}
          </button>

          <p className="text-center text-sm text-gray-600 mt-4">
            Already a seller? {" "}
            <Link to="/seller/login" className="text-purple-600 hover:underline">Sign in</Link>
          </p>
        </form>
        ) : (
        <form onSubmit={handleVerifySubmit} className="mt-6 space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Seller Name</label>
            <input 
              type="text" 
              value={verification.sellerName} 
              onChange={(e) => handleVerifyChange('sellerName', e.target.value)} 
              className="w-full px-3 py-2 border rounded-lg bg-gray-50" 
              required 
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Shop Name</label>
            <input 
              type="text" 
              value={verification.shopName} 
              onChange={(e) => handleVerifyChange('shopName', e.target.value)} 
              className="w-full px-3 py-2 border rounded-lg bg-gray-50" 
              required 
            />
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input 
                type="email" 
                value={verification.email} 
                onChange={(e) => handleVerifyChange('email', e.target.value)} 
                className="w-full px-3 py-2 border rounded-lg bg-gray-50" 
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
              <input 
                type="tel" 
                value={verification.phone} 
                onChange={(e) => handleVerifyChange('phone', e.target.value)} 
                className="w-full px-3 py-2 border rounded-lg bg-gray-50" 
              />
            </div>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
              <input 
                type="text" 
                value={verification.status || 'Pending'} 
                readOnly 
                className="w-full px-3 py-2 border rounded-lg bg-gray-100 text-gray-600" 
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Registered On</label>
              <input 
                type="text" 
                value={verification.registeredOn} 
                readOnly 
                className="w-full px-3 py-2 border rounded-lg bg-gray-100 text-gray-600" 
              />
            </div>
          </div>

          {/* Document Upload Sections */}
          <div className="space-y-4">
            <div className="border-t pt-4">
              <div className="flex items-center gap-2 mb-3">
                <FileText className="w-4 h-4 text-purple-600" />
                <h3 className="font-medium text-gray-800">Required Documents</h3>
              </div>
              
              <div className="space-y-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    ID Proof (Aadhar, PAN, etc.) <span className="text-red-500">*</span>
                  </label>
                  <input 
                    type="file" 
                    accept="image/*,.pdf" 
                    onChange={(e) => handleVerifyChange('idProofFile', e.target.files[0])} 
                    className="w-full text-sm" 
                    required 
                  />
                  <p className="text-xs text-gray-500 mt-1">Upload Aadhar Card, PAN Card, or any government ID</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Address Proof <span className="text-red-500">*</span>
                  </label>
                  <input 
                    type="file" 
                    accept="image/*,.pdf" 
                    onChange={(e) => handleVerifyChange('addressProofFile', e.target.files[0])} 
                    className="w-full text-sm" 
                    required 
                  />
                  <p className="text-xs text-gray-500 mt-1">Upload utility bill, rental agreement, or bank statement</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Business Proof <span className="text-red-500">*</span>
                  </label>
                  <input 
                    type="file" 
                    accept="image/*,.pdf" 
                    onChange={(e) => handleVerifyChange('businessProofFile', e.target.files[0])} 
                    className="w-full text-sm" 
                    required 
                  />
                  <p className="text-xs text-gray-500 mt-1">Upload GST certificate, trade license, or business registration</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Bank Proof <span className="text-red-500">*</span>
                  </label>
                  <input 
                    type="file" 
                    accept="image/*,.pdf" 
                    onChange={(e) => handleVerifyChange('bankProofFile', e.target.files[0])} 
                    className="w-full text-sm" 
                    required 
                  />
                  <p className="text-xs text-gray-500 mt-1">Upload cancelled cheque or bank statement</p>
                </div>
              </div>
            </div>
          </div>

          {verifyError && <div className="text-red-600 text-sm text-center">{verifyError}</div>}
          {verifySuccess && (
            <div className="text-center">
              <div className="text-green-600 text-sm mb-3">{verifySuccess}</div>
              <button 
                onClick={() => navigate('/seller/login', { 
                  state: { 
                    message: 'Verification submitted successfully! Please login to continue.',
                    email: verification.email 
                  } 
                })}
                className="bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded-lg transition-all text-sm"
              >
                Go to Login
              </button>
            </div>
          )}
          
          <div className="flex gap-3">
            <button 
              type="submit" 
              disabled={verifySubmitting} 
              className="flex-1 bg-purple-600 hover:bg-purple-700 text-white font-semibold py-3 rounded-lg transition-all disabled:opacity-60"
            >
              {verifySubmitting ? 'Submitting...' : 'Submit Verification'}
            </button>
            <button 
              type="button" 
              onClick={() => navigate('/seller')} 
              className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-800 font-semibold py-3 rounded-lg transition-all"
            >
              View Dashboard
            </button>
          </div>
        </form>
        )}
      </div>
    </div>
  );
};

export default SellerRegister;