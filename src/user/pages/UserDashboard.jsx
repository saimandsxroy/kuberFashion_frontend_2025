import React from 'react';
import { HeroHeader } from '../../components/hero';
import { Footer } from '../../components/Footer';
import { useAuth } from '../../hooks/useAuth';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ShoppingBag, Heart, User, Settings, LogOut, MapPin, Package, CreditCard } from 'lucide-react';

const UserDashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const menuItems = [
    {
      title: 'My Orders',
      description: 'Track, return, or buy things again',
      icon: Package,
      href: '/orders',
      color: 'bg-blue-100 text-blue-600',
    },
    {
      title: 'Wishlist',
      description: 'Your favorite items saved for later',
      icon: Heart,
      href: '/wishlist',
      color: 'bg-pink-100 text-pink-600',
    },
    {
      title: 'Addresses',
      description: 'Manage your shipping addresses',
      icon: MapPin,
      href: '/profile?tab=address',
      color: 'bg-green-100 text-green-600',
    },
    {
      title: 'Profile Settings',
      description: 'Edit name, email, and password',
      icon: Settings,
      href: '/profile',
      color: 'bg-purple-100 text-purple-600',
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Reusing the transparent header - we might need to add a background div behind it or ensure content pushes down */}
      <div className="bg-white">
        <HeroHeader />
      </div>

      <main className="flex-grow pt-28 pb-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
            <div>
              <h1 className="text-3xl sm:text-4xl font-heading font-bold text-primary-900">
                My Dashboard
              </h1>
              <p className="text-primary-500 mt-2 text-lg">
                Welcome back, <span className="font-semibold text-primary-900">{user?.name || 'User'}</span>!
              </p>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center space-x-2 px-4 py-2 border border-red-200 text-red-600 rounded-lg hover:bg-red-50 transition-colors"
            >
              <LogOut className="h-4 w-4" />
              <span>Sign Out</span>
            </button>
          </div>

          {/* Overview Stats (Optional - can add later) */}

          {/* Menu Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {menuItems.map((item, index) => (
              <Link to={item.href} key={index}>
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-premium transition-all duration-300 h-full flex items-start space-x-4 cursor-pointer group"
                >
                  <div className={`p-3 rounded-xl ${item.color} group-hover:scale-110 transition-transform duration-300`}>
                    <item.icon className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-primary-900 group-hover:text-action transition-colors">
                      {item.title}
                    </h3>
                    <p className="text-sm text-primary-500 mt-1">
                      {item.description}
                    </p>
                  </div>
                </motion.div>
              </Link>
            ))}
          </div>
        </motion.div>
      </main>

      <Footer />
    </div>
  );
};

export default UserDashboard;
