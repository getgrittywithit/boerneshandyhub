import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export interface ImproveRequest {
  tagline?: string;
  about_text?: string;
  business_name: string;
  category: string;
  city?: string;
}

export interface ImproveResponse {
  success: boolean;
  suggestions?: {
    tagline: {
      improved: string;
      alternatives: string[];
    };
    about_text: {
      improved: string;
      keywords: string[];
    };
  };
  error?: string;
}

export async function POST(request: NextRequest): Promise<NextResponse<ImproveResponse>> {
  try {
    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json(
        { success: false, error: 'AI service not configured' },
        { status: 500 }
      );
    }

    const body: ImproveRequest = await request.json();
    const { tagline, about_text, business_name, category, city = 'Boerne' } = body;

    if (!business_name || !category) {
      return NextResponse.json(
        { success: false, error: 'Business name and category are required' },
        { status: 400 }
      );
    }

    const prompt = `You are a professional copywriter helping local service businesses in ${city}, Texas (Hill Country area) improve their website content.

Business: ${business_name}
Category: ${category}
Location: ${city}, TX (Hill Country)

Current content to improve:
- Tagline: "${tagline || 'None provided'}"
- About text: "${about_text || 'None provided'}"

Generate improved versions following these guidelines:

TAGLINE (max 80 characters):
- Should be memorable and specific to their service
- Include local references when natural (Hill Country, Boerne, etc.)
- Focus on trust, reliability, or unique value
- Avoid generic phrases like "best in town"

ABOUT TEXT (150-400 words):
- Professional but warm tone
- Mention years of experience if implied
- Include local keywords naturally (${city}, Hill Country, Kendall County)
- Highlight trustworthiness and expertise
- End with a call to action

Respond in this exact JSON format:
{
  "tagline": {
    "improved": "The best improved tagline (max 80 chars)",
    "alternatives": ["Alternative 1", "Alternative 2"]
  },
  "about_text": {
    "improved": "The improved about text paragraph...",
    "keywords": ["keyword1", "keyword2", "keyword3"]
  }
}`;

    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.7,
      response_format: { type: 'json_object' },
      max_tokens: 1000,
    });

    const content = completion.choices[0]?.message?.content;
    if (!content) {
      throw new Error('No response from AI');
    }

    const suggestions = JSON.parse(content) as {
      tagline: {
        improved: string;
        alternatives: string[];
      };
      about_text: {
        improved: string;
        keywords: string[];
      };
    };

    // Ensure tagline doesn't exceed limit
    suggestions.tagline.improved = suggestions.tagline.improved.slice(0, 80);
    suggestions.tagline.alternatives = suggestions.tagline.alternatives.map((a) =>
      a.slice(0, 80)
    );

    return NextResponse.json({
      success: true,
      suggestions,
    });
  } catch (error) {
    console.error('Improve content error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to generate suggestions' },
      { status: 500 }
    );
  }
}
