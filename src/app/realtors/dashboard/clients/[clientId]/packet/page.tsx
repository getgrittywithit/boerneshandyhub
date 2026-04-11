'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { useRealtorAuth } from '@/contexts/RealtorAuthContext';
import {
  generateWelcomePacket,
  packetCategories,
  packetGuides,
  type WelcomePacketData
} from '@/lib/welcomePacket';

export default function CreateWelcomePacketPage() {
  const params = useParams();
  const router = useRouter();
  const clientId = params.clientId as string;
  const { user, profile, loading: authLoading } = useRealtorAuth();

  // For demo, we'll use mock client data
  // In production, this would load from Supabase
  const [client] = useState({
    id: clientId,
    name: 'John & Jane Smith',
    email: 'smiths@email.com',
    address: '123 Oak Valley Drive',
    city: 'Boerne',
  });

  const [selectedCategories, setSelectedCategories] = useState<string[]>(
    packetCategories.slice(0, 6).map(c => c.id)
  );
  const [customMessage, setCustomMessage] = useState('');
  const [packet, setPacket] = useState<WelcomePacketData | null>(null);
  const [showPreview, setShowPreview] = useState(false);
  const [copied, setCopied] = useState(false);
  const [showSentConfirmation, setShowSentConfirmation] = useState(false);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/realtors/login');
    }
  }, [authLoading, user, router]);

  const toggleCategory = (categoryId: string) => {
    setSelectedCategories(prev =>
      prev.includes(categoryId)
        ? prev.filter(id => id !== categoryId)
        : [...prev, categoryId]
    );
  };

  const handleGeneratePacket = () => {
    if (!profile) return;

    const generatedPacket = generateWelcomePacket(
      client.name,
      client.address,
      client.city,
      profile.name,
      profile.company,
      customMessage || undefined,
      selectedCategories
    );

    setPacket(generatedPacket);
    setShowPreview(true);
  };

  const handleCopyLink = () => {
    // In production, this would be a real shareable link
    const shareUrl = `${window.location.origin}/welcome/${clientId}`;
    navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (authLoading || !profile) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-gray-500">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-boerne-navy">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <nav className="mb-4">
            <ol className="flex items-center gap-2 text-sm text-white/60">
              <li>
                <Link href="/realtors/dashboard" className="hover:text-white">Dashboard</Link>
              </li>
              <li>/</li>
              <li className="text-white">Create Welcome Packet</li>
            </ol>
          </nav>
          <h1 className="text-2xl font-bold text-white">
            Welcome Packet for {client.name}
          </h1>
          <p className="text-white/70 mt-1">{client.address}, {client.city}</p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {!showPreview ? (
          <div className="space-y-8">
            {/* Custom Message */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                Personal Welcome Message
              </h2>
              <p className="text-sm text-gray-500 mb-3">
                Add a personal touch. If left blank, we'll use a friendly default message.
              </p>
              <textarea
                value={customMessage}
                onChange={(e) => setCustomMessage(e.target.value)}
                placeholder={`Congratulations on your new home at ${client.address}! Here are my trusted recommendations...`}
                rows={4}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-boerne-gold focus:border-transparent"
              />
            </div>

            {/* Category Selection */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                Service Categories to Include
              </h2>
              <p className="text-sm text-gray-500 mb-4">
                Select which service categories to include in the welcome packet.
                We'll show the top providers in each category.
              </p>
              <div className="grid sm:grid-cols-2 gap-3">
                {packetCategories.map(category => (
                  <label
                    key={category.id}
                    className={`flex items-center gap-3 p-4 rounded-lg border-2 cursor-pointer transition-colors ${
                      selectedCategories.includes(category.id)
                        ? 'border-boerne-gold bg-boerne-gold/5'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={selectedCategories.includes(category.id)}
                      onChange={() => toggleCategory(category.id)}
                      className="sr-only"
                    />
                    <span className="text-2xl">{category.icon}</span>
                    <span className="font-medium text-gray-900">{category.name}</span>
                    {selectedCategories.includes(category.id) && (
                      <span className="ml-auto text-boerne-gold">✓</span>
                    )}
                  </label>
                ))}
              </div>
            </div>

            {/* Included Guides */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                Included Homeowner Guides
              </h2>
              <p className="text-sm text-gray-500 mb-4">
                These helpful guides will be included in every welcome packet.
              </p>
              <div className="space-y-3">
                {packetGuides.map(guide => (
                  <div key={guide.slug} className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                    <span className="text-boerne-gold text-lg">📚</span>
                    <div>
                      <p className="font-medium text-gray-900">{guide.title}</p>
                      <p className="text-sm text-gray-500">{guide.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Generate Button */}
            <div className="flex justify-end gap-4">
              <Link
                href="/realtors/dashboard"
                className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
              >
                Cancel
              </Link>
              <button
                onClick={handleGeneratePacket}
                disabled={selectedCategories.length === 0}
                className="px-6 py-3 bg-boerne-gold text-boerne-navy font-semibold rounded-lg hover:bg-boerne-gold-alt disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Generate Welcome Packet
              </button>
            </div>
          </div>
        ) : (
          /* Preview */
          <div className="space-y-6">
            {/* Actions Bar */}
            <div className="bg-white rounded-xl shadow-sm p-4 flex items-center justify-between">
              <div>
                <h2 className="font-semibold text-gray-900">Welcome Packet Preview</h2>
                <p className="text-sm text-gray-500">Review before sending to your client</p>
              </div>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setShowPreview(false)}
                  className="px-4 py-2 text-gray-600 hover:text-gray-900"
                >
                  ← Edit
                </button>
                <button
                  onClick={handleCopyLink}
                  className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center gap-2"
                >
                  {copied ? (
                    <>
                      <span className="text-green-600">✓</span>
                      Copied!
                    </>
                  ) : (
                    <>
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                      </svg>
                      Copy Link
                    </>
                  )}
                </button>
                <button
                  onClick={() => setShowSentConfirmation(true)}
                  className="px-4 py-2 bg-boerne-gold text-boerne-navy font-medium rounded-lg hover:bg-boerne-gold-alt flex items-center gap-2"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  Send to Client
                </button>
              </div>
            </div>

            {/* Packet Preview */}
            {packet && <WelcomePacketPreview packet={packet} />}
          </div>
        )}
      </div>

      {/* Send Confirmation Modal */}
      {showSentConfirmation && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-md w-full p-6">
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Share Welcome Packet
              </h3>
              <p className="text-gray-600 mb-6">
                Copy the link below to share with {client.name}:
              </p>

              <div className="bg-gray-50 rounded-lg p-3 mb-4">
                <code className="text-sm text-gray-700 break-all">
                  {typeof window !== 'undefined' ? `${window.location.origin}/welcome/${clientId}` : ''}
                </code>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => {
                    const shareUrl = `${window.location.origin}/welcome/${clientId}`;
                    navigator.clipboard.writeText(shareUrl);
                    setCopied(true);
                    setTimeout(() => setCopied(false), 2000);
                  }}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center justify-center gap-2"
                >
                  {copied ? (
                    <>
                      <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      Copied!
                    </>
                  ) : (
                    <>
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                      </svg>
                      Copy Link
                    </>
                  )}
                </button>
                <button
                  onClick={() => {
                    // In production, this would actually send an email via an API
                    // For now, we'll open the user's email client
                    const shareUrl = `${window.location.origin}/welcome/${clientId}`;
                    const subject = encodeURIComponent(`Welcome to Your New Home - ${client.address}`);
                    const body = encodeURIComponent(
                      `Dear ${client.name},\n\n` +
                      `Congratulations on your new home! I've put together a special welcome packet with trusted local service providers and helpful resources for your new home.\n\n` +
                      `View your welcome packet here:\n${shareUrl}\n\n` +
                      `Best regards,\n${profile?.name}\n${profile?.company}`
                    );
                    window.location.href = `mailto:${client.email}?subject=${subject}&body=${body}`;
                  }}
                  className="flex-1 px-4 py-2 bg-boerne-gold text-boerne-navy font-medium rounded-lg hover:bg-boerne-gold-alt flex items-center justify-center gap-2"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  Open Email
                </button>
              </div>

              <button
                onClick={() => {
                  setShowSentConfirmation(false);
                  router.push('/realtors/dashboard');
                }}
                className="mt-4 text-sm text-gray-500 hover:text-gray-700"
              >
                Done — Return to Dashboard
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function WelcomePacketPreview({ packet }: { packet: WelcomePacketData }) {
  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-boerne-navy to-boerne-dark-gray p-8 text-center">
        <div className="w-16 h-16 bg-boerne-gold/20 rounded-full flex items-center justify-center mx-auto mb-4">
          <span className="text-4xl">🏠</span>
        </div>
        <h1 className="text-2xl font-bold text-white mb-2">
          Welcome to Your New Home!
        </h1>
        <p className="text-white/80">
          {packet.address}, {packet.city}
        </p>
      </div>

      <div className="p-8">
        {/* Welcome Message */}
        <div className="mb-8">
          <p className="text-gray-700 leading-relaxed">{packet.welcomeMessage}</p>
          <p className="mt-4 text-gray-600">
            — {packet.realtorName}, {packet.realtorCompany}
          </p>
        </div>

        {/* Service Providers */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">
            Trusted Local Service Providers
          </h2>

          <div className="space-y-6">
            {packet.categories.map(category => (
              <div key={category.id}>
                <h3 className="flex items-center gap-2 text-lg font-medium text-gray-900 mb-3">
                  <span>{category.icon}</span>
                  {category.name}
                </h3>
                <div className="grid gap-3">
                  {category.providers.map(provider => (
                    <div
                      key={provider.id}
                      className="p-4 border border-gray-200 rounded-lg hover:border-boerne-gold/50 transition-colors"
                    >
                      <div className="flex items-start justify-between">
                        <div>
                          <h4 className="font-medium text-gray-900">{provider.name}</h4>
                          <div className="flex items-center gap-3 mt-1 text-sm text-gray-500">
                            {provider.licensed && (
                              <span className="flex items-center gap-1">
                                <span className="text-green-600">✓</span> Licensed
                              </span>
                            )}
                            {provider.insured && (
                              <span className="flex items-center gap-1">
                                <span className="text-green-600">✓</span> Insured
                              </span>
                            )}
                          </div>
                        </div>
                        <div className="text-right text-sm">
                          {provider.phone && (
                            <p className="text-gray-600">{provider.phone}</p>
                          )}
                          {provider.website && (
                            <a
                              href={provider.website}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-boerne-gold hover:text-boerne-gold-alt"
                            >
                              Website →
                            </a>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Guides */}
        <div className="border-t pt-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            Helpful Resources for New Homeowners
          </h2>
          <div className="grid sm:grid-cols-2 gap-4">
            {packet.guides.map(guide => (
              <Link
                key={guide.slug}
                href={`/guides/${guide.slug}`}
                className="p-4 border border-gray-200 rounded-lg hover:border-boerne-gold/50 hover:bg-boerne-gold/5 transition-colors"
              >
                <h3 className="font-medium text-gray-900 mb-1">{guide.title}</h3>
                <p className="text-sm text-gray-500">{guide.description}</p>
              </Link>
            ))}
          </div>
        </div>

        {/* Home Tracker CTA */}
        <div className="mt-8 p-6 bg-boerne-gold/10 rounded-xl text-center">
          <h3 className="font-semibold text-gray-900 mb-2">
            Track Your Home Maintenance
          </h3>
          <p className="text-gray-600 mb-4">
            Get personalized maintenance reminders for your new home with our free Home Tracker.
          </p>
          <Link
            href="/my-home"
            className="inline-block px-6 py-2 bg-boerne-gold text-boerne-navy font-medium rounded-lg hover:bg-boerne-gold-alt"
          >
            Set Up Home Tracker →
          </Link>
        </div>

        {/* Footer */}
        <div className="mt-8 pt-6 border-t text-center text-sm text-gray-500">
          <p>
            This welcome packet was created for you by {packet.realtorName} at {packet.realtorCompany}
          </p>
          <p className="mt-1">
            Powered by <Link href="/" className="text-boerne-gold hover:text-boerne-gold-alt">Boerne's Handy Hub</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
