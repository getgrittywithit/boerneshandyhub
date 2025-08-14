'use client';

import { useState } from 'react';
import BusinessInterview from '@/components/BusinessInterview';

interface OnboardingStep {
  id: string;
  title: string;
  description: string;
  completed: boolean;
}

export default function BusinessOnboarding() {
  const [currentStep, setCurrentStep] = useState<'welcome' | 'interview' | 'complete'>('welcome');
  const [businessId] = useState(() => `business_${Date.now()}`); // Generate temp ID

  const steps: OnboardingStep[] = [
    {
      id: 'welcome',
      title: 'Welcome to Boerne Handy Hub',
      description: 'Get your business verified and meet Bernie!',
      completed: currentStep !== 'welcome'
    },
    {
      id: 'interview',
      title: 'Chat with Bernie',
      description: 'Help Bernie get to know your business personally',
      completed: currentStep === 'complete'
    },
    {
      id: 'complete',
      title: 'All Set!',
      description: 'Your business profile is ready',
      completed: currentStep === 'complete'
    }
  ];

  const handleInterviewComplete = (interviewData: unknown) => {
    console.log('Interview completed:', interviewData);
    setCurrentStep('complete');
  };

  if (currentStep === 'welcome') {
    return (
      <div className="bg-boerne-light-gray min-h-screen">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-boerne-navy mb-4">
              Welcome to Boerne Handy Hub! 🤠
            </h1>
            <p className="text-xl text-boerne-dark-gray max-w-2xl mx-auto">
              Let&apos;s get your business set up and introduce you to Bernie, 
              our friendly AI mascot who knows everything about Boerne!
            </p>
          </div>

          {/* Progress Steps */}
          <div className="mb-12">
            <div className="flex justify-center">
              <div className="flex items-center space-x-8">
                {steps.map((step, index) => (
                  <div key={step.id} className="flex items-center">
                    <div className={`flex items-center justify-center w-10 h-10 rounded-full border-2 ${
                      step.completed 
                        ? 'bg-boerne-gold border-boerne-gold text-boerne-navy' 
                        : currentStep === step.id
                        ? 'border-boerne-gold text-boerne-gold'
                        : 'border-gray-300 text-gray-500'
                    }`}>
                      {step.completed ? '✓' : index + 1}
                    </div>
                    <div className="ml-3">
                      <p className={`text-sm font-medium ${
                        step.completed || currentStep === step.id ? 'text-boerne-navy' : 'text-gray-500'
                      }`}>
                        {step.title}
                      </p>
                      <p className="text-xs text-boerne-dark-gray">{step.description}</p>
                    </div>
                    {index < steps.length - 1 && (
                      <div className={`w-16 h-0.5 ml-8 ${
                        step.completed ? 'bg-boerne-gold' : 'bg-gray-300'
                      }`} />
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Welcome Content */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
            {/* What You'll Get */}
            <div className="bg-white rounded-lg shadow-lg p-6 border-l-4 border-boerne-gold">
              <h3 className="text-xl font-semibold text-boerne-navy mb-4">What You&apos;ll Get</h3>
              <ul className="space-y-3">
                <li className="flex items-start space-x-3">
                  <span className="text-boerne-gold text-lg">✅</span>
                  <div>
                    <p className="font-medium text-boerne-navy">Boerne Verified Badge</p>
                    <p className="text-sm text-boerne-dark-gray">Show customers you&apos;re locally verified</p>
                  </div>
                </li>
                <li className="flex items-start space-x-3">
                  <span className="text-boerne-gold text-lg">🤠</span>
                  <div>
                    <p className="font-medium text-boerne-navy">Personalized Bernie Profile</p>
                    <p className="text-sm text-boerne-dark-gray">Bernie learns your business story for perfect recommendations</p>
                  </div>
                </li>
                <li className="flex items-start space-x-3">
                  <span className="text-boerne-gold text-lg">📍</span>
                  <div>
                    <p className="font-medium text-boerne-navy">Enhanced Business Listing</p>
                    <p className="text-sm text-boerne-dark-gray">Update hours, photos, and business info</p>
                  </div>
                </li>
                <li className="flex items-start space-x-3">
                  <span className="text-boerne-gold text-lg">💬</span>
                  <div>
                    <p className="font-medium text-boerne-navy">Customer Engagement</p>
                    <p className="text-sm text-boerne-dark-gray">Respond to reviews and connect with customers</p>
                  </div>
                </li>
              </ul>
            </div>

            {/* Meet Bernie */}
            <div className="bg-white rounded-lg shadow-lg p-6 border-l-4 border-boerne-green">
              <h3 className="text-xl font-semibold text-boerne-navy mb-4">Meet Bernie! 🤠</h3>
              <div className="space-y-4">
                <p className="text-boerne-dark-gray">
                  Bernie is our friendly AI mascot who knows everything about Boerne 
                  (and yes, it&apos;s &quot;BURN-ee&quot; like Bernie Sanders, not &quot;BURN&quot; like a fire!).
                </p>
                <p className="text-boerne-dark-gray">
                  Bernie will chat with you to learn about your business, your story, 
                  and what makes you special in our community. This helps Bernie give 
                  personalized recommendations to folks looking for businesses like yours!
                </p>
                <div className="bg-boerne-light-gray p-4 rounded-lg">
                  <p className="text-sm text-boerne-navy italic">
                    &quot;Howdy! I can&apos;t wait to hear about your business and how you serve 
                    our wonderful Boerne community. Every business has a story, and I 
                    love learning them all!&quot; - Bernie 🤠
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Get Started Button */}
          <div className="text-center">
            <button
              onClick={() => setCurrentStep('interview')}
              className="px-8 py-4 bg-boerne-gold text-boerne-navy font-bold text-lg rounded-lg hover:bg-boerne-gold-alt transform hover:scale-105 transition-all duration-200 shadow-lg"
            >
              Let&apos;s Chat with Bernie! 🤠
            </button>
            <p className="text-sm text-boerne-dark-gray mt-3">
              Takes about 5 minutes • Completely free • You can edit anytime
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (currentStep === 'interview') {
    return (
      <div className="bg-boerne-light-gray min-h-screen">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-boerne-navy mb-2">
              Bernie wants to get to know you! 🤠
            </h1>
            <p className="text-boerne-dark-gray">
              This friendly chat helps Bernie understand your business so he can recommend you perfectly
            </p>
          </div>
          
          <BusinessInterview 
            businessId={businessId}
            onComplete={handleInterviewComplete}
          />
        </div>
      </div>
    );
  }

  // Complete step
  return (
    <div className="bg-boerne-light-gray min-h-screen">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center">
          <div className="mb-8">
            <div className="w-20 h-20 bg-boerne-gold rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-3xl">🎉</span>
            </div>
            <h1 className="text-4xl font-bold text-boerne-navy mb-4">
              Welcome to the Boerne Community! 🤠
            </h1>
            <p className="text-xl text-boerne-dark-gray max-w-2xl mx-auto">
              Bernie has learned all about your business and is excited to start 
              recommending you to folks in our community!
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            <div className="bg-white rounded-lg shadow-lg p-6 border-t-4 border-boerne-gold">
              <div className="text-2xl mb-3">✅</div>
              <h3 className="font-semibold text-boerne-navy mb-2">Verified & Ready</h3>
              <p className="text-sm text-boerne-dark-gray">
                Your business now has the Boerne Verified badge
              </p>
            </div>
            
            <div className="bg-white rounded-lg shadow-lg p-6 border-t-4 border-boerne-green">
              <div className="text-2xl mb-3">🤠</div>
              <h3 className="font-semibold text-boerne-navy mb-2">Bernie Knows You</h3>
              <p className="text-sm text-boerne-dark-gray">
                Bernie can now recommend your business with personal details
              </p>
            </div>
            
            <div className="bg-white rounded-lg shadow-lg p-6 border-t-4 border-boerne-light-blue">
              <div className="text-2xl mb-3">📈</div>
              <h3 className="font-semibold text-boerne-navy mb-2">Ready to Grow</h3>
              <p className="text-sm text-boerne-dark-gray">
                Start getting discovered by local customers
              </p>
            </div>
          </div>

          <div className="space-y-4">
            <button
              onClick={() => window.location.href = '/'}
              className="px-8 py-3 bg-boerne-navy text-white font-semibold rounded-lg hover:bg-opacity-90 transition-colors mx-2"
            >
              Explore Boerne Handy Hub
            </button>
            
            <button
              onClick={() => window.location.href = '/business/dashboard'}
              className="px-8 py-3 bg-boerne-gold text-boerne-navy font-semibold rounded-lg hover:bg-boerne-gold-alt transition-colors mx-2"
            >
              View Your Business Dashboard
            </button>
          </div>

          <div className="mt-8 p-4 bg-white rounded-lg border border-boerne-gold">
            <p className="text-sm text-boerne-dark-gray">
              <strong>What&apos;s Next?</strong> Bernie will start recommending your business immediately. 
              You can upgrade to premium features anytime for enhanced visibility and marketing tools.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}