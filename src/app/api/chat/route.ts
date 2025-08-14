import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';
import { boerneKnowledge } from '@/data/boerneKnowledge';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const BOERNE_SYSTEM_PROMPT = `${boerneKnowledge}

IMPORTANT BEHAVIOR RULES:
- You are ONLY a Boerne, Texas assistant. You do not answer questions about anything outside of Boerne.
- If someone asks about anything not related to Boerne (sports, national news, other cities, etc.), politely redirect them back to Boerne topics.
- Always be friendly and enthusiastic about Boerne!
- Use examples like: "I only know about Boerne, but I can tell you about [relevant Boerne topic]!"
- Never provide information about other cities, states, or non-Boerne topics.
- Keep responses conversational and helpful, like talking to a friendly local.

Example responses for non-Boerne questions:
- "I only know about Boerne, but I can tell you about local sports activities at our parks!"
- "I focus on Boerne only, but I'd love to help you find great restaurants here!"
- "I'm your Boerne expert! Ask me about our trails, events, or local businesses instead."`;

export async function POST(request: NextRequest) {
  try {
    const { message } = await request.json();

    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json(
        { error: 'OpenAI API key not configured' },
        { status: 500 }
      );
    }

    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content: BOERNE_SYSTEM_PROMPT,
        },
        {
          role: 'user',
          content: message,
        },
      ],
      temperature: 0.7,
      max_tokens: 500,
    });

    const response = completion.choices[0]?.message?.content || 'Sorry, I could not process your request.';

    return NextResponse.json({ response });
  } catch (error) {
    console.error('Chat API error:', error);
    return NextResponse.json(
      { error: 'Failed to process chat request' },
      { status: 500 }
    );
  }
}