import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

export default function RequireRole({ role }) {
  const { loading, user, isAuthenticated, hasRole } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!isAuthenticated || !user) {
    return <Navigate to={role === 'admin' ? '/admin/login' : '/login'} replace />;
  }

  if (!hasRole(role)) {
    // Redirect based on user's actual role
    const userRole = user?.role?.toUpperCase();
    if (userRole === 'ADMIN') {
      return <Navigate to="/admin/dashboard" replace />;
    } else {
      return <Navigate to="/user" replace />;
    }
  }

  return <Outlet />;
}
