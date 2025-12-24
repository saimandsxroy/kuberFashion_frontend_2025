import React, { useEffect, useState } from 'react';
import { referralAPI } from '../services/api';
import { Button } from '../components/Button';
import { ArrowLeft, Users, Banknote, Share2, Link as LinkIcon, Copy, Mail, MessageCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useNotification } from '../components/Notification';

const Referral = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [shareOpen, setShareOpen] = useState(false);
  const navigate = useNavigate();
  const { showNotification, NotificationComponent } = useNotification();

  useEffect(() => {
    let mounted = true;
    const load = async () => {
      try {
        setLoading(true);
        const res = await referralAPI.getStats();
        if (mounted) setStats(res.data?.data);
      } catch (e) {
        if (mounted) setError(e.response?.data?.message || 'Failed to load referral stats');
      } finally {
        if (mounted) setLoading(false);
      }
    };
    load();
    return () => { mounted = false; };
  }, []);

  const referralCode = stats?.referralCode || '';
  const shareUrl = `${window.location.origin}/signup?ref=${encodeURIComponent(referralCode)}`;

  const copyToClipboard = async (text, successMsg) => {
    try {
      await navigator.clipboard.writeText(text);
      showNotification('success', successMsg || 'Copied!');
    } catch (e) {
      showNotification('error', 'Failed to copy');
    }
  };

  const handleCopyCode = () => copyToClipboard(referralCode, 'Referral code copied!');
  const handleCopyLink = () => copyToClipboard(shareUrl, 'Referral link copied!');

  const handleNativeShare = async () => {
    const shareData = {
      title: 'Join KuberFashion',
      text: `Use my referral code ${referralCode} to join KuberFashion and earn Kuber Coupons!`,
      url: shareUrl,
    };
    if (navigator.share) {
      try {
        await navigator.share(shareData);
        showNotification('success', 'Share dialog opened');
      } catch {}
    } else {
      handleCopyLink();
    }
  };

  const handleShareWhatsApp = () => {
    const text = encodeURIComponent(`Join KuberFashion with my referral code ${referralCode}: ${shareUrl}`);
    window.open(`https://wa.me/?text=${text}`, '_blank');
  };

  const handleShareEmail = () => {
    const subject = encodeURIComponent('Join KuberFashion and earn Kuber Coupons');
    const body = encodeURIComponent(`Use my referral code ${referralCode} to sign up: ${shareUrl}`);
    window.location.href = `mailto:?subject=${subject}&body=${body}`;
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading referral stats...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Error</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <Button onClick={() => window.location.reload()} className="bg-[#047BD2] hover:bg-[#0369A1] text-white">Try Again</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white shadow-sm">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <Button onClick={() => navigate('/')} variant="ghost" className="flex items-center space-x-2 text-[#047BD2] hover:text-[#0369A1]">
              <ArrowLeft className="h-4 w-4" />
              <span>Back to Home</span>
            </Button>
            <h1 className="text-2xl sm:text-3xl font-bold text-[#1a1a1a]">Referral Program</h1>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        {/* Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <div className="bg-white rounded-lg p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Your Referral Code</p>
                <p className="text-2xl font-bold text-[#1a1a1a] mt-1" aria-live="polite">{referralCode || '-'}</p>
              </div>
            </div>
            <p className="text-xs text-gray-500 mt-2">Share your code with friends and earn Kuber Coupons for up to 6 referral levels!</p>
            <div className="mt-4 flex items-center gap-3 flex-wrap">
              <Button aria-label="Copy referral code" title="Copy"
                onClick={handleCopyCode} variant="outline" className="flex items-center gap-2">
                <Copy className="h-4 w-4" /> Copy Code
              </Button>
              <Button aria-label="Copy referral link" title="Copy link"
                onClick={handleCopyLink} variant="outline" className="flex items-center gap-2">
                <LinkIcon className="h-4 w-4" /> Share Link
              </Button>
              <div className="relative">
                <Button aria-haspopup="menu" aria-expanded={shareOpen}
                  onClick={() => setShareOpen((v) => !v)} variant="outline" className="flex items-center gap-2">
                  <Share2 className="h-4 w-4" /> Share
                </Button>
                {shareOpen && (
                  <div role="menu" className="absolute z-10 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow p-2">
                    <button role="menuitem" className="w-full flex items-center gap-2 px-3 py-2 hover:bg-gray-50 text-sm"
                      onClick={() => { setShareOpen(false); handleNativeShare(); }}>
                      <Share2 className="h-4 w-4" /> System Share
                    </button>
                    <button role="menuitem" className="w-full flex items-center gap-2 px-3 py-2 hover:bg-gray-50 text-sm"
                      onClick={() => { setShareOpen(false); handleShareWhatsApp(); }}>
                      <MessageCircle className="h-4 w-4" /> WhatsApp
                    </button>
                    <button role="menuitem" className="w-full flex items-center gap-2 px-3 py-2 hover:bg-gray-50 text-sm"
                      onClick={() => { setShareOpen(false); handleShareEmail(); }}>
                      <Mail className="h-4 w-4" /> Email
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <p className="text-sm text-gray-600">Total Referrals</p>
              <Users className="h-5 w-5 text-[#047BD2]" />
            </div>
            <p className="text-2xl font-bold text-[#1a1a1a] mt-1">{stats?.totalDirectReferrals || 0}</p>
          </div>
          <div className="bg-white rounded-lg p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <p className="text-sm text-gray-600">Total Kuber Coupons</p>
              <Banknote className="h-5 w-5 text-green-600" />
            </div>
            <p className="text-2xl font-bold text-[#1a1a1a] mt-1">{stats?.totalCouponsEarned || 0}</p>
          </div>
        </div>

        {/* Referral List */}
        <div className="bg-white rounded-lg p-6 shadow-sm overflow-x-auto">
          <h3 className="text-lg font-semibold text-[#1a1a1a] mb-4">Your Referrals</h3>
          {(!stats?.referrals || stats.referrals.length === 0) ? (
            <p className="text-gray-600">No referrals yet. Share your referral code and earn Kuber Coupons!</p>
          ) : (
            <table className="min-w-full">
              <thead>
                <tr className="text-left text-gray-600 text-sm">
                  <th className="py-2">User</th>
                  <th className="py-2">Status</th>
                  <th className="py-2">Signup Time</th>
                  <th className="py-2">Coupons Earned</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {stats.referrals.map((r, idx) => (
                  <tr key={idx} className="text-sm">
                    <td className="py-3">{r.masked}</td>
                    <td className="py-3 capitalize">{r.status}</td>
                    <td className="py-3">{r.signupTime ? new Date(r.signupTime).toLocaleString() : '-'}</td>
                    <td className="py-3 font-medium">{r.couponsEarnedFrom}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
        <NotificationComponent />
      </div>
    </div>
  );
};

export default Referral;
