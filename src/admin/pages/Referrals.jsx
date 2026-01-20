import React, { useEffect, useState } from 'react';
import { adminAPI } from '../../services/api';
import { Search, Phone, ChevronRight, ChevronDown, User, Mail, Calendar, Award, Users, Shield, RefreshCw, Layers, DollarSign, Crown, Gem, Star, Sparkles } from 'lucide-react';
import { useNotification } from '../../components/Notification';

// Premium level color configurations - each level gets a unique luxurious color scheme
const levelColors = {
  0: {
    gradient: 'from-amber-400 via-yellow-500 to-orange-500',
    bg: 'bg-gradient-to-r from-amber-50 to-yellow-50',
    border: 'border-amber-200',
    ring: 'ring-amber-500/20',
    text: 'text-amber-700',
    badge: 'bg-gradient-to-r from-amber-500 to-yellow-500 text-white',
    icon: Crown,
    label: 'Genesis Root'
  },
  1: {
    gradient: 'from-emerald-400 via-green-500 to-teal-500',
    bg: 'bg-gradient-to-r from-emerald-50 to-green-50',
    border: 'border-emerald-200',
    ring: 'ring-emerald-500/20',
    text: 'text-emerald-700',
    badge: 'bg-gradient-to-r from-emerald-500 to-teal-500 text-white',
    icon: Gem,
    label: 'Level 1'
  },
  2: {
    gradient: 'from-blue-400 via-indigo-500 to-purple-500',
    bg: 'bg-gradient-to-r from-blue-50 to-indigo-50',
    border: 'border-blue-200',
    ring: 'ring-blue-500/20',
    text: 'text-blue-700',
    badge: 'bg-gradient-to-r from-blue-500 to-indigo-500 text-white',
    icon: Star,
    label: 'Level 2'
  },
  3: {
    gradient: 'from-violet-400 via-purple-500 to-fuchsia-500',
    bg: 'bg-gradient-to-r from-violet-50 to-purple-50',
    border: 'border-violet-200',
    ring: 'ring-violet-500/20',
    text: 'text-violet-700',
    badge: 'bg-gradient-to-r from-violet-500 to-purple-500 text-white',
    icon: Sparkles,
    label: 'Level 3'
  },
  4: {
    gradient: 'from-rose-400 via-pink-500 to-red-500',
    bg: 'bg-gradient-to-r from-rose-50 to-pink-50',
    border: 'border-rose-200',
    ring: 'ring-rose-500/20',
    text: 'text-rose-700',
    badge: 'bg-gradient-to-r from-rose-500 to-pink-500 text-white',
    icon: Award,
    label: 'Level 4'
  },
  5: {
    gradient: 'from-cyan-400 via-sky-500 to-blue-500',
    bg: 'bg-gradient-to-r from-cyan-50 to-sky-50',
    border: 'border-cyan-200',
    ring: 'ring-cyan-500/20',
    text: 'text-cyan-700',
    badge: 'bg-gradient-to-r from-cyan-500 to-sky-500 text-white',
    icon: Users,
    label: 'Level 5'
  },
  6: {
    gradient: 'from-slate-400 via-gray-500 to-zinc-600',
    bg: 'bg-gradient-to-r from-slate-50 to-gray-50',
    border: 'border-slate-200',
    ring: 'ring-slate-500/20',
    text: 'text-slate-700',
    badge: 'bg-gradient-to-r from-slate-500 to-gray-500 text-white',
    icon: User,
    label: 'Level 6'
  }
};

const ReferralNode = ({ node, depth = 0, isLast = false, defaultExpanded = true, onViewTree }) => {
  const [expanded, setExpanded] = useState(defaultExpanded);
  const hasChildren = node.children && node.children.length > 0;

  // Get level from node or use depth
  const level = node.level ?? depth;
  const colorConfig = levelColors[Math.min(level, 6)] || levelColors[6];
  const LevelIcon = colorConfig.icon;

  // Format date
  const formatDate = (dateStr) => {
    if (!dateStr) return 'N/A';
    return new Date(dateStr).toLocaleDateString('en-IN', {
      day: 'numeric', month: 'short', year: 'numeric'
    });
  };

  return (
    <div className="relative">
      {/* Node Content */}
      <div className={`
        relative flex items-center group
        ${depth > 0 ? 'ml-8' : ''}
        ${depth > 0 ? 'before:content-[""] before:absolute before:left-[-20px] before:top-1/2 before:-translate-y-1/2 before:w-5 before:h-px before:bg-gradient-to-r before:from-gray-300 before:to-transparent' : ''}
      `}>
        {/* Vertical connector with gradient */}
        {depth > 0 && !isLast && (
          <div className="absolute left-[-21px] top-1/2 h-full w-px bg-gradient-to-b from-gray-300 to-gray-200" />
        )}

        <div className={`
          flex-1 rounded-2xl border-2 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-0.5
          mb-4 overflow-hidden
          ${colorConfig.bg} ${colorConfig.border}
          hover:ring-4 ${colorConfig.ring}
        `}>
          <div className="p-5 flex items-center gap-5 cursor-pointer" onClick={() => setExpanded(!expanded)}>
            {/* Premium Avatar with Gradient */}
            <div className={`
              w-14 h-14 rounded-2xl flex items-center justify-center text-white font-bold text-lg shadow-lg
              bg-gradient-to-br ${colorConfig.gradient}
              transform transition-transform group-hover:scale-105
            `}>
              {node.role === 'ADMIN' ? <Shield className="w-6 h-6" /> : <LevelIcon className="w-6 h-6" />}
            </div>

            {/* Info */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-3 mb-1.5">
                <span className="font-heading font-bold text-gray-900 text-lg truncate">
                  {node.fullName || `${node.firstName} ${node.lastName}`}
                </span>
                {node.role === 'ADMIN' && (
                  <span className="px-3 py-1 text-[10px] font-bold bg-black text-white rounded-full uppercase tracking-wider shadow-md">
                    Admin
                  </span>
                )}
                <span className={`px-3 py-1 text-[10px] font-bold rounded-full uppercase tracking-wider shadow-sm ${colorConfig.badge}`}>
                  {colorConfig.label}
                </span>
                <span className={`px-2.5 py-1 text-[10px] font-bold rounded-full uppercase tracking-wider ${node.status === 'active' ? 'bg-green-100 text-green-700 border border-green-200' : 'bg-red-100 text-red-700 border border-red-200'}`}>
                  {node.status}
                </span>
              </div>
              <div className="flex items-center gap-5 text-sm text-gray-600">
                <div className="flex items-center gap-1.5">
                  <Phone className="w-4 h-4 text-gray-400" />
                  <span className="font-medium">{node.phone}</span>
                </div>
                <div className={`flex items-center gap-1.5 ${colorConfig.text} font-semibold`}>
                  <LevelIcon className="w-4 h-4" />
                  Level {level}
                </div>
              </div>
            </div>

            {/* Metrics with Premium Styling */}
            <div className="flex items-center gap-8 px-6 border-l-2 border-gray-200/50 hidden sm:flex">
              <div className="text-center">
                <div className={`text-xl font-bold ${colorConfig.text}`}>{node.totalReferrals || node.children?.length || 0}</div>
                <div className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Direct Refs</div>
              </div>
              <div className="text-center">
                <div className="text-xl font-bold text-amber-600">{node.coupons || node.couponsEarned || 0}</div>
                <div className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Coupons</div>
              </div>
            </div>

            {/* Premium Expand Toggle */}
            {hasChildren && (
              <div className={`p-2 rounded-xl ${colorConfig.bg} ${colorConfig.border} border`}>
                {expanded ? <ChevronDown className={`w-5 h-5 ${colorConfig.text}`} /> : <ChevronRight className={`w-5 h-5 ${colorConfig.text}`} />}
              </div>
            )}
          </div>

          {/* Expanded Details with Premium Styling */}
          {expanded && (
            <div className={`border-t-2 ${colorConfig.border} px-6 py-4 text-sm grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 bg-white/80 backdrop-blur-sm`}>
              <div>
                <span className="block font-bold text-gray-400 uppercase tracking-wider text-[10px] mb-1.5">Email</span>
                <span className="text-gray-900 font-medium">{node.email || 'N/A'}</span>
              </div>
              <div>
                <span className="block font-bold text-gray-400 uppercase tracking-wider text-[10px] mb-1.5">Joined</span>
                <span className="text-gray-900 flex items-center gap-1.5 font-medium">
                  <Calendar className="w-4 h-4 text-gray-400" /> {formatDate(node.signupDate)}
                </span>
              </div>
              <div>
                <span className="block font-bold text-gray-400 uppercase tracking-wider text-[10px] mb-1.5">User ID</span>
                <span className="font-mono text-gray-900 font-bold">#{node.id}</span>
              </div>
              {/* View This User's Tree Button */}
              <div className="sm:col-span-4 pt-3 border-t border-gray-200 mt-2">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onViewTree && onViewTree(node.phone);
                  }}
                  className={`px-5 py-2.5 text-white text-xs font-bold rounded-xl hover:opacity-90 transition-all flex items-center gap-2 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 bg-gradient-to-r ${colorConfig.gradient}`}
                >
                  <Layers className="w-4 h-4" />
                  View Their 6-Level Tree
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Children Recursion */}
      {expanded && hasChildren && (
        <div className="relative">
          {node.children.map((child, index) => (
            <ReferralNode
              key={child.id}
              node={child}
              depth={depth + 1}
              isLast={index === node.children.length - 1}
              defaultExpanded={false}
              onViewTree={onViewTree}
            />
          ))}
        </div>
      )}
    </div>
  );
};

const AdminReferrals = () => {
  const [phone, setPhone] = useState('');
  const [trees, setTrees] = useState([]);
  const [loading, setLoading] = useState(false);
  const [stats, setStats] = useState({ totalRoots: 0, totalUsers: 0 });
  const { showNotification } = useNotification();

  const countUsers = (nodes) => {
    let count = 0;
    for (const node of nodes) {
      count += 1;
      if (node.children && node.children.length > 0) {
        count += countUsers(node.children);
      }
    }
    return count;
  };

  const fetchFullTree = async () => {
    setLoading(true);
    try {
      const res = await adminAPI.getFullReferralTree();
      const data = res.data?.data || [];
      // Filter out Admin users - Admin is platform owner, not a referral participant
      const filteredData = data.filter(node => node.role !== 'ADMIN');
      setTrees(filteredData);
      setStats({
        totalRoots: filteredData.length,
        totalUsers: countUsers(filteredData)
      });
    } catch (e) {
      console.error(e);
      showNotification('error', 'Failed to load referral tree');
    } finally {
      setLoading(false);
    }
  };

  const searchByPhone = async () => {
    if (!phone.trim()) {
      fetchFullTree();
      return;
    }
    await searchByPhoneValue(phone.trim());
  };

  // Direct search function that takes phone as parameter (for button click handlers)
  const searchByPhoneValue = async (phoneValue) => {
    if (!phoneValue) {
      fetchFullTree();
      return;
    }
    setPhone(phoneValue);
    setLoading(true);
    try {
      const res = await adminAPI.getReferralTree({ phone: phoneValue });
      const data = res.data?.data;
      if (data) {
        setTrees([data]);
        setStats({
          totalRoots: 1,
          totalUsers: countUsers([data])
        });
        showNotification('success', `Viewing tree for ${data.fullName || phoneValue}`);
      } else {
        setTrees([]);
        showNotification('info', 'No user found with that phone number');
      }
    } catch (e) {
      console.error(e);
      showNotification('error', 'Failed to search referral tree');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFullTree();
  }, []);

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-heading font-light text-gray-900">Referral Network</h1>
          <p className="text-gray-500 mt-1 font-light">Visualize and manage the multi-level referral system</p>
        </div>
        <button
          onClick={fetchFullTree}
          className="bg-white border border-gray-200 text-gray-700 px-4 py-2.5 rounded-xl flex items-center gap-2 hover:bg-gray-50 transition-colors shadow-sm font-medium text-sm"
        >
          <RefreshCw className="h-4 w-4" /> Refresh Network
        </button>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          { label: 'Total Network Users', value: stats.totalUsers, icon: Users, color: 'text-blue-600', bg: 'bg-blue-50' },
          { label: 'Root Nodes', value: stats.totalRoots, icon: Layers, color: 'text-purple-600', bg: 'bg-purple-50' },
          { label: 'Max Depth', value: '6 Levels', icon: Award, color: 'text-amber-600', bg: 'bg-amber-50' }
        ].map((stat, i) => (
          <div key={i} className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">{stat.label}</p>
                <p className="text-3xl font-heading font-bold text-gray-900 mt-2">{stat.value}</p>
              </div>
              <div className={`p-3 rounded-xl ${stat.bg} ${stat.color}`}>
                <stat.icon className="h-5 w-5" />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Level Color Legend */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
        <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-4">Level Color Guide</h3>
        <div className="flex flex-wrap gap-3">
          {Object.entries(levelColors).map(([level, config]) => {
            const Icon = config.icon;
            return (
              <div
                key={level}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl border-2 ${config.bg} ${config.border} transition-all hover:scale-105`}
              >
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-white shadow-md bg-gradient-to-br ${config.gradient}`}>
                  <Icon className="w-4 h-4" />
                </div>
                <span className={`text-sm font-bold ${config.text}`}>{config.label}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Main Content */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden min-h-[500px]">

        {/* Toolbar */}
        <div className="p-6 border-b border-gray-100 bg-gray-50/50">
          <div className="relative max-w-md">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <input
              type="text"
              placeholder="Search network by phone number..."
              className="w-full pl-11 pr-4 py-3 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-black/5 focus:border-black transition-all text-sm shadow-sm"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && searchByPhone()}
            />
          </div>
        </div>

        {/* Tree Visualization */}
        <div className="p-8 overflow-x-auto">
          {loading ? (
            <div className="flex flex-col items-center justify-center h-64">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-black mb-4"></div>
              <p className="text-gray-500 text-sm">Loading network topology...</p>
            </div>
          ) : trees.length > 0 ? (
            <div className="min-w-[800px]">
              {trees.map((tree, index) => (
                <ReferralNode
                  key={tree.id}
                  node={tree}
                  depth={0}
                  isLast={index === trees.length - 1}
                  onViewTree={(phoneValue) => searchByPhoneValue(phoneValue)}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-20">
              <div className="bg-gray-50 p-4 rounded-full shadow-sm inline-block mb-4">
                <Users className="h-8 w-8 text-gray-300" />
              </div>
              <h3 className="text-gray-900 font-medium mb-1">No network data found</h3>
              <p className="text-sm text-gray-500">The referral network is currently empty or no matches found.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminReferrals;
