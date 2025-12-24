import React from 'react';
import { NavLink, Outlet } from 'react-router-dom';

export default function AdminLayout() {
  return (
    <div className="flex min-h-[80vh]">
      <aside className="w-64 bg-gray-100 p-4 border-r">
        <h2 className="text-lg font-semibold mb-4">Admin</h2>
        <nav className="space-y-2">
          <NavLink to="/admin/dashboard" className="block hover:underline">Dashboard</NavLink>

          <NavLink to="/admin/users" className="block hover:underline">Users</NavLink>
          <NavLink to="/admin/products" className="block hover:underline">Products</NavLink>
          <NavLink to="/admin/uploads" className="block hover:underline">Uploads</NavLink>
          <NavLink to="/admin/orders" className="block hover:underline">Orders</NavLink>
          <NavLink to="/admin/referrals" className="block hover:underline">Referrals</NavLink>
        </nav>
      </aside>
      <section className="flex-1 p-6">
        <Outlet />
      </section>
    </div>
  );
}
