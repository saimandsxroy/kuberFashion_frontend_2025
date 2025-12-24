import React, { useState } from 'react';
import LoginPage from './LoginPage';
import SignupPage from './SignupPage';

export default function AuthPage() {
  const [mode, setMode] = useState('login');

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center mb-6">
        <h1 className="text-3xl font-bold text-gray-900">KuberFashion</h1>
        <p className="text-gray-600">Welcome to KuberFashion. Please sign in or create an account.</p>
      </div>
      <div className="sm:mx-auto sm:w-full sm:max-w-2xl bg-white shadow-lg rounded-lg p-4">
        <div className="flex items-center justify-center gap-2 mb-4">
          <button
            className={`px-4 py-2 rounded ${mode === 'login' ? 'bg-blue-600 text-white' : 'bg-gray-100'}`}
            onClick={() => setMode('login')}
          >
            Sign In
          </button>
          <button
            className={`px-4 py-2 rounded ${mode === 'signup' ? 'bg-blue-600 text-white' : 'bg-gray-100'}`}
            onClick={() => setMode('signup')}
          >
            Create Account
          </button>
        </div>
        <div>
          {mode === 'login' ? <LoginPage /> : <SignupPage />}
        </div>
      </div>
    </div>
  );
}
