'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import { User } from '@supabase/supabase-js';

interface SiteSettings {
  siteName: string;
  siteTagline: string;
  contactEmail: string;
  contactPhone: string;
  socialLinks: {
    facebook: string;
    instagram: string;
    twitter: string;
  };
  features: {
    chatEnabled: boolean;
    quoteRequestsEnabled: boolean;
    businessClaimsEnabled: boolean;
    marketplaceEnabled: boolean;
  };
  seo: {
    metaTitle: string;
    metaDescription: string;
  };
}

const defaultSettings: SiteSettings = {
  siteName: 'Boerne Handy Hub',
  siteTagline: 'Find trusted home services in Boerne, Texas',
  contactEmail: 'hello@boernehandyhub.com',
  contactPhone: '(830) 555-0000',
  socialLinks: {
    facebook: 'https://facebook.com/boernehandyhub',
    instagram: 'https://instagram.com/boernehandyhub',
    twitter: 'https://twitter.com/boernehandyhub',
  },
  features: {
    chatEnabled: true,
    quoteRequestsEnabled: true,
    businessClaimsEnabled: true,
    marketplaceEnabled: true,
  },
  seo: {
    metaTitle: 'Boerne Handy Hub | Find Trusted Home Services in Boerne, TX',
    metaDescription: 'Connect with licensed, insured, and highly-rated local professionals in Boerne, Texas. From plumbers to contractors, find the right service provider for your home.',
  },
};

export default function AdminSettings() {
  const [user, setUser] = useState<User | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [settings, setSettings] = useState<SiteSettings>(defaultSettings);
  const [activeTab, setActiveTab] = useState('general');

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      if (!supabase) {
        setLoading(false);
        return;
      }
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);

      if (user) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('role')
          .eq('id', user.id)
          .single();

        setIsAdmin(profile?.role === 'admin');
      }
    } catch (error) {
      console.error('Auth check failed:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    // Simulate save
    await new Promise(resolve => setTimeout(resolve, 1000));
    setSaving(false);
    alert('Settings saved! (Note: Currently using local state. Database integration coming soon.)');
  };

  const tabs = [
    { id: 'general', label: 'General', icon: '⚙️' },
    { id: 'features', label: 'Features', icon: '🎛️' },
    { id: 'seo', label: 'SEO', icon: '🔍' },
    { id: 'integrations', label: 'Integrations', icon: '🔗' },
  ];

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-boerne-navy"></div>
      </div>
    );
  }

  if (!user && !isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center max-w-md">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Admin Access Required</h1>
          <p className="text-gray-600 mb-6">Please sign in to access settings.</p>
          <Link href="/admin" className="text-boerne-gold hover:text-boerne-gold-alt">
            ← Back to Admin Dashboard
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-boerne-navy shadow">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <div className="flex items-center gap-3">
                <Link href="/admin" className="text-white/70 hover:text-white">
                  ← Dashboard
                </Link>
                <span className="text-white/30">/</span>
                <h1 className="text-2xl font-bold text-white">Settings</h1>
              </div>
              <p className="mt-1 text-boerne-gold text-sm">Site configuration and preferences</p>
            </div>
            <button
              onClick={handleSave}
              disabled={saving}
              className="px-6 py-2 bg-boerne-gold text-boerne-navy font-semibold rounded-lg hover:bg-boerne-gold-alt transition-colors disabled:opacity-50"
            >
              {saving ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex gap-8">
          {/* Sidebar Tabs */}
          <div className="w-56 flex-shrink-0">
            <nav className="space-y-1">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-colors ${
                    activeTab === tab.id
                      ? 'bg-boerne-navy text-white'
                      : 'bg-white text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <span>{tab.icon}</span>
                  <span className="font-medium">{tab.label}</span>
                </button>
              ))}
            </nav>
          </div>

          {/* Content */}
          <div className="flex-1">
            {/* General Settings */}
            {activeTab === 'general' && (
              <div className="bg-white rounded-lg shadow">
                <div className="px-6 py-4 border-b border-gray-200">
                  <h2 className="text-lg font-semibold text-gray-900">General Settings</h2>
                  <p className="text-sm text-gray-500">Basic site information and contact details</p>
                </div>

                <div className="p-6 space-y-6">
                  <div className="grid grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Site Name
                      </label>
                      <input
                        type="text"
                        value={settings.siteName}
                        onChange={(e) => setSettings({ ...settings, siteName: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-boerne-gold focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Tagline
                      </label>
                      <input
                        type="text"
                        value={settings.siteTagline}
                        onChange={(e) => setSettings({ ...settings, siteTagline: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-boerne-gold focus:border-transparent"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Contact Email
                      </label>
                      <input
                        type="email"
                        value={settings.contactEmail}
                        onChange={(e) => setSettings({ ...settings, contactEmail: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-boerne-gold focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Contact Phone
                      </label>
                      <input
                        type="tel"
                        value={settings.contactPhone}
                        onChange={(e) => setSettings({ ...settings, contactPhone: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-boerne-gold focus:border-transparent"
                      />
                    </div>
                  </div>

                  <div>
                    <h3 className="text-sm font-medium text-gray-700 mb-3">Social Media Links</h3>
                    <div className="space-y-3">
                      <div className="flex items-center gap-3">
                        <span className="w-24 text-sm text-gray-500">Facebook</span>
                        <input
                          type="url"
                          value={settings.socialLinks.facebook}
                          onChange={(e) => setSettings({
                            ...settings,
                            socialLinks: { ...settings.socialLinks, facebook: e.target.value }
                          })}
                          className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-boerne-gold focus:border-transparent"
                        />
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="w-24 text-sm text-gray-500">Instagram</span>
                        <input
                          type="url"
                          value={settings.socialLinks.instagram}
                          onChange={(e) => setSettings({
                            ...settings,
                            socialLinks: { ...settings.socialLinks, instagram: e.target.value }
                          })}
                          className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-boerne-gold focus:border-transparent"
                        />
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="w-24 text-sm text-gray-500">Twitter/X</span>
                        <input
                          type="url"
                          value={settings.socialLinks.twitter}
                          onChange={(e) => setSettings({
                            ...settings,
                            socialLinks: { ...settings.socialLinks, twitter: e.target.value }
                          })}
                          className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-boerne-gold focus:border-transparent"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Features Settings */}
            {activeTab === 'features' && (
              <div className="bg-white rounded-lg shadow">
                <div className="px-6 py-4 border-b border-gray-200">
                  <h2 className="text-lg font-semibold text-gray-900">Feature Toggles</h2>
                  <p className="text-sm text-gray-500">Enable or disable site features</p>
                </div>

                <div className="p-6 space-y-4">
                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div>
                      <h3 className="font-medium text-gray-900">Bernie Chat Assistant</h3>
                      <p className="text-sm text-gray-500">AI-powered chat assistant for visitors</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={settings.features.chatEnabled}
                        onChange={(e) => setSettings({
                          ...settings,
                          features: { ...settings.features, chatEnabled: e.target.checked }
                        })}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:ring-4 peer-focus:ring-boerne-gold/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-boerne-gold"></div>
                    </label>
                  </div>

                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div>
                      <h3 className="font-medium text-gray-900">Quote Requests</h3>
                      <p className="text-sm text-gray-500">Allow visitors to request quotes from providers</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={settings.features.quoteRequestsEnabled}
                        onChange={(e) => setSettings({
                          ...settings,
                          features: { ...settings.features, quoteRequestsEnabled: e.target.checked }
                        })}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:ring-4 peer-focus:ring-boerne-gold/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-boerne-gold"></div>
                    </label>
                  </div>

                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div>
                      <h3 className="font-medium text-gray-900">Business Claims</h3>
                      <p className="text-sm text-gray-500">Allow businesses to claim their listings</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={settings.features.businessClaimsEnabled}
                        onChange={(e) => setSettings({
                          ...settings,
                          features: { ...settings.features, businessClaimsEnabled: e.target.checked }
                        })}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:ring-4 peer-focus:ring-boerne-gold/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-boerne-gold"></div>
                    </label>
                  </div>

                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div>
                      <h3 className="font-medium text-gray-900">Marketplace</h3>
                      <p className="text-sm text-gray-500">Local produce and goods marketplace</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={settings.features.marketplaceEnabled}
                        onChange={(e) => setSettings({
                          ...settings,
                          features: { ...settings.features, marketplaceEnabled: e.target.checked }
                        })}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:ring-4 peer-focus:ring-boerne-gold/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-boerne-gold"></div>
                    </label>
                  </div>
                </div>
              </div>
            )}

            {/* SEO Settings */}
            {activeTab === 'seo' && (
              <div className="bg-white rounded-lg shadow">
                <div className="px-6 py-4 border-b border-gray-200">
                  <h2 className="text-lg font-semibold text-gray-900">SEO Settings</h2>
                  <p className="text-sm text-gray-500">Search engine optimization settings</p>
                </div>

                <div className="p-6 space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Meta Title
                    </label>
                    <input
                      type="text"
                      value={settings.seo.metaTitle}
                      onChange={(e) => setSettings({
                        ...settings,
                        seo: { ...settings.seo, metaTitle: e.target.value }
                      })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-boerne-gold focus:border-transparent"
                    />
                    <p className="mt-1 text-xs text-gray-500">{settings.seo.metaTitle.length}/60 characters</p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Meta Description
                    </label>
                    <textarea
                      value={settings.seo.metaDescription}
                      onChange={(e) => setSettings({
                        ...settings,
                        seo: { ...settings.seo, metaDescription: e.target.value }
                      })}
                      rows={3}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-boerne-gold focus:border-transparent"
                    />
                    <p className="mt-1 text-xs text-gray-500">{settings.seo.metaDescription.length}/160 characters</p>
                  </div>

                  <div className="p-4 bg-gray-50 rounded-lg">
                    <h3 className="text-sm font-medium text-gray-700 mb-2">Search Preview</h3>
                    <div className="p-3 bg-white rounded border">
                      <p className="text-blue-600 text-lg hover:underline cursor-pointer">
                        {settings.seo.metaTitle}
                      </p>
                      <p className="text-green-700 text-sm">boernehandyhub.com</p>
                      <p className="text-gray-600 text-sm mt-1">
                        {settings.seo.metaDescription}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Integrations */}
            {activeTab === 'integrations' && (
              <div className="space-y-6">
                <div className="bg-white rounded-lg shadow">
                  <div className="px-6 py-4 border-b border-gray-200">
                    <h2 className="text-lg font-semibold text-gray-900">Integrations</h2>
                    <p className="text-sm text-gray-500">Connect third-party services</p>
                  </div>

                  <div className="p-6 space-y-4">
                    {/* Supabase */}
                    <div className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                          <span className="text-green-600 font-bold">S</span>
                        </div>
                        <div>
                          <h3 className="font-medium text-gray-900">Supabase</h3>
                          <p className="text-sm text-gray-500">Database and authentication</p>
                        </div>
                      </div>
                      <span className={`px-3 py-1 text-xs rounded-full ${
                        supabase ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'
                      }`}>
                        {supabase ? 'Connected' : 'Not Configured'}
                      </span>
                    </div>

                    {/* OpenAI */}
                    <div className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 bg-gray-900 rounded-lg flex items-center justify-center">
                          <span className="text-white font-bold text-sm">AI</span>
                        </div>
                        <div>
                          <h3 className="font-medium text-gray-900">OpenAI</h3>
                          <p className="text-sm text-gray-500">Powers Bernie chat assistant</p>
                        </div>
                      </div>
                      <span className="px-3 py-1 text-xs rounded-full bg-green-100 text-green-700">
                        Connected
                      </span>
                    </div>

                    {/* Beehiiv */}
                    <div className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center">
                          <span className="text-yellow-600">🐝</span>
                        </div>
                        <div>
                          <h3 className="font-medium text-gray-900">Beehiiv</h3>
                          <p className="text-sm text-gray-500">Email newsletter platform</p>
                        </div>
                      </div>
                      <button className="px-3 py-1 text-xs border border-gray-300 rounded-full hover:bg-gray-50">
                        Connect
                      </button>
                    </div>

                    {/* Google Analytics */}
                    <div className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                          <span className="text-orange-600 font-bold">G</span>
                        </div>
                        <div>
                          <h3 className="font-medium text-gray-900">Google Analytics</h3>
                          <p className="text-sm text-gray-500">Website analytics and tracking</p>
                        </div>
                      </div>
                      <button className="px-3 py-1 text-xs border border-gray-300 rounded-full hover:bg-gray-50">
                        Connect
                      </button>
                    </div>
                  </div>
                </div>

                {/* Info Box */}
                <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <div className="flex gap-3">
                    <span className="text-blue-500 text-xl">ℹ️</span>
                    <div>
                      <h3 className="font-medium text-blue-900">Integration Setup</h3>
                      <p className="text-sm text-blue-700 mt-1">
                        Most integrations require API keys or OAuth setup. Contact your developer to
                        configure new integrations. Environment variables should be set in your
                        deployment platform (Vercel).
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
