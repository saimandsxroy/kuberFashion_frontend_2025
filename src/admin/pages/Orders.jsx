import React, { useEffect, useState } from 'react';
import api from '../../services/api';

export default function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [page, setPage] = useState(0);
  const [size, setSize] = useState(10);
  const [totalPages, setTotalPages] = useState(0);
  const [status, setStatus] = useState('');
  const [email, setEmail] = useState('');

  const load = async () => {
    setLoading(true);
    setError('');
    try {
      const params = { page, size };
      if (status) params.status = status;
      if (email) params.email = email;
      const res = await api.get('/admin/orders', { params });
      const data = res.data?.data;
      setOrders(data?.items || []);
      setTotalPages(data?.totalPages || 0);
    } catch (e) {
      setError(e.response?.data?.message || 'Failed to load orders');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, size]);

  const applyFilters = async () => {
    setPage(0);
    await load();
  };

  const updateStatus = async (id, status) => {
    await api.put(`/admin/orders/${id}/status`, { status });
    await load();
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Orders</h1>

      <div className="flex gap-2 mb-4">
        <input
          className="border p-2 rounded"
          placeholder="Filter by email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <select
          className="border p-2 rounded"
          value={status}
          onChange={(e) => setStatus(e.target.value)}
        >
          <option value="">All</option>
          <option value="PENDING">PENDING</option>
          <option value="CONFIRMED">CONFIRMED</option>
          <option value="PROCESSING">PROCESSING</option>
          <option value="SHIPPED">SHIPPED</option>
          <option value="DELIVERED">DELIVERED</option>
          <option value="CANCELLED">CANCELLED</option>
          <option value="RETURNED">RETURNED</option>
        </select>
        <button className="px-3 py-2 border rounded" onClick={applyFilters}>Apply</button>
      </div>

      {loading && <div>Loading...</div>}
      {error && <div className="text-red-600">{error}</div>}

      <div className="overflow-x-auto">
        <table className="min-w-full border">
          <thead className="bg-gray-50">
            <tr>
              <th className="p-2 text-left">Order #</th>
              <th className="p-2 text-left">Email</th>
              <th className="p-2 text-left">Status</th>
              <th className="p-2 text-left">Total</th>
              <th className="p-2 text-left">Created</th>
              <th className="p-2 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {orders.map(o => (
              <tr key={o.id} className="border-t">
                <td className="p-2">{o.orderNumber}</td>
                <td className="p-2">{o.userEmail || ''}</td>
                <td className="p-2">
                  <select className="border p-1" value={o.status} onChange={(e) => updateStatus(o.id, e.target.value)}>
                    <option value="PENDING">PENDING</option>
                    <option value="CONFIRMED">CONFIRMED</option>
                    <option value="PROCESSING">PROCESSING</option>
                    <option value="SHIPPED">SHIPPED</option>
                    <option value="DELIVERED">DELIVERED</option>
                    <option value="CANCELLED">CANCELLED</option>
                    <option value="RETURNED">RETURNED</option>
                  </select>
                </td>
                <td className="p-2">{o.totalAmount}</td>
                <td className="p-2">{o.createdAt?.replace('T', ' ').slice(0, 19)}</td>
                <td className="p-2"></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between mt-4">
        <div className="flex items-center gap-2">
          <button className="px-3 py-2 border rounded" disabled={page <= 0} onClick={() => setPage(p => Math.max(0, p - 1))}>Prev</button>
          <span>Page {page + 1} of {Math.max(1, totalPages)}</span>
          <button className="px-3 py-2 border rounded" disabled={page + 1 >= totalPages} onClick={() => setPage(p => p + 1)}>Next</button>
        </div>
        <div>
          <select className="border p-2 rounded" value={size} onChange={(e) => { setSize(Number(e.target.value)); setPage(0); }}>
            <option value={10}>10</option>
            <option value={25}>25</option>
            <option value={50}>50</option>
          </select>
        </div>
      </div>
    </div>
  );
}
