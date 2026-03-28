'use client';

import { useState } from 'react';
import { useBusinessDashboard } from '../layout';
import { supabase } from '@/lib/supabase';

export default function SettingsPage() {
  const { business, user } = useBusinessDashboard();
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [passwordSuccess, setPasswordSuccess] = useState(false);
  const [savingPassword, setSavingPassword] = useState(false);

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordError('');
    setPasswordSuccess(false);

    if (newPassword.length < 8) {
      setPasswordError('Password must be at least 8 characters');
      return;
    }

    if (newPassword !== confirmPassword) {
      setPasswordError('Passwords do not match');
      return;
    }

    setSavingPassword(true);

    try {
      if (!supabase) {
        setPasswordError('Authentication service unavailable');
        return;
      }

      const { error } = await supabase.auth.updateUser({
        password: newPassword,
      });

      if (error) {
        setPasswordError(error.message);
        return;
      }

      setPasswordSuccess(true);
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');

      setTimeout(() => setPasswordSuccess(false), 3000);
    } catch (err) {
      setPasswordError('An unexpected error occurred');
    } finally {
      setSavingPassword(false);
    }
  };

  if (!business) {
    return (
      <div className="p-8">
        <p>Loading...</p>
      </div>
    );
  }

  const tierInfo = {
    basic: {
      name: 'Basic',
      price: 'Free',
      categoryLimit: '1 category',
      features: ['Basic listing', 'Receive quotes', 'Business dashboard', '1 category'],
    },
    verified: {
      name: 'Verified',
      price: '$29/mo',
      categoryLimit: '2 categories',
      features: ['Verified badge', 'Priority in search', 'Analytics dashboard', 'Email support', '2 categories'],
    },
    premium: {
      name: 'Premium',
      price: '$79/mo',
      categoryLimit: '5 categories',
      features: ['Premium badge', 'Top placement', 'Featured listings', 'Priority support', 'Review management', '5 categories'],
    },
    elite: {
      name: 'Elite',
      price: '$199/mo',
      categoryLimit: 'Unlimited categories',
      features: ['Elite badge', 'Homepage feature', 'Exclusive promotions', 'Dedicated account manager', 'All Premium features', 'Unlimited categories'],
    },
  };

  const currentTier = tierInfo[business.membership_tier];

  return (
    <div className="p-8">
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
        <p className="text-gray-500">Manage your account and subscription</p>
      </div>

      <div className="space-y-8">
        {/* Account Information */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-6">Account Information</h2>

          <div className="space-y-4">
            <div>
              <label className="text-sm text-gray-500">Email</label>
              <p className="text-gray-900 font-medium">{user?.email}</p>
            </div>

            <div>
              <label className="text-sm text-gray-500">Account Type</label>
              <p className="text-gray-900 font-medium">Business Owner</p>
            </div>

            <div>
              <label className="text-sm text-gray-500">Business</label>
              <p className="text-gray-900 font-medium">{business.name}</p>
            </div>
          </div>
        </div>

        {/* Change Password */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-6">Change Password</h2>

          {passwordSuccess && (
            <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-lg">
              <p className="text-green-700">Password updated successfully!</p>
            </div>
          )}

          {passwordError && (
            <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-700">{passwordError}</p>
            </div>
          )}

          <form onSubmit={handlePasswordChange} className="space-y-4 max-w-md">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Current Password
              </label>
              <input
                type="password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-boerne-gold focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                New Password
              </label>
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-boerne-gold focus:border-transparent"
                placeholder="Minimum 8 characters"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Confirm New Password
              </label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-boerne-gold focus:border-transparent"
              />
            </div>

            <button
              type="submit"
              disabled={savingPassword}
              className="px-6 py-3 bg-boerne-navy text-white font-semibold rounded-lg hover:bg-opacity-90 transition-colors disabled:opacity-50"
            >
              {savingPassword ? 'Updating...' : 'Update Password'}
            </button>
          </form>
        </div>

        {/* Subscription */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-6">Subscription</h2>

          <div className="mb-6 p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-semibold text-gray-900">
                  {currentTier.name} Plan
                </p>
                <p className="text-sm text-gray-500">{currentTier.price}</p>
              </div>
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                business.membership_tier === 'basic' ? 'bg-gray-100 text-gray-700' :
                business.membership_tier === 'verified' ? 'bg-green-100 text-green-700' :
                business.membership_tier === 'premium' ? 'bg-yellow-100 text-yellow-700' :
                'bg-purple-100 text-purple-700'
              }`}>
                Active
              </span>
            </div>

            <ul className="mt-4 space-y-2">
              {currentTier.features.map((feature, index) => (
                <li key={index} className="flex items-center gap-2 text-sm text-gray-600">
                  <svg className="w-4 h-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  {feature}
                </li>
              ))}
            </ul>
          </div>

          {business.membership_tier === 'basic' && (
            <div className="border border-boerne-gold rounded-lg p-4 bg-boerne-gold/5">
              <h3 className="font-semibold text-boerne-navy mb-2">Upgrade Your Plan</h3>
              <p className="text-sm text-gray-600 mb-4">
                Get more visibility and features to grow your business.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {(['verified', 'premium', 'elite'] as const).map((tier) => (
                  <div key={tier} className="border border-gray-200 rounded-lg p-4 bg-white">
                    <p className="font-semibold text-gray-900">{tierInfo[tier].name}</p>
                    <p className="text-boerne-gold font-bold">{tierInfo[tier].price}</p>
                    <ul className="mt-2 text-xs text-gray-500 space-y-1">
                      {tierInfo[tier].features.slice(0, 3).map((f, i) => (
                        <li key={i}>• {f}</li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>

              <p className="text-sm text-gray-500 mt-4">
                Contact us at <a href="mailto:support@boerneshub.com" className="text-boerne-gold hover:underline">support@boerneshub.com</a> to upgrade your plan.
              </p>
            </div>
          )}

          {business.membership_tier !== 'basic' && (
            <p className="text-sm text-gray-500">
              To manage your subscription, contact <a href="mailto:support@boerneshub.com" className="text-boerne-gold hover:underline">support@boerneshub.com</a>
            </p>
          )}
        </div>

        {/* Notifications - Coming Soon */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-2">Notifications</h2>
          <p className="text-gray-500 text-sm mb-4">Manage how you receive updates</p>

          <div className="p-4 bg-gray-50 rounded-lg text-center">
            <p className="text-gray-500">Notification preferences coming soon</p>
          </div>
        </div>

        {/* Danger Zone */}
        <div className="bg-white rounded-xl shadow-sm p-6 border border-red-200">
          <h2 className="text-lg font-semibold text-red-600 mb-2">Danger Zone</h2>
          <p className="text-gray-500 text-sm mb-4">Irreversible actions</p>

          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-red-50 rounded-lg">
              <div>
                <p className="font-medium text-gray-900">Deactivate Listing</p>
                <p className="text-sm text-gray-500">Temporarily hide your business from search results</p>
              </div>
              <button className="px-4 py-2 text-red-600 border border-red-300 rounded-lg hover:bg-red-100 transition-colors text-sm font-medium">
                Deactivate
              </button>
            </div>

            <div className="flex items-center justify-between p-4 bg-red-50 rounded-lg">
              <div>
                <p className="font-medium text-gray-900">Delete Account</p>
                <p className="text-sm text-gray-500">Permanently delete your account and listing</p>
              </div>
              <button className="px-4 py-2 text-red-600 border border-red-300 rounded-lg hover:bg-red-100 transition-colors text-sm font-medium">
                Delete Account
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
