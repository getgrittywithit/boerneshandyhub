import { NextRequest, NextResponse } from 'next/server';

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

export async function POST(request: NextRequest) {
  try {
    const interviewData: BusinessInterviewData = await request.json();

    // Validate required fields
    if (!interviewData.businessId || !interviewData.responses) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Enhanced Bernie Profile Generation
    const enhancedProfile = await generateEnhancedBernieProfile(interviewData.responses);
    
    // In a real app, you'd save this to your database
    // For now, we'll just return the processed data
    const processedData = {
      ...interviewData,
      bernieProfile: enhancedProfile,
      completedAt: new Date(),
      status: 'completed'
    };

    // TODO: Save to database
    // await saveBusinessInterview(processedData);

    return NextResponse.json({
      success: true,
      data: processedData,
      message: 'Bernie has successfully learned about your business!'
    });

  } catch (error) {
    console.error('Business interview API error:', error);
    return NextResponse.json(
      { error: 'Failed to process business interview' },
      { status: 500 }
    );
  }
}

async function generateEnhancedBernieProfile(responses: InterviewResponse[]) {
  // Convert responses to a map for easy access
  const responseMap = responses.reduce((acc, r) => {
    acc[r.questionId] = r.response;
    return acc;
  }, {} as Record<string, string>);

  // Extract key information from responses
  const businessStory = responseMap.business_story || '';
  const servicesText = responseMap.services_specialty || '';
  const communityText = responseMap.community_involvement || '';
  const customerStory = responseMap.customer_story || '';
  const bernieRecommendation = responseMap.bernie_recommendation || '';
  const funFact = responseMap.fun_fact || '';

  // Parse specialties from the services response
  const specialties = extractSpecialties(servicesText);
  
  // Parse unique selling points
  const uniqueSellingPoints = extractUniquePoints(servicesText, bernieRecommendation);

  // Generate Bernie's personalized recommendation
  const personalizedRecommendation = generateBernieRecommendation({
    businessStory,
    specialties,
    communityText,
    customerStory,
    bernieRecommendation,
    funFact
  });

  return {
    businessStory: businessStory,
    specialties: specialties,
    communityInvolvement: communityText,
    ownerPersonality: extractPersonalityTraits(customerStory, businessStory),
    uniqueSellingPoints: uniqueSellingPoints,
    bernieRecommendation: personalizedRecommendation,
    funFacts: funFact,
    lastUpdated: new Date()
  };
}

function extractSpecialties(servicesText: string): string[] {
  // Simple extraction - in production, you might use NLP
  const keywords = servicesText.toLowerCase();
  const specialties: string[] = [];

  // Common service categories
  const serviceKeywords = {
    'food': ['restaurant', 'food', 'dining', 'cafe', 'bakery', 'catering'],
    'automotive': ['car', 'auto', 'mechanic', 'repair', 'tire', 'oil'],
    'health': ['doctor', 'dental', 'health', 'medical', 'wellness', 'therapy'],
    'home': ['plumbing', 'electrical', 'hvac', 'roofing', 'construction', 'handyman'],
    'retail': ['shop', 'store', 'boutique', 'goods', 'products', 'sales'],
    'professional': ['legal', 'accounting', 'consulting', 'real estate', 'insurance']
  };

  Object.entries(serviceKeywords).forEach(([category, words]) => {
    if (words.some(word => keywords.includes(word))) {
      specialties.push(category);
    }
  });

  // Also extract specific mentions
  const sentences = servicesText.split(/[.!?]/).map(s => s.trim()).filter(s => s.length > 0);
  specialties.push(...sentences.slice(0, 3)); // Take first 3 meaningful sentences

  return [...new Set(specialties)]; // Remove duplicates
}

function extractUniquePoints(servicesText: string, recommendationText: string): string[] {
  const combined = `${servicesText} ${recommendationText}`;
  const points: string[] = [];

  // Look for competitive advantages
  const advantageKeywords = ['unique', 'special', 'only', 'best', 'first', 'award', 'certified', 'experienced'];
  const sentences = combined.split(/[.!?]/).map(s => s.trim()).filter(s => s.length > 0);
  
  sentences.forEach(sentence => {
    if (advantageKeywords.some(keyword => sentence.toLowerCase().includes(keyword))) {
      points.push(sentence);
    }
  });

  return points.slice(0, 4); // Limit to top 4 points
}

function extractPersonalityTraits(customerStory: string, businessStory: string): string {
  const combined = `${customerStory} ${businessStory}`;
  
  // Simple personality extraction based on language used
  const traits: string[] = [];
  
  if (combined.toLowerCase().includes('family') || combined.toLowerCase().includes('personal')) {
    traits.push('family-oriented');
  }
  if (combined.toLowerCase().includes('community') || combined.toLowerCase().includes('local')) {
    traits.push('community-focused');
  }
  if (combined.toLowerCase().includes('quality') || combined.toLowerCase().includes('excellence')) {
    traits.push('quality-driven');
  }
  if (combined.toLowerCase().includes('friendly') || combined.toLowerCase().includes('welcoming')) {
    traits.push('welcoming');
  }

  return traits.join(', ') || 'dedicated professional';
}

function generateBernieRecommendation(data: {
  businessStory: string;
  specialties: string[];
  communityText: string;
  customerStory: string;
  bernieRecommendation: string;
  funFact: string;
}): string {
  // Generate Bernie's personalized way of recommending this business
  let recommendation = "This is a great local business ";

  // Add personality
  if (data.communityText.length > 0) {
    recommendation += "that's really involved in our Boerne community. ";
  }

  // Add what they do
  if (data.bernieRecommendation.length > 0) {
    recommendation += data.bernieRecommendation;
  } else if (data.businessStory.length > 0) {
    const story = data.businessStory.substring(0, 100) + "...";
    recommendation += story;
  }

  // Add Bernie's personal touch
  if (data.funFact.length > 0) {
    recommendation += ` Fun fact: ${data.funFact}`;
  }

  recommendation += " They're exactly the kind of folks that make Boerne special!";

  return recommendation;
}