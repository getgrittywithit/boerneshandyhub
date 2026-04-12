// Bernie AI search helper functions
export async function searchBusinessesForBernie(userQuery: string, limit: number = 5) {
  try {
    const response = await fetch(`/api/search?q=${encodeURIComponent(userQuery)}&limit=${limit}`);
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.error || 'Search failed');
    }

    return formatResultsForBernie(data.results, userQuery);
  } catch (error) {
    console.error('Bernie search error:', error);
    return 'I apologize, but I encountered an error while searching for businesses. Please try again.';
  }
}

interface BusinessResult {
  name: string;
  description?: string;
  phone: string;
  rating?: number;
  website?: string;
  membership_tier: string;
}

function formatResultsForBernie(businesses: BusinessResult[], query: string): string {
  if (!businesses || businesses.length === 0) {
    return `I couldn't find any businesses matching "${query}". You might want to try different keywords or browse our categories directly.`;
  }

  const topResults = businesses.slice(0, 5);
  let response = `I found ${businesses.length} businesses for "${query}". Here are the top matches:\n\n`;

  topResults.forEach((business, index) => {
    const tierEmoji: Record<string, string> = {
      'elite': '⭐️',
      'premium': '💎',
      'verified': '✅',
      'basic': '📍'
    };

    response += `${index + 1}. ${tierEmoji[business.membership_tier] || '📍'} **${business.name}**\n`;
    response += `   ${business.description ? business.description.substring(0, 100) + '...' : ''}\n`;
    response += `   📞 ${business.phone} | ⭐ ${business.rating || 'New'}\n`;
    
    if (business.website) {
      response += `   🌐 ${business.website}\n`;
    }
    
    response += '\n';
  });

  if (businesses.length > 5) {
    response += `... and ${businesses.length - 5} more results. Would you like me to show more or help you narrow down your search?`;
  }

  return response;
}

// Extract keywords from user query for Bernie
export function extractSearchKeywords(userQuery: string): string[] {
  // Simple keyword extraction - can be enhanced with NLP
  const stopWords = ['the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of', 'with', 'by', 'i', 'need', 'want', 'looking', 'find', 'good', 'best'];
  
  return userQuery.toLowerCase()
    .split(/\s+/)
    .filter(word => word.length > 2 && !stopWords.includes(word))
    .slice(0, 5); // Limit to 5 keywords
}

// Suggest keywords for businesses based on their category
export function suggestKeywords(category: string): string[] {
  const keywordSuggestions: { [key: string]: string[] } = {
    'plumbing': ['plumber', 'drain cleaning', 'water heater', 'leak repair', 'emergency', 'licensed', 'residential', 'commercial'],
    'electrical': ['electrician', 'wiring', 'panel upgrade', 'lighting', 'emergency', 'licensed', 'residential', 'commercial'],
    'hvac': ['air conditioning', 'heating', 'AC repair', 'furnace', 'installation', 'maintenance', 'licensed', 'emergency'],
    'landscaping': ['lawn care', 'mowing', 'tree trimming', 'irrigation', 'design', 'maintenance', 'xeriscaping', 'native plants'],
    'handyman': ['repairs', 'maintenance', 'carpentry', 'drywall', 'painting', 'assembly', 'honey-do list', 'odd jobs'],
    'roofing': ['roof repair', 'replacement', 'inspection', 'shingles', 'metal roof', 'storm damage', 'licensed', 'insured'],
    'pest-control': ['exterminator', 'termites', 'ants', 'rodents', 'mosquitoes', 'scorpions', 'prevention', 'treatment'],
    'cleaning': ['house cleaning', 'deep clean', 'move-out', 'recurring', 'commercial', 'residential', 'eco-friendly'],
  };

  return keywordSuggestions[category.toLowerCase()] || [];
}