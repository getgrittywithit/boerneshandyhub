'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useRealtorAuth } from '@/contexts/RealtorAuthContext';

const brandColorOptions = [
  { name: 'Navy', value: '#1e3a5f' },
  { name: 'Forest', value: '#1e5f3a' },
  { name: 'Burgundy', value: '#5f1e3a' },
  { name: 'Charcoal', value: '#333333' },
  { name: 'Royal Blue', value: '#1e3a8a' },
  { name: 'Teal', value: '#0d9488' },
  { name: 'Purple', value: '#6b21a8' },
  { name: 'Rust', value: '#9a3412' },
];

export default function RealtorSettings() {
  const router = useRouter();
  const { user, profile, loading: authLoading, updateProfile, signOut } = useRealtorAuth();

  // Form state
  const [name, setName] = useState('');
  const [company, setCompany] = useState('');
  const [phone, setPhone] = useState('');
  const [licenseNumber, setLicenseNumber] = useState('');
  const [tagline, setTagline] = useState('');
  const [bio, setBio] = useState('');
  const [brandColor, setBrandColor] = useState('#1e3a5f');
  const [photoUrl, setPhotoUrl] = useState('');
  const [logoUrl, setLogoUrl] = useState('');

  // UI state
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [activeTab, setActiveTab] = useState<'profile' | 'branding'>('profile');

  // Load profile data
  useEffect(() => {
    if (profile) {
      setName(profile.name || '');
      setCompany(profile.company || '');
      setPhone(profile.phone || '');
      setLicenseNumber(profile.licenseNumber || '');
      setTagline(profile.tagline || '');
      setBio(profile.bio || '');
      setBrandColor(profile.brandColor || '#1e3a5f');
      setPhotoUrl(profile.photoUrl || '');
      setLogoUrl(profile.logoUrl || '');
    }
  }, [profile]);

  // Redirect if not authenticated
  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/realtors/login');
    }
  }, [authLoading, user, router]);

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMessage(null);

    const { error } = await updateProfile({
      name,
      company,
      phone,
      licenseNumber,
    });

    if (error) {
      setMessage({ type: 'error', text: error });
    } else {
      setMessage({ type: 'success', text: 'Profile updated successfully!' });
    }

    setSaving(false);
  };

  const handleSaveBranding = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMessage(null);

    const { error } = await updateProfile({
      tagline,
      bio,
      brandColor,
      photoUrl,
      logoUrl,
    });

    if (error) {
      setMessage({ type: 'error', text: error });
    } else {
      setMessage({ type: 'success', text: 'Branding updated successfully!' });
    }

    setSaving(false);
  };

  if (authLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-gray-500">Loading...</div>
      </div>
    );
  }

  if (!user || !profile) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-boerne-navy">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              <Link href="/realtors/dashboard" className="text-white/70 hover:text-white">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
              </Link>
              <span className="text-white font-medium">Settings</span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Tabs */}
        <div className="flex gap-4 mb-8 border-b border-gray-200">
          <button
            onClick={() => setActiveTab('profile')}
            className={`pb-3 px-1 font-medium text-sm border-b-2 transition-colors ${
              activeTab === 'profile'
                ? 'border-boerne-gold text-boerne-navy'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            Profile Information
          </button>
          <button
            onClick={() => setActiveTab('branding')}
            className={`pb-3 px-1 font-medium text-sm border-b-2 transition-colors ${
              activeTab === 'branding'
                ? 'border-boerne-gold text-boerne-navy'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            Branding & Appearance
          </button>
        </div>

        {/* Message */}
        {message && (
          <div
            className={`mb-6 p-4 rounded-lg ${
              message.type === 'success' ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'
            }`}
          >
            {message.text}
          </div>
        )}

        {/* Profile Tab */}
        {activeTab === 'profile' && (
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-6">Profile Information</h2>

            <form onSubmit={handleSaveProfile} className="space-y-6">
              <div className="grid sm:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Full Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-boerne-gold focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Company/Brokerage <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={company}
                    onChange={(e) => setCompany(e.target.value)}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-boerne-gold focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="(830) 555-1234"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-boerne-gold focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    License Number
                  </label>
                  <input
                    type="text"
                    value={licenseNumber}
                    onChange={(e) => setLicenseNumber(e.target.value)}
                    placeholder="TX12345678"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-boerne-gold focus:border-transparent"
                  />
                </div>
              </div>

              <div className="flex justify-end">
                <button
                  type="submit"
                  disabled={saving}
                  className="px-6 py-2 bg-boerne-gold text-boerne-navy font-medium rounded-lg hover:bg-boerne-gold-alt disabled:opacity-50 transition-colors"
                >
                  {saving ? 'Saving...' : 'Save Profile'}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Branding Tab */}
        {activeTab === 'branding' && (
          <div className="space-y-6">
            {/* Preview Card */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h3 className="text-sm font-medium text-gray-500 mb-4">Preview</h3>
              <div
                className="rounded-xl p-6 text-center"
                style={{ background: `linear-gradient(135deg, ${brandColor} 0%, ${brandColor}dd 100%)` }}
              >
                {logoUrl ? (
                  <div className="mb-4">
                    <Image
                      src={logoUrl}
                      alt="Logo preview"
                      width={120}
                      height={60}
                      className="mx-auto object-contain bg-white/10 rounded-lg p-2"
                    />
                  </div>
                ) : photoUrl ? (
                  <div className="w-20 h-20 mx-auto mb-4 rounded-full overflow-hidden border-4 border-white/30">
                    <Image
                      src={photoUrl}
                      alt="Photo preview"
                      width={80}
                      height={80}
                      className="object-cover w-full h-full"
                    />
                  </div>
                ) : (
                  <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-white text-2xl font-bold">{name.charAt(0)}</span>
                  </div>
                )}
                <p className="text-white font-semibold text-lg">{name || 'Your Name'}</p>
                <p className="text-white/80">{company || 'Your Company'}</p>
                {tagline && (
                  <p className="text-white/60 text-sm mt-2 italic">"{tagline}"</p>
                )}
              </div>
            </div>

            {/* Branding Form */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-6">Branding & Appearance</h2>
              <p className="text-gray-500 text-sm mb-6">
                Customize how you appear on welcome packets sent to your clients.
              </p>

              <form onSubmit={handleSaveBranding} className="space-y-6">
                {/* Brand Color */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Brand Color
                  </label>
                  <div className="flex flex-wrap gap-3">
                    {brandColorOptions.map((color) => (
                      <button
                        key={color.value}
                        type="button"
                        onClick={() => setBrandColor(color.value)}
                        className={`w-12 h-12 rounded-lg border-2 transition-all ${
                          brandColor === color.value
                            ? 'border-boerne-gold scale-110 shadow-lg'
                            : 'border-transparent hover:scale-105'
                        }`}
                        style={{ backgroundColor: color.value }}
                        title={color.name}
                      />
                    ))}
                    <div className="flex items-center gap-2">
                      <input
                        type="color"
                        value={brandColor}
                        onChange={(e) => setBrandColor(e.target.value)}
                        className="w-12 h-12 rounded-lg cursor-pointer border border-gray-200"
                        title="Custom color"
                      />
                      <span className="text-sm text-gray-500">Custom</span>
                    </div>
                  </div>
                </div>

                {/* Tagline */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Tagline
                  </label>
                  <input
                    type="text"
                    value={tagline}
                    onChange={(e) => setTagline(e.target.value)}
                    placeholder="Your Hill Country Home Expert"
                    maxLength={60}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-boerne-gold focus:border-transparent"
                  />
                  <p className="text-xs text-gray-400 mt-1">{tagline.length}/60 characters</p>
                </div>

                {/* Bio */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Short Bio
                  </label>
                  <textarea
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                    placeholder="Tell clients a bit about yourself and your experience..."
                    rows={3}
                    maxLength={300}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-boerne-gold focus:border-transparent"
                  />
                  <p className="text-xs text-gray-400 mt-1">{bio.length}/300 characters</p>
                </div>

                {/* Photo URL */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Photo URL
                  </label>
                  <input
                    type="url"
                    value={photoUrl}
                    onChange={(e) => setPhotoUrl(e.target.value)}
                    placeholder="https://example.com/your-photo.jpg"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-boerne-gold focus:border-transparent"
                  />
                  <p className="text-xs text-gray-400 mt-1">
                    Paste a URL to your professional headshot. Square images work best.
                  </p>
                </div>

                {/* Logo URL */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Company Logo URL
                  </label>
                  <input
                    type="url"
                    value={logoUrl}
                    onChange={(e) => setLogoUrl(e.target.value)}
                    placeholder="https://example.com/company-logo.png"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-boerne-gold focus:border-transparent"
                  />
                  <p className="text-xs text-gray-400 mt-1">
                    Your company logo will appear at the top of welcome packets (if provided).
                  </p>
                </div>

                <div className="flex justify-end">
                  <button
                    type="submit"
                    disabled={saving}
                    className="px-6 py-2 bg-boerne-gold text-boerne-navy font-medium rounded-lg hover:bg-boerne-gold-alt disabled:opacity-50 transition-colors"
                  >
                    {saving ? 'Saving...' : 'Save Branding'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Danger Zone */}
        <div className="mt-8 bg-white rounded-xl shadow-sm p-6 border border-red-200">
          <h3 className="text-lg font-semibold text-red-600 mb-2">Danger Zone</h3>
          <p className="text-gray-500 text-sm mb-4">
            Sign out of your account or delete your data.
          </p>
          <button
            onClick={async () => {
              await signOut();
              router.push('/realtors/login');
            }}
            className="px-4 py-2 border border-red-300 text-red-600 rounded-lg hover:bg-red-50 transition-colors"
          >
            Sign Out
          </button>
        </div>
      </div>
    </div>
  );
}
