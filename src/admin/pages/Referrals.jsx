import React, { useEffect, useState } from 'react';
import { adminAPI } from '../../services/api';
import { Button } from '../../components/Button';
import {
  Search,
  Phone,
  ChevronRight,
  ChevronDown,
  User,
  Mail,
  Calendar,
  Award,
  Users,
  Shield,
  RefreshCw
} from 'lucide-react';

// Level colors for visual hierarchy
const levelColors = [
  'border-l-blue-500 bg-blue-50',
  'border-l-green-500 bg-green-50',
  'border-l-yellow-500 bg-yellow-50',
  'border-l-orange-500 bg-orange-50',
  'border-l-red-500 bg-red-50',
  'border-l-purple-500 bg-purple-50',
  'border-l-pink-500 bg-pink-50',
];

const ReferralNode = ({ node, depth = 0, defaultExpanded = true }) => {
  const [expanded, setExpanded] = useState(defaultExpanded);
  const hasChildren = node.children && node.children.length > 0;
  const levelColor = levelColors[depth % levelColors.length];

  const formatDate = (dateStr) => {
    if (!dateStr) return 'N/A';
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className={`${depth > 0 ? 'ml-6' : ''}`}>
      {/* Node Card */}
      <div className={`border-l-4 ${levelColor} rounded-lg shadow-sm mb-2 overflow-hidden transition-all duration-200 hover:shadow-md`}>
        {/* Header - Always Visible */}
        <div
          className="flex items-center gap-3 p-4 cursor-pointer select-none"
          onClick={() => setExpanded(!expanded)}
        >
          {/* Expand/Collapse Icon */}
          <button
            type="button"
            className="flex-shrink-0 w-6 h-6 flex items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
            aria-label={expanded ? 'Collapse' : 'Expand'}
          >
            {hasChildren ? (
              expanded ? (
                <ChevronDown className="h-4 w-4 text-gray-600" />
              ) : (
                <ChevronRight className="h-4 w-4 text-gray-600" />
              )
            ) : (
              <div className="w-2 h-2 rounded-full bg-gray-300" />
            )}
          </button>

          {/* User Avatar */}
          <div className="flex-shrink-0 w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-semibold text-sm">
            {node.firstName?.[0]}{node.lastName?.[0]}
          </div>

          {/* Main Info */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="font-semibold text-gray-900">{node.fullName || `${node.firstName || ''} ${node.lastName || ''}`.trim() || 'Unknown'}</span>
              <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${node.status === 'active'
                  ? 'bg-green-100 text-green-700'
                  : 'bg-red-100 text-red-700'
                }`}>
                {node.status}
              </span>
              {node.role === 'ADMIN' && (
                <span className="text-xs px-2 py-0.5 rounded-full bg-purple-100 text-purple-700 font-medium flex items-center gap-1">
                  <Shield className="h-3 w-3" /> Admin
                </span>
              )}
              <span className="text-xs px-2 py-0.5 rounded-full bg-gray-100 text-gray-600">
                Level {node.level ?? depth}
              </span>
            </div>
            <div className="flex items-center gap-4 mt-1 text-sm text-gray-500 flex-wrap">
              <span className="flex items-center gap-1">
                <Phone className="h-3 w-3" /> {node.phone}
              </span>
              {node.email && (
                <span className="flex items-center gap-1">
                  <Mail className="h-3 w-3" /> {node.email}
                </span>
              )}
            </div>
          </div>

          {/* Stats */}
          <div className="flex items-center gap-4 text-sm">
            <div className="text-center">
              <div className="flex items-center gap-1 text-amber-600 font-semibold">
                <Award className="h-4 w-4" />
                {node.coupons ?? 0}
              </div>
              <div className="text-xs text-gray-400">Coupons</div>
            </div>
            <div className="text-center">
              <div className="flex items-center gap-1 text-blue-600 font-semibold">
                <Users className="h-4 w-4" />
                {node.totalReferrals ?? 0}
              </div>
              <div className="text-xs text-gray-400">Referrals</div>
            </div>
          </div>
        </div>

        {/* Expanded Details */}
        {expanded && (
          <div className="px-4 pb-4 pt-0 border-t border-gray-100">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-3 text-sm">
              <div>
                <div className="text-gray-400 text-xs uppercase tracking-wide">User ID</div>
                <div className="text-gray-700 font-mono">#{node.id}</div>
              </div>
              <div>
                <div className="text-gray-400 text-xs uppercase tracking-wide">Phone Number</div>
                <div className="text-gray-700 font-mono">{node.phone}</div>
              </div>
              <div>
                <div className="text-gray-400 text-xs uppercase tracking-wide">Email</div>
                <div className="text-gray-700">{node.email || 'N/A'}</div>
              </div>
              <div>
                <div className="text-gray-400 text-xs uppercase tracking-wide">Joined</div>
                <div className="text-gray-700 flex items-center gap-1">
                  <Calendar className="h-3 w-3" />
                  {formatDate(node.signupDate)}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Children */}
      {expanded && hasChildren && (
        <div className="border-l-2 border-gray-200 ml-5 pl-0">
          {node.children.map((child) => (
            <ReferralNode
              key={child.id}
              node={child}
              depth={depth + 1}
              defaultExpanded={depth < 1}
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
  const [error, setError] = useState('');
  const [stats, setStats] = useState({ totalRoots: 0, totalUsers: 0 });

  // Count all users in trees recursively
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
    setError('');
    try {
      const res = await adminAPI.getFullReferralTree();
      const data = res.data?.data || [];
      setTrees(data);
      setStats({
        totalRoots: data.length,
        totalUsers: countUsers(data)
      });
    } catch (e) {
      setError(e.response?.data?.message || 'Failed to load referral tree');
    } finally {
      setLoading(false);
    }
  };

  const searchByPhone = async () => {
    if (!phone.trim()) {
      fetchFullTree();
      return;
    }
    setLoading(true);
    setError('');
    try {
      const res = await adminAPI.getReferralTree({ phone: phone.trim() });
      const data = res.data?.data;
      if (data) {
        setTrees([data]);
        setStats({
          totalRoots: 1,
          totalUsers: countUsers([data])
        });
      } else {
        setTrees([]);
        setError('No user found with that phone number');
      }
    } catch (e) {
      setError(e.response?.data?.message || 'Failed to search referral tree');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFullTree();
  }, []);

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Referral Tree</h1>
        <p className="text-gray-500">View and manage the complete referral hierarchy (up to 6 levels deep)</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-4 text-white shadow-lg">
          <div className="flex items-center gap-3">
            <Users className="h-8 w-8 opacity-80" />
            <div>
              <div className="text-2xl font-bold">{stats.totalUsers}</div>
              <div className="text-blue-100 text-sm">Total Users in Tree</div>
            </div>
          </div>
        </div>
        <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl p-4 text-white shadow-lg">
          <div className="flex items-center gap-3">
            <User className="h-8 w-8 opacity-80" />
            <div>
              <div className="text-2xl font-bold">{stats.totalRoots}</div>
              <div className="text-green-100 text-sm">Root Users (No Referrer)</div>
            </div>
          </div>
        </div>
        <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl p-4 text-white shadow-lg">
          <div className="flex items-center gap-3">
            <Award className="h-8 w-8 opacity-80" />
            <div>
              <div className="text-2xl font-bold">6</div>
              <div className="text-purple-100 text-sm">Max Referral Levels</div>
            </div>
          </div>
        </div>
      </div>

      {/* Search Bar */}
      <div className="flex items-center gap-3 mb-6 flex-wrap">
        <div className="relative flex-1 max-w-md">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Phone className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && searchByPhone()}
            placeholder="Search by phone number..."
            className="appearance-none block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-xl placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-sm"
          />
        </div>
        <Button
          onClick={searchByPhone}
          className="flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl shadow-sm"
        >
          <Search className="h-4 w-4" /> Search
        </Button>
        <Button
          onClick={fetchFullTree}
          className="flex items-center gap-2 px-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl shadow-sm"
        >
          <RefreshCw className="h-4 w-4" /> Show All
        </Button>
      </div>

      {/* Level Legend */}
      <div className="flex items-center gap-2 mb-4 flex-wrap text-sm">
        <span className="text-gray-500">Level Colors:</span>
        {levelColors.map((color, i) => (
          <span
            key={i}
            className={`px-3 py-1 rounded-full border-l-4 ${color} text-gray-700 text-xs font-medium`}
          >
            Level {i}
          </span>
        ))}
      </div>

      {/* Tree Content */}
      {loading ? (
        <div className="flex items-center justify-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          <span className="ml-3 text-gray-600">Loading referral tree...</span>
        </div>
      ) : error ? (
        <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center">
          <div className="text-red-600 font-medium">{error}</div>
          <Button
            onClick={fetchFullTree}
            className="mt-4 px-4 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200"
          >
            Try Again
          </Button>
        </div>
      ) : trees.length > 0 ? (
        <div className="space-y-4">
          {trees.map((tree) => (
            <ReferralNode key={tree.id} node={tree} depth={0} defaultExpanded={true} />
          ))}
        </div>
      ) : (
        <div className="bg-gray-50 border border-gray-200 rounded-xl p-12 text-center">
          <Users className="h-16 w-16 text-gray-300 mx-auto mb-4" />
          <div className="text-gray-600 font-medium text-lg">No referral data found</div>
          <p className="text-gray-400 mt-2">Users will appear here once they register with referral codes.</p>
        </div>
      )}
    </div>
  );
};

export default AdminReferrals;
