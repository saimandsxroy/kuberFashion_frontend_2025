import React, { useState, useEffect } from 'react';
import { Users, ShoppingBag, Package, TrendingUp, DollarSign, Activity, Plus, ArrowRight, ArrowUpRight } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { Link } from 'react-router-dom';
import { adminAPI } from '../../services/api';

export default function AdminDashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalOrders: 0,
    totalProducts: 0,
    totalRevenue: 0,
    pendingOrders: 0,
    recentTransactions: []
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      setLoading(true);
      const res = await adminAPI.getDashboardStats();
      const data = res.data?.data;
      if (data) {
        setStats({
          totalUsers: data.totalUsers || 0,
          totalOrders: data.totalOrders || 0,
          totalProducts: data.totalProducts || 0,
          totalRevenue: parseFloat(data.totalRevenue) || 0,
          pendingOrders: data.pendingOrders || 0,
          recentTransactions: data.recentTransactions || []
        });
      }
    } catch (err) {
      console.error('Failed to fetch dashboard stats:', err);
    } finally {
      setLoading(false);
    }
  };

  const formatTime = (dateStr) => {
    if (!dateStr) return 'N/A';
    const date = new Date(dateStr);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    if (diffMins < 60) return `${diffMins} mins ago`;
    const diffHours = Math.floor(diffMins / 60);
    if (diffHours < 24) return `${diffHours} hours ago`;
    return date.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' });
  };

  const StatCard = ({ title, value, icon: Icon, trend, trendValue, delay }) => (
    <div className="bg-white p-6 md:p-8 rounded-none border border-gray-100 hover:border-gray-900 transition-all duration-300 group relative overflow-hidden animate-in fade-in slide-in-from-bottom-4" style={{ animationDelay: `${delay}ms` }}>
      <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity transform group-hover:scale-110 duration-500">
        <Icon className="w-24 h-24" />
      </div>

      <div className="relative z-10">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-gray-500 group-hover:text-black transition-colors">{title}</h3>
          <div className="p-2 bg-gray-50 group-hover:bg-black group-hover:text-white rounded-full transition-all duration-300">
            <Icon className="w-4 h-4" />
          </div>
        </div>

        <div className="flex items-baseline gap-3">
          <span className="text-4xl md:text-5xl font-heading font-bold text-gray-900 leading-none">
            {value}
          </span>
        </div>

        <div className="mt-4 flex items-center text-xs font-medium">
          <span className={`flex items-center ${trend === 'up' ? 'text-green-600' : 'text-red-500'}`}>
            <ArrowUpRight className="w-3 h-3 mr-1" />
            {trendValue}
          </span>
          <span className="text-gray-400 ml-2">vs last month</span>
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-12">
      {/* Welcome Section */}
      <div className="relative overflow-hidden bg-black text-white p-8 md:p-12 rounded-2xl shadow-2xl">
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-gray-800 to-black rounded-full blur-3xl opacity-50 -translate-y-1/2 translate-x-1/2"></div>
        <div className="relative z-10">
          <h1 className="text-4xl md:text-5xl font-heading font-light mb-4 text-white">
            Welcome back, <span className="font-bold">{user?.firstName || 'Admin'}</span>
          </h1>
          <p className="text-gray-400 max-w-xl text-lg font-light leading-relaxed">
            Here's your daily overview. You have <span className="text-white font-medium">{stats.totalOrders} total orders</span> and <span className="text-white font-medium">{stats.pendingOrders} pending</span> to review.
          </p>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-px bg-gray-200 border border-gray-200 overflow-hidden rounded-2xl">
        <StatCard
          title="Total Revenue"
          value={`₹${stats.totalRevenue.toLocaleString()}`}
          icon={DollarSign}
          trend="up"
          trendValue="Delivered"
          delay={100}
        />
        <StatCard
          title="Active Users"
          value={stats.totalUsers.toLocaleString()}
          icon={Users}
          trend="up"
          trendValue="Registered"
          delay={200}
        />
        <StatCard
          title="Total Orders"
          value={stats.totalOrders.toLocaleString()}
          icon={ShoppingBag}
          trend="up"
          trendValue="All Time"
          delay={300}
        />
        <StatCard
          title="Inventory"
          value={stats.totalProducts.toLocaleString()}
          icon={Package}
          trend="up"
          trendValue="Products"
          delay={400}
        />
      </div>

      {/* Recent Activity Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

        {/* Recent Orders Table */}
        <div className="lg:col-span-2 bg-white p-8 rounded-2xl border border-gray-100 shadow-sm">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-xl font-heading font-bold text-gray-900">Recent Transactions</h2>
            <Link to="/admin/orders" className="group flex items-center text-xs font-bold uppercase tracking-widest text-gray-500 hover:text-black transition-colors">
              View All <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          <div className="space-y-6">
            {loading ? (
              <div className="text-center py-8 text-gray-400">Loading transactions...</div>
            ) : stats.recentTransactions.length > 0 ? (
              stats.recentTransactions.map((tx) => (
                <div key={tx.orderId} className="group flex items-center justify-between p-4 rounded-xl hover:bg-gray-50 transition-colors border border-transparent hover:border-gray-100">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center text-gray-400 group-hover:bg-black group-hover:text-white transition-all duration-300">
                      <ShoppingBag className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="font-bold text-gray-900">Order #{tx.orderNumber}</h4>
                      <p className="text-xs text-gray-500 mt-1">{tx.userName} • {formatTime(tx.createdAt)}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-gray-900">₹{parseFloat(tx.amount || 0).toLocaleString()}</p>
                    <span className={`text-[10px] font-bold px-2 py-1 rounded-full uppercase tracking-wide ${tx.status === 'DELIVERED' ? 'text-green-600 bg-green-50' :
                        tx.status === 'PENDING' ? 'text-yellow-600 bg-yellow-50' :
                          tx.status === 'CONFIRMED' ? 'text-blue-600 bg-blue-50' :
                            'text-gray-600 bg-gray-100'
                      }`}>
                      {tx.status}
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8 text-gray-400">No transactions yet</div>
            )}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-black text-white p-8 rounded-2xl shadow-xl flex flex-col relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-gray-900 to-black z-0"></div>
          <div className="relative z-10">
            <h2 className="text-xl font-heading font-bold mb-1 text-white">Quick Actions</h2>
            <p className="text-gray-400 text-sm mb-8 font-light">Manage your store efficiently</p>

            <div className="space-y-3">
              <Link to="/admin/products" className="flex items-center justify-between p-4 bg-white/10 hover:bg-white/20 rounded-xl transition-all duration-200 border border-white/5 hover:border-white/20 group">
                <div className="flex items-center gap-3">
                  <Plus className="w-5 h-5 text-white" />
                  <span className="font-medium">Add New Product</span>
                </div>
                <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transform -translate-x-2 group-hover:translate-x-0 transition-all" />
              </Link>

              <Link to="/admin/users" className="flex items-center justify-between p-4 bg-white/10 hover:bg-white/20 rounded-xl transition-all duration-200 border border-white/5 hover:border-white/20 group">
                <div className="flex items-center gap-3">
                  <Users className="w-5 h-5 text-white" />
                  <span className="font-medium">Manage Users</span>
                </div>
                <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transform -translate-x-2 group-hover:translate-x-0 transition-all" />
              </Link>

              <div className="mt-8 pt-8 border-t border-white/10">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-400">Server Status</span>
                  <span className="text-green-400 flex items-center gap-2">
                    <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                    Online
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
