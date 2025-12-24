import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { User, ChevronDown, ShoppingBag, Settings, Heart, LogOut, Package, Banknote } from 'lucide-react';
import { referralAPI } from '../services/api';
import { useAuth } from '../hooks/useAuth';

const ProfileDropdown = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { user, logout } = useAuth();
  const [coupons, setCoupons] = useState(null);
  const navigate = useNavigate();
  const dropdownRef = useRef(null);

  const handleToggle = () => setIsOpen(!isOpen);

  const handleLogout = async () => {
    await logout();
    navigate('/');
    setIsOpen(false);
  };

  const handleItemClick = () => {
    setIsOpen(false);
  };

  // Handle click outside to close dropdown
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('click', handleClickOutside);
    }

    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, [isOpen]);

  // Fetch coupons for badge (optional visual cue)
  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const res = await referralAPI.getStats();
        if (mounted) setCoupons(res.data?.data?.totalCouponsEarned ?? null);
      } catch {}
    })();
    return () => { mounted = false; };
  }, []);

  const menuItems = [
    {
      name: 'Shop',
      href: '/',
      icon: ShoppingBag,
      description: 'Browse all products'
    },
    {
      name: 'Referral',
      href: '/referral',
      icon: Banknote,
      description: 'Invite friends and earn coupons'
    },
    {
      name: 'Profile',
      href: '/profile',
      icon: User,
      description: 'Manage your account'
    },
    {
      name: 'Orders',
      href: '/orders',
      icon: Package,
      description: 'View order history'
    },
    {
      name: 'Wishlist',
      href: '/wishlist',
      icon: Heart,
      description: 'Your saved items'
    },
    {
      name: 'Settings',
      href: '/profile',
      icon: Settings,
      description: 'Account settings'
    }
  ];

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={handleToggle}
        className="flex items-center space-x-2 px-3 py-2 rounded-lg bg-white border border-gray-200 hover:bg-gray-50 transition-colors focus:outline-none focus:ring-2 focus:ring-[#047BD2] focus:border-[#047BD2]"
      >
        <div className="h-8 w-8 bg-blue-100 rounded-full flex items-center justify-center">
          <User className="h-5 w-5 text-blue-600" />
        </div>
        <div className="text-left hidden sm:block">
          <p className="text-sm font-medium text-gray-900">
            {user?.profile?.first_name || user?.email?.split('@')[0] || 'User'}
          </p>
          <p className="text-xs text-gray-500">My Account</p>
        </div>
        {typeof coupons === 'number' && coupons > 0 && (
          <span aria-label={`Total coupons ${coupons}`} title={`Coupons: ${coupons}`}
            className="ml-1 inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-green-50 text-green-700 text-xs">
            <Banknote className="h-3 w-3" /> {coupons}
          </span>
        )}
        <ChevronDown className={`h-4 w-4 text-gray-400 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <>
          <div className="absolute right-0 mt-2 w-72 bg-white rounded-lg shadow-lg border border-gray-200 z-50 overflow-hidden">
            {/* User Info Header */}
            <div className="px-4 py-3 border-b border-gray-100 bg-gradient-to-r from-blue-50 to-indigo-50">
              <div className="flex items-center space-x-3">
                <div className="h-10 w-10 bg-blue-100 rounded-full flex items-center justify-center">
                  <User className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">
                    {user?.profile?.first_name && user?.profile?.last_name
                      ? `${user.profile.first_name} ${user.profile.last_name}`
                      : user?.email}
                  </p>
                  <p className="text-xs text-gray-500">{user?.email}</p>
                </div>
              </div>
            </div>

            {/* Navigation Menu Items */}
            <div className="py-2">
              {menuItems.map((item) => {
                const IconComponent = item.icon;
                return (
                  <Link
                    key={item.name}
                    to={item.href}
                    className="flex items-center space-x-3 px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 transition-colors duration-150 group"
                    onClick={handleItemClick}
                  >
                    <div className="flex-shrink-0">
                      <IconComponent className="h-4 w-4 text-gray-400 group-hover:text-[#047BD2] transition-colors" />
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-gray-900 group-hover:text-[#047BD2] transition-colors">
                        {item.name}
                      </p>
                      <p className="text-xs text-gray-500">{item.description}</p>
                    </div>
                  </Link>
                );
              })}
            </div>

            {/* Logout Section */}
            <div className="border-t border-gray-100 py-2">
              <button
                onClick={handleLogout}
                className="flex items-center space-x-3 px-4 py-3 text-sm text-red-600 hover:bg-red-50 w-full text-left transition-colors duration-150 group"
              >
                <LogOut className="h-4 w-4 text-red-500 group-hover:text-red-600 transition-colors" />
                <div>
                  <p className="font-medium">Sign Out</p>
                  <p className="text-xs text-red-400">Logout from your account</p>
                </div>
              </button>
            </div>
          </div>
          
          {/* Backdrop */}
          <div
            className="fixed inset-0 z-40"
            onClick={() => setIsOpen(false)}
          />
        </>
      )}
    </div>
  );
};

export default ProfileDropdown;
