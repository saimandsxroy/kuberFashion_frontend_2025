import React, { useEffect, useState } from 'react';
import api from '../../services/api';

export default function AdminProfilePage() {
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
      await api.put('/users/profile', form);
      setSuccess('Profile updated successfully');
      await load();
    } catch (e) {
      setError(e.response?.data?.message || 'Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="p-4">Loading...</div>;

  return (
    <div className="max-w-2xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Admin Profile</h1>

      {error && <div className="mb-3 text-red-600">{error}</div>}
      {success && <div className="mb-3 text-green-600">{success}</div>}

      <div className="bg-white shadow rounded p-4 mb-6">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm text-gray-600">Email</label>
            <input className="border rounded p-2 w-full bg-gray-100" value={meta.email} disabled />
          </div>
          <div>
            <label className="block text-sm text-gray-600">Role</label>
            <input className="border rounded p-2 w-full bg-gray-100" value={meta.role} disabled />
          </div>
          <div>
            <label className="block text-sm text-gray-600">Created At</label>
            <input className="border rounded p-2 w-full bg-gray-100" value={(meta.createdAt || '').replace('T',' ').slice(0,19)} disabled />
          </div>
          <div>
            <label className="block text-sm text-gray-600">Last Activity</label>
            <input className="border rounded p-2 w-full bg-gray-100" value={(meta.lastActivity || '').replace('T',' ').slice(0,19)} disabled />
          </div>
        </div>
      </div>

      <form onSubmit={onSave} className="bg-white shadow rounded p-4 space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm text-gray-600">First Name</label>
            <input name="firstName" value={form.firstName} onChange={onChange} className="border rounded p-2 w-full" />
          </div>
          <div>
            <label className="block text-sm text-gray-600">Last Name</label>
            <input name="lastName" value={form.lastName} onChange={onChange} className="border rounded p-2 w-full" />
          </div>
        </div>
        <div>
          <label className="block text-sm text-gray-600">Phone</label>
          <input name="phone" value={form.phone} onChange={onChange} className="border rounded p-2 w-full" />
        </div>
        <div>
          <button disabled={saving} type="submit" className="bg-blue-600 text-white px-4 py-2 rounded disabled:opacity-50">
            {saving ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </form>
    </div>
  );
}
