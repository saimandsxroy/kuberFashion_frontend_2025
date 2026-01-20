import React, { useEffect, useState } from 'react';
import api from '../../services/api';
import { User, Mail, Shield, Calendar, Clock, Edit2, Check, Smartphone, AlertCircle } from 'lucide-react';

export default function UserProfilePage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [form, setForm] = useState({ firstName: '', lastName: '', phone: '' });
  const [meta, setMeta] = useState({ email: '', role: '', createdAt: '', lastActivity: '' });

  const load = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await api.get('/users/profile');
      const u = res.data?.data;
      setForm({ firstName: u.firstName || '', lastName: u.lastName || '', phone: u.phone || '' });
      setMeta({
        email: u.email,
        role: u.role,
        createdAt: u.createdAt,
        lastActivity: u.lastActivity,
      });
    } catch (e) {
      setError(e.response?.data?.message || 'Failed to load profile');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const onChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const onSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    setSuccess('');
    try {
      const res = await api.put('/users/profile', form);
      setSuccess('Profile updated successfully');
      await load();
      // Auto clear success message
      setTimeout(() => setSuccess(''), 3000);
    } catch (e) {
      setError(e.response?.data?.message || 'Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="w-8 h-8 border-4 border-action rounded-full animate-spin border-t-transparent"></div>
    </div>
  );

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 md:py-12">
      <div className="mb-8">
        <h1 className="text-3xl font-heading font-bold text-gray-900">My Profile</h1>
        <p className="text-gray-500 mt-1">Manage your account settings and preferences.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Account Overview Card */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white rounded-2xl shadow-premium overflow-hidden border border-gray-100">
            <div className="h-24 bg-gradient-to-r from-action-light to-action"></div>
            <div className="px-6 relative">
              <div className="absolute -top-12 left-6">
                <div className="w-24 h-24 bg-white rounded-2xl shadow-lg p-1">
                  <div className="w-full h-full bg-gray-50 rounded-xl flex items-center justify-center text-action">
                    <User className="w-10 h-10" />
                  </div>
                </div>
              </div>
              <div className="pt-16 pb-6">
                <h3 className="text-xl font-heading font-bold text-gray-900">
                  {form.firstName || meta.email.split('@')[0]} {form.lastName}
                </h3>
                <p className="text-sm text-gray-500 flex items-center gap-1.5 mt-1">
                  <Shield className="w-3.5 h-3.5 text-accent" />
                  {meta.role.replace('ROLE_', '')}
                </p>
              </div>
            </div>

            <div className="px-6 py-5 bg-gray-50/50 border-t border-gray-100 space-y-4">
              <div className="space-y-1">
                <label className="text-xs uppercase tracking-wider text-gray-400 font-semibold">Email Address</label>
                <div className="flex items-center gap-2 text-sm text-gray-700 font-medium">
                  <Mail className="w-4 h-4 text-gray-400" />
                  {meta.email}
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs uppercase tracking-wider text-gray-400 font-semibold">Member Since</label>
                <div className="flex items-center gap-2 text-sm text-gray-700">
                  <Calendar className="w-4 h-4 text-gray-400" />
                  {(meta.createdAt || '').replace('T', ' ').slice(0, 10)}
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs uppercase tracking-wider text-gray-400 font-semibold">Last Active</label>
                <div className="flex items-center gap-2 text-sm text-gray-700">
                  <Clock className="w-4 h-4 text-gray-400" />
                  {(meta.lastActivity || '').replace('T', ' ').slice(0, 16)}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Edit Profile Form */}
        <div className="lg:col-span-2">
          <form onSubmit={onSave} className="bg-white rounded-2xl shadow-premium border border-gray-100 overflow-hidden">
            <div className="px-6 py-5 border-b border-gray-100 bg-gray-50/30 flex items-center justify-between">
              <div>
                <h2 className="text-lg font-heading font-bold text-gray-900">Personal Information</h2>
                <p className="text-sm text-gray-500">Update your personal details below.</p>
              </div>
              <div className="p-2 bg-blue-50 rounded-lg text-action">
                <Edit2 className="w-5 h-5" />
              </div>
            </div>

            <div className="p-6 space-y-6">
              {(error || success) && (
                <div className={`p-4 rounded-xl flex items-start gap-3 ${error ? 'bg-red-50 text-red-700' : 'bg-green-50 text-green-700'}`}>
                  {error ? <AlertCircle className="w-5 h-5 shrink-0" /> : <Check className="w-5 h-5 shrink-0" />}
                  <p className="text-sm font-medium">{error || success}</p>
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-gray-700 ml-1">First Name</label>
                  <input
                    name="firstName"
                    value={form.firstName}
                    onChange={onChange}
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-action focus:ring-4 focus:ring-action/10 transition-all outline-none text-gray-800 placeholder:text-gray-400"
                    placeholder="Enter your first name"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-gray-700 ml-1">Last Name</label>
                  <input
                    name="lastName"
                    value={form.lastName}
                    onChange={onChange}
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-action focus:ring-4 focus:ring-action/10 transition-all outline-none text-gray-800 placeholder:text-gray-400"
                    placeholder="Enter your last name"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-sm font-medium text-gray-700 ml-1">Phone Number</label>
                <div className="relative">
                  <Smartphone className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    name="phone"
                    value={form.phone}
                    onChange={onChange}
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 focus:border-action focus:ring-4 focus:ring-action/10 transition-all outline-none text-gray-800 placeholder:text-gray-400"
                    placeholder="Your phone number"
                  />
                </div>
              </div>
            </div>

            <div className="px-6 py-4 bg-gray-50 border-t border-gray-100 flex justify-end">
              <button
                disabled={saving}
                type="submit"
                className="flex items-center gap-2 bg-action hover:bg-action-dark text-white px-6 py-2.5 rounded-xl font-medium shadow-lg shadow-action/20 transition-all active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {saving ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    <span>Saving...</span>
                  </>
                ) : (
                  'Save Changes'
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
