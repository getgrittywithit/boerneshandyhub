'use client';

export default function WeddingVendorActions() {
  return (
    <div className="mt-6 space-y-3">
      <button
        onClick={() => {
          // Could open a modal or navigate to contact form
          alert('Contact form coming soon!');
        }}
        className="w-full px-4 py-2 bg-boerne-navy text-white font-semibold rounded-lg hover:bg-opacity-90 transition-colors"
      >
        📧 Send Message
      </button>

      <button
        onClick={() => {
          // Could open a quote request modal
          alert('Quote request form coming soon!');
        }}
        className="w-full px-4 py-2 border border-boerne-gold text-boerne-gold font-semibold rounded-lg hover:bg-boerne-gold hover:text-boerne-navy transition-colors"
      >
        📅 Request Quote
      </button>
    </div>
  );
}
