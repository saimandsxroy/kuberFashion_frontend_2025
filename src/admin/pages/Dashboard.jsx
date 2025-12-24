import React, { useState, useEffect } from 'react';
import { Users, ShoppingBag, Package, TrendingUp, DollarSign, Activity, Plus, Eye, BarChart3 } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { Link } from 'react-router-dom';

export default function AdminDashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalOrders: 0,
    totalProducts: 0,
    totalRevenue: 0
  });

  useEffect(() => {
    // Fetch stats from backend
    fetchStats();
  }, []);

  const fetchStats = async () => {
    // Mock data for now
    setStats({
      totalUsers: 150,
      totalOrders: 45,
      totalProducts: 120,
      totalRevenue: 15000
    });
  };

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl shadow-xl p-8 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold mb-2">
              Welcome, {user?.firstName || user?.email?.split('@')[0] || 'Admin'}! 👋
            </h1>
            <p className="text-blue-100 text-lg">
              Here's what's happening with your store today
            </p>
          </div>
          <div className="hidden md:block">
            <div className="bg-white/20 backdrop-blur-sm rounded-lg p-4">
              <div className="text-2xl font-bold">{new Date().toLocaleDateString()}</div>
              <div className="text-blue-100">Today</div>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Total Users */}
        <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 uppercase tracking-wide">Total Users</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">
                {stats.totalUsers.toLocaleString()}
              </p>
              <p className="text-sm text-green-600 mt-2 flex items-center">
                <TrendingUp className="w-4 h-4 mr-1" />
                +12% from last month
              </p>
            </div>
            <div className="p-4 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl shadow-lg">
              <Users className="w-8 h-8 text-white" />
            </div>
          </div>
        </div>

        {/* Total Orders */}
        <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 uppercase tracking-wide">Total Orders</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">
                {stats.totalOrders.toLocaleString()}
              </p>
              <p className="text-sm text-green-600 mt-2 flex items-center">
                <TrendingUp className="w-4 h-4 mr-1" />
                +8% from last month
              </p>
            </div>
            <div className="p-4 bg-gradient-to-br from-green-500 to-green-600 rounded-xl shadow-lg">
              <ShoppingBag className="w-8 h-8 text-white" />
            </div>
          </div>
        </div>

        {/* Total Products */}
        <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 uppercase tracking-wide">Total Products</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">
                {stats.totalProducts.toLocaleString()}
              </p>
              <p className="text-sm text-blue-600 mt-2 flex items-center">
                <Activity className="w-4 h-4 mr-1" />
                Active inventory
              </p>
            </div>
            <div className="p-4 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl shadow-lg">
              <Package className="w-8 h-8 text-white" />
            </div>
          </div>
        </div>

        {/* Total Revenue */}
        <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 uppercase tracking-wide">Total Revenue</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">
                ₹{stats.totalRevenue.toLocaleString()}
              </p>
              <p className="text-sm text-green-600 mt-2 flex items-center">
                <TrendingUp className="w-4 h-4 mr-1" />
                +15% from last month
              </p>
            </div>
            <div className="p-4 bg-gradient-to-br from-yellow-500 to-orange-500 rounded-xl shadow-lg">
              <DollarSign className="w-8 h-8 text-white" />
            </div>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Orders */}
        <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold text-gray-900">Recent Orders</h3>
            <Link to="/admin/orders" className="text-blue-600 hover:text-blue-700 text-sm font-medium">
              View All →
            </Link>
          </div>
          <div className="space-y-4">
            {[1, 2, 3].map((item) => (
              <div key={item} className="flex items-center justify-between border-b pb-3">
                <div>
                  <p className="font-medium text-gray-900">Order #{1000 + item}</p>
                  <p className="text-sm text-gray-600">Customer Name</p>
                </div>
                <div className="text-right">
                  <p className="font-medium text-gray-900">₹{(Math.random() * 5000 + 1000).toFixed(2)}</p>
                  <span className="inline-block px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
                    Completed
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Top Products */}
        <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold text-gray-900">Top Products</h3>
            <Link to="/admin/products" className="text-blue-600 hover:text-blue-700 text-sm font-medium">
              Manage →
            </Link>
          </div>
          <div className="space-y-4">
            {[1, 2, 3].map((item) => (
              <div key={item} className="flex items-center justify-between border-b pb-3">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-gray-200 rounded"></div>
                  <div>
                    <p className="font-medium text-gray-900">Product {item}</p>
                    <p className="text-sm text-gray-600">{Math.floor(Math.random() * 50 + 10)} sales</p>
                  </div>
                </div>
                <p className="font-medium text-gray-900">₹{(Math.random() * 2000 + 500).toFixed(2)}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
        <h3 className="text-xl font-bold text-gray-900 mb-6">Quick Actions</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Link to="/admin/products" className="group p-6 border-2 border-dashed border-gray-300 rounded-xl hover:border-blue-500 hover:bg-gradient-to-br hover:from-blue-50 hover:to-blue-100 transition-all duration-200 transform hover:scale-105">
            <div className="flex flex-col items-center text-center">
              <div className="p-3 bg-blue-100 group-hover:bg-blue-200 rounded-full mb-3 transition-colors">
                <Plus className="w-6 h-6 text-blue-600" />
              </div>
              <p className="text-sm font-semibold text-gray-900 group-hover:text-blue-700">Add Product</p>
              <p className="text-xs text-gray-500 mt-1">Create new items</p>
            </div>
          </Link>
          
          <Link to="/admin/users" className="group p-6 border-2 border-dashed border-gray-300 rounded-xl hover:border-green-500 hover:bg-gradient-to-br hover:from-green-50 hover:to-green-100 transition-all duration-200 transform hover:scale-105">
            <div className="flex flex-col items-center text-center">
              <div className="p-3 bg-green-100 group-hover:bg-green-200 rounded-full mb-3 transition-colors">
                <Users className="w-6 h-6 text-green-600" />
              </div>
              <p className="text-sm font-semibold text-gray-900 group-hover:text-green-700">Manage Users</p>
              <p className="text-xs text-gray-500 mt-1">User accounts</p>
            </div>
          </Link>
          
          <Link to="/admin/orders" className="group p-6 border-2 border-dashed border-gray-300 rounded-xl hover:border-purple-500 hover:bg-gradient-to-br hover:from-purple-50 hover:to-purple-100 transition-all duration-200 transform hover:scale-105">
            <div className="flex flex-col items-center text-center">
              <div className="p-3 bg-purple-100 group-hover:bg-purple-200 rounded-full mb-3 transition-colors">
                <ShoppingBag className="w-6 h-6 text-purple-600" />
              </div>
              <p className="text-sm font-semibold text-gray-900 group-hover:text-purple-700">View Orders</p>
              <p className="text-xs text-gray-500 mt-1">Order management</p>
            </div>
          </Link>
          
          <button className="group p-6 border-2 border-dashed border-gray-300 rounded-xl hover:border-orange-500 hover:bg-gradient-to-br hover:from-orange-50 hover:to-orange-100 transition-all duration-200 transform hover:scale-105">
            <div className="flex flex-col items-center text-center">
              <div className="p-3 bg-orange-100 group-hover:bg-orange-200 rounded-full mb-3 transition-colors">
                <BarChart3 className="w-6 h-6 text-orange-600" />
              </div>
              <p className="text-sm font-semibold text-gray-900 group-hover:text-orange-700">Analytics</p>
              <p className="text-xs text-gray-500 mt-1">View reports</p>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
}
