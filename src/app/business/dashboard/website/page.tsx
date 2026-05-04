'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useBusinessDashboard } from '../layout';
import {
  Globe,
  Clock,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  Edit3,
  QrCode,
  Copy,
  Check,
  Download,
  Loader2
} from 'lucide-react';
import type { Website } from '@/lib/websites/types';

type WebsiteWithStatus = Website & {
  status: 'draft' | 'pending_review' | 'changes_requested' | 'approved' | 'live' | 'flagged' | 'suspended' | 'archived';
};

const statusConfig = {
  draft: {
    label: 'Draft',
    color: 'bg-gray-100 text-gray-700',
    icon: Edit3,
    description: 'Continue setting up your website',
  },
  pending_review: {
    label: 'Pending Review',
    color: 'bg-yellow-100 text-yellow-700',
    icon: Clock,
    description: 'We\'re reviewing your submission (1-2 business days)',
  },
  changes_requested: {
    label: 'Changes Requested',
    color: 'bg-orange-100 text-orange-700',
    icon: AlertCircle,
    description: 'Please address the requested changes',
  },
  approved: {
    label: 'Approved',
    color: 'bg-green-100 text-green-700',
    icon: CheckCircle2,
    description: 'Your website is approved and going live soon',
  },
  live: {
    label: 'Live',
    color: 'bg-green-100 text-green-700',
    icon: Globe,
    description: 'Your website is live and visible to customers',
  },
  flagged: {
    label: 'Flagged',
    color: 'bg-red-100 text-red-700',
    icon: AlertCircle,
    description: 'Your website has been flagged for review',
  },
  suspended: {
    label: 'Suspended',
    color: 'bg-red-100 text-red-700',
    icon: AlertCircle,
    description: 'Your website has been suspended',
  },
  archived: {
    label: 'Archived',
    color: 'bg-gray-100 text-gray-500',
    icon: Clock,
    description: 'This website has been archived',
  },
};

export default function WebsiteDashboard() {
  const { business } = useBusinessDashboard();
  const [website, setWebsite] = useState<WebsiteWithStatus | null>(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);
  const [qrCodeUrl, setQrCodeUrl] = useState<string | null>(null);
  const [qrLoading, setQrLoading] = useState(false);
  const [downloading, setDownloading] = useState(false);

  useEffect(() => {
    if (business) {
      fetchWebsite();
    }
  }, [business]);

  const fetchWebsite = async () => {
    if (!business) return;

    try {
      const res = await fetch(`/api/websites?business_id=${business.id}`);
      if (res.ok) {
        const data = await res.json();
        setWebsite(data);

        // Fetch QR code if website is live
        if (data && data.status === 'live') {
          fetchQRCode(data.id);
        }
      }
    } catch (error) {
      console.error('Error fetching website:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchQRCode = async (websiteId: string) => {
    if (!business) return;

    setQrLoading(true);
    try {
      const res = await fetch(`/api/websites/qrcode?website_id=${websiteId}&business_id=${business.id}`);
      if (res.ok) {
        const data = await res.json();
        if (data.success && data.qrCode) {
          setQrCodeUrl(data.qrCode.dataUrl);
        }
      }
    } catch (error) {
      console.error('Error fetching QR code:', error);
    } finally {
      setQrLoading(false);
    }
  };

  const downloadQRCode = async () => {
    if (!website || !business) return;

    setDownloading(true);
    try {
      const res = await fetch(`/api/websites/qrcode?website_id=${website.id}&business_id=${business.id}&format=download`);
      if (res.ok) {
        const blob = await res.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${website.slug}-qrcode.png`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
      }
    } catch (error) {
      console.error('Error downloading QR code:', error);
    } finally {
      setDownloading(false);
    }
  };

  const copyUrl = async () => {
    if (!website) return;
    const url = `${window.location.origin}/site/${website.slug}`;
    await navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2 mb-8"></div>
          <div className="h-48 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  // Check eligibility (Verified tier or higher)
  const isEligible = ['verified', 'foundingpartner', 'founding_partner'].includes(
    business?.membership_tier?.toLowerCase() || ''
  );

  if (!isEligible) {
    return (
      <div className="p-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Your Website</h1>
        <p className="text-gray-600 mb-6">Create a professional business website</p>

        <div className="bg-white rounded-lg shadow-sm p-8 text-center">
          <Globe size={48} className="mx-auto text-gray-300 mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            Upgrade to Verified
          </h2>
          <p className="text-gray-600 mb-6 max-w-md mx-auto">
            Professional websites are included with the Verified tier. Upgrade to get
            your own branded website with a custom URL.
          </p>
          <Link
            href="/business/dashboard/settings"
            className="inline-flex items-center gap-2 px-6 py-3 bg-boerne-navy text-white rounded-lg hover:bg-boerne-navy/90"
          >
            Upgrade Your Tier
          </Link>
        </div>
      </div>
    );
  }

  if (!website) {
    return (
      <div className="p-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Your Website</h1>
        <p className="text-gray-600 mb-6">Create a professional business website</p>

        <div className="bg-white rounded-lg shadow-sm p-8 text-center">
          <Globe size={48} className="mx-auto text-boerne-gold mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            Create Your Website
          </h2>
          <p className="text-gray-600 mb-6 max-w-md mx-auto">
            Set up your professional business website in just a few minutes.
            It&apos;s included with your Verified membership!
          </p>
          <Link
            href="/business/dashboard/website/setup"
            className="inline-flex items-center gap-2 px-6 py-3 bg-boerne-navy text-white rounded-lg hover:bg-boerne-navy/90"
          >
            Get Started
          </Link>
        </div>
      </div>
    );
  }

  const status = statusConfig[website.status];
  const StatusIcon = status.icon;
  const siteUrl = `${typeof window !== 'undefined' ? window.location.origin : ''}/site/${website.slug}`;

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Your Website</h1>
          <p className="text-gray-600">Manage your professional business website</p>
        </div>
        {website.status === 'live' && (
          <a
            href={siteUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-4 py-2 bg-boerne-navy text-white rounded-lg hover:bg-boerne-navy/90"
          >
            <ExternalLink size={18} />
            View Live Site
          </a>
        )}
      </div>

      {/* Status Card */}
      <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
        <div className="flex items-start gap-4">
          <div className={`w-12 h-12 rounded-full flex items-center justify-center ${status.color}`}>
            <StatusIcon size={24} />
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-semibold text-gray-900">Status</h2>
              <span className={`px-2 py-0.5 rounded-full text-sm font-medium ${status.color}`}>
                {status.label}
              </span>
            </div>
            <p className="text-gray-600 mt-1">{status.description}</p>

            {website.status === 'changes_requested' && website.rejection_reason && (
              <div className="mt-4 p-4 bg-orange-50 border border-orange-200 rounded-lg">
                <p className="text-sm font-medium text-orange-800 mb-1">Changes Requested:</p>
                <p className="text-sm text-orange-700">{website.rejection_reason}</p>
                <Link
                  href="/business/dashboard/website/setup"
                  className="inline-flex items-center gap-1 text-sm font-medium text-orange-800 hover:underline mt-2"
                >
                  <Edit3 size={14} />
                  Edit Website
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Website Info */}
      {website.status === 'live' && (
        <div className="grid md:grid-cols-2 gap-6 mb-6">
          {/* URL Card */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="font-semibold text-gray-900 mb-3">Your Website URL</h3>
            <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg">
              <code className="flex-1 text-sm text-gray-700 truncate">{siteUrl}</code>
              <button
                onClick={copyUrl}
                className="p-2 text-gray-500 hover:text-gray-700"
                title="Copy URL"
              >
                {copied ? <Check size={18} className="text-green-500" /> : <Copy size={18} />}
              </button>
            </div>
          </div>

          {/* QR Code Card */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="font-semibold text-gray-900 mb-3">QR Code</h3>
            <div className="flex items-center gap-4">
              <div className="w-24 h-24 bg-gray-100 rounded-lg flex items-center justify-center overflow-hidden">
                {qrLoading ? (
                  <Loader2 size={24} className="text-gray-400 animate-spin" />
                ) : qrCodeUrl ? (
                  <Image
                    src={qrCodeUrl}
                    alt="Website QR Code"
                    width={96}
                    height={96}
                    className="w-full h-full object-contain"
                  />
                ) : (
                  <QrCode size={48} className="text-gray-400" />
                )}
              </div>
              <div>
                <p className="text-sm text-gray-600 mb-2">
                  Print this QR code on business cards, flyers, or your vehicle
                </p>
                <button
                  onClick={downloadQRCode}
                  disabled={downloading || !qrCodeUrl}
                  className="flex items-center gap-1 text-sm text-boerne-navy hover:underline disabled:opacity-50 disabled:no-underline"
                >
                  {downloading ? (
                    <>
                      <Loader2 size={14} className="animate-spin" />
                      Downloading...
                    </>
                  ) : (
                    <>
                      <Download size={14} />
                      Download QR Code
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Quick Stats (when live) */}
      {website.status === 'live' && (
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <h3 className="font-semibold text-gray-900 mb-4">Website Stats</h3>
          <div className="grid grid-cols-3 gap-6">
            <div className="text-center">
              <p className="text-3xl font-bold text-gray-900">--</p>
              <p className="text-sm text-gray-500">Page Views</p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-bold text-gray-900">--</p>
              <p className="text-sm text-gray-500">Phone Clicks</p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-bold text-gray-900">--</p>
              <p className="text-sm text-gray-500">Email Clicks</p>
            </div>
          </div>
          <p className="text-center text-sm text-gray-500 mt-4">
            Analytics will be available soon
          </p>
        </div>
      )}

      {/* Actions */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h3 className="font-semibold text-gray-900 mb-4">Actions</h3>
        <div className="flex flex-wrap gap-3">
          {['draft', 'changes_requested'].includes(website.status) && (
            <Link
              href="/business/dashboard/website/setup"
              className="flex items-center gap-2 px-4 py-2 bg-boerne-navy text-white rounded-lg hover:bg-boerne-navy/90"
            >
              <Edit3 size={18} />
              Continue Editing
            </Link>
          )}
          {website.status === 'live' && (
            <>
              <Link
                href="/business/dashboard/website/edit"
                className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                <Edit3 size={18} />
                Edit Website
              </Link>
              <a
                href={siteUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                <ExternalLink size={18} />
                Preview
              </a>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
