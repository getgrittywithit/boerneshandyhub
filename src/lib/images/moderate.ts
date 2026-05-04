import OpenAI from 'openai';

export interface ModerationResult {
  approved: boolean;
  score: number; // 0-100, higher = more likely appropriate
  categories: {
    inappropriate: boolean;
    violence: boolean;
    adult: boolean;
    spam: boolean;
    lowQuality: boolean;
  };
  reason?: string;
  flagReasons: string[];
}

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

/**
 * Moderate an image using OpenAI Vision API
 * @param imageUrl - Public URL or base64 data URL of the image
 * @returns Moderation result with approval status and categories
 */
export async function moderateImage(imageUrl: string): Promise<ModerationResult> {
  if (!process.env.OPENAI_API_KEY) {
    // If OpenAI is not configured, auto-approve but flag for manual review
    return {
      approved: true,
      score: 50,
      categories: {
        inappropriate: false,
        violence: false,
        adult: false,
        spam: false,
        lowQuality: false,
      },
      reason: 'Auto-approved: OpenAI moderation not configured',
      flagReasons: ['manual_review_needed'],
    };
  }

  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'user',
          content: [
            {
              type: 'text',
              text: `You are a content moderation system for a local home services business directory.

Analyze this image and determine if it's appropriate for a professional business website.

ACCEPTABLE content:
- Photos of completed work (plumbing, electrical, landscaping, etc.)
- Business logos
- Team/staff photos
- Equipment and tools
- Before/after project photos
- Business premises

UNACCEPTABLE content:
- Adult/sexual content
- Violence or gore
- Hate symbols
- Spam/advertising for other services
- Extremely low quality/blurry images
- Completely unrelated content (memes, random photos)

Respond in this exact JSON format:
{
  "appropriate": true/false,
  "confidence_score": 0-100,
  "categories": {
    "inappropriate": true/false,
    "violence": true/false,
    "adult": true/false,
    "spam": true/false,
    "low_quality": true/false
  },
  "reason": "Brief explanation if flagged",
  "flag_reasons": ["list", "of", "specific", "concerns"]
}`,
            },
            {
              type: 'image_url',
              image_url: {
                url: imageUrl,
                detail: 'low', // Use low detail for faster/cheaper moderation
              },
            },
          ],
        },
      ],
      response_format: { type: 'json_object' },
      max_tokens: 300,
    });

    const content = response.choices[0]?.message?.content;
    if (!content) {
      throw new Error('No response from moderation API');
    }

    const result = JSON.parse(content) as {
      appropriate: boolean;
      confidence_score: number;
      categories: {
        inappropriate: boolean;
        violence: boolean;
        adult: boolean;
        spam: boolean;
        low_quality: boolean;
      };
      reason?: string;
      flag_reasons: string[];
    };

    return {
      approved: result.appropriate && result.confidence_score >= 70,
      score: result.confidence_score,
      categories: {
        inappropriate: result.categories.inappropriate,
        violence: result.categories.violence,
        adult: result.categories.adult,
        spam: result.categories.spam,
        lowQuality: result.categories.low_quality,
      },
      reason: result.reason,
      flagReasons: result.flag_reasons || [],
    };
  } catch (error) {
    console.error('Image moderation error:', error);

    // On error, queue for manual review but don't block
    return {
      approved: false,
      score: 0,
      categories: {
        inappropriate: false,
        violence: false,
        adult: false,
        spam: false,
        lowQuality: false,
      },
      reason: 'Moderation failed - queued for manual review',
      flagReasons: ['moderation_error', 'manual_review_needed'],
    };
  }
}

/**
 * Convert a buffer to a base64 data URL for moderation
 */
export function bufferToDataUrl(buffer: Buffer, mimeType: string): string {
  const base64 = buffer.toString('base64');
  return `data:${mimeType};base64,${base64}`;
}
