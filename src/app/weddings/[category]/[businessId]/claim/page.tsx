'use client';

import { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';

interface ClaimFormData {
  claimerName: string;
  claimerEmail: string;
  claimerPhone: string;
  businessRole: 'owner' | 'manager' | 'employee';
  additionalInfo: string;
  verificationDocs: File[];
}

export default function ClaimBusinessPage() {
  const params = useParams();
  const router = useRouter();
  const { category, businessId } = params;
  
  const [formData, setFormData] = useState<ClaimFormData>({
    claimerName: '',
    claimerEmail: '',
    claimerPhone: '',
    businessRole: 'owner',
    additionalInfo: '',
    verificationDocs: []
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFormData(prev => ({
        ...prev,
        verificationDocs: Array.from(e.target.files!)
      }));
    }
  };

  const uploadFiles = async (files: File[]): Promise<string[]> => {
    // TODO: Implement file upload to cloud storage
    // For now, return mock URLs
    return files.map(file => `https://storage.example.com/claims/${Date.now()}-${file.name}`);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMessage('');

    try {
      // Upload verification documents
      const docUrls = await uploadFiles(formData.verificationDocs);

      const response = await fetch('/api/business/claim', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          businessId,
          claimerEmail: formData.claimerEmail,
          claimerName: formData.claimerName,
          claimerPhone: formData.claimerPhone,
          businessRole: formData.businessRole,
          verificationDocs: docUrls,
          additionalInfo: formData.additionalInfo
        })
      });

      const result = await response.json();

      if (result.success) {
        setSubmitStatus('success');
      } else {
        setSubmitStatus('error');
        setErrorMessage(result.error || 'Failed to submit claim');
      }

    } catch (error) {
      setSubmitStatus('error');
      setErrorMessage('Network error. Please try again.');
      console.error('Claim submission error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (submitStatus === 'success') {
    return (
      <div className="bg-boerne-light-gray min-h-screen py-12">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-lg shadow-lg p-8 text-center">
            <div className="text-6xl mb-4">✅</div>
            <h1 className="text-3xl font-bold text-boerne-navy mb-4">
              Claim Submitted Successfully!
            </h1>
            <p className="text-lg text-boerne-dark-gray mb-6">
              Thank you for claiming your business listing. We'll review your submission and contact you within 2-3 business days to verify your claim.
            </p>
            <div className="bg-boerne-light-gray p-4 rounded-lg mb-6">
              <h3 className="font-semibold text-boerne-navy mb-2">What happens next?</h3>
              <ul className="text-sm text-boerne-dark-gray text-left space-y-1">
                <li>📧 Email confirmation sent to your provided email</li>
                <li>📞 Our team will call to verify business ownership</li>
                <li>📄 Document review (business license, etc.)</li>
                <li>✅ Account activation upon successful verification</li>
              </ul>
            </div>
            <button
              onClick={() => router.push(`/weddings/${category}`)}
              className="px-6 py-3 bg-boerne-gold text-boerne-navy font-semibold rounded-lg hover:bg-boerne-gold-alt transition-colors"
            >
              Return to {category} Directory
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-boerne-light-gray min-h-screen py-12">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-boerne-navy mb-4">
              🏢 Claim Your Business Listing
            </h1>
            <p className="text-lg text-boerne-dark-gray">
              Claim and verify your business to unlock enhanced listing features and manage your presence on Boerne Handy Hub.
            </p>
          </div>

          {submitStatus === 'error' && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
              <p className="font-medium">Claim submission failed</p>
              <p className="text-sm">{errorMessage}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="claimerName" className="block text-sm font-medium text-boerne-dark-gray mb-2">
                  Your Full Name *
                </label>
                <input
                  type="text"
                  id="claimerName"
                  name="claimerName"
                  value={formData.claimerName}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-boerne-gold focus:border-transparent"
                  placeholder="John Smith"
                />
              </div>

              <div>
                <label htmlFor="claimerEmail" className="block text-sm font-medium text-boerne-dark-gray mb-2">
                  Email Address *
                </label>
                <input
                  type="email"
                  id="claimerEmail"
                  name="claimerEmail"
                  value={formData.claimerEmail}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-boerne-gold focus:border-transparent"
                  placeholder="john@business.com"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="claimerPhone" className="block text-sm font-medium text-boerne-dark-gray mb-2">
                  Phone Number *
                </label>
                <input
                  type="tel"
                  id="claimerPhone"
                  name="claimerPhone"
                  value={formData.claimerPhone}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-boerne-gold focus:border-transparent"
                  placeholder="(830) 555-0123"
                />
              </div>

              <div>
                <label htmlFor="businessRole" className="block text-sm font-medium text-boerne-dark-gray mb-2">
                  Your Role *
                </label>
                <select
                  id="businessRole"
                  name="businessRole"
                  value={formData.businessRole}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-boerne-gold focus:border-transparent"
                >
                  <option value="owner">Business Owner</option>
                  <option value="manager">Manager</option>
                  <option value="employee">Authorized Employee</option>
                </select>
              </div>
            </div>

            <div>
              <label htmlFor="verificationDocs" className="block text-sm font-medium text-boerne-dark-gray mb-2">
                Verification Documents *
              </label>
              <input
                type="file"
                id="verificationDocs"
                onChange={handleFileChange}
                multiple
                accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-boerne-gold focus:border-transparent"
              />
              <p className="text-xs text-boerne-dark-gray mt-1">
                Please upload: Business license, EIN certificate, utility bill, or other proof of business ownership
              </p>
            </div>

            <div>
              <label htmlFor="additionalInfo" className="block text-sm font-medium text-boerne-dark-gray mb-2">
                Additional Information
              </label>
              <textarea
                id="additionalInfo"
                name="additionalInfo"
                value={formData.additionalInfo}
                onChange={handleInputChange}
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-boerne-gold focus:border-transparent"
                placeholder="Any additional information to help us verify your claim..."
              />
            </div>

            <div className="bg-boerne-light-gray p-4 rounded-lg">
              <h4 className="font-semibold text-boerne-navy mb-2">Verification Process:</h4>
              <ul className="text-sm text-boerne-dark-gray space-y-1">
                <li>✅ Document review (1-2 business days)</li>
                <li>✅ Phone verification call</li>
                <li>✅ Email confirmation</li>
                <li>✅ Postal verification (if needed)</li>
              </ul>
            </div>

            <div className="flex gap-4">
              <button
                type="button"
                onClick={() => router.back()}
                className="flex-1 px-6 py-3 border border-boerne-dark-gray text-boerne-dark-gray font-semibold rounded-lg hover:bg-boerne-light-gray transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex-1 px-6 py-3 bg-boerne-gold text-boerne-navy font-semibold rounded-lg hover:bg-boerne-gold-alt transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? 'Submitting...' : 'Submit Claim'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}