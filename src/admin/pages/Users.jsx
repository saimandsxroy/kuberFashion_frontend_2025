import React, { useState, useEffect } from 'react';
import { User, Search, Edit, Trash2, UserPlus, X, ChevronLeft, ChevronRight, Shield, CheckCircle, XCircle, Eye, EyeOff, Key, Ticket, Plus, Minus } from 'lucide-react';
import { adminAPI } from '../../services/api';

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRole, setFilterRole] = useState('');
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [totalUsers, setTotalUsers] = useState(0);

  // User stats from API (accurate totals)
  const [userStats, setUserStats] = useState({ totalUsers: 0, activeUsers: 0, adminCount: 0 });

  // Modal state
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState('add'); // 'add' or 'edit'
  const [selectedUser, setSelectedUser] = useState(null);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    role: 'USER'
  });
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Password Reset Modal State
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [passwordResetUser, setPasswordResetUser] = useState(null);
  const [passwordData, setPasswordData] = useState({ newPassword: '', confirmPassword: '' });
  const [passwordError, setPasswordError] = useState('');
  const [passwordSubmitting, setPasswordSubmitting] = useState(false);

  // Coupon Modal State
  const [showCouponModal, setShowCouponModal] = useState(false);
  const [couponUser, setCouponUser] = useState(null);
  const [couponAmount, setCouponAmount] = useState(0);
  const [couponReason, setCouponReason] = useState('');
  const [couponSubmitting, setCouponSubmitting] = useState(false);
  const [couponError, setCouponError] = useState('');

  // Fetch users from backend
  const fetchUsers = async () => {
    setLoading(true);
    setError('');
    try {
      const params = { page, size: 10 };
      if (filterRole && filterRole !== 'all') params.role = filterRole;
      if (searchTerm) params.q = searchTerm;

      const res = await adminAPI.getUsers(params);
      const data = res.data?.data;
      setUsers(data?.items || []);
      setTotalPages(data?.totalPages || 0);
      setTotalUsers(data?.totalElements || 0);
    } catch (e) {
      setError(e.response?.data?.message || 'Failed to load users');
      console.error('Failed to load users:', e);
    } finally {
      setLoading(false);
    }
  };

  // Fetch user stats (accurate totals)
  const fetchUserStats = async () => {
    try {
      const res = await adminAPI.getUserStats();
      const stats = res.data?.data;
      if (stats) {
        setUserStats({
          totalUsers: stats.totalUsers || 0,
          activeUsers: stats.activeUsers || 0,
          adminCount: stats.adminCount || 0
        });
      }
    } catch (e) {
      console.error('Failed to load user stats:', e);
    }
  };

  useEffect(() => {
    fetchUsers();
    fetchUserStats();
  }, [page, filterRole]);

  // Debounced search
  useEffect(() => {
    const timer = setTimeout(() => {
      setPage(0);
      fetchUsers();
    }, 500);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  // Handle form input change
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // Open add user modal
  const openAddModal = () => {
    setModalMode('add');
    setSelectedUser(null);
    setFormData({
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      password: '',
      confirmPassword: '',
      role: 'USER'
    });
    setFormError('');
    setShowModal(true);
  };

  // Open edit user modal
  const openEditModal = (user) => {
    setModalMode('edit');
    setSelectedUser(user);
    setFormData({
      firstName: user.firstName || '',
      lastName: user.lastName || '',
      email: user.email || '',
      phone: user.phone || '',
      password: '',
      role: user.role || 'USER'
    });
    setFormError('');
    setShowModal(true);
  };

  // Handle form submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError('');
    setSubmitting(true);

    try {
      if (modalMode === 'add') {
        // Validate required fields
        if (!formData.firstName || !formData.lastName || !formData.email || !formData.password) {
          setFormError('Please fill in all required fields');
          setSubmitting(false);
          return;
        }
        // Validate password match
        if (formData.password !== formData.confirmPassword) {
          setFormError('Passwords do not match');
          setSubmitting(false);
          return;
        }
        await adminAPI.createUser(formData);
      } else {
        // For edit, update role only
        if (selectedUser && formData.role !== selectedUser.role) {
          await adminAPI.updateUserRole(selectedUser.id, formData.role);
        }
      }

      setShowModal(false);
      fetchUsers(); // Refresh the list
    } catch (e) {
      setFormError(e.response?.data?.message || 'Operation failed');
    } finally {
      setSubmitting(false);
    }
  };

  // Handle delete user
  const handleDeleteUser = async (userId) => {
    if (!window.confirm('Are you sure you want to delete this user? This action cannot be undone.')) {
      return;
    }

    try {
      await adminAPI.deleteUser(userId);
      fetchUsers(); // Refresh the list
    } catch (e) {
      alert(e.response?.data?.message || 'Failed to delete user');
    }
  };

  // Handle toggle user status
  const handleToggleStatus = async (user) => {
    try {
      await adminAPI.updateUserStatus(user.id, !user.enabled);
      fetchUsers(); // Refresh the list
    } catch (e) {
      alert(e.response?.data?.message || 'Failed to update user status');
    }
  };

  // Open password reset modal
  const openPasswordResetModal = (user) => {
    setPasswordResetUser(user);
    setPasswordData({ newPassword: '', confirmPassword: '' });
    setPasswordError('');
    setShowPasswordModal(true);
  };

  // Handle password reset submit
  const handlePasswordReset = async (e) => {
    e.preventDefault();
    setPasswordError('');

    if (passwordData.newPassword.length < 6) {
      setPasswordError('Password must be at least 6 characters');
      return;
    }
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setPasswordError('Passwords do not match');
      return;
    }

    setPasswordSubmitting(true);
    try {
      await adminAPI.resetUserPassword(passwordResetUser.id, passwordData.newPassword, passwordData.confirmPassword);
      setShowPasswordModal(false);
      alert('Password reset successfully!');
    } catch (e) {
      setPasswordError(e.response?.data?.message || 'Failed to reset password');
    } finally {
      setPasswordSubmitting(false);
    }
  };

  // Open coupon management modal
  const openCouponModal = (user) => {
    setCouponUser(user);
    setCouponAmount(0);
    setCouponReason('');
    setCouponError('');
    setShowCouponModal(true);
  };

  // Handle coupon update
  const handleCouponUpdate = async (action) => {
    if (couponAmount <= 0) {
      setCouponError('Please enter an amount greater than 0');
      return;
    }
    setCouponSubmitting(true);
    setCouponError('');
    try {
      await adminAPI.updateUserCoupons(couponUser.id, action, couponAmount, couponReason);
      setShowCouponModal(false);
      fetchUsers();
    } catch (e) {
      setCouponError(e.response?.data?.message || 'Failed to update coupons');
    } finally {
      setCouponSubmitting(false);
    }
  };

  if (loading && users.length === 0) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-heading font-light text-gray-900">User Management</h1>
          <p className="text-gray-500 mt-1 font-light">Manage access and user permissions</p>
        </div>
        <button
          onClick={openAddModal}
          className="bg-black hover:bg-gray-900 text-white px-6 py-3 rounded-xl flex items-center gap-2 transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
        >
          <UserPlus className="h-4 w-4" />
          <span className="font-medium text-sm tracking-wide uppercase">Add User</span>
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          { label: 'Total Users', value: userStats.totalUsers, icon: User, color: 'text-black' },
          { label: 'Active Users', value: userStats.activeUsers, icon: CheckCircle, color: 'text-green-600' },
          { label: 'Administrators', value: userStats.adminCount, icon: Shield, color: 'text-purple-600' }
        ].map((stat, i) => (
          <div key={i} className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">{stat.label}</p>
                <p className="text-3xl font-heading font-bold text-gray-900 mt-2">{stat.value}</p>
              </div>
              <div className={`p-3 bg-gray-50 rounded-xl ${stat.color}`}>
                <stat.icon className="h-6 w-6" />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Main Content Card */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">

        {/* Toolbar */}
        <div className="p-6 border-b border-gray-100 flex flex-col sm:flex-row gap-4 justify-between items-center bg-gray-50/50">
          <div className="relative w-full sm:w-96">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <input
              type="text"
              placeholder="Search users..."
              className="w-full pl-11 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-black/5 focus:border-black transition-all text-sm"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <select
            className="px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-black/5 focus:border-black cursor-pointer"
            value={filterRole}
            onChange={(e) => { setFilterRole(e.target.value); setPage(0); }}
          >
            <option value="">All Roles</option>
            <option value="USER">Users</option>
            <option value="ADMIN">Admins</option>
          </select>
        </div>

        {/* Error Message */}
        {error && (
          <div className="m-6 bg-red-50 border border-red-100 text-red-600 px-4 py-3 rounded-xl flex items-center gap-2 text-sm">
            <XCircle className="h-4 w-4" />
            {error}
          </div>
        )}

        {/* Users Table */}
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-100">
            <thead className="bg-gray-50/50">
              <tr>
                <th className="px-8 py-5 text-left text-[10px] font-bold text-gray-400 uppercase tracking-widest">User</th>
                <th className="px-6 py-5 text-left text-[10px] font-bold text-gray-400 uppercase tracking-widest">Role</th>
                <th className="px-6 py-5 text-left text-[10px] font-bold text-gray-400 uppercase tracking-widest">Contact</th>
                <th className="px-6 py-5 text-left text-[10px] font-bold text-gray-400 uppercase tracking-widest">Status</th>
                <th className="px-6 py-5 text-center text-[10px] font-bold text-gray-400 uppercase tracking-widest">Coupons</th>
                <th className="px-6 py-5 text-right text-[10px] font-bold text-gray-400 uppercase tracking-widest">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-50">
              {users.map((user) => (
                <tr key={user.id} className="hover:bg-gray-50/80 transition-colors group">
                  <td className="px-8 py-5 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="h-10 w-10 rounded-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center text-gray-500 font-bold text-sm shadow-inner">
                        {user.firstName?.[0]}{user.lastName?.[0]}
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-bold text-gray-900 group-hover:text-black">
                          {user.firstName} {user.lastName}
                        </div>
                        <div className="text-xs text-gray-500 font-mono mt-0.5">{user.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-5 whitespace-nowrap">
                    <span className={`inline-flex items-center gap-1.5 px-3 py-1 text-[10px] font-bold uppercase tracking-wider rounded-full ${user.role === 'ADMIN'
                      ? 'bg-black text-white'
                      : 'bg-gray-100 text-gray-600 border border-gray-200'
                      }`}>
                      {user.role === 'ADMIN' && <Shield className="h-3 w-3" />}
                      {user.role}
                    </span>
                  </td>
                  <td className="px-6 py-5 whitespace-nowrap text-sm text-gray-500">
                    {user.phone || <span className="text-gray-300">-</span>}
                  </td>
                  <td className="px-6 py-5 whitespace-nowrap">
                    <button
                      onClick={() => handleToggleStatus(user)}
                      className={`inline-flex items-center gap-1.5 px-3 py-1 text-[10px] font-bold uppercase tracking-wider rounded-full transition-all ${user.enabled
                        ? 'bg-green-50 text-green-700 border border-green-100 hover:bg-green-100'
                        : 'bg-red-50 text-red-700 border border-red-100 hover:bg-red-100'
                        }`}
                    >
                      <span className={`w-1.5 h-1.5 rounded-full ${user.enabled ? 'bg-green-500' : 'bg-red-500'}`}></span>
                      {user.enabled ? 'Active' : 'Disabled'}
                    </button>
                  </td>
                  <td className="px-6 py-5 whitespace-nowrap text-center">
                    <button
                      onClick={() => openCouponModal(user)}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm font-bold rounded-lg bg-amber-50 text-amber-700 border border-amber-200 hover:bg-amber-100 transition-colors"
                      title="Manage Coupons"
                    >
                      <Ticket className="h-4 w-4" />
                      {user.kuberCoupons || 0}
                    </button>
                  </td>
                  <td className="px-6 py-5 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex items-center justify-end space-x-2">
                      <button
                        onClick={() => openPasswordResetModal(user)}
                        className="p-2 text-gray-400 hover:text-orange-600 hover:bg-orange-50 rounded-lg transition-colors"
                        title="Reset Password"
                      >
                        <Key className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => openEditModal(user)}
                        className="p-2 text-gray-400 hover:text-black hover:bg-gray-100 rounded-lg transition-colors"
                        title="Edit Role"
                      >
                        <Edit className="h-4 w-4" />
                      </button>
                      {user.role !== 'ADMIN' && (
                        <button
                          onClick={() => handleDeleteUser(user.id)}
                          className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          title="Delete User"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Empty State */}
        {users.length === 0 && !loading && (
          <div className="text-center py-20 bg-gray-50/50">
            <div className="bg-white p-4 rounded-full shadow-sm inline-block mb-4">
              <Search className="h-8 w-8 text-gray-300" />
            </div>
            <h3 className="text-gray-900 font-medium mb-1">No users found</h3>
            <p className="text-sm text-gray-500">Try adjusting your search or filters.</p>
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="px-8 py-5 border-t border-gray-100 flex items-center justify-between bg-gray-50/30">
            <div className="text-xs font-medium text-gray-500 uppercase tracking-wide">
              Page {page + 1} of {totalPages}
            </div>
            <div className="flex space-x-2">
              <button
                onClick={() => setPage(p => Math.max(0, p - 1))}
                disabled={page === 0}
                className="p-2 text-gray-500 hover:text-black hover:bg-gray-100 rounded-lg disabled:opacity-30 disabled:hover:bg-transparent transition-colors"
              >
                <ChevronLeft className="h-5 w-5" />
              </button>
              <button
                onClick={() => setPage(p => p + 1)}
                disabled={page + 1 >= totalPages}
                className="p-2 text-gray-500 hover:text-black hover:bg-gray-100 rounded-lg disabled:opacity-30 disabled:hover:bg-transparent transition-colors"
              >
                <ChevronRight className="h-5 w-5" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Add/Edit User Modal - Premium Style */}
      {showModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[100] p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden scale-100 animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between px-8 py-6 border-b border-gray-100 bg-gray-50/50">
              <h2 className="text-xl font-heading font-bold text-gray-900">
                {modalMode === 'add' ? 'Add New User' : 'Edit User'}
              </h2>
              <button
                onClick={() => setShowModal(false)}
                className="text-gray-400 hover:text-black transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-8 space-y-6">
              {formError && (
                <div className="bg-red-50 text-red-600 px-4 py-3 rounded-xl text-sm font-medium border border-red-100 flex items-center gap-2">
                  <XCircle className="h-4 w-4" />
                  {formError}
                </div>
              )}

              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">First Name</label>
                    <input
                      type="text"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 bg-gray-50 border-none rounded-xl focus:ring-2 focus:ring-black/5 transition-all outline-none"
                      required
                      disabled={modalMode === 'edit'}
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Last Name</label>
                    <input
                      type="text"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 bg-gray-50 border-none rounded-xl focus:ring-2 focus:ring-black/5 transition-all outline-none"
                      required
                      disabled={modalMode === 'edit'}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Email</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 bg-gray-50 border-none rounded-xl focus:ring-2 focus:ring-black/5 transition-all outline-none"
                    required
                    disabled={modalMode === 'edit'}
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Phone</label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 bg-gray-50 border-none rounded-xl focus:ring-2 focus:ring-black/5 transition-all outline-none"
                    disabled={modalMode === 'edit'}
                  />
                </div>

                {modalMode === 'add' && (
                  <>
                    <div>
                      <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Password</label>
                      <div className="relative">
                        <input
                          type={showPassword ? 'text' : 'password'}
                          name="password"
                          value={formData.password}
                          onChange={handleInputChange}
                          className="w-full px-4 py-3 pr-12 bg-gray-50 border-none rounded-xl focus:ring-2 focus:ring-black/5 transition-all outline-none"
                          required
                          minLength={6}
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                        >
                          {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                        </button>
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Confirm Password</label>
                      <div className="relative">
                        <input
                          type={showConfirmPassword ? 'text' : 'password'}
                          name="confirmPassword"
                          value={formData.confirmPassword}
                          onChange={handleInputChange}
                          className={`w-full px-4 py-3 pr-12 bg-gray-50 border-none rounded-xl focus:ring-2 focus:ring-black/5 transition-all outline-none ${formData.confirmPassword && formData.password !== formData.confirmPassword ? 'ring-2 ring-red-300' : ''}`}
                          required
                          minLength={6}
                        />
                        <button
                          type="button"
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                        >
                          {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                        </button>
                      </div>
                      {formData.confirmPassword && formData.password !== formData.confirmPassword && (
                        <p className="text-red-500 text-xs mt-1">Passwords do not match</p>
                      )}
                    </div>
                  </>
                )}

                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Role</label>
                  <select
                    name="role"
                    value={formData.role}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 bg-gray-50 border-none rounded-xl focus:ring-2 focus:ring-black/5 transition-all outline-none appearance-none cursor-pointer"
                  >
                    <option value="USER">User</option>
                    <option value="ADMIN">Admin</option>
                  </select>
                </div>
              </div>

              <div className="flex justify-end space-x-3 pt-4 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-6 py-2.5 rounded-xl text-gray-600 hover:bg-gray-50 font-medium transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-6 py-2.5 bg-black text-white rounded-xl hover:bg-gray-900 font-medium shadow-lg hover:shadow-xl transition-all disabled:opacity-70 transform hover:-translate-y-0.5"
                >
                  {submitting ? 'Saving...' : (modalMode === 'add' ? 'Create User' : 'Save Changes')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Password Reset Modal */}
      {showPasswordModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[100] p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden scale-100 animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between px-8 py-6 border-b border-gray-100 bg-orange-50/50">
              <div>
                <h2 className="text-xl font-heading font-bold text-gray-900 flex items-center gap-2">
                  <Key className="h-5 w-5 text-orange-600" />
                  Reset Password
                </h2>
                <p className="text-sm text-gray-500 mt-1">
                  For: {passwordResetUser?.firstName} {passwordResetUser?.lastName}
                </p>
              </div>
              <button
                onClick={() => setShowPasswordModal(false)}
                className="text-gray-400 hover:text-black transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handlePasswordReset} className="p-8 space-y-6">
              {passwordError && (
                <div className="bg-red-50 text-red-600 px-4 py-3 rounded-xl text-sm font-medium border border-red-100 flex items-center gap-2">
                  <XCircle className="h-4 w-4" />
                  {passwordError}
                </div>
              )}

              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">New Password</label>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={passwordData.newPassword}
                      onChange={(e) => setPasswordData(prev => ({ ...prev, newPassword: e.target.value }))}
                      className="w-full px-4 py-3 pr-12 bg-gray-50 border-none rounded-xl focus:ring-2 focus:ring-orange-500/20 transition-all outline-none"
                      placeholder="Enter new password"
                      required
                      minLength={6}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                    >
                      {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Confirm Password</label>
                  <div className="relative">
                    <input
                      type={showConfirmPassword ? 'text' : 'password'}
                      value={passwordData.confirmPassword}
                      onChange={(e) => setPasswordData(prev => ({ ...prev, confirmPassword: e.target.value }))}
                      className={`w-full px-4 py-3 pr-12 bg-gray-50 border-none rounded-xl focus:ring-2 focus:ring-orange-500/20 transition-all outline-none ${passwordData.confirmPassword && passwordData.newPassword !== passwordData.confirmPassword ? 'ring-2 ring-red-300' : ''}`}
                      placeholder="Confirm new password"
                      required
                      minLength={6}
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                    >
                      {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                    </button>
                  </div>
                  {passwordData.confirmPassword && passwordData.newPassword !== passwordData.confirmPassword && (
                    <p className="text-red-500 text-xs mt-1">Passwords do not match</p>
                  )}
                </div>
              </div>

              <div className="flex justify-end space-x-3 pt-4 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setShowPasswordModal(false)}
                  className="px-6 py-2.5 rounded-xl text-gray-600 hover:bg-gray-50 font-medium transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={passwordSubmitting}
                  className="px-6 py-2.5 bg-orange-600 text-white rounded-xl hover:bg-orange-700 font-medium shadow-lg hover:shadow-xl transition-all disabled:opacity-70 transform hover:-translate-y-0.5"
                >
                  {passwordSubmitting ? 'Resetting...' : 'Reset Password'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Coupon Management Modal */}
      {showCouponModal && couponUser && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[100] p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden scale-100 animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between px-8 py-6 border-b border-gray-100 bg-amber-50/50">
              <div>
                <h2 className="text-xl font-heading font-bold text-gray-900 flex items-center gap-2">
                  <Ticket className="h-5 w-5 text-amber-600" />
                  Manage Kuber Coupons
                </h2>
                <p className="text-sm text-gray-500 mt-1">
                  For: {couponUser?.firstName} {couponUser?.lastName}
                </p>
              </div>
              <button
                onClick={() => setShowCouponModal(false)}
                className="text-gray-400 hover:text-black transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="p-8 space-y-6">
              {couponError && (
                <div className="bg-red-50 text-red-600 px-4 py-3 rounded-xl text-sm font-medium border border-red-100 flex items-center gap-2">
                  <XCircle className="h-4 w-4" />
                  {couponError}
                </div>
              )}

              {/* Current Balance */}
              <div className="text-center py-6 bg-gray-50 rounded-xl">
                <p className="text-6xl font-black text-gray-900">{couponUser?.kuberCoupons || 0}</p>
                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mt-2">Kuber Coupons</p>
              </div>

              {/* Update Balance */}
              <div className="space-y-3">
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider text-center">Update Balance</label>
                <div className="flex items-center justify-center gap-4">
                  <button
                    type="button"
                    onClick={() => setCouponAmount(Math.max(0, couponAmount - 1))}
                    className="w-12 h-12 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors"
                  >
                    <Minus className="h-5 w-5 text-gray-600" />
                  </button>
                  <input
                    type="number"
                    value={couponAmount}
                    onChange={(e) => setCouponAmount(Math.max(0, parseInt(e.target.value) || 0))}
                    className="w-24 text-center px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-lg font-bold focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 outline-none"
                    min="0"
                  />
                  <button
                    type="button"
                    onClick={() => setCouponAmount(couponAmount + 1)}
                    className="w-12 h-12 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors"
                  >
                    <Plus className="h-5 w-5 text-gray-600" />
                  </button>
                </div>
              </div>

              {/* Reason */}
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Reason (Optional)</label>
                <input
                  type="text"
                  value={couponReason}
                  onChange={(e) => setCouponReason(e.target.value)}
                  placeholder="e.g., Bonus for referral, Correction"
                  className="w-full px-4 py-3 bg-gray-50 border-none rounded-xl focus:ring-2 focus:ring-amber-500/20 transition-all outline-none text-sm"
                />
              </div>

              {/* Actions */}
              <div className="flex gap-3 pt-4 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => handleCouponUpdate('DEDUCT')}
                  disabled={couponSubmitting || couponAmount <= 0}
                  className="flex-1 px-6 py-3 bg-red-100 text-red-700 rounded-xl hover:bg-red-200 font-bold text-sm uppercase tracking-wider transition-all disabled:opacity-50"
                >
                  Deduct
                </button>
                <button
                  type="button"
                  onClick={() => handleCouponUpdate('ADD')}
                  disabled={couponSubmitting || couponAmount <= 0}
                  className="flex-1 px-6 py-3 bg-green-600 text-white rounded-xl hover:bg-green-700 font-bold text-sm uppercase tracking-wider shadow-lg hover:shadow-xl transition-all disabled:opacity-50"
                >
                  {couponSubmitting ? 'Updating...' : 'Add'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminUsers;
