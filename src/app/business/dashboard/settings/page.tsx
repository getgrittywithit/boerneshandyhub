'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { useBusinessDashboard } from '../layout';
import { supabase } from '@/lib/supabase';
import { pricingTiers, type TierKey } from '@/data/pricingTiers';
import { CheckCircle2, ExternalLink, Loader2, Crown, Sparkles, AlertCircle } from 'lucide-react';

// Map DB tier to display tier key
const DB_TO_TIER_MAP_LOCAL: Record<string, TierKey> = {
  basic: 'claimed',
  verified: 'verified',
  premium: 'verifiedPlus',
  elite: 'foundingPartner',
};

export default function SettingsPage() {
  const { business, user } = useBusinessDashboard();
  const searchParams = useSearchParams();
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [passwordSuccess, setPasswordSuccess] = useState(false);
  const [savingPassword, setSavingPassword] = useState(false);
  const [upgradingTo, setUpgradingTo] = useState<TierKey | null>(null);
  const [upgradeError, setUpgradeError] = useState('');
  const [showUpgradeSuccess, setShowUpgradeSuccess] = useState(false);
  const [managingSubscription, setManagingSubscription] = useState(false);

  // Check for upgrade success from URL params
  useEffect(() => {
    const upgrade = searchParams.get('upgrade');
    if (upgrade === 'success') {
      setShowUpgradeSuccess(true);
      // Clean up URL
      window.history.replaceState({}, '', '/business/dashboard/settings');
      // Auto-hide after 5 seconds
      setTimeout(() => setShowUpgradeSuccess(false), 5000);
    }
  }, [searchParams]);

  const handleUpgrade = async (tier: TierKey, billingPeriod: 'monthly' | 'annual' = 'monthly', isFoundersBundle = false) => {
    if (!business) return;

    setUpgradingTo(tier);
    setUpgradeError('');

    try {
      const response = await fetch('/api/stripe/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          businessId: business.id,
          tier,
          billingPeriod,
          isFoundersBundle,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to create checkout session');
      }

      // Redirect to Stripe Checkout
      if (data.checkoutUrl) {
        window.location.href = data.checkoutUrl;
      }
    } catch (error) {
      setUpgradeError(error instanceof Error ? error.message : 'Failed to start upgrade');
    } finally {
      setUpgradingTo(null);
    }
  };

  const handleManageSubscription = async () => {
    if (!business) return;

    setManagingSubscription(true);

    try {
      const response = await fetch('/api/stripe/portal', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ businessId: business.id }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to open subscription portal');
      }

      if (data.portalUrl) {
        window.location.href = data.portalUrl;
      }
    } catch (error) {
      console.error('Portal error:', error);
      alert(error instanceof Error ? error.message : 'Failed to open portal');
    } finally {
      setManagingSubscription(false);
    }
  };

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

  // Get current tier from DB value
  const currentTierKey = DB_TO_TIER_MAP_LOCAL[business.membership_tier] || 'claimed';
  const currentTier = pricingTiers[currentTierKey];

  // Determine which tiers can be upgraded to
  const upgradeTiers: TierKey[] = [];
  if (currentTierKey === 'claimed') {
    upgradeTiers.push('verified', 'verifiedPlus');
  } else if (currentTierKey === 'verified') {
    upgradeTiers.push('verifiedPlus');
  }

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

          {/* Success Message */}
          {showUpgradeSuccess && (
            <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg flex items-center gap-3">
              <CheckCircle2 className="w-5 h-5 text-green-500" />
              <div>
                <p className="font-medium text-green-800">Upgrade successful!</p>
                <p className="text-sm text-green-700">Your plan has been updated. Welcome to the {currentTier.displayName} tier!</p>
              </div>
            </div>
          )}

          {/* Error Message */}
          {upgradeError && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-3">
              <AlertCircle className="w-5 h-5 text-red-500" />
              <p className="text-red-700">{upgradeError}</p>
            </div>
          )}

          {/* Current Plan */}
          <div className="mb-6 p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <p className="font-semibold text-gray-900">
                    {currentTier.displayName} Plan
                  </p>
                  {currentTier.badge && (
                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${currentTier.badgeColor}`}>
                      {currentTier.badge}
                    </span>
                  )}
                </div>
                <p className="text-sm text-gray-500">
                  {currentTier.monthlyPrice === 0 ? 'Free' : `$${currentTier.monthlyPrice}/month`}
                </p>
              </div>
              <span className="px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-700">
                Active
              </span>
            </div>

            <ul className="mt-4 space-y-2">
              {currentTier.features.slice(0, 6).map((feature, index) => (
                <li key={index} className="flex items-center gap-2 text-sm text-gray-600">
                  <CheckCircle2 className="w-4 h-4 text-green-500" />
                  {feature}
                </li>
              ))}
            </ul>

            {/* Manage Subscription Button for paid tiers */}
            {currentTierKey !== 'claimed' && (
              <button
                onClick={handleManageSubscription}
                disabled={managingSubscription}
                className="mt-4 flex items-center gap-2 text-sm text-boerne-navy hover:underline disabled:opacity-50"
              >
                {managingSubscription ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <ExternalLink className="w-4 h-4" />
                )}
                Manage subscription
              </button>
            )}
          </div>

          {/* Upgrade Options */}
          {upgradeTiers.length > 0 && (
            <div className="border border-boerne-gold rounded-lg p-6 bg-gradient-to-br from-boerne-gold/5 to-white">
              <div className="flex items-center gap-2 mb-2">
                <Crown className="w-5 h-5 text-boerne-gold" />
                <h3 className="font-semibold text-boerne-navy">Upgrade Your Plan</h3>
              </div>
              <p className="text-sm text-gray-600 mb-6">
                Get more visibility, features, and grow your business faster.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {upgradeTiers.map((tierKey) => {
                  const tier = pricingTiers[tierKey];
                  const isVerifiedPlus = tierKey === 'verifiedPlus';

                  return (
                    <div
                      key={tierKey}
                      className={`border rounded-lg p-5 bg-white relative ${
                        isVerifiedPlus ? 'border-green-500 ring-2 ring-green-500/20' : 'border-gray-200'
                      }`}
                    >
                      {isVerifiedPlus && (
                        <div className="absolute -top-3 left-4 bg-green-500 text-white text-xs font-semibold px-2 py-0.5 rounded-full flex items-center gap-1">
                          <Sparkles className="w-3 h-3" />
                          Most Popular
                        </div>
                      )}

                      <div className="flex items-center gap-2 mb-1">
                        <p className="font-semibold text-gray-900">{tier.displayName}</p>
                        {tier.badge && (
                          <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${tier.badgeColor}`}>
                            {tier.badge}
                          </span>
                        )}
                      </div>

                      <div className="mb-3">
                        <span className="text-2xl font-bold text-boerne-navy">${tier.monthlyPrice}</span>
                        <span className="text-gray-500">/month</span>
                      </div>

                      {tier.highlightFeature && (
                        <p className="text-sm font-medium text-green-600 mb-3">
                          {tier.highlightFeature}
                        </p>
                      )}

                      <ul className="space-y-2 mb-4">
                        {tier.features.slice(0, 5).map((feature, i) => (
                          <li key={i} className="flex items-start gap-2 text-sm text-gray-600">
                            <CheckCircle2 className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                            {feature}
                          </li>
                        ))}
                      </ul>

                      <div className="space-y-2">
                        {/* Monthly subscription */}
                        <button
                          onClick={() => handleUpgrade(tierKey, 'monthly')}
                          disabled={upgradingTo !== null}
                          className={`w-full py-2.5 px-4 rounded-lg font-semibold transition-colors disabled:opacity-50 flex items-center justify-center gap-2 ${
                            isVerifiedPlus
                              ? 'bg-boerne-navy text-white hover:bg-boerne-navy/90'
                              : 'bg-boerne-gold text-boerne-navy hover:bg-boerne-gold/90'
                          }`}
                        >
                          {upgradingTo === tierKey ? (
                            <>
                              <Loader2 className="w-4 h-4 animate-spin" />
                              Processing...
                            </>
                          ) : (
                            <>Upgrade to {tier.displayName}</>
                          )}
                        </button>

                        {/* Annual option */}
                        <button
                          onClick={() => handleUpgrade(tierKey, 'annual')}
                          disabled={upgradingTo !== null}
                          className="w-full py-2 px-4 text-sm text-gray-600 hover:text-gray-900 hover:underline disabled:opacity-50"
                        >
                          Or save ${(tier.monthlyPrice * 12) - tier.annualPrice}/yr with annual billing
                        </button>

                        {/* Founder's Bundle for Verified+ */}
                        {isVerifiedPlus && (
                          <div className="mt-3 p-3 bg-amber-50 border border-amber-200 rounded-lg">
                            <p className="text-sm font-medium text-amber-800 mb-1">
                              Founder's Bundle - $199
                            </p>
                            <p className="text-xs text-amber-700 mb-2">
                              First 3 months + professional website setup included
                            </p>
                            <button
                              onClick={() => handleUpgrade('verifiedPlus', 'monthly', true)}
                              disabled={upgradingTo !== null}
                              className="w-full py-2 px-3 bg-amber-500 text-white text-sm font-medium rounded-lg hover:bg-amber-600 disabled:opacity-50"
                            >
                              Get the Bundle
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Already at highest tier */}
          {upgradeTiers.length === 0 && currentTierKey !== 'claimed' && (
            <div className="p-4 bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-lg">
              <div className="flex items-center gap-2 mb-1">
                <Crown className="w-5 h-5 text-green-600" />
                <p className="font-medium text-green-800">You're on our best plan!</p>
              </div>
              <p className="text-sm text-green-700">
                Enjoy all the premium features. Need help? Contact us anytime.
              </p>
            </div>
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
