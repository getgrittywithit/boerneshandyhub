'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useRealtorAuth } from '@/contexts/RealtorAuthContext';

interface Client {
  id: string;
  name: string;
  email: string;
  phone?: string;
  address: string;
  city: string;
  closeDate: string;
  welcomePacketSent: boolean;
  welcomePacketSentAt?: string;
  createdAt: string;
}

interface PacketAnalytics {
  packetId: string;
  clientName: string;
  address: string;
  viewCount: number;
  firstViewedAt: string | null;
  lastViewedAt: string | null;
  totalClicks: number;
  topClickedProviders: { name: string; category: string; clicks: number }[];
  guideClicks: number;
  homeTrackerClicks: number;
}

interface AnalyticsData {
  overall: {
    totalPacketsSent: number;
    totalViews: number;
    totalProviderClicks: number;
    totalGuideClicks: number;
    totalHomeTrackerClicks: number;
    avgViewsPerPacket: number;
    packetsViewed: number;
    viewRate: number;
  };
  packets: PacketAnalytics[];
}

// Demo clients for demonstration
const demoClients: Client[] = [
  {
    id: 'demo-1',
    name: 'John & Jane Smith',
    email: 'smiths@email.com',
    phone: '(830) 555-1234',
    address: '123 Oak Valley Drive',
    city: 'Boerne',
    closeDate: '2024-03-15',
    welcomePacketSent: true,
    welcomePacketSentAt: '2024-03-16',
    createdAt: '2024-03-10',
  },
  {
    id: 'demo-2',
    name: 'Michael Johnson',
    email: 'mjohnson@email.com',
    address: '456 Hill Country Lane',
    city: 'Fair Oaks Ranch',
    closeDate: '2024-03-22',
    welcomePacketSent: false,
    createdAt: '2024-03-18',
  },
  {
    id: 'demo-3',
    name: 'The Garcia Family',
    email: 'garcias@email.com',
    phone: '(210) 555-9876',
    address: '789 Cascade Caverns Rd',
    city: 'Boerne',
    closeDate: '2024-04-01',
    welcomePacketSent: false,
    createdAt: '2024-03-20',
  },
];

export default function RealtorDashboard() {
  const router = useRouter();
  const { user, profile, loading: authLoading, signOut, session } = useRealtorAuth();
  const [clients, setClients] = useState<Client[]>(demoClients);
  const [showAddClient, setShowAddClient] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [analyticsLoading, setAnalyticsLoading] = useState(true);
  const [showAnalyticsDetail, setShowAnalyticsDetail] = useState(false);

  // Redirect if not authenticated
  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/realtors/login');
    }
  }, [authLoading, user, router]);

  // Fetch analytics
  useEffect(() => {
    const fetchAnalytics = async () => {
      if (!session?.access_token) {
        // Use demo data
        setAnalytics({
          overall: {
            totalPacketsSent: 3,
            totalViews: 12,
            totalProviderClicks: 8,
            totalGuideClicks: 5,
            totalHomeTrackerClicks: 2,
            avgViewsPerPacket: 4,
            packetsViewed: 2,
            viewRate: 67,
          },
          packets: [],
        });
        setAnalyticsLoading(false);
        return;
      }

      try {
        const res = await fetch('/api/realtors/analytics', {
          headers: {
            Authorization: `Bearer ${session.access_token}`,
          },
        });
        if (res.ok) {
          const data = await res.json();
          setAnalytics(data);
        }
      } catch (error) {
        console.error('Error fetching analytics:', error);
      } finally {
        setAnalyticsLoading(false);
      }
    };

    if (!authLoading) {
      fetchAnalytics();
    }
  }, [session?.access_token, authLoading]);

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (showUserMenu && !(e.target as Element).closest('.user-menu-container')) {
        setShowUserMenu(false);
      }
    };
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, [showUserMenu]);

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
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-6">
              <Link href="/" className="text-boerne-gold font-semibold text-lg">
                Boerne's Handy Hub
              </Link>
              <span className="text-white/40">|</span>
              <span className="text-white/80 text-sm">Realtor Partner Portal</span>
            </div>

            {/* User Menu */}
            <div className="relative user-menu-container">
              <button
                onClick={() => setShowUserMenu(!showUserMenu)}
                className="flex items-center gap-2 px-3 py-1.5 bg-white/10 rounded-lg hover:bg-white/20 transition-colors"
              >
                <span className="w-8 h-8 bg-boerne-gold rounded-full flex items-center justify-center text-boerne-navy font-semibold">
                  {profile.name[0].toUpperCase()}
                </span>
                <span className="text-white text-sm hidden sm:inline">{profile.name}</span>
                <svg className="w-4 h-4 text-white/70" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {showUserMenu && (
                <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-xl border border-gray-200 z-50">
                  <div className="px-4 py-3 border-b border-gray-100">
                    <p className="font-medium text-gray-900">{profile.name}</p>
                    <p className="text-sm text-gray-500">{profile.company}</p>
                  </div>
                  <div className="py-1">
                    <Link
                      href="/realtors/dashboard/settings"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                    >
                      Settings
                    </Link>
                  </div>
                  <div className="border-t border-gray-100 py-1">
                    <button
                      onClick={async () => {
                        await signOut();
                        router.push('/realtors/login');
                      }}
                      className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-50"
                    >
                      Sign Out
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900">
            Welcome back, {profile.name.split(' ')[0]}!
          </h1>
          <p className="text-gray-600">{profile.company}</p>
        </div>

        {/* Quick Stats */}
        <div className="grid sm:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="text-3xl font-bold text-gray-900">{clients.length}</div>
            <div className="text-sm text-gray-500">Total Clients</div>
          </div>
          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="text-3xl font-bold text-boerne-gold">
              {clients.filter(c => c.welcomePacketSent).length}
            </div>
            <div className="text-sm text-gray-500">Packets Sent</div>
          </div>
          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="text-3xl font-bold text-gray-900">
              {analyticsLoading ? '...' : analytics?.overall.totalViews || 0}
            </div>
            <div className="text-sm text-gray-500">Total Views</div>
          </div>
          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="text-3xl font-bold text-green-600">
              {analyticsLoading ? '...' : `${analytics?.overall.viewRate || 0}%`}
            </div>
            <div className="text-sm text-gray-500">View Rate</div>
          </div>
          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="text-3xl font-bold text-blue-600">
              {analyticsLoading ? '...' : analytics?.overall.totalProviderClicks || 0}
            </div>
            <div className="text-sm text-gray-500">Provider Clicks</div>
          </div>
          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="text-3xl font-bold text-purple-600">
              {analyticsLoading ? '...' : analytics?.overall.totalHomeTrackerClicks || 0}
            </div>
            <div className="text-sm text-gray-500">Home Tracker</div>
          </div>
        </div>

        {/* Packet Engagement Analytics */}
        {analytics && analytics.packets.length > 0 && (
          <div className="bg-white rounded-xl shadow-sm mb-8">
            <div className="p-6 border-b border-gray-100">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-semibold text-gray-900">Packet Engagement</h2>
                  <p className="text-sm text-gray-500">See how clients are interacting with their welcome packets</p>
                </div>
                <button
                  onClick={() => setShowAnalyticsDetail(!showAnalyticsDetail)}
                  className="text-sm text-boerne-gold hover:text-boerne-gold-alt font-medium"
                >
                  {showAnalyticsDetail ? 'Show Less' : 'View Details'}
                </button>
              </div>
            </div>

            {showAnalyticsDetail ? (
              <div className="divide-y divide-gray-100">
                {analytics.packets.map((packet) => (
                  <div key={packet.packetId} className="p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h3 className="font-medium text-gray-900">{packet.clientName}</h3>
                        <p className="text-sm text-gray-500">{packet.address}</p>
                      </div>
                      <div className="text-right">
                        <div className="text-lg font-semibold text-gray-900">{packet.viewCount} views</div>
                        {packet.lastViewedAt && (
                          <p className="text-xs text-gray-400">
                            Last viewed {new Date(packet.lastViewedAt).toLocaleDateString()}
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-4 text-sm">
                      <div className="flex items-center gap-1.5">
                        <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                        <span className="text-gray-600">{packet.totalClicks} total clicks</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                        <span className="text-gray-600">{packet.guideClicks} guide views</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <span className="w-2 h-2 bg-purple-500 rounded-full"></span>
                        <span className="text-gray-600">{packet.homeTrackerClicks} Home Tracker</span>
                      </div>
                    </div>

                    {packet.topClickedProviders.length > 0 && (
                      <div className="mt-3 pt-3 border-t border-gray-100">
                        <p className="text-xs text-gray-500 mb-2">Top Clicked Providers:</p>
                        <div className="flex flex-wrap gap-2">
                          {packet.topClickedProviders.map((provider, i) => (
                            <span
                              key={i}
                              className="inline-flex items-center px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs"
                            >
                              {provider.name}
                              <span className="ml-1.5 text-gray-400">({provider.clicks})</span>
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-6">
                <div className="grid sm:grid-cols-3 gap-6">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-gray-900">
                      {analytics.overall.avgViewsPerPacket}
                    </div>
                    <div className="text-sm text-gray-500">Avg views per packet</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-gray-900">
                      {analytics.overall.totalGuideClicks}
                    </div>
                    <div className="text-sm text-gray-500">Guide clicks</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-gray-900">
                      {analytics.overall.packetsViewed}
                    </div>
                    <div className="text-sm text-gray-500">Packets viewed</div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Clients Section */}
        <div className="bg-white rounded-xl shadow-sm">
          <div className="p-6 border-b border-gray-100">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900">Your Clients</h2>
              <button
                onClick={() => setShowAddClient(true)}
                className="px-4 py-2 bg-boerne-gold text-boerne-navy font-medium rounded-lg hover:bg-boerne-gold-alt transition-colors text-sm"
              >
                + Add Client
              </button>
            </div>
          </div>

          {clients.length === 0 ? (
            <div className="p-12 text-center">
              <div className="text-5xl mb-4">🏠</div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No clients yet</h3>
              <p className="text-gray-500 mb-6 max-w-sm mx-auto">
                Add your first client to create a personalized welcome packet for their new home.
              </p>
              <button
                onClick={() => setShowAddClient(true)}
                className="px-6 py-3 bg-boerne-gold text-boerne-navy font-medium rounded-lg hover:bg-boerne-gold-alt transition-colors"
              >
                Add Your First Client
              </button>
            </div>
          ) : (
            <div className="divide-y divide-gray-100">
              {clients.map((client) => (
                <div key={client.id} className="p-4 hover:bg-gray-50 transition-colors">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-medium text-gray-900">{client.name}</h3>
                      <p className="text-sm text-gray-500">{client.address}, {client.city}</p>
                      <p className="text-xs text-gray-400 mt-1">
                        Closed: {new Date(client.closeDate).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="flex items-center gap-3">
                      {client.welcomePacketSent ? (
                        <div className="flex items-center gap-2">
                          <div className="text-right">
                            <span className="px-3 py-1 bg-green-100 text-green-700 text-xs font-medium rounded-full">
                              Packet Sent
                            </span>
                            {client.welcomePacketSentAt && (
                              <p className="text-xs text-gray-400 mt-1">
                                {new Date(client.welcomePacketSentAt).toLocaleDateString()}
                              </p>
                            )}
                          </div>
                          <Link
                            href={`/welcome/${client.id}`}
                            target="_blank"
                            className="p-2 text-gray-400 hover:text-boerne-gold transition-colors"
                            title="View Packet"
                          >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                            </svg>
                          </Link>
                        </div>
                      ) : (
                        <Link
                          href={`/realtors/dashboard/clients/${client.id}/packet`}
                          className="px-4 py-2 bg-boerne-gold text-boerne-navy text-sm font-medium rounded-lg hover:bg-boerne-gold-alt transition-colors"
                        >
                          Create Packet
                        </Link>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Quick Links */}
        <div className="mt-8 grid sm:grid-cols-2 gap-4">
          <Link
            href="/realtors/dashboard/packet-templates"
            className="p-6 bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-boerne-gold/10 rounded-lg flex items-center justify-center">
                <span className="text-2xl">📋</span>
              </div>
              <div>
                <h3 className="font-medium text-gray-900">Packet Templates</h3>
                <p className="text-sm text-gray-500">Customize your welcome packet content</p>
              </div>
            </div>
          </Link>
          <Link
            href="/guides/new-homeowner-checklist"
            className="p-6 bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-boerne-gold/10 rounded-lg flex items-center justify-center">
                <span className="text-2xl">📚</span>
              </div>
              <div>
                <h3 className="font-medium text-gray-900">New Homeowner Guide</h3>
                <p className="text-sm text-gray-500">Share this resource with your clients</p>
              </div>
            </div>
          </Link>
        </div>
      </div>

      {/* Add Client Modal */}
      {showAddClient && (
        <AddClientModal
          onClose={() => setShowAddClient(false)}
          onAdd={(client) => {
            setClients([...clients, client]);
            setShowAddClient(false);
          }}
        />
      )}
    </div>
  );
}

function AddClientModal({
  onClose,
  onAdd
}: {
  onClose: () => void;
  onAdd: (client: Client) => void;
}) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('Boerne');
  const [closeDate, setCloseDate] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // For now, just create a local client object
    // In production, this would save to Supabase
    const newClient: Client = {
      id: Date.now().toString(),
      name,
      email,
      phone: phone || undefined,
      address,
      city,
      closeDate,
      welcomePacketSent: false,
      welcomePacketSentAt: undefined,
      createdAt: new Date().toISOString(),
    };

    onAdd(newClient);
    setLoading(false);
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl max-w-md w-full max-h-[90vh] overflow-auto">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-900">Add New Client</h2>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Client Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                placeholder="John & Jane Smith"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-boerne-gold focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email <span className="text-red-500">*</span>
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="clients@email.com"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-boerne-gold focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Phone
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
                New Home Address <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                required
                placeholder="123 Oak Valley Drive"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-boerne-gold focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                City <span className="text-red-500">*</span>
              </label>
              <select
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-boerne-gold focus:border-transparent"
              >
                <option value="Boerne">Boerne</option>
                <option value="Fair Oaks Ranch">Fair Oaks Ranch</option>
                <option value="Helotes">Helotes</option>
                <option value="Comfort">Comfort</option>
                <option value="Fredericksburg">Fredericksburg</option>
                <option value="Kerrville">Kerrville</option>
                <option value="New Braunfels">New Braunfels</option>
                <option value="San Antonio">San Antonio</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Closing Date <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                value={closeDate}
                onChange={(e) => setCloseDate(e.target.value)}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-boerne-gold focus:border-transparent"
              />
            </div>

            <div className="flex gap-3 pt-4">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="flex-1 px-4 py-2 bg-boerne-gold text-boerne-navy font-medium rounded-lg hover:bg-boerne-gold-alt disabled:opacity-50"
              >
                {loading ? 'Adding...' : 'Add Client'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
