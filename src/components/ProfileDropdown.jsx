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
      } catch { }
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
        className={`flex items-center space-x-2 px-3 py-2 rounded-xl transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-action/20
          ${isOpen ? 'bg-action/5 border-action/20 text-action' : 'bg-white border border-gray-100 hover:border-gray-200 hover:bg-gray-50'}`}
      >
        <div className={`h-9 w-9 rounded-full flex items-center justify-center transition-colors duration-300 ${isOpen ? 'bg-action/10' : 'bg-gray-100'}`}>
          <User className={`h-5 w-5 ${isOpen ? 'text-action' : 'text-gray-600'}`} />
        </div>
        <div className="text-left hidden sm:block">
          <p className={`text-sm font-heading font-semibold transition-colors duration-300 ${isOpen ? 'text-action' : 'text-gray-900'}`}>
            {user?.profile?.first_name || user?.email?.split('@')[0] || 'User'}
          </p>
          <p className="text-[10px] uppercase tracking-wider font-semibold text-gray-400">My Account</p>
        </div>
        {typeof coupons === 'number' && coupons > 0 && (
          <span aria-label={`Total coupons ${coupons}`} title={`Coupons: ${coupons}`}
            className="hidden md:inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-accent/10 text-accent-dark text-xs font-bold font-heading border border-accent/20 md:ml-2">
            <Banknote className="h-3.5 w-3.5" /> {coupons}
          </span>
        )}
        <ChevronDown className={`h-4 w-4 ml-1 transition-transform duration-300 text-gray-400 ${isOpen ? 'rotate-180 text-action' : ''}`} />
      </button>

      {isOpen && (
        <>
          <div className="absolute right-0 mt-3 w-80 bg-white rounded-2xl shadow-premium border border-gray-100 z-50 overflow-hidden animate-slide-up origin-top-right">
            {/* User Info Header */}
            <div className="p-5 bg-gradient-to-br from-primary-50 via-white to-action/5 border-b border-gray-100">
              <div className="flex items-center space-x-4">
                <div className="h-12 w-12 bg-white rounded-full flex items-center justify-center shadow-sm border border-gray-100">
                  <User className="h-6 w-6 text-action" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-base font-heading font-bold text-gray-900 truncate">
                    {user?.profile?.first_name && user?.profile?.last_name
                      ? `${user.profile.first_name} ${user.profile.last_name}`
                      : (user?.email?.split('@')[0] || 'User')}
                  </p>
                  <p className="text-xs text-gray-500 truncate font-medium">{user?.email}</p>
                </div>
              </div>
              {/* Mobile Coupon Badge */}
              {typeof coupons === 'number' && coupons > 0 && (
                <div className="mt-3 md:hidden inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-accent/10 text-accent-dark text-xs font-bold border border-accent/20 w-auto">
                  <Banknote className="h-3.5 w-3.5" /> {coupons} Available
                </div>
              )}
            </div>

            {/* Navigation Menu Items */}
            <div className="p-2 space-y-0.5">
              {menuItems.map((item) => {
                const IconComponent = item.icon;
                return (
                  <Link
                    key={item.name}
                    to={item.href}
                    className="flex items-start space-x-3 px-4 py-3 rounded-xl text-sm text-gray-600 hover:bg-gray-50 hover:text-action transition-all duration-200 group"
                    onClick={handleItemClick}
                  >
                    <div className="flex-shrink-0 mt-0.5 p-1 rounded-lg bg-gray-50 group-hover:bg-white group-hover:shadow-sm transition-all duration-200">
                      <IconComponent className="h-4 w-4 text-gray-400 group-hover:text-action transition-colors" />
                    </div>
                    <div className="flex-1">
                      <p className="font-heading font-semibold text-gray-900 group-hover:text-action transition-colors">
                        {item.name}
                      </p>
                      <p className="text-xs text-gray-400 group-hover:text-action/70 transition-colors mt-0.5">{item.description}</p>
                    </div>
                  </Link>
                );
              })}
            </div>

            {/* Logout Section */}
            <div className="p-2 border-t border-gray-100 bg-gray-50/50">
              <button
                onClick={handleLogout}
                className="flex items-center space-x-3 px-4 py-3 text-sm text-red-600 hover:bg-red-50 hover:text-red-700 w-full text-left transition-all duration-200 rounded-xl group border border-transparent hover:border-red-100"
              >
                <div className="p-1.5 rounded-lg bg-red-50 group-hover:bg-white group-hover:shadow-sm transition-all">
                  <LogOut className="h-4 w-4 text-red-500 group-hover:text-red-700 transition-colors" />
                </div>
                <div>
                  <p className="font-heading font-semibold">Sign Out</p>
                </div>
              </button>
            </div>
          </div>

          {/* Backdrop */}
          <div
            className="fixed inset-0 z-40 bg-black/5 backdrop-blur-[1px] transition-all duration-300"
            onClick={() => setIsOpen(false)}
          />
        </>
      )}
    </div>
  );
};

export default ProfileDropdown;
