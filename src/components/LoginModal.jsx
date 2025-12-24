import React from 'react';
import { useNavigate } from 'react-router-dom';
import { X, LogIn } from 'lucide-react';

const LoginModal = ({ onClose, message = "Please login to continue" }) => {
  const navigate = useNavigate();

  const handleLogin = () => {
    onClose();
    navigate('/login');
  };

  const handleSignup = () => {
    onClose();
    navigate('/signup');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4 p-6">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
        >
          <X className="h-5 w-5" />
        </button>

        {/* Icon */}
        <div className="flex justify-center mb-4">
          <div className="bg-blue-100 rounded-full p-3">
            <LogIn className="h-8 w-8 text-blue-600" />
          </div>
        </div>

        {/* Message */}
        <h2 className="text-xl font-semibold text-center text-gray-900 mb-2">
          Login Required
        </h2>
        <p className="text-center text-gray-600 mb-6">
          {message}
        </p>

        {/* Buttons */}
        <div className="space-y-3">
          <button
            onClick={handleLogin}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2.5 px-4 rounded-lg transition-colors"
          >
            Login to Your Account
          </button>
          <button
            onClick={handleSignup}
            className="w-full bg-white hover:bg-gray-50 text-gray-700 font-medium py-2.5 px-4 rounded-lg border border-gray-300 transition-colors"
          >
            Create New Account
          </button>
          <button
            onClick={onClose}
            className="w-full text-gray-600 hover:text-gray-800 font-medium py-2 transition-colors"
          >
            Continue Browsing
          </button>
        </div>
      </div>
    </div>
  );
};

export default LoginModal;
