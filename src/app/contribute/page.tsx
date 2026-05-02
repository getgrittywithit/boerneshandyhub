import type { Metadata } from 'next';
import { Suspense } from 'react';
import Link from 'next/link';
import ContributeRouter from '@/components/community/ContributeRouter';

export const metadata: Metadata = {
  title: "Contribute | Boerne's Handy Hub",
  description:
    'Share your photos, stories, and local tips with the Boerne community. Help us capture the history and spirit of our town.',
  openGraph: {
    title: "Contribute to Boerne's Handy Hub",
    description:
      'Share your photos, stories, and local tips with the Boerne community.',
  },
};

interface PageProps {
  searchParams: Promise<{ type?: string; target?: string }>;
}

export default async function ContributePage({ searchParams }: PageProps) {
  const params = await searchParams;
  const targetCategory = params.target;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-boerne-navy text-white">
        <div className="max-w-4xl mx-auto px-4 py-12 text-center">
          <h1 className="text-3xl md:text-4xl font-bold mb-4">
            Boerne by the people who live here
          </h1>
          <p className="text-lg text-white/80 max-w-2xl mx-auto">
            Share your photos, memories, and local knowledge. Your contributions
            help tell the story of our community.
          </p>
        </div>
      </div>

      {/* Main content */}
      <div className="max-w-4xl mx-auto px-4 py-8">
        <Suspense
          fallback={
            <div className="text-center py-12 text-gray-500">Loading...</div>
          }
        >
          <ContributeRouter targetCategory={targetCategory} />
        </Suspense>

        {/* Info cards */}
        <div className="mt-12 grid md:grid-cols-3 gap-6">
          <div className="bg-white rounded-xl border border-gray-200 p-5">
            <div className="text-2xl mb-2">🔒</div>
            <h3 className="font-semibold text-gray-900 mb-1">Your privacy</h3>
            <p className="text-sm text-gray-600">
              Your email is never shared publicly. You control how your name
              appears on submissions.
            </p>
          </div>
          <div className="bg-white rounded-xl border border-gray-200 p-5">
            <div className="text-2xl mb-2">👀</div>
            <h3 className="font-semibold text-gray-900 mb-1">Human reviewed</h3>
            <p className="text-sm text-gray-600">
              Every submission is reviewed by our team before going live — usually
              within 48 hours.
            </p>
          </div>
          <div className="bg-white rounded-xl border border-gray-200 p-5">
            <div className="text-2xl mb-2">✨</div>
            <h3 className="font-semibold text-gray-900 mb-1">You stay in control</h3>
            <p className="text-sm text-gray-600">
              You can request removal of your content at any time by emailing us.
            </p>
          </div>
        </div>

        {/* FAQ */}
        <div className="mt-12 bg-white rounded-xl border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Questions?
          </h2>
          <div className="space-y-4 text-sm">
            <div>
              <h4 className="font-medium text-gray-900">
                What happens after I submit?
              </h4>
              <p className="text-gray-600 mt-1">
                We review every submission within 48 hours. If approved, it goes
                live on the site and you&apos;ll get an email with the link. If we have
                questions, we&apos;ll reach out.
              </p>
            </div>
            <div>
              <h4 className="font-medium text-gray-900">
                Can I submit historic photos I didn&apos;t take?
              </h4>
              <p className="text-gray-600 mt-1">
                Yes, if you have permission from the original photographer or the
                photo is in the public domain. Please note this in your submission.
              </p>
            </div>
            <div>
              <h4 className="font-medium text-gray-900">
                How do I remove something I submitted?
              </h4>
              <p className="text-gray-600 mt-1">
                Email us at{' '}
                <a
                  href="mailto:hello@boerneshandyhub.com"
                  className="text-boerne-gold hover:underline"
                >
                  hello@boerneshandyhub.com
                </a>{' '}
                with &quot;Removal Request&quot; in the subject line.
              </p>
            </div>
          </div>
        </div>

        {/* Footer link */}
        <div className="mt-8 text-center">
          <Link
            href="/"
            className="text-gray-500 hover:text-gray-700 text-sm transition-colors"
          >
            ← Back to Boerne&apos;s Handy Hub
          </Link>
        </div>
      </div>
    </div>
  );
}
