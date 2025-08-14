'use client';

import { useState } from 'react';

interface InterviewQuestion {
  id: string;
  question: string;
  followUp?: string;
  category: 'background' | 'services' | 'community' | 'personality' | 'story';
}

interface InterviewResponse {
  questionId: string;
  response: string;
}

interface BusinessInterviewData {
  businessId: string;
  responses: InterviewResponse[];
  completedAt?: Date;
  bernieProfile?: {
    businessStory: string;
    specialties: string[];
    communityInvolvement: string;
    ownerPersonality: string;
    uniqueSellingPoints: string[];
    bernieRecommendation: string;
  };
}

const interviewQuestions: InterviewQuestion[] = [
  {
    id: 'business_story',
    question: "Hey there! I'm Bernie, and I love getting to know the folks who make Boerne special. Tell me about your business - what's your story?",
    followUp: "What inspired you to start this business in our community?",
    category: 'background'
  },
  {
    id: 'time_in_boerne',
    question: "How long have you been serving our Boerne community? Any fun memories from your early days?",
    category: 'background'
  },
  {
    id: 'services_specialty',
    question: "What services or products are you most proud of? What makes you special in Boerne?",
    followUp: "Is there something unique that sets you apart from others?",
    category: 'services'
  },
  {
    id: 'community_involvement',
    question: "I love hearing about how businesses give back! Are you involved in any local events, sponsorships, or community activities?",
    category: 'community'
  },
  {
    id: 'customer_story',
    question: "Do you have a favorite customer story or a moment that really made you proud to serve Boerne?",
    category: 'story'
  },
  {
    id: 'bernie_recommendation',
    question: "If someone asked me about your business, what would you want Bernie to tell them? What's the one thing you'd want everyone in Boerne to know?",
    category: 'personality'
  },
  {
    id: 'fun_fact',
    question: "Last one! Any fun facts about your business, hidden talents, or quirky stories that make you uniquely Boerne?",
    category: 'personality'
  }
];

export default function BusinessInterview({ businessId, onComplete }: { 
  businessId: string; 
  onComplete: (data: BusinessInterviewData) => void;
}) {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [responses, setResponses] = useState<InterviewResponse[]>([]);
  const [currentResponse, setCurrentResponse] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const currentQuestion = interviewQuestions[currentQuestionIndex];
  const isLastQuestion = currentQuestionIndex === interviewQuestions.length - 1;
  const progress = ((currentQuestionIndex + 1) / interviewQuestions.length) * 100;

  const handleNext = () => {
    if (!currentResponse.trim()) return;

    const newResponse: InterviewResponse = {
      questionId: currentQuestion.id,
      response: currentResponse.trim()
    };

    const updatedResponses = [...responses, newResponse];
    setResponses(updatedResponses);
    setCurrentResponse('');

    if (isLastQuestion) {
      // Complete the interview
      completeInterview(updatedResponses);
    } else {
      setCurrentQuestionIndex(prev => prev + 1);
    }
  };

  const handleBack = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1);
      // Restore previous response
      const previousResponse = responses[currentQuestionIndex - 1];
      if (previousResponse) {
        setCurrentResponse(previousResponse.response);
        setResponses(prev => prev.slice(0, -1));
      }
    }
  };

  const completeInterview = async (finalResponses: InterviewResponse[]) => {
    setIsSubmitting(true);
    
    try {
      // Generate Bernie's business profile based on responses
      const bernieProfile = await generateBernieProfile(finalResponses);
      
      const interviewData: BusinessInterviewData = {
        businessId,
        responses: finalResponses,
        completedAt: new Date(),
        bernieProfile
      };

      // Save to backend
      await fetch('/api/business/interview', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(interviewData)
      });

      onComplete(interviewData);
    } catch (error) {
      console.error('Failed to complete interview:', error);
      alert('Something went wrong saving your interview. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const generateBernieProfile = async (responses: InterviewResponse[]) => {
    // This would call an AI service to generate Bernie's personalized business profile
    // For now, we'll create a basic profile from the responses
    
    const responseMap = responses.reduce((acc, r) => {
      acc[r.questionId] = r.response;
      return acc;
    }, {} as Record<string, string>);

    return {
      businessStory: responseMap.business_story || '',
      specialties: responseMap.services_specialty?.split(',').map(s => s.trim()) || [],
      communityInvolvement: responseMap.community_involvement || '',
      ownerPersonality: responseMap.customer_story || '',
      uniqueSellingPoints: responseMap.services_specialty?.split('.').map(s => s.trim()) || [],
      bernieRecommendation: responseMap.bernie_recommendation || ''
    };
  };

  if (isSubmitting) {
    return (
      <div className="max-w-2xl mx-auto p-8 bg-white rounded-lg shadow-lg border-2 border-boerne-gold">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-boerne-gold mx-auto mb-4"></div>
          <h3 className="text-xl font-semibold text-boerne-navy mb-2">Bernie is getting to know your business...</h3>
          <p className="text-boerne-dark-gray">Creating your personalized business profile!</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-lg border-2 border-boerne-gold">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <span className="text-2xl">🤠</span>
            <h2 className="text-2xl font-bold text-boerne-navy">Chat with Bernie</h2>
          </div>
          <div className="text-sm text-boerne-dark-gray">
            Question {currentQuestionIndex + 1} of {interviewQuestions.length}
          </div>
        </div>
        
        {/* Progress Bar */}
        <div className="w-full bg-boerne-light-gray rounded-full h-2 mb-4">
          <div 
            className="bg-boerne-gold h-2 rounded-full transition-all duration-300 ease-out"
            style={{ width: `${progress}%` }}
          ></div>
        </div>
      </div>

      {/* Question */}
      <div className="mb-6">
        <div className="bg-boerne-light-gray p-4 rounded-lg border-l-4 border-boerne-gold mb-4">
          <div className="flex items-start space-x-3">
            <span className="text-2xl mt-1">🤠</span>
            <div>
              <p className="text-boerne-dark-gray font-medium">Bernie says:</p>
              <p className="text-boerne-navy mt-1">{currentQuestion.question}</p>
              {currentQuestion.followUp && (
                <p className="text-boerne-dark-gray text-sm mt-2 italic">
                  {currentQuestion.followUp}
                </p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Response Input */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-boerne-dark-gray mb-2">
          Your Response:
        </label>
        <textarea
          value={currentResponse}
          onChange={(e) => setCurrentResponse(e.target.value)}
          placeholder="Tell Bernie about your business..."
          rows={4}
          className="w-full px-3 py-2 border border-boerne-light-blue rounded-md focus:ring-2 focus:ring-boerne-gold focus:border-boerne-gold resize-none"
        />
        <p className="text-xs text-boerne-dark-gray mt-1">
          Take your time - Bernie loves hearing the details!
        </p>
      </div>

      {/* Navigation Buttons */}
      <div className="flex justify-between">
        <button
          onClick={handleBack}
          disabled={currentQuestionIndex === 0}
          className="px-4 py-2 text-boerne-dark-gray border border-boerne-light-blue rounded-md hover:bg-boerne-light-gray disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          ← Back
        </button>
        
        <button
          onClick={handleNext}
          disabled={!currentResponse.trim()}
          className="px-6 py-2 bg-boerne-gold text-boerne-navy font-semibold rounded-md hover:bg-boerne-gold-alt disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {isLastQuestion ? 'Complete Interview' : 'Next Question'} →
        </button>
      </div>

      {/* Encouragement */}
      <div className="mt-6 p-3 bg-gradient-to-r from-boerne-light-gray to-boerne-light-gray rounded-md border border-boerne-gold">
        <p className="text-xs text-boerne-dark-gray text-center">
          💡 <strong>Why this matters:</strong> Bernie uses these insights to give personalized recommendations 
          to folks looking for businesses like yours in Boerne!
        </p>
      </div>
    </div>
  );
}