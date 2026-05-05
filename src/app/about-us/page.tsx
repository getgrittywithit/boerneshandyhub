import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: "About Boerne's Handy Hub | Built by Neighbors, for Neighbors",
  description: "Boerne's Handy Hub was created by local residents to help neighbors find trusted service providers. Learn about our mission to build the community resource Boerne deserves.",
  openGraph: {
    title: "About Boerne's Handy Hub | Built by Neighbors, for Neighbors",
    description: "Created by Boerne residents to help neighbors find trusted service providers and feel at home in the Hill Country.",
    type: 'website',
  },
};

export default function AboutUsPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero */}
      <section className="bg-boerne-navy text-white py-20">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <p className="text-boerne-gold font-medium mb-4">About the Hub</p>
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            Built by Neighbors,<br />for Neighbors
          </h1>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            We're building the local resource we wish existed when we moved to Boerne.
          </p>
        </div>
      </section>

      {/* Origin Story */}
      <section className="py-16">
        <div className="max-w-3xl mx-auto px-4">
          <div className="bg-white rounded-2xl shadow-lg p-8 md:p-12">
            <h2 className="text-2xl font-bold text-boerne-navy mb-6">
              Why We Built This
            </h2>
            <div className="prose prose-lg text-gray-700 space-y-4">
              <p>
                If you've ever posted "Who's a good plumber?" in a Boerne Facebook group,
                you know the drill. You get 47 different answers, half are outdated, some
                are from people who've never actually used the service, and you're still
                not sure who to call.
              </p>
              <p>
                <strong>We got tired of that.</strong>
              </p>
              <p>
                Boerne's Handy Hub started as a simple idea: what if there was one place
                where Boerne residents could find trusted local service providers? Not
                paid ads disguised as recommendations. Not national chains with 1-800
                numbers. Just real local businesses that your neighbors actually use and trust.
              </p>
              <p>
                We're Boerne residents building the resource we wish existed when we first
                moved here. Every guide, every tip, every recommendation comes from people
                who live here and genuinely want to help newcomers feel at home in the
                Hill Country.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-16 bg-white">
        <div className="max-w-5xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-boerne-navy text-center mb-12">
            What We Believe
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-boerne-gold/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl">🤝</span>
              </div>
              <h3 className="text-xl font-semibold text-boerne-navy mb-3">
                Neighbors Helping Neighbors
              </h3>
              <p className="text-gray-600">
                The best recommendations come from people who actually live here.
                We prioritize real community knowledge over paid placements.
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-boerne-gold/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl">🏠</span>
              </div>
              <h3 className="text-xl font-semibold text-boerne-navy mb-3">
                Local First
              </h3>
              <p className="text-gray-600">
                We champion Boerne-based businesses and service providers.
                Supporting local keeps our community strong.
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-boerne-gold/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl">💛</span>
              </div>
              <h3 className="text-xl font-semibold text-boerne-navy mb-3">
                Made with Love
              </h3>
              <p className="text-gray-600">
                This isn't a corporate project. It's a labor of love from people
                who genuinely care about making Boerne better.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* What We Offer */}
      <section className="py-16">
        <div className="max-w-5xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-boerne-navy text-center mb-12">
            What You'll Find Here
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
              <div className="flex items-start gap-4">
                <span className="text-2xl">🔧</span>
                <div>
                  <h3 className="font-semibold text-boerne-navy mb-2">
                    Trusted Service Providers
                  </h3>
                  <p className="text-gray-600 text-sm">
                    Plumbers, electricians, HVAC techs, contractors, and more.
                    All local. All vetted by the community.
                  </p>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
              <div className="flex items-start gap-4">
                <span className="text-2xl">📚</span>
                <div>
                  <h3 className="font-semibold text-boerne-navy mb-2">
                    Free Homeowner Guides
                  </h3>
                  <p className="text-gray-600 text-sm">
                    From seasonal maintenance checklists to emergency prep,
                    everything you need to care for your Hill Country home.
                  </p>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
              <div className="flex items-start gap-4">
                <span className="text-2xl">📷</span>
                <div>
                  <h3 className="font-semibold text-boerne-navy mb-2">
                    Community Stories & Photos
                  </h3>
                  <p className="text-gray-600 text-sm">
                    Old photos, local history, and memories shared by
                    long-time residents. Preserving Boerne's story together.
                  </p>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
              <div className="flex items-start gap-4">
                <span className="text-2xl">🗺️</span>
                <div>
                  <h3 className="font-semibold text-boerne-navy mb-2">
                    New Resident Resources
                  </h3>
                  <p className="text-gray-600 text-sm">
                    Moving to Boerne? We've got guides for utilities, schools,
                    neighborhoods, and everything else newcomers need.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Community Stats (placeholder for future) */}
      <section className="py-16 bg-boerne-navy text-white">
        <div className="max-w-5xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">
            Growing Together
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold text-boerne-gold mb-2">200+</div>
              <div className="text-gray-300 text-sm">Local Businesses</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-boerne-gold mb-2">50+</div>
              <div className="text-gray-300 text-sm">Service Categories</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-boerne-gold mb-2">Free</div>
              <div className="text-gray-300 text-sm">Guides & Resources</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-boerne-gold mb-2">100%</div>
              <div className="text-gray-300 text-sm">Community Driven</div>
            </div>
          </div>
        </div>
      </section>

      {/* How to Contribute */}
      <section className="py-16">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-boerne-navy mb-6">
            Help Us Build This Together
          </h2>
          <p className="text-lg text-gray-600 mb-8">
            The best community resources are built by the community.
            Share your knowledge, your photos, your stories.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/contribute"
              className="px-8 py-4 bg-boerne-gold text-boerne-navy font-semibold rounded-lg hover:bg-boerne-gold-alt transition-colors"
            >
              Share Something
            </Link>
            <Link
              href="/business"
              className="px-8 py-4 bg-white text-boerne-navy font-semibold rounded-lg border-2 border-boerne-navy hover:bg-gray-50 transition-colors"
            >
              List Your Business
            </Link>
          </div>
        </div>
      </section>

      {/* Contact */}
      <section className="py-16 bg-gray-100">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <h2 className="text-2xl font-bold text-boerne-navy mb-4">
            Questions or Ideas?
          </h2>
          <p className="text-gray-600 mb-6">
            We'd love to hear from you. Whether it's feedback, a correction,
            or just to say hi - we're all ears.
          </p>
          <Link
            href="/contribute?type=feedback"
            className="text-boerne-gold font-semibold hover:underline"
          >
            Send us a message →
          </Link>
        </div>
      </section>

      {/* Footer tagline */}
      <section className="py-8 bg-boerne-navy text-center">
        <p className="text-white/70 text-sm">
          Made with 💛 in Boerne, Texas
        </p>
      </section>
    </div>
  );
}
