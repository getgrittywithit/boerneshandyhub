'use client';

import { useState, useEffect, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import type { NewsletterDraft, NewsletterSections } from '@/types/newsletter';

interface AudienceCounts {
  all: number;
  homeowners: number;
  realtors: number;
  businesses: number;
}

interface AudienceConfig {
  all: boolean;
  homeowners: boolean;
  realtors: boolean;
  businesses: boolean;
}

export default function NewsletterEditorPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  const [draft, setDraft] = useState<NewsletterDraft | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [sendingTest, setSendingTest] = useState(false);
  const [testEmail, setTestEmail] = useState('');
  const [showTestModal, setShowTestModal] = useState(false);
  const [showSendModal, setShowSendModal] = useState(false);
  const [sending, setSending] = useState(false);
  const [selectedAudience, setSelectedAudience] = useState<'all' | 'homeowners' | 'realtors' | 'businesses'>('all');
  const [audienceCounts, setAudienceCounts] = useState<AudienceCounts>({ all: 0, homeowners: 0, realtors: 0, businesses: 0 });
  const [audienceConfig, setAudienceConfig] = useState<AudienceConfig>({ all: false, homeowners: false, realtors: false, businesses: false });
  const [activeTab, setActiveTab] = useState<'edit' | 'preview'>('edit');

  // Editable fields
  const [title, setTitle] = useState('');
  const [subjectLine, setSubjectLine] = useState('');
  const [previewText, setPreviewText] = useState('');
  const [sections, setSections] = useState<NewsletterSections>({});

  useEffect(() => {
    loadDraft();
    loadAudienceCounts();
  }, [id]);

  const loadAudienceCounts = async () => {
    try {
      const response = await fetch('/api/newsletters/broadcast');
      if (response.ok) {
        const data = await response.json();
        setAudienceCounts(data.counts);
        setAudienceConfig(data.configured);
      }
    } catch (error) {
      console.error('Error loading audience counts:', error);
    }
  };

  const loadDraft = async () => {
    try {
      const response = await fetch(`/api/newsletters/drafts?status=all`);
      if (response.ok) {
        const data = await response.json();
        const foundDraft = data.drafts?.find((d: NewsletterDraft) => d.id === id);
        if (foundDraft) {
          setDraft(foundDraft);
          setTitle(foundDraft.title);
          setSubjectLine(foundDraft.subject_line || '');
          setPreviewText(foundDraft.preview_text || '');
          setSections(foundDraft.sections || {});
        }
      }
    } catch (error) {
      console.error('Error loading draft:', error);
    } finally {
      setLoading(false);
    }
  };

  const saveDraft = useCallback(async () => {
    if (!draft) return;
    setSaving(true);
    try {
      const response = await fetch('/api/newsletters/drafts', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: draft.id,
          title,
          subject_line: subjectLine,
          preview_text: previewText,
          sections,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        setDraft(data.draft);
      } else {
        alert('Failed to save draft');
      }
    } catch (error) {
      console.error('Error saving draft:', error);
      alert('Failed to save draft');
    } finally {
      setSaving(false);
    }
  }, [draft, title, subjectLine, previewText, sections]);

  const handleSendTest = async () => {
    if (!testEmail || !draft) return;

    setSendingTest(true);
    try {
      const response = await fetch('/api/newsletters/send-test', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          draft_id: draft.id,
          test_email: testEmail,
        }),
      });

      if (response.ok) {
        alert(`Test email sent to ${testEmail}`);
        setShowTestModal(false);
      } else {
        const data = await response.json();
        alert(data.error || 'Failed to send test email');
      }
    } catch (error) {
      console.error('Error sending test:', error);
      alert('Failed to send test email');
    } finally {
      setSendingTest(false);
    }
  };

  const handleApprove = async () => {
    if (!draft) return;

    if (!confirm('Approve this newsletter for sending?')) return;

    try {
      const response = await fetch('/api/newsletters/drafts', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: draft.id,
          status: 'approved',
        }),
      });

      if (response.ok) {
        const data = await response.json();
        setDraft(data.draft);
        alert('Newsletter approved and ready to send');
      }
    } catch (error) {
      console.error('Error approving:', error);
      alert('Failed to approve newsletter');
    }
  };

  const handleSendToSubscribers = async () => {
    if (!draft) return;

    setSending(true);
    try {
      const response = await fetch('/api/newsletters/broadcast', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          draft_id: draft.id,
          audience: selectedAudience,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setDraft({ ...draft, status: 'sent' });
        setShowSendModal(false);
        alert(`Newsletter sent to ${data.subscriberCount} subscribers!`);
      } else {
        alert(data.error || 'Failed to send newsletter');
      }
    } catch (error) {
      console.error('Error sending:', error);
      alert('Failed to send newsletter');
    } finally {
      setSending(false);
    }
  };

  const handleDelete = async () => {
    if (!draft) return;

    if (!confirm('Delete this draft? This cannot be undone.')) return;

    try {
      const response = await fetch(`/api/newsletters/drafts?id=${draft.id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        router.push('/admin/newsletters');
      } else {
        alert('Failed to delete draft');
      }
    } catch (error) {
      console.error('Error deleting:', error);
      alert('Failed to delete draft');
    }
  };

  const updateSection = (sectionKey: keyof NewsletterSections, value: unknown) => {
    setSections((prev) => ({
      ...prev,
      [sectionKey]: value,
    }));
  };

  if (loading) {
    return (
      <div className="p-8">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-gray-200 rounded w-48"></div>
          <div className="h-64 bg-gray-200 rounded-xl"></div>
        </div>
      </div>
    );
  }

  if (!draft) {
    return (
      <div className="p-8">
        <div className="text-center py-12">
          <div className="text-4xl mb-3">&#128533;</div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Draft not found</h2>
          <Link href="/admin/newsletters" className="text-boerne-gold hover:text-boerne-gold-alt">
            Back to newsletters
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link
              href="/admin/newsletters"
              className="text-gray-500 hover:text-gray-700"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </Link>
            <div>
              <h1 className="text-lg font-semibold text-gray-900">{title || 'Untitled Newsletter'}</h1>
              <div className="flex items-center gap-2 mt-1">
                <span className={`px-2 py-0.5 text-xs font-medium rounded-full ${
                  draft.status === 'draft' ? 'bg-yellow-100 text-yellow-700' :
                  draft.status === 'approved' ? 'bg-blue-100 text-blue-700' :
                  draft.status === 'sent' ? 'bg-green-100 text-green-700' :
                  'bg-gray-100 text-gray-700'
                }`}>
                  {draft.status}
                </span>
                {saving && <span className="text-xs text-gray-500">Saving...</span>}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {draft.status === 'draft' && (
              <>
                <button
                  onClick={() => setShowTestModal(true)}
                  className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Send Test
                </button>
                <button
                  onClick={saveDraft}
                  disabled={saving}
                  className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
                >
                  Save Draft
                </button>
                <button
                  onClick={handleApprove}
                  className="px-4 py-2 bg-boerne-gold text-boerne-navy font-medium rounded-lg hover:bg-boerne-gold-alt transition-colors"
                >
                  Approve
                </button>
              </>
            )}
            {draft.status === 'approved' && (
              <>
                <button
                  onClick={() => setShowTestModal(true)}
                  className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Send Test
                </button>
                <button
                  onClick={() => setShowSendModal(true)}
                  className="px-4 py-2 bg-green-600 text-white font-medium rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                  </svg>
                  Send to Subscribers
                </button>
              </>
            )}
            {draft.status === 'sent' && (
              <div className="flex items-center gap-2 px-4 py-2 bg-green-100 text-green-700 rounded-lg">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                Sent
              </div>
            )}
            {draft.status !== 'sent' && (
              <button
                onClick={handleDelete}
                className="px-4 py-2 text-red-600 border border-red-200 rounded-lg hover:bg-red-50 transition-colors"
              >
                Delete
              </button>
            )}
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-4 mt-4">
          <button
            onClick={() => setActiveTab('edit')}
            className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
              activeTab === 'edit'
                ? 'bg-boerne-navy text-white'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            Edit
          </button>
          <button
            onClick={() => setActiveTab('preview')}
            className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
              activeTab === 'preview'
                ? 'bg-boerne-navy text-white'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            Preview
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-auto bg-gray-50 p-6">
        {activeTab === 'edit' ? (
          <div className="max-w-4xl mx-auto space-y-6">
            {/* Basic Info */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Basic Information</h2>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Internal Title
                  </label>
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-boerne-gold focus:border-transparent"
                    placeholder="May 2025 Newsletter"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Subject Line
                  </label>
                  <input
                    type="text"
                    value={subjectLine}
                    onChange={(e) => setSubjectLine(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-boerne-gold focus:border-transparent"
                    placeholder="Your May Home Maintenance Guide"
                  />
                  {draft.subject_line_alternatives?.length > 0 && (
                    <div className="mt-2">
                      <p className="text-xs text-gray-500 mb-1">Alternative suggestions:</p>
                      <div className="flex flex-wrap gap-2">
                        {draft.subject_line_alternatives.map((alt, i) => (
                          <button
                            key={i}
                            onClick={() => setSubjectLine(alt)}
                            className="text-xs px-2 py-1 bg-gray-100 rounded hover:bg-gray-200 transition-colors"
                          >
                            {alt}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Preview Text
                  </label>
                  <input
                    type="text"
                    value={previewText}
                    onChange={(e) => setPreviewText(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-boerne-gold focus:border-transparent"
                    placeholder="What subscribers see in their inbox preview..."
                  />
                </div>
              </div>
            </div>

            {/* Intro Section */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Introduction</h2>
              <textarea
                value={sections.intro?.text || ''}
                onChange={(e) => updateSection('intro', { text: e.target.value })}
                rows={4}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-boerne-gold focus:border-transparent"
                placeholder="Opening paragraph for your newsletter..."
              />
            </div>

            {/* Seasonal Services */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Seasonal Services</h2>
              <p className="text-sm text-gray-500 mb-4">
                Services to highlight this month (auto-generated based on season)
              </p>

              {sections.seasonal?.items?.length ? (
                <div className="space-y-3">
                  {sections.seasonal.items.map((item, index) => (
                    <div key={item.id || index} className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                      <span className="text-2xl">{item.icon}</span>
                      <div className="flex-1">
                        <p className="font-medium text-gray-900">{item.name}</p>
                        <p className="text-sm text-gray-600">{item.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 italic">No seasonal services added</p>
              )}
            </div>

            {/* Local Tip */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Local Tip</h2>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Headline
                  </label>
                  <input
                    type="text"
                    value={sections.local_tip?.headline || ''}
                    onChange={(e) => updateSection('local_tip', {
                      ...sections.local_tip,
                      headline: e.target.value,
                    })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-boerne-gold focus:border-transparent"
                    placeholder="Texas Homestead Exemption Deadline"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Content
                  </label>
                  <textarea
                    value={sections.local_tip?.text || ''}
                    onChange={(e) => updateSection('local_tip', {
                      ...sections.local_tip,
                      text: e.target.value,
                    })}
                    rows={3}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-boerne-gold focus:border-transparent"
                    placeholder="Helpful local information..."
                  />
                </div>
              </div>
            </div>

            {/* Events */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Upcoming Events</h2>

              {sections.events?.events?.length ? (
                <div className="space-y-2">
                  {sections.events.events.map((event, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div>
                        <p className="font-medium text-gray-900">{event.name}</p>
                        <p className="text-sm text-gray-500">{event.date} {event.location && `• ${event.location}`}</p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 italic">No events added</p>
              )}
            </div>
          </div>
        ) : (
          /* Preview Tab */
          <div className="max-w-2xl mx-auto">
            <div className="bg-white rounded-xl shadow-lg overflow-hidden">
              {/* Email Header Preview */}
              <div className="bg-gray-100 px-6 py-4 border-b">
                <p className="text-sm text-gray-500">Subject:</p>
                <p className="font-medium text-gray-900">{subjectLine || 'No subject line'}</p>
                {previewText && (
                  <p className="text-sm text-gray-500 mt-1">{previewText}</p>
                )}
              </div>

              {/* Email Body Preview */}
              <div className="p-6 space-y-6">
                {/* Logo */}
                <div className="text-center">
                  <div className="inline-block px-4 py-2 bg-boerne-navy text-boerne-gold font-bold rounded">
                    Boerne&apos;s Handy Hub
                  </div>
                </div>

                {/* Intro */}
                {sections.intro?.text && (
                  <div className="text-gray-700 whitespace-pre-wrap">
                    {sections.intro.text}
                  </div>
                )}

                {/* Seasonal Services */}
                {sections.seasonal?.items && sections.seasonal.items.length > 0 && (
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">
                      This Month&apos;s Home Care Focus
                    </h3>
                    <div className="grid sm:grid-cols-2 gap-3">
                      {sections.seasonal.items.map((item, i) => (
                        <div key={i} className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                          <span className="text-xl">{item.icon}</span>
                          <div>
                            <p className="font-medium text-gray-900">{item.name}</p>
                            <p className="text-sm text-gray-600">{item.description}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Local Tip */}
                {sections.local_tip?.headline && (
                  <div className="bg-boerne-gold/10 border-l-4 border-boerne-gold p-4 rounded-r-lg">
                    <h3 className="font-semibold text-gray-900">{sections.local_tip.headline}</h3>
                    <p className="text-gray-700 mt-1">{sections.local_tip.text}</p>
                  </div>
                )}

                {/* Events */}
                {sections.events?.events && sections.events.events.length > 0 && (
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">
                      Upcoming in Boerne
                    </h3>
                    <div className="space-y-2">
                      {sections.events.events.map((event, i) => (
                        <div key={i} className="flex items-center gap-3">
                          <span>&#128197;</span>
                          <div>
                            <p className="font-medium text-gray-900">{event.name}</p>
                            <p className="text-sm text-gray-500">{event.date}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Footer */}
                <div className="border-t pt-6 mt-8 text-center text-sm text-gray-500">
                  <p>Boerne&apos;s Handy Hub</p>
                  <p className="mt-2">
                    <a href="#" className="text-boerne-gold hover:underline">Unsubscribe</a>
                    {' • '}
                    <a href="#" className="text-boerne-gold hover:underline">View in browser</a>
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Test Email Modal */}
      {showTestModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Send Test Email</h3>
            <input
              type="email"
              value={testEmail}
              onChange={(e) => setTestEmail(e.target.value)}
              placeholder="your@email.com"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-boerne-gold focus:border-transparent mb-4"
            />
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => setShowTestModal(false)}
                className="px-4 py-2 text-gray-600 hover:text-gray-800"
              >
                Cancel
              </button>
              <button
                onClick={handleSendTest}
                disabled={sendingTest || !testEmail}
                className="px-4 py-2 bg-boerne-gold text-boerne-navy font-medium rounded-lg hover:bg-boerne-gold-alt transition-colors disabled:opacity-50"
              >
                {sendingTest ? 'Sending...' : 'Send Test'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Send to Subscribers Modal */}
      {showSendModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 max-w-lg w-full mx-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Send to Subscribers</h3>
            <p className="text-gray-600 text-sm mb-4">
              This will send the newsletter to all subscribers in the selected audience. This action cannot be undone.
            </p>

            {/* Audience Selection */}
            <div className="space-y-3 mb-6">
              <label className="block text-sm font-medium text-gray-700">Select Audience</label>

              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() => setSelectedAudience('all')}
                  disabled={!audienceConfig.all}
                  className={`p-4 border-2 rounded-lg text-left transition-colors ${
                    selectedAudience === 'all'
                      ? 'border-green-500 bg-green-50'
                      : 'border-gray-200 hover:border-gray-300'
                  } ${!audienceConfig.all ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  <div className="font-medium text-gray-900">All Subscribers</div>
                  <div className="text-sm text-gray-500">{audienceCounts.all} subscribers</div>
                  {!audienceConfig.all && (
                    <div className="text-xs text-red-500 mt-1">Not configured</div>
                  )}
                </button>

                <button
                  onClick={() => setSelectedAudience('homeowners')}
                  disabled={!audienceConfig.homeowners}
                  className={`p-4 border-2 rounded-lg text-left transition-colors ${
                    selectedAudience === 'homeowners'
                      ? 'border-green-500 bg-green-50'
                      : 'border-gray-200 hover:border-gray-300'
                  } ${!audienceConfig.homeowners ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  <div className="font-medium text-gray-900">Homeowners</div>
                  <div className="text-sm text-gray-500">{audienceCounts.homeowners} subscribers</div>
                  {!audienceConfig.homeowners && (
                    <div className="text-xs text-red-500 mt-1">Not configured</div>
                  )}
                </button>

                <button
                  onClick={() => setSelectedAudience('realtors')}
                  disabled={!audienceConfig.realtors}
                  className={`p-4 border-2 rounded-lg text-left transition-colors ${
                    selectedAudience === 'realtors'
                      ? 'border-green-500 bg-green-50'
                      : 'border-gray-200 hover:border-gray-300'
                  } ${!audienceConfig.realtors ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  <div className="font-medium text-gray-900">Realtors</div>
                  <div className="text-sm text-gray-500">{audienceCounts.realtors} subscribers</div>
                  {!audienceConfig.realtors && (
                    <div className="text-xs text-red-500 mt-1">Not configured</div>
                  )}
                </button>

                <button
                  onClick={() => setSelectedAudience('businesses')}
                  disabled={!audienceConfig.businesses}
                  className={`p-4 border-2 rounded-lg text-left transition-colors ${
                    selectedAudience === 'businesses'
                      ? 'border-green-500 bg-green-50'
                      : 'border-gray-200 hover:border-gray-300'
                  } ${!audienceConfig.businesses ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  <div className="font-medium text-gray-900">Businesses</div>
                  <div className="text-sm text-gray-500">{audienceCounts.businesses} subscribers</div>
                  {!audienceConfig.businesses && (
                    <div className="text-xs text-red-500 mt-1">Not configured</div>
                  )}
                </button>
              </div>
            </div>

            {/* Confirmation */}
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
              <div className="flex items-start gap-3">
                <svg className="w-5 h-5 text-yellow-600 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
                <div>
                  <p className="font-medium text-yellow-800">Are you sure?</p>
                  <p className="text-sm text-yellow-700 mt-1">
                    You are about to send &quot;{draft?.subject_line || draft?.title}&quot; to{' '}
                    <strong>{audienceCounts[selectedAudience]}</strong> {selectedAudience === 'all' ? 'subscribers' : selectedAudience}.
                  </p>
                </div>
              </div>
            </div>

            <div className="flex gap-3 justify-end">
              <button
                onClick={() => setShowSendModal(false)}
                className="px-4 py-2 text-gray-600 hover:text-gray-800"
              >
                Cancel
              </button>
              <button
                onClick={handleSendToSubscribers}
                disabled={sending || !audienceConfig[selectedAudience]}
                className="px-4 py-2 bg-green-600 text-white font-medium rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 flex items-center gap-2"
              >
                {sending ? (
                  <>
                    <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    Sending...
                  </>
                ) : (
                  <>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                    </svg>
                    Send Newsletter
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
