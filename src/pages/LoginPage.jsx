import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Eye, EyeOff, Mail, Lock, ArrowLeft, Phone, ChevronRight } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { useNotification } from '../components/Notification';

const LoginPage = ({ isAdmin = false }) => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    phone: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const { login, adminLogin, phoneLogin, isAuthenticated, user, loading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const { showNotification, NotificationComponent } = useNotification();

  // Redirect if already authenticated
  useEffect(() => {
    if (!loading && isAuthenticated && user) {
      // Check role case-insensitively
      const userRole = (user?.role || user?.profile?.role || '').toUpperCase();

      // If we are on the admin login page
      if (isAdmin) {
        // Only redirect if already an admin
        if (userRole === 'ADMIN') {
          navigate('/admin/dashboard', { replace: true });
        }
        // If regular user, stay here to allow admin login (switching accounts)
      } else {
        // Normal login page - redirect to target or home
        if (userRole === 'ADMIN') {
          navigate('/admin/dashboard', { replace: true });
        } else {
          const target = location.state?.from?.pathname || sessionStorage.getItem('redirectAfterLogin') || '/';
          sessionStorage.removeItem('redirectAfterLogin');
          navigate(target, { replace: true });
        }
      }
    }
  }, [loading, isAuthenticated, user, navigate, isAdmin, location]);


  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      let result;
      if (isAdmin) {
        result = await adminLogin({ email: formData.email, password: formData.password });
      } else {
        // Flexible user flow: phone OR email + password
        const inputVal = (formData.phone || '').trim();
        if (!inputVal) {
          showNotification('error', 'Enter your mobile number or email');
          setIsLoading(false);
          return;
        }
        if (!formData.password) {
          showNotification('error', 'Enter your password');
          setIsLoading(false);
          return;
        }

        if (inputVal.includes('@')) {
          result = await login({ email: inputVal, password: formData.password });
        } else {
          const cleanPhone = inputVal.replace(/\D/g, '');
          if (cleanPhone.length < 10) {
            showNotification('error', 'Enter a valid 10-digit phone number or email address');
            setIsLoading(false);
            return;
          }
          result = await phoneLogin({ phone: cleanPhone, password: formData.password });
        }
      }

      if (result.success) {
        setSuccess(true);
        showNotification('success', 'Login successful! Redirecting...');

        // Redirect based on role and prior intent
        setTimeout(() => {
          const userRole = result.user?.role;
          if (isAdmin || userRole === 'ADMIN') {
            navigate('/admin/dashboard');
          } else {
            const returnUrl = location.state?.from?.pathname || sessionStorage.getItem('redirectAfterLogin') || '/';
            sessionStorage.removeItem('redirectAfterLogin');
            navigate(returnUrl);
          }
        }, 1000);
      } else {
        showNotification('error', result.error || 'Login failed');
      }
    } catch (err) {
      showNotification('error', 'An unexpected error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-white">
      {/* Left Column - Editorial Image */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-black">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/90 z-10" />
        <motion.img
          initial={{ scale: 1.1, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 1.5 }}
          src="https://images.unsplash.com/photo-1490481651871-ab68de25d43d?q=80&w=2070&auto=format&fit=crop"
          alt="Fashion Editorial"
          className="w-full h-full object-cover opacity-80"
        />

        <div className="absolute bottom-0 left-0 right-0 p-16 z-20 text-white">
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.8 }}
          >
            <h2 className="text-5xl font-heading font-bold mb-6 leading-tight">
              Elegance is not just being noticed, it's being remembered.
            </h2>
            <p className="text-lg text-white/80 font-light max-w-md">
              Join our exclusive community of fashion enthusiasts and discover styles that define you.
            </p>
          </motion.div>
        </div>
      </div>

      {/* Right Column - Form */}
      <div className="flex-1 flex flex-col justify-center px-4 sm:px-6 lg:px-20 xl:px-24 bg-white relative">
        <Link to="/" className="absolute top-8 left-8 lg:left-24 text-primary-500 hover:text-primary-900 transition-colors flex items-center space-x-2 group">
          <div className="bg-gray-100 p-2 rounded-full group-hover:bg-primary-100 transition-colors">
            <ArrowLeft className="h-4 w-4" />
          </div>
          <span className="text-sm font-medium">Back to Store</span>
        </Link>

        <div className="mx-auto w-full max-w-sm lg:w-96">

          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="mb-10"
          >
            <h2 className="text-4xl font-heading font-extrabold text-primary-900 tracking-tight mb-2">
              {isAdmin ? 'Admin Portal' : 'Welcome back'}
            </h2>
            <p className="text-primary-500">
              {isAdmin ? 'Access your dashboard securely.' : 'Please enter your details to sign in.'}
            </p>
          </motion.div>

          <form className="space-y-6" onSubmit={handleSubmit}>
            {isAdmin ? (
              <>
                <div className="space-y-1">
                  <label htmlFor="email" className="block text-sm font-medium text-primary-700">
                    Email address
                  </label>
                  <div className="mt-1 relative group">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Mail className="h-5 w-5 text-gray-400 group-focus-within:text-action transition-colors" />
                    </div>
                    <input
                      id="email"
                      name="email"
                      type="email"
                      required
                      value={formData.email}
                      onChange={handleInputChange}
                      className="block w-full pl-10 pr-3 py-3 border border-gray-200 rounded-xl bg-gray-50 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-action/20 focus:border-action focus:bg-white transition-all duration-200 sm:text-sm"
                      placeholder="Enter your email"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label htmlFor="password" className="block text-sm font-medium text-primary-700">
                    Password
                  </label>
                  <div className="mt-1 relative group">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Lock className="h-5 w-5 text-gray-400 group-focus-within:text-action transition-colors" />
                    </div>
                    <input
                      id="password"
                      name="password"
                      type={showPassword ? 'text' : 'password'}
                      required
                      value={formData.password}
                      onChange={handleInputChange}
                      className="block w-full pl-10 pr-10 py-3 border border-gray-200 rounded-xl bg-gray-50 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-action/20 focus:border-action focus:bg-white transition-all duration-200 sm:text-sm"
                      placeholder="Enter your password"
                    />
                    <button
                      type="button"
                      className="absolute inset-y-0 right-0 pr-3 flex items-center"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? (
                        <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                      ) : (
                        <Eye className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                      )}
                    </button>
                  </div>
                </div>
              </>
            ) : (
              <>
                <div className="space-y-1">
                  <label htmlFor="phone" className="block text-sm font-medium text-primary-700">
                    Mobile Number or Email
                  </label>
                  <div className="mt-1 relative group">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Phone className="h-5 w-5 text-gray-400 group-focus-within:text-action transition-colors" />
                    </div>
                    <input
                      id="phone"
                      name="phone"
                      type="text"
                      required
                      value={formData.phone}
                      onChange={handleInputChange}
                      className="block w-full pl-10 pr-3 py-3 border border-gray-200 rounded-xl bg-gray-50 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-action/20 focus:border-action focus:bg-white transition-all duration-200 sm:text-sm"
                      placeholder="Enter mobile number or email"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <div className="flex items-center justify-between">
                    <label htmlFor="userPassword" className="block text-sm font-medium text-primary-700">
                      Password
                    </label>
                    <Link to="/forgot-password" className="text-xs font-medium text-action hover:text-action-dark">
                      Forgot password?
                    </Link>
                  </div>
                  <div className="mt-1 relative group">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Lock className="h-5 w-5 text-gray-400 group-focus-within:text-action transition-colors" />
                    </div>
                    <input
                      id="userPassword"
                      name="password"
                      type={showPassword ? 'text' : 'password'}
                      required
                      value={formData.password}
                      onChange={handleInputChange}
                      className="block w-full pl-10 pr-10 py-3 border border-gray-200 rounded-xl bg-gray-50 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-action/20 focus:border-action focus:bg-white transition-all duration-200 sm:text-sm"
                      placeholder="Enter your password"
                    />
                    <button
                      type="button"
                      className="absolute inset-y-0 right-0 pr-3 flex items-center"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? (
                        <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                      ) : (
                        <Eye className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                      )}
                    </button>
                  </div>
                </div>
              </>
            )}

            <button
              type="submit"
              disabled={isLoading || success}
              className={`w-full flex items-center justify-center py-4 px-6 rounded-xl text-base font-bold transition-all duration-300 ${success
                ? 'bg-green-600 text-white'
                : isLoading
                  ? 'bg-gray-400 text-white cursor-not-allowed'
                  : 'bg-black text-white hover:bg-gray-900 shadow-lg hover:shadow-xl'
                }`}
            >
              {isLoading ? (
                <div className="flex items-center space-x-2">
                  <div className="animate-spin rounded-full h-5 w-5 border-2 border-white/30 border-t-white"></div>
                  <span>Processing...</span>
                </div>
              ) : success ? (
                <span>Success! Redirecting...</span>
              ) : (
                <span className="flex items-center">
                  Sign In <ChevronRight className="ml-2 h-5 w-5" />
                </span>
              )}
            </button>
          </form>

          {/* Social & Signup Links */}
          <div className="mt-8">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-white text-gray-500 font-medium">Or continue with</span>
              </div>
            </div>

            <div className="mt-6 grid grid-cols-2 gap-4">
              <button
                type="button"
                className="flex items-center justify-center px-4 py-3 border border-gray-200 rounded-xl shadow-sm bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 hover:border-gray-300 transition-all duration-200"
              >
                <svg className="h-5 w-5 mr-2" viewBox="0 0 24 24">
                  <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                  <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                  <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                  <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                </svg>
                Google
              </button>
              <button
                type="button"
                className="flex items-center justify-center px-4 py-3 border border-gray-200 rounded-xl shadow-sm bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 hover:border-gray-300 transition-all duration-200"
              >
                <svg className="h-5 w-5 mr-2 text-[#1877F2]" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                </svg>
                Facebook
              </button>
            </div>

            <p className="mt-8 text-center text-sm text-gray-600">
              Don't have an account?{' '}
              <Link to="/signup" className="font-semibold text-action hover:text-action-dark transition-colors">
                Create an account
              </Link>
            </p>
          </div>
        </div>
      </div>
      <NotificationComponent />
    </div>
  );
};

export default LoginPage;
